import React, { useState, useEffect, useRef } from 'react';
import { Calculator, Scale, Play, RefreshCw, FileText, ChevronRight, Eye, Code, Trash2 } from 'lucide-react';

export default function InteractiveTools() {
  const [activeTab, setActiveTab] = useState<'unit' | 'cgpa' | 'bmi' | 'age' | 'code' | 'markdown'>('code');

  // --- 1. UNIT CONVERTER STATE ---
  const [unitCategory, setUnitCategory] = useState<'length' | 'mass' | 'temp'>('length');
  const [unitFrom, setUnitFrom] = useState<string>('m');
  const [unitTo, setUnitTo] = useState<string>('km');
  const [unitValue, setUnitValue] = useState<number>(1);
  const [unitResult, setUnitResult] = useState<number>(0.001);

  // --- 2. CGPA CALCULATOR STATE ---
  const [cgpaCourses, setCgpaCourses] = useState<{ id: string; name: string; credits: number; grade: string }[]>([
    { id: '1', name: 'Data Structures', credits: 4, grade: 'A+' },
    { id: '2', name: 'Engineering Physics', credits: 3, grade: 'A' },
    { id: '3', name: 'Linear Algebra', credits: 3, grade: 'B' }
  ]);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCredits, setNewCourseCredits] = useState(3);
  const [newCourseGrade, setNewCourseGrade] = useState('A');

  // --- 3. BMI CALCULATOR STATE ---
  const [bmiWeight, setBmiWeight] = useState(70);
  const [bmiHeight, setBmiHeight] = useState(175);
  const [bmiValue, setBmiValue] = useState(22.86);
  const [bmiStatus, setBmiStatus] = useState<'Underweight' | 'Normal' | 'Overweight' | 'Obese'>('Normal');

  // --- 4. AGE CALCULATOR STATE ---
  const [birthdate, setBirthdate] = useState('2000-01-01');
  const [calculatedAge, setCalculatedAge] = useState<{ years: number; months: number; days: number } | null>(null);

  // --- 5. CODE EDITOR STATE ---
  const [codeLang, setCodeLang] = useState<'html' | 'python'>('html');
  const [codeSource, setCodeSource] = useState<string>(`<!-- Enter HTML/CSS/JS code below -->
<div style="text-align: center; font-family: sans-serif; padding: 20px;">
  <h1 style="color: #6366f1;">Hello from Nova!</h1>
  <p style="color: #4b5563;">Edit this code to see real-time execution.</p>
  <button style="background: #6366f1; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;" onclick="alert('Working!')">
    Click Me
  </button>
</div>`);
  const [codeOutput, setCodeOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);

  // --- 6. MARKDOWN EDITOR STATE ---
  const [markdownText, setMarkdownText] = useState<string>(`# Markdown Editor Preview

This is a **live Markdown preview** pane. Type on the left, see standard styling on the right.

### Core Features:
- Bullet lists like this one
- *Italics* and **bold** formats
- Code highlights: \`const test = "Nova Intel";\`

> Explore, study, and create code with premium integrated tools.`);

  // --- 1. UNIT CONVERTER LOGIC ---
  useEffect(() => {
    let result = 0;
    const v = Number(unitValue) || 0;
    if (unitCategory === 'length') {
      // Base: meters
      let meters = v;
      if (unitFrom === 'km') meters = v * 1000;
      if (unitFrom === 'mi') meters = v * 1609.34;
      if (unitFrom === 'ft') meters = v * 0.3048;

      if (unitTo === 'm') result = meters;
      if (unitTo === 'km') result = meters / 1000;
      if (unitTo === 'mi') result = meters / 1609.34;
      if (unitTo === 'ft') result = meters / 0.3048;
    } else if (unitCategory === 'mass') {
      // Base: kg
      let kg = v;
      if (unitFrom === 'lb') kg = v * 0.453592;
      if (unitFrom === 'g') kg = v / 1000;
      if (unitFrom === 'oz') kg = v * 0.0283495;

      if (unitTo === 'kg') result = kg;
      if (unitTo === 'lb') result = kg / 0.453592;
      if (unitTo === 'g') result = kg * 1000;
      if (unitTo === 'oz') result = kg / 0.0283495;
    } else if (unitCategory === 'temp') {
      if (unitFrom === 'C') {
        if (unitTo === 'F') result = (v * 9) / 5 + 32;
        else if (unitTo === 'K') result = v + 273.15;
        else result = v;
      } else if (unitFrom === 'F') {
        if (unitTo === 'C') result = ((v - 32) * 5) / 9;
        else if (unitTo === 'K') result = ((v - 32) * 5) / 9 + 273.15;
        else result = v;
      } else if (unitFrom === 'K') {
        if (unitTo === 'C') result = v - 273.15;
        else if (unitTo === 'F') result = ((v - 273.15) * 9) / 5 + 32;
        else result = v;
      }
    }
    setUnitResult(parseFloat(result.toFixed(5)));
  }, [unitCategory, unitFrom, unitTo, unitValue]);

  // Adjust unit options when category changes
  useEffect(() => {
    if (unitCategory === 'length') {
      setUnitFrom('m');
      setUnitTo('km');
    } else if (unitCategory === 'mass') {
      setUnitFrom('kg');
      setUnitTo('lb');
    } else if (unitCategory === 'temp') {
      setUnitFrom('C');
      setUnitTo('F');
    }
  }, [unitCategory]);

  // --- 2. CGPA CALCULATOR LOGIC ---
  const gradePoints: { [key: string]: number } = {
    'A+': 10,
    A: 9,
    'B+': 8,
    B: 7,
    'C+': 6,
    C: 5,
    D: 4,
    F: 0
  };

  const calculateCGPA = () => {
    let totalCredits = 0;
    let weightedPoints = 0;
    cgpaCourses.forEach((c) => {
      const gp = gradePoints[c.grade] ?? 0;
      weightedPoints += gp * c.credits;
      totalCredits += c.credits;
    });
    return totalCredits > 0 ? (weightedPoints / totalCredits).toFixed(2) : '0.00';
  };

  const addCgpaCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName.trim()) return;
    setCgpaCourses([
      ...cgpaCourses,
      {
        id: Date.now().toString(),
        name: newCourseName,
        credits: Number(newCourseCredits),
        grade: newCourseGrade
      }
    ]);
    setNewCourseName('');
  };

  const removeCgpaCourse = (id: string) => {
    setCgpaCourses(cgpaCourses.filter((c) => c.id !== id));
  };

  // --- 3. BMI CALCULATOR LOGIC ---
  useEffect(() => {
    const hInMeters = bmiHeight / 100;
    if (hInMeters <= 0) return;
    const computedBmi = bmiWeight / (hInMeters * hInMeters);
    setBmiValue(parseFloat(computedBmi.toFixed(2)));

    if (computedBmi < 18.5) setBmiStatus('Underweight');
    else if (computedBmi < 25) setBmiStatus('Normal');
    else if (computedBmi < 30) setBmiStatus('Overweight');
    else setBmiStatus('Obese');
  }, [bmiWeight, bmiHeight]);

  // --- 4. AGE CALCULATOR LOGIC ---
  useEffect(() => {
    if (!birthdate) return;
    const birth = new Date(birthdate);
    const now = new Date();
    if (birth > now) {
      setCalculatedAge(null);
      return;
    }
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      // Get days in preceding month
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    setCalculatedAge({ years, months, days });
  }, [birthdate]);

  // --- 5. CODE EDITOR RUN LOGIC ---
  const runCode = () => {
    setIsRunning(true);
    if (codeLang === 'html') {
      // Simulate rendering in an iframe
      setTimeout(() => {
        setIsRunning(false);
        setCodeOutput(codeSource);
      }, 600);
    } else {
      // Simulated Python compiler
      setTimeout(() => {
        setIsRunning(false);
        if (codeSource.includes('print')) {
          const lines = codeSource.split('\n');
          const outputs: string[] = [];
          lines.forEach((line) => {
            if (line.includes('print(')) {
              const start = line.indexOf('print(') + 6;
              const end = line.lastIndexOf(')');
              if (end > start) {
                let inner = line.slice(start, end).trim();
                // Simple string trim
                if ((inner.startsWith('"') && inner.endsWith('"')) || (inner.startsWith("'") && inner.endsWith("'"))) {
                  inner = inner.slice(1, -1);
                }
                outputs.push(inner);
              }
            }
          });
          setCodeOutput(outputs.length > 0 ? outputs.join('\n') : 'Python script completed successfully with no terminal outputs.');
        } else {
          setCodeOutput('Process finished with exit code 0.');
        }
      }, 800);
    }
  };

  useEffect(() => {
    if (codeLang === 'python') {
      setCodeSource(`# Live Python Interpreter Simulator
name = "Nova Engineering Scholar"
print("Welcome to Nova Code Sandbox!")
print("Connecting workspace environments...")
print("Hello, " + name)
`);
    } else {
      setCodeSource(`<!-- Enter HTML/CSS/JS code below -->
<div style="text-align: center; font-family: sans-serif; padding: 20px;">
  <h1 style="color: #6366f1;">Hello from Nova!</h1>
  <p style="color: #4b5563;">Edit this code to see real-time execution.</p>
  <button style="background: #6366f1; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;" onclick="alert('Working!')">
    Click Me
  </button>
</div>`);
    }
    setCodeOutput('');
  }, [codeLang]);

  // Simple Markdown to HTML Parser with strict HTML escaping to prevent XSS
  const parseMarkdown = (md: string) => {
    // 1. Strictly escape raw HTML entities first to prevent malicious script injection
    let html = md
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // 2. Headings
    html = html.replace(/^# (.*?)$/gm, '<h1 class="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-4 mb-2">$1</h1>');
    html = html.replace(/^## (.*?)$/gm, '<h2 class="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mt-3 mb-2">$1</h2>');
    html = html.replace(/^### (.*?)$/gm, '<h3 class="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mt-2 mb-1">$1</h3>');
    // Blockquote
    html = html.replace(/^> (.*?)$/gm, '<blockquote class="border-l-4 border-indigo-500 pl-4 py-1 my-3 text-zinc-600 dark:text-zinc-300 italic bg-zinc-50 dark:bg-zinc-800/40 rounded">$1</blockquote>');
    // Code block
    html = html.replace(/`(.*?)`/g, '<code class="bg-zinc-100 dark:bg-zinc-800 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded font-mono text-sm">$1</code>');
    // Bold & Italics
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Bullet lists
    html = html.replace(/^- (.*?)$/gm, '<li class="ml-5 list-disc my-1">$1</li>');
    // Paragraph spaces
    html = html.split('\n\n').map(p => {
      if (p.trim().startsWith('<h') || p.trim().startsWith('<li') || p.trim().startsWith('<block')) return p;
      return `<p class="my-2 leading-relaxed text-zinc-700 dark:text-zinc-300">${p}</p>`;
    }).join('\n');
    return html;
  };

  return (
    <div className="w-full">
      {/* Tab Navigation header */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800/80 mb-6 overflow-x-auto scrollbar-none gap-2">
        <button
          onClick={() => setActiveTab('code')}
          className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center space-x-2 shrink-0 ${
            activeTab === 'code'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Code Editor</span>
        </button>
        <button
          onClick={() => setActiveTab('markdown')}
          className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center space-x-2 shrink-0 ${
            activeTab === 'markdown'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Markdown Editor</span>
        </button>
        <button
          onClick={() => setActiveTab('cgpa')}
          className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center space-x-2 shrink-0 ${
            activeTab === 'cgpa'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>CGPA Calculator</span>
        </button>
        <button
          onClick={() => setActiveTab('unit')}
          className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center space-x-2 shrink-0 ${
            activeTab === 'unit'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Unit Converter</span>
        </button>
        <button
          onClick={() => setActiveTab('bmi')}
          className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center space-x-2 shrink-0 ${
            activeTab === 'bmi'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>BMI Calculator</span>
        </button>
        <button
          onClick={() => setActiveTab('age')}
          className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center space-x-2 shrink-0 ${
            activeTab === 'age'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Age Calculator</span>
        </button>
      </div>

      {/* --- CONTENT BOXES --- */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl p-4 md:p-6 shadow-sm">
        
        {/* TAB 1: CODE EDITOR */}
        {activeTab === 'code' && (
          <div>
            <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Interactive Code Sandbox</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Write source code and run the compiled output instantly.</p>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={codeLang}
                  onChange={(e) => setCodeLang(e.target.value as any)}
                  className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs rounded-lg text-zinc-800 dark:text-zinc-200 outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="html">HTML5 + CSS + JS</option>
                  <option value="python">Python Interpreter</option>
                </select>
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isRunning ? 'Running...' : 'Run Code'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <div className="bg-zinc-950 text-zinc-200 px-4 py-2 rounded-t-xl text-xs font-mono flex items-center justify-between border-b border-zinc-800">
                  <span>Source Code</span>
                  <span className="text-indigo-400">{codeLang.toUpperCase()}</span>
                </div>
                <textarea
                  value={codeSource}
                  onChange={(e) => setCodeSource(e.target.value)}
                  rows={10}
                  className="w-full bg-zinc-950 text-zinc-100 p-4 font-mono text-sm border-0 rounded-b-xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-inner"
                />
              </div>

              <div>
                <div className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 px-4 py-2 rounded-t-xl text-xs font-semibold border-b border-zinc-200 dark:border-zinc-700 flex items-center space-x-2">
                  <Eye className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Live Sandbox Output Console</span>
                </div>
                <div className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 p-4 rounded-b-xl font-mono text-sm h-[224px] overflow-auto shadow-inner">
                  {codeLang === 'html' ? (
                    codeOutput ? (
                      <iframe
                        title="Sandbox Output"
                        srcDoc={codeOutput}
                        sandbox="allow-scripts"
                        referrerPolicy="no-referrer"
                        className="w-full h-full border-0 bg-white"
                      />
                    ) : (
                      <span className="text-zinc-400 italic text-xs">Run HTML code to view visual canvas rendering...</span>
                    )
                  ) : (
                    <pre className="text-zinc-800 dark:text-zinc-300 text-xs whitespace-pre-wrap">
                      {codeOutput || '>>> Type print statements to output values...\n>>> Waiting for compiler activation...'}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MARKDOWN EDITOR */}
        {activeTab === 'markdown' && (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Markdown Live Preview</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Write Markdown notation in the editor to view styled document layouts immediately.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <textarea
                  value={markdownText}
                  onChange={(e) => setMarkdownText(e.target.value)}
                  rows={12}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 p-4 font-mono text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
                  placeholder="Type # Heading, **bold**, etc."
                />
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800/80 p-6 rounded-xl overflow-auto max-h-[300px]">
                <div
                  className="prose prose-zinc dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200 text-sm"
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(markdownText) }}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CGPA CALCULATOR */}
        {activeTab === 'cgpa' && (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Cumulative GPA Calculator</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Easily compute your semester grade point averages with our direct weight scale.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 p-4 rounded-xl">
                <form onSubmit={addCgpaCourse} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Course Name</label>
                    <input
                      type="text"
                      required
                      value={newCourseName}
                      onChange={(e) => setNewCourseName(e.target.value)}
                      placeholder="e.g. Operating Systems"
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-800 dark:text-zinc-200 outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Credits</label>
                      <input
                        type="number"
                        min={1}
                        max={8}
                        value={newCourseCredits}
                        onChange={(e) => setNewCourseCredits(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-800 dark:text-zinc-200 outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Grade</label>
                      <select
                        value={newCourseGrade}
                        onChange={(e) => setNewCourseGrade(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-800 dark:text-zinc-200 outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="A+">A+ (10)</option>
                        <option value="A">A (9)</option>
                        <option value="B+">B+ (8)</option>
                        <option value="B">B (7)</option>
                        <option value="C+">C+ (6)</option>
                        <option value="C">C (5)</option>
                        <option value="D">D (4)</option>
                        <option value="F">F (0)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-sm"
                  >
                    Add Course
                  </button>
                </form>
              </div>

              <div className="lg:col-span-2 space-y-4">
                <div className="border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/80 text-zinc-500 uppercase font-bold tracking-wider">
                      <tr>
                        <th className="px-4 py-2.5">Course</th>
                        <th className="px-4 py-2.5">Credits</th>
                        <th className="px-4 py-2.5">Grade</th>
                        <th className="px-4 py-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-200">
                      {cgpaCourses.map((c) => (
                        <tr key={c.id}>
                          <td className="px-4 py-3 font-medium">{c.name}</td>
                          <td className="px-4 py-3">{c.credits}</td>
                          <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">{c.grade}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => removeCgpaCourse(c.id)}
                              className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {cgpaCourses.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-6 text-center text-zinc-400 italic">No courses added yet. Add semesters to calculate.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30">
                  <div>
                    <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300">Cumulative CGPA (10-Point Scale)</h4>
                    <p className="text-xs text-indigo-700/80 dark:text-indigo-400/80">Based on weighted aggregate credits.</p>
                  </div>
                  <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                    {calculateCGPA()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: UNIT CONVERTER */}
        {activeTab === 'unit' && (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Engineering Unit Converter</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Convert measurements accurately across Length, Mass, and Temperatures.</p>
            </div>

            <div className="flex space-x-2 mb-6 bg-zinc-50 dark:bg-zinc-800 p-1.5 rounded-lg w-fit">
              <button
                onClick={() => setUnitCategory('length')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  unitCategory === 'length'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                Length
              </button>
              <button
                onClick={() => setUnitCategory('mass')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  unitCategory === 'mass'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                Mass
              </button>
              <button
                onClick={() => setUnitCategory('temp')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  unitCategory === 'temp'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                Temperature
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Value</label>
                <input
                  type="number"
                  value={unitValue}
                  onChange={(e) => setUnitValue(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-sm text-zinc-800 dark:text-zinc-200 outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">From</label>
                <select
                  value={unitFrom}
                  onChange={(e) => setUnitFrom(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-sm text-zinc-800 dark:text-zinc-200 outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {unitCategory === 'length' && (
                    <>
                      <option value="m">Meter (m)</option>
                      <option value="km">Kilometer (km)</option>
                      <option value="mi">Mile (mi)</option>
                      <option value="ft">Feet (ft)</option>
                    </>
                  )}
                  {unitCategory === 'mass' && (
                    <>
                      <option value="kg">Kilogram (kg)</option>
                      <option value="lb">Pound (lb)</option>
                      <option value="g">Gram (g)</option>
                      <option value="oz">Ounce (oz)</option>
                    </>
                  )}
                  {unitCategory === 'temp' && (
                    <>
                      <option value="C">Celsius (°C)</option>
                      <option value="F">Fahrenheit (°F)</option>
                      <option value="K">Kelvin (K)</option>
                    </>
                  )}
                </select>
              </div>

              <div className="flex justify-center pt-3 md:pt-0">
                <ChevronRight className="w-5 h-5 text-zinc-400 rotate-90 md:rotate-0" />
              </div>

              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">To</label>
                <select
                  value={unitTo}
                  onChange={(e) => setUnitTo(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-sm text-zinc-800 dark:text-zinc-200 outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {unitCategory === 'length' && (
                    <>
                      <option value="m">Meter (m)</option>
                      <option value="km">Kilometer (km)</option>
                      <option value="mi">Mile (mi)</option>
                      <option value="ft">Feet (ft)</option>
                    </>
                  )}
                  {unitCategory === 'mass' && (
                    <>
                      <option value="kg">Kilogram (kg)</option>
                      <option value="lb">Pound (lb)</option>
                      <option value="g">Gram (g)</option>
                      <option value="oz">Ounce (oz)</option>
                    </>
                  )}
                  {unitCategory === 'temp' && (
                    <>
                      <option value="C">Celsius (°C)</option>
                      <option value="F">Fahrenheit (°F)</option>
                      <option value="K">Kelvin (K)</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="mt-6 bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 flex flex-wrap justify-between items-center">
              <span className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">Converted Equivalent</span>
              <span className="text-xl md:text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {unitValue} {unitFrom} = {unitResult} {unitTo}
              </span>
            </div>
          </div>
        )}

        {/* TAB 5: BMI CALCULATOR */}
        {activeTab === 'bmi' && (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Body Mass Index (BMI)</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Monitor health standards to balance heavy software engineering routines with wellness.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-zinc-500 mb-1">
                    <span>WEIGHT (kg)</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{bmiWeight} kg</span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={150}
                    value={bmiWeight}
                    onChange={(e) => setBmiWeight(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-zinc-500 mb-1">
                    <span>HEIGHT (cm)</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{bmiHeight} cm</span>
                  </div>
                  <input
                    type="range"
                    min={120}
                    max={220}
                    value={bmiHeight}
                    onChange={(e) => setBmiHeight(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-850 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1">Your BMI Rating</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">{bmiValue}</span>
                    <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">({bmiStatus})</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden flex">
                    <div className="bg-blue-400 h-full" style={{ width: '18.5%' }} />
                    <div className="bg-green-500 h-full" style={{ width: '6.5%' }} />
                    <div className="bg-yellow-500 h-full" style={{ width: '5%' }} />
                    <div className="bg-red-500 h-full" style={{ width: '70%' }} />
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2">
                    {bmiStatus === 'Underweight' && 'Tip: Consider increasing calorie intake with nutrient-dense foods.'}
                    {bmiStatus === 'Normal' && 'Tip: Excellent! Maintain this physical profile with daily exercises.'}
                    {bmiStatus === 'Overweight' && 'Tip: Incorporate at least 30 minutes of cardiovascular walking daily.'}
                    {bmiStatus === 'Obese' && 'Tip: Professional wellness planning is recommended to target ideal ranges.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: AGE CALCULATOR */}
        {activeTab === 'age' && (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Accurate Age Calculator</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Determine exact lifetime span in years, months, and days dynamically.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Select Your Date of Birth</label>
                <input
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-sm text-zinc-800 dark:text-zinc-200 outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-800/40 p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-850">
                {calculatedAge ? (
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                      <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 block">{calculatedAge.years}</span>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Years</span>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                      <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 block">{calculatedAge.months}</span>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Months</span>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                      <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 block">{calculatedAge.days}</span>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Days</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-zinc-400 text-xs italic">Please select a valid past date of birth.</span>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
