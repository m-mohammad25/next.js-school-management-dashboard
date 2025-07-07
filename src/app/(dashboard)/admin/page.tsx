import {
  Announcements,
  AttendenceChart,
  CountChart,
  EventCalendar,
  FinanceChart,
  UserCart,
} from "@/components";

const AdminPage = () => {
  return (
    <div className="flex flex-col md:flex-row p-4 gap-4">
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* User Cards */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCart type="student" />
          <UserCart type="teacher" />
          <UserCart type="parent" />
          <UserCart type="staff" />
        </div>

        {/* Middle Charts */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* Count Chart  */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChart />
          </div>
          {/* Attendence Chart  */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendenceChart />
          </div>
        </div>
        {/* Bottom Chart  */}
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>
      <div className="w-full md:w-1/3">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default AdminPage;
