import { User } from 'lucide-react'
import { UserImg } from '../UserImg/UserImg'
import { BASE_URL } from '../../system';
import { getUserImage } from '../../constants/user';
import { useQuery } from '@tanstack/react-query';

export default function UserAvatar() {
  const userImage = useQuery({
    queryKey: ['userImage'],
    queryFn: () => getUserImage(),
    select: (response) => {
      if (response.data) {
        return `${BASE_URL}/usuarios/me/imagem`;
      }
      return undefined;
    },
    retry: false,
  })

  return (

    <>
      {userImage.data ?
        <UserImg
          Source={userImage.data || ""}
          Height={216}
          Width={216}
          Alt="foto"
        />
        :
        <User width={216} height={216} />
      }
    </>
  )
}
