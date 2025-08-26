import { useState } from "react";
import { UserDTO } from "../../models/user";
import * as userService from "../../constants/user";
import "./style.css";
import { Eye, EyeOff, IdCard, Lock, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function EditUser() {
  const tempUser: {
    id: string;
    name: string;
    email: string;
    password: string;
    costumerDocument: string;
  } = {
    id: "1",
    name: "John Doe",
    email: "johndoe@example.com",
    password: "password123",
    costumerDocument: "123.456.789-00",
  };

  const [name, setName] = useState<string>(tempUser.name);
  const [email, setEmail] = useState<string>(tempUser.email); // pega se existir no localstorage. se não, pega do tempUser
  const [password, setPassword] = useState<string>(tempUser.password);
  const [costumerDocument, setCostumerDocument] = useState<string>(
    tempUser.costumerDocument
  );
  const [showPassword, setShowPassword] = useState<boolean>(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    localStorage.setItem(email, "email");
    const userData: UserDTO = {
      name,
      email,
      password,
      costumerDocument,
    };
    userService
      .update(userData)
      .then((res) => {
        console.log(res);
        alert("atualizado!");
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleDelete(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (window.confirm("Tem certeza que deseja deletar este usuário?")) {
      userService
        .deleteUser(tempUser.id)
        .then((res) => {
          console.log(res);
          alert("deletado!");
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  return (
    <div className="update-user">
      <div className="wrapper_update-user_elements">
        <div className="welcome_message">
          <h1>Bem-vindo de volta</h1>
          <p>Entre na sua conta para acessar nossa plataforma</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="row1">
            <div className="costumer-name">
              <label htmlFor="name">Nome do cliente</label>
              <div className="wrapper_inp">
                <User className="input-icon" />
                <input
                  type="text"
                  name="name"
                  placeholder="Nome do cliente"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div className="costumer-document">
              <label htmlFor="costumerDocument">CPF</label>
              <div className="wrapper_inp">
                <IdCard className="input-icon" />
                <input
                  type="text"
                  name="costumerDocument"
                  placeholder="___.___.___-__"
                  value={costumerDocument}
                  onChange={(e) => setCostumerDocument(e.target.value)}
                />
              </div>
            </div>
          </div>
          <label>Email</label>
          <div className="wrapper_inp">
            <Mail className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <label>Senha</label>
          <div className="wrapper_inp">
            <Lock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="sua senha"
              id="password"
              value={password}
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
          <button type="submit">Atualizar</button>
        </form>
        <form onSubmit={handleDelete}>
          <button
            type="submit"
            style={{ backgroundColor: "#a32d2dff", color: "white" }}
          >
            Deletar
          </button>
        </form>
      </div>
    </div>
  );
}
