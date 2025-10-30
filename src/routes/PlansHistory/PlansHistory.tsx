import { SearchIcon } from "lucide-react";
import InputWithIcon from "../../components/AuthComponents/InputWithIcon/InputWithIcon";
import classNames from "classnames";

import styles from "./PlansHistory.module.css";
import SmallerButton from "../../components/SmallerButton";
import { PlansHistoryMock } from "./mocks/PlansHistoryMock";
import { Typography } from "@mui/material";

export default function PlansHistory() {
    return (
        <div className={classNames(styles.container)}>
            <div className={classNames(styles.title)}>
                <h1>Histórico de Compras</h1>

            </div>

            <div className={classNames(styles.search)}>
                <div className={classNames(styles.searchInput)}>
                    <InputWithIcon
                        type="text"
                        placeholder="Buscar..."
                        icon={<SearchIcon />}
                    />
                </div>
                <input type="text" name="" id="" placeholder="ASDASDASDASDASD" />
                <input type="text" name="" id="" placeholder="ASDASDASDASDASD" />
                <div className={classNames(styles.searchButton)}>
                    <SmallerButton title="Filtrar" />
                </div>
            </div>

            {PlansHistoryMock.map((plan, index) => (
                <div className={classNames(styles.plansCard)}>
                    <div className={classNames(styles.planBoughtDate)}>
                        <p>{plan.date}</p>
                    </div>
                    <div className={classNames(styles.planWrapperText)}>

                        <div className={classNames(styles.planInfo)}>
                            <h2>{plan.title}</h2>
                            <p>{plan.subtitle}</p>
                        </div>
                        <div className={classNames(styles.planButton)}>
                            <SmallerButton title="Detalhes" handleButtonClick={plan.onClick} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}