type HeightWeightLimits = {
    minHeightCm: number;
    maxHeightCm: number;
    minWeightKg: number;
    maxWeightKg: number;
};

type StepOneValidationInput = {
    height: string;
    weight: string;
    objectiveValue: string | null;
    objectiveObservation: string;
};

type StepTwoValidationInput = {
    selectedActivityLevel: string | null;
    isOtherConditionSelected: boolean;
    normalizedOtherConditionTagsCount: number;
    dailyRoutine: string;
    maxDailyRoutineCharacters: number;
};

export const parseNumericValue = (value: string): number => Number(value.trim().replace(",", "."));

export const validateHeightWeightValues = (
    heightValue: number,
    weightValue: number,
    limits: HeightWeightLimits
): string | null => {
    if (Number.isNaN(heightValue) || Number.isNaN(weightValue)) {
        return "Altura e peso precisam ser números válidos.";
    }

    if (heightValue <= 0 || weightValue <= 0) {
        return "Altura e peso não podem ser zero ou negativos.";
    }

    if (heightValue < limits.minHeightCm || heightValue > limits.maxHeightCm) {
        return `A altura deve estar entre ${limits.minHeightCm} e ${limits.maxHeightCm} cm.`;
    }

    if (weightValue < limits.minWeightKg || weightValue > limits.maxWeightKg) {
        return `O peso deve estar entre ${limits.minWeightKg} e ${limits.maxWeightKg} kg.`;
    }

    return null;
};

export const validateStepOne = (
    input: StepOneValidationInput,
    limits: HeightWeightLimits
): string | null => {
    const hasHeight = input.height.trim().length > 0;
    const hasWeight = input.weight.trim().length > 0;
    const hasObjective = Boolean(input.objectiveValue);
    const normalizedObjectiveObservation = input.objectiveObservation.trim();
    const hasOtherObjectiveDetails = input.objectiveValue !== "OUTRO" || normalizedObjectiveObservation.length > 0;

    if (!hasHeight || !hasWeight || !hasObjective) {
        return "Preencha todos os campos obrigatórios para continuar.";
    }

    if (!hasOtherObjectiveDetails) {
        return "Descreva seu objetivo para continuar.";
    }

    const heightValue = parseNumericValue(input.height);
    const weightValue = parseNumericValue(input.weight);

    return validateHeightWeightValues(heightValue, weightValue, limits);
};

export const validateStepTwo = (input: StepTwoValidationInput): string | null => {
    const hasOtherConditionDetails = !input.isOtherConditionSelected || input.normalizedOtherConditionTagsCount > 0;
    const normalizedRoutine = input.dailyRoutine.trim();

    if (normalizedRoutine.length > input.maxDailyRoutineCharacters) {
        return `A rotina diária deve ter no máximo ${input.maxDailyRoutineCharacters} caracteres.`;
    }

    if (!input.selectedActivityLevel || !hasOtherConditionDetails) {
        return "Preencha os campos obrigatórios para concluir.";
    }

    return null;
};

export const validateOtherObjectiveObservation = (
    objectiveValue: string | null,
    objectiveObservation: string
): string | null => {
    const normalizedObjectiveObservation = objectiveObservation.trim();

    if (objectiveValue === "OUTRO" && normalizedObjectiveObservation.length === 0) {
        return "Descreva seu objetivo para continuar.";
    }

    return null;
};
