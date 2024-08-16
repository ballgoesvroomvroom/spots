"use server";

import { Session } from "@/lib/session";
import { Actor } from "@/lib/spotify-wrapper";
import { removeSession, setSession } from "@/lib/session";

export const signIn = async (accessToken: string): Promise<string | null> => {
  console.log("AT", accessToken)
  const actor = new Actor(accessToken)
  const valid = await actor.init()

  if (valid === false || actor.profile == null) {
    // invalid access token
    return null
  }

  let sessionId = await setSession(new Session(accessToken, actor.profile))
  return sessionId
};