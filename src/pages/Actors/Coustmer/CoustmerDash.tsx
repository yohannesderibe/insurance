import React from "react";
import { Link } from "react-router-dom";
import { 
  Shield, 
  FileText, 
  CreditCard, 
  AlertTriangle,
  TrendingUp,
  Users,
  Star,
  ArrowRight
} from "lucide-react";

const CoustmerDash: React.FC = () => {

  const quickActions = [
    {
      title: "Browse Insurance",
      description: "Explore our comprehensive insurance categories",
      icon: <Shield className="w-8 h-8" />,
      link: "/customer/categories",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "My Policies",
      description: "View and manage your existing policies",
      icon: <FileText className="w-8 h-8" />,
      link: "/customer/policies",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Submit Claim",
      description: "File a new insurance claim",
      icon: <AlertTriangle className="w-8 h-8" />,
      link: "/customer/claims",
      color: "bg-orange-500 hover:bg-orange-600"
    },
    {
      title: "Make Payment",
      description: "Pay your insurance premiums",
      icon: <CreditCard className="w-8 h-8" />,
      link: "/customer/payments",
      color: "bg-purple-500 hover:bg-purple-600"
    }
  ];

  const stats = [
    { label: "Active Policies", value: "3", icon: <Shield className="w-6 h-6" />, color: "text-blue-600" },
    { label: "Total Claims", value: "1", icon: <AlertTriangle className="w-6 h-6" />, color: "text-orange-600" },
    { label: "Premium Paid", value: "$2,400", icon: <TrendingUp className="w-6 h-6" />, color: "text-green-600" },
    // { label: "Next Payment", value: "Dec 15", icon: <CreditCard className="w-6 h-6" />, color: "text-purple-600" }
  ];

  const recentActivities = [
    { action: "Health Insurance Premium Paid", date: "Nov 15, 2024", status: "completed" },
    { action: "Auto Insurance Claim Submitted", date: "Nov 10, 2024", status: "pending" },
    { action: "Life Insurance Policy Renewed", date: "Nov 1, 2024", status: "completed" }
  ];

  return (
    <div className="min-h-screen">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border-b border-amber-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-2">Welcome back, John!</h1>
          <p className="text-neutral-600 text-lg">Here's what's happening with your insurance today</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-neutral-200/50 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-neutral-800">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/50 p-6 mb-8">
              <h2 className="text-xl font-bold text-neutral-800 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className="p-6 rounded-xl border border-neutral-200/50 hover:shadow-md hover:border-amber-300 transition-all group"
                  >
                    <div className="flex items-center mb-4">
                      <div className={`p-3 rounded-xl text-white mr-4 shadow-sm ${action.color}`}>
                        {action.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-neutral-800 group-hover:text-amber-700 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-neutral-500">{action.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-amber-600 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/50 p-6">
              <h2 className="text-xl font-bold text-neutral-800 mb-6">Recent Activities</h2>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        activity.status === 'completed' ? 'bg-green-500' : 'bg-amber-500'
                      }`} />
                      <div>
                        <p className="font-medium text-neutral-800">{activity.action}</p>
                        <p className="text-sm text-neutral-500">{activity.date}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'completed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Insurance Recommendations */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/50 p-6">
              <h3 className="text-lg font-bold text-neutral-800 mb-4">Recommended for You</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                  <div className="flex items-center mb-2">
                    <Shield className="w-5 h-5 text-blue-600 mr-2" />
                    <h4 className="font-semibold text-blue-900">Home Insurance</h4>
                  </div>
                  <p className="text-sm text-blue-700 mb-3">Protect your home with comprehensive coverage</p>
                  <Link 
                    to="/categories" 
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                  >
                    Learn More →
                  </Link>
                </div>
                
                <div className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                  <div className="flex items-center mb-2">
                    <Users className="w-5 h-5 text-green-600 mr-2" />
                    <h4 className="font-semibold text-green-900">Family Plan</h4>
                  </div>
                  <p className="text-sm text-green-700 mb-3">Save 15% with our family insurance bundle</p>
                  <Link 
                    to="/categories" 
                    className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
                  >
                    View Plans →
                  </Link>
                </div>
              </div>
            </div>

            {/* Customer Support */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/50 p-6">
              <h3 className="text-lg font-bold text-neutral-800 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
                  <Star className="w-5 h-5 text-amber-600 mr-3" />
                  <div>
                    <p className="font-medium text-neutral-800">Customer Support</p>
                    <p className="text-sm text-neutral-500">24/7 assistance available</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
                  <FileText className="w-5 h-5 text-amber-600 mr-3" />
                  <div>
                    <p className="font-medium text-neutral-800">Policy Documents</p>
                    <p className="text-sm text-neutral-500">Download your policies</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoustmerDash;