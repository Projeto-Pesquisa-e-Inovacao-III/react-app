import styles from "./EditUser.module.css";
import Button from "../../../components/Button/Button.tsx";
import { WhiteContainer } from "../../../components/WhiteContainer/WhiteContainer.tsx";
import InputWithIcon from "../../../components/Inputs/InputWithIcon/InputWithIcon.tsx";
import { IdCard, Phone, Upload, User } from "lucide-react";
import { useCallback, useContext, useEffect, useReducer, useRef, useState } from "react";
import useMobile from "../../../hooks/isMobile.tsx";
import { findUserData, insertUserImage, removerUserImage, update, softDelete } from "../../../constants/user.ts";
import type { UpdateUserDTO } from "../../../models/user.ts";
import SuccessModal from "../../../components/Modal/SuccessModal/SuccessModal.tsx";
import TimerModal from "../../../components/Modal/TimerModal/TimerModal.tsx";
import { cellphoneMask } from "../../../utils/mascara.ts";
import { TypeContext } from "../../../App.tsx";
import type { PersonalDTO } from "../../../models/personal.ts";
import { editPersonalProfile } from "../../../constants/personal.ts";
import ErrorModal from "../../../components/Modal/ErrorModal/ErrorModal.tsx";
import { useNavigate } from "react-router-dom";
import useModal from "../../../hooks/useModal.tsx";
import useClickOutside from "../../../hooks/useClickOutside.tsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import classNames from "classnames";
import Select from "../../../components/Select/Select.tsx";
import SmallerButton from "../../../components/SmallerButton/SmallerButton.tsx";
import { BASE_URL } from "../../../system.ts";
import AsideEditUser from "../../../components/EditUser/AsideEditUser.tsx";
import UserAvatar from "../../../components/UserAvatar/UserAvatar.tsx";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { getCroppedImg } from "../../../utils/cropImage.ts";
type EditUserState = {
  firstName: string;
  lastName: string;
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
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewImageFormData, setPreviewImageFormData] = useState<FormData>(new FormData());

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_croppedArea: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const imagePreviewModal = useRef(null);

  useClickOutside({
    ref: imagePreviewModal,
    callback: () => {
      if (openModal === "adjustAvatar") {
        setPreviewImage("");
        setPreviewImageFormData(new FormData());
      }

      setOpenModal(null);

    }
  });

  async function handleUpdateImage(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);

      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);

      setPreviewImage(imageUrl);
      setPreviewImageFormData(new FormData()); 
      setOpenModal("adjustAvatar");
    }
  }

  async function handleConfirmCrop() {
    if (!previewImage || !croppedAreaPixels) return;

    try {
      const { blob, url } = await getCroppedImg(previewImage, croppedAreaPixels);

      const formData = new FormData();
      formData.append("imagem", blob, "avatar.jpg");

      setPreviewImageFormData(formData);
      setPreviewImage(url);
      setOpenModal(null);

      insertUserImage(formData)
        .then(async () => {
          setUserImage(url);
          setTextModal({ title: "Foto atualizada!", content: "Sua foto de perfil foi atualizada com sucesso." });
          setOpenModal("success");
        })
        .catch((error) => {
          console.error("Erro ao atualizar imagem do usuário:", error);
          setTextModal({ title: "Houve um erro", content: error.response?.data?.Exception || "Não foi possível atualizar a foto." });
          setOpenModal("error");
        });
    } catch (err) {
      console.error("Erro ao processar imagem:", err);
    }
  }

  function handleRemoveImage() {
    setUserImage("");
    const formData = new FormData();
    formData.append("imagem", "");
    removerUserImage().then(() => {
      
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




  async function handleUpdateUserInfo() {

    if (previewImageFormData.has("imagem") && previewImageFormData.get("imagem") !== "") {
      insertUserImage(previewImageFormData).then(async () => {
        setUserImage(previewImage);
        setTextModal({ title: "Foto atualizada!", content: "Sua foto de perfil foi atualizada com sucesso." });
        setOpenModal("success");
        return

      })
        .catch((error) => {
          console.error("Erro ao atualizar imagem do usuário:", error);
          setTextModal({ title: "Houve um erro", content: error.response?.data?.Exception });
          setOpenModal("error");
          return
        });
      return
    }

    
    const options: UpdateUserDTO = {
      nome: state.firstName,
      telefones: [{ numero: state.phone.substring(5).replace("-", ""), ddd: state.phone.substring(1, 3), id: 1 }],
      sexo: state.gender,
      email: state.email,
    };
    

    update(options)
      .then(async () => {
        await queryClient.refetchQueries({
          queryKey: ["userData"]
        });

        setTextModal({ title: "Perfil atualizado!", content: "Seu perfil foi atualizado com sucesso." });

        setOpenModal("success");
      })
      .catch((error) => {
        console.error("Erro ao atualizar dados do usuário:", error.response?.data?.Exception);
        
        setTextModal({
          title: "Houve um erro",
          content: error.response?.data?.Exception || "Não foi possível atualizar seu perfil.",
        });
        setOpenModal("error");
      });
  }

  function handleUpdatePersonalInfo() {

    if (previewImageFormData.has("imagem") && previewImageFormData.get("imagem") !== "") {
      
      insertUserImage(previewImageFormData).then(async () => {
        
        setUserImage(previewImage);
        setTextModal({ title: "Foto atualizada!", content: "Sua foto de perfil foi atualizada com sucesso." });
        setOpenModal("success");
        return;
      }).catch((error) => {
        
        console.error("Erro ao atualizar imagem do usuário:", error);
        setTextModal({ title: "Houve um erro", content: "A imagem é muito pesada para ser carregada." });
        setOpenModal("error");
        return;
      });
      return;

    }
    
    const options: PersonalDTO = {
      nome: state.firstName,
      telefones: [{ numero: state.phone.substring(5).replace("-", ""), ddd: "11", pais: "55", id: 1 }],
      sexo: state.gender,
      email: state.email,
      dataNascimento: userInfo.data?.dataNascimento || undefined,
      caminhoFoto: userInfo.data?.caminhoFoto || undefined,
    }

    
    editPersonalProfile(options).then(async () => {
      setTextModal({ title: "Perfil atualizado!", content: "Seu perfil foi atualizado com sucesso." });
      setOpenModal("success");
      await queryClient.refetchQueries({
        queryKey: ["userData"]
      });
    }).catch((error) => {
      
      console.error("Erro ao atualizar dados do usuário:", error);
      setTextModal({ title: "Houve um erro", content: error.response.data.Exception || "Não foi possível atualizar seu perfil." });
      setOpenModal("error");
    });

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
    }
  }

  

  return (
    <>
      <div className={styles.editUserGrid}>
        {!isMobile &&
          <div className={styles.goBackContainer}>
            <h1>Editar Perfil</h1>
          </div>
        }

        <div className={styles.personalInfo}>
          <WhiteContainer title="Informações Pessoais" icon={<User size={22} />} titleFontSize={20} titleClassName={"font-bold! flex! items-center gap-3"} contentClassName={classNames(styles.personalInfoGrid, { [styles.alunoGrid]: type?.type?.includes("aluno") })} gap={20}>
            <div className={styles.fotoArea} >
              <div className={classNames("flex gap-8 items-center", { ["flex flex-col text-center gap-8 items-center"]: isMobile })}>
                <div className="bg-gray-300 flex items-center rounded-full ">
                  {/* {userImage ? (
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
                  )} */}
                  <UserAvatar customImageUrl={userImage} withUsernameClassName="w-32! h-32! text-3xl!" imgClassName="w-40! h-40!" isLoading={userInfo.isLoading} userName={state.firstName}/>
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
                      <div className={classNames("w-1/3!", { ["w-full!"]: isMobile })}>
                        <SmallerButton
                          title="Remover Foto"
                          type="button"
                          classname="flex items-center h-12! gap-4  border-2! border-red-800!  bg-red-200! text-black! rounded-2xl!"
                          handleButtonClick={() => {
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
              maxLength={60}
            ></InputWithIcon>
            {type?.type?.includes("aluno") ? null : (
              <InputWithIcon
                id="cref"
                type="text"
                placeholder="Digite seu CREF"
                icon={<IdCard />}
                isLoading={userInfo.isLoading}
                label="CREF"
                value={state.cref}
                onInputChange={(value: string) => dispatch({ type: "setCREF", payload: value })}
                disabled={true}
                maxLength={11}
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
              maxLength={15}
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
                  { label: "Masculino", value: "Masculino" },
                  { label: "Feminino", value: "Feminino" },
                  { label: "Outro", value: "Outro" },
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
                  handleButtonClick={type?.type?.includes("aluno") ? handleUpdateUserInfo : handleUpdatePersonalInfo} />
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
            <AsideEditUser activeTab="edituser" />
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
          <div className="overlay z-40!"></div>
          <div
            ref={imagePreviewModal}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[min(500px,95vw)] bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Ajustar Foto de Perfil</h2>
              <p className="text-sm text-gray-500 mt-0.5">Mova e use o scroll para dar zoom na imagem</p>
            </div>

            <div className="relative w-full" style={{ height: "340px", background: "#111" }}>
              {previewImage && (
                <Cropper
                  image={previewImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              )}
            </div>

            <div className="px-6 pt-4 pb-2 flex items-center gap-3">
              <span className="text-xs text-gray-400">−</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <span className="text-xs text-gray-400">+</span>
            </div>

            <div className="px-6 pb-6 pt-2 flex gap-3">
              <Button
                typeButton="other"
                title="Confirmar"
                type="button"
                classNameVariable="buttonRemoveImage"
                onClick={handleConfirmCrop}
              />

              <div className="flex-1">
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/jpg"
                  id="upload-photo-crop"
                  onChange={(e) => handleUpdateImage(e)}
                  style={{ display: "none" }}
                />
                <label htmlFor="upload-photo-crop" className="block">
                  <span
                    className="flex items-center justify-center w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-gray-50 text-gray-700 font-medium cursor-pointer hover:bg-gray-100 transition text-sm"
                  >
                    Mudar Foto
                  </span>
                </label>
              </div>

              <Button
                typeButton="other"
                title="Cancelar"
                type="button"
                classNameVariable="buttonRemoveImage"
                onClick={() => {
                  setPreviewImage("");
                  setPreviewImageFormData(new FormData());
                  setOpenModal(null);
                }}
                classNameDiv="bg-white!"
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
