import { PackageCard } from "../../components/PackageCard/PackageCard";
import { packagesMock } from "./mocks/packagesMock";
import { packagesMockAdicional } from "./mocks/packagesMockAdicional";
import styles from "./Packages.module.css"
import SmallerButton from "../../components/SmallerButton";
import classnames from "classnames";
import { useContext, useEffect, useState } from "react";
import { TypeContext } from "../../App";
import useMobile from "../../hooks/isMobile";
import Input from "../../components/Inputs/Input/Input";
import Button from "../../components/Button/Button";
import { Plus } from "lucide-react";
import TimerModal from "../../components/Modal/TimerModal/TimerModal";
import AddPackagePlan from "../../components/AddPackagePlan/AddPackagePlan";
import SuccessModal from "../../components/Modal/SuccessModal/SuccessModal";

export function Packages() {
    const isMobile = useMobile();

    const type = useContext(TypeContext);


    const [openModalAddPackage, setOpenModalAddPackage] = useState(false);
    const [openModalAddAdditionalPackage, setOpenModalAddAdditionalPackage] = useState(false);
    const [openModalEditPackage, setOpenModalEditPackage] = useState(false);
    const [openModalDeletePackage, setOpenModalDeletePackage] = useState(false);
    const [openSuccessModal, setOpenSuccessModal] = useState(false);
    const [SuccessModalInfos, setSuccessModalInfos] = useState<{ title: string; content: string }>({ title: "", content: "" });

    useEffect(() => {
        if (openModalAddPackage || openModalAddAdditionalPackage) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [openModalAddPackage, openModalAddAdditionalPackage]);

    const isPersonal = type === "personal";

    const handleBuyClick = (packageTitle: string) => {
        alert(`Você clicou para comprar o pacote: ${packageTitle}`);
    };

    function handleAddPackage() {
        setOpenModalAddPackage(true);
    }

    function handleAddAdditionalPackage() {
        setOpenModalAddAdditionalPackage(true);
    }

    function handleSuccessModalInfos(title: string, content: string) {
        setOpenSuccessModal(true)
        setSuccessModalInfos({ title, content });
    }


    const valuesMock = {
        name: "Pacote Exemplo",
        price: "R$ 199,99",
        deadline: "30 dias",
        benefits: [
            "Benefício 1",
            "Benefício 2",
            "Benefício 3"
        ]
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
                            setHandleDelete={setOpenModalDeletePackage}
                            setHandleEdit={setOpenModalEditPackage}
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
                            <SmallerButton type="button" title="Adicionar Pacote Adicional" handleButtonClick={handleAddAdditionalPackage} />
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
                            setHandleEdit={setOpenModalEditPackage}
                            setHandleDelete={setOpenModalDeletePackage}
                            isPersonal={isPersonal}
                        />
                    ))}
                </div>
            </div>


            {openModalAddPackage && (
                <AddPackagePlan title="Adicionar Pacote" onClose={setOpenModalAddPackage} callSuccessModal={() => handleSuccessModalInfos("Adição concluída", "O pacote foi adicionado com sucesso")} />
            )}

            {
                openModalAddAdditionalPackage && (
                    <AddPackagePlan title="Adicionar Pacote Adicional" onClose={setOpenModalAddAdditionalPackage} callSuccessModal={() => handleSuccessModalInfos("Adição concluída", "O pacote adicional foi adicionado com sucesso")} />
                )
            }



            {openModalDeletePackage && (
                <>
                    <TimerModal
                        isMobile={isMobile}
                        title="Confirmar Exclusão"
                        content="Tem certeza de que deseja excluir este pacote?"
                        closeThen={setOpenModalDeletePackage}
                        isDelete={true}
                        callSuccessModal={() => handleSuccessModalInfos("Exclusão concluída", "O pacote foi excluído com sucesso")}
                    />
                </>
            )}

            {openModalEditPackage && (
                <>
                    <AddPackagePlan title="Editar Pacote" onClose={setOpenModalEditPackage} values={valuesMock} callSuccessModal={() => handleSuccessModalInfos("Edição concluída", "O pacote foi editado com sucesso")} />
                </>
            )}

            {openSuccessModal && (
                <SuccessModal title={SuccessModalInfos.title} content={SuccessModalInfos.content} isMobile={isMobile} closeThen={setOpenSuccessModal} />

            )}


        </>
    );
}
