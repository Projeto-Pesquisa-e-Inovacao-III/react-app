import type React from "react";
import Button from "../Button/Button";
import styles from "./AddPackagePlan.module.css";
import Input from "../Inputs/Input/Input";
import { Plus, Trash } from "lucide-react";
import { useRef, useState } from "react";
import { newProductExhibition, updateProductExhibition } from "../../constants/products";
import type { ProductExhibition } from "../../models/products";
import Select from "../Inputs/Select/Select";
import Skeleton from "react-loading-skeleton";
import useClickOutside from "../../hooks/useClickOutside";

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

    const [packageInfo, setPackageInfo] = useState<{ name: string; type: string; price: string; deadline: string; benefits: string[]; quantity: number }>({
        name: values?.titulo || "",
        type: values?.tipoAula || "PRESENCIAL",
        price: values?.preco || "",
        deadline: values?.duracaoMes || "",
        benefits: values?.descricao ? JSON.parse(values?.descricao) : [""],
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

    return (
        <div className={styles.modalOverlay} >
            <div className={styles.modalContent} ref={packageCard}>
                <button onClick={handleAutoFill} className="border-2">Auto Preencher</button>
                <h1>{title}</h1>
                {/* Formulário para adicionar pacote */}
                <form className={styles.addPackageForm}>

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
                                <Skeleton  height={40} />
                            </div>
                            <div className={styles.modalButtons}>
                                <Skeleton width={120} height={40} style={{ marginRight: '10px' }} />
                                <Skeleton width={120} height={40} />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.inputContainer}>
                                <label htmlFor="packageName">Nome:</label>
                                <Input type="text" value={packageInfo.name} onInputChange={(value) => setPackageInfo({ ...packageInfo, name: value })} />
                            </div>
                            <div className={styles.inputContainer}>
                                <Select className={styles.selectType} options={["PRESENCIAL", "RESIDENCIAL", "FUNCIONAL"]} valuesName={["Presencial", "Residencial", "Funcional"]} label="Tipo de aula:" value={packageInfo.type} placeholder={"Selecione o tipo"} onInputChange={(value) => setPackageInfo({ ...packageInfo, type: value })} />
                            </div>
                            <div className={styles.inputContainer}>
                                <label htmlFor="packagePrice">Preço:</label>
                                <Input type="text" value={packageInfo.price} onInputChange={(value) => setPackageInfo({ ...packageInfo, price: value })} />
                            </div>
                            <div className={styles.inputContainer}>
                                <label htmlFor="packagePrice">Quantidade de aulas:</label>
                                <Input type="number" value={packageInfo.quantity} onInputChange={(value) => setPackageInfo({ ...packageInfo, quantity: value })} />
                            </div>
                            <div className={styles.inputContainer}>
                                <label htmlFor="packagePrice">Prazo:</label>
                                <Input type="number" value={packageInfo.deadline} onInputChange={(value) => setPackageInfo({ ...packageInfo, deadline: value })} />
                            </div>

                            {packageInfo.benefits.map((benefit, index) => (
                                <div className={styles.inputContainer}>
                                    <label htmlFor={`benefit-${index}`}>Benefício {index + 1}:</label>

                                    <Input key={index} type="text" value={benefit} onInputChange={(value) => handleBenefitChange(index, value)} icon={<Trash />} onClickIcon={() => {
                                        handleRemoveBenefit(index);
                                    }} />
                                </div>
                            ))}

                            <div className={styles.buttonContainer}>
                                <Button icon={<Plus />} type="button" title="Adicionar benefício" classNameVariable={styles.buttonAddBenefit} onClick={handleAddBenefit} />
                            </div>

                            <div className={styles.modalButtons}>
                                <Button loading={loading} type="button" title={isEdit ? "Editar" : "Adicionar"} classNameDiv={styles.buttonsAction} classNameVariable={styles.buttonAddBenefit} onClick={isEdit ? handleEditPackage : handleAddPackage} />
                                <Button type="button" title="Cancelar" classNameDiv={styles.buttonsAction} classNameVariable={styles.buttonAddBenefit} onClick={() => onClose(false)} />
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}