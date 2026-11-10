import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Dumbbell, Flame, Timer, Play, Plus, Trash2, CheckCircle2, 
  BarChart3, Calendar, Heart, Search, Filter, ShieldAlert, 
  ChevronRight, ArrowLeft, RefreshCw, Layers, Award, Sparkles,
  Activity, Info, Settings, Save, Check, Volume2, VolumeX, Moon, Sun,
  Minus, X, Edit3
} from 'lucide-react';

// --- INITIAL DATA & CATEGORIES ---
const CATEGORIES = [
  { id: 'compound', name: 'Compound Movement', icon: '🏋️‍♂️', color: 'from-blue-500 to-indigo-600', description: 'Multi-joint exercises engaging multiple large muscle groups.' },
  { id: 'upper_body', name: 'Upper Body', icon: '💪', color: 'from-cyan-500 to-blue-600', description: 'Targeting chest, back, shoulders, biceps, and triceps.' },
  { id: 'lower_body', name: 'Lower Body', icon: '🦵', color: 'from-purple-500 to-pink-600', description: 'Targeting quads, hamstrings, glutes, and calves.' },
  { id: 'isolation', name: 'Isolation', icon: '🎯', color: 'from-emerald-500 to-teal-600', description: 'Single-joint movements isolating specific muscle groups.' },
  { id: 'mobility', name: 'Mobility', icon: '🔄', color: 'from-amber-500 to-orange-600', description: 'Joint movement range and controlled motor control.' },
  { id: 'isometric', name: 'Isometric', icon: '🧱', color: 'from-stone-500 to-neutral-700', description: 'Static contraction without dynamic joint movement.' },
  { id: 'cardiovascular', name: 'Cardiovascular', icon: '🫀', color: 'from-rose-500 to-red-600', description: 'Aerobic exercises to improve heart and lung stamina.' },
  { id: 'flexibility', name: 'Flexibility', icon: '🧘', color: 'from-teal-400 to-emerald-600', description: 'Static stretching to lengthen muscles and reduce tension.' },
  { id: 'plyometric', name: 'Plyometric & Power', icon: '⚡', color: 'from-yellow-400 to-amber-600', description: 'Explosive, high-velocity movements for fast-twitch force.' },
  { id: 'home_workout', name: 'Home Workout', icon: '🏡', color: 'from-lime-500 to-emerald-600', description: 'No-equipment & bodyweight exercises perfect for home training.' }
];

