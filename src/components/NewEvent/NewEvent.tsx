import { use, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import CalendarMonthStyled from "../Calendars/CalendarMonthStyled/CalendarMonthStyled";
import SmallerButton from "../SmallerButton";
import styles from './NewEvent.module.css';
import classnames from 'classnames';
import Select from "../Inputs/Select/Select";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cepMask } from "../../utils/mascara";
import { Clock, MapPin, Sun, SunMoon, Sunrise, Sunset } from "lucide-react";
import CardInfo from "../CardInfo/CardInfo";
import { getPersonalList, insertAppointment, rescheduleAppointment } from "../../constants/schedule";
import type { Schedule, ScheduleAfterInserted } from "../../models/schedule";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import ErrorModal from "../Modal/ErrorModal/ErrorModal";
import { differenceInYears, format, parse, parseISO, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getPersonalHours } from "../../constants/personal";
import { getTotalByClassType } from "../../constants/overview";
import { TypeContext } from "../../App";
import { findUserData } from "../../constants/user";

type NewEventProps = {
    isMobile: boolean;
    appoitmentData?: ScheduleAfterInserted | null;
    close: React.Dispatch<React.SetStateAction<boolean>> | (() => void);
    openModal: (() => void);
    errorModal: ((title: string, description: string) => void);
    insertedEvents: any[];
    title?: string;
    buttonTitle?: string;
    isReschedule?: boolean;
    rescheduleId?: number | null;
    clickedDate?: string;
    newAppointmentCreated?: React.Dispatch<React.SetStateAction<boolean>> | (() => void);
    goToNextStep?: boolean;
    typeUser?: string;
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
    { isMobile, appoitmentData, close, openModal, errorModal, insertedEvents, title = "Novo Evento", buttonTitle, rescheduleId, isReschedule, clickedDate, newAppointmentCreated, goToNextStep = true, typeUser }: NewEventProps
) {
    const [modal, setModal] = useState<modalTypes>(null);

    console.log("clickedDate prop:", clickedDate);

    const [newEventDate, setNewEventDate] = useState<string>(clickedDate || "");
    const [newEventStartHour, setNewEventStartHour] = useState<string>();
    const [selectedType, setSelectedType] = useState<string>("PRESENCIAL");
    const [selectedLocation, setSelectedLocation] = useState<string>("CASA");

    const personalList = useQuery({
        queryKey: ["personalList"],
        queryFn: getPersonalList,
        select: (res) => res.data,
    });



    const myId = useQuery({
        queryKey: ["myId"],
        queryFn: findUserData,
        select: (res) => res.data?.id,
        enabled: typeUser === "personal"
    });


    console.log("personalList data:", personalList.data);

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

    useEffect(() => {
        console.log("newEventStartHour atualizado:", newEventStartHour);
    }, [newEventStartHour]);

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

    const url = window.location.href;

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
                    if (url.includes("/schedule")) {
                        newAppointmentCreated && newAppointmentCreated(true);
                        openModal();
                        navigation("/schedule");
                        return;
                    }
                    openModal();
                    return;
                }
            }).catch(error => {
                console.error("Erro ao salvar evento:", error);
                if (error.status === 400) {
                    setModalInfo({
                        title: "Erro ao agendar",
                        description: error.response.data.Exception || "Ocorreu um erro ao tentar agendar o evento."
                    });
                    setModal("error");
                    return;
                }

                errorModal("Erro ao agendar", "Ocorreu um erro ao tentar agendar o evento.");
                navigation("/schedule");

            });


    }

    useEffect(() => {
        if (appoitmentData && isReschedule) {
            console.log("Populando dados de endereço para reagendamento:", appoitmentData);
            setAddressData({
                number: appoitmentData?.endereco.numero,
                complement: appoitmentData?.endereco.complemento,
                postalCode: appoitmentData?.endereco.cep.id,
                address: appoitmentData?.endereco.cep.logradouro,
                city: appoitmentData?.endereco.cep.localidade,
                state: appoitmentData?.endereco.cep.uf
            });
        }
    }, [appoitmentData, isReschedule]);

    async function handleRescheduleEvent(e?: React.FormEvent) {
        console.log("Reagendando evento...");
        e?.preventDefault();


        if (!newEventDate || !newEventStartHour) {
            alert("Por favor, selecione uma data e horário para o evento.");
            return;
        }

        const calculatedTitle = `${newEventDate} - ${newEventStartHour}`;

        const payload: Schedule = {
            idAgendamento: rescheduleId ? rescheduleId : undefined,
            data: `${newEventDate}T${newEventStartHour}`,
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
            personalId: typeUser === "personal" ? myId.data : personalList.data[0]?.id,
            tipoAulaProdutoContratado: selectedType.toUpperCase()
        }

        console.log("Payload de reagendamento:", payload);


        await rescheduleAppointment(payload).then(async response => {
            console.log("Evento reagendado com sucesso:", response.data);

        }).catch(error => {
            console.error("Erro ao reagendar evento:", error);
            //errorModal();
        });

        if (!goToNextStep) {
            queryClient.invalidateQueries({ queryKey: ["appointmentsAtCalendar", "userAppointments", "availabilityHours", "personalRequests", "appointmentDetails"] });
            openModal();
            return;
        }


        if (calculatedTitle && newEventDate) {
            queryClient.invalidateQueries({ queryKey: ["appointmentsAtCalendar", "userAppointments", "availabilityHours", "personalRequests", "appointmentDetails"] });
            openModal();
            return;
        }



    }

    const navigation = useNavigate();
    const [searchParams] = useSearchParams();

    function handleClose() {
        document.body.style.overflow = 'auto';
        if (searchParams.has("date")) {
            navigation("/schedule");
            close(false);
            return;
        }
        close(false);
    }

    function handleButtonClick(hour: string) {
        setNewEventStartHour(hour);
    }

    const type = useContext(TypeContext);

    const [aulaPresencial, aulaResidencial, aulaFuncional] = useQueries({
        queries: [
            {
                queryKey: ["totalPRESENCIALNewEvent"],
                queryFn: () => getTotalByClassType("PRESENCIAL"),
                enabled: type?.type === "aluno"
            },
            {
                queryKey: ["totalRESIDENCIALNewEvent"],
                queryFn: () => getTotalByClassType("RESIDENCIAL"),
                enabled: type?.type === "aluno"
            },
            {
                queryKey: ["totalFUNCIONALNewEvent"],
                queryFn: () => getTotalByClassType("FUNCIONAL"),
                enabled: type?.type === "aluno"
            }
        ]
    });

    function verifyClassAvailability() {
        console.log("Verificando disponibilidade de aulas para o tipo selecionado:", selectedType);
        console.log("Aulas disponíveis - Presencial:", aulaPresencial.data, "Residencial:", aulaResidencial.data, "Funcional:", aulaFuncional.data);
        if (selectedType === "PRESENCIAL" && (aulaPresencial.data === 0 && !aulaPresencial.isLoading)) {
            setModalInfo({
                title: "Erro ao agendar",
                description: "Você não possui aulas presenciais disponíveis para agendar."
            });
            setModal("error");
            return false;
        }

        if (selectedType === "RESIDENCIAL" && (aulaResidencial.data === 0 || aulaResidencial.data === undefined)) {
            setModalInfo({
                title: "Erro ao agendar",
                description: "Você não possui aulas residenciais disponíveis para agendar."
            });
            setModal("error");
            return false;
        }

        if (selectedType === "FUNCIONAL" && (aulaFuncional.data === 0 || aulaFuncional.data === undefined)) {
            setModalInfo({
                title: "Erro ao agendar",
                description: "Você não possui aulas funcionais disponíveis para agendar."
            });
            setModal("error");
            return false;
        }
        return true;
    }


    function handleStepChange(stepNumber: number) {
        if (!goToNextStep) {
            handleRescheduleEvent();
            console.log("setAddressData", addressData);
            console.log("newEventDate", insertedEvents);
            return;
        }
        // choose date and hour validation
        if (!newEventDate || !newEventStartHour) {
            setModalInfo({
                title: "Erro ao agendar",
                description: "Selecione uma data e horário para o evento."
            });
            setModal("error");
            return;
        }

        if (!verifyClassAvailability()) return;

        //24hrs
        const selectedDateTime = new Date(`${newEventDate}T${newEventStartHour}`);
        const now = new Date();
        now.setDate(now.getDate() + 1);

        setStep(stepNumber);
    }

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, [step]);

    useEffect(() => {
        if (step === 1) verifyClassAvailability()
    }, [selectedType]);

    const personal = useQuery({
        queryKey: ["personalList"],
        queryFn: getPersonalList,
        select: (res) => res.data[0].id,
    });

    const availabilityHours = useQuery({
        queryKey: ["availabilityHours"],
        queryFn: () => getPersonalHours(typeUser === "personal" ? myId.data : personal.data, newEventDate ? newEventDate : ""),
        select: (res) => res.data,
    });

    const [chooseTimeOfDay, setChooseTimeOfDay] = useState<string | null>(null);

    useEffect(() => {
        if (!availabilityHours?.data?.length) {
            setChooseTimeOfDay("MANHÃ");
            return;
        };

        const hour = parseInt(availabilityHours.data[0].inicio.split(":")[0]);
        console.log(hour)

        if (hour < 12) setChooseTimeOfDay("MANHÃ");
        else if (hour < 18) setChooseTimeOfDay("TARDE");
        else setChooseTimeOfDay("NOITE");

    }, [availabilityHours.data]);

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

                                {typeUser === "personal" ? (
                                    <CardInfo isMobile={isMobile} HeaderTitle="Aluno" title={appoitmentData ? appoitmentData.aluno.nome : ""} subtitle={`Idade: ${appoitmentData ? appoitmentData.aluno.idade : "N/A"} anos`} includeImg={true} imgUrl={appoitmentData ? appoitmentData.aluno.avatarUrl : ""} />
                                ) : (
                                    <CardInfo isMobile={isMobile} HeaderTitle="Personal" title={personalList.data ? personalList.data[0]?.nome : ""} subtitle={`Idade: ${personalList.data ? differenceInYears(new Date(), parse(personalList.data[0]?.dataNascimento, "yyyy-MM-dd", new Date())) : "N/A"} anos`} includeImg={true} imgUrl={personalList.data ? personalList.data[0]?.caminhoFoto : ""} />
                                )}
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
                                                clickedDateStr={newEventDate ? newEventDate.split("T")[0] : clickedDate?.split("T")[0]}
                                                createdEvents={insertedEvents}
                                                eventToReschedule={clickedDate ? `${clickedDate.split("T")[0]}` : undefined}
                                                isMobile={isMobile}
                                            />
                                        </div>
                                        {newEventDate && (
                                            <>

                                                <span className="flex gap-1 mt-5 text-sm items-center">
                                                    <Clock />
                                                    Horários disponíveis para{" "}
                                                    {format(parseISO(newEventDate), "d 'de' MMMM", { locale: ptBR })}
                                                </span>

                                                <div className="flex gap-2 mt-3 mb-5">
                                                    {availabilityHours.data?.some(hourBlock => parseInt(hourBlock.inicio.split(":")[0]) < 12) && <SmallerButton type="button" title="Manhã" selected={chooseTimeOfDay === "MANHÃ"} classname={classnames(styles.buttonTimeOfDaySelect, { [styles.buttonTimeOfDaySelectSelected]: chooseTimeOfDay === "MANHÃ" })} icon={<Sun />} handleButtonClick={() => setChooseTimeOfDay("MANHÃ")} />}
                                                    {availabilityHours.data?.some(hourBlock => parseInt(hourBlock.inicio.split(":")[0]) < 18) && <SmallerButton type="button" title="Tarde" selected={chooseTimeOfDay === "TARDE"} classname={classnames(styles.buttonTimeOfDaySelect, { [styles.buttonTimeOfDaySelectSelected]: chooseTimeOfDay === "TARDE" })} icon={<Sunset />} handleButtonClick={() => setChooseTimeOfDay("TARDE")} />}
                                                    {availabilityHours.data?.some(hourBlock => parseInt(hourBlock.inicio.split(":")[0]) >= 18) && <SmallerButton type="button" title="Noite" selected={chooseTimeOfDay === "NOITE"} classname={classnames(styles.buttonTimeOfDaySelect, { [styles.buttonTimeOfDaySelectSelected]: chooseTimeOfDay === "NOITE" })} icon={<SunMoon />} handleButtonClick={() => setChooseTimeOfDay("NOITE")} />}
                                                </div>

                                                {chooseTimeOfDay === "MANHÃ" && (
                                                    <div className={styles.hours}>
                                                        {availabilityHours.isLoading && (<p>Carregando horários...</p>)}

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
                                                                        <SmallerButton type="button" title={`${hourBlock.inicio} - ${finalHour}`} value={hourBlock.inicio} selected={clickedDate?.split("T")[1] === hourBlock.inicio ? true : newEventStartHour === hourBlock.inicio} handleButtonClick={handleButtonClick} />
                                                                    </div>
                                                                );
                                                            }
                                                        })}
                                                    </div>
                                                )}

                                                {chooseTimeOfDay === "TARDE" && (
                                                    <div className={styles.hours}>
                                                        {availabilityHours.isLoading && (<p>Carregando horários...</p>)}

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
                                                                        <SmallerButton type="button" title={`${hourBlock.inicio} - ${finalHour}`} value={hourBlock.inicio} selected={clickedDate?.split("T")[1] === hourBlock.inicio ? true : newEventStartHour === hourBlock.inicio} handleButtonClick={handleButtonClick} />
                                                                    </div>
                                                                );
                                                            }
                                                        })}
                                                    </div>
                                                )}

                                                {chooseTimeOfDay === "Noite" && (
                                                    <div className={styles.hours}>
                                                        {availabilityHours.isLoading && (<p>Carregando horários...</p>)}

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
                                                                        <SmallerButton type="button" title={`${hourBlock.inicio} - ${finalHour}`} value={hourBlock.inicio} selected={clickedDate?.split("T")[1] === hourBlock.inicio ? true : newEventStartHour === hourBlock.inicio} handleButtonClick={handleButtonClick} />
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



