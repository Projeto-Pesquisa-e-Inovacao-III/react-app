import React from 'react';

export default function HeaderIconsMobile({ icon, pageTitle }: { icon: React.ReactElement, pageTitle: string }) {
    return (
        <div className="header-icons-mobile">
            {icon}
            <span>{pageTitle}</span>
        </div>
    );
}
