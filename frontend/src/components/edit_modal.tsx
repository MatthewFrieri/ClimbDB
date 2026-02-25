import { Grade, Color, Style, Opinion, Wall } from "@/types";
import { Select, SelectItem } from "@heroui/select";
import { useState } from "react";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@heroui/modal";
import { capitalize, Climb, colorMapping } from "@/const";
import { CircleIcon } from "./icons";
import { Api } from "@/api";

export type Revision = {
	complete: boolean;
	flash: boolean;
	favorite: boolean;
	grade: Grade;
	opinion: Opinion;
	color: Color;
	wall: Wall;
	styles: Style[];
};
type EditModalProps = {
	climb: Climb;
	setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EditModal({ climb, setRefresh }: EditModalProps) {
	const { isOpen, onOpenChange } = useDisclosure();
	const [isEditing, setIsEditing] = useState(false);
	const [complete, setComplete] = useState<string>(String(Number(climb.complete)));
	const [flash, setFlash] = useState<string>(String(Number(climb.flash)));
	const [favorite, setFavorite] = useState<string>(String(Number(climb.favorite)));
	const [grade, setGrade] = useState<Grade>(climb.grade);
	const [opinion, setOpinion] = useState<Opinion>(climb.opinion);
	const [color, setColor] = useState<Color>(climb.color);
	const [wall, setWall] = useState<Wall>(climb.wall);
	const [styles, setStyles] = useState<Style[]>(climb.styles);

	const boolObjects = [
		{ var: complete, setVar: setComplete, label: "Complete", trueOption: "Yes", falseOption: "No" },
		{ var: flash, setVar: setFlash, label: "Flash", trueOption: "Yes", falseOption: "No" },
		{ var: favorite, setVar: setFavorite, label: "Favorite", trueOption: "Yes", falseOption: "No" },
	];
	const listObjects = [
		{ var: grade, setVar: setGrade, label: "Grade", type: Grade },
		{ var: opinion, setVar: setOpinion, label: "Opinion", type: Opinion },
		{ var: color, setVar: setColor, label: "Color", type: Color },
		{ var: wall, setVar: setWall, label: "Wall", type: Wall },
		{ var: styles, setVar: setStyles, label: "Styles", type: Style },
	];

	const onModalOpenChange = () => {
		handleReset();
		onOpenChange();
	};

	const handleReset = () => {
		setComplete(String(Number(climb.complete)));
		setFlash(String(Number(climb.flash)));
		setFavorite(String(Number(climb.favorite)));
		setGrade(climb.grade);
		setOpinion(climb.opinion);
		setColor(climb.color);
		setWall(climb.wall);
		setStyles(climb.styles);
	};

	const handleEdit = async () => {
		if (isEditing) return;

		try {
			setIsEditing(true);

			const revision: Revision = {
				complete: Boolean(Number(complete)),
				flash: Boolean(Number(flash)),
				favorite: Boolean(Number(favorite)),
				grade: grade,
				opinion: opinion,
				color: color,
				wall: wall,
				styles: styles,
			};
			await Api.edit_climb(climb.id, revision);
			setRefresh((prev) => !prev);
			onModalOpenChange(); // close modal
		} catch (err) {
			console.error(`Failed to edit climb with id=${climb.id}`, err);
		} finally {
			setIsEditing(false);
		}
	};
	return (
		<>
			<Button color="primary" variant="bordered" size="sm" onPress={onModalOpenChange}>
				Edit
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onModalOpenChange}>
				<ModalContent>
					<ModalHeader className="text-2xl">Edit Metadata</ModalHeader>
					<ModalBody className="gap-4 grid grid-cols-2 grid-rows-5 grid-flow-col pb-6">
						{listObjects.map((obj) =>
							obj.type == Color ? (
								<Select
									key={obj.label}
									label={obj.label}
									selectedKeys={new Set([obj.var as string])}
									onSelectionChange={(keys) => {
										const key = Array.from(keys)[0];
										if (!key) return;
										obj.setVar(key as any);
									}}
									renderValue={(items) => (
										<div className="flex flex-row items-center gap-2">
											{items.map((item) => {
												const value = item.key as Color;
												return (
													<div key={item.key} className="flex items-center gap-1 shrink-0">
														<CircleIcon size={16} className={colorMapping[value]} />
														<span className="whitespace-nowrap">{capitalize(value)}</span>
													</div>
												);
											})}
										</div>
									)}
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
							) : obj.type == Style ? (
								<Select
									key={obj.label}
									label={obj.label}
									selectionMode="multiple"
									selectedKeys={new Set(obj.var as string[])}
									onSelectionChange={(keys) => {
										const arrKeys = Array.from(keys) as any;
										// if (!arrKeys) return;
										obj.setVar(arrKeys);
									}}
								>
									{Object.values(obj.type).map((val) => (
										<SelectItem key={val}>{capitalize(val)}</SelectItem>
									))}
								</Select>
							) : (
								<Select
									key={obj.label}
									label={obj.label}
									selectedKeys={new Set([obj.var as string])}
									onSelectionChange={(keys) => {
										const key = Array.from(keys)[0];
										if (!key) return;
										obj.setVar(key as any);
									}}
								>
									{Object.values(obj.type).map((val) => (
										<SelectItem key={val}>{capitalize(val)}</SelectItem>
									))}
								</Select>
							),
						)}
						{boolObjects.map((obj) => (
							<Select
								key={obj.label}
								label={obj.label}
								selectedKeys={new Set([obj.var])}
								onSelectionChange={(keys) => {
									const key = [...keys][0] as string;
									if (!key) return;
									obj.setVar(key);
								}}
							>
								<SelectItem key={1}>{obj.trueOption}</SelectItem>
								<SelectItem key={0}>{obj.falseOption}</SelectItem>
							</Select>
						))}
						<Button color="danger" onPress={onModalOpenChange} isDisabled={isEditing} className="w-full h-full">
							Cancel
						</Button>
						<Button
							color="success"
							onPress={handleEdit}
							isLoading={isEditing}
							isDisabled={styles.length == 0}
							className="w-full h-full"
						>
							Done
						</Button>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
}
