import { CardFilterCheckSchedule } from "../../../components/CheckSchedule/CardFilterCheckSchedule/CardFilterCheckSchedule";
import styles from "./CheckSchedule.module.css"
import { useContext, useEffect, useState } from "react";
import TimerModal from "../../../components/Modal/TimerModal/TimerModal";
import ConcludeAppointmentModal from "../../../components/Modal/ConcludeAppointmentModal/ConcludeAppointmentModal";
import SuccessModal from "../../../components/Modal/SuccessModal/SuccessModal";
import useMobile from "../../../hooks/isMobile";
import RegisterAbsenceModal from "../../../components/Modal/RegisterAbsenceModal/RegisterAbsenceModal";
import { acceptUserAppointment, appointmentAtCalendar, concludeAppointment, findAppointmentById, findPersonalRequests, refuseAppointment, reportAbsencePersonal } from "../../../constants/schedule";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import NewEvent from "../../../components/Modal/NewEvent/NewEvent";
import ErrorModal from "../../../components/Modal/ErrorModal/ErrorModal";
import { TypeContext } from "../../../App";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { endOfDay, format, isAfter, parseISO, startOfDay } from "date-fns";
import CheckScheduleKpis from "../../../components/CheckSchedule/CheckScheduleKpis/CheckScheduleKpis";
import { CalendarClock, CalendarX, ChevronLeft, ChevronRight, CircleCheck, CircleX, MapPin, RefreshCwIcon, User, UserRound, UserX } from "lucide-react";
import TableHeader from "../../../components/CheckSchedule/Table/TableHeader";
import { useInfinitePagination, type PaginatedResponse } from "../../../hooks/useInfinitePagination";
import type { AbsenceAppointment, CheckSchedule } from "../../../models/schedule";
import { statusProperties } from "./CardStatus/cardStatus";
import type { DateRange } from "../../../components/Calendars/MiniCalendar/CalendarMini";
import SmallerButton from "../../../components/SmallerButton/SmallerButton";
import Skeleton from "react-loading-skeleton";
import UserAvatar from "../../../components/UserAvatar/UserAvatar";
import { getScheduleData } from "../../../constants/personal";
import classNames from "classnames";
import { useAiPanel } from "../../../hooks/useAiPanel";
import AiPanel from "../../../components/AiPanel/AiPanel";

type modalTypes = "reschedule" | "accept" | "concludeAppointment" | "conclude" | "decline" | "success" | "registerAbsence" | "error" | null;

