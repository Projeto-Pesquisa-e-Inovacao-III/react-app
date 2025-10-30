
export type Notification = {
    id?: number;
    notifications: NotificationProps[];

}

export type NotificationProps = {
    notificationTitle: string;
    message: string;
    icon?: React.ReactNode;
    date: string;
    isRead?: boolean;
}