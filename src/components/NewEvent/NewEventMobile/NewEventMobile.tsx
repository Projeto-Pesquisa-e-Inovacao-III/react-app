import "./style.css";
import { useEffect, useState } from "react";
import CalendarMonthStyled from "../../CalendarMonthStyled/CalendarMonthStyledDesktop/CalendarMonthStyledDesktop";
import { createEvent } from "../../../constants/calendar";
import { checkDebugConnection } from "../../CheckConnection/CheckConnection";
import axios from "axios";
import CalendarMonthStyledMobile from "../../CalendarMonthStyled/CalendarMonthStyledMobile/CalendarMonthStyledMobile";

export default function NewEventMobile(
    { close, openModal, insertedEvents, insertEvent, title = "Novo Evento" }: { close: React.Dispatch<React.SetStateAction<boolean>>; openModal: React.Dispatch<React.SetStateAction<boolean>>; insertedEvents: any[]; insertEvent: React.Dispatch<React.SetStateAction<any[]>>; title?: string }
) {

    const [openNewEvent, setOpenNewEvent] = useState<boolean>(true);
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


    // useEffect(() => {
    //     if (openNewEvent) {
    //         document.body.style.overflow = "hidden";
    //     } else {
    //         document.body.style.overflow = "auto";
    //         close(false);
    //     }
    // }, [openNewEvent]);


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
            setOpenNewEvent(false);
            close(false)
        }
        if (insertedEvents) {

            // insertEvent([...insertedEvents, { title: calculatedTitle, start: `${newEventDate}T${newEventStartHour}`, end: `${newEventDate}T09:00:00` }]); // t09 é só um horário fixo de fim do evento, pq não tem input para isso ainda
            insertEvent([...insertedEvents, { title: calculatedTitle, date: `${newEventDate}`, hour: `${newEventStartHour}` }]); // t09 é só um horário fixo de fim do evento, pq não tem input para isso ainda
            // t09 é só um horário fixo de fim do evento, pq não tem input para isso ainda
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
            <div className="new-event-form-mobile">

                <div className="top-new-event-mobile">
                    <div className="go-back-mobile" onClick={() => { close(false); }}>
                        <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 10.75L1 5.74998M1 5.74998L7 0.75M1 5.74998H13.5" stroke="black" />
                        </svg>
                        <span>Voltar</span>
                    </div>
                    <h1>{title}</h1>
                    {/* temporary */}
                    {/* <button onClick={() => setOpenNewEvent(false)} style={{ marginTop: "12px", padding: "8px 16px", backgroundColor: "#c50000ff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>CLOSE</button> */}
                </div>

                <div className="wrapper-new-event-mobile">
                    <div className="calendar-small-mobile">
                        <CalendarMonthStyledMobile clickedDate={setNewEventDate} createdEvents={insertedEvents} />
                        <div className="hours">
                            {/* falar com o pedro/jp se dá pra simplificar isso */}
                            <button id="btn08" className="btn-sched" type="button" onClick={(e) => handleButtonClick(e, "08:00:00")}>08:00</button>
                            <button id="btn09" className="btn-sched" type="button" onClick={(e) => handleButtonClick(e, "09:00:00")}>09:00</button>
                            <button id="btn10" className="btn-sched" type="button" onClick={(e) => handleButtonClick(e, "10:00:00")}>10:00</button>
                            <button id="btn11" className="btn-sched" type="button" onClick={(e) => handleButtonClick(e, "11:00:00")}>11:00</button>
                        </div>
                    </div>
                    <form className="input-infos-form-mobile" onSubmit={handleNewEvent}>



                        <div className="wrapper-inputs-mobile">
                            <div className="input-group">
                                <label htmlFor="">Tipo</label>
                                <select name="" id="" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                                    <option value="personal">Personal</option>
                                    <option value="consultoria">Consultoria</option>
                                    <option value="outro">Outro</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label htmlFor="">Local</label>
                                <select name="" id="" value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                                    <option value="casa">Casa</option>
                                    <option value="academia">Academia</option>
                                    <option value="outro">Outro</option>
                                </select>
                            </div>

                            {
                                selectedLocation === "casa" ? (
                                    <>
                                        <div className="input-group-address">
                                            <div className="input-group double-input">
                                                {/*Change all this to good templates*/}
                                                <input type="text" placeholder="CEP" onChange={(e) => setPostalCode(e.target.value)} />
                                                <input type="text" placeholder="Cidade" className="disabled" disabled value={city || ""} />
                                            </div>
                                            <div className="input-group double-input">
                                                <input
                                                    type="text"
                                                    placeholder="Endereço"
                                                    className="input-address disabled"
                                                    disabled
                                                    value={address || ""}
                                                />
                                                <input className="input-number" type="text" placeholder="N°" value={number || ""} onChange={(e) => setNumber(e.target.value)} />
                                            </div>
                                            <div className="input-group input-group-max">
                                                <input type="text" placeholder="Complemento" value={complement || ""} onChange={(e) => setComplement(e.target.value)} />
                                            </div>
                                        </div>
                                    </>
                                ) : null
                            }
                        </div>
                        <div className="submit-button">
                            <button className="btn-sched" type="submit">Agendar</button>
                        </div>
                    </form>
                </div>
            </div >
        </>
    );
}
