import { Link } from "react-router-dom";
import "./style.css"

export default function DevDebug() {
    return (
        <div className="wrapper-home">
            <div className="delete">
                DEV DEBUG
            </div>
            <div className="home">
                <Link to="/week">Semana</Link>
                <Link to="/">Normal</Link>
            </div>
        </div>
    );
}
