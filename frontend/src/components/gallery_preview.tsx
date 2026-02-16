import { Climb } from "@/const";
import { Image } from "@heroui/image";

type GalleryPreviewProps = {
	climb: Climb;
};

export default function GalleryPreview({ climb }: GalleryPreviewProps) {
	return <Image src={climb.media_url} width={500} />;
}
