import './UserImg.css';

type UserImgProps = {
    Source : string;
    Alt    : string;
    Height?: number;
    Width?: number;
};

export function UserImg({Source, Alt, Height, Width}: UserImgProps) {
    return (
        <>
            <img
                className="user-img"
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