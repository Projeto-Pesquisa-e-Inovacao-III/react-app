import { useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import * as userService from "../../../constants/user";
import Swal from "sweetalert2";
import InputWithIcon from "../../../components/Inputs/InputWithIcon/InputWithIcon";
import { useMediaQuery } from "@mui/material";
import GoBackButton from "../../../components/GoBackButton/GoBackButton";
import Button from "../../../components/Button/Button";
import { LogoWhiteBig } from "../../../components/LogoWhiteBig/LogoWhiteBig";
import SuccessModal from "../../../components/Modal/SuccessModal/SuccessModal";
import styles from './Login.module.css';
import useMobile from "../../../hooks/isMobile";
import { useQueryClient } from "@tanstack/react-query";

const initialLoginState = {
  email: "",
  password: ""
};


export default function Login() {
  const isMobile = useMobile();

  const [loginInfo, setLoginInfo] = useState(initialLoginState);

  const [successLogin, setSuccessLogin] = useState<boolean>(false);

  const nav = useNavigate();

  function handleAutoFill() {
    setLoginInfo({ email: "joao.silva@example.com", password: "123456789aA!" });
  }

  const queryClient = useQueryClient();
  function navToHome() {
    queryClient.invalidateQueries({ queryKey: ["isAuthenticated"] });

    nav("/home");
    setSuccessLogin(false);
    return;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    userService
      .login(loginInfo.email, loginInfo.password)
      .then(async (res) => {
        if (res.status == 200) {
          await queryClient.invalidateQueries({ queryKey: ["isAuthenticated"] });
          setSuccessLogin(true);
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
                <InputWithIcon value={loginInfo.email} type={"email"} placeholder={"seu@email.com"} onInputChange={(email: string) => setLoginInfo({ ...loginInfo, email })} icon={<Mail />} />
                <InputWithIcon value={loginInfo.password} type={"password"} isPassword={true} placeholder={"Sua senha"} onInputChange={(password: string) => setLoginInfo({ ...loginInfo, password })} icon={<Lock />} />
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