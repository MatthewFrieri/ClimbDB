import { Api } from "@/api";
import { capitalize } from "@/const";
import { Wall } from "@/types";
import { useEffect, useState } from "react";
import { WallMap } from "./wall_map";

type ChartData = {
	start_date: string;
	end_date: string;
	x_labels: string[];
	y_values: number[];
};

export default function WallHeatmap({ climb_ids }: { climb_ids: number[] }) {
	const [data, setData] = useState<ChartData | null>(null);

	useEffect(() => {
		Api.wall_data(climb_ids).then((response) => {
			setData(response.data);
		});
	}, [climb_ids]);
	if (!data) return;

	const minValue = Math.min(...data.y_values);
	const maxValue = Math.max(...data.y_values);

	const labelToPositions: Record<Wall, [string, string]> = {
		[Wall.ash]: ["top-8 left-7", "top-0 left-7"],
		[Wall.ridge]: ["top-28 left-8", "top-21 left-11"],
		[Wall.bigShow]: ["top-45 left-4", "top-42 left-6"],
		[Wall.mocha]: ["top-67 left-3", "top-64 left-1"],
		[Wall.hollow]: ["top-9 left-53", "top-2 left-39 w-24"],
		[Wall.grotto]: ["top-26 left-56", "top-18 left-50 w-24"],
		[Wall.pebble]: ["top-56 left-70", "top-43 left-70"],
		[Wall.summit]: ["top-53 left-101", "top-42 left-99 w-24"],
		[Wall.onyx]: ["top-66 left-102", "top-63 left-99"],
		[Wall.paradise]: ["top-63 left-77", "top-62 left-75"],
		[Wall.peanut]: ["top-62 left-52", "top-55 left-40 w-24"],
		[Wall.other]: ["", ""],
	};

	const valueToRed = (value: number, min: number, max: number) => {
		const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
		const r = 255 - Math.round(120 * t);
		const g = Math.round(220 * (1 - t));
		const b = Math.round(220 * (1 - t));
		return `rgb(${r}, ${g}, ${b})`;
	};

	return (
		<div className="flex flex-col items-center gap-2">
			<p className="font-bold text-neutral-800 text-xl">Walls</p>
			<div className="relative w-[500px] font-semibold text-black text-sm text-center">
				<WallMap className="fill-slate-300 stroke-neutral-800 border-3 border-neutral-800" />
				{data.x_labels.map((label, index) => {
					if (label == Wall.other) return;
					return (
						<>
							<p className={`absolute ${labelToPositions[label as Wall][0]}`}>
								{label === Wall.bigShow ? (
									<p>
										Big <br /> Show
									</p>
								) : (
									capitalize(label)
								)}
							</p>
							{data.y_values[index] > 0 && (
								<div
									key={index}
									style={{
										background: `radial-gradient(circle, ${valueToRed(
											data.y_values[index],
											minValue,
											maxValue,
										)} 20%, #fee2e2 70%`,
									}}
									className={`absolute rounded-full w-20 -z-10 aspect-square ${labelToPositions[label as Wall][1]}`}
								></div>
							)}
						</>
					);
				})}
			</div>
		</div>
	);
}
