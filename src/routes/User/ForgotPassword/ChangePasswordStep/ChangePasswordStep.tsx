import styles from "../ForgotPassword.module.css";
import { Lock } from "lucide-react";
import InputWithIcon from "../../../../components/Inputs/InputWithIcon/InputWithIcon";


type ChangePasswordStepProps = {
    setNewPassword: React.Dispatch<React.SetStateAction<string>>;
    setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
}

export default function ChangePasswordStep({ setNewPassword, setConfirmPassword }: ChangePasswordStepProps) {


  return (
    <>
      <div className={styles.welcomeMessage}>
        <h1>Altere sua senha</h1>
        <p>Para prosseguir digite uma nova senha e confirme-a.</p>
      </div>
      <div className={styles.wrapperInputsForgotPasswordPage}>
        <form action="">
          <InputWithIcon type={"password"} placeholder={"Nova senha"} icon={<Lock />} isPassword={true} onInputChange={(value: string) => setNewPassword(value)} />
          <InputWithIcon type={"password"} placeholder={"Confirme a senha nova"} icon={<Lock />} isPassword={true} onInputChange={(value: string) => setConfirmPassword(value)} />
        </form>
      </div>
    </>
  );
}
