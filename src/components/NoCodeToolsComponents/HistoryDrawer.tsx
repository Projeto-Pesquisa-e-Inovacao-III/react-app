import { useEffect, useRef, useState } from "react";
import { X, RotateCcw, Clock, ChevronRight, ChevronLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  getNoCodeHistory,
  restoreNoCodeContent,
  type NoCodeResponse,
} from "../../services/noCodeService";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onRestore: (content: string) => void;
}

const PAGE_SIZE = 10;

export default function HistoryDrawer({
  isOpen,
  onClose,
  onRestore,
}: HistoryDrawerProps) {
  const [page, setPage] = useState(0);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<NoCodeResponse | null>(null);
  const previewTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    }
  }, [isOpen]);

  function handleMouseEnter(item: NoCodeResponse) {
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
        className="fixed top-0 right-0 h-full z-1000 flex flex-col"
        style={{
          width: "380px",
          background: "rgba(5,17,40,0.98)",
          backdropFilter: "blur(20px)",
          borderLeft: "1px solid rgba(255,255,255,0.1)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: isOpen ? "-8px 0 40px rgba(0,0,0,0.5)" : "none",
        }}
        aria-label="Histórico de versões"
      >
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

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {isLoading && (
            <div className="flex flex-col gap-2 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl animate-pulse"
                  style={{
                    height: "74px",
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
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => handleMouseEnter(item)}
                  onMouseLeave={handleMouseLeave}
                  className="relative rounded-xl px-4 py-3 flex flex-col gap-1 transition-all duration-200 cursor-default group"
                  style={{
                    background: isHovered
                      ? "rgba(12,98,145,0.18)"
                      : "rgba(255,255,255,0.04)",
                    border: `1px solid ${isHovered ? "rgba(12,98,145,0.5)" : "rgba(255,255,255,0.07)"}`,
                  }}
                >
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

                  <span className="text-white text-sm font-semibold leading-tight">
                    {item.modificationName}
                  </span>

                  {item.description && (
                    <span
                      className="text-xs leading-relaxed line-clamp-2"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      {item.description}
                    </span>
                  )}

                  <button
                    onClick={() => handleRestore(item)}
                    disabled={!!restoringId}
                    className="mt-2 self-start flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all duration-200"
                    style={{
                      background: isRestoring
                        ? "rgba(12,98,145,0.4)"
                        : "rgba(12,98,145,0.25)",
                      color: isRestoring ? "#9dc8e0" : "#5ab4d8",
                      border: "1px solid rgba(12,98,145,0.4)",
                      opacity: restoringId && !isRestoring ? 0.4 : 1,
                    }}
                  >
                    <RotateCcw size={12} className={isRestoring ? "animate-spin" : ""} />
                    {isRestoring ? "Restaurando…" : "Restaurar"}
                  </button>

                </div>
              );
            })}
        </div>

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
