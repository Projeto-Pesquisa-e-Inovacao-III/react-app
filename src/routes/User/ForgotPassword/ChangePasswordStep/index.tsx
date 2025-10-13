import { use, useEffect, useState } from "react";
import "../style.css";
import { Lock, Mail, Phone } from "lucide-react";
import InputWithIcon from "../../../../components/AuthComponents/InputWithIcon";

export default function ChangePasswordStep() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <>
      <div className="welcome_message">
        <h1>Altere sua senha</h1>
        <p>Lorem ipsum dolor sit amet consectetur. Amet purus donec quis ut. Ullamcorper proin a sit.</p>
      </div>
      <div className="wrapper-inputs-forgot-password-page">
        <form action="">
          <InputWithIcon type={"password"} placeholder={"Nova senha"} icon={<Lock />} isPassword={true} onInputChange={(value) => setNewPassword(value)} />
          <InputWithIcon type={"password"} placeholder={"Confirme a senha nova"} icon={<Lock />} isPassword={true} onInputChange={(value) => setConfirmPassword(value)} />
        </form>
      </div>
    </>
  );
}
