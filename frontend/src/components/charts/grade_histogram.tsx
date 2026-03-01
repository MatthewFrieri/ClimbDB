import { Api } from "@/api";
import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";

type ChartData = {
	x_labels: string[];
	y_values: number[];
};

export default function GradeHistogram({ climb_ids }: { climb_ids: number[] }) {
	const [data, setData] = useState<ChartData | null>(null);

	useEffect(() => {
		Api.grade_histogram_data(climb_ids).then((response) => {
			setData(response.data);
		});
	}, [climb_ids]);
	if (!data) return;

	const options = {
		title: {
			text: "Grade Distribution",
		},
		tooltip: {
			axisPointer: {
				type: "shadow",
			},
		},
		xAxis: {
			type: "category",
			data: data.x_labels,
		},
		yAxis: {
			type: "value",
		},
		series: [
			{
				data: data.y_values,
				type: "bar",
			},
		],
	};
	return <ReactECharts option={options} />;
}
