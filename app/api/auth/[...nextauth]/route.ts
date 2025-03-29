/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendKakaoProfile } from '@/api/kakao';
import NextAuth, { Account, NextAuthOptions, Profile, User } from 'next-auth';
import KakaoProvider from 'next-auth/providers/kakao';


interface KakaoProfile extends Profile {
  id?: number;
  properties?: {
    nickname?: string;
    profile_image?: string;
    [key:string]: any;
  };
}

interface SignInParams {
  user: User;
  account?: Account | null;
  profile?: KakaoProfile;
  email?: { verificationRequest?: boolean };
  credentials?: Record<string, any>;
}





const authOptions: NextAuthOptions = {
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({user,profile}:SignInParams) {
      if(!profile) {
        console.log("🚀 profile 없음 :", profile)
        return false};

      const kakaoId = profile.id as number;
      const nickname = profile.properties?.nickname ?? '';
      const profileImageUrl = profile.properties?.profile_image ?? '';

      try {
        const result = await sendKakaoProfile(kakaoId, nickname, profileImageUrl);
        console.log("🚀 sendKakaoProfile:", result)

        // jwt 콜백에서 user에 값을 담기 위함
        user.backendJwt = result.token; 
  user.userId = result.userId; 
  user.nickname = result.nickname; 
  user.profileImageUrl = result.profileImageUrl;
  return true;
      } catch (error) {
        console.error("에러 Kakao signIn -> Spring Boot:", error);
        return false;
      }
    },

    async jwt({token, user}) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const u = user as any;
      if(u?.backendJwt) {
        token.backendJwt = u.backendJwt;
      }
      if (u?.userId) {
        token.userId = u.userId;
      }
      if(u?.nickname) {
        token.nickname = u.nickname;
      }
      if(u?.profileImageUrl) {
        token.profileImageUrl = u.profileImageUrl;
      }
      console.log("JWT(token): ", token);
      return token;
    },

    // 세션 조회 시 호출 useSession 등
    async session({session, token}) {
      console.log("session(session): ", session);
      console.log("session(token): ", token);
      session.user = {
        ...session.user,
        backendJwt: token.backendJwt,
        userId: token.userId,
        nickname: token.nickname,
        profileImageUrl: token.profileImageUrl
      }
      console.log("session(session): ", session);
      return session;
    }
  },
  



  // JWT 토큰 만료 시간 등 설정
  // jwt: {
  //   maxAge: 60 * 60, // 1시간
  // },
  // session: {
  //   // strategy: 'jwt',
  //   maxAge: 60 * 60, // 1시간
  // },



};

const handler = NextAuth(authOptions);
export {handler as GET, handler as POST};


