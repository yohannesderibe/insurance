import React, { useEffect, useMemo, useState } from "react";
import { getClaims, updateClaimStatus } from "../../../api/OperatingOfficer/operatingOfficerApi";
import type { CustomerClaim } from "../../../mockdata/claims";
import { TableRow, TableCell } from "@mui/material";
import ReusableTable from "../../../components/Tables/ReusableTable";
import { Search, CheckCircle, XCircle, FileText, StickyNote, Calendar, Eye } from "lucide-react";

type FilterStatus = "All" | "Submitted" | "In Review" | "Approved" | "Rejected" | "Paid";

const NotesModal: React.FC<{ claim: CustomerClaim | null; onClose: () => void; onSaved: () => void; }> = ({ claim, onClose, onSaved }) => {
  const [notes, setNotes] = useState<string>(claim?.notes ?? "");
  useEffect(() => { setNotes(claim?.notes ?? ""); }, [claim]);
  const save = async () => {
    if (!claim) return;
    await updateClaimStatus(claim.id, claim.status as any, notes);
    onSaved();
  };
  if (!claim) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg bg-white rounded-xl border border-amber-200 shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-amber-900">Add Notes</h3>
          <button onClick={onClose} className="px-3 py-1 rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50">Close</button>
        </div>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={6} className="w-full border border-amber-200 rounded-lg p-2 text-sm focus:ring-1 focus:ring-amber-500" />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50">Cancel</button>
          <button onClick={save} className="px-4 py-2 text-sm rounded-lg bg-amber-500 text-white hover:bg-amber-600">Save</button>
        </div>
      </div>
    </div>
  );
};

