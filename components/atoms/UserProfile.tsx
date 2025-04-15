import Image from 'next/image';

interface UserProfileProps {
  nickname: string;
  profileImageUrl: string;
}

export default function UserProfile({
  nickname,
  profileImageUrl,
}: UserProfileProps) {
  return (
    <section className='flex items-center gap-[7px]'>
      <Image
        src={profileImageUrl}
        alt='유저 프로필 사진'
        width={30}
        height={30}
        className='rounded-[50px]'
        aria-label='유저 프로필 사진'
        priority={false}
      />
      <span className='text-[14px] font-medium' aria-label='유저 닉네임'>
        {nickname}
      </span>
    </section>
  );
}
