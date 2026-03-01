import { Api } from "@/api";
import { capitalize } from "@/const";
import { useEffect, useState } from "react";

export default function BoolNumber({
	climb_ids,
	field,
}: {
	climb_ids: number[];
	field: "complete" | "flash" | "favorite";
}) {
	const [data, setData] = useState<number | null>(null);

	useEffect(() => {
		Api.bool_data(climb_ids).then((response) => {
			setData(response.data[field]);
		});
	}, [climb_ids]);

	return (
		<div className="font-bold text-black text-center">
			<p className="mb-2 text-7xl">{data}</p>
			<p className="text-xl">
				{capitalize(field)}
				{field == "flash" && "e"}d
			</p>
		</div>
	);
}
