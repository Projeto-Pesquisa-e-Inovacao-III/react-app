import { useEffect, useState } from "react";
import styles from "./SetAvailability.module.css";
import { getPersonalBuffer, getPersonalCronogram, getPersonalProfile, updateBuffer, updatePersonalCronogram } from "../../../constants/personal";
import { useQuery } from "@tanstack/react-query";
import { Clock } from "lucide-react";

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

    function updateSlot(
        dayIndex: number,
        slotIndex: number,
        field: keyof TimeSlot,
        value: string,
        id: string
    ) {
        console.log("Updating slot:", { dayIndex, slotIndex, field, value });

        const newSchedule = [...schedule];
        newSchedule[dayIndex].slots[slotIndex] = {
            ...newSchedule[dayIndex].slots[slotIndex],
            [field]: value,
        };

        console.log("newSchedule[dayIndex].slots", schedule);

        setSchedule(newSchedule);
        console.log("Updating slot with API call:", newSchedule[dayIndex].slots[slotIndex]);
        const updatedSlot = newSchedule[dayIndex].slots[slotIndex];
        updatePersonalCronogram({ diaSemana: updatedSlot.diaSemana, horaInicio: updatedSlot.horaInicio, horaFim: updatedSlot.horaFim, tipo: updatedSlot.tipo }, id)
            .then(() => {
                console.log("Cronograma atualizado com sucesso");
            })
            .catch((error) => {
                console.error("Erro ao atualizar cronograma:", error);
            });

    };

    function handleUpdateBuffer(value: string) {
        updateBuffer(value)
            .then(() => {
                console.log("Buffer atualizado com sucesso");
            })
            .catch((error) => {
                console.error("Erro ao atualizar buffer:", error);
            });

    }


    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Definir horário</h1>
                <p className={styles.subtitle}>Disponibilidade de dias da semana</p>
            </div>

            <div className={styles.defaultsSection}>
                <div className={styles.defaultsLabel}>
                    <span className={styles.clockIcon}><Clock /></span>
                    <span>Padrões:</span>
                </div>
                <div className={styles.defaultsControls}>
                    <div className={styles.controlGroup}>
                        <label className={styles.controlLabel}>Intervalo entre alunos:</label>
                        <select
                            className={styles.select}
                            defaultValue={personalBuffer.data}
                            onChange={(e) => handleUpdateBuffer(e.target.value)}
                        >
                            <option value="15">15 min</option>
                            <option value="20">20 min</option>
                            <option value="30">30 min</option>
                            <option value="45">45 min</option>
                            <option value="60">1 hora</option>
                        </select>
                    </div>
                </div>
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
                        {schedule.map((daySchedule, dayIndex) => {
                            const workIndex = daySchedule.slots.findIndex(s => s.tipo === "DISPONIVEL");
                            const breakIndex = daySchedule.slots.findIndex(s => s.tipo === "RESTRITO");

                            const workSlot = daySchedule.slots[workIndex] || {};
                            const breakSlot = daySchedule.slots[breakIndex] || {};

                            return (
                                <tr key={dayIndex}>
                                    <td className={`${styles.tableCell} ${styles.dayCell}`}>
                                        <div className={styles.dayCellContent}>
                                            <span>{DAYS_OF_WEEK_DISPLAY[dayIndex]}</span>
                                        </div>
                                    </td>

                                    <td className={styles.tableCell}>
                                        <input
                                            type="time"
                                            value={workSlot.horaInicio || ""}
                                            onChange={(e) =>
                                                updateSlot(dayIndex, workIndex, "horaInicio", e.target.value, workSlot.id!)
                                            }
                                            className={styles.input}
                                        />
                                    </td>

                                    <td className={styles.tableCell}>
                                        <input
                                            type="time"
                                            value={breakSlot.horaInicio || ""}
                                            onChange={(e) =>
                                                updateSlot(dayIndex, breakIndex, "horaInicio", e.target.value, breakSlot.id!)
                                            }
                                            className={styles.input}
                                        />
                                    </td>

                                    <td className={styles.tableCell}>
                                        <input
                                            type="time"
                                            value={breakSlot.horaFim || ""}
                                            onChange={(e) =>
                                                updateSlot(dayIndex, breakIndex, "horaFim", e.target.value, breakSlot.id!)
                                            }
                                            className={styles.input}
                                        />
                                    </td>

                                    <td className={styles.tableCell}>
                                        <input
                                            type="time"
                                            value={workSlot.horaFim || ""}
                                            onChange={(e) =>
                                                updateSlot(dayIndex, workIndex, "horaFim", e.target.value, workSlot.id!)
                                            }
                                            className={styles.input}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className={styles.mobileView}>
                {schedule.map((daySchedule, dayIndex) => (
                    <div key={daySchedule.day} className={styles.dayCard}>
                        <div className={styles.dayCardHeader}>
                            <h3 className={styles.dayCardTitle}>{daySchedule.day}</h3>
                        </div>

                        {daySchedule.slots.map((slot, slotIndex) => (
                            <div key={slotIndex} className={styles.slotCard}>
                                <div className={styles.slotFields}>
                                    <div className={styles.fieldGroup}>
                                        <label className={styles.fieldLabel}>De</label>
                                        <input
                                            type="time"
                                            onChange={(e) =>
                                                updateSlot(dayIndex, slotIndex, "horaInicio", e.target.value)
                                            }
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.fieldGroup}>
                                        <label className={styles.fieldLabel}>Até</label>
                                        <input
                                            type="time"
                                            onChange={(e) =>
                                                updateSlot(dayIndex, slotIndex, "horaFim", e.target.value)
                                            }
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.fieldGroup}>
                                        <label className={styles.fieldLabel}>Intervalo Entrada</label>
                                        <input
                                            type="time"
                                            onChange={(e) =>
                                                updateSlot(
                                                    dayIndex,
                                                    slotIndex,
                                                    "horaInicio",
                                                    e.target.value
                                                )
                                            }
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.fieldGroup}>
                                        <label className={styles.fieldLabel}>Intervalo Saída</label>
                                        <input
                                            type="time"
                                            onChange={(e) =>
                                                updateSlot(
                                                    dayIndex,
                                                    slotIndex,
                                                    "horaFim",
                                                    e.target.value
                                                )
                                            }
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.fieldGroup}>
                                        <label className={styles.fieldLabel}>Intervalo Sessões</label>
                                        <input
                                            type="time"
                                            onChange={(e) =>
                                                updateSlot(
                                                    dayIndex,
                                                    slotIndex,
                                                    "horaFim",
                                                    e.target.value
                                                )
                                            }
                                            className={styles.input}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};