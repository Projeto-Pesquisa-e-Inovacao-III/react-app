import './desktop.css'
import './mobile.css'

type AppointmentCard = {
    status: 'Pendente' | 'Confirmado' | 'Cancelado';
    name: string;
    photoUrl: string;
    date: string;
    time: string;
    isMobile?: boolean;
};

export function AppointmentCard (props: AppointmentCard) {
    const { isMobile = false } = props;
    return (
        <div className={`session-card${isMobile ? '-mobile' : ''}`}>
            <div className={`session-card-left${isMobile ? '-mobile' : ''}`}>
                <p className="session-card-status">{props.status}</p>
                <p className="session-card-type">Consulta</p>
                <div className="session-card-user">
                    <img src={props.photoUrl} alt={props.name} className="session-card-avatar" />
                    <p className="session-card-name">{props.name}</p>
                </div>
            </div>
            <div className={`session-card-divider${isMobile ? '-mobile' : ''}`} />
            <div className={`session-card-right${isMobile ? '-mobile' : ''}`}>
                <p className="session-card-date">{props.date}</p>
                <p className="session-card-time">{props.time}</p>
            </div>
        </div>
    );
}
