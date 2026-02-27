import { Api } from "@/api";
import { capitalize } from "@/const";
import { Wall } from "@/types";
import { Image } from "@heroui/image";
import { useEffect, useState } from "react";

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
		[Wall.ash]: ["top-8 left-3", "top-6 left-2"],
		[Wall.ridge]: ["top-36 left-9", "top-28 left-12"],
		[Wall.bigShow]: ["top-50 left-5", "top-48 left-8"],
		[Wall.mocha]: ["top-71 left-5", "top-68 left-5"],
		[Wall.hollow]: ["top-12 left-55", "top-5 left-40 w-24"],
		[Wall.grotto]: ["top-30 left-54", "top-23 left-51 w-24"],
		[Wall.roof]: ["top-59 left-54", "top-52 left-43"],
		[Wall.pebble]: ["top-58 left-72", "top-48 left-72"],
		[Wall.summit]: ["top-54 left-96", "top-44 left-93"],
		[Wall.onyx]: ["top-67 left-96", "top-63 left-96"],
		[Wall.paradise]: ["top-66 left-77", "top-63 left-75"],
		[Wall.peanut]: ["top-69 left-60", "top-65 left-55"],
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
		<div className="relative w-[500px] font-semibold text-white text-sm text-center">
			<Image src="floor_layout.png" className="border-12 border-black rounded-none" />
			{data.x_labels.map((label, index) => {
				if (label == Wall.other) return;
				return (
					<>
						<p className={`absolute z-10 ${labelToPositions[label as Wall][0]}`}>
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
									)} 20%, white 70%`,
								}}
								className={`absolute rounded-full w-20 aspect-square ${labelToPositions[label as Wall][1]}`}
							></div>
						)}
					</>
				);
			})}
		</div>
	);
}
