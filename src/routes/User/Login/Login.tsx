import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import * as userService from "../../../constants/user";
import Swal from "sweetalert2";
import InputWithIcon from "../../../components/Inputs/InputWithIcon/InputWithIcon";
import GoBackButton from "../../../components/GoBackButton/GoBackButton";
import Button from "../../../components/Button/Button";
import { LogoWhiteBig } from "../../../components/LogoWhiteBig/LogoWhiteBig";
import styles from './Login.module.css';
import useMobile from "../../../hooks/isMobile";

const initialLoginState = {
  email: "",
  password: ""
};


export default function Login() {
  const isMobile = useMobile();

  const [loginInfo, setLoginInfo] = useState(initialLoginState);

  const nav = useNavigate();

  function handleAutoFill(email?: string, password?: string) {
    setLoginInfo({ email: email || "joao.silva@example.com", password: password || "123456789aA!" });
  }

  function navToHome() {
    nav("/home");
    return;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await userService.login(loginInfo.email, loginInfo.password);

      if (res.status === 200) {
        navToHome();
      }
    } catch (err) {
      console.error("Login error:", err);
      Swal.fire({
        icon: "error",
        title: "Email/senha incorreto",
        showConfirmButton: true,
        confirmButtonColor: "#166ba3ff",
        timer: 3000,
      });
    } 
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "[") {
        console.log("Auto-filling login credentials");
        handleAutoFill("EdsonArantes@email.com", "fmc123456");
      }
      if (e.key === "]") {
        console.log("Auto-filling login credentials");
        handleAutoFill("rodolfo.abrantes@personal.com", "fmc123456");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
            </div>
            <form onSubmit={handleSubmit}>
              <div className={styles.wrapperInputsLoginPage}>
                <InputWithIcon value={loginInfo.email} type={"email"} placeholder={"seu@email.com"} onInputChange={(email: string) => setLoginInfo({ ...loginInfo, email })} icon={<Mail />} />
                <InputWithIcon value={loginInfo.password} type={"password"} isPassword={true} placeholder={"Sua senha"} onInputChange={(password: string) => setLoginInfo({ ...loginInfo, password })} icon={<Lock />} />
              </div>
              {/*todo: temp!!!! */}
              <input hidden type="text" onKeyDown={(e) => {
                if (e.key === "[") {
                  handleAutoFill("EdsonArantes@email.com", "fmc123456");
                }

                if (e.key === "]") {
                  handleAutoFill("EdsonArantes@email.com", "fmc123456");
                }

              }} />
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
    </>
  );
}