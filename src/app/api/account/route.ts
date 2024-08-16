import getActor from "@/lib/spotify-wrapper";
import { getSessionFromReq } from "@/middlewares/authMiddleware";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  let session = await getSessionFromReq(req)
  if (session == null) {
    return new Response(null, { status: 401 }) // not authorised
  }

  return Response.json(session.profile, { status: 200 })
}