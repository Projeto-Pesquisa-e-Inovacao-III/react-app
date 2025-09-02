import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as userService from "../../../constants/user";
import { UserDTO } from "../../../models/user";
import { User } from 'lucide-react';
import { IdCard } from 'lucide-react';
import "./style.css";
import Swal from "sweetalert2";
import { cpfMask } from "../../../utils/mascara";
import * as validation from "../../../utils/validacao";
import axios from "axios";

export default function Register() {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [costumerDocument, setCostumerDocument] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showPasswordValidation, setShowPasswordValidation] = useState<boolean>(false);

    const errors = validation.validatePassword("");

    const nav = useNavigate()

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        let errors = "";


        const userData: UserDTO = {
            nome: name,
            email: email,
            senha: password,
            cpf: costumerDocument
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
            .register(userData)
            .then(async (res) => {
                await insertUserInDBJson(userData);
                Swal.fire({
                    icon: "success",
                    title: "Cadastro bem sucedido",
                    showConfirmButton: false,
                    timer: 3000,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });

                localStorage.setItem("user-info", JSON.stringify(res.data))
                setTimeout(() => {
                    nav("/")
                }, 3000)
            })
            .catch((err) => {
                Swal.fire({
                    icon: "error",
                    title: "Usuário já cadastrado",
                    showConfirmButton: true,
                    confirmButtonColor: "#166ba3ff",
                    timer: 3000,
                });
                console.log(err)
            });
    }

    async function insertUserInDBJson(user: UserDTO) {
        const response = await axios.post("http://localhost:3001/users", user);
        return response.data;
    }

    return (
        <div className="register">
            <div className="wrapper_register_elements">
                <div className="welcome_message">
                    <h1>Bem-vindo</h1>
                    <p>Cadastre-se para acessar nossa plataforma</p>
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
                    <button type="submit">Cadastrar</button>
                </form>
                <span>
                    Já tem uma conta? <Link to="/login">Entrar</Link>
                </span>
            </div>
        </div>
    );
}



