// Holds a chart's space while its data loads so the page doesn't shift when it appears.
// 300px is the height ECharts charts use by default.
export default function ChartPlaceholder() {
	return <div style={{ height: 300 }} />;
}
