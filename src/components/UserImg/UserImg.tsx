import { Oval } from 'react-loader-spinner';
import './UserImg.css';

type UserImgProps = {
    Source : string;
    Alt    : string;
    Height?: number;
    Width?: number;
    classname?: string;
};

export function UserImg({Source, Alt, Height, Width, classname}: UserImgProps) {
    return (
        <>
            <img
                className={`user-img ${classname}`}
                src={Source}
                alt={Alt}
                style={{
                    width: Width,
                    height: Height,
                    borderRadius: '100%',
                    objectFit: 'cover'
                }}
            />
        </>
    );
}