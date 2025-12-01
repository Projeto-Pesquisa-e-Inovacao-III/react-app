import { use, useEffect, useMemo, useState } from "react";
import axios from "axios";
import CalendarMonthStyled from "../Calendars/CalendarMonthStyled/CalendarMonthStyled";
import SmallerButton from "../SmallerButton";
import styles from './NewEvent.module.css';
import classnames from 'classnames';
import Select from "../Inputs/Select/Select";
import { useNavigate } from "react-router-dom";
import { cepMask } from "../../utils/mascara";
import { Clock, MapPin, Sun, SunMoon, Sunrise, Sunset } from "lucide-react";
import CardInfo from "../CardInfo/CardInfo";
import { createAddress } from "../../constants/address";
import type { Address } from "../../models/address";
import { getPersonalList, insertAppointment, rescheduleAppointment } from "../../constants/schedule";
import type { Schedule } from "../../models/schedule";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ErrorModal from "../Modal/ErrorModal/ErrorModal";
import { differenceInYears, format, parse, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getPersonalProfile } from "../../constants/personal";

type NewEventProps = {
    isMobile: boolean;
    close: React.Dispatch<React.SetStateAction<boolean>> | (() => void);
    openModal: (() => void);
    errorModal: ((title: string, description: string) => void);
    insertedEvents: any[];
    title?: string;
    buttonTitle?: string;
    isReschedule?: boolean;
    rescheduleId?: number | null;
    clickedDate?: string;
};

type AddressState = {
    postalCode: string;
    address: string;
    city: string;
    state: string;
    number: string;
    complement: string;
};

type modalTypes = "error" | null;

