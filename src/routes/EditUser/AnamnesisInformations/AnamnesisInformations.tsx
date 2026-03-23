import styles from "./AnamnesisInformations.module.css";
import { WhiteContainer } from "../../../components/WhiteContainer/WhiteContainer.tsx";
import InputWithIcon from "../../../components/Inputs/InputWithIcon/InputWithIcon.tsx";
import { FileText, Flag, HeartPulse, Ruler, Weight } from "lucide-react";
import { useRef, useState } from "react";
import useMobile from "../../../hooks/isMobile.tsx";
import SuccessModal from "../../../components/Modal/SuccessModal/SuccessModal.tsx";
import ErrorModal from "../../../components/Modal/ErrorModal/ErrorModal.tsx";
import useModal from "../../../hooks/useModal.tsx";
import { useQuery } from "@tanstack/react-query";
import type { AnamnesisData, CondicaoDto } from "../../../models/anamnesis.ts";
import { getAnamnesis, updateAnamnesis } from "../../../constants/anamnesis.ts";
import AsideEditUser from "../../../components/EditUser/AsideEditUser.tsx";
import Select from "../../../components/Select/Select.tsx";
import { SelectableOption } from "../../../components/SelectableOption/SelectableOption.tsx";
import InputTags from "../../../components/Inputs/InputTags/InputTags.tsx";
import classNames from "classnames";
import TextareaWithIcon from "../../../components/Inputs/TextareaWithIcon/TextareaWithIcon.tsx";
import SmallerButton from "../../../components/SmallerButton/SmallerButton.tsx";
import useClickOutside from "../../../hooks/useClickOutside.tsx";

