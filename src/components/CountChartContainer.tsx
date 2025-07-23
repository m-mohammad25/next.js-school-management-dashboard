import Image from "next/image";
import CountChart from "./CountChart";
import prisma from "@/lib/prisma";

async function CountChartContainer() {
  const studentsCount = await prisma.student.groupBy({
    by: "sex",
    _count: true,
  });

  const boysCount = studentsCount.find((s) => s.sex === "MALE")?._count || 0;
  const girlsCount = studentsCount.find((s) => s.sex === "FEMALE")?._count || 0;
  return (
    <div className="h-full w-full rounded-xl bg-white p-4">
      {/*  Title */}
      <div className="flex justify-between items-center ">
        <h1 className="text-lg font-semibold">Students</h1>
        <Image src="/moreDark.png" alt="more" width={20} height={20} />
      </div>
      {/* Chart */}
      <CountChart boysCount={boysCount} girlsCount={girlsCount} />
      {/* Bottom   */}
      <div className="flex justify-center items-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 rounded-full bg-lamaSky"></div>
          <h1 className="font-bold">{boysCount}</h1>
          <h2 className="text-xs text-gray-300 ">
            Boys ({Math.round((boysCount / (boysCount + girlsCount)) * 100)}%)
          </h2>
        </div>

        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 rounded-full bg-lamaYellow"></div>
          <h1 className="font-bold">{girlsCount}</h1>
          <h2 className="text-xs text-gray-300 ">
            Girls ({Math.round((girlsCount / (boysCount + girlsCount)) * 100)}%)
          </h2>
        </div>
      </div>
    </div>
  );
}

export default CountChartContainer;
