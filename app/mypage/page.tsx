'use client';

import CancelButton from '@/components/atoms/CancelButton';
import ProfileImageInput from '@/components/atoms/ProfileImageInput';
import RegisterButton from '@/components/atoms/RegisterButton';
import TextInput from '@/components/atoms/TextInput';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';

import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';

import { checkLogin } from '@/lib/checkLogin';

export default function MypagePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [profileImg, setProfileImg] = useState('');
  const [nickname, setNickname] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user?.backendJwt) {
      checkLogin(router);
    } else {
      setProfileImg(session.user.profileImageUrl!);
      setNickname(session.user.nickname!);
    }
  }, [
    router,
    session?.user?.backendJwt,
    session?.user.nickname,
    session?.user.profileImageUrl,
    status,
  ]);

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    const newUrl = URL.createObjectURL(file);
    setProfileImg(newUrl);
  };

  const handleCancel = () => {
    router.back();
  };

  const handleRegister = () => {
    if (!canRegister()) {
      Swal.fire({
        title: '등록 불가',
        text: '닉네임 및 프로필 이미지를 확인해주세요.',
        icon: 'error',
      });
      return;
    }
  };

  const canRegister = () => {
    if (!nickname.trim()) return false;
    if (!selectedFile && !profileImg) return false;

    return true;
  };

  return (
    <form className='w-full h-full flex flex-col items-center pt-[70px] px-[20px] pb-[20px] '>
      <h1 className='text-[24px] font-semibold'>마이페이지</h1>
      <fieldset className='w-[365px] md:w-[700px] flex flex-col mt-[20px] gap-[20px]'>
        <ProfileImageInput
          profileImg={profileImg}
          onFileChange={handleFileChange}
        />
        <TextInput
          infoText={'닉네임을 입력하세요.'}
          placeholder={'닉네임을 입력해주세요'}
          value={nickname}
          setValue={setNickname}
        />
        <div className='mt-[50px] w-full flex justify-between'>
          <CancelButton onClick={handleCancel} />
          <RegisterButton onClick={handleRegister} disabled={!canRegister()} />
        </div>
      </fieldset>
    </form>
  );
}
