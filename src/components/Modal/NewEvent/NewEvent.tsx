import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import styles from './NewEvent.module.css';
import classnames from 'classnames';
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getPersonalList, insertAppointment, rescheduleAppointment } from "../../../constants/schedule";
import { useDisabledDays } from "../../../hooks/useDisabledDays";
import type { Schedule, ScheduleAfterInserted, ScheduleReschedule } from "../../../models/schedule";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ErrorModal from "../ErrorModal/ErrorModal";
import { differenceInYears, format, parse, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getPersonalHours } from "../../../constants/personal";
import { getTotalByClassType } from "../../../constants/overview";
import { TypeContext } from "../../../App";
import { findUserData } from "../../../constants/user";
import useModal from "../../../hooks/useModal";
import type { HorariosPersonal, PersonalSummary } from "../../../models/personal";
import { getUserAddresses } from "../../../constants/address";
import useModalClose from "../../../hooks/useModalClose";
import ConfirmCloseModal from "../ConfirmCloseModal/ConfirmCloseModal";
import { cepMask } from "../../../utils/mascara";

// Custom Hooks
import { useAddressLookup } from "./hooks/useAddressLookup";
import { useFormattedDate, useTimeOfDay } from "./hooks/useSchedulingUtils";

// Components
import { SummarySidebar } from "./components/SummarySidebar";
import { DateTimeStep } from "./components/DateTimeStep";
import { AddressStep } from "./components/AddressStep";
import { LOCATION_OPTIONS } from "./constants";

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
    typeUser?: string[];
    disabledDays?: string[];
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

