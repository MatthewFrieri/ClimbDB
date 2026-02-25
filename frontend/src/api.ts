import axios, { AxiosResponse } from "axios";
import { Filter } from "./components/filters_modal";
import { BACKEND_URL } from "./const";
import { Revision } from "./components/edit_modal";

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

	static async edit_climb(id: number, revision: Revision): Promise<AxiosResponse> {
		return this.api.patch(`/edit_climb/${id}`, revision);
	}

	static async delete_climb(id: number): Promise<AxiosResponse> {
		return this.api.delete(`/delete_climb/${id}`);
	}
}
