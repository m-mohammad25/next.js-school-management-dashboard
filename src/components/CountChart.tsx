"use client";

import Image from "next/image";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Total",
    count: 106,
    fill: "#fff",
  },
  {
    name: "Boys",
    count: 55,
    fill: "#C3EBFA",
  },
  {
    name: "Girls",
    count: 45,
    fill: "#FAE27C",
  },
];

const CountChart = () => {
  return (
    <div className="h-full w-full rounded-xl bg-white p-4">
      {/*  Title */}
      <div className="flex justify-between items-center ">
        <h1 className="text-lg font-semibold">Students</h1>
        <Image src="/moreDark.png" alt="more" width={20} height={20} />
      </div>
      {/* Chart */}
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

      {/* Bottom   */}
      <div className="flex justify-center items-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 rounded-full bg-lamaSky"></div>
          <h1 className="font-bold">1,234</h1>
          <h2 className="text-xs text-gray-300 ">Boys (55%)</h2>
        </div>

        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 rounded-full bg-lamaYellow"></div>
          <h1 className="font-bold">1,234</h1>
          <h2 className="text-xs text-gray-300 ">Girls (45%)</h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
