import React, { useEffect, useState } from "react";
import styles from "./CheckScheduleModal.module.css";
import Button from "../../Button/Button";
import MiniCalendar from "../../Calendars/MiniCalendar/CalendarMini";


export default function CheckScheduleModal({closeThen, isMobile, openSuccess, }: { closeThen: React.Dispatch<React.SetStateAction<boolean>>, isMobile: boolean, openSuccess: ()=> void }) {

    const [openCalendar, setOpenCalendar] = useState(false)
    const [selectedDate, setSelectedDate] = useState("")


    
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


    return (
        <>
            <div className="overlay"></div> 
            <div className={styles.modalCheckSchedule}>
                <div className={styles.titleX}>
                    <h2>Reagendar</h2>
                    <svg className={styles.exitIcon} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={handleCloseModal}>
                        <path d="M2 20L11 11M20 2L11 11M11 11L20 20M11 11L2 2" stroke="#858D9D" strokeWidth="3"/>
                    </svg>
                </div>
                <div className={styles.contentModal}>
                    <div className={styles.lineFormModal}>
                        <p className={styles.textFormModal}>Local:</p>
                        <input className={styles.inputModal} type="text" placeholder="Academia" />
                    </div>
                    <div className={styles.lineFormModal}>
                        <p className={styles.textFormModal}>Data:</p>
                        <input 
                            className={styles.inputModal} 
                            type="text" 
                            placeholder="Selecione a data" 
                            value={selectedDate}
                            onClick={handleOpenCalendar}
                            readOnly
                        />
                    </div>
                    <div className={styles.lineFormModal}>
                        <p className={styles.textFormModal}>Horario:</p>
                        <input className={styles.inputModal} type="time" placeholder="Horario" />
                    </div>
                    <div className={styles.lineMotivoModal}>
                        <p className={styles.textFormModal}>Motivo:</p>
                        <textarea className={styles.textareaMotivo} placeholder="Descreva o motivo do reagendamento"></textarea>
                    </div>
                    <div className="line-button">
                        <Button type="button" title="Reagendar" classNameVariable="btn-check-schedule reschedule-modal" onClick={openSuccess} />
                    </div>
                </div>
                
               {openCalendar && (
                <>
                    <div className={styles.calendarOverlay} onClick={handleCloseCalendar}></div>
                    <div className={styles.miniCalendar}>
                        <svg 
                            className={styles.calendarExitIcon} 
                            width="20" 
                            height="20" 
                            viewBox="0 0 22 22" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg" 
                            onClick={handleCloseCalendar}
                        >
                            <path d="M2 20L11 11M20 2L11 11M11 11L20 20M11 11L2 2" stroke="#858D9D" strokeWidth="3"/>
                        </svg>
                        <MiniCalendar clickedDate={setSelectedDate} />
                    </div>
                </>
               )}
            </div>
        </>
    );
}

