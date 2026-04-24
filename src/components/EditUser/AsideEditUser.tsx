import classNames from 'classnames'
import { HeartPulse, MapPin, Shield, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import styles from './AsideEditUser.module.css'
import { useContext } from 'react';
import { TypeContext } from '../../App';

export default function AsideEditUser(props: { activeTab: "edituser" | "anamnesis" | "security" | "addresses" }) {
    const type = useContext(TypeContext);

    return (
        <aside className={styles.aside}>
            <nav className={styles.nav}>
                <Link to="/edit-user"
                    className={classNames(styles.link, props.activeTab === "edituser" ? styles.linkActive : styles.linkInactive)}
                >
                    <User />
                    Informações Pessoais
                </Link>

                {type?.type?.includes("aluno") && (
                    <Link to="/edit-user/anamnesis"
                        className={classNames(styles.link, props.activeTab === "anamnesis" ? styles.linkActive : styles.linkInactive)}
                    >
                        <HeartPulse />
                        Anamnese / Saúde
                    </Link>
                )}

                <Link
                    to="/edit-user/security"
                    className={classNames(styles.link, props.activeTab === "security" ? styles.linkActive : styles.linkInactive)}
                >
                    <Shield />
                    Segurança
                </Link>

                {type?.type?.includes("aluno") && (
                    <Link
                        to="/edit-user/addresses"
                        className={classNames(styles.link, props.activeTab === "addresses" ? styles.linkActive : styles.linkInactive)}
                    >
                        <MapPin />
                        Endereços
                    </Link>
                )}
            </nav>
        </aside >
    )
}
