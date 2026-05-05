import React from 'react';
import styles from "./HeaderIconsMobile.module.css";

export default function HeaderIconsMobile({ icon, pageTitle }: { icon: React.ReactElement, pageTitle: string }) {
    return (
        <div className={styles.headerIconsMobile}>
            {icon}
            <span>{pageTitle}</span>
        </div>
    );
}
