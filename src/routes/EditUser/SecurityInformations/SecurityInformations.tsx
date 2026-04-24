import styles from "./SecurityInformations.module.css";
import { WhiteContainer } from "../../../components/WhiteContainer/WhiteContainer.tsx";
import InputWithIcon from "../../../components/Inputs/InputWithIcon/InputWithIcon.tsx";
import { HeartCrack, Lock, Mail, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import useMobile from "../../../hooks/isMobile.tsx";
import { findUserData, softDelete, changePassword } from "../../../constants/user.ts";
import SuccessModal from "../../../components/Modal/SuccessModal/SuccessModal.tsx";
import TimerModal from "../../../components/Modal/TimerModal/TimerModal.tsx";
import ErrorModal from "../../../components/Modal/ErrorModal/ErrorModal.tsx";
import { useNavigate } from "react-router-dom";
import { validatePassword } from "../../../utils/validacao.ts";
import useModal from "../../../hooks/useModal.tsx";
import { useQuery } from "@tanstack/react-query";
import SmallerButton from "../../../components/SmallerButton/SmallerButton.tsx";
import AsideEditUser from "../../../components/EditUser/AsideEditUser.tsx";

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

export default function SecurityInformations() {
  const isMobile = useMobile();
  const navigator = useNavigate();
  
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState<{ currentPassword: string; confirmPassword: string }>({
    currentPassword: "",
    confirmPassword: "",
  }
  )

  const [confirmingDelete, setConfirmingDelete] = useState<boolean>(false);


  const {
    openModal,
    setOpenModal,
    textModal,
    setTextModal
  } = useModal(null, { title: "", content: "" })



  const userInfo = useQuery<UserDataResponse>({
    queryKey: ["userData"],
    queryFn: async () => {
      const response = await findUserData();
      return response.data as UserDataResponse;
    },
  });


  function deleteUser() {
    softDelete()
      .then(() => {
        navigator("/logout");
      })
      .catch((_error: unknown) => {
        console.error("Erro ao apagar usuário:", _error);
        setTextModal({ title: "Houve um erro", content: "Erro ao apagar usuário." });
        setOpenModal("error");
      });
  }

  function updatePassword() {
    const current = password.currentPassword ?? "";
    const newP = password.confirmPassword ?? "";

    if (!current) {
      setTextModal({ title: "Houve um erro", content: "Senha atual obrigatória." });
      setOpenModal("error");
      return;
    }

    if (!newP) {
      setTextModal({ title: "Houve um erro", content: "Preencha a nova senha." });
      setOpenModal("error");
      return;
    }

    const validation = validatePassword(newP);
    if (validation !== "password válida!") {
      setTextModal({ title: "Houve um erro", content: "Senha inválida. A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais." });
      setOpenModal("error");
      return;
    }
    changePassword(current, newP)
      .then(() => {
        setPassword({
          currentPassword: "",
          confirmPassword: ""
        })
        setTextModal({ title: "Senha atualizada", content: "Sua senha foi atualizada com sucesso." });
        setOpenModal("success");
      })
      .catch((error) => {
        console.error("Erro ao atualizar senha:", error);
        setTextModal({ title: "Houve um erro", content: error.response?.data?.Exception || "Não foi possível atualizar sua senha." });
        setOpenModal("error");
      });
  }
  useEffect(() => {
    if (userInfo.data?.email) {
      setEmail(userInfo.data.email);
    }
  }, [userInfo.data]);

  return (
    <>
      <div className={styles.editUserGrid}>
        {!isMobile &&
          <div className={styles.goBackContainer}>
            <h1>Editar Perfil</h1>
          </div>
        }

        <div className={styles.personalInfo}>
          <WhiteContainer title="Segurança" icon={<Shield size={22} />} titleFontSize={20} titleClassName={"font-bold! flex! items-center gap-3"} contentClassName={styles.personalInfoGrid} gap={20}>
            <InputWithIcon
              id="email"
              type="text"
              placeholder="Digite seu email"
              icon={<Mail size={22} />}
              label="Email"
              disabled={true}
              isLoading={userInfo.isLoading}
              classNameInput="bg-gray-100! cursor-not-allowed!"
              value={email}
              onInputChange={(value: string) => setEmail(value)}
            ></InputWithIcon>

            <InputWithIcon
              id="senhaAtual"
              type="password"
              isPassword={true}
              placeholder="Senha atual"
              icon={<Lock size={22} />}
              isLoading={userInfo.isLoading}
              label="Senha atual"
              value={password.currentPassword}
              onInputChange={(value: string) => setPassword({ ...password, currentPassword: value })}
            ></InputWithIcon>

            <InputWithIcon
              id="novaSenha"
              type="password"
              isPassword={true}
              placeholder="Nova senha"
              icon={<Lock size={22} />}
              isLoading={userInfo.isLoading}
              label="Nova senha"
              value={password.confirmPassword}
              onInputChange={(value: string) => setPassword({ ...password, confirmPassword: value })}
            ></InputWithIcon>

            <div className={styles.footer}>
              <div className={styles.dashLine}></div>
              <div className={styles.divButtons}>
                <SmallerButton
                  type="button"
                  classname="w-full! transition h-12!"
                  title="Salvar Alterações"
                  handleButtonClick={updatePassword}
                />
                <SmallerButton
                  title="Descartar alterações"
                  type="button"
                  classname="w-full! h-12! bg-white! text-gray-500! transition hover:bg-gray-100! border! border-gray-300!"
                  handleButtonClick={() => {
                    setEmail(userInfo.data?.email || "");
                    setPassword({
                      currentPassword: "",
                      confirmPassword: ""
                    })
                  }}
                />
              </div>
            </div>
          </WhiteContainer>
        </div>

        <div className={styles.deleteAccountSection}>
          <WhiteContainer containerClassName={styles.deleteAccountWhiteContainer} title="" titleMarginBottom={25} gap={30}>
            <div className={styles.deleteAccountContent}>
              <SmallerButton
                icon={<HeartCrack />}
                type="button"
                classname="w-full! transition bg-red-900!"
                title="Apagar minha conta"
                handleButtonClick={() => {
                  setConfirmingDelete(true);
                  setOpenModal("timer");
                }}
              />
            </div>
          </WhiteContainer>
        </div>

        <div className={styles.pagesSection}>
          <WhiteContainer containerClassName={styles.profileWhiteContainer} title="" titleMarginBottom={25} gap={30}>
            <AsideEditUser activeTab="security" />
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

      {openModal === "timer" && (
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
      )}

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
