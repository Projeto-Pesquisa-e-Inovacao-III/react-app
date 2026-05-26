import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../Button/Button";
import benefitStyles from "../../PackageCard/BenefitList/BenefitList.module.css";
import cardStyles from "./PlansCard.module.css";
import classNames from "classnames";
import useMobile from "../../../hooks/isMobile";
const MAX_VISIBLE_BENEFITS = 3;
const MAX_VISIBLE_BENEFITS_MOBILE = 4;

interface PlansCardProps {
  description?: string;
  content: string;
  price: string;
  benefits?: string[];
  isLoggedIn: boolean;
}

export default function PlansCard({ description, content, price, benefits, isLoggedIn }: PlansCardProps) {
  const isMobile = useMobile();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleBenefits = isExpanded
    ? (benefits ?? [])
    : (benefits ?? []).slice(0, isMobile ? MAX_VISIBLE_BENEFITS_MOBILE : MAX_VISIBLE_BENEFITS);

  const hasMore = (benefits?.length ?? 0) > MAX_VISIBLE_BENEFITS;

  return (
    <div
      className={classNames(cardStyles.card, { [cardStyles.cardExpanded]: isExpanded })}
    >
      <div className="p-5 flex flex-col justify-between h-full">
        <div>
          <div className="bg-indigo p-5 rounded-md text-white text-xl">
            {content}
            <p className="text-sm mt-3">{Number(description) > 1 ? `${description} agendamentos` : `${description} agendamento`}</p>
          </div>

          <div>
            <div className="border-gray-300 my-5">
              <p>*Pagamento único</p>
              <p className="text-3xl font-bold">{price}</p>
            </div>
            {visibleBenefits.map((benefit, index) => {
              const isLastVisible = index === visibleBenefits.length - 1;
              const shouldBlur = hasMore && !isExpanded && isLastVisible;
              return (
                <CardLine
                  key={benefit + index}
                  benefits={[benefit]}
                  className={shouldBlur ? cardStyles.benefitBlur : undefined}
                />
              );
            })}
            {hasMore && (
              <li className={benefitStyles.benefitToggle}>
                <button
                  onClick={() => setIsExpanded(prev => !prev)}
                  className={benefitStyles.benefitToggleButton}
                >
                  {isExpanded ? "Ver menos" : "Ver mais"}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                      marginLeft: "4px",
                    }}
                  >
                    <path
                      d="M2 4L6 8L10 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </li>
            )}
          </div>
        </div>

        <div className="font-bold w-3/4 flex justify-center mx-auto mt-5">
          <Button type="button" title="Adquirir pacote" onClick={() => isLoggedIn ? navigate("/packages") : navigate("/login")} />
        </div>
      </div>
    </div>
  );
}

export function CardLine({ benefits, className }: { benefits?: string[], className?: string }) {
  return (
    <div className="flex items-center border-gray-300 my-5 pb-2">
      <svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 1L6 12L1 7" stroke="#25B700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {benefits && benefits.map((benefit, index) => (
        <p className={`ml-2 w-full ${className ?? ""}`} key={benefit + index}>{benefit}</p>
      ))}
    </div>
  );
}
