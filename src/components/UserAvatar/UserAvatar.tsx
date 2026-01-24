import { User } from 'lucide-react'
import { UserImg } from '../UserImg/UserImg'
import { BASE_URL } from '../../system';
import { getUserImage } from '../../constants/user';
import { useQuery } from '@tanstack/react-query';
import styles from "./UserAvatar.module.css"

interface UserAvatarProps {
  foto?: string;
  useUserImage?: boolean;
  useUsername?: boolean;
}

export default function UserAvatar({ foto, useUserImage, useUsername = false }: UserAvatarProps) {

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
  return (
    <div className={styles.userAvatar + (useUsername ? " " + styles.withUsername : "")}>
      {useUsername && <p>nome</p>}

      {userImage.data || foto ?
        <UserImg
          Source={`${foto ? `${BASE_URL}/usuarios/foto/${foto}` : userImage.data || ""}`}
          Height={216}
          Width={216}
          Alt="foto"
        />
        :
        <User width={216} height={216} />
      }
    </div>
  )
}
