import { PackageCard } from "../../components/PackageCard/PackageCard";
import styles from "./Packages.module.css"
import SmallerButton from "../../components/SmallerButton/SmallerButton";
import classnames from "classnames";
import { useCallback, useContext, useEffect, useState } from "react";
import { TypeContext } from "../../App";
import useMobile from "../../hooks/isMobile";
import TimerModal from "../../components/Modal/TimerModal/TimerModal";
import AddPackagePlan from "../../components/Modal/AddPackagePlan/AddPackagePlan";
import SuccessModal from "../../components/Modal/SuccessModal/SuccessModal";
import PagBankModal from "../../components/Modal/PagBankModal/PagBankModal";
import type { ProductExhibition } from "../../models/products";
import { buyProductExhibition, desactivateProductExhibition, getProductsExhibitions, verifyNumberOfPackages } from "../../constants/products";
import ErrorModal from "../../components/Modal/ErrorModal/ErrorModal";
import { useQuery } from "@tanstack/react-query";
import { CircleX, LucideCircleX, LucidePlusCircle, Package, Plus } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

type ModalType = "add" | "addAdditional" | "edit" | "editAdditional" | "delete" | "success" | "error" | "loadingPagBank" | null;

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
        setOpenModal("loadingPagBank");
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
            // handleErrorModalInfos("Erro na Compra", error.response?.data?.Exception || "Ocorreu um erro ao tentar comprar o pacote.");
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



    const numberOfPackages = useQuery({
        queryKey: ['verifyNumberOfPackages'],
        queryFn: () => verifyNumberOfPackages(),
        select: (response) => {
            return response.data;
        },
        enabled: isPersonal
    });

    const [verifyNumberOfPackagesFront, setVerifyNumberOfPackagesFront] = useState(false);
    const [verifyNumberOfAdditional, setVerifyNumberOfAdditional] = useState(false);
    useEffect(() => {
        if (numberOfPackages.data) {
            const pacotesData = numberOfPackages.data.find((item: any) => item.tipoProduto === "PACOTE");
            const adicionaisData = numberOfPackages.data.find((item: any) => item.tipoProduto === "ADICIONAL");

            const pacotesAtivos = productsExhibitions.filter(p => p.status === "ATIVO").length;
            const adicionaisAtivos = productsExhibitionsAdicional.filter(p => p.status === "ATIVO").length;

            if (pacotesData && adicionaisData) {
                setVerifyNumberOfPackagesFront(
                    pacotesAtivos >= pacotesData.limit
                );
                setVerifyNumberOfAdditional(
                    adicionaisAtivos >= adicionaisData.limit
                );
            }
        }
    }, [numberOfPackages.data, productsExhibitions, productsExhibitionsAdicional]);

    // const verifyNumberOfPackagesFront = (productsExhibitions.filter(p => p.status === "ATIVO").length + productsExhibitionsAdicional.filter(p => p.status === "ATIVO").length) === numberOfPackages.data?.limit;


    // [{"tipoProduto":"PACOTE","limit":6,"size":1},{"tipoProduto":"ADICIONAL","limit":6,"size":0}]
    async function handleClickAddPackage(type: "add" | "addAdditional") {

        const { data } = await numberOfPackages.refetch();
        const classType = type === "add" ? "PACOTE" : "ADICIONAL";

        const dataForType = data.find((item: any) => item.tipoProduto === classType);

        if (dataForType.limit === dataForType.size) {
            handleErrorModalInfos("Limite de Pacotes", "Você já atingiu o limite máximo de pacotes ativos.");
            return;
        }

        setOpenModal(type);
    }

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

    const activePackages = productsExhibitions
        .filter(p => p.status === "ATIVO")
        .sort((a, b) => Number(b.preco) - Number(a.preco))

    const activeAdicionais = productsExhibitionsAdicional
        .filter(p => p.status === "ATIVO")
        .sort((a, b) => Number(b.preco) - Number(a.preco))


    const shouldUseCarousel = activePackages.length >= 4

    const shouldUseCarouselAdicional = activeAdicionais.length >= 4

    const [emblaRef, emblaApi] = useEmblaCarousel(
        { align: "start", loop: true, skipSnaps: false },
        []
    )

    const scrollPrev = useCallback(() => {
        emblaApi?.scrollPrev()
    }, [emblaApi])

    const scrollNext = useCallback(() => {
        emblaApi?.scrollNext()
    }, [emblaApi])

    const [emblaRefPackage, emblaApiPackage] = useEmblaCarousel(
        { align: "start", loop: true, skipSnaps: false },
        []
    )

    const scrollPrevPackage = useCallback(() => {
        emblaApiPackage?.scrollPrev()
    }, [emblaApiPackage])

    const scrollNextPackage = useCallback(() => {
        emblaApiPackage?.scrollNext()
    }, [emblaApiPackage])

