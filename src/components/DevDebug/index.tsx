import { Link } from "react-router-dom";
import "./style.css"

export default function DevDebug() {
    return (
        <div className="wrapper-home">
            <div className="delete">
                DEV DEBUG
            </div>
            <div className="home">
                <Link to="/login">Login</Link>
                <Link to="/register">Cadastro</Link>
                <Link to="/edit-user">Editar usuário</Link>
                <Link to="/logout">Sair</Link>
            </div>
        </div>
    );
}
