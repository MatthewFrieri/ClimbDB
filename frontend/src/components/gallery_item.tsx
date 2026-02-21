import { Climb } from "@/const";
import { Image } from "@heroui/image";
import { Chip } from "@heroui/chip";
import { FlashIcon, StarIcon } from "./icons";

type GalleryItemProps = {
	climb: Climb;
};

export default function GalleryItem({ climb }: GalleryItemProps) {
	return (
		<div className="group relative aspect-square">
			<Image
				src={`http://localhost:8000/${climb.media_url}`}
				removeWrapper
				className="rounded-none w-full h-full object-cover"
			/>
			<span className="top-2 left-2 absolute flex justify-center gap-1">
				<div className="z-10 bg-white px-2 py-0.5 rounded-xl font-semibold">{climb.grade}</div>
				<FlashIcon className="z-10 fill-red-500" />
			</span>
			<StarIcon
				className={`z-10 
					absolute top-2 right-2
					transition-opacity duration-150
					${climb.favorite ? "opacity-100 fill-amber-400" : "opacity-0 fill-transparent group-hover:opacity-100"}
				`}
			/>
		</div>
	);
}
