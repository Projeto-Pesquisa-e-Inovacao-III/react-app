import { useEffect, useRef, useState } from "react";
import styles from "./SetAvailability.module.css";
import {
    getPersonalBuffer,
    getPersonalCronogram,
    updateBuffer,
    updatePersonalCronogram,
    updateWorkDay,
    verifySchedules,
} from "../../../constants/personal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AvailabilitySkeleton from "./AvailabilitySkeleton/AvailabilitySkeleton";
import { Info, Settings, CopyCheck, TriangleAlert } from "lucide-react";
import classNames from "classnames";
import InfoPersonalSchedulesModal from "../../../components/Modal/InfoPersonalSchedulesModal/InfoPersonalSchedulesModal";
import useModal from "../../../hooks/useModal";
import ErrorModal from "../../../components/Modal/ErrorModal/ErrorModal";



export interface TimeSlot {
    id?: string;
    horaInicio: string;
    horaFim: string;
    diaSemana: string;
    tipo: "DISPONIVEL" | "RESTRITO";
    ativo?: boolean;
}

interface DaySchedule {
    day: string;
    enabled: boolean;
    slots: TimeSlot[];
}

type SaveStatus = "idle" | "loading" | "success" | "error";


const DAYS_OF_WEEK = [
    "DOMINGO",
    "SEGUNDA",
    "TERCA",
    "QUARTA",
    "QUINTA",
    "SEXTA",
    "SABADO",
];

const DAYS_META: Record<string, string> = {
    DOMINGO: "Domingo",
    SEGUNDA: "Segunda-feira",
    TERCA: "Terça-feira",
    QUARTA: "Quarta-feira",
    QUINTA: "Quinta-feira",
    SEXTA: "Sexta-feira",
    SABADO: "Sábado",
};


function Toggle({ checked, onChange }: Readonly<{ checked: boolean; onChange: () => void }>) {
    return (
        <button
            type="button"
            role="switch"
            onClick={onChange}
            className={classNames(styles.toggle, {
                [styles.off]: !checked,
            })}
        >
            <span className={classNames(styles.toggleThumb, {
                [styles.off]: !checked,
            })} />
        </button>
    );
}


function TimeRange({
    startValue,
    endValue,
    onStartChange,
    onEndChange,
    disabled,
}: Readonly<{
    startValue: string;
    endValue: string;
    onStartChange: (v: string) => void;
    onEndChange: (v: string) => void;
    disabled: boolean;
}>) {
    return (
        <div className={`${styles.timeRange} ${disabled ? styles.disabled : ""}`}>
            <div className={styles.timeRangeInputs}>
                <input
                    type="time"
                    value={startValue.slice(0, 5)}
                    disabled={disabled}
                    onChange={(e) => onStartChange(e.target.value)}
                    className={styles.input}
                />
                <span className={styles.timeSeparator}>–</span>
                <input
                    type="time"
                    value={endValue.slice(0, 5)}
                    disabled={disabled}
                    onChange={(e) => onEndChange(e.target.value)}
                    className={styles.input}
                />
            </div>
        </div>
    );
}


function SaveBadge({ status }: Readonly<{ status: SaveStatus }>) {
    if (status === "idle") return null;

    const labels: Record<Exclude<SaveStatus, "idle">, string> = {
        loading: "Salvando…",
        success: "Alterações salvas!",
        error: "✕ Erro ao salvar",
    };

    return (
        <span className={`${styles.statusBadge} ${styles[status]}`}>
            <span className={`${styles.statusDot} ${styles[status]}`} />
            {labels[status]}
        </span>
    );
}


