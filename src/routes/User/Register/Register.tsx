import { useState } from "react";
import { Lock, Mail, Phone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import * as userService from "../../../constants/user";
import { User } from 'lucide-react';
import { IdCard } from 'lucide-react';
import styles from "./Register.module.css";
import Swal from "sweetalert2";
import * as validation from "../../../utils/validacao";
import type { UserDTO } from "../../../models/user";
import InputWithIcon from "../../../components/AuthComponents/InputWithIcon/InputWithIcon";
import { useMediaQuery } from "@mui/material";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import GoBackButton from "../../../components/GoBackButton/GoBackButton";
import Button from "../../../components/Button/Button";
import { LogoWhiteBig } from "../../../components/LogoWhiteBig/LogoWhiteBig";
import Select from "../../../components/AuthComponents/Select";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import SuccessModal from "../../../components/Modal/SuccessModal/SuccessModal";
import classNames from "classnames";
import InputRowDouble from "../../../components/AuthComponents/InputRowDouble/InputRowDouble";


// todo: validation, mask  
export default function Register() {
    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [customerDocument, setCustomerDocument] = useState<string>("");
    const [birthDate, setBirthDate] = useState<Dayjs | null>(null);

    const [phone, setPhone] = useState<string>("");
    const [gender, setGender] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [showPasswordValidation, setShowPasswordValidation] = useState<boolean>(false);

    const [successRegister, setSuccessRegister] = useState<boolean>(false);


    function navToLogin() {
        setSuccessRegister(false);
        navigate("/login");
    }

    function handleAutoFill() {
        setName("João");
        setSurname("Silva");
        setEmail("joao.silva@example.com");
        setPassword("Senha123");
        setCustomerDocument("123.456.789-10");
        setPhone("(11) 91234-5678");
        setGender("Masculino");
        setPassword("123456789aA!");
        setConfirmPassword("123456789aA!");
        setBirthDate(dayjs("01-01-2000"));
    }

    const isMobile = useMediaQuery('(max-width: 1024px)');

    const navigate = useNavigate();

    const errors = validation.validatePassword("");

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        let errors = "";

        console.log(customerDocument);

        const userData: UserDTO = {
            nome: name,
            email: email,
            senha: password,
            cpf: customerDocument.split(".").join("").split("-").join(""),
            telefone: phone,
            sexo: gender,
            dataNascimento: birthDate
        };

        console.log(userData.cpf);

        const nullOrBlank = validation.isNullOrBlank(userData);

        if (nullOrBlank) {
            errors += nullOrBlank;
        } else if (!validation.validateEmail(email).startsWith("Email válido")) {
            errors += validation.validateEmail(email);
        } else if (customerDocument && customerDocument.length !== 14) {
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
                setSuccessRegister(true);

                setTimeout(() => {
                    if (successRegister) {
                        navigate("/login");
                    }
                }, 4000);

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
        <>
            <div className={styles.register}>
                <GoBackButton to="/" />

                <div className={classNames(styles.wrapperRegisterElements, {
                    [styles.wrapperRegisterElementsMobile]: isMobile
                })}>
                    <div className={styles.registerElements}>
                        <div className={classNames(styles.welcomeMessage, {
                            [styles.welcomeMessageMobile]: isMobile
                        })}>
                            <h1>Inscreva-se</h1>
                            <p>Crie sua conta e tenha acesso completo à nossa plataforma. Preencha os dados abaixo para começar sua jornada conosco.</p>
                            <button className="border-2" onClick={handleAutoFill}>Auto preenchimento</button>
                        </div>
                        <div className={styles.borderDivision}></div>


                        <form onSubmit={handleSubmit}>

                            <div className={styles.wrapperInputsFromForm}>
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

                                <div className={styles.DoubleInputsRow}>
                                    <div className={styles.datePickerWrapper}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={['DatePicker']}>
                                                <DatePicker
                                                    format="DD/MM/YYYY"
                                                    slotProps={{
                                                        field: { openPickerButtonPosition: 'start' },
                                                    }}
                                                    value={birthDate}
                                                    onChange={(date) => setBirthDate(date)}
                                                />
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    </div>

                                    <div className={styles.selectGenderRegister}>
                                        <Select
                                            id="gender"
                                            placeholder="Selecione um genero"
                                            onInputChange={setGender}
                                            icon={<User />}
                                            value={gender}
                                            options={["Masculino", "Feminino", "Outro"]}
                                        />
                                    </div>
                                </div>

                                <InputRowDouble
                                    firstPlaceholder="CPF"
                                    secondPlaceholder="Telefone"
                                    firstIcon={<IdCard />}
                                    secondIcon={<Phone />}
                                    setFirstOnChange={setCustomerDocument}
                                    setSecondOnChange={setPhone}
                                    valueFirst={customerDocument}
                                    valueSecond={phone}
                                />
                            </div>
                            <div className={styles.borderDivision}></div>

                            <div className={styles.wrapperPasswordInput}>
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

                            <div className={styles.terms}>
                                <input type="checkbox" />
                                <label>Eu li e aceito os <Link to="/terms">termos de uso</Link></label>
                            </div>

                            {showPasswordValidation && (
                                <div className={styles.passwordValidation}>
                                    {errors.split('\n').map((msg, index) => (
                                        <p key={index} className={!validation.validatePassword(password).includes(msg) ? styles.strong : styles.weak}>{msg}</p>
                                    ))}
                                </div>
                            )}
                            <Button type="submit" title="Cadastrar" />
                        </form>
                        <span>
                            Já tem uma conta? <Link to="/login">Faça login</Link>
                        </span>
                    </div>
                </div >

                {!isMobile &&
                    <div className={styles.sectionLogoLogin}>
                        <LogoWhiteBig />
                    </div>
                }
            </div >

            {
                successRegister && (
                    <SuccessModal
                        isMobile={isMobile}
                        title="Cadastro realizado com sucesso!"
                        content="Você já pode fazer login na sua conta."
                        closeThen={navToLogin}
                    />
                )}
        </>
    );
}



