import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import supabase from "../../../utils/supabase";

export const authOptions = (req) => ({
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            // Below forces the user to always be prompted to consent to the app
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
        }),
        // ...add more providers here
    ],
    callbacks: {
        async jwt({ token, account, profile }) {
            // Persist the user's username to the token after sign in
            if (account) {
                token.id = await getID(profile.email);
                token.username = await getUsername(profile.email);
            }
            return token;
        },
        async session({ session, token }) {
            // Add property to session, like username
            session.user.id = token.id;
            session.user.username = token.username;
            return session;
        },
    },
});

// Get the ID from the email
async function getID(email) {
    const { data, error } = await supabase.from("users").select("id").eq("email", email).maybeSingle();
    if (error) console.log("%cError in getID(%s): " + (error.details || error.message), "color: red; font-size: 1.5rem;", email);
    // Return the username or null if not found
    return data ? data.id : null;
}

// Get the username from the email
async function getUsername(email) {
    const { data, error } = await supabase.from("users").select("username").eq("email", email).maybeSingle();
    if (error)
        console.log("%cError in getUsername(%s): " + (error.details || error.message), "color: red; font-size: 1.5rem;", email);
    // Return the username or null if not found
    return data ? data.username : null;
}

const handler = (req, res) => NextAuth(req, res, authOptions(req));

export default handler;
