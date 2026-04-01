import type React from "react";
import Button from "../../Button/Button";
import styles from "./AddPackagePlan.module.css";
import Input from "../../Inputs/Input/Input";
import { ArrowLeft, Banknote, Calendar, CalendarSync, CheckCircle2, Eye, EyeOff, HeartPulse, Home, Info, PlusCircle, Tag, Trash2, Users, X, XCircle } from "lucide-react";
import { useRef, useState } from "react";
import useModalClose from "../../../hooks/useModalClose";
import { newProductExhibition, updateProductExhibition } from "../../../constants/products";
import type { ProductExhibition } from "../../../models/products";
import Skeleton from "react-loading-skeleton";
import useClickOutside from "../../../hooks/useClickOutside";
import Select from "../../Select/Select";
import InputWithIcon from "../../Inputs/InputWithIcon/InputWithIcon";
import useMobile from "../../../hooks/isMobile";
import { PackageCard } from "../../PackageCard/PackageCard";
import useModal from "../../../hooks/useModal";
import ErrorModal from "../ErrorModal/ErrorModal";
import classnames from "classnames";

type AddPackagePlanProps = {
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    idOnCreate?: React.Dispatch<React.SetStateAction<number | null>>;
    title?: string;
    packageValues?: {
        id?: number;
        titulo: string;
        tipoAula: string;
        preco: string;
        duracaoMes: number | string;
        descricao: string;
        beneficios: { valor: string }[];
        quantidadeAula: number | null;
    };
    isEdit?: boolean;
    typePackage: "PACOTE" | "ADICIONAL";
    packageCreated?: React.Dispatch<React.SetStateAction<ProductExhibition[]>>;
    callSuccessModal: () => void;
};

