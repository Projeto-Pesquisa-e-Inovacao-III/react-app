import classNames from 'classnames'
import { HeartPulse, Shield, User } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import styles from './AsideEditUser.module.css'

export default function AsideEditUser(props: { activeTab: "edituser" | "anamnesis" | "security" }) {
    return (
        <aside className={styles.aside}>
            <nav className={styles.nav}>
                <Link to="/edit-user"
                    className={classNames(styles.link, props.activeTab === "edituser" ? styles.linkActive : styles.linkInactive)}
                >
                    <User />
                    Informações Pessoais
                </Link>

                <Link to="/edit-user/anamnesis"
                    className={classNames(styles.link, props.activeTab === "anamnesis" ? styles.linkActive : styles.linkInactive)}
                >
                    <HeartPulse />
                    Anamnese / Saúde
                </Link>
                
                <Link
                    to="/edit-user/security"
                    className={classNames(styles.link, props.activeTab === "security" ? styles.linkActive : styles.linkInactive)}
                >
                    <Shield />
                    Segurança
                </Link>
            </nav>
        </aside>
    )
}
