import { Api } from "@/api";
import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";

type ChartData = {
	x_labels: string[];
	y_values: number[];
};

export default function StyleRadar({ climb_ids }: { climb_ids: number[] }) {
	const [data, setData] = useState<ChartData | null>(null);

	useEffect(() => {
		Api.style_radar_data(climb_ids).then((response) => {
			setData(response.data);
		});
	}, [climb_ids]);
	if (!data) return;

	const options = {
		title: {
			text: "Styles",
		},

		radar: {
			indicator: data.x_labels.map((label) => ({ name: label, max: Math.max(...data.y_values) * 1.15 })),
		},
		series: [
			{
				type: "radar",
				tooltip: {
					trigger: "item",
				},
				areaStyle: {},
				data: [
					{
						name: "Styles",
						value: data.y_values,
					},
				],
			},
		],
	};
	return <ReactECharts option={options} />;
}
