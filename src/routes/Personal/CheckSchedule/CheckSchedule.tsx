import { CardCheckSchedule } from "../../../components/CardCheckSchedule/CardCheckSchedule";
import { CardFilterCheckSchedule } from "../../../components/CardFilterCheckSchedule/CardFilterCheckSchedule";
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
        searchName: item => [item.nome, format(item.dataInicio, "dd/MM/yyyy")],
    });


    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.get("date")) {
            console.log("Appointments data:", searchParams.get("date"));
            const date = parseISO(searchParams.get("date") || "");
            setFilterSearch(format(date, "dd/MM/yyyy", { locale: ptBR }));
        }
    }, []);


    async function handleSuccessReschedule() {
        await queryClient.invalidateQueries({ queryKey: ["appointmentDetails"] });
        await queryClient.resetQueries({ queryKey: ["personalRequests"] });
        await queryClient.invalidateQueries({ queryKey: ["appointmentsAtCalendar"] });
        handleSuccessModal("Reagendamento Concluído", "O agendamento foi reagendado com sucesso.");
    }

    async function acceptAppointment(id: number) {
        await acceptUserAppointment(id).then(async (res) => {
            console.log("Agendamento aceito:", res);
            await queryClient.invalidateQueries({ queryKey: ["appointmentDetails"] });
            await queryClient.resetQueries({ queryKey: ["personalRequests"] });
            await queryClient.invalidateQueries({ queryKey: ["appointmentsAtCalendar"] });
            handleSuccessModal("Agendamento Aceito", "O agendamento foi aceito com sucesso.");
        }).catch((error) => {
            console.error("Erro ao concluir o agendamento:", error);
        });
    }

    async function declineAppointment(id: number) {
        await refuseAppointment(id).then(async () => {
            await queryClient.invalidateQueries({ queryKey: ["appointmentDetails"] });
            await queryClient.resetQueries({ queryKey: ["personalRequests"] });
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
            await queryClient.resetQueries({ queryKey: ["personalRequests"] });
            await queryClient.invalidateQueries({ queryKey: ["appointmentsAtCalendar"] });
            handleSuccessModal("Ausência Registrada", "A ausência foi registrada com sucesso.");
        }).catch((error) => {
            console.error("Erro ao registrar a ausência:", error);
        });
    }

    function handleConcludeAppointment(id: number) {
        concludeAppointment(id).then(async () => {
            await queryClient.invalidateQueries({ queryKey: ["appointmentDetails"] });
            await queryClient.resetQueries({ queryKey: ["personalRequests"] });
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
                    <div className={styles.cardFilter}>
                        <CardFilterCheckSchedule
                            searchValue={filterSearch}
                            onSearchChange={setFilterSearch}
                            selectStatusValue={filterStatus}
                            onSelectStatusChange={setFilterStatus}
                            onClear={clearFilters}
                            hasFilters={hasFilters}
                        />
                    </div>
                </div>

                <div className={styles.cardsCheckSchedule}>
                    {requests.map(card => (
                        <CardCheckSchedule
                            key={card.agendamentoId}
                            id={card.agendamentoId}
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
                        typeUser={type}

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