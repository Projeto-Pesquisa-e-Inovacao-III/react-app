import { useRef } from "react";
import useModalClose from "../../../hooks/useModalClose";
import styles from "./PopupModal.module.css";
import useClickOutside from "../../../hooks/useClickOutside";
import SmallerButton from "../../SmallerButton/SmallerButton";
import classnames from "classnames";
import { useQuery } from "@tanstack/react-query";
import { findPersonalRequests } from "../../../constants/schedule";
import { parseISO, startOfDay, endOfDay, format, parse } from "date-fns";
import { AppointmentCard } from "../../AppointmentCard/AppointmentCard";
import { ptBR } from "date-fns/locale";
import useMobile from "../../../hooks/isMobile";
import { Calendar, X } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
type PopupModalProps = {
    closeThen: () => void;
    date: string;
    onNewEvent?: () => void;
};

export default function PopupModal({ closeThen, date, onNewEvent }: Readonly<PopupModalProps>) {
    const isMobile = useMobile();
    const popupRef = useRef<HTMLDivElement>(null);
    const closingAction = useRef<"close" | "newEvent">("close");

    const { isClosing, handleAnimatedClose } = useModalClose({
        onClose: () => {
            if (closingAction.current === "newEvent" && onNewEvent) {
                onNewEvent();
            } else {
                closeThen();
            }
        },
        duration: 200,
        lockScroll: false
    });


    useClickOutside({
        ref: popupRef,
        callback: handleAnimatedClose,
    });

    const schedules = useQuery({
        queryKey: ["schedules", date],
        queryFn: () => {
            const formattedDate = parseISO(date);

            const dataInic = format(startOfDay(formattedDate), "yyyy-MM-dd'T'HH:mm:ss");
            const dataFim = format(endOfDay(formattedDate), "yyyy-MM-dd'T'HH:mm:ss");

            console.log(dataInic, dataFim)

            return findPersonalRequests(0, "10", dataInic, dataFim);
        },
    });

    const agendamentos = schedules.data?.data?.content || [];

    console.log(agendamentos)

    const formattedDate = format(parseISO(date), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);



    return (
        <>
            <div
                className={classnames("overlay", {
                    [styles.backdropEnter]: !isClosing,
                    [styles.closingBackdrop]: isClosing,
                })}
                onClick={handleAnimatedClose}
            />
            <div ref={popupRef} className={classnames(styles.popupModal, {
                [styles.popupEnter]: !isClosing,
                [styles.closing]: isClosing,
            })}>
                <div className={styles.popupIndicator} />
                <div className={styles.header}>
                    <div>
                        <h2>Agendamentos</h2>
                        <p>{capitalizedDate}</p>
                    </div>
                    <button className={styles.closeButton} onClick={handleAnimatedClose}>
                        <X className={styles.closeIcon} size={24} />
                    </button>
                </div>
                {schedules.isLoading ? (
                    <div className={styles.cardList}>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} height={120} borderRadius={12} style={{ marginBottom: 12 }} />
                        ))}
                    </div>
                ) : agendamentos.length > 0 && (
                    <div className={styles.cardList}>
                        {agendamentos.map((agendamento: any) => (
                            <AppointmentCard
                                key={agendamento.agendamentoId}
                                agendamentoId={agendamento.agendamentoId}
                                status={agendamento.status}
                                name={agendamento.nome}
                                photoUrl={agendamento.foto}
                                type={agendamento.tipoAula}
                                date={agendamento.dataInicio ? format(parse(agendamento.dataInicio.split("T")[0], "yyyy-MM-dd", new Date()), "dd/MM/yyyy", { locale: ptBR }) : ""}
                                time={`${agendamento.dataInicio ? agendamento.dataInicio.split("T")[1]?.substring(0, 5) || "" : ""} - ${agendamento.dataFim ? agendamento.dataFim.split("T")[1]?.substring(0, 5) || "" : ""}`}
                                address={agendamento.endereco ? agendamento.endereco.cep.bairro + ", " + agendamento.endereco.cep.localidade : ""}
                                isMobile={isMobile}
                            />
                        ))}
                    </div>
                )}
                {/* <SmallerButton classname="h-12" type="button" title="Fechar" handleButtonClick={handleAnimatedClose} />
                 */}
                <SmallerButton classname="h-12" type="button" title="Novo agendamento" handleButtonClick={() => { 
                    closingAction.current = "newEvent";
                    handleAnimatedClose();
                }} icon={<Calendar size={24} />} />
            </div>
        </>
    );
}