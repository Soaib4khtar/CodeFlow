import React, { useState } from 'react';
import { ChevronDown, Send } from 'lucide-react';
import { fieldClass, Label, primaryBtn } from '../AccountFieldControls';

const LS_FEEDBACK_KEY = 'codeflow_feedback_v1';

const FAQS: { q: string; a: string }[] = [
  {
    q: 'How do I visualize my own code?',
    a: 'Pick a problem, write your solution in the main editor, then press "Run & Visualize". Each executed line becomes a step you can play, pause or step through.'
  },
  {
    q: 'What does "Show Answer" do?',
    a: 'It loads the reference solution into the editor, runs it against every test case and visualizes it. Your previous code is replaced, so copy it first if you want to keep it.'
  },
  {
    q: 'Where is my progress stored?',
    a: 'Solved problems, favourites, preferences and your profile are stored only in this browser (localStorage). Use Privacy & Security to export or erase them.'
  },
  {
    q: 'How do I step through execution?',
    a: 'Use the arrow buttons in the toolbar, or press the left/right arrow keys. Space toggles play and pause when the editor is not focused.'
  }
];

interface HelpPanelProps {
  darkMode: boolean;
}

export const HelpPanel: React.FC<HelpPanelProps> = ({ darkMode }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    try {
      const existing = JSON.parse(localStorage.getItem(LS_FEEDBACK_KEY) || '[]');
      existing.push({ text: feedbackText.trim(), at: new Date().toISOString() });
      localStorage.setItem(LS_FEEDBACK_KEY, JSON.stringify(existing));
    } catch {
      // ignore storage errors
    }
    setFeedbackText('');
    setSent(true);
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="space-y-1.5">
        {FAQS.map((item, idx) => (
          <div
            key={item.q}
            className={`rounded-lg border ${darkMode ? 'border-slate-700' : 'border-[#E0D9CB]'}`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left font-semibold cursor-pointer"
            >
              <span>{item.q}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                  openIndex === idx ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === idx && (
              <p className="px-3 pb-2.5 text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.a}
              </p>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        <Label>Send feedback</Label>
        <textarea
          value={feedbackText}
          onChange={(e) => {
            setFeedbackText(e.target.value);
            setSent(false);
          }}
          rows={3}
          placeholder="Tell us what to improve..."
          className={`${fieldClass(darkMode)} resize-none`}
        />
        <div className="flex items-center justify-between">
          <span className="text-emerald-600 dark:text-emerald-400">
            {sent ? 'Thanks! Feedback saved.' : ''}
          </span>
          <button
            type="submit"
            disabled={!feedbackText.trim()}
            className={`${primaryBtn} flex items-center gap-1.5`}
          >
            <Send className="w-3.5 h-3.5" /> Send
          </button>
        </div>
      </form>
    </div>
  );
};
