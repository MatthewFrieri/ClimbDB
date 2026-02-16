import { Route, Routes } from "react-router-dom";

import GalleryPage from "@/pages/gallery";
import MetricsPage from "@/pages/metrics";

function App() {
	return (
		<Routes>
			<Route element={<GalleryPage />} path="/" />
			<Route element={<MetricsPage />} path="/metrics" />
		</Routes>
	);
}

export default App;
