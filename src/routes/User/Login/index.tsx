import { useState } from "react";
import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import * as userService from "../../../constants/user";
import Swal from "sweetalert2";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [remember, setRemember] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const nav = useNavigate()

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
    <div className="login">
      <div className="wrapper_login_elements">
        <div className="welcome_message">
          <h1>Bem-vindo de volta</h1>
          <p>Entre na sua conta para acessar nossa plataforma</p>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="mg-15">Email</label>
          <div className="wrapper_inp">
            <Mail className="mail-icon" />
            <input
              type="email"
              name="email"
              placeholder="seu@email.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <label>Senha</label>
          <div className="wrapper_inp">
            <Lock className="lock-icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="sua senha"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          {/* <div className="config_login">
            <label>
              <input
                type="checkbox"
                name="remember"
                id="remember"
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Lembrar-me</span>
            </label>

            <Link to="/forgot-password">Esqueceu sua senha?</Link>
          </div> */}
          <button className="mg-15" type="submit">Entrar na conta</button>
        </form>
        <span className="mg-15">
          Não tem uma conta? <Link to="/register">Criar uma conta</Link>
        </span>
      </div>
    </div>
  );
}
