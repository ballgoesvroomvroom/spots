import { getSessionFromReq } from "@/middleware"

export async function GET(req: Request) {
  let session = await getSessionFromReq(req)
  console.log("cfm", session)
  if (session) {
    return Response.json({"success": true, "data": session.serialise()})
  } else {
    return Repsonse.json({"success": false})
  }
}