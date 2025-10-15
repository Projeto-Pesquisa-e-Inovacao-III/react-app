import SearchBar from "../../components/SearchBar";
import UserHeaderDesktop from "../../components/UserHeader/UserHeaderDesktop/UserHeaderDesktop";

export default function Logout() {
    return(
        <>
        <UserHeaderDesktop/>

        <h1>Usuários</h1>
        <h4>Lista de usuários assinantes</h4>
        <br/>
        <SearchBar/>
        </>
    )
}