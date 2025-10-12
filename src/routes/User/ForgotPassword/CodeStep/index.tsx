import { useEffect, useState } from "react";
import "../style.css";
import { Lock, Mail, Phone } from "lucide-react";
import InputWithIcon from "../../../../components/AuthComponents/InputWithIcon";

export default function CodeStep({actualTimer, verifyTimer}: {actualTimer: number, verifyTimer: React.Dispatch<React.SetStateAction<number>>}) {
  const [timer, setTimer] = useState<number>(actualTimer);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
        verifyTimer(timer - 1);
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [timer]);

  return (
    <>
      <div className="welcome_message">
        <h1>Insira o código</h1>
        <p>Enviamos um código com 6 números para o seu WhatsApp.
          Por favor, digite os números no campo abaixo para continuar. A mensagem pode levar alguns instantes para chegar.</p>
      </div>
      <div className="wrapper-inputs-forgot-password-page">
        {timer === 0 ? (
          <button className="resend-code-button">Reenviar código</button>
        ) : (
          <p>{timer}s para reenviar código</p>
        )}
        <InputWithIcon type={"text"} placeholder={"Código de confirmação"} icon={<Lock />} />
      </div>
    </>
  );
}
