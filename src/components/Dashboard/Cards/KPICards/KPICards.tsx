import { Card, CardContent, Typography } from "@mui/material";
import "./style.css"

export default function KPICards({ isMobile, value, description, icon, title, isFull }: { isMobile: boolean; value: string; description?: string; icon: React.ReactNode; title?: string; isFull?: boolean }) {
    return (
        <div className={`${isFull ? "kpi-card-dashboard full" : "kpi-card-dashboard"} ${isMobile && isFull ? "kpi-mobile" : ""}`}>
            <Card>
                <CardContent>
                    <div className={`wrapper-details-kpi-dashboard`}>
                        {isMobile && !isFull && <div className="icon-kpi-dashboard">{icon}</div>}
                        {isFull && <Typography variant="h5">{title}</Typography>}
                        <Typography variant="h4">{value}</Typography>
                        {isMobile && <Typography variant="body1">{description}</Typography>}
                    </div>
                    {isFull && <div className="icon-kpi-dashboard">{icon}</div>}
                </CardContent>
            </Card>
        </div>
    );
}