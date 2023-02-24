import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      // Built-in properties
        name?: string | null
        email?: string | null
        image?: string | null
        // Custom properties
        username?: string | null
    }
  }
}