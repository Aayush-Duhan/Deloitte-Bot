import { 
  RiUserLine, 
  RiShoppingBag3Line, 
  RiErrorWarningLine, 
  RiTimeLine,
  RiFileChartLine,
  RiMoreFill,
  RiMailLine,
  RiTeamLine,
  RiRestartLine,
  RiArrowUpSLine,
  RiArrowDownSLine,
  RiSearchLine
} from 'react-icons/ri';

const Overview = () => {
  const stats = [
    { 
      label: 'Active Users', 
      value: '24', 
      change: '+12%', 
      trend: 'up', 
      icon: RiUserLine,
      color: 'purple'
    },
    { 
      label: 'Processed Orders', 
      value: '1,234', 
      change: '+23%', 
      trend: 'up', 
      icon: RiShoppingBag3Line,
      color: 'blue'
    },
    { 
      label: 'Failed Orders', 
      value: '12', 
      change: '-5%', 
      trend: 'down', 
      icon: RiErrorWarningLine,
      color: 'red'
    },
    { 
      label: 'Processing Time', 
      value: '1.2s', 
      change: '-15%', 
      trend: 'down', 
      icon: RiTimeLine,
      color: 'green'
    },
  ];

  const recentActivity = [
    { 
      type: 'order', 
      message: 'New order processed from Company XYZ', 
      time: '2 minutes ago', 
      icon: RiShoppingBag3Line,
      color: 'blue'
    },
    { 
      type: 'email', 
      message: 'Email template updated by Admin', 
      time: '15 minutes ago', 
      icon: RiMailLine,
      color: 'purple'
    },
    { 
      type: 'user', 
      message: 'New user registered: ABC Corp', 
      time: '1 hour ago', 
      icon: RiTeamLine,
      color: 'green'
    },
    { 
      type: 'system', 
      message: 'System backup completed', 
      time: '2 hours ago', 
      icon: RiRestartLine,
      color: 'orange'
    },
  ];

  const getColorClasses = (color) => {
    const classes = {
      purple: 'bg-purple-500/10 text-purple-300',
      blue: 'bg-blue-500/10 text-blue-300',
      red: 'bg-red-500/10 text-red-300',
      green: 'bg-green-500/10 text-green-300',
      orange: 'bg-orange-500/10 text-orange-300'
    };
    return classes[color] || classes.purple;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
          <p className="text-sm text-zinc-400 mt-1">Monitor your bot's performance and activity</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
          <button className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors flex items-center space-x-2">
            <RiFileChartLine size={20} />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-purple-500/50 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">
                      {stat.label}
                    </p>
                    <span className={`inline-flex items-center ${
                      stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {stat.trend === 'up' ? <RiArrowUpSLine size={16} /> : <RiArrowDownSLine size={16} />}
                      <span className="text-xs">{stat.change}</span>
                    </span>
                  </div>
                  <p className="text-2xl font-semibold text-white mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${getColorClasses(stat.color)} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Recent Activity</h3>
          <button className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors">
            <RiMoreFill size={20} />
          </button>
        </div>
        <div className="divide-y divide-white/5">
          {recentActivity.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 hover:bg-white/5 transition-colors group"
              >
                <div className={`w-10 h-10 rounded-lg ${getColorClasses(activity.color)} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{activity.message}</p>
                  <p className="text-xs text-zinc-400 mt-1">{activity.time}</p>
                </div>
                <button className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white">
                  <RiMoreFill size={20} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Overview; 