import { BACKEND_URL, capitalize, Climb, colorMapping, formatDate } from "@/const";
import { Image } from "@heroui/image";
import { CheckIcon, CircleIcon, CrossIcon, FlashIcon, StarIcon } from "./icons";
import { Modal, ModalContent, useDisclosure } from "@heroui/modal";
import { Chip } from "@heroui/chip";

type GalleryItemProps = {
	climb: Climb;
};

export default function GalleryItem({ climb }: GalleryItemProps) {
	const { isOpen, onOpenChange } = useDisclosure();
	const mediaUrl = `${BACKEND_URL}/${climb.media_url}`;

	return (
		<>
			<div
				onClick={onOpenChange}
				className="group relative hover:brightness-90 aspect-square transition-all hover:cursor-pointer"
			>
				{climb.is_video ? (
					<video src={mediaUrl} className="w-full h-full object-cover" autoPlay loop muted preload="metadata" />
				) : (
					<Image src={mediaUrl} removeWrapper className="rounded-none w-full h-full object-cover" />
				)}
				<span className="top-2 z-10 absolute flex flex-row justify-between gap-1 px-2 w-full">
					<span className="flex flex-row gap-2">
						<div className="bg-white px-2 py-0.5 rounded-xl outline-2 font-semibold">{climb.grade}</div>
						<FlashIcon />
					</span>
					<StarIcon
						className={`transition-opacity duration-150
                        ${climb.favorite ? "opacity-100 fill-red-600" : "opacity-0 fill-gray-300 group-hover:opacity-100"}
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
					<div className="top-4 left-4 z-10 absolute flex flex-col gap-5 text-white">
						<p>{formatDate(climb.date)}</p>
						<div className="flex flex-col gap-1">
							<p>
								{climb.grade}, {capitalize(climb.grade_opinion)}
							</p>
							{climb.color ? (
								<span className="flex flex-row items-center gap-2">
									<CircleIcon className={colorMapping[climb.color]} />
									<p>{capitalize(climb.color)}</p>
								</span>
							) : (
								<p>No Color</p>
							)}
						</div>
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
							{climb.outdoor && <Chip startContent={<CheckIcon />}>Outdoor</Chip>}
						</div>
					</div>
				</ModalContent>
			</Modal>
		</>
	);
}
