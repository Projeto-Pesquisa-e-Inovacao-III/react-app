import classNames from "classnames";
import SmallerButton from "../SmallerButton";
import "./style.css"
import type { dataCardProps } from "../CardCheckSchedule/CardCheckSchedule";
import UserAvatar from "../UserAvatar/UserAvatar";
import { BASE_URL } from "../../system";

type UserScheduleCardProps = {
    data: dataCardProps;
    date: string;
    initialHour: string;
    finalHour: string;
    handleCancel: React.Dispatch<React.SetStateAction<boolean>>;
    handleReschedule: React.Dispatch<React.SetStateAction<boolean>>;
    isMobile: boolean;
}

export default function UserScheduleCard({ data, date, initialHour, finalHour, handleCancel, handleReschedule, isMobile }: UserScheduleCardProps) {
    console.log("dataCardProps", data);
    return (
        <div className={classNames("schedule-view", { "schedule-view-mobile": isMobile })}>
            <div className="left">
                <span className="user-personal">{data.tipoAula}</span>
                <div className="schedule-page-user">
                    <UserAvatar foto={data.foto ? `${data.foto}` : undefined} useUserImage={false} />
                    <span>{data.personalNome}</span>
                </div>
                <div className="btn-actions">
                    <SmallerButton type="button" title="Reagendar" handleButtonClick={() => handleReschedule(true)} />
                    <SmallerButton type="button" title="Cancelar" handleButtonClick={() => handleCancel(true)} />
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
