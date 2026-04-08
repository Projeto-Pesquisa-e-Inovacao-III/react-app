import { useRef, useState } from "react";
import useModalClose from "../../../hooks/useModalClose";
import styles from "./InfoPersonalSchedulesModal.module.css";
import useClickOutside from "../../../hooks/useClickOutside";
import SmallerButton from "../../SmallerButton/SmallerButton";
import classnames from "classnames";
import { SimpleAppointmentCard } from "../../SimpleAppointmentCard/SimpleAppointmentCard";
import useMobile from "../../../hooks/isMobile";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationInfo = {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
};

type InfoPersonalSchedulesModalProps = {
    closeThen: () => void;
    onConfirm: () => void;
    schedules: any[];
    pagination?: PaginationInfo | null;
    fetchPage?: (page: number) => Promise<void>;
};

export default function InfoPersonalSchedulesModal({ closeThen, schedules, onConfirm, pagination, fetchPage }: Readonly<InfoPersonalSchedulesModalProps>) {
    const isMobile = useMobile();
    const modalRef = useRef<HTMLDivElement>(null);
    const [enableButton, setEnableButton] = useState(false);

    const { isClosing, handleAnimatedClose } = useModalClose({
        onClose: closeThen,
        duration: 200,
        lockScroll: false
    });

    useClickOutside({
        ref: modalRef,
        callback: handleAnimatedClose,
    });

    const [page, setPage] = useState(pagination?.number ?? 0);

    async function handlePaginationChange(newPage: number) {
        setPage(newPage);
        await fetchPage?.(newPage);
    }

    console.log(page)
    return (
        <>
            <div
                className={classnames("overlay", {
                    [styles.backdropEnter]: !isClosing,
                    [styles.closingBackdrop]: isClosing,
                })}
                onClick={handleAnimatedClose}
            />
            <div ref={modalRef} className={classnames(styles.popupModal, {
                [styles.popupEnter]: !isClosing,
                [styles.closing]: isClosing,
            })}>
                <div className={styles.header}>
                    <div>
                        <h2>Deseja ainda continuar?</h2>
                        <p>Seus agendamentos atuais não serão cancelados.</p>
                    </div>
                </div>

                <CountdownCircleTimer
                    isPlaying
                    duration={1}
                    colors="#093a5d"
                    size={50}
                    strokeWidth={3}
                    onComplete={() => {
                        setEnableButton(true);
                    }}
                >
                    {({ remainingTime }) => remainingTime}
                </CountdownCircleTimer>

                <div className={styles.cardList}>
                    {schedules.map((agendamento: any) => {
                        const formattedDate = agendamento.data
                            ? format(parse(agendamento.data, "yyyy-MM-dd", new Date()), "dd/MM/yyyy", { locale: ptBR })
                            : "";

                        return (
                            <SimpleAppointmentCard
                                key={agendamento.id}
                                name={agendamento.alunoName || ""}
                                date={formattedDate}
                                id={agendamento.id}
                                pathImage={agendamento.pathImage}
                            />
                        );
                    })}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex gap-3 justify-end">
                            <SmallerButton
                                icon={<ChevronLeft />}
                                classname={`w-22! h-10! items-center ${page === 0 ? styles.buttonDisabled : ""}`}
                                handleButtonClick={() => {
                                    if (page > 0) handlePaginationChange(page - 1);
                                }}
                            />

                            <SmallerButton
                                icon={<ChevronRight />}
                                classname={`w-22! h-10! items-center ${page === pagination.totalPages - 1 ? styles.buttonDisabled : ""}`}
                                handleButtonClick={() => {
                                    if (page < pagination.totalPages - 1) handlePaginationChange(page + 1);
                                }}
                            />
                        </div>
                    )}
                </div>


                <div className={isMobile ? styles.buttonsGroupModalMobile : styles.buttonsGroupModal}>
                    <SmallerButton
                        type="button"
                        classname={enableButton ? "bg-red-900! h-12!" : "bg-gray-400! h-12 cursor-not-allowed!"}
                        title="Desativar"
                        disabled={!enableButton}
                        handleButtonClick={() => {
                            onConfirm();
                            handleAnimatedClose();
                        }}
                    />
                    <SmallerButton classname="h-12" type="button" title="Cancelar" handleButtonClick={handleAnimatedClose} />
                </div>
            </div>
        </>
    );
}