const OperatingOfficerClaimReview: React.FC = () => {
  const [claims, setClaims] = useState<CustomerClaim[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<FilterStatus>("All");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [notesFor, setNotesFor] = useState<CustomerClaim | null>(null);
  const [detailsFor, setDetailsFor] = useState<CustomerClaim | null>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const data = await getClaims();
      setClaims(data);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetch(); }, []);

  const filtered = useMemo(() => {
    return claims.filter(c => {
      const matchesText = `${c.claimNumber} ${c.policyName}`.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "All" ? true : c.status === status;
      const submitted = new Date(c.submittedOn).getTime();
      const fromOk = dateFrom ? submitted >= new Date(dateFrom).getTime() : true;
      const toOk = dateTo ? submitted <= new Date(dateTo).getTime() : true;
      return matchesText && matchesStatus && fromOk && toOk;
    });
  }, [claims, search, status, dateFrom, dateTo]);

  const approve = async (id: string) => {
    await updateClaimStatus(id, "Approved");
    alert("Claim approved.");
    await fetch();
  };
  const reject = async (id: string) => {
    const reason = window.prompt("Enter rejection reason:");
    if (reason === null) return;
    await updateClaimStatus(id, "Rejected", reason || undefined);
    alert("Claim rejected.");
    await fetch();
  };
  const setInReview = async (id: string) => {
    await updateClaimStatus(id, "In Review");
    await fetch();
  };

  const columns = [
    { label: "Claim #", key: "claimNumber" },
    { label: "Policy", key: "policyName" },
    { label: "Type", key: "type" },
    { label: "Submitted", key: "submittedOn" },
    { label: "Amount", key: "amountRequested", align: "right" as const },
    { label: "Status", key: "status" },
    { label: "Actions", key: "actions", align: "center" as const },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 to-yellow-50/50">
      <div className="bg-white border-b border-amber-200 shadow-sm mb-6">
        <div className="p-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">Claims</h1>
          <p className="text-amber-700 mt-1">Review submitted insurance claims.</p>
        </div>
      </div>

      <div className="px-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by claim # or policy..." className="w-full border border-amber-200 rounded-lg pl-10 p-2 text-sm focus:ring-1 focus:ring-amber-500" />
            </div>
            <div>
              <select value={status} onChange={e=>setStatus(e.target.value as FilterStatus)} className="w-full border border-amber-200 rounded-lg p-2 text-sm">
                {(["All","Submitted","In Review","Approved","Rejected","Paid"] as FilterStatus[]).map(s => (
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
                renderRow={(row: CustomerClaim) => (
                  <TableRow key={row.id} className="hover:bg-amber-50">
                    <TableCell className="py-3 px-4 font-medium text-amber-900">{row.claimNumber}</TableCell>
                    <TableCell className="py-3 px-4 text-amber-800">{row.policyName}</TableCell>
                    <TableCell className="py-3 px-4 text-amber-800">{row.type}</TableCell>
                    <TableCell className="py-3 px-4 text-amber-700">{new Date(row.submittedOn).toLocaleDateString()}</TableCell>
                    <TableCell className="py-3 px-4 text-amber-700" align="right">${row.amountRequested.toLocaleString()}</TableCell>
                    <TableCell className="py-3 px-4 text-amber-700">{row.status}</TableCell>
                    <TableCell className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => setNotesFor(row)} className="p-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-700" title="Add notes"><StickyNote className="w-4 h-4" /></button>
                        <button onClick={() => setInReview(row.id)} className="p-2 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-yellow-700" title="Mark In Review"><FileText className="w-4 h-4" /></button>
                        <button onClick={() => setDetailsFor(row)} className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700" title="Details"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => approve(row.id)} className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-700" title="Accept"><CheckCircle className="w-4 h-4" /></button>
                        <button onClick={() => reject(row.id)} className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600" title="Reject"><XCircle className="w-4 h-4" /></button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              />
              {filtered.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-amber-400 text-6xl mb-4">📑</div>
                  <h3 className="text-lg font-semibold text-amber-800 mb-2">No Claims</h3>
                  <p className="text-amber-600">No items match your filters</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {notesFor && (
        <NotesModal
          claim={notesFor}
          onClose={() => setNotesFor(null)}
          onSaved={async () => { setNotesFor(null); await fetch(); }}
        />
      )}

      {detailsFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl bg-white rounded-xl border border-amber-200 shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-amber-900">Claim Details</h3>
              <button onClick={() => setDetailsFor(null)} className="px-3 py-1 rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50">Close</button>
            </div>
            <div className="space-y-2 text-amber-800">
              <p><strong>Claim #:</strong> {detailsFor.claimNumber}</p>
              <p><strong>Policy:</strong> {detailsFor.policyName} ({detailsFor.policyNumber})</p>
              <p><strong>Type:</strong> {detailsFor.type}</p>
              <p><strong>Status:</strong> {detailsFor.status}</p>
              <p><strong>Submitted:</strong> {new Date(detailsFor.submittedOn).toLocaleDateString()}</p>
              <p><strong>Incident Date:</strong> {new Date(detailsFor.incidentDate).toLocaleDateString()}</p>
              <p><strong>Amount Requested:</strong> ${detailsFor.amountRequested.toLocaleString()}</p>
              {detailsFor.amountApproved && <p><strong>Amount Approved:</strong> ${detailsFor.amountApproved.toLocaleString()}</p>}
              <p><strong>Description:</strong> {detailsFor.description}</p>
              {detailsFor.attachments && detailsFor.attachments.length > 0 && (
                <div>
                  <strong>Attachments:</strong>
                  <ul className="list-disc pl-6">
                    {detailsFor.attachments.map(a => <li key={a}>{a}</li>)}
                  </ul>
                </div>
              )}
              {detailsFor.notes && <p><strong>Notes:</strong> {detailsFor.notes}</p>}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={async () => { await updateClaimStatus(detailsFor.id, "Approved"); await fetch(); setDetailsFor(null); }}
                className="px-3 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />Approve
              </button>
              <button
                onClick={async () => { const reason = window.prompt("Enter rejection reason:"); if (reason === null) return; await updateClaimStatus(detailsFor.id, "Rejected", reason || undefined); await fetch(); setDetailsFor(null); }}
                className="px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperatingOfficerClaimReview;
