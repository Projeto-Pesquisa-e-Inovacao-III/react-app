import styles from "./AnamnesisInformations.module.css";
import { WhiteContainer } from "../../../components/WhiteContainer/WhiteContainer.tsx";
import InputWithIcon from "../../../components/Inputs/InputWithIcon/InputWithIcon.tsx";
import { Dot, HeartCrack, Lock, Mail, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";
import useMobile from "../../../hooks/isMobile.tsx";
import { findUserData, softDelete, changePassword } from "../../../constants/user.ts";
import SuccessModal from "../../../components/Modal/SuccessModal/SuccessModal.tsx";
import TimerModal from "../../../components/Modal/TimerModal/TimerModal.tsx";
import ErrorModal from "../../../components/Modal/ErrorModal/ErrorModal.tsx";
import { Link, useNavigate } from "react-router-dom";
import { validatePassword } from "../../../utils/validacao.ts";
import useModal from "../../../hooks/useModal.tsx";
import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import SmallerButton from "../../../components/SmallerButton/SmallerButton.tsx";
import type { AnamnesisData } from "../../../models/anamnesis.ts";
import { getAnamnesis } from "../../../constants/anamnesis.ts";
import AsideEditUser from "../../../components/EditUser/AsideEditUser.tsx";
import Select from "../../../components/Select/Select.tsx";

type UserPhone = {
  id: number;
  ddd: string;
  numero: string;
  numeroCompleto?: string;
};

type UserDataResponse = {
  ativo: boolean;
  caminhoFoto: string | null;
  cref?: string;
  cpf?: string;
  dataNascimento: string;
  email: string;
  id: number;
  nome: string;
  sexo: string;
  telefones: UserPhone[];
};

export default function AnamnesisInformations() {
  const isMobile = useMobile();

  const {
    openModal,
    setOpenModal,
    textModal,
    setTextModal
  } = useModal(null, { title: "", content: "" })

  const anamnesisInfo = useQuery<AnamnesisData>({
    queryKey: ["anamnesisInfo"],
    queryFn: async () => {
      const response = await getAnamnesis();
      return response.data;
    }
  });
  // {"altura":1.75,"peso":70.5,"objectivoPrincipal":"Ganho de massa muscular","rotina":"Trabalho das 9h às 18h, treino à noite","condicoes":[{"situacao":"Controlada com medicamento","tipo":"PADRAO"},{"situacao":"Sem tratamento","tipo":"PADRAO"}],"nivelDeAtividade":"SEDENTARIO","observacaoSaude":"Sinto dores no joelho direito ao agachar"}
  const [anamnesisData, setAnamnesisData] = useState<AnamnesisData>({
    altura: 0,
    peso: 0,
    objectivoPrincipal: "",
    rotina: "",
    condicoes: [],
    nivelDeAtividade: "SEDENTARIO",
    observacaoSaude: ""
  });

  useEffect(() => {
    if (anamnesisInfo.data) {
      setAnamnesisData(anamnesisInfo.data);
    }
  }, [anamnesisInfo.data])

  console.log(anamnesisInfo.data)

  const [openSelectId, setOpenSelectId] = useState<string | null>(null);

  return (
    <>
      <div className={styles.editUserGrid}>
        {!isMobile &&
          <div className={styles.goBackContainer}>
            <h1>Editar Perfil</h1>
          </div>
        }

        <div className={styles.personalInfo}>
          <WhiteContainer title="Anamnese / Saúde" icon={<Shield size={22} />} titleFontSize={20} titleClassName={"font-bold! flex! items-center gap-3"} contentClassName={styles.personalInfoGrid} gap={20}>
            <div className={styles.personalDataTitle} id="personalDataTitle">
              <Dot size={56} className="text-gray-500" />
              <h3>Dados pessoais</h3>
            </div>
            <InputWithIcon
              id="height"
              type="text"
              placeholder="Ex: 175"
              icon={<Mail size={22} />}
              disabled={false}
              label="Altura (cm)"
              isLoading={anamnesisInfo.isLoading}
              value={anamnesisInfo.data?.altura || ""}
              onInputChange={(value: string) => { setAnamnesisData({ ...anamnesisData, altura: Number(value) }) }}
            ></InputWithIcon>

            <InputWithIcon
              id="weight"
              type="text"
              placeholder="Ex: 70"
              icon={<Mail size={22} />}
              label="Peso (kg)"
              isLoading={anamnesisInfo.isLoading}
              value={anamnesisInfo.data?.peso || ""}
              onInputChange={(value: string) => { setAnamnesisData({ ...anamnesisData, peso: Number(value) }) }}
            ></InputWithIcon>

            <Select
              id="mainObjective"
              defaultValue={anamnesisInfo.data?.objectivoPrincipal || ""}
              label="Objetivo principal"
              selectPlaceholder="Selecione seu objetivo"
              values={[
                { label: "Ganho de massa muscular", value: "Ganho de massa muscular" },
                { label: "Perda de peso", value: "Perda de peso" },
                { label: "Manutenção da massa muscular", value: "Manutenção da massa muscular" },
              ]}
              onSelectStatusChange={(value: string) => setAnamnesisData({ ...anamnesisData, objectivoPrincipal: value })}
              openSelectId={openSelectId}
              setOpenSelectId={setOpenSelectId}
              showSearchInput={false}
              showSelectAll={false}
              labelClassName="text-sm font-normal!"
              triggerClassName="pt-3 pr-4 pl-4 pb-3 w-full! text-[0.95rem]!;"
              selectWrapperClassName="bg-white! border border-gray-300! w-full!"
              containerClassName="bg-white!"
            />

          </WhiteContainer>
        </div>

        <div className={styles.pagesSection}>
          <WhiteContainer containerClassName={styles.profileWhiteContainer} title="" titleMarginBottom={25} gap={30}>
            <AsideEditUser activeTab="anamnesis" />
          </WhiteContainer>
        </div>
      </div>

      {openModal === "success" && (
        <SuccessModal
          isMobile={isMobile}
          closeThen={() => setOpenModal(null)}
          title={textModal.title}
          content={textModal.content}
        />
      )}

      {/* {openModal === "timer" && (
        <TimerModal
          isMobile={isMobile}
          isDelete={true}
          closeThen={() => {
            setOpenModal(null);
            setConfirmingDelete(false);
          }}
          callSuccessModal={() => {
            if (confirmingDelete) {
              deleteUser();
            }
            setConfirmingDelete(false);
            setOpenModal(null);
          }}
          title={confirmingDelete ? "Apagar perfil?" : "Remover imagem?"}
          buttonTitle={confirmingDelete ? "Apagar" : "Remover"}
          content={
            confirmingDelete
              ? "Tem certeza que deseja apagar seu perfil? Isso é irreversível."
              : "Tem certeza que deseja remover sua imagem de perfil?"
          }
        />
      )} */}

      {openModal === "error" && (
        <ErrorModal
          closeThen={() => setOpenModal(null)}
          title={textModal.title}
          content={textModal.content}
        />
      )}
    </>
  );
}
