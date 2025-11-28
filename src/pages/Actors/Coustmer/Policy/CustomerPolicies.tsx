import React, { useEffect, useMemo, useState } from "react";
import { getCustomerPolicies } from "../../../../api/Coustomer/Policy/policiesApi";
import type { CustomerPolicy } from "../../../../mockdata/policies";
import {
  ShieldCheck,
  ShieldAlert,
  RefreshCcw,
  Search,
  CalendarDays,
  DollarSign,
  AlertTriangle,
  Clock3,
  X
} from "lucide-react";

const STATUS_OPTIONS = ["All", "Active", "Pending Renewal", "Lapsed"] as const;

const getStatusBadge = (status: CustomerPolicy["status"]) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-700";
    case "Pending Renewal":
      return "bg-amber-100 text-amber-700";
    case "Lapsed":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const CustomerPolicies: React.FC = () => {
  const [policies, setPolicies] = useState<CustomerPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<typeof STATUS_OPTIONS[number]>("All");
  const [selectedPolicy, setSelectedPolicy] = useState<CustomerPolicy | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await getCustomerPolicies();
      setPolicies(result);
      setLoading(false);
    })();
  }, []);

  const filteredPolicies = useMemo(() => {
    return policies.filter((policy) => {
      const matchesStatus = statusFilter === "All" || policy.status === statusFilter;
      const matchesSearch =
        policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [policies, statusFilter, searchTerm]);

  const stats = useMemo(() => {
    const active = policies.filter((p) => p.status === "Active").length;
    const renewals = policies.filter((p) => p.status === "Pending Renewal").length;
    const overduePayments = policies.filter((p) => p.paymentStatus === "Overdue").length;
    return { active, renewals, overduePayments };
  }, [policies]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">My Policies</h1>
          <p className="text-amber-700">
            Track coverage, upcoming renewals, and premium payments in one place.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="bg-emerald-100 text-emerald-600 p-3 rounded-2xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-emerald-600 font-medium">Active Policies</p>
              <p className="text-2xl font-bold text-emerald-900">{stats.active}</p>
            </div>
          </div>
          <div className="bg-white border border-amber-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="bg-amber-100 text-amber-600 p-3 rounded-2xl">
              <RefreshCcw className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-amber-600 font-medium">Renewals Due</p>
              <p className="text-2xl font-bold text-amber-900">{stats.renewals}</p>
            </div>
          </div>
          <div className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="bg-red-100 text-red-600 p-3 rounded-2xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-red-600 font-medium">Overdue Payments</p>
              <p className="text-2xl font-bold text-red-900">{stats.overduePayments}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-amber-100 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by policy name or number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-amber-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-amber-300"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? "bg-amber-500 text-white"
                      : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Policy list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {loading ? (
            <div className="col-span-2 flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500" />
            </div>
          ) : filteredPolicies.length === 0 ? (
            <div className="col-span-2 text-center py-16 bg-white border border-dashed border-amber-200 rounded-2xl">
              <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <p className="text-amber-900 font-semibold text-lg">No policies found</p>
              <p className="text-amber-600 text-sm">Try adjusting your filters or search term.</p>
            </div>
          ) : (
            filteredPolicies.map((policy) => (
              <div
                key={policy.id}
                className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-amber-600 font-semibold">{policy.policyNumber}</p>
                    <h3 className="text-xl font-bold text-amber-900">{policy.name}</h3>
                    <p className="text-sm text-amber-700 mt-1 line-clamp-2">{policy.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(policy.status)}`}>
                    {policy.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-amber-800">
                    <CalendarDays className="w-4 h-4" />
                    <span>
                      Renewal: {new Date(policy.renewalDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-amber-800">
                    <Clock3 className="w-4 h-4" />
                    <span>Next Payment: {new Date(policy.nextPaymentDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-amber-800">
                    <DollarSign className="w-4 h-4" />
                    <span>Premium: ${policy.premium.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-amber-800">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Payment Status: {policy.paymentStatus}</span>
                  </div>
                </div>

                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => setSelectedPolicy(policy)}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors"
                  >
                    View Details
                  </button>
                  <button className="px-4 py-2 rounded-xl border border-amber-200 text-amber-700 text-sm font-semibold hover:bg-amber-50 transition-colors">
                    Pay Premium
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Details modal */}
      {selectedPolicy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 font-semibold">{selectedPolicy.policyNumber}</p>
                <h2 className="text-2xl font-bold text-amber-900">{selectedPolicy.name}</h2>
              </div>
              <button
                onClick={() => setSelectedPolicy(null)}
                className="p-2 rounded-full hover:bg-amber-50 text-amber-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-amber-50 rounded-xl p-4">
                <p className="text-xs text-amber-600 font-semibold uppercase">Coverage Details</p>
                <ul className="mt-2 space-y-1 text-amber-900">
                  {selectedPolicy.coverage.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 space-y-2 text-amber-900">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-amber-600" />
                  <span>
                    Effective: {new Date(selectedPolicy.effectiveDate).toLocaleDateString()} -{" "}
                    {new Date(selectedPolicy.renewalDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-600" />
                  <span>Premium: ${selectedPolicy.premium.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock3 className="w-4 h-4 text-amber-600" />
                  <span>Next payment: {new Date(selectedPolicy.nextPaymentDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Payment status: {selectedPolicy.paymentStatus}</span>
                </div>
              </div>
            </div>

            {selectedPolicy.benefits && (
              <div className="bg-white border border-amber-100 rounded-xl p-4">
                <p className="text-xs text-amber-600 font-semibold uppercase mb-2">Benefits</p>
                <div className="flex flex-wrap gap-2">
                  {selectedPolicy.benefits.map((benefit) => (
                    <span key={benefit} className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-medium">
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPolicies;

