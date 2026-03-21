import styles from "./AnamnesisInformations.module.css";
import { WhiteContainer } from "../../../components/WhiteContainer/WhiteContainer.tsx";
import InputWithIcon from "../../../components/Inputs/InputWithIcon/InputWithIcon.tsx";
import { FileText, Flag, Ruler, Shield, Weight } from "lucide-react";
import { useEffect, useState } from "react";
import useMobile from "../../../hooks/isMobile.tsx";
import SuccessModal from "../../../components/Modal/SuccessModal/SuccessModal.tsx";
import ErrorModal from "../../../components/Modal/ErrorModal/ErrorModal.tsx";
import useModal from "../../../hooks/useModal.tsx";
import { useQuery } from "@tanstack/react-query";
import type { AnamnesisData, CondicaoDto } from "../../../models/anamnesis.ts";
import { getAnamnesis } from "../../../constants/anamnesis.ts";
import AsideEditUser from "../../../components/EditUser/AsideEditUser.tsx";
import Select from "../../../components/Select/Select.tsx";
import { SelectableOption } from "../../../components/SelectableOption/SelectableOption.tsx";
import InputTags from "../../../components/Inputs/InputTags/InputTags.tsx";
import classNames from "classnames";
import TextareaWithIcon from "../../../components/Inputs/TextareaWithIcon/TextareaWithIcon.tsx";

export default function AnamnesisInformations() {
  const isMobile = useMobile();

  const {
    openModal,
    setOpenModal,
    textModal,
    setTextModal
  } = useModal(null, { title: "", content: "" })

  const anamnesisInfo = useQuery<AnamnesisData>({
    queryKey: ["anamnesisInfo"],
    queryFn: async () => {
      const response = await getAnamnesis();
      return response.data;
    }
  });
  // {"altura":1.75,"peso":70.5,"objectivoPrincipal":"Ganho de massa muscular","rotina":"Trabalho das 9h às 18h, treino à noite","condicoes":[{"situacao":"Controlada com medicamento","tipo":"PADRAO"},{"situacao":"Sem tratamento","tipo":"PADRAO"}],"nivelDeAtividade":"SEDENTARIO","observacaoSaude":"Sinto dores no joelho direito ao agachar"}
  const [anamnesisData, setAnamnesisData] = useState<AnamnesisData>({
    altura: 0,
    peso: 0,
    objectivoPrincipal: "",
    rotina: "",
    condicoes: [],
    nivelDeAtividade: "SEDENTARIO",
    observacaoSaude: "",
  });

  useEffect(() => {
    if (anamnesisInfo.data) {
      setAnamnesisData(anamnesisInfo.data);
    }
  }, [anamnesisInfo.data])

  console.log(anamnesisInfo.data)

  const [openSelectId, setOpenSelectId] = useState<string | null>(null);

  const handleConditionToggle = (situacao: string) => {
    setAnamnesisData(prev => {
      const exists = prev.condicoes.some(c => c.situacao === situacao);
      return {
        ...prev,
        condicoes: exists
          ? prev.condicoes.filter(c => c.situacao !== situacao)
          : [...prev.condicoes, { situacao, TipoCondicao: "PADRAO" }]
      };
    });
  };

  const isOtherConditionSelected = anamnesisData.condicoes.some(c => c.situacao === "Outro");

  function updateFormField(field: keyof AnamnesisData, value: AnamnesisData[typeof field]) {
    setAnamnesisData((previousValues) => ({ ...previousValues, [field]: value }));
  }

  function normalizeTags(tags: string[]) {
    const trimmedTags = tags
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    return Array.from(new Set(trimmedTags));
  }

  const MAX_DAILY_ROUTINE_CHARACTERS = 500;


  return (
    <>
      <div className={styles.editUserGrid}>
        {!isMobile &&
          <div className={styles.goBackContainer}>
            <h1>Editar Perfil</h1>
          </div>
        }

        <div className={styles.personalInfo} >
          <WhiteContainer title="Anamnese / Saúde" icon={<Shield size={22} />} titleFontSize={20} titleClassName={"font-bold! flex! items-center gap-3"} contentClassName={styles.personalInfoGrid} gap={20}>
            <div id="personalData">
              <div className={styles.personalDataTitle} id="personalDataTitle">
                <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                <h3>Dados pessoais</h3>
              </div>
              <InputWithIcon
                id="height"
                classNameInput="text-[#334155]! font-medium"
                type="text"
                placeholder="Ex: 175"
                icon={<Ruler />}
                disabled={false}
                label="Altura (cm)"
                isLoading={anamnesisInfo.isLoading}
                value={anamnesisInfo.data?.altura || ""}
                onInputChange={(value: string) => { setAnamnesisData({ ...anamnesisData, altura: Number(value) }) }}
              ></InputWithIcon>

              <InputWithIcon
                id="weight"
                classNameInput="text-[#334155]! font-medium"
                type="text"
                placeholder="Ex: 70"
                icon={<Weight />}
                label="Peso (kg)"
                isLoading={anamnesisInfo.isLoading}
                value={anamnesisInfo.data?.peso || ""}
                onInputChange={(value: string) => { setAnamnesisData({ ...anamnesisData, peso: Number(value) }) }}
              ></InputWithIcon>

              <Select
                id="mainObjective"
                defaultValue={anamnesisInfo.data?.objectivoPrincipal || ""}
                label="Objetivo principal"
                iconPlaceholder={<Flag size={18} />}
                selectPlaceholder="Selecione seu objetivo"
                values={[
                  { label: "Ganho de massa muscular", value: "Ganho de massa muscular" },
                  { label: "Perda de peso", value: "Perda de peso" },
                  { label: "Manutenção da massa muscular", value: "Manutenção da massa muscular" },
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
                      .filter(c => c.TipoCondicao === "OUTRO")
                      .map(c => c.situacao)
                    }
                    onTagsChange={(tags) => {
                      const normalizedTags = normalizeTags(tags);
                      setAnamnesisData(prev => {
                        // Remove all previous OUTRO conditions, then add the new ones
                        const withoutOutro = prev.condicoes.filter(c => c.TipoCondicao !== "OUTRO");
                        const outroDtos: CondicaoDto[] = normalizedTags.map(tag => ({
                          situacao: tag,
                          TipoCondicao: "OUTRO"
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
                maxLength={MAX_DAILY_ROUTINE_CHARACTERS}
                value={anamnesisData.rotina}
                icon={<FileText />}
                onInputChange={(value: string) => updateFormField("rotina", value)}
              />
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

      {/* {openModal === "timer" && (
        <TimerModal
          isMobile={isMobile}
          isDelete={true}
          closeThen={() => {
            setOpenModal(null);
            setConfirmingDelete(false);
          }}
          callSuccessModal={() => {
            if (confirmingDelete) {
              deleteUser();
            }
            setConfirmingDelete(false);
            setOpenModal(null);
          }}
          title={confirmingDelete ? "Apagar perfil?" : "Remover imagem?"}
          buttonTitle={confirmingDelete ? "Apagar" : "Remover"}
          content={
            confirmingDelete
              ? "Tem certeza que deseja apagar seu perfil? Isso é irreversível."
              : "Tem certeza que deseja remover sua imagem de perfil?"
          }
        />
      )} */}

      {openModal === "error" && (
        <ErrorModal
          closeThen={() => setOpenModal(null)}
          title={textModal.title}
          content={textModal.content}
        />
      )}
    </>
  );
}
