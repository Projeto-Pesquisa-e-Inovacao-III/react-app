import { useMediaQuery } from "@mui/material";
import { PackageCard } from "../../components/PackageCard/PackageCard";
import { packagesMock } from "./mocks/packagesMock";
import { packagesMockAdicional } from "./mocks/packagesMockAdicional";
import styles from "./Packages.module.css"
import SmallerButton from "../../components/SmallerButton";
import classnames from "classnames";
import { useContext, useState } from "react";
import { TypeContext } from "../../App";
import useMobile from "../../hooks/isMobile";
import InputWithIcon from "../../components/Inputs/InputWithIcon/InputWithIcon";
import Input from "../../components/Inputs/Input/Input";
import Button from "../../components/Button/Button";

export function Packages() {
    const isMobile = useMobile();

    const type = useContext(TypeContext);


    const [openModalAddPackage, setOpenModalAddPackage] = useState(false);

    const isPersonal = type === "personal";

    const handleBuyClick = (packageTitle: string) => {
        alert(`Você clicou para comprar o pacote: ${packageTitle}`);
    };

    function handleAddPackage() {
        setOpenModalAddPackage(true);
    }

    const [benefits, setBenefits] = useState<string[]>([]);
    function handleAddBenefit(benefit: string) {
        setBenefits([...benefits, benefit]);
    }

    return (
        <>
            <div className={classnames(styles.packagesContainer, { [styles.packagesContainerBlock]: openModalAddPackage })}>
                <div
                    className={classnames(
                        styles.packagesTitleContainer,
                        { [styles.packagesTitleContainerMobile]: isMobile }
                    )}
                >
                    <h1>
                        {isPersonal ? "Pacotes Atuais" : "Pacotes de Consultoria"}
                    </h1>
                    {isPersonal && (
                        <div className={classnames(styles.addButtonContainer, { [styles.addButtonContainerMobile]: isMobile })}>
                            <SmallerButton type="button" title="Adicionar Pacote" handleButtonClick={handleAddPackage} />
                        </div>
                    )}
                </div>

                <div className={isMobile ? styles.packagesListWrapperMobile : styles.packagesListWrapperDesktop}>
                    {packagesMock.map((pacote, index) => (
                        <PackageCard
                            key={index}
                            {...pacote}
                            onClick={() => handleBuyClick(pacote.title)}
                            isMobile={isMobile}
                            isPersonal={isPersonal}
                        />
                    ))}
                </div>

                <div
                    className={classnames(
                        styles.packagesTitleContainer,
                        styles.additionalTitle,
                        { [styles.packagesTitleContainerMobile]: isMobile }
                    )}
                >
                    <h1>Pacotes Adicionais</h1>
                    {isPersonal && (
                        <div className={classnames(styles.addButtonContainer, { [styles.addButtonContainerMobile]: isMobile })}>
                            <SmallerButton type="button" title="Adicionar Pacote Adicional" />
                        </div>
                    )}
                </div>

                <div className={classnames(styles.packagesListWrapperDesktop, { [styles.packagesListWrapperMobile]: isMobile })}>
                    {packagesMockAdicional.map((pacote, index) => (
                        <PackageCard
                            key={`adicional-${index}`}
                            {...pacote}
                            onClick={() => handleBuyClick(pacote.title)}
                            isMobile={isMobile}
                            variant="adicional"
                            isPersonal={isPersonal}
                        />
                    ))}
                </div>
            </div>
            {openModalAddPackage && (
                <>
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <h1>Adicionar Pacote</h1>
                            {/* Formulário para adicionar pacote */}
                            <form className={styles.addPackageForm}>
                                <div className={styles.inputContainer}>
                                    <label htmlFor="packageName">Nome do Pacote:</label>
                                    <Input type="text" />
                                </div>
                                <div className={styles.inputContainer}>
                                    <label htmlFor="packagePrice">Preço:</label>
                                    <Input type="text" />
                                </div>
                                <div>
                                    <Button type="button" title="Adicionar benefício" classNameVariable={styles.buttonAddBenefit} onClick={() => handleAddBenefit("Novo Benefício")} />
                                </div>

                                <button type="submit">Adicionar</button>
                                <button type="button" onClick={() => setOpenModalAddPackage(false)}>Cancelar</button>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
