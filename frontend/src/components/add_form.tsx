import { useState } from "react";
import { Select, SelectItem } from "@heroui/select";
import { Form } from "@heroui/form";
import { Button } from "@heroui/button";
import { Grade, Color, Style } from "@/types";

export default function AddForm() {
	const [grade, setGrade] = useState<Grade | undefined>();
	const [color, setColor] = useState<Color | undefined>();
	const [styles, setStyles] = useState<Style[]>([]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log(grade);
		console.log(color);
		console.log(styles);
	};

	return (
		<Form onSubmit={handleSubmit}>
			<Select
				label="Grade"
				isRequired
				selectedKeys={grade ? new Set([grade]) : new Set()}
				onSelectionChange={(keys) => {
					setGrade([...keys][0] as Grade);
				}}
			>
				{Object.values(Grade).map((grade: string) => (
					<SelectItem key={grade}>{grade}</SelectItem>
				))}
			</Select>
			<Select
				label="Color"
				isRequired
				selectedKeys={color ? new Set([color]) : new Set()}
				onSelectionChange={(keys) => {
					setColor([...keys][0] as Color);
				}}
			>
				{Object.values(Color).map((color: string) => (
					<SelectItem key={color}>{color}</SelectItem>
				))}
			</Select>
			<Select
				label="Styles"
				selectionMode="multiple"
				selectedKeys={new Set(styles)}
				onSelectionChange={(keys) => setStyles([...keys] as Style[])}
			>
				{Object.values(Style).map((style: string) => (
					<SelectItem key={style}>{style}</SelectItem>
				))}
			</Select>
			<Button type="submit">Submit</Button>
		</Form>
	);
}
