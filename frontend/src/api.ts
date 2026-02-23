import axios, { AxiosResponse } from "axios";
import { Filter } from "./components/filters";
import { BACKEND_URL } from "./const";

export class Api {
	private static api = axios.create({
		baseURL: BACKEND_URL,
		withCredentials: true,
	});

	static async add_climb(formData: FormData): Promise<AxiosResponse> {
		return this.api.post("/add_climb", formData);
	}
	static async get_filtered_climbs(filters: Filter): Promise<AxiosResponse> {
		return this.api.post("/filtered_climbs", filters);
	}
}
