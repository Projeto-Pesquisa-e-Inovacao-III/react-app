import { User } from 'lucide-react'
import React, { useEffect } from 'react'
import { UserImg } from '../UserImg/UserImg'
import { BASE_URL } from '../../system';
import { getUserImage } from '../../constants/user';

export default function UserAvatar() {
  const [userImage, setUserImage] = React.useState<string>("");
  useEffect(() => {
    getUserImage().then((response) => {
      setUserImage(response.data);
    }).catch((error) => {
      console.error("Error fetching user image:", error);
    });
  }, []);

  return (

    <>
      {userImage ?
        <UserImg
          Source={userImage}
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
