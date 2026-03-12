
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


export default function Anamnesis() {
    const isMobile = useMobile();
    const [openSelectId, setOpenSelectId] = useState<string | null>(null);
    const [selectValue, setSelectValue] = useState<string | null>(null);
    const [hight, setHight] = useState<string>("");
    const [weight, setWeight] = useState<string>("");


    return (
        <>
            {!isMobile &&
                <div className={styles.containerAnamnesis}>
                    <div className={classNames(styles.wrapperRegisterElements, {
                    [styles.wrapperRegisterElementsMobile]: isMobile
                })}>
                    <div className={styles.anamnesisElements}>

                        <div className={styles.lineProgress}>
                            <div className={styles.lineProgressHeader}>
                                <span className={styles.lineProgressStep}>PASSO 1 DE 2</span>
                                <span className={styles.lineProgressPercent}>33% concluído</span>
                            </div>
                            <div className={styles.lineProgressTrack}>
                                <div className={styles.lineProgressFill} style={{ width: '33%' }} />
                            </div>
                        </div>

                        <div className={styles.anamnesisTitle}>
                            <h1 className={""} >Anamnese: Dados Pessoais</h1>
                            <p>Para iniciarmos sua jornada personalizada, precisamos de algumas informações básicas sobre sua condição física atual e seus objetivos.</p>
                        </div>
                            <form onSubmit={() => console.log("calma")} className={styles.formAnamnesis}>

                                <div className={styles.inputGroup}>
                                    <InputWithIcon
                                            label="Altura (cm)"
                                            type="number"
                                            placeholder="Ex: 175"
                                            onInputChange={(value: string) => setHight(value)}
                                            icon={<Ruler />}
                                            value={hight}
                                        />
                                    <InputWithIcon
                                            label="Peso (kg)"
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
                                            label="Objetivo Principal"
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
                        

                    </div>
                    </div>
                    <div className={styles.sectionLogoLogin}>
                         <LogoWhiteBig />
                    </div>
                </div> 
            }
         </>
         
    )
}