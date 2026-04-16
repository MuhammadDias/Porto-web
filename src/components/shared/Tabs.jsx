const Tabs = ({ tabs, activeTab, setActiveTab, className = "" }) => {
  return (
    <div className={`flex gap-2 flex-wrap overflow-x-auto pb-1 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
            ${activeTab === tab
              ? 'bg-white text-black'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
