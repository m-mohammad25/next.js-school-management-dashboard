"use client";

import Image from "next/image";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

const CountChart = ({
  boysCount,
  girlsCount,
}: {
  boysCount: number;
  girlsCount: number;
}) => {
  const data = [
    {
      name: "Total",
      count: boysCount + girlsCount,
      fill: "#fff",
    },
    {
      name: "Boys",
      count: boysCount,
      fill: "#C3EBFA",
    },
    {
      name: "Girls",
      count: girlsCount,
      fill: "#FAE27C",
    },
  ];

  return (
    <div className="relative w-full h-[75%]">
      <ResponsiveContainer>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="40%"
          outerRadius="100%"
          barSize={32}
          data={data}
        >
          <RadialBar background dataKey="count" />
        </RadialBarChart>
      </ResponsiveContainer>
      <Image
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        src="/maleFemale.png"
        alt="maleFemale"
        width={50}
        height={50}
      />
    </div>
  );
};

export default CountChart;
