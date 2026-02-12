import styles from "./EditUser.module.css";
import Button from "../../components/Button/Button";
import { UserImg } from "../../components/UserImg/UserImg";
import { WhiteContainer } from "../../components/WhiteContainer/WhiteContainer";
import InputWithIcon from "../../components/Inputs/InputWithIcon/InputWithIcon";
import { IdCard, LockKeyhole, Mail, Phone, User } from "lucide-react";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import useMobile from "../../hooks/isMobile";
import Select from "../../components/Inputs/Select/Select";
import { BASE_URL } from "../../system";
import { findUserData, insertUserImage, removerUserImage, update, softDelete, changePassword } from "../../constants/user";
import type { UpdateUserDTO } from "../../models/user";
import SuccessModal from "../../components/Modal/SuccessModal/SuccessModal";
import TimerModal from "../../components/Modal/TimerModal/TimerModal";
import { cellphoneMask, cpfMask } from "../../utils/mascara";
import { TypeContext } from "../../App";
import type { PersonalDTO } from "../../models/personal";
import { editPersonalProfile } from "../../constants/personal";
import ErrorModal from "../../components/Modal/ErrorModal/ErrorModal";
import { useNavigate } from "react-router-dom";
import { validatePassword } from "../../utils/validacao.ts";
import useModal from "../../hooks/useModal.tsx";
import useClickOutside from "../../hooks/useClickOutside.tsx";
type EditUserState = {
  firstName: string;
  lastName: string;
  cpf: string;
  cref: string;
  phone: string;
  gender: string;
  email: string;
  password: string;
  birthDate: string;
};

type EditUserAction =
  | { type: "setFirstName"; payload: string }
  | { type: "setLastName"; payload: string }
  | { type: "setCPF"; payload: string }
  | { type: "setCREF"; payload: string }
  | { type: "setPhone"; payload: string }
  | { type: "setGender"; payload: string }
  | { type: "setEmail"; payload: string }
  | { type: "setPassword"; payload: string }
  | { type: "setBirthDate"; payload: string };

function reducer(state: EditUserState, action: EditUserAction): EditUserState {
  switch (action.type) {
    case "setFirstName":
      return { ...state, firstName: action.payload };
    case "setLastName":
      return { ...state, lastName: action.payload };
    case "setCPF":
      return { ...state, cpf: action.payload };
    case "setCREF":
      return { ...state, cref: action.payload };
    case "setPhone":
      return { ...state, phone: action.payload };
    case "setGender":
      return { ...state, gender: action.payload };
    case "setEmail":
      return { ...state, email: action.payload };
    case "setPassword":
      return { ...state, password: action.payload };
    case "setBirthDate":
      return { ...state, birthDate: action.payload };
    default:
      return state;
  }
}

const initialEditUserState: EditUserState = {
  firstName: "",
  lastName: "",
  cpf: "",
  cref: "",
  phone: "",
  gender: "",
  email: "",
  password: "",
  birthDate: "",
};

