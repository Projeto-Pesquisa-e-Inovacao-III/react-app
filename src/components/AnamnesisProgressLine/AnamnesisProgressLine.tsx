import type { AnamnesisData } from "../../models/anamnesis";
import styles from "./AnamnesisProgressLine.module.css";

type AnamnesisProgressForm = {
    objectiveValue: string | null;
    objectiveObservation: string;
    selectedConditions: string[];
    selectedActivityLevel: AnamnesisData["nivelDeAtividade"] | null;
    otherConditionTags: string[];
    dailyRoutine: string;
    height: string;
    weight: string;
};

type AnamnesisProgressLineProps = {
    step: number;
    form: AnamnesisProgressForm;
};

const clampPercentage = (value: number): number => Math.min(100, Math.max(0, Math.round(value)));

const normalizeTags = (tags: string[]) => {
    const trimmedTags = tags
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

    return Array.from(new Set(trimmedTags));
};

const calculateAnamnesisProgress = (form: AnamnesisProgressForm): number => {
    const isOtherConditionSelected = form.selectedConditions.includes("Outro");
    const normalizedOtherConditionTags = normalizeTags(form.otherConditionTags);
    const hasAnyHealthConditionSelected = form.selectedConditions.length > 0;
    const hasValidHealthConditionDetails = !isOtherConditionSelected || normalizedOtherConditionTags.length > 0;
    const hasDailyRoutine = form.dailyRoutine.trim().length > 0;

    const progressFieldStates = {
        height: form.height.trim().length > 0,
        weight: form.weight.trim().length > 0,
        objective: Boolean(form.objectiveValue),
        healthConditions: hasAnyHealthConditionSelected
            ? hasValidHealthConditionDetails
            : null,
        activityLevel: Boolean(form.selectedActivityLevel),
        dailyRoutine: hasDailyRoutine ? true : null,
        objectiveObservation: form.objectiveValue === "OUTRO"
            ? form.objectiveObservation.trim().length > 0
            : null
    };

    const relevantFields = Object.values(progressFieldStates).filter((field): field is boolean => field !== null);
    const totalFields = relevantFields.length;
    const completedFields = relevantFields.filter(Boolean).length;

    if (totalFields === 0) {
        return 0;
    }

    return clampPercentage((completedFields / totalFields) * 100);
};

export default function AnamnesisProgressLine({ step, form }: AnamnesisProgressLineProps) {
    const totalProgressPercentage = calculateAnamnesisProgress(form);

    return (
        <div className={styles.lineProgress}>
            <div className={styles.lineProgressHeader}>
                <span className={styles.lineProgressStep}>{`PASSO ${step} DE 2`}</span>
                <span className={styles.lineProgressPercentage}>{totalProgressPercentage}%</span>
            </div>
            <div className={styles.lineProgressTrack}>
                <div className={styles.lineProgressFill} style={{ width: `${totalProgressPercentage}%` }} />
            </div>
        </div>
    );
}
