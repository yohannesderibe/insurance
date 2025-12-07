// OpDash.tsx - Bee-Themed Dashboard (with available icons)
import React, { useState, useEffect } from "react";
import { getClaims } from "../../../api/OperatingOfficer/operatingOfficerApi";
import { useNavigate } from "react-router-dom";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Inbox, 
  CreditCard, 
  TrendingUp, 
  Users,
  DollarSign,
  Shield,
  ArrowRight,
  FileText,
  Bell,
  Activity,
  Hexagon,
  Home,
  Zap,
  Star,
  AlertCircle
} from "lucide-react";

const OpDash: React.FC = () => {
  const [stats, setStats] = useState<{ total: number; approved: number; rejected: number; inReview: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      setLoading(true);
      const claims = await getClaims();
      const approved = claims.filter(c => c.status === "Approved").length;
      const rejected = claims.filter(c => c.status === "Rejected").length;
      const inReview = claims.filter(c => c.status === "In Review").length;
      setStats({ total: claims.length, approved, rejected, inReview });
    } catch (error) {
      console.error("Error fetching claims:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const hiveCards = [
    {
      title: "Payment Hive",
      description: "Manage all payment collections",
      icon: Hexagon,
      color: "amber",
      count: "Enter Hive",
      action: () => navigate("/operating/payments"),
      bg: "bg-gradient-to-br from-amber-50 to-yellow-50/50"
    },
    {
      title: "Claims Garden",
      description: "Review insurance flowers",
      icon: AlertCircle,
      color: "green",
      count: stats?.total || 0,
      action: () => navigate("/operating-claims"),
      bg: "bg-gradient-to-br from-green-50 to-emerald-50/50"
    },
    {
      title: "Approved Pollen",
      description: "Successfully processed claims",
      icon: CheckCircle,
      color: "emerald",
      count: stats?.approved || 0,
      action: () => navigate("/operating-claims?status=approved"),
      bg: "bg-gradient-to-br from-emerald-50 to-teal-50/50"
    },
    {
      title: "Pending Nectar",
      description: "Requires bee attention",
      icon: Clock,
      color: "yellow",
      count: stats?.inReview || 0,
      action: () => navigate("/operating-claims?status=pending"),
      bg: "bg-gradient-to-br from-yellow-50 to-amber-50/50"
    }
  ];

  const hiveActivities = [
    { time: "Just now", activity: "New honey collection received", user: "Worker Bee #123" },
    { time: "10 min ago", activity: "Pollen approved by Queen Bee", user: "Queen Bee" },
    { time: "1 hour ago", activity: "Honey storage completed", user: "Storage Bee" },
    { time: "2 hours ago", activity: "New bee joined the hive", user: "New Bee" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-honey-light via-honey-cream to-honey-gold/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <Hexagon className="w-10 h-10 text-amber-600 mr-3" />
                <div>
                  <h1 className="text-4xl font-bold text-amber-900">Bee Insurance Hive</h1>
                  <p className="text-amber-700">
                    Welcome to your operating dashboard, beekeeper!
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="relative">
                <Bell className="w-6 h-6 text-amber-600" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </div>
              <button 
                onClick={() => navigate("/operating/payments")}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-xl hover:from-amber-600 hover:to-yellow-700 flex items-center shadow-lg"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Enter Payment Hive
              </button>
            </div>
          </div>
        </header>

        {/* Hive Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {hiveCards.map((card, index) => (
            <div 
              key={index}
              className={`${card.bg} rounded-2xl border border-${card.color}-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1`}
              onClick={card.action}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${card.color}-100`}>
                  <card.icon className={`w-8 h-8 text-${card.color}-600`} />
                </div>
                <span className="text-3xl font-bold text-amber-900">{card.count}</span>
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-2">{card.title}</h3>
              <p className="text-amber-700 mb-4">{card.description}</p>
              <div className="flex items-center text-amber-600 font-medium">
                <span>Buzz to action</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          ))}
        </div>

        {/* Main Hive */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Hive Health */}
          <div className="lg:col-span-2">
            {/* Hive Performance */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-100 p-6 mb-6 shadow-lg">
              <h2 className="text-2xl font-bold text-amber-900 mb-4 flex items-center">
                <Activity className="w-6 h-6 mr-2 text-amber-600" />
                Hive Performance
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-5 border border-amber-200">
                  <div className="flex items-center">
                    <DollarSign className="w-10 h-10 text-amber-600 mr-3" />
                    <div>
                      <p className="text-sm text-amber-600">Honey Collection</p>
                      <p className="text-3xl font-bold text-amber-900">$245,880</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-green-600">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    +12.5% this season
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                  <div className="flex items-center">
                    <CheckCircle className="w-10 h-10 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm text-green-600">Success Rate</p>
                      <p className="text-3xl font-bold text-green-900">94.2%</p>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-green-700">
                    Flowers pollinated successfully
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                  <div className="flex items-center">
                    <Users className="w-10 h-10 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm text-blue-600">Active Bees</p>
                      <p className="text-3xl font-bold text-blue-900">1,247</p>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-blue-700">
                    Currently in the hive
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Hive Activity */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-100 p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">Recent Hive Activity</h2>
              <div className="space-y-4">
                {hiveActivities.map((activity, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                      <Zap className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-amber-900 font-bold">{activity.activity}</p>
                      <div className="flex items-center text-sm text-amber-600 mt-1">
                        <span className="bg-amber-100 px-2 py-1 rounded-lg">{activity.user}</span>
                        <span className="mx-3">•</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 border border-amber-300 rounded-xl hover:bg-amber-50 text-amber-700 text-center font-medium">
                View All Buzz Activity
              </button>
            </div>
          </div>

          {/* Right Column - Quick Buzz */}
          <div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-100 p-6 mb-6 shadow-lg">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">Quick Buzz</h2>
              <div className="space-y-3">
                {[
                  { label: "Create Honey Link", icon: Hexagon, color: "amber" },
                  { label: "Generate Pollen Report", icon: FileText, color: "green" },
                  { label: "Bee Management", icon: Users, color: "blue" },
                  { label: "Hive Settings", icon: Shield, color: "purple" }
                ].map((action, index) => (
                  <button
                    key={index}
                    className="w-full p-4 border border-amber-200 rounded-xl hover:bg-amber-50 flex items-center justify-between transition-all duration-200 hover:border-amber-300"
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg bg-${action.color}-100 mr-3`}>
                        <action.icon className={`w-5 h-5 text-${action.color}-600`} />
                      </div>
                      <span className="font-bold text-amber-900">{action.label}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-amber-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Hive Status */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50/50 rounded-2xl border border-amber-100 p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">Hive Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                  <span className="text-amber-700">API Connection</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Buzzing
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                  <span className="text-amber-700">Honey Storage</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Healthy
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                  <span className="text-amber-700">Flower Load</span>
                  <span className="text-amber-900 font-bold">24%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                  <span className="text-amber-700">Hive Uptime</span>
                  <span className="text-amber-900 font-bold">99.9%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-yellow-50/50 rounded-2xl border border-amber-200">
          <div className="flex items-center justify-center">
            <Zap className="w-6 h-6 text-amber-600 mr-2 animate-pulse" />
            <p className="text-amber-700">
              The hive is buzzing with <span className="font-bold text-amber-800">{stats?.total || 0}</span> active flowers today!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpDash;