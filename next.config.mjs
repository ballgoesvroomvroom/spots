/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	env: {
		ENV_MODE: process.env.ENV_MODE,
		SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID
	}
};

export default nextConfig;
