import getActor from "@/lib/spotify-wrapper";
import { getSessionFromReq } from "@/middlewares/authMiddleware";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  let session = await getSessionFromReq(req)
  if (session == null) {
    return new Response(null, { status: 401 }) // not authorised
  }

  let actor = await getActor(session)
  let result = await actor.getTopTracks()

  if (result == null) {
    return new Response(null, { status: 500 }) // server error
  }

  let trackIds: string[] = []
  for (let i = 0; i < result.items.length; i++) {
    let track = result.items[i]
    trackIds.push(track.id)
  }

  console.log("trackIds", trackIds)
  console.log("pushing")
  const data = actor.getTrackFeatures(trackIds)
  console.log("data!", data)

  // create return payload
  let payload = result.items.map((e: any) => {
    return {
      id: e.id,
      name: e.name,
      albumImages: e.album.images,
      preview: e.preview_url,
      open: e.external_urls.spotify
    }
  })

  return Response.json(payload, { status: 200 })
}