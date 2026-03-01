import { Api } from "@/api";
import BoolNumber from "@/components/charts/bool_number";
import ColorHistogram from "@/components/charts/color_pie";
import DateHeatmap from "@/components/charts/date_heatmap";
import GradeHistogram from "@/components/charts/grade_histogram";
import GradeLineplot from "@/components/charts/grade_lineplot";
import OpinionHistogram from "@/components/charts/opinion_histogram";
import StyleHistogram from "@/components/charts/style_histogram";
import StyleRadar from "@/components/charts/style_radar";
import WallHeatmap from "@/components/charts/wall_heatmap";
import WallHistogram from "@/components/charts/wall_histogram";
import FiltersModal, { Filter } from "@/components/filters_modal";
import { Climb } from "@/const";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MetricsPage() {
	const navigate = useNavigate();

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
				<span className="flex items-baseline gap-7">
					<h1 className="font-bold text-5xl">Metrics</h1>
					<h2
						onClick={() => navigate("/")}
						className="font-bold text-neutral-400 hover:text-neutral-500 text-3xl transition-all hover:cursor-pointer"
					>
						Gallery
					</h2>
				</span>
				<span className="flex items-center gap-3">
					<p className="font-semibold">
						{climbIds.length} {climbIds.length == 1 ? "Result" : "Results"}
					</p>
					<FiltersModal setFilters={setFilters} />
				</span>
			</header>
			<div className="flex flex-col px-20">
				<div className="flex">
					<div className="flex-2 pr-10">
						<DateHeatmap climb_ids={climbIds} />
					</div>
					<div className="flex-1">
						<ColorHistogram climb_ids={climbIds} />
					</div>
					<div className="flex-1">
						<StyleRadar climb_ids={climbIds} />
					</div>
				</div>
				<div className="flex">
					<div className="flex flex-col -mt-6 w-1/2">
						<div className="flex-2 -ml-20">
							<GradeLineplot climb_ids={climbIds} />
						</div>
						<div className="flex -mt-2">
							<div className="flex-1">
								<GradeHistogram climb_ids={climbIds} />
							</div>
							<div className="flex-1">
								<OpinionHistogram climb_ids={climbIds} />
							</div>
						</div>
					</div>
					<div className="flex flex-col items-center gap-6 w-1/2">
						<WallHeatmap climb_ids={climbIds} />
						{/* <div className="w-full">
    						<WallHistogram climb_ids={climbIds} />
						</div> */}
						<div className="flex justify-center items-center w-full h-full">
							<BoolNumber climb_ids={climbIds} field="complete" />
							<div className="bg-black mx-12 w-1.5 h-[80%]" />
							<BoolNumber climb_ids={climbIds} field="flash" />
							<div className="bg-black mx-12 w-1.5 h-[80%]" />
							<BoolNumber climb_ids={climbIds} field="favorite" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
