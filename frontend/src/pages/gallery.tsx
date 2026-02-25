import { Climb } from "@/const";
import { useEffect, useState } from "react";
import { Api } from "@/api";
import GalleryItem from "@/components/gallery_item";
import { Select, SelectItem } from "@heroui/select";
import { Grade } from "@/types";
import FiltersModal, { Filter } from "@/components/filters_modal";
import { Button } from "@heroui/button";
import { PlusIcon } from "@/components/icons";
import AddItemModal from "@/components/add_item_modal";
import { useDisclosure } from "@heroui/modal";

type SortField = "date_new_to_old" | "date_old_to_new" | "grade_high_to_low" | "grade_low_to_high";

export default function GalleryPage() {
	const { isOpen, onOpenChange } = useDisclosure();

	const [climbs, setClimbs] = useState<Climb[]>([]);
	const [sortField, setSortField] = useState<SortField>("date_new_to_old");
	const [refresh, setRefresh] = useState<boolean>(true);
	const [filters, setFilters] = useState<Filter>({
		video: undefined,
		complete: undefined,
		flash: undefined,
		favorite: undefined,
		grades: [],
		opinions: [],
		colors: [],
		walls: [],
		styles: [],
	});

	useEffect(() => {
		Api.get_filtered_climbs(filters).then((response) => {
			setClimbs(response.data);
		});
	}, [filters, refresh]);

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
		<>
			<header className="flex justify-between items-center p-4 w-full">
				<h1 className="font-bold text-5xl">Gallery</h1>
				<span className="flex items-center gap-3">
					<p className="font-semibold">
						{climbs.length} {climbs.length == 1 ? "Result" : "Results"}
					</p>
					<FiltersModal setFilters={setFilters} />
					<Select
						label="Sort By"
						className="w-36"
						color="primary"
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
				</span>
			</header>
			{sortedClimbs.length == 0 ? (
				<div className="flex justify-center items-center h-[80vh]">
					<h1 className="text-gray-500 text-4xl">Nothing matches filters :(</h1>
				</div>
			) : (
				<div className="gap-2 grid grid-cols-6 px-2 pb-2">
					{sortedClimbs.map((climb) => (
						<GalleryItem key={climb.id} climb={climb} setRefresh={setRefresh} />
					))}
				</div>
			)}

			<Button
				onPress={onOpenChange}
				isIconOnly
				radius="full"
				color="primary"
				data-hover={false}
				className="right-6 bottom-6 z-10 fixed hover:bg-blue-400 w-16 h-16"
			>
				<PlusIcon size={36} />
			</Button>
			<AddItemModal isOpen={isOpen} onOpenChange={onOpenChange} setRefresh={setRefresh} />
		</>
	);
}
