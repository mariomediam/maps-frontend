const StatisticsItem = ({ icon, title, value, isLoading }) => {
  return (
    <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm text-primary">
      <div className="flex items-center gap-2">
        {icon}
        <p>{title}</p>
      </div>
      {isLoading ? (
        <div className="flex h-full mt-2 ms-2">
          <div className="animate-spin rounded-full h-2 w-2 border-b-1 border-primary"></div>
        </div>
      ) : (
        <p className="text-3xl font-extrabold text-primary">{value}</p>
      )}
    </div>
  );
};

export default StatisticsItem;
