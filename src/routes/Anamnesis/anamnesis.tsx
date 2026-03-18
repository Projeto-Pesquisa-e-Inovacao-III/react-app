
import classNames from "classnames";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    Cross,
    Dumbbell,
    FileText,
    Ruler,
    Weight
} from "lucide-react";
import InputTags from "../../components/Inputs/InputTags/InputTags";
import TextareaWithIcon from "../../components/Inputs/TextareaWithIcon/TextareaWithIcon";
import InputWithIcon from "../../components/Inputs/InputWithIcon/InputWithIcon";
import { LogoWhiteBig } from "../../components/LogoWhiteBig/LogoWhiteBig";
import SmallerButton from "../../components/SmallerButton/SmallerButton";
import { SelectableOption } from "../../components/SelectableOption/SelectableOption";
import useMobile from "../../hooks/isMobile";
import { createAnamnesis } from "../../constants/anamnesis";
import SuccessModal from "../../components/Modal/SuccessModal/SuccessModal";
import ErrorModal from "../../components/Modal/ErrorModal/ErrorModal";
import type { AnamnesisData } from "../../models/anamnesis";
import ObjectiveSelect from "../../components/ObjectiveSelect/ObjectiveSelect";
import styles from "./anamnesis.module.css";


type AnamnesisForm = {
    objectiveValue: string | null;
    objectiveObservation: string;
    selectedConditions: string[];
    selectedActivityLevel: AnamnesisData["nivelDeAtividade"] | null;
    otherConditionTags: string[];
    dailyRoutine: string;
    height: string;
    weight: string;
}

const clampPercentage = (value: number): number => Math.min(100, Math.max(0, Math.round(value)));

