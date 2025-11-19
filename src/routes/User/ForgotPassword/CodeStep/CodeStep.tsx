import { useEffect, useState } from "react";
import styles from "../ForgotPassword.module.css";

import { Lock, Mail, Phone } from "lucide-react";
import InputWithIcon from "../../../../components/Inputs/InputWithIcon/InputWithIcon";

export default function CodeStep({code, typedCode}: {code: string, typedCode: string}) {



  return (
    <>
      <div className={styles.welcomeMessage}>
        <h1>Insira o código</h1>
        <p>Enviamos um código com 6 números para o seu WhatsApp.
          Por favor, digite os números no campo abaixo para continuar. A mensagem pode levar alguns instantes para chegar.</p>
      </div>
      <div className={styles.wrapperInputsForgotPasswordPage}>
        {timer === 0 ? (
          <button className={styles.resendCodeButton}>Reenviar código</button>
        ) : (
          <p>{timer}s para reenviar código</p>
        )}
        <InputWithIcon type={"text"} placeholder={"Código de confirmação"} icon={<Lock />} onInputChange={(value: string) => setInputCode(value)}/>
      </div>
    </>
  );
}
