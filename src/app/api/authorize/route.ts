import { serialize } from 'cookie';
import { signIn } from "@/app/lib/authenticator";
import { COOKIE_SESSION_NAME } from '@/middlewares/authMiddleware';

export async function POST(req: Request) {
  try {
    const data: {token: string} = await req.json()
    const providedToken: string = data.token
    console.log("providedToken", providedToken)

    // create actor
    let sessionId = await signIn(providedToken)
    console.log("sessionId", sessionId)
    if (sessionId == null) {
      // invalid token supplied
      throw Error("Failed to authenticate due to invalid token")
    }


    // build response
    const headers = new Headers();
    headers.append(
      'Set-Cookie',
      serialize(COOKIE_SESSION_NAME, sessionId, {
        path: '/', // Adjust path as needed
        httpOnly: true, // Secure flag
        secure: true, // Secure flag (for HTTPS)
      })
    );

    let resp = new Response(null, {status: 200, headers})
    return resp
  } catch (err) {
    console.log("error!", err)
    return Response.json({message: "Invalid body"}, {status: 400})
  }
}