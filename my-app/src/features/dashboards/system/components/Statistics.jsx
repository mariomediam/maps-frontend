import { useState, useEffect } from "react";
import ChartLineIcon from "@shared/assets/icons/ChartLine";
import FileTextIcon from "@shared/assets/icons/FileTextIcon";
import ClockIcon from "@shared/assets/icons/ClockIcon";
import ListCheckIcon from "@shared/assets/icons/ListCheckIcon";
import StatisticsItem from "@/features/dashboards/system/components/StatisticsItem";
import { getIncidentsTotal } from "@/features/incident/services/incidentApi";

const Statistics = () => {
  const [statistics, setStatistics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getStatistics = async () => {
      try {
        setIsLoading(true);
        const statistics = await getIncidentsTotal();
        setStatistics(statistics);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getStatistics();
  }, []);

  return (
    <>      
      <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm ">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-primary flex items-center">
          <ChartLineIcon className="me-1" /> Estadísticas del Sistema
        </h5>
        <div className="flex gap-2 justify-evenly flex-wrap">
          <StatisticsItem
            icon={<FileTextIcon />}
            title="Reportadas"
            value={statistics.total}
            isLoading={isLoading}
          />
          <StatisticsItem
            icon={<ClockIcon />}
            title="En proceso"
            value={statistics.pending}
            isLoading={isLoading}
          />
          <StatisticsItem
            icon={<ListCheckIcon />}
            title="Finalizadas"
            value={statistics.closed}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
};

export default Statistics;
