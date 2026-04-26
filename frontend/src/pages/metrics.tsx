import { Api } from "@/api";
import BoolNumber from "@/components/charts/bool_number";
import ColorHistogram from "@/components/charts/color_pie";
import DateHeatmap from "@/components/charts/date_heatmap";
import GradeHistogram from "@/components/charts/grade_histogram";
import GradeLineplot from "@/components/charts/grade_lineplot";
import OpinionHistogram from "@/components/charts/opinion_histogram";
import StyleHistogram from "@/components/charts/style_histogram";
import StyleRadar from "@/components/charts/style_radar";
import WallHeatmap from "@/components/charts/wall_heatmap";
import WallHistogram from "@/components/charts/wall_histogram";
import FiltersModal, { Filter } from "@/components/filters_modal";
import { Climb } from "@/const";
import { useAuth } from "@/contexts/auth_context";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MetricsPage() {
    const {isLoggedIn, setIsLoggedIn} = useAuth()
    const navigate = useNavigate();
    const [climbIds, setClimbIds] = useState<number[]>([]);
    const [filters, setFilters] = useState<Filter>({
        video: 1,
        complete: undefined,
        flash: undefined,
        favorite: undefined,
        grades: [],
        opinions: [],
        colors: [],
        walls: [],
        styles: [],
    });

    useEffect(() => {
        Api.is_logged_in().then((response) => {
            setIsLoggedIn(response.data.logged_in);
        });
    }, []);

    useEffect(() => {
        Api.get_filtered_climbs(filters).then((response) => {
            setClimbIds(response.data.map((climb: Climb) => climb.id));
        });
    }, [filters]);

    return (
        <>
            <header className="flex md:flex-row flex-col md:justify-between md:items-center gap-4 p-4 w-full">
                <div className="flex justify-between md:justify-start items-baseline gap-7 w-full md:w-auto">
                    <h2
                        onClick={() => navigate("/gallery")}
                        className="font-bold text-neutral-400 hover:text-neutral-500 text-2xl md:text-3xl transition-all hover:cursor-pointer"
                    >
                        Gallery 
                    </h2>
                    <h1 className="font-bold text-4xl md:text-5xl">Metrics</h1>
                </div>
                <div className="flex justify-between md:justify-end items-center gap-3 w-full md:w-auto">
                    <p className="font-semibold">
                        {climbIds.length}{" "}
                        {climbIds.length == 1 ? "Result" : "Results"}
                    </p>
                    <FiltersModal setFilters={setFilters} />
                </div>
            </header>

            <div className="flex flex-col gap-6 px-4 md:px-20">
                {/* Top charts */}
                <div className="flex md:flex-row flex-col gap-6">
                    <div className="md:flex-[2] w-full">
                        <DateHeatmap climb_ids={climbIds} />
                    </div>
                    <div className="md:flex-1 w-full">
                        <ColorHistogram climb_ids={climbIds} />
                    </div>
                    <div className="md:flex-1 w-full">
                        <StyleRadar climb_ids={climbIds} />
                    </div>
                </div>

                {/* Bottom section */}
                <div className="flex md:flex-row flex-col gap-6">
                    {/* Left side */}
                    <div className="flex flex-col gap-6 w-full md:w-1/2">
                        <div className="md:-mt-6 md:-ml-20 w-full">
                            <GradeLineplot climb_ids={climbIds} />
                        </div>

                        <div className="flex md:flex-row flex-col gap-6 md:-mt-2">
                            <div className="w-full">
                                <GradeHistogram climb_ids={climbIds} />
                            </div>
                            <div className="w-full">
                                <OpinionHistogram climb_ids={climbIds} />
                            </div>
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex flex-col items-center md:gap-6 md:-mt-6 mb-16 md:mb-0 w-full md:w-1/2">
                        <WallHeatmap climb_ids={climbIds} />
                        <div className="flex justify-center items-center gap-x-4 md:gap-x-10 w-full">
                            <BoolNumber climb_ids={climbIds} field="complete" />
                            <div className="bg-neutral-800 w-1 h-16 md:h-32" />
                            <BoolNumber climb_ids={climbIds} field="flash" />
                            <div className="bg-neutral-800 w-1 h-16 md:h-32" />
                            <BoolNumber climb_ids={climbIds} field="favorite" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
