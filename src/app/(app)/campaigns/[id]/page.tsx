'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function CampaignDetailsPage() {
  const params = useParams();
  const campaignId = (params?.id ?? '') as string;
  
  const [activeStep, setActiveStep] = useState(0);
  const [emailContent, setEmailContent] = useState('Hi {{firstName}},\n\nI noticed you are currently...');
  const [aiState, setAiState] = useState<'IDLE' | 'ANALYZING' | 'COMPANY' | 'WRITING' | 'DONE'>('IDLE');
  const [launchState, setLaunchState] = useState<'IDLE' | 'CHECKING_LEADS' | 'SUPPRESSION' | 'LIMITS' | 'QUEUEING' | 'DONE'>('IDLE');
  const [isSaving, setIsSaving] = useState(false);
  const [saveComplete, setSaveComplete] = useState(false);
  const [typedContent, setTypedContent] = useState('');
  
  const [steps, setSteps] = useState([
    { id: 1, type: 'email', title: 'Initial Email', delay: 'Day 1' },
    { id: 2, type: 'wait', title: 'Wait 2 Days', delay: '' },
    { id: 3, type: 'email', title: 'Follow-up #1', delay: 'Day 3' },
    { id: 4, type: 'wait', title: 'Wait 3 Days', delay: '' },
    { id: 5, type: 'email', title: 'Follow-up #2', delay: 'Day 6' },
  ]);

  // AI Generation animation
  const handleGenerateAI = () => {
    setAiState('ANALYZING');
    setTimeout(() => setAiState('COMPANY'), 1000);
    setTimeout(() => setAiState('WRITING'), 2000);
    setTimeout(() => {
      setAiState('DONE');
      simulateTyping("Hi {{firstName}},\n\nI noticed your team at {{companyName}} recently expanded operations.\n\nAt OutreachPro, we help scaling companies automate their sales pipeline with AI.\n\nWould you be open to a quick chat next week?");
    }, 3500);
    setTimeout(() => setAiState('IDLE'), 8000);
  };

  const simulateTyping = (text: string) => {
    let index = 0;
    setTypedContent('');
    setEmailContent('');
    const interval = setInterval(() => {
      setTypedContent((prev) => prev + text.charAt(index));
      index++;
      if (index === text.length) clearInterval(interval);
    }, 20); // 20ms per character
  };

  useEffect(() => {
    if (typedContent) setEmailContent(typedContent);
  }, [typedContent]);

  // Launch Campaign Animation
  const handleLaunch = () => {
    setLaunchState('CHECKING_LEADS');
    setTimeout(() => setLaunchState('SUPPRESSION'), 1500);
    setTimeout(() => setLaunchState('LIMITS'), 3000);
    setTimeout(() => setLaunchState('QUEUEING'), 4500);
    setTimeout(() => setLaunchState('DONE'), 6000);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveComplete(true);
      setTimeout(() => setSaveComplete(false), 2000);
    }, 1000);
  };

  const handleAddStep = () => {
    const newSteps = [...steps];
    newSteps.push({ id: Math.random(), type: 'wait', title: 'Wait 3 Days', delay: '' });
    newSteps.push({ id: Math.random(), type: 'email', title: `Follow-up #${steps.filter(s => s.type === 'email').length}`, delay: `Day ${steps.length + 3}` });
    setSteps(newSteps);
    setActiveStep(newSteps.length - 1);
    setEmailContent('');
  };

  const insertVariable = (variable: string) => {
    setEmailContent(prev => prev + variable);
  };

  return (
    <div className="font-sans relative pb-20">
      
      {/* Header */}
      <div className="sm:flex sm:items-center justify-between mb-8 animate-fade-in-up">
        <div className="flex items-center gap-4">
          <Link href="/campaigns" className="text-[#94A3B8] hover:text-[#F8FAFC] p-2 rounded-xl hover:bg-[#111827] transition-colors border border-transparent hover:border-[#1E293B]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#F8FAFC]">Q3 Enterprise Outreach</h1>
              <span className="px-2.5 py-0.5 rounded-md bg-[#151E30] text-[#94A3B8] text-xs font-semibold border border-[#1E293B]">Draft</span>
            </div>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3">
          <button onClick={handleSave} className="px-4 py-2 bg-[#151E30] hover:bg-[#1E293B] border border-[#1E293B] text-[#F8FAFC] text-sm font-medium rounded-xl transition-all shadow-md w-28 flex justify-center btn-press">
            {isSaving ? <svg className="animate-spin h-5 w-5 text-[#3B82F6]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> 
            : saveComplete ? <svg className="h-5 w-5 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> 
            : 'Save'}
          </button>
          <button onClick={handleLaunch} className="px-6 py-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] hover:from-[#2563EB] hover:to-[#0891B2] shadow-[0_0_20px_rgba(59,130,246,0.3)] text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2 btn-press">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Launch Campaign
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left: Sequence Builder */}
        <div className="w-full lg:w-1/3 animate-fade-in-up delay-1 relative">
          <div className="bg-[#111827]/80 backdrop-blur-xl border border-[#1E293B] rounded-2xl p-6 shadow-xl sticky top-20">
            <h3 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-wider mb-6">Sequence</h3>
            
            <div className="space-y-0 relative">
              {/* Connecting Line */}
              <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-[#1E293B] rounded-full animate-draw-line" />
              
              {steps.map((step, i) => (
                <div key={step.id} className="relative z-10">
                  <button
                    onClick={() => step.type === 'email' && setActiveStep(i)}
                    className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${
                      activeStep === i ? 'bg-[#3B82F6]/10 border border-[#3B82F6]/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'hover:bg-[#151E30] border border-transparent'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      activeStep === i ? 'bg-[#3B82F6] shadow-[0_0_10px_rgba(59,130,246,0.6)] scale-110' : 'bg-[#1E293B]'
                    }`}>
                      {step.type === 'email' ? (
                        <svg className={`w-5 h-5 ${activeStep === i ? 'text-white' : 'text-[#94A3B8]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      ) : (
                        <svg className="w-5 h-5 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`font-semibold text-sm ${activeStep === i ? 'text-[#3B82F6]' : 'text-[#F8FAFC]'}`}>{step.title}</p>
                      <p className="text-xs text-[#94A3B8]">{step.delay}</p>
                    </div>
                  </button>
                  {i < steps.length - 1 && <div className="h-4" />}
                </div>
              ))}
            </div>

            <button onClick={handleAddStep} className="mt-6 w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-[#1E293B] rounded-xl text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#3B82F6]/50 hover:bg-[#3B82F6]/5 transition-all group btn-press">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Step
            </button>
          </div>
        </div>

        {/* Right: Email Editor */}
        <div className="w-full lg:w-2/3 animate-fade-in-up delay-2">
          <div className="bg-[#111827]/80 backdrop-blur-xl border border-[#1E293B] rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full min-h-[600px]">
            
            {/* Editor Toolbar */}
            <div className="px-6 py-4 border-b border-[#1E293B] flex items-center justify-between bg-[#0D1424]">
               <h2 className="font-bold text-[#F8FAFC]">Edit {steps[activeStep].title}</h2>
               <button 
                 onClick={handleGenerateAI}
                 disabled={aiState !== 'IDLE'}
                 className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative overflow-hidden ${
                   aiState === 'IDLE' 
                     ? 'bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/20 shadow-[0_0_10px_rgba(139,92,246,0.1)]' 
                     : aiState === 'DONE'
                     ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30'
                     : 'bg-[#151E30] text-[#F8FAFC] border border-[#1E293B]'
                 }`}
               >
                 {aiState !== 'IDLE' && aiState !== 'DONE' && (
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#8B5CF6]/20 to-transparent -translate-x-full animate-shimmer" />
                 )}
                 <svg className="w-4 h-4 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                 <span className="z-10">
                   {aiState === 'IDLE' && 'Generate with AI'}
                   {aiState === 'ANALYZING' && 'Analyzing Lead...'}
                   {aiState === 'COMPANY' && 'Understanding Company...'}
                   {aiState === 'WRITING' && 'Writing Personalized Email...'}
                   {aiState === 'DONE' && 'Email Generated ✓'}
                 </span>
               </button>
            </div>

            {/* Inputs */}
            <div className="p-6 space-y-4 flex-1 flex flex-col">
              <div className="group relative">
                <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 block">Subject</label>
                <input 
                  type="text" 
                  defaultValue="Quick question regarding {{companyName}}" 
                  className="w-full bg-transparent border-b-2 border-[#1E293B] text-[#F8FAFC] text-lg py-2 focus:outline-none focus:border-[#3B82F6] transition-colors"
                />
              </div>

              {/* Variable Chips */}
              <div className="flex gap-2 py-2 overflow-x-auto no-scrollbar">
                {['{{firstName}}', '{{companyName}}', '{{jobTitle}}'].map(variable => (
                  <button onClick={() => insertVariable(variable)} key={variable} className="px-2.5 py-1 bg-[#151E30] border border-[#1E293B] text-[#94A3B8] text-xs font-mono rounded-md hover:bg-[#1E293B] hover:text-[#3B82F6] transition-colors shrink-0 btn-press">
                    + {variable}
                  </button>
                ))}
              </div>

              {/* Textarea */}
              <div className="flex-1 relative mt-2 group">
                <textarea 
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  className="w-full h-full min-h-[300px] bg-transparent resize-none focus:outline-none text-[#F8FAFC] leading-relaxed placeholder-[#475569] border border-transparent group-focus-within:border-[#3B82F6]/30 rounded-xl p-4 transition-colors"
                  placeholder="Type your email content here..."
                />
                {aiState === 'WRITING' && (
                   <span className="absolute left-4 top-4 w-1 h-5 bg-[#8B5CF6] animate-blink" />
                )}
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Campaign Launch Modal Animation */}
      {launchState !== 'IDLE' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080D1A]/90 backdrop-blur-md animate-scale-in">
           <div className="bg-[#111827] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-[#1E293B] text-center p-8 relative">
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#3B82F6]/5 to-transparent pointer-events-none" />

              {launchState === 'DONE' ? (
                <div className="animate-fade-in-up">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#22C55E]/10 flex items-center justify-center border-4 border-[#22C55E]/20 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                    <svg className="w-12 h-12 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-[#F8FAFC] mb-2">Campaign is now running</h3>
                  <p className="text-[#94A3B8] mb-8">Emails will be dispatched according to your schedule and sending limits.</p>
                  <button onClick={() => setLaunchState('IDLE')} className="px-6 py-3 bg-[#151E30] text-[#F8FAFC] font-semibold rounded-xl hover:bg-[#1E293B] border border-[#1E293B] transition-colors btn-press">
                    Return to Campaign
                  </button>
                </div>
              ) : (
                <div>
                  <div className="w-16 h-16 mx-auto mb-6 relative">
                    <div className="absolute inset-0 border-4 border-[#1E293B] rounded-full" />
                    <div className="absolute inset-0 border-4 border-t-[#3B82F6] border-r-[#06B6D4] border-b-transparent border-l-transparent rounded-full animate-spin" />
                    <svg className="absolute inset-0 m-auto w-6 h-6 text-[#F8FAFC]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#F8FAFC] mb-6">Starting Campaign...</h3>
                  
                  <div className="space-y-4 text-left">
                    {[
                      { state: 'CHECKING_LEADS', label: 'Checking 1,250 Leads' },
                      { state: 'SUPPRESSION', label: 'Verifying Suppression List' },
                      { state: 'LIMITS', label: 'Checking SMTP Sending Limits' },
                      { state: 'QUEUEING', label: 'Queueing Initial Emails' }
                    ].map((step, i) => {
                      const states = ['CHECKING_LEADS', 'SUPPRESSION', 'LIMITS', 'QUEUEING'];
                      const currentIndex = states.indexOf(launchState);
                      const isComplete = i < currentIndex;
                      const isActive = i === currentIndex;

                      return (
                        <div key={step.state} className={`flex items-center gap-3 transition-opacity duration-300 ${isActive || isComplete ? 'opacity-100' : 'opacity-30'}`}>
                          {isComplete ? (
                            <svg className="w-5 h-5 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          ) : isActive ? (
                            <span className="w-5 h-5 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-[#1E293B]" />
                          )}
                          <span className={`text-sm font-medium ${isComplete ? 'text-[#F8FAFC]' : isActive ? 'text-[#3B82F6]' : 'text-[#94A3B8]'}`}>{step.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
           </div>
        </div>
      )}

    </div>
  );
}
