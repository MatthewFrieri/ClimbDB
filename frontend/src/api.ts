import axios, { AxiosResponse } from "axios";

export class Api {
	private static api = axios.create({
		baseURL: "http://localhost:8000",
		withCredentials: true,
	});

	static async add_climb(formData: FormData): Promise<AxiosResponse> {
		return this.api.post("/add_climb", formData);
	}
}
