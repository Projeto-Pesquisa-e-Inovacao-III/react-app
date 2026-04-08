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
import { usePagination } from "../../../hooks/usePagination";
import PaginatedList from "../../PaginatedList/PaginatedList";

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

    const { page, goToPage, animClass } = usePagination(pagination?.number ?? 0);

    async function handlePaginationChange(newPage: number) {
        goToPage(newPage);
        await fetchPage?.(newPage);
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

                <PaginatedList
                    key={page}
                    page={page}
                    animClass={animClass}
                    pagination={pagination}
                    onPageChange={handlePaginationChange}
                    listClassName={styles.cardList}
                    buttonDisabledClass={styles.buttonDisabled}
                >
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
                </PaginatedList>


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
