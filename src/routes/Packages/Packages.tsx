import { PackageCard } from "../../components/PackageCard/PackageCard";
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
import { buyProductExhibition, desactivateProductExhibition, getProductsExhibitions } from "../../constants/products";

type ModalType = "add" | "addAdditional" | "edit" | "editAdditional" | "delete" | "success" | null;

export function Packages() {
    const isMobile = useMobile();

    const type = useContext(TypeContext);

    const [openModal, setOpenModal] = useState<ModalType | null>(null);


    const [SuccessModalInfos, setSuccessModalInfos] = useState<{ title: string; content: string }>({ title: "", content: "" });
    const [packageId, setPackageId] = useState<number | null>(null);

    useEffect(() => {
        if (openModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [openModal]);

    const isPersonal = type?.type === "personal";

    function handleBuyClick(id: number, packageTitle: string) {
        buyProductExhibition(id).then((response) => {
            const href: string = response.data.href
            window.location.href = href;
            // setSuccessModalInfos({
            //     title: "Compra Concluída",
            //     content: `Você adquiriu o pacote ${packageTitle} com sucesso!`,
            // });
            // TODO: return with data?
            // setOpenModal("success");
        }).catch((error) => {
            console.error("Erro ao comprar o pacote:", error);
        });
    };

    function handleCloseModal() {
        setOpenModal(null);
        setPackageId(null);
    }

    const [productsExhibitions, setProductsExhibitions] = useState<ProductExhibition[]>([]);
    const [productsExhibitionsAdicional, setProductsExhibitionsAdicional] = useState<ProductExhibition[]>([]);

    useEffect(() => {
        console.log("productsExhibitions state updated:", productsExhibitions);
    }, [productsExhibitions]);

    async function handleGetProductsExhibitions() {
        await getProductsExhibitions().then(
            (res) => {
                console.log("Produtos de Exibição obtidos com sucesso!", res);

                setProductsExhibitions(res.data.filter((product: ProductExhibition) => product.tipoProduto === "PACOTE"));
                setProductsExhibitionsAdicional(res.data.filter((product: ProductExhibition) => product.tipoProduto === "ADICIONAL"));

            }
        );
    }

    function handleSuccessModalInfos(title: string, content: string) {
        setSuccessModalInfos({ title, content });
        setOpenModal("success");
    }


    function handleDeletePackage(id: number) {
        desactivateProductExhibition(id).then((response) => {
            console.log("Pacote desativado com sucesso! ", response);
            setProductsExhibitions(prev => prev.filter(pkg => pkg.id !== id));
            setProductsExhibitionsAdicional(prev => prev.filter(pkg => pkg.id !== id));
            setPackageId(null);
            handleSuccessModalInfos("Exclusão concluída", "O pacote foi excluído com sucesso");
            setOpenModal("success");
        }).catch((error) => {
            console.error("Erro ao desativar o pacote:", error);

        });

    }

    function handleUpdatePackage(id: number, isAdicional: boolean = false) {
        console.log("Editing package with id:", id);
        if (!packageId) {
            setPackageId(id)
            setOpenModal(isAdicional ? "editAdditional" : "edit");
            return;
        }

    }

    function productsExhibitionsFindById(id: number, additional: boolean = false) {
        if (additional) {
            return productsExhibitionsAdicional.find(pkg => pkg.id === id);
        }
        return productsExhibitions.find(pkg => pkg.id === id);
    }

    //temp
    function safeParseDescricao(descricao: string) {
        try {
            return JSON.parse(descricao);
        } catch {
            return descricao;
        }
    }


    useEffect(() => {
        handleGetProductsExhibitions();
        console.log("Fetched products exhibitions", productsExhibitions);
    }, []);


    return (
        <>
            <div className={classnames(styles.packagesContainer, { [styles.packagesContainerBlock]: openModal === "add" })}>
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
                            <SmallerButton type="button" title="Adicionar Pacote" handleButtonClick={() => setOpenModal("add")} />
                        </div>
                    )}
                </div>

                <div className={isMobile ? styles.packagesListWrapperMobile : styles.packagesListWrapperDesktop}>
                    {productsExhibitions.length > 0 ? (productsExhibitions.sort((a, b) => b.preco - a.preco).map((pacote, index) => (
                        pacote.status === "ATIVO" &&
                        <PackageCard
                            key={pacote.id! + pacote.titulo + index}
                            {...pacote}
                            descricao={safeParseDescricao(pacote.descricao)}
                            onClick={() => handleBuyClick(pacote.id!, pacote.titulo)}
                            isMobile={isMobile}
                            isPersonal={isPersonal}
                            setHandleDelete={(e) => { setPackageId(pacote.id!); setOpenModal("delete"); }}
                            setHandleEdit={() => handleUpdatePackage(pacote.id!, false)}
                        />
                    ))) : (<p>Não há pacotes disponíveis no momento.</p>)}
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
                            <SmallerButton type="button" title="Adicionar Pacote Adicional" handleButtonClick={() => setOpenModal("addAdditional")} />
                        </div>
                    )}
                </div>

                <div className={classnames(styles.packagesListWrapperDesktop, { [styles.packagesListWrapperMobile]: isMobile })}>
                    {productsExhibitionsAdicional.length > 0 ? (productsExhibitionsAdicional.sort((a, b) => b.preco - a.preco).map((pacote, index) => (
                        pacote.status === "ATIVO" &&
                        pacote.status === "ATIVO" && (
                            <PackageCard
                                key={`adicional-${index}-` + pacote.id! + pacote.titulo}
                                {...pacote}
                                descricao={safeParseDescricao(pacote.descricao)}
                                onClick={() => handleBuyClick(pacote.id!, pacote.titulo)}
                                isMobile={isMobile}
                                setHandleEdit={(e) => { handleUpdatePackage(pacote.id!, true) }}
                                setHandleDelete={(e) => { setPackageId(pacote.id!); setOpenModal("delete"); }}
                                isPersonal={isPersonal}
                            />
                        )
                    ))) : (<p>Não há pacotes adicionais disponíveis no momento.</p>)}
                </div>
            </div>


            {openModal === "add" && (
                <AddPackagePlan title="Adicionar Pacote" typePackage="PACOTE" onClose={handleCloseModal} packageCreated={setProductsExhibitions} callSuccessModal={() => handleSuccessModalInfos("Adição concluída", "O pacote foi adicionado com sucesso")} idOnCreate={setPackageId} />
            )}

            {openModal === "addAdditional" && (
                <AddPackagePlan title="Adicionar Pacote Adicional" typePackage="ADICIONAL" onClose={handleCloseModal} packageCreated={setProductsExhibitionsAdicional} callSuccessModal={() => handleSuccessModalInfos("Adição concluída", "O pacote adicional foi adicionado com sucesso")} />
            )}


            {openModal === "edit" && (
                <>
                    <AddPackagePlan title="Editar Pacote" onClose={(e) => {
                        setOpenModal(e ? "success" : null)
                        setPackageId(null)
                    }} packageCreated={setProductsExhibitions} typePackage="PACOTE" values={productsExhibitionsFindById(packageId)} callSuccessModal={() => handleSuccessModalInfos("Edição concluída", "O pacote foi editado com sucesso")} isEdit={true} />
                </>
            )}

            {openModal === "editAdditional" && (
                <>
                    <AddPackagePlan title="Editar Adicional" onClose={(e) => {
                        setOpenModal(e ? "success" : null)
                        setPackageId(null)
                    }} packageCreated={setProductsExhibitionsAdicional} typePackage="ADICIONAL" values={productsExhibitionsFindById(packageId, true)} callSuccessModal={() => handleSuccessModalInfos("Edição concluída", "O pacote adicional foi editado com sucesso")} isEdit={true} />
                </>
            )}



            {openModal === "delete" && (
                <TimerModal
                    isMobile={isMobile}
                    title="Confirmar Exclusão"
                    content="Tem certeza de que deseja excluir este pacote?"
                    closeThen={handleCloseModal}
                    isDelete={true}
                    buttonTitle="Excluir Pacote"
                    callSuccessModal={() => handleDeletePackage(packageId)}
                />
            )}

            {openModal === "success" && (
                <SuccessModal title={SuccessModalInfos.title} content={SuccessModalInfos.content} isMobile={isMobile} closeThen={handleCloseModal} />
            )}


        </>
    );
}
