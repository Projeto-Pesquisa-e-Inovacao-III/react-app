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
import useModal from "../../../hooks/useModal";
import ErrorModal from "../ErrorModal/ErrorModal";
import SuccessModal from "../SuccessModal/SuccessModal";
import NewEvent from "../NewEvent/NewEvent";

type PopupModalProps = {
    closeThen: () => void;
    date: string;
};

//todo: instead of open new Event here, open the new event modal in the parent component.
export default function PopupModal({ closeThen, date }: Readonly<PopupModalProps>) {
    const isMobile = useMobile();
    const popupRef = useRef<HTMLDivElement>(null);
    const { isClosing, handleAnimatedClose } = useModalClose({
        onClose: () => closeThen(),
        duration: 200,
        lockScroll: false
    });

    const { 
        openModal, 
        setOpenModal, 
        textModal, 
        setTextModal 
    } = useModal(null, { title: "", content: "" });

    useClickOutside({
        ref: popupRef,
        callback: handleAnimatedClose,
    });

    const schedules = useQuery({
        queryKey: ["schedules"],
        queryFn: () => {
            const formattedDate = parseISO(date);
            return findPersonalRequests(
                0,
                "10",
                format(startOfDay(formattedDate), "yyyy-MM-dd'T'HH:mm:ss"),
                format(endOfDay(formattedDate), "yyyy-MM-dd'T'HH:mm:ss")
            );
        },
    })
    const agendamentos = schedules.data?.data?.content || [];

    const formattedDate = format(parseISO(date), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    function handleSuccessModalInfo(title: string, content: string) {
        setOpenModal("success");
        setTextModal({ title, content });
    }

    function handleErrorModalInfo(title: string, content: string) {
        setOpenModal("error");
        setTextModal({ title, content });
    }

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
                    <p>Carregando...</p>
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
                <SmallerButton classname="h-12" type="button" title="Novo agendamento" handleButtonClick={() => { setOpenModal("newEvent") }} icon={<Calendar size={24} />} />
            </div>


            {openModal === "newEvent" && (
                <NewEvent
                    isMobile={isMobile}
                    close={() => setOpenModal(null)}
                    openModalExtern={() => handleSuccessModalInfo("Agendado com sucesso", "Horário agendado com sucesso")}
                    errorModal={(title, description) => handleErrorModalInfo(title, description)}
                    insertedEvents={null}
                    title="Agendar horário"
                    buttonTitle="Avançar"
                />
            )
            }

            {
                openModal === "success" && (
                    <SuccessModal
                        isMobile={isMobile}
                        closeThen={() => setOpenModal(null)}
                        title={textModal.title}
                        content={textModal.content}
                    />
                )
            }

            {
                openModal === "error" && (
                    <ErrorModal
                        closeThen={() => setOpenModal(null)}
                        title={textModal.title}
                        content={textModal.content}
                    />
                )
            }
        </>
    );
}