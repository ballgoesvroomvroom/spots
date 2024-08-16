import { SessionNaive } from "@/lib/session"

export type UserDetails = {
	name: string
}

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

	serialise(): SessionNaive | undefined {
		if (this.ready && this.profile) {
			return {
				token: this.token,
				profile: this.profile
			}
		}
	}
}