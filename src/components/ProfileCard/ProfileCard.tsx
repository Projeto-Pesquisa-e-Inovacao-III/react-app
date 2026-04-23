import React from "react";
import classNames from "classnames";
import styles from "./ProfileCard.module.css";
import UserAvatar from "../UserAvatar/UserAvatar";
import Skeleton from "react-loading-skeleton";

type ProfileField = {
    icon?: React.ReactNode;
    label: string;
    value: React.ReactNode;
    isLoading?: boolean;
}

type ProfileCardProps = {
    name?: string;
    photoUrl?: string;
    isLoading?: boolean;
    statusPill?: {
        text: string;
        isActive: boolean;
    };
    fields: ProfileField[];
    className?: string;
}

export default function ProfileCard({ name, photoUrl, isLoading, statusPill, fields, className }: ProfileCardProps) {
    return (
        <div className={classNames(styles.profileCard, className)}>
            <div className={styles.profileCover}>
                <div className={styles.profileAvatarWrapper}>
                    <UserAvatar 
                        imgClassName="w-[80px]! h-[80px]!" 
                        userName={name} 
                        withUsernameClassName="w-[80px]! h-[80px]! text-2xl!" 
                        foto={photoUrl} 
                    />
                </div>
            </div>
            
            <div className={styles.profileInfo}>
                {isLoading ? (
                    <Skeleton width={120} height={24} style={{ marginBottom: 12 }} />
                ) : (
                    <h2 className={styles.userName}>{name}</h2>
                )}
                
                {statusPill && (
                    isLoading ? (
                        <Skeleton width={100} height={28} borderRadius={999} />
                    ) : (
                        <div className={classNames(styles.statusPill, { [styles.statusPillInactive]: !statusPill.isActive })}>
                            {statusPill.text}
                        </div>
                    )
                )}
            </div>

            {fields && fields.length > 0 && (
                <div className={styles.userFieldsList}>
                    {fields.map((field, index) => (
                        <div key={index} className={styles.userField}>
                            <div className={styles.fieldLabelGroup}>
                                {field.icon && <span className={styles.fieldIconWrapper}>{field.icon}</span>}
                                <span className={styles.fieldLabel}>{field.label}</span>
                            </div>
                            {field.isLoading ? <Skeleton width={60} /> : <span className={styles.fieldValue}>{field.value}</span>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
