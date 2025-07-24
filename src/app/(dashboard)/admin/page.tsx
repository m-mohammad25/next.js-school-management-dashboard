import Announcements from "@/components/Announcements";
import AttendenceChartContainer from "@/components/AttendenceChartContainer";
import CountChartContainer from "@/components/CountChartContainer";
import EventCalendar from "@/components/EventCalendar";
import FinanceChart from "@/components/FinanceChart";
import UserCart from "@/components/UserCart";

const AdminPage = () => {
  return (
    <div className="flex flex-col md:flex-row p-4 gap-4">
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* User Cards */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCart type="admin" />
          <UserCart type="student" />
          <UserCart type="teacher" />
          <UserCart type="parent" />
        </div>

        {/* Middle Charts */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* Count Chart  */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChartContainer />
          </div>
          {/* Attendence Chart  */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendenceChartContainer />
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
