import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import * as userService from "../../../constants/user";
import Swal from "sweetalert2";
import InputWithIcon from "../../../components/AuthComponents/InputWithIcon/InputWithIcon";
import { useMediaQuery } from "@mui/material";
import GoBackButton from "../../../components/GoBackButton/GoBackButton";
import Button from "../../../components/Button/Button";
import { LogoWhiteBig } from "../../../components/LogoWhiteBig/LogoWhiteBig";
import SuccessModal from "../../../components/Modal/SuccessModal/SuccessModal";
import styles from './Login.module.css';

export default function Login() {
  const isMobile = useMediaQuery('(max-width: 1024px)');

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [successLogin, setSuccessLogin] = useState<boolean>(false);

  const nav = useNavigate();

  function handleAutoFill() {
    setEmail("joao.silva@example.com");
    setPassword("123456789aA!");
  }

  function navToHome() {
    nav("/home");
    setSuccessLogin(false);
    return;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Handle login logic here
    userService
      .login(email, password)
      .then((res) => {
        if (res.status == 200) {
          setSuccessLogin(true);

          setTimeout(() => {
            if (successLogin) {
              nav("/home")
            }
          }, 4000)
        }

      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Email/senha incorreto",
          showConfirmButton: true,
          confirmButtonColor: "#166ba3ff",
          timer: 3000,
        });
        console.log(err)
      });
  }

  // ... (add this import at the top of the file)

  return (
    <>
      <div className={styles.containerLogin}>
        {!isMobile && (
          <div className={styles.sectionLogoLogin}>
            <LogoWhiteBig />
          </div>
        )}
        <div className={styles.login}>
          <GoBackButton to="/" />
          <div className={styles.wrapperLoginElements}>
            <div className={styles.welcomeMessage}>
              <h1>Bem-vindo</h1>
              <button className="border-2" onClick={handleAutoFill}>Auto preencher</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className={styles.wrapperInputsLoginPage}>
                <InputWithIcon value={email} type={"email"} placeholder={"seu@email.com"} onInputChange={setEmail} icon={<Mail />} />
                <InputWithIcon value={password} type={"password"} isPassword={true} placeholder={"Sua senha"} onInputChange={setPassword} icon={<Lock />} />
              </div>
              <div className={styles.configLogin}>
                <Link to="/forgot-password">Esqueceu sua senha?</Link>
              </div>
              <Button type="submit" title="Entrar" />
            </form>
            <span className={styles.mg15}>
              Não tem uma conta? <Link to="/register">Criar uma conta</Link>
            </span>
          </div>
        </div>
      </div>

      {successLogin && (
        <SuccessModal
          isMobile={isMobile}
          title="Login bem-sucedido"
          content="Você foi logado com sucesso!"
          closeThen={navToHome}
        />
      )}
    </>
  );
}
