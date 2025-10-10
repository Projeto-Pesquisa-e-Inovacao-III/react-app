import "./mobile.css";
import "./desktop.css";
import { useEffect, useState } from "react";
import axios from "axios";
import CalendarMonthStyledMobile from "../CalendarMonthStyled/CalendarMonthStyledMobile/CalendarMonthStyledMobile";
import { createEvent } from "../../constants/calendar";
import CalendarMonthStyledDesktop from "../CalendarMonthStyled/CalendarMonthStyledDesktop/CalendarMonthStyledDesktop";
import { checkDebugConnection } from "../CheckConnection/CheckConnection";

export default function NewEvent(
    { isMobile, close, openModal, insertedEvents, insertEvent, title = "Novo Evento" }: { isMobile: boolean; close: React.Dispatch<React.SetStateAction<boolean>>; openModal: React.Dispatch<React.SetStateAction<boolean>>; insertedEvents: any[]; insertEvent: React.Dispatch<React.SetStateAction<any[]>>; title?: string }
) {
    const [newEventTitle, setNewEventTitle] = useState<string>("");
    const [newEventDate, setNewEventDate] = useState<string>("");
    const [newEventStartHour, setNewEventStartHour] = useState<string>("");
    const [selectedType, setSelectedType] = useState<string>("personal");
    const [selectedLocation, setSelectedLocation] = useState<string>("casa");

    const [postalCode, setPostalCode] = useState<string>("");
    const [address, setAddress] = useState<any>(null);
    const [city, setCity] = useState<string>("");
    const [number, setNumber] = useState<string>("");
    const [complement, setComplement] = useState<string>("");

    useEffect(() => {
        // ViaCEP API integration
        if (postalCode.length === 8) {
            //CEP has 8 digits
            axios.get(`https://viacep.com.br/ws/${postalCode}/json/`)
                .then(response => {
                    console.log("Endereço encontrado:", response.data);
                    setAddress(`${response.data.logradouro} - ${response.data.bairro}`);
                    setCity(response.data.localidade);
                })
                .catch(error => {
                    console.error("Erro ao buscar endereço:", error);
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
        setNewEventTitle(calculatedTitle);


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

        if (newEventTitle || calculatedTitle && newEventDate) {
            console.log("colocou no eventsMock");
            openModal(true);
            close(false)
        }
        if (insertedEvents) {
            insertEvent([...insertedEvents, { title: calculatedTitle, date: `${newEventDate}`, hour: `${newEventStartHour}` }]);
        }



    }

    function handleButtonClick(event: React.MouseEvent<HTMLButtonElement>, hour: string) {
        event.preventDefault();
        console.log("clicou no botão da hora", hour);
        setNewEventStartHour(hour);
        const button = document.getElementById("btn" + hour.split(":")[0]);

        if (button) {
            const buttons = document.querySelectorAll('.btn-sched');
            buttons.forEach(btn => btn.classList.remove('btn-selected'));

            button.classList.add('btn-selected');
        }

    }

    return (
        <>
            <div className={`new-event-form${isMobile ? "-mobile" : ""}`}>
                <div className={`top-new-event${isMobile ? "-mobile" : ""}`}>
                    {isMobile ? (
                        <>
                            <div className="go-back-mobile" onClick={() => close(false)}>
                                <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
                                    <path
                                        d="M7 10.75L1 5.74998M1 5.74998L7 0.75M1 5.74998H13.5"
                                        stroke="black"
                                    />
                                </svg>
                                <span>Voltar</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <h1>{title}</h1>
                            <svg
                                onClick={() => close(false)}
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
                        {isMobile ? (
                            <CalendarMonthStyledMobile
                                clickedDate={setNewEventDate}
                                createdEvents={insertedEvents}
                            />
                        ) : (
                            <CalendarMonthStyledDesktop
                                clickedDate={setNewEventDate}
                                createdEvents={insertedEvents}
                            />
                        )}

                        <div className="hours">
                            {["08", "09", "10", "11"].map((h) => (
                                <button
                                    key={h}
                                    id={`btn${h}`}
                                    className="btn-sched"
                                    type="button"
                                    onClick={(e) => handleButtonClick(e, `${h}:00:00`)}
                                >
                                    {h}:00
                                </button>
                            ))}
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
                            <button className="btn-sched" type="submit">
                                Agendar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
