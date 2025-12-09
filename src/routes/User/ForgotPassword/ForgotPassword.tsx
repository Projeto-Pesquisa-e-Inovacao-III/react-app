import { useEffect, useState } from "react";
import styles from "./ForgotPassword.module.css";
import { Lock, Phone } from "lucide-react";
import InputWithIcon from "../../../components/Inputs/InputWithIcon/InputWithIcon";
import GoBackButton from "../../../components/GoBackButton/GoBackButton";
import Button from "../../../components/Button/Button";
import CodeStep from "./CodeStep/CodeStep";
import ChangePasswordStep from "./ChangePasswordStep/ChangePasswordStep";
import { LogoWhiteBig } from "../../../components/LogoWhiteBig/LogoWhiteBig";
import classNames from "classnames";
import useMobile from "../../../hooks/isMobile";
import { sendResetCode, verifyCode } from "../../../constants/user";
import { cellphoneMask } from "../../../utils/mascara";

// todo: fix font family  
export default function ForgotPassword() {
  const isMobile = useMobile();

  const [inputCode, setInputCode] = useState<string>("");

  const [step, setStep] = useState<number>(1);

  async function handleStep(e: React.MouseEvent<HTMLElement>, isIncrease: boolean) {
    e.preventDefault();

    if (step === 1 && isIncrease) {
      const isCodeSent: boolean = await handleSendCode();
      if (!isCodeSent) return;
      setStep(2);

      return;
    }

    if (step === 2 && isIncrease) {
      const isCodeCorrect: boolean = await handleVerifyCode(inputCode);
      if (!isCodeCorrect) return;
      setStep(3);
    }

    if (step != 3) {
      setStep((prevStep) => (isIncrease ? prevStep + 1 : prevStep - 1));
    }

    if (step === 3 && !isIncrease) {
      setStep(2);
    }

  }

  const [timer, setTimer] = useState<number>(20);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [phoneNumber, setPhoneNumber] = useState<string>("");
  async function handleSendCode(): Promise<boolean> {
    setIsLoading(true);
    try {
      // const response = await sendResetCode(phoneNumber.trim().replace(/[\s()-]/g, ''));
      const response = await sendResetCode(phoneNumber.trim().replace(/[\s()-]/g, ''));

      console.log("Código enviado com sucesso:", response.data);
      setTimer(20);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Erro ao enviar o código:", error);
      setIsLoading(false);
      return false;
    }
  }

  async function handleVerifyCode(inputedCode: string): Promise<boolean> {
    setIsLoading(true);
    try {
      const response = await verifyCode(phoneNumber.trim().replace(/[\s()-]/g, ''), inputedCode)
      console.log("Código verificado com sucesso:", response.data);

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Erro ao verificar o código:", error);
      setIsLoading(false);
      return false;
    }
  }

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [timer]);

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
            <GoBackButton to={step == 1 ? '/login' : (e) => handleStep(e, true)} />
          </div>
          <div className={classNames(styles.wrapperForgotPasswordElements, { [styles.wrapperForgotPasswordElementsMobile]: isMobile })}>
            {
              step === 1 && (
                <>
                  <div className={classNames(styles.welcomeMessage)}>
                    <h1>Esqueceu a senha?</h1>
                    <p>Para continuar, digite o número do seu celular com DDD no campo abaixo. Nós vamos enviar um código de confirmação para o seu WhatsApp.</p>
                  </div>
                  <div className={styles.wrapperInputsForgotPasswordPage}>
                    <InputWithIcon type={"text"} placeholder={"00 00000-0000"} icon={<Phone />} onInputChange={(value: string) => setPhoneNumber(value)} mask={cellphoneMask} />

                  </div>
                </>
              )
            }
            {
              step === 2 && (
                <>
                  <div className={styles.welcomeMessage}>
                    <h1>Insira o código</h1>
                    <p>Enviamos um código com 6 números para o seu WhatsApp.
                      Por favor, digite os números no campo abaixo para continuar. A mensagem pode levar alguns instantes para chegar.</p>
                  </div>
                  <div className={styles.wrapperInputsForgotPasswordPage}>
                    {timer === 0 ? (
                      <button className={styles.resendCodeButton} onClick={handleSendCode}>Reenviar código</button>
                    ) : (
                      <p>{timer}s para reenviar código</p>
                    )}
                    <InputWithIcon type={"text"} placeholder={"Código de confirmação"} icon={<Lock />} onInputChange={(value: string) => setInputCode(value)} />
                  </div>
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
              {isLoading ? (
                <div className={styles.loader}></div>
              ) : (
                <Button type="submit" title="Continuar" />
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
