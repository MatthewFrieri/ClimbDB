import { Climb } from "@/const";
import { useEffect, useState } from "react";
import { Api } from "@/api";
import GalleryItem from "@/components/gallery_item";
import { Select, SelectItem } from "@heroui/select";
import { Grade } from "@/types";

type SortField = "date_new_to_old" | "date_old_to_new" | "grade_high_to_low" | "grade_low_to_high";

export default function GalleryPage() {
	const [climbs, setClimbs] = useState<Climb[]>([]);
	const [sortField, setSortField] = useState<SortField>("date_new_to_old");

	useEffect(() => {
		Api.get_all_climbs().then((response) => {
			setClimbs(response.data);
		});
	}, []);

	const sortClimbs = (a: Climb, b: Climb) => {
		const field = sortField.split("_")[0] as "date" | "grade";
		const aRaw: string = a[field];
		const bRaw: string = b[field];
		let aValue: number;
		let bValue: number;

		if (sortField.includes("date")) {
			aValue = new Date(aRaw).getTime();
			bValue = new Date(bRaw).getTime();
		} else {
			aValue = Number((aRaw == Grade.VB ? "V-1" : aRaw == Grade.V_ ? "V-2" : aRaw).slice(1));
			bValue = Number((bRaw == Grade.VB ? "V-1" : bRaw == Grade.V_ ? "V-2" : bRaw).slice(1));
		}

		const reverse = sortField.includes("old_to") || sortField.includes("low_to") ? 1 : -1;

		if (aValue < bValue) return -1 * reverse;
		if (aValue > bValue) return 1 * reverse;
		return 0;
	};
	const sortedClimbs = [...climbs].sort(sortClimbs);

	return (
		<div className="bg-black">
			<header className="z-10 fixed flex justify-between items-center p-4 w-full h-20">
				<h1 className="font-semibold text-white text-5xl">Gallery</h1>
				<span className="flex items-center gap-3">
					<p className="text-white">Sort By</p>
					<div className="flex items-center">
						<Select
							aria-label="sort by"
							className="w-36"
							labelPlacement="outside-left"
							selectedKeys={new Set([sortField])}
							onSelectionChange={(keys) => {
								const key = Array.from(keys)[0] as SortField;
								if (!key) return;
								setSortField(key);
							}}
						>
							<SelectItem key="date_new_to_old">Date (new)</SelectItem>
							<SelectItem key="date_old_to_new">Date (old)</SelectItem>
							<SelectItem key="grade_high_to_low">Grade (high)</SelectItem>
							<SelectItem key="grade_low_to_high">Grade (low)</SelectItem>
						</Select>
					</div>
				</span>
			</header>

			<div className="gap-2 grid grid-cols-6 px-2 pt-24 pb-2">
				{sortedClimbs.map((climb) => (
					<GalleryItem climb={climb} key={climb.id} />
				))}
			</div>
		</div>
	);
}
