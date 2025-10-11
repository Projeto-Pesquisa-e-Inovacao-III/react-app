import "./successModalMobile.css";
import "./successModal.css";

export default function SuccessModal({ isMobile, closeThen, title, content }: { isMobile: boolean; closeThen: React.Dispatch<React.SetStateAction<boolean>>; title?: string; content?: string }) {

    function handleCloseModal() {

        closeThen(false);
    }

    return (
        <>
            <div className="overlay"></div>
            <div className={`modal-event-created${isMobile ? "-mobile" : ""}`}>
                <h2>{title || "Evento criado com sucesso!"}</h2>
                <p className="content-modal">{content || "Seu evento foi criado com sucesso."}</p>
                <svg width="52" height="51" viewBox="0 0 52 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" width="51" height="51" rx="25.5" fill="#22C55E" />
                    <path d="M19.625 25.5L23.875 29.75L32.375 21.25" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <button className="btn-sched" onClick={handleCloseModal}>Fechar</button>

            </div>
        </>
    );
}
