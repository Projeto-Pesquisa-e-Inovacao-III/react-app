import { useEditor } from "@craftjs/core";
import { useState } from "react";
import { Save, Eye, Layers, Settings2, ChevronDown, ChevronUp } from "lucide-react";

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
export default function Toolbox({ onSave, onPreview }: { onSave?: () => void, onPreview?: () => void }) {
  const [activeTab, setActiveTab] = useState<'properties' | 'layers'>('properties');
  const [propsOpen, setPropsOpen] = useState(true);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const { selected, actions, query, nodes } = useEditor((state) => {
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

  function renderProperties() {
    if (!selected) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <Settings2 size={28} className="text-gray-500" />
          </div>
          <p className="text-gray-400 text-sm">Selecione um elemento na tela para editar suas propriedades.</p>
        </div>
      );
    }

    const { displayName, props } = selected;

    return (
      <div>
        <div className="px-4 py-3 border-b border-white/10">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0C6291]">Elemento</span>
          <p className="text-white font-semibold text-base">{displayName}</p>
        </div>

        <div>
          <SectionHeader title="Propriedades" open={propsOpen} onToggle={() => setPropsOpen(!propsOpen)} />
          {propsOpen && (
            <div className="p-4">
              {displayName === 'Texto' && (
                <>
                  <TextareaInput
                    label="Conteúdo do Texto"
                    value={String(props.text ?? '')}
                    onChange={(v) => setProp('text', v)}
                  />
                  <SelectInput
                    label="Tipo de Tag"
                    value={props.tag ?? props.type ?? 'p'}
                    onChange={(v) => { setProp('tag', v); setProp('type', v); }}
                    options={[
                      { value: 'h1', label: 'Título 1 (H1)' },
                      { value: 'h2', label: 'Título 2 (H2)' },
                      { value: 'h3', label: 'Título 3 (H3)' },
                      { value: 'h4', label: 'Título 4 (H4)' },
                      { value: 'p', label: 'Parágrafo (P)' },
                      { value: 'span', label: 'Inline (SPAN)' },
                    ]}
                  />
                  {/* <ColorInput
                    label="Cor do Texto"
                    value={props.color ?? ''}
                    onChange={(v) => setProp('color', v)}
                  /> */}
                  <SelectInput
                    label="Tamanho da Fonte"
                    value={props.fontSize ?? ''}
                    onChange={(v) => setProp('fontSize', v)}
                    options={[
                      { value: '', label: '— padrão —' },
                      { value: '0.875rem', label: 'Pequeno (14px)' },
                      { value: '1rem', label: 'Normal (16px)' },
                      { value: '1.25rem', label: 'Médio (20px)' },
                      { value: '1.5rem', label: 'Grande (24px)' },
                      { value: '2rem', label: 'Muito Grande (32px)' },
                      { value: '3rem', label: 'Enorme (48px)' },
                      { value: '4rem', label: 'Xl (64px)' },
                      { value: '5rem', label: 'Xxl (80px)' },
                    ]}
                  />
                  <SelectInput
                    label="Peso da Fonte"
                    value={props.fontWeight ?? ''}
                    onChange={(v) => setProp('fontWeight', v)}
                    options={[
                      { value: '', label: '— padrão —' },
                      { value: '400', label: 'Normal' },
                      { value: '500', label: 'Medium' },
                      { value: '600', label: 'Semibold' },
                      { value: '700', label: 'Bold' },
                      { value: '800', label: 'Extrabold' },
                      { value: '900', label: 'Black' },
                    ]}
                  />
                </>
              )}

              {displayName === 'Botão' && (
                <>
                  <TextInput label="Texto do Botão" value={props.title ?? ''} onChange={(v) => setProp('title', v)} />
                  <TextInput label="Link (URL)" value={props.href ?? ''} onChange={(v) => setProp('href', v)} />
                  {/* <ColorInput label="Cor de Fundo" value={props.bgColor ?? ''} onChange={(v) => setProp('bgColor', v)} />
                  <ColorInput label="Cor do Texto" value={props.textColor ?? ''} onChange={(v) => setProp('textColor', v)} /> */}
                </>
              )}

              {displayName === 'Imagem' && (
                <>
                  <TextInput label="URL da Imagem" value={props.src ?? ''} onChange={(v) => setProp('src', v)} />
                  <TextInput label="Texto Alternativo (Alt)" value={props.alt ?? ''} onChange={(v) => setProp('alt', v)} />
                  <TextInput label="Arredondamento (border-radius)" value={props.borderRadius ?? ''} onChange={(v) => setProp('borderRadius', v)} />
                </>
              )}

              {displayName === 'Seção' && (
                <>
                  {/* <ColorInput label="Cor de Fundo" value={props.backgroundColor ?? ''} onChange={(v) => setProp('backgroundColor', v)} /> */}
                  <TextInput label="Imagem de Fundo (URL)" value={props.backgroundImage ?? ''} onChange={(v) => setProp('backgroundImage', v)} />
                  <TextInput label="Padding Superior" value={props.paddingTop ?? ''} onChange={(v) => setProp('paddingTop', v)} />
                  <TextInput label="Padding Inferior" value={props.paddingBottom ?? ''} onChange={(v) => setProp('paddingBottom', v)} />
                </>
              )}

              {displayName === 'Container' && (
                <>
                  <SelectInput
                    label="Direção (Layout)"
                    value={props.flexDirection ?? ''}
                    onChange={(v) => setProp('flexDirection', v)}
                    options={[
                      { value: '', label: 'Padrão (Bloco)' },
                      { value: 'row', label: 'Lado a Lado (Linha)' },
                      { value: 'col', label: 'Empilhado (Coluna)' },
                    ]}
                  />
                  <SelectInput
                    label="Alinhamento Horizontal"
                    value={props.justifyContent ?? ''}
                    onChange={(v) => setProp('justifyContent', v)}
                    options={[
                      { value: '', label: 'Padrão' },
                      { value: 'start', label: 'Início' },
                      { value: 'center', label: 'Centro' },
                      { value: 'end', label: 'Fim' },
                      { value: 'between', label: 'Espaçado' },
                    ]}
                  />
                  <SelectInput
                    label="Alinhamento Vertical"
                    value={props.alignItems ?? ''}
                    onChange={(v) => setProp('alignItems', v)}
                    options={[
                      { value: '', label: 'Padrão' },
                      { value: 'start', label: 'Topo' },
                      { value: 'center', label: 'Centro' },
                      { value: 'end', label: 'Fundo' },
                    ]}
                  />
                </>
              )}

              {!['Texto', 'Botão', 'Imagem', 'Seção', 'Container'].includes(displayName) && (
                <p className="text-gray-400 text-sm">Nenhuma propriedade editável disponível para este elemento.</p>
              )}
            </div>
          )}
        </div>

        <div>
          <SectionHeader title="Avançado" open={advancedOpen} onToggle={() => setAdvancedOpen(!advancedOpen)} />
          {advancedOpen && (
            <div className="p-4">
              <TextInput label="Classe CSS nativa (Tailwind)" value={props.className ?? ''} onChange={(v) => setProp('className', v)} />
              <div className="mb-2">
                <Label>ID do Elemento</Label>
                <p className="text-gray-500 text-xs font-mono">{selected.id}</p>
              </div>
              <button
                className="w-full mt-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg px-3 py-2 text-sm hover:bg-red-500/30 transition-colors"
                onClick={() => actions.delete(selected.id)}
              >
                Deletar Elemento
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderLayers() {
    const allNodes = Object.entries(nodes);
    const treeNodes = allNodes.filter(([, node]) => node.data.displayName !== 'ROOT');

    return (
      <div className="p-3">
        <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider font-semibold px-1">Hierarquia de Elementos</p>
        <div className="space-y-1">
          {treeNodes.map(([id, node]) => (
            <button
               key={id}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors flex items-center gap-2
                ${selected?.id === id ? 'bg-[#0C6291]/40 text-white border border-[#0C6291]/60' : 'text-gray-300 hover:bg-white/10'}`}
              onClick={() => actions.selectNode(id)}
            >
              <span className="text-[#0C6291] text-xs">▸</span>
              {node.data.displayName}
            </button>
          ))}
          {treeNodes.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">Nenhum elemento encontrado.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col text-white">
      {/* header */}
      <div className="px-4 py-4 border-b border-white/10">
        <h2 className="font-bold text-lg text-white">Painel de Controle</h2>
        <p className="text-gray-400 text-xs mt-0.5">Clique em qualquer elemento para editá-lo</p>
      </div>

      {/* tabs */}
      <div className="flex border-b border-white/10">
        <button
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors
            ${activeTab === 'properties' ? 'text-white border-b-2 border-[#0C6291]' : 'text-gray-400 hover:text-gray-200'}`}
          onClick={() => setActiveTab('properties')}
        >
          <Settings2 size={15} />
          Propriedades
        </button>
        <button
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors
            ${activeTab === 'layers' ? 'text-white border-b-2 border-[#0C6291]' : 'text-gray-400 hover:text-gray-200'}`}
          onClick={() => setActiveTab('layers')}
        >
          <Layers size={15} />
          Camadas
        </button>
      </div>

      {/* content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'properties' ? renderProperties() : renderLayers()}
      </div>

      {/* save */}
      <div className="p-4 border-t border-white/10">
        {/*
        <button
          className="w-full flex items-center justify-center gap-2 bg-[#0C6291] hover:bg-[#0a5278] text-white font-semibold py-3 rounded-xl transition-colors"
          onClick={() => {
            const json = query.serialize();
            console.log('Saved state:', json);
            onSave?.();
            alert('Estado salvo no console! (integração com backend em breve)');
          }}
        >
          <Save size={16} />
          Salvar Alterações
        </button>
        */}
        <button
          className="w-full flex items-center justify-center gap-2 mt-2 border border-white/20 text-gray-300 hover:text-white hover:border-white/50 font-semibold py-2.5 rounded-xl transition-colors text-sm"
          onClick={() => onPreview ? onPreview() : window.open('/', '_blank')}
        >
          <Eye size={15} />
          Visualizar Site
        </button>
      </div>
    </div>
  );
}