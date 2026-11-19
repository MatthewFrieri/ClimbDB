import { Route, Routes } from "react-router-dom";
import LoginPage from "@/pages/login";
import GalleryPage from "@/pages/gallery";
import ClimbPage from "@/pages/climb";
import MetricsPage from "@/pages/metrics";
import { AuthProvider } from "@/contexts/auth_context";

function App() {
	return (
        <AuthProvider>
            <Routes>
                <Route element={<LoginPage />} path="/" />
                <Route element={<GalleryPage />} path="/gallery" />
                <Route element={<ClimbPage />} path="/gallery/:id" />
                <Route element={<MetricsPage />} path="/metrics" />
            </Routes>
        </AuthProvider>
	);
}

export default App;
