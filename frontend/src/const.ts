import { Color, type components } from "@/types";

type Schemas = components["schemas"];

export type Climb = Schemas["Climb"];

export function capitalize(str: string): string {
	if (!str) return "";
	return str
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export const formatDate = (dateStr: string) => {
	const [year, month, day] = dateStr.split("-").map(Number);
	return new Date(year, month - 1, day).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

export function formatFileSize(bytes: number) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(2)} KB`;
	if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
	return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

export const colorMapping: Record<Color, string> = {
	[Color.red]: "fill-[#db0202]",
	[Color.orange]: "fill-[#eb6405]",
	[Color.yellow]: "fill-[#f5d400]",
	[Color.green]: "fill-[#178000]",
	[Color.teal]: "fill-[#8ee8dc]",
	[Color.blue]: "fill-[#0855c9]",
	[Color.purple]: "fill-[#4c13a1]",
	[Color.pink]: "fill-[#f774e8]",
	[Color.black]: "fill-[#242424]",
	[Color.white]: "fill-[#eeeeee]",
};