export default function AnamnesisInformations() {
  const isMobile = useMobile();

  const {
    openModal,
    setOpenModal,
    textModal,
    setTextModal
  } = useModal(null, { title: "", content: "" })

  const ref = useRef(null);

  useClickOutside({
    ref,
    callback: () => {
      if (openModal) {
        setOpenModal(null);
      }
    }
  });

  const [anamnesisData, setAnamnesisData] = useState<AnamnesisData>({
    altura: 0,
    peso: 0,
    objectivoPrincipal: "",
    rotina: "",
    condicoes: [],
    nivelDeAtividade: "SEDENTARIO",
    observacaoSaude: "",
  });


  const anamnesisInfo = useQuery<AnamnesisData>({
    queryKey: ["anamnesisInfo"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await getAnamnesis();
      setAnamnesisData(response.data);
      return response.data;
    }
  });

  const [openSelectId, setOpenSelectId] = useState<string | null>(null);

  function handleConditionToggle(situacao: string) {
    setAnamnesisData(prev => {
      const exists = prev.condicoes.some(c => c.situacao === situacao);
      return {
        ...prev,
        condicoes: exists
          ? prev.condicoes.filter(c => c.situacao !== situacao)
          : [...prev.condicoes, { situacao, tipo: "PADRAO" }]
      };
    });
  };

  function updateFormField(field: keyof AnamnesisData, value: AnamnesisData[typeof field]) {
    setAnamnesisData((previousValues) => ({ ...previousValues, [field]: value }));
  }

  function normalizeTags(tags: string[]) {
    const trimmedTags = tags
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    return Array.from(new Set(trimmedTags));
  }

  const isOtherConditionSelected = anamnesisData.condicoes.some(c => c.tipo === "OUTRO");

  // const MAX_DAILY_ROUTINE_CHARACTERS = 500;
  const MIN_HEIGHT_CM = 100;
  const MAX_HEIGHT_CM = 250;
  const MIN_WEIGHT_KG = 25;
  const MAX_WEIGHT_KG = 350;
  const MAX_OBJECTIVE_OBSERVATION_CHARACTERS = 500;
  const MAX_HEIGHT_CHARACTERS = 3;
  const MAX_WEIGHT_CHARACTERS = 6;

  function handleModal(type: "success" | "error", title: string, content: string) {
    setTextModal({ title, content });
    setOpenModal(type);
  }


  interface ValidationErrors {
    altura?: string;
    peso?: string;
  }

  // Replace the handleUpdateAnamnesis function and add a validate function
  function validate(): ValidationErrors {
    const errors: ValidationErrors = {};

    if (anamnesisData.altura) {
      if (anamnesisData.altura < MIN_HEIGHT_CM || anamnesisData.altura > MAX_HEIGHT_CM) {
        errors.altura = `Altura deve estar entre ${MIN_HEIGHT_CM} e ${MAX_HEIGHT_CM} cm.`;
      }
    }

    if (anamnesisData.peso) {
      if (anamnesisData.peso < MIN_WEIGHT_KG || anamnesisData.peso > MAX_WEIGHT_KG) {
        errors.peso = `Peso deve estar entre ${MIN_WEIGHT_KG} e ${MAX_WEIGHT_KG} kg.`;
      }
    }

    return errors;
  }

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const [updateLoading, setUpdateLoading] = useState(false);
  function handleUpdateAnamnesis() {
    const errors = validate();
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setUpdateLoading(true);

    updateAnamnesis(anamnesisData).then(() => {
      setUpdateLoading(false);
      handleModal("success", "Anamnese atualizada!", "Suas informações de anamnese foram atualizadas com sucesso.");
    }).catch(() => {
      setUpdateLoading(false);
      handleModal("error", "Erro ao atualizar anamnese", "Ocorreu um erro ao tentar atualizar suas informações de anamnese. Por favor, tente novamente mais tarde.");
    });
  }

  function handleUndoChanges() {
    if (anamnesisInfo.data) {
      setAnamnesisData(anamnesisInfo.data);
    }
  }


  const valuesAtSelect = [
    { label: "Ganho de massa muscular", value: "Ganho de massa muscular" },
    { label: "Perda de peso", value: "Perda de peso" },
    { label: "Manutenção da massa muscular", value: "Manutenção da massa muscular" },
  ]

  return (
    <div ref={ref}>
      <div className={styles.editUserGrid}>
        {!isMobile &&
          <div className={styles.goBackContainer}>
            <h1>Editar Perfil</h1>
          </div>
        }

        <div className={styles.personalInfo} ref={ref}>
          <WhiteContainer title="Anamnese / Saúde" icon={<HeartPulse size={22} />} titleFontSize={20} titleClassName={"font-bold! flex! items-center gap-3"} contentClassName={styles.personalInfoGrid} gap={20}>
            <div id="personalData">
              <div className={styles.personalDataTitle} id="personalDataTitle">
                <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                <h3>Dados pessoais</h3>
              </div>
              <div>
                <InputWithIcon
                  id="height"
                  classNameInput="text-[#334155]! font-medium"
                  type="number"
                  placeholder="Ex: 175"
                  icon={<Ruler />}
                  disabled={false}
                  maxLength={MAX_HEIGHT_CHARACTERS}
                  label="Altura (cm)"
                  isLoading={anamnesisInfo.isLoading}
                  value={anamnesisData.altura || ""}
                  allowDecimals={false}
                  hasError={!!validationErrors.altura}
                  onInputChange={(value: string) => {
                    const num = Number(value);
                    setAnamnesisData({ ...anamnesisData, altura: num });
                    if (value && (num < MIN_HEIGHT_CM || num > MAX_HEIGHT_CM)) {
                      setValidationErrors(prev => ({ ...prev, altura: `Altura deve estar entre ${MIN_HEIGHT_CM} e ${MAX_HEIGHT_CM} cm.` }));
                    } else {
                      setValidationErrors(prev => { const { altura, ...rest } = prev; return rest; });
                    }
                  }}
                />
                {validationErrors.altura && (
                  <span className={styles.errorMessage}>{validationErrors.altura}</span>
                )}
              </div>

              <div>
                <InputWithIcon
                  id="weight"
                  classNameInput="text-[#334155]! font-medium"
                  type="number"
                  allowDecimals={true}
                  maxLength={MAX_WEIGHT_CHARACTERS}
                  placeholder="Ex: 70"
                  icon={<Weight />}
                  label="Peso (kg)"
                  isLoading={anamnesisInfo.isLoading}
                  value={anamnesisData.peso || ""}
                  hasError={!!validationErrors.peso}
                  onInputChange={(value: string) => {
                    const num = Number(value);
                    setAnamnesisData({ ...anamnesisData, peso: num });
                    if (value && (num < MIN_WEIGHT_KG || num > MAX_WEIGHT_KG)) {
                      setValidationErrors(prev => ({ ...prev, peso: `Peso deve estar entre ${MIN_WEIGHT_KG} e ${MAX_WEIGHT_KG} kg.` }));
                    } else {
                      setValidationErrors(prev => { const { peso, ...rest } = prev; return rest; });
                    }
                  }}
                />
                {validationErrors.peso && (
                  <span className={styles.errorMessage}>{validationErrors.peso}</span>
                )}
              </div>

              <Select
                id="mainObjective"
                defaultValue={valuesAtSelect.some((v) => v.value === anamnesisData.objectivoPrincipal) ? anamnesisData.objectivoPrincipal : "OUTRO"}
                label="Objetivo principal"
                iconPlaceholder={<Flag size={18} />}
                selectPlaceholder="Selecione seu objetivo"
                values={[
                  ...valuesAtSelect,
                  { label: "Outro", value: "OUTRO" }
                ]}
                onSelectStatusChange={(value: string) => setAnamnesisData({ ...anamnesisData, objectivoPrincipal: value })}
                openSelectId={openSelectId}
                setOpenSelectId={setOpenSelectId}
                showSearchInput={false}
                showSelectAll={false}
                labelClassName="text-sm font-normal!"
                triggerClassName="pt-3 pr-4 pl-4 pb-3 w-full! text-[0.95rem] text-[#334155] font-medium"
                selectWrapperClassName="bg-white! border border-gray-300! w-full! mt-1.5!"
                containerClassName="bg-white!"
              />

              {valuesAtSelect.some((v) => v.value !== anamnesisData.objectivoPrincipal) && (
                <div className="flex flex-col" id="outro">
                  <div className={styles.personalDataTitle}>
                    <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                    <h3>Meu objetivo principal</h3>
                  </div>

                  <TextareaWithIcon
                    id="objective"
                    name="objective"
                    placeholder="Descreva seu principal objetivo(ex: perder peso, ganhar massa muscular, melhorar resistência, reabilitação ou saúde geral)."
                    maxLength={MAX_OBJECTIVE_OBSERVATION_CHARACTERS}
                    icon={<FileText />}
                    value={anamnesisData.objectivoPrincipal || ""}
                    onInputChange={(value: string) => {
                      updateFormField("objectivoPrincipal", value);
                    }}
                  />
                </div>
              )}
            </div>

            <div id="healthConditions">
              <div className={styles.personalDataTitle} id="personalDataTitle">
                <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                <h3>Condições de saúde</h3>
              </div>
              <div className={styles.conditionsGroup}>
                <SelectableOption value="Diabetes" selectionType="checkbox" selected={anamnesisData.condicoes.some(c => c.situacao === "Diabetes")} onClick={handleConditionToggle}>Diabetes</SelectableOption>
                <SelectableOption value="Hipertensão" selectionType="checkbox" selected={anamnesisData.condicoes.some(c => c.situacao === "Hipertensão")} onClick={handleConditionToggle}>Hipertensão</SelectableOption>
                <SelectableOption value="Dores Lombares" selectionType="checkbox" selected={anamnesisData.condicoes.some(c => c.situacao === "Dores Lombares")} onClick={handleConditionToggle}>Dores Lombares</SelectableOption>
                <SelectableOption value="Asma/respiratório" selectionType="checkbox" selected={anamnesisData.condicoes.some(c => c.situacao === "Asma/respiratório")} onClick={handleConditionToggle}>Asma/respiratório</SelectableOption>
                <SelectableOption value="Lesões Articulares" selectionType="checkbox" selected={anamnesisData.condicoes.some(c => c.situacao === "Lesões Articulares")} onClick={handleConditionToggle}>Lesões Articulares</SelectableOption>
                <SelectableOption value="Outro" selectionType="checkbox" selected={isOtherConditionSelected} onClick={handleConditionToggle}>Outro</SelectableOption>
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
                    value={anamnesisData.condicoes
                      .filter(c => c.tipo === "OUTRO")
                      .map(c => c.situacao)
                    }
                    onTagsChange={(tags) => {
                      const normalizedTags = normalizeTags(tags);
                      setAnamnesisData(prev => {
                        const withoutOutro = prev.condicoes.filter(c => c.tipo !== "OUTRO");
                        const outroDtos: CondicaoDto[] = normalizedTags.map(tag => ({
                          situacao: tag,
                          tipo: "OUTRO"
                        }));
                        return { ...prev, condicoes: [...withoutOutro, ...outroDtos] };
                      });
                    }}
                  />
                </div>
              )}
            </div>

            <div id="levelOfActivity">

              <div className={styles.personalDataTitle} id="personalDataTitle">
                <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                <h3>Nível de atividade atual</h3>
              </div>

              <SelectableOption value="SEDENTARIO" subtitle="Pouco ou nenhum exercício, trabalho de escritório." selectionType="radio" selected={anamnesisData.nivelDeAtividade === "SEDENTARIO"} onClick={(value) => {
                updateFormField("nivelDeAtividade", value as AnamnesisData["nivelDeAtividade"]);
              }}>Sedentário</SelectableOption>
              <SelectableOption value="ATIVO" subtitle="Exercício físico 3 a 5 dias por semana." selectionType="radio" selected={anamnesisData.nivelDeAtividade === "ATIVO"} onClick={(value) => {
                updateFormField("nivelDeAtividade", value as AnamnesisData["nivelDeAtividade"]);
              }}>Ativo ocasionalmente</SelectableOption>
              <SelectableOption value="MUITO_ATIVO" subtitle="Treinos intensos diários ou trabalho físico pesado." selectionType="radio" selected={anamnesisData.nivelDeAtividade === "MUITO_ATIVO"} onClick={(value) => {
                updateFormField("nivelDeAtividade", value as AnamnesisData["nivelDeAtividade"]);
              }}>Ativo regularmente</SelectableOption>
            </div>


            <div id="routine">
              <div className={styles.personalDataTitle} id="personalDataTitle">
                <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                <h3>Descreva sua rotina diária atual (opcional)</h3>
              </div>

              <TextareaWithIcon
                name="observacoes"
                id="observacoesRotina"
                placeholder="Adicione quaisquer observações relevantes..."
                maxLength={MAX_OBJECTIVE_OBSERVATION_CHARACTERS}
                value={anamnesisData.rotina}
                icon={<FileText />}
                onInputChange={(value: string) => updateFormField("rotina", value)}
              />
            </div>


            <div className={styles.footer}>
              <div className={styles.dashLine}></div>
              <div className={styles.divButtons}>
                <SmallerButton
                  type="button"
                  classname="w-full! transition h-12!"
                  title="Salvar Alterações"
                  handleButtonClick={handleUpdateAnamnesis}
                  loading={updateLoading}
                />
                <SmallerButton
                  title="Descartar alterações"
                  type="button"
                  classname="w-full! h-12! bg-white! text-gray-500! transition hover:bg-gray-100! border! border-gray-300!"
                  handleButtonClick={handleUndoChanges}
                />
              </div>
            </div>

          </WhiteContainer>
        </div>



        <div className={styles.pagesSection}>
          <WhiteContainer containerClassName={styles.profileWhiteContainer} title="" titleMarginBottom={25} gap={30}>
            <AsideEditUser activeTab="anamnesis" />
          </WhiteContainer>
        </div>
      </div>

      {openModal === "success" && (
        <SuccessModal
          isMobile={isMobile}
          closeThen={() => setOpenModal(null)}
          title={textModal.title}
          content={textModal.content}
        />
      )}

      {openModal === "error" && (
        <ErrorModal
          closeThen={() => setOpenModal(null)}
          title={textModal.title}
          content={textModal.content}
        />
      )}
    </div>
  );
}
