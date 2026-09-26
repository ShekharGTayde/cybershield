import React, { useState } from 'react';
import { 
  BookOpen, 
  ShieldAlert, 
  MailWarning, 
  Smartphone, 
  CreditCard, 
  Lock, 
  PhoneCall, 
  Globe, 
  Users, 
  CheckCircle2, 
  Award,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { AWARENESS_MODULES } from '../services/mockData';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'A contact claiming to be a defence reporter on LinkedIn asks for your unit’s latest equipment trials and posting list. What is the correct OPSEC action?',
    options: [
      'Share only unclassified portions of the report.',
      'Decline politely, screenshot the conversation, and report immediately to CERT-Army as a suspected honeytrap / espionage probe.',
      'Ask them for their journalist press badge first before answering.',
      'Delete the app without reporting.'
    ],
    correct: 1,
    explanation: 'Any solicitation of unit movements, trials, or equipment details on social media is a potential OPSEC breach attempt and must be reported.'
  },
  {
    id: 2,
    question: 'You receive an SMS claiming your SPARSH pension account is locked, with a link ending in `.sparsh-pension.xyz`. How should you proceed?',
    options: [
      'Click the link quickly and enter your Aadhaar and OTP.',
      'Forward the message to fellow veterans to check if their accounts are locked.',
      'Do not click the link. Official government portals only use `.gov.in` or `.nic.in`. Report the URL to CyberShield.',
      'Reply to the SMS asking for clarification.'
    ],
    correct: 2,
    explanation: 'Official government systems never operate on generic top-level domains like `.xyz`, `.top`, or `.online`.'
  },
  {
    id: 3,
    question: 'What is the policy regarding GPS tracking apps and fitness smartwatches inside military cantonments and operational bases?',
    options: [
      'Permitted if sharing is set to friends only.',
      'Public location sharing, strava heatmaps, and automatic geotagging must be strictly disabled to prevent adversary reconnaissance.',
      'Permitted during off-duty hours only.',
      'GPS has no security impact.'
    ],
    correct: 1,
    explanation: 'Fitness tracking heatmaps have historically exposed military base layouts and patrol routes.'
  }
];

export function CyberAwarenessPage() {
  const [selectedModule, setSelectedModule] = useState(AWARENESS_MODULES[0]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const handleAnswer = (questionId, optionIdx) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleQuizSubmit = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach(q => {
      if (quizAnswers[q.id] === q.correct) score += 1;
    });
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="glass-panel-glow rounded-2xl p-6 sm:p-8 border border-slate-800">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-sky-300 text-xs font-medium border border-slate-700 w-fit mb-2">
          <BookOpen className="w-4 h-4 text-sky-400" />
          Security Awareness & Defence Protocols
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Cyber Defence & OPSEC Awareness Hub
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Standard Operating Procedures (SOPs), anti-phishing guidelines, and cyber defense protocols for armed forces personnel and families.
        </p>
      </div>

      {/* Module Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {AWARENESS_MODULES.map(mod => {
          const isSelected = selectedModule.id === mod.id;
          return (
            <button
              key={mod.id}
              onClick={() => setSelectedModule(mod)}
              className={`p-5 rounded-2xl text-left border transition-all ${
                isSelected
                  ? 'bg-slate-800/95 border-sky-500 text-white shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] font-mono text-sky-400 uppercase">{mod.category}</span>
              <h3 className="text-sm font-bold text-white mt-1 line-clamp-2">{mod.title}</h3>
              <span className="text-[11px] font-mono text-slate-500 mt-2 block">{mod.readTime}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Module Detail View */}
      {selectedModule && (
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">{selectedModule.category}</span>
              <h2 className="text-xl font-bold text-white mt-0.5">{selectedModule.title}</h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-xs font-mono text-slate-300">
              {selectedModule.readTime}
            </span>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {selectedModule.summary}
          </p>

          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              Key Mandatory Guidelines & Rules of Engagement:
            </h3>

            <div className="space-y-2.5">
              {selectedModule.rules.map((rule, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3 text-xs leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-slate-200">{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Defence Cyber Security Quiz */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Interactive Defence Cyber Readiness Knowledge Check
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Test your operational readiness against modern cyber and social engineering vectors.
            </p>
          </div>
          {quizSubmitted && (
            <button
              onClick={resetQuiz}
              className="text-xs font-mono text-cyan-400 hover:underline"
            >
              Retake Quiz
            </button>
          )}
        </div>

        <div className="space-y-6">
          {QUIZ_QUESTIONS.map((q, qIndex) => {
            const userAnswer = quizAnswers[q.id];
            return (
              <div key={q.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <p className="text-xs sm:text-sm font-semibold text-white">
                  {qIndex + 1}. {q.question}
                </p>

                <div className="grid grid-cols-1 gap-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userAnswer === optIdx;
                    let btnStyle = 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700';

                    if (quizSubmitted) {
                      if (optIdx === q.correct) {
                        btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
                      } else if (isSelected && optIdx !== q.correct) {
                        btnStyle = 'bg-red-950/80 border-red-500 text-red-300 line-through';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-cyan-950/80 border-cyan-500 text-cyan-300 font-semibold';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleAnswer(q.id, optIdx)}
                        className={`p-3 rounded-xl text-left text-xs border transition-all ${btnStyle}`}
                      >
                        <span className="font-mono mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div className="p-2.5 rounded bg-slate-950 text-[11px] text-slate-400 border border-slate-800">
                    <strong className="text-cyan-400">Explanation:</strong> {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!quizSubmitted ? (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleQuizSubmit}
              disabled={Object.keys(quizAnswers).length < QUIZ_QUESTIONS.length}
              className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-glow-cyan transition disabled:opacity-50"
            >
              Submit Answers & Evaluate Readiness
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/40 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-400">Readiness Score Result:</p>
              <p className="text-xl font-bold text-white font-mono">
                {quizScore} / {QUIZ_QUESTIONS.length} ({((quizScore / QUIZ_QUESTIONS.length) * 100).toFixed(0)}%)
              </p>
            </div>
            <span className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold ${
              quizScore === QUIZ_QUESTIONS.length ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
            }`}>
              {quizScore === QUIZ_QUESTIONS.length ? '✓ DEFENCE CYBER CERTIFIED' : 'REVIEW ADVISORIES'}
            </span>
          </div>
        )}
      </div>

    </div>
  );
}
