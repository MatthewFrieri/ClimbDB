import { Api } from "@/api";
import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";

type ChartData = {
	start_date: string;
	end_date: string;
	x_labels: string[];
	y_values: number[];
};

export default function DateHeatmap({ climb_ids }: { climb_ids: number[] }) {
	const [data, setData] = useState<ChartData | null>(null);

	useEffect(() => {
		Api.date_heatmap_data(climb_ids).then((response) => {
			setData(response.data);
		});
	}, [climb_ids]);
	if (!data) return;

	const options = {
		title: { text: "Climbing Activity" },
		tooltip: {
			formatter: (params: any) => {
				const [date, value] = params.value;
				return `${date}: ${value} climb${value > 1 ? "s" : ""}`;
			},
		},
		calendar: {
			top: 80,
			left: 60,
			range: [data.start_date, data.end_date],
			cellSize: ["auto", 20],
			splitLine: { show: true, lineStyle: { color: "#aaaaaa", width: 1 } },
		},
		visualMap: {
			show: false,
			min: 0,
			max: data.y_values.length ? Math.max(...data.y_values) : 0,
		},
		series: [
			{
				type: "heatmap",
				coordinateSystem: "calendar",
				data: data.x_labels.map((label, index) => [label, data.y_values[index]]),
			},
		],
	};
	return <ReactECharts option={options} />;
}
