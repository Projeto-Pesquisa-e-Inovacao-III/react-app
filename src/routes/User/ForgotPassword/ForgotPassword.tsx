import { useState } from "react";
import "./style.css";
import { Phone } from "lucide-react";
import InputWithIcon from "../../../components/AuthComponents/InputWithIcon/InputWithIcon";
import { useMediaQuery } from "@mui/material";
import GoBackButton from "../../../components/GoBackButton";
import Button from "../../../components/Button";
import CodeStep from "./CodeStep/CodeStep";
import ChangePasswordStep from "./ChangePasswordStep/ChangePasswordStep";
import { LogoWhiteBig } from "../../../components/LogoWhiteBig/LogoWhiteBig";

// todo: fix font family  
export default function ForgotPassword({ hasHeader }: { hasHeader: React.Dispatch<React.SetStateAction<boolean>> }) {
  hasHeader(false);
  const isMobile = useMediaQuery('(max-width: 1024px)');

  const [step, setStep] = useState<number>(1);
  const [verifyTimer, setVerifyTimer] = useState<number>(20);

  function handleStep(e: React.MouseEvent<HTMLElement>, isIncrease: boolean) {
    e.preventDefault();

    if(step != 3) {
      setStep((prevStep) => (isIncrease ? prevStep + 1 : prevStep - 1));
    }

    if(step === 3 && !isIncrease) {
      setStep(2);
    }

  }

  return (
    <>
      <div className="container-forgot-password">
        {!isMobile && (
          <div className="section-logo-forgot-password">
            <LogoWhiteBig />
          </div>
        )}
        <div className="forgot-password">
          <div onClick={step != 1 ? (e) => handleStep(e, false) : undefined}>
            <GoBackButton to={step == 1 ? '/login' : undefined} />
          </div>
          <div className={`wrapper_forgot-password_elements ${isMobile ? 'wrapper_forgot-password_elements-mobile' : ''}`}>
            {
              step === 1 && (
                <>
                  <div className="welcome_message">
                    <h1>Esqueceu a senha?</h1>
                    <p>Para continuar, digite o número do seu celular com DDD no campo abaixo. Nós vamos enviar um código de confirmação para o seu WhatsApp.</p>
                  </div>
                  <div className="wrapper-inputs-forgot-password-page">
                    <InputWithIcon type={"text"} placeholder={"00 00000-0000"} icon={<Phone />} />

                  </div>
                </>
              )
            }
            {
              step === 2 && (
                <>
                  <CodeStep actualTimer={verifyTimer} verifyTimer={setVerifyTimer} />
                </>
              )
            }
            {
              step >= 3 && (
                <>
                  <ChangePasswordStep />
                </>
              )
            }

            <div className="continue-button" onClick={(e) => handleStep(e, true)}>
              <Button type="submit" title="Continuar" />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
