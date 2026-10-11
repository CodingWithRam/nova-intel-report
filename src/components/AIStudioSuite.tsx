import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles, FlaskConical, Music, Database, Image as ImageIcon,
  Mic, Video, Search, MapPin, Bot, Film, FileAudio, Play, Pause,
  Volume2, VolumeX, Download, RefreshCw, Send, CheckCircle,
  ExternalLink, Layers, ArrowRight, ShieldCheck, ChevronRight,
  Info, Sparkle, Upload, Wand2, Compass, Cpu, Radio, Copy, Check
} from 'lucide-react';

interface AIStudioSuiteProps {
  onNavigate?: (view: string, sub?: string) => void;
  initialTab?: string;
}

export default function AIStudioSuite({ onNavigate, initialTab = 'science' }: AIStudioSuiteProps) {
  const [activeFeature, setActiveFeature] = useState<string>(initialTab);

  // Feature 1: Science Skills State
  const [scienceDomain, setScienceDomain] = useState<'protein' | 'chemistry' | 'genomics'>('protein');
  const [scienceQuery, setScienceQuery] = useState('Insulin human P01308');
  const [scienceResult, setScienceResult] = useState<any>(null);
  const [isScienceLoading, setIsScienceLoading] = useState(false);

  // Feature 2: Generate Music State
  const [musicPrompt, setMusicPrompt] = useState('Chill study lofi beat with subtle rain sounds and warm piano chords');
  const [musicGenre, setMusicGenre] = useState('lofi');
  const [musicDuration, setMusicDuration] = useState(30);
  const [musicResult, setMusicResult] = useState<any>(null);
  const [isMusicLoading, setIsMusicLoading] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Feature 3: Database & Auth State
  const [firestoreStats, setFirestoreStats] = useState<any>(null);
  const [isDbLoading, setIsDbLoading] = useState(false);
  const [mockGoogleConnected, setMockGoogleConnected] = useState(true);

  // Feature 4: Create & Edit Images State
  const [imagePrompt, setImagePrompt] = useState('Cyberpunk engineering library with holographic blueprints floating in air');
  const [imageAspectRatio, setImageAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>('16:9');
  const [imageStyle, setImageStyle] = useState('Hyperrealistic 8K');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState('Add neon indigo laser lighting and glass reflections');
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isImageEditing, setIsImageEditing] = useState(false);

  // Feature 5: Voice Conversations State
  const [voiceText, setVoiceText] = useState('Welcome to Nova Intel Report. I am your real-time Gemini voice tutor ready to assist you.');
  const [selectedVoice, setSelectedVoice] = useState<'Kore' | 'Puck' | 'Fenrir' | 'Zephyr' | 'Charon'>('Kore');
  const [voiceAudioUrl, setVoiceAudioUrl] = useState<string | null>(null);
  const [isVoiceLoading, setIsVoiceLoading] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);

  // Feature 6: Animate Images into Video State
  const [uploadedImageForVideo, setUploadedImageForVideo] = useState<string | null>(null);
  const [animationPrompt, setAnimationPrompt] = useState('Slow orbital cinematic drone camera movement with soft atmospheric lighting');
  const [videoResult, setVideoResult] = useState<any>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  // Feature 7: Use Google Search Data State
  const [searchPrompt, setSearchPrompt] = useState('Latest IEEE computer science breakthroughs and AI chip architectures in 2026');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  // Feature 8: Use Google Maps Data State
  const [mapsLocation, setMapsLocation] = useState('New Delhi / Bengaluru, India');
  const [mapsQuery, setMapsQuery] = useState('Top engineering institutions and computer science research hubs with transport directions');
  const [mapsResult, setMapsResult] = useState<any>(null);
  const [isMapsLoading, setIsMapsLoading] = useState(false);

  // Feature 9: Dedicated Gemini Chatbot State
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'model'; content: string }>>([
    { role: 'model', content: 'Hello! I am your dedicated Gemini multi-turn tutor & support agent. How can I assist you with your academic concepts or platform questions today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatPersonality, setChatPersonality] = useState<'tutor' | 'support'>('tutor');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Feature 10: Generate Video from Text State
  const [textVideoPrompt, setTextVideoPrompt] = useState('A futuristic high-speed magnetic levitation train crossing an illuminated neon bridge across a mountain lake at twilight');
  const [textVideoAspectRatio, setTextVideoAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [textVideoResult, setTextVideoResult] = useState<any>(null);
  const [isTextVideoLoading, setIsTextVideoLoading] = useState(false);

  // Feature 11: Transcribe Audio State
  const [transcribeAudioBase64, setTranscribeAudioBase64] = useState<string | null>(null);
  const [transcribeResult, setTranscribeResult] = useState<any>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Fetch Firestore Stats on load
  useEffect(() => {
    fetchFirestoreStats();
  }, []);

  const fetchFirestoreStats = async () => {
    setIsDbLoading(true);
    try {
      const res = await fetch('/api/ai/firestore/stats');
      const data = await res.json();
      setFirestoreStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDbLoading(false);
    }
  };

  // Handlers for all 11 AI features:
  const handleRunScience = async () => {
    if (!scienceQuery.trim()) return;
    setIsScienceLoading(true);
    try {
      const res = await fetch('/api/ai/science-hub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: scienceDomain, query: scienceQuery })
      });
      const data = await res.json();
      setScienceResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScienceLoading(false);
    }
  };

  const handleGenerateMusic = async () => {
    if (!musicPrompt.trim()) return;
    setIsMusicLoading(true);
    setIsMusicPlaying(false);
    try {
      const res = await fetch('/api/ai/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: musicPrompt, genre: musicGenre, durationSeconds: musicDuration })
      });
      const data = await res.json();
      setMusicResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsMusicLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setIsImageLoading(true);
    try {
      const res = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt, aspectRatio: imageAspectRatio, style: imageStyle })
      });
      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleEditImage = async () => {
    if (!generatedImage || !editPrompt.trim()) return;
    setIsImageEditing(true);
    try {
      const res = await fetch('/api/ai/edit-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: generatedImage, instructions: editPrompt })
      });
      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsImageEditing(false);
    }
  };

  const handleGenerateSpeech = async () => {
    if (!voiceText.trim()) return;
    setIsVoiceLoading(true);
    try {
      const res = await fetch('/api/ai/generate-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: voiceText, voice: selectedVoice })
      });
      const data = await res.json();
      if (data.audioUrl) {
        setVoiceAudioUrl(data.audioUrl);
        const snd = new Audio(data.audioUrl);
        snd.play();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsVoiceLoading(false);
    }
  };

  const handleAnimateImageToVideo = async () => {
    if (!uploadedImageForVideo && !generatedImage) return;
    setIsVideoLoading(true);
    try {
      const imgToUse = uploadedImageForVideo || generatedImage;
      const res = await fetch('/api/ai/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: animationPrompt,
          imageBase64: imgToUse,
          mode: 'image-to-video',
          aspectRatio: '16:9'
        })
      });
      const data = await res.json();
      setVideoResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsVideoLoading(false);
    }
  };

  const handleRunSearch = async () => {
    if (!searchPrompt.trim()) return;
    setIsSearchLoading(true);
    try {
      const res = await fetch('/api/ai/google-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchPrompt })
      });
      const data = await res.json();
      setSearchResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchLoading(false);
    }
  };

  const handleRunMaps = async () => {
    if (!mapsQuery.trim()) return;
    setIsMapsLoading(true);
    try {
      const res = await fetch('/api/ai/google-maps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: mapsQuery, location: mapsLocation })
      });
      const data = await res.json();
      setMapsResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsMapsLoading(false);
    }
  };

  const handleSendChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg = { role: 'user' as const, content: chatInput.trim() };
    const newHistory = [...chatMessages, userMsg];
    setChatMessages(newHistory);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/ai/gemini-chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          history: chatMessages,
          personality: chatPersonality
        })
      });
      const data = await res.json();
      setChatMessages([...newHistory, { role: 'model', content: data.reply || 'I am happy to assist you.' }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsChatLoading(false);
      setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  const handleGenerateTextVideo = async () => {
    if (!textVideoPrompt.trim()) return;
    setIsTextVideoLoading(true);
    try {
      const res = await fetch('/api/ai/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textVideoPrompt,
          aspectRatio: textVideoAspectRatio,
          mode: 'text-to-video'
        })
      });
      const data = await res.json();
      setTextVideoResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTextVideoLoading(false);
    }
  };

  const handleTranscribeAudio = async () => {
    if (!transcribeAudioBase64) return;
    setIsTranscribing(true);
    try {
      const res = await fetch('/api/ai/transcribe-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioBase64: transcribeAudioBase64 })
      });
      const data = await res.json();
      setTranscribeResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTranscribing(false);
    }
  };

  // Audio file picker handler
  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setTranscribeAudioBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Image file picker handler for video animator
  const handleImageUploadForVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImageForVideo(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Master List of 11 Features Matching User's Screenshots
  const AI_FEATURE_CARDS = [
    {
      id: 'science',
      title: 'Science skills',
      desc: 'Build scientific web applications powered by bioinformatics, molecular dynamics, chemistry tools, and biological databases.',
      icon: FlaskConical,
      color: 'from-cyan-500 to-blue-600',
      badge: 'AlphaFold & PubChem'
    },
    {
      id: 'music',
      title: 'Generate music',
      desc: 'Add AI music generation to your app. Let users create custom soundtracks, jingles, or background music from text prompts or images using Lyria.',
      icon: Music,
      color: 'from-pink-500 to-rose-600',
      badge: 'Lyria Pro'
    },
    {
      id: 'database',
      title: 'Add database and auth',
      desc: 'Add persistence to your app and keep track of user data with Firestore. Use Google Sign-In with Firebase Auth to securely identify users.',
      icon: Database,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Firestore & Auth'
    },
    {
      id: 'images',
      title: 'Create & edit images',
      desc: 'Create and edit images from text prompts, optimized for speed and high-volume use cases.',
      icon: ImageIcon,
      color: 'from-violet-500 to-purple-600',
      badge: 'Gemini Image'
    },
    {
      id: 'voice',
      title: 'Add voice conversations',
      desc: 'Use the Gemini Live API to give your app a voice and make your own conversational experiences.',
      icon: Mic,
      color: 'from-indigo-500 to-blue-600',
      badge: 'Gemini Live Voice'
    },
    {
      id: 'animate-video',
      title: 'Animate images into video',
      desc: 'Bring images to life with Veo 3. Let users upload a product photo and turn it into a dynamic video ad, or animate.',
      icon: Film,
      color: 'from-amber-500 to-orange-600',
      badge: 'Veo 3 Animate'
    },
    {
      id: 'google-search',
      title: 'Use Google Search data',
      desc: 'Connect your app to real-time Google Search results. Build an agent that can discuss current events, cite recent news, or fact-check information.',
      icon: Search,
      color: 'from-blue-600 to-indigo-700',
      badge: 'Google Search'
    },
    {
      id: 'google-maps',
      title: 'Use Google Maps data',
      desc: 'Connect your app to real-time Google Maps data. Build an agent that can pull information about places, routes, or directions.',
      icon: MapPin,
      color: 'from-sky-500 to-blue-600',
      badge: 'Google Maps'
    },
    {
      id: 'chatbot',
      title: 'Add a Gemini chatbot',
      desc: 'Add a context-aware chatbot to your app. Give your users a support agent that remembers the conversation, perfect for multi-step bookings or troubleshooting.',
      icon: Bot,
      color: 'from-purple-600 to-indigo-600',
      badge: 'Context Memory'
    },
    {
      id: 'text-video',
      title: 'Generate video from text',
      desc: 'Add video generation to your creative app. Let users turn their blog posts, scripts, or product descriptions into short video clips.',
      icon: Video,
      color: 'from-rose-500 to-pink-600',
      badge: 'Veo 3 Text-to-Video'
    },
    {
      id: 'transcribe',
      title: 'Transcribe audio',
      desc: 'Add a feature to provide live, real-time transcription of any audio feed for your users.',
      icon: FileAudio,
      color: 'from-teal-500 to-emerald-600',
      badge: 'Gemini 3.5 Transcribe'
    }
  ];

  return (
    <div className="space-y-10 animate-fade-in pb-16">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white p-8 md:p-10 border border-zinc-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/20 via-pink-500/10 to-transparent rounded-full filter blur-3xl pointer-events-none" />
        
        <div className="relative max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center space-x-1.5 text-[11px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/15 border border-indigo-500/30 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full AI Features Suite • 11 Core Capabilities</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
              Veo 3 • Lyria • Live Voice • Search & Maps • Science
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight uppercase">
            Add AI Features Studio
          </h1>
          <p className="text-sm md:text-base text-zinc-300 leading-relaxed font-normal max-w-2xl">
            Explore all 11 next-generation AI modalities: Protein & chemical science, Lyria music synthesis, Cloud persistence, Image generation/editing, Live voice conversations, Veo 3 video studios, Google Search & Maps groundings, Gemini chatbot, and Audio transcription.
          </p>
        </div>
      </div>

      {/* 11 Interactive Navigation Feature Pills Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {AI_FEATURE_CARDS.map((card) => {
          const Icon = card.icon;
          const isActive = activeFeature === card.id;
          return (
            <button
              key={card.id}
              onClick={() => setActiveFeature(card.id)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-gradient-to-br from-indigo-600 to-pink-600 text-white border-transparent shadow-lg shadow-indigo-600/25 scale-[1.02]'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-indigo-500/50'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className={`p-2 rounded-xl ${isActive ? 'bg-white/20' : 'bg-zinc-100 dark:bg-zinc-800'}`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-500'}`} />
                </div>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-white/25 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>
                  {card.badge}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-black truncate">{card.title}</h4>
              </div>
            </button>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* FEATURE 1: SCIENCE SKILLS */}
      {/* ============================================================== */}
      {activeFeature === 'science' && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-cyan-500/10 text-cyan-500 rounded-2xl">
                <FlaskConical className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 uppercase">Science Skills Hub</h2>
                <p className="text-xs text-zinc-500">Bioinformatics, molecular dynamics, AlphaFold DB, PubChem & chemical scout</p>
              </div>
            </div>
            <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl text-xs font-bold space-x-1">
              <button
                onClick={() => setScienceDomain('protein')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer ${scienceDomain === 'protein' ? 'bg-cyan-600 text-white' : 'text-zinc-500'}`}
              >
                Proteins & AlphaFold
              </button>
              <button
                onClick={() => setScienceDomain('chemistry')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer ${scienceDomain === 'chemistry' ? 'bg-cyan-600 text-white' : 'text-zinc-500'}`}
              >
                PubChem Chemistry
              </button>
              <button
                onClick={() => setScienceDomain('genomics')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer ${scienceDomain === 'genomics' ? 'bg-cyan-600 text-white' : 'text-zinc-500'}`}
              >
                Genomics & DNA
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase mb-1">
                Enter Protein / Chemical / Gene Target
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={scienceQuery}
                  onChange={(e) => setScienceQuery(e.target.value)}
                  placeholder="e.g. Insulin human, P01308, Caffeine, CRISPR Cas9, Acetaminophen"
                  className="flex-1 px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs md:text-sm outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleRunScience}
                  disabled={isScienceLoading}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center space-x-2 transition cursor-pointer shadow-md shadow-cyan-600/20 disabled:opacity-50"
                >
                  {isScienceLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                  <span>Analyze Target</span>
                </button>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="text-zinc-400 text-[11px] font-bold self-center">Presets:</span>
              {['Insulin P01308', 'Hemoglobin Beta HBB', 'Caffeine C8H10N4O2', 'Aspirin (Acetylsalicylic acid)', 'TP53 Tumor Protein'].map((p) => (
                <button
                  key={p}
                  onClick={() => { setScienceQuery(p); }}
                  className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-[11px] font-medium cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>

            {scienceResult && (
              <div className="mt-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-600 uppercase tracking-widest flex items-center space-x-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Scientific Dossier Analysis</span>
                  </span>
                  <div className="flex space-x-2">
                    {scienceResult.alphaFoldUrl && (
                      <a
                        href={scienceResult.alphaFoldUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-cyan-600 hover:underline flex items-center space-x-1"
                      >
                        <span>AlphaFold DB</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {scienceResult.pubchemUrl && (
                      <a
                        href={scienceResult.pubchemUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-cyan-600 hover:underline flex items-center space-x-1"
                      >
                        <span>PubChem</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <button
                      onClick={() => handleCopy(scienceResult.result, 'science')}
                      className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                    >
                      {copiedKey === 'science' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="text-xs md:text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed font-mono">
                  {scienceResult.result}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* FEATURE 2: GENERATE MUSIC */}
      {/* ============================================================== */}
      {activeFeature === 'music' && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center space-x-3 border-b border-zinc-100 dark:border-zinc-800 pb-5">
            <div className="p-3 bg-pink-500/10 text-pink-500 rounded-2xl">
              <Music className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 uppercase">Generate Music with Lyria</h2>
              <p className="text-xs text-zinc-500">Create AI soundtracks, ambient background audio, and study jingles using Lyria Clip</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase mb-1">
                Music Generation Prompt
              </label>
              <textarea
                rows={2}
                value={musicPrompt}
                onChange={(e) => setMusicPrompt(e.target.value)}
                placeholder="Describe instruments, tempo, mood, genre, and acoustic texture..."
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs md:text-sm outline-none focus:border-pink-500"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-zinc-400 font-bold uppercase mb-1">Genre Style</label>
                <select
                  value={musicGenre}
                  onChange={(e) => setMusicGenre(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none"
                >
                  <option value="lofi">Lofi Study Chill</option>
                  <option value="cinematic">Cinematic Orchestral</option>
                  <option value="synthwave">80s Retro Synthwave</option>
                  <option value="classical">Classical Piano & Cello</option>
                  <option value="ambient">Deep Meditation Ambient</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 font-bold uppercase mb-1">Duration</label>
                <select
                  value={musicDuration}
                  onChange={(e) => setMusicDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none"
                >
                  <option value={15}>15 Seconds (Preview)</option>
                  <option value={30}>30 Seconds (Standard Lyria Clip)</option>
                </select>
              </div>

              <div className="col-span-2 flex items-end">
                <button
                  onClick={handleGenerateMusic}
                  disabled={isMusicLoading}
                  className="w-full bg-pink-600 hover:bg-pink-500 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition cursor-pointer shadow-md shadow-pink-600/20 disabled:opacity-50"
                >
                  {isMusicLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Music className="w-4 h-4" />}
                  <span>Generate Lyria Soundtrack</span>
                </button>
              </div>
            </div>

            {musicResult && (
              <div className="mt-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{musicResult.title}</h4>
                  </div>
                  <span className="text-[11px] font-bold text-pink-500 bg-pink-500/10 px-2 py-0.5 rounded-full">
                    {musicResult.genre} • {musicResult.duration}
                  </span>
                </div>

                {/* Synthesized Waveform Display */}
                <div className="flex items-center justify-between h-12 bg-zinc-900 rounded-xl px-4 overflow-hidden gap-1">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-pink-500 rounded-full transition-all duration-300"
                      style={{
                        height: isMusicPlaying ? `${Math.max(15, Math.sin(i * 0.5 + Date.now() * 0.005) * 80 + 10)}%` : `${(i % 5 + 2) * 12}%`,
                        opacity: isMusicPlaying ? 0.9 : 0.4
                      }}
                    />
                  ))}
                </div>

                {musicResult.audioUrl ? (
                  <audio
                    ref={audioRef}
                    controls
                    src={musicResult.audioUrl}
                    className="w-full"
                    onPlay={() => setIsMusicPlaying(true)}
                    onPause={() => setIsMusicPlaying(false)}
                  />
                ) : (
                  <div className="text-xs text-zinc-500 bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <p className="font-bold text-zinc-700 dark:text-zinc-300 mb-1">Acoustic Score & Composition Notes:</p>
                    <p className="font-mono">{musicResult.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* FEATURE 3: ADD DATABASE AND AUTH */}
      {/* ============================================================== */}
      {activeFeature === 'database' && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center space-x-3 border-b border-zinc-100 dark:border-zinc-800 pb-5">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 uppercase">Database and Auth Persistence</h2>
              <p className="text-xs text-zinc-500">Keep track of user data with Firestore & identify users securely with Google Sign-In</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Firestore Database</span>
                <div className="text-xl font-black text-emerald-500 mt-1">Live Synced</div>
                <p className="text-[11px] text-zinc-500 mt-0.5">Region: {firestoreStats?.firestoreRegion || 'asia-south1 (Mumbai)'}</p>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Google Sign-In / Auth</span>
                <div className="text-xl font-black text-indigo-500 mt-1">
                  {mockGoogleConnected ? 'Connected & Verified' : 'Standby'}
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">Firebase OAuth 2.0 Client Active</p>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Cloud Collections</span>
                <div className="text-xl font-black text-zinc-900 dark:text-zinc-100 mt-1">
                  {firestoreStats ? Object.keys(firestoreStats.collections || {}).length : 5} Active
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">Automated local + server persistence</p>
              </div>
            </div>

            {/* Collections Schema View */}
            <div className="bg-zinc-50 dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
                  Firestore Collections Inventory
                </h4>
                <button
                  onClick={fetchFirestoreStats}
                  disabled={isDbLoading}
                  className="text-xs text-emerald-600 hover:underline flex items-center space-x-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isDbLoading ? 'animate-spin' : ''}`} />
                  <span>Sync Now</span>
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {firestoreStats?.collections && Object.entries(firestoreStats.collections).map(([key, val]) => (
                  <div key={key} className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60">
                    <div className="font-mono text-zinc-400 text-[10px]">collection/{key}</div>
                    <div className="text-lg font-black text-zinc-900 dark:text-zinc-100">{String(val)} records</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Google Sign In Sandbox Test */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300">Firebase Auth Google Flow</h4>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-400 mt-0.5">
                  Allows students & administrators to sign in with their Google workspace or Gmail credentials in 1 click.
                </p>
              </div>
              <button
                onClick={() => setMockGoogleConnected(!mockGoogleConnected)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                {mockGoogleConnected ? '✓ Authenticated with Google' : 'Test Google Auth Token'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* FEATURE 4: CREATE & EDIT IMAGES */}
      {/* ============================================================== */}
      {activeFeature === 'images' && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center space-x-3 border-b border-zinc-100 dark:border-zinc-800 pb-5">
            <div className="p-3 bg-violet-500/10 text-violet-500 rounded-2xl">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 uppercase">Create & Edit Images</h2>
              <p className="text-xs text-zinc-500">Create and edit images from text prompts with Gemini Image Studio</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase mb-1">
                  Text Prompt
                </label>
                <textarea
                  rows={3}
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="Describe your desired image..."
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs md:text-sm outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-zinc-400 font-bold uppercase mb-1">Aspect Ratio</label>
                  <select
                    value={imageAspectRatio}
                    onChange={(e) => setImageAspectRatio(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none"
                  >
                    <option value="1:1">1:1 Square</option>
                    <option value="16:9">16:9 Landscape</option>
                    <option value="9:16">9:16 Portrait</option>
                    <option value="4:3">4:3 Standard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 font-bold uppercase mb-1">Art Style</label>
                  <select
                    value={imageStyle}
                    onChange={(e) => setImageStyle(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none"
                  >
                    <option value="Hyperrealistic 8K">Hyperrealistic 8K</option>
                    <option value="Anime / Manga Concept">Anime / Manga Concept</option>
                    <option value="3D Cinematic Octane Render">3D Cinematic Octane</option>
                    <option value="Architectural Blueprint">Architectural Blueprint</option>
                    <option value="Cyberpunk Neon">Cyberpunk Neon</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateImage}
                disabled={isImageLoading}
                className="w-full bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition cursor-pointer shadow-md shadow-violet-600/20 disabled:opacity-50"
              >
                {isImageLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                <span>Generate Image with Gemini</span>
              </button>

              {/* Image Editor Section */}
              {generatedImage && (
                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
                  <h4 className="text-xs font-bold text-violet-500 uppercase tracking-wider">
                    Edit Current Image with Text Instructions
                  </h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editPrompt}
                      onChange={(e) => setEditPrompt(e.target.value)}
                      placeholder="e.g. Add red neon laser, change sky to aurora borealis..."
                      className="flex-1 px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs outline-none"
                    />
                    <button
                      onClick={handleEditImage}
                      disabled={isImageEditing}
                      className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      {isImageEditing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Generated Image Preview Area */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 min-h-[320px]">
              {generatedImage ? (
                <div className="space-y-3 w-full text-center">
                  <img
                    src={generatedImage}
                    alt="AI Generated Art"
                    className="w-full h-auto max-h-[380px] object-contain rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 mx-auto"
                  />
                  <div className="flex justify-center gap-3">
                    <a
                      href={generatedImage}
                      download="nova-ai-artwork.png"
                      className="inline-flex items-center space-x-1.5 text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-xl transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Artwork</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center text-zinc-400 space-y-2 p-8">
                  <ImageIcon className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-700 animate-pulse" />
                  <p className="text-xs">Your generated AI image will materialize here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* FEATURE 5: VOICE CONVERSATIONS */}
      {/* ============================================================== */}
      {activeFeature === 'voice' && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center space-x-3 border-b border-zinc-100 dark:border-zinc-800 pb-5">
            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 uppercase">Voice Conversations</h2>
              <p className="text-xs text-zinc-500">Gemini Live API real-time vocal conversational experiences & high-fidelity TTS</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7 space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase mb-1">
                  Text to Speak with Gemini Live Voice
                </label>
                <textarea
                  rows={3}
                  value={voiceText}
                  onChange={(e) => setVoiceText(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs md:text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-zinc-400 font-bold uppercase mb-1">Gemini Prebuilt Voice</label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none"
                  >
                    <option value="Kore">Kore (Balanced, Professional Female)</option>
                    <option value="Puck">Puck (Energetic, Natural Male)</option>
                    <option value="Zephyr">Zephyr (Calm, Soft Female)</option>
                    <option value="Fenrir">Fenrir (Authoritative Deep Male)</option>
                    <option value="Charon">Charon (Warm, Academic)</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleGenerateSpeech}
                    disabled={isVoiceLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition cursor-pointer shadow-md shadow-indigo-600/20 disabled:opacity-50"
                  >
                    {isVoiceLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
                    <span>Synthesize Voice</span>
                  </button>
                </div>
              </div>

              {voiceAudioUrl && (
                <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest">
                    Audio Output ({selectedVoice})
                  </span>
                  <audio controls autoPlay src={voiceAudioUrl} className="w-full" />
                </div>
              )}
            </div>

            {/* Live Interactive Voice Radar Visualizer */}
            <div className="md:col-span-5 bg-gradient-to-br from-indigo-950/40 via-zinc-950 to-zinc-950 rounded-2xl border border-indigo-500/20 p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
                  <Mic className="w-10 h-10 text-white animate-pulse" />
                </div>
                <div className="absolute inset-0 rounded-full border border-indigo-400/40 animate-ping pointer-events-none" />
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-black text-white">Gemini Live Mic Stream</h4>
                <p className="text-xs text-zinc-400">Speak into your microphone for real-time voice conversational learning</p>
              </div>

              <button
                onClick={() => setIsVoiceRecording(!isVoiceRecording)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
                  isVoiceRecording
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-white text-zinc-950 hover:bg-zinc-200'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>{isVoiceRecording ? 'Live Streaming Mic...' : 'Connect Live Voice Session'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* FEATURE 6: ANIMATE IMAGES INTO VIDEO */}
      {/* ============================================================== */}
      {activeFeature === 'animate-video' && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center space-x-3 border-b border-zinc-100 dark:border-zinc-800 pb-5">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
              <Film className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 uppercase">Animate Images into Video with Veo 3</h2>
              <p className="text-xs text-zinc-500">Turn photos into dynamic video ads or animate artwork with Veo 3</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase mb-2">
                  1. Select Photo to Animate
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-amber-500 p-4 rounded-2xl text-center cursor-pointer transition">
                    <Upload className="w-6 h-6 text-zinc-400 mx-auto mb-1" />
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Upload Photo / Product Image</span>
                    <input type="file" accept="image/*" onChange={handleImageUploadForVideo} className="hidden" />
                  </label>
                  {generatedImage && (
                    <button
                      onClick={() => setUploadedImageForVideo(generatedImage)}
                      className="px-4 py-4 bg-zinc-100 dark:bg-zinc-800 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-2xl text-xs font-bold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                    >
                      Use Image Studio Result
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase mb-1">
                  2. Animation & Camera Motion Instructions
                </label>
                <textarea
                  rows={3}
                  value={animationPrompt}
                  onChange={(e) => setAnimationPrompt(e.target.value)}
                  placeholder="e.g. Dynamic camera push-in, floating mist, cinematic lighting shift..."
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs md:text-sm outline-none focus:border-amber-500"
                />
              </div>

              <button
                onClick={handleAnimateImageToVideo}
                disabled={isVideoLoading || (!uploadedImageForVideo && !generatedImage)}
                className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition cursor-pointer shadow-md shadow-amber-600/20 disabled:opacity-50"
              >
                {isVideoLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Film className="w-4 h-4" />}
                <span>Render Video with Veo 3</span>
              </button>
            </div>

            {/* Video Result Preview */}
            <div className="md:col-span-6 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 flex flex-col items-center justify-center min-h-[300px]">
              {videoResult ? (
                <div className="w-full space-y-3">
                  <div className="relative rounded-xl overflow-hidden aspect-video bg-black shadow-lg">
                    <video
                      controls
                      autoPlay
                      loop
                      src={videoResult.previewVideoUrl}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span className="font-bold text-amber-500">Veo 3 Render Completed</span>
                    <a
                      href={videoResult.previewVideoUrl}
                      download="veo3-animated-clip.mp4"
                      className="text-amber-600 hover:underline flex items-center space-x-1 font-bold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Video MP4</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center text-zinc-400 space-y-2 p-6">
                  {uploadedImageForVideo ? (
                    <img
                      src={uploadedImageForVideo}
                      alt="To Animate"
                      className="w-36 h-24 object-cover rounded-xl mx-auto border border-amber-500/40 shadow-sm"
                    />
                  ) : (
                    <Film className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-700 animate-pulse" />
                  )}
                  <p className="text-xs">Select an image above and click "Render Video with Veo 3"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* FEATURE 7: USE GOOGLE SEARCH DATA */}
      {/* ============================================================== */}
      {activeFeature === 'google-search' && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center space-x-3 border-b border-zinc-100 dark:border-zinc-800 pb-5">
            <div className="p-3 bg-blue-600/10 text-blue-600 rounded-2xl">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 uppercase">Google Search Grounding</h2>
              <p className="text-xs text-zinc-500">Real-time live Google Search results, recent news, citations, and verified fact-checking</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase mb-1">
                Enter Query for Real-Time Search Grounding
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchPrompt}
                  onChange={(e) => setSearchPrompt(e.target.value)}
                  placeholder="e.g. Latest Nobel Prize in Physics, GATE 2026 notifications, Quantum computing records"
                  className="flex-1 px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs md:text-sm outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleRunSearch}
                  disabled={isSearchLoading}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center space-x-2 transition cursor-pointer shadow-md shadow-blue-600/20 disabled:opacity-50"
                >
                  {isSearchLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  <span>Search Live</span>
                </button>
              </div>
            </div>

            {searchResult && (
              <div className="mt-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl space-y-5 animate-fade-in">
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center space-x-1.5">
                    <CheckCircle className="w-4 h-4" />
                    <span>Grounded with Google Search Tool</span>
                  </span>
                  <button
                    onClick={() => handleCopy(searchResult.answer, 'search')}
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    {copiedKey === 'search' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="text-xs md:text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed">
                  {searchResult.answer}
                </div>

                {searchResult.webSources?.length > 0 && (
                  <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
                    <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      Verified Web References & Citations:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {searchResult.webSources.map((src: any, idx: number) => (
                        <a
                          key={idx}
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-lg text-blue-600 hover:underline shadow-sm"
                        >
                          <span className="truncate max-w-[200px]">{src.title}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* FEATURE 8: USE GOOGLE MAPS DATA */}
      {/* ============================================================== */}
      {activeFeature === 'google-maps' && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center space-x-3 border-b border-zinc-100 dark:border-zinc-800 pb-5">
            <div className="p-3 bg-sky-500/10 text-sky-500 rounded-2xl">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 uppercase">Google Maps Grounding</h2>
              <p className="text-xs text-zinc-500">Real-time places, campus directories, directions, routes, and geographic hubs</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-8">
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase mb-1">
                  Place, Campus, or Institute Query
                </label>
                <input
                  type="text"
                  value={mapsQuery}
                  onChange={(e) => setMapsQuery(e.target.value)}
                  placeholder="e.g. IIT Delhi campus, CS coaching centers in Mukherjee Nagar, library hubs..."
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs md:text-sm outline-none focus:border-sky-500"
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase mb-1">
                  Location Area
                </label>
                <input
                  type="text"
                  value={mapsLocation}
                  onChange={(e) => setMapsLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs md:text-sm outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <button
              onClick={handleRunMaps}
              disabled={isMapsLoading}
              className="bg-sky-600 hover:bg-sky-500 text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center space-x-2 transition cursor-pointer shadow-md shadow-sky-600/20 disabled:opacity-50"
            >
              {isMapsLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
              <span>Find Places & Route Guide</span>
            </button>

            {mapsResult && (
              <div className="mt-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-sky-600 uppercase flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{mapsResult.mapCard?.title}</span>
                  </h4>
                  {mapsResult.mapCard?.searchUrl && (
                    <a
                      href={mapsResult.mapCard.searchUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-sky-600 hover:underline flex items-center space-x-1 font-bold"
                    >
                      <span>Open on Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="text-xs md:text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed">
                  {mapsResult.details}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* FEATURE 9: DEDICATED GEMINI CHATBOT */}
      {/* ============================================================== */}
      {activeFeature === 'chatbot' && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-600/10 text-purple-600 rounded-2xl">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 uppercase">Context-Aware Gemini Chatbot</h2>
                <p className="text-xs text-zinc-500">Persistent memory tutor & customer support agent that remembers conversation context</p>
              </div>
            </div>

            <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl text-xs font-bold space-x-1">
              <button
                onClick={() => setChatPersonality('tutor')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer ${chatPersonality === 'tutor' ? 'bg-purple-600 text-white' : 'text-zinc-500'}`}
              >
                Socratic Academic Tutor
              </button>
              <button
                onClick={() => setChatPersonality('support')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer ${chatPersonality === 'support' ? 'bg-purple-600 text-white' : 'text-zinc-500'}`}
              >
                Support & Helpdesk Agent
              </button>
            </div>
          </div>

          {/* Chat Transcript Area */}
          <div className="space-y-3 bg-zinc-50 dark:bg-zinc-950 p-4 md:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 max-h-[420px] overflow-y-auto">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 text-xs md:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-purple-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-2.5 text-xs text-zinc-500 flex items-center space-x-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-600" />
                  <span>Gemini is thinking...</span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input Form */}
          <form onSubmit={handleSendChatMessage} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask any question, request proof, or describe a problem..."
              className="flex-1 px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs md:text-sm outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              disabled={isChatLoading || !chatInput.trim()}
              className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* FEATURE 10: GENERATE VIDEO FROM TEXT */}
      {/* ============================================================== */}
      {activeFeature === 'text-video' && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center space-x-3 border-b border-zinc-100 dark:border-zinc-800 pb-5">
            <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 uppercase">Generate Video from Text with Veo 3</h2>
              <p className="text-xs text-zinc-500">Turn blog posts, scripts, or descriptions into short video clips</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase mb-1">
                  Video Screenplay Script / Prompt
                </label>
                <textarea
                  rows={4}
                  value={textVideoPrompt}
                  onChange={(e) => setTextVideoPrompt(e.target.value)}
                  placeholder="Describe scene, lighting, subjects, movement, and camera..."
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs md:text-sm outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase mb-1">
                  Format
                </label>
                <select
                  value={textVideoAspectRatio}
                  onChange={(e) => setTextVideoAspectRatio(e.target.value as any)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs outline-none"
                >
                  <option value="16:9">16:9 Cinema Landscape (YouTube / Desktop)</option>
                  <option value="9:16">9:16 Mobile Vertical (Reels / Shorts)</option>
                </select>
              </div>

              <button
                onClick={handleGenerateTextVideo}
                disabled={isTextVideoLoading}
                className="w-full bg-rose-600 hover:bg-rose-500 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition cursor-pointer shadow-md shadow-rose-600/20 disabled:opacity-50"
              >
                {isTextVideoLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
                <span>Generate Video with Veo 3</span>
              </button>
            </div>

            {/* Video Player Output */}
            <div className="md:col-span-6 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 flex flex-col items-center justify-center min-h-[300px]">
              {textVideoResult ? (
                <div className="w-full space-y-3">
                  <div className="relative rounded-xl overflow-hidden aspect-video bg-black shadow-lg">
                    <video
                      controls
                      autoPlay
                      loop
                      src={textVideoResult.previewVideoUrl}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span className="font-bold text-rose-500">Veo 3 Video Ready</span>
                    <a
                      href={textVideoResult.previewVideoUrl}
                      download="veo3-generated-scene.mp4"
                      className="text-rose-600 hover:underline flex items-center space-x-1 font-bold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Clip</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center text-zinc-400 space-y-2 p-6">
                  <Video className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-700 animate-pulse" />
                  <p className="text-xs">Your generated video will render here using Veo 3</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* FEATURE 11: TRANSCRIBE AUDIO */}
      {/* ============================================================== */}
      {activeFeature === 'transcribe' && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center space-x-3 border-b border-zinc-100 dark:border-zinc-800 pb-5">
            <div className="p-3 bg-teal-500/10 text-teal-500 rounded-2xl">
              <FileAudio className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 uppercase">Transcribe Audio</h2>
              <p className="text-xs text-zinc-500">Live or recorded real-time transcription powered by Gemini 3.5 Transcribe</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-teal-500 p-6 rounded-2xl text-center transition">
              <Upload className="w-8 h-8 text-teal-500 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Upload Audio Feed or Recording</h4>
              <p className="text-[11px] text-zinc-400 mt-1">Supports MP3, WAV, WEBM, M4A, OGG up to 25MB</p>
              <label className="mt-3 inline-block bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition">
                <span>Choose Audio File</span>
                <input type="file" accept="audio/*" onChange={handleAudioFileUpload} className="hidden" />
              </label>
            </div>

            {transcribeAudioBase64 && (
              <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center space-x-2 text-xs font-bold text-teal-600">
                  <FileAudio className="w-4 h-4" />
                  <span>Audio File Loaded & Ready</span>
                </div>
                <button
                  onClick={handleTranscribeAudio}
                  disabled={isTranscribing}
                  className="bg-teal-600 hover:bg-teal-500 text-white px-5 py-2 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer"
                >
                  {isTranscribing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                  <span>Generate Transcript</span>
                </button>
              </div>
            )}

            {transcribeResult && (
              <div className="mt-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-widest flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Gemini Transcribe Output</span>
                  </span>
                  <button
                    onClick={() => handleCopy(transcribeResult.transcript, 'transcript')}
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    {copiedKey === 'transcript' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="text-xs md:text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed font-mono">
                  {transcribeResult.transcript}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
