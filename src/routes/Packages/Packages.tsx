import { PackageCard } from "../../components/PackageCard/PackageCard";
import styles from "./Packages.module.css"
import SmallerButton from "../../components/SmallerButton/SmallerButton";
import classnames from "classnames";
import { useContext, useEffect, useState } from "react";
import { TypeContext } from "../../App";
import useMobile from "../../hooks/isMobile";
import TimerModal from "../../components/Modal/TimerModal/TimerModal";
import AddPackagePlan from "../../components/AddPackagePlan/AddPackagePlan";
import SuccessModal from "../../components/Modal/SuccessModal/SuccessModal";
import type { ProductExhibition } from "../../models/products";
import { buyProductExhibition, desactivateProductExhibition, getProductsExhibitions } from "../../constants/products";
import ErrorModal from "../../components/Modal/ErrorModal/ErrorModal";
import { useQuery } from "@tanstack/react-query";

type ModalType = "add" | "addAdditional" | "edit" | "editAdditional" | "delete" | "success" | "error" | null;

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

    function handleBuyClick(id: number) {
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
            handleErrorModalInfos("Erro na Compra", error.response?.data?.Exception || "Ocorreu um erro ao tentar comprar o pacote.");
        });
    };

    function handleCloseModal() {
        setOpenModal(null);
        setPackageId(null);
    }

    const [productsExhibitions, setProductsExhibitions] = useState<ProductExhibition[]>([]);
    const [productsExhibitionsAdicional, setProductsExhibitionsAdicional] = useState<ProductExhibition[]>([]);

    const { data: productsData, isLoading } = useQuery({
        queryKey: ['productsExhibitions'],
        queryFn: () => getProductsExhibitions(),
        select: (response) => {
            console.log("Produtos de Exibição obtidos com sucesso!", response);
            return {
                pacotes: response.data.filter((product: ProductExhibition) => product.tipoProduto === "PACOTE"),
                adicionais: response.data.filter((product: ProductExhibition) => product.tipoProduto === "ADICIONAL")
            };
        }
    });

    useEffect(() => {
        if (productsData) {
            setProductsExhibitions(productsData.pacotes);
            setProductsExhibitionsAdicional(productsData.adicionais);
        }
    }, [productsData]);


    function handleErrorModalInfos(title: string, content: string) {
        setSuccessModalInfos({ title, content });
        setOpenModal("error");
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

    function renderPackageCardSkeleton() {
        return (
            <>{[...Array(3)].map((_, index) => (
                <PackageCard
                    key={`skeleton-${index}`}
                    titulo=""
                    descricao={[]}
                    preco={0}
                    onClick={() => { }}
                    isMobile={isMobile}
                    isPersonal={isPersonal}
                    setHandleDelete={() => { }}
                    setHandleEdit={() => { }}
                    isLoading={true}
                />
            ))}</>
        )
    }


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
                    {isLoading ? (
                        renderPackageCardSkeleton()
                    ) : productsExhibitions.length > 0 ? (
                        productsExhibitions.sort((a, b) => b.preco - a.preco).map((pacote, index) => (
                            pacote.status === "ATIVO" &&
                            <PackageCard
                                key={pacote.id! + pacote.titulo + index}
                                {...pacote}
                                descricao={safeParseDescricao(pacote.descricao)}
                                onClick={() => handleBuyClick(pacote.id!)}
                                isMobile={isMobile}
                                isPersonal={isPersonal}
                                setHandleDelete={() => { setPackageId(pacote.id!); setOpenModal("delete"); }}
                                setHandleEdit={() => handleUpdatePackage(pacote.id!, false)}
                            />
                        ))
                    ) : (
                        <p>Não há pacotes disponíveis no momento.</p>
                    )}
                </div>
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
                {isLoading ? (
                    renderPackageCardSkeleton()
                ) : productsExhibitionsAdicional.length > 0 ? (
                    productsExhibitionsAdicional.sort((a, b) => b.preco - a.preco).map((pacote, index) => (
                        pacote.status === "ATIVO" &&
                        pacote.status === "ATIVO" && (
                            <PackageCard
                                key={`adicional-${index}-` + pacote.id! + pacote.titulo}
                                {...pacote}
                                descricao={safeParseDescricao(pacote.descricao)}
                                onClick={() => handleBuyClick(pacote.id!)}
                                isMobile={isMobile}
                                setHandleEdit={() => { handleUpdatePackage(pacote.id!, true) }}
                                setHandleDelete={() => { setPackageId(pacote.id!); setOpenModal("delete"); }}
                                isPersonal={isPersonal}
                            />
                        )
                    ))
                ) : (
                    <p>Não há pacotes adicionais disponíveis no momento.</p>
                )}
            </div>


            {openModal === "add" && (
                <AddPackagePlan title="Adicionar Pacote" typePackage="PACOTE" onClose={handleCloseModal} packageCreated={setProductsExhibitions} callSuccessModal={() => handleSuccessModalInfos("Adição concluída", "O pacote foi adicionado com sucesso")} idOnCreate={setPackageId} />
            )
            }

            {
                openModal === "addAdditional" && (
                    <AddPackagePlan title="Adicionar Pacote Adicional" typePackage="ADICIONAL" onClose={handleCloseModal} packageCreated={setProductsExhibitionsAdicional} callSuccessModal={() => handleSuccessModalInfos("Adição concluída", "O pacote adicional foi adicionado com sucesso")} />
                )
            }

            {
                openModal === "error" && (
                    <ErrorModal title={SuccessModalInfos.title} content={SuccessModalInfos.content} isMobile={isMobile} closeThen={handleCloseModal} />
                )
            }


            {
                openModal === "edit" && (
                    <AddPackagePlan title="Editar Pacote" onClose={(e) => {
                        setOpenModal(e ? "success" : null)
                        setPackageId(null)
                    }} packageCreated={setProductsExhibitions} typePackage="PACOTE" values={packageId && productsExhibitionsFindById(packageId)} callSuccessModal={() => handleSuccessModalInfos("Edição concluída", "O pacote foi editado com sucesso")} isEdit={true} />
                )
            }

            {
                openModal === "editAdditional" && (
                    <>
                        <AddPackagePlan title="Editar Adicional" onClose={(e) => {
                            setOpenModal(e ? "success" : null)
                            setPackageId(null)
                        }} packageCreated={setProductsExhibitionsAdicional} typePackage="ADICIONAL" values={packageId && productsExhibitionsFindById(packageId, true)} callSuccessModal={() => handleSuccessModalInfos("Edição concluída", "O pacote adicional foi editado com sucesso")} isEdit={true} />
                    </>
                )
            }



            {
                openModal === "delete" && (
                    <TimerModal
                        isMobile={isMobile}
                        title="Confirmar Exclusão"
                        content="Tem certeza de que deseja excluir este pacote?"
                        closeThen={handleCloseModal}
                        isDelete={true}
                        buttonTitle="Excluir Pacote"
                        callSuccessModal={() => packageId && handleDeletePackage(packageId)}
                    />
                )
            }

            {
                openModal === "success" && (
                    <SuccessModal title={SuccessModalInfos.title} content={SuccessModalInfos.content} isMobile={isMobile} closeThen={handleCloseModal} />
                )
            }


        </>
    );
}
