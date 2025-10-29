import styles from "./EditUser.module.css";
import Button from "../../components/Button/Button";
import { UserImg } from "../../components/UserImg/UserImg";
import { WhiteContainer } from "../../components/WhiteContainer/WhiteContainer";
import GoBackButton from "../../components/GoBackButton/GoBackButton";
import InputWithIcon from "../../components/AuthComponents/InputWithIcon/InputWithIcon";
import useMediaQuery from "@mui/material/useMediaQuery";
import { IdCard, LockKeyhole, Mail, Phone, User } from "lucide-react";


export default function EditUser() {
  const isMobile = useMediaQuery("(max-width:1024px)");
  const userImage: string = "";

  return (
    <>
      <div className={styles.editUserGrid}>
        <div className={styles.goBackContainer}>
          {isMobile ?
            <GoBackButton />
            :
            <h2>Editar Perfil</h2>
          }
        </div>

        <div className={styles.profileSection}>
          <WhiteContainer title="Foto de Perfil" titleMarginBottom={25} gap={30}>
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