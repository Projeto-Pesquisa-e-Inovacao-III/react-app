
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
import AnamnesisProgressLine from "../../components/AnamnesisProgressLine/AnamnesisProgressLine";
import {
    parseNumericValue,
    validateHeightWeightValues,
    validateOtherObjectiveObservation,
    validateStepOne,
    validateStepTwo
} from "./validations";
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


export default function Anamnesis() {

    type RequestModalType = "success" | "error" | null;
    type RequestModalText = { title: string; content: string };

    // Responsabilidade: concentrar regras de negócio e limites usados na tela.
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

    // Estado principal dos campos do formulário.
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

    // Estado de erros de validação por etapa.
    const [formErrors, setFormErrors] = useState<{ stepOne: string; stepTwo: string }>({
        stepOne: "",
        stepTwo: ""
    });

    // Estado de loading e feedback de sucesso/erro da API.
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [requestModal, setRequestModal] = useState<{ type: RequestModalType; text: RequestModalText }>({
        type: null,
        text: {
            title: "",
            content: ""
        }
    });

    // Controlar o fluxo do formulário em duas etapas.
    const [step, setStep] = useState<number>(1);

    // Normalizar tags inseridas pelo usuário.
    const normalizeTags = (tags: string[]) => {
        const trimmedTags = tags
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0);

        return Array.from(new Set(trimmedTags));
    };

    // Utilitários para atualizar estado sem repetir código.
    const updateFormField = <K extends keyof AnamnesisForm>(field: K, value: AnamnesisForm[K]) => {
        setAnamnesisForm((previousValues) => ({ ...previousValues, [field]: value }));
    };

    const setStepOneError = (message: string) => {
        setFormErrors((previousValues) => ({ ...previousValues, stepOne: message }));
    };

    const setStepTwoError = (message: string) => {
        setFormErrors((previousValues) => ({ ...previousValues, stepTwo: message }));
    };

    // Valores derivados do estado principal.
    const isOtherConditionSelected = anamnesisForm.selectedConditions.includes("Outro");
    const normalizedOtherConditionTags = normalizeTags(anamnesisForm.otherConditionTags);

    // Responsabilidade: alternar seleção de condições e manter consistência das tags de "Outro".
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

        setStepTwoError("");
    };

    // Responsabilidade: validar e avançar do passo 1 para o passo 2.
    const handleStepOneSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const stepOneError = validateStepOne(
            {
                height: anamnesisForm.height,
                weight: anamnesisForm.weight,
                objectiveValue: anamnesisForm.objectiveValue,
                objectiveObservation: anamnesisForm.objectiveObservation
            },
            {
                minHeightCm: MIN_HEIGHT_CM,
                maxHeightCm: MAX_HEIGHT_CM,
                minWeightKg: MIN_WEIGHT_KG,
                maxWeightKg: MAX_WEIGHT_KG
            }
        );

        if (stepOneError) {
            setStepOneError(stepOneError);
            return;
        }

        setStepOneError("");
        setStep(2);
    };

    // Responsabilidade: montar o payload final com as transformações esperadas pela API.
    const buildPayload = (activityLevel: AnamnesisData["nivelDeAtividade"]) => {
        const heightValue = parseNumericValue(anamnesisForm.height);
        const weightValue = parseNumericValue(anamnesisForm.weight);
        const defaultConditions = anamnesisForm.selectedConditions.filter((condition) => condition !== "Outro");
        const otherConditions = isOtherConditionSelected
            ? (normalizedOtherConditionTags.length > 0 ? normalizedOtherConditionTags : ["Outro"])
            : [];
        const normalizedObjectiveObservation = anamnesisForm.objectiveObservation.trim();
        const isOtherObjectiveSelected = anamnesisForm.objectiveValue === "OUTRO";

        return {
            altura: heightValue,
            peso: weightValue,
            objectivoPrincipal: isOtherObjectiveSelected ? normalizedObjectiveObservation : (anamnesisForm.objectiveValue ?? ""),
            rotina: anamnesisForm.dailyRoutine.trim().length > 0 ? anamnesisForm.dailyRoutine.trim() : null,
            condicoes: [
                ...defaultConditions.map((situacao) => ({ situacao, TipoCondicao: "PADRAO" as const })),
                ...otherConditions.map((situacao) => ({ situacao, TipoCondicao: "OUTRO" as const }))
            ],
            nivelDeAtividade: activityLevel,
            observacaoSaude: normalizedObjectiveObservation.length > 0 ? normalizedObjectiveObservation : null
        };
    };

    // Responsabilidade: validar etapa final, enviar para API e tratar feedback da operação.
    const handleConclude = async () => {
        const activityLevel = anamnesisForm.selectedActivityLevel;

        const stepTwoError = validateStepTwo({
            selectedActivityLevel: activityLevel,
            isOtherConditionSelected,
            normalizedOtherConditionTagsCount: normalizedOtherConditionTags.length,
            dailyRoutine: anamnesisForm.dailyRoutine,
            maxDailyRoutineCharacters: MAX_DAILY_ROUTINE_CHARACTERS
        });

        if (stepTwoError) {
            setStepTwoError(stepTwoError);
            return;
        }

        if (!activityLevel) {
            setStepTwoError("Preencha os campos obrigatórios para concluir.");
            return;
        }

        const objectiveObservationError = validateOtherObjectiveObservation(
            anamnesisForm.objectiveValue,
            anamnesisForm.objectiveObservation
        );

        if (objectiveObservationError) {
            setStepOneError(objectiveObservationError);
            setStep(1);
            return;
        }

        const payload = buildPayload(activityLevel);

        const heightWeightValidationError = validateHeightWeightValues(payload.altura, payload.peso, {
            minHeightCm: MIN_HEIGHT_CM,
            maxHeightCm: MAX_HEIGHT_CM,
            minWeightKg: MIN_WEIGHT_KG,
            maxWeightKg: MAX_WEIGHT_KG
        });

        if (heightWeightValidationError) {
            setStepOneError(heightWeightValidationError);
            setStep(1);
            return;
        }

        try {
            setStepTwoError("");
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
            setStepTwoError("Não foi possível concluir agora. Tente novamente.");
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
                    {/* Responsabilidade: etapa 1 (dados pessoais e objetivo). */}
                    {step === 1 && (
                        <>
                            <AnamnesisProgressLine step={1} form={anamnesisForm} />

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
                                    updateFormField("height", value);
                                    setStepOneError("");
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
                                    updateFormField("weight", value);
                                    setStepOneError("");
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
                                    setStepOneError("");
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
                                        updateFormField("objectiveObservation", value);
                                        setStepOneError("");
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

                    {/* Responsabilidade: etapa 2 (histórico de saúde e envio final). */}
                    {step === 2 && (
                        <>
                            <AnamnesisProgressLine step={2} form={anamnesisForm} />

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
                                    updateFormField("otherConditionTags", normalizeTags(tags));
                                    setStepTwoError("");
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
                                        updateFormField("selectedActivityLevel", value as AnamnesisData["nivelDeAtividade"]);
                                        setStepTwoError("");
                                    }}>Sedentário</SelectableOption>
                                    <SelectableOption value="ATIVO" subtitle="Exercita-se 1-2 vezes por semana" selectionType="radio" selected={anamnesisForm.selectedActivityLevel === "ATIVO"} onClick={(value) => {
                                        updateFormField("selectedActivityLevel", value as AnamnesisData["nivelDeAtividade"]);
                                        setStepTwoError("");
                                    }}>Ativo ocasionalmente</SelectableOption>
                                    <SelectableOption value="MUITO_ATIVO" subtitle="Exercita-se 3-5 vezes por semana" selectionType="radio" selected={anamnesisForm.selectedActivityLevel === "MUITO_ATIVO"} onClick={(value) => {
                                        updateFormField("selectedActivityLevel", value as AnamnesisData["nivelDeAtividade"]);
                                        setStepTwoError("");
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
                                    onInputChange={(value: string) => updateFormField("dailyRoutine", value)}
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