import { Api } from "@/api";
import { useAuth } from "@/contexts/auth_context";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const {isLoggedIn, setIsLoggedIn} = useAuth()

    useEffect(() => {
        Api.is_logged_in().then((response) => {
            setIsLoggedIn(response.data.logged_in);
        });
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/gallery");
        }
    }, [isLoggedIn])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("username", username);
            formData.append("password", password);
            await Api.login(formData);
            setError(null); 
            navigate("/gallery");

        } catch (err: any) {
            console.error("Failed to login", err);
            setError("Wrong username or password");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center gap-10 h-screen">
            <h1 className="font-bold text-8xl">ClimbDB</h1>
            <Form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="p-2 border rounded w-60"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="p-2 border rounded w-60"
                />
                {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                )}
                <span className="flex gap-4 mt-4 mb-40">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-500 disabled:opacity-50 p-2 text-white"
                    >
                        Login
                    </Button>
                    <Button
                        onPress={() => navigate("/gallery")}
                    >
                        Continue as guest
                    </Button>
                </span>
            </Form>
        </div>
    )
}