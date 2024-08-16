"use client"
import { useEffect, useState } from "react";


export default function header() {
    const [data, setData] = useState({name: ""});

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("/api/account", { method: "GET" });
                if (response.status === 200) {
                    const result = await response.json();
                    setData(result);
                } else {
                    console.error('Failed to fetch data', response.status);
                }
            } catch (error) {
                console.error('Error fetching data', error);
            }
        }

        fetchData();
    }, []);

	return <div className="p-4 mb-4">
		<h2 className="text-3xl font-bold">Top 50 songs for {data.name}</h2>
		<p className="">1-50</p>
	</div>
}