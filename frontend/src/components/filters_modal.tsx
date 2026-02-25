import { Grade, Color, Style, Opinion, Wall } from "@/types";
import { Select, SelectItem } from "@heroui/select";
import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@heroui/modal";
import { capitalize, colorMapping } from "@/const";
import { CircleIcon } from "./icons";

type BoolFilter = 1 | 0 | undefined;
export type Filter = {
	video: BoolFilter;
	complete: BoolFilter;
	flash: BoolFilter;
	favorite: BoolFilter;
	grades: Grade[];
	opinions: Opinion[];
	colors: Color[];
	walls: Wall[];
	styles: Style[];
};
type FiltersModalProps = {
	setFilters: (filters: Filter) => void;
};

export default function FiltersModal({ setFilters }: FiltersModalProps) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [video, setVideo] = useState<BoolFilter>();
	const [complete, setComplete] = useState<BoolFilter>();
	const [flash, setFlash] = useState<BoolFilter>();
	const [favorite, setFavorite] = useState<BoolFilter>();
	const [grades, setGrades] = useState<Grade[]>([]);
	const [opinions, setOpinions] = useState<Opinion[]>([]);
	const [colors, setColors] = useState<Color[]>([]);
	const [walls, setWalls] = useState<Wall[]>([]);
	const [styles, setStyles] = useState<Style[]>([]);

	const boolObjects = [
		{ var: video, setVar: setVideo, label: "Media", trueOption: "Video", falseOption: "Photo" },
		{ var: complete, setVar: setComplete, label: "Complete", trueOption: "Yes", falseOption: "No" },
		{ var: flash, setVar: setFlash, label: "Flash", trueOption: "Yes", falseOption: "No" },
		{ var: favorite, setVar: setFavorite, label: "Favorite", trueOption: "Yes", falseOption: "No" },
	];
	const listObjects = [
		{ var: grades, setVar: setGrades, label: "Grade", type: Grade },
		{ var: opinions, setVar: setOpinions, label: "Opinion", type: Opinion },
		{ var: colors, setVar: setColors, label: "Color", type: Color },
		{ var: walls, setVar: setWalls, label: "Wall", type: Wall },
		{ var: styles, setVar: setStyles, label: "Style", type: Style },
	];

	const handleClear = () => {
		boolObjects.map((obj) => {
			obj.setVar(undefined);
		});
		listObjects.map((obj) => {
			obj.setVar([]);
		});
	};

	useEffect(() => {
		setFilters({
			video: video,
			complete: complete,
			flash: flash,
			favorite: favorite,
			grades: grades,
			opinions: opinions,
			colors: colors,
			walls: walls,
			styles: styles,
		});
	}, [...boolObjects.map((obj) => obj.var), ...listObjects.map((obj) => obj.var)]);

	return (
		<>
			<Button color="primary" onPress={onOpen} className="h-14">
				Open <br /> Filters
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					<ModalHeader className="text-2xl">Filters</ModalHeader>
					<ModalBody className="gap-4 grid grid-cols-2 grid-rows-5 grid-flow-col pb-6">
						{listObjects.map((obj) =>
							obj.type == Color ? (
								<Select
									key={obj.label}
									label={obj.label}
									placeholder="All"
									isClearable
									selectionMode="multiple"
									selectedKeys={new Set(obj.var as string[])}
									onSelectionChange={(keys) => {
										obj.setVar(Array.from(keys) as any);
									}}
									renderValue={(items) => (
										<div className="flex flex-row items-center gap-2">
											{items.length > 1
												? items.map((item) => (
														<CircleIcon key={item.key} size={16} className={colorMapping[item.key as Color]} />
													))
												: items.map((item) => {
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
							) : (
								<Select
									key={obj.label}
									label={obj.label}
									placeholder="All"
									isClearable
									selectionMode="multiple"
									selectedKeys={new Set(obj.var as string[])}
									onSelectionChange={(keys) => {
										obj.setVar(Array.from(keys) as any);
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
								placeholder="All"
								isClearable
								selectedKeys={obj.var ? new Set([obj.var]) : new Set()}
								onSelectionChange={(keys) => {
									obj.setVar([...keys][0] as BoolFilter);
								}}
							>
								<SelectItem key={1}>{obj.trueOption}</SelectItem>
								<SelectItem key={0}>{obj.falseOption}</SelectItem>
							</Select>
						))}
						<span className="flex gap-3">
							<Button color="success" onPress={onOpenChange} className="w-full h-full">
								Done
							</Button>
							<Button color="danger" onPress={handleClear} className="w-full h-full">
								Clear All
							</Button>
						</span>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
}
