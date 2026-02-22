import axios, { AxiosResponse } from "axios";
import { Filter } from "./components/filters";

export class Api {
	private static api = axios.create({
		baseURL: "http://localhost:8000",
		withCredentials: true,
	});

	static async add_climb(formData: FormData): Promise<AxiosResponse> {
		return this.api.post("/add_climb", formData);
	}
	static async get_filtered_climbs(filters: Filter): Promise<AxiosResponse> {
		return this.api.post("/filtered_climbs", filters);
	}
}
