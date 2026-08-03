import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Volume2, 
  VolumeX, 
  Headphones, 
  Sparkles,
  BookOpen
} from 'lucide-react';

interface StudyFocusViewProps {
  onAddStudyXP: (minutes: number) => void;
}

export const StudyFocusView: React.FC<StudyFocusViewProps> = ({ onAddStudyXP }) => {
  const [timerMode, setTimerMode] = useState<'pomodoro' | 'stopwatch'>('pomodoro');
  const [durationSecs, setDurationSecs] = useState(1500); // 25 mins
  const [remainingSecs, setRemainingSecs] = useState(1500);
  const [stopwatchSecs, setStopwatchSecs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');

  // Ambient sound synth state
  const [ambientSound, setAmbientSound] = useState<'none' | 'rain' | 'lofi' | 'binaural'>('none');
  const [isMuted, setIsMuted] = useState(false);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        if (timerMode === 'pomodoro') {
          setRemainingSecs((prev) => {
            if (prev <= 1) {
              setIsRunning(false);
              onAddStudyXP(Math.round(durationSecs / 60));
              alert('🎉 Pomodoro Session Complete! Great focus. Take a 5-minute break.');
              return durationSecs;
            }
            return prev - 1;
          });
        } else {
          setStopwatchSecs((prev) => prev + 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, timerMode, durationSecs]);

  // Handle Ambient Sound Synthesis with Web Audio API
  useEffect(() => {
    if (ambientSound === 'none' || isMuted) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      if (ambientSound === 'rain') {
        // Synthesize soft rain white noise with lowpass filter
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        whiteNoise.start();
        noiseNodeRef.current = whiteNoise;
      } else if (ambientSound === 'binaural') {
        // Deep focus binaural oscillator pair (200Hz & 210Hz alpha wave)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(200, ctx.currentTime);
        osc2.frequency.setValueAtTime(210, ctx.currentTime);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc1.start();
        osc2.start();
      } else if (ambientSound === 'lofi') {
        // Ambient chord warm synth sound
        [220, 277.18, 329.63, 415.30].forEach((freq) => {
          const osc = ctx.createOscillator();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.04, ctx.currentTime);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
        });
      }
    } catch (e) {
      console.error('Audio synthesis failed', e);
    }

    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, [ambientSound, isMuted]);

  const formatSecs = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setIsRunning(false);
    if (timerMode === 'pomodoro') {
      setRemainingSecs(durationSecs);
    } else {
      setStopwatchSecs(0);
    }
  };

  const setPresetPomodoro = (mins: number) => {
    setIsRunning(false);
    setDurationSecs(mins * 60);
    setRemainingSecs(mins * 60);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Study Focus Timer & Ambient Sounds
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">YPT & Forest inspired study logger with ambient background audio</p>
        </div>

        {/* Toggle Mode */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <button
            onClick={() => { setTimerMode('pomodoro'); setIsRunning(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              timerMode === 'pomodoro' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Pomodoro (25m)
          </button>
          <button
            onClick={() => { setTimerMode('stopwatch'); setIsRunning(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              timerMode === 'stopwatch' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Stopwatch
          </button>
        </div>
      </div>

      {/* Main Timer Display Card */}
      <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 via-purple-950/80 to-slate-900 border border-purple-800/40 text-center space-y-6 shadow-xl relative overflow-hidden text-white">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Subject:</span>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-transparent font-bold text-white focus:outline-none cursor-pointer"
          >
            <option value="Mathematics" className="bg-slate-900">Mathematics</option>
            <option value="Physics" className="bg-slate-900">Physics</option>
            <option value="Computer Science" className="bg-slate-900">Computer Science</option>
            <option value="English" className="bg-slate-900">English Essay</option>
            <option value="Islamic Studies" className="bg-slate-900">Islamic Studies</option>
          </select>
        </div>

        {/* Large Countdown Counter */}
        <div className="text-6xl sm:text-7xl font-black font-mono tracking-wider text-white">
          {timerMode === 'pomodoro' ? formatSecs(remainingSecs) : formatSecs(stopwatchSecs)}
        </div>

        {/* Preset Buttons for Pomodoro */}
        {timerMode === 'pomodoro' && (
          <div className="flex items-center justify-center gap-2">
            {[15, 25, 45, 60].map((m) => (
              <button
                key={m}
                onClick={() => setPresetPomodoro(m)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                  durationSecs === m * 60
                    ? 'bg-purple-600 border-purple-400 text-white'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                {m} mins
              </button>
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-8 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl transition-all ${
              isRunning
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'
            }`}
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isRunning ? 'Pause Session' : 'Start Focus'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Ambient Sound Synthesizer */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Headphones className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-sm">Ambient Study Sounds</h3>
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'none', label: 'Off / Silent' },
            { id: 'rain', label: '🌧️ Soft Rain' },
            { id: 'binaural', label: '🧠 Binaural Beats' },
            { id: 'lofi', label: '🎵 Warm Lo-Fi Synth' },
          ].map((sound) => (
            <button
              key={sound.id}
              onClick={() => setAmbientSound(sound.id as any)}
              className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                ambientSound === sound.id && !isMuted
                  ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              {sound.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
