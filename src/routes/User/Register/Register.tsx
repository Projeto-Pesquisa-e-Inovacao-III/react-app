import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Phone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import * as userService from "../../../constants/user";
import { User } from 'lucide-react';
import { IdCard } from 'lucide-react';
import "./style.css";
import Swal from "sweetalert2";
import { cpfMask } from "../../../utils/mascara";
import * as validation from "../../../utils/validacao";
import type { UserDTO, UserDTOSprint2 } from "../../../models/user";
import InputRowDouble from "../../../components/AuthComponents/InputRowDouble";
import InputWithIcon from "../../../components/AuthComponents/InputWithIcon/InputWithIcon";
import InputRowTriple from "../../../components/AuthComponents/InputRowTriple";
import { useMediaQuery } from "@mui/material";
import GoBackButton from "../../../components/GoBackButton";
import Button from "../../../components/Button";
import { LogoWhiteBig } from "../../../components/LogoWhiteBig/LogoWhiteBig";


// todo: validation, mask  
export default function Register({ hasHeader }: { hasHeader: React.Dispatch<React.SetStateAction<boolean>> }) {
    hasHeader(false);
    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [customerDocument, setCustomerDocument] = useState<string>("");

    const [phone, setPhone] = useState<string>("");
    const [gender, setGender] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [showPasswordValidation, setShowPasswordValidation] = useState<boolean>(false);

    function handleAutoFill() {
        console.log("auto preenchendo")
        setName("João");
        setSurname("Silva");
        setEmail("joao.silva@example.com");
        setPassword("Senha123");
        setCustomerDocument("123.456.789-00");
        setPhone("(11) 91234-5678");
        setGender("Masculino");
        setPassword("123456789aA!");
        setConfirmPassword("123456789aA!");
    }

    const isMobile = useMediaQuery('(max-width: 1024px)');

    const errors = validation.validatePassword("");

    const nav = useNavigate()

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        let errors = "";


        const userData: UserDTO = {
            nome: name,
            email: email,
            senha: password,
            cpf: customerDocument,
            telefone: phone,
            sexo: gender,
            dataNascimento: "2000-01-01" // Placeholder date, adjust as needed
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
                if (err.response && err.response.status !== 500) {
                    Swal.fire({
                        icon: "error",
                        title: "Usuário já cadastrado",
                        showConfirmButton: true,
                        confirmButtonColor: "#166ba3ff",
                        timer: 3000,
                    });
                }
                Swal.fire({
                    icon: "error",
                    title: "Erro no servidor",
                    showConfirmButton: true,
                    confirmButtonColor: "#166ba3ff",
                    timer: 3000,
                });
                console.log(err)
            });
    }

    return (
        <div className="register">
            <GoBackButton to="/" />

            <div className={`wrapper_register_elements ${isMobile ? "wrapper_register_elements-mobile" : ""}`}>
                <div className="register_elements">
                    <div className={`welcome_message${isMobile ? "-mobile" : ""}`}>
                        <h1>Inscreva-se</h1>
                        <p>Crie sua conta e tenha acesso completo à nossa plataforma. Preencha os dados abaixo para começar sua jornada conosco.</p>
                        <button className="border-2" onClick={handleAutoFill}>Auto preenchimento</button>
                    </div>
                    <div className="border-division"></div>


                    <form onSubmit={handleSubmit}>

                        <div className="wrapper-inputs-from-form">
                            <InputRowDouble
                                firstPlaceholder="Nome"
                                secondPlaceholder="Sobrenome"
                                firstIcon={<User />}
                                secondIcon={<User />}
                                setFirstOnChange={setName}
                                setSecondOnChange={setSurname}
                                valueFirst={name}
                                valueSecond={surname}
                            />

                            <InputWithIcon
                                type="text"
                                placeholder="Email"
                                onInputChange={setEmail}
                                icon={<Mail />}
                                value={email}
                            />

                            {!isMobile ? (
                                <InputRowTriple
                                    firstPlaceholder="CPF"
                                    firstIcon={<IdCard />}
                                    setFirstOnChange={setCustomerDocument}
                                    secondPlaceholder="Telefone"
                                    secondIcon={<Phone />}
                                    setSecondOnChange={setPhone}
                                    thirdPlaceholder="Gênero"
                                    thirdIcon={<User />}
                                    setThirdOnChange={setGender}
                                    thirdIsSelect={true}
                                    valueFirst={customerDocument}
                                    valueSecond={phone}
                                    valueThird={gender}
                                    validatorFirst={cpfMask}
                                />
                            ) : (
                                <>
                                    <InputWithIcon
                                        type="text"
                                        placeholder="CPF"
                                        onInputChange={setCustomerDocument}
                                        icon={<IdCard />}
                                        value={customerDocument}
                                    />

                                    <InputRowDouble
                                        firstPlaceholder="Telefone"
                                        secondPlaceholder="Gênero"
                                        firstIcon={<Phone />}
                                        secondIcon={<User />}
                                        setFirstOnChange={setPhone}
                                        setSecondOnChange={setGender}
                                        valueFirst={phone}
                                        valueSecond={gender}
                                    />
                                </>
                            )}
                        </div>
                        <div className="border-division"></div>

                        <div className="wrapper-password-input">
                            <InputWithIcon
                                type="password"
                                placeholder="Senha"
                                onInputChange={setPassword}
                                icon={<Lock />}
                                isPassword={true}
                                value={password}
                            />
                            <InputWithIcon
                                type="password"
                                placeholder="Confirmar Senha"
                                onInputChange={setConfirmPassword}
                                icon={<Lock />}
                                isPassword={true}
                                value={confirmPassword}
                            />
                        </div>

                        <div className="terms">
                            <input type="checkbox" />
                            <label>Eu li e aceito os <Link to="/terms">termos de uso</Link></label>
                        </div>

                        {showPasswordValidation && (
                            <div className="password-validation">
                                {errors.split('\n').map((msg, index) => (
                                    <p key={index} className={!validation.validatePassword(password).includes(msg) ? "strong" : "weak"}>{msg}</p>
                                ))}
                            </div>
                        )}
                        <Button type="submit" title="Cadastrar" />
                    </form>
                    <span>
                        Já tem uma conta? <Link to="/login">Faça login</Link>
                    </span>
                </div>
            </div>

            {!isMobile &&
                <div className="section-logo-login">
                    <LogoWhiteBig />
                </div>
            }
        </div>

    );
}



