
import { LogoWhiteBig } from "../../components/LogoWhiteBig/LogoWhiteBig";
import styles from "./anamnesis.module.css";
import useMobile from "../../hooks/isMobile";
import classNames from "classnames";
import InputWithIcon from "../../components/Inputs/InputWithIcon/InputWithIcon";
import { ArrowRight, BicepsFlexed, HeartPulse, House, Ruler, Weight } from "lucide-react";
import Select from "../../components/Select/Select";
import { Flag } from "lucide-react";
import { useState } from "react";
import SmallerButton from "../../components/SmallerButton/SmallerButton";
import { SelectableOption } from "../../components/SelectableOption/SelectableOption";


export default function Anamnesis() {
    const isMobile = useMobile();
    const [openSelectId, setOpenSelectId] = useState<string | null>(null);
    const [selectValue, setSelectValue] = useState<string | null>(null);
    const [hight, setHight] = useState<string>("");
    const [weight, setWeight] = useState<string>("");

    const [step] = useState<number>(2);

    return (
        <div className={classNames(styles.containerAnamnesis, {
            [styles.containerAnamnesisMobile]: isMobile
        })}>
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
                            <div className={styles.lineProgressFill} style={{ width: '33%' }} />
                        </div>
                    </div>
    
                <div className={classNames(styles.anamnesisTitle, {
                    [styles.anamnesisTitleMobile]: isMobile })}>
                    <h1 className={""} >Anamnese: Dados Pessoais</h1>
                    <p>Para iniciarmos sua jornada personalizada, precisamos de algumas informações básicas sobre sua condição física atual e seus objetivos.</p>
                </div>
                    <form onSubmit={() => console.log("calma")} className={styles.formAnamnesis}>

                        <div className={classNames(styles.inputGroup, {
                            [styles.inputGroupMobile]: isMobile
                        })}>
                            <InputWithIcon
                                    label={<>Altura (cm) <span className={styles.requiredAsterisk}>*</span></>}
                                    type="number"
                                    placeholder="Ex: 175"
                                    onInputChange={(value: string) => setHight(value)}
                                    icon={<Ruler />}
                                    value={hight}
                                />
                            <InputWithIcon
                                    label={<>Peso (kg) <span className={styles.requiredAsterisk}>*</span></>}
                                    type="number"
                                    allowDecimals={true}
                                    placeholder="Ex: 70"
                                    onInputChange={(value: string) => setWeight(value)}
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
                                    onSelectStatusChange={(value: string) => {setSelectValue(value);
                                    }}
                                    iconPlaceholder={<Flag />}
                                    triggerClassName="h-13! w-full!"
                                    triggerWrapperClassName="h-13! w-full!"
                                    selectWrapperClassName="h-13! w-full!"
                                    containerClassName="w-full flex-1 "
                                    showSelectAll={false}
                                    showSearchInput={false}
                                    values={[
                                        { icon: <BicepsFlexed />, label: "Presencial", value: "PRESENCIAL" },
                                        { icon: <House />, label: "Residencial", value: "RESIDENCIAL" },
                                        { icon: <HeartPulse />, label: "Funcional", value: "FUNCIONAL" },
                                        { icon: " ", label: "Outro",  value:"OUTRO"}
                                    ]}
                                />

                            {selectValue === "OUTRO" && <textarea className={styles.observacoesTextarea} name="observacoes" id="observacoes" placeholder="Adicione quaisquer observações relevantes..."></textarea>}
                        </div>
                        
                        <SmallerButton title="Proxímo passo" icon={<ArrowRight />} iconPosition="right" type="submit"></SmallerButton>
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
                        <div className={styles.lineProgressFill} style={{ width: '66%' }} />
                    </div>
                </div>
                
                 <div className={classNames(styles.anamnesisTitle, {
                    [styles.anamnesisTitleMobile]: isMobile })}>
                    <h1 className={""} >Histórico de Saúde</h1>
                    <p>Precisamos entender sua condição física atual e hábitos para personalizar seus
treinos com máxima segurança e eficiência.</p>
                </div>

                <div className={styles.conditionGroup}>
                    <SelectableOption value="Diabetes" selected={selectValue === "Diabetes"} onClick={(value) => setSelectValue(value)}>Diabetes</SelectableOption>
                    <SelectableOption value="Hipertensão" selected={selectValue === "Hipertensão"} onClick={(value) => setSelectValue(value)}>Hipertensão</SelectableOption>
                    <SelectableOption value="Dores Lombares" selected={selectValue === "Dores Lombares"} onClick={(value) => setSelectValue(value)}>Dores Lombares</SelectableOption>
                    <SelectableOption value="Asma/respiratório" selected={selectValue === "Asma/respiratório"} onClick={(value) => setSelectValue(value)}>Asma/respiratório</SelectableOption>
                    <SelectableOption value="Lesões Articulares" selected={selectValue === "Lesões Articulares"} onClick={(value) => setSelectValue(value)}>Lesões Articulares</SelectableOption>
                    <SelectableOption value="Outro" selected={selectValue === "Outro"} onClick={(value) => setSelectValue(value)}>Outro</SelectableOption>
                </div>

                <div className={styles.buttonsGroup}>
                    <SmallerButton title="Voltar" icon={<ArrowRight />} iconPosition="right" type="submit"></SmallerButton>
                    <SmallerButton title="Concluir" icon={<ArrowRight />} iconPosition="right" type="submit"></SmallerButton>
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
        </div>
    )
}