import { kv } from '@vercel/kv';
import { randomBytes } from 'crypto';
import { cookies } from 'next/headers';
import { decrypt, encrypt } from '@/lib/encrypt';
import { UserDetails } from '@/lib/spotify-wrapper';

export type SessionNaive = {
  token: string,
  profile: UserDetails
}

export class Session {
  token: string
  profile: UserDetails

  constructor(token: string, profile: UserDetails) {
    this.token = token
    this.profile = profile
  }

  serialise(): SessionNaive {
    return {
      token: this.token,
      profile: this.profile
    }
  }
}

const generateUniqueSessionId = async (): Promise<string | undefined> => {
  for (let i = 0; i < 1000; i++) {
    const sessionId = randomBytes(32).toString('hex');

    // check if generated id exists
    const exists = await kv.get(sessionId);

    if (exists == null) {
      return sessionId; // return the sessionId if it's unique
    } else if (i === 999) {
      return
    }
  }
};

export const getSession = async (sessionId: string): Promise<Session | null> => {
  let sessionData: SessionNaive | null = await kv.get(sessionId);
  console.log("obtained string", sessionData, typeof sessionData)
  if (sessionData != null) {
    return new Session(sessionData.token, sessionData.profile)
  }
  return null
};

export const setSession = async (session: Session): Promise<string | null> => {
  const sessionId = await generateUniqueSessionId()
  if (sessionId == null) {
    // unable to generate unique ID
    return null
  }

  console.log("\nwriting", sessionId, session.serialise())
  await kv.set(sessionId, session.serialise(), {
    ex: 3600 // expire after 3600 seconds (1 hour)
  });

  return sessionId
};

export const removeSession = async (sessionId: string) => {
  await kv.del(sessionId);
};