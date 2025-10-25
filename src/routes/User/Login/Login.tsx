import { useEffect, useState } from "react";
import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import * as userService from "../../../constants/user";
import Swal from "sweetalert2";
import InputWithIcon from "../../../components/AuthComponents/InputWithIcon/InputWithIcon";
import { useMediaQuery } from "@mui/material";
import GoBackButton from "../../../components/GoBackButton";
import Button from "../../../components/Button";
import { LogoWhiteBig } from "../../../components/LogoWhiteBig/LogoWhiteBig";

// todo: fix font family  
export default function Login({ hasHeader }: { hasHeader: React.Dispatch<React.SetStateAction<boolean>> }) {
  hasHeader(false);
  const isMobile = useMediaQuery('(max-width: 1024px)');

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const nav = useNavigate()

  function handleAutoFill() {
    console.log("autofill")
    setEmail("joao.silva@example.com");
    setPassword("123456789aA!");
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Handle login logic here
    userService
      .login(email, password)
      .then((res) => {
        console.log(res)
        const isUserActive = res.data.ativo;
        if (isUserActive) {
          Swal.fire({
            icon: "success",
            title: "Login bem sucedido",
            showConfirmButton: false,
            timer: 3000,
            allowOutsideClick: false,
            allowEscapeKey: false
          });
          localStorage.setItem("user-info", JSON.stringify(res.data))
          setTimeout(() => {
            nav("/")
          }, 3000)
        } else {
          return Promise.reject(new Error("Usuário inativo"))
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
    <div className="container-login">
      {!isMobile && (
        <div className="section-logo-login">
          <LogoWhiteBig />
        </div>
      )}
      <div className="login">
        <GoBackButton to="/" />
        <div className="wrapper_login_elements">
          <div className="welcome_message">
            <h1>Bem-vindo</h1>
            <button className="border-2" onClick={handleAutoFill}>Auto preencher</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="wrapper-inputs-login-page">
              <InputWithIcon value={email} type={"email"} placeholder={"seu@email.com"} onInputChange={setEmail} icon={<Mail />} />
              <InputWithIcon value={password} type={"password"} isPassword={true} placeholder={"Sua senha"} onInputChange={setPassword} icon={<Lock />} />

            </div>
            <div className="config_login">
              <Link to="/forgot-password">Esqueceu sua senha?</Link>
            </div>
            <Button type="submit" title="Entrar" />

          </form>
          <span className="mg-15">
            Não tem uma conta? <Link to="/register">Criar uma conta</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
