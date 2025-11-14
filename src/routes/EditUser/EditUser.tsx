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
import { api } from "../../system";

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
};

export default function EditUser() {
  const isMobile = useMobile();

  const [userImage, setUserImage] = useState<string>("");

  const [state, dispatch] = useReducer(reducer, initialEditUserState);

  async function handleUpdateImage(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const formData = new FormData();
      formData.append("imagem", file);

      const id = 'df71689b-d517-4af3-8e42-1be334d424bd'

      // requisição simulada
      
      // await api.post(`/api/postagens/${id}/imagens`, formData)
      // .then((response) => {
      //   console.log("Imagem enviada com sucesso:", response.data);
      //   setUserImage(response.data.imagemUrl);
      // }).catch((error) => {
      //   console.error("Erro ao enviar a imagem:", error);
      // });

      const imageUrl = URL.createObjectURL(file);
      setUserImage(imageUrl);
    }
  }

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
              <input type="file" name="" accept="image/*" id="upload-photo" onChange={(e) => handleUpdateImage(e)} style={{ display: "none" }} />
              <label htmlFor="upload-photo">
                <span>Atualizar Foto</span>
              </label>
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
            ></InputWithIcon>
            <InputWithIcon
              id="telefone"
              type="text"
              placeholder="Digite seu telefone"
              icon={<Phone />}
              label="Telefone"
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
          <Button title="Salvar Alterações" type="button" />
        </div>
      </div>
    </>
  );
}