import { PackageCard } from "../../components/PackageCard/PackageCard";
import { packagesMock } from "./mocks/packagesMock";
import { packagesMockAdicional } from "./mocks/packagesMockAdicional";
import styles from "./Packages.module.css"
import SmallerButton from "../../components/SmallerButton";
import classnames from "classnames";
import { useContext, useEffect, useState } from "react";
import { TypeContext } from "../../App";
import useMobile from "../../hooks/isMobile";
import TimerModal from "../../components/Modal/TimerModal/TimerModal";
import AddPackagePlan from "../../components/AddPackagePlan/AddPackagePlan";
import SuccessModal from "../../components/Modal/SuccessModal/SuccessModal";
import type { ProductExhibition } from "../../models/products";
import { desactivateProductExhibition, getProductsExhibitions } from "../../constants/products";

export function Packages() {
    const isMobile = useMobile();

    const type = useContext(TypeContext);


    const [openModalAddPackage, setOpenModalAddPackage] = useState(false);
    const [openModalAddAdditionalPackage, setOpenModalAddAdditionalPackage] = useState(false);
    const [openModalEditPackage, setOpenModalEditPackage] = useState(false);
    const [openModalDeletePackage, setOpenModalDeletePackage] = useState(false);
    const [openSuccessModal, setOpenSuccessModal] = useState(false);
    const [SuccessModalInfos, setSuccessModalInfos] = useState<{ title: string; content: string }>({ title: "", content: "" });

    const [packageId, setPackageId] = useState<number | null>(null);

    useEffect(() => {
        if (openModalAddPackage || openModalAddAdditionalPackage || openModalEditPackage || openModalDeletePackage) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [openModalAddPackage, openModalAddAdditionalPackage, openModalEditPackage, openModalDeletePackage]);

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

    const [productsExhibitions, setProductsExhibitions] = useState<ProductExhibition[]>([]);

    async function handleGetProductsExhibitions() {
        const response = await getProductsExhibitions();
        setProductsExhibitions(response.data);
    }

    function handleSuccessModalInfos(title: string, content: string) {
        setOpenSuccessModal(true)
        setSuccessModalInfos({ title, content });
    }


    function handleDeletePackage(id: number) {

        if (!packageId) {
            setOpenModalDeletePackage(true);
            setPackageId(id)
            return;
        }

        desactivateProductExhibition(id).then((response) => {
            console.log("Pacote desativado com sucesso! ", response);
            handleSuccessModalInfos("Exclusão concluída", "O pacote foi excluído com sucesso");
            setOpenModalDeletePackage(false);
            setProductsExhibitions(prev => prev.filter(pkg => pkg.id !== id));
            setPackageId(null);
        }).catch((error) => {
            console.error("Erro ao desativar o pacote:", error);
        });

    }

    function handleUpdatePackage(id: number) {

        if (!packageId) {
            setPackageId(id)
            setOpenModalEditPackage(true);
            return;
        }

    }

    function handleCloseUpdateModal() {
        setOpenModalEditPackage(false);
        setPackageId(null);
    }

    function handleCloseDeleteModal() {
        setOpenModalDeletePackage(false);
        setPackageId(null);
    }

    function productsExhibitionsFindById(id: number) {
        return productsExhibitions.find(pkg => pkg.id === id);
    }

    useEffect(() => {
        handleGetProductsExhibitions();
    }, [productsExhibitions.length]);


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
                    {productsExhibitions.sort((a, b) => b.preco - a.preco).map((pacote, index) => (
                        pacote.status === "ATIVO" &&
                        <PackageCard
                            key={index}
                            {...pacote}
                            descricao={JSON.parse(pacote.descricao)}
                            onClick={() => handleBuyClick(pacote.titulo)}
                            isMobile={isMobile}
                            isPersonal={isPersonal}
                            setHandleDelete={() => handleDeletePackage(pacote.id!)}
                            setHandleEdit={() => handleUpdatePackage(pacote.id!)}
                        />
                    ))}
                    {/* dados mockados */}
                    {/* 
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
                     */}
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
                <AddPackagePlan title="Adicionar Pacote" onClose={setOpenModalAddPackage} packageCreated={setProductsExhibitions} callSuccessModal={() => handleSuccessModalInfos("Adição concluída", "O pacote foi adicionado com sucesso")} />
            )}

            {
                openModalAddAdditionalPackage && (
                    <AddPackagePlan title="Adicionar Pacote Adicional" onClose={setOpenModalAddAdditionalPackage} callSuccessModal={() => handleSuccessModalInfos("Adição concluída", "O pacote adicional foi adicionado com sucesso")} />
                )
            }



            {openModalDeletePackage && (
                <>
                    <div className="overlay"></div>
                    <TimerModal
                        isMobile={isMobile}
                        title="Confirmar Exclusão"
                        content="Tem certeza de que deseja excluir este pacote?"
                        closeThen={handleCloseDeleteModal}
                        isDelete={true}
                        buttonTitle="Excluir Pacote"
                        callSuccessModal={() => handleDeletePackage(packageId)}
                    />
                </>
            )}

            {openModalEditPackage && (
                <>
                    <AddPackagePlan title="Editar Pacote" onClose={handleCloseUpdateModal} packageCreated={setProductsExhibitions} values={productsExhibitionsFindById(packageId)} callSuccessModal={() => handleSuccessModalInfos("Edição concluída", "O pacote foi editado com sucesso")} isEdit={true} />
                </>
            )}

            {openSuccessModal && (

                <SuccessModal title={SuccessModalInfos.title} content={SuccessModalInfos.content} isMobile={isMobile} closeThen={setOpenSuccessModal} />

            )}


        </>
    );
}
