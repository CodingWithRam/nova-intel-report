import { useState, useEffect } from 'react';
import { Timer, CheckCircle2, AlertCircle, RefreshCw, Award, ArrowRight, HelpCircle } from 'lucide-react';
import { Quiz } from '../types';

interface AssessmentEngineProps {
  quiz: Quiz;
  onQuizCompleted: (score: number) => void;
  onExit: () => void;
}

export default function AssessmentEngine({ quiz, onQuizCompleted, onExit }: AssessmentEngineProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimitSeconds);
  const [quizFinished, setQuizFinished] = useState(false);
  const [startTime] = useState(Date.now());

  const currentQuestion = quiz.questions[currentQuestionIndex];

  // Timer logic
  useEffect(() => {
    if (quizFinished) return;
    if (timeRemaining <= 0) {
      setQuizFinished(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, quizFinished]);

  // Handle option select
  const handleOptionSelect = (idx: number) => {
    if (isAnswerLocked) return;
    setSelectedOption(idx);
  };

  // Lock in and validate active answer
  const lockAnswer = () => {
    if (selectedOption === null || isAnswerLocked) return;
    setIsAnswerLocked(true);
    if (selectedOption === currentQuestion.correctAnswerIndex) {
      setScore((s) => s + 1);
    }
  };

  // Move to next question or conclude the quiz
  const handleNext = () => {
    if (currentQuestionIndex + 1 < quiz.questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerLocked(false);
    } else {
      setQuizFinished(true);
      onQuizCompleted(score + (selectedOption === currentQuestion.correctAnswerIndex ? 1 : 0));
    }
  };

  // Calculate elapsed duration
  const getDurationElapsed = () => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Get score assessment badge
  const getPerformanceBadge = (percent: number) => {
    if (percent === 100) return { name: 'Nova Grandmaster', color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950/20' };
    if (percent >= 70) return { name: 'Elite Scholar', color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20' };
    return { name: 'Tech Novice', color: 'text-zinc-600 bg-zinc-50' };
  };

  const percentage = Math.round((score / quiz.questions.length) * 100);
  const badge = getPerformanceBadge(percentage);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm">
      {/* Quiz Header */}
      <div className="bg-zinc-50 dark:bg-zinc-800/40 border-b border-zinc-100 dark:border-zinc-800/50 px-6 py-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 px-2 py-0.5 rounded-md">
            {quiz.category.toUpperCase()} • MOCK ASSESSMENT
          </span>
          <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">{quiz.title}</h3>
        </div>

        <div className="flex items-center space-x-1.5 text-zinc-600 dark:text-zinc-300 font-mono text-sm bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/80 px-3 py-1.5 rounded-lg shadow-sm">
          <Timer className="w-4 h-4 text-pink-500" />
          <span>
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60) < 10 ? '0' : ''}
            {timeRemaining % 60}
          </span>
        </div>
      </div>

      {/* Main Panel */}
      {!quizFinished ? (
        <div className="p-6 space-y-6">
          {/* Question Indicator */}
          <div className="flex justify-between items-center text-xs text-zinc-400 font-bold tracking-wider">
            <span>QUESTION {currentQuestionIndex + 1} OF {quiz.questions.length}</span>
            <span>{Math.round(((currentQuestionIndex) / quiz.questions.length) * 100)}% COMPLETE</span>
          </div>

          <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
            {currentQuestion.question}
          </h4>

          {/* Options list */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              let btnClass = 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300';
              if (selectedOption === idx) {
                btnClass = 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-300 ring-2 ring-indigo-500/20';
              }
              if (isAnswerLocked) {
                if (idx === currentQuestion.correctAnswerIndex) {
                  btnClass = 'border-green-500 bg-green-50/50 dark:bg-green-950/20 text-green-900 dark:text-green-300 ring-2 ring-green-500/20';
                } else if (selectedOption === idx) {
                  btnClass = 'border-red-500 bg-red-50/50 dark:bg-red-950/20 text-red-900 dark:text-red-300 ring-2 ring-red-500/20';
                } else {
                  btnClass = 'opacity-60 border-zinc-100 dark:border-zinc-800 text-zinc-400';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={isAnswerLocked}
                  className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-between cursor-pointer focus:outline-none ${btnClass}`}
                >
                  <span>{option}</span>
                  {isAnswerLocked && idx === currentQuestion.correctAnswerIndex && (
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 ml-2" />
                  )}
                  {isAnswerLocked && selectedOption === idx && idx !== currentQuestion.correctAnswerIndex && (
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
            <button
              onClick={onExit}
              className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 text-xs font-semibold cursor-pointer"
            >
              Cancel & Exit
            </button>

            {!isAnswerLocked ? (
              <button
                onClick={lockAnswer}
                disabled={selectedOption === null}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-40"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm flex items-center space-x-1 cursor-pointer"
              >
                <span>{currentQuestionIndex + 1 === quiz.questions.length ? 'Finish' : 'Next Question'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Explanation sliding card */}
          {isAnswerLocked && (
            <div className="bg-zinc-50 dark:bg-zinc-800/30 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 space-y-2 animate-fade-in text-xs">
              <div className="flex items-center space-x-1.5 font-bold text-zinc-900 dark:text-zinc-100">
                <HelpCircle className="w-4 h-4 text-indigo-500" />
                <span>Academic Explanation</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* SCORECARD */
        <div className="p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto border border-indigo-100/50">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-black text-zinc-950 dark:text-zinc-50">Mock Assessment Concluded!</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Your final answers have been registered and scored.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 p-4 rounded-xl">
              <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100 block">{score} / {quiz.questions.length}</span>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Correct</span>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 p-4 rounded-xl">
              <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100 block">{percentage}%</span>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Score</span>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 p-4 rounded-xl">
              <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100 block">{getDurationElapsed()}</span>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Duration</span>
            </div>
            <div className={`p-4 rounded-xl border border-transparent flex flex-col justify-center items-center ${badge.color}`}>
              <span className="text-xs font-black block tracking-tight">{badge.name}</span>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-1">Reward Rank</span>
            </div>
          </div>

          <div className="flex justify-center space-x-3 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
            <button
              onClick={onExit}
              className="bg-zinc-900 hover:bg-zinc-850 text-white dark:bg-zinc-800 dark:hover:bg-zinc-700 px-6 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
