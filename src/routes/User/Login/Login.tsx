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
import { useQuery } from "@tanstack/react-query";
import { isAuthenticated } from "../../../constants/user";


const initialLoginState = {
  email: "",
  password: ""
};


export default function Login() {
  const { data: isUserAuthenticated } = useQuery({
    queryKey: ["isAuthenticated"],
    queryFn: () => isAuthenticated(),
    retry: false,
    refetchOnWindowFocus: false,
    select: (res) => res.data,
  });

  const nav = useNavigate();

  useEffect(() => {
    if (isUserAuthenticated?.autentificado) {
      nav("/home");
    }
  }, [isUserAuthenticated]);

  const isMobile = useMobile();

  const [loginInfo, setLoginInfo] = useState(initialLoginState);

  const [loading, setLoading] = useState(false);


  function handleAutoFill(email?: string, password?: string) {
    setLoginInfo({ email: email || "joao.silva@example.com", password: password || "123456789aA!" });
  }

  function handleAutoFill2() {
    setLoginInfo({ email: "maria.oliveira@example.com", password: "123456789aA!" });
  }

  function handleAutoFill3() {
    setLoginInfo({ email: "fabio.admin@email.com", password: "admin123" });
  }


  function navToHome() {
    nav("/home");
    return;
  }

  async function navToAnamnesis() {
    const isAuthenticated = await userService.isAuthenticated();
    const ativoAnamnese: boolean = isAuthenticated.data.ativoAnamnese;
    if (ativoAnamnese === false) {
      nav("/anamnesis");
      return;
    }
  }

  useEffect(() => {
    try {
      navToAnamnesis();

    } catch (err) {

    }

  }, [nav]);

  async function handleSubmit(e?: React.FormEvent | React.KeyboardEvent | KeyboardEvent) {
    e?.preventDefault();
    setLoading(true);

    try {
      const res = await userService.login(loginInfo.email, loginInfo.password);

      if (res.status === 200) {
        try {
          await navToAnamnesis();
        } catch {
          navToHome();
          return;
        }

        nav("/home");

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
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "[") {
        handleAutoFill();
      }

      if (e.key === "]") {
        handleAutoFill3();
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
            <form onSubmit={handleSubmit} onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(e) }}>
              {import.meta.env.DEV && (
                <>
                  <button type="button" className={styles.btnAutoFill} onClick={() => handleAutoFill("joao.silva@example.com", "123456789aA!")}>
                    AUTO PREENCHER
                  </button>
                  <button type="button" className={styles.btnAutoFill} onClick={handleAutoFill2}>
                    AUTO PREENCHER 2
                  </button>
                  <button type="button" className={styles.btnAutoFill} onClick={handleAutoFill3}>
                    AUTO PREENCHER DONO
                  </button>
                </>
              )}
              <div className={styles.wrapperInputsLoginPage}>
                <InputWithIcon value={loginInfo.email} type={"email"} placeholder={"seu@email.com"} onInputChange={(email: string) => setLoginInfo({ ...loginInfo, email })} icon={<Mail />} />
                <InputWithIcon value={loginInfo.password} type={"password"} isPassword={true} placeholder={"Sua senha"} onInputChange={(password: string) => setLoginInfo({ ...loginInfo, password })} icon={<Lock />} />
              </div>
              {/*todo: temp!!!! */}
              <input hidden type="text" onKeyDown={(e) => {
                if (e.key === "[") {
                  handleAutoFill();
                }

                if (e.key === "]") {
                  handleAutoFill3();
                }

              }} />


              <div className={styles.configLogin}>
                <Link to="/forgot-password">Esqueceu sua senha?</Link>
              </div>
              <Button type="submit" title="Entrar" loading={loading} classNameDiv={styles.btnDiv} classNameVariable={styles.btnLogin} />
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