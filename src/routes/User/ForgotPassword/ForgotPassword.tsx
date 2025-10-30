import { useState } from "react";
import styles from "./ForgotPassword.module.css";
import { Phone } from "lucide-react";
import InputWithIcon from "../../../components/Inputs/InputWithIcon/InputWithIcon";
import { useMediaQuery } from "@mui/material";
import GoBackButton from "../../../components/GoBackButton/GoBackButton";
import Button from "../../../components/Button/Button";
import CodeStep from "./CodeStep/CodeStep";
import ChangePasswordStep from "./ChangePasswordStep/ChangePasswordStep";
import { LogoWhiteBig } from "../../../components/LogoWhiteBig/LogoWhiteBig";
import classNames from "classnames";
import useMobile from "../../../hooks/isMobile";

// todo: fix font family  
export default function ForgotPassword() {
      const isMobile = useMobile();
  

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
      <div className={styles.containerForgotPassword}>
        {!isMobile && (
          <div className={styles.sectionLogoForgotPassword}>
        <LogoWhiteBig />
          </div>
        )}
        <div className={styles.forgotPassword}>
          <div onClick={step != 1 ? (e) => handleStep(e, false) : undefined}>
        <GoBackButton to={step == 1 ? '/login' : undefined} />
          </div>
          <div className={classNames(styles.wrapperForgotPasswordElements, { [styles.mobile]: isMobile })}>
        {
          step === 1 && (
            <>
          <div className={styles.welcomeMessage}>
            <h1>Esqueceu a senha?</h1>
            <p>Para continuar, digite o número do seu celular com DDD no campo abaixo. Nós vamos enviar um código de confirmação para o seu WhatsApp.</p>
          </div>
          <div className={styles.wrapperInputsForgotPasswordPage}>
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

        <div className={styles.continueButton} onClick={(e) => handleStep(e, true)}>
          <Button type="submit" title="Continuar" />
        </div>

          </div>
        </div>
      </div>
    </>
  );
}
