import Button from "../Button";
import { SearchBar } from "../SearchBar/SearchBar";
import "./style.css"

export function CardFilterCheckSchedule(){

    return(
        <>
        <div className="cardFilter">
            <div className="searchBarDiv"><SearchBar /></div>
            <select className="selectStatus" name="" id="">
                <option value="pendente">Pendente</option>
                <option value="aprovado">Aprovado</option>
                <option value="rejeitado">Rejeitado</option>
            </select>
            <div className="divButtonFilter">
                  <Button type="button" title="Filtrar" classNameVariable="btn-check-schedule" onClick={() => {}} />
            </div>
          
        </div>
        </>
    )
}