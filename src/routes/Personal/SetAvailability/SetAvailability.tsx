import React, { useState } from 'react'
import styles from "./SetAvailability.module.css"
import { Plus, Trash2 } from 'lucide-react';

interface TimeSlot {
    id: string;
    from: string;
    entryInterval: string;
    exitInterval: string;
    until: string;
    sessionInterval: string;
}

interface DaySchedule {
    day: string;
    slots: TimeSlot[];
}

const DAYS_OF_WEEK = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
];

function createDefaultSlot(): TimeSlot {
    return {
        id: crypto.randomUUID(),
        from: "06:00",
        entryInterval: "",
        exitInterval: "",
        until: "23:00",
        sessionInterval: "",
    };
}
export default function SetAvailability() {
    const [schedule, setSchedule] = useState<DaySchedule[]>(
        DAYS_OF_WEEK.map((day) => ({
            day,
            slots: [createDefaultSlot()],
        }))
    );

    function updateSlot(dayIndex: number, slotIndex: number, field: keyof TimeSlot, value: string) {
        const newSchedule = [...schedule];
        newSchedule[dayIndex].slots[slotIndex] = {
            ...newSchedule[dayIndex].slots[slotIndex],
            [field]: value,
        };
        console.log(newSchedule);
        setSchedule(newSchedule);
    };

    function removeSlot(dayIndex: number, slotIndex: number) {
        const newSchedule = [...schedule];
        if (newSchedule[dayIndex].slots.length > 1) {
            newSchedule[dayIndex].slots.splice(slotIndex, 1);
            setSchedule(newSchedule);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Definir horário</h1>
                <p className={styles.subtitle}>Disponibilidade de dias da semana</p>
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
                            <th className={styles.intervalColumn}>Intervalo Sessões</th>
                            <th className={styles.actionsColumn}>Ações</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {schedule.map((daySchedule, dayIndex) => (
                            <>
                                {daySchedule.slots.map((slot, slotIndex) => (
                                    <tr key={slot.id}>
                                        {slotIndex === 0 && (
                                            <td
                                                className={`${styles.tableCell} ${styles.dayCell}`}
                                                rowSpan={daySchedule.slots.length}
                                            >
                                                <div className={styles.dayCellContent}>
                                                    <span>{daySchedule.day}</span>
                                                </div>
                                            </td>
                                        )}
                                        <td className={styles.tableCell}>
                                            <input
                                                type="time"
                                                value={slot.from}
                                                onChange={(e) =>
                                                    updateSlot(dayIndex, slotIndex, "from", e.target.value)
                                                }
                                                className={styles.input}
                                            />
                                        </td>
                                        <td className={styles.tableCell}>
                                            <input
                                                type="time"
                                                value={slot.entryInterval}
                                                onChange={(e) =>
                                                    updateSlot(
                                                        dayIndex,
                                                        slotIndex,
                                                        "entryInterval",
                                                        e.target.value
                                                    )
                                                }
                                                className={styles.input}
                                            />
                                        </td>
                                        <td className={styles.tableCell}>
                                            <input
                                                type="time"
                                                value={slot.exitInterval}
                                                onChange={(e) =>
                                                    updateSlot(
                                                        dayIndex,
                                                        slotIndex,
                                                        "exitInterval",
                                                        e.target.value
                                                    )
                                                }
                                                className={styles.input}
                                            />
                                        </td>
                                        <td className={styles.tableCell}>
                                            <input
                                                type="time"
                                                value={slot.until}
                                                onChange={(e) =>
                                                    updateSlot(dayIndex, slotIndex, "until", e.target.value)
                                                }
                                                className={styles.input}
                                            />
                                        </td>
                                        <td className={styles.tableCell}>
                                            <input
                                                type="time"
                                                value={slot.sessionInterval}
                                                onChange={(e) =>
                                                    updateSlot(
                                                        dayIndex,
                                                        slotIndex,
                                                        "sessionInterval",
                                                        e.target.value
                                                    )
                                                }
                                                className={styles.input}
                                            />
                                        </td>
                                        <td className={styles.tableCell}>
                                            <button
                                                className={`${styles.button} ${styles.deleteButton}`}
                                                onClick={() => removeSlot(dayIndex, slotIndex)}
                                                disabled={daySchedule.slots.length === 1}
                                                title="Remover horário"
                                            >
                                                <Trash2 className={styles.icon} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

