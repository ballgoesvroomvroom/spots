"use client";

import Image from "next/image";
import { redirectToAuthCodeFlow } from "./spotify-client-wrapper";

async function fetchProfile(token: string): Promise<any> {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}


export default function Connect() {
  return (
    <main className="hero min-h-screen">
      <div className="hero-content text-center">
        <div className="xl:max-w-xl">
          <h1 className="text-3xl font-bold">Connect to your Spotify account.</h1>
          <button className="btn btn-outline btn-primary my-6" onClick={redirectToAuthCodeFlow}>Connect</button>
        </div>
      </div>
    </main>
  );
}
