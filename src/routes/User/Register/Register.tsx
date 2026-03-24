import { useState } from "react"; // Removi useReducer
import { Lock, Mail, Phone, User, IdCard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import * as userService from "../../../constants/user";
import styles from "./Register.module.css";
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
import Select from "../../../components/Inputs/Select/Select";
import dayjs from "dayjs";
import SuccessModal from "../../../components/Modal/SuccessModal/SuccessModal";
import classNames from "classnames";
import InputRowDouble from "../../../components/Inputs/InputRowDouble/InputRowDouble";
import useMobile from "../../../hooks/isMobile";
import { cellphoneMask, cpfMask } from "../../../utils/mascara";
import ErrorModal from "../../../components/Modal/ErrorModal/ErrorModal";

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

type modalTypes = "success" | "error" | null;

export default function Register() {
    const isMobile = useMobile();

    const [openModal, setOpenModal] = useState<modalTypes>(null);
    const [modalInfo, setModalInfo] = useState<{ title: string; content: string }>({ title: "", content: "" });

    const [register, setRegister] = useState(initialRegisterState);

    const navigate = useNavigate();
    const errors = validation.validatePassword("");

    const isFormValid =
        register.name.trim() !== "" &&
        validation.validateEmail(register.email).startsWith("Email válido") &&
        register.customerDocument.length === 14 &&
        register.phone.length === 15 &&
        register.gender.trim() !== "" &&
        register.birthDate !== "" &&
        validation.validatePassword(register.password).startsWith("password válida") &&
        register.password === register.confirmPassword;

    function navToLogin() {
        setOpenModal(null);
        navigate("/login");
    }

    function handleAutoFill() {
        setRegister({
            name: "João Silva",
            email: "joao.silva@example.com",
            password: "123456789aA!",
            customerDocument: "113.825.140-26",
            phone: "(11) 91234-5678",
            gender: "Masculino",
            confirmPassword: "123456789aA!",
            birthDate: dayjs("2000-01-01").format("YYYY-MM-DD").toString()
        });
    }

    function handleAutoFill2() {
        setRegister({
            name: "Maria Oliveira",
            email: "maria.oliveira@example.com",
            password: "123456789aA!",
            customerDocument: "156.425.430-59",
            phone: "(19) 99570-8678",
            gender: "Feminino",
            confirmPassword: "123456789aA!",
            birthDate: dayjs("2000-01-01").format("YYYY-MM-DD").toString()
        });
    }


    const handleChange = (field: string, value: string) => {
        setRegister(prev => ({ ...prev, [field]: value }));
    };

    const [loading, setLoading] = useState(false);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

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

        const nullOrBlank = validation.isNullOrBlank(userData);

        if (nullOrBlank) {
            setModalInfo({ title: "Erro de validação", content: "Campos obrigatórios não preenchidos" });
            setOpenModal("error");
            setLoading(false);
            return;

        } else if (!validation.validateEmail(register.email).startsWith("Email válido")) {
            setModalInfo({ title: "Erro de validação", content: "Email inválido." });
            setOpenModal("error");
            setLoading(false);
            return;

        } else if (register.customerDocument && register.customerDocument.length !== 14) {
            setModalInfo({ title: "Erro de validação", content: "CPF inválido." });
            setOpenModal("error");
            setLoading(false);
            return;
        } else if (validation.validatePassword(register.password).startsWith("password válida") === false) {
            setModalInfo({ title: "Erro de validação", content: "Senha inválida. A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais." });
            setOpenModal("error");
            setLoading(false);
            return;
        }


        userService
            .register(userData)
            .then(async () => {
                setOpenModal("success");

                if (openModal === "success") {
                    setTimeout(() => {
                        navigate("/login");
                    }, 4000);
                }
            })
            .catch((err) => {
                setModalInfo({ title: "Erro!", content: err.response?.data?.Exception || err.response?.data?.dataNascimento || "Ocorreu um erro ao realizar o cadastro. Tente novamente mais tarde." });
                setOpenModal("error");
            })
            .finally(() => {
                setLoading(false);
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
                            <button className="border-2" onClick={handleAutoFill2}>Auto preenchimento 2</button>
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
                                <div>
                                    <InputWithIcon
                                        type="text"
                                        placeholder="Email"
                                        onInputChange={(email: string) => handleChange('email', email)}
                                        icon={<Mail />}
                                        value={register.email}
                                        hasError={register.email.length > 0 && !validation.validateEmail(register.email).startsWith("Email válido")}
                                        hasSuccess={register.email.length > 0 && validation.validateEmail(register.email).startsWith("Email válido")}
                                    />
                                    {register.email.length > 0 && !validation.validateEmail(register.email).startsWith("Email válido") && (
                                        <span className={styles.inputErrorHint}>Email inválido. Tente algo como usuario@dominio.com</span>
                                    )}
                                </div>

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
                                                    onChange={(date) => handleChange('birthDate', date ? dayjs(date).format("YYYY-MM-DD").toString() : "")}
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
                                    hasError={register.password.length > 0 && !validation.validatePassword(register.password).startsWith("password válida")}
                                    hasSuccess={register.password.length > 0 && validation.validatePassword(register.password).startsWith("password válida")}
                                />
                                <InputWithIcon
                                    type="password"
                                    placeholder="Confirmar Senha"
                                    onInputChange={(confirmPassword: string) => handleChange('confirmPassword', confirmPassword)}
                                    icon={<Lock />}
                                    isPassword={true}
                                    value={register.confirmPassword}
                                    hasError={register.confirmPassword.length > 0 && register.confirmPassword !== register.password}
                                    hasSuccess={register.confirmPassword.length > 0 && register.confirmPassword === register.password}
                                />
                            </div>

                            <div className={styles.terms}>
                                <input type="checkbox" />
                                <label>Eu li e aceito os <Link to="/terms">termos de uso</Link></label>
                            </div>

                            {register.password.length > 0 && (
                                <div className={styles.passwordValidation}>
                                    {errors.split('\n').filter((msg) => msg.trim() !== "").map((msg, index) => (
                                        <p key={index} className={!validation.validatePassword(register.password).includes(msg) ? styles.strong : styles.weak}>{msg}</p>
                                    ))}
                                    {register.confirmPassword.length > 0 && register.password !== register.confirmPassword && (
                                        <p className={styles.weak}>As senhas não coincidem.</p>
                                    )}
                                    {register.confirmPassword.length > 0 && register.password === register.confirmPassword && (
                                        <p className={styles.strong}>Senhas coincidem.</p>
                                    )}
                                </div>
                            )}
                            <Button typeButton="other" type="submit" title="Cadastrar" loading={loading} classNameVariable={styles.btnCad} disabled={!isFormValid} />
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

            {openModal === "success" && (
                <SuccessModal
                    isMobile={isMobile}
                    title="Cadastro realizado com sucesso!"
                    content="Você já pode fazer login na sua conta."
                    closeThen={navToLogin}
                />
            )}

            {
                openModal === "error" && (
                    <ErrorModal
                        title={modalInfo.title}
                        content={modalInfo.content}
                        closeThen={() => setOpenModal(null)}
                    />
                )
            }
        </>
    );
}