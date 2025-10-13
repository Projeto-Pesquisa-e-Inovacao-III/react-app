import "./mobile.css";
import "./desktop.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { createEvent } from "../../constants/calendar";
import { checkDebugConnection } from "../CheckConnection/CheckConnection";
import CalendarMonthStyled from "../CalendarMonthStyled/CalendarMonthStyled";
import SmallerButton from "../SmallerButton";

export default function NewEvent(
    { isMobile, close, openModal, insertedEvents, insertEvent, title = "Novo Evento", buttonTitle, rescheduleId }: { isMobile: boolean; close: React.Dispatch<React.SetStateAction<boolean>>; openModal: React.Dispatch<React.SetStateAction<boolean>>; insertedEvents: any[]; insertEvent: React.Dispatch<React.SetStateAction<any[]>>; title?: string; buttonTitle?: string; rescheduleId?: number | null }
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

    const [selectedButton, setSelectedButton] = useState<string>("");

    const eventToReschedule = insertedEvents?.find(event => event.id === rescheduleId);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
    }, []);

    useEffect(() => {
        // ViaCEP API integration
        if (postalCode.length === 8) {
            //CEP has 8 digits
            axios.get(`https://viacep.com.br/ws/${postalCode}/json/`)
                .then(response => {
                    setAddress(`${response.data.logradouro} - ${response.data.bairro}`);
                    setCity(response.data.localidade);
                })
                .catch(error => {
                });
        }
    }, [postalCode]);

    async function handleNewEvent(e: React.FormEvent) {
        e.preventDefault();

        if (!newEventDate || !newEventStartHour) {
            alert("Por favor, selecione uma data e horário para o evento.");
            return;
        }

        if (!postalCode || postalCode.length < 8 || !address || !city || !number) {
            alert("Por favor, insira um endereço válido.");
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
        if (insertedEvents) {
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
                            eventToReschedule={eventToReschedule}
                            isMobile={isMobile}
                        />

                        <div className="hours">
                            <SmallerButton type="button" title="08:00" value="08:00:00" selected={newEventStartHour === "08:00:00"} eventToReschedule={eventToReschedule} handleButtonClick={handleButtonClick} />

                            <SmallerButton type="button" title="09:00" value="09:00:00" selected={newEventStartHour === "09:00:00"} eventToReschedule={eventToReschedule} handleButtonClick={handleButtonClick} />

                            <SmallerButton type="button" title="10:00" value="10:00:00" selected={newEventStartHour === "10:00:00"} eventToReschedule={eventToReschedule} handleButtonClick={handleButtonClick} />

                            <SmallerButton type="button" title="11:00" value="11:00:00" selected={newEventStartHour === "11:00:00"} eventToReschedule={eventToReschedule} handleButtonClick={handleButtonClick} />
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
                                            onChange={(e) => setPostalCode(e.target.value)}
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
                            <SmallerButton type="submit" title={buttonTitle || "Agendar"} eventToReschedule={eventToReschedule} />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
