import { useState, useMemo } from "react"; // Removi useReducer
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
    const navigate = useNavigate();

    const [openModal, setOpenModal] = useState<modalTypes>(null);
    const [modalInfo, setModalInfo] = useState<{ title: string; content: string }>({ title: "", content: "" });

    const [register, setRegister] = useState(initialRegisterState);

    const allPasswordRules = useMemo(() => {
        return validation.validatePassword("").split('\n').filter(m => m.trim() !== "");
    }, []);

    const passwordValidationData = useMemo(() => {
        if (!register.password) return null;

        const currentErrors = validation.validatePassword(register.password) || "";
        const currentErrorsArray = currentErrors.split('\n').filter(m => m.trim() !== "");
        const passedErrors = allPasswordRules.filter(e => !currentErrorsArray.includes(e));

        const total = allPasswordRules.length;
        const passed = passedErrors.length;
        const pct = total === 0 ? 0 : Math.round((passed / total) * 100);

        const color = pct < 50 ? "#ef4444" : pct < 100 ? "#f59e0b" : "#22c55e";
        const label = pct < 50 ? "Senha fraca" : pct < 100 ? "Quase completa..." : "Senha forte";

        return { currentErrorsArray, pct, color, label };
    }, [register.password, allPasswordRules]);

    const isFormValid =
        register.name.trim() !== "" &&
        validation.validateEmail(register.email).startsWith("Email válido") &&
        register.customerDocument.length === 14 &&
        register.phone.length === 15 &&
        register.gender.trim() !== "" &&
        register.birthDate !== "" &&
        dayjs().diff(dayjs(register.birthDate), 'year') >= 18 &&
        validation.validatePassword(register.password).startsWith("password válida") &&
        register.password === register.confirmPassword;

    // function navToLogin() {
    //     setOpenModal(null);
    //     navigate("/login");
    // }

    function navToAnamnesis() {
        setOpenModal(null);
        navigate("/anamnesis");
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
        } else if (dayjs().diff(dayjs(register.birthDate), 'year') < 18) {
            setModalInfo({ title: "Erro de validação", content: "Você deve ter pelo menos 18 anos para se cadastrar." });
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
                // setOpenModal("success");

                // if (openModal === "success") {
                // setTimeout(() => {
                navigate("/anamnesis");
                // }, 4000);
                // }
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
                            <h1>Criar conta</h1>
                            <p>Preencha os dados abaixo e comece sua jornada conosco.</p>
                        </div>

                        <div className="flex gap-2">
                            <button className="border" onClick={handleAutoFill}>Auto Preencher 1</button>
                            <button className="border" onClick={handleAutoFill2}>Auto Preencher 2</button>
                        </div>

                        <form onSubmit={handleSubmit}>

                            <div className={styles.wrapperInputsFromForm}>
                                <div className={styles.fieldGroup}>
                                    <InputWithIcon
                                        id="reg-name"
                                        type="text"
                                        placeholder="Digite seu nome"
                                        label="Nome completo"
                                        onInputChange={(name: string) => handleChange('name', name)}
                                        icon={<User />}
                                        value={register.name}
                                        customClassName={styles.inputCustom}
                                        maxLength={70}
                                    />
                                </div>

                                <div className={styles.fieldGroup}>
                                    <InputWithIcon
                                        id="reg-email"
                                        type="text"
                                        placeholder="usuario@dominio.com"
                                        label="E-mail"
                                        onInputChange={(email: string) => handleChange('email', email)}
                                        icon={<Mail />}
                                        value={register.email}
                                        hasError={register.email.length > 0 && !validation.validateEmail(register.email).startsWith("Email válido")}
                                        hasSuccess={register.email.length > 0 && validation.validateEmail(register.email).startsWith("Email válido")}
                                        customClassName={styles.inputCustom}
                                        maxLength={100}
                                    />
                                    {register.email.length > 0 && !validation.validateEmail(register.email).startsWith("Email válido") && (
                                        <span className={styles.inputErrorHint}>Email inválido. Tente algo como usuario@dominio.com</span>
                                    )}
                                </div>

                                <div className={styles.DoubleInputsRow}>
                                    <div className={styles.fieldGroup} style={{ flex: 1 }}>
                                        <label className={styles.fieldLabel}>Data de nascimento</label>
                                        <div className={styles.datePickerWrapper}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer components={['DatePicker']}>
                                                    <DatePicker
                                                        format="DD/MM/YYYY"
                                                        slotProps={{
                                                            field: { openPickerButtonPosition: 'start' },
                                                        }}
                                                        maxDate={dayjs().subtract(18, 'year')}
                                                        value={register.birthDate ? dayjs(register.birthDate) : null}
                                                        onChange={(date) => handleChange('birthDate', date ? dayjs(date).format("YYYY-MM-DD").toString() : "")}
                                                    />
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </div>
                                        {register.birthDate && dayjs().diff(dayjs(register.birthDate), 'year') < 18 && (
                                            <span className={styles.inputErrorHint}>Você deve ter pelo menos 18 anos.</span>
                                        )}
                                    </div>

                                    <div className={styles.fieldGroup} style={{ flex: 1 }}>
                                        <label className={styles.fieldLabel} htmlFor="gender">Gênero</label>
                                        <div className={styles.selectGenderRegister}>
                                            <Select
                                                id="gender"
                                                placeholder="Selecione um gênero"
                                                onInputChange={(gender: string) => handleChange('gender', gender)}
                                                icon={<User />}
                                                value={register.gender}
                                                options={["Masculino", "Feminino", "Outro"]}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.DoubleInputsRow}>
                                    <div className={styles.fieldGroup} style={{ flex: 1 }}>
                                        <InputWithIcon
                                            id="reg-cpf"
                                            type="text"
                                            placeholder="CPF"
                                            label="CPF"
                                            onInputChange={(customerDocument: string) => handleChange('customerDocument', customerDocument)}
                                            icon={<IdCard />}
                                            value={register.customerDocument}
                                            mask={cpfMask}
                                            customClassName={styles.inputCustom}
                                            maxLength={14}
                                        />
                                    </div>
                                    <div className={styles.fieldGroup} style={{ flex: 1 }}>
                                        <InputWithIcon
                                            id="reg-phone"
                                            type="text"
                                            placeholder="Telefone"
                                            label="Telefone"
                                            onInputChange={(phone: string) => handleChange('phone', phone)}
                                            icon={<Phone />}
                                            value={register.phone}
                                            mask={cellphoneMask}
                                            customClassName={styles.inputCustom}
                                            maxLength={15}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.passwordSection}>
                                <div className={styles.wrapperPasswordInput}>
                                    <InputWithIcon
                                        type="password"
                                        placeholder="Senha"
                                        onInputChange={(password: string) => handleChange('password', password)}
                                        icon={<Lock />}
                                        isPassword={true}
                                        label="Senha"
                                        customClassName={styles.inputCustom}
                                        value={register.password}
                                        hasError={register.password.length > 0 && !validation.validatePassword(register.password).startsWith("password válida")}
                                        hasSuccess={register.password.length > 0 && validation.validatePassword(register.password).startsWith("password válida")}
                                        maxLength={50}
                                    />
                                    <InputWithIcon
                                        type="password"
                                        placeholder="Confirmar Senha"
                                        onInputChange={(confirmPassword: string) => handleChange('confirmPassword', confirmPassword)}
                                        icon={<Lock />}
                                        isPassword={true}
                                        label="Confirmar Senha"
                                        customClassName={styles.inputCustom}
                                        value={register.confirmPassword}
                                        hasError={register.confirmPassword.length > 0 && register.confirmPassword !== register.password}
                                        hasSuccess={register.confirmPassword.length > 0 && register.confirmPassword === register.password}
                                        maxLength={50}
                                    />
                                </div>

                                {passwordValidationData && (
                                    <div className={styles.strengthWrapper}>
                                        <div className={styles.strengthBar}>
                                            <div className={styles.strengthFill} style={{ width: `${passwordValidationData.pct}%`, backgroundColor: passwordValidationData.color }} />
                                        </div>
                                        <div className={styles.strengthMeta}>
                                            <span className={styles.strengthLabel} style={{ color: passwordValidationData.color }}>{passwordValidationData.label}</span>
                                            {register.confirmPassword.length > 0 && register.password !== register.confirmPassword && (
                                                <span className={styles.weak}>As senhas não coincidem.</span>
                                            )}
                                            {register.confirmPassword.length > 0 && register.password === register.confirmPassword && (
                                                <span className={styles.strong}>Senhas coincidem ✓</span>
                                            )}
                                        </div>
                                        <div className={styles.passwordRulesList}>
                                            {allPasswordRules.map((rule, idx) => {
                                                const isPassed = !passwordValidationData.currentErrorsArray.includes(rule);
                                                return (
                                                    <div key={idx} className={styles.passwordRuleItem}>
                                                        <span className={isPassed ? styles.markerPassed : styles.markerFailed}>{isPassed ? "✓" : "○"}</span>
                                                        <span className={isPassed ? styles.rulePassed : styles.ruleFailed}>{rule}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={styles.terms}>
                                <input type="checkbox" id="terms-checkbox" />
                                <label htmlFor="terms-checkbox">Eu li e aceito os <Link to="/terms">termos de uso</Link></label>
                            </div>

                            {!isFormValid && (
                                <div style={{ textAlign: "center", fontSize: "0.85rem", color: "#6b7280", marginTop: "10px" }}>
                                    Preencha corretamente todos os campos obrigatórios acima para liberar o cadastro.
                                </div>
                            )}

                            <Button typeButton="other" type="submit" title="Criar conta →" loading={loading} classNameVariable={styles.btnCad} disabled={!isFormValid} />
                        </form>

                        <span className={styles.loginLink}>
                            Já tem uma conta? <Link to="/login">Faça login →</Link>
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
                    content="Você pode seguir com o preenchimento da anamnese."
                    closeThen={navToAnamnesis}
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