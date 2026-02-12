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
import { ArrowLeft, ArrowRight, CalendarClock, ChevronLeft, ChevronRight, CircleCheck, CircleX, UserRound } from "lucide-react";
import TableHeader from "../../../components/CheckSchedule/Table/TableHeader";
import TableRow from "../../../components/CheckSchedule/Table/TableRow";
import { useInfinitePagination, type PaginatedResponse } from "../../../hooks/useInfinitePagination";
import type { AbsenceAppointment, CheckSchedule } from "../../../models/schedule";
import { statusProperties } from "./CardStatus/cardStatus";
import type { DateRange } from "../../../components/Calendars/MiniCalendar/CalendarMini";
import SmallerButton from "../../../components/SmallerButton/SmallerButton";

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
    // const {
    //     data: userRescheduleAppointments,
    //     loadMoreRef,
    //     hasNextPage,
    //     isFetchingNextPage,
    //     pagination
    // } = useInfinitePagination<CheckSchedule>({
    //     queryKey: ["userRescheduleAppointments"],
    //     queryFn: (page) => findPersonalRequests(page, linesPerPageValue).then(res => res.data)
    // });

    const [page, setPage] = useState(0);

const { data: userRescheduleAppointments } =
    useQuery<PaginatedResponse<CheckSchedule>>({
        queryKey: ["userRescheduleAppointments", linesPerPageValue, page],
        queryFn: () =>
            findPersonalRequests(page, linesPerPageValue).then(res => res.data),
    });

    const appointmentsList = userRescheduleAppointments?.content ?? [];
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

    console.log("Selected date range:", pagination?.number);


    return (
        <>
            <div className={styles.containerCheckSchedule}
            >
                <div className={styles.titleFilter}>
                    <h1>Solicitações de Agendamentos</h1>

                    <div className="grid grid-cols-4 w-full gap-5 flex-wrap">

                        <CheckScheduleKpis
                            title="Total pendente"
                            value={appointmentsList.length}
                        />
                        <CheckScheduleKpis
                            title="Vence hoje"
                            value={appointmentsList.length}
                            color="#F59E0B"
                        />
                        <CheckScheduleKpis
                            title="Reagendados hoje"
                            value={appointmentsList.length}
                            color="#006faf"
                        />
                        <CheckScheduleKpis
                            title="Taxa de completude"
                            value="85%"
                        />

                    </div>


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

                {/* <div className={styles.cardsCheckSchedule}>
                    {filteredData.map(card => (
                        <CardCheckSchedule
                            key={card.agendamentoId}
                            cardData={card}
                            RescheduleClick={() => {
                                setClickedDate(card.dataInicio?.split("T")[0] || "");
                                handleModal(card.agendamentoId, "reschedule");
                            }}
                            AcceptScheduleClick={() => handleModal(card.agendamentoId, "accept")}
                            DeclineScheculeClick={() => handleModal(card.agendamentoId, "decline")}
                            ConcludeScheduleClick={() => handleModal(card.agendamentoId, "conclude")}
                            RegisterAbsenceClick={() => handleModal(card.agendamentoId, "registerAbsence")}
                        />
                    ))}
                    <div ref={loadMoreRef} style={{ height: "1px" }} />
                </div>*/}

                <div className="rounded-lg border border-slate-200 bg-white shadow-sm w-full z-10">
                    <div className="overflow-x-auto rounded-t-lg">
                        <table className="w-full text-left border-collapse">
                            <thead className="">
                                <tr className="bg-[#192633] border-b border-[#324d67]">
                                    <TableHeader title="Status" />
                                    <TableHeader title="Aluno" />
                                    <TableHeader title="Data" />
                                    <TableHeader title="Tipo de agendamento" />
                                    <TableHeader title="Endereço" />
                                    <TableHeader title="Ações" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#324d67]">
                                {filteredData.length !== 0 && filteredData.map(card => (
                                    <tr className="border border-gray-300">
                                        <td className="px-6 py-4">
                                            <span className={`flex w-full h-12 justify-center text-center items-center px-2.5 py-0.5 rounded-full text-sm font-semibold ${statusProperties.find(status => status.cardStatus === card.status)?.cardColor}`}>
                                                {statusProperties.find(status => status.cardStatus === card.status)?.cardDescription}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-9 rounded-full bg-cover bg-center border border-slate-300 flex items-center justify-center" data-alt={`Client ${card.nome}`}>{card.foto ? <img src={card.foto} alt={`Client ${card.nome}`} className="rounded-full w-9 h-9 object-cover" /> : <UserRound />}</div>
                                                <span className="text-sm font-semibold text-slate-900">{card.nome}</span>
                                            </div>
                                        </td>
                                        <TableRow text={format(parseISO(card.dataInicio), "dd/MM/yyyy HH:mm")} />
                                        <TableRow text={card.tipoAula} />
                                        <TableRow text={card.endereco.cep.logradouro + ", " + card.endereco.numero + " - " + card.endereco.cep.bairro + " - " + card.endereco.cep.uf} />
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-between gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                                <button className="cursor-pointer" onClick={() => {
                                                    handleModal(card.agendamentoId, "accept")
                                                }}>
                                                    <CircleCheck className="text-green-500" />
                                                </button>
                                                <button className="cursor-pointer" onClick={() => {
                                                    handleModal(card.agendamentoId, "decline")
                                                }}>
                                                    <CircleX className="text-red-500" />
                                                </button>
                                                <button className="cursor-pointer" onClick={() => {
                                                    setClickedDate(card.dataInicio?.split("T")[0] || "");
                                                    handleModal(card.agendamentoId, "reschedule");
                                                }}>
                                                    <CalendarClock className="text-blue-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredData.length === 0 && (
                                    <tr className="h-96 px-6 py-4">
                                        <td colSpan={6} className="text-center py-4 h-2/4">
                                            <span className="text-gray-500">
                                                Nenhum agendamento encontrado.
                                            </span>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        { (hasPreviousPage || hasNextPage) && (
                            <div>
                                <div className="flex justify-between items-center">
                                    <div className="py-4 px-6 gap-4 flex">
                                        <div>
                                            <span className="text-gray-500">Página</span> {pagination?.number as number + 1} <span className="text-gray-500">de</span> {pagination?.totalPages}
                                        </div>
                                        <span className="text-gray-500">Mostrando {pagination?.size} de {pagination?.totalElements} agendamentos</span>
                                    </div>
                                    <div className="flex py-4 px-6 gap-3">
                                        <SmallerButton 
                                            icon={<ChevronLeft />} 
                                            classname={`${pagination?.number === 0 ? 'bg-gray-400! cursor-default!' : ''} h-12`} 
                                            handleButtonClick={() => handlePaginationChange(page - 1)}    
                                        />
                                        <SmallerButton 
                                            icon={<ChevronRight />} 
                                            classname={`${pagination?.totalPages && pagination?.number === pagination?.totalPages - 1 ? 'bg-gray-400! cursor-default!' : ''} h-12`} 
                                            handleButtonClick={() => handlePaginationChange(page + 1)}    
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* {isFetchingNextPage && <p>Carregando mais...</p>} */}
            {openModal === "reschedule" && (
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
            )}

            {openModal === "accept" && <TimerModal callSuccessModal={() => acceptAppointment(appointmentId)} isMobile={isMobile} closeThen={() => setOpenModal(null)} title="Aceitar Agendamento" content="Tem certeza que deseja aceitar o agendamento?" buttonTitle="Aceitar agendamento" />}

            {openModal === "conclude" && <TimerModal callSuccessModal={() => handleConcludeAppointment(appointmentId)} isMobile={isMobile} closeThen={() => setOpenModal(null)} title="Concluir Agendamento" content="Tem certeza que deseja concluir o agendamento?" buttonTitle="Concluir agendamento" />}

            {openModal === "decline" && <TimerModal callSuccessModal={() => declineAppointment(appointmentId)} isMobile={isMobile} closeThen={() => setOpenModal(null)} title="Recusar agendamento" content="Tem certeza que deseja Recusar o agendamento?" buttonTitle="Recusar agendamento" isDelete={true} />}

            {openModal === "success" && <SuccessModal isMobile={isMobile} closeThen={() => setOpenModal(null)} title={successModalInfo?.title} content={successModalInfo?.content} />}

            {openModal === "error" && <ErrorModal closeThen={() => setOpenModal(null)} title={successModalInfo?.title} content={successModalInfo?.content} />}

            {openModal === "registerAbsence" &&
                <RegisterAbsenceModal closeThen={() => setOpenModal(null)} onSubmit={registerAbsenceAppointment} />
            }
        </>
    )
}