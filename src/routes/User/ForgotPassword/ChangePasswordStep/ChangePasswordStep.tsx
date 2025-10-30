import { use, useEffect, useState } from "react";
import styles from "../ForgotPassword.module.css";
import { Lock, Mail, Phone } from "lucide-react";
import InputWithIcon from "../../../../components/AuthComponents/InputWithIcon/InputWithIcon";

export default function ChangePasswordStep() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <>
      <div className={styles.welcomeMessage}>
        <h1>Altere sua senha</h1>
        <p>Para prosseguir digite uma nova senha e confirme-a.</p>
      </div>
      <div className={styles.wrapperInputsForgotPasswordPage}>
        <form action="">
          <InputWithIcon type={"password"} placeholder={"Nova senha"} icon={<Lock />} isPassword={true} onInputChange={(value) => setNewPassword(value)} />
          <InputWithIcon type={"password"} placeholder={"Confirme a senha nova"} icon={<Lock />} isPassword={true} onInputChange={(value) => setConfirmPassword(value)} />
        </form>
      </div>
    </>
  );
}
