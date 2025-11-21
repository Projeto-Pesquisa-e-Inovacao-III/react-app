import Button from "../Button/Button";
import { SearchBar } from "../SearchBar/SearchBar";
import styles from "./CardFilterCheckSchedule.module.css"

export function CardFilterCheckSchedule(){

    return(
        <>
        <div className={styles.cardFilter}>
            <div className={styles.searchBarDiv}><SearchBar /></div>
            <select className={styles.selectStatus} name="" id="">
                <option value="pendente">Pendente</option>
                <option value="aprovado">Aprovado</option>
                <option value="rejeitado">Rejeitado</option>
            </select>
            <div className={styles.divButtonFilter}>
                  <Button type="button" typeButton="other" title="Filtrar" classNameVariable="btn-check-schedule" onClick={() => {}} />
            </div>
          
        </div>
        </>
    )
}