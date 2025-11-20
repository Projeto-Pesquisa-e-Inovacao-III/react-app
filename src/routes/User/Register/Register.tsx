import { useState } from "react"; // Removi useReducer
import { Lock, Mail, Phone, User, IdCard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import * as userService from "../../../constants/user";
import styles from "./Register.module.css";
import Swal from "sweetalert2";
import * as validation from "../../../utils/validacao";
import type { UserDTO } from "../../../models/user";
import InputWithIcon from "../../../components/Inputs/InputWithIcon/InputWithIcon";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import GoBackButton from "../../../components/GoBackButton/GoBackButton";
import Button from "../../../components/Button/Button";
import { LogoWhiteBig } from "../../../components/LogoWhiteBig/LogoWhiteBig";
import Select from "../../../components/Inputs/Select";
import dayjs from "dayjs";
import SuccessModal from "../../../components/Modal/SuccessModal/SuccessModal";
import classNames from "classnames";
import InputRowDouble from "../../../components/Inputs/InputRowDouble/InputRowDouble";
import useMobile from "../../../hooks/isMobile";
import { cellphoneMask, cpfMask } from "../../../utils/mascara";

const initialRegisterState = {
    name: "",
    email: "",
    password: "",
    customerDocument: "",
    birthDate: "",
    phone: "",
    gender: "",
    confirmPassword: ""
};

// A função reducer foi removida daqui

export default function Register() {
    const isMobile = useMobile();

    // 1. Mudança aqui: useState com o objeto inicial
    const [register, setRegister] = useState(initialRegisterState);

    const [showPasswordValidation, setShowPasswordValidation] = useState<boolean>(false);
    const [successRegister, setSuccessRegister] = useState<boolean>(false);
    const navigate = useNavigate();
    const errors = validation.validatePassword("");

    function navToLogin() {
        setSuccessRegister(false);
        navigate("/login");
    }

    function handleAutoFill() {
        setRegister({
            name: "João Silva",
            email: "joao.silva@example.com",
            password: "123456789aA!",
            customerDocument: "123.456.789-10",
            phone: "(11) 91234-5678",
            gender: "Masculino",
            confirmPassword: "123456789aA!",
            birthDate: dayjs("01-01-2000") as any
        });
    }

    const handleChange = (field: string, value: any) => {
        setRegister(prev => ({ ...prev, [field]: value }));
    };

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
                                <InputWithIcon
                                    type="text"
                                    placeholder="Nome"
                                    onInputChange={(name: string) => handleChange('name', name)}
                                    icon={<User />}
                                    value={register.name}
                                />
                                <InputWithIcon
                                    type="text"
                                    placeholder="Email"
                                    onInputChange={(email: string) => handleChange('email', email)}
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
                                                    value={dayjs(register.birthDate)}
                                                    onChange={(date) => handleChange('birthDate', date)}
                                                />
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    </div>

                                    <div className={styles.selectGenderRegister}>
                                        <Select
                                            id="gender"
                                            placeholder="Selecione um genero"
                                            onInputChange={(gender: string) => handleChange('gender', gender)}
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
                                    setFirstOnChange={(customerDocument: string) => handleChange('customerDocument', customerDocument)}
                                    setSecondOnChange={(phone: string) => handleChange('phone', phone)}
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
                                    onInputChange={(password: string) => handleChange('password', password)}
                                    icon={<Lock />}
                                    isPassword={true}
                                    value={register.password}
                                />
                                <InputWithIcon
                                    type="password"
                                    placeholder="Confirmar Senha"
                                    onInputChange={(confirmPassword: string) => handleChange('confirmPassword', confirmPassword)}
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