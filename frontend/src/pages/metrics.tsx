import { Api } from "@/api";
import ColorHistogram from "@/components/charts/color_pie";
import DateHeatmap from "@/components/charts/date_heatmap";
import GradeHistogram from "@/components/charts/grade_histogram";
import GradeLineplot from "@/components/charts/grade_lineplot";
import OpinionHistogram from "@/components/charts/opinion_histogram";
import StyleHistogram from "@/components/charts/style_histogram";
import StyleRadar from "@/components/charts/style_radar";
import WallHistogram from "@/components/charts/wall_histogram";
import FiltersModal, { Filter } from "@/components/filters_modal";
import { Climb } from "@/const";
import { useEffect, useState } from "react";

export default function MetricsPage() {
	const [climbIds, setClimbIds] = useState<number[]>([]);
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
			setClimbIds(response.data.map((climb: Climb) => climb.id));
		});
	}, [filters]);

	return (
		<div>
			<header className="flex justify-between items-center p-4 w-full">
				<h1 className="font-bold text-5xl">Metrics</h1>
				<span className="flex items-center gap-3">
					<p className="font-semibold">
						{climbIds.length} {climbIds.length == 1 ? "Result" : "Results"}
					</p>
					<FiltersModal setFilters={setFilters} />
				</span>
			</header>

			<div className="grid grid-cols-[2fr_1fr] grid-rows-2 grid-flow-col px-20">
				{/* <GradeHistogram climb_ids={climbIds} />
				<OpinionHistogram climb_ids={climbIds} />
				<StyleHistogram climb_ids={climbIds} />
				<WallHistogram climb_ids={climbIds} /> */}
				<DateHeatmap climb_ids={climbIds} />
				<GradeLineplot climb_ids={climbIds} />
				<ColorHistogram climb_ids={climbIds} />
				<StyleRadar climb_ids={climbIds} />
			</div>
		</div>
	);
}
