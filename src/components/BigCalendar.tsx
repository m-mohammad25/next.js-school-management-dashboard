"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import { calendarEvents } from "../lib/data";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
const localizer = momentLocalizer(moment);

const BigCalnedar = () => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);
  const handleOnViewChange = (view: View) => {
    setView(view);
  };
  return (
    <Calendar
      localizer={localizer}
      events={calendarEvents}
      startAccessor="start"
      endAccessor="end"
      style={{ height: "98%" }}
      views={["work_week", "day"]}
      onView={handleOnViewChange}
      view={view}
      min={new Date(2025, 0, 1, 8, 0)}
      max={new Date(2025, 0, 1, 17, 0)}
    />
  );
};

export default BigCalnedar;
