'use client';

import {
  getPresignedUrl,
  updateUserProfile,
  uploadImageToS3,
} from '@/apis/user';
import CancelButton from '@/components/atoms/CancelButton';
import Loading from '@/components/atoms/Loading';
import ProfileImageInput from '@/components/atoms/ProfileImageInput';
import RegisterButton from '@/components/atoms/RegisterButton';
import TextInput from '@/components/atoms/TextInput';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';

import { useRouter } from 'next/navigation';

import { useCallback, useEffect, useRef, useState } from 'react';

import { checkLogin } from '@/lib/checkLogin';

export default function MypagePage() {
  const router = useRouter();
  const { data: session, status, update: updateSession } = useSession();
  const [profileImg, setProfileImg] = useState(''); // 초기에는 세션값이고 변경시 blob url
  const [originalProfileImg, setOriginalProfileImg] = useState(''); // 원본 이미지 (변경 없을 시 적용한다.)
  const [nickname, setNickname] = useState('');
  const [originalNickname, setOriginalNickname] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentBlobUrl = useRef<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const initialNickname = session.user.nickname ?? '';
      const initialProfileImg = session.user.profileImageUrl ?? '';
      setNickname(initialNickname);
      setOriginalNickname(initialNickname);
      setProfileImg(initialProfileImg);
      setOriginalProfileImg(initialProfileImg);
    } else if (status === 'unauthenticated') {
      checkLogin(router);
    }
  }, [router, session, status]);

  const handleFileChange = useCallback((file: File) => {
    setSelectedFile(file);

    // 이전 blob 해제
    if (currentBlobUrl.current) {
      URL.revokeObjectURL(currentBlobUrl.current);
    }

    // 새 blob url 생성
    const newUrl = URL.createObjectURL(file);
    setProfileImg(newUrl);
    currentBlobUrl.current = newUrl;
  }, []);

  useEffect(() => {
    return () => {
      if (currentBlobUrl.current) {
        URL.revokeObjectURL(currentBlobUrl.current);
      }
    };
  }, []);

  // presigned 요청
  const presignedUrlMutation = useMutation({
    mutationFn: getPresignedUrl,
    onError: (error) => {
      console.error('Presigned url 요청 실패', error);
      Swal.fire('오류', '이미지 업로드 준비 중 오류가 발생했습니다.', 'error');
      setIsLoading(false);
    },
  });

  // 프로필 업데이트
  const updateProfileMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: async (data, variables) => {
      console.log('프로필 업데이트 성공 : ', data);
      Swal.fire(
        '프로필 업데이트 성공',
        '프로필이 성공적으로 업데이트 되었습니다.',
        'success'
      );

      // 세션 업데이트 진행
      await updateSession({
        nickname: variables.nickname,
        profileImageUrl: variables.profileImageUrl,
      });

      // 상태 업뎃
      setOriginalNickname(variables.nickname);
      setOriginalProfileImg(variables.profileImageUrl);
      setSelectedFile(null);
      if (currentBlobUrl.current) {
        setProfileImg(variables.profileImageUrl);
        URL.revokeObjectURL(currentBlobUrl.current);
        currentBlobUrl.current = null;
      }
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('프로필 업데이트 실패', error);
      Swal.fire('오류', '프로필 업데이트 중 오류가 발생했습니다.', 'error');
      setIsLoading(false);
    },
  });

  const handleCancel = useCallback(() => {
    setNickname(originalNickname);
    setProfileImg(originalProfileImg);
    setSelectedFile(null);
    if (currentBlobUrl.current) {
      URL.revokeObjectURL(currentBlobUrl.current);
      currentBlobUrl.current = null;
    }
    router.back();
  }, [router, originalNickname, originalProfileImg]);

  const handleRegister = useCallback(async () => {
    if (!canRegister()) {
      Swal.fire({
        title: '등록 불가',
        text: '닉네임 및 프로필 이미지를 확인해주세요.',
        icon: 'error',
      });
      return;
    }

    if (!session?.user?.backendJwt) {
      checkLogin(router);
      return;
    }

    setIsLoading(true);

    let finalProfileImageUrl = originalProfileImg;

    try {
      // 만약 새 파일이 선택됨 -> presigned url 요청 -> s3 업로드
      if (selectedFile) {
        const presignedData = await presignedUrlMutation.mutateAsync({
          fileName: selectedFile.name,
          contentType: selectedFile.type,
        });
        console.log('s3 업로드시 데이터 : ', presignedData, selectedFile);
        // s3 업로드
        await uploadImageToS3(presignedData.presignedUrl, selectedFile);

        finalProfileImageUrl = presignedData.imageUrl; // 최종 업로드할 url 백엔드에서 받음
      }

      updateProfileMutation.mutateAsync({
        nickname: nickname,
        profileImageUrl: finalProfileImageUrl,
      });
    } catch (error) {
      console.error('이미지 처리 또는 프로필 업데이트 중 오류:', error);

      if (!presignedUrlMutation.isError && !updateProfileMutation.isError) {
        Swal.fire(
          '오류',
          '이미지 업로드 또는 처리 중 문제가 발생했습니다.',
          'error'
        );
      }
      setIsLoading(false);
    }
  }, [
    nickname,
    originalNickname,
    profileImg,
    originalProfileImg,
    selectedFile,
    session,
    router,
    presignedUrlMutation,
    updateProfileMutation,
  ]);

  const canRegister = useCallback(() => {
    if (
      !nickname.trim() &&
      nickname.trim().length < 1 &&
      nickname.trim().length > 10 &&
      nickname !== originalNickname
    )
      return false;
    if (!selectedFile) return false;
    return true;
  }, [nickname, originalNickname, selectedFile]);

  if (
    status === 'loading' ||
    (status === 'authenticated' && !originalNickname && !originalProfileImg)
  ) {
    return <Loading />;
  }

  return (
    <form className='w-full h-full flex flex-col items-center pt-[70px] px-[20px] pb-[20px] '>
      <h1 className='text-[24px] font-semibold'>마이페이지</h1>
      <fieldset className='w-[365px] md:w-[700px] flex flex-col mt-[20px] gap-[20px]'>
        <ProfileImageInput
          profileImg={profileImg}
          onFileChange={handleFileChange}
        />
        <TextInput
          infoText={'닉네임을 입력하세요. (1글자 ~ 10글자)'}
          placeholder={'닉네임은 1글자 ~ 10글자 입니다.'}
          value={nickname}
          setValue={setNickname}
        />
        <div className='mt-[50px] w-full flex justify-between'>
          <CancelButton onClick={handleCancel} />
          <RegisterButton
            onClick={handleRegister}
            disabled={!canRegister() || isLoading}
          />
        </div>
      </fieldset>
    </form>
  );
}
