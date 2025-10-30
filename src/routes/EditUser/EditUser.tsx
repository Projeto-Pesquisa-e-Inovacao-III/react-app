import styles from "./EditUser.module.css";
import Button from "../../components/Button/Button";
import { UserImg } from "../../components/UserImg/UserImg";
import { WhiteContainer } from "../../components/WhiteContainer/WhiteContainer";
import GoBackButton from "../../components/GoBackButton/GoBackButton";
import InputWithIcon from "../../components/AuthComponents/InputWithIcon/InputWithIcon";
import { IdCard, LockKeyhole, Mail, Phone, User } from "lucide-react";
import { useReducer } from "react";
import useMobile from "../../hooks/isMobile";

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

  const userImage: string = "";

  const [state, dispatch] = useReducer(reducer, initialEditUserState);

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
                Source={""}
                Height={216}
                Width={216}
                Alt=""
              />
              :
              <User width={216} height={216} />
            }
            <div className={styles.atualizarFotoContainer}>
              <Button title="Atualizar Foto" type="button" />
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
            <InputWithIcon
              id="genero"
              type="text"
              placeholder="Digite seu gênero"
              icon={<User />}
              label="Gênero"
            ></InputWithIcon>
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