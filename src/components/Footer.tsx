import React, { useState } from 'react';
import { Compass, Mail, Github, Heart, MessageSquare, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, sub?: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200/50 dark:border-zinc-800/80 py-12 md:py-16 text-xs md:text-sm text-zinc-600 dark:text-zinc-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Logo Column */}
          <div className="col-span-1 md:col-span-4 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 rounded-lg flex items-center justify-center">
                <Compass className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <span className="block font-black text-sm text-zinc-900 dark:text-white tracking-tight leading-none">
                  NOVA
                </span>
                <span className="text-[8px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                  Intel Report
                </span>
              </div>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs text-xs">
              Nova Intel Report is a premium, open-source AI educational encyclopedia for computer science graduates, researchers, developers, and engineering scholars.
            </p>
            <div className="flex space-x-3 text-zinc-400 dark:text-zinc-600">
              <a href="#" className="hover:text-indigo-600 transition-colors"><Github className="w-4 h-4" /></a>
              <a href="#" className="hover:text-indigo-600 transition-colors"><MessageSquare className="w-4 h-4" /></a>
              <a href="#" className="hover:text-indigo-600 transition-colors"><ShieldCheck className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Quick links columns */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-300 uppercase tracking-widest">Syllabus</h4>
            <ul className="space-y-1.5 text-xs">
              <li><button onClick={() => onNavigate('course', 'computer-science')} className="hover:text-indigo-600 dark:hover:text-indigo-400 text-left cursor-pointer">Computer Science</button></li>
              <li><button onClick={() => onNavigate('course', 'ai')} className="hover:text-indigo-600 dark:hover:text-indigo-400 text-left cursor-pointer">Artificial Intelligence</button></li>
              <li><button onClick={() => onNavigate('course', 'cyber-security')} className="hover:text-indigo-600 dark:hover:text-indigo-400 text-left cursor-pointer">Cyber Security</button></li>
              <li><button onClick={() => onNavigate('course', 'web-development')} className="hover:text-indigo-600 dark:hover:text-indigo-400 text-left cursor-pointer">Web Development</button></li>
              <li><button onClick={() => onNavigate('course', 'gate')} className="hover:text-indigo-600 dark:hover:text-indigo-400 text-left cursor-pointer">GATE Prep</button></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-300 uppercase tracking-widest">Tools Suite</h4>
            <ul className="space-y-1.5 text-xs">
              <li><button onClick={() => onNavigate('tools')} className="hover:text-indigo-600 dark:hover:text-indigo-400 text-left cursor-pointer">Code Sandbox</button></li>
              <li><button onClick={() => onNavigate('tools')} className="hover:text-indigo-600 dark:hover:text-indigo-400 text-left cursor-pointer">Markdown Editor</button></li>
              <li><button onClick={() => onNavigate('tools')} className="hover:text-indigo-600 dark:hover:text-indigo-400 text-left cursor-pointer">CGPA Calculator</button></li>
              <li><button onClick={() => onNavigate('tools')} className="hover:text-indigo-600 dark:hover:text-indigo-400 text-left cursor-pointer">BMI Calculator</button></li>
              <li><button onClick={() => onNavigate('tools')} className="hover:text-indigo-600 dark:hover:text-indigo-400 text-left cursor-pointer">Age Calculator</button></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="col-span-1 md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-300 uppercase tracking-widest flex items-center space-x-1">
              <Mail className="w-3.5 h-3.5 text-indigo-500" />
              <span>Newsletter Intel Digest</span>
            </h4>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs">
              Receive advanced tech syllabus updates, mock exams, and compiler guides directly. No spam.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter educational email..."
                className="w-full px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none text-xs text-zinc-800 dark:text-zinc-200 focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm cursor-pointer shrink-0 transition-all"
              >
                Subscribe
              </button>
            </form>
            {subscribed && (
              <p className="text-green-500 text-[10px] font-bold animate-pulse">✓ Verification email sent! Welcome to Nova Intel Digest.</p>
            )}
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-200/50 dark:border-zinc-800/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-zinc-500 dark:text-zinc-500">
          <div className="space-y-1">
            <span className="block font-bold text-zinc-900 dark:text-white">Nova Intel Report</span>
            <span>© 2026. All Rights Registered.</span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left text-zinc-600 dark:text-zinc-400">
            <p><strong>Owner:</strong> Ramsakal</p>
            <p><strong>Mobile:</strong> 7678829509</p>
            <p><strong>Email:</strong> ramsakal.cse@gmail.com</p>
          </div>
          <div className="flex space-x-4">
            <button onClick={() => onNavigate('terms')} className="hover:text-indigo-600 cursor-pointer">Terms & Agreements</button>
            <button onClick={() => onNavigate('privacy')} className="hover:text-indigo-600 cursor-pointer">Privacy Charter</button>
            <button onClick={() => onNavigate('faq')} className="hover:text-indigo-600 cursor-pointer">FAQ Helpdesk</button>
          </div>
          <div className="flex items-center space-x-1 font-bold text-indigo-600 dark:text-indigo-400">
            <span>Powered by</span>
            <Heart className="w-3 h-3 text-pink-500 fill-current" />
            <span>Nova Intel Report</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