function GlobalPanelContent({
    globalManha,
    globalTarde,
    setGlobalManha,
    setGlobalTarde,
    applyToAll,
}: Readonly<{
    globalManha: { start: string; end: string };
    globalTarde: { start: string; end: string };
    setGlobalManha: React.Dispatch<React.SetStateAction<{ start: string; end: string }>>;
    setGlobalTarde: React.Dispatch<React.SetStateAction<{ start: string; end: string }>>;
    applyToAll: () => void;
}>) {
    return (
        <>
            <h3 className={styles.globalPanelTitle}>Padrão para todos os dias</h3>

            <div className={styles.globalPanelContainer}>
                <div className={styles.globalPanelField}>
                    <span className={styles.globalRangeTitle}>Horário inicial</span>
                    <div className={styles.globalRangeInputs}>
                        <input
                            type="time"
                            value={globalManha.start}
                            onChange={(e) => setGlobalManha((p) => ({ ...p, start: e.target.value }))}
                            className={styles.input}
                        />
                        <span className={styles.timeSeparator}>–</span>
                        <input
                            type="time"
                            value={globalManha.end}
                            onChange={(e) => setGlobalManha((p) => ({ ...p, end: e.target.value }))}
                            className={styles.input}
                        />
                    </div>
                </div>

                <div className={styles.globalPanelField}>
                    <span className={styles.globalRangeTitle}>Horário final</span>
                    <div className={styles.globalRangeInputs}>
                        <input
                            type="time"
                            value={globalTarde.start}
                            onChange={(e) => setGlobalTarde((p) => ({ ...p, start: e.target.value }))}
                            className={styles.input}
                        />
                        <span className={styles.timeSeparator}>–</span>
                        <input
                            type="time"
                            value={globalTarde.end}
                            onChange={(e) => setGlobalTarde((p) => ({ ...p, end: e.target.value }))}
                            className={styles.input}
                        />
                    </div>
                </div>

                <button
                    type="button"
                    className={styles.applyAllButton}
                    onClick={applyToAll}
                >
                    <CopyCheck size={15} />
                    Aplicar a todos
                </button>
            </div>
        </>
    );
}