export default function EditUser() {
  const isMobile = useMobile();
  const navigator = useNavigate();

  const type = useContext(TypeContext);

  const [confirmingDelete, setConfirmingDelete] = useState<boolean>(false);



  const [state, dispatch] = useReducer(reducer, initialEditUserState);

  const {
    openModal,
    setOpenModal,
    textModal,
    setTextModal
  } = useModal(null, { title: "", content: "" })

  const [password, setPassword] = useState<{ currentPassword: string; confirmPassword: string }>({
    currentPassword: "",
    confirmPassword: "",
  }
  )
  const [userImage, setUserImage] = useState<string>("");
  const [userImageFormData, setUserImageFormData] = useState<FormData>(new FormData());
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewImageFormData, setPreviewImageFormData] = useState<FormData>(new FormData());

  const imagePreviewModal = useRef(null);

  useClickOutside({
    ref: imagePreviewModal,
    callback: () => {
        setOpenModal(null);
    }
  });

  async function handleUpdateImage(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      setOpenModal("adjustAvatar");

      const file = event.target.files[0];

      const formData = new FormData();
      formData.append("imagem", file);

      const imageUrl = URL.createObjectURL(file);

      setPreviewImage(imageUrl);
      setPreviewImageFormData(formData);
    }
  }

  function handleRemoveImage() {
    setUserImage("");
    const formData = new FormData();
    formData.append("imagem", "");
    setUserImageFormData(formData);
    removerUserImage().then(() => {
      console.log("Imagem do usuário removida com sucesso!");
      setTextModal({ title: "Imagem removida!", content: "Sua imagem de perfil foi removida com sucesso." });
      setOpenModal("success");
    }).catch((error) => {
      console.error("Erro ao remover imagem do usuário:", error);
    });



  }

  function handleGetUserInfo() {
    findUserData().then((response) => {
      const userData = response.data;
      console.log("Dados do usuário:", userData);
      dispatch({ type: "setFirstName", payload: userData.nome });
      dispatch({ type: "setCPF", payload: userData.cpf });
      dispatch({ type: "setCREF", payload: userData.cref });
      dispatch({ type: "setPhone", payload: userData.telefones[0].numeroCompleto });
      dispatch({ type: "setGender", payload: userData.sexo });
      dispatch({ type: "setEmail", payload: userData.email });
      dispatch({ type: "setBirthDate", payload: userData.dataNascimento });

      if (userData.caminhoFoto) {
        setUserImage(`${BASE_URL}/usuarios/me/imagem`);

      }

    }).catch((error) => {
      console.error("Erro ao buscar dados do usuário:", error);
    });
  }

  function handleUpdateUserInfo() {
    console.log(state.phone.substring(5).replace("-", ""))
    const options: UpdateUserDTO = {
      nome: state.firstName,
      telefones: [{ numero: state.phone.substring(5).replace("-", ""), ddd: state.phone.substring(1, 3), id: 1 }],
      sexo: state.gender,
      email: state.email,
    };
    console.log("options", userImageFormData);
    update(options)
      .then(() => {
        if (previewImageFormData.has("imagem") && previewImageFormData.get("imagem") !== "") {
          insertUserImage(previewImageFormData)
            .then(() => {
              if (previewImage) {
                console.log("Imagem do usuário atualizada com sucesso!", previewImage);
                setUserImage(previewImage);
                setUserImageFormData(previewImageFormData);
              }
              console.log("Imagem do usuário atualizada com sucesso!");
              setTextModal({ title: "Perfil atualizado!", content: "Seu perfil foi atualizado com sucesso." });
              setOpenModal("success");
            })
            .catch((error) => {
              console.error("Erro ao atualizar imagem do usuário:", error);
              setTextModal({ title: "Houve um erro", content: error.response?.data?.Exception });
              setOpenModal("error");
            });
        } else {
          setTextModal({ title: "Perfil atualizado!", content: "Seu perfil foi atualizado com sucesso." });
          setOpenModal("success");
        }
      })
      .catch((error) => {
        console.error("Erro ao atualizar dados do usuário:", error.response?.data?.Exception);
        console.log("previewImageFormData", previewImageFormData);
        setTextModal({
          title: "Houve um erro",
          content: error.response?.data?.Exception || "Não foi possível atualizar seu perfil.",
        });
        setOpenModal("error");
      });
  }

  function handleUpdatePersonalInfo() {
    console.log(state.phone.substring(5).replace("-", ""))
    const options: PersonalDTO = {
      nome: state.firstName,
      telefone: { numero: state.phone, ddd: "11", pais: "55" },
      sexo: state.gender,
      email: state.email,
    }

    editPersonalProfile(options).then(() => {
      setTextModal({ title: "Perfil atualizado!", content: "Seu perfil foi atualizado com sucesso." });
      setOpenModal("success");
    }).catch((error) => {
      console.log("previewImageFormData", previewImageFormData);
      console.error("Erro ao atualizar dados do usuário:", error);
      setTextModal({ title: "Houve um erro", content: error.response.data.Exception || "Não foi possível atualizar seu perfil." });
      setOpenModal("error");
    });

    if (previewImageFormData.has("imagem") && previewImageFormData.get("imagem") !== "") {
      console.log("inserting image");
      insertUserImage(previewImageFormData).then(() => {
        console.log("Imagem do usuário atualizada com sucesso!");
        setUserImage(previewImage);
        setUserImageFormData(previewImageFormData);
        setTextModal({ title: "Foto atualizada!", content: "Sua foto de perfil foi atualizada com sucesso." });
        setOpenModal("success");
      }).catch((error) => {
        console.log("previewImageFormData", previewImageFormData);
        console.error("Erro ao atualizar imagem do usuário:", error);
        setTextModal({ title: "Houve um erro", content: "A imagem é muito pesada para ser carregada." });
        setOpenModal("error");
        return;
      });
    }


    setOpenModal("success");
  }


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
    handleGetUserInfo();
  }, []);

  return (
    <>
      <div className={styles.editUserGrid}>
        {!isMobile &&
          <div className={styles.goBackContainer}>
            <h1>Editar Perfil</h1>
          </div>
        }

        <div className={styles.profileSection}>
          <WhiteContainer containerClassName={styles.profileWhiteContainer} title="Foto de Perfil" titleMarginBottom={25} gap={30}>
            {userImage ?
              <UserImg
                Source={userImage}
                Height={216}
                Width={216}
                Alt="foto"
              />
              :
              <User width={216} height={216} />
            }
            <div className={styles.atualizarFotoContainer}>
              <div>
                <input type="file" name="" accept="image/jpeg, image/png, image/jpg" id="upload-photo" onChange={(e) => handleUpdateImage(e)} style={{ display: "none" }} />
                {/* <input type="button" id="upload-photo" onClick={() => setOpenModal("adjustAvatar")} style={{ display: "none" }} /> */}
                <label htmlFor="upload-photo">
                  <span>Atualizar Foto</span>
                </label>
              </div>

              {userImage && (
                <div >
                  <Button
                    typeButton="other"
                    title="Remover Foto"
                    type="button"
                    classNameVariable="buttonRemoveImage"
                    onClick={() => {
                      setConfirmingDelete(false);
                      setOpenModal("timer");
                    }}
                  />
                </div>
              )}
            </div>
          </WhiteContainer>
        </div>

        <div className={styles.personalInfo}>
          <WhiteContainer title="Informações Pessoais" contentClassName={styles.personalInfoGrid} gap={20}>
            <InputWithIcon
              id="nome"
              type="text"
              placeholder="Digite seu nome"
              icon={<User />}
              label="Nome"
              value={state.firstName}
              onInputChange={(value: string) => dispatch({ type: "setFirstName", payload: value })}
            ></InputWithIcon>
            {type?.type === "aluno" ? (
              <InputWithIcon
                id="cpf"
                type="text"
                placeholder="Digite seu CPF"
                icon={<IdCard />}
                label="CPF"
                value={state.cpf}
                onInputChange={(value: string) => dispatch({ type: "setCPF", payload: value })}
                mask={cpfMask}
                disabled={true}
              />
            ) : (
              <InputWithIcon
                id="cpf"
                type="text"
                placeholder="Digite seu CREF"
                icon={<IdCard />}
                label="CREF"
                value={state.cref}
                onInputChange={(value: string) => dispatch({ type: "setCREF", payload: value })}
                disabled={true}
              />
            )}

            <InputWithIcon
              id="telefone"
              type="text"
              placeholder="Digite seu telefone"
              icon={<Phone />}
              label="Telefone"
              value={state.phone}
              onInputChange={(value: string) => dispatch({ type: "setPhone", payload: value })}
              mask={cellphoneMask}
            ></InputWithIcon>
            <Select
              id="genero"
              label="Gênero"
              options={[
                "Masculino",
                "Feminino",
                "Outro",
              ]}
              placeholder="Selecione seu gênero"
              value={state.gender}
              onInputChange={(value: string) => dispatch({ type: "setGender", payload: value })}
            />
          </WhiteContainer>
        </div>

        <div className={styles.loginInfo}>
          <WhiteContainer gap={20} contentClassName={styles.loginInfoContainer} title="Informações de Login">
            <InputWithIcon
              id="email"
              type="email"
              placeholder="Digite seu email"
              icon={<Mail />}
              label="Email"
              value={state.email}
              onInputChange={(value: string) => dispatch({ type: "setEmail", payload: value })}
            ></InputWithIcon>
            <InputWithIcon
              id="senha"
              type="password"
              placeholder="*************"
              icon={<LockKeyhole />}
              label="Senha Atual"
              isPassword={password.currentPassword ? true : false}
              value={password.currentPassword}
              onInputChange={(value: string) => setPassword({
                ...password,
                currentPassword: value
              })}
            ></InputWithIcon>
            <InputWithIcon
              id="senha"
              type="password"
              placeholder="*************"
              icon={<LockKeyhole />}
              label="Nova Senha"
              isPassword={password.confirmPassword ? true : false}
              value={password.confirmPassword}
              onInputChange={(value: string) => setPassword({
                ...password,
                confirmPassword: value
              })}
            ></InputWithIcon>
            <Button classNameDiv={styles.saveButton} classNameVariable={styles.btnEditPassword}
              title="Alterar Senha" type="button" onClick={() => updatePassword()}
            />
          </WhiteContainer>
        </div>

        <div className={styles.footer}>
          <div className={styles.dashLine}></div>
          <div className={styles.divButtons}>
            <Button title="Salvar Alterações" type="button" onClick={type?.type === "aluno" ? handleUpdateUserInfo : handleUpdatePersonalInfo} />
            <Button
              title="Apagar Perfil"
              type="button"
              classNameVariable="buttonDanger"
              onClick={() => {
                setConfirmingDelete(true);
                setOpenModal("timer");
              }}
            />
          </div>
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
          closeThen={() => {
            setOpenModal(null);
            setConfirmingDelete(false);
          }}
          callSuccessModal={() => {
            if (confirmingDelete) {
              deleteUser();
            } else {
              handleRemoveImage();
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

      {openModal === "adjustAvatar" && (
        <>
          <div className={`overlay z-auto!`}></div>
          <div ref={imagePreviewModal}  className="   fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center z-50">
            <div className={styles.profileSection + "max-w-full! max-h-full!"}>
              <WhiteContainer containerClassName={styles.profileWhiteContainer} title="Foto de Perfil" titleMarginBottom={25} gap={30}>
                {previewImage &&
                  <UserImg
                    Source={previewImage}
                    classname="border-2 border-gray-300"
                    Height={500}
                    Width={500}
                    Alt="foto"
                  />
                }
                <div className={styles.atualizarFotoContainer}>
                  <div>
                    {/* <input type="file" name="" accept="image/jpeg, image/png, image/jpg" id="upload-photo" onChange={(e) => handleUpdateImage(e)} style={{ display: "none" }} /> */}
                    <Button
                      typeButton="other"
                      title="Confirmar"
                      type="button"
                      classNameVariable="buttonRemoveImage"
                      onClick={() => {
                        (type?.type === "aluno" ? handleUpdateUserInfo : handleUpdatePersonalInfo)();
                      }}
                    />
                  </div>

                  <div >
                    <div>
                      <input type="file" name="" accept="image/jpeg, image/png, image/jpg" id="upload-photo" onChange={(e) => handleUpdateImage(e)} style={{ display: "none" }} />
                      {/* <input type="button" id="upload-photo" onClick={() => setOpenModal("adjustAvatar")} style={{ display: "none" }} /> */}
                      <label htmlFor="upload-photo">
                        <span>Mudar Foto</span>
                      </label>
                    </div>
                  </div>

                  <div >
                    <Button
                      typeButton="other"
                      title="Cancelar"
                      type="button"
                      classNameVariable="buttonRemoveImage"
                      onClick={() => {
                        setOpenModal(null);
                      }}
                    />
                  </div>
                </div>
              </WhiteContainer>
            </div>
          </div>
        </>
      )}
    </>
  );
}
