import { Route, Routes } from "react-router-dom";

import LoginPage from "./pages/login";
import GalleryPage from "@/pages/gallery";
import MetricsPage from "@/pages/metrics";

function App() {
	return (
		<Routes>
			<Route element={<LoginPage />} path="/" />
			<Route element={<GalleryPage />} path="/gallery" />
			<Route element={<MetricsPage />} path="/metrics" />
		</Routes>
	);
}

export default App;
