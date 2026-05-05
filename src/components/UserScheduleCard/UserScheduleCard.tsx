import classNames from "classnames";
import SmallerButton from "../SmallerButton/SmallerButton";
import styles from "./UserScheduleCard.module.css"
import type { dataCardProps } from "../CheckSchedule/CardCheckSchedule/CardCheckSchedule";
import UserAvatar from "../UserAvatar/UserAvatar";
import Skeleton from "react-loading-skeleton";

type UserScheduleCardProps = {
    data: dataCardProps;
    additionalInfo?: {
        foto?: string;
        nome?: string;
        idade?: string;
    }
    isReschedule?: boolean;
    date: string;
    initialHour: string;
    finalHour: string;
    handleCancel: (() => void);
    handleReschedule: (() => void);
    handleAcceptReschedule?: (() => void);
    isMobile: boolean;
}

export default function UserScheduleCard({ additionalInfo, isReschedule, data, date, initialHour, finalHour, handleCancel, handleReschedule, handleAcceptReschedule, isMobile }: UserScheduleCardProps) {
    

    const skeleton = <Skeleton count={1} width={100} height={20} baseColor="#e5e7eb" highlightColor="#f3f4f6" />

    return (
        <div className={classNames(styles.scheduleView, { [styles.scheduleViewMobile]: isMobile })}>
            <div className={styles.left}>
                <span className={styles.userPersonal}>{data.tipoAula || skeleton}</span>
                <p>{isReschedule ? "Horário reagendado" : ""}</p>
                <div className={styles.schedulePageUser}>
                    <UserAvatar
                        userName={data.personalNome ?? additionalInfo?.nome ?? ""}
                        foto={data.caminhoFoto ?? additionalInfo?.foto }
                        useUserImage={false}
                    />
                    <span>
                        {data.personalNome ?? additionalInfo?.nome ?? skeleton}
                    </span>
                </div>
                {isReschedule &&
                    (
                        <div className={styles.btnActions}>
                            <SmallerButton type="button" classname={styles.accept} title="Aceitar" handleButtonClick={handleAcceptReschedule} />
                            <SmallerButton type="button" classname={styles.decline} title="Cancelar" handleButtonClick={handleCancel} />
                            <SmallerButton type="button" classname={styles.other} title="Reagendar" handleButtonClick={handleReschedule} />
                        </div>
                    )
                }
                <div className={styles.btnActions}>
                    {data.agendamentoStatus === "APROVADO" && (
                        <>
                            <SmallerButton type="button" title="Reagendar" handleButtonClick={handleReschedule} />
                            <SmallerButton type="button" title="Cancelar" handleButtonClick={handleCancel} />
                        </>
                    )}


                </div>
            </div>
            {isMobile && (
                <div className={styles.mobileView}>
                    <span className={styles.borderDivision}></span>
                    <div className={classNames(styles.right, { [styles.rightMobile]: isMobile })}>
                        <span>{date} {initialHour} - {finalHour}</span>
                    </div>
                </div>
            )}
            {!isMobile && (
                <>
                    <span className={styles.borderDivision}></span>
                    <div className={classNames(styles.right, { [styles.rightMobile]: isMobile })}>
                        <span>{date} {initialHour} - {finalHour}</span>
                    </div>
                </>
            )}
        </div>
    );
}
