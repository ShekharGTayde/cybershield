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
  ArrowUpRight,
  Shield,
  Layers
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
        `Status transitioned to ${newStatus.replace(/_/g, ' ')} by ${user?.fullName || 'Investigating Officer'}`,
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
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-red-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-red-400 text-[10px] font-mono font-bold uppercase tracking-widest mb-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
            Forensic Triage & Investigation Workspace
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-wide uppercase">
            CERT-Army Incident Command Queue
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Active Officer: <span className="text-white font-semibold">{user?.fullName || 'Col. Rajeshwar Singh'}</span> • Clearance: <strong className="text-red-400 font-mono">RESTRICTED DEFENCE CLEARANCE LEVEL-3</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs relative z-10">
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-300">
            <span className="text-[10px] text-slate-500 block uppercase">Total Queue</span>
            <strong className="text-white font-display text-base">{cases.length}</strong>
          </div>
          <div className="p-3 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-300">
            <span className="text-[10px] text-red-400/80 block uppercase">P1 Critical</span>
            <strong className="text-red-400 font-display text-base text-glow-red">{cases.filter(c => c.priority === 'P1').length}</strong>
          </div>
        </div>
      </div>

      {/* Case Management Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Filterable Case Queue Table (5 Cols) */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-5 border border-slate-800 space-y-4">
          
          {/* Search & Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-red-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ID, title, keywords..."
                className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-red-400 transition placeholder:text-slate-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-red-400"
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
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-red-400"
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
          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredCases.length === 0 ? (
              <p className="text-center py-10 text-xs text-slate-500 font-mono">No cases matching active filter.</p>
            ) : (
              filteredCases.map(c => {
                const isSelected = selectedCase?._id === c._id;
                return (
                  <div
                    key={c._id}
                    onClick={() => setSelectedCase(c)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900/90 border-red-400 shadow-glow-neon'
                        : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-red-400">{c.complaintId}</span>
                      <div className="flex items-center gap-1.5">
                        <SeverityBadge severity={c.severity} />
                        <PriorityBadge priority={c.priority} />
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-white mt-1.5 truncate">{c.title}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2.5">
                      <span className="font-mono text-[10px] text-slate-500">{c.incidentType}</span>
                      <StatusBadge status={c.status} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Full Case Investigation Dossier (7 Cols) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-7 border border-slate-800 space-y-6">
          {selectedCase ? (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Dossier Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Incident Dossier:</span>
                    <h2 className="text-lg font-mono font-bold text-red-400">{selectedCase.complaintId}</h2>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white mt-1">{selectedCase.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={selectedCase.status} />
                  <SeverityBadge severity={selectedCase.severity} />
                </div>
              </div>

              {/* Status Controller Actions */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase text-red-400 font-bold tracking-wider">
                    // Workflow Status Transition Controller
                  </span>
                  {updatingStatus && <span className="text-[10px] text-slate-400 animate-pulse font-mono">Transitioning state...</span>}
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    { status: 'UNDER_INVESTIGATION', label: 'Start Investigation', color: 'bg-amber-600 hover:bg-amber-500 text-white' },
                    { status: 'ESCALATED', label: 'Escalate to Nodal Bank / HQ', color: 'bg-rose-600 hover:bg-rose-500 text-white' },
                    { status: 'RESOLVED', label: 'Mark Neutralized & Resolved', color: 'bg-red-500 hover:bg-red-400 text-slate-950 font-bold shadow-glow-neon' },
                    { status: 'CLOSED', label: 'Close File', color: 'bg-slate-800 hover:bg-slate-700 text-slate-300' }
                  ].map(action => (
                    <button
                      key={action.status}
                      onClick={() => handleStatusChange(action.status)}
                      disabled={updatingStatus || selectedCase.status === action.status}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-mono tracking-wider transition disabled:opacity-30 disabled:cursor-not-allowed ${action.color}`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Incident Characteristics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Threat Category</span>
                  <span className="text-white font-medium mt-0.5 block">{selectedCase.incidentType}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Incident Channel</span>
                  <span className="text-red-400 font-medium font-mono mt-0.5 block">{selectedCase.channel}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Suspected Origin</span>
                  <span className="text-amber-300 font-medium truncate mt-0.5 block">{selectedCase.suspectedSource || 'Unknown'}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Station Location</span>
                  <span className="text-white mt-0.5 block">{selectedCase.location}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Financial Loss Reported</span>
                  <span className={`mt-0.5 block font-bold ${selectedCase.financialLoss ? 'text-red-400' : 'text-red-400'}`}>
                    {selectedCase.financialLoss ? `${selectedCase.currency} ${selectedCase.lossAmount}` : 'Nil (Protected)'}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Assigned Officer</span>
                  <span className="text-white font-medium mt-0.5 block">{selectedCase.assignedOfficerName}</span>
                </div>
              </div>

              {/* Narrative */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider">Incident Narrative & Grievance Details</h4>
                <p className="text-xs text-slate-300 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 leading-relaxed">
                  {selectedCase.description}
                </p>
              </div>

              {/* AI Prediction & Indicators */}
              {selectedCase.aiAnalysis && (
                <div className="p-4 rounded-2xl bg-slate-950/90 border border-red-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-red-400 font-bold flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5" /> Threat Heuristic Analysis
                    </span>
                    <span className="text-slate-400">
                      Risk Score: <strong className="text-red-400">{selectedCase.aiAnalysis.riskScore !== null ? selectedCase.aiAnalysis.riskScore : 'N/A'}/100</strong> • Confidence: {selectedCase.aiAnalysis.confidence !== null ? (selectedCase.aiAnalysis.confidence * 100).toFixed(0) + '%' : 'N/A'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>Recommended Action:</strong> {selectedCase.aiAnalysis.recommendation}
                  </p>
                </div>
              )}

              {/* Evidence Vault List */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-red-400" /> Evidence Vault & Cryptographic Hashes ({selectedCase.evidences?.length || 0})
                </h4>
                {selectedCase.evidences?.map(ev => (
                  <div key={ev._id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between text-white font-semibold">
                      <span>{ev.fileName}</span>
                      <span className="text-red-400 font-mono text-[11px]">{ev.fileType}</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 truncate">
                      SHA-256 Digest: <span className="text-red-400">{ev.sha256Hash}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Investigation Diary / Officer Notes */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider">
                  Confidential Forensic Log & Investigation Notes
                </h4>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedCase.officerNotes?.map(note => (
                    <div key={note.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-red-400">
                        <span className="font-semibold">{note.author}</span>
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
                    placeholder="Log an investigation finding or officer note..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-400 transition placeholder:text-slate-600"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-2xl bg-red-500 hover:bg-red-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider shadow-glow-neon flex items-center gap-1.5 transition"
                  >
                    <Send className="w-3.5 h-3.5" /> Save Note
                  </button>
                </form>
              </div>

            </div>
          ) : (
            <div className="text-center py-16 text-slate-500 font-mono text-xs">
              Select an incident from the queue to view forensic details and actions.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
