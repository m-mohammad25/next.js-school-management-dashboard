import Image from "next/image";

import EventCalendar from "./EventCalendar";
import EventList from "./EventList";
import prisma from "@/lib/prisma";

async function EventCalendarContainer({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { dateParam } = searchParams;
  const date = dateParam ? new Date(dateParam) : new Date();

  const eventsData = await prisma.event.findMany({
    where: {
      startTime: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 9999)),
      },
    },
  });

  console.log(eventsData);

  return (
    <div className="bg-white rounded-md p-4">
      <EventCalendar />
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold my-4">Events</h1>
          <Image src="/moreDark.png" alt="more" width={20} height={20} />
        </div>
        <EventList eventsData={eventsData} />
      </div>
    </div>
  );
}

export default EventCalendarContainer;
