export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <h1 className='text-2xl font-bold text-[#0064FF]'>
        페이지를 찾을 수 없습니다
      </h1>
      <p className='mt-4 text-gray-600'>
        요청하신 페이지가 존재하지 않거나 삭제되었을 수 있습니다.
      </p>
    </div>
  );
}
