import styles from "./EditUser.module.css";
import Button from "../../../components/Button/Button.tsx";
import { UserImg } from "../../../components/UserImg/UserImg.tsx";
import { WhiteContainer } from "../../../components/WhiteContainer/WhiteContainer.tsx";
import InputWithIcon from "../../../components/Inputs/InputWithIcon/InputWithIcon.tsx";
import { IdCard, Phone, Shield, Upload, User } from "lucide-react";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import useMobile from "../../../hooks/isMobile.tsx";
import { findUserData, insertUserImage, removerUserImage, update, softDelete} from "../../../constants/user.ts";
import type { UpdateUserDTO } from "../../../models/user.ts";
import SuccessModal from "../../../components/Modal/SuccessModal/SuccessModal.tsx";
import TimerModal from "../../../components/Modal/TimerModal/TimerModal.tsx";
import { cellphoneMask, cpfMask } from "../../../utils/mascara.ts";
import { TypeContext } from "../../../App.tsx";
import type { PersonalDTO } from "../../../models/personal.ts";
import { editPersonalProfile } from "../../../constants/personal.ts";
import ErrorModal from "../../../components/Modal/ErrorModal/ErrorModal.tsx";
import { Link, useNavigate } from "react-router-dom";
import useModal from "../../../hooks/useModal.tsx";
import useClickOutside from "../../../hooks/useClickOutside.tsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import classNames from "classnames";
import Select from "../../../components/Select/Select.tsx";
import SmallerButton from "../../../components/SmallerButton/SmallerButton.tsx";
import { BASE_URL } from "../../../system.ts";
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

