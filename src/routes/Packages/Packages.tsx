import { useMediaQuery } from "@mui/material";
import { PackageCard } from "../../components/PackageCard/PackageCard";
import { packagesMock } from "./mocks/packagesMock";
import { packagesMockAdicional } from "./mocks/packagesMockAdicional";
import styles from "./Packages.module.css"
import SmallerButton from "../../components/SmallerButton";
import classnames from "classnames";

type PackagesProps = {
    type: "personal" | "student";
};

export function Packages({ type }: PackagesProps) {
    const isMobile = useMediaQuery("(max-width:1024px)");

    const isPersonal = type === "personal";

    const handleBuyClick = (packageTitle: string) => {
        alert(`Você clicou para comprar o pacote: ${packageTitle}`);
    };

    return (
        <>
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
                        <SmallerButton type="button" title="Adicionar Pacote" />
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

            <div className={isMobile ? styles.packagesListWrapperMobile : styles.packagesListWrapperDesktop}>
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
        </>
    );
}
