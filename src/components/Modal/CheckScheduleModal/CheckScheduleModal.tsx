import React, { useEffect, useState } from "react";
import styles from "./CheckScheduleModal.module.css";
import Button from "../../Button/Button";
import MiniCalendar from "../../Calendars/MiniCalendar/CalendarMini";
import { format, parse } from "date-fns";
import SmallerButton from "../../SmallerButton";
import classNames from "classnames";
import { findAppointmentById, rescheduleAppointment } from "../../../constants/schedule";
import { useQuery } from "@tanstack/react-query";
import type { Schedule } from "../../../models/schedule";
import useMobile from "../../../hooks/isMobile";

type CheckScheduleModalProps = {
    closeThen: React.Dispatch<React.SetStateAction<boolean>>;
    isMobile: boolean;
    openSuccess: () => void;
    appointmentId: number;
};


export default function CheckScheduleModal({ closeThen, openSuccess, appointmentId }: CheckScheduleModalProps) {
    const isMobile = useMobile();
    const [openCalendar, setOpenCalendar] = useState(false)
    const [selectedDate, setSelectedDate] = useState("")
    const [rescheduleReason, setRescheduleReason] = useState("")
    const [newEventStartHour, setNewEventStartHour] = useState<string>("")

    function handleButtonClick(value: string) {
        setNewEventStartHour(value)
    }

    function handleOpenCalendar() {
        setOpenCalendar(true)
    }

    function handleCloseModal() {
        document.body.style.overflow = 'auto';
        closeThen(false);
    }

    function handleCloseCalendar() {
        setOpenCalendar(false)
    }

    useEffect(() => {
        if (selectedDate) {
            setOpenCalendar(false)
        }
    }, [selectedDate])

    useEffect(() => {
        document.body.style.overflow = 'hidden';
    }, []);

    const eventToReschedule = useQuery({
        queryKey: ["appointmentDetails"],
        queryFn: () => findAppointmentById(appointmentId),
        retry: false,
        select: (res) => res.data,
    });

    function handleReschedule() {
        if (selectedDate && newEventStartHour) {

            const payload: Schedule = {
                idAgendamento: appointmentId,
                data: selectedDate && newEventStartHour && `${selectedDate}T${newEventStartHour}`,
                descricao: rescheduleReason,
                endereco: {
                    numero: eventToReschedule?.data.endereco.numero || "",
                    tipo: eventToReschedule?.data.endereco.tipo || "",
                    complemento: eventToReschedule?.data.endereco.complemento || "",
                    cep: {
                        id: eventToReschedule?.data.endereco.cep.id || "",
                        logradouro: eventToReschedule?.data.endereco.cep.logradouro || "",
                        bairro: eventToReschedule?.data.endereco.cep.bairro || "",
                        localidade: eventToReschedule?.data.endereco.cep.localidade || "",
                        uf: eventToReschedule?.data.endereco.cep.uf || ""
                    }
                }
            };

            rescheduleAppointment(payload).then(() => {
                openSuccess();
            }).catch((error) => {
                console.error("Erro ao reagendar o agendamento:", error);
            });

        }
    }

    return (
        <>
            <div className="overlay"></div>
            <div className={styles.modalCheckSchedule}>
                <div className={styles.titleX}>
                    <h2>Reagendar</h2>
                    <svg className={styles.exitIcon} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={handleCloseModal}>
                        <path d="M2 20L11 11M20 2L11 11M11 11L20 20M11 11L2 2" stroke="#858D9D" strokeWidth="3" />
                    </svg>
                </div>
                <div className={styles.contentModal}>
                    {/* <div className={styles.lineFormModal}>
                        <p className={styles.textFormModal}>Local:</p>
                        <input className={styles.inputModal} type="text" placeholder="Academia" />
                    </div> */}
                    <div className={styles.lineFormModal}>
                        <p className={styles.textFormModal}>Data:</p>
                        <input
                            className={styles.inputModal}
                            type="text"
                            placeholder="Selecione a data"
                            value={selectedDate ? format(parse(selectedDate, "yyyy-MM-dd", new Date()), "dd/MM/yyyy") : ""}
                            onClick={handleOpenCalendar}
                            readOnly
                        />
                    </div>
                    <div className={styles.hours}>
                        <div className={classNames(styles.buttonHourNewEvent, { [styles.buttonHourNewEventSelected]: newEventStartHour === "08:00:00" })}>
                            <SmallerButton type="button" title="08:00" value="08:00:00" selected={eventToReschedule?.data?.dataInicio.split("T")[1] === "08:00:00" ? true : newEventStartHour === "08:00:00"}
                                handleButtonClick={handleButtonClick} />
                        </div>
                        <div className={classNames(styles.buttonHourNewEvent, { [styles.buttonHourNewEventSelected]: newEventStartHour === "09:00:00" })}>
                            <SmallerButton type="button" title="09:00" value="09:00:00" selected={eventToReschedule?.data?.dataInicio.split("T")[1] === "09:00:00" ? true : newEventStartHour === "09:00:00"}
                                handleButtonClick={handleButtonClick} />
                        </div>
                        <div className={classNames(styles.buttonHourNewEvent, { [styles.buttonHourNewEventSelected]: newEventStartHour === "10:00:00" })}>
                            <SmallerButton type="button" title="10:00" value="10:00:00" selected={eventToReschedule?.data?.dataInicio.split("T")[1] === "10:00:00" ? true : newEventStartHour === "10:00:00"}
                                handleButtonClick={handleButtonClick} />
                        </div>
                        <div className={classNames(styles.buttonHourNewEvent, { [styles.buttonHourNewEventSelected]: newEventStartHour === "11:00:00" })}>
                            <SmallerButton type="button" title="11:00" value="11:00:00" selected={eventToReschedule?.data?.dataInicio.split("T")[1] === "11:00:00" ? true : newEventStartHour === "11:00:00"}
                                handleButtonClick={handleButtonClick} />
                        </div>
                    </div>
                    <div className={styles.lineMotivoModal}>
                        <p className={styles.textFormModal}>Motivo:</p>
                        <textarea className={styles.textareaMotivo} placeholder="Descreva o motivo do reagendamento" onInput={(e) => setRescheduleReason((e.target as HTMLTextAreaElement).value)}></textarea>
                    </div>
                    <div className="line-button">
                        <Button type="button" title="Reagendar" classNameVariable="btn-check-schedule reschedule-modal" onClick={handleReschedule} />
                    </div>
                </div>

                {openCalendar && (
                    <>
                        <div className={styles.calendarOverlay} onClick={handleCloseCalendar}></div>
                        <div className={classNames(styles.miniCalendar, { [styles.miniCalendarMobile]: isMobile })}>
                            <svg
                                className={styles.calendarExitIcon}
                                width="20"
                                height="20"
                                viewBox="0 0 22 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                onClick={handleCloseCalendar}
                            >
                                <path d="M2 20L11 11M20 2L11 11M11 11L20 20M11 11L2 2" stroke="#858D9D" strokeWidth="3" />
                            </svg>
                            <MiniCalendar clickedDate={setSelectedDate} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

