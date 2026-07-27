import {
    BACKEND_URL,
    capitalize,
    Climb,
    colorMapping,
    formatDate,
} from "@/const";
import {
    CircleIcon,
    CrossIcon,
    FlashIcon,
    StarIcon,
} from "@/components/icons";
import { Chip } from "@heroui/chip";
import { Wall } from "@/types";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Api } from "@/api";
import { useAuth } from "@/contexts/auth_context";
import EditModal from "@/components/edit_modal";
import DeleteButton from "@/components/delete_button";

export default function ClimbPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { isLoggedIn } = useAuth();

    const [climb, setClimb] = useState<Climb | null>(null);
    const [refresh, setRefresh] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        if (!id) return;

        Api.get_climb(Number(id))
            .then((response) => {
                setClimb(response.data);
            })
            .catch(() => {
                setClimb(null);
            });
    }, [id, refresh]);

    if (!climb) {
        return (
            <div className="flex justify-center items-center h-dvh">
                Loading...
            </div>
        );
    }

    const mediaUrl = `${BACKEND_URL}/${climb.media_url}`;

    return (
        <div className="relative flex justify-center items-center bg-black w-full h-dvh overflow-hidden text-white">
            {/* Gallery button */}
            <button
                onClick={() => navigate("/gallery")}
                className="top-5 left-5 z-30 absolute flex items-center gap-2 bg-white/10 hover:bg-white/20 shadow-lg backdrop-blur-md px-4 py-2 border border-white/20 rounded-full font-semibold hover:scale-105 transition-all"
            >
                <span className="text-xl">←</span>
                Gallery
            </button>

            {/* Info toggle */}
            <button
                onClick={() => setShowInfo(!showInfo)}
                className="top-5 right-5 z-30 absolute flex justify-center items-center bg-white/10 hover:bg-white/20 shadow-lg backdrop-blur-md border border-white/20 rounded-full w-11 h-11 text-xl hover:scale-105 transition-all"
            >
                ⓘ
            </button>

            {/* Media */}
            {climb.is_video ? (
                <video
                    src={mediaUrl}
                    className="w-full h-dvh object-contain"
                    autoPlay
                    loop
                    controls
                    preload="metadata"
                />
            ) : (
                <img
                    src={mediaUrl}
                    className="w-full h-dvh object-contain"
                />
            )}

            {/* Info drawer */}
            <div
                className={`
                    top-0 right-0 z-20 absolute
                    flex flex-col gap-6
                    bg-black/80 backdrop-blur-xl
                    border-l border-white/10
                    p-8
                    w-60 h-dvh
                    overflow-y-auto
                    transition-transform duration-300
                    ${showInfo ? "translate-x-0" : "translate-x-full"}
                `}
            >
                <div className="flex justify-between items-center">
                    <h2 className="font-bold text-2xl">
                        {climb.grade}
                    </h2>

                    <button
                        onClick={() => setShowInfo(false)}
                        className="text-neutral-400 hover:text-white text-xl"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-3">
                    <p>{formatDate(climb.date)}</p>

                    <div className="flex items-center gap-2">
                        <CircleIcon className={colorMapping[climb.color]} />
                        <p>{capitalize(climb.color)}</p>
                    </div>

                    <p>
                        {climb.wall === Wall.other
                            ? "Unknown Wall"
                            : capitalize(climb.wall)}
                    </p>

                    <p>
                        {capitalize(climb.opinion)}
                    </p>
                </div>

                <div>
                    <p className="mb-2 font-semibold">
                        Styles
                    </p>

                    <ul className="pl-5 list-disc">
                        {climb.styles?.map((style) => (
                            <li key={style}>
                                {capitalize(style)}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col gap-2">
                    {!climb.complete && (
                        <Chip startContent={<CrossIcon />}>
                            Not Complete
                        </Chip>
                    )}

                    {climb.flash && (
                        <Chip startContent={<FlashIcon size={20} />}>
                            Flash
                        </Chip>
                    )}

                    {climb.favorite && (
                        <Chip startContent={<StarIcon size={20} />}>
                            Favorite
                        </Chip>
                    )}
                </div>

                {isLoggedIn && (
                    <div className="flex gap-2 pt-4 border-white/20 border-t">
                        <EditModal
                            climb={climb}
                            setRefresh={setRefresh}
                        />

                        <DeleteButton
                            climb={climb}
                            setRefresh={setRefresh}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
