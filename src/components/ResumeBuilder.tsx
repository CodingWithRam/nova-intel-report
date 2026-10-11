import React, { useState } from 'react';
import { Download, Plus, Trash2, Layout, Award, Briefcase, GraduationCap, Code2, Sparkles, Printer } from 'lucide-react';
import { ResumeData } from '../types';

export default function ResumeBuilder() {
  const [template, setTemplate] = useState<'minimal' | 'academic'>('minimal');
  const [resume, setResume] = useState<ResumeData>({
    fullName: 'Arjun Sharma',
    title: 'Senior Software Engineer (AI & Cloud Platforms)',
    email: 'arjun.sharma@nova.edu',
    phone: '+91 98765 43210',
    location: 'New Delhi, India',
    github: 'github.com/arjunnova',
    linkedin: 'linkedin.com/in/arjunnova',
    website: 'arjunsharma.dev',
    summary: 'Driven and detail-oriented computer science scholar with 4+ years of hands-on expertise building distributed cloud frameworks and large-scale deep learning models. Actively looking for cutting-edge opportunities to integrate generative AI agents in production-grade systems.',
    education: [
      { institution: 'Indian Institute of Technology (IIT), Delhi', degree: 'B.Tech', field: 'Computer Science & Engineering', startYear: '2022', endYear: '2026', grade: '9.4 CGPA' }
    ],
    experience: [
      { company: 'Google Summer of Code (GSoC)', position: 'Open Source Contributor', location: 'Remote', startMonthYear: 'May 2024', endMonthYear: 'Aug 2024', description: 'Developed highly optimized memory layouts for LLM fine-tuning pipelines. Reduced GPU tensor loading overhead by 22% using custom memory buffers and C++ multi-threading bindings.' }
    ],
    skills: ['Python', 'Rust', 'TypeScript', 'React', 'Node.js', 'PyTorch', 'Docker', 'Kubernetes', 'FastAPI'],
    projects: [
      { name: 'Nova Intel Engine', description: 'Designed a sub-millisecond document semantic vector-search platform with automated clustering models.', url: 'github.com/arjunnova/nova-engine', tech: 'Rust, PyTorch, React, Docker' }
    ],
    certifications: [
      'AWS Certified Solutions Architect',
      'TensorFlow Developer Professional Certificate'
    ]
  });

  const [newSkill, setNewSkill] = useState('');
  const [newCert, setNewCert] = useState('');

  // --- ACTIONS ---
  const handleInputChange = (field: keyof ResumeData, value: string) => {
    setResume({ ...resume, [field]: value });
  };

  // Education Helpers
  const addEducation = () => {
    setResume({
      ...resume,
      education: [...resume.education, { institution: '', degree: '', field: '', startYear: '', endYear: '', grade: '' }]
    });
  };
  const removeEducation = (index: number) => {
    setResume({ ...resume, education: resume.education.filter((_, i) => i !== index) });
  };
  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...resume.education];
    (updated[index] as any)[field] = value;
    setResume({ ...resume, education: updated });
  };

  // Experience Helpers
  const addExperience = () => {
    setResume({
      ...resume,
      experience: [...resume.experience, { company: '', position: '', location: '', startMonthYear: '', endMonthYear: '', description: '' }]
    });
  };
  const removeExperience = (index: number) => {
    setResume({ ...resume, experience: resume.experience.filter((_, i) => i !== index) });
  };
  const updateExperience = (index: number, field: string, value: string) => {
    const updated = [...resume.experience];
    (updated[index] as any)[field] = value;
    setResume({ ...resume, experience: updated });
  };

  // Skill Helpers
  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim() || resume.skills.includes(newSkill.trim())) return;
    setResume({ ...resume, skills: [...resume.skills, newSkill.trim()] });
    setNewSkill('');
  };
  const removeSkill = (skill: string) => {
    setResume({ ...resume, skills: resume.skills.filter((s) => s !== skill) });
  };

  // Certification Helpers
  const addCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.trim() || resume.certifications.includes(newCert.trim())) return;
    setResume({ ...resume, certifications: [...resume.certifications, newCert.trim()] });
    setNewCert('');
  };
  const removeCert = (cert: string) => {
    setResume({ ...resume, certifications: resume.certifications.filter((c) => c !== cert) });
  };

  // Trigger browser print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-zinc-50 flex items-center space-x-2">
            <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>AI Resume Builder</span>
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Construct highly polished, standard ATS-friendly engineering CVs.</p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Template select */}
          <div className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg flex items-center space-x-1">
            <button
              onClick={() => setTemplate('minimal')}
              className={`p-1.5 rounded-md transition-all text-xs flex items-center space-x-1 ${
                template === 'minimal'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Minimal</span>
            </button>
            <button
              onClick={() => setTemplate('academic')}
              className={`p-1.5 rounded-md transition-all text-xs flex items-center space-x-1 ${
                template === 'academic'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Academic</span>
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print CV</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:block">
        {/* LEFT COLUMN: THE BUILDER FORMS */}
        <div className="lg:col-span-5 space-y-6 print:hidden">
          {/* Section 1: Contact Details */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-4 md:p-5 rounded-2xl shadow-sm space-y-3">
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-indigo-500" />
              <span>Contact Details</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-zinc-500 font-bold mb-1 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={resume.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none text-zinc-800 dark:text-zinc-200 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-zinc-500 font-bold mb-1 uppercase tracking-wider">Professional Title</label>
                <input
                  type="text"
                  value={resume.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none text-zinc-800 dark:text-zinc-200 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-zinc-500 font-bold mb-1 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={resume.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none text-zinc-800 dark:text-zinc-200 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-zinc-500 font-bold mb-1 uppercase tracking-wider">Phone Number</label>
                <input
                  type="text"
                  value={resume.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none text-zinc-800 dark:text-zinc-200 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-zinc-500 font-bold mb-1 uppercase tracking-wider">Location</label>
                <input
                  type="text"
                  value={resume.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none text-zinc-800 dark:text-zinc-200 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-zinc-500 font-bold mb-1 uppercase tracking-wider">GitHub URI</label>
                <input
                  type="text"
                  value={resume.github}
                  onChange={(e) => handleInputChange('github', e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none text-zinc-800 dark:text-zinc-200 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">Professional Summary</label>
              <textarea
                value={resume.summary}
                onChange={(e) => handleInputChange('summary', e.target.value)}
                rows={3}
                className="w-full text-xs px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none text-zinc-800 dark:text-zinc-200 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Section 2: Education List */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-4 md:p-5 rounded-2xl shadow-sm space-y-3">
            <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 uppercase tracking-widest flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-indigo-500" />
                <span>Education</span>
              </h3>
              <button
                onClick={addEducation}
                className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center space-x-0.5 cursor-pointer font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
            <div className="space-y-4">
              {resume.education.map((edu, idx) => (
                <div key={idx} className="relative text-xs border border-zinc-100 dark:border-zinc-800/50 p-3 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/20 space-y-2">
                  <button
                    onClick={() => removeEducation(idx)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2">
                      <label className="block text-zinc-400 font-bold mb-0.5">Institution</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                        className="w-full px-2 py-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 font-bold mb-0.5">Degree</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                        placeholder="B.Tech, MS"
                        className="w-full px-2 py-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 font-bold mb-0.5">Field of Study</label>
                      <input
                        type="text"
                        value={edu.field}
                        onChange={(e) => updateEducation(idx, 'field', e.target.value)}
                        placeholder="Computer Science"
                        className="w-full px-2 py-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 font-bold mb-0.5">Start Year</label>
                      <input
                        type="text"
                        value={edu.startYear}
                        onChange={(e) => updateEducation(idx, 'startYear', e.target.value)}
                        className="w-full px-2 py-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 font-bold mb-0.5">End Year</label>
                      <input
                        type="text"
                        value={edu.endYear}
                        onChange={(e) => updateEducation(idx, 'endYear', e.target.value)}
                        className="w-full px-2 py-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Tech Skills Input */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-4 md:p-5 rounded-2xl shadow-sm space-y-3">
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-indigo-500" />
              <span>Technical Skills</span>
            </h3>
            <form onSubmit={addSkill} className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="e.g. Docker, PyTorch"
                className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs"
              />
              <button
                type="submit"
                className="bg-zinc-900 dark:bg-zinc-800 text-white dark:text-zinc-200 px-3 rounded-lg text-xs font-bold"
              >
                Add
              </button>
            </form>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {resume.skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 text-xs px-2 py-0.5 rounded-md flex items-center space-x-1"
                >
                  <span>{skill}</span>
                  <button onClick={() => removeSkill(skill)} className="text-zinc-400 hover:text-red-500 font-bold">×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Section 4: Certifications */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-4 md:p-5 rounded-2xl shadow-sm space-y-3">
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center space-x-2">
              <Award className="w-4 h-4 text-indigo-500" />
              <span>Certifications</span>
            </h3>
            <form onSubmit={addCert} className="flex gap-2">
              <input
                type="text"
                value={newCert}
                onChange={(e) => setNewCert(e.target.value)}
                placeholder="AWS Developer Certificate"
                className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs"
              />
              <button
                type="submit"
                className="bg-zinc-900 dark:bg-zinc-800 text-white dark:text-zinc-200 px-3 rounded-lg text-xs font-bold"
              >
                Add
              </button>
            </form>
            <div className="flex flex-col gap-2 pt-2 text-xs">
              {resume.certifications.map((cert, i) => (
                <div key={i} className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-950 p-2 rounded-lg border border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium">{cert}</span>
                  <button onClick={() => removeCert(cert)} className="text-red-500 hover:text-red-700 font-semibold text-sm">×</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE ATS-FRIENDLY RENDERED CV (PRINTABLE) */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800/80 p-6 md:p-8 rounded-2xl shadow-inner text-zinc-800 dark:text-zinc-200 print:border-0 print:p-0 print:shadow-none">
          {/* Resume Header */}
          <div className="border-b-2 border-zinc-900 dark:border-zinc-100 pb-4">
            <h1 className="text-2xl md:text-3xl font-black text-zinc-950 dark:text-zinc-50 uppercase tracking-tight">{resume.fullName}</h1>
            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-1">{resume.title}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400 mt-2 font-mono">
              <span>{resume.email}</span>
              <span>{resume.phone}</span>
              <span>{resume.location}</span>
              <span>{resume.website}</span>
              {resume.github && <span>{resume.github}</span>}
            </div>
          </div>

          {/* Summary */}
          <div className="my-5">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Professional Overview</h3>
            <p className="text-xs md:text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 font-normal">{resume.summary}</p>
          </div>

          {/* Education */}
          {resume.education.length > 0 && (
            <div className="my-5">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 border-b border-zinc-100 dark:border-zinc-800 pb-1">Education</h3>
              <div className="space-y-3">
                {resume.education.map((edu, i) => (
                  <div key={i} className="flex justify-between items-start text-xs">
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{edu.institution || 'University Name'}</h4>
                      <p className="text-zinc-600 dark:text-zinc-400">{edu.degree} in {edu.field}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">{edu.startYear} – {edu.endYear || 'Present'}</span>
                      {edu.grade && <p className="text-indigo-600 dark:text-indigo-400 font-bold">{edu.grade}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {resume.experience.length > 0 && (
            <div className="my-5">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 border-b border-zinc-100 dark:border-zinc-800 pb-1">Professional Experience</h3>
              <div className="space-y-4">
                {resume.experience.map((exp, i) => (
                  <div key={i} className="text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{exp.position || 'Software Engineer'}</h4>
                        <p className="text-indigo-600 dark:text-indigo-400 font-medium">{exp.company || 'Tech Corp'}</p>
                      </div>
                      <span className="font-mono text-zinc-500 dark:text-zinc-400">{exp.startMonthYear} – {exp.endMonthYear || 'Present'}</span>
                    </div>
                    <p className="mt-1.5 text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">{exp.description || 'Job task details...'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Grid */}
          {resume.skills.length > 0 && (
            <div className="my-5">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 border-b border-zinc-100 dark:border-zinc-800 pb-1">Skills & Expertises</h3>
              <div className="flex flex-wrap gap-1.5">
                {resume.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded font-mono text-[10px] text-zinc-700 dark:text-zinc-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {resume.certifications.length > 0 && (
            <div className="my-5">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 border-b border-zinc-100 dark:border-zinc-800 pb-1">Credentials & Certifications</h3>
              <ul className="list-disc list-inside text-xs text-zinc-600 dark:text-zinc-300 space-y-1">
                {resume.certifications.map((cert, i) => (
                  <li key={i}>{cert}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
