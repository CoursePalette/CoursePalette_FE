'use client';

import { truncateText } from '@/lib/utils';

interface CustomPinProps {
  title: string;
  address: string;
  route: string;
  id: string;
}

export default function CustomPin({
  title,
  address,
  route,
  id,
}: CustomPinProps) {
  return (
    <div
      id={id}
      data-route={route}
      className='map-pin'
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: '500',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100px',
          height: '40px',
          borderRadius: '5px',
          border: '1px solid #D3E4FF',
          fontSize: '10px',
          overflow: 'hidden',
        }}
      >
        <p
          style={{
            color: '#0064FF',
            textAlign: 'center',
            backgroundColor: '#D3E4FF',
            width: '100%',
            height: '20px',
            lineHeight: '20px',
          }}
        >
          {truncateText(title)}
        </p>
        <p
          style={{
            color: 'black',
            textAlign: 'center',
            backgroundColor: 'white',
            width: '100%',
            height: '20px',
            lineHeight: '20px',
          }}
        >
          {truncateText(address)}
        </p>
      </div>
      <img
        src='/images/pin.png'
        alt='map pin'
        style={{ width: '30px', height: '40px' }}
      />
    </div>
  );
}
