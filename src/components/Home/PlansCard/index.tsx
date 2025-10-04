interface PlansCardProps {
  title: string;
  content: string;
  price: string;
  benefits?: string[];
}

export default function PlansCard({ title, content, price, benefits }: PlansCardProps) {
  return (
    <div className="">
      <h2 className="text-white text-2xl uppercase mt-9 mb-9">{title}</h2>
      <div className="bg-white p-5 w-full h-96 max-h-10/12">
        {/* title */}
        <div className="bg-indigo p-5 rounded-md text-white text-xl">
          {content}
        </div>

        <div className="border-b-2 border-gray-300 my-5">
          <p>Preço do pacote</p>
          <p>{price}</p>
        </div>
        {benefits && benefits.map((benefit, index) => (
          <CardLine key={benefit + index} benefits={[benefit]} />
        ))}
      </div>
    </div>
  );
}

export function CardLine({ benefits }: { benefits?: string[] }) {
  return (
    <div className="flex items-center border-b-2 border-gray-300 my-5 pb-2">
      <svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 1L6 12L1 7" stroke="#25B700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      {benefits && benefits.map((benefit, index) => (
        <p className="ml-2" key={benefit + index}>{benefit}</p>
      ))}
    </div>
  );
}
