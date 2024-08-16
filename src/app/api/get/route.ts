import { getSessionFromReq } from "@/middlewares/authMiddleware"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  let session = await getSessionFromReq(req)
  console.log("cfm", session)
  if (session) {
    return Response.json({"success": true, "data": session.serialise()})
  } else {
    return Response.json({"success": false})
  }
}