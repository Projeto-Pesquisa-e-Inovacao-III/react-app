import { useReducer, useState } from "react";
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
import useMobile from "../../../hooks/isMobile";

const initialLoginState = {
  email: "",
  password: ""
};


function reducer(state: any, action: any) {
  switch (action.type) {
    case 'setEmail':
      return { ...state, email: action.payload };
    case 'setPassword':
      return { ...state, password: action.payload };
    default:
      return state;
  }
}

export default function Login() {
  const isMobile = useMobile();
  
 
  const [login, dispatch] = useReducer(reducer, initialLoginState);

  const [successLogin, setSuccessLogin] = useState<boolean>(false);

  const nav = useNavigate();

  function handleAutoFill() {
    dispatch({ type: 'setEmail', payload: "joao.silva@example.com" });
    dispatch({ type: 'setPassword', payload: "123456789aA!" });
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
      .login(login.email, login.password)
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
                <InputWithIcon value={login.email} type={"email"} placeholder={"seu@email.com"} onInputChange={(email: string) => dispatch({ type: 'setEmail', payload: email })} icon={<Mail />} />
                <InputWithIcon value={login.password} type={"password"} isPassword={true} placeholder={"Sua senha"} onInputChange={(password: string) => dispatch({ type: 'setPassword', payload: password })} icon={<Lock />} />
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