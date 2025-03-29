import { DefaultSession, DefaultUser } from 'next-auth';


declare module "next-auth" {
  // user 인터페이스 확장
  interface User extends DefaultUser {
    backendJwt?: string;
    userId: number;
    nickname: string;
    profileImageUrl?: string;
  }

  interface Session{
    user: {
      backendJwt?: string;
      userId?:number;
      nickname?:string;
      profileImageUrl?: string;
    } & DefaultSession["user"]
  }
}


declare module "next-auth/jwt" {
  interface JWT {
    backendJwt?: string;
    userId?: number;
    nickname?: string;
    profileImageUrl?: string;
  }
}

export {};