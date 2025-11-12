import classNames from "classnames";
import SmallerButton from "../SmallerButton";
import "./style.css"

type UserScheduleCardProps = {
    date: string;
    initialHour: string;
    finalHour: string;
    handleCancel: React.Dispatch<React.SetStateAction<boolean>>;
    handleReschedule: React.Dispatch<React.SetStateAction<boolean>>;
    isMobile: boolean;
}

export default function UserScheduleCard({ date, initialHour, finalHour, handleCancel, handleReschedule, isMobile }: UserScheduleCardProps) {
    return (
        <div className={classNames("schedule-view", { "schedule-view-mobile": isMobile })}>
            <div className="left">
                <span className="user-personal">Personal</span>
                <div className="schedule-page-user">
                    <img src="https://placehold.co/60x60/png" alt="" />
                    <span>Nome</span>
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
