import { UserImg } from '../UserImg/UserImg'
import { BASE_URL } from '../../system';
import { getUserImage } from '../../constants/user';
import { useQuery } from '@tanstack/react-query';
import styles from "./UserAvatar.module.css"
import Skeleton from 'react-loading-skeleton';
import classNames from 'classnames';

interface UserAvatarProps {
  foto?: string;
  userName?: string;
  useUserImage?: boolean;
  useUsername?: boolean;
  imgClassName?: string;
  isLoading?: boolean;
  rightIcon?: React.ReactNode;
}

export default function UserAvatar({ foto, userName, useUserImage, useUsername = false, imgClassName, isLoading = false, rightIcon }: UserAvatarProps) {
  const userImage = useQuery({
    queryKey: ['userImage'],
    queryFn: () => getUserImage(),
    select: (response) => {

      if (response.data) {
        return `${BASE_URL}/usuarios/me/imagem`;
      }
      return undefined;
    },
    enabled: useUserImage,
    retry: false,
  })

  console.log(foto)
  console.log(userImage.data)
  
  function getInitials(name: string) {
    console.log("rodou")
    return name.charAt(0).toUpperCase()
  }


  return (
    <div className={classNames(styles.userAvatar, { [styles.withUsername]: useUsername })}>
      {useUsername && !isLoading && <p className={styles.username}>{userName}</p>}
      {useUsername && isLoading && <Skeleton width={120} height={20} style={{ margin: '0 10px' }} />}

      {userImage.data || foto ?
        <UserImg
          Source={`${foto ? `${BASE_URL}/usuarios/foto/${foto}` : userImage.data || ""}`}
          Height={216}
          Width={216}
          Alt="foto"
          classname={imgClassName}
        />
        :
        <div className={classNames(styles.userWithoutAvatar, { [styles.withUsername]: useUsername })}>
          {getInitials(userName || "")}
        </div>
      }
      {rightIcon && <div className={styles.rightIcon}>{rightIcon}</div>}
    </div>
  )
}
