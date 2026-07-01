require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const BASE  = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
const KEY   = 'quiz:subject:physics';
const HDR   = { Authorization:`Bearer ${TOKEN}`, 'Content-Type':'application/json' };

const questions = [
  // --- More Motion ---
  {
    question_text: "A body is said to be in equilibrium when the net force and net torque acting on it are both:",
    options: ["Maximum","Equal to each other","Zero","Constant"],
    correct_answer: 2,
    explanation: "Equilibrium: ΣF = 0 (translational equilibrium — no linear acceleration) AND Στ = 0 (rotational equilibrium — no angular acceleration). Static equilibrium: body at rest. Dynamic equilibrium: body moving at constant velocity with no rotation.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The principle of moments states that for a body in rotational equilibrium:",
    options: ["All forces must be equal","Sum of clockwise moments = Sum of anticlockwise moments about any pivot","Total mass is balanced","Forces act at the centre of mass"],
    correct_answer: 1,
    explanation: "Principle of Moments (law of the lever): sum of clockwise moments = sum of anticlockwise moments about any point. Moment = Force × perpendicular distance. Used in: lever design, beam balancing, engineering structures, seesaws.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The centre of gravity of a body is the point where:",
    options: ["Its mass is greatest","The entire weight of the body can be considered to act","It is in contact with the ground","All forces are balanced"],
    correct_answer: 1,
    explanation: "Centre of gravity (CG): point where the total gravitational force (weight) effectively acts. For uniform bodies: CG is at the geometric centre. Low CG → stable (sports car, SUV with lowered suspension). High CG → unstable (tall box). CG = Centre of mass when g is uniform.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Impulse is defined as:",
    options: ["Force × distance","Force × time (= change in momentum)","Mass × velocity","Power × time"],
    correct_answer: 1,
    explanation: "Impulse J = F × t = Δp (change in momentum). SI unit: N·s = kg·m/s. Same unit as momentum. This is why: car airbags (increase time of impact → reduce force), catching a cricket ball by pulling hands back (increases time → reduces force), crumple zones in cars.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "A body thrown vertically upward reaches maximum height in 3 seconds. The initial velocity was (g = 10 m/s²):",
    options: ["10 m/s","20 m/s","30 m/s","40 m/s"],
    correct_answer: 2,
    explanation: "At max height, v = 0. Using v = u − gt: 0 = u − 10×3 → u = 30 m/s. Max height H = u²/2g = 900/20 = 45 m. Time to fall back = 3 s. Total time of flight = 6 s. Speed on reaching ground = initial speed (symmetry).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Energy & Machines ---
  {
    question_text: "In a perfectly inelastic collision, the two objects:",
    options: ["Bounce off each other with no energy loss","Stick together and move with a common velocity (maximum kinetic energy loss)","Transfer all momentum to one object","Both come to rest"],
    correct_answer: 1,
    explanation: "Perfectly inelastic collision: objects stick together → common velocity v = (m₁u₁ + m₂u₂)/(m₁ + m₂). Maximum KE loss (but momentum still conserved). Examples: bullet embedding in block, clay ball hitting wall and sticking, train coupling.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Power of a machine is 100 W and it runs for 5 hours. The energy consumed in kWh is:",
    options: ["0.5 kWh","1.0 kWh","5.0 kWh","500 kWh"],
    correct_answer: 0,
    explanation: "Energy = Power × Time = 100 W × 5 h = 500 Wh = 0.5 kWh. This is 0.5 units of electricity. At ₹8/unit, cost = ₹4. A 1000 W (1 kW) device running for 1 hour uses 1 kWh = 1 unit.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Optics ---
  {
    question_text: "Astigmatism is an eye defect caused by:",
    options: ["Too long an eyeball","Too short an eyeball","Irregularly shaped cornea or lens causing different focal lengths in different planes","Loss of lens elasticity with age"],
    correct_answer: 2,
    explanation: "Astigmatism: cornea/lens is not perfectly spherical → different curvatures in different directions → light focuses at different points → blurred vision at all distances. Corrected with cylindrical (toric) lenses. Presbyopia: loss of accommodation with age → reading glasses needed.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The angle of deviation of a ray passing through a prism depends on:",
    options: ["Only the material of the prism","Only the angle of incidence","Both the prism angle, material (refractive index), and angle of incidence","Only the colour of light"],
    correct_answer: 2,
    explanation: "Deviation δ of ray through prism depends on: prism angle (A), refractive index (n, varies with wavelength → dispersion), and angle of incidence (i). Minimum deviation (δ_m) when ray passes symmetrically: n = sin((A + δ_m)/2) / sin(A/2).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The resolving power of a microscope depends on:",
    options: ["Magnification only","Wavelength of light used (shorter λ → better resolution)","The brightness of illumination","The size of the specimen"],
    correct_answer: 1,
    explanation: "Resolving power: minimum distance between two points that can be distinguished. RP ∝ 1/λ. Shorter wavelength → better resolution. UV microscopes resolve better than visible light. Electron microscopes (λ = pm range) resolve atoms. Numerical aperture also important.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "When light enters a denser medium from a rarer medium, which property does NOT change?",
    options: ["Speed","Wavelength","Frequency","Direction"],
    correct_answer: 2,
    explanation: "Frequency does NOT change when light changes medium. Speed changes (v = c/n), wavelength changes (λ = λ₀/n), direction changes (refraction). Frequency is determined by the source and remains constant. E = hf shows energy is conserved per photon.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The minimum number of plane mirrors needed to form a kaleidoscope is:",
    options: ["1","2","3","4"],
    correct_answer: 1,
    explanation: "Kaleidoscope: typically uses 3 plane mirrors arranged at 60° to each other in a triangular tube. Objects at the end are reflected to form symmetric patterns. With 2 mirrors at angle θ: number of images = (360°/θ) − 1. 2 mirrors at 90° → 3 images.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb"]
  },
  {
    question_text: "A lateral inversion is the effect seen in a plane mirror where:",
    options: ["The image is upside down","Left and right are swapped (left hand appears as right hand in mirror)","The image is smaller","Top and bottom are swapped"],
    correct_answer: 1,
    explanation: "Lateral inversion: in plane mirror, the left and right sides appear swapped (your right hand appears as left hand in the mirror). This is why text appears reversed. Ambulance has 'AMBULANCE' written in mirror writing so drivers can read it correctly in their rear-view mirrors.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Electricity & Circuits ---
  {
    question_text: "A device that converts chemical energy directly to electrical energy is:",
    options: ["Motor","Generator","Battery (electrochemical cell)","Transformer"],
    correct_answer: 2,
    explanation: "Battery (electrochemical cell): chemical reactions at electrodes generate electron flow (current). Primary cell: non-rechargeable (dry cell, alkaline). Secondary cell: rechargeable (lead-acid, lithium-ion, NiMH). Fuel cell: hydrogen + oxygen → electricity + water (very efficient).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The internal resistance of an ideal battery is:",
    options: ["Infinite","Very high","Zero","Equal to external resistance"],
    correct_answer: 2,
    explanation: "Ideal battery: zero internal resistance → terminal voltage = EMF regardless of current. Real batteries have internal resistance → terminal voltage drops under load (V = ε − Ir). Old/discharged batteries have higher internal resistance → voltage drops significantly under load.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The colour code of resistors: Red-Red-Red represents a resistance of:",
    options: ["222 Ω","2200 Ω","22 Ω","22,000 Ω"],
    correct_answer: 1,
    explanation: "Resistor colour code: Black=0, Brown=1, Red=2, Orange=3, Yellow=4, Green=5, Blue=6, Violet=7, Grey=8, White=9. Red-Red-Red: first digit=2, second digit=2, multiplier=10²=100 → 22×100 = 2200 Ω = 2.2 kΩ.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb"]
  },
  {
    question_text: "AC is used for long-distance power transmission (not DC) because:",
    options: ["AC is safer than DC","AC travels faster than DC","AC voltage can be easily stepped up/down using transformers to minimize transmission losses","DC cannot flow through wires"],
    correct_answer: 2,
    explanation: "AC transmission advantage: transformers (work only with AC) can step up voltage for transmission (reducing I → reducing I²R losses) and step down at destination. HVDC (High Voltage Direct Current) is now also used for very long distances (less reactance losses), but AC remains dominant.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Earthing (grounding) in electrical installations protects against electric shock by:",
    options: ["Increasing voltage","Providing a low-resistance path for fault current to flow safely to the ground instead of through the human body","Reducing current in the circuit","Increasing insulation resistance"],
    correct_answer: 1,
    explanation: "Earthing: if a live wire touches the metal casing of an appliance, current flows through earth wire to ground (low resistance path) → circuit breaker/fuse trips. Without earthing: current would flow through person touching the casing. Green-yellow wire = earth. Red/brown = live. Blue/black = neutral.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Nuclear Physics ---
  {
    question_text: "The chain reaction in a nuclear reactor is controlled by keeping the multiplication factor (k) equal to:",
    options: ["0","0.5","1 (criticality — one fission triggers exactly one more)","Greater than 1"],
    correct_answer: 2,
    explanation: "Criticality: k = 1 → steady chain reaction (controlled). k < 1 (subcritical): reaction dies out. k > 1 (supercritical): exponential increase → explosion (atomic bomb) or meltdown. Control rods maintain k = 1 precisely. SCRAM = emergency insertion of all rods → k < 1 → shutdown.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Which isotope of uranium is fissile (can sustain a chain reaction with slow neutrons)?",
    options: ["Uranium-238 (most abundant)","Uranium-235 (0.7% of natural uranium)","Uranium-234","Uranium-236"],
    correct_answer: 1,
    explanation: "U-235: fissile isotope, 0.72% of natural uranium. Absorbs thermal (slow) neutrons → fissions → releases 2-3 neutrons + ~200 MeV energy. U-238 (99.3%): not fissile (absorbs neutrons without fission) but fertile → can capture neutron → Pu-239 (fissile, used in weapons/reactors).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Radiocarbon dating works because Carbon-14 is:",
    options: ["Stable and present in all organisms in constant proportion","Continuously produced in the atmosphere by cosmic ray neutrons hitting N-14, incorporated in living organisms; after death, C-14 decays at known rate (t½ = 5730 years)","Produced only in human-made nuclear reactors","Present only in bones"],
    correct_answer: 1,
    explanation: "Carbon-14 dating (Willard Libby, Nobel 1960): cosmic rays hit N-14 → C-14. Living organisms have constant C-14 (absorbed via CO₂). After death: C-14 decays (t½ = 5730 years). Measuring C-14/C-12 ratio → date of death. Range: up to ~50,000 years.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Thermodynamics ---
  {
    question_text: "Thermal conductivity (k) is high for:",
    options: ["Wood and rubber","Air and gases","Metals like copper and silver","Glass and ceramics"],
    correct_answer: 2,
    explanation: "Thermal conductivity: Silver (429), Copper (401), Aluminium (237), Iron (80) — all in W/(m·K). Good conductors have free electrons that transport heat. Poor conductors: glass (1.0), wood (0.1), air (0.024). Air is a good insulator → double-glazed windows, thermal flasks, foam insulation.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Stefan-Boltzmann Law states that the total energy radiated per unit area by a black body is proportional to:",
    options: ["Temperature","Square of temperature (T²)","Fourth power of absolute temperature (T⁴)","Cube root of temperature"],
    correct_answer: 2,
    explanation: "Stefan-Boltzmann Law: P = σAT⁴ (σ = 5.67 × 10⁻⁸ W/(m²·K⁴)). Doubling temperature → 16× radiation. The Sun's surface (5778 K) vs Earth's average (288 K): Sun radiates (5778/288)⁴ ≈ 160,000× more per unit area. Used in astronomy to measure star temperatures.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The dew point is the temperature at which:",
    options: ["Ice starts to melt","Water starts to evaporate","Air becomes saturated with water vapour and condensation begins (dew forms)","Rain begins to fall"],
    correct_answer: 2,
    explanation: "Dew point: when air cools to dew point temperature, relative humidity reaches 100% → water vapour condenses into liquid water (dew on surfaces, fog in air). Below dew point: fog, dew, cloud, rain. Weather forecasters use dew point to predict fog and precipitation.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Wave Optics ---
  {
    question_text: "In Young's double slit experiment, the fringe width (distance between consecutive bright or dark fringes) is:",
    options: ["β = λd/D","β = λD/d (where D = screen distance, d = slit separation, λ = wavelength)","β = D/λd","β = λd²/D"],
    correct_answer: 1,
    explanation: "Fringe width β = λD/d. Wider fringes with: longer wavelength, farther screen, closer slits. Monochromatic light (single wavelength) → sharp fringes. White light → central white fringe with coloured fringes on either side (different λ → different β).",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Anti-reflection coatings on camera lenses use thin film interference. The coating thickness is chosen so that:",
    options: ["Reflected waves from top and bottom surfaces interfere constructively","Reflected waves from top and bottom surfaces interfere destructively (path difference = λ/2) → zero reflection","Maximum light is reflected","The coating is transparent"],
    correct_answer: 1,
    explanation: "Anti-reflection coating: thin film with n between glass and air. Thickness = λ/4n → path difference for reflected rays = λ/2 → destructive interference → no reflection → maximum transmission. Cameras, spectacles, solar panels, telescope lenses use this. Appears slightly purple/blue.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // --- Electromagnetism ---
  {
    question_text: "Displacement current, introduced by Maxwell to complete Ampere's Law, flows through:",
    options: ["Conductors only","A resistor","The space between capacitor plates (where there is no actual current but changing electric field)","Inductors only"],
    correct_answer: 2,
    explanation: "Maxwell's displacement current: I_d = ε₀ × dΦE/dt. In the gap between capacitor plates, no actual current flows, but changing electric field creates 'displacement current' → maintains consistency of Ampere's Law. This insight led Maxwell to predict EM waves.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The speed of electromagnetic waves in vacuum is given by:",
    options: ["c = √(μ₀ε₀)","c = 1/√(μ₀ε₀) = 3 × 10⁸ m/s","c = μ₀ × ε₀","c = μ₀/ε₀"],
    correct_answer: 1,
    explanation: "Maxwell derived c = 1/√(μ₀ε₀) from his electromagnetic equations. μ₀ = 4π × 10⁻⁷ H/m (permeability of free space), ε₀ = 8.85 × 10⁻¹² F/m (permittivity of free space). Calculation gives c = 3 × 10⁸ m/s — matching the known speed of light. Maxwell's greatest insight.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // --- Measurement ---
  {
    question_text: "Random errors in measurement can be reduced by:",
    options: ["Using better instruments only","Repeating measurements many times and taking the mean","Calibrating the instrument","Avoiding all friction"],
    correct_answer: 1,
    explanation: "Random errors: unpredictable fluctuations in measurement (due to environmental factors, human reaction time). Reduced by: taking multiple measurements and averaging. Systematic errors: consistent offset (wrong zero, miscalibration) — reduced by calibration. Both types affect accuracy.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The least count of a measuring instrument is:",
    options: ["The largest value it can measure","The smallest value it can reliably measure","The average of all measurements","The error in measurement"],
    correct_answer: 1,
    explanation: "Least count: smallest measurement an instrument can make. Ruler: 1 mm. Vernier caliper: 0.1 mm. Screw gauge: 0.01 mm. Always report measurements up to the least count. Reading beyond least count has no meaning. LC = 1 MSD − 1 VSD for Vernier.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Significant figures in 0.00450 are:",
    options: ["6","5","3","2"],
    correct_answer: 2,
    explanation: "Significant figures rules: leading zeros (0.00) are NOT significant. Trailing zeros after decimal point (450. → .450) ARE significant. So 0.00450 has 3 significant figures (4, 5, 0). In 4500: trailing zeros before decimal may or may not be significant (ambiguous → use scientific notation: 4.50 × 10³ = 3 sig figs).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Modern Physics Extra ---
  {
    question_text: "The Higgs boson, discovered at CERN's LHC in 2012, is important because it:",
    options: ["Carries the gravitational force","Gives other fundamental particles their mass (via Higgs mechanism)","Is the antiparticle of the proton","Is responsible for radioactive decay"],
    correct_answer: 1,
    explanation: "Higgs boson: gives mass to W and Z bosons (and quarks, leptons) through interaction with the Higgs field. Predicted by Peter Higgs and others in 1964. Discovered July 4, 2012 at CERN's LHC. Nobel Prize 2013 to Higgs and Englert. Sometimes called 'God particle' (by Leon Lederman).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Dark matter comprises about ____% of the universe's total mass-energy content:",
    options: ["5%","27%","68%","50%"],
    correct_answer: 1,
    explanation: "Universe composition: ~5% ordinary (baryonic) matter, ~27% dark matter (unknown — detected by gravitational effects), ~68% dark energy (causing accelerated expansion). Only 5% is the 'normal' matter we can see and touch. Dark matter proposed by Fritz Zwicky (1933).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Antimatter is composed of antiparticles. When matter meets antimatter:",
    options: ["They pass through each other","They repel strongly","They annihilate each other, converting all mass into energy (γ rays)","They form new stable elements"],
    correct_answer: 2,
    explanation: "Matter-antimatter annihilation: e⁻ + e⁺ → 2γ (511 keV each). Releases E = 2mc² per pair. Most energetic reaction possible per unit mass. Universe has more matter than antimatter (baryon asymmetry) — why we exist. Antimatter used in PET scans (positron emission).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // --- Sound Extra ---
  {
    question_text: "The phenomenon of reverberation is:",
    options: ["The echo from a single wall","Persistence of sound due to multiple reflections in an enclosed space","The Doppler shift of sound","Sound going around corners"],
    correct_answer: 1,
    explanation: "Reverberation: prolonged persistence of sound in a room/hall due to multiple reflections from walls/ceiling/floor. Reverberation time (T60): time for sound to decrease 60 dB. Concert halls need T60 ~1.5-2 s (speech: ~0.5 s). Controlled by acoustic tiles, curtains, carpets (absorb sound).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Which of the following cannot transmit sound?",
    options: ["Water","Steel","Air","Vacuum"],
    correct_answer: 3,
    explanation: "Sound requires a material medium (mechanical wave — needs particles to vibrate). Vacuum has no particles → cannot transmit sound. Speed: solids > liquids > gases (steel ~5000 m/s, water ~1500 m/s, air ~340 m/s). The Moon has no atmosphere → no sound (astronauts use radio).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The pitch of a sound depends on its:",
    options: ["Amplitude","Frequency (higher frequency = higher pitch)","Intensity","Speed in the medium"],
    correct_answer: 1,
    explanation: "Pitch: subjective perception of frequency. Higher frequency → higher pitch. Middle C = 261.6 Hz. Human voice: 85–255 Hz (male), 165–255 Hz (female). Infrasound: < 20 Hz (elephants, earthquakes). Ultrasound: > 20,000 Hz (bats, dolphins). Loudness depends on amplitude/intensity.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The quality (timbre) of a musical note depends on:",
    options: ["Frequency alone","Amplitude alone","The presence and relative intensity of harmonics (overtones) along with the fundamental frequency","Speed of sound in the instrument"],
    correct_answer: 2,
    explanation: "Timbre (quality): same note (frequency) sounds different on violin vs piano because they produce different harmonic overtones. A pure tone = single frequency. Musical instruments produce fundamental + harmonics. This is how we distinguish different instruments playing same note.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // --- Fluid Dynamics ---
  {
    question_text: "Reynolds number determines whether fluid flow is laminar or turbulent. Turbulent flow occurs at:",
    options: ["Low Reynolds numbers (Re < 2000)","High Reynolds numbers (Re > 4000)","Re = 1 exactly","Re is unrelated to flow type"],
    correct_answer: 1,
    explanation: "Reynolds number Re = ρvL/μ. Low Re (< 2000): laminar (smooth, parallel streamlines). High Re (> 4000): turbulent (chaotic, mixing). 2000–4000: transitional. Blood in arteries is mostly laminar. Aircraft wake turbulence at high Re. Engineers design for laminar flow to reduce drag.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The equation of continuity in fluid dynamics states that for incompressible fluids:",
    options: ["Pressure × volume = constant","A₁v₁ = A₂v₂ (flow rate is constant — where tube narrows, velocity increases)","Density × velocity = constant","Temperature × pressure = constant"],
    correct_answer: 1,
    explanation: "Continuity equation: A₁v₁ = A₂v₂ (conservation of mass/volume for incompressible flow). Garden hose nozzle: smaller area → faster flow. Rivers: narrow gorge → faster current. Blood in capillaries: though each capillary is narrow, total area is huge → slow flow (allowing gas exchange).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Light Sources & Technology ---
  {
    question_text: "RADAR uses which part of the electromagnetic spectrum?",
    options: ["X-rays","Gamma rays","Microwaves/Radio waves","Infrared"],
    correct_answer: 2,
    explanation: "RADAR: uses microwave radio waves (typically 1 GHz–100 GHz). Different bands: L-band (surveillance), S-band (weather), C-band (air traffic), X-band (aircraft, police radar). Wavelength: mm to cm range. Doppler RADAR measures speed. Weather RADAR detects precipitation.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "A CRT (Cathode Ray Tube) television uses a beam of electrons that are:",
    options: ["Reflected by a mirror","Deflected by electric and magnetic fields to scan across a phosphor screen creating images","Focused by a glass lens","Diffracted through a grating"],
    correct_answer: 1,
    explanation: "CRT: electron gun fires electrons → deflection plates and coils (electric/magnetic fields) steer beam → electrons hit phosphor screen → light emission at point of impact → image formed by rapid scanning. Replaced by LCD/LED/OLED flat screens. CRT principle used in oscilloscopes.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Which of the following correctly describes how a nuclear submarine's propulsion system works?",
    options: ["Solar panels power electric motors","Nuclear fission heats water → steam drives turbines → propellers (no need to surface for air/refuelling for years)","Chemical rockets underwater","Diesel engines with large fuel tanks"],
    correct_answer: 1,
    explanation: "Nuclear submarine: nuclear reactor (U-235 fission) heats water → steam → turbines → electric generators and/or direct propulsion. Can operate for ~20–25 years without refuelling. No need for air intake (unlike diesel-electric subs). India's INS Arihant: first indigenous ballistic missile nuclear submarine.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // --- Physics in India ---
  {
    question_text: "The National Physical Laboratory (NPL) of India is located at:",
    options: ["Mumbai","Bengaluru","New Delhi","Chennai"],
    correct_answer: 2,
    explanation: "NPL, New Delhi: established 1947. Maintains India's primary measurement standards (SI units). Custodian of India's standard of time, length, mass, temperature. Linked to International Bureau of Weights and Measures (BIPM) in Paris.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Vikram Sarabhai is known as:",
    options: ["Father of India's nuclear programme","Father of India's space programme","Discoverer of Raman Effect","Father of Indian mathematics"],
    correct_answer: 1,
    explanation: "Dr. Vikram Sarabhai (1919–1971): founder of ISRO (established 1969) and father of India's space programme. Also founded ATIRA, PRL (Physical Research Laboratory), IIMA. India's first rocket was launched from Thumba (Kerala) in 1963. The Vikram lander on Moon is named after him.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Homi Jehangir Bhabha is known as:",
    options: ["Father of India's space programme","Father of India's nuclear programme","Father of Indian mathematics","Discoverer of atomic nucleus"],
    correct_answer: 1,
    explanation: "Dr. Homi Bhabha (1909–1966): father of India's nuclear programme. Founded TIFR (Tata Institute of Fundamental Research, 1945), India's first nuclear reactor 'Apsara' (1956), BARC. Proposed India's three-stage nuclear power programme. Died in Air India crash near Mont Blanc (1966).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "India's first nuclear reactor 'Apsara' achieved criticality in:",
    options: ["1954","1956","1963","1969"],
    correct_answer: 1,
    explanation: "Apsara (1956): India's first nuclear reactor, at BARC Trombay. A swimming pool reactor (light water moderated, enriched uranium fuel). Named after the celestial nymphs. Went critical on August 4, 1956. Used for research, isotope production. A new Apsara-U was commissioned in 2018.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // --- More Concepts ---
  {
    question_text: "A scalar quantity has only magnitude, while a vector quantity has both magnitude and direction. Which is a scalar?",
    options: ["Force","Velocity","Electric field","Temperature"],
    correct_answer: 3,
    explanation: "Scalars (magnitude only): temperature, mass, speed, energy, power, time, distance, volume, density, charge. Vectors (magnitude + direction): force, velocity, acceleration, momentum, electric field, displacement, torque. Speed is scalar; velocity is vector.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The unit vector has a magnitude of exactly:",
    options: ["0","0.5","1","Depends on direction"],
    correct_answer: 2,
    explanation: "Unit vector: magnitude = 1 (dimensionless), used to specify direction only. î, ĵ, k̂ are unit vectors along x, y, z axes. Any vector A can be written as A = |A| × â (where â = unit vector in direction of A). â = A/|A|.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "When two forces act on a body, the resultant is maximum when the angle between them is:",
    options: ["90°","120°","180°","0° (forces in same direction)"],
    correct_answer: 3,
    explanation: "Resultant R = √(F₁² + F₂² + 2F₁F₂cosθ). At θ = 0° (same direction): R = F₁ + F₂ (maximum). At θ = 90°: R = √(F₁² + F₂²). At θ = 180° (opposite directions): R = |F₁ − F₂| (minimum). Parallelogram law of vector addition.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The phenomenon of 'g' being slightly less at the equator compared to the poles is because:",
    options: ["Earth is closer to the Sun at equator","Earth bulges at equator (larger radius) AND the equator has centrifugal reduction from Earth's rotation","There is more air at equator","Temperature is higher at equator"],
    correct_answer: 1,
    explanation: "g at equator < g at poles: (1) Earth is oblate spheroid — equatorial radius > polar radius → by g = GM/R², larger R → smaller g. (2) Centrifugal effect due to Earth's rotation reduces apparent gravity at equator (zero at poles). g_equator ≈ 9.78 m/s², g_poles ≈ 9.83 m/s².",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The principle of superposition states that when two or more waves overlap:",
    options: ["They destroy each other","The resulting displacement is the algebraic sum of individual displacements","Only the larger wave survives","They convert to a single wave of higher frequency"],
    correct_answer: 1,
    explanation: "Superposition principle: when waves overlap, total displacement = algebraic sum of individual displacements. After passing, waves continue unchanged. Basis of: interference, diffraction, beats, standing waves. Valid for linear waves (small amplitude).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Polaroid sunglasses reduce glare because they:",
    options: ["Absorb all light uniformly","Transmit only vertically polarized light, blocking horizontally polarized glare (reflected light is mostly horizontally polarized)","Filter UV light only","Are tinted darker than regular glasses"],
    correct_answer: 1,
    explanation: "Glare: reflected light from horizontal surfaces (road, water) is predominantly horizontally polarized. Polaroid sunglasses have vertical transmission axis → block horizontal polarization → reduce glare significantly. Also used in photography (polarizing filters), LCD screens, 3D cinema.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The phenomenon of 'Newton's rings' is caused by:",
    options: ["Diffraction of light by small particles","Thin film interference between light reflected from the flat glass and curved glass lens","Dispersion of white light","Polarization of reflected light"],
    correct_answer: 1,
    explanation: "Newton's rings: concentric circular light/dark rings formed when a plano-convex lens rests on a flat glass plate. Thin air film between lens and plate has varying thickness → path difference → alternating constructive/destructive interference. Used to measure wavelength and test lens flatness.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Radio waves, microwaves, infrared, visible light, ultraviolet, X-rays, and gamma rays — in order of increasing frequency, which comes last (highest frequency)?",
    options: ["X-rays","Ultraviolet","Gamma rays","Microwaves"],
    correct_answer: 2,
    explanation: "EM spectrum order (increasing frequency / energy; decreasing wavelength): Radio → Microwave → Infrared → Visible → UV → X-ray → Gamma ray. Gamma rays: highest frequency, highest energy, shortest wavelength, most penetrating. All travel at c = 3×10⁸ m/s in vacuum.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The 'greenhouse gases' that most significantly contribute to global warming are:",
    options: ["Oxygen and nitrogen","CO₂, methane (CH₄), nitrous oxide (N₂O), and water vapour","Ozone and hydrogen","Argon and neon"],
    correct_answer: 1,
    explanation: "Major greenhouse gases: CO₂ (fossil fuels), CH₄ (agriculture, natural gas, landfills — 25× CO₂ GWP), N₂O (agriculture, fertilizers — 298× GWP), H₂O vapour (largest naturally), CFCs/HFCs (refrigerants — very high GWP). O₂ and N₂ (99% of atmosphere) are NOT greenhouse gases.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The phenomenon where certain metals emit electrons when illuminated with light of sufficient frequency is used in:",
    options: ["Fluorescent lights","Photomultiplier tubes, solar cells, and automatic door sensors (photoelectric cells)","Microwave ovens","Neon signs"],
    correct_answer: 1,
    explanation: "Photoelectric effect applications: photomultiplier tubes (very sensitive light detectors in telescopes/scintillation counters), photovoltaic solar cells, photodiodes, automatic door sensors (light beam interrupted → door opens), burglar alarms, light meters in cameras.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "An object submerged in a fluid appears lighter (buoyant) because:",
    options: ["Fluid reduces gravity","Pressure increases with depth — higher pressure below the object than above creates net upward force = weight of displaced fluid (Archimedes)","The fluid fills the pores of the object","Temperature of fluid reduces object density"],
    correct_answer: 1,
    explanation: "Buoyancy: P_bottom > P_top (pressure increases with depth). Net upward pressure force = ρ_fluid × g × V_displaced = weight of fluid displaced (Archimedes' Principle). Ship floats when displaced water weight = ship weight. Submarine: adjusts water in ballast tanks to change average density.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The velocity of sound in a gas is proportional to:",
    options: ["Square root of pressure at constant density","Square root of absolute temperature (v ∝ √T)","Square of absolute temperature","Inversely proportional to temperature"],
    correct_answer: 1,
    explanation: "Speed of sound in ideal gas: v = √(γRT/M) ∝ √T. At 0°C (273 K): 331 m/s. At 100°C (373 K): 331 × √(373/273) ≈ 387 m/s. Hotter air → faster sound. Speed also higher in lighter gases (hydrogen → very fast) and lower in heavier gases (CO₂ → slower than air).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Famous Constants ---
  {
    question_text: "The value of the universal gravitational constant G is approximately:",
    options: ["9.8 m/s²","6.674 × 10⁻¹¹ N·m²/kg²","6.022 × 10²³","1.6 × 10⁻¹⁹ C"],
    correct_answer: 1,
    explanation: "G = 6.674 × 10⁻¹¹ N·m²/kg² (universal gravitational constant). Very small → gravity is the weakest fundamental force. First measured by Henry Cavendish (1798) using torsion balance. Different from g (acceleration due to gravity): g = GM/R² ≈ 9.8 m/s² at Earth's surface.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Avogadro's number (6.022 × 10²³) is the number of:",
    options: ["Molecules in 1 litre of gas","Atoms/molecules in one mole of a substance","Electrons in one coulomb","Protons in 1 gram of hydrogen"],
    correct_answer: 1,
    explanation: "Avogadro's number N_A = 6.022 × 10²³ per mole. 1 mole of any substance contains N_A entities (atoms/molecules/ions). 1 mole of C-12 weighs exactly 12 grams. Named after Amedeo Avogadro. Used to connect macroscopic (grams) to atomic scale (atomic mass units).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The Boltzmann constant (k_B) relates:",
    options: ["Force to acceleration","Temperature to average kinetic energy of particles (KE = (3/2)k_BT for monatomic ideal gas)","Electric charge to electric potential","Magnetic field to current"],
    correct_answer: 1,
    explanation: "Boltzmann constant k_B = 1.38 × 10⁻²³ J/K. Relates temperature to kinetic energy: KE = (3/2)k_BT. Links microscopic (particle energies) to macroscopic (temperature). R = N_A × k_B (gas constant = Avogadro × Boltzmann). Named after Ludwig Boltzmann.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // --- Physics in Everyday Technology ---
  {
    question_text: "How does a microphone convert sound to electrical signal?",
    options: ["By chemical reaction in a battery","By sound waves vibrating a diaphragm → moving a coil in a magnetic field (dynamic) or changing capacitance (condenser) → inducing electrical signal","By thermoelectric effect","By piezoelectric crystal only"],
    correct_answer: 1,
    explanation: "Dynamic microphone: sound → diaphragm vibrates → coil moves in magnetic field → EMF induced (Faraday's Law). Condenser microphone: sound → capacitor plate moves → capacitance changes → voltage changes. Crystal microphone: piezoelectric crystal. Speaker is reverse of dynamic microphone.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The principle behind a loudspeaker is:",
    options: ["Electroluminescence","A current-carrying coil in a magnetic field experiences a force (motor effect) → vibrates diaphragm → produces sound","Piezoelectric effect","Thermoelectric effect"],
    correct_answer: 1,
    explanation: "Loudspeaker: electrical audio signal → alternating current in voice coil → coil in permanent magnet experiences alternating force (F = BIL) → coil vibrates → moves cone (diaphragm) → produces sound waves. Exact reverse of dynamic microphone. Subwoofers for bass, tweeters for treble.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "A washing machine uses the principle of centrifugal effect to:",
    options: ["Heat the water","Dry clothes by spinning water out through small holes in the drum","Detect dirt and apply more detergent","Magnetize water to remove stains"],
    correct_answer: 1,
    explanation: "Washing machine spin cycle: high-speed rotation → centrifugal effect pushes water outward through perforations in drum → clothes are 'wrung out.' Typical spin speed: 1000–1600 RPM. Doesn't fully dry clothes (that's the dryer), but removes most water reducing drying time.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Anti-lock Braking System (ABS) in vehicles prevents wheels from locking during hard braking because:",
    options: ["ABS increases braking force beyond normal","Locked wheels slide (kinetic friction) rather than roll (rolling friction), causing loss of steering control — ABS rapidly pumps brakes to maintain rolling (static friction)","ABS uses magnetic braking","ABS increases brake pad area"],
    correct_answer: 1,
    explanation: "ABS: wheel-speed sensors detect wheel lock → modulate brake pressure (10-20 times per second) → maintains rolling contact → maximum braking force (static friction > kinetic friction) and steering control. Physics: static friction > kinetic friction → ABS stops car shorter than locked wheels.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "What type of waves are used in mobile phone communication?",
    options: ["Sound waves","Infrared waves","Radio waves (microwave frequency: 700 MHz – 5 GHz range)","Visible light"],
    correct_answer: 2,
    explanation: "Mobile phones: use radio waves (microwave range). 2G: 900/1800 MHz. 3G: 2100 MHz. 4G LTE: 700 MHz–2600 MHz. 5G: sub-6 GHz and mmWave (24-100 GHz). Higher frequency = higher data rate but shorter range and poor penetration. 5G mmWave needs dense small cell network.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Tamil Nadu Context ---
  {
    question_text: "The Kudankulam Nuclear Power Plant in Tamil Nadu uses which type of reactor?",
    options: ["Boiling Water Reactor (BWR)","Pressurized Heavy Water Reactor (PHWR)","Pressurized Water Reactor (PWR) — built with Russian technology (VVER-1000)","Fast Breeder Reactor (FBR)"],
    correct_answer: 2,
    explanation: "Kudankulam NPP (Tirunelveli district, Tamil Nadu): built with Russian assistance (Rosatom). Uses VVER-1000 (Water-Water Energetic Reactor), a Pressurized Water Reactor type. Unit 1 & 2: each 1000 MW (operational). Total 6 units of 1000 MW each planned. India's largest nuclear power plant.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Thumba Equatorial Rocket Launching Station (TERLS), where India launched its first rocket, is in:",
    options: ["Tamil Nadu","Maharashtra","Kerala","Andhra Pradesh"],
    correct_answer: 2,
    explanation: "TERLS, Thumba (near Thiruvananthapuram, Kerala): India's first rocket launching station. Located near the Earth's magnetic equator — ideal for ionospheric research. First rocket (Nike-Apache) launched November 21, 1963. Later became Vikram Sarabhai Space Centre (VSSC). PSLV manufactured here.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // --- More Concepts ---
  {
    question_text: "The period of revolution of a satellite around Earth depends on:",
    options: ["Mass of satellite","Only the altitude (radius of orbit) — T = 2π√(r³/GM)","Speed of satellite only","Mass of Earth only"],
    correct_answer: 1,
    explanation: "T = 2π√(r³/GM). Period depends on orbital radius r and Earth's mass M. NOT on satellite's mass. Geostationary: T = 24 h, r = 42,164 km. ISS: T ≈ 92 min, r ≈ 6,778 km. Moon: T = 27.3 days, r = 384,400 km. This is Kepler's 3rd law applied to Earth satellites.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The phenomenon of nuclear magnetic resonance (NMR) is the basis of:",
    options: ["X-ray imaging","MRI (Magnetic Resonance Imaging) — nuclei absorb radio waves in a magnetic field","Ultrasound imaging","PET scanning"],
    correct_answer: 1,
    explanation: "NMR: atomic nuclei (especially hydrogen protons) align in a strong magnetic field. Radio waves applied → nuclei absorb energy → relax → emit radio waves detected by receiver → computer creates image. MRI: no ionizing radiation. Excellent soft tissue contrast. Brain, spinal cord, joints, muscles.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Which of the following is an example of forced vibration?",
    options: ["A plucked guitar string vibrating","A clock pendulum swinging freely","A machine vibrating due to an engine running at a different frequency","A tuning fork struck and allowed to ring freely"],
    correct_answer: 2,
    explanation: "Forced vibration: object vibrates at frequency of an external driving force, not its natural frequency. Examples: machine parts vibrating due to engine, bridge vibrating due to wind, eardrum vibrating due to sound. When driving frequency = natural frequency: resonance occurs (amplitude greatly increases).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The refractive index of a medium can be determined by measuring:",
    options: ["The speed of sound in the medium","The critical angle for total internal reflection: n = 1/sin(C)","The wavelength of light in the medium only","The density of the medium"],
    correct_answer: 1,
    explanation: "n = 1/sin(C) for a medium surrounded by air. If C = 41.8° (glass), n = 1/sin(41.8°) = 1.5. Alternative: n = sin(i)/sin(r) from Snell's Law measurements. Critical angle method is precise and easy for transparent materials.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "A photon of light has zero rest mass but carries energy and momentum because:",
    options: ["It violates conservation laws","E = hf (energy) and p = h/λ = E/c (momentum) — from quantum and special relativity; massless particles can carry momentum at speed c","It is too small to measure","It has virtual mass"],
    correct_answer: 1,
    explanation: "Photon: zero rest mass, travels at c. Energy E = hf = pc. Momentum p = h/λ = E/c. From Special Relativity: E² = (pc)² + (m₀c²)² → for m₀ = 0: E = pc. This explains radiation pressure (solar sails), Compton scattering, and why light can be gravitationally deflected by mass.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Why does a spinning gyroscope resist changing its orientation (gyroscopic stability)?",
    options: ["Centrifugal force keeps it upright","Conservation of angular momentum: changing the spin axis requires torque; the gyroscope responds by precessing rather than toppling","Magnetic alignment with Earth's field","Friction in the bearings"],
    correct_answer: 1,
    explanation: "Gyroscopic stability: spinning gyroscope has large angular momentum L = Iω. Torque (e.g., gravity) applied → L vector changes direction (precession at 90° to applied torque) rather than flipping over. Applications: gyrocompass (ships/aircraft navigation), stabilization (satellites, bikes, motorcycles, Hubble telescope).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The first artificial Earth satellite was:",
    options: ["Explorer 1 (USA)","Sputnik 1 (USSR)","Aryabhata (India)","Vostok 1 (USSR)"],
    correct_answer: 1,
    explanation: "Sputnik 1 (Спутник): launched October 4, 1957 by the Soviet Union. First artificial Earth satellite. Orbited Earth at ~250 km altitude with 96-minute period. Transmitted radio signals detected worldwide. Triggered the Space Race. NASA was founded in response (1958).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The first human to walk on the Moon was:",
    options: ["Yuri Gagarin","Buzz Aldrin","Neil Armstrong","Michael Collins"],
    correct_answer: 2,
    explanation: "Neil Armstrong was the first human to walk on the Moon — July 20, 1969 (Apollo 11). Famous words: 'That's one small step for man, one giant leap for mankind.' Buzz Aldrin was second. Michael Collins orbited in the Command Module. July 20 is celebrated as Moon Day.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The James Webb Space Telescope (JWST), launched in 2021, primarily observes in:",
    options: ["Visible light","Ultraviolet","Infrared","X-rays"],
    correct_answer: 2,
    explanation: "JWST: launched December 25, 2021. Observes in infrared (0.6–28 μm). Positioned at L2 Lagrange point (1.5 million km from Earth). 6.5m gold-coated beryllium mirror (much larger than Hubble's 2.4m). Can peer through dust clouds and observe first galaxies after Big Bang (redshifted into IR).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The number of naturally occurring elements in the periodic table is:",
    options: ["92 (up to uranium)","94","118","86"],
    correct_answer: 0,
    explanation: "92 naturally occurring elements: Hydrogen (1) to Uranium (92). Elements 93+ (transuranium: Neptunium, Plutonium, etc.) are synthetic (created in labs/reactors). However, elements 93 (Neptunium) and 94 (Plutonium) are found in trace amounts in nature. Total elements in periodic table: 118.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The 'photoelectric cell' (photocell) uses the photoelectric effect to convert:",
    options: ["Electrical energy to light","Light energy to electrical energy (by emitting electrons when illuminated)","Heat to electricity","Sound to electricity"],
    correct_answer: 1,
    explanation: "Photocell: light-sensitive device using photoelectric or photovoltaic effect. Applications: automatic door openers, burglar alarms, exposure meters in cameras, street lights (auto on/off), solar cells (photovoltaic cells). Different from solar panels (PV effect) — traditional photocells emit free electrons.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The specific gravity of a substance is its density compared to:",
    options: ["Air at standard conditions","Mercury","Water at 4°C (densest state, 1000 kg/m³)","Seawater"],
    correct_answer: 2,
    explanation: "Specific gravity (relative density) = density of substance / density of water at 4°C. Dimensionless. SG > 1: sinks in water (iron SG=7.8, mercury SG=13.6). SG < 1: floats (wood SG~0.6, ice SG=0.917). Measured by hydrometer. SG of milk (1.027–1.033) detected by lactometer.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The working principle of sonar in submarines uses:",
    options: ["Radio waves","Light pulses (lidar)","Ultrasound waves and echo detection (time-of-flight)","Magnetic field sensing"],
    correct_answer: 2,
    explanation: "SONAR (Sound Navigation And Ranging): transmits ultrasound pulses (20 kHz–1 MHz) → sound bounces off objects → echo detected → distance = (v_sound × time)/2. Active sonar: emits and receives. Passive sonar: only listens. Dolphins and bats use biological sonar (echolocation).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "In a hydraulic press, a force of 10 N is applied on a small piston of area 2 cm². The force exerted by the large piston of area 100 cm² is:",
    options: ["10 N","50 N","200 N","500 N"],
    correct_answer: 3,
    explanation: "Pascal's Law: P = F₁/A₁ = F₂/A₂. F₁/A₁ = 10/2 = 5 N/cm². F₂ = P × A₂ = 5 × 100 = 500 N. Mechanical advantage = A₂/A₁ = 100/2 = 50. This 50-fold force multiplication is the working principle of hydraulic jacks and presses used in industries.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The SI unit of pressure (Pascal) is equivalent to:",
    options: ["N/m² (Newton per square metre)","kg/m²","J/m³","All of the above"],
    correct_answer: 3,
    explanation: "1 Pascal = 1 N/m² = 1 kg/(m·s²) = 1 J/m³ (energy density). These are all equivalent. Named after Blaise Pascal. Atmospheric pressure = 101,325 Pa = 101.325 kPa. Blood pressure: ~120/80 mmHg = 16/11 kPa. Tyre pressure: ~200–350 kPa = 2–3.5 bar.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Which law of thermodynamics is violated by a perpetual motion machine of the second kind?",
    options: ["Zeroth Law","First Law","Second Law","Third Law"],
    correct_answer: 2,
    explanation: "Perpetual motion machine of second kind: extracts heat from a reservoir and converts it completely to work (without cooling effect) — violates 2nd Law (Kelvin-Planck statement). PMM of first kind: produces work without any energy input — violates 1st Law (energy conservation). Both are impossible.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The critical temperature for superconductivity in conventional superconductors is typically:",
    options: ["Above 0°C","Around 100°C","A few degrees above absolute zero (< 30 K)","Around −100°C (173 K)"],
    correct_answer: 2,
    explanation: "Conventional superconductors (BCS theory): Tc < 30 K. Mercury: 4.2 K. Lead: 7.2 K. Niobium: 9.2 K. High-temperature superconductors (ceramic cuprates): Tc up to ~135 K. Room-temperature superconductivity remains elusive (claimed in 2023 but not yet confirmed). Used in MRI, LHC, maglev.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "A body on an inclined plane of angle θ: the component of gravity along the incline is:",
    options: ["mg·cosθ","mg·sinθ","mg·tanθ","mg/sinθ"],
    correct_answer: 1,
    explanation: "On incline at angle θ: component along incline = mg·sinθ (causes sliding). Component perpendicular to incline = mg·cosθ (normal force). Friction = μ × mg·cosθ. Object slides if mg·sinθ > friction force. Critical angle: tanθ_c = μ (coefficient of static friction).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The photoelectric work function of a metal represents:",
    options: ["The kinetic energy of emitted electrons","The minimum energy needed to remove an electron from the metal surface","The frequency of incident light","The wavelength of emitted light"],
    correct_answer: 1,
    explanation: "Work function (φ): minimum energy needed to release an electron from a metal surface. φ = hν₀ (h = Planck's constant, ν₀ = threshold frequency). KE_max = hν − φ. Different metals have different work functions: Caesium (1.9 eV), Sodium (2.3 eV), Copper (4.5 eV), Gold (5.1 eV).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The unit of electric charge (Coulomb) is equivalent to:",
    options: ["Ampere × second (A·s)","Volt × Farad","Joule × Volt","Newton per metre"],
    correct_answer: 0,
    explanation: "1 Coulomb = 1 Ampere × 1 second (Q = It). Also: 1 C = 1 V × 1 F (Q = CV). Charge of one electron: −1.602 × 10⁻¹⁹ C. One coulomb ≈ 6.24 × 10¹⁸ electron charges. A typical lightning bolt: ~5 C of charge transferred.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Which of the following is the correct order of penetrating power of nuclear radiation?",
    options: ["Gamma > Beta > Alpha (gamma most penetrating)","Alpha > Beta > Gamma","Beta > Alpha > Gamma","All are equally penetrating"],
    correct_answer: 0,
    explanation: "Penetrating power: Gamma rays (most penetrating — requires thick lead/concrete) > Beta particles (stopped by few mm aluminium) > Alpha particles (stopped by paper or a few cm air). Ionizing power: Alpha (highest ionization) > Beta > Gamma (least ionizing). α carries +2 charge, β carries ±1, γ has no charge.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The phenomenon of 'spallation' in nuclear physics involves:",
    options: ["Splitting of U-235 by neutrons","High-energy proton bombardment of a heavy nucleus causing it to eject many nucleons/fragments","Fusion of two light nuclei","Beta decay of a neutron-rich nucleus"],
    correct_answer: 1,
    explanation: "Spallation: high-energy protons (or other particles) hit a heavy target nucleus (e.g., lead, tungsten) → nucleus shatters releasing many neutrons and fragments. Used in spallation neutron sources (SNS, ISIS) to produce intense neutron beams for materials research. Proton cyclotron drives the process.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The concept of 'center of mass' is important in physics because:",
    options: ["It is where the greatest mass concentration is","It is the point that moves as if all external forces were applied there and all mass were concentrated there","It never moves in any reference frame","It is always at the geometric center"],
    correct_answer: 1,
    explanation: "Center of mass (COM): for a system, external forces cause the COM to accelerate as if all mass were concentrated there (F = Ma_cm). Internal forces don't move COM. A cricket ball's COM follows parabolic path even while it spins. Useful for analyzing complex rigid body and multi-body dynamics.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Light from the sun takes approximately how long to reach Earth?",
    options: ["1 second","8 minutes","24 hours","1 year"],
    correct_answer: 1,
    explanation: "Earth-Sun distance = 1 AU ≈ 1.5 × 10⁸ km. Speed of light = 3 × 10⁸ m/s. Time = 1.5 × 10¹¹ m / 3 × 10⁸ m/s = 500 seconds ≈ 8.3 minutes. Light from Moon: ~1.3 seconds. From nearest star (Proxima Centauri): 4.24 years. From Andromeda galaxy: 2.5 million years.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The human eye is most sensitive to which colour of light?",
    options: ["Red (~700 nm)","Blue (~450 nm)","Yellow-green (~550 nm)","Violet (~400 nm)"],
    correct_answer: 2,
    explanation: "Human eye has maximum sensitivity to yellow-green light (around 555 nm in daylight — photopic vision). Night vision (scotopic): peak shifts to ~505 nm (blue-green). This is why yellow-green is used for high-visibility jackets and emergency vehicles. Green traffic light is most visible.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  }
];

async function rpush(items) {
  const values = items.map(q => JSON.stringify(q));
  const r = await fetch(`${BASE}/pipeline`, {
    method: 'POST', headers: HDR,
    body: JSON.stringify([['RPUSH', KEY, ...values]]),
  });
  return r.json();
}

async function main() {
  console.log(`Adding ${questions.length} questions to ${KEY}...`);
  const BATCH = 50;
  let total = 0;
  for (let i = 0; i < questions.length; i += BATCH) {
    const batch = questions.slice(i, i + BATCH);
    await rpush(batch);
    total += batch.length;
    console.log(`Batch ${Math.floor(i/BATCH)+1}: pushed ${batch.length} → total added ${total}`);
  }
  console.log(`Done! Added ${total} questions to ${KEY}`);
}
main().catch(console.error);
