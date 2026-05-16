import classNames from "classnames";
import useMobile from "../../../hooks/isMobile";
import styles from "../ViewPersonalData/ViewPersonalData.module.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { differenceInYears, parse } from "date-fns";
import { getPersonalById } from "../../../constants/personal";
import { useEffect } from "react";
import { Calendar, Mail, Phone, Briefcase, ArrowLeft } from "lucide-react";
import ProfileCard from "../../../components/ProfileCard/ProfileCard";
import AdminActionsCard from "../../../components/AdminActionsCard/AdminActionsCard";

export default function ViewPersonalData() {
    const isMobile = useMobile();
    const [params] = useSearchParams();
    const personalId = params.get("id");


    const personal = useQuery({
        queryKey: ['personalData', personalId],
        queryFn: () => getPersonalById(personalId || ""),
        enabled: !!personalId,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        select: (res) => res.data,
    });

    const navigate = useNavigate();
    useEffect(() => {
        if (personal.data && !personal.data?.ativo) {
            navigate("/users");
        }
    }, [personalId, navigate, personal.data]);

    const age = personal.data?.dataNascimento
        ? differenceInYears(new Date(), parse(personal.data?.dataNascimento, "yyyy-MM-dd", new Date()))
        : "Não informado";

    const userId = Number(personalId);
    const isAtivo = personal.data?.ativo ?? true;
    const roles: string[] = personal.data?.roles || [];

    return (
        <div className={classNames(styles.container, { [styles.containerMobile]: isMobile })}>
            <div className={styles.content}>

                <div className={styles.pageHeader}>
                    <Link to="/users" className={styles.backLink}>
                        <ArrowLeft size={16} />
                        Voltar
                    </Link>
                    <h1 className={styles.pageTitle}>Dados &amp; Anamnese</h1>
                </div>

                <div className={styles.mainGrid}>
                    <ProfileCard
                        name={personal.data?.nome}
                        photoUrl={personal.data?.caminhoFoto}
                        isLoading={personal.isLoading}
                        className="w-96"
                        statusPill={{
                            text: isAtivo ? "Ativo" : "Inativo",
                            isActive: isAtivo
                        }}
                        fields={[
                            {
                                icon: <Calendar size={16} />,
                                label: "Idade",
                                value: age,
                                isLoading: personal.isLoading
                            },
                            {
                                icon: <Mail size={16} />,
                                label: "Email",
                                value: personal.data?.email,
                                isLoading: personal.isLoading
                            },
                            {
                                icon: <Phone size={16} />,
                                label: "Telefone",
                                value: personal.data?.telefones?.[0]?.numeroCompleto || "-",
                                isLoading: personal.isLoading
                            },
                            {
                                icon: <Briefcase size={16} />,
                                label: "CREF",
                                value: personal.data?.cref || "-",
                                isLoading: personal.isLoading
                            }
                        ]}
                    />

                    <AdminActionsCard 
                        userId={userId} 
                        roles={roles} 
                        refetch={personal.refetch} 
                    />
                </div>
            </div>
        </div>
    );
}