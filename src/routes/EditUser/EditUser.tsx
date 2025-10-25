import "./EditUser.css";

import Button from "../../components/Button";
import { UserImg } from "../../components/UserImg/UserImg";
import { WhiteContainer } from "../../components/WhiteContainer/WhiteContainer";
import GoBackButton from "../../components/GoBackButton";
import InputWithIcon from "../../components/AuthComponents/InputWithIcon/InputWithIcon";
import useMediaQuery from "@mui/material/useMediaQuery";
import UserHeaderDesktop from "../../components/UserHeader/UserHeaderDesktop/UserHeaderDesktop";
import { IdCard, LockKeyhole, Mail, Phone, User } from "lucide-react";
import UserHeaderMobile from "../../components/UserHeader/UserHeaderMobile/UserHeaderMobile";
import { LogoHeaderMobile } from "../../components/LogoHeaderMobile";

export default function EditUser({ hasHeader }: { hasHeader: React.Dispatch<React.SetStateAction<boolean>> }) {
  const isMobile = useMediaQuery("(max-width:1024px)");
  const userImage: string = "";
  hasHeader(true);
  return (
    <>
      {isMobile && <div className="logo-header-mobile">
        <LogoHeaderMobile />
      </div>}
      <div className="edit-user-grid">
        <div className="goBack-container">
          {isMobile ?
            <GoBackButton />
            :
            <h2>Editar Perfil</h2>
          }
        </div>

        <div className="profile-section">
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
            <div className="atualizar-foto-container">
              <Button title="Atualizar Foto" type="button" />
            </div>
          </WhiteContainer>
        </div>

        <div className="personal-info">
          <WhiteContainer title="Informações Pessoais" gap={20}>
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

        <div className="login-info">
          <WhiteContainer title="Informações de Login">
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

        <div className="footer">
          <div className="dashLine"></div>
          <Button title="Editar Perfil" type="button" />
        </div>
      </div>
    </>
  );
}