export default function SetAvailability() {
    const getInitialCronogram = useQuery({
        queryKey: ["personalCronogram"],
        queryFn: getPersonalCronogram,
        select: (res) => res.data,
    });

    const personalBuffer = useQuery({
        queryKey: ["personalBuffer"],
        queryFn: getPersonalBuffer,
        select: (res) => res.data.bufferMinutos,
    });

    const queryClient = useQueryClient();

    const [schedule, setSchedule] = useState<DaySchedule[]>([]);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
    const [hasUnsaved, setHasUnsaved] = useState(false);
    const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const dirtySlotIds = useRef<Set<string>>(new Set());
    const dirtyDays = useRef<Set<string>>(new Set());
    const [pendingBuffer, setPendingBuffer] = useState<string | null>(null);

    const { openModal, setOpenModal, textModal, setTextModal } = useModal(null, { title: "", content: "" });

    function handleErrorModalInfo(title: string, content: string) {
        setTextModal({ title, content });
        setOpenModal("error");
    }

    const [globalManha, setGlobalManha] = useState({ start: "08:00", end: "12:00" });
    const [globalTarde, setGlobalTarde] = useState({ start: "13:00", end: "18:00" });

    const [schedulesToInfo, setSchedulesToInfo] = useState<any[] | null>(null);
    const [schedulesToInfoPagination, setSchedulesToInfoPagination] = useState<any | null>(null);
    const [schedulesToInfoDay, setSchedulesToInfoDay] = useState<string | null>(null);
    const [dayIndexToToggle, setDayIndexToToggle] = useState<number | null>(null);

    useEffect(() => {
        if (!getInitialCronogram.data) return;

        const formatted: DaySchedule[] = DAYS_OF_WEEK.map((day) => {
            const slots: TimeSlot[] = getInitialCronogram.data.filter(
                (slot: TimeSlot) => slot.diaSemana === day
            );
            return {
                day,
                enabled: slots.some((s) => s.tipo === "DISPONIVEL" && s.ativo),
                slots,
            };
        });

        setSchedule(formatted);
    }, [getInitialCronogram.data]);

    function showSuccess() {
        if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
        setSaveStatus("success");
        setHasUnsaved(false);
        feedbackTimeoutRef.current = setTimeout(() => setSaveStatus("idle"), 3000);
    }

    function showError() {
        if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
        setSaveStatus("error");
        feedbackTimeoutRef.current = setTimeout(() => setSaveStatus("idle"), 3000);
    }

    useEffect(() => {
        return () => {
            if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
        };
    }, []);


    async function verifyIfHasSchedules(day: string, page: number = 0, size: number = 3) {
        const res = await verifySchedules(day, page, size);
        return { content: res.data.content, pagination: res.data.page };
    }

    async function fetchSchedulesPage(page: number) {
        if (!schedulesToInfoDay) return;
        const { content, pagination } = await verifyIfHasSchedules(schedulesToInfoDay, page, 3);
        setSchedulesToInfo(content);
        setSchedulesToInfoPagination(pagination);
    }

    async function toggleDay(dayIndex: number) {
        const currentEnabled = schedule[dayIndex].slots.some(s => s.tipo === "DISPONIVEL" && s.ativo);

        if (currentEnabled) {
            const day = schedule[dayIndex].day;
            const { content, pagination } = await verifyIfHasSchedules(day);
            if (content && content.length > 0) {
                setDayIndexToToggle(dayIndex);
                setSchedulesToInfoDay(day);
                setSchedulesToInfo(content);
                setSchedulesToInfoPagination(pagination);
                return;
            }
        }

        confirmToggleDay(dayIndex);
    }

    function confirmToggleDay(dayIndex: number) {
        const day = schedule[dayIndex].day;

        if (dirtyDays.current.has(day)) {
            dirtyDays.current.delete(day);
        } else {
            dirtyDays.current.add(day);
        }

        setHasUnsaved(dirtyDays.current.size > 0 || dirtySlotIds.current.size > 0);

        setSchedule((prev) => {
            const next = [...prev];
            const currentEnabled = next[dayIndex].slots.some(s => s.tipo === "DISPONIVEL" && s.ativo);



            next[dayIndex] = {
                ...next[dayIndex],
                enabled: !currentEnabled,
                slots: next[dayIndex].slots.map(s =>
                    s.tipo === "DISPONIVEL" ? { ...s, ativo: !currentEnabled } : s
                )
            };
            return next;
        });
    }

    function updateLocalSlot(
        dayIndex: number,
        slotIndex: number,
        field: "horaInicio" | "horaFim",
        value: string
    ) {
        setHasUnsaved(true);
        setSchedule((prev) => {
            const next = [...prev];
            const slot = next[dayIndex].slots[slotIndex];
            if (slot.id) dirtySlotIds.current.add(String(slot.id));
            next[dayIndex] = {
                ...next[dayIndex],
                slots: next[dayIndex].slots.map((s, i) =>
                    i === slotIndex ? { ...s, [field]: value } : s
                ),
            };
            return next;
        });
    }

    function applyGlobalToSlot(s: TimeSlot, i: number, workIndex: number, breakIndex: number): TimeSlot {
        if (i === workIndex) {
            if (s.id) dirtySlotIds.current.add(String(s.id));
            return { ...s, horaInicio: globalManha.start, horaFim: globalTarde.end };
        }
        if (i === breakIndex) {
            if (s.id) dirtySlotIds.current.add(String(s.id));
            return { ...s, horaInicio: globalManha.end, horaFim: globalTarde.start };
        }
        return s;
    }

    function applyGlobalToDay(daySchedule: DaySchedule): DaySchedule {
        if (!daySchedule.enabled) return daySchedule;

        const workIndex = daySchedule.slots.findIndex((s) => s.tipo === "DISPONIVEL");
        const breakIndex = daySchedule.slots.findIndex((s) => s.tipo === "RESTRITO");

        if (workIndex === -1 || breakIndex === -1) return daySchedule;

        return {
            ...daySchedule,
            slots: daySchedule.slots.map((s, i) => applyGlobalToSlot(s, i, workIndex, breakIndex)),
        };
    }

    function applyToAll() {
        setHasUnsaved(true);
        setSchedule((prev) => prev.map(applyGlobalToDay));
    }

    function handleSave() {
        if (dirtySlotIds.current.size === 0 && dirtyDays.current.size === 0 && pendingBuffer === null) return;

        setSaveStatus("loading");

        const promises: Promise<unknown>[] = [];

        schedule.forEach((daySchedule) => {
            daySchedule.slots.forEach((slot) => {
                if (!slot.id) return;
                if (!dirtySlotIds.current.has(String(slot.id))) return;
                promises.push(
                    updatePersonalCronogram(
                        {
                            diaSemana: slot.diaSemana,
                            horaInicio: slot.horaInicio,
                            horaFim: slot.horaFim,
                            tipo: slot.tipo,
                        },
                        slot.id
                    )
                );
            });
        });

        dirtyDays.current.forEach(day => {
            promises.push(updateWorkDay(day));
        });

        if (pendingBuffer !== null) {
            promises.push(
                updateBuffer(pendingBuffer).then(() => {
                    queryClient.invalidateQueries({ queryKey: ["personalBuffer"] });
                })
            );
        }

        Promise.all(promises)
            .then(() => {
                dirtySlotIds.current.clear();
                dirtyDays.current.clear();
                setPendingBuffer(null);
                showSuccess();
            })
            .catch((error: any) => {
                const message = error?.response?.data?.Exception || "Ocorreu um erro ao salvar as alterações.";
                handleErrorModalInfo("Erro ao salvar", message);
                handleCancel();
                showError();
            });
    }

    function handleUpdateBuffer(value: string) {
        setPendingBuffer(value);
        setHasUnsaved(true);
    }

    function handleCancel() {
        setHasUnsaved(false);
        setSaveStatus("idle");
        dirtySlotIds.current.clear();
        dirtyDays.current.clear();
        setPendingBuffer(null);
        if (getInitialCronogram.data) {
            const formatted: DaySchedule[] = DAYS_OF_WEEK.map((day) => {
                const slots: TimeSlot[] = getInitialCronogram.data.filter(
                    (slot: TimeSlot) => slot.diaSemana === day
                );
                return {
                    day,
                    enabled: slots.some((s) => s.tipo === "DISPONIVEL" && s.ativo),
                    slots,
                };
            });
            setSchedule(formatted);
        }
    }


    if (getInitialCronogram.isLoading || personalBuffer.isLoading) {
        return <AvailabilitySkeleton />;
    }

    const globalPanelProps = {
        globalManha,
        globalTarde,
        setGlobalManha,
        setGlobalTarde,
        applyToAll,
    };


    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className={styles.pageWrapper}>

                <div className={styles.header}>
                    <h1 className={styles.title}>Definir horário de disponibilidade</h1>
                </div>

                <div className={styles.bufferBar}>
                    <div className={styles.bufferBarContent}>
                        <div className={styles.infoTrigger}>
                            <Settings size={15} className={styles.barIcon} />
                            <span className={styles.controlLabel}>Intervalo pós agendamentos</span>
                        </div>
                        <select
                            className={styles.select}
                            value={pendingBuffer ?? personalBuffer.data ?? "0"}
                            onChange={(e) => handleUpdateBuffer(e.target.value)}
                        >
                            <option value="15">15 min</option>
                            <option value="20">20 min</option>
                            <option value="30">30 min</option>
                            <option value="45">45 min</option>
                            <option value="60">1 hora</option>
                        </select>
                    </div>
                    <div
                        className={styles.infoTrigger}
                        title="15 minutos são reservados antes do intervalo de entrada."
                    >
                        <Info size={14} />
                        <span>15 min reservados antes do intervalo de entrada</span>
                    </div>
                </div>

                <aside className={`${styles.globalPanel} ${styles.globalPanelMobile}`}>
                    <GlobalPanelContent {...globalPanelProps} />
                </aside>

                <div className={styles.contentLayout}>

                    <div className={styles.dayList}>
                        <div className={styles.dayListHeader}>
                            <span>Habilitado</span>
                            <span>Dia</span>
                            <span>Horário Inicial</span>
                            <span>Horário Final</span>
                        </div>
                        {schedule.map((daySchedule, dayIndex) => {
                            const workIndex = daySchedule.slots.findIndex((s) => s.tipo === "DISPONIVEL");
                            const breakIndex = daySchedule.slots.findIndex((s) => s.tipo === "RESTRITO");
                            const workSlot = daySchedule.slots[workIndex];
                            const breakSlot = daySchedule.slots[breakIndex];
                            const disabled = workSlot ? !workSlot.ativo : true;

                            return (
                                <div
                                    key={daySchedule.day}
                                    className={`${styles.dayRow} ${disabled ? styles.disabled : ""}`}
                                >
                                    <div className={styles.dayInfo}>
                                        <div className={styles.dayToggle}>
                                            <Toggle
                                                checked={!disabled}
                                                onChange={() => toggleDay(dayIndex)}

                                            />
                                        </div>

                                        <div className={styles.dayLabel}>
                                            <span className={`${styles.dayName} ${disabled ? styles.disabled : ""}`}>
                                                {DAYS_META[daySchedule.day]}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={styles.dayTimes}>
                                        {workSlot && breakSlot ? (
                                            <>
                                                <TimeRange
                                                    startValue={workSlot.horaInicio}
                                                    endValue={breakSlot.horaInicio}
                                                    disabled={disabled}
                                                    onStartChange={(v) =>
                                                        updateLocalSlot(dayIndex, workIndex, "horaInicio", v)
                                                    }
                                                    onEndChange={(v) =>
                                                        updateLocalSlot(dayIndex, breakIndex, "horaInicio", v)
                                                    }
                                                />

                                                <div className={`${styles.periodDivider} ${disabled ? styles.disabled : ""}`} />

                                                <TimeRange
                                                    startValue={breakSlot.horaFim}
                                                    endValue={workSlot.horaFim}
                                                    disabled={disabled}
                                                    onStartChange={(v) =>
                                                        updateLocalSlot(dayIndex, breakIndex, "horaFim", v)
                                                    }
                                                    onEndChange={(v) =>
                                                        updateLocalSlot(dayIndex, workIndex, "horaFim", v)
                                                    }
                                                />
                                            </>
                                        ) : (
                                            <span className={styles.noSlots}>
                                                Sem horários cadastrados
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <aside className={`${styles.globalPanel} ${styles.globalPanelDesktop}`}>
                        <GlobalPanelContent {...globalPanelProps} />
                    </aside>

                </div>

                <div className={`${styles.footer} ${hasUnsaved && saveStatus === "idle" ? styles.dirty : ""}`}>

                    {hasUnsaved && saveStatus === "idle" && (
                        <span className={styles.unsavedHint}>
                            <TriangleAlert size={14} />
                            Alterações feitas! Não esqueça de salvar
                        </span>
                    )}

                    <SaveBadge status={saveStatus} />

                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={handleCancel}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className={`${styles.saveButton} ${saveStatus === "loading" ? styles.loading : ""}`}
                        onClick={handleSave}
                        disabled={saveStatus === "loading"}
                    >
                        Salvar Alterações
                    </button>
                </div>

            </div>
            {schedulesToInfo && dayIndexToToggle !== null && (
                <InfoPersonalSchedulesModal
                    closeThen={() => {
                        setSchedulesToInfo(null);
                        setSchedulesToInfoPagination(null);
                        setSchedulesToInfoDay(null);
                        setDayIndexToToggle(null);
                    }}
                    schedules={schedulesToInfo}
                    pagination={schedulesToInfoPagination}
                    fetchPage={fetchSchedulesPage}
                    onConfirm={() => {
                        confirmToggleDay(dayIndexToToggle);
                        setSchedulesToInfo(null);
                        setSchedulesToInfoPagination(null);
                        setSchedulesToInfoDay(null);
                        setDayIndexToToggle(null);
                    }}
                />
            )}
            {openModal === "error" && (
                <ErrorModal
                    closeThen={() => setOpenModal(null)}
                    title={textModal.title}
                    content={textModal.content}
                />
            )}
        </LocalizationProvider>
    );
}