const INITIAL_EXERCISES = [
  // Compound Movements
  { id: 'ex-1', name: 'Barbell Back Squat', category: 'compound', secondaryCategories: ['lower_body'], muscleGroup: 'Quads, Glutes, Core', difficulty: 'Intermediate', type: 'reps', defaultSets: 4, defaultReps: 8, defaultRest: 90, equipment: 'Barbell', description: 'Fundamental lower body strength movement.' },
  { id: 'ex-2', name: 'Conventional Deadlift', category: 'compound', secondaryCategories: ['lower_body'], muscleGroup: 'Posterior Chain, Back', difficulty: 'Advanced', type: 'reps', defaultSets: 3, defaultReps: 5, defaultRest: 120, equipment: 'Barbell', description: 'Full body pull recruiting maximum motor units.' },
  { id: 'ex-3', name: 'Barbell Bench Press', category: 'compound', secondaryCategories: ['upper_body'], muscleGroup: 'Chest, Triceps, Shoulders', difficulty: 'Intermediate', type: 'reps', defaultSets: 4, defaultReps: 8, defaultRest: 90, equipment: 'Barbell', description: 'Classic horizontal push for chest and upper body power.' },
  { id: 'ex-4', name: 'Overhead Standing Press', category: 'compound', secondaryCategories: ['upper_body'], muscleGroup: 'Shoulders, Triceps, Core', difficulty: 'Intermediate', type: 'reps', defaultSets: 3, defaultReps: 8, defaultRest: 90, equipment: 'Barbell', description: 'Vertical pushing power building robust shoulders.' },
  
  // Upper Body
  { id: 'ex-5', name: 'Pull-ups', category: 'upper_body', secondaryCategories: ['home_workout'], muscleGroup: 'Lats, Biceps', difficulty: 'Intermediate', type: 'reps', defaultSets: 3, defaultReps: 10, defaultRest: 60, equipment: 'Pull-up Bar', description: 'Bodyweight vertical pull for upper back breadth.' },
  { id: 'ex-6', name: 'Incline Dumbbell Press', category: 'upper_body', muscleGroup: 'Upper Chest, Deltoids', difficulty: 'Beginner', type: 'reps', defaultSets: 3, defaultReps: 12, defaultRest: 60, equipment: 'Dumbbells', description: 'Isolates upper pectoral fibers with natural wrist path.' },
  { id: 'ex-7', name: 'Bent-Over Barbell Row', category: 'upper_body', secondaryCategories: ['compound'], muscleGroup: 'Mid-Back, Rhomboids', difficulty: 'Intermediate', type: 'reps', defaultSets: 4, defaultReps: 10, defaultRest: 75, equipment: 'Barbell', description: 'Horizontal row strengthening back density.' },
  
  // Lower Body
  { id: 'ex-8', name: 'Bulgarian Split Squat', category: 'lower_body', secondaryCategories: ['home_workout'], muscleGroup: 'Quads, Glutes', difficulty: 'Intermediate', type: 'reps', defaultSets: 3, defaultReps: 10, defaultRest: 60, equipment: 'Dumbbells', description: 'Unilateral strength builder correcting side imbalances.' },
  { id: 'ex-9', name: 'Romanian Deadlift', category: 'lower_body', muscleGroup: 'Hamstrings, Glutes', difficulty: 'Intermediate', type: 'reps', defaultSets: 3, defaultReps: 10, defaultRest: 75, equipment: 'Dumbbells', description: 'Hinge pattern emphasizing hamstring stretch.' },
  
  // Isolation
  { id: 'ex-10', name: 'Cable Lateral Raise', category: 'isolation', secondaryCategories: ['upper_body'], muscleGroup: 'Side Deltoids', difficulty: 'Beginner', type: 'reps', defaultSets: 4, defaultReps: 15, defaultRest: 45, equipment: 'Cable Machine', description: 'Constant tension for shoulder width growth.' },
  { id: 'ex-11', name: 'Incline Dumbbell Curl', category: 'isolation', secondaryCategories: ['upper_body'], muscleGroup: 'Biceps (Long Head)', difficulty: 'Beginner', type: 'reps', defaultSets: 3, defaultReps: 12, defaultRest: 45, equipment: 'Dumbbells', description: 'Stretches bicep long head at origin point.' },
  { id: 'ex-12', name: 'Tricep Rope Pushdown', category: 'isolation', secondaryCategories: ['upper_body'], muscleGroup: 'Triceps', difficulty: 'Beginner', type: 'reps', defaultSets: 3, defaultReps: 15, defaultRest: 45, equipment: 'Cable Machine', description: 'Isolates lateral and medial tricep heads.' },
  
  // Mobility
  { id: 'ex-13', name: 'World\'s Greatest Stretch', category: 'mobility', secondaryCategories: ['home_workout', 'flexibility'], muscleGroup: 'Thoracic Spine, Hips', difficulty: 'Beginner', type: 'time', defaultSets: 2, defaultDuration: 60, defaultRest: 30, equipment: 'Bodyweight', description: 'Multi-step mobility drill opening thoracic spine and flexors.' },
  { id: 'ex-14', name: 'Thoracic Spine Openers', category: 'mobility', secondaryCategories: ['home_workout', 'flexibility'], muscleGroup: 'Upper Back', difficulty: 'Beginner', type: 'reps', defaultSets: 2, defaultReps: 10, defaultRest: 30, equipment: 'Bodyweight', description: 'Improves posture and shoulder overhead position.' },
  
  // Isometric
  { id: 'ex-15', name: 'Forearm Plank', category: 'isometric', secondaryCategories: ['home_workout'], muscleGroup: 'Core, Abdominals', difficulty: 'Beginner', type: 'time', defaultSets: 3, defaultDuration: 45, defaultRest: 45, equipment: 'Bodyweight', description: 'Static core stability building anterior pillar strength.' },
  { id: 'ex-16', name: 'Wall Sit', category: 'isometric', secondaryCategories: ['home_workout', 'lower_body'], muscleGroup: 'Quadriceps', difficulty: 'Beginner', type: 'time', defaultSets: 3, defaultDuration: 60, defaultRest: 45, equipment: 'Bodyweight / Wall', description: 'Isometric quad hold targeting muscular endurance.' },
  
  // Cardiovascular
  { id: 'ex-17', name: 'High-Intensity Treadmill Sprints', category: 'cardiovascular', muscleGroup: 'Full Body, Heart', difficulty: 'Advanced', type: 'time', defaultSets: 6, defaultDuration: 30, defaultRest: 60, equipment: 'Treadmill', description: 'Anaerobic interval spurts for maximum VO2 peak.' },
  { id: 'ex-18', name: 'Rowing Machine Intervals', category: 'cardiovascular', muscleGroup: 'Cardio, Full Body', difficulty: 'Intermediate', type: 'time', defaultSets: 5, defaultDuration: 120, defaultRest: 60, equipment: 'Rowing Machine', description: 'Low-impact full body cardiovascular conditioning.' },
  
  // Flexibility
  { id: 'ex-19', name: 'Pigeon Pose Hold', category: 'flexibility', secondaryCategories: ['home_workout', 'mobility'], muscleGroup: 'Glutes, Hip Rotators', difficulty: 'Beginner', type: 'time', defaultSets: 2, defaultDuration: 60, defaultRest: 20, equipment: 'Bodyweight', description: 'Deep hip rotator stretch reducing lower back strain.' },
  { id: 'ex-20', name: 'Seated Hamstring Stretch', category: 'flexibility', secondaryCategories: ['home_workout'], muscleGroup: 'Hamstrings', difficulty: 'Beginner', type: 'time', defaultSets: 2, defaultDuration: 45, defaultRest: 20, equipment: 'Bodyweight', description: 'Passive lengthening of posterior leg muscles.' },
  
  // Plyometric & Power
  { id: 'ex-21', name: 'Box Jumps', category: 'plyometric', secondaryCategories: ['lower_body'], muscleGroup: 'Lower Body Explosiveness', difficulty: 'Intermediate', type: 'reps', defaultSets: 4, defaultReps: 6, defaultRest: 90, equipment: 'Plyo Box', description: 'Develops leg rate of force development (RFD).' },
  { id: 'ex-22', name: 'Medicine Ball Slam', category: 'plyometric', secondaryCategories: ['upper_body'], muscleGroup: 'Lats, Core, Shoulders', difficulty: 'Beginner', type: 'reps', defaultSets: 4, defaultReps: 10, defaultRest: 60, equipment: 'Medicine Ball', description: 'Explosive upper body triple extension.' },
  
  // Home Workout
  { id: 'ex-23', name: 'Bodyweight Push-ups', category: 'home_workout', secondaryCategories: ['upper_body'], muscleGroup: 'Chest, Shoulders, Triceps', difficulty: 'Beginner', type: 'reps', defaultSets: 3, defaultReps: 15, defaultRest: 45, equipment: 'Bodyweight', description: 'Fundamental push movement requiring no equipment.' },
  { id: 'ex-24', name: 'Chair Dips', category: 'home_workout', secondaryCategories: ['upper_body', 'isolation'], muscleGroup: 'Triceps, Chest', difficulty: 'Beginner', type: 'reps', defaultSets: 3, defaultReps: 12, defaultRest: 45, equipment: 'Household Chair', description: 'Effective tricep press using any stable chair or couch edge.' },
  { id: 'ex-25', name: 'Resistance Band Pull-Aparts', category: 'home_workout', secondaryCategories: ['upper_body', 'isolation'], muscleGroup: 'Rear Delts, Upper Back', difficulty: 'Beginner', type: 'reps', defaultSets: 3, defaultReps: 20, defaultRest: 30, equipment: 'Resistance Bands', description: 'Postural correction movement strengthening rear shoulder head.' },
  
  // Plyometrics distributed by regional targets
  { id: 'ex-26', name: 'Squat Jumps', category: 'lower_body', secondaryCategories: ['plyometric', 'home_workout'], muscleGroup: 'Quads, Glutes, Calves', difficulty: 'Beginner', type: 'reps', defaultSets: 3, defaultReps: 10, defaultRest: 60, equipment: 'Bodyweight', description: 'Explosive vertical jump driving through heels with soft absorptive landing.' },
  { id: 'ex-27', name: 'Broad Jumps', category: 'lower_body', secondaryCategories: ['plyometric', 'home_workout'], muscleGroup: 'Posterior Chain, Glutes', difficulty: 'Intermediate', type: 'reps', defaultSets: 3, defaultReps: 5, defaultRest: 90, equipment: 'Bodyweight', description: 'Horizontal jump focusing on explosive hip extension for max distance.' },
  { id: 'ex-28', name: 'Tuck Jumps', category: 'plyometric', secondaryCategories: ['lower_body', 'home_workout'], muscleGroup: 'Quads, Core, Hip Flexors', difficulty: 'Intermediate', type: 'reps', defaultSets: 3, defaultReps: 8, defaultRest: 75, equipment: 'Bodyweight', description: 'High vertical leap driving knees rapidly to chest at top peak.' },
  { id: 'ex-29', name: 'Hurdle Hops', category: 'lower_body', secondaryCategories: ['plyometric'], muscleGroup: 'Calves, Achilles Tendons', difficulty: 'Intermediate', type: 'reps', defaultSets: 4, defaultReps: 6, defaultRest: 90, equipment: 'Mini Hurdles', description: 'Continuous bounding over low obstacles emphasizing low ground contact time.' },
  { id: 'ex-30', name: 'Skater Hops (Lateral Bounds)', category: 'lower_body', secondaryCategories: ['plyometric', 'home_workout'], muscleGroup: 'Glute Medius, Ankle Stabilizers', difficulty: 'Intermediate', type: 'reps', defaultSets: 3, defaultReps: 12, defaultRest: 60, equipment: 'Bodyweight', description: 'Side-to-side single leg bounding building lateral power and balance.' },
  { id: 'ex-31', name: 'Bulgarian Split Squat Jumps', category: 'lower_body', secondaryCategories: ['plyometric', 'home_workout'], muscleGroup: 'Quadriceps, Glutes (Unilateral)', difficulty: 'Intermediate', type: 'reps', defaultSets: 3, defaultReps: 8, defaultRest: 75, equipment: 'Household Chair', description: 'Single-leg vertical explosion off front leg with elevated rear foot.' },
  { id: 'ex-32', name: 'Single-Leg Bounding', category: 'lower_body', secondaryCategories: ['plyometric', 'home_workout'], muscleGroup: 'Hamstrings, Glutes, Calves', difficulty: 'Advanced', type: 'reps', defaultSets: 3, defaultReps: 6, defaultRest: 90, equipment: 'Bodyweight', description: 'High-velocity unilateral bounds maximizing air time and horizontal distance.' },
  { id: 'ex-33', name: 'Lateral Box Shuffles', category: 'lower_body', secondaryCategories: ['plyometric'], muscleGroup: 'Calves, Quick-Foot Agility', difficulty: 'Beginner', type: 'reps', defaultSets: 3, defaultReps: 20, defaultRest: 45, equipment: 'Low Step / Box', description: 'Rapid side-to-side foot swaps over a low platform.' },
  { id: 'ex-34', name: 'Plyo Push-ups (Clapping)', category: 'upper_body', secondaryCategories: ['plyometric', 'home_workout'], muscleGroup: 'Chest, Triceps, Shoulders', difficulty: 'Advanced', type: 'reps', defaultSets: 3, defaultReps: 6, defaultRest: 90, equipment: 'Bodyweight', description: 'Explosive push-up launching upper body off floor to clap.' },
  { id: 'ex-35', name: 'Medicine Ball Chest Slams', category: 'upper_body', secondaryCategories: ['plyometric'], muscleGroup: 'Lats, Abdominals, Triceps', difficulty: 'Beginner', type: 'reps', defaultSets: 4, defaultReps: 10, defaultRest: 60, equipment: 'Medicine Ball', description: 'Overhead core slam driving ball forcefully into floor.' },
  { id: 'ex-36', name: 'Medicine Ball Rotational Throws', category: 'upper_body', secondaryCategories: ['plyometric'], muscleGroup: 'Obliques, Rotators, Hips', difficulty: 'Intermediate', type: 'reps', defaultSets: 3, defaultReps: 10, defaultRest: 60, equipment: 'Medicine Ball', description: 'Explosive hip pivot throwing medicine ball laterally into wall.' },
  { id: 'ex-37', name: 'Supine Medicine Ball Chest Press', category: 'upper_body', secondaryCategories: ['plyometric'], muscleGroup: 'Chest, Triceps', difficulty: 'Intermediate', type: 'reps', defaultSets: 3, defaultReps: 8, defaultRest: 60, equipment: 'Medicine Ball', description: 'Lying flat and launching ball vertically overhead for upper body power.' },
  { id: 'ex-38', name: 'Depth Jumps', category: 'plyometric', secondaryCategories: ['lower_body'], muscleGroup: 'Total Lower Body, CNS', difficulty: 'Advanced', type: 'reps', defaultSets: 3, defaultReps: 4, defaultRest: 120, equipment: 'Plyo Box', description: 'Stepping off box and immediately exploding upward upon floor contact.' },
  { id: 'ex-39', name: 'Power Skips for Height', category: 'cardiovascular', secondaryCategories: ['plyometric', 'home_workout'], muscleGroup: 'Quads, Calves, Hip Flexors', difficulty: 'Beginner', type: 'reps', defaultSets: 3, defaultReps: 12, defaultRest: 60, equipment: 'Bodyweight', description: 'Exaggerated skipping stride pushing vertically for maximum height.' },
  { id: 'ex-40', name: 'Burpee with Tuck Jump', category: 'home_workout', secondaryCategories: ['plyometric', 'cardiovascular'], muscleGroup: 'Full Body, Cardio, Core', difficulty: 'Advanced', type: 'reps', defaultSets: 3, defaultReps: 8, defaultRest: 90, equipment: 'Bodyweight', description: 'Standard burpee transitioning immediately into high knee tuck jump.' },
  { id: 'ex-41', name: 'Single-Leg Deadlift Jump', category: 'lower_body', secondaryCategories: ['plyometric', 'home_workout'], muscleGroup: 'Hamstrings, Glutes, Balance', difficulty: 'Advanced', type: 'reps', defaultSets: 3, defaultReps: 6, defaultRest: 90, equipment: 'Bodyweight', description: 'Single-leg hinge transitioning into vertical leap driving rear knee up.' },
  { id: 'ex-42', name: 'Kneeling Squat Jump', category: 'plyometric', secondaryCategories: ['lower_body', 'home_workout'], muscleGroup: 'Hip Extensors, Glutes', difficulty: 'Advanced', type: 'reps', defaultSets: 3, defaultReps: 5, defaultRest: 90, equipment: 'Bodyweight', description: 'Starting kneeling and snapping hips into explosive jump landing on feet.' }
];

