import { CardFilterCheckSchedule } from "../../../components/CheckSchedule/CardFilterCheckSchedule/CardFilterCheckSchedule";
import styles from "./CheckSchedule.module.css"
import { useContext, useEffect, useRef, useState } from "react";
import TimerModal from "../../../components/Modal/TimerModal/TimerModal";
import SuccessModal from "../../../components/Modal/SuccessModal/SuccessModal";
import useMobile from "../../../hooks/isMobile";
import RegisterAbsenceModal from "../../../components/Modal/RegisterAbsenceModal/RegisterAbsenceModal";
import useSearchFilter from "../../../hooks/useSearchFilter";
import { acceptUserAppointment, appointmentAtCalendar, concludeAppointment, findAppointmentById, findPersonalRequests, refuseAppointment, reportAbsencePersonal } from "../../../constants/schedule";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import NewEvent from "../../../components/NewEvent/NewEvent";
import ErrorModal from "../../../components/Modal/ErrorModal/ErrorModal";
import { TypeContext } from "../../../App";
import { useSearchParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import CheckScheduleKpis from "../../../components/CheckSchedule/CheckScheduleKpis/CheckScheduleKpis";
import { CalendarClock, CircleCheck, CircleX } from "lucide-react";
import TableHeader from "../../../components/CheckSchedule/Table/TableHeader";
import TableRow from "../../../components/CheckSchedule/Table/TableRow";

type modalTypes = "reschedule" | "accept" | "conclude" | "decline" | "success" | "registerAbsence" | "error" | null;

export function CheckSchedule() {
    const isMobile = useMobile();
    const queryClient = useQueryClient();

    const [openModal, setOpenModal] = useState<modalTypes>(null);
    const [clickedDate, setClickedDate] = useState<string>("");

    const [appointmentId, setAppointmentId] = useState<number>(0);

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

    //infinite scroll
    //https://medium.com/@antstack/implementing-infinite-scroll-pagination-with-react-query-v3-b935a76aa25e
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['personal-requests'],
        queryFn: ({ pageParam = 0 }) => findPersonalRequests(pageParam),
        getNextPageParam: (lastPage) => {
            console.log(lastPage);
            return lastPage.nextPage < lastPage.totalPages
                ? lastPage.nextPage
                : undefined;
        },
        initialPageParam: 0,
    });

    const requests = data?.pages.flatMap(item => item.data) ?? [];

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    fetchNextPage();
                }
            }, {
            rootMargin: '100px',
        });

        observer.observe(loadMoreRef.current);

        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    useEffect(() => {
        console.log({
            hasNextPage,
            isFetchingNextPage,
            pages: data?.pages.length,
        });
    }, [data, hasNextPage, isFetchingNextPage]);

    //filter
    const {
        filteredData,
        hasFilters,
        filterSearch,
        setFilterSearch,
        filterStatus,
        setFilterStatus,
        clearFilters
    } = useSearchFilter(requests, {
        searchStatus: item => item.status,
        searchName: item => [item.nome, item.tipoAula, format(item.dataInicio, "dd/MM/yyyy")],
        searchType: item => item.tipoAula,
    });


    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.get("date")) {
            console.log("Appointments data:", searchParams.get("date"));
            const date = parseISO(searchParams.get("date") || "");
            setFilterSearch(format(date, "dd/MM/yyyy", { locale: ptBR }));
        }
    }, [searchParams, setFilterSearch]);


    async function handleSuccessReschedule() {
        await queryClient.invalidateQueries({ queryKey: ["appointmentDetails"] });
        await queryClient.invalidateQueries({ queryKey: ["personal-requests"] });
        await queryClient.invalidateQueries({ queryKey: ["appointmentsAtCalendar"] });
        handleSuccessModal("Reagendamento Concluído", "O agendamento foi reagendado com sucesso.");
    }

    async function acceptAppointment(id: number) {
        await acceptUserAppointment(id).then(async (res) => {
            console.log("Agendamento aceito:", res);
            await queryClient.invalidateQueries({ queryKey: ["appointmentDetails"] });
            await queryClient.invalidateQueries({ queryKey: ["personal-requests"] });
            await queryClient.invalidateQueries({ queryKey: ["appointmentsAtCalendar"] });
            handleSuccessModal("Agendamento Aceito", "O agendamento foi aceito com sucesso.");
        }).catch((error) => {
            console.error("Erro ao concluir o agendamento:", error);
        });
    }

    async function declineAppointment(id: number) {
        await refuseAppointment(id).then(async () => {
            await queryClient.invalidateQueries({ queryKey: ["appointmentDetails"] });
            await queryClient.invalidateQueries({ queryKey: ["personal-requests"] });
            await queryClient.invalidateQueries({ queryKey: ["appointmentsAtCalendar"] });
            handleSuccessModal("Agendamento Recusado", "O agendamento foi recusado.");
        }).catch((error) => {
            console.error("Erro ao recusar o agendamento:", error);
        });
    }

    async function registerAbsenceAppointment(data: { type: string; description: string }) {
        const payload = {
            idAgendamento: appointmentId,
            tipoUsuario: data.type,
            descricaoCancelamento: data.description === "" ? null : data.description
        };
        console.log("Payload de ausência:", payload);
        await reportAbsencePersonal(payload).then(async () => {
            await queryClient.invalidateQueries({ queryKey: ["appointmentDetails"] });
            await queryClient.invalidateQueries({ queryKey: ["personal-requests"] });
            await queryClient.invalidateQueries({ queryKey: ["appointmentsAtCalendar"] });
            handleSuccessModal("Ausência Registrada", "A ausência foi registrada com sucesso.");
        }).catch((error) => {
            console.error("Erro ao registrar a ausência:", error);
        });
    }

    function handleConcludeAppointment(id: number) {
        concludeAppointment(id).then(async () => {
            await queryClient.invalidateQueries({ queryKey: ["personal-requests"] });
            await queryClient.invalidateQueries({ queryKey: ["appointmentDetails"] });
            await queryClient.invalidateQueries({ queryKey: ["appointmentsAtCalendar"] });
            handleSuccessModal("Agendamento Concluído", "O agendamento foi concluído com sucesso.");
        }).catch((error) => {
            console.error("Erro ao concluir o agendamento:", error);
        });
    }

    function handleModal(id: number, type: modalTypes) {
        setAppointmentId(id);
        setOpenModal(type);
    }


    const appointments = useQuery({
        queryKey: ["appointmentsAtCalendar"],
        queryFn: () => appointmentAtCalendar(),
    })



    return (
        <>
            <div className={styles.containerCheckSchedule}
            >
                <div className={styles.titleFilter}>
                    <h1>Solicitações de Agendamentos</h1>

                    <div className="grid grid-cols-4 w-full gap-5 flex-wrap">

                        <CheckScheduleKpis
                            title="Total pendente"
                            value={requests.length}
                        />
                        <CheckScheduleKpis
                            title="Vence hoje"
                            value={requests.length}
                            color="#F59E0B"
                        />
                        <CheckScheduleKpis
                            title="Reagendados hoje"
                            value={requests.length}
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
                            selectTypeAulaValue={filterSearch}
                            onSelectTypeAulaChange={setFilterSearch}
                            onClear={clearFilters}
                            hasFilters={hasFilters}
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
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-[#192633] border-b border-slate-200 dark:border-[#324d67]">
                                    <TableHeader title="Status" />
                                    <TableHeader title="Aluno" />
                                    <TableHeader title="Data" />
                                    <TableHeader title="Tipo de agendamento" />
                                    <TableHeader title="Endereço" />
                                    <TableHeader title="Ações" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-[#324d67]">
                                {filteredData.map(card => (
                                    <tr className="transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-300/30 text-amber-700 dark:text-amber-700 border border-amber-200 dark:border-amber-800/50">
                                                {card.status === "CONCLUIDO" && "Agendamento concluído"}
                                                {card.status === "student_pending" && "Pendente resposta do aluno"}
                                                {card.status === "PENDENTE_PERSONAL_APROVACAO" && "Pendente resposta do personal"}
                                                {card.status === "PENDENTE_CLIENTE_APROVACAO" && "Pendente resposta do aluno"}
                                                {card.status === "APROVADO" && "Aprovado"}
                                                {card.status === "PENDENTE_PERSONAL_CONCLUIR" && "Pendente (conclusão)"}
                                                {card.status === "CANCELADO_PERSONAL" && "Cancelado pelo personal"}
                                                {card.status === "CANCELADO_CLIENTE" && "Cancelado pelo cliente"}
                                                {card.status === "AUSENCIA_CLIENTE" && "Ausência (cliente)"}
                                                {card.status === "AUSENCIA_PERSONAL" && "Ausência (personal)"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {/* <div className="size-9 rounded-full bg-cover bg-center border border-slate-200 dark:border-slate-700" data-alt="Client John Doe" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAfHv68KBe-qLlaeFS2kPIeLtswk1es_nWFt6M85nfrkmDptfdp4wWAID1-reBpAFDEAXnBkAZG25gffeTvpC83zXyhLacPDwd-DBXb7d2xU2_4qweEGFoQlW2NS6_sqOdM6xFvSEm0d1kU8zcXD85krZI92f2jI1h4nFW8MLyMMvbYgsPQlgF_d-oploV7G1CboVNZunG_Q27KzcBNhBDI-mYn23iLFJRStSeEv5SxJjIN7tg3cRu_2hzlHjvF10gSb1gDENT5JIU");'></div> */}
                                                <span className="text-sm font-semibold text-slate-900">{card.nome}</span>
                                            </div>
                                        </td>
                                        <TableRow text={format(parseISO(card.dataInicio), "dd/MM/yyyy HH:mm")} />
                                        <TableRow text={card.tipoAula} />
                                        <TableRow text={card.endereco.cep.logradouro + ", " + card.endereco.numero + " - " + card.endereco.cep.bairro} />
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
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isFetchingNextPage && <p>Carregando mais...</p>}
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
                        rescheduleId={appointmentId}
                        clickedDate={clickedDate}
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