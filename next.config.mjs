const s3Hostname = process.env.S3_IMAGE_HOSTNAME;

const remotePatterns = [
  {
    protocol: 'https',
    hostname: 'k.kakaocdn.net',
    port: '',
    pathname: '/**',
  },
  {
    protocol: 'http',
    hostname: 'k.kakaocdn.net',
    port: '',
    pathname: '/**',
  },
  ...(s3Hostname
    ? [
        {
          protocol: 'https',
          hostname: s3Hostname,
          port: '',
          pathname: '/user-profiles/**', // 경로 지정 권장
        },
      ]
    : []),
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true, // gzip 압축 활성화
  images: {
    remotePatterns: remotePatterns,
    formats: ['image/avif', 'image/webp'], // 이미지 최적화
  },

  async headers() {
    return [
      {
        // JS/CSS/폰트/이미지 등 변경 적은 리소스들을 장기 캐싱하도록 설정
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // public 디렉토리 내 폰트/이미지도 캐싱 적용 예시
        source: '/(.*)\\.(woff2|png|jpg|jpeg|gif|svg|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
