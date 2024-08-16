"use client"

import React, { useState, useEffect, useRef } from 'react';

export default function Account() {
    const [data, setData] = useState([]);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [currentEntryId, setCurrentEntryId] = useState<string | null>(null); // Track the currently previewed entry
    const [progresses, setProgresses] = useState<{[entryId: string]: number}>({}); // Track progress for each entry
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("/api/account/tracks", { method: "GET" });
                if (response.status === 200) {
                    const result = await response.json();
                    console.log("RESULT", result);
                    setData(result);
                } else {
                    console.error('Failed to fetch data', response.status);
                }
            } catch (error) {
                console.error('Error fetching data', error);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        const audio: HTMLAudioElement | null = audioRef.current;
        if (audio) {
            if (previewUrl.length >= 1) {
                audio.currentTime = 0; // Reset playback position
                audio.load();
                audio.play().catch(err => {
                    console.log(`[ERROR]:`, err);
                });
            } else {
                audio.pause();
                audio.currentTime = 0;
            }
        }
    }, [previewUrl]);

    useEffect(() => {
        const audio: HTMLAudioElement | null = audioRef.current;
        const interval = setInterval(() => {
            if (audio != null && currentEntryId) {
                const currentTime = audio.currentTime;
                const duration = audio.duration;
                if (duration) {
                    setProgresses(prevProgresses => ({
                        ...prevProgresses,
                        [currentEntryId]: (currentTime / duration) * 100,
                    }));
                }
            }
        }, 50); // update every 50ms

        return () => clearInterval(interval);
    }, [currentEntryId]);

    let rank = 0;
    return (
        <>
            <audio ref={audioRef} preload="auto">
                <source src={previewUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center 2xl:grid-cols-5">
                {data.map((entry: {id: string, albumImages: {url: string}[], name: string, preview: string, open: string}) => {
                    rank++;
                    return (
                        <div key={entry.id} className="card bg-base-100 image-full shadow-xl bg-black">
                            <figure>
                                <img
                                    src={entry.albumImages[0].url}
                                    alt="Shoes"
                                />
                            </figure>
                            <div className="card-body bg-black/40">
                                <div className="flex justify-between items-start">
                                    <h2 className="card-title">{entry.name}</h2>
                                    {previewUrl && (
                                        <div
                                            className="radial-progress"
                                            style={{
                                            	"visibility": (currentEntryId === entry.id ? "visible" : "hidden"),
                                            	// @ts-ignore
                                                "--value": (currentEntryId === entry.id && progresses[entry.id]) || 0,
                                                "--size": "2rem",
                                            }}
                                            role="progressbar"
                                        >
                                        </div>
                                    )}
                                </div>
                                <p>Rank #{rank}</p>
                                <div className="card-actions justify-end">
                                    {entry.preview ? (
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => {
                                            	if (entry.preview === previewUrl) {
                                            		setPreviewUrl("")
                                            		setCurrentEntryId(null)
                                            	} else {
	                                                setPreviewUrl(entry.preview);
	                                                setCurrentEntryId(entry.id); // Set the current entry id
                                            	}
                                            }}
                                        >
                                            Preview
                                        </button>
                                    ) : null}
                                    <button className="btn btn-primary" onClick={() => window.open(entry.open)}>Play</button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
