import { use, useEffect, useState } from "react";
import axios from "axios";
import { createEvent } from "../../constants/calendar";
import { checkDebugConnection } from "../CheckConnection/CheckConnection";
import CalendarMonthStyled from "../Calendars/CalendarMonthStyled/CalendarMonthStyled";
import SmallerButton from "../SmallerButton";
import styles from './NewEvent.module.css';
import classnames from 'classnames';
import Select from "../Inputs/Select";
import { useNavigate } from "react-router-dom";
import { cepMask } from "../../utils/mascara";
import { ArrowLeftIcon, MapPin } from "lucide-react";
import CardInfo from "../CardInfo/CardInfo";

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
    clickedDate?: string;
};

export default function NewEvent(
    { isMobile, close, openModal, insertedEvents, insertEvent, title = "Novo Evento", buttonTitle, rescheduleId, isReschedule, clickedDate }: NewEventProps
) {
    const [newEventDate, setNewEventDate] = useState<string>(clickedDate || "");
    const [newEventStartHour, setNewEventStartHour] = useState<string>("");
    const [selectedType, setSelectedType] = useState<string>("personal");
    const [selectedLocation, setSelectedLocation] = useState<string>("casa");

    const [postalCode, setPostalCode] = useState<string>("");
    const [address, setAddress] = useState<any>(null);
    const [city, setCity] = useState<string>("");
    const [number, setNumber] = useState<string>("");
    const [complement, setComplement] = useState<string>("");
    const [state, setState] = useState<string>("");
    const [step, setStep] = useState<number>(1);

    const [formattedDate, setFormattedDate] = useState<string>("");

    let eventToReschedule = insertedEvents?.find(event => event?.id === rescheduleId);


    useEffect(() => {
        if (newEventDate && newEventStartHour) {
            console.log("newEventDate:", newEventDate);
            console.log("newEventStartHour:", newEventStartHour);

            const dateStr = newEventDate;
            const hourStr = newEventStartHour;

            const date = new Date(`${dateStr}T${hourStr}`);

            const formatted = date.toLocaleString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
            setFormattedDate(formatted);
        }
    }, [newEventDate, newEventStartHour]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        console.log("clickedDate no NewEvent:", clickedDate);
    }, []);

    useEffect(() => {
        if (postalCode.length === 8) {
            axios.get(`https://viacep.com.br/ws/${postalCode}/json/`)
                .then(response => {
                    setAddress(`${response.data.logradouro} - ${response.data.bairro}`);
                    setCity(response.data.localidade);
                    setState(response.data.uf);
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

    const navigation = useNavigate();
    function handleClose() {
        document.body.style.overflow = 'auto';
        navigation("/schedule");
        close(false);
    }

    function handleButtonClick(hour: string) {
        setNewEventStartHour(hour);
    }

    function handleStepChange(stepNumber: number) {
        if (!newEventDate && !newEventStartHour) {
            alert("Por favor, selecione uma data e horário para o evento.");
            return;
        }
        setStep(stepNumber);
    }

    return (
        <>
            <div className={styles.overlay}></div>

            <div className={classnames(styles.newEventForm, { [styles.newEventFormMobile]: isMobile })}>
                <div className={classnames(styles.goBackMobile, { [styles.goBackMobileStepTwo]: step === 2 }, { [styles.goBackMobileStepOne]: step === 1 }, { [styles.goBackMobileStepOneDesktop]: step === 1 && !isMobile })}>
                    {isMobile && (
                        <div onClick={handleClose} className={styles.goBackButton}>
                            <svg

                                width="14" height="12" viewBox="0 0 14 12" fill="none">
                                <path
                                    d="M7 10.75L1 5.74998M1 5.74998L7 0.75M1 5.74998H13.5"
                                    stroke="black"
                                />
                            </svg>
                            <span>Voltar</span>
                        </div>
                    )}

                    {step === 1 && !isMobile && (

                        <>
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


                    {step === 2 && !isMobile && (
                        <div className={styles.goBackButton} onClick={() => handleStepChange(1)}>
                            <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
                                <path
                                    d="M7 10.75L1 5.74998M1 5.74998L7 0.75M1 5.74998H13.5"
                                    stroke="black"
                                />
                            </svg>
                            <span>Voltar</span>
                        </div>
                    )}


                    {step === 2 && (

                        <>
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
                <div className={classnames(styles.container, { [styles.containerMobile]: isMobile })}>
                    <div className={classnames(styles.mainTitle, { [styles.mainTitleMobile]: isMobile })}>
                        <h1>{title}</h1>
                    </div>
                    {step === 1 && (
                        <>
                            <CardInfo isMobile={isMobile} HeaderTitle="Personal" title="Fábio" subtitle="Idade: 88 anos" includeImg={true} />

                            {/* <div className={`wrapper-inputs${isMobile ? "-mobile" : ""}`}> */}
                            <div className={classnames(styles.wrapperInputs, { [styles.wrapperInputsMobile]: isMobile })}>
                                <div className={classnames(styles.inputGroup, { [styles.inputGroupMobile]: isMobile })}>
                                    <Select
                                        placeholder="Selecione o tipo"
                                        label="Tipo"
                                        options={["Personal", "Consultoria", "Outro"]}
                                        value={selectedType}
                                        onInputChange={setSelectedType}
                                        className={styles.selectComponent}
                                    />
                                </div>

                                <div className={classnames(styles.inputGroup, { [styles.inputGroupMobile]: isMobile })}>
                                    <Select
                                        placeholder="Selecione o local"
                                        label="Local"
                                        options={["Casa", "Academia", "Outro"]}
                                        value={selectedLocation}
                                        onInputChange={setSelectedLocation}
                                        className={styles.selectComponent}
                                    />
                                </div>
                            </div>
                            <div className={classnames(styles.wrapperNewEvent, { [styles.wrapperNewEventMobile]: isMobile })}>
                                <div className={classnames(styles.calendarSmall, { [styles.calendarSmallMobile]: isMobile })}>
                                    <CalendarMonthStyled
                                        clickedDate={setNewEventDate}
                                        clickedDateStr={newEventDate ? newEventDate : clickedDate}
                                        createdEvents={insertedEvents}
                                        eventToReschedule={eventToReschedule?.date}
                                        isMobile={isMobile}
                                    />

                                    <div className={styles.hours}>
                                        <div className={classnames(styles.buttonHourNewEvent, { [styles.buttonHourNewEventSelected]: newEventStartHour === "08:00:00" })}>
                                            <SmallerButton type="button" title="08:00" value="08:00:00" selected={eventToReschedule?.hour === "08:00:00" ? true : newEventStartHour === "08:00:00"}
                                                handleButtonClick={handleButtonClick} />
                                        </div>
                                        <div className={classnames(styles.buttonHourNewEvent, { [styles.buttonHourNewEventSelected]: newEventStartHour === "09:00:00" })}>
                                            <SmallerButton type="button" title="09:00" value="09:00:00" selected={eventToReschedule?.hour === "09:00:00" ? true : newEventStartHour === "09:00:00"}
                                                handleButtonClick={handleButtonClick} />
                                        </div>
                                        <div className={classnames(styles.buttonHourNewEvent, { [styles.buttonHourNewEventSelected]: newEventStartHour === "10:00:00" })}>
                                            <SmallerButton type="button" title="10:00" value="10:00:00" selected={eventToReschedule?.hour === "10:00:00" ? true : newEventStartHour === "10:00:00"}
                                                handleButtonClick={handleButtonClick} />
                                        </div>
                                        <div className={classnames(styles.buttonHourNewEvent, { [styles.buttonHourNewEventSelected]: newEventStartHour === "11:00:00" })}>
                                            <SmallerButton type="button" title="11:00" value="11:00:00" selected={eventToReschedule?.hour === "11:00:00" ? true : newEventStartHour === "11:00:00"}
                                                handleButtonClick={handleButtonClick} />
                                        </div>
                                    </div>
                                </div>

                                <div className={classnames(styles.buttonNextStep)}>
                                    <SmallerButton type="button" title={buttonTitle || "Avançar"} handleButtonClick={() => handleStepChange(2)} />
                                </div>

                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <div className={classnames(styles.inputInfosFormContainer, { [styles.inputInfosFormContainerMobile]: isMobile })}>
                            <CardInfo isMobile={isMobile} HeaderTitle="Confirmação do agendamento" title={formattedDate} subtitle="Personal: Fábio" />
                            <div className={styles.title}>
                                <MapPin />
                                <span>Endereço do local</span>
                            </div>
                            <form
                                className={classnames(styles.inputInfosForm, { [styles.inputInfosFormMobile]: isMobile })}
                                onSubmit={handleNewEvent}
                            >
                                <div className={classnames(styles.wrapperInputs, { [styles.wrapperInputsMobile]: isMobile })}>
                                    {selectedLocation === "casa" && (
                                        <div className={styles.inputGroupAddress}>
                                            <div className={classnames(styles.inputGroup, styles.labelInput)}>
                                                <label htmlFor="cep">CEP</label>
                                                <input
                                                    type="text"
                                                    id="cep"
                                                    placeholder="CEP"
                                                    onChange={(e) => setPostalCode((e.target.value).split("-").join("").trim())}
                                                    onInput={cepMask}
                                                />
                                            </div>
                                            <div className={classnames(styles.inputGroup, styles.inputGroupMax)}>
                                                <div className={styles.labelInput}>
                                                    <label htmlFor="city">Cidade</label>
                                                    <input
                                                        type="text"
                                                        id="city"
                                                        placeholder="Cidade"
                                                        className={classnames(styles.inputAddress, styles.disabled)}
                                                        disabled
                                                        value={city || ""}
                                                    />

                                                </div>
                                                <div className={classnames(styles.labelInput, styles.smallInput)}>
                                                    <label htmlFor="state">UF</label>
                                                    <input
                                                        className={classnames(styles.inputNumber, styles.disabled)}
                                                        type="text"
                                                        id="state"
                                                        placeholder="UF"
                                                        disabled
                                                        value={state || ""}
                                                        onChange={(e) => setState(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className={classnames(styles.inputGroup, styles.inputGroupMax)}>
                                                <div className={styles.labelInput}>
                                                    <label htmlFor="address">Endereço</label>
                                                    <input
                                                        type="text"
                                                        id="address"
                                                        placeholder="Endereço"
                                                        className={classnames(styles.inputAddress, styles.disabled)}
                                                        disabled
                                                        value={address || ""}
                                                    />
                                                </div>

                                                <div className={classnames(styles.labelInput, styles.smallInput)}>
                                                    <label htmlFor="number">N°</label>
                                                    <input
                                                        className={styles.inputNumber}
                                                        type="text"
                                                        id="number"
                                                        placeholder="N°"
                                                        value={number || ""}
                                                        onChange={(e) => setNumber(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className={classnames(styles.inputGroup, styles.doubleInput)}>
                                                <div className={styles.labelInput}>
                                                    <label htmlFor="complement">Complemento</label>
                                                    <input
                                                        type="text"
                                                        id="complement"
                                                        placeholder="Complemento"
                                                        value={complement || ""}
                                                        onChange={(e) => setComplement(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className={classnames(styles.buttonNextStep)}>
                                    <SmallerButton type="submit" title={"Confirmar agendamento"} />
                                </div>
                            </form>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}



