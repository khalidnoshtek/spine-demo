/* Spine Command Center — sample data. Believable, internally consistent. */

window.SPINE_DATA = {
  patient: {
    name: 'Aarav Mehta',
    age: 34,
    occupation: 'Software Engineer',
    city: 'Mumbai',
    height: 178, // cm
    weight: 74.2, // kg
    bmi: 23.4,
    avatar: 'AM',
    clinic: 'Laser Spine · Dr. Ayush Sharma',
    plan: 'Spine+ Member',
    level: 14,
  },

  // Master Spine Intelligence Score
  spineScore: {
    value: 89,
    status: 'Excellent',
    deltaMonth: 12,        // +12% this month
    deltaWeek: 3,
    updated: 'Synced 7 min ago',
  },

  // 12-week trend (weekly) of the master score
  trend: [71, 73, 72, 75, 78, 77, 80, 82, 84, 83, 86, 89],

  // Executive dashboard sub-scores. trend = last 7 readings (sparkline).
  scores: [
    { key: 'sleep',    label: 'Sleep',        value: 82, unit: '',   status: 'Good',     delta: 4,  note: '7h 12m avg · 88% efficiency', trend: [74,78,76,80,79,81,82] },
    { key: 'activity', label: 'Activity',     value: 74, unit: '',   status: 'Improving',delta: 9,  note: '8,432 steps · 42 active min',  trend: [60,63,65,68,70,72,74] },
    { key: 'mobility', label: 'Mobility',     value: 91, unit: '',   status: 'Excellent',delta: 2,  note: 'Flexion 94° · no stiffness',   trend: [88,89,88,90,90,91,91] },
    { key: 'lifestyle',label: 'Lifestyle',    value: 78, unit: '',   status: 'Good',     delta: 5,  note: 'Posture + ergonomics on track',trend: [70,71,73,74,76,77,78] },
    { key: 'pain',     label: 'Pain Control', value: 88, unit: '',   status: 'Low pain', delta: 6,  note: 'Pain index 2 / 10 · 21d streak',trend: [78,80,82,83,85,86,88] },
    { key: 'bmi',      label: 'Body Comp',    value: 84, unit: '',   status: 'Healthy',  delta: 1,  note: 'BMI 23.4 · stable',            trend: [82,83,83,84,83,84,84] },
  ],

  // AI Risk Engine
  risks: [
    { key: 'sedentary',  label: 'Sedentary behaviour', level: 'Moderate', pct: 58, tone: 'warn',
      stat: '9.2 h sitting / day', detail: 'Sitting time up 28% this week. Long uninterrupted desk blocks raise lumbar load.',
      action: 'Stand & move 3 min every 45 min' },
    { key: 'sleepdebt',  label: 'Sleep debt', level: 'Low', pct: 24, tone: 'good',
      stat: '7h 12m avg', detail: 'Sleep is consistent. One late night this week added minor debt.',
      action: 'Keep a 11:30pm wind-down' },
    { key: 'weight',     label: 'Weight gain', level: 'Low', pct: 18, tone: 'good',
      stat: 'BMI 23.4 · stable', detail: 'Body composition steady over 90 days. No added spinal load.',
      action: 'Maintain current routine' },
    { key: 'chronic',    label: 'Chronic pain risk', level: 'Low', pct: 21, tone: 'good',
      stat: 'Pain index 2 / 10', detail: '21-day streak below pain threshold. Flare probability is low.',
      action: 'Continue daily mobility set' },
    { key: 'degen',      label: 'Degeneration risk', level: 'Low', pct: 27, tone: 'good',
      stat: 'L4–L5 monitored', detail: 'Imaging baseline stable. Activity + posture trends are protective.',
      action: 'Next scan review in 5 months' },
    { key: 'mobloss',    label: 'Mobility decline', level: 'Very low', pct: 12, tone: 'good',
      stat: 'Flexion 94°', detail: 'Range of motion improving month over month.',
      action: 'Add 1 rotation session / week' },
  ],

  // Wearable Intelligence layer
  devices: [
    { key: 'apple',   name: 'Apple Watch',   model: 'Series 9',     status: 'connected', sync: 'now',      battery: 78, color: '#E8EAED' },
    { key: 'fitbit',  name: 'Fitbit',        model: 'Charge 6',     status: 'connected', sync: '12 min',   battery: 64, color: '#00B0B9' },
    { key: 'health',  name: 'Apple Health',  model: 'iOS',          status: 'connected', sync: '3 min',    battery: null, color: '#FF5A5F' },
    { key: 'garmin',  name: 'Garmin',        model: 'Venu 3',       status: 'available', sync: null,       battery: null, color: '#1A6DFF' },
    { key: 'samsung', name: 'Samsung Watch', model: 'Galaxy 6',     status: 'available', sync: null,       battery: null, color: '#7CB7FF' },
    { key: 'xiaomi',  name: 'Xiaomi',        model: 'Smart Band 8', status: 'available', sync: null,       battery: null, color: '#FF6900' },
    { key: 'amazfit', name: 'Amazfit',       model: 'GTR 4',        status: 'available', sync: null,       battery: null, color: '#FF3B30' },
    { key: 'manual',  name: 'Manual entry',  model: 'Log it',       status: 'available', sync: null,       battery: null, color: '#94A3B8' },
  ],

  // Live metrics aggregated from connected wearables
  liveMetrics: [
    { key: 'steps',  label: 'Steps',      value: 8432,  goal: 10000, unit: '',     icon: 'steps' },
    { key: 'hr',     label: 'Heart rate', value: 68,    goal: null,  unit: 'bpm',  icon: 'heart' },
    { key: 'active', label: 'Active',     value: 42,    goal: 60,    unit: 'min',  icon: 'flame' },
    { key: 'sleep',  label: 'Sleep',      value: 7.2,   goal: 8,     unit: 'h',    icon: 'moon' },
    { key: 'stand',  label: 'Stand hrs',  value: 9,     goal: 12,    unit: '',     icon: 'stand' },
    { key: 'spo2',   label: 'SpO₂',       value: 98,    goal: null,  unit: '%',    icon: 'lungs' },
  ],

  // Spine Wealth Economy
  wallet: {
    coins: 2480,
    xp: 12750,
    xpLevel: 14,
    xpInLevel: 750,
    xpToNext: 1200,
    recovery: 340,
    rank: '#42',
  },

  challenges: [
    { key: 'steps',   title: 'Walk 100,000 steps',        sub: 'Monthly · ends in 9 days', cur: 68200, goal: 100000, unit: 'steps', reward: 250, icon: 'steps' },
    { key: 'sleep',   title: 'Sleep 7+ hrs for 14 days',  sub: 'Streak challenge',          cur: 9,     goal: 14,     unit: 'days',  reward: 180, icon: 'moon' },
    { key: 'pain',    title: 'Keep pain below 3',         sub: '21-day streak active',      cur: 21,    goal: 30,     unit: 'days',  reward: 300, icon: 'shield' },
    { key: 'mobility',title: 'Complete mobility set',     sub: 'This week',                 cur: 3,     goal: 5,      unit: 'sessions',reward: 120, icon: 'spine' },
  ],

  leaderboards: {
    city: [
      { rank: 40, name: 'Rohan K.',   score: 91, you: false },
      { rank: 41, name: 'Sara P.',    score: 90, you: false },
      { rank: 42, name: 'You',        score: 89, you: true },
      { rank: 43, name: 'Vikram S.',  score: 88, you: false },
      { rank: 44, name: 'Neha G.',    score: 87, you: false },
    ],
    top: [
      { rank: 1, name: 'Ishaan M.', score: 98, you: false },
      { rank: 2, name: 'Priya N.',  score: 97, you: false },
      { rank: 3, name: 'Dev R.',    score: 96, you: false },
    ],
  },

  ranks: [
    { key: 'city', label: 'Mumbai',      value: '#42',  of: '4,210', delta: 6 },
    { key: 'age',  label: 'Age 30–39',   value: '#12',  of: '980',   delta: 3 },
    { key: 'rec',  label: 'Recovery',    value: '#7',   of: '512',   delta: 4 },
  ],

  rewards: [
    { key: 'consult', title: 'Free consultation',     sub: 'with Dr. Ayush Sharma', cost: 500,  icon: 'stethoscope', tag: 'Popular' },
    { key: 'vip',     title: 'VIP membership upgrade', sub: '1 month Spine+ Elite',  cost: 2000, icon: 'crown', tag: null },
    { key: 'report',  title: 'Spine health report',    sub: 'Full AI deep-dive PDF',  cost: 300,  icon: 'report', tag: null },
    { key: 'physio',  title: '20% physiotherapy off',  sub: 'Any partner clinic',     cost: 250,  icon: 'tag', tag: null },
    { key: 'merch',   title: 'Spine merch pack',       sub: 'Posture tee + bottle',   cost: 150,  icon: 'gift', tag: null },
    { key: 'badge',   title: 'Recognition badge',      sub: 'Community profile flair',cost: 100,  icon: 'medal', tag: null },
  ],

  // AI Coach scripted conversation
  coach: {
    name: 'Spine AI',
    greeting: "Morning, Aarav. Your Spine Score is 89 — up 12% this month. Strong work. I spotted one thing worth a look today.",
    insights: [
      { id: 1, text: 'Your sitting time increased 28% this week — mostly long afternoon desk blocks.', tone: 'warn' },
      { id: 2, text: 'Walk 2,000 more steps today to keep your Activity score climbing.', tone: 'accent' },
    ],
    chips: ['Why did my score change?', 'Build me a plan', 'How is my sleep?', 'Show today\'s risks'],
    replies: {
      'Why did my score change?': "Three drivers this month: mobility held at 91, pain control rose to 88 (21-day low-pain streak), and sleep improved to 82. The only drag is activity — sedentary time is up.",
      'Build me a plan': "Here's today's micro-plan:\n1 · Stand + walk 3 min every 45 min\n2 · 6-move mobility set (4 min)\n3 · Hit 10,000 steps — you're 1,568 away\nDo all three and you'll earn 90 Spine Coins.",
      'How is my sleep?': "Sleep is your second-strongest pillar — 7h 12m average at 88% efficiency. Keep the 11:30pm wind-down and you'll cross into the 'Excellent' band within a week.",
      'Show today\'s risks': "Only one flag today: sedentary behaviour at Moderate (9.2h sitting). Everything else — sleep debt, weight, chronic pain, degeneration, mobility — is Low or Very low.",
    },
  },
};
