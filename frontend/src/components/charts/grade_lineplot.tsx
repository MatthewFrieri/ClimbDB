import { Api } from "@/api";
import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";

type ChartData = {
	start_date: string;
	end_date: string;
	x_labels: string[]; // ISO date strings: 'YYYY-MM-DD'
	lines: {
		grade: string;
		y_values: number[];
	}[];
};

export default function GradeLineplot({ climb_ids }: { climb_ids: number[] }) {
	const [data, setData] = useState<ChartData | null>(null);

	useEffect(() => {
		Api.grade_lineplot_data(climb_ids).then((response) => {
			setData(response.data);
		});
	}, [climb_ids]);

	if (!data) return null;

	const options = {
		title: {
			text: "Grade Progression",
		},
		tooltip: {
			trigger: "axis",
			formatter: (params: any) => {
				return params.map((p: any) => `${p.seriesName}: ${p.data[1] ?? 0}`).join("<br/>");
			},
		},
		legend: {
			orient: "vertical",
			right: 10,
			top: 50,
		},
		xAxis: {
			type: "time",
			boundaryGap: false,
			axisLabel: {
				formatter: (value: number) => {
					const date = new Date(value);
					return date.toLocaleDateString("en-US", { month: "short" });
				},
			},
		},
		yAxis: {
			type: "value",
			name: "Climbs",
		},
		series: data.lines.map((line) => ({
			name: line.grade,
			type: "line",
			showSymbol: false,
			data: line.y_values.map((y, i) => [data.x_labels[i], y]),
		})),
	};

	return <ReactECharts option={options} notMerge={true} />;
}
