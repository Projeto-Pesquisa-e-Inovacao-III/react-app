import "./mobile.css";
import "./desktop.css";
import { use, useEffect, useState } from "react";
import axios from "axios";
import { createEvent } from "../../constants/calendar";
import { checkDebugConnection } from "../CheckConnection/CheckConnection";
import CalendarMonthStyled from "../Calendars/CalendarMonthStyled/CalendarMonthStyled";
import SmallerButton from "../SmallerButton";
import { cepMask } from "../../utils/mascara";

type NewEventProps = {
    isMobile: boolean;
    close: React.Dispatch<React.SetStateAction<boolean>>;
    openModal: React.Dispatch<React.SetStateAction<boolean>>;
    insertedEvents: any[];
    insertEvent: React.Dispatch<React.SetStateAction<any[]>>;
    title?: string;
    buttonTitle?: string;
    isReschedule?: boolean;
    rescheduleId?: number | null;
};

export default function NewEvent(
    { isMobile, close, openModal, insertedEvents, insertEvent, title = "Novo Evento", buttonTitle, rescheduleId, isReschedule }: NewEventProps
) {
    const [newEventDate, setNewEventDate] = useState<string>("");
    const [newEventStartHour, setNewEventStartHour] = useState<string>("");
    const [selectedType, setSelectedType] = useState<string>("personal");
    const [selectedLocation, setSelectedLocation] = useState<string>("casa");

    const [postalCode, setPostalCode] = useState<string>("");
    const [address, setAddress] = useState<any>(null);
    const [city, setCity] = useState<string>("");
    const [number, setNumber] = useState<string>("");
    const [complement, setComplement] = useState<string>("");

    let eventToReschedule = insertedEvents?.find(event => event?.id === rescheduleId);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
    }, []);

    useEffect(() => {
        console.log("newEventStartHour ", newEventStartHour);
    }, [newEventStartHour]);


    useEffect(() => {
        if (postalCode.length === 8) {
            axios.get(`https://viacep.com.br/ws/${postalCode}/json/`)
                .then(response => {
                    setAddress(`${response.data.logradouro} - ${response.data.bairro}`);
                    setCity(response.data.localidade);
                })
                .catch(error => {
                    console.error("Erro ao buscar endereço pelo CEP:", error);
                });
        }
    }, [postalCode]);

    async function handleNewEvent(e: React.FormEvent) {
        e.preventDefault();

        if (!newEventDate || !newEventStartHour) {
            alert("Por favor, selecione uma data e horário para o evento.");
            return;
        }

        if (!postalCode || address === null) {
            alert("Por favor, insira um CEP válido para o endereço.");
            return;
        }

        if (!number) {
            alert("Por favor, insira o número do endereço.");
            return;
        }
        
        //debugging - check if backend is reachable
        const isDatabaseConnected = await checkDebugConnection();
        console.log("isDatabaseConnected", isDatabaseConnected);

        const calculatedTitle = `${newEventDate} - ${newEventStartHour}`;


        if (isDatabaseConnected) {
            console.log("tentando salvar no banco");
            console.log(isDatabaseConnected)
            await createEvent({ title: calculatedTitle, dateTime: `${newEventDate}T${newEventStartHour}` })
                .then(response => {
                    console.log("Evento salvo com sucesso:", response.data);
                    console.log("seguindo para inserir na lista")
                }).catch(error => {
                    console.error("Erro ao salvar evento:", error);
                });
        }

        if (calculatedTitle && newEventDate) {
            openModal(true);
            handleClose();
        }

        if (isReschedule) {
            const updateEvent = insertedEvents.map(event => {
                return event.id === rescheduleId ? { ...event, date: newEventDate, hour: newEventStartHour } : event;
            });

            insertEvent(updateEvent);
        }

        if (!isReschedule && insertedEvents) {
            insertEvent([...insertedEvents, { id: Date.now(), title: calculatedTitle, date: `${newEventDate}`, hour: `${newEventStartHour}` }]);
        }



    }

    function handleClose() {
        document.body.style.overflow = 'auto';
        close(false);
    }

    function handleButtonClick(hour: string) {
        setNewEventStartHour(hour);
    }

    return (
        <>
            <div className="overlay"></div>
            <div className={`new-event-form${isMobile ? "-mobile" : ""}`}>
                <div className={`top-new-event${isMobile ? "-mobile" : ""}`}>
                    {isMobile ? (
                        <>
                            <div className="go-back-mobile" onClick={handleClose}>
                                <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
                                    <path
                                        d="M7 10.75L1 5.74998M1 5.74998L7 0.75M1 5.74998H13.5"
                                        stroke="black"
                                    />
                                </svg>
                                <span>Voltar</span>

                            </div>
                            <h1>{title}</h1>
                        </>
                    ) : (
                        <>
                            <h1>{title}</h1>
                            <svg
                                onClick={handleClose}
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </>
                    )}
                </div>

                <div className={`wrapper-new-event${isMobile ? "-mobile" : ""}`}>
                    <div className={`calendar-small${isMobile ? "-mobile" : ""}`}>
                        <CalendarMonthStyled
                            clickedDate={setNewEventDate}
                            createdEvents={insertedEvents}
                            eventToReschedule={eventToReschedule?.date}
                            isMobile={isMobile}
                        />

                        <div className="hours">
                            <div className={`button-hour-new-event ${newEventStartHour === "08:00:00" ? "button-hour-new-event-selected" : ""}`}>
                                <SmallerButton type="button" title="08:00" value="08:00:00" selected={eventToReschedule?.hour === "08:00:00" ? true : newEventStartHour === "08:00:00"}
                                    handleButtonClick={handleButtonClick} />
                            </div>
                            <div className={`button-hour-new-event ${newEventStartHour === "09:00:00" ? "button-hour-new-event-selected" : ""}`}>
                                <SmallerButton type="button" title="09:00" value="09:00:00" selected={eventToReschedule?.hour === "09:00:00" ? true : newEventStartHour === "09:00:00"}
                                    handleButtonClick={handleButtonClick} />
                            </div>
                            <div className={`button-hour-new-event ${newEventStartHour === "10:00:00" ? "button-hour-new-event-selected" : ""}`}>
                                <SmallerButton type="button" title="10:00" value="10:00:00" selected={eventToReschedule?.hour === "10:00:00" ? true : newEventStartHour === "10:00:00"}
                                    handleButtonClick={handleButtonClick} />
                            </div>
                            <div className={`button-hour-new-event ${newEventStartHour === "11:00:00" ? "button-hour-new-event-selected" : ""}`}>
                                <SmallerButton type="button" title="11:00" value="11:00:00" selected={eventToReschedule?.hour === "11:00:00" ? true : newEventStartHour === "11:00:00"}
                                    handleButtonClick={handleButtonClick} />
                            </div>
                        </div>
                    </div>

                    <form
                        className={`input-infos-form${isMobile ? "-mobile" : ""}`}
                        onSubmit={handleNewEvent}
                    >
                        <div className={`wrapper-inputs${isMobile ? "-mobile" : ""}`}>
                            <div className="input-group">
                                <label>Tipo</label>
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                >
                                    <option value="personal">Personal</option>
                                    <option value="consultoria">Consultoria</option>
                                    <option value="outro">Outro</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label>Local</label>
                                <select
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                >
                                    <option value="casa">Casa</option>
                                    <option value="academia">Academia</option>
                                    <option value="outro">Outro</option>
                                </select>
                            </div>

                            {selectedLocation === "casa" && (
                                <div className="input-group-address">
                                    <div className="input-group double-input">
                                        <input
                                            type="text"
                                            placeholder="CEP"
                                            onChange={(e) => setPostalCode((e.target.value).split("-").join("").trim())}
                                            onInput={cepMask}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Cidade"
                                            className="disabled"
                                            disabled
                                            value={city || ""}
                                        />
                                    </div>
                                    <div className="input-group input-group-max">
                                        <input
                                            type="text"
                                            placeholder="Endereço"
                                            className="input-address disabled"
                                            disabled
                                            value={address || ""}
                                        />
                                    </div>
                                    <div className="input-group double-input">
                                        <input
                                            className="input-number"
                                            type="text"
                                            placeholder="N°"
                                            value={number || ""}
                                            onChange={(e) => setNumber(e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Complemento"
                                            value={complement || ""}
                                            onChange={(e) => setComplement(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="submit-button">
                            <SmallerButton type="submit" title={buttonTitle || "Agendar"} />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}