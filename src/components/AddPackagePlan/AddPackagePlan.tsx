import type React from "react";
import Button from "../Button/Button";
import styles from "./AddPackagePlan.module.css";
import Input from "../Inputs/Input/Input";
import { Banknote, Calendar, CalendarSync, HeartPulse, Home, Info, Plus, PlusCircle, Tag, Trash, Trash2, Users, X } from "lucide-react";
import { useRef, useState } from "react";
import { newProductExhibition, updateProductExhibition } from "../../constants/products";
import type { ProductExhibition } from "../../models/products";
import Skeleton from "react-loading-skeleton";
import useClickOutside from "../../hooks/useClickOutside";
import Select from "../Select/Select";
import InputWithIcon from "../Inputs/InputWithIcon/InputWithIcon";
import useMobile from "../../hooks/isMobile";
import { PackageCard } from "../PackageCard/PackageCard";

type AddPackagePlanProps = {
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    idOnCreate?: React.Dispatch<React.SetStateAction<number | null>>;
    title?: string;
    values?: {
        titulo: string;
        tipoAula: string;
        preco: string;
        duracaoMes: string;
        descricao: string[];
        quantidadeAula: number;
    };
    isEdit?: boolean;
    typePackage: "PACOTE" | "ADICIONAL";
    packageCreated?: React.Dispatch<React.SetStateAction<ProductExhibition[]>>;
    callSuccessModal: () => void;
};

