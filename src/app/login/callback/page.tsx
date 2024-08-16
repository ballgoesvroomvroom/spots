"use client";

import { useEffect } from "react";
import { clientId, redirectURL, redirectToAuthCodeFlow, getAccessToken } from "../spotify-client-wrapper";

export default function callback() {
    console.log("HELLO")
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code: string | null = params.get("code");

        if (!code) {
            redirectToAuthCodeFlow();
        } else {
            getAccessToken(code).then(token => {
                if (token == null) {
                    // unable to retrieve token
                    console.log("FAILED TO RETRIEVE TOKEN", code)
                    return
                } else {
                    // let sessionId = signIn(token)
                    fetch("/api/authorize", {
                        method: "POST",
                        body: JSON.stringify({
                            token: token
                        })
                    }).then(r => {
                        if (r.status === 200) {
                            window.location.href = "/account"
                        } else {
                            return Promise.reject(r.status)
                        }
                    }).catch(err => {
                        console.log("Unable to connect", err)
                        window.location.href = "/login" // try again
                    })
                }
            });
        }
    }, [])
}