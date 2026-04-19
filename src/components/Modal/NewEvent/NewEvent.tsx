import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import CalendarMonthStyled from "../../Calendars/CalendarMonthStyled/CalendarMonthStyled";
import SmallerButton from "../../SmallerButton/SmallerButton";
import styles from './NewEvent.module.css';
import classnames from 'classnames';
import { useNavigate, useSearchParams } from "react-router-dom";
import { cepMask } from "../../../utils/mascara";
import { ArrowLeft, Calendar, Clock, History, Info, MapPin, Sun, SunMoon, Sunset } from "lucide-react";
import CardInfo from "../../CardInfo/CardInfo";
import { getPersonalList, insertAppointment, rescheduleAppointment } from "../../../constants/schedule";
import { useDisabledDays } from "../../../hooks/useDisabledDays";
import type { Schedule, ScheduleAfterInserted, ScheduleReschedule } from "../../../models/schedule";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ErrorModal from "../ErrorModal/ErrorModal";
import { differenceInYears, format, parse, parseISO, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getPersonalHours } from "../../../constants/personal";
import { getTotalByClassType } from "../../../constants/overview";
import { TypeContext } from "../../../App";
import { findUserData } from "../../../constants/user";
import useModal from "../../../hooks/useModal";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import Select from "../../Select/Select";
import UserAvatar from "../../UserAvatar/UserAvatar";
import InformationCard from "./InformationCard/InformationCard";
import type { HorariosPersonal } from "../../../models/personal";
import { getUserAddresses } from "../../../constants/address";
import useModalClose from "../../../hooks/useModalClose";
import ConfirmCloseModal from "../ConfirmCloseModal/ConfirmCloseModal";

type NewEventProps = {
    isMobile: boolean;
    appoitmentData?: ScheduleAfterInserted | null;
    close: React.Dispatch<React.SetStateAction<boolean>> | (() => void);
    openModalExtern: (() => void);
    errorModal: ((title: string, description: string) => void);
    insertedEvents: Schedule[];
    title?: string;
    buttonTitle?: string;
    isReschedule?: boolean;
    rescheduleId?: number | null;
    clickedDate?: string;
    newAppointmentCreated?: React.Dispatch<React.SetStateAction<boolean>> | (() => void);
    goToNextStep?: boolean;
    typeUser?: string;
    disabledDays?: string[];
};

type AddressState = {
    postalCode: string;
    address: string;
    city: string;
    state: string;
    number: string;
    complement: string;
};

type AddressOption = {
    numero: string,
    id: string,
    complemento: string,
    unidade: string,
    tipo: string,
    cep: {
        logradouro: string,
        cep: string,
        bairro: string,
        localidade: string,
        uf: string
    }
} | null;

