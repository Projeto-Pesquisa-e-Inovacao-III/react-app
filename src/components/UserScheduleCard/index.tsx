import "./style.css"

export default function UserScheduleCard({ date, hour, handleCancel }: { date: string, hour: string, handleCancel: React.Dispatch<React.SetStateAction<boolean>> }) {
    return (
        <div className="schedule-view">
            <div className="left">
                <span className="user-personal">Personal</span>
                <div className="schedule-page-user">
                    <img src="https://placehold.co/60x60/png" alt="" />
                    <span>Nome</span>
                </div>
                <div className="btn-actions">
                    <button className="btn-sched btn-sched-mobile">Reagendar</button>
                    <button className="btn-sched btn-sched-mobile" onClick={() => handleCancel(true)}>Cancelar</button>
                </div>
            </div>
            <span className="border-division"></span>
            <div className="right">
                <span>{date} {hour}</span>
            </div>
        </div>
    );
}
