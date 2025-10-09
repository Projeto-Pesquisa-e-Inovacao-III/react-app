import "./style.css"

export default function UserScheduleCard() {
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
                    <button className="btn-sched btn-sched-mobile">Cancelar</button>
                </div>
            </div>
            <span className="border-division"></span>
            <div className="right">
                <span>17 Setembro 12h30</span>
            </div>
        </div>
    );
}
