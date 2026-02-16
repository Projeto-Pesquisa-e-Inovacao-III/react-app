import { CardFilterCheckSchedule } from "../../../components/CheckSchedule/CardFilterCheckSchedule/CardFilterCheckSchedule";
import styles from "./CheckSchedule.module.css"
import { useContext, useEffect, useState } from "react";
import TimerModal from "../../../components/Modal/TimerModal/TimerModal";
import SuccessModal from "../../../components/Modal/SuccessModal/SuccessModal";
import useMobile from "../../../hooks/isMobile";
import RegisterAbsenceModal from "../../../components/Modal/RegisterAbsenceModal/RegisterAbsenceModal";
import useSearchFilter from "../../../hooks/useSearchFilter";
import { acceptUserAppointment, appointmentAtCalendar, concludeAppointment, findAppointmentById, findPersonalRequests, refuseAppointment, reportAbsencePersonal } from "../../../constants/schedule";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import NewEvent from "../../../components/NewEvent/NewEvent";
import ErrorModal from "../../../components/Modal/ErrorModal/ErrorModal";
import { TypeContext } from "../../../App";
import { useSearchParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import CheckScheduleKpis from "../../../components/CheckSchedule/CheckScheduleKpis/CheckScheduleKpis";
import { CalendarClock, CalendarX, ChevronLeft, ChevronRight, CircleCheck, CircleX, Map, MapPin, RefreshCwIcon, UserRound } from "lucide-react";
import TableHeader from "../../../components/CheckSchedule/Table/TableHeader";
import { useInfinitePagination, type PaginatedResponse } from "../../../hooks/useInfinitePagination";
import type { AbsenceAppointment, CheckSchedule } from "../../../models/schedule";
import { statusProperties } from "./CardStatus/cardStatus";
import type { DateRange } from "../../../components/Calendars/MiniCalendar/CalendarMini";
import SmallerButton from "../../../components/SmallerButton/SmallerButton";
import Skeleton from "react-loading-skeleton";

type modalTypes = "reschedule" | "accept" | "conclude" | "decline" | "success" | "registerAbsence" | "error" | null;

export function CheckSchedule() {
    const isMobile = useMobile();
    const queryClient = useQueryClient();

    const [openModal, setOpenModal] = useState<modalTypes>(null);

    const [appointmentId, setAppointmentId] = useState<number>(0);

    const [clickedDate, setClickedDate] = useState<string>("");


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

    const [linesPerPageValue, setLinesPerPageValue] = useState<string>("7");
    const {
        data: infinitePaginationMobile,
        loadMoreRef,
    } = useInfinitePagination<CheckSchedule>({
        queryKey: ["userRescheduleAppointmentsMobile"],
        queryFn: (page) => findPersonalRequests(page, linesPerPageValue).then(res => res.data),
        enable: isMobile
    });

    const [page, setPage] = useState(0);

    const { data: userRescheduleAppointments, isLoading: isLoadingAppointments } =
        useQuery<PaginatedResponse<CheckSchedule>>({
            queryKey: ["userRescheduleAppointments", linesPerPageValue, page],
            queryFn: () =>
                findPersonalRequests(page, linesPerPageValue).then(res => res.data),
            enabled: !isMobile
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

    //filter
    const {
        filteredData,
        hasFilters,
        filterSearch,
        setFilterSearch,
        filterStatus,
        setFilterStatus,
        filterTypeClass,
        setFilterTypeClass,
        clearFilters
    } = useSearchFilter(appointmentsList, {
        searchStatus: item => item.status,
        searchName: item => [item.nome, item.tipoAula, format(item.dataInicio, "dd/MM/yyyy")],
        searchTypeClass: item => item.tipoAula,
    });

    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.get("date")) {
            console.log("Appointments data:", searchParams.get("date"));
            const date = parseISO(searchParams.get("date") || "");
            setFilterSearch(format(date, "dd/MM/yyyy", { locale: ptBR }));
        }
    }, [searchParams, setFilterSearch]);


    async function handleInvalidateQueries() {
        await queryClient.invalidateQueries({ queryKey: ["appointmentDetails"] });
        await queryClient.invalidateQueries({ queryKey: ["personal-requests"] });
        await queryClient.invalidateQueries({ queryKey: ["userRescheduleAppointments"] });
        await queryClient.invalidateQueries({ queryKey: ["userRescheduleAppointmentsMobile"] });
        await queryClient.invalidateQueries({ queryKey: ["appointmentsAtCalendar"] });
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
            tipoUsuario: data.type,
            descricaoCancelamento: data.description === "" ? "" : data.description
        };
        await reportAbsencePersonal(payload).then(async () => {
            await handleInvalidateQueries();
            handleSuccessModal("Ausência Registrada", "A ausência foi registrada com sucesso.");
        }).catch((error) => {
            console.error("Erro ao registrar a ausência:", error);
        });
    }

    async function handleConcludeAppointment(id: number) {
        concludeAppointment(id).then(async () => {
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


    const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({
        start: "",
        end: "",
    });





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
                <CheckScheduleKpis
                    title={<Skeleton width={130} />}
                    value={<Skeleton width={200} height={32} />}
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
                                value={appointmentsList?.length || 0}
                            />
                            <CheckScheduleKpis
                                title="Vence hoje"
                                value={appointmentsList?.length || 0}
                                color="#F59E0B"
                            />
                            <CheckScheduleKpis
                                title="Reagendados hoje"
                                value={appointmentsList?.length || 0}
                                color="#006faf"
                            />
                            <CheckScheduleKpis
                                title="Taxa de completude"
                                value="85%"
                            />
                        </div>
                    )}

                    <div className={styles.cardFilter}>
                        <CardFilterCheckSchedule
                            onSearchChange={setFilterSearch}
                            selectStatusValue={filterStatus}
                            onSelectStatusChange={setFilterStatus}
                            onSelectTypeClassChange={setFilterTypeClass}
                            selectTypeClassValue={filterTypeClass}
                            selectLinesPerPageValue={linesPerPageValue}
                            onSelectLinesPerPageChange={setLinesPerPageValue}
                            searchValue={filterSearch}
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
                        ) : filteredData.length === 0 ? (
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
                            filteredData.map((card) => (

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
                                            <button
                                                className={styles.button}
                                                onClick={() =>
                                                    handleModal(card.agendamentoId, "accept")
                                                }
                                            >
                                                <CircleCheck className={styles.iconAccept} />
                                            </button>

                                            <button
                                                className={styles.button}
                                                onClick={() =>
                                                    handleModal(card.agendamentoId, "decline")
                                                }
                                            >
                                                <CircleX className={styles.iconDecline} />
                                            </button>

                                            <button
                                                className={styles.button}
                                                onClick={() => {
                                                    setClickedDate(
                                                        card.dataInicio?.split("T")[0] || ""
                                                    );
                                                    handleModal(card.agendamentoId, "reschedule");
                                                }}
                                            >
                                                <CalendarClock className={styles.iconReschedule} />
                                            </button>
                                        </div>

                                    </div>


                                </div>

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
                                        {filteredData.length !== 0 &&
                                            filteredData.map((card) => (
                                                <tr key={card.agendamentoId} className={styles.row}>
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
                                                                data-alt={`Client ${card.nome}`}
                                                            >
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
                                                            <MapPin className="cursor-pointer" size={30} onClick={() => handleOpenMap(`${card.endereco.cep.logradouro}, ${card.endereco.numero}, ${card.endereco.cep.bairro}, ${card.endereco.cep.uf}`)} />
                                                        </div>
                                                    </td>

                                                    {card.status === "PENDENTE_PERSONAL_APROVACAO" && (
                                                        <td className={styles.actionsCell}>
                                                            <div className={styles.actionsWrapper}>
                                                                <button
                                                                    className={styles.button}
                                                                    onClick={() =>
                                                                        handleModal(card.agendamentoId, "accept")
                                                                    }
                                                                >
                                                                    <CircleCheck className="text-green-500" />
                                                                </button>

                                                                <button
                                                                    className={styles.button}
                                                                    onClick={() =>
                                                                        handleModal(card.agendamentoId, "decline")
                                                                    }
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
                                                                >
                                                                    <CalendarClock className="text-blue-500" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}


                                        {filteredData.length === 0 && (
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
                            buttonTitle="Reagendar"
                            isReschedule={true}
                            clickedDate={clickedDate}
                            rescheduleId={appointmentId}
                            goToNextStep={false}
                            appoitmentData={appointment.data}
                            typeUser={type ?? undefined}

                        />
                    </>
                )
            }

            {openModal === "accept" && <TimerModal callSuccessModal={() => acceptAppointment(appointmentId)} isMobile={isMobile} closeThen={() => setOpenModal(null)} title="Aceitar Agendamento" content="Tem certeza que deseja aceitar o agendamento?" buttonTitle="Aceitar agendamento" />}

            {openModal === "conclude" && <TimerModal callSuccessModal={() => handleConcludeAppointment(appointmentId)} isMobile={isMobile} closeThen={() => setOpenModal(null)} title="Concluir Agendamento" content="Tem certeza que deseja concluir o agendamento?" buttonTitle="Concluir agendamento" />}

            {openModal === "decline" && <TimerModal callSuccessModal={() => declineAppointment(appointmentId)} isMobile={isMobile} closeThen={() => setOpenModal(null)} title="Recusar agendamento" content="Tem certeza que deseja Recusar o agendamento?" buttonTitle="Recusar agendamento" isDelete={true} />}

            {openModal === "success" && <SuccessModal isMobile={isMobile} closeThen={() => setOpenModal(null)} title={successModalInfo?.title} content={successModalInfo?.content} />}

            {openModal === "error" && <ErrorModal closeThen={() => setOpenModal(null)} title={successModalInfo?.title} content={successModalInfo?.content} />}

            {
                openModal === "registerAbsence" &&
                <RegisterAbsenceModal closeThen={() => setOpenModal(null)} onSubmit={registerAbsenceAppointment} />
            }
        </>
    )
}