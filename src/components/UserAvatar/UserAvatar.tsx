import { User } from 'lucide-react'
import { UserImg } from '../UserImg/UserImg'
import { BASE_URL } from '../../system';
import { getUserImage } from '../../constants/user';
import { useQuery } from '@tanstack/react-query';
import styles from "./UserAvatar.module.css"
import Skeleton from 'react-loading-skeleton';

interface UserAvatarProps {
  foto?: string;
  userName?: string;
  useUserImage?: boolean;
  useUsername?: boolean;
  imgClassName?: string;
  isLoading?: boolean;
}

export default function UserAvatar({ foto, userName, useUserImage, useUsername = false, imgClassName, isLoading = false }: UserAvatarProps) {

  const userImage = useQuery({
    queryKey: ['userImage'],
    queryFn: () => getUserImage(),
    select: (response) => {
      if (!useUserImage) return undefined;
      
      if (response.data) {
        return `${BASE_URL}/usuarios/me/imagem`;
      }

      return undefined;
    },
    retry: false,
  })

  console.log(foto, "foto")

  return (
    <div className={styles.userAvatar + (useUsername ? " " + styles.withUsername : "")}>
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
        <User width={216} height={216} color='#000' />
      }
    </div>
  )
}