export default function AddPackagePlan({ onClose, title, packageValues, packageCreated, callSuccessModal, isEdit, typePackage }: AddPackagePlanProps) {
    const isMobile = useMobile();
    const { isClosing, handleAnimatedClose } = useModalClose({
        onClose: () => onClose(false),
        duration: 200,
        lockScroll: false
    });

    const [packageInfo, setPackageInfo] = useState<{ name: string; type: string; price: string; deadline: string; benefits: string[]; quantity: number | null }>({
        name: packageValues?.titulo || "",
        type: packageValues?.tipoAula || "",
        price: packageValues?.preco || "",
        deadline: packageValues?.duracaoMes?.toString() || "",
        benefits: packageValues?.beneficios ? packageValues.beneficios.map(b => b.valor) : [],
        quantity: packageValues?.quantidadeAula || null
    });

    function handleAutoFill() {
        setPackageInfo({
            name: "Pacote Exemplo",
            type: "PRESENCIAL",
            price: "100",
            deadline: "12",
            benefits: [
                "Nam luctus dui elementum, tempor augue vitae eget.",
                "Pellentesque egestas orci ipsum, rutrum tempus id.",
                "Class aptent taciti sociosqu ad litora massa nunc.",
                "Donec at nisl felis. Mauris iaculis ligula non ex.",
                "Nunc commodo felis dui, sagittis volutpat blandit.",
                "Curabitur a nunc ac justo efficitur varius felize.",
                "Aliquam erat volutpat. Donec dui at sapien varius.",
                "Vestibulum ante ipsum primis faucibus orci luctus."
            ],
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


    const {
        openModal,
        setOpenModal,
        textModal
    } = useModal(null, { title: "", content: "" })

    function handleAddPackage() {
        setLoading(true)

        const filteredBenefits = packageInfo.benefits.filter(b => b.trim() !== "");

        const data: ProductExhibition = {
            titulo: packageInfo.name,
            subtitulo: "",
            descricao: "",
            beneficios: filteredBenefits.map(b => ({ valor: b })),
            preco: packageInfo.price,
            periodo: packageInfo.deadline,
            tipoProduto: typePackage,
            status: "ATIVO",
            tipoAula: packageInfo.type,
            quantidadeAula: packageInfo.quantity,
            duracaoMes: parseInt(packageInfo.deadline || "12")
        }
        setPackageInfo(prev => ({ ...prev, benefits: filteredBenefits }));

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
            descricao: "",
            beneficios: packageInfo.benefits.map(b => ({ valor: b })),
            preco: packageInfo.price,
            periodo: packageInfo.deadline,
            tipoProduto: typePackage,
            status: "ATIVO",
            tipoAula: packageInfo.type,
            quantidadeAula: packageInfo.quantity,
            duracaoMes: parseInt(packageInfo.deadline || "12")
        }

    updateProductExhibition(packageValues?.id, data).then((res) => {
        console.log("Pacote editado com sucesso!");
        console.log("Response:", res);
        callSuccessModal();

        if (packageCreated && packageValues?.id) {
            packageCreated(prev => prev.filter(pkg => pkg.id !== packageValues.id));
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
        callback: () => {
            if (openModal) return;
            handleAnimatedClose()
        }
    });
    const [openSelectId, setOpenSelectId] = useState<string | null>(null);


    const [openPreviewMobile, setOpenPreviewMobile] = useState<boolean>(false);

    return (
        <>
            <div className={classnames(styles.modalOverlay, {
                [styles.modalOverlayClosing]: isClosing,
            })}>
                <div className={classnames(styles.modalContent, {
                    [styles.modalContentClosing]: isClosing,
                })} ref={packageCard}>


                    {!isMobile && (
                        <button onClick={handleAutoFill} className="border-2 absolute!">Auto Preencher</button>
                    )}

                    <div className={styles.formContainer}>


                        {isMobile && (
                            <div className={styles.mobileHeader}>
                                <button className={styles.mobileHeaderBack} type="button" onClick={handleAnimatedClose}>
                                    <ArrowLeft size={22} color="#1e293b" />
                                </button>
                                <span className={styles.mobileHeaderTitle}>{title}</span>
                                <button type="button">
                                </button>
                            </div>
                        )}


                        {isMobile && (
                            <>
                                <div className={styles.mobilePreviewCard} onClick={() => setOpenPreviewMobile(!openPreviewMobile)}>
                                    <div className={styles.mobilePreviewHeader}>
                                        <span className={styles.mobilePreviewLabel}>PRÉ-VISUALIZAÇÃO</span>
                                        {!openPreviewMobile ? <Eye size={18} color="#94a3b8" /> : <EyeOff size={18} color="#94a3b8" />}
                                    </div>
                                </div>

                                {openPreviewMobile && (
                                    <div className={styles.mobilePreviewOverlay} onClick={() => setOpenPreviewMobile(false)}>
                                        <div className={styles.mobilePreviewDrawer} onClick={(e) => e.stopPropagation()}>
                                            <div className={styles.mobilePreviewDrawerScroll}>
                                                <PackageCard
                                                    titulo={packageInfo.name || "Nome do Pacote"}
                                                    preco={packageInfo.price || "0"}
                                                    duracaoMes={packageInfo.deadline || "X"}
                                                    quantidadeAula={packageInfo.quantity || 0}
                                                    tipoAula={packageInfo.type || "PRESENCIAL"}
                                                    descricao={packageInfo.benefits || []}
                                                    isMobile={true}
                                                />
                                            </div>
                                            <button
                                                className={styles.mobilePreviewClose}
                                                onClick={() => setOpenPreviewMobile(false)}
                                            >
                                                Fechar Pré-visualização
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        <form className={styles.addPackageForm}>

                            {!isMobile && (

                                <div className="flex items-center justify-between mb-4! w-full">
                                    <h1 className="mb-0!">{title}</h1>
                                    <X size={30} color="#909fb5" cursor={"pointer"} onClick={handleAnimatedClose} />
                                </div>
                            )}
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
                                        <Skeleton height={40} />
                                    </div>
                                    <div className={styles.modalButtons}>
                                        <Skeleton width={120} height={40} style={{ marginRight: '10px' }} />
                                        <Skeleton width={120} height={40} />
                                    </div>
                                </>
                            ) : (
                                <>

                                    <div className={styles.inputContainer}>
                                        <InputWithIcon
                                            id="name"
                                            classNameInput="bg-gray-100! rounded-xl border-none!"
                                            label="Nome do Pacote"
                                            placeholder={isMobile ? "Ex: Hipertrofia Avançada" : ""}
                                            value={packageInfo.name}
                                            type="text"
                                            onInputChange={(name: string) => setPackageInfo({ ...packageInfo, name })}
                                            icon={<Tag color='#093a5d' />}
                                        />
                                    </div>


                            {isMobile ? (
                                <div className={styles.inputContainer}>
                                    <span className={styles.mobileLabel}>Modalidade</span>
                                    <Select
                                        id="select-type-class"
                                        onSelectStatusChange={(value: string) => setPackageInfo({ ...packageInfo, type: value })}
                                        defaultValue={packageInfo.type || "PRESENCIAL"}
                                        values={[
                                            { icon: <Users size={20} fill="#093a5d" color='#093a5d' />, label: "Presencial", value: "PRESENCIAL" },
                                            { icon: <Home size={20} color='#093a5d' />, label: "Residencial", value: "RESIDENCIAL" },
                                            { icon: <HeartPulse size={20} color='#093a5d' />, label: "Funcional", value: "FUNCIONAL" }
                                        ]}
                                        triggerClassName={styles.mobileSelectTrigger}
                                        triggerWrapperClassName={styles.mobileSelectTriggerWrapper}
                                        selectWrapperClassName={styles.mobileSelectWrapper}
                                        containerClassName={styles.mobileSelectContainer}
                                        setOpenSelectId={setOpenSelectId}
                                        openSelectId={openSelectId}
                                        showSelectAll={false}
                                    />
                                </div>
                            ) : (
                                <div className={`${styles.inputContainer} ${styles.inputContainerFirst}`}>
                                    <div className="flex gap-5">
                                        <Select
                                            id="select-type-class"
                                            label="Modalidade"
                                            onSelectStatusChange={(value: string) => setPackageInfo({ ...packageInfo, type: value })}
                                            defaultValue="PRESENCIAL"
                                            values={[
                                                { icon: <Users size={20} fill="#093a5d" color='#093a5d' />, label: "Presencial", value: "PRESENCIAL" },
                                                { icon: <Home size={20} color='#093a5d' />, label: "Residencial", value: "RESIDENCIAL" },
                                                { icon: <HeartPulse size={20} color='#093a5d' />, label: "Funcional", value: "FUNCIONAL" }
                                            ]}
                                            triggerClassName="h-10! w-full!"
                                            triggerWrapperClassName="h-10! w-full!"
                                            selectWrapperClassName="h-10! w-full!"
                                            containerClassName="w-full flex-1"
                                            setOpenSelectId={setOpenSelectId}
                                            openSelectId={openSelectId}
                                            showSelectAll={false}
                                        />
                                        <div className={styles.inputContainer}>
                                            <InputWithIcon id="price" classNameInput="bg-gray-100! rounded-xl border-none!" placeholder="" icon={<Banknote size={20} color='#093a5d' />} label="Preço (R$)" type="number" allowDecimals={true} value={packageInfo.price} onInputChange={(value: string) => setPackageInfo({ ...packageInfo, price: value })} />
                                        </div>
                                    </div>
                                </div>
                            )}


                            {isMobile && (
                                <div className={styles.mobileRow}>
                                    <div className={styles.mobileFieldHalf}>
                                        <InputWithIcon
                                            id="price"
                                            classNameInput="bg-gray-100! rounded-xl border-none!"
                                            placeholder="0,00"
                                            icon={<Banknote size={20} color='#093a5d' />}
                                            label="Preço (R$)"
                                            allowDecimals={true}
                                            type="number"
                                            value={packageInfo.price}
                                            onInputChange={(value: string) => setPackageInfo({ ...packageInfo, price: value })}
                                        />
                                    </div>
                                    <div className={styles.mobileFieldHalf}>
                                        <InputWithIcon
                                            id="deadline-mobile"
                                            classNameInput="bg-gray-100! rounded-xl border-none!"
                                            placeholder="Ex: 3"
                                            icon={<Calendar size={20} color='#093a5d' />}
                                            label="Duração (Meses)"
                                            type="number"
                                            value={packageInfo.deadline}
                                            onInputChange={(value: string) => setPackageInfo({ ...packageInfo, deadline: value })}
                                        />
                                    </div>
                                </div>
                            )}


                            {!isMobile && (
                                <div className="flex gap-5 mb-2!">
                                    <div className={styles.inputContainer}>
                                        <InputWithIcon id="quantity" classNameInput="bg-gray-100! rounded-xl border-none!"  icon={<CalendarSync size={50} color='#093a5d' />} label="Quantidade de aulas" type="number" value={packageInfo.quantity} onInputChange={(value: string) => setPackageInfo({ ...packageInfo, quantity: Number(value)})}/>
                                    </div>
                                    <div className={styles.inputContainer}>
                                        <InputWithIcon id="deadline" classNameInput="bg-gray-100! rounded-xl border-none!" placeholder="" icon={<Calendar size={30} color='#093a5d' />} label="Validade (meses)" type="number" value={packageInfo.deadline} onInputChange={(value: string) => setPackageInfo({ ...packageInfo, deadline: value })} />
                                    </div>
                                </div>
                            )}


                            {isMobile && (
                                <div className={styles.inputContainer}>
                                    <InputWithIcon
                                        id="quantity"
                                        classNameInput="bg-gray-100! rounded-xl border-none!"
                                        customClassName="mt-3!"
                                        placeholder="Ex: 12"
                                        icon={<CalendarSync size={20} color='#093a5d' />}
                                        label="Aulas por Período"
                                        type="number"
                                        value={packageInfo.quantity}
                                        onInputChange={(value: string) => setPackageInfo({ ...packageInfo, quantity: Number(value) })}
                                    />
                                </div>
                            )}

                                    <div className={styles.mobileBenefitsHeader}>
                                        <span className={styles.labelBenefits}>Benefícios inclusos <span className="text-slate-500">({packageInfo.benefits.length}/8)</span></span>

                                    </div>

                            {packageInfo.benefits.map((benefit, index) => (
                                <div className={styles.inputContainerBenefit} key={index}>
                                    {isMobile && <CheckCircle2 size={18} color="#16a34a" className="shrink-0" />}
                                    <Input
                                        id={`benefit-${index}`}
                                        classnameInput="px-3"
                                        classname={isMobile ? "bg-gray-100 w-full rounded-xl text-sm" : "bg-gray-100 w-full rounded-xl"}
                                        type="text"
                                        value={benefit}
                                        onInputChange={(value: string) => handleBenefitChange(index, value)}
                                        onClickIcon={() => handleRemoveBenefit(index)}
                                        limit={50}
                                    />
                                    {isMobile ? (
                                        <Trash2 color="#ca0909" cursor={"pointer"} size={22} onClick={() => handleRemoveBenefit(index)} />
                                    ) : (
                                        <Trash2 color="#ca0909" cursor={"pointer"} onClick={() => handleRemoveBenefit(index)} />
                                    )}
                                </div>
                            ))}

                                    <div className={styles.buttonContainer}>
                                        {packageInfo.benefits.length < 8 ? (
                                            <button
                                                onClick={() => handleAddBenefit()}
                                                className="w-full py-3 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 font-medium hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                                                type="button"
                                            >
                                                <PlusCircle size={25} />
                                                {isMobile ? "Adicionar Benefício" : "Adicionar novo benefício"}
                                            </button>
                                        ) : (
                                            <button
                                                className="w-full py-3 border-2 border-dashed bg-red-50 border-red-300 rounded-2xl text-slate-500 font-medium hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                                                type="button"
                                            >
                                                <XCircle size={25} />
                                                {isMobile ? "Limite atingido" : "Limite de benefícios atingido"}
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </form>

                        {isMobile ? (
                            <div className={styles.mobileBottomBar}>
                                <Button
                                    loading={loading}
                                    type="button"
                                    title={isEdit ? "Salvar Pacote" : "Criar Pacote"}
                                    classNameDiv={styles.mobileBottomBtnWrapper}
                                    classNameVariable={styles.mobileBottomBtn}
                                    onClick={isEdit ? handleEditPackage : handleAddPackage}
                                />
                                <Button
                                    loading={loading}
                                    type="button"
                                    title={"Cancelar"}
                                    classNameDiv={styles.mobileBottomBtnWrapper}
                                    classNameVariable={styles.mobileBottomBtnCancell}
                                    onClick={handleAnimatedClose}
                                />
                            </div>
                        ) : (
                            <div className={styles.modalButtons}>
                                <Button loading={loading} type="button" title={isEdit ? "Editar" : "Adicionar"} classNameDiv={`${styles.buttonsAction}`} classNameVariable={`${styles.buttonAddBenefit} ${styles.addButton}`} onClick={isEdit ? handleEditPackage : handleAddPackage} />
                                <Button type="button" title="Cancelar" classNameDiv={`${styles.buttonsAction} ${styles.addButtonAct}`} classNameVariable={`${styles.buttonAddBenefit} ${styles.cancelButton}`} onClick={handleAnimatedClose} />
                            </div>
                        )}
                    </div>


                    {!isMobile && (
                        <div className={styles.packagePreview}>
                            <div className={styles.packagePreviewScroll}>
                                <PackageCard
                                    titulo={packageInfo.name || "Título do Pacote"}
                                    preco={packageInfo.price || "0"}
                                    duracaoMes={packageInfo.deadline || "X"}
                                    quantidadeAula={packageInfo.quantity || "X"}
                                    tipoAula={packageInfo.type || "PRESENCIAL"}
                                    descricao={packageInfo.benefits ?? ["Benefício 1", "Benefício 2", "Benefício 3"]}
                                    isMobile={isMobile}
                                    classNameContainer={styles.packagePreviewCard}
                                />
                            </div>
                            <span className={styles.previewInfo}>
                                <Info size={20} /> Os alunos verão exatamente este visual
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {openModal === "error" && (
                <ErrorModal
                    title={textModal.title}
                    content={textModal.content}
                    closeThen={() => setOpenModal(null)}
                />
            )}
        </>
    );

}