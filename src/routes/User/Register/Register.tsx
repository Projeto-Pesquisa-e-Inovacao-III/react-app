import { useReducer, useState } from "react";
import { Lock, Mail, Phone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import * as userService from "../../../constants/user";
import { User } from 'lucide-react';
import { IdCard } from 'lucide-react';
import styles from "./Register.module.css";
import Swal from "sweetalert2";
import * as validation from "../../../utils/validacao";
import type { UserDTO } from "../../../models/user";
import InputWithIcon from "../../../components/Inputs/InputWithIcon/InputWithIcon";
import { useMediaQuery } from "@mui/material";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import GoBackButton from "../../../components/GoBackButton/GoBackButton";
import Button from "../../../components/Button/Button";
import { LogoWhiteBig } from "../../../components/LogoWhiteBig/LogoWhiteBig";
import Select from "../../../components/Inputs/Select";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import SuccessModal from "../../../components/Modal/SuccessModal/SuccessModal";
import classNames from "classnames";
import InputRowDouble from "../../../components/Inputs/InputRowDouble/InputRowDouble";
import useMobile from "../../../hooks/isMobile";
import { cellphoneMask, cpfMask } from "../../../utils/mascara";

const initialRegisterState = {
    name: "",
    surname: "",
    email: "",
    password: "",
    customerDocument: "",
    birthDate: null,
    phone: "",
    gender: "",
    confirmPassword: ""
};

function reducer(state: any, action: any) {
    switch (action.type) {
        case 'setName':
            return { ...state, name: action.payload };
        case 'setSurname':
            return { ...state, surname: action.payload };
        case 'setEmail':
            return { ...state, email: action.payload };
        case 'setPassword':
            return { ...state, password: action.payload };
        case 'setCustomerDocument':
            return { ...state, customerDocument: action.payload };
        case 'setBirthDate':
            return { ...state, birthDate: action.payload };
        case 'setPhone':
            return { ...state, phone: action.payload };
        case 'setGender':
            return { ...state, gender: action.payload };
        case 'setConfirmPassword':
            return { ...state, confirmPassword: action.payload };
        default:
            return state;
    }
}

// todo: validation, mask  
export default function Register() {
    const isMobile = useMobile();

    const [register, dispatch] = useReducer(reducer, initialRegisterState);

    const [showPasswordValidation, setShowPasswordValidation] = useState<boolean>(false);

    const [successRegister, setSuccessRegister] = useState<boolean>(false);


    function navToLogin() {
        setSuccessRegister(false);
        navigate("/login");
    }

    function handleAutoFill() {
        dispatch({ type: 'setName', payload: "João" });
        dispatch({ type: 'setSurname', payload: "Silva" });
        dispatch({ type: 'setEmail', payload: "joao.silva@example.com" });
        dispatch({ type: 'setPassword', payload: "Senha123" });
        dispatch({ type: 'setCustomerDocument', payload: "123.456.789-10" });
        dispatch({ type: 'setPhone', payload: "(11) 91234-5678" });
        dispatch({ type: 'setGender', payload: "Masculino" });
        dispatch({ type: 'setPassword', payload: "123456789aA!" });
        dispatch({ type: 'setConfirmPassword', payload: "123456789aA!" });
        dispatch({ type: 'setBirthDate', payload: dayjs("01-01-2000") });
    }


    const navigate = useNavigate();

    const errors = validation.validatePassword("");

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        let errors = "";

        const userData: UserDTO = {
            nome: register.name,
            email: register.email,
            senha: register.password,
            cpf: register.customerDocument.split(".").join("").split("-").join(""),
            telefone: {
                ddd: register.phone.substring(1, 3),
                numero: register.phone.substring(5).split("-").join(""),
                pais: "55"
            },
            sexo: register.gender,
            dataNascimento: register.birthDate
        };

        console.log(userData.cpf);

        const nullOrBlank = validation.isNullOrBlank(userData);

        if (nullOrBlank) {
            errors += nullOrBlank;
        } else if (!validation.validateEmail(register.email).startsWith("Email válido")) {
            errors += validation.validateEmail(register.email);
        } else if (register.customerDocument && register.customerDocument.length !== 14) {
            errors += "CPF inválido. Deve ter 14 caracteres.\n";
        } else if (validation.validatePassword(register.password).startsWith("password válida") === false) {
            errors += validation.validatePassword(register.password);
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
                                    setFirstOnChange={(name: string) => dispatch({ type: 'setName', payload: name })}
                                    setSecondOnChange={(surname: string) => dispatch({ type: 'setSurname', payload: surname })}
                                    valueFirst={register.name}
                                    valueSecond={register.surname}
                                />

                                <InputWithIcon
                                    type="text"
                                    placeholder="Email"
                                    onInputChange={(email: string) => dispatch({ type: 'setEmail', payload: email })}
                                    icon={<Mail />}
                                    value={register.email}
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
                                                    value={register.birthDate}
                                                    onChange={(date) => dispatch({ type: 'setBirthDate', payload: date })}
                                                />
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    </div>

                                    <div className={styles.selectGenderRegister}>
                                        <Select
                                            id="gender"
                                            placeholder="Selecione um genero"
                                            onInputChange={(gender: string) => dispatch({ type: 'setGender', payload: gender })}
                                            icon={<User />}
                                            value={register.gender}
                                            options={["Masculino", "Feminino", "Outro"]}
                                        />
                                    </div>
                                </div>

                                <InputRowDouble
                                    firstPlaceholder="CPF"
                                    secondPlaceholder="Telefone"
                                    firstIcon={<IdCard />}
                                    secondIcon={<Phone />}
                                    setFirstOnChange={(customerDocument: string) => dispatch({ type: 'setCustomerDocument', payload: customerDocument })}
                                    setSecondOnChange={(phone: string) => dispatch({ type: 'setPhone', payload: phone })}
                                    valueFirst={register.customerDocument}
                                    valueSecond={register.phone}
                                    firstMask={cpfMask}
                                    secondMask={cellphoneMask}
                                />
                            </div>
                            <div className={styles.borderDivision}></div>

                            <div className={styles.wrapperPasswordInput}>
                                <InputWithIcon
                                    type="password"
                                    placeholder="Senha"
                                    onInputChange={(password: string) => dispatch({ type: 'setPassword', payload: password })}
                                    icon={<Lock />}
                                    isPassword={true}
                                    value={register.password}
                                />
                                <InputWithIcon
                                    type="password"
                                    placeholder="Confirmar Senha"
                                    onInputChange={(confirmPassword: string) => dispatch({ type: 'setConfirmPassword', payload: confirmPassword })}
                                    icon={<Lock />}
                                    isPassword={true}
                                    value={register.confirmPassword}
                                />
                            </div>

                            <div className={styles.terms}>
                                <input type="checkbox" />
                                <label>Eu li e aceito os <Link to="/terms">termos de uso</Link></label>
                            </div>

                            {showPasswordValidation && (
                                <div className={styles.passwordValidation}>
                                    {errors.split('\n').map((msg, index) => (
                                        <p key={index} className={!validation.validatePassword(register.password).includes(msg) ? styles.strong : styles.weak}>{msg}</p>
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



