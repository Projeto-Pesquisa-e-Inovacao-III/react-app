import { useState } from "react";
import "./style.css";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // Handle login logic here
  }

  return (
    <div className="login">
      <div className="wrapper_login_elements">
        <div className="welcome_message">
          <h1>Bem-vindo de volta</h1>
          <p>Entre na sua conta para acessar nossa plataforma</p>
        </div>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
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
          <div className="config_login">
            <label>
              <input
                type="checkbox"
                name="remember"
                id="remember"
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Lembrar-me</span>
            </label>

            <Link>Esqueceu sua senha?</Link>
          </div>
          <button type="submit">Entrar na conta</button>
        </form>
        <span>
          Não tem uma conta? <Link>Criar uma conta</Link>
        </span>
      </div>
    </div>
  );
}