const INITIAL_PLANS = [
  {
    id: 'plan-1',
    title: 'Full Body Hypertrophy & Power',
    description: 'Balanced mix of heavy compound lifts, power development, and flexibility.',
    exercises: [
      { exerciseId: 'ex-1', sets: 4, reps: 8, duration: 0, rest: 90 },
      { exerciseId: 'ex-3', sets: 4, reps: 8, duration: 0, rest: 90 },
      { exerciseId: 'ex-21', sets: 3, reps: 6, duration: 0, rest: 60 },
      { exerciseId: 'ex-10', sets: 3, reps: 15, duration: 0, rest: 45 },
      { exerciseId: 'ex-19', sets: 2, reps: 0, duration: 60, rest: 30 }
    ]
  },
  {
    id: 'plan-2',
    title: 'Core, Endurance & Mobility',
    description: 'Focus on stamina, isometric stabilization, and dynamic mobility.',
    exercises: [
      { exerciseId: 'ex-13', sets: 3, reps: 0, duration: 60, rest: 30 },
      { exerciseId: 'ex-15', sets: 4, reps: 0, duration: 60, rest: 45 },
      { exerciseId: 'ex-18', sets: 4, reps: 0, duration: 120, rest: 60 },
      { exerciseId: 'ex-16', sets: 3, reps: 0, duration: 45, rest: 45 }
    ]
  }
];

