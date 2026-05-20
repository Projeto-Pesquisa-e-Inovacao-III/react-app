import { useEditor } from "@craftjs/core";
import { useState } from "react";
import { Eye, Layers, Settings2, ChevronDown, ChevronUp, Upload, FileText, Save } from "lucide-react";

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">{children}</label>;
}

function SectionHeader({ title, open, onToggle }: { title: string; open: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-4 py-3 border-b border-white/10 text-gray-200 font-semibold text-sm hover:bg-white/5 transition-colors"
    >
      {title}
      {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>
  );
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mb-4">
      <Label>{label}</Label>
      <input
        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0C6291] transition-colors"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function ImageInput({ label, onChange, onError }: { label: string; onChange: (v: string) => void, onError?: (title: string, msg: string) => void }) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        onError?.("Imagem muito grande", "A imagem deve ter no máximo 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        onChange(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-4">
      <Label>{label}</Label>
      <div className="flex flex-col gap-2">
        <label className="cursor-pointer flex justify-center items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm py-2 px-3 rounded-lg transition-colors">
          <Upload size={14} />
          Escolher Imagem do Computador
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
}

// function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
//   return (
//     <div className="mb-4">
//       <Label>{label}</Label>
//       <div className="flex items-center gap-2">
//         <input
//           type="color"
//           className="w-9 h-9 rounded cursor-pointer border border-white/20 bg-transparent"
//           value={value || '#ffffff'}
//           onChange={(e) => onChange(e.target.value)}
//         />
//         <input
//           className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0C6291] transition-colors"
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           placeholder="#ffffff"
//         />
//       </div>
//     </div>
//   );
// }

function SelectInput({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="mb-4">
      <Label>{label}</Label>
      <select
        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0C6291] transition-colors"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ backgroundColor: '#0a1f3a', color: 'white' }}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextareaInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mb-4">
      <Label>{label}</Label>
      <textarea
        rows={4}
        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0C6291] transition-colors resize-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

// main
export default function Toolbox({ onPreview, onError }: { onPreview: () => void, onError?: (title: string, msg: string) => void }) {
  const [activeTab, setActiveTab] = useState<'properties' | 'layers'>('properties');
  const [propsOpen, setPropsOpen] = useState(true);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const { selected, actions, nodes } = useEditor((state) => {
    const [id] = state.events.selected;
    if (!id) return { selected: null, nodes: state.nodes };

    const node = state.nodes[id];
    return {
      selected: {
        id,
        displayName: node.data.displayName,
        props: node.data.props,
      },
      nodes: state.nodes,
    };
  });

  function setProp(key: string, value: unknown) {
    if (!selected) return;
    // this will make craftjs save after 300ms. i think thats a good time. Wanted after user stop typing, but i just wanna finish and sleep.
    actions.history.throttle(300).setProp(selected.id, (props: Record<string, unknown>) => {
      props[key] = value;
    });
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center px-4 h-12 border-b border-white/10 bg-white/5">
        <button
          onClick={() => setActiveTab('properties')}
          className={`flex-1 h-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'properties' ? 'text-white border-b-2 border-[#0C6291]' : 'text-gray-400 hover:text-gray-200'
            }`}
        >
          <Settings2 size={14} />
          Propriedades
        </button>
        <button
          onClick={() => setActiveTab('layers')}
          className={`flex-1 h-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'layers' ? 'text-white border-b-2 border-[#0C6291]' : 'text-gray-400 hover:text-gray-200'
            }`}
        >
          <Layers size={14} />
          Camadas
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
        {activeTab === 'properties' ? (
          <div className="divide-y divide-white/5">
            {selected ? (
              <>
                <SectionHeader title={selected.displayName} open={propsOpen} onToggle={() => setPropsOpen(!propsOpen)} />
                {propsOpen && (
                  <div className="p-4">
                    {selected.displayName === 'Texto' && (
                      <>
                        <TextareaInput label="Conteúdo do Texto" value={selected.props.text ?? ''} onChange={(v) => setProp('text', v)} />
                        <SelectInput
                          label="Tag HTML"
                          value={selected.props.tag ?? 'p'}
                          onChange={(v) => setProp('tag', v)}
                          options={[
                            { value: 'h1', label: 'Título 1 (H1)' },
                            { value: 'h2', label: 'Título 2 (H2)' },
                            { value: 'h3', label: 'Título 3 (H3)' },
                            { value: 'p', label: 'Parágrafo (P)' },
                            { value: 'span', label: 'Texto Simples (SPAN)' },
                          ]}
                        />
                        {/* <ColorInput label="Cor do Texto" value={selected.props.color ?? ''} onChange={(v) => setProp('color', v)} /> */}
                      </>
                    )}

                    {selected.displayName === 'Botão' && (
                      <>
                        <TextInput label="Texto do Botão" value={selected.props.title ?? ''} onChange={(v) => setProp('title', v)} />
                        <TextInput label="Link (URL)" value={selected.props.href ?? ''} onChange={(v) => setProp('href', v)} />
                        {/* <ColorInput label="Cor de Fundo" value={selected.props.bgColor ?? ''} onChange={(v) => setProp('bgColor', v)} />
                        <ColorInput label="Cor do Texto" value={selected.props.textColor ?? ''} onChange={(v) => setProp('textColor', v)} /> */}
                      </>
                    )}

                    {selected.displayName === 'Imagem' && (
                      <>
                        <ImageInput label="Imagem (URL ou Upload)" onChange={(v) => setProp('src', v)} onError={onError} />
                        <TextInput label="Texto Alternativo (Alt)" value={selected.props.alt ?? ''} onChange={(v) => setProp('alt', v)} />
                        <TextInput label="Arredondamento (border-radius)" value={selected.props.borderRadius ?? ''} onChange={(v) => setProp('borderRadius', v)} />
                      </>
                    )}

                    {selected.displayName === 'Seção' && (
                      <>
                        {/* <ColorInput label="Cor de Fundo" value={selected.props.backgroundColor ?? ''} onChange={(v) => setProp('backgroundColor', v)} /> */}
                        <ImageInput label="Imagem de Fundo (URL ou Upload)" onChange={(v) => setProp('backgroundImage', v)} onError={onError} />
                        <TextInput label="Espaçamento Vertical" value={selected.props.paddingTop ?? ''} onChange={(v) => setProp('paddingTop', v)} />
                        <TextInput label="Espaçamento Horizontal" value={selected.props.paddingBottom ?? ''} onChange={(v) => setProp('paddingBottom', v)} />
                      </>
                    )}

                    {selected.displayName === 'Container' && (
                      <>
                        <SelectInput
                          label="Direção (Layout)"
                          value={selected.props.flexDirection ?? ''}
                          onChange={(v) => setProp('flexDirection', v)}
                          options={[
                            { value: '', label: 'Padrão (Bloco)' },
                            { value: 'row', label: 'Lado a Lado (Linha)' },
                            { value: 'col', label: 'Empilhado (Coluna)' },
                          ]}
                        />
                        <TextInput label="Espaçamento (Gap)" value={selected.props.gap ?? ''} onChange={(v) => setProp('gap', v)} />
                      </>
                    )}

                    {selected.displayName === 'Accordion' && (
                      <>
                        <TextInput label="Título da Pergunta" value={selected.props.title ?? ''} onChange={(v) => setProp('title', v)} />
                        <TextareaInput label="Conteúdo da Resposta" value={selected.props.content ?? ''} onChange={(v) => setProp('content', v)} />
                      </>
                    )}
                  </div>
                )}

                <SectionHeader title="Avançado" open={advancedOpen} onToggle={() => setAdvancedOpen(!advancedOpen)} />
                {advancedOpen && (
                  <div className="p-4">
                    <TextInput label="Classes CSS (Tailwind)" value={selected.props.className ?? ''} onChange={(v) => setProp('className', v)} />
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 text-gray-500">
                  <Settings2 size={24} />
                </div>
                <h3 className="text-white font-semibold mb-1">Nenhum elemento selecionado</h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Clique em um elemento na tela para editar suas propriedades.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4">
            <div className="space-y-1">
              {Object.entries(nodes).map(([id, node]) => (
                <button
                  key={id}
                  onClick={() => actions.selectNode(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-colors ${selected?.id === id ? 'bg-[#0C6291] text-white' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                    }`}
                >
                  <div className="w-4 flex justify-center opacity-50">
                    {node.data.displayName === 'Texto' && <FileText size={14} />}
                    {node.data.displayName === 'Botão' && <Save size={14} />}
                    {node.data.displayName === 'Imagem' && <Upload size={14} />}
                    {node.data.displayName === 'Seção' && <Layers size={14} />}
                    {node.data.displayName === 'Container' && <Settings2 size={14} />}
                  </div>
                  <span className="truncate">{node.data.displayName}</span>
                  <span className="ml-auto text-[10px] opacity-30 font-mono">{id.substring(0, 4)}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {!selected && (
        <div className="p-4 border-t border-white/10 bg-black/20">
          <button
            onClick={onPreview}
            className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <Eye size={16} />
            Visualizar Página
          </button>
        </div>
      )}
    </div>
  );
}