export default function NewEvent({
    isMobile, appoitmentData, close, openModalExtern, errorModal, insertedEvents,
    title = "Novo Evento", buttonTitle, rescheduleId, isReschedule, clickedDate,
    newAppointmentCreated, goToNextStep = true, typeUser, disabledDays: propDisabledDays
}: NewEventProps) {
    const { setOpenModal, openModal, textModal, setTextModal } = useModal(null, { title: "", content: "" });
    
    const [form, setForm] = useState({
        date: clickedDate || "",
        startHour: undefined as string | undefined,
        type: "PRESENCIAL",
        location: "ACADEMIA"
    });

    useEffect(() => {
        const options = LOCATION_OPTIONS[form.type];
        if (options && options.length > 0) {
            // If current location is not valid for the new type, reset to the first option
            if (!options.some(opt => opt.value === form.location)) {
                setForm(prev => ({ ...prev, location: options[0].value }));
            }
        }
    }, [form.type]);

    const [ui, setUi] = useState({
        step: 1,
        loading: false,
        showConfirmClose: false,
        openSelectId: null as string | null,
        selectedAddress: null as AddressOption,
        selectDefault: ""
    });

    const queryClient = useQueryClient();
    const navigation = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const type = useContext(TypeContext);

    const personalList = useQuery({
        queryKey: ["personalList"],
        queryFn: getPersonalList,
        select: (res) => res.data,
        enabled: typeUser?.includes("aluno"),
        refetchOnWindowFocus: false,
    });

    const [selectedPersonalId, setSelectedPersonalId] = useState<number | undefined>(undefined);

    const selectedPersonal: PersonalSummary | undefined = personalList.data?.content?.find(
        (p: PersonalSummary) => p.id === selectedPersonalId
    ) ?? personalList.data?.content?.[0];

    const personalOptions = useMemo(
        () => personalList.data?.content?.map((p: PersonalSummary) => ({ 
            value: p.id, 
            label: p.nome,
            image: p.caminhoFoto,
            subtitle: p.dataNascimento ? `${differenceInYears(new Date(), parse(p.dataNascimento, "yyyy-MM-dd", new Date()))} anos` : ""
        })),
        [personalList.data?.content]
    );

    const handlePersonalChange = useCallback((val: string | number) => {
        setSelectedPersonalId(Number(val));
        setForm(prev => ({ ...prev, startHour: undefined }));
    }, []);

    const internalTargetId = !propDisabledDays ? selectedPersonal?.id : undefined;
    const { disabledDays: disabledDaysRequest } = useDisabledDays(internalTargetId);
    const finalDisabledDays = (propDisabledDays ?? disabledDaysRequest) as string[];

    const myId = useQuery({
        queryKey: ["myId"],
        queryFn: findUserData,
        select: (res) => res.data?.id,
        enabled: !typeUser?.includes("aluno"),
        refetchOnWindowFocus: false,
    });

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

    const { addressData, setAddressData } = useAddressLookup(initialAddressData);
    const formattedDate = useFormattedDate(form.date, form.startHour, form.type);

    const availabilityHours = useQuery({
        queryKey: ["availabilityHours", typeUser, myId.data, selectedPersonal?.id, form.date],
        queryFn: () => getPersonalHours(typeUser?.includes("personal") ? myId.data : selectedPersonal?.id, form.date ?? "", form.type.toUpperCase()),
        select: (res) => res.data as HorariosPersonal,
        enabled: typeUser?.includes("personal") ? !!myId.data : !!selectedPersonal?.id,
    });

    const defaultTimeOfDay = useTimeOfDay(availabilityHours.data);
    const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<string | null>(null);

    useEffect(() => {
        setSelectedTimeOfDay(defaultTimeOfDay);
    }, [defaultTimeOfDay]);

    const tomorrow = format(startOfDay(new Date(Date.now() + 86400000)), "yyyy-MM-dd", { locale: ptBR });

    const addresses = useQuery({
        queryKey: ["addresses"],
        queryFn: () => getUserAddresses(),
        select: (res) => res.data,
    });

    const addressInitialized = useRef(false);

    useEffect(() => {
        if (!addressInitialized.current && addresses.isSuccess && addresses.data?.length) {
            addressInitialized.current = true;
            const last = addresses.data.at(-1);
            setUi(prev => ({ ...prev, selectDefault: last?.id ?? "", selectedAddress: last }));

            if (last?.cep?.cep) {
                setAddressData({
                    postalCode: cepMask(last.cep.cep),
                    address: `${last.cep.logradouro} - ${last.cep.bairro}`,
                    city: last.cep.localidade,
                    state: last.cep.uf,
                    number: last.numero,
                    complement: last.complemento
                });
            }
        }
    }, [addresses.isSuccess, addresses.data, setAddressData]);

    const classBalanceQuery = useQuery({
        queryKey: ["totalByClassType"],
        queryFn: () => getTotalByClassType(),
        enabled: type?.type?.includes("aluno")
    });

    const [scheduleTypes, setScheduleTypes] = useState([
        { label: "Presencial (Academia)", value: "PRESENCIAL", disabled: false },
        { label: "Residencial (Casa)", value: "RESIDENCIAL", disabled: false },
        { label: "Funcional (Parque/Academia)", value: "FUNCIONAL", disabled: false }
    ]);

    useEffect(() => {
        if (!classBalanceQuery.isLoading && classBalanceQuery.data) {
            setScheduleTypes(prev => prev.map(t => ({
                ...t,
                disabled: classBalanceQuery.data?.[`saldo${t.value.charAt(0) + t.value.slice(1).toLowerCase()}`] === 0
            })));
        }
    }, [classBalanceQuery.data, classBalanceQuery.isLoading]);

    function verifyClassAvailability() {
        const balanceKey = `saldo${form.type.charAt(0) + form.type.slice(1).toLowerCase()}` as keyof typeof classBalanceQuery.data;
        if (classBalanceQuery.data?.[balanceKey] === 0) {
            setTextModal({ title: "Erro ao agendar", content: `Você não possui aulas ${form.type.toLowerCase()}s disponíveis.` });
            setOpenModal("error");
            return false;
        }
        return true;
    }

    function handleStepChange(stepNumber: number) {
        if (!goToNextStep) {
            handleRescheduleEvent();
            return;
        }
        if (!form.date || !form.startHour) {
            setTextModal({ title: "Erro ao agendar", content: "Selecione uma data e horário." });
            setOpenModal("error");
            return;
        }
        if (!verifyClassAvailability()) return;
        setUi(prev => ({ ...prev, step: stepNumber }));
    }

    async function handleInvalidateQueries() {
        await queryClient.invalidateQueries({ queryKey: ["appointmentsAtCalendar"] });
        await queryClient.invalidateQueries({ queryKey: ["userAppointments"] });
        await queryClient.invalidateQueries({ queryKey: ["userRescheduleAppointments"] });
        await queryClient.invalidateQueries({ queryKey: ["personalRequests"] });
        await queryClient.invalidateQueries({ queryKey: ["appointmentDetails"] });
    }

    async function handleNewEvent(e: React.FormEvent) {
        e.preventDefault();
        setUi(prev => ({ ...prev, loading: true }));
        if (addressData.address.includes("undefined") || !addressData.postalCode || !addressData.number) {
            setTextModal({ title: "Erro ao agendar", content: "Verifique os dados do endereço." });
            setOpenModal("error");
            setUi(prev => ({ ...prev, loading: false }));
            return;
        }

        const payload: Schedule = {
            data: `${form.date}T${form.startHour}`,
            descricao: `${form.date} - ${form.startHour}`,
            novoEndereco: {
                numero: addressData.number,
                complemento: addressData.complement,
                unidade: "",
                tipo: form.location,
                cep: { id: addressData.postalCode, logradouro: addressData.address, bairro: "", localidade: addressData.city, uf: addressData.state }
            },
            personalId: Number(selectedPersonal?.id),
            tipoAulaProdutoContratado: form.type.toUpperCase()
        };

        try {
            await insertAppointment(payload);
            await handleInvalidateQueries();
            openModalExtern();
            if (location.pathname.includes("/schedule")) {
                newAppointmentCreated?.(true);
                navigation("/schedule");
            }
        } catch (error: any) {
            setTextModal({ title: "Erro ao agendar", content: error.response?.data?.Exception || "Erro ao tentar agendar." });
            setOpenModal("error");
        } finally {
            setUi(prev => ({ ...prev, loading: false }));
        }
    }

    async function handleRescheduleEvent(e?: React.FormEvent) {
        e?.preventDefault();
        setUi(prev => ({ ...prev, loading: true }));
        const payload: ScheduleReschedule = {
            idAgendamento: rescheduleId ?? undefined,
            data: `${form.date}T${form.startHour}`,
            descricao: `${form.date} - ${form.startHour}`,
            endereco: null,
            personalId: typeUser?.includes("personal") ? myId.data : selectedPersonal?.id,
            tipoAulaProdutoContratado: form.type.toUpperCase()
        };

        try {
            await rescheduleAppointment(payload);
            await handleInvalidateQueries();
            openModalExtern();
        } catch (error) {
            errorModal("Erro ao reagendar", "Erro ao tentar reagendar.");
        } finally {
            setUi(prev => ({ ...prev, loading: false }));
        }
    }

    const { isClosing, handleAnimatedClose: handleClose } = useModalClose({
        onClose: () => {
            if (searchParams.has("date")) navigation("/schedule");
            close(false);
        },
        duration: 200
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                e.stopImmediatePropagation();
                if (hasUnsavedChanges()) setUi(prev => ({ ...prev, showConfirmClose: true }));
                else handleClose();
            }
        };
        document.addEventListener("keydown", handleKeyDown, true);
        return () => document.removeEventListener("keydown", handleKeyDown, true);
    }, [form.date, form.startHour, addressData]);

    function hasUnsavedChanges() {
        return form.date !== (clickedDate || "") || form.startHour !== undefined || form.type !== "PRESENCIAL";
    }

    const handleDateChange = useCallback((val: any) => {
        setForm(prev => {
            const nextDate = typeof val === 'function' ? val(prev.date) : val;
            if (prev.date === nextDate) return prev;
            return { ...prev, date: nextDate };
        });
    }, []);

    const handleTypeChange = useCallback((val: string) => {
        setForm(prev => prev.type === val ? prev : { ...prev, type: val });
    }, []);

    const handleLocationChange = useCallback((val: string) => {
        setForm(prev => prev.location === val ? prev : { ...prev, location: val });
    }, []);

    const handleStartHourChange = useCallback((h: string | boolean) => {
        if (typeof h === 'string') {
            setForm(prev => prev.startHour === h ? prev : { ...prev, startHour: h });
        }
    }, []);

    return (
        <>
            <div className={classnames(styles.overlay, { [styles.overlayClosing]: isClosing, [styles.overlayEnter]: !isClosing })} onClick={() => hasUnsavedChanges() ? setUi(prev => ({ ...prev, showConfirmClose: true })) : handleClose()}></div>
            <div className={classnames(styles.newEventForm, { [styles.newEventFormMobile]: isMobile, [styles.newEventFormClosing]: isClosing, [styles.newEventFormEnter]: !isClosing })}>
                <SummarySidebar
                    isMobile={isMobile} step={ui.step} typeUser={typeUser} appoitmentData={appoitmentData}
                    formattedDate={formattedDate} selectedType={form.type}
                    setSelectedType={handleTypeChange} scheduleTypes={scheduleTypes}
                    openSelectId={ui.openSelectId} setOpenSelectId={(val) => setUi(prev => ({ ...prev, openSelectId: val }))} isReschedule={isReschedule}
                    selectedPersonal={selectedPersonal} personalOptions={personalOptions} handlePersonalChange={handlePersonalChange}
                />

                <div className={classnames(styles.container, { [styles.containerMobile]: isMobile })}>
                    <div className={classnames(styles.mainTitle, { [styles.mainTitleMobile]: isMobile })}>
                        <div className="flex items-center gap-3">
                            {ui.step === 2 && <span className="cursor-pointer flex items-center border-r border-gray-400 pr-3" onClick={() => setUi(prev => ({ ...prev, step: 1 }))}><ArrowLeft /> Voltar</span>}
                            <h1>{title}</h1>
                        </div>
                        <div className={styles.closeButtonHeader} onClick={() => hasUnsavedChanges() ? setUi(prev => ({ ...prev, showConfirmClose: true })) : handleClose()}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
                        </div>
                    </div>

                    {ui.step === 1 ? (
                        <DateTimeStep
                            isMobile={isMobile} isReschedule={isReschedule} newEventDate={form.date} 
                            setNewEventDate={handleDateChange}
                            clickedDate={clickedDate} insertedEvents={insertedEvents} availabilityHoursTomorrow={null}
                            tomorrow={tomorrow} disabledDays={finalDisabledDays} availabilityHours={availabilityHours}
                            selectedTimeOfDay={selectedTimeOfDay} setSelectedTimeOfDay={setSelectedTimeOfDay}
                            newEventStartHour={form.startHour} handleButtonClick={handleStartHourChange}
                            handleStepChange={handleStepChange} buttonTitle={buttonTitle} isValid={!!(form.startHour && form.date)}
                            typeUser={typeUser} appoitmentData={appoitmentData}
                            setSelectedType={handleTypeChange} scheduleTypes={scheduleTypes}
                            openSelectId={ui.openSelectId} setOpenSelectId={(val) => setUi(prev => ({ ...prev, openSelectId: val }))}
                            selectedPersonal={selectedPersonal} personalOptions={personalOptions} handlePersonalChange={handlePersonalChange}
                        />
                    ) : (
                        <AddressStep
                            isMobile={isMobile} selectedAddress={ui.selectedAddress}
                            setSelectedAddress={(val) => setUi(prev => ({ ...prev, selectedAddress: val }))} addresses={addresses} addressData={addressData}
                            setAddressData={setAddressData} selectDefault={ui.selectDefault} setSelectDefault={(val) => setUi(prev => ({ ...prev, selectDefault: val }))}
                            openSelectId={ui.openSelectId} setOpenSelectId={(val) => setUi(prev => ({ ...prev, openSelectId: val }))} loading={ui.loading}
                            onSubmit={isReschedule ? handleRescheduleEvent : handleNewEvent}
                            formattedDate={formattedDate} selectedType={form.type}
                            selectedPersonal={selectedPersonal}
                            location={form.location} setLocation={handleLocationChange}
                        />
                    )}
                </div>
            </div>

            {openModal === "error" && <ErrorModal closeThen={() => setOpenModal(null)} title={textModal.title} content={textModal.content} />}
            {ui.showConfirmClose && <ConfirmCloseModal isOpen={ui.showConfirmClose} onClose={() => setUi(prev => ({ ...prev, showConfirmClose: false }))} onConfirm={() => { setUi(prev => ({ ...prev, showConfirmClose: false })); handleClose(); }} />}
        </>
    );
}
