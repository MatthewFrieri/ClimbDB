import axios, { AxiosResponse } from "axios";
import { Filter } from "./components/filters_modal";
import { BACKEND_URL } from "./const";
import { Revision } from "./components/edit_modal";

export class Api {
	private static api = axios.create({
		baseURL: BACKEND_URL,
		withCredentials: true,
	});

	// Climbs
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

	// Charts
	static async date_heatmap_data(ids: number[]): Promise<AxiosResponse> {
		return this.api.post("/charts/date_heatmap_data", ids);
	}
	static async grade_lineplot_data(ids: number[]): Promise<AxiosResponse> {
		return this.api.post("/charts/grade_lineplot_data", ids);
	}
	static async grade_histogram_data(ids: number[]): Promise<AxiosResponse> {
		return this.api.post("/charts/grade_histogram_data", ids);
	}
	static async opinion_data(ids: number[]): Promise<AxiosResponse> {
		return this.api.post("/charts/opinion_data", ids);
	}
	static async color_data(ids: number[]): Promise<AxiosResponse> {
		return this.api.post("/charts/color_data", ids);
	}
	static async style_radar_data(ids: number[]): Promise<AxiosResponse> {
		return this.api.post("/charts/style_radar_data", ids);
	}
	static async style_histogram_data(ids: number[]): Promise<AxiosResponse> {
		return this.api.post("/charts/style_histogram_data", ids);
	}
	static async wall_data(ids: number[]): Promise<AxiosResponse> {
		return this.api.post("/charts/wall_data", ids);
	}
}