const slidesToRender = activePackages.length > 0
  ? [...activePackages, ...activePackages, ...activePackages]
  : activePackages;

    const slidesToRenderAdicional = productsExhibitionsAdicional

    return (
        <>
            <div className={classnames(styles.packagesContainer, { [styles.packagesContainerBlock]: openModal === "add" })}>
                <div
                    className={classnames(
                        styles.packagesTitleContainer,
                        { [styles.packagesTitleContainerMobile]: isMobile }
                    )}
                >
                    <div>
                        {isPersonal ? (
                            <>
                                <h1>
                                    Pacotes Atuais
                                </h1>
                                <div className="bg-white! p-2 px-4 w-fit flex items-center rounded-2xl">
                                    <span className="text-2xl font-bold">{activePackages.length}</span><span className="ml-3 text-slate-500 font-bold uppercase">pacotes ativos</span>
                                </div>
                            </>
                        ) : (
                            <h1>
                                Pacotes de Consultoria
                            </h1>
                        )
                        }
                    </div>
                    {isPersonal && (
                        <div className={classnames(styles.addButtonContainer, { [styles.addButtonContainerMobile]: isMobile })}>
                            {verifyNumberOfPackagesFront ?
                                <SmallerButton icon={<LucideCircleX />} classname="bg-red-200! border! border-red-800! cursor-not-allowed! text-red-900!" type="button" title="Limite de pacotes atingido" handleButtonClick={() => handleClickAddPackage("add")} />
                                :
                                (
                                    <SmallerButton icon={<LucidePlusCircle />} type="button" title="Adicionar Pacote" handleButtonClick={() => handleClickAddPackage("add")} />
                                )}
                        </div>
                    )}
                </div>


                <div style={!shouldUseCarousel ? { gridTemplateColumns: `repeat(${activePackages.length + (isPersonal ? 1 : 0)}, 1fr)` } : {}} className={classnames(styles.packagesListWrapperDesktop,
                    { [styles.packagesListWrapperDesktopEmpty]: productsExhibitions.length === 0 || (productsExhibitions.length > 0 && !productsExhibitions.some(p => p.status === "ATIVO")) },
                    { [styles.packagesListWrapperMobile]: isMobile })}>
                    {isLoading ? (
                        renderPackageCardSkeleton()
                    ) : activePackages.length > 0 ? (
                        shouldUseCarousel ? (
                            <>
                                <div className={styles.emblaWrapper}>
                                    <button className={styles.emblaButtonPrev} onClick={scrollPrevPackage}>‹</button>
                                    <div className={styles.embla}>
                                        <div className={styles.emblaViewport} ref={emblaRefPackage}>
                                            <div className={styles.emblaContainer}>
                                                {slidesToRender.map((pacote, index) => (
                                                    <div className={classnames(styles.emblaSlide, { [styles.emblaSlideUser]: !isPersonal })} key={`slide-${index}-${pacote.id}`}>
                                                        <PackageCard
                                                            {...pacote}
                                                            descricao={pacote.beneficios?.map(b => b.valor) || []}
                                                            onClick={() => handleBuyClick(pacote.id!)}
                                                            isMobile={isMobile}
                                                            isPersonal={isPersonal}
                                                            setHandleDelete={() => { setPackageId(pacote.id!); setOpenModal("delete"); }}
                                                            setHandleEdit={() => handleUpdatePackage(pacote.id!, false)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <button className={styles.emblaButtonNext} onClick={scrollNextPackage}>›</button>
                                    {isPersonal && !isMobile && (
                                        <div
                                            style={!shouldUseCarousel ? { maxWidth: "inherit" } : {}}
                                            className={classnames(styles.addCard, { [styles.addCardLimit]: verifyNumberOfPackagesFront })}
                                            onClick={() => handleClickAddPackage("add")}>

                                            <div className={classnames(styles.addIconWrapper, { [styles.addIconWrapperLimit]: verifyNumberOfPackagesFront })}>
                                                {verifyNumberOfPackagesFront ? <CircleX size={24} color="#943032" /> : <Plus size={24} color="#a2afc1" />}
                                            </div>
                                            {!verifyNumberOfPackagesFront ? <h4 className={styles.addTitle}>Criar Novo Pacote</h4> : <h4 className={styles.addTitle}>Limite de pacotes atingido</h4>}
                                            {!verifyNumberOfPackagesFront ? <p className={styles.addText}>Adicione novas modalidades ou planos de fidelidade.</p> : <p className={styles.addText}>Você atingiu o limite máximo de pacotes.</p>}
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                {activePackages.map((pacote, index) => (
                                    <PackageCard
                                        key={pacote.id! + pacote.titulo + index}
                                        {...pacote}
                                        descricao={pacote.beneficios?.map(b => b.valor) || []}
                                        onClick={() => handleBuyClick(pacote.id!)}
                                        isMobile={isMobile}
                                        isPersonal={isPersonal}
                                        setHandleDelete={() => { setPackageId(pacote.id!); setOpenModal("delete"); }}
                                        setHandleEdit={() => handleUpdatePackage(pacote.id!, false)}
                                    />
                                ))}
                                {isPersonal && !isMobile && (
                                    <div
                                        style={!shouldUseCarousel ? { maxWidth: "inherit" } : {}}
                                        className={classnames(styles.addCard, { [styles.addCardLimit]: verifyNumberOfPackagesFront })}
                                        onClick={() => handleClickAddPackage("add")}>

                                        <div className={classnames(styles.addIconWrapper, { [styles.addIconWrapperLimit]: verifyNumberOfPackagesFront })}>
                                            {verifyNumberOfPackagesFront ? <CircleX size={24} color="#943032" /> : <Plus size={24} color="#a2afc1" />}
                                        </div>
                                        {!verifyNumberOfPackagesFront ? <h4 className={styles.addTitle}>Criar Novo Pacote</h4> : <h4 className={styles.addTitle}>Limite de pacotes atingido</h4>}
                                        {!verifyNumberOfPackagesFront ? <p className={styles.addText}>Adicione novas modalidades ou planos de fidelidade.</p> : <p className={styles.addText}>Você atingiu o limite máximo de pacotes.</p>}
                                    </div>
                                )}
                            </>
                        )
                    ) : (
                        <div className={styles.emptyPackageContainer}>
                            <div className={styles.emptyPackageIconWrapper}>
                                <Package color="#0a3a5c" size={40} />
                            </div>

                            <h3 className={styles.emptyPackageTitle}>
                                Sem pacotes
                            </h3>

                            <p className={styles.emptyPackageText}>
                                {type?.type === "personal" ? "Você ainda não cadastrou pacotes." : "Não há pacotes disponíveis no momento."}
                            </p>
                        </div>
                    )}
                </div>
            </div >
            {isPersonal && isMobile && (
                <div className={classnames(styles.addCard, { [styles.addCardMobile]: isMobile }, { [styles.addCardLimit]: verifyNumberOfPackagesFront })} onClick={() => handleClickAddPackage("add")}>
                    <div className={classnames(styles.addIconWrapper, { [styles.addIconWrapperLimit]: verifyNumberOfPackagesFront })}>
                        {verifyNumberOfPackagesFront ? <CircleX size={24} color="#943032" /> : <Plus size={24} color="#a2afc1" />}
                    </div>

                    {!verifyNumberOfPackagesFront ? <h4 className={styles.addTitle}>Criar Novo Pacote</h4> : <h4 className={styles.addTitle}>Limite de pacotes atingido</h4>}
                    {!verifyNumberOfPackagesFront ? <p className={styles.addText}>Adicione novas modalidades ou planos de fidelidade.</p> : <p className={styles.addText}>Você atingiu o limite máximo de pacotes.</p>}
                </div>
            )}
            <div
                className={classnames(
                    styles.packagesTitleContainer,
                    styles.additionalTitle,
                    { [styles.packagesTitleContainerMobile]: isMobile }
                )}
            >
                <div>
                    {isPersonal ? (
                        <>
                            <h1>
                                Pacotes Adicionais
                            </h1>

                            <div className="bg-white! p-2 px-4 w-fit flex items-center rounded-2xl">
                                <span className="text-2xl font-bold">{activeAdicionais.length}</span><span className="ml-3 text-slate-500 font-bold uppercase">{activeAdicionais.length > 1 ? "adicionais ativos" : "adicional ativo"}</span>
                            </div>
                        </>
                    ) : (
                        <h1>
                            Pacotes Adicionais
                        </h1>
                    )
                    }
                </div>
                {isPersonal && (
                    <div className={classnames(styles.addButtonContainer, { [styles.addButtonContainerMobile]: isMobile })}>
                        {verifyNumberOfAdditional ?
                            <SmallerButton icon={<LucideCircleX />} classname="bg-red-200! border! border-red-800! cursor-not-allowed! text-red-900!" type="button" title="Limite de pacotes atingido" handleButtonClick={() => handleClickAddPackage("add")} />
                            :
                            (
                                <SmallerButton icon={<LucidePlusCircle />} type="button" title="Adicionar Pacote Adicional" handleButtonClick={() => handleClickAddPackage("addAdditional")} />
                            )}
                    </div>
                )}
            </div>

            <div style={!shouldUseCarouselAdicional ? { gridTemplateColumns: `repeat(${activeAdicionais.length + (isPersonal ? 1 : 0)}, 1fr)` } : {}} className={classnames(
                styles.packagesListWrapperDesktop,
                { [styles.packagesListWrapperDesktopEmpty]: productsExhibitionsAdicional.length === 0 || (productsExhibitionsAdicional.length > 0 && !productsExhibitionsAdicional.some(p => p.status === "ATIVO")) },
                { [styles.packagesListWrapperMobile]: isMobile })}>
                {isLoading ? (
                    renderPackageCardSkeleton()
                ) : productsExhibitionsAdicional.length > 0 && productsExhibitionsAdicional.some(p => p.status === "ATIVO") ? (
                    <>
                        {shouldUseCarouselAdicional ? (
                            <div className={styles.emblaWrapper}>
                                <button className={styles.emblaButtonPrev} onClick={scrollPrev}>‹</button>
                                <div className={styles.embla}>
                                    <div className={styles.emblaViewport} ref={emblaRef}>
                                        <div className={styles.emblaContainer}>
                                            {slidesToRenderAdicional.map((pacote, index) => (
                                                <div key={`slide-${index}-${pacote.id}`} className={classnames(styles.emblaSlide, { [styles.emblaSlideUser]: !isPersonal })}>
                                                    <PackageCard
                                                        {...pacote}
                                                        descricao={pacote.beneficios?.map(b => b.valor) || []}
                                                        onClick={() => handleBuyClick(pacote.id!)}
                                                        isMobile={isMobile}
                                                        isPersonal={isPersonal}
                                                        setHandleDelete={() => { setPackageId(pacote.id!); setOpenModal("delete"); }}
                                                        setHandleEdit={() => handleUpdatePackage(pacote.id!, true)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <button className={styles.emblaButtonNext} onClick={scrollNext}>›</button>
                                {isPersonal && !isMobile && (
                                    <div
                                        style={!shouldUseCarouselAdicional ? { maxWidth: "inherit" } : {}}
                                        className={classnames(styles.addCard, { [styles.addCardLimit]: verifyNumberOfAdditional })}
                                        onClick={() => handleClickAddPackage("addAdditional")}>

                                        <div className={classnames(styles.addIconWrapper, { [styles.addIconWrapperLimit]: verifyNumberOfAdditional })}>
                                            {verifyNumberOfAdditional ? <CircleX size={24} color="#943032" /> : <Plus size={24} color="#a2afc1" />}
                                        </div>
                                        {!verifyNumberOfAdditional ? <h4 className={styles.addTitle}>Criar Novo Adicional</h4> : <h4 className={styles.addTitle}>Limite de pacotes atingido</h4>}
                                        {!verifyNumberOfAdditional ? <p className={styles.addText}>Adicione novas modalidades ou planos de fidelidade.</p> : <p className={styles.addText}>Você atingiu o limite máximo de pacotes.</p>}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                {activeAdicionais.map((pacote, index) => (
                                    <PackageCard
                                        key={pacote.id! + pacote.titulo + index}
                                        {...pacote}
                                        descricao={pacote.beneficios?.map(b => b.valor) || []}
                                        onClick={() => handleBuyClick(pacote.id!)}
                                        isMobile={isMobile}
                                        isPersonal={isPersonal}
                                        setHandleDelete={() => { setPackageId(pacote.id!); setOpenModal("delete"); }}
                                        setHandleEdit={() => handleUpdatePackage(pacote.id!, true)}
                                    />
                                ))}
                                {isPersonal && !isMobile && (

                                    <div
                                        style={!shouldUseCarouselAdicional ? { maxWidth: "inherit" } : {}}
                                        className={classnames(styles.addCard, { [styles.addCardLimit]: verifyNumberOfAdditional })}
                                        onClick={() => handleClickAddPackage("addAdditional")}>

                                        <div className={classnames(styles.addIconWrapper, { [styles.addIconWrapperLimit]: verifyNumberOfAdditional })}>
                                            {verifyNumberOfAdditional ? <CircleX size={24} color="#943032" /> : <Plus size={24} color="#a2afc1" />}
                                        </div>
                                        {!verifyNumberOfAdditional ? <h4 className={styles.addTitle}>Criar Novo Adicional</h4> : <h4 className={styles.addTitle}>Limite de pacotes atingido</h4>}
                                        {!verifyNumberOfAdditional ? <p className={styles.addText}>Adicione novas modalidades ou planos de fidelidade.</p> : <p className={styles.addText}>Você atingiu o limite máximo de pacotes.</p>}
                                    </div>
                                )}
                            </>
                        )}
                        {isPersonal && isMobile && (
                            <div className={classnames(styles.addCard, { [styles.addCardMobile]: isMobile }, { [styles.addCardLimit]: verifyNumberOfAdditional })} onClick={() => handleClickAddPackage("addAdditional")}>
                                <div className={classnames(styles.addIconWrapper, { [styles.addIconWrapperLimit]: verifyNumberOfAdditional })}>
                                    {verifyNumberOfAdditional ? <CircleX size={24} color="#943032" /> : <Plus size={24} color="#a2afc1" />}
                                </div>

                                {!verifyNumberOfAdditional ? <h4 className={styles.addTitle}>Criar Novo Adicional</h4> : <h4 className={styles.addTitle}>Limite de pacotes atingido</h4>}
                                {!verifyNumberOfAdditional ? <p className={styles.addText}>Adicione novas modalidades ou planos de fidelidade.</p> : <p className={styles.addText}>Você atingiu o limite máximo de pacotes.</p>}
                            </div>
                        )}
                    </>
                ) : (
                    <div className={styles.emptyPackageContainer}>
                        <div className={styles.emptyPackageIconWrapper}>
                            <Package color="#0a3a5c" size={40} />
                        </div>

                        <h3 className={styles.emptyPackageTitle}>
                            Sem pacotes adicionais
                        </h3>

                        <p className={styles.emptyPackageText}>
                            {type?.type === "personal" ? "Você ainda não cadastrou pacotes adicionais." : "Não há pacotes adicionais disponíveis no momento."}
                        </p>
                    </div>
                )}
            </div>

            {
                openModal === "add" && (
                    <AddPackagePlan title="Criar Novo Pacote" typePackage="PACOTE" onClose={handleCloseModal} packageCreated={setProductsExhibitions} callSuccessModal={() => handleSuccessModalInfos("Adição concluída", "O pacote foi adicionado com sucesso")} idOnCreate={setPackageId} />
                )
            }

            {
                openModal === "addAdditional" && (
                    <AddPackagePlan title="Adicionar Pacote Adicional" typePackage="ADICIONAL" onClose={handleCloseModal} packageCreated={setProductsExhibitionsAdicional} callSuccessModal={() => handleSuccessModalInfos("Adição concluída", "O pacote adicional foi adicionado com sucesso")} />
                )
            }

            {
                openModal === "error" && (
                    <ErrorModal title={SuccessModalInfos.title} content={SuccessModalInfos.content} closeThen={() => handleCloseModal()} />
                )
            }


            {
                openModal === "edit" && (
                    <AddPackagePlan title="Editar Pacote" onClose={(e) => {
                        setOpenModal(e ? "success" : null)
                        setPackageId(null)
                    }} packageCreated={setProductsExhibitions} typePackage="PACOTE" packageValues={packageId ? productsExhibitionsFindById(packageId) : undefined} callSuccessModal={() => handleSuccessModalInfos("Edição concluída", "O pacote foi editado com sucesso")} isEdit={true} />
                )
            }

            {
                openModal === "editAdditional" && (
                    <>
                        <AddPackagePlan title="Editar Adicional" onClose={(e) => {
                            setOpenModal(e ? "success" : null)
                            setPackageId(null)
                        }} packageCreated={setProductsExhibitionsAdicional} typePackage="ADICIONAL" packageValues={packageId ? productsExhibitionsFindById(packageId, true) : undefined} callSuccessModal={() => handleSuccessModalInfos("Edição concluída", "O pacote adicional foi editado com sucesso")} isEdit={true} />
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

            {
                openModal === "loadingPagBank" && (
                    <PagBankModal isMobile={isMobile} />
                )
            }
        </>

    );
}