type EditUserAction =
  | { type: "hydrateForm"; payload: UserDataResponse }
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
    case "hydrateForm":
      return {
        ...state,
        firstName: action.payload.nome,
        cpf: action.payload.cpf ?? "",
        cref: action.payload.cref ?? "",
        phone: action.payload.telefones?.[0]?.numeroCompleto ?? "",
        gender: action.payload.sexo ?? "",
        email: action.payload.email ?? "",
        birthDate: action.payload.dataNascimento ?? "",
      };
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

  const userInfo = useQuery<UserDataResponse>({
    queryKey: ["userData"],
    queryFn: async () => {
      const response = await findUserData();
      return response.data as UserDataResponse;
    },
  });

  useEffect(() => {
    if (!userInfo.data) return;

    dispatch({
      type: "hydrateForm",
      payload: userInfo.data,
    });

    if (userInfo.data.caminhoFoto) {
      setUserImage(`${BASE_URL}/usuarios/me/imagem`);
    }


  }, [userInfo.data]);

  const queryClient = useQueryClient();




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
      .then(async () => {

        if (previewImageFormData.has("imagem") && previewImageFormData.get("imagem") !== "") {
          insertUserImage(previewImageFormData)
            .then(async () => {
              if (previewImage) {
                console.log("Imagem do usuário atualizada com sucesso!", previewImage);
                setUserImage(previewImage);
                setUserImageFormData(previewImageFormData);
              }
              console.log("Imagem do usuário atualizada com sucesso!");
              setTextModal({ title: "Perfil atualizado!", content: "Seu perfil foi atualizado com sucesso." });
              setOpenModal("success");
              await queryClient.refetchQueries({
                queryKey: ["userData"]
              });
            })
            .catch((error) => {
              console.error("Erro ao atualizar imagem do usuário:", error);
              setTextModal({ title: "Houve um erro", content: error.response?.data?.Exception });
              setOpenModal("error");
            });
          await queryClient.refetchQueries({
            queryKey: ["userData"]
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

    editPersonalProfile(options).then(async () => {
      setTextModal({ title: "Perfil atualizado!", content: "Seu perfil foi atualizado com sucesso." });
      setOpenModal("success");
      await queryClient.refetchQueries({
        queryKey: ["userData"]
      });
    }).catch((error) => {
      console.log("previewImageFormData", previewImageFormData);
      console.error("Erro ao atualizar dados do usuário:", error);
      setTextModal({ title: "Houve um erro", content: error.response.data.Exception || "Não foi possível atualizar seu perfil." });
      setOpenModal("error");
    });

    if (previewImageFormData.has("imagem") && previewImageFormData.get("imagem") !== "") {
      console.log("inserting image");
      insertUserImage(previewImageFormData).then(async () => {
        console.log("Imagem do usuário atualizada com sucesso!");
        setUserImage(previewImage);
        setUserImageFormData(previewImageFormData);
        setTextModal({ title: "Foto atualizada!", content: "Sua foto de perfil foi atualizada com sucesso." });
        setOpenModal("success");
        await queryClient.refetchQueries({
          queryKey: ["userData"]
        });
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

  const [openSelectId, setOpenSelectId] = useState<string | null>(null);

  function handleUndoChanges() {
    if (userInfo.data) {
      dispatch({
        type: "hydrateForm",
        payload: userInfo.data,
      });
      if (userInfo.data.caminhoFoto) {
        setUserImage(userInfo.data.caminhoFoto);
      } else {
        setUserImage("");
      }
    }
  }

  console.log(userImage)

  return (
    <>
      <div className={styles.editUserGrid}>
        {!isMobile &&
          <div className={styles.goBackContainer}>
            <h1>Editar Perfil</h1>
          </div>
        }

        <div className={styles.personalInfo}>
          <WhiteContainer title="Informações Pessoais" icon={<User size={22} />} titleFontSize={20} titleClassName={"font-bold! flex! items-center gap-3"} contentClassName={styles.personalInfoGrid} gap={20}>
            <div className={styles.fotoArea} >
              <div className={classNames("flex gap-8 items-center", { ["flex flex-col text-center gap-8 items-center"]: isMobile })}>
                <div className="bg-gray-300 flex items-center rounded-full ">
                  {userImage ? (
                    <div className="w-max">
                      <UserImg
                        classname="border-2 border-gray-300"
                        Source={userImage}
                        Height={150}
                        Width={150}
                        Alt="foto"
                      />
                    </div>
                  ) : (
                    <User width={150} height={150} />
                  )}
                </div>

                <div className={classNames("flex flex-col justify-between gap-4", { ["text-center w-full"]: isMobile })}>
                  <span className="font-semibold text-xl">Foto de Perfil</span>
                  <span className={classNames("text-slate-500 w-3/5", { ["text-slate-500 w-full"]: isMobile })}>Formatos aceitos: JPG, PNG. Tamanho máximo: 5MB.
                    Esta foto será visível para o personal.</span>
                  <div className={styles.atualizarFotoContainer}>
                    <div className={classNames("w-1/3!", { ["w-full!"]: isMobile })}>
                      <input type="file" name="" accept="image/jpeg, image/png, image/jpg" id="upload-photo" onChange={(e) => handleUpdateImage(e)} style={{ display: "none" }} />
                      {/* <input type="button" id="upload-photo" onClick={() => setOpenModal("adjustAvatar")} style={{ display: "none" }} /> */}
                      <label htmlFor="upload-photo">
                        <span className="flex items-center h-12! gap-4 border-2 border-indigo bg-white! text-black! rounded-2xl!"><Upload /> Atualizar Foto</span>
                      </label>
                    </div>

                    {userImage && (
                      <div >
                        <Button
                          typeButton="other"
                          title="Remover Foto"
                          type="button"
                          classNameDiv=""
                          classNameVariable="buttonRemoveImage "
                          onClick={() => {
                            setConfirmingDelete(false);
                            setOpenModal("timer");
                          }}
                        />
                      </div>
                    )}

                  </div>

                </div>
              </div>
            </div>


            <InputWithIcon
              id="nome"
              type="text"
              placeholder="Digite seu nome"
              icon={<User />}
              label="Nome"
              isLoading={userInfo.isLoading}
              value={state.firstName}
              onInputChange={(value: string) => dispatch({ type: "setFirstName", payload: value })}
            ></InputWithIcon>
            {type?.type === "aluno" ? (
              <InputWithIcon
                id="cpf"
                type="text"
                placeholder="Digite seu CPF"
                icon={<IdCard />}
                isLoading={userInfo.isLoading}
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
                isLoading={userInfo.isLoading}
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
              isLoading={userInfo.isLoading}
              label="Telefone"
              value={state.phone}
              onInputChange={(value: string) => dispatch({ type: "setPhone", payload: value })}
              mask={cellphoneMask}
            ></InputWithIcon>
            {/* <Select
              id="genero"
              label="Gênero"
              options={[
                "Masculino",
                "Feminino",
                "Outro",
              ]}
              placeholder="Selecione seu gênero"
              value={state.gender}
              isLoading={userInfo.isLoading}
              onInputChange={(value: string) => dispatch({ type: "setGender", payload: value })}
            />*/}

            {/* <Select
              defaultValue="PRESENCIAL"
              id="type-select"
              openSelectId={openSelectId}
              setOpenSelectId={setOpenSelectId}
              onSelectStatusChange={setSelectedType}
              values={[
                  { label: "Presencial", value: "PRESENCIAL" },
                  { label: "Residencial", value: "RESIDENCIAL" },
                  { label: "Funcional", value: "FUNCIONAL" }
              ]}
              containerClassName="w-full!"
              triggerClassName="p-3 w-full!"
              selectWrapperClassName="bg-white! rounded-xl! w-full!"
              selectPlaceholder="Selecione o tipo"
              labelClassName="text-slate-500! font-bold text-sm uppercase"
              label="Tipo de Atendimento"
              showSelectAll={false}
              showSearchInput={false}
          /> */}

            <div className={classNames({ ["w-full!"]: isMobile })} id="genero">
              <Select
                id="genero"
                defaultValue={state.gender}
                label="Gênero"
                selectPlaceholder="Selecione o gênero"
                values={[
                  { label: "Masculino", value: "M" },
                  { label: "Feminino", value: "F" },
                  { label: "Outro", value: "O" },
                ]}
                onSelectStatusChange={(value: string) => dispatch({ type: "setGender", payload: value })}
                openSelectId={openSelectId}
                setOpenSelectId={setOpenSelectId}
                showSearchInput={false}
                showSelectAll={false}
                triggerClassName="pt-3 pr-4 pl-4 pb-3 w-full!"
                selectWrapperClassName="rounded-xl! w-full!"
              />
            </div>


            <div className={styles.footer}>
              <div className={styles.dashLine}></div>
              <div className={styles.divButtons}>
                <SmallerButton
                  type="button"
                  classname="w-full! transition "
                  title="Salvar Alterações"
                  handleButtonClick={type?.type === "aluno" ? handleUpdateUserInfo : handleUpdatePersonalInfo} />
                <SmallerButton
                  title="Descartar alterações"
                  type="button"
                  classname="w-full! bg-white! text-gray-500! transition hover:bg-gray-100! border! border-gray-300!"
                  handleButtonClick={() => handleUndoChanges()}
                />
              </div>
            </div>
          </WhiteContainer>
        </div>

        <div className={styles.profileSection}>
          <WhiteContainer containerClassName={styles.profileWhiteContainer} title="" titleMarginBottom={25} gap={30}>
            <aside className={styles.aside}>
              <nav className={styles.nav}>
                <Link to="/edit-user"
                  className={classNames(styles.link, styles.linkActive)}
                >
                  <User />
                  Informações Pessoais
                </Link>

                <Link to="/edit-user/security" 
                  className={classNames(styles.link, styles.linkInactive)}
                >
                  <Shield />
                  Segurança
                </Link>
              </nav>
            </aside>
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
          <div
            ref={imagePreviewModal}
            className="w-3/4 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center z-50"
          >
            <div className={styles.profileSection + "max-w-full! max-h-full!"}>
              <WhiteContainer containerClassName={styles.profileWhiteContainer} title="Foto de Perfil" titleMarginBottom={25} gap={30}>
                {previewImage &&
                  <UserImg
                    Source={previewImage}
                    classname="h-fit! border-2 border-gray-300"
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
