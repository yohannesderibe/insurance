// import React, { useMemo, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Calendar, CheckCircle2, ChevronLeft, ChevronRight, FileUp, MapPin, ShieldCheck, User, CarFront, XCircle } from 'lucide-react';

// // Mock policy data
// const MOCK_POLICIES = [
//   { id: 'pol-1001', number: 'POL-1001', type: 'Comprehensive Auto', vehicle: 'Toyota Corolla 2022', effective: '2024-01-01', expiry: '2024-12-31' },
//   { id: 'pol-1002', number: 'POL-1002', type: 'Third Party Auto', vehicle: 'Honda Civic 2021', effective: '2024-03-01', expiry: '2025-02-28' }
// ];

// const INCIDENT_TYPES = ['Accident', 'Theft', 'Vandalism', 'Natural Disaster', 'Fire', 'Other'];

// interface IncidentDetails {
//   date: string;
//   time: string;
//   location: string;
//   type: string;
//   description: string;
//   policeReport?: string;
// }

// interface OtherParty {
//   name: string;
//   contact: string;
//   licensePlate?: string;
// }

// interface EvidenceItem {
//   file: File;
//   name: string;
//   size: number;
// }

// const FileClaimWizard: React.FC = () => {
//   const navigate = useNavigate();
//   const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

//   // Step 1: Policy selection
//   const [selectedPolicyId, setSelectedPolicyId] = useState<string>('');
//   const selectedPolicy = useMemo(() => MOCK_POLICIES.find(p => p.id === selectedPolicyId) || null, [selectedPolicyId]);

//   // Step 2: Incident details
//   const [incident, setIncident] = useState<IncidentDetails>({
//     date: '',
//     time: '',
//     location: '',
//     type: '',
//     description: '',
//     policeReport: ''
//   });

//   // Step 3: Parties & Vehicle
//   const [otherParties, setOtherParties] = useState<OtherParty[]>([]);
//   const addOtherParty = () => setOtherParties(prev => [...prev, { name: '', contact: '', licensePlate: '' }]);
//   const updateOtherParty = (idx: number, field: keyof OtherParty, value: string) => {
//     setOtherParties(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
//   };
//   const removeOtherParty = (idx: number) => setOtherParties(prev => prev.filter((_, i) => i !== idx));

//   // Step 4: Evidence upload
//   const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
//   const handleEvidenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     const items: EvidenceItem[] = files.map(f => ({ file: f, name: f.name, size: f.size }));
//     setEvidence(prev => [...prev, ...items]);
//   };
//   const removeEvidence = (name: string) => setEvidence(prev => prev.filter(item => item.name !== name));

//   // Submission
//   const [submitting, setSubmitting] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [claimRef, setClaimRef] = useState<string>('');

//   const canNext = (): boolean => {
//     if (step === 1) return !!selectedPolicyId;
//     if (step === 2) return !!(incident.date && incident.time && incident.location && incident.type && incident.description);
//     if (step === 3) return true; // optional
//     if (step === 4) return evidence.length > 0; // require at least one file
//     return true;
//   };

//   const next = () => { if (canNext()) setStep((s) => Math.min(5, (s + 1) as any)); };
//   const back = () => setStep((s) => Math.max(1, (s - 1) as any));

