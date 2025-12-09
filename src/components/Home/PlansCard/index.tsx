import { useNavigate } from "react-router-dom";
import Button from "../../Button/Button";

interface PlansCardProps {
  description?: string;
  content: string;
  price: string;
  benefits?: string[];
  isLoggedIn: boolean;
}

export default function PlansCard({ description, content, price, benefits, isLoggedIn }: PlansCardProps) {

  const navigate = useNavigate();

  return (
    <div className="h-full">
      <div className="rounded-lg shadow-2xl bg-white p-5 w-full xl h-full flex flex-col justify-between min-h-4/5">
        <div >
          <div className="bg-indigo p-5 rounded-md text-white text-xl">
            {content}
            <p className="text-sm mt-3">{description}</p>
          </div>

          <div className="">
            <div className="border-gray-300 my-5">
              <p>*Pagamento único</p>
              <p className="text-3xl font-bold">{price}</p>
            </div>
            {benefits && benefits.map((benefit, index) => (
              <CardLine key={benefit + index} benefits={[benefit]} />
            ))}
          </div>
        </div>

        <div className="font-bold w-3/4 flex justify-center mx-auto mt-5">
          <Button type="button" title="Ver detalhes" onClick={() => isLoggedIn ? navigate("/packages") : navigate("/login")} />
        </div>
      </div>

    </div>
  );
}

export function CardLine({ benefits }: { benefits?: string[] }) {
  return (
    <div className="flex items-center  border-gray-300 my-5 pb-2">
      <svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 1L6 12L1 7" stroke="#25B700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      {benefits && benefits.map((benefit, index) => (
        <p className="ml-2 w-full" key={benefit + index}>{benefit}</p>
      ))}

    </div>
  );
}
