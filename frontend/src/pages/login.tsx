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

            <div className="flex flex-col items-center gap-4 w-60">
                <Form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="p-2 border rounded w-full"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="p-2 border rounded w-full"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button
                        type="submit"
                        color="primary"
                        disabled={isSubmitting}
                        className="w-full"
                    >
                        Log in
                    </Button>
                </Form>

                <span className="flex items-center gap-3 my-2 w-full">
                    <div className="flex-1 border-gray-300 border-t" />
                    <p className="text-gray-500 text-sm">or</p>
                    <div className="flex-1 border-gray-300 border-t" />
                </span>

                <Button
                    variant="bordered"
                    className="w-full"
                    onPress={() => navigate("/gallery")}
                >
                    Browse gallery as guest
                </Button>
            </div>
        </div>
    );
}