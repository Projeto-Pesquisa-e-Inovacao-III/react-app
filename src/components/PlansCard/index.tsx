export default function PlansCard({ title, content, image, price }) {
  return (
    <div >
      <h2 className="text-white text-2xl uppercase mt-9 mb-9">{title}</h2>
      <div className="bg-white p-5">
        {/* title */}
        <div className="p-5 text-white text-xl bg-blue-900">
          {content}
        </div>

        <div className="border-b-2 border-gray-300 my-5">
          <p>Preço do pacote</p>
          <p>{price}</p>
        </div>

      </div>
    </div>
  );
}
