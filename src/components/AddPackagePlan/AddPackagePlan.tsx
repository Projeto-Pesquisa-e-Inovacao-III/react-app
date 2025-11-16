import type React from "react";
import Button from "../Button/Button";
import styles from "./AddPackagePlan.module.css";
import Input from "../Inputs/Input/Input";
import { Plus } from "lucide-react";
import { useState } from "react";
import { newProductExhibition } from "../../constants/products";
import type { ProductExhibition } from "../../models/products";

type AddPackagePlanProps = {
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    title?: string;
    values?: {
        name: string;
        price: string;
        deadline: string;
        benefits: string[];
        quantity: number;
    };
    packageCreated?: React.Dispatch<React.SetStateAction<ProductExhibition[]>>;
    callSuccessModal: () => void;
};

export default function AddPackagePlan({ onClose, title, values, packageCreated, callSuccessModal }: AddPackagePlanProps) {

    const [name, setName] = useState<string>(values?.name || "");
    const [price, setPrice] = useState<string>(values?.price || "");
    const [deadline, setDeadline] = useState<string>(values?.deadline || "");
    const [quantity, setQuantity] = useState<number>(values?.quantity || 12);
    const [benefits, setBenefits] = useState<string[]>([""]);

    function handleAddBenefit() {
        setBenefits([...benefits, ""]);
    }

    function handleBenefitChange(index: number, value: string) {
        const updated = [...benefits];
        updated[index] = value;
        setBenefits(updated);
    }


    function handleAddPackage() {
        const data: ProductExhibition = {
            titulo: name,
            subtitulo: "",
            descricao: JSON.stringify(benefits),
            preco: price,
            periodo: deadline,
            status: "ATIVO",
            tipoAula: "ONLINE",
            quantidadeAula: quantity,
            duracaoMes: parseInt(deadline || "12")
        }

        newProductExhibition(data).then(() => {
            console.log("Pacote adicionado com sucesso!");
            callSuccessModal();
            if (packageCreated) {
                packageCreated(prev => [...prev, data]);
            }
            onClose(false);
        }).catch((error) => {
            console.error("Erro ao adicionar pacote:", error);
        });
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h1>{title}</h1>
                {/* Formulário para adicionar pacote */}
                <form className={styles.addPackageForm}>
                    <div className={styles.inputContainer}>
                        <label htmlFor="packageName">Nome:</label>
                        <Input type="text" onInputChange={setName} />
                    </div>
                    <div className={styles.inputContainer}>
                        <label htmlFor="packagePrice">Preço:</label>
                        <Input type="text" onInputChange={setPrice} />
                    </div>
                    <div className={styles.inputContainer}>
                        <label htmlFor="packagePrice">Quantidade de aulas:</label>
                        <Input type="number" onInputChange={setQuantity} />
                    </div>
                    <div className={styles.inputContainer}>
                        <label htmlFor="packagePrice">Prazo:</label>
                        <Input type="number" onInputChange={setDeadline} />
                    </div>

                    {benefits.map((benefit, index) => (
                        <div className={styles.inputContainer}>
                            <label htmlFor={`benefit-${index}`}>Benefício {index + 1}:</label>
                            <Input key={index} type="text" onInputChange={(value) => handleBenefitChange(index, value)} />
                        </div>
                    ))}

                    <div>
                        <Button icon={<Plus />} type="button" title="Adicionar benefício" classNameVariable={styles.buttonAddBenefit} onClick={() => handleAddBenefit("")} />
                    </div>

                    <div className={styles.modalButtons}>
                        <Button type="button" title="Adicionar" classNameVariable={styles.buttonAddBenefit} onClick={handleAddPackage} />
                        <Button type="button" title="Cancelar" classNameVariable={styles.buttonAddBenefit} onClick={() => onClose(false)} />
                    </div>
                </form>
            </div>
        </div>
    );
}