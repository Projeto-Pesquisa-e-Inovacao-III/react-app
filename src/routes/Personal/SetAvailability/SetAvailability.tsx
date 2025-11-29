import { useEffect, useState } from "react";
import { Trash2, Plus, Clock } from "lucide-react";
import styles from "./SetAvailability.module.css";
import { getPersonalProfile } from "../../../constants/personal";
import { useQuery } from "@tanstack/react-query";

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
        id: Math.random().toString(36).substr(2, 9),
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

    const [studentInterval, setStudentInterval] = useState("10");
    const [classDuration, setClassDuration] = useState("60");

    function updateSlot(
        dayIndex: number,
        slotIndex: number,
        field: keyof TimeSlot,
        value: string
    ) {
        const newSchedule = [...schedule];
        newSchedule[dayIndex].slots[slotIndex] = {
            ...newSchedule[dayIndex].slots[slotIndex],
            [field]: value,
        };


        setSchedule(newSchedule);
    };

    const getInitialSchedule = useQuery({
        queryKey: ['personalProfile'],
        queryFn: async () => {
            const response = await getPersonalProfile(1, "2025-11-30");
            return response.data;
        },
    });

    console.log("getInitialSchedule", getInitialSchedule.data);

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
                            value={studentInterval}
                            onChange={(e) => setStudentInterval(e.target.value)}
                        >
                            <option value="5">5 min</option>
                            <option value="10">10 min</option>
                            <option value="15">15 min</option>
                            <option value="20">20 min</option>
                            <option value="30">30 min</option>
                        </select>
                    </div>
                    <div className={styles.controlGroup}>
                        <label className={styles.controlLabel}>Duração da aula:</label>
                        <select
                            className={styles.select}
                            value={classDuration}
                            onChange={(e) => setClassDuration(e.target.value)}
                        >
                            <option value="30">30 min</option>
                            <option value="45">45 min</option>
                            <option value="60">1 hora</option>
                            <option value="90">1 hora 30 min</option>
                            <option value="120">2 horas</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Desktop Table View */}
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
                                    </tr>
                                ))}
                            </>
                        ))}
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
                            <div key={slot.id} className={styles.slotCard}>
                                <div className={styles.slotFields}>
                                    <div className={styles.fieldGroup}>
                                        <label className={styles.fieldLabel}>De</label>
                                        <input
                                            type="time"
                                            value={slot.from}
                                            onChange={(e) =>
                                                updateSlot(dayIndex, slotIndex, "from", e.target.value)
                                            }
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.fieldGroup}>
                                        <label className={styles.fieldLabel}>Até</label>
                                        <input
                                            type="time"
                                            value={slot.until}
                                            onChange={(e) =>
                                                updateSlot(dayIndex, slotIndex, "until", e.target.value)
                                            }
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.fieldGroup}>
                                        <label className={styles.fieldLabel}>Intervalo Entrada</label>
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
                                    </div>

                                    <div className={styles.fieldGroup}>
                                        <label className={styles.fieldLabel}>Intervalo Saída</label>
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
                                    </div>

                                    <div className={styles.fieldGroup}>
                                        <label className={styles.fieldLabel}>Intervalo Sessões</label>
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