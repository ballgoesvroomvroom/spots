import { sql } from '@vercel/postgres';
import { Session, SessionNaive } from "@/lib/session"

export type UserDetails = {
	name: string
}

export type AudioFeatures = {
	acousticness: number;
	analysis_url: string;
	danceability: number;
	duration_ms: number;
	energy: number;
	id: string;
	instrumentalness: number;
	key: number;
	liveness: number;
	loudness: number;
	mode: number;
	speechiness: number;
	tempo: number;
	time_signature: number;
	track_href: string;
	type: string;
	uri: string;
	valence: number;
};


export class Actor {
	private token: string
	ready: boolean
	profile: UserDetails | undefined

	constructor(accessToken: string) {
		this.token = accessToken
		this.ready = false
	}

	async init(trusted?: boolean, profile?: UserDetails): Promise<boolean> {
		if (trusted === true) {
			this.profile = profile
			this.ready = true
			return true
		}

		this.profile = await this.getProfileDetails()
		if (this.profile) {
			this.ready = true
		}

		return this.ready
	}

	async getProfileDetails(): Promise<UserDetails | undefined> {
		const result = await fetch("https://api.spotify.com/v1/me", {
			method: "GET",
			headers: {
				Authorization: `Bearer ${this.token}`
			}
		})

		console.log("FETCH PROFILE", result)

		if (result.status === 401) {
			// invalid token
			return
		}

		const data = await result.json()
		console.log("data", data)

		if (data && typeof data.display_name === 'string') {
			return { name: data.display_name };
		}

		return
	}

	async getTopTracks(): Promise<any> {
		const urlParams = new URLSearchParams()
		urlParams.append("limit", "50")

		const result = await fetch(`https://api.spotify.com/v1/me/top/tracks?${urlParams.toString()}`, {
			method: "GET", headers: { Authorization: `Bearer ${this.token}`}
		})

		return await result.json()
	}

	async getTrackFeatures(trackIds: string[]): Promise<{[id: string]: AudioFeatures}> {
		// build query
		let query = "SELECT * FROM audio_features WHERE id IN"
		let queryParametised = ""
		for (let i = 0; i < trackIds.length; i++) {
			queryParametised += `$${i +1}, `
		}
		query = `${query} (${queryParametised.slice(0, queryParametised.length -2)})`

		// query database
		const { rows }: {rows: AudioFeatures[]} = await sql.query(query, trackIds)

		const data: {[id: string]: AudioFeatures} = {}
		for (let row of rows) {
			data[row.id] = row
		}

		let uncachedIds: {[id: string]: AudioFeatures} = {} // store entry for trackIds not yet in database
		for (let trackId of trackIds) {
			if (data[trackId] != null) {
				// already exists
				continue
			}

			const result = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
				method: "GET", headers: { Authorization: `Bearer ${this.token}`}
			})

			if (result.status == 200) {
				data[trackId] = await result.json()
				uncachedIds[trackId] = data[trackId]
			}
		}

		console.log("PUSHING", uncachedIds)

		for (let trackId of Object.keys(uncachedIds)) {
			let features = data[trackId]
			await sql`
			    INSERT INTO audio_features (
			        acousticness,
			        analysis_url,
			        danceability,
			        duration_ms,
			        energy,
			        id,
			        instrumentalness,
			        key,
			        liveness,
			        loudness,
			        mode,
			        speechiness,
			        tempo,
			        time_signature,
			        track_href,
			        type,
			        uri,
			        valence
			    ) VALUES (
			        ${features.acousticness}, 
			        ${features.analysis_url}, 
			        ${features.danceability}, 
			        ${features.duration_ms}, 
			        ${features.energy}, 
			        ${features.id}, 
			        ${features.instrumentalness}, 
			        ${features.key}, 
			        ${features.liveness}, 
			        ${features.loudness}, 
			        ${features.mode}, 
			        ${features.speechiness}, 
			        ${features.tempo}, 
			        ${features.time_signature}, 
			        ${features.track_href}, 
			        ${features.type}, 
			        ${features.uri}, 
			        ${features.valence}
			    )
			`;
		}

		return data
	}

	serialise(): SessionNaive | undefined {
		if (this.ready && this.profile) {
			return {
				token: this.token,
				profile: this.profile
			}
		}
	}
}

export default async function getActor(session: Session): Promise<Actor> {
	const actor = new Actor(session.token)
	const valid = await actor.init(true, session.profile)

	return actor
}