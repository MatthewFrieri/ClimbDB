import { BACKEND_URL, Climb } from "@/const";
import { CrossIcon, FlashIcon, StarIcon } from "./icons";
import { useNavigate } from "react-router-dom";

type GalleryItemProps = {
    climb: Climb;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function GalleryItem({ climb }: GalleryItemProps) {
    const navigate = useNavigate();

    const previewUrl = `${BACKEND_URL}/${climb.is_video ? climb.thumbnail_url : climb.media_url}`;

    return (
        <div
            onClick={() => navigate(`/gallery/${climb.id}`)}
            className="group relative hover:opacity-80 aspect-square transform-gpu transform-opacity transition-opacity hover:cursor-pointer will-change-opacity will-change-transform"
        >
            <img
                src={previewUrl}
                className="rounded-none w-full h-full object-cover"
                loading="lazy"
            />

            <span className="top-2 z-10 absolute flex flex-row justify-between gap-1 px-2 w-full">
                <span className="flex flex-row gap-2">
                    <div className="bg-white px-2 py-0.5 rounded-xl outline-2 font-semibold">
                        {climb.grade}
                    </div>

                    {climb.flash && <FlashIcon />}

                    {!climb.complete && <CrossIcon />}
                </span>

                {climb.favorite && <StarIcon />}
            </span>
        </div>
    );
}
