import SmallerButton from "../SmallerButton";
import "./style.css"

export default function UserScheduleCard({ date, hour, handleCancel, handleReschedule }: { date: string, hour: string, handleCancel: React.Dispatch<React.SetStateAction<boolean>>, handleReschedule: React.Dispatch<React.SetStateAction<boolean>> }) {
    return (
        <div className="schedule-view">
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
            <span className="border-division"></span>
            <div className="right">
                <span>{date} {hour}</span>
            </div>
        </div>
    );
}
