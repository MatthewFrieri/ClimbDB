import { Api } from "@/api";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();
    
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("username", username);
            formData.append("password", password);
            await Api.login(formData);
            navigate("/gallery")
        } catch (err) {
            console.error("Failed to login", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="p-2 border rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="p-2 border rounded"
                />
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-500 disabled:opacity-50 p-2 rounded text-white"
                >
                    Login
                </Button>
            </Form>
            <Button
                onPress={() => navigate("/gallery")}
            >
                Continue as guest
            </Button>
        </>
    )
}