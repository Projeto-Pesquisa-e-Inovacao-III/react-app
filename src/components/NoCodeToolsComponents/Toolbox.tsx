import { useEditor } from "@craftjs/core";

export default function Toolbox() {
  const { selected, actions } = useEditor((state) => {
    const [id] = state.events.selected;

    if (!id) return { selected: null };

    const node = state.nodes[id];
    if (node.data.displayName !== "Text") return { selected: null };

    return {
      selected: {
        id,
        text: node.data.props.text
      }
    };
  });

  return (
    <div className="h-full text-gray-300"
    >
      <h2 className="border-b-2 border-gray-400 p-4 text-2xl">Painel de controle</h2>
      {selected && (
        <div className="p-6">
          <div>
            <label className="block text-xl">Texto</label>
            <p className="mb-5 text-base text-gray-400  border-b-2 pb-2">Elemento selecionado</p>
          </div>

          <label className="block text-xl mb-2">Editar Texto:</label>
          <input
            className="border rounded-lg p-2.5 w-full text-xl bg-indigo"
            value={selected && selected.text}
            onChange={(e) => {
              actions.setProp(selected.id, (props: any) => {
                props.text = e.target.value;
              });
            }}
          />
        </div>
      )}
    </div>
  );
}