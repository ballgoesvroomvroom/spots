import { getSessionFromReq } from "@/middlewares/authMiddleware"

export async function GET(req: Request) {
  let session = await getSessionFromReq(req)
  console.log("cfm", session)
  if (session) {
    return Response.json({"success": true, "data": session.serialise()})
  } else {
    return Response.json({"success": false})
  }
}