export default function NewEvent(
    { isMobile, close, openModal, errorModal, insertedEvents, title = "Novo Evento", buttonTitle, rescheduleId, isReschedule, clickedDate }: NewEventProps
) {
    const [modal, setModal] = useState<modalTypes>(null);

    const [newEventDate, setNewEventDate] = useState<string>(clickedDate || "");
    const [newEventStartHour, setNewEventStartHour] = useState<string>();
    const [selectedType, setSelectedType] = useState<string>("PRESENCIAL");
    const [selectedLocation, setSelectedLocation] = useState<string>("CASA");

    console.log("Inserted Events: ", insertedEvents);

    const [addressData, setAddressData] = useState<AddressState>({
        postalCode: "",
        address: "",
        city: "",
        state: "",
        number: "",
        complement: ""
    });

    const [step, setStep] = useState<number>(1);

    const [modalInfo, setModalInfo] = useState<{
        title: string,
        description: string
    }>({ title: "Houve um erro", description: "Ocorreu um erro inesperado." });

    const queryClient = useQueryClient();


    let eventToReschedule = rescheduleId ? insertedEvents?.find(event => event?.agendamentoId === rescheduleId) : undefined;

    const formattedDate = useMemo(() => {
        if (newEventDate && newEventStartHour) {
            const date = new Date(`${newEventDate}T${newEventStartHour}`);

            const initialHour = date.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
            });

            const finalHour = date.setHours(date.getHours() + 1);

            return date.toLocaleString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }).replace(" às ", "") + ` das ${initialHour} às ${new Date(finalHour).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
        }
    }, [newEventDate, newEventStartHour]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
    }, []);

    useEffect(() => {
        if (addressData.postalCode.length === 8) {
            axios.get(`https://viacep.com.br/ws/${addressData.postalCode}/json/`)
                .then(response => {
                    setAddressData({
                        ...addressData,
                        address: `${response.data.logradouro} - ${response.data.bairro}`,
                        city: response.data.localidade,
                        state: response.data.uf
                    });
                })
                .catch(error => {
                    console.error("Erro ao buscar endereço pelo CEP:", error);
                });
        }
    }, [addressData.postalCode]);

    async function handleInsertAddress(e: React.FormEvent) {
        e.preventDefault();

        const body: Address = {
            numero: addressData.number,
            complemento: addressData.complement,
            unidade: "",
            tipo: selectedLocation,
            cep: {
                id: addressData.postalCode
            }
        }
        await createAddress(body)
            .then(response => {
                console.log("Endereço criado com sucesso:", response.data);
            }).catch(error => {
                console.error("Erro ao criar endereço:", error);
            });
    }

    async function handleNewEvent(e: React.FormEvent) {
        e.preventDefault();

        if (!addressData.postalCode || addressData.address === null) {
            alert("Por favor, insira um CEP válido para o endereço.");
            return;
        }

        if (!addressData.number) {
            alert("Por favor, insira o número do endereço.");
            return;
        }

        const calculatedTitle = `${newEventDate} - ${newEventStartHour}`;

        const payload: Schedule = {
            data: `${newEventDate}T${newEventStartHour}`,
            descricao: calculatedTitle,
            novoEndereco: {
                numero: addressData.number,
                complemento: addressData.complement,
                unidade: "",
                tipo: selectedLocation,
                cep: {
                    id: addressData.postalCode,
                    logradouro: addressData.address,
                    bairro: "",
                    localidade: addressData.city,
                    uf: addressData.state
                }
            },
            personalId: 1,
            tipoAulaProdutoContratado: selectedType.toUpperCase()
        }



        await insertAppointment(payload)
            .then(async response => {
                console.log("Evento salvo com sucesso:", response.data);
                await handleInsertAddress(e).then(() => {
                    console.log("Endereço inserido com sucesso.");
                }).catch(error => {
                    console.error("Erro ao inserir endereço:", error);
                });

                if (calculatedTitle && newEventDate) {
                    queryClient.invalidateQueries({ queryKey: ["appointmentsAtCalendar", "userAppointments"] });
                    openModal();
                    navigation("/schedule");
                    return;
                }
            }).catch(error => {
                console.error("Erro ao salvar evento:", error);
                if (error.status === 400) {
                    setModalInfo({
                        title: "Erro ao agendar",
                        description: "Horário indisponível para agendamento"
                    });
                    setModal("error");
                    return;
                }

                errorModal("Erro ao agendar", "Ocorreu um erro ao tentar agendar o evento.");
                navigation("/schedule");

            });


    }

    const personalList = useQuery({
        queryKey: ["personalList"],
        queryFn: getPersonalList,
        select: (res) => res.data,
    });
    console.log(personalList.data)

    async function handleRescheduleEvent(e: React.FormEvent) {
        console.log("Reagendando evento...");
        e.preventDefault();

        if (!newEventDate || !newEventStartHour) {
            alert("Por favor, selecione uma data e horário para o evento.");
            return;
        }

        const calculatedTitle = `${newEventDate} - ${newEventStartHour}`;


        const payload: Schedule = {
            idAgendamento: rescheduleId ? rescheduleId : undefined,
            data: new Date(`${newEventDate}T${newEventStartHour}`),
            descricao: calculatedTitle,
            endereco: {
                numero: addressData.number,
                complemento: addressData.complement,
                unidade: "",
                tipo: selectedLocation,
                cep: {
                    id: addressData.postalCode,
                    logradouro: addressData.address,
                    bairro: "",
                    localidade: addressData.city,
                    uf: addressData.state
                }
            },
            personalId: 1,
            tipoAulaProdutoContratado: selectedType.toUpperCase()
        }


        await rescheduleAppointment(payload).then(async response => {
            console.log("Evento reagendado com sucesso:", response.data);

            await handleInsertAddress(e).then(() => {
                console.log("Endereço inserido com sucesso.");
            }).catch(error => {
                console.error("Erro ao inserir endereço:", error);
            });
        }).catch(error => {
            console.error("Erro ao reagendar evento:", error);
            //errorModal();
        });


        if (calculatedTitle && newEventDate) {
            queryClient.invalidateQueries({ queryKey: ["appointmentsAtCalendar", "userAppointments"] });
            openModal();
            navigation("/schedule");
            return;
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
        // choose date and hour validation
        if (!newEventDate || !newEventStartHour) {
            setModalInfo({
                title: "Erro ao agendar",
                description: "Selecione uma data e horário para o evento."
            });
            setModal("error");
            return;
        }

        //24hrs
        const selectedDateTime = new Date(`${newEventDate}T${newEventStartHour}`);
        const now = new Date();
        now.setDate(now.getDate() + 1);

        // if (selectedDateTime <= now) {
        //     setModalInfo({
        //         title: "Erro ao agendar",
        //         description: "O agendamento deve ser feito com pelo menos 24 horas de antecedência."
        //     });
        //     setModal("error");
        //     return;
        // }

        setStep(stepNumber);
    }

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, [step]);

    const [chooseTimeOfDay, setChooseTimeOfDay] = useState<string | null>("MANHÃ");

    const availabilityHours = useQuery({
        queryKey: ["availabilityHours", newEventDate],
        queryFn: () => getPersonalProfile(1, newEventDate ? newEventDate : ""),
        enabled: !!newEventDate,
        select: (res) => res.data,
    });

    console.log("Availability Hours: ", availabilityHours.data);

    return (
        <>
            <div className={styles.overlay} onClick={handleClose}></div>

            <div className={classnames(styles.newEventForm, { [styles.newEventFormMobile]: isMobile })}>

                <div className={classnames(styles.container, { [styles.containerMobile]: isMobile })}>
                    <div className={classnames(styles.mainTitle, { [styles.mainTitleMobile]: isMobile })}>
                        {step === 2 && (
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

                        <h1>{title}</h1>
                        <div className={classnames(styles.goBackMobile, { [styles.goBackMobileStepTwo]: step === 2 }, { [styles.goBackMobileStepOne]: step === 1 }, { [styles.goBackMobileStepOneDesktop]: step === 1 && !isMobile })}>

                            <div className={styles.closeButtonHeader}>
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
                            </div>
                        </div>
                    </div>
                    {step === 1 && (
                        <>
                            <div className={styles.containerForm}>
                                <CardInfo isMobile={isMobile} HeaderTitle="Personal" title={personalList.data ? personalList.data[0]?.nome : ""} subtitle={`Idade: ${personalList.data ? differenceInYears(new Date(), parse(personalList.data[0]?.dataNascimento, "yyyy-MM-dd", new Date())) : "N/A"} anos`} includeImg={true} imgUrl={personalList.data ? personalList.data[0]?.caminhoFoto : ""} />

                                {/* <div className={`wrapper-inputs${isMobile ? "-mobile" : ""}`}> */}
                                <div className={classnames(styles.wrappeSelects, { [styles.wrappeSelectsMobile]: isMobile })}>
                                    <div className={classnames(styles.inputGroup, { [styles.inputGroupMobile]: isMobile })}>
                                        <Select
                                            placeholder="Selecione o tipo"
                                            label="Tipo"
                                            options={["PRESENCIAL", "RESIDENCIAL", "FUNCIONAL"]}
                                            valuesName={["Presencial", "Residencial", "Funcional"]}
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
                                        <div className="border-2 border-gray-200 rounded-md p-5">
                                            <CalendarMonthStyled
                                                clickedDate={setNewEventDate}
                                                clickedDateStr={newEventDate ? newEventDate : clickedDate}
                                                createdEvents={insertedEvents}
                                                eventToReschedule={eventToReschedule?.data}
                                                isMobile={isMobile}
                                            />
                                        </div>
                                        {newEventDate && (
                                            <>
                                                <span className="flex gap-1 mt-5 text-sm items-center"><Clock />Horários disponíveis para {format(parse(newEventDate, "yyyy-MM-dd", new Date()), "d", { locale: ptBR })} de {format(parse(newEventDate, "yyyy-MM-dd", new Date()), "MMMM", { locale: ptBR })}</span>

                                                <div className="flex gap-2 mt-3 mb-5">
                                                    <SmallerButton type="button" title="Manhã" selected={chooseTimeOfDay === "MANHÃ"} classname={classnames(styles.buttonTimeOfDaySelect, { [styles.buttonTimeOfDaySelectSelected]: chooseTimeOfDay === "MANHÃ" })} icon={<Sun />} handleButtonClick={() => setChooseTimeOfDay("MANHÃ")} />
                                                    <SmallerButton type="button" title="Tarde" selected={chooseTimeOfDay === "TARDE"} classname={classnames(styles.buttonTimeOfDaySelect, { [styles.buttonTimeOfDaySelectSelected]: chooseTimeOfDay === "TARDE" })} icon={<Sunset />} handleButtonClick={() => setChooseTimeOfDay("TARDE")} />
                                                    <SmallerButton type="button" title="Noite" selected={chooseTimeOfDay === "NOITE"} classname={classnames(styles.buttonTimeOfDaySelect, { [styles.buttonTimeOfDaySelectSelected]: chooseTimeOfDay === "NOITE" })} icon={<SunMoon />} handleButtonClick={() => setChooseTimeOfDay("NOITE")} />
                                                </div>

                                                {chooseTimeOfDay !== null && (
                                                    <div className={styles.hours}>
                                                        <div className={classnames(styles.buttonHourNewEvent, { [styles.buttonHourNewEventSelected]: newEventStartHour === "08:00:00" })}>
                                                            <SmallerButton type="button" title="08:00 - 09:00" value="08:00:00" selected={eventToReschedule?.hour === "08:00:00" ? true : newEventStartHour === "08:00:00"} handleButtonClick={handleButtonClick} />
                                                        </div>
                                                        <div className={classnames(styles.buttonHourNewEvent, { [styles.buttonHourNewEventSelected]: newEventStartHour === "09:00:00" })}>
                                                            <SmallerButton type="button" title="09:00 - 10:00" value="09:00:00" selected={eventToReschedule?.hour === "09:00:00" ? true : newEventStartHour === "09:00:00"} handleButtonClick={handleButtonClick} />
                                                        </div>
                                                        <div className={classnames(styles.buttonHourNewEvent, { [styles.buttonHourNewEventSelected]: newEventStartHour === "10:00:00" })}>
                                                            <SmallerButton type="button" title="10:00 - 11:00" value="10:00:00" selected={eventToReschedule?.hour === "10:00:00" ? true : newEventStartHour === "10:00:00"}
                                                                handleButtonClick={handleButtonClick} />
                                                        </div>
                                                        <div className={classnames(styles.buttonHourNewEvent, { [styles.buttonHourNewEventSelected]: newEventStartHour === "11:00:00" })}>
                                                            <SmallerButton type="button" title="11:00 - 12:00" value="11:00:00" selected={eventToReschedule?.hour === "11:00:00" ? true : newEventStartHour === "11:00:00"}
                                                                handleButtonClick={handleButtonClick} />
                                                        </div>
                                                    </div>
                                                )}

                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className={classnames(styles.buttonNextStep)}>
                                    <SmallerButton type="button" title={buttonTitle || "Avançar"} handleButtonClick={() => handleStepChange(2)} classname={newEventStartHour && newEventDate && selectedType && selectedLocation ? styles.enabled : styles.disabled} />
                                </div>

                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <div className={classnames(styles.inputInfosFormContainer, { [styles.inputInfosFormContainerMobile]: isMobile })}>
                            <CardInfo isMobile={isMobile} HeaderTitle="Confirmação do agendamento" title={formattedDate} subtitle={`Personal: ${personalList.data ? personalList.data[0]?.nome : ""}`} />
                            <div className={styles.title}>
                                <MapPin />
                                <span>Endereço do local</span>
                            </div>
                            <form
                                className={classnames(styles.inputInfosForm, { [styles.inputInfosFormMobile]: isMobile })}
                                onSubmit={(e) => {
                                    if (!isReschedule) {
                                        handleNewEvent(e);
                                    }
                                    if (isReschedule) {
                                        handleRescheduleEvent(e);
                                    }
                                }}>
                                <div className={classnames(styles.wrapperInputs, { [styles.wrapperInputsMobile]: isMobile })}>
                                    <div className={styles.inputGroupAddress}>
                                        <div className={classnames(styles.inputGroup, styles.labelInput)}>
                                            <label htmlFor="cep">CEP</label>
                                            <input
                                                type="text"
                                                id="cep"
                                                placeholder="CEP"
                                                onChange={(e) => setAddressData({ ...addressData, postalCode: (e.target.value).split("-").join("").trim() })}
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
                                                    value={addressData.city || ""}
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
                                                    value={addressData.state || ""}
                                                    onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
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
                                                    value={addressData.address || ""}
                                                />
                                            </div>

                                            <div className={classnames(styles.labelInput, styles.smallInput)}>
                                                <label htmlFor="number">N°</label>
                                                <input
                                                    className={styles.inputNumber}
                                                    type="text"
                                                    id="number"
                                                    placeholder="N°"
                                                    value={addressData.number || ""}
                                                    onChange={(e) => setAddressData({ ...addressData, number: e.target.value })}
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
                                                    value={addressData.complement || ""}
                                                    onChange={(e) => setAddressData({ ...addressData, complement: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={classnames(styles.buttonNextStep, { [styles.buttonNextStepMobile]: isMobile })}>
                                    <SmallerButton type="submit" title={"Confirmar agendamento"} />
                                </div>
                            </form>
                        </div>
                    )}

                </div>
            </div>

            {modal === "error" && (
                <ErrorModal
                    closeThen={() => setModal(null)}
                    title={modalInfo.title}
                    content={modalInfo.description}
                />
            )}
        </>
    );
}