export function CheckSchedule() {
    const isMobile = useMobile();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [openModal, setOpenModal] = useState<modalTypes>(null);

    const [appointmentId, setAppointmentId] = useState<number>(0);

    const [clickedDate, setClickedDate] = useState<string>("");

    const { aiPanelOpen, setAiPanelOpen, isAiPanelClosing, aiPanelRef, closeAiPanel } = useAiPanel();


    function handleModal(id: number, type: modalTypes) {
        setAppointmentId(id);
        setOpenModal(type);
    }
    const type = useContext(TypeContext)?.type;


    const appointment = useQuery({
        queryKey: ['appointmentDetails', appointmentId],
        queryFn: () => findAppointmentById(appointmentId),
        enabled: appointmentId > 0,
        select: res => res.data,
    });

    const [successModalInfo, setSuccessModalInfo] = useState<{
        title: string;
        content: string;
    } | null>(null);

    function handleSuccessModal(title: string, content: string) {
        setSuccessModalInfo({ title, content });
        setOpenModal("success");
    }

    function handleErrorModalInfo(title: string, content: string) {
        setSuccessModalInfo({ title, content });
        setOpenModal("error");
    }

    const [page, setPage] = useState(0);


    const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({
        start: "",
        end: "",
    });

    const [linesPerPageValue, setLinesPerPageValue] = useState<string>("7");
    const [filterStatus, setFilterStatus] = useState<string>("");
    const [filterTypeClass, setFilterTypeClass] = useState<string>("");
    const [studentName, setStudentName] = useState<string>("");

    const {
        data: infinitePaginationMobile,
        loadMoreRef,
    } = useInfinitePagination<CheckSchedule>({
        queryKey: ["userRescheduleAppointmentsMobile", filterStatus, filterTypeClass, studentName, selectedDateRange.start, selectedDateRange.end, linesPerPageValue],
        queryFn: () => findPersonalRequests(
            page,
            linesPerPageValue,
            selectedDateRange.start ? format(startOfDay(parseISO(selectedDateRange.start)), "yyyy-MM-dd'T'HH:mm:ss") : undefined,
            selectedDateRange.end ? format(endOfDay(parseISO(selectedDateRange.end)), "yyyy-MM-dd'T'HH:mm:ss") : undefined,
            filterStatus,
            filterTypeClass,
            studentName
        ).then(res => res.data),
        enable: isMobile,
    });

    const { data: userRescheduleAppointments, isLoading: isLoadingAppointments } =
        useQuery<PaginatedResponse<CheckSchedule>>({
            queryKey: ["userRescheduleAppointments", linesPerPageValue, page, selectedDateRange.end, filterStatus, filterTypeClass, studentName],
            queryFn: async (): Promise<PaginatedResponse<CheckSchedule>> =>
                findPersonalRequests(
                    page,
                    linesPerPageValue,
                    selectedDateRange.start ? format(startOfDay(parseISO(selectedDateRange.start)), "yyyy-MM-dd'T'HH:mm:ss") : undefined,
                    selectedDateRange.end ? format(endOfDay(parseISO(selectedDateRange.end)), "yyyy-MM-dd'T'HH:mm:ss") : undefined,
                    filterStatus,
                    filterTypeClass,
                    studentName
                ).then((res) => res.data),
            enabled: !isMobile,
            refetchOnWindowFocus: false,
        });


    const appointmentsList = userRescheduleAppointments?.content ?? infinitePaginationMobile;
    const pagination = userRescheduleAppointments?.page;

    const hasNextPage =
        pagination ? pagination.number < pagination.totalPages - 1 : false;

    const hasPreviousPage =
        pagination ? pagination.number > 0 : false;


    function handlePaginationChange(newPage: number) {
        setPage(newPage);
    }

    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.get("date")) {
            console.log("Appointments data:", searchParams.get("date"));
            const dateParam = searchParams.get("date") || "";
            setSelectedDateRange({ start: dateParam, end: dateParam });
        }
    }, [searchParams]);


    async function handleInvalidateQueries() {
        await queryClient.invalidateQueries({ queryKey: ["appointmentDetails"] });
        await queryClient.refetchQueries({ queryKey: ["personal-requests"] });
        await queryClient.refetchQueries({ queryKey: ["userRescheduleAppointments"] });
        await queryClient.refetchQueries({ queryKey: ["userRescheduleAppointmentsMobile"] });
        await queryClient.invalidateQueries({ queryKey: ["appointmentsAtCalendar"] });
        await queryClient.invalidateQueries({ queryKey: ["dataKpi"] });

    }

    async function handleSuccessReschedule() {
        await handleInvalidateQueries();
        handleSuccessModal("Reagendamento Concluído", "O agendamento foi reagendado com sucesso.");
    }

    async function acceptAppointment(id: number) {
        await acceptUserAppointment(id).then(async (res) => {
            console.log("Agendamento aceito:", res);
            await handleInvalidateQueries();
            handleSuccessModal("Agendamento Aceito", "O agendamento foi aceito com sucesso.");
        }).catch((error) => {
            console.error("Erro ao concluir o agendamento:", error);
        });
    }

    async function declineAppointment(id: number) {
        await refuseAppointment(id).then(async () => {
            await handleInvalidateQueries();
            handleSuccessModal("Agendamento Recusado", "O agendamento foi recusado.");
        }).catch((error) => {
            console.error("Erro ao recusar o agendamento:", error);
        });
    }

    async function registerAbsenceAppointment(data: { type: string; description: string }) {
        const payload: AbsenceAppointment = {
            idAgendamento: appointmentId,
            tipoUsuario: data.type.includes("personal") ? "PERSONAL" : "ALUNO",
            descricaoCancelamento: data.description === "" ? null : data.description
        };
        await reportAbsencePersonal(payload).then(async () => {
            await handleInvalidateQueries();
            handleSuccessModal("Ausência Registrada", "A ausência foi registrada com sucesso.");
        }).catch((error) => {
            console.error("Erro ao registrar a ausência:", error);
        });
    }

    async function handleConcludeAppointment(id: number, data: { resumo: string; grupoMuscular: string[] }) {
        await concludeAppointment(id, data).then(async (res) => {
            console.log("Agendamento concluído:", res);
            await handleInvalidateQueries();
            handleSuccessModal("Agendamento Concluído", "O agendamento foi concluído com sucesso.");
        }).catch((error) => {
            console.error("Erro ao concluir o agendamento:", error);
        });
    }


    const appointments = useQuery({
        queryKey: ["appointmentsAtCalendar"],
        queryFn: () => appointmentAtCalendar(),
    })

    type DataKpi = {
        totalPendente: number,
        totalRespondido: number,
        totalCanceladoPorMesAtual: number,
        totalAgendamentosHoje: number
    }

    const dataKpi = useQuery<DataKpi>({
        queryKey: ["dataKpi"],
        queryFn: () => getScheduleData().then(res => res.data),
        refetchOnWindowFocus: false,
    })

    console.log(dataKpi.data)

    function renderTableSkeleton() {
        return (
            <tbody className={styles.tbody}>
                {[...Array(5)].map((_, rowIndex) => (
                    <tr key={rowIndex} className={styles.row}>
                        <td className={styles.cell}>
                            <Skeleton width={100} height={24} borderRadius={12} />
                        </td>
                        <td className={styles.cell}>
                            <div className={styles.userWrapper}>
                                <Skeleton circle width={40} height={40} />
                                <Skeleton width={120} height={16} style={{ marginLeft: '12px' }} />
                            </div>
                        </td>
                        <td className={styles.cell}>
                            <Skeleton width={140} height={16} />
                        </td>
                        <td className={styles.cell}>
                            <Skeleton width={100} height={16} />
                        </td>
                        <td className={styles.cell}>
                            <Skeleton width={200} height={16} />
                        </td>
                        <td className={styles.actionsCell}>
                            <div className={styles.actionsWrapper}>
                                <Skeleton width={32} height={32} borderRadius={4} />
                                <Skeleton width={32} height={32} borderRadius={4} />
                                <Skeleton width={32} height={32} borderRadius={4} />
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        );
    }


    function renderKpisSkeleton() {
        return (
            <div className={styles.gridContainer}>
                <CheckScheduleKpis
                    title={<Skeleton width={120} />}
                    value={<Skeleton width={200} height={32} />}
                />
                <CheckScheduleKpis
                    title={<Skeleton width={100} />}
                    value={<Skeleton width={200} height={32} />}
                    color="#F59E0B"
                />
                <CheckScheduleKpis
                    title={<Skeleton width={140} />}
                    value={<Skeleton width={200} height={32} />}
                    color="#006faf"
                />
            </div>
        );
    }

    function renderMobileCardsSkeleton() {
        return (

            [...Array(3)].map((_, index) => (
                <div className={styles.mobileCardWrapper} key={index}>
                    <div className={styles.mobileCard}>
                        <div className={styles.mobileCardHeader}>
                            <Skeleton width={100} height={24} borderRadius={12} />
                            <Skeleton width={80} height={24} />
                        </div>

                        <div className={styles.mobileUserSection}>
                            <div className={styles.mobileAvatarWrapper}>
                                <Skeleton circle width={48} height={48} />
                            </div>

                            <div style={{ flex: 1 }}>
                                <Skeleton width="60%" height={20} style={{ marginBottom: '8px' }} />
                                <Skeleton width="80%" height={16} style={{ marginBottom: '4px' }} />
                                <Skeleton width="90%" height={16} />
                            </div>
                        </div>

                        <div className={styles.mobileActions}>
                            <Skeleton width={40} height={40} borderRadius={8} />
                            <Skeleton width={40} height={40} borderRadius={8} />
                            <Skeleton width={40} height={40} borderRadius={8} />
                        </div>
                    </div>
                </div>
            ))
        )
    }


    function handleOpenMap(endereco: string) {
        const query = encodeURIComponent(endereco);
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    }

    function handleOpenScheduleDetails(id: number) {
        navigate(`/schedule-details?id=${id}`);
    }


    const hasFilters = !!(studentName || filterStatus || filterTypeClass || selectedDateRange.start || selectedDateRange.end);

    function clearFilters() {
        setStudentName("");
        setFilterStatus("");
        setFilterTypeClass("");
        setSelectedDateRange({ start: "", end: "" });
        setPage(0);
    }

    return (
        <>
            <div className={styles.containerCheckSchedule}
            >
                <div className={styles.titleFilter}>
                    <h1>Solicitações de Agendamentos</h1>

                    {isLoadingAppointments ? renderKpisSkeleton() : (
                        <div className={styles.gridContainer}>

                            <CheckScheduleKpis
                                title="Total pendente"
                                value={dataKpi.data?.totalPendente || 0}
                                color="#F59E0B"
                            />
                            <CheckScheduleKpis
                                title="Respondidos"
                                value={dataKpi.data?.totalRespondido || 0}
                                color="#009664ff"
                            />
                            <CheckScheduleKpis
                                title="Cancelados no mês atual"
                                value={dataKpi.data?.totalCanceladoPorMesAtual || 0}
                                color="#960000ff"
                            />
                        </div>
                    )}

                    <div className={styles.cardFilter}>
                        <CardFilterCheckSchedule
                            onSearchChange={setStudentName}
                            selectStatusValue={filterStatus}
                            onSelectStatusChange={setFilterStatus}
                            onSelectTypeClassChange={setFilterTypeClass}
                            selectTypeClassValue={filterTypeClass}
                            selectLinesPerPageValue={linesPerPageValue}
                            onSelectLinesPerPageChange={setLinesPerPageValue}
                            searchValue={studentName}
                            onClear={clearFilters}
                            hasFilters={hasFilters}

                            selectedDateRange={selectedDateRange}
                            setSelectedDateRange={setSelectedDateRange}
                        />
                    </div>
                </div>

                {isMobile && (
                    <>
                        {isLoadingAppointments ? (
                            renderMobileCardsSkeleton()
                        ) : (appointmentsList ?? []).length === 0 ? (
                            <div className={styles.mobileEmptyContainer}>
                                <div className={styles.mobileIconWrapper}>
                                    <CalendarX className={styles.mobileIcon} />
                                </div>

                                <h3 className={styles.mobileTitle}>
                                    Nenhum agendamento encontrado
                                </h3>

                                <p className={styles.mobileText}>
                                    Não encontramos solicitações com os filtros selecionados ou ainda não há agendamentos.
                                </p>

                                {hasFilters &&
                                    <SmallerButton
                                        title="Limpar filtros"
                                        icon={<RefreshCwIcon />}
                                        handleButtonClick={clearFilters}
                                        classname={styles.mobileButton}
                                    />
                                }
                            </div>
                        ) : (
                            (appointmentsList ?? []).map((card) => (

                                <Link className={styles.link} to={`/schedule-details?id=${card.agendamentoId}`}>
                                    <div className={styles.mobileCardWrapper}
                                        key={card.agendamentoId}
                                        ref={loadMoreRef}

                                    >
                                        <div className={styles.mobileCard}>

                                            <div className={styles.mobileCardHeader}
                                            >
                                                <span
                                                    className={`${styles.mobileStatusBadge} ${statusProperties.find(
                                                        (status) => status.cardStatus === card.status
                                                    )?.cardColor || ""
                                                        }`}
                                                >
                                                    {
                                                        statusProperties.find(
                                                            (status) => status.cardStatus === card.status
                                                        )?.cardDescription
                                                    }
                                                </span>
                                                <span className={styles.mobileCardType}>
                                                    {card.tipoAula}
                                                </span>
                                            </div>

                                            <div className={styles.mobileUserSection}>
                                                <div className={styles.mobileAvatarWrapper}>
                                                    {card.foto ? (
                                                        <img
                                                            src={card.foto}
                                                            alt={`Client ${card.nome}`}
                                                            className={styles.userImage}
                                                        />
                                                    ) : (
                                                        <UserRound />
                                                    )}
                                                </div>

                                                <div>
                                                    <h3 className={styles.mobileUserName}>
                                                        {card.nome}
                                                    </h3>
                                                    <p className={styles.mobileUserDate}>
                                                        {format(parseISO(card.dataInicio), "dd/MM/yyyy HH:mm")} -{" "}
                                                        {format(parseISO(card.dataFim), "HH:mm")}
                                                    </p>
                                                    <p className={styles.mobileAddress}>
                                                        {card.endereco.cep.logradouro}, {card.endereco.numero} -{" "}
                                                        {card.endereco.cep.bairro} - {card.endereco.cep.uf}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className={styles.mobileActions}>
                                                {card.status === "PENDENTE_PERSONAL_APROVACAO" && (
                                                    <>
                                                        <button
                                                            className={styles.button}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleModal(card.agendamentoId, "accept");
                                                            }}
                                                            title="Aceitar agendamento"
                                                        >
                                                            <CircleCheck className={styles.iconAccept} />
                                                        </button>

                                                        <button
                                                            className={styles.button}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleModal(card.agendamentoId, "decline");
                                                            }}
                                                            title="Rejeitar agendamento"
                                                        >
                                                            <CircleX className={styles.iconDecline} />
                                                        </button>

                                                        <button
                                                            className={styles.button}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                setClickedDate(card.dataInicio?.split("T")[0] || "");
                                                                handleModal(card.agendamentoId, "reschedule");
                                                            }}
                                                            title="Reagendar agendamento"
                                                        >
                                                            <CalendarClock className={styles.iconReschedule} />
                                                        </button>
                                                    </>
                                                )}

                                                {card.status === "APROVADO" && (
                                                    <>
                                                        <button
                                                            className={styles.button}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleModal(card.agendamentoId, "decline");
                                                            }}
                                                            title="Cancelar agendamento"
                                                        >
                                                            <CircleX className={styles.iconDecline} />
                                                        </button>

                                                        <button
                                                            className={styles.button}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                setClickedDate(card.dataInicio?.split("T")[0] || "");
                                                                handleModal(card.agendamentoId, "reschedule");
                                                            }}
                                                            title="Reagendar agendamento"
                                                        >
                                                            <CalendarClock className={styles.iconReschedule} />
                                                        </button>
                                                    </>
                                                )}

                                                {card.status === "PENDENTE_PERSONAL_CONCLUIR" && isAfter(new Date(), parseISO(card.dataInicio)) && (
                                                    <>
                                                        <button
                                                            className={styles.button}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleModal(card.agendamentoId, "concludeAppointment");
                                                            }}
                                                            title="Concluir agendamento"
                                                        >
                                                            <User className="text-green-600" />
                                                        </button>

                                                        <button
                                                            className={styles.button}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleModal(card.agendamentoId, "registerAbsence");
                                                            }}
                                                            title="Registrar ausência"
                                                        >
                                                            <UserX className="text-red-500" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>

                                        </div>


                                    </div>
                                </Link>
                            ))

                        )}
                    </>
                )}


                {!isMobile && (


                    <div className={styles.container}>
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr className={styles.theadRow}>
                                        <TableHeader title="Status" />
                                        <TableHeader title="Aluno" />
                                        <TableHeader title="Data" />
                                        <TableHeader title="Tipo de agendamento" />
                                        <TableHeader title="Endereço" />
                                        <TableHeader title="Ações" />
                                    </tr>
                                </thead>

                                {isLoadingAppointments ? (
                                    renderTableSkeleton()
                                ) : (
                                    <tbody className={styles.tbody}>
                                        {(appointmentsList ?? []).length !== 0 &&
                                            (appointmentsList ?? []).map((card) => (
                                                <tr
                                                    key={card.agendamentoId}
                                                    className={styles.row}
                                                    onClick={() => handleOpenScheduleDetails(card.agendamentoId)}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    <td className={styles.cell}>
                                                        <span
                                                            className={`${styles.statusSpan} ${statusProperties.find(
                                                                (status) => status.cardStatus === card.status
                                                            )?.cardColor || ""
                                                                }`}
                                                        >
                                                            {
                                                                statusProperties.find(
                                                                    (status) => status.cardStatus === card.status
                                                                )?.cardDescription
                                                            }
                                                        </span>
                                                    </td>
                                                    <td className={styles.cell}>
                                                        <div className={styles.userWrapper}>
                                                            <div
                                                                className={styles.userAvatar}
                                                            >
                                                                <UserAvatar withUsernameClassName="w-9! h-9!" userName={card.nome} imgClassName={"w-[2.25rem]! h-[2.25rem]!"} useUserImage={true} foto={card.foto ? `${card.foto}` : undefined} />

                                                            </div>
                                                            <span className={styles.userName}>{card.nome}</span>
                                                        </div>
                                                    </td>

                                                    <td className={styles.cell}>
                                                        {format(parseISO(card.dataInicio), "dd/MM/yyyy HH:mm")}
                                                    </td>

                                                    <td className={styles.cell}>{card.tipoAula}</td>

                                                    <td className={styles.cell}>
                                                        <div className="flex items-center justify-start">
                                                            <span className="w-fit">{card.endereco.cep.logradouro}, {card.endereco.numero} -{" "}
                                                                {card.endereco.cep.bairro} - {card.endereco.cep.uf}</span>
                                                            <MapPin
                                                                fill="#000"
                                                                color="#fff"
                                                                className="cursor-pointer"
                                                                size={30}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleOpenMap(`${card.endereco.cep.logradouro}, ${card.endereco.numero}, ${card.endereco.cep.bairro}, ${card.endereco.cep.uf}`);
                                                                }}
                                                            />
                                                        </div>
                                                    </td>

                                                    {card.status === "PENDENTE_PERSONAL_APROVACAO" && (
                                                        <td className={styles.actionsCell} onClick={(e) => e.stopPropagation()}>
                                                            <div className={styles.actionsWrapper}>
                                                                <button
                                                                    className={styles.button}
                                                                    onClick={() =>
                                                                        handleModal(card.agendamentoId, "accept")
                                                                    }
                                                                    title="Aceitar agendamento"
                                                                >
                                                                    <CircleCheck className="text-green-500" />
                                                                </button>

                                                                <button
                                                                    className={styles.button}
                                                                    onClick={() =>
                                                                        handleModal(card.agendamentoId, "decline")
                                                                    }
                                                                    title="Rejeitar agendamento"
                                                                >
                                                                    <CircleX className="text-red-500" />
                                                                </button>

                                                                <button
                                                                    className={styles.button}
                                                                    onClick={() => {
                                                                        setClickedDate(
                                                                            card.dataInicio?.split("T")[0] || ""
                                                                        );
                                                                        handleModal(card.agendamentoId, "reschedule");
                                                                    }}
                                                                    title="Reagendar agendamento"
                                                                >
                                                                    <CalendarClock className="text-blue-500" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    )}
                                                    {card.status && (card.status === "APROVADO") && (
                                                        <td className={classNames(styles.actionsCell)} onClick={(e) => e.stopPropagation()}>
                                                            <div className={classNames(styles.actionsWrapper, styles.actionsWrapperApprove)}>
                                                                <button
                                                                    className={styles.button}
                                                                    onClick={() =>
                                                                        handleModal(card.agendamentoId, "decline")
                                                                    }
                                                                    title="Cancelar agendamento"
                                                                >
                                                                    <CircleX className="text-red-500" />
                                                                </button>

                                                                <button
                                                                    className={styles.button}
                                                                    onClick={() => {
                                                                        setClickedDate(
                                                                            card.dataInicio?.split("T")[0] || ""
                                                                        );
                                                                        handleModal(card.agendamentoId, "reschedule");
                                                                    }}
                                                                    title="Reagendar agendamento"
                                                                >
                                                                    <CalendarClock className="text-blue-500" />
                                                                </button>
{/* 
                                                                {(type?.includes("personal") || type?.includes("admin")) && (
                                                                    <button
                                                                        className={styles.button}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setAppointmentId(card.agendamentoId);
                                                                            setAiPanelOpen(true);
                                                                        }}
                                                                        title="Dica do Treinador IA"
                                                                    >
                                                                        <Sparkles className="text-blue-400" />
                                                                    </button>
                                                                )} */}
                                                            </div>
                                                        </td>
                                                    )}

                                                    {card.status === "PENDENTE_PERSONAL_CONCLUIR" && isAfter(new Date(), parseISO(card.dataInicio)) && (
                                                        <td className={classNames(styles.actionsCell)} onClick={(e) => e.stopPropagation()}>
                                                            <div className={classNames(styles.actionsWrapper, styles.actionsWrapperApprove)}>
                                                                <button
                                                                    className={styles.button}
                                                                    onClick={() =>
                                                                        handleModal(card.agendamentoId, "concludeAppointment")
                                                                    }
                                                                    title="Concluir agendamento"
                                                                >
                                                                    <User className="text-green-600" />
                                                                </button>

                                                                <button
                                                                    className={styles.button}
                                                                    onClick={() =>
                                                                        handleModal(card.agendamentoId, "registerAbsence")
                                                                    }
                                                                    title="Registrar ausência"
                                                                >
                                                                    <UserX className="text-red-500" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    )}

                                                </tr>
                                            ))}


                                        {(appointmentsList ?? []).length === 0 && (
                                            <tr className={styles.emptyRow}>
                                                <td colSpan={6} className={styles.emptyCell}>
                                                    <span className={styles.emptyText}>
                                                        Nenhum agendamento encontrado.
                                                    </span>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                )}
                            </table>

                            {(hasPreviousPage || hasNextPage) && (
                                <div className={styles.paginationContainer}>
                                    <div className={styles.paginationContent}>

                                        <div className={styles.paginationInfoWrapper}>
                                            <div>
                                                <span className={styles.paginationInfoText}>Página</span>{" "}
                                                {(pagination?.number as number) + 1}{" "}
                                                <span className={styles.paginationInfoText}>de</span>{" "}
                                                {pagination?.totalPages}
                                            </div>

                                            <span className={styles.paginationInfoText}>
                                                Mostrando {pagination?.size} de {pagination?.totalElements} agendamentos
                                            </span>
                                        </div>

                                        <div className={styles.paginationButtonsWrapper}>

                                            <SmallerButton
                                                icon={<ChevronLeft />}
                                                classname={`${styles.buttonHeight} ${pagination?.number === 0 ? styles.buttonDisabled : ""
                                                    }`}
                                                handleButtonClick={() => {
                                                    if (pagination?.number !== 0) {
                                                        handlePaginationChange(page - 1)
                                                    }
                                                }}
                                            />

                                            <SmallerButton
                                                icon={<ChevronRight />}
                                                classname={`${styles.buttonHeight} ${pagination?.totalPages &&
                                                    pagination?.number === pagination?.totalPages - 1
                                                    ? styles.buttonDisabled
                                                    : ""
                                                    }`}
                                                handleButtonClick={() => {
                                                    if (pagination?.totalPages && pagination?.number !== pagination?.totalPages - 1) {
                                                        handlePaginationChange(page + 1)
                                                    }
                                                }}
                                            />

                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                )}

            </div >

            {/* {isFetchingNextPage && <p>Carregando mais...</p>} */}
            {
                openModal === "reschedule" && (
                    <>
                        <NewEvent
                            isMobile={isMobile}
                            close={() => setOpenModal(null)}
                            openModalExtern={handleSuccessReschedule}
                            errorModal={() => handleErrorModalInfo("Erro ao reagendar", "Não foi possível reagendar o horário")}
                            insertedEvents={appointments.data?.data}
                            title="Reagendar horário"
                            buttonTitle={!type?.includes("personal") ? "Avançar" : "Reagendar"}
                            isReschedule={true}
                            clickedDate={clickedDate}
                            rescheduleId={appointmentId}
                            goToNextStep={!type?.includes("personal")}
                            appoitmentData={appointment.data}
                            typeUser={type || []}

                        />
                    </>
                )
            }

            {(openModal === "concludeAppointment" || openModal === "conclude") && (
                <ConcludeAppointmentModal
                    isMobile={isMobile}
                    closeThen={() => setOpenModal(null)}
                    onSubmit={(data) => handleConcludeAppointment(appointmentId, data)}
                />
            )}

            {openModal === "accept" && <TimerModal callSuccessModal={() => acceptAppointment(appointmentId)} isMobile={isMobile} closeThen={() => setOpenModal(null)} title="Aceitar Agendamento" content="Tem certeza que deseja aceitar o agendamento?" buttonTitle="Aceitar agendamento" />}

            {openModal === "decline" && <TimerModal callSuccessModal={() => declineAppointment(appointmentId)} isMobile={isMobile} closeThen={() => setOpenModal(null)} title="Recusar agendamento" content="Tem certeza que deseja Recusar o agendamento?" buttonTitle="Recusar agendamento" isDelete={true} />}

            {openModal === "success" && <SuccessModal isMobile={isMobile} closeThen={() => setOpenModal(null)} title={successModalInfo?.title} content={successModalInfo?.content} />}

            {openModal === "error" && <ErrorModal closeThen={() => setOpenModal(null)} title={successModalInfo?.title} content={successModalInfo?.content} />}

            {
                openModal === "registerAbsence" &&
                <RegisterAbsenceModal isMobile={isMobile} closeThen={() => setOpenModal(null)} onSubmit={registerAbsenceAppointment} />
            }
            <AiPanel
                isOpen={aiPanelOpen}
                isClosing={isAiPanelClosing}
                isMobile={isMobile}
                panelRef={aiPanelRef}
                onClose={closeAiPanel}
                onOpen={() => setAiPanelOpen(true)}
                note={appointment.data?.descricao}
                analiseIa={appointment.data?.analiseIa}
            />
        </>
    )
}