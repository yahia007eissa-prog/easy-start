import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id:       string;
      jobTitle?: string;
      phone?:    string;
      age?:      number;
    } & DefaultSession['user'];
  }
}
