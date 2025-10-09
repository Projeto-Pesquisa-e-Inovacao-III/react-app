import HeaderIconsMobile from "../../HeaderIconsMobile";
import "./style.css"

export default function UserHeaderMobile() {
    return (
        <header className="user-header-mobile">
            <HeaderIconsMobile icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 21V13C15 12.7348 14.8946 12.4804 14.7071 12.2929C14.5196 12.1054 14.2652 12 14 12H10C9.73478 12 9.48043 12.1054 9.29289 12.2929C9.10536 12.4804 9 12.7348 9 13V21" stroke="#E5E7EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M3 9.99999C2.99993 9.70906 3.06333 9.42161 3.18579 9.15771C3.30824 8.8938 3.4868 8.65979 3.709 8.47199L10.709 2.47199C11.07 2.1669 11.5274 1.99951 12 1.99951C12.4726 1.99951 12.93 2.1669 13.291 2.47199L20.291 8.47199C20.5132 8.65979 20.6918 8.8938 20.8142 9.15771C20.9367 9.42161 21.0001 9.70906 21 9.99999V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V9.99999Z" stroke="#E5E7EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>}
                pageTitle="Perfil" />

            <HeaderIconsMobile icon={
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.5 2V6" stroke="#B8B8B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M16.5 2V6" stroke="#B8B8B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M19.5 4H5.5C4.39543 4 3.5 4.89543 3.5 6V20C3.5 21.1046 4.39543 22 5.5 22H19.5C20.6046 22 21.5 21.1046 21.5 20V6C21.5 4.89543 20.6046 4 19.5 4Z" stroke="#B8B8B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M3.5 10H21.5" stroke="#B8B8B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            }
                pageTitle="Agenda" />

            <HeaderIconsMobile icon={
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.5 3H4.5C3.94772 3 3.5 3.44772 3.5 4V9C3.5 9.55228 3.94772 10 4.5 10H9.5C10.0523 10 10.5 9.55228 10.5 9V4C10.5 3.44772 10.0523 3 9.5 3Z" stroke="#B8B8B8" stroke-width="2" stroke-linecap="round" />
                    <path d="M9.5 14H4.5C3.94772 14 3.5 14.4477 3.5 15V20C3.5 20.5523 3.94772 21 4.5 21H9.5C10.0523 21 10.5 20.5523 10.5 20V15C10.5 14.4477 10.0523 14 9.5 14Z" stroke="#B8B8B8" stroke-width="2" stroke-linecap="round" />
                    <path d="M20.5 3H15.5C14.9477 3 14.5 3.44772 14.5 4V9C14.5 9.55228 14.9477 10 15.5 10H20.5C21.0523 10 21.5 9.55228 21.5 9V4C21.5 3.44772 21.0523 3 20.5 3Z" stroke="#B8B8B8" stroke-width="2" stroke-linecap="round" />
                    <path d="M20.5 14H15.5C14.9477 14 14.5 14.4477 14.5 15V20C14.5 20.5523 14.9477 21 15.5 21H20.5C21.0523 21 21.5 20.5523 21.5 20V15C21.5 14.4477 21.0523 14 20.5 14Z" stroke="#B8B8B8" stroke-width="2" stroke-linecap="round" />
                </svg>

            }
                pageTitle="Pacotes" />

            <HeaderIconsMobile icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 21V19C19 17.9391 18.5786 16.9217 17.8284 16.1716C17.0783 15.4214 16.0609 15 15 15H9C7.93913 15 6.92172 15.4214 6.17157 16.1716C5.42143 16.9217 5 17.9391 5 19V21" stroke="#B8B8B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#B8B8B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

            }
                pageTitle="Sua conta" />
        </header >
    );
}
