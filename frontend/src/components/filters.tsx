import { Grade, Color, Style, GradeOpinion } from "@/types";
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
	outdoor: BoolFilter;
	favorite: BoolFilter;
	grade: Grade | undefined;
	grade_opinion: GradeOpinion | undefined;
	color: Color | undefined;
	style: Style | undefined;
};
type FiltersProps = {
	setFilters: (filters: Filter) => void;
};

export default function Filters({ setFilters }: FiltersProps) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [video, setVideo] = useState<BoolFilter>();
	const [complete, setComplete] = useState<BoolFilter>();
	const [flash, setFlash] = useState<BoolFilter>();
	const [outdoor, setOutdoor] = useState<BoolFilter>();
	const [favorite, setFavorite] = useState<BoolFilter>();
	const [grade, setGrade] = useState<Grade>();
	const [gradeOpinion, setGradeOpinion] = useState<GradeOpinion>();
	const [color, setColor] = useState<Color>();
	const [style, setStyle] = useState<Style>();

	const boolObjects = [
		{ var: video, setVar: setVideo, label: "Media", trueOption: "Video", falseOption: "Photo" },
		{ var: complete, setVar: setComplete, label: "Complete", trueOption: "Yes", falseOption: "No" },
		{ var: flash, setVar: setFlash, label: "Flash", trueOption: "Yes", falseOption: "No" },
		{ var: outdoor, setVar: setOutdoor, label: "Outdoor", trueOption: "Yes", falseOption: "No" },
		{ var: favorite, setVar: setFavorite, label: "Favorite", trueOption: "Yes", falseOption: "No" },
	];
	const listObjects = [
		{ var: grade, setVar: setGrade, label: "Grade", type: Grade },
		{ var: gradeOpinion, setVar: setGradeOpinion, label: "Opinion", type: GradeOpinion },
		{ var: color, setVar: setColor, label: "Color", type: Color },
		{ var: style, setVar: setStyle, label: "Style", type: Style },
	];

	const handleClear = () => {
		[...boolObjects, ...listObjects].map((obj) => {
			obj.setVar(undefined);
		});
	};

	useEffect(() => {
		setFilters({
			video: video,
			complete: complete,
			flash: flash,
			outdoor: outdoor,
			favorite: favorite,
			grade: grade,
			grade_opinion: gradeOpinion,
			color: color,
			style: style,
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
						{listObjects.map((obj) =>
							obj.type == Color ? (
								<Select
									key={obj.label}
									label={obj.label}
									placeholder="All"
									isClearable
									selectedKeys={obj.var ? new Set([obj.var]) : new Set()}
									onSelectionChange={(keys) => {
										obj.setVar([...keys][0] as any);
									}}
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
							) : (
								<Select
									key={obj.label}
									label={obj.label}
									placeholder="All"
									isClearable
									selectedKeys={obj.var ? new Set([obj.var]) : new Set()}
									onSelectionChange={(keys) => {
										obj.setVar([...keys][0] as any);
									}}
								>
									{Object.values(obj.type).map((val) => (
										<SelectItem key={val}>{capitalize(val)}</SelectItem>
									))}
								</Select>
							),
						)}
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
