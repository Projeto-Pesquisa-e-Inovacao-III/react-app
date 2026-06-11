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
  withUsernameClassName?: string;
  isLoading?: boolean;
  rightIcon?: React.ReactNode;
  customImageUrl?: string;
}

export default function UserAvatar({ foto, userName, useUserImage, useUsername = false, imgClassName, withUsernameClassName, isLoading = false, rightIcon, customImageUrl }: UserAvatarProps) {
  const userImage = useQuery({
    queryKey: ['userImage', foto ?? userName],
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

  function getInitials(name: string) {
    return name.charAt(0).toUpperCase()
  }
  const resolvedImage = useUserImage ? userImage.data : undefined;

  return (
    <div className={classNames(styles.userAvatar, { [styles.withUsername]: useUsername })}>
      {useUsername && !isLoading && <p className={styles.username}>{userName}</p>}
      {useUsername && isLoading && <Skeleton width={120} height={20} style={{ margin: '0 10px' }} />}

      {customImageUrl || resolvedImage || foto ?
        <UserImg
          Source={customImageUrl ?? (foto ? `${BASE_URL}/usuarios${foto}` : resolvedImage ?? "")} Height={216}
          Width={216}
          Alt="foto"
          classname={imgClassName}
        />
        :
        <div className={classNames(styles.userWithoutAvatar, { [styles.withUsername]: useUsername }, withUsernameClassName)}>
          {getInitials(userName || "")}
        </div>
      }
      {rightIcon && <div className={styles.rightIcon}>{rightIcon}</div>}
    </div>
  )
}
