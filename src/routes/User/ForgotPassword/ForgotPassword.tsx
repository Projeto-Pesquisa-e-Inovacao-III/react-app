import { useEffect, useState } from "react";
import styles from "./ForgotPassword.module.css";
import { Lock, Phone } from "lucide-react";
import InputWithIcon from "../../../components/Inputs/InputWithIcon/InputWithIcon";
import GoBackButton from "../../../components/GoBackButton/GoBackButton";
import Button from "../../../components/Button/Button";
import ChangePasswordStep from "./ChangePasswordStep/ChangePasswordStep";
import { LogoWhiteBig } from "../../../components/LogoWhiteBig/LogoWhiteBig";
import classNames from "classnames";
import useMobile from "../../../hooks/isMobile";
import { forgotPassword, sendResetCode, verifyCode } from "../../../constants/user";
import { cellphoneMask } from "../../../utils/mascara";
import { validatePassword } from "../../../utils/validacao";
import ErrorModal from "../../../components/Modal/ErrorModal/ErrorModal";
import SuccessModal from "../../../components/Modal/SuccessModal/SuccessModal";
import { useNavigate } from "react-router-dom";

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
      return;
    }

    if (step === 3 && isIncrease) {
      updatePassword();
      return;
    }

    if (step === 3 && !isIncrease) {
      setStep(2);
      return;
    }

    if (step === 2 && !isIncrease) {
      setStep(1);
      return;
    }
  }

  const [timer, setTimer] = useState<number>(20);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const [tokenSent, setTokenSent] = useState<string>("");

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
      setTokenSent(response.data.token);

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


  const [openModal, setOpenModal] = useState<"success" | "error" | null>(null);
  const [textModal, setTextModal] = useState<{ title: string; content: string }>({ title: "", content: "" });

  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  function validatePasswordMatch() {
    return newPassword === confirmPassword;
  }

  function updatePassword() {
    const newP = confirmPassword ?? "";
    setIsLoading(true);

    if (!validatePasswordMatch()) {
      setIsLoading(false);
      setTextModal({ title: "Houve um erro", content: "As senhas não coincidem." });
      setOpenModal("error");
      return;
    }

    if (!newP) {
      setIsLoading(false);
      setTextModal({ title: "Houve um erro", content: "Preencha a nova senha." });
      setOpenModal("error");
      return;
    }

    const validation = validatePassword(newP);
    if (validation !== "password válida!") {
      setIsLoading(false);
      setTextModal({ title: "Houve um erro", content: "Senha inválida. A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais." });
      setOpenModal("error");
      return;
    }
    forgotPassword(phoneNumber.trim().replace(/[\s()-]/g, ''), newP, tokenSent)
      .then(() => {
        setNewPassword("");
        setConfirmPassword("")
        console.log("Senha atualizada com sucesso");
        setIsLoading(false);
        setTextModal({ title: "Senha atualizada", content: "Sua senha foi atualizada com sucesso." });
        setOpenModal("success");
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Erro ao atualizar senha:", error);
        setTextModal({ title: "Houve um erro", content: error.response?.data?.Exception || "Não foi possível atualizar sua senha." });
        setOpenModal("error");
      });
  }

  const navigate = useNavigate();

  return (
    <>
      <div className={styles.containerForgotPassword}>
        {!isMobile && (
          <div className={styles.sectionLogoForgotPassword}>
            <LogoWhiteBig />
          </div>
        )}
        <div className={styles.forgotPassword}>
          <div onClick={step != 1 ? (e: React.MouseEvent<HTMLElement>) => handleStep(e, false) : undefined}>
            <GoBackButton to={step == 1 ? '/login' : undefined} />
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
                  <ChangePasswordStep setNewPassword={setNewPassword} setConfirmPassword={setConfirmPassword} />
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

      {openModal === "error" && <ErrorModal title={textModal.title} content={textModal.content} closeThen={() => setOpenModal(null)} />}
      {openModal === "success" && <SuccessModal isMobile={isMobile} title={textModal.title} content={textModal.content} closeThen={() => navigate("/login")} />}

    </>
  );
}
