import React, { useEffect, useState } from "react";
import "./style.css";
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
            <div className={"modal-check-schedule"}>
                <div className="title-x">
                    <h2>Reagendar</h2>
                    <svg className="exit-icon" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={handleCloseModal}>
                        <path d="M2 20L11 11M20 2L11 11M11 11L20 20M11 11L2 2" stroke="#858D9D" stroke-width="3"/>
                    </svg>
                </div>
                <div className="content-modal">
                    <div className="line-form-modal">
                        <p className="text-form-modal">Local:</p>
                        <input className="input-modal" type="text" placeholder="Academia" />
                    </div>
                    <div className="line-form-modal">
                        <p className="text-form-modal">Data:</p>
                        <input 
                            className="input-modal" 
                            type="text" 
                            placeholder="Selecione a data" 
                            value={selectedDate}
                            onClick={handleOpenCalendar}
                            readOnly
                        />
                    </div>
                    <div className="line-form-modal">
                        <p className="text-form-modal">Horario:</p>
                        <input className="input-modal" type="time" placeholder="Horario" />
                    </div>
                    <div className="line-motivo-modal">
                        <p className="text-form-modal">Motivo:</p>
                        <textarea className="textarea-motivo " placeholder="Descreva o motivo do reagendamento"></textarea>
                    </div>
                    <div className="line-button">
                        <Button type="button" title="Reagendar" classNameVariable="btn-check-schedule reschedule-modal" onClick={openSuccess} />
                    </div>
                </div>
                
               {openCalendar && (
                <>
                    <div className="calendar-overlay" onClick={handleCloseCalendar}></div>
                    <div className="mini-calendar">
                        <svg 
                            className="calendar-exit-icon" 
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
