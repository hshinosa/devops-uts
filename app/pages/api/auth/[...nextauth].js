import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { executeQuery } from '../../../lib/db';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Find user in database
          const users = await executeQuery(
            'SELECT * FROM users WHERE username = ?',
            [credentials.username]
          );

          if (users.length === 0) {
            throw new Error('User not found');
          }

          const user = users[0];

          // Verify password
          const isValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isValid) {
            throw new Error('Invalid password');
          }

          // Return user object (will be stored in session)
          return {
            id: user.id,
            username: user.username,
            email: user.email,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'devops-secret-key-2025',
};

export default NextAuth(authOptions);
