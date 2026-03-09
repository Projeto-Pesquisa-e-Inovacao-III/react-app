import { useEffect, useRef, useState } from "react";
import styles from "./SetAvailability.module.css";
import {
    getPersonalBuffer,
    getPersonalCronogram,
    updateBuffer,
    updatePersonalCronogram,
} from "../../../constants/personal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AvailabilitySkeleton from "./AvailabilitySkeleton/AvailabilitySkeleton";
import { Info, Settings } from "lucide-react";

export interface TimeSlot {
    id?: string;
    horaInicio: string;
    horaFim: string;
    diaSemana: string;
    tipo: "DISPONIVEL" | "RESTRITO";
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

function Toggle({
    checked,
    onChange,
}: {
    checked: boolean;
    onChange: () => void;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={onChange}
            className={`${styles.toggle} ${!checked ? styles.off : ""}`}
        >
            <span className={`${styles.toggleThumb} ${!checked ? styles.off : ""}`} />
        </button>
    );
}

function TimeRange({
    label,
    startValue,
    endValue,
    onStartChange,
    onEndChange,
    disabled,
}: {
    label: string;
    startValue: string;
    endValue: string;
    onStartChange: (v: string) => void;
    onEndChange: (v: string) => void;
    disabled: boolean;
}) {
    return (
        <div className={`${styles.timeRange} ${disabled ? styles.disabled : ""}`}>
            <span className={styles.timeRangeLabel}>{label}</span>
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

function SaveBadge({ status }: { status: SaveStatus }) {
    if (status === "idle") return null;

    const labels: Record<Exclude<SaveStatus, "idle">, string> = {
        loading: "Salvando…",
        success: "✓ Alterações salvas",
        error: "✕ Erro ao salvar",
    };

    return (
        <span className={`${styles.statusBadge} ${styles[status]}`}>
            <span className={`${styles.statusDot} ${styles[status]}`} />
            {labels[status as Exclude<SaveStatus, "idle">]}
        </span>
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
    const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const dirtySlotIds = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (!getInitialCronogram.data) return;

        const formatted: DaySchedule[] = DAYS_OF_WEEK.map((day) => {
            const slots: TimeSlot[] = getInitialCronogram.data.filter(
                (slot: TimeSlot) => slot.diaSemana === day
            );
            return {
                day,
                enabled: slots.some((s) => s.tipo === "DISPONIVEL"),
                slots,
            };
        });

        setSchedule(formatted);
    }, [getInitialCronogram.data]);

    function showSuccess() {
        if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
        setSaveStatus("success");
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

    function toggleDay(dayIndex: number) {
        setSchedule((prev) => {
            const next = [...prev];
            next[dayIndex] = { ...next[dayIndex], enabled: !next[dayIndex].enabled };
            return next;
        });
    }

    function updateLocalSlot(
        dayIndex: number,
        slotIndex: number,
        field: "horaInicio" | "horaFim",
        value: string
    ) {
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

    function handleSave() {
        if (dirtySlotIds.current.size === 0) return;

        setSaveStatus("loading");

        const promises: Promise<any>[] = [];

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

        Promise.all(promises)
            .then(() => {
                dirtySlotIds.current.clear();
                showSuccess();
            })
            .catch(showError);
    }

    function handleUpdateBuffer(value: string) {
        setSaveStatus("loading");
        updateBuffer(value)
            .then(() => {
                queryClient.invalidateQueries({ queryKey: ["personalBuffer"] });
                showSuccess();
            })
            .catch(showError);
    }

    if (getInitialCronogram.isLoading || personalBuffer.isLoading) {
        return <AvailabilitySkeleton />;
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className={styles.pageWrapper}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Definir horário de disponibilidade</h1>
                </div>
                <div className={styles.defaultsSection}>
                    <div className={styles.defaultsLabel}>
                        <Settings size={16} />
                        <span>Padrões:</span>
                    </div>

                    <div className={styles.divider} />

                    <div className={styles.defaultsControls}>
                        <div className={styles.controlGroup}>
                            <label className={styles.controlLabel}>
                                Intervalo pós agendamentos
                            </label>
                            <select
                                className={styles.select}
                                value={personalBuffer.data ?? "0"}
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
                            <Info size={16} />
                            <span>Será reservado 15 minutos antes do intervalo de entrada.</span>
                        </div>
                    </div>
                </div>

                <div className={styles.dayList}>
                    {schedule.map((daySchedule, dayIndex) => {
                        const workIndex = daySchedule.slots.findIndex((s) => s.tipo === "DISPONIVEL");
                        const breakIndex = daySchedule.slots.findIndex((s) => s.tipo === "RESTRITO");
                        const workSlot = daySchedule.slots[workIndex];
                        const breakSlot = daySchedule.slots[breakIndex];
                        const disabled = !daySchedule.enabled;

                        return (
                            <div
                                key={daySchedule.day}
                                className={`${styles.dayRow} ${disabled ? styles.disabled : ""}`}
                            >
                                <div className={styles.dayLabel}>
                                    <Toggle
                                        checked={daySchedule.enabled}
                                        onChange={() => toggleDay(dayIndex)}
                                    />
                                    <span className={`${styles.dayName} ${disabled ? styles.disabled : ""}`}>
                                        {DAYS_META[daySchedule.day]}
                                    </span>
                                </div>

                                {workSlot && breakSlot ? (
                                    <>
                                        <TimeRange
                                            label="Manhã"
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
                                            label="Tarde"
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
                        );
                    })}
                </div>

                <div className={styles.footer}>
                    <SaveBadge status={saveStatus} />

                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={() => setSaveStatus("idle")}
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
        </LocalizationProvider>
    );
}