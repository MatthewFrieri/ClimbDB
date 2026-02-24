import { useState } from "react";
import { DateValue, today, getLocalTimeZone } from "@internationalized/date";
import { Select, SelectItem } from "@heroui/select";
import { Form } from "@heroui/form";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { DatePicker } from "@heroui/date-picker";
import { Grade, Color, Style, Opinion, Wall } from "@/types";
import { Api } from "@/api";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import { capitalize, colorMapping, formatFileSize } from "@/const";
import { CircleIcon } from "./icons";

type AddItemModalProps = {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddItemModal({ isOpen, onOpenChange, setRefresh }: AddItemModalProps) {
	const [date, setDate] = useState<DateValue | null>(today(getLocalTimeZone()));
	const [media, setMedia] = useState<File | undefined>();
	const [grade, setGrade] = useState<Grade | undefined>();
	const [opinion, setOpinion] = useState<Opinion>(Opinion.normal);
	const [color, setColor] = useState<Color | undefined>();
	const [wall, setWall] = useState<Wall | undefined>();
	const [styles, setStyles] = useState<Style[]>([]);
	const [complete, setComplete] = useState<boolean>(true);
	const [flash, setFlash] = useState<boolean>(false);
	const [favorite, setFavorite] = useState<boolean>(false);

	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const handleOpenChange = (newIsOpen: boolean) => {
		setDate(today(getLocalTimeZone()));
		setMedia(undefined);
		setGrade(undefined);
		setOpinion(Opinion.normal);
		setColor(undefined);
		setWall(undefined);
		setStyles([]);
		setComplete(true);
		setFlash(false);
		setFavorite(false);

		onOpenChange(newIsOpen);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (isSubmitting) return;

		setIsSubmitting(true);
		try {
			const formData = new FormData();
			formData.append("date", date!.toString());
			formData.append("media", media!);
			formData.append("grade", grade!.toString());
			formData.append("opinion", opinion!.toString());
			formData.append("color", color!.toString());
			formData.append("wall", wall!.toString());
			styles.forEach((style) => formData.append("styles", style.toString()));
			formData.append("complete", complete.toString());
			formData.append("flash", flash.toString());
			formData.append("favorite", favorite.toString());
			await Api.add_climb(formData);
			handleOpenChange(false);
			setRefresh((prev) => !prev);
		} catch (err) {
			console.error("Failed to add climb", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={isSubmitting ? undefined : handleOpenChange}
			isDismissable={!isSubmitting}
			isKeyboardDismissDisabled={isSubmitting}
			size="md"
		>
			<ModalContent>
				<ModalHeader className="text-2xl">Add Climb</ModalHeader>
				<ModalBody>
					<Form onSubmit={handleSubmit} className="flex flex-col gap-4 pb-4">
						<DatePicker
							isDisabled={isSubmitting}
							isRequired
							label="Date"
							maxValue={today(getLocalTimeZone())}
							value={date}
							onChange={setDate}
						/>
						<input
							disabled={isSubmitting}
							id="media-upload"
							type="file"
							accept="image/*,video/*"
							className="hidden"
							required
							onChange={(e) => setMedia(e.target.files?.[0])}
						/>

						<Button
							isDisabled={isSubmitting}
							color="primary"
							variant={media ? "solid" : "bordered"}
							onPress={() => document.getElementById("media-upload")?.click()}
							className="w-full"
						>
							{media ? (
								<span className="flex flex-row justify-between w-full">
									<p className="truncate">
										Selected: <b>{media.name}</b>
									</p>
									<p>{formatFileSize(media.size)}</p>
								</span>
							) : (
								"Choose Image or Video"
							)}
						</Button>

						<span className="flex flex-row gap-4 w-full">
							<Select
								isDisabled={isSubmitting}
								label="Grade"
								isRequired
								selectedKeys={grade ? new Set([grade]) : new Set()}
								onSelectionChange={(keys) => setGrade([...keys][0] as Grade)}
							>
								{Object.values(Grade).map((g: string) => (
									<SelectItem key={g}>{g}</SelectItem>
								))}
							</Select>

							<Select
								isDisabled={isSubmitting}
								label="Opinion"
								isRequired
								selectedKeys={opinion ? new Set([opinion]) : new Set()}
								onSelectionChange={(keys) => setOpinion([...keys][0] as Opinion)}
							>
								{Object.values(Opinion).map((o: string) => (
									<SelectItem key={o}>{capitalize(o)}</SelectItem>
								))}
							</Select>
						</span>

						<Select
							isDisabled={isSubmitting}
							label="Color"
							isRequired
							selectedKeys={color ? new Set([color]) : new Set()}
							onSelectionChange={(keys) => setColor([...keys][0] as Color)}
							renderValue={(items) =>
								items.map((item) => {
									const value = item.key as Color;
									return (
										<div key={item.key} className="flex items-center gap-2">
											<CircleIcon size={16} className={colorMapping[value]} />
											<span>{capitalize(value)}</span>
										</div>
									);
								})
							}
						>
							{Object.values(Color).map((c: Color) => (
								<SelectItem key={c} textValue={capitalize(c)}>
									<div className="flex items-center gap-2">
										<CircleIcon size={20} className={colorMapping[c]} />
										<span>{capitalize(c)}</span>
									</div>
								</SelectItem>
							))}
						</Select>

						<Select
							isDisabled={isSubmitting}
							label="Wall"
							isRequired
							selectedKeys={wall ? new Set([wall]) : new Set()}
							onSelectionChange={(keys) => setWall([...keys][0] as Wall)}
						>
							{Object.values(Wall).map((w: string) => (
								<SelectItem key={w}>{capitalize(w)}</SelectItem>
							))}
						</Select>

						<Select
							isDisabled={isSubmitting}
							isRequired
							label="Styles"
							selectionMode="multiple"
							selectedKeys={new Set(styles)}
							onSelectionChange={(keys) => setStyles([...keys] as Style[])}
						>
							{Object.values(Style).map((s: string) => (
								<SelectItem key={s}>{capitalize(s)}</SelectItem>
							))}
						</Select>

						<div className="gap-2 grid grid-cols-3 grid-rows-2 grid-flow-col w-full">
							<Checkbox isDisabled={isSubmitting} isSelected={complete} onValueChange={setComplete}>
								Complete
							</Checkbox>
							<Checkbox isDisabled={isSubmitting} isSelected={flash} onValueChange={setFlash}>
								Flash
							</Checkbox>
							<Checkbox isDisabled={isSubmitting} isSelected={favorite} onValueChange={setFavorite}>
								Favorite
							</Checkbox>
							<Button
								type="submit"
								color="success"
								className="row-span-2 h-full"
								isLoading={isSubmitting}
								isDisabled={!date || !media || !grade || !opinion || !color || !wall || styles.length == 0}
							>
								{isSubmitting ? "Submitting..." : "Submit"}
							</Button>
						</div>
					</Form>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
