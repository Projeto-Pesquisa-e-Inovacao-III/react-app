import classNames from "classnames";
import useMobile from "../../../hooks/isMobile";
import styles from "../ViewPersonalData/ViewPersonalData.module.css";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import UserAvatar from "../../../components/UserAvatar/UserAvatar";
import { differenceInYears, parse } from "date-fns";
import Skeleton from "react-loading-skeleton";
import { getPersonalById } from "../../../constants/personal";

export default function ViewPersonalData() {
    const isMobile = useMobile();
    const [params] = useSearchParams();
    const personalId = params.get("id");

    const personal = useQuery({
        queryKey: ['personalData', personalId],
        queryFn: () => getPersonalById(personalId || ""),
        enabled: !!personalId,
        select: (res) => res.data,
    });

    const age = personal.data?.dataNascimento
        ? differenceInYears(new Date(), parse(personal.data?.dataNascimento, "yyyy-MM-dd", new Date()))
        : "N/A";

    return (
        <>
            <div className={classNames(styles.container, { [styles.containerMobile]: isMobile })}>
                <div className={styles.content}>

                    <div className={styles.pageHeader}>
                        <h1 className={styles.pageTitle}>Dados &amp; Anamnese</h1>
                    </div>

                    <div className={styles.mainGrid}>

                        <div className={styles.profileCard}>
                            <UserAvatar imgClassName="w-32! h-32!" userName={personal.data?.nome} withUsernameClassName="w-32! h-32! text-3xl!" foto={personal.data?.caminhoFoto} />
                            <div className={styles.userNameBlock}>
                                {personal.isLoading ? <Skeleton width={100} height={18} /> : <p className={styles.userName}>{personal.data?.nome}</p>}
                            </div>
                            <div className={styles.userFieldsList}>
                                <div className={styles.userField}>
                                    <span className={styles.fieldLabel}>IDADE</span>
                                    {personal.isLoading ? <Skeleton width={60} height={16} /> : <span className={styles.fieldValue}>{age} anos</span>}
                                </div>
                                <div className={styles.userField}>
                                    <span className={styles.fieldLabel}>EMAIL</span>
                                    {personal.isLoading ? <Skeleton width={140} height={16} /> : <span className={styles.fieldValue}>{personal.data?.email}</span>}
                                </div>
                                <div className={styles.userField}>
                                    <span className={styles.fieldLabel}>TELEFONE</span>
                                    {personal.isLoading ? <Skeleton width={110} height={16} /> : <span className={styles.fieldValue}>{personal.data?.telefones[0]?.numeroCompleto}</span>}
                                </div>
                                <div className={styles.userField}>
                                    <span className={styles.fieldLabel}>CREF</span>
                                    {personal.isLoading ? <Skeleton width={110} height={16} /> : <span className={styles.fieldValue}>{personal.data?.cref}</span>}
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </>
    );
}