
import classNames from "classnames";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    BicepsFlexed,
    Cross,
    Dumbbell,
    Flag,
    HeartPulse,
    House,
    Ruler,
    Weight
} from "lucide-react";
import InputTags from "../../components/Inputs/InputTags/InputTags";
import InputWithIcon from "../../components/Inputs/InputWithIcon/InputWithIcon";
import { LogoWhiteBig } from "../../components/LogoWhiteBig/LogoWhiteBig";
import SmallerButton from "../../components/SmallerButton/SmallerButton";
import { SelectableOption } from "../../components/SelectableOption/SelectableOption";
import Select from "../../components/Select/Select";
import useMobile from "../../hooks/isMobile";
import { createAnamnesis } from "../../constants/anamnesis";
import SuccessModal from "../../components/Modal/SuccessModal/SuccessModal";
import ErrorModal from "../../components/Modal/ErrorModal/ErrorModal";
import type { AnamnesisData } from "../../models/anamnesis";
import styles from "./anamnesis.module.css";




export default function Anamnesis() {
    type RequestModalType = "success" | "error" | null;

    const isMobile = useMobile();
    const navigate = useNavigate();
    const [openSelectId, setOpenSelectId] = useState<string | null>(null);
    const [objectiveValue, setObjectiveValue] = useState<string | null>(null);
    const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
    const [selectedActivityLevel, setSelectedActivityLevel] = useState<AnamnesisData["nivelDeAtividade"] | null>(null);
    const [otherConditionTags, setOtherConditionTags] = useState<string[]>([]);
    const [dailyRoutine, setDailyRoutine] = useState<string>("");
    const [height, setHeight] = useState<string>("");
    const [weight, setWeight] = useState<string>("");
    const [stepOneError, setStepOneError] = useState<string>("");
    const [stepTwoError, setStepTwoError] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [requestModalType, setRequestModalType] = useState<RequestModalType>(null);
    const [requestModalText, setRequestModalText] = useState<{ title: string; content: string }>({
        title: "",
        content: ""
    });
    const [step, setStep] = useState<number>(1);

    const isOtherConditionSelected = selectedConditions.includes("Outro");

    const handleConditionToggle = (value: string) => {
        const isRemovingOtherCondition = value === "Outro" && selectedConditions.includes("Outro");

        setSelectedConditions((previousValues) => (
            previousValues.includes(value)
                ? previousValues.filter((currentValue) => currentValue !== value)
                : [...previousValues, value]
        ));

        if (isRemovingOtherCondition) {
            setOtherConditionTags([]);
        }

        setStepTwoError("");
    };

    const handleStepOneSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const hasHeight = height.trim().length > 0;
        const hasWeight = weight.trim().length > 0;
        const hasObjective = Boolean(objectiveValue);

        if (!hasHeight || !hasWeight || !hasObjective) {
            setStepOneError("Preencha todos os campos obrigatórios para continuar.");
            return;
        }

        setStepOneError("");
        setStep(2);
    };

    const handleConclude = async () => {
        const activityLevel = selectedActivityLevel;
        const hasOtherConditionDetails = !isOtherConditionSelected || otherConditionTags.length > 0;

        if (!activityLevel || !hasOtherConditionDetails) {
            setStepTwoError("Preencha os campos obrigatórios para concluir.");
            return;
        }

        const condicoes = selectedConditions
            .filter((condition) => condition !== "Outro")
            .concat(isOtherConditionSelected ? (otherConditionTags.length > 0 ? otherConditionTags : ["Outro"]) : []);

        const payload = {
            altura: Number(height),
            peso: Number(weight),
            objectivoPrincipal: objectiveValue ?? "",
            rotina: dailyRoutine.trim(),
            condicoes,
            nivelDeAtividade: activityLevel
        };

        if (Number.isNaN(payload.altura) || Number.isNaN(payload.peso)) {
            setStepOneError("Altura e peso precisam ser números válidos.");
            setStep(1);
            return;
        }

        try {
            setStepTwoError("");
            setIsSubmitting(true);
            const response = await createAnamnesis(payload);

            if (response.status === 201) {
                setRequestModalText({
                    title: "Anamnese concluída",
                    content: "As informações foram salvas com sucesso."
                });
                setRequestModalType("success");
            }
        } catch {
            setStepTwoError("Não foi possível concluir agora. Tente novamente.");
            setRequestModalText({
                title: "Erro ao salvar",
                content: "Não foi possível concluir agora. Tente novamente."
            });
            setRequestModalType("error");
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
                                </div>
                                <div className={styles.lineProgressTrack}>
                                    <div className={styles.lineProgressFill} style={{ width: "33%" }} />
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
                                onInputChange={(value: string) => {
                                    setHeight(value);
                                    setStepOneError("");
                                }}
                                icon={<Ruler />}
                                value={height}
                            />

                            <InputWithIcon
                                label={<>Peso (kg) <span className={styles.requiredAsterisk}>*</span></>}
                                type="number"
                                allowDecimals={true}
                                placeholder="Ex: 70"
                                onInputChange={(value: string) => {
                                    setWeight(value);
                                    setStepOneError("");
                                }}
                                icon={<Weight />}
                                value={weight}
                            />
                        </div>

                        <div className={styles.selectGroup}>
                            <Select
                                id="objetivo"
                                label={<>Objetivo Principal <span className={styles.requiredAsterisk}>*</span></>}
                                selectPlaceholder="Selecione um objetivo"
                                openSelectId={openSelectId}
                                setOpenSelectId={setOpenSelectId}
                                iconPlaceholder={<Flag />}
                                triggerClassName="h-13! w-full!"
                                triggerWrapperClassName="h-13! w-full!"
                                selectWrapperClassName="h-13! w-full!"
                                containerClassName="w-full flex-1"
                                showSelectAll={false}
                                showSearchInput={false}
                                onSelectStatusChange={(value: string) => {
                                    setObjectiveValue(value);
                                    setStepOneError("");
                                }}
                                values={[
                                    { icon: <BicepsFlexed />, label: "Presencial", value: "PRESENCIAL" },
                                    { icon: <House />, label: "Residencial", value: "RESIDENCIAL" },
                                    { icon: <HeartPulse />, label: "Funcional", value: "FUNCIONAL" },
                                    { icon: " ", label: "Outro", value: "OUTRO" }
                                ]}
                            />

                            {objectiveValue === "OUTRO" && (
                                <textarea
                                    className={styles.observacoesTextarea}
                                    name="observacoes"
                                    id="observacoes"
                                    placeholder="Adicione quaisquer observações relevantes..."
                                />
                            )}
                        </div>

                        {stepOneError && (
                            <p className={styles.formErrorMessage}>{stepOneError}</p>
                        )}

                        <SmallerButton
                            title="Próximo passo"
                            icon={<ArrowRight />}
                            iconPosition="right"
                            type="submit"
                        />
                    </form>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className={styles.lineProgress}>
                                <div className={styles.lineProgressHeader}>
                                    <span className={styles.lineProgressStep}>PASSO 2 DE 2</span>
                                </div>

                                <div className={styles.lineProgressTrack}>
                                    <div className={styles.lineProgressFill} style={{ width: "66%" }} />
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
                                </div>

                                <div className={classNames(styles.conditionGroup, {
                                    [styles.conditionGroupMobile]: isMobile
                                })}>
                                    <SelectableOption value="Diabetes" selectionType="checkbox" selected={selectedConditions.includes("Diabetes")} onClick={handleConditionToggle}>Diabetes</SelectableOption>
                                    <SelectableOption value="Hipertensão" selectionType="checkbox" selected={selectedConditions.includes("Hipertensão")} onClick={handleConditionToggle}>Hipertensão</SelectableOption>
                                    <SelectableOption value="Dores Lombares" selectionType="checkbox" selected={selectedConditions.includes("Dores Lombares")} onClick={handleConditionToggle}>Dores Lombares</SelectableOption>
                                    <SelectableOption value="Asma/respiratório" selectionType="checkbox" selected={selectedConditions.includes("Asma/respiratório")} onClick={handleConditionToggle}>Asma/respiratório</SelectableOption>
                                    <SelectableOption value="Lesões Articulares" selectionType="checkbox" selected={selectedConditions.includes("Lesões Articulares")} onClick={handleConditionToggle}>Lesões Articulares</SelectableOption>
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
                                value={otherConditionTags}
                                onTagsChange={(tags) => {
                                    setOtherConditionTags(tags);
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
                                    <SelectableOption value="SEDENTARIO" subtitle="Não se exercita" selectionType="radio" selected={selectedActivityLevel === "SEDENTARIO"} onClick={(value) => {
                                        setSelectedActivityLevel(value as AnamnesisData["nivelDeAtividade"]);
                                        setStepTwoError("");
                                    }}>Sedentário</SelectableOption>
                                    <SelectableOption value="ATIVO" subtitle="Exercita-se 1-2 vezes por semana" selectionType="radio" selected={selectedActivityLevel === "ATIVO"} onClick={(value) => {
                                        setSelectedActivityLevel(value as AnamnesisData["nivelDeAtividade"]);
                                        setStepTwoError("");
                                    }}>Ativo ocasionalmente</SelectableOption>
                                    <SelectableOption value="MUITO_ATIVO" subtitle="Exercita-se 3-5 vezes por semana" selectionType="radio" selected={selectedActivityLevel === "MUITO_ATIVO"} onClick={(value) => {
                                        setSelectedActivityLevel(value as AnamnesisData["nivelDeAtividade"]);
                                        setStepTwoError("");
                                    }}>Ativo regularmente</SelectableOption>
                                </div>
                            </div>

                            <div className={classNames(styles.observacoesGroup, {
                                [styles.observacoesGroupMobile]: isMobile
                            })}>
                                <p>Descreva sua rotina diária atual (Opcional)</p>
                                <textarea
                                    className={styles.observacoesTextarea}
                                    name="observacoes"
                                    id="observacoes"
                                    placeholder="Adicione quaisquer observações relevantes..."
                                    value={dailyRoutine}
                                    onChange={(event) => setDailyRoutine(event.target.value)}
                                />
                            </div>

                            {stepTwoError && (
                                <p className={styles.formErrorMessage}>{stepTwoError}</p>
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

            {requestModalType === "success" && (
                <SuccessModal
                    isMobile={isMobile}
                    closeThen={() => {
                        setRequestModalType(null);
                        navigate("/home");
                    }}
                    title={requestModalText.title}
                    content={requestModalText.content}
                />
            )}

            {requestModalType === "error" && (
                <ErrorModal
                    closeThen={() => setRequestModalType(null)}
                    title={requestModalText.title}
                    content={requestModalText.content}
                />
            )}
        </div>
    );
}