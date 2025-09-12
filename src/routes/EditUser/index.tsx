import { use, useState } from "react";
import { UserDTO } from "../../models/user";
import * as userService from "../../constants/user";
import "./style.css";
import { Eye, EyeOff, IdCard, Lock, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import * as validation from "../../utils/validacao";
import Swal from "sweetalert2";
import { cpfMask } from "../../utils/mascara";

export default function EditUser() {
  const loggedUser = JSON.parse(localStorage.getItem("user-info") || "{}");

  const errors = validation.validatePassword("");


  const user: UserDTO = {
    id: loggedUser.id,
    nome: loggedUser.nome,
    email: loggedUser.email,
    senha: loggedUser.senha,
    cpf: loggedUser.cpf,
  };

  const [name, setName] = useState<string>(user.nome);
  const [email, setEmail] = useState<string>(user.email);
  const [password, setPassword] = useState<string>(user.senha);
  const [costumerDocument, setCostumerDocument] = useState<string>(user.cpf);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordValidation, setShowPasswordValidation] = useState<boolean>(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    let errors = "";

    const userData: UserDTO = {
      nome: name,
      email: email,
      senha: password,
      cpf: costumerDocument,
    };
    const nullOrBlank = validation.isNullOrBlank(userData);

    if (nullOrBlank) {
      errors += nullOrBlank;
    } else if (!validation.validateEmail(email).startsWith("Email válido")) {
      errors += validation.validateEmail(email);
    } else if (userData.cpf && userData.cpf.length !== 14) {
      errors += "CPF inválido. Deve ter 14 caracteres.\n";
    } else if (validation.validatePassword(password).startsWith("password válida") === false) {
      errors += validation.validatePassword(password);
    }

    if (errors) {
      Swal.fire({
        icon: "error",
        title: "Erro de validação",
        text: errors,
        html: `<pre style="text-align: left; font-size: .85rem;">${errors.replace(/\n/g, '<br>')}</pre>`,
        confirmButtonColor: "#166ba3ff"
      });
      return;
    }

    userService
      .update(user.id || "", userData)
      .then((res) => {
        console.log(res)
        //modal
        Swal.fire({
          icon: "success",
          title: "Usuário atualizado com sucesso",
          showConfirmButton: false,
          timer: 3000,
        });
        localStorage.removeItem("user-info");
        localStorage.setItem("user-info", JSON.stringify(res.data))
      })
      .catch((err) => {
        //modal
        Swal.fire({
          icon: "error",
          title: "Erro ao atualizar usuário",
          showConfirmButton: true,
          confirmButtonColor: "#166ba3ff",
          timer: 3000,
        });
        console.log(err)
      });
  }

  function handleDelete(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    //modal
    Swal.fire({
      title: "Tem certeza?",
      text: "Você não poderá reverter isso!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, deletar!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        userService
          .softDelete(user.id || "")
          .then((res) => {
            console.log(res);
            window.location.href = "/login";
          })
          .catch((err) => {
            console.error(err);
          });
        localStorage.removeItem("user-info");
        //modal
        Swal.fire({
          title: "Deletado!",
          text: "O usuário foi deletado.",
          timer: 1500,
          icon: "success"
        });
      }
    });
  }

  return (
    <div className="update-user">
      <div className="wrapper_update-user_elements">
        <div className="welcome_message">
          <h1>Edite suas informações</h1>
          <p>Atualize os campos abaixo para modificar suas informações.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="row1 mg-15" >
            <div className="costumer-name">
              <label htmlFor="name">Nome</label>
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
                  onInput={(e) => cpfMask(e)}
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
              onChange={(e) => {
                const newPassword = e.target.value;
                setPassword(newPassword);
                setShowPasswordValidation(true)
              }}

            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>

          </div>
          {showPasswordValidation && (
            <div className="password-validation">
              {errors.split('\n').map((msg, index) => (
                <p key={index} className={!validation.validatePassword(password).includes(msg) ? "strong" : "weak"}>{msg}</p>
              ))}
            </div>
          )}
          <button type="submit" className="btn-update">Atualizar</button>
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
