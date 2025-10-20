import "./EditUser.css";

import Button from "../../components/Button";
import { UserImg } from "../../components/UserImg/UserImg";
import { WhiteContainer } from "../../components/WhiteContainer/WhiteContainer";
import GoBackButton from "../../components/GoBackButton";
import InputWithIcon from "../../components/AuthComponents/InputWithIcon";
import useMediaQuery from "@mui/material/useMediaQuery";
import UserHeaderDesktop from "../../components/UserHeader/UserHeaderDesktop/UserHeaderDesktop";
import { IdCard, LockKeyhole, Mail, Phone, User } from "lucide-react";

export default function EditUser() {
  const isMobile = useMediaQuery("(max-width:768px)"); 
  return (
    <>
      {!isMobile &&  <UserHeaderDesktop />}
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
          <UserImg
            Source="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/bead4a5e-3a81-4227-8a70-2895683aa346/d38veke-854f019d-7f89-4493-97a1-12acc3bfb9cf.jpg/v1/fill/w_900,h_675,q_75,strp/derp_herp_cat_by_crusnik_o2-d38veke.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwic3ViIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl0sIm9iaiI6W1t7InBhdGgiOiIvZi9iZWFkNGE1ZS0zYTgxLTQyMjctOGE3MC0yODk1NjgzYWEzNDYvZDM4dmVrZS04NTRmMDE5ZC03Zjg5LTQ0OTMtOTdhMS0xMmFjYzNiZmI5Y2YuanBnIiwid2lkdGgiOiI8PTkwMCIsImhlaWdodCI6Ijw9Njc1In1dXX0.oxTavFYtSgHX9VKNdtfltu8QKMPX3se3pKrpnqm0Crk"
            Alt="Foto do usuário"
            Height={216}
            Width={216}
          />
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
