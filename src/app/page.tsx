"use client";

import Image from "next/image";

export default function Home() {
  return (
    <main className="hero min-h-screen">
      <div className="hero-content text-center">
        <div className="xl:max-w-xl">
          <h1 className="md:text-6xl text-3xl font-bold">Sick and tired of Spotify's recommendation?</h1>
          <h2 className="md:text-5xl text-3xl font-bold mt-4">Try Spot.</h2>
          <p className="py-6">
            A different recommendation algorithm based built on Spotify's own dataset.
          </p>
          <button className="btn btn-outline btn-primary" onClick={(e) => {window.location.href="/login"}}>Get Started</button>
        </div>
      </div>
    </main>
  );
}
