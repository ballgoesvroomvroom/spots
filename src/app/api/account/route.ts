import getActor from "@/lib/spotify-wrapper";
import { getSessionFromReq } from "@/middlewares/authMiddleware";

export async function GET(req: Request) {
  let session = await getSessionFromReq(req)
  if (session == null) {
    return new Response(null, { status: 401 }) // not authorised
  }

  return Response.json(session.profile, { status: 200 })
}