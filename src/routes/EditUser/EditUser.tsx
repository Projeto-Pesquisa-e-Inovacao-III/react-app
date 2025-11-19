import styles from "./EditUser.module.css";
import Button from "../../components/Button/Button";
import { UserImg } from "../../components/UserImg/UserImg";
import { WhiteContainer } from "../../components/WhiteContainer/WhiteContainer";
import GoBackButton from "../../components/GoBackButton/GoBackButton";
import InputWithIcon from "../../components/Inputs/InputWithIcon/InputWithIcon";
import { IdCard, LockKeyhole, Mail, Phone, User } from "lucide-react";
import { useEffect, useReducer, useState } from "react";
import useMobile from "../../hooks/isMobile";
import Select from "../../components/Inputs/Select";
import Input from "../../components/Inputs/Input/Input";
import { api, BASE_URL } from "../../system";
import { findUserData, getUserImage, insertUserImage, removerUserImage, update } from "../../constants/user";
import type { UpdateUserDTO, UserDTO } from "../../models/user";
import SuccessModal from "../../components/Modal/SuccessModal/SuccessModal";
import TimerModal from "../../components/Modal/TimerModal/TimerModal";
import UserAvatar from "../../components/UserAvatar/UserAvatar";
import { cellphoneMask, cpfMask } from "../../utils/mascara";

function reducer(state: any, action: any) {
  switch (action.type) {
    case "setFirstName":
      return { ...state, firstName: action.payload };
    case "setLastName":
      return { ...state, lastName: action.payload };
    case "setCPF":
      return { ...state, cpf: action.payload };
    case "setPhone":
      return { ...state, phone: action.payload };
    case "setGender":
      return { ...state, gender: action.payload };
    case "setEmail":
      return { ...state, email: action.payload };
    case "setPassword":
      return { ...state, password: action.payload };
    default:
      return state;
  }
}

const initialEditUserState = {
  firstName: "",
  lastName: "",
  cpf: "",
  phone: "",
  gender: "",
  email: "",
  password: "",
  birthDate: "",
};


export default function EditUser() {
  const isMobile = useMobile();

  const [userImage, setUserImage] = useState<string>("");
  const [userImageFormData, setUserImageFormData] = useState<FormData>(new FormData());

  const [state, dispatch] = useReducer(reducer, initialEditUserState);

  const [callSuccessModal, setCallSuccessModal] = useState(false);
  const [callTimerModal, setCallTimerModal] = useState(false);
  const [textSuccessModal, setTextSuccessModal] = useState({ title: "", content: "" });

  async function handleUpdateImage(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const formData = new FormData();
      formData.append("imagem", file);

      const imageUrl = URL.createObjectURL(file);
      setUserImage(imageUrl);
      setUserImageFormData(formData);
    }
  }

  function handleRemoveImage() {
    setUserImage("");
    const formData = new FormData();
    formData.append("imagem", "");
    setUserImageFormData(formData);
    removerUserImage().then(() => {
      console.log("Imagem do usuário removida com sucesso!");
    }).catch((error) => {
      console.error("Erro ao remover imagem do usuário:", error);
    });

    setTextSuccessModal({ title: "Imagem removida!", content: "Sua imagem de perfil foi removida com sucesso." });
    setCallTimerModal(false);
    setCallSuccessModal(true);

  }

  function handleGetUserInfo() {
    findUserData().then((response) => {
      const userData = response.data;
      console.log("Dados do usuário:", userData);
      dispatch({ type: "setFirstName", payload: userData.nome });
      dispatch({ type: "setCPF", payload: userData.cpf });
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
    const options: UpdateUserDTO = {
      nome: state.firstName,
      cpf: state.cpf,
      telefone: { numero: state.phone, ddd: "11", pais: "55" },
      sexo: state.gender,
      email: state.email,
      dataNascimento: "2000-01-01", //is this necessary? can we update birthdate?,
      senha: "123456789aA!",  //is this right? are we gonna update password here?
    }

    update(options).then(() => {
      console.log("Dados do usuário atualizados com sucesso!");
      setTextSuccessModal({ title: "Perfil atualizado!", content: "Seu perfil foi atualizado com sucesso." });
      setCallSuccessModal(true);

    }).catch((error) => {
      console.error("Erro ao atualizar dados do usuário:", error);
    });

    if (userImageFormData.has("imagem")) {
      insertUserImage(userImageFormData).then(() => {
        console.log("Imagem do usuário atualizada com sucesso!");
      }).catch((error) => {
        console.error("Erro ao atualizar imagem do usuário:", error);
      });
    }
  }

  useEffect(() => {
    handleGetUserInfo();
  }, []);

  return (
    <>
      <div className={styles.editUserGrid}>
        {!isMobile &&
          <div className={styles.goBackContainer}>
            <h2>Editar Perfil</h2>
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
                <input type="file" name="" accept="image/*" id="upload-photo" onChange={(e) => handleUpdateImage(e)} style={{ display: "none" }} />
                <label htmlFor="upload-photo">
                  <span>Atualizar Foto</span>
                </label>
              </div>

              {userImage ?
                <div >
                  <Button title="Remover Foto" type="button" classNameVariable="buttonRemoveImage" onClick={() => setCallTimerModal(true)} />
                </div>
                : null}
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
              label="Primeiro Nome"
              value={state.firstName}
              onInputChange={(value: string) => dispatch({ type: "setFirstName", payload: value })}
            ></InputWithIcon>
            <InputWithIcon
              id="sobreNome"
              type="text"
              placeholder="Digite seu sobrenome"
              icon={<User />}
              label="Último Nome"
            ></InputWithIcon>
            <InputWithIcon
              id="cpf"
              type="text"
              placeholder="Digite seu CPF"
              icon={<IdCard />}
              label="CPF"
              value={state.cpf}
              onInputChange={(value: string) => dispatch({ type: "setCPF", payload: value })}
              mask={cpfMask}
            ></InputWithIcon>
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
          <WhiteContainer contentClassName={styles.loginInfoContainer} title="Informações de Login">
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
              label="Senha"
            ></InputWithIcon>
          </WhiteContainer>
        </div>

        <div className={styles.footer}>
          <div className={styles.dashLine}></div>
          <Button title="Salvar Alterações" type="button" onClick={handleUpdateUserInfo} />
        </div>
      </div>

      {callSuccessModal && (
        <SuccessModal
          isMobile={isMobile}
          closeThen={setCallSuccessModal}
          title={textSuccessModal.title}
          content={textSuccessModal.content}
        />
      )}

      {callTimerModal && (
        <TimerModal
          isMobile={isMobile}
          closeThen={() => setCallTimerModal(false)}
          callSuccessModal={handleRemoveImage}
          title="Remover imagem?"
          buttonTitle="Remover"
          content="Tem certeza que deseja remover sua imagem de perfil?"
        />
      )}
    </>
  );
}