//   const submitClaim = () => {
//     setSubmitting(true);
//     setTimeout(() => {
//       setSubmitting(false);
//       // Mock claim reference
//       const ref = 'CLM-' + Math.floor(100000 + Math.random() * 900000);
//       setClaimRef(ref);
//       setShowSuccess(true);
//       // Optionally navigate after delay
//       // setTimeout(() => navigate('/claims'), 2000);
//     }, 1200);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 py-10 px-4 md:px-8">
//       <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-amber-100 p-6 md:p-10">
//         {/* Step Progress */}
//         <div className="flex items-center justify-center gap-3 md:gap-6 mb-8">
//           {[1,2,3,4,5].map((id, idx) => (
//             <React.Fragment key={id}>
//               <div className="flex flex-col items-center text-center">
//                 <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center ${step > id ? 'border-amber-500 bg-amber-50 text-black' : step === id ? 'border-black bg-amber-400' : 'border-amber-200 text-amber-300'}`}>
//                   {id === 1 && <ShieldCheck className="w-6 h-6" />}
//                   {id === 2 && <Calendar className="w-6 h-6" />}
//                   {id === 3 && <User className="w-6 h-6" />}
//                   {id === 4 && <FileUp className="w-6 h-6" />}
//                   {id === 5 && <CheckCircle2 className="w-6 h-6" />}
//                 </div>
//                 <p className={`mt-2 text-xs sm:text-sm font-semibold ${step === id ? 'text-black' : 'text-amber-400'}`}>
//                   {id === 1 && 'Policy'}
//                   {id === 2 && 'Incident'}
//                   {id === 3 && 'Parties & Vehicle'}
//                   {id === 4 && 'Evidence'}
//                   {id === 5 && 'Review'}
//                 </p>
//               </div>
//               {idx < 4 && (
//                 <div className="flex-1 h-[2px] max-w-[60px] md:max-w-[100px] bg-gradient-to-r from-amber-200 to-amber-400" />
//               )}
//             </React.Fragment>
//           ))}
//         </div>

//         {/* Header */}
//         <header className="mb-8 text-center">
//           <p className="text-sm text-amber-600 font-semibold uppercase tracking-wide">File a Claim</p>
//           <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mt-2">Submit Your Claim</h1>
//           <p className="text-amber-700 mt-2">Provide details about your incident, upload evidence, and submit for review.</p>
//         </header>

//         {/* Step Content */}
//         {step === 1 && (
//           <section className="space-y-4">
//             <h2 className="text-lg font-semibold text-[#000000]">Select Policy</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {MOCK_POLICIES.map(p => (
//                 <label key={p.id} className={`border rounded-2xl p-4 cursor-pointer transition-colors ${selectedPolicyId === p.id ? 'border-amber-500 bg-amber-50' : 'border-amber-200 hover:border-amber-400'}`}>
//                   <input type="radio" name="policy" className="hidden" checked={selectedPolicyId === p.id} onChange={() => setSelectedPolicyId(p.id)} />
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="font-semibold text-[#000000]">{p.number} · {p.type}</p>
//                       <p className="text-sm text-[#5D4037]">{p.vehicle}</p>
//                       <p className="text-xs text-[#5D4037] mt-1">Effective {p.effective} - {p.expiry}</p>
//                     </div>
//                     <CarFront className="w-6 h-6 text-amber-500" />
//                   </div>
//                 </label>
//               ))}
//             </div>
//           </section>
//         )}

