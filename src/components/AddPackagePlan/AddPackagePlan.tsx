import type React from "react";
import Button from "../Button/Button";
import styles from "./AddPackagePlan.module.css";
import Input from "../Inputs/Input/Input";
import { Plus } from "lucide-react";
import { useState } from "react";

type AddPackagePlanProps = {
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    title?: string;
    values?: {
        name: string;
        price: string;
        deadline: string;
        benefits: string[];
    }
    callSuccessModal: () => void;
};

export default function AddPackagePlan({ onClose, title, values, callSuccessModal }: AddPackagePlanProps) {
    const mockBenefits = values?.benefits || [""];

    const [benefits, setBenefits] = useState<string[]>(mockBenefits);
    function handleAddBenefit(benefit: string) {
        setBenefits([...benefits, benefit]);
    }

    function handleAddPackage() {
        onClose(false);
        callSuccessModal();
    }
    
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h1>{title}</h1>
                {/* Formulário para adicionar pacote */}
                <form className={styles.addPackageForm}>
                    <div className={styles.inputContainer}>
                        <label htmlFor="packageName">Nome:</label>
                        <Input type="text" value={values?.name} />
                    </div>
                    <div className={styles.inputContainer}>
                        <label htmlFor="packagePrice">Preço:</label>
                        <Input type="text" value={values?.price} />
                    </div>
                    <div className={styles.inputContainer}>
                        <label htmlFor="packagePrice">Prazo:</label>
                        <Input type="text" value={values?.deadline} />
                    </div>

                    {benefits.map((benefit, index) => (
                        <div className={styles.inputContainer}>
                            <label htmlFor={`benefit-${index}`}>Benefício {index + 1}:</label>
                            <Input key={index} type="text" value={benefit}/>
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