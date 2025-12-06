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
import { getPersonalList, insertAppointment, rescheduleAppointment } from "../../constants/schedule";
import type { Schedule } from "../../models/schedule";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ErrorModal from "../Modal/ErrorModal/ErrorModal";
import { differenceInYears, format, parse, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getPersonalHours } from "../../constants/personal";

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


    const personalList = useQuery({
        queryKey: ["personalList"],
        queryFn: getPersonalList,
        select: (res) => res.data,
    });

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

    async function handleNewEvent(e: React.FormEvent) {
        e.preventDefault();

        if (addressData.address.includes("undefined")) {
            setModal("error");
            setModalInfo({
                title: "Erro ao agendar",
                description: "CEP inválido. Por favor, verifique o CEP informado."
            });
            return;
        }

        if (!addressData.postalCode || addressData.address === null) {
            setModal("error");
            setModalInfo({
                title: "Erro ao agendar",
                description: "Por favor, preencha um CEP válido."
            });
            return;
        }

        if (!addressData.number) {
            setModal("error");
            setModalInfo({
                title: "Erro ao agendar",
                description: "Por favor, preencha o número do endereço."
            });
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
            personalId: personalList.data[0]?.id,
            tipoAulaProdutoContratado: selectedType.toUpperCase()
        }



        await insertAppointment(payload)
            .then(async response => {
                console.log("Evento salvo com sucesso:", response.data);

                if (calculatedTitle && newEventDate) {
                    queryClient.invalidateQueries({ queryKey: ["appointmentsAtCalendar", "userAppointments", "availabilityHours"] });
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
            personalId: personalList.data[0]?.id,
            tipoAulaProdutoContratado: selectedType.toUpperCase()
        }


        await rescheduleAppointment(payload).then(async response => {
            console.log("Evento reagendado com sucesso:", response.data);

        }).catch(error => {
            console.error("Erro ao reagendar evento:", error);
            //errorModal();
        });


        if (calculatedTitle && newEventDate) {
            queryClient.invalidateQueries({ queryKey: ["appointmentsAtCalendar", "userAppointments", "availabilityHours"] });
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


    const availabilityHours = useQuery({
        queryKey: ["availabilityHours"],
        queryFn: () => getPersonalHours(1, newEventDate ? newEventDate : ""),
        select: (res) => res.data,
    });

    console.log("Availability Hours: ", availabilityHours.data);
    const [chooseTimeOfDay, setChooseTimeOfDay] = useState<string | null>(null
    );

    useEffect(() => {
        if (!availabilityHours?.data?.length) return;

        const hour = parseInt(availabilityHours.data[0].inicio.split(":")[0]);

        if (hour < 12) setChooseTimeOfDay("MANHÃ");
        else if (hour < 18) setChooseTimeOfDay("TARDE");
        else setChooseTimeOfDay("NOITE");

    }, [availabilityHours]);

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ["availabilityHours"], refetchType: "all" });
    }, [chooseTimeOfDay, newEventDate, selectedType]);

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
                                                    {availabilityHours.data?.some(hourBlock => parseInt(hourBlock.inicio.split(":")[0]) < 12) && <SmallerButton type="button" title="Manhã" selected={chooseTimeOfDay === "MANHÃ"} classname={classnames(styles.buttonTimeOfDaySelect, { [styles.buttonTimeOfDaySelectSelected]: chooseTimeOfDay === "MANHÃ" })} icon={<Sun />} handleButtonClick={() => setChooseTimeOfDay("MANHÃ")} />}
                                                    {availabilityHours.data?.some(hourBlock => parseInt(hourBlock.inicio.split(":")[0]) < 18) && <SmallerButton type="button" title="Tarde" selected={chooseTimeOfDay === "TARDE"} classname={classnames(styles.buttonTimeOfDaySelect, { [styles.buttonTimeOfDaySelectSelected]: chooseTimeOfDay === "TARDE" })} icon={<Sunset />} handleButtonClick={() => setChooseTimeOfDay("TARDE")} />}
                                                    {availabilityHours.data?.some(hourBlock => parseInt(hourBlock.inicio.split(":")[0]) >= 18) && <SmallerButton type="button" title="Noite" selected={chooseTimeOfDay === "NOITE"} classname={classnames(styles.buttonTimeOfDaySelect, { [styles.buttonTimeOfDaySelectSelected]: chooseTimeOfDay === "NOITE" })} icon={<SunMoon />} handleButtonClick={() => setChooseTimeOfDay("NOITE")} />}
                                                </div>

                                                {chooseTimeOfDay !== null && chooseTimeOfDay === "MANHÃ" && (
                                                    <div className={styles.hours}>
                                                        {availabilityHours?.isLoading && (<p>Carregando horários...</p>)}

                                                        {availabilityHours.data?.map((hourBlock, index) => {
                                                            if (hourBlock.inicio && parseInt(hourBlock.inicio.split(":")[0]) < 12) {
                                                                const [hours, minutes] = hourBlock.inicio.split(":");
                                                                const startHour = parseInt(hours);
                                                                const startMinute = parseInt(minutes);

                                                                const endHour = startHour + 1;
                                                                const endMinute = startMinute;

                                                                const finalHour = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

                                                                return (
                                                                    <div key={index} className={classnames(styles.buttonHourNewEvent, { [styles.buttonHourNewEventSelected]: newEventStartHour === hourBlock.inicio })}>
                                                                        <SmallerButton type="button" title={`${hourBlock.inicio} - ${finalHour}`} value={hourBlock.inicio} selected={eventToReschedule?.hour === hourBlock.inicio ? true : newEventStartHour === hourBlock.inicio} handleButtonClick={handleButtonClick} />
                                                                    </div>
                                                                );
                                                            }
                                                        })}
                                                    </div>
                                                )}

                                                {chooseTimeOfDay !== null && chooseTimeOfDay === "TARDE" && (
                                                    <div className={styles.hours}>
                                                        {availabilityHours?.isLoading && (<p>Carregando horários...</p>)}

                                                        {availabilityHours.data?.map((hourBlock, index) => {
                                                            if (hourBlock.inicio && parseInt(hourBlock.inicio.split(":")[0]) >= 12 && parseInt(hourBlock.inicio.split(":")[0]) < 18) {
                                                                const [hours, minutes] = hourBlock.inicio.split(":");
                                                                const startHour = parseInt(hours);
                                                                const startMinute = parseInt(minutes);

                                                                const endHour = startHour + 1;
                                                                const endMinute = startMinute;

                                                                const finalHour = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

                                                                return (
                                                                    <div key={index} className={classnames(styles.buttonHourNewEvent, { [styles.buttonHourNewEventSelected]: newEventStartHour === hourBlock.inicio })}>
                                                                        <SmallerButton type="button" title={`${hourBlock.inicio} - ${finalHour}`} value={hourBlock.inicio} selected={eventToReschedule?.hour === hourBlock.inicio ? true : newEventStartHour === hourBlock.inicio} handleButtonClick={handleButtonClick} />
                                                                    </div>
                                                                );
                                                            }
                                                        })}
                                                    </div>
                                                )}

                                                {chooseTimeOfDay !== null && chooseTimeOfDay === "Noite" && (
                                                    <div className={styles.hours}>
                                                        {availabilityHours?.isLoading && (<p>Carregando horários...</p>)}

                                                        {availabilityHours.data?.map((hourBlock, index) => {
                                                            if (hourBlock.inicio && parseInt(hourBlock.inicio.split(":")[0]) >= 18 && parseInt(hourBlock.inicio.split(":")[0]) < 24) {
                                                                const [hours, minutes] = hourBlock.inicio.split(":");
                                                                const startHour = parseInt(hours);
                                                                const startMinute = parseInt(minutes);

                                                                const endHour = startHour + 1;
                                                                const endMinute = startMinute;

                                                                const finalHour = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

                                                                return (
                                                                    <div key={index} className={classnames(styles.buttonHourNewEvent, { [styles.buttonHourNewEventSelected]: newEventStartHour === hourBlock.inicio })}>
                                                                        <SmallerButton type="button" title={`${hourBlock.inicio} - ${finalHour}`} value={hourBlock.inicio} selected={eventToReschedule?.hour === hourBlock.inicio ? true : newEventStartHour === hourBlock.inicio} handleButtonClick={handleButtonClick} />
                                                                    </div>
                                                                );
                                                            }
                                                            return null;
                                                        })}
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
                            <CardInfo isMobile={isMobile} HeaderTitle="Confirmação do agendamento" title={formattedDate ? formattedDate : ""} subtitle={`Personal: ${personalList.data ? personalList.data[0]?.nome : ""}`} />
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



