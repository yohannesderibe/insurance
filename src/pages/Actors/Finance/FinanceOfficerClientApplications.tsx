import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getApplications, updateApplicationStatus, editApplication } from "../../../api/Finance/financeOfficerApi";
import type { ClientApplication } from "../../../mockdata/clientApplications";
import { TableRow, TableCell } from "@mui/material";
import ReusableTable from "../../../components/Tables/ReusableTable";
import { Search, CheckCircle, XCircle, Edit, Calendar, User } from "lucide-react";

type FilterStatus = "All" | "Pending" | "Accepted" | "Rejected" | "Edited" | "AwaitingPayment";

const EditModal: React.FC<{
  application: ClientApplication | null;
  onClose: () => void;
  onSaved: () => void;
}> = ({ application, onClose, onSaved }) => {
  const [premium, setPremium] = useState<number>(application?.premium ?? 0);
  const [coverageAmount, setCoverageAmount] = useState<number>(application?.coverageAmount ?? 0);
  const [notes, setNotes] = useState<string>(application?.notes ?? "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (application) {
      setPremium(application.premium);
      setCoverageAmount(application.coverageAmount);
      setNotes(application.notes ?? "");
    }
  }, [application]);

  const save = async () => {
    if (!application) return;
    setLoading(true);
    try {
      await editApplication(application.id, { premium, coverageAmount, notes });
      onSaved();
    } finally {
      setLoading(false);
    }
  };

  if (!application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg bg-white rounded-xl border border-amber-200 shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-amber-900">Edit Application</h3>
          <button onClick={onClose} className="px-3 py-1 rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50">Close</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-amber-700 mb-1">Premium *</label>
            <input type="number" value={premium} onChange={e=>setPremium(Number(e.target.value))} className="w-full border border-amber-200 rounded-lg p-2 text-sm focus:ring-1 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-amber-700 mb-1">Coverage Amount *</label>
            <input type="number" value={coverageAmount} onChange={e=>setCoverageAmount(Number(e.target.value))} className="w-full border border-amber-200 rounded-lg p-2 text-sm focus:ring-1 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-amber-700 mb-1">Notes</label>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={4} className="w-full border border-amber-200 rounded-lg p-2 text-sm focus:ring-1 focus:ring-amber-500" />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50">Cancel</button>
          <button onClick={save} disabled={loading} className="px-4 py-2 text-sm rounded-lg bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50">{loading?"Saving...":"Save"}</button>
        </div>
      </div>
    </div>
  );
};

const FinanceOfficerClientApplications: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [allApplications, setAllApplications] = useState<ClientApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<FilterStatus>((searchParams.get("status") as FilterStatus) || "All");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [editing, setEditing] = useState<ClientApplication | null>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const data = await getApplications();
      setAllApplications(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const filtered = useMemo(() => {
    return allApplications.filter(a => {
      const matchesText = `${a.customerName} ${a.policyType}`.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "All" ? true : a.status === status;
      const submitted = new Date(a.submittedAt).getTime();
      const fromOk = dateFrom ? submitted >= new Date(dateFrom).getTime() : true;
      const toOk = dateTo ? submitted <= new Date(dateTo).getTime() : true;
      return matchesText && matchesStatus && fromOk && toOk;
    });
  }, [allApplications, search, status, dateFrom, dateTo]);

  const approve = async (id: string) => {
    if (!window.confirm("Accept this application?")) return;
    await updateApplicationStatus(id, "Accepted");
    alert("Accepted. A success message has been sent to the customer.");
    await fetch();
  };

  const sendForPayment = async (id: string) => {
    await updateApplicationStatus(id, "AwaitingPayment");
    alert("Application sent back to customer for payment.");
    await fetch();
  };

  const reject = async (id: string) => {
    const reason = window.prompt("Enter rejection reason:");
    if (reason === null) return;
    await updateApplicationStatus(id, "Rejected", reason || undefined);
    alert("Rejected. Rejection message sent to customer.");
    await fetch();
  };

  const columns = [
    { label: "Customer", key: "customerName" },
    { label: "Policy Type", key: "policyType" },
    { label: "Premium", key: "premium", align: "right" as const },
    { label: "Coverage", key: "coverageAmount", align: "right" as const },
    { label: "Submitted", key: "submittedAt" },
    { label: "Status", key: "status" },
    { label: "Actions", key: "actions", align: "center" as const },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 to-yellow-50/50">
      <div className="bg-white border-b border-amber-200 shadow-sm mb-6">
        <div className="p-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">Client Applications</h1>
          <p className="text-amber-700 mt-1">Review customer-submitted insurance applications.</p>
        </div>
      </div>

      <div className="px-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or policy..." className="w-full border border-amber-200 rounded-lg pl-10 p-2 text-sm focus:ring-1 focus:ring-amber-500" />
            </div>
            <div>
              <select value={status} onChange={e=>setStatus(e.target.value as FilterStatus)} className="w-full border border-amber-200 rounded-lg p-2 text-sm">
                {(["All","Pending","Accepted","Rejected","Edited","AwaitingPayment"] as FilterStatus[]).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
              <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} className="w-full border border-amber-200 rounded-lg pl-10 p-2 text-sm" />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
              <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} className="w-full border border-amber-200 rounded-lg pl-10 p-2 text-sm" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="bg-white rounded-xl shadow-sm border border-amber-200 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
          ) : (
            <>
              <ReusableTable
                columns={columns}
                data={filtered}
                renderRow={(row: ClientApplication) => (
                  <TableRow key={row.id} className="hover:bg-amber-50">
                    <TableCell className="py-3 px-4 font-medium text-amber-900">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {row.customerName}
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4 text-amber-800">{row.policyType}</TableCell>
                    <TableCell className="py-3 px-4 text-amber-700" align="right">${row.premium.toLocaleString()}</TableCell>
                    <TableCell className="py-3 px-4 text-amber-700" align="right">${row.coverageAmount.toLocaleString()}</TableCell>
                    <TableCell className="py-3 px-4 text-amber-700">{new Date(row.submittedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="py-3 px-4 text-amber-700">{row.status}</TableCell>
                    <TableCell className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => setEditing(row)} className="p-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-700" title="Edit"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => approve(row.id)} className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-700" title="Accept"><CheckCircle className="w-4 h-4" /></button>
                        <button onClick={() => reject(row.id)} className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600" title="Reject"><XCircle className="w-4 h-4" /></button>
                        {row.status === "Accepted" || row.status === "Edited" ? (
                          <button onClick={() => sendForPayment(row.id)} className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700" title="Send for payment">→</button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              />
              {filtered.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-amber-400 text-6xl mb-4">📄</div>
                  <h3 className="text-lg font-semibold text-amber-800 mb-2">No Applications</h3>
                  <p className="text-amber-600">No items match your filters</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {editing && (
        <EditModal
          application={editing}
          onClose={() => setEditing(null)}
          onSaved={async () => { setEditing(null); await fetch(); }}
        />
      )}
    </div>
  );
};

export default FinanceOfficerClientApplications;
