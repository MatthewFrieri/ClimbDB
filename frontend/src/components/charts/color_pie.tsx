import { Api } from "@/api";
import { capitalize, colorMapping } from "@/const";
import { Color } from "@/types";
import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";

type ChartData = {
	x_labels: string[];
	y_values: number[];
};

export default function ColorHistogram({ climb_ids }: { climb_ids: number[] }) {
	const [data, setData] = useState<ChartData | null>(null);

	useEffect(() => {
		Api.color_data(climb_ids).then((response) => {
			setData(response.data);
		});
	}, [climb_ids]);
	if (!data) return;

	const options = {
		title: {
			text: "Colors",
		},
		tooltip: {
			trigger: "item",
		},
		color: data.x_labels.map((label) => colorMapping[label as Color].slice(6, 13)),
		series: [
			{
				type: "pie",
				radius: "50%",
				data: data.y_values.map((y, index) => {
					if (y == 0) return;
					return { name: capitalize(data.x_labels[index]), value: y };
				}),
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: "rgba(0, 0, 0, 0.5)",
					},
				},
			},
		],
	};
	return <ReactECharts option={options} />;
}
