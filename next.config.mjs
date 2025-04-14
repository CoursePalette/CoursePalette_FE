const s3Hostname = process.env.S3_IMAGE_HOSTNAME;

const remotePatterns = [
  {
    protocol: 'https',
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
  images: {
    remotePatterns: remotePatterns,
  },
};

export default nextConfig;
