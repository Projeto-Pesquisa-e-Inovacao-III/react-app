import classNames from "classnames";
import SmallerButton from "../SmallerButton/SmallerButton";
import "./style.css"
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
    console.log("dataCardProps", finalHour);

    const skeleton = <Skeleton count={1} width={100} height={20} baseColor="#e5e7eb" highlightColor="#f3f4f6" />

    return (
        <div className={classNames("schedule-view", { "schedule-view-mobile": isMobile })}>
            <div className="left">
                <span className="user-personal">{data.tipoAula || skeleton}</span>
                <p>{isReschedule ? "Horário reagendado" : ""}</p>
                <div className="schedule-page-user">
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
                        <div className="btn-actions">
                            <SmallerButton type="button" classname="accept" title="Aceitar" handleButtonClick={handleAcceptReschedule} />
                            <SmallerButton type="button" classname="decline" title="Cancelar" handleButtonClick={handleCancel} />
                            <SmallerButton type="button" classname="other" title="Reagendar" handleButtonClick={handleReschedule} />
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