export default function AddPackagePlan({ onClose, title, values, packageCreated, callSuccessModal, isEdit, typePackage, idOnCreate }: AddPackagePlanProps) {
    const isMobile = useMobile();
    const [packageInfo, setPackageInfo] = useState<{ name: string; type: string; price: string; deadline: string; benefits: string[]; quantity: number }>({
        name: values?.titulo || "",
        type: values?.tipoAula || "",
        price: values?.preco || "",
        deadline: values?.duracaoMes || "",
        benefits: values?.descricao ? JSON.parse(values?.descricao) : [],
        quantity: values?.quantidadeAula || 0
    });

    function handleAutoFill() {
        setPackageInfo({
            name: "Pacote Exemplo",
            type: "PRESENCIAL",
            price: "100",
            deadline: "12",
            benefits: ["Benefício 1", "Benefício 2", "Benefício 3", "Benefício 4"],
            quantity: 10
        });
    }

    function handleAddBenefit() {
        setPackageInfo(prev => ({ ...prev, benefits: [...prev.benefits, ""] }));
    }

    function handleBenefitChange(index: number, value: string) {
        const updated = [...packageInfo.benefits];
        updated[index] = value;
        setPackageInfo(prev => ({ ...prev, benefits: updated }));
    }


    function handleAddPackage() {
        setLoading(true)

        const data: ProductExhibition = {
            titulo: packageInfo.name,
            subtitulo: "",
            descricao: JSON.stringify(packageInfo.benefits),
            preco: packageInfo.price,
            periodo: packageInfo.deadline,
            tipoProduto: typePackage,
            status: "ATIVO",
            tipoAula: packageInfo.type,
            quantidadeAula: packageInfo.quantity,
            duracaoMes: parseInt(packageInfo.deadline || "12")
        }

        if (packageInfo.benefits.includes("")) {
            alert("Por favor, preencha todos os benefícios antes de adicionar o pacote.");
            return;
        }

        newProductExhibition(data).then((res) => {
            console.log("Pacote adicionado com sucesso!", res);
            if (packageCreated) {
                packageCreated(prev => [...prev, res.data]);
            }
            setLoading(false);
            callSuccessModal();
        }).catch((error) => {
            console.error("Erro ao adicionar pacote:", error);
            setLoading(false);
        });
    }

    function handleEditPackage() {
        setLoading(true)
        const data: ProductExhibition = {
            titulo: packageInfo.name,
            subtitulo: "",
            descricao: JSON.stringify(packageInfo.benefits),
            preco: packageInfo.price,
            periodo: packageInfo.deadline,
            tipoProduto: typePackage,
            status: "ATIVO",
            tipoAula: packageInfo.type,
            quantidadeAula: packageInfo.quantity,
            duracaoMes: parseInt(packageInfo.deadline || "12")
        }

        updateProductExhibition(values?.id, data).then((res) => {
            console.log("Pacote editado com sucesso!");
            console.log("Response:", res);
            callSuccessModal();

            if (packageCreated) {
                packageCreated(prev => prev.filter(pkg => pkg.id !== values.id));
                packageCreated(prev => [...prev, res.data]);
            }
            onClose(true);
            setLoading(false);

        }).catch((error) => {
            console.error("Erro ao editar pacote:", error);
            setLoading(false);
        });
    }

    function handleRemoveBenefit(index: number) {
        setPackageInfo(prev => ({
            ...prev,
            benefits: prev.benefits.filter((_, i) => i !== index)
        }));
    }

    const [loading, setLoading] = useState(false);


    const packageCard = useRef<HTMLDivElement>(null);

    useClickOutside({
        ref: packageCard,
        callback: () => onClose(false)
    });
    const [openSelectId, setOpenSelectId] = useState<string | null>(null);

    return (
        <div className={styles.modalOverlay} >
            <div className={styles.modalContent} ref={packageCard}>
                <button onClick={handleAutoFill} className="border-2 absolute! ">Auto Preencher</button>
                <div className={styles.formContainer}>
                    {/* Formulário para adicionar pacote */}
                    <form className={styles.addPackageForm}>
                        <div className="flex items-center justify-between mb-2! w-full ">
                            <h1 className="mb-0!">{title}</h1>
                            <X size={30} color="#909fb5" cursor={"pointer"} onClick={() => onClose(false)} />
                        </div>

                        {!packageInfo ? (
                            <>
                                <div className={styles.inputContainer}>
                                    <Skeleton width={150} height={35} />
                                    <Skeleton width={250} height={35} className="ml-3" />
                                </div>
                                <div className={styles.inputContainer}>
                                    <Skeleton width={150} height={35} />
                                    <Skeleton width={250} height={35} className="ml-3" />
                                </div>
                                <div className={styles.inputContainer}>

                                    <Skeleton width={150} height={35} />
                                    <Skeleton width={250} height={35} className="ml-3" />
                                </div>
                                <div className={styles.inputContainer}>

                                    <Skeleton width={150} height={35} />
                                    <Skeleton width={250} height={35} className="ml-3" />
                                </div>
                                <div className={styles.inputContainer}>

                                    <Skeleton width={150} height={35} />
                                    <Skeleton width={250} height={35} className="ml-3" />
                                </div>
                                {Array.from({ length: 2 }).map((_, index) => (
                                    <div key={index} className={styles.inputContainer}>
                                        <Skeleton width={50} height={35} />
                                        <Skeleton width={350} height={35} className="ml-3" />
                                    </div>
                                ))}
                                <div className={styles.buttonContainer}>
                                    <Skeleton height={40} />
                                </div>
                                <div className={styles.modalButtons}>
                                    <Skeleton width={120} height={40} style={{ marginRight: '10px' }} />
                                    <Skeleton width={120} height={40} />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={styles.inputContainer}>
                                    <InputWithIcon id="name" classNameInput="bg-gray-100! rounded-xl border-none!" label="Nome do Pacote" placeholder="" value={packageInfo.name} type={"text"} onInputChange={(name: string) => setPackageInfo({ ...packageInfo, name })} icon={<Tag color='#093A5D' />} />

                                </div>
                                <div className={`${styles.inputContainer} ${styles.inputContainerFirst}`}>
                                    <div className="flex gap-5 ">
                                        <Select
                                            id="select-type-class"
                                            label="Modalidade"
                                            onSelectStatusChange={(value) => setPackageInfo({ ...packageInfo, type: value })}
                                            defaultValue="PRESENCIAL"

                                            values={[
                                                { icon: <Users size={20} fill="#093A5D" color='#093A5D' />, label: "Presencial", value: "PRESENCIAL" },
                                                { icon: <Home size={20} color='#093A5D' />, label: "Residencial", value: "RESIDENCIAL" },
                                                { icon: <HeartPulse size={20} color='#093A5D' />, label: "Funcional", value: "FUNCIONAL" }
                                            ]}
                                            triggerClassName="h-10! w-full!"
                                            triggerWrapperClassName="h-10! w-full!"
                                            selectWrapperClassName="h-10! w-full!"
                                            containerClassName="w-full flex-1"
                                            setOpenSelectId={setOpenSelectId}
                                            openSelectId={openSelectId}
                                            showSelectAll={false}
                                        />

                                        <div className={styles.inputContainer}>
                                            <InputWithIcon id="price" classNameInput="bg-gray-100! rounded-xl border-none!" placeholder="" icon={<Banknote size={20} color='#093A5D' />} label="Preço (R$)" type="number" value={packageInfo.price} onInputChange={(value) => setPackageInfo({ ...packageInfo, price: value })} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-5 mb-2!">
                                    <div className={styles.inputContainer}>
                                        <InputWithIcon id="quantity" classNameInput="bg-gray-100! rounded-xl border-none!" icon={<CalendarSync size={50} color='#093A5D' />} label="Quantidade de aulas" type="number" value={packageInfo.quantity} onInputChange={(value) => setPackageInfo({ ...packageInfo, quantity: value })} />
                                    </div>
                                    <div className={styles.inputContainer}>
                                        <InputWithIcon id="deadline" classNameInput="bg-gray-100! rounded-xl border-none!" placeholder="" icon={<Calendar size={30} color='#093A5D' />} label="Validade (meses)" type="number" value={packageInfo.deadline} onInputChange={(value) => setPackageInfo({ ...packageInfo, deadline: value })} />
                                    </div>
                                </div>

                                <span className={styles.labelBenefits}>Benefícios inclusos</span>


                                {packageInfo.benefits.map((benefit, index) => (
                                    <div className={styles.inputContainerBenefit} key={index}>
                                        <Input id={`benefit-${index}`} classnameInput="px-3" classname="bg-gray-100 w-full rounded-xl" type="text" value={benefit} onInputChange={(value) => handleBenefitChange(index, value)} onClickIcon={() => {
                                            handleRemoveBenefit(index);
                                        }} />
                                        <Trash2 color="#ca0909" cursor={"pointer"} onClick={() => handleRemoveBenefit(index)} />
                                    </div>
                                ))}

                                <div className={styles.buttonContainer}>
                                    <button onClick={() => handleAddBenefit()} className="w-full py-3 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500  font-medium hover:bg-slate-50 transition-all flex items-center justify-center gap-2" type="button">
                                        <span className="material-symbols-rounded"><PlusCircle size={25} /></span>
                                        Adicionar novo benefício
                                    </button>
                                </div>


                            </>
                        )}
                    </form>
                    <div className={styles.modalButtons}>
                        <Button loading={loading} type="button" title={isEdit ? "Editar" : "Adicionar"} classNameDiv={`${styles.buttonsAction}`} classNameVariable={`${styles.buttonAddBenefit} ${styles.addButton}`} onClick={isEdit ? handleEditPackage : handleAddPackage} />
                        <Button type="button" title="Cancelar" classNameDiv={`${styles.buttonsAction} ${styles.addButtonAct}`} classNameVariable={`${styles.buttonAddBenefit} ${styles.cancelButton}`} onClick={() => onClose(false)} />
                    </div>
                </div>
                <div className={styles.packagePreview}>
                    <PackageCard
                        titulo={packageInfo.name || "Título do Pacote"}
                        preco={packageInfo.price || "0"}
                        duracaoMes={packageInfo.deadline || "X"}
                        quantidadeAula={packageInfo.quantity || "X"}
                        tipoAula={packageInfo.type || "PRESENCIAL"}
                        descricao={packageInfo.benefits || ["Benefício 1", "Benefício 2", "Benefício 3"]}
                        isMobile={isMobile}
                    />
                    <span className={styles.previewInfo}><Info size={20} /> Os alunos veram exatamente este visual</span>
                </div>
            </div>
        </div>
    );
}