export default function NewEvent(
    { isMobile, appoitmentData, close, openModalExtern, errorModal, insertedEvents, title = "Novo Evento", buttonTitle, rescheduleId, isReschedule, clickedDate, newAppointmentCreated, goToNextStep = true, typeUser, disabledDays }: NewEventProps
) {
    const {
        openModal,
        setOpenModal,
        textModal,
        setTextModal
    } = useModal(null, { title: "", content: "" })


    console.log("clickedDate prop:", clickedDate);

    const [newEventDate, setNewEventDate] = useState<string>(clickedDate || "");
    const [newEventStartHour, setNewEventStartHour] = useState<string>();
    const [selectedType, setSelectedType] = useState<string>("PRESENCIAL");
    const [selectedLocation] = useState<string>("CASA");
    const [loading, setLoading] = useState<boolean>(false);

    const personalList = useQuery({
        queryKey: ["personalList"],
        queryFn: getPersonalList,
        select: (res) => res.data,
        enabled: typeUser === "aluno",
        refetchOnWindowFocus: false,
    });


    const internalTargetId = !disabledDays ? personalList.data?.content[0]?.id : undefined;
    const { disabledDays: disabledDaysRequest } = useDisabledDays(internalTargetId);


    const myId = useQuery({
        queryKey: ["myId"],
        queryFn: findUserData,
        select: (res) => res.data?.id,
        enabled: typeUser !== "aluno",
        refetchOnWindowFocus: false,
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

    const queryClient = useQueryClient();

    const [showConfirmClose, setShowConfirmClose] = useState(false);

    const initialAddressData = useMemo(() => {
        if (appoitmentData && isReschedule && appoitmentData?.endereco) {
            return {
                postalCode: appoitmentData.endereco.cep?.id || "",
                address: appoitmentData.endereco.cep?.logradouro || "",
                city: appoitmentData.endereco.cep?.localidade || "",
                state: appoitmentData.endereco.cep?.uf || "",
                number: appoitmentData.endereco.numero || "",
                complement: appoitmentData.endereco.complemento || ""
            };
        }
        return { postalCode: "", address: "", city: "", state: "", number: "", complement: "" };
    }, [appoitmentData, isReschedule]);

    function hasUnsavedChanges() {
        return (
            newEventDate !== (clickedDate || "") ||
            newEventStartHour !== undefined ||
            selectedType !== "PRESENCIAL" ||
            addressData.postalCode !== initialAddressData.postalCode ||
            addressData.number !== initialAddressData.number ||
            addressData.complement !== initialAddressData.complement
        );
    }

    function handleRequestClose() {
        if (hasUnsavedChanges()) {
            setShowConfirmClose(true);
        } else {
            handleClose();
        }
    }

    function handleConfirmDiscard() {
        setShowConfirmClose(false);
        handleClose();
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                e.stopImmediatePropagation();
                handleRequestClose();
            }
        };
        document.addEventListener("keydown", handleKeyDown, true);
        return () => document.removeEventListener("keydown", handleKeyDown, true);
    }, [newEventDate, newEventStartHour, selectedType, addressData]);

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

            const finalHourDate = new Date(date);
            const durationMinutes = selectedType === "PRESENCIAL" || selectedType === "RESIDENCIAL" ? 60 : 30;
            const finalHour = finalHourDate.setMinutes(finalHourDate.getMinutes() + durationMinutes);

            return date.toLocaleString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }).replace(" às ", "") + ` das ${initialHour} às ${new Date(finalHour).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
        }
    }, [newEventDate, newEventStartHour, selectedType]);



    useEffect(() => {
        if (addressData.postalCode.replace("-", "").length === 8) {
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

    async function handleInvalidateQueries() {
        await queryClient.invalidateQueries({ queryKey: ["appointmentsAtCalendar"] });
        await queryClient.invalidateQueries({ queryKey: ["userAppointments"] });
        await queryClient.invalidateQueries({ queryKey: ["userRescheduleAppointments"] });
        await queryClient.invalidateQueries({ queryKey: ["personalRequests"] });
        await queryClient.invalidateQueries({ queryKey: ["appointmentDetails"] });

    }
    async function handleNewEvent(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true)

        if (addressData.address.includes("undefined")) {
            setOpenModal("error");
            setTextModal({
                title: "Erro ao agendar",
                content: "CEP inválido. Por favor, verifique o CEP informado."
            });
            setLoading(false)
            return;
        }

        if (!addressData.postalCode || addressData.address === null) {
            setOpenModal("error");
            setTextModal({
                title: "Erro ao agendar",
                content: "Por favor, preencha um CEP válido."
            });
            setLoading(false)
            return;
        }

        if (!addressData.number) {
            setOpenModal("error");
            setTextModal({
                title: "Erro ao agendar",
                content: "Por favor, preencha o número do endereço."
            });
            setLoading(false)
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
            personalId: personalList.data?.content[0]?.id,
            tipoAulaProdutoContratado: selectedType.toUpperCase()
        }



        await insertAppointment(payload)
            .then(async response => {
                console.log("Evento salvo com sucesso:", response.data);
                setLoading(false)
                if (calculatedTitle && newEventDate) {
                    handleInvalidateQueries()
                    if (url.includes("/schedule")) {
                        if (newAppointmentCreated) {
                            newAppointmentCreated(true);
                        }
                        handleInvalidateQueries()

                        openModalExtern();
                        navigation("/schedule");
                        return;
                    }
                    openModalExtern();
                    return;
                }
            }).catch(error => {
                console.error("Erro ao salvar evento:", error);
                setLoading(false)

                if (error.status === 400) {
                    setTextModal({
                        title: "Erro ao agendar",
                        content: error.response.data.Exception || "Ocorreu um erro ao tentar agendar o evento."
                    });
                    setOpenModal("error");
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
        console.log("addressData", addressData);
        setLoading(true)
        e?.preventDefault();


        if (!newEventDate || !newEventStartHour) {
            alert("Por favor, selecione uma data e horário para o evento.");
            return;
        }

        const calculatedTitle = `${newEventDate} - ${newEventStartHour}`;

        const payload: ScheduleReschedule = {
            idAgendamento: rescheduleId ? rescheduleId : undefined,
            data: `${newEventDate}T${newEventStartHour}`,
            descricao: calculatedTitle,
            endereco: null,
            personalId: typeUser?.includes("personal") ? myId.data : personalList.data?.content[0]?.id,
            tipoAulaProdutoContratado: selectedType.toUpperCase()
        }

        console.log("Payload de reagendamento:", payload);


        await rescheduleAppointment(payload).then(async response => {
            console.log("Evento reagendado com sucesso:", response.data);
            setLoading(false)

        }).catch(error => {
            console.error("Erro ao reagendar evento:", error);
            errorModal("Erro ao reagendar", "Ocorreu um erro ao tentar reagendar o evento.");

            //errorModal();
            setLoading(false)

        });

        if (!goToNextStep) {
            handleInvalidateQueries()
            openModalExtern();
            return;
        }


        if (calculatedTitle && newEventDate) {
            handleInvalidateQueries()
            openModalExtern();
            return;
        }

    }

    const navigation = useNavigate();
    const [searchParams] = useSearchParams();

    const { isClosing, handleAnimatedClose: handleClose } = useModalClose({
        onClose: () => {
            if (searchParams.has("date")) {
                navigation("/schedule");
                close(false);
                return;
            }
            close(false);
            handleCloseModalOnClickOverlay();
        },
        duration: 200
    });

    function handleButtonClick(hour: string | boolean) {
        if (typeof hour === "string") setNewEventStartHour(hour);
    }

    const type = useContext(TypeContext);


    function handleCloseModalOnClickOverlay() {
        setOpenModal(null);
    }

    const classBalanceQuery = useQuery({
        queryKey: ["totalByClassType"],
        queryFn: () => getTotalByClassType(),
        refetchOnWindowFocus: false,
        enabled: type?.type === "aluno"
    });

    const [scheduleTypes, setScheduleTypes] = useState<{
        label: string;
        value: string;
        disabled: boolean;
    }[]>([
        { label: "Presencial", value: "PRESENCIAL", disabled: false },
        { label: "Residencial", value: "RESIDENCIAL", disabled: false },
        { label: "Funcional", value: "FUNCIONAL", disabled: false }
    ]);

    function handleDisableClassType(classType: string) {
        setScheduleTypes(prev => prev.map(type => {
            if (type.value === classType) {
                return { ...type, disabled: true };
            }
            return type;
        }));
        return false;
    }

    useEffect(() => {
        if (classBalanceQuery.data?.saldoFuncional === 0 && !classBalanceQuery.isLoading) {
            handleDisableClassType("FUNCIONAL");
        }
        if (classBalanceQuery.data?.saldoResidencial === 0 && !classBalanceQuery.isLoading) {
            handleDisableClassType("RESIDENCIAL");
        }
        if (classBalanceQuery.data?.saldoPresencial === 0 && !classBalanceQuery.isLoading) {
            handleDisableClassType("PRESENCIAL");
        }
    }, [classBalanceQuery.data])

    function verifyClassAvailability() {
        console.log("Verificando disponibilidade de aulas para o tipo selecionado:", selectedType);
        console.log("Aulas disponíveis - Presencial:", classBalanceQuery.data?.saldoPresencial, "Residencial:", classBalanceQuery.data?.saldoResidencial, "Funcional:", classBalanceQuery.data?.saldoFuncional);
        if (selectedType === "PRESENCIAL" && (classBalanceQuery.data?.saldoPresencial === 0 && !classBalanceQuery.isLoading)) {
            setTextModal({
                title: "Erro ao agendar",
                content: "Você não possui aulas presenciais disponíveis para agendar."
            });
            setOpenModal("error");
            return handleDisableClassType("PRESENCIAL");

        }

        if (selectedType === "RESIDENCIAL" && (classBalanceQuery.data?.saldoResidencial === 0 && !classBalanceQuery.isLoading)) {
            setTextModal({
                title: "Erro ao agendar",
                content: "Você não possui aulas residenciais disponíveis para agendar."
            });
            setOpenModal("error");
            return handleDisableClassType("RESIDENCIAL");
        }

        if (selectedType === "FUNCIONAL" && (classBalanceQuery.data?.saldoFuncional === 0 && !classBalanceQuery.isLoading)) {
            setTextModal({
                title: "Erro ao agendar",
                content: "Você não possui aulas funcionais disponíveis para agendar."
            });
            setOpenModal("error");
            return handleDisableClassType("FUNCIONAL");
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
            setTextModal({
                title: "Erro ao agendar",
                content: "Selecione uma data e horário para o evento."
            });
            setOpenModal("error");
            return;
        }

        if (!verifyClassAvailability()) return;

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

    const availabilityHours = useQuery({
        queryKey: ["availabilityHours", typeUser,
            myId.data,
            personalList.data?.content[0]?.id,
            newEventDate],
        queryFn: () => getPersonalHours(typeUser !== "aluno" ? myId.data : personalList.data?.content[0].id, newEventDate ?? "", selectedType.toUpperCase()),
        select: (res) => res.data as HorariosPersonal,
        refetchOnWindowFocus: false,
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

    const tomorrow = format(startOfDay(new Date(Date.now() + 86400000)), "yyyy-MM-dd", { locale: ptBR });

    const availabilityHoursTomorrow = useQuery({
        queryKey: ["availabilityHoursTomorrow", typeUser,
            myId.data,
            personalList.data?.content[0]?.id,
            tomorrow],
        queryFn: () => getPersonalHours(typeUser !== "aluno" ? myId.data : personalList.data?.content[0].id, tomorrow, selectedType.toUpperCase()),
        select: (res) => res.data,
        refetchOnWindowFocus: false,
    });

    const [openSelectId, setOpenSelectId] = useState<string | null>(null);

    const [selectedAddress, setSelectedAddress] = useState<AddressOption>(null);

    const addresses = useQuery({
        queryKey: ["addresses"],
        queryFn: () => getUserAddresses(),
        select: (res) => res.data,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        const cep = selectedAddress?.cep?.cep;


        if (cep) {
            setAddressData({
                postalCode: cep && cep.length === 8 ? cep.slice(0, 5) + "-" + cep.slice(5) : cep,
                address: `${selectedAddress?.cep?.logradouro} - ${selectedAddress?.cep?.bairro}`,
                city: selectedAddress?.cep?.localidade,
                state: selectedAddress?.cep?.uf,
                number: selectedAddress?.numero,
                complement: selectedAddress?.complemento
            });
        }

    }, [selectedAddress])

    const [selectDefault, setSelectDefault] = useState<string>("");

    useEffect(() => {
        if (addresses.isSuccess && addresses.data?.length) {
            const last = addresses.data.at(-1);
            console.log("Último endereço cadastrado:", last);
            setSelectDefault(last?.id ?? "");
            setSelectedAddress(last);
        }
    }, [addresses.data, addresses.isSuccess]);

    console.log("appoitmentData", appoitmentData)

    return (
        <>
            <div className={classnames(styles.overlay, {
                [styles.overlayClosing]: isClosing,
                [styles.overlayEnter]: !isClosing
            })} onClick={handleRequestClose}></div>

            <div className={classnames(styles.newEventForm, {
                [styles.newEventFormMobile]: isMobile,
                [styles.newEventFormClosing]: isClosing && !isMobile,
                [styles.newEventFormMobileClosing]: isClosing && isMobile,
                [styles.newEventFormEnter]: !isClosing && !isMobile,
                [styles.newEventFormMobileEnter]: !isClosing && isMobile,
            })}>
                {!isMobile && (
                    <div className={`p-4 py-7 bg-gray-100 border-r border-gray-300 sticky left-0 top-0 flex ${step === 2 && "gap-4"} ${step === 1 && "justify-between"} flex-col w-lg`} style={{ zIndex: 1000 }}>
                        {typeUser?.includes("personal") ? (
                            // <CardInfo isMobile={isMobile} classname="bg-white!" HeaderTitle="Aluno" title={appoitmentData ? appoitmentData.aluno.nome : ""} subtitle={`Idade: ${appoitmentData ? appoitmentData.aluno.idade : "N/A"} anos`} includeImg={true} imgUrl={appoitmentData ? appoitmentData.aluno.avatarUrl : ""} />
                            <InformationCard
                                icon={<UserAvatar userName={appoitmentData ? appoitmentData.aluno?.nome : ""} foto={appoitmentData ? appoitmentData.aluno?.avatarUrl : ""} />}
                                title="Aluno"
                                subtitle={appoitmentData ? appoitmentData.aluno?.nome : ""}
                                subtitle2={`Idade: ${appoitmentData ? appoitmentData.aluno?.idade : "N/A"} anos`}
                            />
                        ) : (
                            <>
                                {step === 2 && (
                                    <h1 className={classnames(styles.summaryTitle, { [styles.summaryTitleMobile]: isMobile })}>
                                        Resumo do agendamento
                                    </h1>
                                )}

                                <InformationCard
                                    icon={
                                        <UserAvatar useUserImage={true} foto={personalList.data?.content[0]?.caminhoFoto} userName={personalList.data?.content[0]?.nome} />

                                    }
                                    title="Personal Trainer"
                                    subtitle={personalList.data?.content[0]?.nome || ""}
                                    subtitle2={!personalList.isLoading && personalList.data?.content[0].dataNascimento ? `${differenceInYears(new Date(), parse(personalList.data.content[0]?.dataNascimento, "yyyy-MM-dd", new Date()))} anos` : ""}
                                />
                            </>
                        )}
                        {step === 2 && (
                            <>
                                <InformationCard
                                    icon={<Calendar />}
                                    title="Data e Horário"
                                    subtitle={formattedDate?.split(" das ")[0] || ""}
                                    subtitle2={formattedDate?.split(" das ")[1]}
                                />

                                <InformationCard
                                    icon={<MapPin fill="#000" color="#e2e8f0" />}
                                    title="Tipo de aula"
                                    subtitle={selectedType}
                                />
                            </>
                        )}
                        {/* <div className={`wrapper-inputs${isMobile ? "-mobile" : ""}`}> */}
                        {step === 1 && !isReschedule && (
                            <div className={classnames(styles.wrappeSelects, { [styles.wrappeSelectsMobile]: isMobile })}>
                                <div className={classnames(styles.inputGroup, { [styles.inputGroupMobile]: isMobile })}>
                                    <Select
                                        defaultValue="PRESENCIAL"
                                        id="type-select"
                                        openSelectId={openSelectId}
                                        setOpenSelectId={setOpenSelectId}
                                        onSelectStatusChange={setSelectedType}
                                        values={scheduleTypes}
                                        containerClassName="w-full!"
                                        triggerClassName="p-3 w-full!"
                                        selectWrapperClassName="bg-white! rounded-xl! w-full!"
                                        selectPlaceholder="Selecione o tipo"
                                        labelClassName="text-slate-500! font-bold text-sm uppercase"
                                        label="Tipo de Atendimento"
                                        showSelectAll={false}
                                        showSearchInput={false}
                                    />
                                </div>
                            </div>
                        )}
                        {step === 1 && (
                            <div className="mt-auto hidden md:block">
                                <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20">
                                    <div className="flex items-start gap-2 text-primary">
                                        <span className="material-icons-round text-sm mt-0.5"><Info size={16} className="" /></span>
                                        <p className="text-xs leading-relaxed">Selecione uma data e horário disponível para prosseguir com seu agendamento.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className={classnames(styles.container, { [styles.containerMobile]: isMobile })}>
                    <div className={classnames(styles.mainTitle, { [styles.mainTitleMobile]: isMobile })}>

                        <div className="flex items-center gap-3">
                            {step === 2 && (
                                <span className="cursor-pointer  flex items-center m-0! pr-3! border-r border-gray-400" onClick={() => setStep(1)}><ArrowLeft className="w-5 h-5 text-gray-700" /> Voltar</span>
                            )}
                            <h1>{title}</h1>
                        </div>
                        <div className={classnames(styles.goBackMobile, { [styles.goBackMobileStepTwo]: step === 2 }, { [styles.goBackMobileStepOne]: step === 1 }, { [styles.goBackMobileStepOneDesktop]: step === 1 && !isMobile })}>

                            <div className={styles.closeButtonHeader}>
                                <svg
                                    onClick={handleRequestClose}
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
                        <div className={styles.stepOneContainer}>

                            <div className={styles.containerForm} >
                                {isMobile && (
                                    <>
                                        {typeUser === "personal" ? (
                                            <CardInfo isMobile={isMobile} classname="bg-white!" HeaderTitle="Aluno" title={appoitmentData ? appoitmentData.aluno?.nome : ""} subtitle={`Idade: ${appoitmentData ? appoitmentData.aluno?.idade : "N/A"} anos`} includeImg={true} imgUrl={appoitmentData ? appoitmentData.aluno?.avatarUrl : ""} />
                                        ) : (
                                            <InformationCard
                                                icon={
                                                    personalList.data?.content[0]?.caminhoFoto ? (
                                                        <UserAvatar useUserImage={true} foto={personalList.data?.content[0]?.caminhoFoto} />
                                                    ) : (
                                                        <UserAvatar userName={personalList.data?.content[0]?.nome} />
                                                    )
                                                }

                                                title="Personal Trainer"
                                                subtitle={personalList.data?.content[0]?.nome || ""}
                                                subtitle2={!personalList.isLoading && personalList.data?.content[0]?.dataNascimento ? `${differenceInYears(new Date(), parse(personalList.data?.content[0]?.dataNascimento, "yyyy-MM-dd", new Date()))} anos` : ""}
                                            />
                                        )}
                                        {!isReschedule && (

                                            <div className={classnames(styles.wrappeSelects, { [styles.wrappeSelectsMobile]: isMobile })}>
                                                <div className={classnames(styles.inputGroup, { [styles.inputGroupMobile]: isMobile })}>
                                                    <Select
                                                        defaultValue="PRESENCIAL"
                                                        id="type-select"
                                                        openSelectId={openSelectId}
                                                        setOpenSelectId={setOpenSelectId}
                                                        onSelectStatusChange={setSelectedType}
                                                        values={scheduleTypes}
                                                        containerClassName="w-full"
                                                        triggerClassName="p-3 w-full!"
                                                        selectWrapperClassName="rounded-xl!"
                                                        selectPlaceholder="Selecione o tipo"
                                                        label="Tipo de Atendimento"
                                                        showSelectAll={false}
                                                        showSearchInput={false}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                                <div className={classnames(styles.wrapperNewEvent, { [styles.wrapperNewEventMobile]: isMobile })}>
                                    <div className={classnames(styles.calendarSmall, { [styles.calendarSmallMobile]: isMobile })}>
                                        <div className={`${isReschedule && "mt-6"}`}>
                                            <CalendarMonthStyled
                                                clickedDate={setNewEventDate}
                                                clickedDateStr={newEventDate ? newEventDate.split("T")[0] : clickedDate?.split("T")[0]}
                                                createdEvents={insertedEvents}
                                                eventToReschedule={clickedDate ? `${clickedDate.split("T")[0]}` : undefined}
                                                isMobile={isMobile}
                                                hasClassTomorrow={availabilityHoursTomorrow?.data?.length > 0}
                                                tomorrowDate={tomorrow}
                                                disabledDays={disabledDays ?? disabledDaysRequest}
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
                                                    {availabilityHours.data?.some((hourBlock: { inicio: string }) => parseInt(hourBlock.inicio.split(":")[0]) < 12) && <SmallerButton type="button" title="Manhã" selected={chooseTimeOfDay === "MANHÃ"} classname={classnames(styles.buttonTimeOfDaySelect, { [styles.buttonTimeOfDaySelectSelected]: chooseTimeOfDay === "MANHÃ" })} icon={<Sun />} handleButtonClick={() => setChooseTimeOfDay("MANHÃ")} />}
                                                    {availabilityHours.data?.some((hourBlock: { inicio: string }) => parseInt(hourBlock.inicio.split(":")[0]) < 18) && <SmallerButton type="button" title="Tarde" selected={chooseTimeOfDay === "TARDE"} classname={classnames(styles.buttonTimeOfDaySelect, { [styles.buttonTimeOfDaySelectSelected]: chooseTimeOfDay === "TARDE" })} icon={<Sunset />} handleButtonClick={() => setChooseTimeOfDay("TARDE")} />}
                                                    {availabilityHours.data?.some((hourBlock: { inicio: string }) => parseInt(hourBlock.inicio.split(":")[0]) >= 18) && <SmallerButton type="button" title="Noite" selected={chooseTimeOfDay === "NOITE"} classname={classnames(styles.buttonTimeOfDaySelect, { [styles.buttonTimeOfDaySelectSelected]: chooseTimeOfDay === "NOITE" })} icon={<SunMoon />} handleButtonClick={() => setChooseTimeOfDay("NOITE")} />}
                                                </div>

                                                {chooseTimeOfDay === "MANHÃ" && (
                                                    <div className={styles.hours}>
                                                        {availabilityHours.isLoading && (
                                                            <>
                                                                <Skeleton
                                                                    height={20}
                                                                    borderRadius={6}
                                                                    baseColor="#e5e7eb"
                                                                    highlightColor="#f3f4f6"
                                                                />
                                                                <Skeleton
                                                                    height={20}
                                                                    borderRadius={6}
                                                                    baseColor="#e5e7eb"
                                                                    highlightColor="#f3f4f6"
                                                                />

                                                                <Skeleton
                                                                    height={20}
                                                                    borderRadius={6}
                                                                    baseColor="#e5e7eb"
                                                                    highlightColor="#f3f4f6"
                                                                />
                                                            </>
                                                        )}

                                                        {availabilityHours.data?.map((hourBlock, index) => {
                                                            if (hourBlock.inicio && parseInt(hourBlock.inicio.split(":")[0]) < 12) {
                                                                const [hours, minutes] = hourBlock.inicio.split(":");
                                                                const startHour = parseInt(hours);
                                                                const startMinute = parseInt(minutes);

                                                                const durationMinutes = selectedType === "PRESENCIAL" || selectedType === "RESIDENCIAL" ? 60 : 30;
                                                                const totalMinutes = startMinute + durationMinutes;

                                                                const endHour = startHour + Math.floor(totalMinutes / 60);
                                                                const endMinute = totalMinutes % 60;

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

                                                                const durationMinutes = selectedType === "PRESENCIAL" || selectedType === "RESIDENCIAL" ? 60 : 30;
                                                                const totalMinutes = startMinute + durationMinutes;

                                                                const endHour = startHour + Math.floor(totalMinutes / 60);
                                                                const endMinute = totalMinutes % 60;

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

                                                {chooseTimeOfDay === "NOITE" && (
                                                    <div className={styles.hours}>
                                                        {availabilityHours.isLoading && (<p>Carregando horários...</p>)}

                                                        {availabilityHours.data?.map((hourBlock, index) => {
                                                            if (hourBlock.inicio && parseInt(hourBlock.inicio.split(":")[0]) >= 18 && parseInt(hourBlock.inicio.split(":")[0]) < 24) {
                                                                const [hours, minutes] = hourBlock.inicio.split(":");
                                                                const startHour = parseInt(hours);
                                                                const startMinute = parseInt(minutes);

                                                                const durationMinutes = selectedType === "PRESENCIAL" || selectedType === "RESIDENCIAL" ? 60 : 30;
                                                                const totalMinutes = startMinute + durationMinutes;

                                                                const endHour = startHour + Math.floor(totalMinutes / 60);
                                                                const endMinute = totalMinutes % 60;

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
                        </div>
                    )}

                    {step === 2 && (

                        <div className={classnames(styles.inputInfosFormContainer, { [styles.inputInfosFormContainerMobile]: isMobile })}>
                            {step === 2 && isMobile && (
                                <div className="gap-4 flex flex-col">
                                    <h1 className={classnames(styles.summaryTitle, { [styles.summaryTitleMobile]: isMobile })}>
                                        Resumo do agendamento
                                    </h1>
                                    <InformationCard
                                        icon={<UserAvatar userName={!personalList.isLoading && personalList.data?.content[0]?.nome} foto={!personalList.isLoading && personalList.data?.content[0]?.caminhoFoto} useUserImage={true} />}
                                        title="Personal Trainer"
                                        subtitle={!personalList.isLoading && personalList.data?.content[0]?.nome || ""}
                                        subtitle2={!personalList.isLoading && personalList.data?.content[0]?.dataNascimento ? `${differenceInYears(new Date(), parse(personalList.data.content[0]?.dataNascimento, "yyyy-MM-dd", new Date()))} anos` : ""}
                                    />

                                    <InformationCard
                                        icon={<Calendar />}
                                        title="Data e Horário"
                                        subtitle={formattedDate?.split(" das ")[0] || ""}
                                        subtitle2={formattedDate?.split(" das ")[1]}
                                    />

                                    <InformationCard
                                        icon={<MapPin fill="#000" color="#fff" />}
                                        title="Tipo de aula"
                                        subtitle={selectedType}
                                    />
                                </div>
                            )}
                            <div className="bg-gray-300/25 p-4 pt-2 rounded-2xl border border-gray-300 not-xl:mt-10">
                                <div className="flex justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        {!isMobile && (
                                            <History />
                                        )}
                                        <span className="uppercase font-medium tracking-tight ">
                                            Usar endereço salvo
                                        </span>
                                    </div>
                                    <span
                                        className="not-xl:text-sm not-xl:pr-0 text-oxford-blue cursor-pointer transition hover:ring-2 hover:ring-gray-400 ring-2 ring-[##f3f4f6] p-2 rounded-2xl"
                                        onClick={() => {
                                            setSelectedAddress(null);
                                            setSelectDefault("");
                                            setAddressData({
                                                postalCode: "",
                                                address: "",
                                                city: "",
                                                state: "",
                                                number: "",
                                                complement: ""
                                            });
                                        }}>
                                        Limpar seleção
                                    </span>
                                </div>
                                <Select
                                    id="address-select"
                                    openSelectId={openSelectId}
                                    setOpenSelectId={setOpenSelectId}
                                    clear={!selectedAddress ? true : false}
                                    onSelectStatusChange={(addressId: string) => {
                                        const selected = addresses.data?.find((address: AddressOption) => address?.id === addressId);
                                        setSelectedAddress(selected || null);
                                    }}
                                    values={
                                        addresses.data?.map((address: AddressOption) => ({
                                            label: `${address?.cep.logradouro}, ${address?.numero} - ${address?.cep.localidade}/${address?.cep.uf}`,
                                            value: address?.id,
                                        }))
                                    }
                                    defaultValue={selectDefault}
                                    containerClassName="w-full!"
                                    triggerClassName="p-3 w-full!"
                                    selectWrapperClassName="bg-white! rounded-xl! w-full! border border-gray-300!"
                                    iconPlaceholder={<MapPin fill="#000" color="#fff" />}
                                    selectPlaceholder="Selecione um endereço salvo..."
                                    labelClassName="text-slate-500! font-bold text-sm uppercase"
                                    showSelectAll={false}
                                    showSearchInput={false}
                                />
                            </div>
                            <div className={styles.title}>
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
                                                placeholder="00000-000"
                                                onChange={(e) => {
                                                    const masked = cepMask(e.target.value);
                                                    setAddressData({ ...addressData, postalCode: masked });
                                                }}
                                                value={addressData.postalCode || ""}
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
                                    <SmallerButton loading={loading} type="submit" title={"Confirmar agendamento"} />
                                </div>
                            </form>
                        </div>
                    )}

                </div>
            </div>

            {openModal === "error" && (
                <ErrorModal
                    closeThen={() => setOpenModal(null)}
                    title={textModal.title}
                    content={textModal.content}
                />
            )}

            {showConfirmClose && (
                <ConfirmCloseModal
                    isOpen={showConfirmClose}
                    onClose={() => setShowConfirmClose(false)}
                    onConfirm={handleConfirmDiscard}
                />
            )}
        </>
    );
}



