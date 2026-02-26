import { Api } from "@/api";
import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";

type GradeHistogramProps = {
	climb_ids: number[];
};

type HistogramData = {
	x_labels: string[];
	y_values: number[];
};

export default function GradeHistogram({ climb_ids }: GradeHistogramProps) {
	const [data, setData] = useState<HistogramData | null>(null);

	useEffect(() => {
		Api.grade_histogram_data(climb_ids).then((response) => {
			setData(response.data);
		});
	}, []);

	const options = {
		xAxis: {
			type: "category",
			data: data?.x_labels,
		},
		yAxis: {
			type: "value",
		},
		series: [
			{
				data: data?.y_values,
				type: "bar",
			},
		],
	};
	return <ReactECharts option={options} />;
}
