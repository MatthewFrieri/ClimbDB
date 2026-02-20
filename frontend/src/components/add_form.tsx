import { useState } from "react";
import { DateValue, today, getLocalTimeZone } from "@internationalized/date";
import { Select, SelectItem } from "@heroui/select";
import { Form } from "@heroui/form";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { DatePicker } from "@heroui/date-picker";
import { Grade, Color, Style, GradeOpinion } from "@/types";
import { Api } from "@/api";

export default function AddForm() {
	const [date, setDate] = useState<DateValue | null>(today(getLocalTimeZone()));
	const [media, setMedia] = useState<File | undefined>();
	const [grade, setGrade] = useState<Grade | undefined>();
	const [gradeOpinion, setGradeOpinion] = useState<GradeOpinion>(GradeOpinion.normal);
	const [color, setColor] = useState<Color | undefined>();
	const [styles, setStyles] = useState<Style[]>([]);
	const [flash, setFlash] = useState<boolean>(false);
	const [outdoor, setOutdoor] = useState<boolean>(false);
	const [favorite, setFavorite] = useState<boolean>(false);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append("date", date!.toString());
		formData.append("media", media!);
		formData.append("grade", grade!.toString());
		formData.append("grade_opinion", gradeOpinion!.toString());
		formData.append("color", color ? color.toString() : "");
		styles.forEach((style) => {
			formData.append("styles", style.toString());
		});
		formData.append("flash", flash.toString());
		formData.append("outdoor", outdoor.toString());
		formData.append("favorite", favorite.toString());

		Api.add_climb(formData);
	};

	return (
		<Form onSubmit={handleSubmit}>
			<DatePicker label="Date" maxValue={today(getLocalTimeZone())} value={date} onChange={setDate} />
			<input type="file" accept="image/*,video/*" required onChange={(e) => setMedia(e.target.files?.[0])} />
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
				label="Grade Opinion"
				isRequired
				selectedKeys={gradeOpinion ? new Set([gradeOpinion]) : new Set()}
				onSelectionChange={(keys) => {
					setGradeOpinion([...keys][0] as GradeOpinion);
				}}
			>
				{Object.values(GradeOpinion).map((gradeOpinion: string) => (
					<SelectItem key={gradeOpinion}>{gradeOpinion}</SelectItem>
				))}
			</Select>
			<Select
				label="Color"
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
			<Checkbox isSelected={flash} onValueChange={setFlash}>
				Flash
			</Checkbox>
			<Checkbox isSelected={outdoor} onValueChange={setOutdoor}>
				Outdoor
			</Checkbox>
			<Checkbox isSelected={favorite} onValueChange={setFavorite}>
				Favorite
			</Checkbox>
			<Button type="submit">Submit</Button>
		</Form>
	);
}
