"use client";

import Image from "next/image";

export const clientId: string = "84dedfb61b7b47f68326212f81c4f155";
export const redirectURL: string = "http://localhost:3000/login/callback"

export async function redirectToAuthCodeFlow() {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    console.log("INITIAL VERIFIER", verifier)
    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", redirectURL);
    params.append("scope", "user-read-private user-read-email");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length: number) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier: string) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

export async function getAccessToken(code: string): Promise<string | undefined> {
    const verifier = localStorage.getItem("verifier");

    console.log("code", code)
    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", redirectURL);
    params.append("code_verifier", verifier!);

    try {
        const result = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params
        });

        if (result.status !== 200) {
            throw new Error("Unable to retrieve token")
        }

        const { access_token } = await result.json();
        return access_token;
    } catch (err) {
        return
    }

}

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
