/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	env: {
		ENV_MODE: process.env.ENV_MODE
	}
};

export default nextConfig;
