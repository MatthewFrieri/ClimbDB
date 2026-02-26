import GradeHistogram from "@/components/charts/grade_histogram";

export default function MetricsPage() {
	return (
		<div>
			<GradeHistogram climb_ids={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 23, 14, 15]} />
		</div>
	);
}
