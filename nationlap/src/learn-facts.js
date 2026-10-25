// Topic zones: a "study stretch" (3-4 billboards on one coherent micro-topic) followed by
// a quiz checkpoint that draws its question from that SAME topic's real question pool —
// study then get tested, not random disconnected trivia. `pool` must match an id the live
// quiz proxy actually serves (checked live at http://127.0.0.1:8787/pools).
//
// Polity is built out deep as the pilot: 5 zones mapped directly onto real curated pools
// (509-637 questions each) spanning UPSC Prelims scope down to NCERT Class-11 school level —
// the facts below are paraphrased straight from real questions in those pools, so what you
// read on the billboard is genuinely what the quiz can ask about. Other subjects stay at the
// original single-zone depth until they get the same treatment.
export const TOPIC_ZONES = [
  {
    id: 'polity-fr', subject: 'Polity', topic: 'Fundamental Rights', pool: 'polity-fr',
    facts: [
      { title: 'Art. 14', blurb: 'Equality before the law and equal protection of the laws.' },
      { title: 'Art. 19', blurb: 'The six freedoms — speech, assembly, association, movement, residence, profession.' },
      { title: 'Art. 21', blurb: 'Right to Life & Personal Liberty — the broadest, most litigated Fundamental Right.' },
      { title: 'Art. 32', blurb: 'Right to Constitutional Remedies — Ambedkar called it the “heart and soul” of the Constitution.' },
    ],
  },
  {
    id: 'polity-dpsp', subject: 'Polity', topic: 'Directive Principles', pool: 'polity-dpsp',
    facts: [
      { title: 'Art. 36–51', blurb: 'DPSPs — non-justiciable duties that guide the State in making laws.' },
      { title: 'Art. 44', blurb: 'Directs the State toward a Uniform Civil Code for all citizens.' },
      { title: 'Art. 45', blurb: 'Originally: free & compulsory education for children (now a Fundamental Right via Art. 21A).' },
      { title: 'Art. 51', blurb: 'Directs the State to promote international peace and security.' },
    ],
  },
  {
    id: 'polity-parliament', subject: 'Polity', topic: 'Parliament & Law-Making', pool: 'polity-parliament',
    facts: [
      { title: 'Lok Sabha', blurb: '545 seats, 5-year term — the directly elected House of the People.' },
      { title: 'Rajya Sabha', blurb: 'A permanent body — one-third of members retire every two years.' },
      { title: 'Money Bill', blurb: 'Under Art. 110, only the Lok Sabha decides — the Rajya Sabha can’t amend it.' },
      { title: 'Zero Hour', blurb: 'An Indian parliamentary innovation — not in any formal rulebook.' },
    ],
  },
  {
    id: 'polity-judiciary', subject: 'Polity', topic: 'Judiciary & Judicial Review', pool: 'polity-judiciary',
    facts: [
      { title: 'Art. 13', blurb: 'Any law violating Fundamental Rights is void.' },
      { title: 'Judicial Review', blurb: 'The power of courts to strike down unconstitutional laws.' },
      { title: 'Collegium', blurb: 'The system by which senior judges recommend judicial appointments.' },
      { title: 'PIL', blurb: 'Public Interest Litigation — a 1980s innovation widening access to justice.' },
    ],
  },
  {
    id: 'polity-centre-state', subject: 'Polity', topic: 'Centre-State Relations', pool: 'polity',
    facts: [
      { title: '7th Schedule', blurb: 'Divides law-making power into Union, State and Concurrent lists.' },
      { title: 'Art. 356', blurb: 'President’s Rule — Union takes over a state’s administration.' },
      { title: 'Art. 200', blurb: 'Gives the Governor options on a state bill: assent, withhold, or reserve for the President.' },
      { title: 'Finance Commission', blurb: 'Art. 280 — decides how tax revenue is shared between Centre and states.' },
    ],
  },
  {
    id: 'polity-bodies', subject: 'Polity', topic: 'Constitutional Bodies', pool: 'polity',
    facts: [
      { title: 'Election Commission', blurb: 'Art. 324 — superintends, directs and controls all elections.' },
      { title: 'UPSC', blurb: 'Art. 315–323 — conducts recruitment for All-India & Central Services.' },
      { title: 'CAG', blurb: 'Art. 148 — guardian of the public purse, audits government spending.' },
      { title: 'Finance Commission', blurb: 'Constituted every 5 years to recommend Centre-state revenue sharing.' },
    ],
  },
  {
    id: 'polity-amendment', subject: 'Polity', topic: 'Amendment & Basic Structure', pool: 'polity',
    facts: [
      { title: 'Art. 368', blurb: 'Lays down the procedure for amending the Constitution.' },
      { title: 'Kesavananda Bharati', blurb: '1973 — the case that created the Basic Structure doctrine.' },
      { title: '42nd Amendment', blurb: '1976, the “mini-Constitution” — added “Socialist” & “Secular” to the Preamble.' },
      { title: '44th Amendment', blurb: '1978 — reversed several of the 42nd Amendment’s overreaches.' },
    ],
  },
  {
    id: 'polity-emergency', subject: 'Polity', topic: 'Emergency Provisions', pool: 'polity',
    facts: [
      { title: 'Art. 352', blurb: 'National Emergency — invoked on grounds of war, external aggression or armed rebellion.' },
      { title: 'Art. 356', blurb: 'State Emergency (President’s Rule) — imposed on failure of constitutional machinery.' },
      { title: 'Art. 360', blurb: 'Financial Emergency — laid down in the Constitution but never once invoked.' },
      { title: '44th Amendment', blurb: 'Added safeguards against misuse of emergency powers after 1975.' },
    ],
  },
  {
    id: 'polity-basics', subject: 'Polity', topic: 'Polity Foundations', pool: 'polity-ncert-c11',
    facts: [
      { title: 'Reservations', blurb: 'A constitutional tool addressing historical injustice by reserving seats for SCs & STs.' },
      { title: 'Parliament’s Role', blurb: 'Provides the direct link between citizens and their government.' },
      { title: 'Legislative Control', blurb: 'The legislature checks the executive to keep it accountable and within the law.' },
      { title: 'Art. 169', blurb: 'Provides for creating (or abolishing) a Legislative Council in a state.' },
    ],
  },
  // --- History: deepened the same way as Polity (see research grounding in session notes) ---
  // only one 'history' pool exists in the live backend so far (692 Qs, no sub-topic split yet) —
  // all zones share it for now, same fallback pattern used for Polity's non-dedicated zones.
  {
    id: 'history-indus', subject: 'History', topic: 'Indus Valley Civilisation', pool: 'history',
    facts: [
      { title: 'Mature Phase', blurb: 'c. 2600–1900 BCE — the height of Harappan urban civilisation.' },
      { title: 'Planned Cities', blurb: 'Grid-pattern streets and covered drainage — remarkably advanced for the era.' },
      { title: 'The Great Bath', blurb: 'At Mohenjo-daro — the earliest known public water tank.' },
      { title: 'Undeciphered Script', blurb: 'The Indus script has never been conclusively read.' },
    ],
  },
  {
    id: 'history-maurya', subject: 'History', topic: 'Mauryan Empire', pool: 'history',
    facts: [
      { title: 'Chandragupta Maurya', blurb: 'Founded the empire, guided by Chanakya’s Arthashastra.' },
      { title: 'Kalinga War', blurb: '261 BCE — its brutality turned Ashoka toward Dhamma.' },
      { title: 'Edicts', blurb: 'Ashoka’s Rock & Pillar Edicts spread his policies empire-wide.' },
      { title: 'Megasthenes', blurb: 'Greek envoy whose account *Indica* records the Mauryan court.' },
    ],
  },
  {
    id: 'history-sultanate-rulers', subject: 'History', topic: 'Delhi Sultanate — Rulers', pool: 'history',
    facts: [
      { title: 'Slave Dynasty', blurb: '1206–90 — founded by Qutb-ud-din Aibak.' },
      { title: 'Khalji Dynasty', blurb: '1290–1320 — peaked under Alauddin Khalji.' },
      { title: 'Tughlaq Dynasty', blurb: '1320–1414 — Muhammad-bin-Tughlaq’s famous capital shift to Daulatabad.' },
      { title: 'Lodi Dynasty', blurb: '1451–1526 — the last before Babur’s victory at Panipat.' },
    ],
  },
  {
    id: 'history-sultanate-admin', subject: 'History', topic: 'Delhi Sultanate — Administration', pool: 'history',
    facts: [
      { title: 'Market Reforms', blurb: 'Alauddin Khalji fixed prices and policed markets via Shahna-i-mandi officers.' },
      { title: 'Iqta System', blurb: 'Land-revenue assignments given to nobles in lieu of salary.' },
      { title: 'Ibn Battuta', blurb: 'Moroccan traveler whose writings record Tughlaq-era Delhi in detail.' },
      { title: 'Reforms Collapsed', blurb: 'Most of Alauddin’s market controls unraveled soon after his death.' },
    ],
  },
  {
    id: 'history-mughal', subject: 'History', topic: 'Mughal Empire', pool: 'history',
    facts: [
      { title: 'First Panipat', blurb: '1526 — Babur’s victory founded the Mughal Empire.' },
      { title: 'Akbar', blurb: 'Introduced Din-i-Ilahi and the Mansabdari administrative system.' },
      { title: 'Aurangzeb', blurb: 'Presided over the empire’s largest extent — and its overreach.' },
      { title: 'Architecture', blurb: 'Taj Mahal, Red Fort — a fusion of Persian and Indian styles.' },
    ],
  },
  {
    id: 'history-sangam', subject: 'History', topic: 'Sangam Age & South Indian Dynasties', pool: 'history',
    facts: [
      { title: 'Sangam Era', blurb: 'c. 300 BCE–300 CE — the earliest age of Tamil literature.' },
      { title: 'Chera', blurb: 'West-coast dynasty (Vanji) built on the pepper trade.' },
      { title: 'Chola', blurb: 'Kaveri delta power, capital at Uraiyur before later shifting to Thanjavur.' },
      { title: 'Pandya', blurb: 'Ruled from Madurai — seat of the Sangam literary assemblies.' },
    ],
  },
  {
    id: 'history-1857', subject: 'History', topic: '1857 & Company Rule', pool: 'history',
    facts: [
      { title: 'Revolt of 1857', blurb: 'Sparked at Meerut — Mangal Pandey among its early flashpoints.' },
      { title: 'Doctrine of Lapse', blurb: 'Dalhousie’s annexation policy — a major trigger for the revolt.' },
      { title: 'GoI Act 1858', blurb: 'The Crown replaced the East India Company as ruler of India.' },
      { title: 'Bahadur Shah II', blurb: 'Last Mughal emperor, exiled to Rangoon after 1857.' },
    ],
  },
  {
    id: 'history-freedom', subject: 'History', topic: 'Freedom Struggle', pool: 'history',
    facts: [
      { title: 'INC Founded', blurb: '1885 — the Indian National Congress begins.' },
      { title: 'Quit India', blurb: 'Launched 8 August 1942 — Gandhi’s call for immediate British withdrawal.' },
      { title: 'Dandi March', blurb: '1930 — Salt Satyagraha, 24 days, 390 km.' },
      { title: 'Tamil Nadu’s Role', blurb: 'V.O. Chidambaram Pillai, Subramania Bharati, Rajaji among its key figures.' },
    ],
  },
  // --- Geography: 7 zones, all on the single live 'geography' pool (632 Qs) ---
  {
    id: 'geo-physical', subject: 'Geography', topic: 'Physical Features of India', pool: 'geography',
    facts: [
      { title: 'Himalayas', blurb: 'The world’s youngest fold mountains, in three parallel ranges.' },
      { title: 'Northern Plains', blurb: 'Formed by alluvium from the Indus, Ganga & Brahmaputra.' },
      { title: 'Deccan Plateau', blurb: 'India’s oldest landmass — volcanic basalt from the Deccan Traps.' },
      { title: 'The Ghats', blurb: 'Western Ghats are older & wetter than the Eastern Ghats.' },
    ],
  },
  {
    id: 'geo-rivers', subject: 'Geography', topic: 'Rivers & Drainage', pool: 'geography',
    facts: [
      { title: 'Ganga', blurb: '~2,525 km — India’s largest river basin.' },
      { title: 'Indus System', blurb: 'Five rivers of Punjab feed the Indus system.' },
      { title: 'Peninsular Rivers', blurb: 'Godavari, Krishna, Kaveri — rain-fed and seasonal.' },
      { title: 'Brahmaputra', blurb: 'Unique north-bank tributaries, a braided river channel.' },
    ],
  },
  {
    id: 'geo-climate', subject: 'Geography', topic: 'Climate & Monsoon', pool: 'geography',
    facts: [
      { title: 'Tropic of Cancer', blurb: 'Passes through 8 states: Gujarat, Rajasthan, MP, Chhattisgarh, Jharkhand, WB, Tripura, Mizoram.' },
      { title: 'SW Monsoon', blurb: 'Arrives at the Kerala coast around June 1 each year.' },
      { title: 'Coriolis Force', blurb: 'Deflects monsoon winds due to Earth’s rotation.' },
      { title: 'El Niño', blurb: 'Linked to weaker monsoon years in India.' },
    ],
  },
  {
    id: 'geo-soils', subject: 'Geography', topic: 'Soils & Agriculture', pool: 'geography',
    facts: [
      { title: 'Alluvial Soil', blurb: 'India’s most fertile soil, covers the Gangetic plain.' },
      { title: 'Black/Regur Soil', blurb: 'Ideal for cotton, found across the Deccan.' },
      { title: 'Green Revolution', blurb: 'Punjab & Haryana, wheat-led, 1960s–70s.' },
      { title: 'Cropping Seasons', blurb: 'Kharif (monsoon-sown) vs Rabi (winter-sown).' },
    ],
  },
  {
    id: 'geo-minerals', subject: 'Geography', topic: 'Minerals & Industry', pool: 'geography',
    facts: [
      { title: 'Iron Ore', blurb: 'Odisha & Chhattisgarh lead India’s production.' },
      { title: 'Coal', blurb: 'Jharkhand & Odisha hold India’s largest reserves.' },
      { title: 'TN Industries', blurb: 'Textiles at Coimbatore, automobiles at Chennai.' },
      { title: 'Cement Belt', blurb: 'Concentrated near limestone deposits in MP, Rajasthan & AP.' },
    ],
  },
  {
    id: 'geo-world', subject: 'Geography', topic: 'World Geography', pool: 'geography',
    facts: [
      { title: 'Equator', blurb: 'Passes through 13 countries — none on Asia’s mainland.' },
      { title: 'Strait of Malacca', blurb: 'A key Indian Ocean–Pacific shipping chokepoint.' },
      { title: 'Ring of Fire', blurb: 'Pacific rim — most of the world’s earthquakes & volcanoes.' },
      { title: 'Sahara', blurb: 'The world’s largest hot desert.' },
    ],
  },
  {
    id: 'geo-population', subject: 'Geography', topic: 'Population & Settlement', pool: 'geography',
    facts: [
      { title: 'Census', blurb: 'Conducted every 10 years — next due in 2027.' },
      { title: 'Population Density', blurb: 'India averages ~480/km², among the world’s highest.' },
      { title: 'Urbanization', blurb: 'Over 30% of India is urban, and rising fast.' },
      { title: 'Tamil Nadu', blurb: 'One of India’s most urbanized states.' },
    ],
  },
  // --- Economy: 6 zones, all on the single live 'economics' pool (596 Qs) ---
  {
    id: 'econ-rbi', subject: 'Economy', topic: 'RBI & Monetary Policy', pool: 'economics',
    facts: [
      { title: 'RBI Founded', blurb: '1935, nationalized in 1949 — India’s central bank.' },
      { title: 'Repo Rate', blurb: 'The rate RBI lends to banks — its key inflation-control tool.' },
      { title: 'CRR', blurb: 'The % of deposits banks must hold in reserve with RBI.' },
      { title: 'Monetary Policy Committee', blurb: '6 members, sets the repo rate every 2 months.' },
    ],
  },
  {
    id: 'econ-fiscal', subject: 'Economy', topic: 'Fiscal Policy & Budget', pool: 'economics',
    facts: [
      { title: 'FRBM Act', blurb: '2003 — mandates fiscal discipline & deficit targets.' },
      { title: 'Fiscal Deficit', blurb: 'Total borrowing needed to bridge revenue-expenditure gap.' },
      { title: 'Revenue vs Capital', blurb: 'Running costs vs asset-building government spend.' },
      { title: 'Union Budget', blurb: 'Presented on February 1 each year.' },
    ],
  },
  {
    id: 'econ-tax', subject: 'Economy', topic: 'Taxation & GST', pool: 'economics',
    facts: [
      { title: 'GST', blurb: '“One Nation One Tax” — rolled out 1 July 2017.' },
      { title: 'GST Council', blurb: 'Union + state finance ministers decide GST rates together.' },
      { title: 'Direct vs Indirect', blurb: 'Income tax (direct) vs GST/customs (indirect).' },
      { title: 'Compensation Cess', blurb: 'Protected states’ revenue during the GST transition.' },
    ],
  },
  {
    id: 'econ-planning', subject: 'Economy', topic: 'Planning & NITI Aayog', pool: 'economics',
    facts: [
      { title: 'Five-Year Plans', blurb: 'Started 1951, ended with the 12th Plan in 2017.' },
      { title: 'NITI Aayog', blurb: 'Replaced the Planning Commission in 2015.' },
      { title: 'Finance Commission', blurb: 'Art. 280 — recommends Centre-state tax devolution every 5 years.' },
      { title: 'TN’s Planning Legacy', blurb: 'State-specific plan models & welfare schemes.' },
    ],
  },
  {
    id: 'econ-indicators', subject: 'Economy', topic: 'National Income & Indicators', pool: 'economics',
    facts: [
      { title: 'GDP vs GNP', blurb: 'GNP adds net income earned from abroad.' },
      { title: 'Inflation', blurb: 'Measured via the WPI and CPI.' },
      { title: 'Per Capita Income', blurb: 'Total national income divided by population.' },
      { title: 'Economic Survey', blurb: 'The Finance Ministry’s pre-Budget report.' },
    ],
  },
  {
    id: 'econ-banking', subject: 'Economy', topic: 'Banking & Financial Inclusion', pool: 'economics',
    facts: [
      { title: 'Bank Nationalization', blurb: '14 banks in 1969, 6 more in 1980.' },
      { title: 'Jan Dhan Yojana', blurb: '2014 — a mass financial-inclusion drive.' },
      { title: 'NPA', blurb: 'A loan whose repayment is overdue by 90+ days.' },
      { title: 'SEBI', blurb: 'Regulates India’s securities markets.' },
    ],
  },
  // --- Science: 6 zones, all on the single live 'science' pool (749 Qs, NCERT-sourced) ---
  {
    id: 'sci-motion', subject: 'Science', topic: 'Motion & Forces', pool: 'science',
    facts: [
      { title: 'Newton’s 1st Law', blurb: 'An object stays at rest or in motion unless acted on by a force — inertia.' },
      { title: 'Newton’s 3rd Law', blurb: 'Every action has an equal, opposite reaction.' },
      { title: 'Friction', blurb: 'Always opposes relative motion between two surfaces.' },
      { title: 'SI Unit of Force', blurb: 'The Newton (N).' },
    ],
  },
  {
    id: 'sci-optics', subject: 'Science', topic: 'Light & Optics', pool: 'science',
    facts: [
      { title: 'Reflection', blurb: 'Angle of incidence always equals angle of reflection.' },
      { title: 'Mirrors', blurb: 'Concave mirrors converge light; convex mirrors diverge it.' },
      { title: 'Refraction', blurb: 'Light bends when it crosses a boundary between media.' },
      { title: 'The Eye', blurb: 'The lens focuses light onto the retina.' },
    ],
  },
  {
    id: 'sci-atomic', subject: 'Science', topic: 'Atomic Structure', pool: 'science',
    facts: [
      { title: 'Rutherford', blurb: 'His gold-foil experiment discovered the atomic nucleus.' },
      { title: 'Bohr Model', blurb: 'Electrons orbit the nucleus in fixed energy levels.' },
      { title: 'Subatomic Particles', blurb: 'Proton (+), neutron (neutral), electron (−).' },
      { title: 'Atomic Number', blurb: 'Equals the number of protons in an atom.' },
    ],
  },
  {
    id: 'sci-acids', subject: 'Science', topic: 'Acids, Bases & Salts', pool: 'science',
    facts: [
      { title: 'Litmus Test', blurb: 'Acids turn blue litmus red; bases turn red litmus blue.' },
      { title: 'pH Scale', blurb: '7 is neutral, below 7 acidic, above 7 basic.' },
      { title: 'Neutralization', blurb: 'Acid + base → salt + water.' },
      { title: 'Common Salt', blurb: 'NaCl — sodium chloride, ordinary table salt.' },
    ],
  },
  {
    id: 'sci-body', subject: 'Science', topic: 'Human Body Systems', pool: 'science',
    facts: [
      { title: 'The Heart', blurb: 'Four chambers — two atria, two ventricles.' },
      { title: 'Digestion', blurb: 'Starts in the mouth, finishes in the small intestine.' },
      { title: 'Red Blood Cells', blurb: 'Carry oxygen via haemoglobin.' },
      { title: 'Kidneys', blurb: 'Filter the blood and form urine.' },
    ],
  },
  {
    id: 'sci-cell', subject: 'Science', topic: 'Cell & Genetics', pool: 'science',
    facts: [
      { title: 'The Cell', blurb: 'The basic structural & functional unit of life.' },
      { title: 'Mitochondria', blurb: 'The cell’s “powerhouse” — generates energy.' },
      { title: 'DNA', blurb: 'Carries an organism’s genetic information.' },
      { title: 'Mendel', blurb: 'His laws of inheritance earned him the title “father of genetics.”' },
    ],
  },
  // --- Quant: 6 zones, all on the single live 'maths' pool (619 Qs, SSC-sourced) ---
  {
    id: 'quant-percent', subject: 'Quant', topic: 'Percentages', pool: 'maths',
    facts: [
      { title: 'The Formula', blurb: 'x% of y = (x × y) / 100.' },
      { title: '% Change', blurb: '(new − old) / old × 100.' },
      { title: 'Per Hundred', blurb: '“Percent” literally means per hundred — converts directly to a fraction.' },
    ],
  },
  {
    id: 'quant-profit', subject: 'Quant', topic: 'Profit & Loss', pool: 'maths',
    facts: [
      { title: 'Profit %', blurb: '(SP − CP) / CP × 100.' },
      { title: 'Loss %', blurb: '(CP − SP) / CP × 100.' },
      { title: 'Discount', blurb: 'Always calculated on the marked price, not the cost price.' },
    ],
  },
  {
    id: 'quant-interest', subject: 'Quant', topic: 'Simple & Compound Interest', pool: 'maths',
    facts: [
      { title: 'Simple Interest', blurb: 'SI = (P × R × T) / 100.' },
      { title: 'Compound Interest', blurb: 'CI = P(1 + R/100)^T − P.' },
      { title: 'CI > SI', blurb: 'For T > 1 year, since interest earns interest on itself.' },
    ],
  },
  {
    id: 'quant-speed', subject: 'Quant', topic: 'Time, Speed & Distance', pool: 'maths',
    facts: [
      { title: 'The Formula', blurb: 'Speed = Distance ÷ Time.' },
      { title: 'Unit Conversion', blurb: 'km/h to m/s: multiply by 5/18.' },
      { title: 'Relative Speed', blurb: 'Add speeds if moving opposite, subtract if moving the same way.' },
    ],
  },
  {
    id: 'quant-work', subject: 'Quant', topic: 'Time & Work', pool: 'maths',
    facts: [
      { title: 'Work Formula', blurb: 'Work = Rate × Time.' },
      { title: 'Individual Rate', blurb: 'If A finishes a job in x days, A’s 1-day rate is 1/x.' },
      { title: 'Combined Rate', blurb: 'Sum the individual rates to get the combined work rate.' },
    ],
  },
  {
    id: 'quant-geometry', subject: 'Quant', topic: 'Geometry Basics', pool: 'maths',
    facts: [
      { title: 'Triangle Angles', blurb: 'Always sum to 180°.' },
      { title: 'Pythagoras', blurb: 'a² + b² = c² for any right triangle.' },
      { title: 'Circle', blurb: 'Area = πr², circumference = 2πr.' },
    ],
  },
  // --- Reasoning: technique primers, not trivia — the billboard is a rule/pattern to apply,
  // not a fact to recall. All on the single live 'reasoning' pool (659 Qs, SSC-sourced). ---
  {
    id: 'reason-coding', subject: 'Reasoning', topic: 'Coding-Decoding', pool: 'reasoning',
    facts: [
      { title: 'Letter Shift', blurb: 'Each letter moves a fixed number of steps, e.g. A→D means +3.' },
      { title: 'Reverse Coding', blurb: 'The word is simply spelled backward.' },
      { title: 'Number Substitution', blurb: 'A=1, B=2 ... Z=26 — the most common letter-number key.' },
    ],
  },
  {
    id: 'reason-blood', subject: 'Reasoning', topic: 'Blood Relations', pool: 'reasoning',
    facts: [
      { title: 'Draw It Out', blurb: 'Sketch a quick family tree — don’t hold it in your head.' },
      { title: 'The Trap', blurb: '“Mother’s only son” = the speaker himself.' },
      { title: 'Key Terms', blurb: '“Brother’s son” = nephew, “sister’s daughter” = niece.' },
    ],
  },
  {
    id: 'reason-series', subject: 'Reasoning', topic: 'Series & Analogies', pool: 'reasoning',
    facts: [
      { title: 'Series Patterns', blurb: 'Check for constant difference, ratio, or alternating pattern first.' },
      { title: 'Analogy Method', blurb: 'Find the RELATIONSHIP first, then match it (Doctor:Hospital :: Teacher:School).' },
      { title: 'Odd One Out', blurb: 'Three items share a category — find the one that doesn’t.' },
    ],
  },
  {
    id: 'reason-syllogism', subject: 'Reasoning', topic: 'Syllogism', pool: 'reasoning',
    facts: [
      { title: 'The Chain Rule', blurb: 'All A are B, All B are C ⇒ All A are C — always valid.' },
      { title: 'Watch “Some”', blurb: '“Some A are B” does NOT automatically make “Some B are A” false.' },
      { title: 'Draw Venn Circles', blurb: 'Don’t reason in words alone — sketch it.' },
    ],
  },
  {
    id: 'reason-direction', subject: 'Reasoning', topic: 'Direction Sense', pool: 'reasoning',
    facts: [
      { title: 'Track Every Turn', blurb: 'Fix a starting direction and track each turn precisely.' },
      { title: 'Net Displacement', blurb: 'Use Pythagoras when the path forms a right angle.' },
      { title: 'Fix Your Orientation', blurb: '“Sun rises in the east” anchors your starting direction.' },
    ],
  },
  {
    id: 'reason-calendar', subject: 'Reasoning', topic: 'Calendar & Clock', pool: 'reasoning',
    facts: [
      { title: 'Odd Days', blurb: 'A normal year has 365 days = 52 weeks + 1 odd day.' },
      { title: 'Clock Hands', blurb: 'The hour hand moves 0.5°/min, the minute hand 6°/min.' },
      { title: 'Leap Year', blurb: 'Has 2 odd days instead of 1.' },
    ],
  },
  {
    id: 'current-affairs-basics', subject: 'Current Affairs', topic: 'Current Affairs', pool: 'current-affairs',
    facts: [
      { title: 'Chandrayaan-3', blurb: 'Landed near the lunar south pole in August 2023.' },
    ],
  },
];

// Flat fact list, derived from the zones above — kept for anything that still wants every
// individual fact without zone grouping (e.g. counting total facts passed).
export const LEARN_FACTS = TOPIC_ZONES.flatMap((z) =>
  z.facts.map((f) => ({ ...f, subject: z.subject, topic: z.topic, pool: z.pool }))
);