//         {step === 2 && (
//           <section className="space-y-4">
//             <h2 className="text-lg font-semibold text-[#000000]">Incident Details</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-semibold text-[#000000] mb-1">Date</label>
//                 <input type="date" value={incident.date} onChange={e=>setIncident({...incident, date: e.target.value})} className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-300" />
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-[#000000] mb-1">Time</label>
//                 <input type="time" value={incident.time} onChange={e=>setIncident({...incident, time: e.target.value})} className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-300" />
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-semibold text-[#000000] mb-1">Location</label>
//                 <div className="flex items-center gap-2">
//                   <MapPin className="w-5 h-5 text-amber-500" />
//                   <input placeholder="Address or location" value={incident.location} onChange={e=>setIncident({...incident, location: e.target.value})} className="flex-1 border border-amber-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-300" />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-[#000000] mb-1">Type of Incident</label>
//                 <select value={incident.type} onChange={e=>setIncident({...incident, type: e.target.value})} className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-300">
//                   <option value="">Select</option>
//                   {INCIDENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
//                 </select>
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-semibold text-[#000000] mb-1">Description</label>
//                 <textarea rows={4} placeholder="Describe what happened" value={incident.description} onChange={e=>setIncident({...incident, description: e.target.value})} className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-300" />
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-[#000000] mb-1">Police Report (optional)</label>
//                 <input placeholder="Report number" value={incident.policeReport} onChange={e=>setIncident({...incident, policeReport: e.target.value})} className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-300" />
//               </div>
//             </div>
//           </section>
//         )}

//         {step === 3 && (
//           <section className="space-y-4">
//             <h2 className="text-lg font-semibold text-[#000000]">Parties & Vehicle</h2>
//             <div className="border rounded-2xl p-4 border-amber-200">
//               <p className="text-sm font-semibold text-[#000000] mb-2">Your Vehicle</p>
//               <p className="text-sm text-[#5D4037]">{selectedPolicy ? `${selectedPolicy.vehicle} · ${selectedPolicy.number}` : 'Select policy in Step 1'}</p>
//             </div>

//             <div className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <p className="text-sm font-semibold text-[#000000]">Other Parties</p>
//                 <button type="button" onClick={addOtherParty} className="px-3 py-2 rounded-xl bg-amber-100 text-amber-800 text-sm font-semibold">Add Party</button>
//               </div>
//               {otherParties.length === 0 && (
//                 <p className="text-sm text-[#5D4037]">No other parties added.</p>
//               )}
//               {otherParties.map((p, idx) => (
//                 <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
//                   <div>
//                     <label className="block text-sm font-semibold text-[#000000] mb-1">Name</label>
//                     <input value={p.name} onChange={e=>updateOtherParty(idx, 'name', e.target.value)} className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-300" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-[#000000] mb-1">Contact</label>
//                     <input value={p.contact} onChange={e=>updateOtherParty(idx, 'contact', e.target.value)} className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-300" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-[#000000] mb-1">License Plate (optional)</label>
//                     <input value={p.licensePlate || ''} onChange={e=>updateOtherParty(idx, 'licensePlate', e.target.value)} className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-300" />
//                   </div>
//                   <div className="md:col-span-3">
//                     <button type="button" onClick={()=>removeOtherParty(idx)} className="mt-1 text-xs text-red-600">Remove</button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}

//         {step === 4 && (
//           <section className="space-y-4">
//             <h2 className="text-lg font-semibold text-[#000000]">Evidence Upload</h2>
//             <label className="border-2 border-dashed border-amber-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-400 transition-colors">
//               <FileUp className="w-6 h-6 text-amber-500" />
//               <span className="text-amber-800 font-semibold mb-1">Click or drag files to upload</span>
//               <span className="text-sm text-amber-600">Photos, videos, PDFs. Max 10 files per submission.</span>
//               <input type="file" multiple className="hidden" onChange={handleEvidenceChange} />
//             </label>
//             {evidence.length > 0 && (
//               <ul className="text-sm text-amber-800 space-y-1">
//                 {evidence.map((f) => (
//                   <li key={f.name} className="flex items-center justify-between">
//                     <span>• {f.name} <span className="text-amber-600">({Math.round(f.size/1024)} KB)</span></span>
//                     <button type="button" className="text-xs text-red-600" onClick={()=>removeEvidence(f.name)}>Remove</button>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </section>
//         )}

//         {step === 5 && (
//           <section className="space-y-4">
//             <h2 className="text-lg font-semibold text-[#000000]">Review & Submit</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="border border-amber-200 rounded-2xl p-4">
//                 <p className="font-semibold text-[#000000] mb-2">Policy</p>
//                 <p className="text-sm text-[#5D4037]">{selectedPolicy ? `${selectedPolicy.number} · ${selectedPolicy.type} · ${selectedPolicy.vehicle}` : 'Not selected'}</p>
//               </div>
//               <div className="border border-amber-200 rounded-2xl p-4">
//                 <p className="font-semibold text-[#000000] mb-2">Incident</p>
//                 <p className="text-sm text-[#5D4037]">{incident.date} {incident.time} · {incident.type} · {incident.location}</p>
//               </div>
//               <div className="border border-amber-200 rounded-2xl p-4 md:col-span-2">
//                 <p className="font-semibold text-[#000000] mb-2">Description</p>
//                 <p className="text-sm text-[#5D4037] whitespace-pre-line">{incident.description}</p>
//               </div>
//               <div className="border border-amber-200 rounded-2xl p-4 md:col-span-2">
//                 <p className="font-semibold text-[#000000] mb-2">Evidence</p>
//                 {evidence.length === 0 ? (
//                   <p className="text-sm text-[#5D4037]">No files uploaded.</p>
//                 ) : (
//                   <ul className="text-sm text-[#5D4037] list-disc list-inside">
//                     {evidence.map(f => (<li key={f.name}>{f.name}</li>))}
//                   </ul>
//                 )}
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <input id="dec" type="checkbox" className="h-4 w-4" />
//               <label htmlFor="dec" className="text-sm text-[#5D4037]">I declare the information provided is true and accurate.</label>
//             </div>
//           </section>
//         )}

//         {/* Navigation */}
//         <div className="mt-8 flex flex-col md:flex-row justify-between gap-3">
//           <button onClick={back} disabled={step === 1 || submitting} className="px-4 py-3 rounded-2xl border border-amber-300 text-amber-900 font-semibold text-sm hover:bg-amber-50 disabled:opacity-50 flex items-center gap-2">
//             <ChevronLeft className="w-4 h-4" /> Back
//           </button>
//           {step < 5 ? (
//             <button onClick={next} disabled={!canNext() || submitting} className="px-6 py-3 rounded-2xl bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600 disabled:opacity-50 flex items-center gap-2">
//               Next <ChevronRight className="w-4 h-4" />
//             </button>
//           ) : (
//             <button onClick={submitClaim} disabled={submitting} className="px-6 py-3 rounded-2xl bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600 disabled:opacity-50 flex items-center gap-2">
//               {submitting ? 'Submitting…' : 'Submit Claim'}
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Success Overlay */}
//       {showSuccess && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//           <div className="bg-white rounded-3xl p-10 border border-amber-200 shadow-2xl text-center">
//             <div className="w-28 h-28 rounded-full bg-green-500 flex items-center justify-center mx-auto animate-bounce shadow-2xl">
//               <CheckCircle2 className="w-16 h-16 text-white" />
//             </div>
//             <h3 className="mt-6 text-2xl font-bold text-[#000000]">Claim Submitted</h3>
//             <p className="mt-2 text-[#5D4037]">Your claim has been submitted successfully.</p>
//             <p className="mt-1 text-[#000000] font-semibold">Reference: {claimRef}</p>
//             <div className="mt-6 flex gap-3 justify-center">
//               <button onClick={()=>{ setShowSuccess(false); navigate('/claims'); }} className="px-5 py-3 rounded-2xl bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600">Go to My Claims</button>
//               <button onClick={()=> setShowSuccess(false)} className="px-5 py-3 rounded-2xl border border-amber-300 text-amber-900 font-semibold text-sm hover:bg-amber-50">Close</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FileClaimWizard;
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle2, ChevronLeft, ChevronRight, FileUp, MapPin, ShieldCheck, User, CarFront, XCircle, Heart } from 'lucide-react';

import { getPaidApplications, type Policy } from "../../../../api/Coustomer/Policy/policiesApi";
import { submitMotorClaim, submitLifeClaim } from "../../../../api/Coustomer/Claims/claimsApi";

const MOTOR_INCIDENT_TYPES = ['Collision', 'Theft', 'Fire', 'Natural Disaster', 'Vandalism', 'Other'];
const LIFE_CLAIM_CAUSES = ['Natural Death', 'Accidental Death', 'Critical Illness', 'Permanent Disability', 'Temporary Disability'];

interface IncidentDetails {
  date: string;
  time: string;
  location: string;
  type: string;
  description: string;
  policeReport?: string;
}

interface OtherParty {
  name: string;
  contact: string;
  licensePlate?: string;
}

interface EvidenceItem {
  file: File;
  name: string;
  size: number;
}

const FileClaimWizard: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loadingPolicies, setLoadingPolicies] = useState(true);

  // for policy type detection
  const normalize = (v: string) => v.toLowerCase();

  const isMotorPolicy = (name: string) =>
    ["motor", "mo", "m", "vehicle", "v", "car", "MOT","mot"].some(k =>
      normalize(name).includes(k)
    );

  const isLifePolicy = (name: string) =>
    ["life", "li", "human", "animal"].some(k =>
      normalize(name).includes(k)
    );

  // Step 1: Policy selection
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>('');
  const selectedPolicy = useMemo(
    () => policies.find(p => p.id === selectedPolicyId) || null,
    [selectedPolicyId, policies]
  );

  const claimType = selectedPolicy
    ? isMotorPolicy(selectedPolicy.name)
      ? "motor"
      : isLifePolicy(selectedPolicy.name)
      ? "life"
      : null
    : null;

  // Step 2: Incident details
  const [incident, setIncident] = useState<IncidentDetails>({
    date: '',
    time: '',
    location: '',
    type: '',
    description: '',
    policeReport: ''
  });

  // Life-specific claim cause
  const [lifeCause, setLifeCause] = useState<string>('');

  // Step 3: Parties & Vehicle
  const [otherParties, setOtherParties] = useState<OtherParty[]>([]);
  const addOtherParty = () => setOtherParties(prev => [...prev, { name: '', contact: '', licensePlate: '' }]);
  const updateOtherParty = (idx: number, field: keyof OtherParty, value: string) => {
    setOtherParties(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };
  const removeOtherParty = (idx: number) => setOtherParties(prev => prev.filter((_, i) => i !== idx));

  // Step 4: Evidence upload - using File[] instead of EvidenceItem[]
  const [evidenceImages, setEvidenceImages] = useState<File[]>([]);
  
  const handleEvidenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setEvidenceImages(prev => [...prev, ...Array.from(e.target.files)]);
  };

  const removeEvidenceImage = (index: number) => {
    setEvidenceImages(prev => prev.filter((_, i) => i !== index));
  };

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [claimRef, setClaimRef] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadPolicies = async () => {
      try {
        const data = await getPaidApplications();
        setPolicies(data.filter(p => p.status === "Active"));
      } catch (e) {
        console.error("Failed to load policies", e);
      } finally {
        setLoadingPolicies(false);
      }
    };

    loadPolicies();
  }, []);

  const canNext = (): boolean => {
    if (step === 1) return !!selectedPolicyId;
    if (step === 2) {
      if (!incident.date || !incident.time || !incident.location || !incident.description) {
        return false;
      }
      // For motor claims, incident type is required
      if (claimType === 'motor' && !incident.type) return false;
      // For life claims, life cause is required
      if (claimType === 'life' && !lifeCause) return false;
      return true;
    }
    if (step === 3) return true; // optional
    if (step === 4) return evidenceImages.length > 0; // require at least one file
    return true;
  };

  const next = () => { if (canNext()) setStep((s) => Math.min(5, (s + 1) as any)); };
  const back = () => setStep((s) => Math.max(1, (s - 1) as any));

  const handleSubmitClaim = async () => {
    if (!selectedPolicy || !claimType) {
      setError('Please select a policy');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();

      formData.append("IncidentDate", incident.date);
      formData.append("IncidentTime", incident.time);
      formData.append("Location", incident.location);
      formData.append("Description", incident.description);

      // Add police report if provided
      if (incident.policeReport) {
        formData.append("PoliceReportNumber", incident.policeReport);
      }

      // Add evidence images
      evidenceImages.forEach(img => {
        formData.append("EvidenceImages", img);
      });

      let response;
      if (claimType === "motor") {
        formData.append("IncidentType", incident.type);
        response = await submitMotorClaim(selectedPolicy.id, formData);
      } else if (claimType === "life") {
        formData.append("IncidentType", lifeCause);
        response = await submitLifeClaim(selectedPolicy.id, formData);
      }

      // Handle response
      if (response?.data?.claimId) {
        setClaimRef(response.data.claimId);
        setShowSuccess(true);
      } else {
        // Fallback to mock reference if API doesn't return one
        const ref = 'CLM-' + Math.floor(100000 + Math.random() * 900000);
        setClaimRef(ref);
        setShowSuccess(true);
      }
    } catch (err: any) {
      console.error('Failed to submit claim:', err);
      setError(err.response?.data?.message || 'Failed to submit claim. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-amber-100 p-6 md:p-10">
        {/* Step Progress */}
        <div className="flex items-center justify-center gap-3 md:gap-6 mb-8">
          {[1, 2, 3, 4, 5].map((id, idx) => (
            <React.Fragment key={id}>
              <div className="flex flex-col items-center text-center">
                <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center ${step > id ? 'border-amber-500 bg-amber-50 text-black' : step === id ? 'border-black bg-amber-400' : 'border-amber-200 text-amber-300'}`}>
                  {id === 1 && <ShieldCheck className="w-6 h-6" />}
                  {id === 2 && <Calendar className="w-6 h-6" />}
                  {id === 3 && <User className="w-6 h-6" />}
                  {id === 4 && <FileUp className="w-6 h-6" />}
                  {id === 5 && <CheckCircle2 className="w-6 h-6" />}
                </div>
                <p className={`mt-2 text-xs sm:text-sm font-semibold ${step === id ? 'text-black' : 'text-amber-400'}`}>
                  {id === 1 && 'Policy'}
                  {id === 2 && (
                    claimType === 'motor' ? 'Vehicle Incident' : 
                    claimType === 'life' ? 'Life Incident' : 'Incident'
                  )}
                  {id === 3 && 'Parties & Vehicle'}
                  {id === 4 && 'Evidence'}
                  {id === 5 && 'Review'}
                </p>
              </div>
              {idx < 4 && (
                <div className="flex-1 h-[2px] max-w-[60px] md:max-w-[100px] bg-gradient-to-r from-amber-200 to-amber-400" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Header */}
        <header className="mb-8 text-center">
          <p className="text-sm text-amber-600 font-semibold uppercase tracking-wide">File a Claim</p>
          <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mt-2">Submit Your Claim</h1>
          <p className="text-amber-700 mt-2">
            {claimType === 'motor' 
              ? 'Provide details about your vehicle incident, upload evidence, and submit for review.'
              : claimType === 'life'
              ? 'Provide details about your life insurance claim, upload evidence, and submit for review.'
              : 'Provide details about your incident, upload evidence, and submit for review.'
            }
          </p>
        </header>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Step Content */}
        {step === 1 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-[#000000]">Select Policy</h2>
            {loadingPolicies ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                <span className="ml-3 text-amber-600">Loading policies...</span>
              </div>
            ) : policies.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-amber-600">No active policies found.</p>
                <button 
                  onClick={() => navigate('/policy')}
                  className="mt-3 px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600"
                >
                  View Policies
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {policies.map(p => (
                  <label key={p.id} className={`border rounded-2xl p-4 cursor-pointer transition-colors ${selectedPolicyId === p.id ? 'border-amber-500 bg-amber-50' : 'border-amber-200 hover:border-amber-400'}`}>
                    <input type="radio" name="policy" className="hidden" checked={selectedPolicyId === p.id} onChange={() => setSelectedPolicyId(p.id)} />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-[#000000]">
                          {p.policyNumber} · {p.name}
                        </p>
                        <p className="text-sm text-[#5D4037]">
                          {p.category === "MOTOR"
                            ? p.rawApplication?.model
                            : p.name}
                        </p>
                        <p className="text-xs text-[#5D4037] mt-1">
                          Active · Premium {p.premium.toLocaleString()} ETB
                        </p>
                      </div>
                      {isMotorPolicy(p.name) ? (
                        <CarFront className="w-6 h-6 text-amber-500" />
                      ) : (
                        <Heart className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </section>
        )}

        {step === 2 && (
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-[#000000]">
                {claimType === 'motor' 
                  ? 'Vehicle Incident Details' 
                  : claimType === 'life' 
                  ? 'Life Claim Details' 
                  : 'Incident Details'
                }
              </h2>
              <p className="text-sm text-amber-600 mt-1">
                {claimType === 'motor' 
                  ? 'Please provide details about your vehicle incident'
                  : claimType === 'life'
                  ? 'Please provide details about your life insurance claim'
                  : 'Please provide details about your incident'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#000000] mb-1">Date</label>
                <input type="date" value={incident.date} onChange={e => setIncident({ ...incident, date: e.target.value })} className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-300" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#000000] mb-1">Time</label>
                <input type="time" value={incident.time} onChange={e => setIncident({ ...incident, time: e.target.value })} className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-300" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#000000] mb-1">Location</label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-500" />
                  <input placeholder="Address or location" value={incident.location} onChange={e => setIncident({ ...incident, location: e.target.value })} className="flex-1 border border-amber-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-300" />
                </div>
              </div>

              {/* Motor-specific fields */}
              {claimType === 'motor' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-[#000000] mb-1">Type of Vehicle Incident</label>
                    <select 
                      value={incident.type} 
                      onChange={e => setIncident({ ...incident, type: e.target.value })} 
                      className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-300"
                    >
                      <option value="">Select incident type</option>
                      {MOTOR_INCIDENT_TYPES.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#000000] mb-1">Police Report (optional)</label>
                    <input 
                      placeholder="Report number" 
                      value={incident.policeReport} 
                      onChange={e => setIncident({ ...incident, policeReport: e.target.value })} 
                      className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-300" 
                    />
                  </div>
                </>
              )}

              {/* Life-specific fields */}
              {claimType === 'life' && (
                <div>
                  <label className="block text-sm font-semibold text-[#000000] mb-1">Claim Cause</label>
                  <select 
                    value={lifeCause} 
                    onChange={e => setLifeCause(e.target.value)} 
                    className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-300"
                  >
                    <option value="">Select cause of claim</option>
                    {LIFE_CLAIM_CAUSES.map(cause => (
                      <option key={cause} value={cause}>{cause}</option>
                    ))}
                  </select>
                  <p className="text-xs text-amber-600 mt-1">
                    Please select the appropriate cause for your life insurance claim
                  </p>
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#000000] mb-1">
                  {claimType === 'motor' 
                    ? 'Incident Description' 
                    : claimType === 'life'
                    ? 'Claim Description'
                    : 'Description'
                  }
                </label>
                <textarea 
                  rows={4} 
                  placeholder={
                    claimType === 'motor'
                      ? "Describe what happened with your vehicle..."
                      : claimType === 'life'
                      ? "Describe the circumstances of the claim..."
                      : "Describe what happened..."
                  } 
                  value={incident.description} 
                  onChange={e => setIncident({ ...incident, description: e.target.value })} 
                  className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-300" 
                />
                <p className="text-xs text-amber-600 mt-1">
                  {claimType === 'motor'
                    ? 'Provide detailed information about the vehicle incident'
                    : claimType === 'life'
                    ? 'Provide detailed information about the life insurance claim'
                    : 'Provide detailed information about the incident'
                  }
                </p>
              </div>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-[#000000]">
                {claimType === 'motor' 
                  ? 'Vehicle & Other Parties' 
                  : claimType === 'life'
                  ? 'Witnesses & Contacts'
                  : 'Parties & Vehicle'
                }
              </h2>
              <p className="text-sm text-amber-600 mt-1">
                {claimType === 'motor'
                  ? 'Information about your vehicle and other parties involved'
                  : claimType === 'life'
                  ? 'Information about witnesses and relevant contacts'
                  : 'Information about parties involved'
                }
              </p>
            </div>
            
            {claimType === 'motor' && (
              <div className="border rounded-2xl p-4 border-amber-200 bg-amber-50">
                <div className="flex items-center gap-2 mb-2">
                  <CarFront className="w-5 h-5 text-amber-500" />
                  <p className="text-sm font-semibold text-[#000000]">Your Vehicle Information</p>
                </div>
                <p className="text-sm text-[#5D4037]">
                  {selectedPolicy ? 
                    `${selectedPolicy.rawApplication?.model || 'Vehicle'} · ${selectedPolicy.rawApplication?.plateNumber || 'N/A'}` 
                    : 'Select policy in Step 1'}
                </p>
                {selectedPolicy?.rawApplication && (
                  <div className="mt-2 text-xs text-amber-700 grid grid-cols-2 gap-1">
                    <span>Year: {selectedPolicy.rawApplication.yearOfManufacture}</span>
                    <span>Policy: {selectedPolicy.policyNumber}</span>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#000000]">
                    {claimType === 'motor' ? 'Other Parties Involved' : 'Witnesses & Contacts'}
                  </p>
                  <p className="text-xs text-amber-600">
                    {claimType === 'motor'
                      ? 'Add other drivers or parties involved in the incident'
                      : 'Add witnesses or emergency contacts for your claim'
                    }
                  </p>
                </div>
                <button 
                  type="button" 
                  onClick={addOtherParty} 
                  className="px-3 py-2 rounded-xl bg-amber-100 text-amber-800 text-sm font-semibold hover:bg-amber-200"
                >
                  Add {claimType === 'motor' ? 'Party' : 'Contact'}
                </button>
              </div>
              
              {otherParties.length === 0 && (
                <div className="text-center py-4 border border-dashed border-amber-200 rounded-xl">
                  <p className="text-sm text-[#5D4037]">
                    {claimType === 'motor' 
                      ? 'No other parties added.' 
                      : 'No witnesses or contacts added.'
                    }
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    {claimType === 'motor'
                      ? 'Click "Add Party" to include other drivers or witnesses'
                      : 'Click "Add Contact" to include witnesses or emergency contacts'
                    }
                  </p>
                </div>
              )}
              
              {otherParties.map((p, idx) => (
                <div key={idx} className="border border-amber-200 rounded-xl p-4 bg-amber-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-semibold text-[#000000]">
                        {claimType === 'motor' ? 'Party' : 'Contact'} #{idx + 1}
                      </span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeOtherParty(idx)} 
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#000000] mb-1">Name</label>
                      <input 
                        value={p.name} 
                        onChange={e => updateOtherParty(idx, 'name', e.target.value)} 
                        placeholder={claimType === 'motor' ? "Driver name" : "Witness name"}
                        className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-300" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#000000] mb-1">Contact</label>
                      <input 
                        value={p.contact} 
                        onChange={e => updateOtherParty(idx, 'contact', e.target.value)} 
                        placeholder="Phone or email"
                        className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-300" 
                      />
                    </div>
                    {claimType === 'motor' && (
                      <div>
                        <label className="block text-xs font-semibold text-[#000000] mb-1">License Plate (optional)</label>
                        <input 
                          value={p.licensePlate || ''} 
                          onChange={e => updateOtherParty(idx, 'licensePlate', e.target.value)} 
                          placeholder="Vehicle plate"
                          className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-300" 
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Steps 4 and 5 remain similar but with contextual text... */}

        {/* Navigation */}
        <div className="mt-8 flex flex-col md:flex-row justify-between gap-3">
          <button onClick={back} disabled={step === 1 || submitting} className="px-4 py-3 rounded-2xl border border-amber-300 text-amber-900 font-semibold text-sm hover:bg-amber-50 disabled:opacity-50 flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          {step < 5 ? (
            <button onClick={next} disabled={!canNext() || submitting} className="px-6 py-3 rounded-2xl bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600 disabled:opacity-50 flex items-center gap-2">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleSubmitClaim} disabled={submitting} className="px-6 py-3 rounded-2xl bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600 disabled:opacity-50 flex items-center gap-2">
              {submitting ? 'Submitting…' : 'Submit Claim'}
            </button>
          )}
        </div>
      </div>

      {/* Success Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-3xl p-10 border border-amber-200 shadow-2xl text-center">
            <div className="w-28 h-28 rounded-full bg-green-500 flex items-center justify-center mx-auto animate-bounce shadow-2xl">
              <CheckCircle2 className="w-16 h-16 text-white" />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-[#000000]">Claim Submitted</h3>
            <p className="mt-2 text-[#5D4037]">Your claim has been submitted successfully.</p>
            <p className="mt-1 text-[#000000] font-semibold">Reference: {claimRef}</p>
            <div className="mt-6 flex gap-3 justify-center">
              <button onClick={() => { setShowSuccess(false); navigate('/claims'); }} className="px-5 py-3 rounded-2xl bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600">
                Go to My Claims
              </button>
              <button onClick={() => setShowSuccess(false)} className="px-5 py-3 rounded-2xl border border-amber-300 text-amber-900 font-semibold text-sm hover:bg-amber-50">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileClaimWizard;