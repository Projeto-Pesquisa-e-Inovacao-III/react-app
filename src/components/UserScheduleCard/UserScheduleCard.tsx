import classNames from "classnames";
import SmallerButton from "../SmallerButton";
import "./style.css"
import type { dataCardProps } from "../CardCheckSchedule/CardCheckSchedule";
import UserAvatar from "../UserAvatar/UserAvatar";
import { BASE_URL } from "../../system";
import Button from "../Button/Button";

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
    isMobile: boolean;
}

export default function UserScheduleCard({ additionalInfo, isReschedule, data, date, initialHour, finalHour, handleCancel, handleReschedule, isMobile }: UserScheduleCardProps) {
    console.log("dataCardProps", data);
    return (
        <div className={classNames("schedule-view", { "schedule-view-mobile": isMobile })}>
            <div className="left">
                <span className="user-personal">{data.tipoAula}</span>
                <p>{isReschedule ? "Horário reagendado" : ""}</p>
                <div className="schedule-page-user">
                    <UserAvatar
                        foto={data.caminhoFoto ?? additionalInfo?.foto}
                        useUserImage={false}
                    />
                    <span>
                        {data.personalNome ?? additionalInfo?.nome ?? ""}
                    </span>
                </div>
                {isReschedule &&
                    (
                        <div className="btn-actions">
                            <Button type="button" typeButton="accept" title="Aceitar" handleButtonClick={handleReschedule} />
                            <Button type="button" typeButton="decline" title="Cancelar" handleButtonClick={handleCancel} />
                            <Button type="button" typeButton="other" title="Reagendar" handleButtonClick={handleReschedule} />
                        </div>
                    )
                }
                <div className="btn-actions">
                    {data.agendamentoStatus === "APROVADO" && (
                        <>
                            <SmallerButton type="button" title="Reagendar" handleButtonClick={handleReschedule} />
                            <SmallerButton type="button" title="Cancelar" handleButtonClick={handleCancel} />
                        </>
                    )}


                </div>
            </div>
            {isMobile && (
                <div className="mobile-view">
                    <span className="border-division"></span>
                    <div className={classNames("right", { "right-mobile": isMobile })}>
                        <span>{date} {initialHour} - {finalHour}</span>
                    </div>
                </div>
            )}
            {!isMobile && (
                <>
                    <span className="border-division"></span>
                    <div className={classNames("right", { "right-mobile": isMobile })}>
                        <span>{date} {initialHour} - {finalHour}</span>
                    </div>
                </>
            )}
        </div>
    );
}
