import { useNavigate } from "react-router-dom";
import MainHeader from "@/shared/components/MainHeader";
// import Map2Icon from "@shared/assets/icons/Map2Icon";
import About from "@features/dashboards/system/components/About";
import Statistics from "@features/dashboards/system/components/Statistics";
import Actions from "@features/dashboards/system/components/Actions";
import RecentActivity from "@features/dashboards/system/components/RecentActivity";

const SystemDashboardPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <MainHeader />
      <div className="max-w-7xl mx-auto bg-secondary text-primary px-3 my-8 flex flex-col gap-5">
        <About />
        <Statistics />
        <Actions />
        <RecentActivity />
      </div>
      
    </>
  );
};

export default SystemDashboardPage;
