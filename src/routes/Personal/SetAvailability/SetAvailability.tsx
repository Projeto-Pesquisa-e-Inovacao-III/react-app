import { useEffect, useRef, useState } from "react";
import styles from "./SetAvailability.module.css";
import { getPersonalBuffer, getPersonalCronogram, updateBuffer, updatePersonalCronogram } from "../../../constants/personal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CircleCheck, Clock, Loader } from "lucide-react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TimeCell from "../../../components/Inputs/TimeCell/TimeCell";
import AvailabilitySkeleton from "./AvailabilitySkeleton/AvailabilitySkeleton";

export interface TimeSlot {
    id?: string;
    horaInicio: string;
    horaFim: string;
    diaSemana: string;
    tipo: "DISPONIVEL" | "RESTRITO";
}

interface DaySchedule {
    day: string;
    slots: TimeSlot[];
}

const DAYS_OF_WEEK = [
    "DOMINGO",
    "SEGUNDA",
    "TERCA",
    "QUARTA",
    "QUINTA",
    "SEXTA",
    "SABADO",
];

const DAYS_OF_WEEK_DISPLAY = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
];


type Status = "idle" | "loading" | "success";

export default function SetAvailability() {

    const getInitialCronogram = useQuery({
        queryKey: ['personalCronogram'],
        queryFn: getPersonalCronogram,
        select: (res) => res.data,
    });

    const personalBuffer = useQuery({
        queryKey: ['personalBuffer'],
        queryFn: getPersonalBuffer,
        select: (res) => res.data.bufferMinutos,
    });


    console.log("Personal Buffer: ", personalBuffer.data);

    const [schedule, setSchedule] = useState<DaySchedule[]>([]);

    useEffect(() => {
        if (!getInitialCronogram.data) return;

        const formatted = DAYS_OF_WEEK.map((day) => ({
            day,
            slots: getInitialCronogram.data.filter(
                (slot: TimeSlot) => slot.diaSemana === day
            ),
        }));

        setSchedule(formatted);
    }, [getInitialCronogram.data]);

    const [status, setStatus] = useState<Status>("idle");
    const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    function showSuccessFeedback() {
        if (feedbackTimeoutRef.current) {
            clearTimeout(feedbackTimeoutRef.current);
        }

        setStatus("success");

        feedbackTimeoutRef.current = setTimeout(() => {
            setStatus("idle");
        }, 3000);
    }

    function updateSlot(
        dayIndex: number,
        slotIndex: number,
        field: keyof TimeSlot,
        value: string,
        id: string
    ) {
        console.log("Updating slot:", { dayIndex, slotIndex, field, value, id });
        setStatus("loading");
        const newSchedule = [...schedule];
        newSchedule[dayIndex].slots[slotIndex] = {
            ...newSchedule[dayIndex].slots[slotIndex],
            [field]: value,
        };

        setSchedule(newSchedule);

        const updatedSlot = newSchedule[dayIndex].slots[slotIndex];

        updatePersonalCronogram(
            {
                diaSemana: updatedSlot.diaSemana,
                horaInicio: updatedSlot.horaInicio,
                horaFim: updatedSlot.horaFim,
                tipo: updatedSlot.tipo,
            },
            id
        )
            .then(() => {
                showSuccessFeedback();
            })
            .catch(() => {
                setStatus("idle");
            });
    }



    const queryClient = useQueryClient();

    function handleUpdateBuffer(value: string) {
        setStatus("loading");

        updateBuffer(value)
            .then(() => {
                queryClient.invalidateQueries({ queryKey: ["personalBuffer"] });
                showSuccessFeedback();
            })
            .catch(() => {
                setStatus("idle");
            });
    }

    useEffect(() => {
        return () => {
            if (feedbackTimeoutRef.current) {
                clearTimeout(feedbackTimeoutRef.current);
            }
        };
    }, []);

    if (getInitialCronogram.isLoading || personalBuffer.isLoading) {
        return <AvailabilitySkeleton />;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Definir horário</h1>
            </div>

            <div className={styles.defaultsSection}>
                <div className={styles.defaultsLabel}>
                    <span className={styles.clockIcon}><Clock /></span>
                    <span>Padrões:</span>
                </div>
                <div className={styles.defaultsControls}>
                    <div className={styles.controlGroup}>
                        <label className={styles.controlLabel} >Intervalo pós agendamentos:</label>
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

                        <p className="text-gray-300 text-sm">Será reservado 15 minutos antes do intervalo de entrada.</p>

                    </div>
                </div>
                {status === "loading" && (
                    <p className="text-white flex gap-2 items-center">
                        <Loader /> Atualizando dados...
                    </p>
                )}

                {status === "success" && (
                    <p className="text-white flex gap-2 items-center">
                        <CircleCheck color="#088F8F" /> Dados atualizados
                    </p>
                )}

            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead className={styles.tableHead}>
                        <tr>
                            <th className={styles.dayColumn}>Dia da semana</th>
                            <th className={styles.timeColumn}>De</th>
                            <th className={styles.intervalColumn}>Intervalo Entrada</th>
                            <th className={styles.intervalColumn}>Intervalo Saída</th>
                            <th className={styles.timeColumn}>Até</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            {schedule.map((daySchedule, dayIndex) => {
                                const workIndex = daySchedule.slots.findIndex(s => s.tipo === "DISPONIVEL");
                                const breakIndex = daySchedule.slots.findIndex(s => s.tipo === "RESTRITO");

                                const workSlot = daySchedule.slots[workIndex] || {};
                                const breakSlot = daySchedule.slots[breakIndex] || {};
                                if (workIndex === -1 || breakIndex === -1) return null;

                                return (
                                    <tr key={dayIndex}>
                                        <td className={`${styles.tableCell} ${styles.dayCell}`}>
                                            <div className={styles.dayCellContent}>
                                                <span>{DAYS_OF_WEEK_DISPLAY[dayIndex]}</span>
                                            </div>
                                        </td>

                                        <td className={styles.tableCell}>
                                            <TimeCell
                                                value={workSlot.horaInicio}
                                                onChange={(time) =>
                                                    updateSlot(dayIndex, workIndex, "horaInicio", time, workSlot.id!)
                                                }
                                            />
                                        </td>

                                        <td className={styles.tableCell}>
                                            <TimeCell
                                                value={breakSlot.horaInicio}
                                                onChange={(time) =>
                                                    updateSlot(dayIndex, breakIndex, "horaInicio", time, breakSlot.id!)
                                                }
                                            />
                                        </td>

                                        <td className={styles.tableCell}>
                                            <TimeCell
                                                value={breakSlot.horaFim}
                                                onChange={(time) =>
                                                    updateSlot(dayIndex, breakIndex, "horaFim", time, breakSlot.id!)
                                                }
                                            />
                                        </td>

                                        <td className={styles.tableCell}>
                                            <TimeCell
                                                value={workSlot.horaFim}
                                                onChange={(time) =>
                                                    updateSlot(dayIndex, workIndex, "horaFim", time, workSlot.id!)
                                                }
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </LocalizationProvider>
                    </tbody>
                </table>
            </div>

            <div className={styles.mobileView}>
                {schedule.map((daySchedule, dayIndex) => {
                    const workIndex = daySchedule.slots.findIndex(s => s.tipo === "DISPONIVEL");
                    const breakIndex = daySchedule.slots.findIndex(s => s.tipo === "RESTRITO");

                    const workSlot = daySchedule.slots[workIndex] || {};
                    const breakSlot = daySchedule.slots[breakIndex] || {};

                    return (
                        <div key={dayIndex} className={styles.dayCard}>
                            <div className={styles.dayCardHeader}>
                                <h3 className={styles.dayCardTitle}>
                                    {DAYS_OF_WEEK_DISPLAY[dayIndex]}
                                </h3>
                            </div>

                            <div className={styles.slotFields}>
                                {/* Horário de trabalho */}
                                <div className={styles.fieldGroup}>
                                    <label className={styles.fieldLabel}>De</label>
                                    <input
                                        type="time"
                                        value={workSlot.horaInicio || ""}
                                        onChange={(e) =>
                                            updateSlot(
                                                dayIndex,
                                                workIndex,
                                                "horaInicio",
                                                e.target.value,
                                                workSlot.id!
                                            )
                                        }
                                        className={styles.input}
                                    />
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label className={styles.fieldLabel}>Até</label>
                                    <input
                                        type="time"
                                        value={workSlot.horaFim || ""}
                                        onChange={(e) =>
                                            updateSlot(
                                                dayIndex,
                                                workIndex,
                                                "horaFim",
                                                e.target.value,
                                                workSlot.id!
                                            )
                                        }
                                        className={styles.input}
                                    />
                                </div>

                                {/* Intervalo */}
                                <div className={styles.fieldGroup}>
                                    <label className={styles.fieldLabel}>Intervalo Entrada</label>
                                    <input
                                        type="time"
                                        value={breakSlot.horaInicio || ""}
                                        onChange={(e) =>
                                            updateSlot(
                                                dayIndex,
                                                breakIndex,
                                                "horaInicio",
                                                e.target.value,
                                                breakSlot.id!
                                            )
                                        }
                                        className={styles.input}
                                    />
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label className={styles.fieldLabel}>Intervalo Saída</label>
                                    <input
                                        type="time"
                                        value={breakSlot.horaFim || ""}
                                        onChange={(e) =>
                                            updateSlot(
                                                dayIndex,
                                                breakIndex,
                                                "horaFim",
                                                e.target.value,
                                                breakSlot.id!
                                            )
                                        }
                                        className={styles.input}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}