export default function App() {
  // State
  const [exercises, setExercises] = useState(() => {
    const local = localStorage.getItem('fitcraft_exercises');
    return local ? JSON.parse(local) : INITIAL_EXERCISES;
  });

  const [plans, setPlans] = useState(() => {
    const local = localStorage.getItem('fitcraft_plans');
    return local ? JSON.parse(local) : INITIAL_PLANS;
  });

  const [workoutHistory, setWorkoutHistory] = useState(() => {
    const local = localStorage.getItem('fitcraft_history');
    return local ? JSON.parse(local) : [
      { id: 'h-1', planTitle: 'Full Body Hypertrophy & Power', date: '2026-11-07', durationMinutes: 45, completedSets: 16, totalCalories: 340 }
    ];
  });

  const [currentTab, setCurrentTab] = useState('planner'); // 'planner', 'explorer', 'active', 'history'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom Plan Builder State
  const [builderTitle, setBuilderTitle] = useState('My Custom Routine');
  const [builderDescription, setBuilderDescription] = useState('Tailored workout routine');
  const [builderItems, setBuilderItems] = useState([]); 

  // Plan Editing State (Edit Preset / Existing Plans)
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [editingPlanData, setEditingPlanData] = useState(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState(null);

  // Active Workout Execution State
  const [activePlan, setActivePlan] = useState(null);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [activeSetIndex, setActiveSetIndex] = useState(1);
  const [timerState, setTimerState] = useState('work'); 
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [completedSetsCount, setCompletedSetsCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // New Exercise Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newExData, setNewExData] = useState({
    name: '', category: 'home_workout', muscleGroup: '', difficulty: 'Beginner', type: 'reps', defaultSets: 3, defaultReps: 10, defaultDuration: 45, defaultRest: 60, equipment: 'Bodyweight', description: ''
  });

  useEffect(() => {
    localStorage.setItem('fitcraft_exercises', JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    localStorage.setItem('fitcraft_plans', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('fitcraft_history', JSON.stringify(workoutHistory));
  }, [workoutHistory]);

  // Toast message trigger helper
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const playBeep = (freq = 800, duration = 150) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + (duration / 1000));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (isTimerRunning && secondsRemaining === 0) {
      playBeep(1000, 300);
      handleTimerCompletion();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsRemaining]);

  const handleTimerCompletion = () => {
    if (!activePlan) return;
    const currentItem = activePlan.exercises[activeExerciseIndex];

    if (timerState === 'work') {
      setCompletedSetsCount(prev => prev + 1);
      if (currentItem.rest > 0) {
        setTimerState('rest');
        setSecondsRemaining(currentItem.rest);
      } else {
        advanceSetOrExercise();
      }
    } else if (timerState === 'rest') {
      advanceSetOrExercise();
    }
  };

  const advanceSetOrExercise = () => {
    const currentItem = activePlan.exercises[activeExerciseIndex];
    if (activeSetIndex < currentItem.sets) {
      setActiveSetIndex(prev => prev + 1);
      setTimerState('work');
      setSecondsRemaining(currentItem.duration || 0);
      setIsTimerRunning(currentItem.duration > 0);
    } else {
      if (activeExerciseIndex < activePlan.exercises.length - 1) {
        const nextIdx = activeExerciseIndex + 1;
        const nextItem = activePlan.exercises[nextIdx];
        setActiveExerciseIndex(nextIdx);
        setActiveSetIndex(1);
        setTimerState('work');
        setSecondsRemaining(nextItem.duration || 0);
        setIsTimerRunning(nextItem.duration > 0);
      } else {
        finishWorkout();
      }
    }
  };

  const startPlanExecution = (plan) => {
    if (!plan.exercises || plan.exercises.length === 0) return;
    setActivePlan(plan);
    setActiveExerciseIndex(0);
    setActiveSetIndex(1);
    setCompletedSetsCount(0);
    setWorkoutStartTime(Date.now());

    const firstItem = plan.exercises[0];
    setTimerState('work');
    setSecondsRemaining(firstItem.duration || 0);
    setIsTimerRunning(firstItem.duration > 0);
    setCurrentTab('active');
  };

  const finishWorkout = () => {
    setIsTimerRunning(false);
    setTimerState('completed');

    const durationMinutes = Math.max(1, Math.round((Date.now() - (workoutStartTime || Date.now())) / 60000));
    const newRecord = {
      id: 'h-' + Date.now(),
      planTitle: activePlan ? activePlan.title : 'Custom Routine',
      date: new Date().toISOString().split('T')[0],
      durationMinutes,
      completedSets: completedSetsCount,
      totalCalories: Math.round(durationMinutes * 7.5)
    };

    setWorkoutHistory([newRecord, ...workoutHistory]);
  };

  const addExerciseToBuilder = (ex) => {
    setBuilderItems(prev => [
      ...prev,
      {
        exerciseId: ex.id,
        sets: ex.defaultSets || 3,
        reps: ex.type === 'reps' ? (ex.defaultReps || 10) : 0,
        duration: ex.type === 'time' ? (ex.defaultDuration || 45) : 0,
        rest: ex.defaultRest || 60
      }
    ]);
    showToast(`Added "${ex.name}" to your routine`);
  };

  const saveBuilderPlan = () => {
    if (builderItems.length === 0) return;
    const newPlan = {
      id: 'plan-' + Date.now(),
      title: builderTitle || 'My Routine',
      description: builderDescription || 'Custom structured routine',
      exercises: builderItems
    };
    setPlans([...plans, newPlan]);
    setBuilderItems([]);
    setBuilderTitle('My Custom Routine');
    setBuilderDescription('Tailored workout routine');
    showToast('Custom routine saved successfully!');
  };

  // Preset Plan Editing Handlers
  const startEditingPlan = (plan) => {
    setEditingPlanId(plan.id);
    setEditingPlanData(JSON.parse(JSON.stringify(plan)));
  };

  const cancelEditingPlan = () => {
    setEditingPlanId(null);
    setEditingPlanData(null);
  };

  const saveEditedPlan = () => {
    if (!editingPlanData) return;
    setPlans(plans.map(p => p.id === editingPlanData.id ? editingPlanData : p));
    setEditingPlanId(null);
    setEditingPlanData(null);
    showToast('Plan updated successfully!');
  };

  const updateEditedPlanItemMetric = (itemIndex, field, delta) => {
    if (!editingPlanData) return;
    const updatedExercises = editingPlanData.exercises.map((item, idx) => {
      if (idx !== itemIndex) return item;
      const currentVal = item[field] || 0;
      const newVal = Math.max(1, currentVal + delta);
      return { ...item, [field]: newVal };
    });
    setEditingPlanData({ ...editingPlanData, exercises: updatedExercises });
  };

  const removeExerciseFromEditedPlan = (itemIndex) => {
    if (!editingPlanData) return;
    const updatedExercises = editingPlanData.exercises.filter((_, idx) => idx !== itemIndex);
    setEditingPlanData({ ...editingPlanData, exercises: updatedExercises });
  };

  // Support multi-category matching (primary category or secondary targets)
  const filteredExercises = useMemo(() => {
    return exercises.filter(ex => {
      const matchesCategory = selectedCategory === 'all' || 
                            ex.category === selectedCategory || 
                            (ex.secondaryCategories && ex.secondaryCategories.includes(selectedCategory));
      const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            ex.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [exercises, selectedCategory, searchQuery]);

  // Compute total counts per category without duplicating entries
  const categoryCounts = useMemo(() => {
    const counts = { all: exercises.length };
    CATEGORIES.forEach(cat => {
      counts[cat.id] = exercises.filter(ex => 
        ex.category === cat.id || (ex.secondaryCategories && ex.secondaryCategories.includes(cat.id))
      ).length;
    });
    return counts;
  }, [exercises]);

  const handleCreateExercise = (e) => {
    e.preventDefault();
    if (!newExData.name) return;

    // Prevent duplicate exercises within the same category
    const isDuplicate = exercises.some(
      ex => ex.name.trim().toLowerCase() === newExData.name.trim().toLowerCase() && 
            ex.category === newExData.category
    );

    if (isDuplicate) {
      alert(`The exercise "${newExData.name}" already exists in this category!`);
      return;
    }

    const created = {
      ...newExData,
      id: 'ex-custom-' + Date.now(),
      defaultSets: Number(newExData.defaultSets),
      defaultReps: Number(newExData.defaultReps),
      defaultDuration: Number(newExData.defaultDuration),
      defaultRest: Number(newExData.defaultRest)
    };

    setExercises([...exercises, created]);
    setIsAddModalOpen(false);
    setNewExData({ name: '', category: 'home_workout', muscleGroup: '', difficulty: 'Beginner', type: 'reps', defaultSets: 3, defaultReps: 10, defaultDuration: 45, defaultRest: 60, equipment: 'Bodyweight', description: '' });
    showToast(`Created custom exercise "${created.name}"`);
  };

  // Helper for touch counter adjustments
  const updateBuilderItemMetric = (index, field, delta) => {
    setBuilderItems(prev => prev.map((item, idx) => {
      if (idx !== index) return item;
      const currentVal = item[field] || 0;
      const newVal = Math.max(1, currentVal + delta);
      return { ...item, [field]: newVal };
    }));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col pb-20 md:pb-0 relative">
      
      {/* --- TOAST NOTIFICATION FLOATER --- */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-4 z-50 bg-indigo-600 text-white font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-indigo-400 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span className="text-xs sm:text-sm">{toastMessage}</span>
        </div>
      )}

      {/* --- TOP NAVIGATION BAR (DESKTOP & TABLET) --- */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('planner')}>
          <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
            <Dumbbell className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              FITCRAFT
            </h1>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">Workout Architect & Mobile Trainer</p>
          </div>
        </div>

        {/* Navigation Tabs - Visible on Desktop / Tablets (md screen and up) */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          <button
            onClick={() => setCurrentTab('planner')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              currentTab === 'planner' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Plans</span>
          </button>
          <button
            onClick={() => setCurrentTab('explorer')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              currentTab === 'explorer' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Categories</span>
          </button>
          {activePlan && (
            <button
              onClick={() => setCurrentTab('active')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 relative ${
                currentTab === 'active' 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' 
                  : 'text-emerald-400 hover:bg-emerald-950/40 border border-emerald-500/30'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Play className="w-4 h-4 fill-current" />
              <span>Live Session</span>
            </button>
          )}
          <button
            onClick={() => setCurrentTab('history')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              currentTab === 'history' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Stats</span>
          </button>
        </nav>

        {/* Sound Audio Toggle */}
        <button 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 sm:p-2.5 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700/50 transition touch-manipulation"
          title={soundEnabled ? "Mute Timer Sounds" : "Enable Timer Sounds"}
          aria-label="Toggle sound"
        >
          {soundEnabled ? <Volume2 className="w-5 h-5 text-indigo-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
        </button>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">

        {/* TAB 1: WORKOUT PLANNER & ROUTINES */}
        {currentTab === 'planner' && (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            {/* Mobile-Adaptive Hero Header */}
            <div className="bg-gradient-to-r from-indigo-900/70 via-purple-900/50 to-slate-900 border border-indigo-500/20 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center">
                <Dumbbell className="w-64 h-64 sm:w-96 sm:h-96 -mr-16 text-indigo-300" />
              </div>
              <div className="relative z-10 max-w-2xl">
                <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold px-3 py-1 rounded-full mb-2 sm:mb-3">
                  <Sparkles className="w-3.5 h-3.5" /> Mobile-Optimized Workout Builder
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Design & Execute Routines
                </h2>
                <p className="text-slate-300 mt-1.5 sm:mt-2 text-xs sm:text-base leading-relaxed">
                  Combine compound movements, plyometrics, and mobility work into custom plans optimized for smartphone and desktop workouts.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              {/* Saved Workout Routines */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                    Saved Plans
                  </h3>
                  <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full font-medium border border-slate-700">
                    {plans.length} Available
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {plans.map((plan) => {
                    const isEditing = editingPlanId === plan.id;
                    const planToRender = isEditing ? editingPlanData : plan;

                    return (
                      <div 
                        key={plan.id}
                        className={`bg-slate-800/60 border rounded-2xl p-4 sm:p-5 transition-all group shadow-md ${
                          isEditing ? 'border-indigo-500 bg-slate-800' : 'border-slate-700/60 hover:border-indigo-500/50 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
                          <div className="flex-1">
                            {isEditing ? (
                              <input 
                                type="text" 
                                value={editingPlanData.title}
                                onChange={(e) => setEditingPlanData({ ...editingPlanData, title: e.target.value })}
                                className="bg-slate-900 border border-slate-700 text-base sm:text-lg font-bold text-white rounded-lg px-2.5 py-1 w-full focus:outline-none focus:border-indigo-500 mb-1"
                              />
                            ) : (
                              <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                                {plan.title}
                              </h4>
                            )}

                            {isEditing ? (
                              <input 
                                type="text" 
                                value={editingPlanData.description}
                                onChange={(e) => setEditingPlanData({ ...editingPlanData, description: e.target.value })}
                                className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-lg px-2.5 py-1 w-full focus:outline-none focus:border-indigo-500"
                              />
                            ) : (
                              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">{plan.description}</p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={saveEditedPlan}
                                  className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-2 rounded-xl text-xs transition flex items-center justify-center gap-1 shadow-md shadow-emerald-600/30 touch-manipulation"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                  <span>Save</span>
                                </button>
                                <button
                                  onClick={cancelEditingPlan}
                                  className="flex-1 sm:flex-initial bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold px-3 py-2 rounded-xl text-xs transition flex items-center justify-center gap-1 touch-manipulation"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Cancel</span>
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEditingPlan(plan)}
                                  className="bg-slate-700/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600/60 font-semibold px-3 py-2.5 sm:py-2 rounded-xl text-xs transition flex items-center justify-center gap-1 touch-manipulation"
                                  title="Edit sets and reps"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => startPlanExecution(plan)}
                                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2.5 sm:py-2 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/30 touch-manipulation"
                                >
                                  <Play className="w-4 h-4 fill-current" />
                                  <span>Start Routine</span>
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Included Exercises Summary & Editable Mode */}
                        <div className="mt-3 pt-3 border-t border-slate-700/40">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                            Routine Exercises ({planToRender.exercises.length})
                          </span>

                          {isEditing ? (
                            <div className="space-y-2">
                              {editingPlanData.exercises.map((item, idx) => {
                                const ex = exercises.find(e => e.id === item.exerciseId);
                                if (!ex) return null;
                                return (
                                  <div key={idx} className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                    <span className="text-xs font-bold text-white truncate max-w-[180px]">{ex.name}</span>
                                    
                                    <div className="flex items-center gap-2 self-end sm:self-auto">
                                      {/* Sets Control */}
                                      <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5">
                                        <button 
                                          onClick={() => updateEditedPlanItemMetric(idx, 'sets', -1)} 
                                          className="p-1 text-slate-400 hover:text-white touch-manipulation"
                                        >
                                          <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="text-xs font-bold px-1.5 text-white min-w-[2rem] text-center">{item.sets}s</span>
                                        <button 
                                          onClick={() => updateEditedPlanItemMetric(idx, 'sets', 1)} 
                                          className="p-1 text-slate-400 hover:text-white touch-manipulation"
                                        >
                                          <Plus className="w-3 h-3" />
                                        </button>
                                      </div>

                                      {/* Reps/Duration Control */}
                                      {ex.type === 'reps' ? (
                                        <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5">
                                          <button 
                                            onClick={() => updateEditedPlanItemMetric(idx, 'reps', -1)} 
                                            className="p-1 text-slate-400 hover:text-white touch-manipulation"
                                          >
                                            <Minus className="w-3 h-3" />
                                          </button>
                                          <span className="text-xs font-bold px-1.5 text-white min-w-[2.2rem] text-center">{item.reps}r</span>
                                          <button 
                                            onClick={() => updateEditedPlanItemMetric(idx, 'reps', 1)} 
                                            className="p-1 text-slate-400 hover:text-white touch-manipulation"
                                          >
                                            <Plus className="w-3 h-3" />
                                          </button>
                                        </div>
                                      ) : (
                                        <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5">
                                          <button 
                                            onClick={() => updateEditedPlanItemMetric(idx, 'duration', -5)} 
                                            className="p-1 text-slate-400 hover:text-white touch-manipulation"
                                          >
                                            <Minus className="w-3 h-3" />
                                          </button>
                                          <span className="text-xs font-bold px-1.5 text-white min-w-[2.4rem] text-center">{item.duration}s</span>
                                          <button 
                                            onClick={() => updateEditedPlanItemMetric(idx, 'duration', 5)} 
                                            className="p-1 text-slate-400 hover:text-white touch-manipulation"
                                          >
                                            <Plus className="w-3 h-3" />
                                          </button>
                                        </div>
                                      )}

                                      <button
                                        onClick={() => removeExerciseFromEditedPlan(idx)}
                                        className="text-slate-500 hover:text-red-400 p-1 touch-manipulation"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                              {plan.exercises.map((item, idx) => {
                                const ex = exercises.find(e => e.id === item.exerciseId);
                                if (!ex) return null;
                                const cat = CATEGORIES.find(c => c.id === ex.category);
                                return (
                                  <div 
                                    key={idx}
                                    className="bg-slate-900/80 border border-slate-700 text-slate-300 text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5"
                                  >
                                    <span>{cat?.icon || '🏋️'}</span>
                                    <span className="font-medium text-slate-200">{ex.name}</span>
                                    <span className="text-indigo-400 text-[10px] font-bold">
                                      ({item.sets}x{ex.type === 'reps' ? item.reps : `${item.duration}s`})
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Touch-Friendly Custom Routine Builder */}
              <div className="lg:col-span-5 bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 sm:p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <Plus className="w-5 h-5 text-indigo-400" />
                      Routine Builder
                    </h3>
                    <button
                      onClick={() => setCurrentTab('explorer')}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 touch-manipulation"
                    >
                      + Add Exercises <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3 mb-4 sm:mb-6">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">Plan Title</label>
                      <input 
                        type="text" 
                        value={builderTitle}
                        onChange={(e) => setBuilderTitle(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                        placeholder="e.g. Explosive Lower Body Day"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">Description</label>
                      <input 
                        type="text" 
                        value={builderDescription}
                        onChange={(e) => setBuilderDescription(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                        placeholder="Summary or intensity note"
                      />
                    </div>
                  </div>

                  {/* Added Items List */}
                  <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                    {builderItems.length === 0 ? (
                      <div className="text-center py-10 sm:py-12 border border-dashed border-slate-700/70 rounded-xl">
                        <Dumbbell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                        <p className="text-slate-400 text-xs sm:text-sm font-medium">No exercises added yet.</p>
                        <p className="text-slate-500 text-[11px] mt-1">Tap categories above to append exercises.</p>
                      </div>
                    ) : (
                      builderItems.map((item, index) => {
                        const ex = exercises.find(e => e.id === item.exerciseId);
                        if (!ex) return null;
                        const isBodyweight = ex.equipment === 'Bodyweight' || ex.equipment === 'Household Chair' || ex.equipment === 'Bodyweight / Wall';
                        return (
                          <div key={index} className="bg-slate-900/90 border border-slate-700/80 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h5 className="text-xs font-bold text-white truncate">{ex.name}</h5>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[10px] text-indigo-400 capitalize">{ex.category.replace('_', ' ')}</span>
                                <span className="text-slate-600">•</span>
                                <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded ${
                                  isBodyweight ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' : 'bg-amber-950/60 text-amber-400 border border-amber-800'
                                }`}>
                                  {isBodyweight ? '🏠 No Special Gear' : `📦 ${ex.equipment}`}
                                </span>
                              </div>
                            </div>

                            {/* Set / Rep Touch Counter Controls */}
                            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                              {/* Sets Counter */}
                              <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5">
                                <button 
                                  onClick={() => updateBuilderItemMetric(index, 'sets', -1)} 
                                  className="p-1.5 text-slate-400 hover:text-white touch-manipulation"
                                  aria-label="Decrease sets"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-bold px-1.5 text-white min-w-[2.2rem] text-center">{item.sets}s</span>
                                <button 
                                  onClick={() => updateBuilderItemMetric(index, 'sets', 1)} 
                                  className="p-1.5 text-slate-400 hover:text-white touch-manipulation"
                                  aria-label="Increase sets"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Reps/Duration Counter */}
                              {ex.type === 'reps' ? (
                                <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5">
                                  <button 
                                    onClick={() => updateBuilderItemMetric(index, 'reps', -1)} 
                                    className="p-1.5 text-slate-400 hover:text-white touch-manipulation"
                                    aria-label="Decrease reps"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="text-xs font-bold px-1.5 text-white min-w-[2.4rem] text-center">{item.reps}r</span>
                                  <button 
                                    onClick={() => updateBuilderItemMetric(index, 'reps', 1)} 
                                    className="p-1.5 text-slate-400 hover:text-white touch-manipulation"
                                    aria-label="Increase reps"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5">
                                  <button 
                                    onClick={() => updateBuilderItemMetric(index, 'duration', -5)} 
                                    className="p-1.5 text-slate-400 hover:text-white touch-manipulation"
                                    aria-label="Decrease duration"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="text-xs font-bold px-1.5 text-white min-w-[2.6rem] text-center">{item.duration}s</span>
                                  <button 
                                    onClick={() => updateBuilderItemMetric(index, 'duration', 5)} 
                                    className="p-1.5 text-slate-400 hover:text-white touch-manipulation"
                                    aria-label="Increase duration"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              )}

                              <button 
                                onClick={() => setBuilderItems(builderItems.filter((_, idx) => idx !== index))}
                                className="text-slate-500 hover:text-red-400 p-1.5 touch-manipulation"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700/60 mt-4">
                  <button
                    onClick={saveBuilderPlan}
                    disabled={builderItems.length === 0}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 touch-manipulation"
                  >
                    <Save className="w-4 h-4" />
                    Save Custom Routine
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EXERCISES & CATEGORY EXPLORER */}
        {currentTab === 'explorer' && (
          <div className="space-y-5 sm:space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">Category Explorer</h2>
                <p className="text-slate-400 text-xs sm:text-sm">Browse target categories or filter specific movements</p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search exercise..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-3 py-2.5 rounded-xl text-xs sm:text-sm transition flex items-center gap-1 whitespace-nowrap shadow-md shadow-indigo-600/20 touch-manipulation"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Custom</span>
                </button>
              </div>
            </div>

            {/* Scrollable Category Chips for Mobile & Tablet with Exercise Counter Badges */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap border flex items-center gap-2 touch-manipulation ${
                  selectedCategory === 'all'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <span>🔥 All Categories</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-300'
                }`}>
                  {categoryCounts.all}
                </span>
              </button>
              {CATEGORIES.map(cat => {
                const count = categoryCounts[cat.id] || 0;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap border flex items-center gap-2 touch-manipulation ${
                      selectedCategory === cat.id
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    <span>{cat.icon} {cat.name}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Category Description Box */}
            {selectedCategory !== 'all' && (
              <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl flex items-start gap-3">
                <span className="text-2xl">{CATEGORIES.find(c => c.id === selectedCategory)?.icon}</span>
                <div>
                  <h4 className="text-sm font-bold text-white">{CATEGORIES.find(c => c.id === selectedCategory)?.name}</h4>
                  <p className="text-xs text-slate-300 mt-0.5">{CATEGORIES.find(c => c.id === selectedCategory)?.description}</p>
                </div>
              </div>
            )}

            {/* Mobile / Tablet Grid Responsive Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredExercises.map((ex) => {
                const categoryInfo = CATEGORIES.find(c => c.id === ex.category);
                const isBodyweight = ex.equipment === 'Bodyweight' || ex.equipment === 'Household Chair' || ex.equipment === 'Bodyweight / Wall';
                return (
                  <div 
                    key={ex.id}
                    className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
                        <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 flex items-center gap-1">
                          <span>{categoryInfo?.icon}</span>
                          <span>{categoryInfo?.name}</span>
                        </span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                          ex.difficulty === 'Beginner' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' :
                          ex.difficulty === 'Intermediate' ? 'bg-amber-950/60 text-amber-400 border border-amber-800' :
                          'bg-rose-950/60 text-rose-400 border border-rose-800'
                        }`}>
                          {ex.difficulty}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {ex.name}
                      </h3>
                      
                      {/* Equipment Requirement Badge */}
                      <div className="mt-1.5 mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-flex items-center gap-1 ${
                          isBodyweight 
                            ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-700/50' 
                            : 'bg-amber-950/70 text-amber-300 border border-amber-700/50'
                        }`}>
                          <span>{isBodyweight ? '🏠' : '⚠️'}</span>
                          <span>{isBodyweight ? 'Bodyweight / No Gear Needed' : `Requires: ${ex.equipment}`}</span>
                        </span>
                      </div>

                      <p className="text-xs text-indigo-300 font-medium mt-0.5">Target: {ex.muscleGroup}</p>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">{ex.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between">
                      <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-slate-500" /> {ex.defaultSets}s
                        </span>
                        <span className="flex items-center gap-1">
                          <Timer className="w-3.5 h-3.5 text-slate-500" /> {ex.type === 'reps' ? `${ex.defaultReps}r` : `${ex.defaultDuration}s`}
                        </span>
                      </div>

                      <button
                        onClick={() => addExerciseToBuilder(ex)}
                        className="bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 font-semibold px-3 py-1.5 rounded-xl text-xs transition flex items-center gap-1 touch-manipulation"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: LIVE ACTIVE WORKOUT PLAYER */}
        {currentTab === 'active' && activePlan && (
          <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6 animate-fadeIn">
            {/* Header Meta */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] sm:text-xs font-semibold text-indigo-400 tracking-wider uppercase block">Active Session</span>
                <h2 className="text-lg sm:text-2xl font-black text-white">{activePlan.title}</h2>
              </div>
              <button
                onClick={() => {
                  if (confirm("End workout session early?")) {
                    finishWorkout();
                    setCurrentTab('history');
                  }
                }}
                className="bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 px-3 py-2 rounded-xl text-xs font-semibold transition touch-manipulation"
              >
                End
              </button>
            </div>

            {timerState === 'completed' ? (
              <div className="bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/20">
                  <Award className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Workout Completed!</h3>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1">Excellent performance across all targets.</p>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-md mx-auto py-2 sm:py-4">
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl p-2.5 sm:p-3">
                    <span className="text-[10px] sm:text-xs text-slate-400 block">Sets Done</span>
                    <span className="text-lg sm:text-xl font-black text-emerald-400">{completedSetsCount}</span>
                  </div>
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl p-2.5 sm:p-3">
                    <span className="text-[10px] sm:text-xs text-slate-400 block">Time</span>
                    <span className="text-lg sm:text-xl font-black text-indigo-400">
                      {Math.max(1, Math.round((Date.now() - (workoutStartTime || Date.now())) / 60000))}m
                    </span>
                  </div>
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl p-2.5 sm:p-3">
                    <span className="text-[10px] sm:text-xs text-slate-400 block">Est. Burn</span>
                    <span className="text-lg sm:text-xl font-black text-amber-400">
                      {Math.round(Math.max(1, (Date.now() - (workoutStartTime || Date.now())) / 60000) * 7.5)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentTab('history')}
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition shadow-lg shadow-indigo-600/30 touch-manipulation"
                >
                  View Performance History
                </button>
              </div>
            ) : (
              (() => {
                const currentItem = activePlan.exercises[activeExerciseIndex];
                const currentExercise = exercises.find(e => e.id === currentItem?.exerciseId);
                const categoryObj = CATEGORIES.find(c => c.id === currentExercise?.category);

                if (!currentExercise) return null;

                return (
                  <div className="bg-slate-800 border border-slate-700 rounded-3xl p-5 sm:p-8 space-y-5 sm:space-y-6 shadow-2xl relative overflow-hidden">
                    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-500 h-full transition-all duration-300"
                        style={{ width: `${((activeExerciseIndex) / activePlan.exercises.length) * 100}%` }}
                      ></div>
                    </div>

                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-indigo-400 inline-flex items-center gap-1.5 mb-1.5">
                          <span>{categoryObj?.icon}</span>
                          <span>{categoryObj?.name}</span>
                        </span>
                        <h3 className="text-xl sm:text-3xl font-extrabold text-white">{currentExercise.name}</h3>
                        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Target: {currentExercise.muscleGroup}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] sm:text-xs text-slate-400 block">Exercise</span>
                        <span className="text-base sm:text-lg font-black text-white">{activeExerciseIndex + 1} / {activePlan.exercises.length}</span>
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-5 sm:p-6 text-center space-y-4">
                      {timerState === 'work' ? (
                        <>
                          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-semibold">
                            <Activity className="w-3.5 h-3.5 animate-pulse" /> Active Set Execution
                          </div>
                          
                          <div className="py-2">
                            <span className="text-xs sm:text-sm text-slate-400 block font-medium">Set {activeSetIndex} of {currentItem.sets}</span>
                            {currentExercise.type === 'reps' ? (
                              <div className="text-4xl sm:text-6xl font-black text-white mt-1">
                                {currentItem.reps} <span className="text-xl sm:text-2xl text-slate-400 font-normal">reps</span>
                              </div>
                            ) : (
                              <div className="text-5xl sm:text-6xl font-black text-white tracking-tight mt-1">
                                {secondsRemaining}s
                              </div>
                            )}
                          </div>

                          {currentExercise.type === 'time' && (
                            <div className="flex justify-center">
                              <button
                                onClick={() => setIsTimerRunning(!isTimerRunning)}
                                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl text-xs sm:text-sm transition shadow-md shadow-indigo-600/30 touch-manipulation"
                              >
                                {isTimerRunning ? 'Pause Timer' : 'Start Timer'}
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-xs font-semibold">
                            <Timer className="w-3.5 h-3.5" /> Rest & Recovery
                          </div>

                          <div className="py-2">
                            <span className="text-xs text-slate-400 block font-medium">Next: Set {activeSetIndex + 1} / Next Move</span>
                            <div className="text-5xl sm:text-6xl font-black text-amber-400 tracking-tight mt-1">
                              {secondsRemaining}s
                            </div>
                          </div>

                          <div className="flex justify-center gap-2 sm:gap-3">
                            <button
                              onClick={() => setSecondsRemaining(prev => prev + 15)}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-3.5 py-2 rounded-xl text-xs border border-slate-700 touch-manipulation"
                            >
                              +15s Rest
                            </button>
                            <button
                              onClick={() => {
                                setIsTimerRunning(false);
                                advanceSetOrExercise();
                              }}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-xl text-xs transition shadow-md shadow-emerald-600/30 touch-manipulation"
                            >
                              Skip Rest
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => {
                          if (activeSetIndex > 1) {
                            setActiveSetIndex(prev => prev - 1);
                          } else if (activeExerciseIndex > 0) {
                            setActiveExerciseIndex(prev => prev - 1);
                            setActiveSetIndex(1);
                          }
                        }}
                        disabled={activeExerciseIndex === 0 && activeSetIndex === 1}
                        className="text-slate-400 hover:text-white disabled:opacity-30 text-xs font-medium flex items-center gap-1 p-2 touch-manipulation"
                      >
                        <ArrowLeft className="w-4 h-4" /> Prev
                      </button>

                      <button
                        onClick={() => {
                          if (timerState === 'work') {
                            handleTimerCompletion();
                          } else {
                            advanceSetOrExercise();
                          }
                        }}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 sm:px-6 py-3 rounded-xl text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-indigo-600/30 touch-manipulation"
                      >
                        <span>{timerState === 'work' ? 'Complete Set' : 'Next Exercise'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        )}

        {/* TAB 4: STATS & HISTORY */}
        {currentTab === 'history' && (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">Performance Analytics</h2>
              <p className="text-slate-400 text-xs sm:text-sm">Track training consistency across smartphones & devices</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center gap-1.5 text-indigo-400 mb-1.5">
                  <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Total Workouts</span>
                </div>
                <span className="text-2xl sm:text-3xl font-black text-white">{workoutHistory.length}</span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center gap-1.5 text-emerald-400 mb-1.5">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Sets Logged</span>
                </div>
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {workoutHistory.reduce((acc, h) => acc + (h.completedSets || 0), 0)}
                </span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center gap-1.5 text-amber-400 mb-1.5">
                  <Timer className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Minutes Trained</span>
                </div>
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {workoutHistory.reduce((acc, h) => acc + (h.durationMinutes || 0), 0)}m
                </span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center gap-1.5 text-rose-400 mb-1.5">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Est. Burn</span>
                </div>
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {workoutHistory.reduce((acc, h) => acc + (h.totalCalories || 0), 0)} <span className="text-xs text-slate-400">kcal</span>
                </span>
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">Completed Sessions Log</h3>
              {workoutHistory.length === 0 ? (
                <p className="text-slate-400 text-xs sm:text-sm">No workout sessions logged yet.</p>
              ) : (
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <table className="w-full text-left text-xs sm:text-sm text-slate-300 min-w-[500px]">
                    <thead className="text-[10px] sm:text-xs uppercase bg-slate-900/60 text-slate-400 font-bold border-b border-slate-700">
                      <tr>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Routine Title</th>
                        <th className="px-4 py-3">Duration</th>
                        <th className="px-4 py-3">Sets</th>
                        <th className="px-4 py-3">Est. Calories</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {workoutHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-800/50 transition">
                          <td className="px-4 py-3 font-medium text-white whitespace-nowrap">{item.date}</td>
                          <td className="px-4 py-3 font-semibold text-indigo-300">{item.planTitle}</td>
                          <td className="px-4 py-3">{item.durationMinutes}m</td>
                          <td className="px-4 py-3">{item.completedSets}</td>
                          <td className="px-4 py-3 text-amber-400">{item.totalCalories} kcal</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* --- MOBILE BOTTOM NAVIGATION BAR (Smartphones & Small Tablets) --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-2 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setCurrentTab('planner')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all touch-manipulation ${
            currentTab === 'planner' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Calendar className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Plans</span>
        </button>

        <button
          onClick={() => setCurrentTab('explorer')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all touch-manipulation ${
            currentTab === 'explorer' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Layers className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Categories</span>
        </button>

        {activePlan && (
          <button
            onClick={() => setCurrentTab('active')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all touch-manipulation relative ${
              currentTab === 'active' ? 'text-emerald-400 font-bold' : 'text-emerald-400/80'
            }`}
          >
            <span className="relative flex h-2 w-2 mb-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Play className="w-5 h-5 mb-0.5 fill-current" />
            <span className="text-[10px]">Active</span>
          </button>
        )}

        <button
          onClick={() => setCurrentTab('history')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all touch-manipulation ${
            currentTab === 'history' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <BarChart3 className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Stats</span>
        </button>
      </div>

      {/* --- MODAL: MOBILE-FRIENDLY CUSTOM EXERCISE CREATOR --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-800 border-t sm:border border-slate-700 rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-400" />
                Add Custom Exercise
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg touch-manipulation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExercise} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Exercise Name</label>
                <input 
                  type="text" 
                  required
                  value={newExData.name}
                  onChange={(e) => setNewExData({...newExData, name: e.target.value})}
                  placeholder="e.g. Resistance Band Bicep Curl"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Category</label>
                  <select 
                    value={newExData.category}
                    onChange={(e) => setNewExData({...newExData, category: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Equipment Required</label>
                  <select 
                    value={newExData.equipment}
                    onChange={(e) => setNewExData({...newExData, equipment: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Bodyweight">Bodyweight / None</option>
                    <option value="Household Chair">Household Chair / Bench</option>
                    <option value="Dumbbells">Dumbbells</option>
                    <option value="Barbell">Barbell</option>
                    <option value="Resistance Bands">Resistance Bands</option>
                    <option value="Cable Machine">Cable Machine</option>
                    <option value="Pull-up Bar">Pull-up Bar</option>
                    <option value="Medicine Ball">Medicine Ball</option>
                    <option value="Plyo Box">Plyo Box</option>
                    <option value="Treadmill">Treadmill</option>
                    <option value="Rowing Machine">Rowing Machine</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Target Muscle Group</label>
                  <input 
                    type="text" 
                    required
                    value={newExData.muscleGroup}
                    onChange={(e) => setNewExData({...newExData, muscleGroup: e.target.value})}
                    placeholder="e.g. Quads, Core"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Difficulty</label>
                  <select 
                    value={newExData.difficulty}
                    onChange={(e) => setNewExData({...newExData, difficulty: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Tracking Type</label>
                  <select 
                    value={newExData.type}
                    onChange={(e) => setNewExData({...newExData, type: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="reps">Reps-based</option>
                    <option value="time">Timed duration</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Sets</label>
                  <input 
                    type="number" 
                    value={newExData.defaultSets}
                    onChange={(e) => setNewExData({...newExData, defaultSets: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs sm:text-sm text-center text-white"
                  />
                </div>
                {newExData.type === 'reps' ? (
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Reps</label>
                    <input 
                      type="number" 
                      value={newExData.defaultReps}
                      onChange={(e) => setNewExData({...newExData, defaultReps: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs sm:text-sm text-center text-white"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Secs</label>
                    <input 
                      type="number" 
                      value={newExData.defaultDuration}
                      onChange={(e) => setNewExData({...newExData, defaultDuration: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs sm:text-sm text-center text-white"
                    />
                  </div>
                )}
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Rest (s)</label>
                  <input 
                    type="number" 
                    value={newExData.defaultRest}
                    onChange={(e) => setNewExData({...newExData, defaultRest: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs sm:text-sm text-center text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Description & Cues</label>
                <textarea 
                  rows="2"
                  value={newExData.description}
                  onChange={(e) => setNewExData({...newExData, description: e.target.value})}
                  placeholder="Key form tips or instructions..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white touch-manipulation"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition shadow-md shadow-indigo-600/30 touch-manipulation"
                >
                  Save Exercise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
