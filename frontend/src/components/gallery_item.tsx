import { BACKEND_URL, capitalize, Climb, colorMapping, formatDate } from "@/const";
import { Image } from "@heroui/image";
import { CircleIcon, CrossIcon, FlashIcon, StarIcon } from "./icons";
import { Modal, ModalContent, useDisclosure } from "@heroui/modal";
import { Chip } from "@heroui/chip";
import DeleteButton from "./delete_button";
import EditModal from "./edit_modal";
import { Wall } from "@/types";

type GalleryItemProps = {
	climb: Climb;
	setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function GalleryItem({ climb, setRefresh }: GalleryItemProps) {
	const { isOpen, onOpenChange } = useDisclosure();
	const mediaUrl = `${BACKEND_URL}/${climb.media_url}`;

	return (
		<>
			<div
				onClick={onOpenChange}
				className="group relative hover:brightness-90 aspect-square transition-all hover:cursor-pointer"
			>
				{climb.is_video ? (
					<video src={mediaUrl} className="w-full h-full object-cover" loop muted preload="metadata" />
				) : (
					<Image src={mediaUrl} removeWrapper className="rounded-none w-full h-full object-cover" />
				)}
				<span className="top-2 z-10 absolute flex flex-row justify-between gap-1 px-2 w-full">
					<span className="flex flex-row gap-2">
						<div className="bg-white px-2 py-0.5 rounded-xl outline-2 font-semibold">{climb.grade}</div>
						{climb.flash && <FlashIcon />}
						{!climb.complete && <CrossIcon />}
					</span>
					<StarIcon
						className={`transition-opacity duration-150
                        ${climb.favorite ? "opacity-100 fill-amber-400" : "opacity-0 fill-gray-300 group-hover:opacity-100"}
                    `}
					/>
				</span>
			</div>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} size="full">
				<ModalContent className="relative flex justify-center items-center bg-black">
					{climb.is_video ? (
						<video
							src={mediaUrl}
							className="-z-10 w-full h-full object-contain"
							autoPlay
							loop
							controls
							preload="metadata"
						/>
					) : (
						<Image src={mediaUrl} removeWrapper className="-z-10 rounded-none w-full h-full object-contain" />
					)}
					<div className="top-0 left-0 z-10 absolute flex flex-col gap-5 bg-black/80 p-8 rounded-br-xl text-white">
						<p>{formatDate(climb.date)}</p>
						<div className="flex flex-col gap-1">
							<p>
								{climb.grade}, {capitalize(climb.opinion)}
							</p>
							{climb.color ? (
								<span className="flex flex-row items-center gap-2">
									<CircleIcon className={colorMapping[climb.color]} />
									<p>{capitalize(climb.color)}</p>
								</span>
							) : (
								<p>Unknown Color</p>
							)}
						</div>
						<p>{climb.wall == Wall.other ? "Unknown Wall" : capitalize(climb.wall)}</p>
						<div>
							<p>Styles</p>
							<ul className="pl-5 list-disc">
								{climb.styles.map((style) => (
									<li key={style}>{capitalize(style)}</li>
								))}
							</ul>
						</div>
						<div className="flex flex-col gap-1">
							{!climb.complete && <Chip startContent={<CrossIcon />}>Not Complete</Chip>}
							{climb.flash && <Chip startContent={<FlashIcon size={20} />}>Flash</Chip>}
						</div>
						<span className="flex flex-row gap-2">
							<EditModal climb={climb} setRefresh={setRefresh} />
							<DeleteButton climb={climb} setRefresh={setRefresh} />
						</span>
					</div>
				</ModalContent>
			</Modal>
		</>
	);
}
