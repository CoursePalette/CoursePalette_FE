'use client';

import { MdEdit } from 'react-icons/md';
import Swal from 'sweetalert2';

import Image from 'next/image';

import { useRef } from 'react';

import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface ProfileImageInputProps {
  profileImg: string;
  onFileChange: (file: File) => void;
}

export default function ProfileImageInput({
  profileImg,
  onFileChange,
}: ProfileImageInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        title: '파일 선택 실패',
        text: 'jpg, jpeg, png 파일만 가능합니다.',
        icon: 'error',
      }).then(() => {
        return;
      });
    }

    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      Swal.fire({
        title: '파일 선택 실패',
        text: '파일 크기는 5MB 미만이어야 합니다.',
        icon: 'error',
      }).then(() => {
        return;
      });
    }

    if (onFileChange) {
      onFileChange(file);
    }
  };

  return (
    <div className='w-full flex flex-col gap-[20px]'>
      <Label htmlFor='text' className='font-semibold text-[20px]'>
        프로필 사진을 수정해보세요.
      </Label>
      <div
        className='w-[150px] h-[150px] relative cursor-pointer'
        onClick={handleClick}
      >
        <Image
          src={profileImg}
          alt='유저 프로필 이미지'
          width={150}
          height={150}
          className='rounded-full  w-[150px] h-[150px]'
          unoptimized
        />
        <div className='absolute bottom-[20px] right-0 w-[30px] h-[30px] border border-white rounded-full bg-black flex items-center justify-center'>
          <MdEdit size={20} color='white' />
        </div>
      </div>
      <Input
        type='file'
        accept='image/jpeg, image/png, image/jpg'
        ref={fileInputRef}
        onChange={handleFileChange}
        className='hidden'
      />
    </div>
  );
}
