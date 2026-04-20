import MuiDatePicker from "../../../components/Inputs/MuiDatePicker/MuiDatePicker";
import { useState } from "react";

import styles from "./CreatePersonal.module.css";
import InputWithIcon from "../../../components/Inputs/InputWithIcon/InputWithIcon";
import Select from "../../../components/Inputs/Select/Select";
import { Mail, User, Calendar, Phone, Hash, Users } from "lucide-react";
import { WhiteContainer } from "../../../components/WhiteContainer/WhiteContainer";
import useMobile from "../../../hooks/isMobile";
import classNames from "classnames";
import { cellphoneMask } from "../../../utils/mascara";
import * as validation from "../../../utils/validacao";
import dayjs from "dayjs";
import * as adminService from "../../../constants/admin";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleChange(field: string, value: string) {
    console.log("[handleChange]", field, value);
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function parseTelefone(telefone: string) {
    // Espera formato (11) 91234-5678
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
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const data = {
        nome: form.nome,
        sexo: form.sexo,
        dataNascimento: dayjs(form.dataNascimento, "DD/MM/YYYY").format(
          "YYYY-MM-DD",
        ),
        email: form.email,
        cref: form.cref,
        telefone: parseTelefone(form.telefone),
      };
      console.log("[handleSubmit] Dados enviados:", data);
      console.log("[API] Chamando adminService.createPersonal com:", data);
      const response = await adminService.createPersonal(data);
      console.log("[API] Resposta recebida:", response);
      setSuccess("Personal cadastrado com sucesso!");
      setForm({
        nome: "",
        sexo: "",
        dataNascimento: "",
        email: "",
        cref: "",
        telefone: "",
      });
    } catch (err: any) {
      console.error("[handleSubmit] Erro ao cadastrar personal:", err);
      setError(err?.response?.data?.Exception || "Erro ao cadastrar personal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={classNames(styles.page, { [styles.pageMobile]: isMobile })}>
      <WhiteContainer
        title="Cadastrar Personal"
        titleFontSize={32}
        titleMarginBottom={4}
        contentClassName={styles.container}
      >
        <p className={styles.subtitle}>
          Preencha os dados para criar um novo personal trainer no sistema.
        </p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className="">
            <InputWithIcon
              type="text"
              label="Nome Completo"
              placeholder="Ex: João Carlos Silva"
              icon={<User size={18} />}
              value={form.nome}
              onInputChange={(v: string) => handleChange("nome", v)}
              id="nome-completo"
              hasError={form.nome.length > 0 && form.nome.trim() === ""}
            />
            {form.nome.trim() === "" && (
              <span style={{ color: "#b91c1c", fontSize: 13, marginBottom: 4 }}>
                O nome é obrigatório.
              </span>
            )}
          </div>
          <div className={styles.rowDouble}>
            <div className="">
              <InputWithIcon
                type="email"
                label="Email Profissional"
                placeholder="email@dominio.com"
                icon={<Mail size={18} />}
                value={form.email}
                onInputChange={(v: string) => handleChange("email", v)}
                id="email-profissional"
                hasError={
                  form.email.length > 0 &&
                  !validation
                    .validateEmail(form.email)
                    .startsWith("Email válido")
                }
                hasSuccess={
                  form.email.length > 0 &&
                  validation
                    .validateEmail(form.email)
                    .startsWith("Email válido")
                }
              />
              {form.email.length > 0 &&
                !validation
                  .validateEmail(form.email)
                  .startsWith("Email válido") && (
                  <span
                    style={{ color: "#b91c1c", fontSize: 13, marginBottom: 4 }}
                  >
                    Digite um email válido.
                  </span>
                )}
            </div>
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
              {form.sexo.trim() === "" && (
                <span
                  style={{ color: "#b91c1c", fontSize: 13, marginBottom: 4 }}
                >
                  Selecione o genero.
                </span>
              )}
            </div>
          </div>

          <div className={styles.rowDouble}>
            <div className={styles.muiWrapper}>
                <label htmlFor="data-nascimento" className={styles.selectLabel}>
                Data de Nascimento
                </label>
                <MuiDatePicker
                    label=""
                    value={form.dataNascimento}
                    onChange={v => handleChange("dataNascimento", v)}
                    error={form.dataNascimento.length > 0 && form.dataNascimento.length !== 10}
                    helperText={
                    form.dataNascimento.length > 0 && form.dataNascimento.length !== 10
                        ? "Data no formato DD/MM/AAAA."
                        : undefined
                    }
                />
                {form.dataNascimento.length > 0 && form.dataNascimento.length !== 10 && (
                    <span
                    style={{ color: "#b91c1c", fontSize: 13, marginBottom: 4 }}
                    >
                    A data de nascimento é obrigatória.
                    </span>
                )}
            </div>
            <div className="">
              <InputWithIcon
                type="text"
                label="Registro CREF"
                placeholder="000000-G/UF"
                icon={<Hash size={18} />}
                value={form.cref}
                onInputChange={(v: string) => handleChange("cref", v)}
                id="registro-cref"
                hasError={form.cref.length > 0 && form.cref.trim() === ""}
              />
              {form.cref.trim() === "" && (
                <span
                  style={{ color: "#b91c1c", fontSize: 13, marginBottom: 4 }}
                >
                  O registro CREF é obrigatório.
                </span>
              )}
            </div>
          </div>

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
              form.telefone.length > 0 &&
              form.telefone.replace(/\D/g, "").length !== 11
            }
          />
          {form.telefone.length > 0 &&
            form.telefone.replace(/\D/g, "").length !== 11 && (
              <span style={{ color: "#b91c1c", fontSize: 13, marginBottom: 4 }}>
                Telefone deve ter 11 dígitos.
              </span>
            )}

          {error && (
            <div style={{ color: "#b91c1c", textAlign: "center" }}>{error}</div>
          )}
          {success && (
            <div style={{ color: "#166534", textAlign: "center" }}>
              {success}
            </div>
          )}
          <div className={styles.buttonRow}>
            <button
              type="button"
              className={styles.cancelButton}
              disabled={loading}
              onClick={() =>
                setForm({
                  nome: "",
                  sexo: "",
                  dataNascimento: "",
                  email: "",
                  cref: "",
                  telefone: "",
                })
              }
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={!isFormValid() || loading}
            >
              {loading ? "Cadastrando..." : "Cadastrar Personal"}
            </button>
          </div>
        </form>
      </WhiteContainer>
    </div>
  );
}