const calculateAnamnesisProgress = (
    form: AnamnesisForm,
    isOtherConditionSelected: boolean,
    normalizedOtherConditionTagsCount: number
): number => {
    const progressFieldStates = {
        height: form.height.trim().length > 0,
        weight: form.weight.trim().length > 0,
        objective: Boolean(form.objectiveValue),
        healthConditions: form.selectedConditions.length > 0,
        activityLevel: Boolean(form.selectedActivityLevel),
        dailyRoutine: form.dailyRoutine.trim().length > 0,
        objectiveObservation: form.objectiveValue === "OUTRO"
            ? form.objectiveObservation.trim().length > 0
            : null,
        otherConditionTags: isOtherConditionSelected
            ? normalizedOtherConditionTagsCount > 0
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


export default function Anamnesis() {
    type RequestModalType = "success" | "error" | null;
    type RequestModalText = { title: string; content: string };
    const MIN_HEIGHT_CM = 100;
    const MAX_HEIGHT_CM = 250;
    const MIN_WEIGHT_KG = 25;
    const MAX_WEIGHT_KG = 350;
    const MAX_DAILY_ROUTINE_CHARACTERS = 500;
    const MAX_OBJECTIVE_OBSERVATION_CHARACTERS = 500;
    const MAX_HEIGHT_CHARACTERS = 3;
    const MAX_WEIGHT_CHARACTERS = 6;

    const isMobile = useMobile();
    const navigate = useNavigate();
    const [anamnesisForm, setAnamnesisForm] = useState<AnamnesisForm>({
        objectiveValue: null,
        objectiveObservation: "",
        selectedConditions: [],
        selectedActivityLevel: null,
        otherConditionTags: [],
        dailyRoutine: "",
        height: "",
        weight: ""
    });

    const [formErrors, setFormErrors] = useState<{ stepOne: string; stepTwo: string }>({
        stepOne: "",
        stepTwo: ""
    });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [requestModal, setRequestModal] = useState<{ type: RequestModalType; text: RequestModalText }>({
        type: null,
        text: {
            title: "",
            content: ""
        }
    });
    const [step, setStep] = useState<number>(1);

    const parseNumericValue = (value: string): number => Number(value.trim().replace(",", "."));

    const normalizeTags = (tags: string[]) => {
        const trimmedTags = tags
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0);

        return Array.from(new Set(trimmedTags));
    };

    const isOtherConditionSelected = anamnesisForm.selectedConditions.includes("Outro");
    const normalizedOtherConditionTags = normalizeTags(anamnesisForm.otherConditionTags);
    const totalProgressPercentage = calculateAnamnesisProgress(
        anamnesisForm,
        isOtherConditionSelected,
        normalizedOtherConditionTags.length
    );

    const handleConditionToggle = (value: string) => {
        const isRemovingOtherCondition = value === "Outro" && anamnesisForm.selectedConditions.includes("Outro");

        setAnamnesisForm((previousValues) => {
            const nextSelectedConditions = previousValues.selectedConditions.includes(value)
                ? previousValues.selectedConditions.filter((currentValue) => currentValue !== value)
                : [...previousValues.selectedConditions, value];

            return {
                ...previousValues,
                selectedConditions: nextSelectedConditions,
                otherConditionTags: isRemovingOtherCondition ? [] : previousValues.otherConditionTags
            };
        });

        setFormErrors((previousValues) => ({ ...previousValues, stepTwo: "" }));
    };

    const handleStepOneSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const hasHeight = anamnesisForm.height.trim().length > 0;
        const hasWeight = anamnesisForm.weight.trim().length > 0;
        const hasObjective = Boolean(anamnesisForm.objectiveValue);
        const normalizedObjectiveObservation = anamnesisForm.objectiveObservation.trim();
        const hasOtherObjectiveDetails = anamnesisForm.objectiveValue !== "OUTRO" || normalizedObjectiveObservation.length > 0;
        const heightValue = parseNumericValue(anamnesisForm.height);
        const weightValue = parseNumericValue(anamnesisForm.weight);

        if (!hasHeight || !hasWeight || !hasObjective) {
            setFormErrors((previousValues) => ({
                ...previousValues,
                stepOne: "Preencha todos os campos obrigatórios para continuar."
            }));
            return;
        }

        if (!hasOtherObjectiveDetails) {
            setFormErrors((previousValues) => ({
                ...previousValues,
                stepOne: "Descreva seu objetivo para continuar."
            }));
            return;
        }

        if (Number.isNaN(heightValue) || Number.isNaN(weightValue)) {
            setFormErrors((previousValues) => ({
                ...previousValues,
                stepOne: "Altura e peso precisam ser números válidos."
            }));
            return;
        }

        if (heightValue <= 0 || weightValue <= 0) {
            setFormErrors((previousValues) => ({
                ...previousValues,
                stepOne: "Altura e peso não podem ser zero ou negativos."
            }));
            return;
        }

        if (heightValue < MIN_HEIGHT_CM || heightValue > MAX_HEIGHT_CM) {
            setFormErrors((previousValues) => ({
                ...previousValues,
                stepOne: `A altura deve estar entre ${MIN_HEIGHT_CM} e ${MAX_HEIGHT_CM} cm.`
            }));
            return;
        }

        if (weightValue < MIN_WEIGHT_KG || weightValue > MAX_WEIGHT_KG) {
            setFormErrors((previousValues) => ({
                ...previousValues,
                stepOne: `O peso deve estar entre ${MIN_WEIGHT_KG} e ${MAX_WEIGHT_KG} kg.`
            }));
            return;
        }

        setFormErrors((previousValues) => ({ ...previousValues, stepOne: "" }));
        setStep(2);
    };

    const handleConclude = async () => {
        const activityLevel = anamnesisForm.selectedActivityLevel;
        const hasOtherConditionDetails = !isOtherConditionSelected || normalizedOtherConditionTags.length > 0;
        const normalizedRoutine = anamnesisForm.dailyRoutine.trim();
        const heightValue = parseNumericValue(anamnesisForm.height);
        const weightValue = parseNumericValue(anamnesisForm.weight);

        if (normalizedRoutine.length > MAX_DAILY_ROUTINE_CHARACTERS) {
            setFormErrors((previousValues) => ({
                ...previousValues,
                stepTwo: `A rotina diária deve ter no máximo ${MAX_DAILY_ROUTINE_CHARACTERS} caracteres.`
            }));
            return;
        }

        if (!activityLevel || !hasOtherConditionDetails) {
            setFormErrors((previousValues) => ({
                ...previousValues,
                stepTwo: "Preencha os campos obrigatórios para concluir."
            }));
            return;
        }

        const defaultConditions = anamnesisForm.selectedConditions.filter((condition) => condition !== "Outro");
        const otherConditions = isOtherConditionSelected
            ? (normalizedOtherConditionTags.length > 0 ? normalizedOtherConditionTags : ["Outro"])
            : [];
        const normalizedObjectiveObservation = anamnesisForm.objectiveObservation.trim();
        const isOtherObjectiveSelected = anamnesisForm.objectiveValue === "OUTRO";

        if (isOtherObjectiveSelected && normalizedObjectiveObservation.length === 0) {
            setFormErrors((previousValues) => ({
                ...previousValues,
                stepOne: "Descreva seu objetivo para continuar."
            }));
            setStep(1);
            return;
        }

        const payload = {
            altura: heightValue,
            peso: weightValue,
            objectivoPrincipal: isOtherObjectiveSelected ? normalizedObjectiveObservation : (anamnesisForm.objectiveValue ?? ""),
            rotina: normalizedRoutine.length > 0 ? normalizedRoutine : null,
            condicoes: [
                ...defaultConditions.map((situacao) => ({ situacao, TipoCondicao: "PADRAO" as const })),
                ...otherConditions.map((situacao) => ({ situacao, TipoCondicao: "OUTRO" as const }))
            ],
            nivelDeAtividade: activityLevel,
            observacaoSaude: normalizedObjectiveObservation.length > 0 ? normalizedObjectiveObservation : null
        };

        if (Number.isNaN(payload.altura) || Number.isNaN(payload.peso)) {
            setFormErrors((previousValues) => ({
                ...previousValues,
                stepOne: "Altura e peso precisam ser números válidos."
            }));
            setStep(1);
            return;
        }

        if (payload.altura <= 0 || payload.peso <= 0) {
            setFormErrors((previousValues) => ({
                ...previousValues,
                stepOne: "Altura e peso não podem ser zero ou negativos."
            }));
            setStep(1);
            return;
        }

        if (payload.altura < MIN_HEIGHT_CM || payload.altura > MAX_HEIGHT_CM) {
            setFormErrors((previousValues) => ({
                ...previousValues,
                stepOne: `A altura deve estar entre ${MIN_HEIGHT_CM} e ${MAX_HEIGHT_CM} cm.`
            }));
            setStep(1);
            return;
        }

        if (payload.peso < MIN_WEIGHT_KG || payload.peso > MAX_WEIGHT_KG) {
            setFormErrors((previousValues) => ({
                ...previousValues,
                stepOne: `O peso deve estar entre ${MIN_WEIGHT_KG} e ${MAX_WEIGHT_KG} kg.`
            }));
            setStep(1);
            return;
        }211

        try {
            setFormErrors((previousValues) => ({ ...previousValues, stepTwo: "" }));
            setIsSubmitting(true);
            const response = await createAnamnesis(payload);

            if (response.status === 201) {
                setRequestModal({
                    type: "success",
                    text: {
                        title: "Anamnese concluída",
                        content: "As informações foram salvas com sucesso."
                    }
                });
            }
        } catch {
            setFormErrors((previousValues) => ({
                ...previousValues,
                stepTwo: "Não foi possível concluir agora. Tente novamente."
            }));
            setRequestModal({
                type: "error",
                text: {
                    title: "Erro ao salvar",
                    content: "Não foi possível concluir agora. Tente novamente."
                }
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className={classNames(styles.containerAnamnesis, {
                [styles.containerAnamnesisMobile]: isMobile
            })}
        >
            <div className={classNames(styles.wrapperRegisterElements, {
                [styles.wrapperRegisterElementsMobile]: isMobile
            })}>
                <div className={classNames(styles.anamnesisElements, {
                    [styles.anamnesisElementsMobile]: isMobile
                })}>
                    {step === 1 && (
                        <>
                            <div className={styles.lineProgress}>
                                <div className={styles.lineProgressHeader}>
                                    <span className={styles.lineProgressStep}>PASSO 1 DE 2</span>
                                    <span className={styles.lineProgressPercentage}>{totalProgressPercentage}%</span>
                                </div>
                                <div className={styles.lineProgressTrack}>
                                    <div className={styles.lineProgressFill} style={{ width: `${totalProgressPercentage}%` }} />
                                </div>
                            </div>

                            <div className={classNames(styles.anamnesisTitle, {
                                [styles.anamnesisTitleMobile]: isMobile
                            })}>
                                <h1>Anamnese: Dados Pessoais</h1>
                                <p>
                                    Para iniciarmos sua jornada personalizada, precisamos de algumas
                                    informações básicas sobre sua condição física atual e seus objetivos.
                                </p>
                            </div>

                    <form onSubmit={handleStepOneSubmit} className={styles.formAnamnesis}>
                        <div className={classNames(styles.inputGroup, {
                            [styles.inputGroupMobile]: isMobile
                        })}>
                            <InputWithIcon
                                label={<>Altura (cm) <span className={styles.requiredAsterisk}>*</span></>}
                                type="number"
                                placeholder="Ex: 175"
                                maxLength={MAX_HEIGHT_CHARACTERS}
                                onInputChange={(value: string) => {
                                    setAnamnesisForm((previousValues) => ({ ...previousValues, height: value }));
                                    setFormErrors((previousValues) => ({ ...previousValues, stepOne: "" }));
                                }}
                                icon={<Ruler />}
                                value={anamnesisForm.height}
                            />

                            <InputWithIcon
                                label={<>Peso (kg) <span className={styles.requiredAsterisk}>*</span></>}
                                type="number"
                                allowDecimals={true}
                                maxDecimalPlaces={2}
                                decimalSeparator=","
                                placeholder="Ex: 70"
                                maxLength={MAX_WEIGHT_CHARACTERS}
                                onInputChange={(value: string) => {
                                    setAnamnesisForm((previousValues) => ({ ...previousValues, weight: value }));
                                    setFormErrors((previousValues) => ({ ...previousValues, stepOne: "" }));
                                }}
                                icon={<Weight />}
                                value={anamnesisForm.weight}
                            />
                        </div>

                        <div className={styles.selectGroup}>
                            <ObjectiveSelect
                                value={anamnesisForm.objectiveValue}
                                onChange={(value: string) => {
                                    setAnamnesisForm((previousValues) => ({
                                        ...previousValues,
                                        objectiveValue: value,
                                        objectiveObservation: value === "OUTRO" ? previousValues.objectiveObservation : ""
                                    }));
                                    setFormErrors((previousValues) => ({ ...previousValues, stepOne: "" }));
                                }}
                            />

                            {anamnesisForm.objectiveValue === "OUTRO" && (
                                <TextareaWithIcon
                                    id="observacoes"
                                    name="observacoes"
                                    placeholder="Adicione quaisquer observações relevantes..."
                                    maxLength={MAX_OBJECTIVE_OBSERVATION_CHARACTERS}
                                    value={anamnesisForm.objectiveObservation}
                                    icon={<FileText />}
                                    onInputChange={(value: string) => {
                                        setAnamnesisForm((previousValues) => ({ ...previousValues, objectiveObservation: value }));
                                        setFormErrors((previousValues) => ({ ...previousValues, stepOne: "" }));
                                    }}
                                />
                            )}
                        </div>

                        {formErrors.stepOne && (
                            <p className={styles.formErrorMessage}>{formErrors.stepOne}</p>
                        )}

                        <SmallerButton
                            title="Próximo passo"
                            icon={<ArrowRight />}
                            iconPosition="right"
                            type="submit"
                            classname={styles.nextButton}
                        />
                    </form>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className={styles.lineProgress}>
                                <div className={styles.lineProgressHeader}>
                                    <span className={styles.lineProgressStep}>PASSO 2 DE 2</span>
                                    <span className={styles.lineProgressPercentage}>{totalProgressPercentage}%</span>
                                </div>

                                <div className={styles.lineProgressTrack}>
                                    <div className={styles.lineProgressFill} style={{ width: `${totalProgressPercentage}%` }} />
                                </div>
                            </div>

                            <div className={classNames(styles.anamnesisTitle, {
                                [styles.anamnesisTitleMobile]: isMobile
                            })}>
                                <h1>Histórico de Saúde</h1>
                                <p>
                                    Precisamos entender sua condição física atual e hábitos para
                                    personalizar seus treinos com máxima segurança e eficiência.
                                </p>
                            </div>

                            <div>
                                <div className={classNames(styles.conditionGroupHeader, {
                                    [styles.conditionGroupHeaderMobile]: isMobile
                                })}>
                                    <Cross />
                                    <h1>Condições de Saúde</h1>
                                    <p className={styles.optionalInlineText}>(Opcional)</p>
                                </div>

                                <div className={classNames(styles.conditionGroup, {
                                    [styles.conditionGroupMobile]: isMobile
                                })}>
                                    <SelectableOption value="Diabetes" selectionType="checkbox" selected={anamnesisForm.selectedConditions.includes("Diabetes")} onClick={handleConditionToggle}>Diabetes</SelectableOption>
                                    <SelectableOption value="Hipertensão" selectionType="checkbox" selected={anamnesisForm.selectedConditions.includes("Hipertensão")} onClick={handleConditionToggle}>Hipertensão</SelectableOption>
                                    <SelectableOption value="Dores Lombares" selectionType="checkbox" selected={anamnesisForm.selectedConditions.includes("Dores Lombares")} onClick={handleConditionToggle}>Dores Lombares</SelectableOption>
                                    <SelectableOption value="Asma/respiratório" selectionType="checkbox" selected={anamnesisForm.selectedConditions.includes("Asma/respiratório")} onClick={handleConditionToggle}>Asma/respiratório</SelectableOption>
                                    <SelectableOption value="Lesões Articulares" selectionType="checkbox" selected={anamnesisForm.selectedConditions.includes("Lesões Articulares")} onClick={handleConditionToggle}>Lesões Articulares</SelectableOption>
                                    <SelectableOption value="Outro" selectionType="checkbox" selected={isOtherConditionSelected} onClick={handleConditionToggle}>Outro</SelectableOption>
                                </div>
                            </div>

                            {isOtherConditionSelected && (
                                <div className={classNames(styles.inputGroup, {
                                    [styles.inputGroupMobile]: isMobile
                                })}>
                            <InputTags
                                label={<>Especifique sua condição (limite 5): <span className={styles.requiredAsterisk}>*</span></>}
                                placeholder="Ex: Enxaqueca crônica;"
                                maxTags={5}
                                maxTagCharacters={40}
                                value={anamnesisForm.otherConditionTags}
                                onTagsChange={(tags) => {
                                    setAnamnesisForm((previousValues) => ({ ...previousValues, otherConditionTags: normalizeTags(tags) }));
                                    setFormErrors((previousValues) => ({ ...previousValues, stepTwo: "" }));
                                }}
                            />
                                </div>
                            )}

                            <div>
                                <div className={classNames(styles.levelGroupHeader, {
                                    [styles.levelGroupHeaderMobile]: isMobile
                                })}>
                                    <div className={classNames(styles.conditionGroupHeader, {
                                        [styles.conditionGroupHeaderMobile]: isMobile
                                    })}>
                                        <Dumbbell />
                                        <h1>Atividade Atual <span className={styles.requiredAsterisk}>*</span></h1>
                                    </div>

                                    <p className={styles.conditionGroupHeaderP}>
                                        Selecione o nível de atividade física que melhor descreve sua rotina atual.
                                    </p>
                                </div>

                                <div className={styles.levelGroup}>
                                    <SelectableOption value="SEDENTARIO" subtitle="Não se exercita" selectionType="radio" selected={anamnesisForm.selectedActivityLevel === "SEDENTARIO"} onClick={(value) => {
                                        setAnamnesisForm((previousValues) => ({ ...previousValues, selectedActivityLevel: value as AnamnesisData["nivelDeAtividade"] }));
                                        setFormErrors((previousValues) => ({ ...previousValues, stepTwo: "" }));
                                    }}>Sedentário</SelectableOption>
                                    <SelectableOption value="ATIVO" subtitle="Exercita-se 1-2 vezes por semana" selectionType="radio" selected={anamnesisForm.selectedActivityLevel === "ATIVO"} onClick={(value) => {
                                        setAnamnesisForm((previousValues) => ({ ...previousValues, selectedActivityLevel: value as AnamnesisData["nivelDeAtividade"] }));
                                        setFormErrors((previousValues) => ({ ...previousValues, stepTwo: "" }));
                                    }}>Ativo ocasionalmente</SelectableOption>
                                    <SelectableOption value="MUITO_ATIVO" subtitle="Exercita-se 3-5 vezes por semana" selectionType="radio" selected={anamnesisForm.selectedActivityLevel === "MUITO_ATIVO"} onClick={(value) => {
                                        setAnamnesisForm((previousValues) => ({ ...previousValues, selectedActivityLevel: value as AnamnesisData["nivelDeAtividade"] }));
                                        setFormErrors((previousValues) => ({ ...previousValues, stepTwo: "" }));
                                    }}>Ativo regularmente</SelectableOption>
                                </div>
                            </div>

                            <div className={classNames(styles.observacoesGroup, {
                                [styles.observacoesGroupMobile]: isMobile
                            })}>
                                <p>Descreva sua rotina diária atual (Opcional)</p>
                                <TextareaWithIcon
                                    name="observacoes"
                                    id="observacoesRotina"
                                    placeholder="Adicione quaisquer observações relevantes..."
                                    maxLength={MAX_DAILY_ROUTINE_CHARACTERS}
                                    value={anamnesisForm.dailyRoutine}
                                    icon={<FileText />}
                                    onInputChange={(value: string) => setAnamnesisForm((previousValues) => ({ ...previousValues, dailyRoutine: value }))}
                                />
                            </div>

                            {formErrors.stepTwo && (
                                <p className={styles.formErrorMessage}>{formErrors.stepTwo}</p>
                            )}

                            <div className={styles.buttonsGroup}>
                                <SmallerButton
                                    title="Anterior"
                                    icon={<ArrowLeft />}
                                    iconPosition="left"
                                    type="button"
                                    classname={styles.backButton}
                                    handleButtonClick={() => setStep(1)}
                                />
                                <SmallerButton
                                    title="Concluir"
                                    icon={<ArrowRight />}
                                    iconPosition="right"
                                    type="button"
                                    classname={styles.concludeButtonSmall}
                                    handleButtonClick={handleConclude}
                                    loading={isSubmitting}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
            {!isMobile && (
                <div className={styles.sectionLogoLogin}>
                    <LogoWhiteBig />
                </div>
            )}

            {requestModal.type === "success" && (
                <SuccessModal
                    isMobile={isMobile}
                    closeThen={() => {
                        setRequestModal((previousValues) => ({ ...previousValues, type: null }));
                        navigate("/home");
                    }}
                    title={requestModal.text.title}
                    content={requestModal.text.content}
                />
            )}

            {requestModal.type === "error" && (
                <ErrorModal
                    closeThen={() => setRequestModal((previousValues) => ({ ...previousValues, type: null }))}
                    title={requestModal.text.title}
                    content={requestModal.text.content}
                />
            )}
        </div>
    );
}