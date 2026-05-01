import MuiDatePicker from "../../../components/Inputs/MuiDatePicker/MuiDatePicker";
import { useState } from "react";

import styles from "./CreatePersonal.module.css";
import InputWithIcon from "../../../components/Inputs/InputWithIcon/InputWithIcon";
import Select from "../../../components/Inputs/Select/Select";
import { Mail, User, Phone, Hash, Users } from "lucide-react";
import { WhiteContainer } from "../../../components/WhiteContainer/WhiteContainer";
import useMobile from "../../../hooks/isMobile";
import classNames from "classnames";
import { cellphoneMask, crefMask } from "../../../utils/mascara";
import * as validation from "../../../utils/validacao";
import dayjs from "dayjs";
import * as adminService from "../../../constants/admin";
import useModal from "../../../hooks/useModal";
import SuccessModal from "../../../components/Modal/SuccessModal/SuccessModal";
import ErrorModal from "../../../components/Modal/ErrorModal/ErrorModal";

export default function CreatePersonal() {
  const isMobile = useMobile();
  const sexOptions = ["Masculino", "Feminino", "Outro"];

  const [form, setForm] = useState({
    nome: "",
    sexo: "",
    dataNascimento: "",
    email: "",
    cref: "",
    telefone: "",
  });

  const {
    openModal,
    setOpenModal,
    textModal,
    setTextModal
  } = useModal(null, { title: "", content: "" })

  const [touched, setTouched] = useState<{ [key: string]: boolean }>({
    nome: false,
    email: false,
  });
  const [showNomeError, setShowNomeError] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "nome") {
      setShowNomeError(false);
      setTimeout(() => setShowNomeError(true), 200);
    }
    if (field === "email") {
      setShowEmailError(false);
      setTimeout(() => setShowEmailError(true), 200);
    }
  }

  function parseTelefone(telefone: string) {
    const onlyNums = telefone.replace(/\D/g, "");
    return {
      pais: 55,
      ddd: Number(onlyNums.substring(0, 2)),
      numero: Number(onlyNums.substring(2)),
    };
  }

  function isFormValid() {
    return (
      form.nome.trim() !== "" &&
      validation.validateEmail(form.email).startsWith("Email válido") &&
      form.cref.trim() !== "" &&
      form.sexo.trim() !== "" &&
      form.dataNascimento.length === 10 &&
      form.telefone.replace(/\D/g, "").length === 11
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSubmitAttempted(true);
    setTouched({ nome: true, email: true });
    setShowNomeError(true);
    setShowEmailError(true);

    if (!isFormValid()) {
      return;
    }

    setLoading(true);

    try {
      const data = {
        nome: form.nome,
        sexo: form.sexo,
        dataNascimento: dayjs(form.dataNascimento, "DD/MM/YYYY").format("YYYY-MM-DD"),
        email: form.email,
        cref: form.cref,
        telefone: parseTelefone(form.telefone),
      };
      await adminService.createPersonal(data);
      setTextModal({
        title: "Personal Cadastrado!",
        content: "O personal trainer foi cadastrado com sucesso no sistema."
      })
      setOpenModal("success");
      setSubmitAttempted(false);
      setTouched({ nome: false, email: false });
      setShowNomeError(false);
      setShowEmailError(false);
      setForm({
        nome: "",
        sexo: "",
        dataNascimento: "",
        email: "",
        cref: "",
        telefone: "",
      });
    } catch (err: any) {
      
      setTextModal({
        title: "Erro ao Cadastrar Personal!",
        content: err.response?.data.Exception || "Ocorreu um erro ao cadastrar o personal trainer. Tente novamente."
      })
      setOpenModal("error");
      
    } finally {
      setLoading(false);
    }
  }

  const nomeHasError =
    (submitAttempted || (touched.nome && showNomeError)) &&
    form.nome.trim() === "";

  const emailHasError =
    (submitAttempted || (touched.email && showEmailError)) &&
    form.email.length > 0 &&
    !validation.validateEmail(form.email).startsWith("Email válido");

  const emailEmptyError =
    submitAttempted && form.email.trim() === "";

  return (
    <>
      {
        (openModal === "success" &&
          <SuccessModal
            isMobile={isMobile}
            closeThen={() => setOpenModal(null)}
            title={textModal.title}
            content={textModal.content}
          />
        ) 
        ||
        (openModal === "error" && 
        <ErrorModal
          closeThen={() => setOpenModal(null)}
          title={textModal.title}
          content={textModal.content}
        />
      )
      }
      <div className={classNames(styles.page, { [styles.pageMobile]: isMobile })}>
        <WhiteContainer
          title="Cadastrar Personal"
          titleFontSize={32}
          titleMarginBottom={4}
          containerClassName={styles.container}
          contentClassName={styles.content}
          titleClassName={styles.title}
        >
        <button className="border" onClick={() => setForm({
          nome: "Gabriel",
          sexo: "Masculino",
          dataNascimento: "01/01/2000",
          email: "gabriel@email.com",
          cref: "123456",
          telefone: "11999999999",
        })}>Auto Preencher</button>
        <p className={styles.subtitle}>
          Preencha os dados para criar um novo personal trainer no sistema.
        </p>
        <form className={styles.form} onSubmit={handleSubmit}>

          {/* Nome */}
          <div>
            <InputWithIcon
              type="text"
              label="Nome Completo"
              placeholder="Ex: João Carlos Silva"
              icon={<User size={18} />}
              value={form.nome}
              onInputChange={(v: string) => handleChange("nome", v)}
              id="nome-completo"
              hasError={nomeHasError}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, nome: true }));
                setTimeout(() => setShowNomeError(true), 200);
              }}
            />
            {nomeHasError && (
              <span style={{ color: "#b91c1c", fontSize: 13, marginBottom: 4, display: "block" }}>
                O nome é obrigatório.
              </span>
            )}
          </div>

          <div className={classNames(styles.rowDouble, { [styles.rowDoubleMobile]: isMobile })}>

            {/* Email */}
            <div>
              <InputWithIcon
                type="email"
                label="Email Profissional"
                placeholder="email@dominio.com"
                icon={<Mail size={18} />}
                value={form.email}
                onInputChange={(v: string) => handleChange("email", v)}
                id="email-profissional"
                hasError={emailHasError || emailEmptyError}
                hasSuccess={
                  form.email.length > 0 &&
                  validation.validateEmail(form.email).startsWith("Email válido")
                }
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, email: true }));
                  setTimeout(() => setShowEmailError(true), 200);
                }}
              />
              {emailEmptyError && (
                <span style={{ color: "#b91c1c", fontSize: 13, marginBottom: 4, display: "block" }}>
                  O email é obrigatório.
                </span>
              )}
              {emailHasError && !emailEmptyError && (
                <span style={{ color: "#b91c1c", fontSize: 13, marginBottom: 4, display: "block" }}>
                  Digite um email válido.
                </span>
              )}
            </div>

            {/* Sexo */}
            <div className={styles.selectWrapper}>
              <label htmlFor="genero" className={styles.selectLabel}>
                Genero
              </label>
              <Select
                placeholder="Selecione"
                icon={<Users size={18} />}
                value={form.sexo}
                onInputChange={(v: string) => handleChange("sexo", v)}
                options={sexOptions}
                id="genero"
                className={styles.select}
              />
              {(submitAttempted && form.sexo.trim() === "") && (
                <span style={{ color: "#b91c1c", fontSize: 13, marginBottom: 4, display: "block" }}>
                  Selecione o genero.
                </span>
              )}
            </div>
          </div>

          <div className={classNames(styles.rowDouble, { [styles.rowDoubleMobile]: isMobile })}>

            {/* Data de Nascimento */}
            <div className={styles.muiWrapper}>
              <label htmlFor="data-nascimento" className={styles.selectLabel}>
                Data de Nascimento
              </label>
              <MuiDatePicker
                label=""
                value={form.dataNascimento}
                onChange={(v) => handleChange("dataNascimento", v)}
                error={
                  (submitAttempted && form.dataNascimento.length === 0) ||
                  (form.dataNascimento.length > 0 && form.dataNascimento.length !== 10)
                }
                helperText={
                  form.dataNascimento.length > 0 && form.dataNascimento.length !== 10
                    ? "Data no formato DD/MM/AAAA."
                    : undefined
                }
              />
              {submitAttempted && form.dataNascimento.length === 0 && (
                <span style={{ color: "#b91c1c", fontSize: 13, marginBottom: 4, display: "block" }}>
                  A data de nascimento é obrigatória.
                </span>
              )}
              {form.dataNascimento.length > 0 && form.dataNascimento.length !== 10 && (
                <span style={{ color: "#b91c1c", fontSize: 13, marginBottom: 4, display: "block" }}>
                  Data no formato DD/MM/AAAA.
                </span>
              )}
            </div>

            {/* CREF */}
            <div>
              <InputWithIcon
                type="text"
                label="Registro CREF"
                placeholder="000000-G/UF"
                icon={<Hash size={18} />}
                value={form.cref}
                onInputChange={(v: string) => handleChange("cref", v)}
                id="registro-cref"
                hasError={submitAttempted && form.cref.trim() === ""}
                mask={crefMask}
              />
              {submitAttempted && form.cref.trim() === "" && (
                <span style={{ color: "#b91c1c", fontSize: 13, marginBottom: 4, display: "block" }}>
                  O registro CREF é obrigatório.
                </span>
              )}
            </div>
          </div>

          {/* Telefone */}
          <div className="">
          <InputWithIcon
            id="reg-phone"
            type="text"
            placeholder="Telefone"
            label="Telefone"
            onInputChange={(v: string) => handleChange("telefone", v)}
            icon={<Phone />}
            value={form.telefone}
            mask={cellphoneMask}
            maxLength={15}
            hasError={
              (submitAttempted && form.telefone.length === 0) ||
              (form.telefone.length > 0 && form.telefone.replace(/\D/g, "").length !== 11)
            }
          />
          {submitAttempted && form.telefone.length === 0 && (
            <span style={{ color: "#b91c1c", fontSize: 13, marginBottom: 4, display: "block" }}>
              O telefone é obrigatório.
            </span>
          )}
          {form.telefone.length > 0 && form.telefone.replace(/\D/g, "").length !== 11 && (
            <span style={{ color: "#b91c1c", fontSize: 13, marginBottom: 4, display: "block" }}>
              Telefone deve ter 11 dígitos.
            </span>
          )}
          </div>

          <div className={styles.buttonRow}>
            <button
              type="button"
              className={styles.cancelButton}
              disabled={loading}
              onClick={() => {
                setSubmitAttempted(false);
                setTouched({ nome: false, email: false });
                setShowNomeError(false);
                setShowEmailError(false);
                setForm({
                  nome: "",
                  sexo: "",
                  dataNascimento: "",
                  email: "",
                  cref: "",
                  telefone: "",
                });
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Cadastrando..." : "Cadastrar Personal"}
            </button>
          </div>
        </form>
      </WhiteContainer>
    </div>
    </>
  );
}