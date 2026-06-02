import { useEffect, useRef, useState } from "react";
import {
  X,
  RotateCcw,
  Clock,
  ChevronRight,
  ChevronLeft,
  Pencil,
  Trash2,
  Check,
  AlertTriangle,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNoCodeHistory,
  restoreNoCodeContent,
  deleteNoCodeContent,
  renameNoCodeContent,
  type NoCodeResponse,
} from "../../services/noCodeService";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onRestore: (content: string) => void;
  onDelete?: (id: string) => void;
}

const PAGE_SIZE = 10;

export default function HistoryDrawer({
  isOpen,
  onClose,
  onRestore,
  onDelete,
}: HistoryDrawerProps) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<NoCodeResponse | null>(null);
  const previewTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Rename state
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [renameSaving, setRenameSaving] = useState(false);
  const renameInputRef = useRef<HTMLInputElement>(null);

  // Delete state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["noCodeHistory", page],
    queryFn: () => getNoCodeHistory(page, PAGE_SIZE),
    enabled: isOpen,
    refetchOnWindowFocus: false,
  });

  const totalPages = data?.page?.totalPages ?? 1;
  const items = data?.content ?? [];

  useEffect(() => {
    if (!isOpen) {
      setPreviewItem(null);
      setRenamingId(null);
      setDeleteConfirmId(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  function handleMouseEnter(item: NoCodeResponse) {
    if (renamingId || deleteConfirmId) return;
    if (previewTimeout.current) clearTimeout(previewTimeout.current);
    previewTimeout.current = setTimeout(() => setPreviewItem(item), 400);
  }

  function handleMouseLeave() {
    if (previewTimeout.current) clearTimeout(previewTimeout.current);
    setPreviewItem(null);
  }

  async function handleRestore(item: NoCodeResponse) {
    setRestoringId(item.id);
    try {
      const restored = await restoreNoCodeContent(item.id);
      onRestore(restored.content);
      onClose();
    } finally {
      setRestoringId(null);
    }
  }

  function startRename(item: NoCodeResponse) {
    setDeleteConfirmId(null);
    setRenamingId(item.id);
    setRenameValue(item.modificationName);
  }

  async function confirmRename(id: string) {
    const trimmed = renameValue.trim();
    if (!trimmed) return;
    setRenameSaving(true);
    try {
      await renameNoCodeContent(id, trimmed);
      await queryClient.invalidateQueries({ queryKey: ["noCodeHistory"] });
    } finally {
      setRenameSaving(false);
      setRenamingId(null);
    }
  }

  function cancelRename() {
    setRenamingId(null);
  }

  function startDeleteConfirm(id: string) {
    setRenamingId(null);
    setDeleteConfirmId(id);
  }

  async function confirmDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteNoCodeContent(id);
      await queryClient.invalidateQueries({ queryKey: ["noCodeHistory"] });
      onDelete?.(id);
      window.location.reload();
    } finally {
      setDeletingId(null);
      setDeleteConfirmId(null);
    }
  }

  const isBusy = !!restoringId || !!renameSaving || !!deletingId;

  return (
    <>
      <div
        className="overlay fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: "rgba(0,0,0,0.45)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          backdropFilter: "blur(2px)",
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="fixed top-0 right-0 h-full z-[1000] flex flex-col"
        style={{
          width: "400px",
          background: "rgba(5,17,40,0.98)",
          backdropFilter: "blur(20px)",
          borderLeft: "1px solid rgba(255,255,255,0.1)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: isOpen ? "-8px 0 40px rgba(0,0,0,0.5)" : "none",
        }}
        aria-label="Histórico de versões"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[#0C6291]" />
            <span className="text-white font-semibold text-base">
              Histórico de versões
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors rounded-lg p-1 hover:bg-white/10"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {isLoading && (
            <div className="flex flex-col gap-2 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl animate-pulse"
                  style={{
                    height: "88px",
                    background: "rgba(255,255,255,0.06)",
                  }}
                />
              ))}
            </div>
          )}

          {isError && (
            <p className="text-red-400 text-sm text-center mt-8">
              Erro ao carregar o histórico. Tente novamente.
            </p>
          )}

          {!isLoading && !isError && items.length === 0 && (
            <p className="text-gray-500 text-sm text-center mt-10">
              Nenhuma versão publicada ainda.
            </p>
          )}

          {!isLoading &&
            items.map((item) => {
              const isRestoring = restoringId === item.id;
              const isHovered = previewItem?.id === item.id;
              const isRenaming = renamingId === item.id;
              const isConfirmingDelete = deleteConfirmId === item.id;
              const isDeleting = deletingId === item.id;

              return (
                <div
                  key={item.id}
                  onMouseEnter={() => handleMouseEnter(item)}
                  onMouseLeave={handleMouseLeave}
                  className="relative rounded-xl px-4 py-3 flex flex-col gap-1.5 transition-all duration-200 cursor-default group"
                  style={{
                    background:
                      isConfirmingDelete
                        ? "rgba(239,68,68,0.08)"
                        : isHovered
                          ? "rgba(12,98,145,0.18)"
                          : "rgba(255,255,255,0.04)",
                    border: `1px solid ${isConfirmingDelete
                        ? "rgba(239,68,68,0.35)"
                        : isHovered
                          ? "rgba(12,98,145,0.5)"
                          : "rgba(255,255,255,0.07)"
                      }`,
                  }}
                >
                  {/* Date + action icons row */}
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-mono"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      {format(
                        parseISO(item.createdAt),
                        "dd/MM/yyyy 'às' HH:mm",
                        { locale: ptBR }
                      )}
                    </span>

                    {/* Action icons — shown on hover, hidden when confirming delete */}
                    {!isConfirmingDelete && !isRenaming && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        {/* Rename */}
                        <button
                          title="Renomear"
                          disabled={isBusy}
                          onClick={() => startRename(item)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        {/* Delete */}
                        <button
                          title="Apagar"
                          disabled={isBusy}
                          onClick={() => startDeleteConfirm(item.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Name — editable or static */}
                  {isRenaming ? (
                    <div className="flex items-center gap-2">
                      <input
                        ref={renameInputRef}
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") confirmRename(item.id);
                          if (e.key === "Escape") cancelRename();
                        }}
                        disabled={renameSaving}
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-sm text-white outline-none focus:border-[#0C6291] transition-colors"
                        placeholder="Nome da versão"
                        maxLength={80}
                      />
                      <button
                        title="Confirmar"
                        disabled={renameSaving || !renameValue.trim()}
                        onClick={() => confirmRename(item.id)}
                        className="p-1.5 rounded-lg text-green-400 hover:bg-green-500/10 disabled:opacity-30 transition-colors"
                      >
                        {renameSaving ? (
                          <RotateCcw size={13} className="animate-spin" />
                        ) : (
                          <Check size={13} />
                        )}
                      </button>
                      <button
                        title="Cancelar"
                        onClick={cancelRename}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-white text-sm font-semibold leading-tight">
                      {item.modificationName}
                    </span>
                  )}

                  {/* Badge restored */}
                  {item.restoredFromId && (
                    <span
                      className="self-start text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: "rgba(234,179,8,0.15)",
                        color: "#facc15",
                        border: "1px solid rgba(234,179,8,0.3)",
                      }}
                    >
                      Restauração
                    </span>
                  )}

                  {/* Description */}
                  {item.description && !isConfirmingDelete && (
                    <span
                      className="text-xs leading-relaxed line-clamp-2"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      {item.description}
                    </span>
                  )}

                  {/* Delete confirmation banner */}
                  {isConfirmingDelete && (
                    <div className="flex flex-col gap-2 mt-1">
                      <div className="flex items-center gap-1.5 text-red-400 text-xs font-medium">
                        <AlertTriangle size={12} />
                        Apagar esta versão permanentemente?
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => confirmDelete(item.id)}
                          disabled={isDeleting}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all duration-200"
                          style={{
                            background: "rgba(239,68,68,0.25)",
                            color: "#f87171",
                            border: "1px solid rgba(239,68,68,0.4)",
                            opacity: isDeleting ? 0.6 : 1,
                          }}
                        >
                          {isDeleting ? (
                            <RotateCcw size={11} className="animate-spin" />
                          ) : (
                            <Trash2 size={11} />
                          )}
                          {isDeleting ? "Apagando…" : "Confirmar"}
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          disabled={isDeleting}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all duration-200"
                          style={{
                            background: "rgba(255,255,255,0.06)",
                            color: "rgba(255,255,255,0.6)",
                            border: "1px solid rgba(255,255,255,0.12)",
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Restore button — hidden when confirming delete or renaming */}
                  {!isConfirmingDelete && !isRenaming && (
                    <button
                      onClick={() => handleRestore(item)}
                      disabled={isBusy}
                      className="mt-1 self-start flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all duration-200"
                      style={{
                        background: isRestoring
                          ? "rgba(12,98,145,0.4)"
                          : "rgba(12,98,145,0.25)",
                        color: isRestoring ? "#9dc8e0" : "#5ab4d8",
                        border: "1px solid rgba(12,98,145,0.4)",
                        opacity: isBusy && !isRestoring ? 0.4 : 1,
                      }}
                    >
                      <RotateCcw
                        size={12}
                        className={isRestoring ? "animate-spin" : ""}
                      />
                      {isRestoring ? "Restaurando…" : "Restaurar"}
                    </button>
                  )}
                </div>
              );
            })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="flex items-center justify-between px-5 py-3 flex-shrink-0"
            style={{ borderTop: "1px solid #ffffff14" }}
          >
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} /> Anterior
            </button>
            <span className="text-xs text-gray-500">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Próxima <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
