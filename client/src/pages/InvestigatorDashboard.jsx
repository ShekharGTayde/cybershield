import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  AlertOctagon, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  FileText, 
  Cpu, 
  Award, 
  Send, 
  AlertTriangle,
  UserCheck,
  Hash,
  ArrowUpRight
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, SeverityBadge, PriorityBadge } from '../components/common/Badge';

export function InvestigatorDashboard() {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [newNote, setNewNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    setLoading(true);
    try {
      const res = await api.incidents.getAll();
      if (res.success) {
        setCases(res.data);
        if (!selectedCase && res.data.length > 0) {
          setSelectedCase(res.data[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedCase) return;
    setUpdatingStatus(true);
    try {
      const res = await api.incidents.updateStatus(
        selectedCase._id,
        newStatus,
        `Status transitioned to ${newStatus} by ${user?.fullName || 'Investigator'}`,
        user
      );
      if (res.success) {
        setSelectedCase(res.data);
        await loadCases();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedCase) return;
    try {
      const res = await api.incidents.addNote(selectedCase._id, newNote.trim(), user);
      if (res.success) {
        setSelectedCase(res.data);
        setNewNote('');
        await loadCases();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Filter cases
  const filteredCases = cases.filter(c => {
    const matchesSearch = c.complaintId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.incidentType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = filterSeverity === 'ALL' || c.severity === filterSeverity;
    const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel-glow rounded-2xl p-6 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            CERT-Army Forensic Triage & Investigation Workspace (SRD §34 & §35)
          </div>
          <h1 className="text-2xl font-bold text-white">
            Investigator Case Queue
          </h1>
          <p className="text-xs text-slate-300">
            Assigned Officer: <span className="text-white font-semibold">{user?.fullName || 'Col. Rajeshwar Singh'}</span> • Clearance: <strong className="text-amber-400">RESTRICTED MIL-CERT</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            Total Active Queue: <strong className="text-white">{cases.length}</strong>
          </span>
          <span className="p-2.5 rounded-xl bg-red-950/80 border border-red-800 text-red-300">
            P1 Critical: <strong className="text-red-400">{cases.filter(c => c.priority === 'P1').length}</strong>
          </span>
        </div>
      </div>

      {/* Case Management Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Filterable Case Queue Table (5 Cols) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-4">
          
          {/* Search & Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID, title, keyword..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="UNDER_INVESTIGATION">Investigation</option>
                <option value="ESCALATED">Escalated</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            </div>
          </div>

          {/* Case Items List */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredCases.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-500 font-mono">No cases matching filter.</p>
            ) : (
              filteredCases.map(c => {
                const isSelected = selectedCase?._id === c._id;
                return (
                  <div
                    key={c._id}
                    onClick={() => setSelectedCase(c)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-950/30 border-amber-500/60 shadow-glow-amber'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-400">{c.complaintId}</span>
                      <div className="flex items-center gap-1.5">
                        <SeverityBadge severity={c.severity} />
                        <PriorityBadge priority={c.priority} />
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-white mt-1 truncate">{c.title}</p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2">
                      <span>{c.incidentType}</span>
                      <StatusBadge status={c.status} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Full Case Investigation Dossier (7 Cols) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
          {selectedCase ? (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Dossier Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">Dossier:</span>
                    <h2 className="text-lg font-mono font-bold text-cyan-400">{selectedCase.complaintId}</h2>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-0.5">{selectedCase.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={selectedCase.status} />
                  <SeverityBadge severity={selectedCase.severity} />
                </div>
              </div>

              {/* Status Controller Actions (SRD Section 35) */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-amber-400 font-bold">
                    Case Workflow Transition (SRD §35)
                  </span>
                  {updatingStatus && <span className="text-[10px] text-slate-400 animate-pulse">Updating...</span>}
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    { status: 'UNDER_INVESTIGATION', label: 'Start Investigation', color: 'bg-orange-600 hover:bg-orange-500' },
                    { status: 'ESCALATED', label: 'Escalate to Nodal HQ', color: 'bg-rose-600 hover:bg-rose-500' },
                    { status: 'RESOLVED', label: 'Mark Neutralized & Resolved', color: 'bg-emerald-600 hover:bg-emerald-500' },
                    { status: 'CLOSED', label: 'Close File', color: 'bg-slate-700 hover:bg-slate-600' }
                  ].map(action => (
                    <button
                      key={action.status}
                      onClick={() => handleStatusChange(action.status)}
                      disabled={updatingStatus || selectedCase.status === action.status}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono text-white transition disabled:opacity-40 disabled:cursor-not-allowed ${action.color}`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Incident Characteristics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Threat Type</span>
                  <span className="text-white font-bold">{selectedCase.incidentType}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Channel</span>
                  <span className="text-cyan-300 font-bold">{selectedCase.channel}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Source / Suspect</span>
                  <span className="text-amber-300 font-bold truncate block">{selectedCase.suspectedSource || 'Unknown'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Location</span>
                  <span className="text-white">{selectedCase.location}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Financial Loss</span>
                  <span className={selectedCase.financialLoss ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                    {selectedCase.financialLoss ? `${selectedCase.currency} ${selectedCase.lossAmount}` : 'Nil (Protected)'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Assigned Officer</span>
                  <span className="text-white font-bold">{selectedCase.assignedOfficerName}</span>
                </div>
              </div>

              {/* Narrative */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-mono uppercase text-slate-400 font-bold">Report Narrative</h4>
                <p className="text-xs text-slate-300 p-3.5 rounded-xl bg-slate-900 border border-slate-800 leading-relaxed">
                  {selectedCase.description}
                </p>
              </div>

              {/* AI Prediction & Indicators (SRD Section 31) */}
              {selectedCase.aiAnalysis && (
                <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5" /> AI Threat Prediction
                    </span>
                    <span className="text-slate-400">
                      Score: <strong className="text-red-400">{selectedCase.aiAnalysis.riskScore}/100</strong> • Confidence: {(selectedCase.aiAnalysis.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong>Rec:</strong> {selectedCase.aiAnalysis.recommendation}
                  </p>
                </div>
              )}

              {/* Evidence Vault List */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" /> Evidence Vault & Hashes ({selectedCase.evidences?.length || 0})
                </h4>
                {selectedCase.evidences?.map(ev => (
                  <div key={ev._id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono space-y-1">
                    <div className="flex justify-between text-white font-semibold">
                      <span>{ev.fileName}</span>
                      <span className="text-cyan-400">{ev.fileType}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      SHA-256: <span className="text-emerald-400">{ev.sha256Hash}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Investigation Diary / Officer Notes (SRD Section 34) */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-mono uppercase text-slate-400 font-bold">
                  Confidential Forensic Log / Notes (POST /api/v1/cases/:id/notes)
                </h4>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedCase.officerNotes?.map(note => (
                    <div key={note.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-cyan-400">
                        <span>{note.author}</span>
                        <span className="text-slate-500">{note.date}</span>
                      </div>
                      <p className="text-slate-200">{note.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Log an investigation finding or action..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> Log Note
                  </button>
                </form>
              </div>

            </div>
          ) : (
            <div className="text-center py-16 text-slate-500 font-mono text-xs">
              Select a case from the queue to inspect forensic details.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
