require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const BASE  = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
const KEY   = 'quiz:subject:physics';
const HDR   = { Authorization:`Bearer ${TOKEN}`, 'Content-Type':'application/json' };

const questions = [
  // --- Rotational Motion & Torque ---
  {
    question_text: "Torque is defined as:",
    options: ["Force × mass","Force × perpendicular distance from the axis of rotation","Mass × acceleration","Momentum / time"],
    correct_answer: 1,
    explanation: "Torque (τ) = Force × perpendicular distance (lever arm) from axis. SI unit: Newton-metre (N·m). Torque causes angular acceleration (τ = Iα). Opening a door, tightening a nut, and bicycle pedaling all involve torque.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The moment of inertia of a body depends on:",
    options: ["Mass only","Shape only","Mass distribution relative to the axis of rotation","Velocity of the body"],
    correct_answer: 2,
    explanation: "Moment of inertia (I) = Σmr². Depends on total mass AND how it is distributed relative to the rotation axis. A hollow cylinder has higher I than a solid cylinder of same mass/radius. Analogous to mass in linear motion.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "A spinning top remains upright due to the conservation of:",
    options: ["Linear momentum","Kinetic energy","Angular momentum","Potential energy"],
    correct_answer: 2,
    explanation: "Conservation of angular momentum (L = Iω): in absence of external torque, L is constant. A spinning top resists falling over (gyroscopic effect) due to its angular momentum. Also explains why ice-skaters spin faster by pulling arms in (I↓ → ω↑).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Centripetal force acts on a body in circular motion and is directed:",
    options: ["Outward from the centre (centrifugal)","Tangentially to the circle","Toward the centre of the circle","Opposite to the direction of motion"],
    correct_answer: 2,
    explanation: "Centripetal force = mv²/r, directed toward the centre. It is the net inward force needed to maintain circular motion. Provided by: gravity (satellite), tension (string), friction (car turning), normal force (roller coaster loop).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The centrifuge separates substances of different densities by using:",
    options: ["Thermal differences","Magnetic field differences","High-speed rotation creating centrifugal effect (heavy particles move outward)","Electric field differences"],
    correct_answer: 2,
    explanation: "Centrifuge: rapid rotation creates effective centrifugal effect — denser particles move outward faster. Used in: blood separation (plasma, RBC, WBC), cream from milk, uranium enrichment (gas centrifuge), removing water from clothes.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Friction ---
  {
    question_text: "The coefficient of static friction is generally:",
    options: ["Less than kinetic friction coefficient","Equal to kinetic friction coefficient","Greater than kinetic friction coefficient","Independent of the surfaces"],
    correct_answer: 2,
    explanation: "Static friction (keeping object stationary) > kinetic friction (object sliding). This is why it is harder to START moving an object than to keep it moving. Coefficient of friction (μ) is dimensionless and depends on surface materials.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Rolling friction is generally _______ than sliding friction:",
    options: ["Greater","Equal to","Less","Unpredictably different from"],
    correct_answer: 2,
    explanation: "Rolling friction << sliding friction. That is why wheels revolutionized transport. Ball bearings in machinery reduce sliding friction to rolling friction, greatly reducing energy loss. Lubrication further reduces friction.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Simple Machines ---
  {
    question_text: "The mechanical advantage of a simple machine is defined as:",
    options: ["Output force / Input distance","Output force / Input force","Input force / Output distance","Input distance / Output distance"],
    correct_answer: 1,
    explanation: "Mechanical Advantage (MA) = Load / Effort = Output force / Input force. MA > 1 means machine multiplies force. Efficiency = (MA / VR) × 100%, where VR = Velocity Ratio. Ideal machine: MA = VR (100% efficiency).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "A Class 1 lever has the fulcrum:",
    options: ["At one end","Between the effort and load","At the load end","Between the fulcrum and the effort"],
    correct_answer: 1,
    explanation: "Class 1 lever: fulcrum between effort and load (seesaw, scissors, pliers, crowbar). Class 2: load between fulcrum and effort (wheelbarrow, nutcracker). Class 3: effort between fulcrum and load (broom, tweezers, forearm). Only Class 1 can have MA<1, =1, or >1.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb"]
  },
  {
    question_text: "A single fixed pulley changes the direction of force but has a mechanical advantage of:",
    options: ["0","1 (no force multiplication, only direction change)","2","4"],
    correct_answer: 1,
    explanation: "Single fixed pulley: MA = 1 (effort = load). Only benefit: changes direction of force (e.g., you pull DOWN to lift load UP). A movable pulley: MA = 2 (effort = ½ load). Block and tackle combines pulleys for high MA.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- SHM & Oscillations ---
  {
    question_text: "In Simple Harmonic Motion (SHM), the restoring force is:",
    options: ["Constant regardless of displacement","Proportional to velocity","Proportional to displacement and directed opposite to displacement (F = −kx)","Proportional to acceleration squared"],
    correct_answer: 2,
    explanation: "SHM: F = −kx (Hooke's Law for spring). Restoring force is proportional to displacement and opposes it. Examples: spring-mass system, simple pendulum (small angles), vibrating tuning fork. Period T = 2π√(m/k) for spring.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "A spring-mass system in SHM has maximum velocity when:",
    options: ["At maximum displacement (amplitude)","At the equilibrium position (displacement = 0)","At half amplitude","When kinetic energy equals potential energy"],
    correct_answer: 1,
    explanation: "SHM energy: KE = ½mv² and PE = ½kx². At equilibrium (x=0): PE=0, KE=maximum, speed=maximum. At amplitude (x=A): KE=0, PE=maximum, speed=0. Total energy E = ½kA² (constant). KE+PE = constant throughout.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // --- Thermal Expansion ---
  {
    question_text: "When a metal rod is heated, it expands. The expansion is characterized by the:",
    options: ["Specific heat capacity","Coefficient of linear expansion (α)","Latent heat","Thermal conductivity"],
    correct_answer: 1,
    explanation: "Coefficient of linear expansion (α): ΔL = L₀αΔT. Metals expand when heated and contract when cooled. Allowance for expansion: railway tracks have gaps, bridges have expansion joints, dental fillings must match tooth expansion.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The bimetallic strip used in thermostats works on the principle of:",
    options: ["Different latent heats of two metals","Different coefficients of thermal expansion of two metals bonded together","Different densities causing bending","Different electrical resistances"],
    correct_answer: 1,
    explanation: "Bimetallic strip: two metals with different α bonded together. When heated, one expands more than the other → strip bends toward the metal with lower expansion. Used in: thermostats, circuit breakers, clocks, temperature indicators.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Water behaves anomalously: it reaches maximum density at:",
    options: ["0°C (freezing point)","100°C (boiling point)","4°C","−4°C"],
    correct_answer: 2,
    explanation: "Anomalous expansion of water: water is densest at 4°C. Below 4°C, it expands until it freezes at 0°C. This is why ice floats (less dense than liquid water). Lakes freeze from top down, allowing aquatic life to survive in cold water below ice.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Ideal Gas & Thermodynamics ---
  {
    question_text: "The ideal gas equation is:",
    options: ["PV = nRT","PV = mRT","P/V = nRT","PV = nR/T"],
    correct_answer: 0,
    explanation: "Ideal Gas Law: PV = nRT. P = pressure, V = volume, n = moles of gas, R = 8.314 J/(mol·K) (universal gas constant), T = absolute temperature (Kelvin). Combines Boyle's, Charles', and Gay-Lussac's laws.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Gay-Lussac's Law states that for a gas at constant volume:",
    options: ["Pressure is inversely proportional to temperature","Pressure is directly proportional to absolute temperature (P/T = constant)","Volume is proportional to pressure","Pressure is independent of temperature"],
    correct_answer: 1,
    explanation: "Gay-Lussac's Law: P/T = constant (at constant V and n). P₁/T₁ = P₂/T₂. Example: car tyre pressure increases when hot (temperature rises in friction/heat). Also called Amontons' Law.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The efficiency of a Carnot engine operating between temperatures T₁ (hot source) and T₂ (cold sink) is:",
    options: ["η = T₂/T₁","η = 1 − T₂/T₁","η = (T₁−T₂)/(T₁+T₂)","η = T₁/(T₁−T₂)"],
    correct_answer: 1,
    explanation: "Carnot efficiency: η = 1 − T₂/T₁ (temperatures in Kelvin). This is the maximum possible efficiency of any heat engine. Real engines are less efficient due to friction, heat losses. To maximize efficiency: increase T₁ (hot source) or decrease T₂ (cold sink).",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Entropy is a measure of:",
    options: ["Total energy of a system","Useful energy available for work","Disorder or randomness in a system","Pressure of a system"],
    correct_answer: 2,
    explanation: "Entropy (S): measure of disorder/randomness in a system. 2nd Law: ΔS ≥ 0 (entropy of isolated system increases or stays same). Melting ice, mixing gases, spreading of heat all increase entropy. Units: J/K.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // --- Electrostatics & Capacitors ---
  {
    question_text: "A capacitor stores energy in the form of:",
    options: ["Magnetic field","Electric field between its plates","Chemical energy","Gravitational potential energy"],
    correct_answer: 1,
    explanation: "Capacitor: two conducting plates separated by a dielectric. Stores charge (Q = CV) and energy (E = ½CV² = Q²/2C) in the electric field. SI unit: Farad (F). Used in: flash cameras, filters, timing circuits, power factor correction.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "When capacitors are connected in parallel, the total capacitance is:",
    options: ["Less than the smallest individual capacitance","Equal to the largest capacitance","The sum of individual capacitances (C = C₁ + C₂ + ...)","The reciprocal of the sum of reciprocals"],
    correct_answer: 2,
    explanation: "Parallel capacitors: C_total = C₁ + C₂ + ... (capacitances add). Same voltage across each. Series capacitors: 1/C_total = 1/C₁ + 1/C₂ + ... (total less than smallest). Opposite to resistors: resistors add in series, capacitors add in parallel.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "An inductor (coil) in an electric circuit stores energy in the form of:",
    options: ["Electric field","Magnetic field","Heat","Chemical bonds"],
    correct_answer: 1,
    explanation: "Inductor: coil of wire. Stores energy in magnetic field: E = ½LI². Opposes change in current (self-induction). SI unit of inductance: Henry (H). Used in: transformers, filters, chokes, resonant circuits, motors.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "In an AC circuit, the opposition to current flow due to capacitors and inductors (not resistance) is called:",
    options: ["Impedance","Reactance","Resistance","Conductance"],
    correct_answer: 1,
    explanation: "Reactance (X): frequency-dependent opposition. Capacitive reactance Xc = 1/(2πfC) — decreases with frequency. Inductive reactance XL = 2πfL — increases with frequency. Impedance Z = √(R² + X²) combines resistance and reactance.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // --- Earth's Magnetism ---
  {
    question_text: "The geographic North Pole of Earth corresponds to which magnetic pole?",
    options: ["Magnetic North Pole","Magnetic South Pole","Both (they coincide)","Neither (the poles are shifted)"],
    correct_answer: 1,
    explanation: "Earth's geographic North Pole is actually a Magnetic South Pole (south-seeking end of compass needle points north because unlike poles attract). Earth's magnetic field tilts ~11.5° from rotational axis. The magnetic poles slowly wander.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Magnetic declination is the angle between:",
    options: ["Magnetic North and Geographic North at a given location","Magnetic dip and the horizontal","Equator and magnetic equator","Earth's axis and the magnetic field direction"],
    correct_answer: 0,
    explanation: "Magnetic declination: angle between true geographic north and magnetic north (as indicated by compass). Varies by location. Navigators must correct for declination. Magnetic inclination (dip): angle between Earth's magnetic field and the horizontal.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "A compass needle aligns with:",
    options: ["Geographic North–South direction","Earth's magnetic field lines","The equator","The direction of gravity"],
    correct_answer: 1,
    explanation: "Compass needle: magnetized needle free to rotate horizontally. North-seeking pole points toward Earth's magnetic (geographic) north. Earth's magnetic field acts like a giant bar magnet. Aurora Borealis (Northern Lights) is caused by charged particles following field lines.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Light & Optical Instruments ---
  {
    question_text: "A compound microscope uses:",
    options: ["One convex lens","One concave mirror and one lens","Two convex lenses — objective (short f) and eyepiece (long f)","A prism and two lenses"],
    correct_answer: 2,
    explanation: "Compound microscope: objective lens (very short focal length, high magnification) forms real enlarged image; eyepiece (ocular lens, longer focal length) acts as magnifying glass to view the image. Total magnification = objective × eyepiece magnification.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "An astronomical telescope produces an inverted image because it uses:",
    options: ["Only concave mirrors","Two concave lenses","Objective (large aperture convex lens/mirror) and eyepiece (convex lens) — final image is inverted but distant objects don't matter","Prism for inversion"],
    correct_answer: 2,
    explanation: "Astronomical telescope: objective (large aperture, long focal length) collects light and forms real, inverted image at focus; eyepiece magnifies this image. Inverted image is acceptable for stars. Terrestrial telescope adds erecting lens/prism for upright image.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "A periscope uses which optical components to allow viewing over obstacles?",
    options: ["Two convex lenses","Two concave mirrors","Two plane mirrors (or prisms) at 45° angles","One convex and one concave lens"],
    correct_answer: 2,
    explanation: "Periscope: two plane mirrors angled at 45° (or right-angle prisms using TIR). Light enters top, reflects 90° down, reflects 90° to observer. Used in submarines, tanks, and trenches to view over obstacles. Prism periscopes give brighter images.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "In a camera, the image formed on the film/sensor is:",
    options: ["Virtual and erect","Real, inverted, and diminished","Virtual and magnified","Real and erect"],
    correct_answer: 1,
    explanation: "Camera: convex lens forms real, inverted, diminished image on film/sensor (object very far from lens → image forms at/near focus). Aperture (f-number) controls light. Shutter speed controls exposure time. ISO controls sensor sensitivity.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The human eye has a lens whose focal length can be changed by the ciliary muscles. This ability is called:",
    options: ["Astigmatism","Accommodation","Persistence of vision","Adaptation"],
    correct_answer: 1,
    explanation: "Accommodation: ciliary muscles change lens curvature (and thus focal length) to focus objects at different distances. Far objects: muscles relax, lens flattens (longer f). Near objects: muscles contract, lens bulges (shorter f). Presbyopia = loss of accommodation with age.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The near point of the normal human eye is at a distance of approximately:",
    options: ["5 cm","15 cm","25 cm","50 cm"],
    correct_answer: 2,
    explanation: "Near point = 25 cm (also called least distance of distinct vision, D = 25 cm). Magnifying power of simple microscope M = 1 + D/f. Far point = infinity (normal eye can see infinitely distant objects clearly). Near point increases with age (presbyopia).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Electromagnetism Applications ---
  {
    question_text: "Fleming's Left-Hand Rule gives the direction of force on a current-carrying conductor in a magnetic field. The three fingers represent:",
    options: ["Current, Voltage, Force","Magnetic field (forefinger), Current (middle finger), Force (thumb)","Force, Field, Flux","North pole, South pole, Field"],
    correct_answer: 1,
    explanation: "Fleming's Left-Hand Rule (for motors): Forefinger = Field direction (B), Middle finger = Current direction (I), Thumb = direction of Force/Motion on conductor. Right-Hand Rule is used for generators (opposite — finding induced current direction).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The working principle of an induction cooktop is:",
    options: ["Radiant heat from electric coils","Electromagnetic induction creating eddy currents that heat the ferromagnetic cookware","Microwave radiation heating the food","Conduction from a heated ceramic surface"],
    correct_answer: 1,
    explanation: "Induction cooktop: high-frequency AC creates alternating magnetic field → induces eddy currents in ferromagnetic cookware → currents heat the pot (I²R heating). Only magnetic-base cookware works. Fast, efficient (90%+), safe (surface stays cool), and precise temperature control.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Eddy currents are induced in conductors by:",
    options: ["Direct current flowing through them","Changing magnetic fields inducing circular currents within the conductor","Static electric charges","Vibration of the conductor"],
    correct_answer: 1,
    explanation: "Eddy currents: circular (swirling) induced currents in bulk conductors due to changing magnetic flux. Cause heating (energy loss in transformers — laminations reduce them). Useful in: induction cooktops, magnetic braking (trains), metal detectors, speedometers.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "A generator (dynamo) converts:",
    options: ["Electrical energy to mechanical energy","Mechanical energy to electrical energy using electromagnetic induction","Chemical energy to electrical energy","Heat to electricity using Seebeck effect"],
    correct_answer: 1,
    explanation: "Generator: mechanical energy (turbine rotation) → electrical energy. Rotating coil in magnetic field → changing flux → induced EMF (Faraday's Law). AC generators produce alternating current. DC generators use split-ring commutator.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Atomic Structure ---
  {
    question_text: "The quantum number that describes the shape of an electron orbital is:",
    options: ["Principal quantum number (n)","Azimuthal (angular momentum) quantum number (l)","Magnetic quantum number (ml)","Spin quantum number (ms)"],
    correct_answer: 1,
    explanation: "Quantum numbers: n (principal) = energy level/size, l (azimuthal) = shape (l=0: s, l=1: p, l=2: d, l=3: f), ml (magnetic) = orientation in space, ms (spin) = ±½. Pauli Exclusion Principle: no two electrons in same atom can have all four quantum numbers identical.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Heisenberg's Uncertainty Principle states that it is impossible to simultaneously determine both _______ with perfect precision:",
    options: ["Mass and velocity","Position and momentum","Energy and mass","Charge and spin"],
    correct_answer: 1,
    explanation: "Heisenberg Uncertainty Principle: Δx·Δp ≥ ℏ/2. Greater precision in position → greater uncertainty in momentum (and vice versa). Not a measurement limitation — it's fundamental to nature. Also: ΔE·Δt ≥ ℏ/2. Basis of quantum mechanics.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The mass number of an atom is:",
    options: ["Number of protons only","Number of neutrons only","Number of protons + number of neutrons","Atomic mass in grams"],
    correct_answer: 2,
    explanation: "Mass number (A) = protons (Z) + neutrons (N). Atomic number (Z) = protons = electrons (in neutral atom). Isotopes have same Z, different A. E.g., Carbon-12 (6p, 6n) and Carbon-14 (6p, 8n). Both are carbon isotopes.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Nuclear binding energy is the energy required to:",
    options: ["Ionize the atom (remove electrons)","Split the nucleus into individual protons and neutrons","Accelerate the nucleus to light speed","Initiate a chain reaction"],
    correct_answer: 1,
    explanation: "Binding energy: energy needed to completely separate all protons and neutrons in a nucleus. Related to mass defect: Δm = (masses of free nucleons) − (mass of nucleus). E = Δmc². Iron-56 has highest binding energy per nucleon — most stable nucleus.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // --- Relativity ---
  {
    question_text: "According to Einstein's Special Theory of Relativity, time dilation means that:",
    options: ["Clocks run faster in stronger gravitational fields","Moving clocks run slower relative to a stationary observer","Time is absolute and the same for all observers","Clocks run faster when moving quickly"],
    correct_answer: 1,
    explanation: "Time dilation: moving clock runs slower (t' = t/√(1−v²/c²)). GPS satellites run slightly fast (general relativity) and slightly slow (special relativity) — both corrections are needed for GPS accuracy. Twin paradox: traveling twin ages slower.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "General Theory of Relativity describes gravity as:",
    options: ["A force between masses (like Newton)","Curvature of spacetime caused by mass and energy","An electromagnetic phenomenon","A quantum mechanical effect"],
    correct_answer: 1,
    explanation: "General Relativity (Einstein, 1915): mass/energy curves spacetime; other objects follow curved paths (geodesics) — this appears as gravity. Confirmed by: light bending around Sun (1919), gravitational waves (LIGO 2015), black holes (Event Horizon Telescope 2019).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // --- Astrophysics ---
  {
    question_text: "A black hole is an object whose gravity is so strong that even light cannot escape. The boundary from which nothing escapes is called the:",
    options: ["Photon sphere","Event horizon","Schwarzschild radius boundary (event horizon)","Singularity"],
    correct_answer: 2,
    explanation: "Event horizon (= Schwarzschild radius for non-rotating black holes): boundary beyond which escape velocity > c (light speed). Inside: even light cannot escape. The singularity is the mathematical point of infinite density at the centre. First photographed: M87* (2019, Event Horizon Telescope).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The Hertzsprung-Russell (HR) diagram plots stars by their:",
    options: ["Mass vs. radius","Luminosity (or absolute magnitude) vs. surface temperature (or spectral type)","Age vs. size","Distance vs. brightness"],
    correct_answer: 1,
    explanation: "HR diagram: luminosity (y-axis) vs. surface temperature (x-axis, decreasing left to right). Main sequence: Sun-like stars fusing hydrogen. Red giants: old, expanded stars. White dwarfs: dense remnants. The Sun is a main-sequence G-type yellow dwarf star.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "A light year is the distance light travels in one year. Its approximate value is:",
    options: ["9.46 × 10¹² km","9.46 × 10⁸ km","3.26 parsecs","1.5 × 10⁸ km"],
    correct_answer: 0,
    explanation: "1 light year = 9.46 × 10¹² km = 9.46 × 10¹⁵ m. The nearest star (Proxima Centauri) is 4.24 light years away. 1 parsec = 3.26 light years. 1 Astronomical Unit (AU) = 1.5 × 10⁸ km (Earth-Sun distance).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Pulsars are rapidly rotating:",
    options: ["White dwarf stars","Neutron stars emitting regular pulses of electromagnetic radiation","Black holes","Red giant stars"],
    correct_answer: 1,
    explanation: "Pulsar (pulsating star): rapidly rotating neutron star (1–4 ms to a few seconds period) emitting beams of electromagnetic radiation from magnetic poles — like a cosmic lighthouse. Discovered by Jocelyn Bell Burnell in 1967. Used as precise cosmic clocks.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The cosmic microwave background (CMB) radiation is evidence for the:",
    options: ["Steady State theory of the universe","Big Bang theory — afterglow of the early hot universe","Expansion of galaxies","Dark matter in the universe"],
    correct_answer: 1,
    explanation: "CMB: faint thermal radiation filling the universe (~2.7 K). Predicted by Gamow (1948), discovered by Penzias and Wilson (1964) — won Nobel Prize. It's the 'afterglow' of the Big Bang (380,000 years after BB when universe cooled enough for atoms to form).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // --- Environmental Physics ---
  {
    question_text: "The greenhouse effect occurs because greenhouse gases in the atmosphere:",
    options: ["Reflect all solar radiation back to space","Absorb and re-radiate infrared (heat) radiation from Earth's surface, warming it","Block UV radiation from the Sun","Absorb visible light from the Sun"],
    correct_answer: 1,
    explanation: "Greenhouse effect: solar radiation (visible) passes through atmosphere → warms Earth → Earth emits IR radiation → greenhouse gases (CO₂, CH₄, H₂O, N₂O) absorb and re-emit IR → atmosphere warms. Natural GHE keeps Earth 33°C warmer than it would be without it.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The ozone layer in the stratosphere absorbs mainly:",
    options: ["Infrared radiation","Visible light","Ultraviolet (UV) radiation","Gamma rays"],
    correct_answer: 2,
    explanation: "Ozone (O₃) layer: 15–35 km altitude in stratosphere. Absorbs harmful UV-B and UV-C radiation from Sun. CFCs (chlorofluorocarbons) destroy ozone. Montreal Protocol (1987) banned CFCs. Ozone hole forms over Antarctica each spring.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Nuclear Physics & Reactors ---
  {
    question_text: "The moderator in a nuclear reactor is used to:",
    options: ["Absorb excess neutrons","Slow down fast neutrons to thermal energies to sustain fission chain reaction","Cool the reactor","Shield radiation"],
    correct_answer: 1,
    explanation: "Moderator: slows fast neutrons produced in fission to thermal (slow) neutrons, which are much more effective at inducing further fission in U-235. Materials: heavy water (D₂O), graphite, ordinary water. India's PHWR reactors use heavy water as moderator.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Control rods in a nuclear reactor are made of materials like boron or cadmium that:",
    options: ["Slow down neutrons","Generate more neutrons","Absorb neutrons to control the rate of fission","Shield the reactor from radiation"],
    correct_answer: 2,
    explanation: "Control rods: absorb excess neutrons, controlling fission rate. Insert rods → absorb more neutrons → fewer fissions → reactor power decreases. Withdraw rods → more neutrons available → more fissions → power increases. SCRAM = emergency full insertion of all control rods.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "India's first nuclear power plant was established at:",
    options: ["Rawatbhata, Rajasthan","Narora, UP","Tarapur, Maharashtra","Kaiga, Karnataka"],
    correct_answer: 2,
    explanation: "Tarapur Atomic Power Station (TAPS): India's first nuclear power plant, commissioned in 1969. Located in Palghar district, Maharashtra. Built with US assistance (Boiling Water Reactors). India has 22 nuclear reactors across 7 plants with ~7480 MW capacity.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Chernobyl (1986) and Fukushima (2011) nuclear accidents were classified as Level 7 on the:",
    options: ["Richter Scale","Sievert Scale","International Nuclear and Radiological Event Scale (INES)","Geiger-Müller Scale"],
    correct_answer: 2,
    explanation: "INES (International Nuclear Event Scale): 0–7, with 7 being major accident (Chernobyl 1986, Fukushima 2011). Three Mile Island (USA, 1979) was Level 5. INES is published by IAEA (International Atomic Energy Agency), headquartered in Vienna.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // --- Space & Satellites ---
  {
    question_text: "Orbital velocity of a satellite close to Earth's surface is approximately:",
    options: ["3.9 km/s","7.9 km/s","11.2 km/s","17.7 km/s"],
    correct_answer: 1,
    explanation: "First cosmic velocity (orbital velocity at Earth's surface): v = √(gR) ≈ 7.9 km/s. Satellites at low Earth orbit (~400 km) travel at ~7.7 km/s. ISS orbits at ~408 km, speed ~27,600 km/h (~7.67 km/s). Completes ~15.5 orbits per day.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "ISRO's communication satellites are placed in geostationary orbit because they:",
    options: ["Are cheaper to launch","Can be seen from the entire Earth","Appear stationary relative to Earth, enabling continuous coverage of a fixed region","Have lower radiation exposure"],
    correct_answer: 2,
    explanation: "Geostationary satellites: appear stationary (orbital period = 24 hours = Earth's rotation). Cover ~42% of Earth's surface from one satellite. INSAT/GSAT series: India's communication/weather satellites. Three satellites can cover almost the entire globe.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Chandrayaan-3 successfully soft-landed near the Moon's south pole on:",
    options: ["July 14, 2023","August 23, 2023","September 2, 2023","October 15, 2023"],
    correct_answer: 1,
    explanation: "Chandrayaan-3: ISRO's mission landed on Moon's south pole on August 23, 2023. India became the 4th country to soft-land on Moon and first to land near south pole. Vikram lander and Pragyan rover confirmed presence of sulphur and other elements.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Measurement Instruments ---
  {
    question_text: "A Vernier caliper can measure with a precision of:",
    options: ["1 mm","0.1 mm (0.01 cm)","1 cm","0.001 mm"],
    correct_answer: 1,
    explanation: "Vernier caliper: precision = 1 MSD (main scale division) − 1 VSD (vernier scale division). Least count = 0.1 mm (0.01 cm) typically. Can measure internal diameter, external diameter, and depth. Invented by Pierre Vernier in 1631.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "A screw gauge (micrometer) measures with a precision of:",
    options: ["0.1 mm","0.01 mm (0.001 cm)","1 mm","0.001 mm"],
    correct_answer: 1,
    explanation: "Screw gauge (micrometer screw gauge): least count = 0.01 mm = 10 μm. Principle: screw moves one pitch per revolution. Pitch = 0.5 mm, thimble has 50 divisions → LC = 0.5/50 = 0.01 mm. Measures wire diameter, ball diameter, paper thickness.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "A speedometer in a vehicle measures:",
    options: ["Distance traveled","Average speed","Instantaneous speed","Acceleration"],
    correct_answer: 2,
    explanation: "Speedometer: measures instantaneous speed (km/h or mph) at any moment. Works by measuring rotation speed of the drivetrain via magnetic eddy current mechanism or electronic pulse counting. Odometer measures total distance traveled.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb"]
  },
  {
    question_text: "A seismograph is used to detect and record:",
    options: ["Wind speed and direction","Earthquakes (seismic waves)","Atmospheric pressure","Magnetic field variations"],
    correct_answer: 1,
    explanation: "Seismograph: detects and records seismic waves from earthquakes. Records ground motion (displacement/velocity/acceleration). Richter Scale (Charles Richter, 1935): logarithmic scale of earthquake magnitude. Each unit increase = 10× ground motion amplitude, 31.6× energy.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Hydraulics & Applications ---
  {
    question_text: "Hydraulic brakes in vehicles work on the principle of:",
    options: ["Boyle's Law","Pascal's Law — pressure transmitted equally throughout the fluid","Bernoulli's Principle","Archimedes' Principle"],
    correct_answer: 1,
    explanation: "Hydraulic brakes: pressing brake pedal → master cylinder pressurizes brake fluid → Pascal's Law transmits pressure equally to all four wheel cylinders → brake pads press against discs/drums. Brake fluid (DOT rated) is nearly incompressible.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The hydraulic jack can lift heavy loads because:",
    options: ["It uses a large motor","Pascal's Law: small force on small piston creates same pressure transmitted to large piston with larger area → larger force","Hydraulic fluid is very strong","It converts electrical energy to mechanical energy"],
    correct_answer: 1,
    explanation: "Hydraulic jack: F₁/A₁ = F₂/A₂ (Pascal's Law). Small force on small piston → high pressure → large force on large piston. Mechanical advantage = A₂/A₁. A small input force can lift a car. Used in: car jacks, construction equipment, aircraft landing gear.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Waves & Applications ---
  {
    question_text: "Radio waves used in AM (Amplitude Modulation) radio have frequencies in the range of:",
    options: ["20–20,000 Hz","540–1600 kHz","88–108 MHz","3–30 GHz"],
    correct_answer: 1,
    explanation: "AM radio: 540 kHz–1600 kHz (medium wave). FM radio: 88–108 MHz. VHF/UHF television. Microwave: GHz range. Radio waves (lowest frequency EM waves) can travel long distances by reflecting off the ionosphere (AM) or line-of-sight (FM). Named by Heinrich Hertz.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Radar (Radio Detection And Ranging) works by:",
    options: ["Sending light pulses and detecting reflections","Sending radio waves and detecting their reflections to determine distance and speed of objects","Measuring magnetic field disturbances","Using sound waves to detect objects"],
    correct_answer: 1,
    explanation: "Radar: transmits radio wave pulse → reflects off target → returned signal measured. Distance = (speed × time)/2. Doppler radar measures speed from frequency shift. Used in: air traffic control, weather forecasting, speed guns, military. Developed in WWII.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Microwave ovens heat food by causing:",
    options: ["Infrared radiation to warm food surfaces","Water molecules in food to vibrate and rotate (dielectric heating) at 2.45 GHz","Conduction from hot walls","Ultraviolet sterilization"],
    correct_answer: 1,
    explanation: "Microwave oven: 2.45 GHz microwaves cause water molecules (and fats/sugars) to rotate/vibrate rapidly → friction → heat. Heats food uniformly from inside. Metal reflects microwaves (sparking). Invented accidentally by Percy Spencer (Raytheon, 1945) using a magnetron.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Properties of Matter ---
  {
    question_text: "Young's Modulus is a measure of:",
    options: ["Resistance to shear stress","Resistance to bulk compression","The stiffness of a material under tensile or compressive stress (stress/strain)","The elasticity of fluids"],
    correct_answer: 2,
    explanation: "Young's Modulus (E) = Stress / Strain = (F/A) / (ΔL/L). SI unit: Pascal (Pa). High E = stiff material. Steel: ~200 GPa, rubber: ~0.01 GPa. Determines how much a material stretches under load. Used in engineering design.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Hooke's Law states that within the elastic limit, the extension of a spring is:",
    options: ["Inversely proportional to the applied force","Independent of the applied force","Directly proportional to the applied force (F = kx)","Proportional to the square of the applied force"],
    correct_answer: 2,
    explanation: "Hooke's Law: F = kx (k = spring constant, N/m). Valid within elastic limit. Beyond elastic limit: material deforms permanently (plastic deformation). Spring constant measures stiffness: higher k = stiffer spring. Named after Robert Hooke (1660).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Photonics & Modern Applications ---
  {
    question_text: "Solar cells convert light energy to electrical energy using the:",
    options: ["Thermoelectric effect","Photoelectric effect (photovoltaic effect)","Piezoelectric effect","Electromagnetic induction"],
    correct_answer: 1,
    explanation: "Solar cell (photovoltaic cell): photons with sufficient energy knock electrons loose in semiconductor (silicon p-n junction) → creates voltage and current. Photovoltaic effect (Becquerel, 1839). Efficiency: ~20% (commercial), up to ~47% (multi-junction lab cells).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Holography creates three-dimensional images using:",
    options: ["Multiple cameras at different angles","Interference pattern of laser light recorded on a photographic medium","Polarized light and LCD screens","Two overlapping camera images"],
    correct_answer: 1,
    explanation: "Holography (Dennis Gabor, Nobel 1971): laser beam splits into reference beam and object beam; their interference pattern is recorded on film (hologram). When illuminated with laser, the 3D image is reconstructed. Used in: security (credit card holograms), art, data storage.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The Seebeck effect (used in thermocouples) refers to:",
    options: ["Generation of current when a material is stressed","Emission of electrons when metal is illuminated","Generation of voltage at junctions of two dissimilar metals when their junctions are at different temperatures","Cooling effect when current passes through a junction of two materials"],
    correct_answer: 2,
    explanation: "Seebeck effect (1821): two different conductors joined at two junctions at different temperatures → produces EMF. Basis of thermocouple (temperature measurement). Peltier effect (reverse): current through junction → heat transfer (used in thermoelectric coolers/generators).",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // --- Famous Experiments ---
  {
    question_text: "Millikan's Oil Drop Experiment determined:",
    options: ["Mass of proton","Charge of electron (e = 1.6 × 10⁻¹⁹ C)","Speed of light","Planck's constant"],
    correct_answer: 1,
    explanation: "Millikan's Oil Drop Experiment (Robert Millikan, 1909): tiny charged oil droplets suspended in electric field against gravity. Measured the smallest possible charge = charge of one electron = 1.6 × 10⁻¹⁹ C. Nobel Prize 1923.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Young's Double Slit Experiment proved the wave nature of light by demonstrating:",
    options: ["Photoelectric effect","Diffraction of light","Interference fringes (alternating bright and dark bands)","Polarization of light"],
    correct_answer: 2,
    explanation: "Young's Double Slit (Thomas Young, 1801): coherent light through two slits produces alternating bright (constructive) and dark (destructive) interference fringes on a screen. Wavelength λ = yd/L (y=fringe spacing, d=slit separation, L=slit-screen distance).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The Michelson-Morley Experiment (1887) failed to detect the 'luminiferous ether' and led to the conclusion that:",
    options: ["Light is a particle","Speed of light is constant regardless of the observer's motion (helped lead to Special Relativity)","Earth is stationary","Ether exists but is very thin"],
    correct_answer: 1,
    explanation: "Michelson-Morley Experiment: designed to detect Earth's motion through 'ether' (hypothetical medium for light). Result: no ether detected — speed of light is the same in all directions. This null result was key evidence that led to Einstein's Special Relativity.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // --- More Units & Conversions ---
  {
    question_text: "1 kilowatt-hour (kWh), the unit of electrical energy used in electricity bills, equals:",
    options: ["3.6 × 10³ J","3.6 × 10⁶ J","1000 Wh = 3.6 × 10⁶ J","Both B and C"],
    correct_answer: 3,
    explanation: "1 kWh = 1 kW × 1 hour = 1000 W × 3600 s = 3,600,000 J = 3.6 × 10⁶ J = 3.6 MJ. 1 unit of electricity = 1 kWh. A 100W bulb burning for 10 hours uses 1 kWh (1 unit). This is the commercial unit of electrical energy.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The unit of luminous intensity is:",
    options: ["Lumen","Lux","Candela","Watt"],
    correct_answer: 2,
    explanation: "Candela (cd): SI base unit of luminous intensity. Lumen (lm): total luminous flux (candela × steradian). Lux (lx): illuminance (lumens per square metre). Bright sunlight ≈ 100,000 lux. Office lighting: 300–500 lux. A wax candle ≈ 1 candela.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The unit of magnetic flux is:",
    options: ["Tesla (T)","Gauss (G)","Weber (Wb)","Ampere-metre"],
    correct_answer: 2,
    explanation: "Weber (Wb): SI unit of magnetic flux (Φ = B × A). 1 Wb = 1 V·s = 1 T·m². Tesla is magnetic flux density (B = Φ/A, SI unit T = Wb/m²). 1 Gauss = 10⁻⁴ Tesla (CGS unit). Earth's field: ~25–65 microtesla = 0.25–0.65 Gauss.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // --- Gravitation Details ---
  {
    question_text: "The variation of g (acceleration due to gravity) with depth below Earth's surface follows:",
    options: ["g increases linearly with depth","g decreases linearly with depth (g_depth = g(1 - d/R))","g remains constant throughout","g first increases then decreases"],
    correct_answer: 1,
    explanation: "At depth d: g_d = g(1 − d/R). At Earth's centre: g = 0. At altitude h: g_h = g/(1 + h/R)². g decreases both above and below Earth's surface, but differently. g is maximum at sea level; slightly higher at poles than equator (Earth is flattened at poles).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Kepler's Third Law states that the square of a planet's orbital period is:",
    options: ["Proportional to the orbital radius","Inversely proportional to mass","Proportional to the cube of its semi-major axis (T² ∝ R³)","Constant for all planets"],
    correct_answer: 2,
    explanation: "Kepler's Third Law (Law of Periods): T² ∝ a³. T² = (4π²/GM) × a³. Derived from Newton's gravity + circular orbit: planets farther from Sun have longer periods. Earth: T=1 year, a=1 AU. Mars: T=1.88 years, a=1.52 AU.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // --- Electricity Details ---
  {
    question_text: "Kirchhoff's Current Law (KCL) states that:",
    options: ["Voltage around any closed loop = 0","The algebraic sum of currents at any node (junction) = 0 (conservation of charge)","Current in a series circuit is additive","Resistance is proportional to current"],
    correct_answer: 1,
    explanation: "Kirchhoff's Laws: KCL (Junction Rule): sum of currents entering junction = sum leaving (ΣI = 0). Basis: conservation of charge. KVL (Loop Rule): sum of voltage drops around any closed loop = 0 (ΣV = 0). Basis: conservation of energy.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The Wheatstone bridge is used to accurately measure:",
    options: ["Temperature","Unknown electrical resistance","Current","Capacitance"],
    correct_answer: 1,
    explanation: "Wheatstone bridge: four resistors in diamond configuration with galvanometer in the middle. When bridge is balanced (galvanometer reads zero): P/Q = R/S → unknown resistance S = QR/P. Used in strain gauges, temperature sensors (RTDs).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Additional Physics ---
  {
    question_text: "The Doppler shift of light from distant galaxies toward longer wavelengths (red) is called:",
    options: ["Blueshift","Redshift (evidence that galaxies are moving away — universe is expanding)","Dispersion","Diffraction"],
    correct_answer: 1,
    explanation: "Redshift: galaxies moving away → light wavelength stretched → shifted toward red end of spectrum. Hubble (1929) discovered most galaxies are redshifted → universe is expanding. Cosmic redshift is evidence for Big Bang. Blueshift: object approaching (Andromeda galaxy).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Gravitational waves detected by LIGO in 2015 were produced by:",
    options: ["Nuclear explosions","The merger of two neutron stars","The merger of two black holes (each ~30 solar masses)","A supernova explosion"],
    correct_answer: 2,
    explanation: "LIGO (Laser Interferometer Gravitational-Wave Observatory): first detection September 14, 2015 (announced February 2016). Two black holes (29 and 36 solar masses) merging → produced spacetime ripples (gravitational waves). Nobel Prize 2017: Weiss, Barish, Thorne.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Photoelectric effect occurs only if the frequency of incident light is:",
    options: ["Below the threshold frequency","Equal to the threshold frequency","Equal to or above the threshold frequency","Proportional to intensity"],
    correct_answer: 2,
    explanation: "Photoelectric effect: electrons emitted from metal surface only if photon energy hf ≥ Work function (φ). Threshold frequency ν₀ = φ/h. Below ν₀: no emission regardless of intensity. Above ν₀: higher frequency → higher max kinetic energy of electrons.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The Pauli Exclusion Principle states that in an atom, no two electrons can have:",
    options: ["The same energy","The same spin","All four quantum numbers the same","The same orbital shape"],
    correct_answer: 2,
    explanation: "Pauli Exclusion Principle (Wolfgang Pauli, Nobel 1945): no two fermions (electrons, protons, neutrons) in the same quantum system can occupy the same quantum state simultaneously (same set of four quantum numbers). Explains the structure of the periodic table.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The intensity of radiation from a point source decreases with distance according to:",
    options: ["Inverse of distance (1/r)","Inverse square of distance (1/r²)","Square of distance (r²)","Cube of distance (1/r³)"],
    correct_answer: 1,
    explanation: "Inverse Square Law: Intensity I ∝ 1/r². Applies to: light, sound (in open air), gravity, electric fields, radiation. Double the distance → intensity becomes ¼. This is because energy spreads over spherical surface area (4πr²).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Terminal velocity is reached when a falling object:",
    options: ["Hits the ground","Has zero velocity momentarily","Experiences drag force equal to gravity (net force = 0, constant velocity)","Reaches the speed of sound"],
    correct_answer: 2,
    explanation: "Terminal velocity: drag force = gravitational force → net force = 0 → acceleration = 0 → constant (terminal) velocity. Skydiver before parachute: ~200 km/h; with parachute: ~20 km/h. Raindrop, dust particle, etc. all reach terminal velocity.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The Magnus Effect explains why a spinning ball curves in flight because:",
    options: ["Spin increases gravity on one side","The air resistance is reduced by spinning","Spinning creates pressure differences (higher spin velocity + airflow = lower pressure on one side)","The ball becomes lighter when spinning"],
    correct_answer: 2,
    explanation: "Magnus Effect: spinning ball drags air with it — one side has higher speed (spin + air flow) → lower pressure; other side lower speed → higher pressure. Net force pushes ball toward lower pressure side. Used in: cricket swing bowling, soccer free kicks, baseball curveballs, golf topspin.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The phenomenon of fluorescence involves:",
    options: ["Emission of light by a heated body","Absorption of UV light and immediate emission of visible light (lower energy, longer wavelength)","Continued emission of light after removal of excitation source (phosphorescence)","Reflection of light from a polished surface"],
    correct_answer: 1,
    explanation: "Fluorescence: absorbs high-energy radiation (UV) → excited electrons → immediate emission of lower-energy visible light (within ~10⁻⁸ seconds). Fluorescent tubes, highlighter pens, fluorescent minerals, biological staining. Phosphorescence: delayed emission (glow-in-dark).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "A transistor can be used as an amplifier or a switch. It was invented by:",
    options: ["Thomas Edison","William Shockley, Walter Brattain, and John Bardeen (Bell Labs, 1947)","Nikola Tesla","Lee De Forest"],
    correct_answer: 1,
    explanation: "Transistor invented at Bell Labs in 1947 by Shockley, Brattain, and Bardeen (Nobel Prize 1956). Replaced vacuum tubes: smaller, lower power, more reliable. Foundation of modern electronics — every computer chip has billions of transistors.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The unit of electrical resistance is:",
    options: ["Ampere","Volt","Ohm (Ω)","Siemens"],
    correct_answer: 2,
    explanation: "Ohm (Ω): SI unit of electrical resistance. Named after Georg Simon Ohm. R = V/I. Siemens (S) = 1/Ω = unit of conductance (reciprocal of resistance). Resistivity (ρ) = RA/L: material property. Copper has very low resistivity (good conductor).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The phenomenon of 'pair production' in nuclear physics refers to:",
    options: ["Two protons combining to form a deuteron","A gamma ray photon converting into an electron-positron pair near a nucleus","Two neutrons forming a helium nucleus","Alpha decay of a heavy nucleus"],
    correct_answer: 1,
    explanation: "Pair production: high-energy gamma photon (E ≥ 1.022 MeV = 2 × electron rest mass × c²) converts into electron-positron pair in the electric field of a nucleus. Reverse: pair annihilation — electron and positron annihilate → two gamma photons of 0.511 MeV each.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Standard Model of particle physics identifies which as the fundamental particles?",
    options: ["Atoms and molecules","Quarks, leptons, and bosons (force carriers)","Protons, neutrons, and electrons","Hadrons and mesons"],
    correct_answer: 1,
    explanation: "Standard Model: 6 quarks (up, down, charm, strange, top, bottom), 6 leptons (electron, muon, tau + their neutrinos), and gauge bosons (photon, W, Z bosons, gluons). Higgs boson discovered at CERN LHC in 2012. Protons and neutrons are made of quarks.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Planck's constant (h) has the value approximately:",
    options: ["9.8 m/s²","6.626 × 10⁻³⁴ J·s","3 × 10⁸ m/s","1.6 × 10⁻¹⁹ C"],
    correct_answer: 1,
    explanation: "Planck's constant h = 6.626 × 10⁻³⁴ J·s. Introduced by Max Planck (1900) to explain black body radiation. E = hf (photon energy). ℏ = h/2π = 1.055 × 10⁻³⁴ J·s (reduced Planck's constant). Fundamental constant of quantum mechanics.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The phenomenon of 'total internal reflection' is used in medical endoscopy because:",
    options: ["Endoscopes use X-rays which undergo TIR","Flexible glass/plastic fibers carry light around bends via TIR, enabling viewing inside body cavities","Mirrors inside the endoscope rotate","Ultrasound undergoes TIR in soft tissue"],
    correct_answer: 1,
    explanation: "Endoscope: flexible optical fiber bundle carries light (illumination) and image from inside the body via TIR. Cold light source prevents burning. Enables: examination of stomach (gastroscopy), colon (colonoscopy), joints (arthroscopy), lungs (bronchoscopy) without major surgery.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The speed of light in a medium is less than in vacuum. The ratio of speed in vacuum to speed in the medium is called:",
    options: ["Reflection coefficient","Refraction coefficient","Refractive index (n = c/v)","Dispersion index"],
    correct_answer: 2,
    explanation: "Refractive index (n) = c/v = sin(i)/sin(r) (Snell's Law). n_water ≈ 1.33, n_glass ≈ 1.5, n_diamond = 2.42. Higher n → slower light → more bending. Diamond's high n creates brilliant sparkle. Denser medium → higher refractive index.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Torricelli's experiment (1643) demonstrated that atmospheric pressure can support a column of mercury approximately:",
    options: ["76 cm (760 mm) tall","100 cm tall","10 m tall","0.1 m tall"],
    correct_answer: 0,
    explanation: "Torricelli: inverted mercury tube in mercury bowl → mercury column of 760 mm (76 cm) = 1 atm. Atmospheric pressure = ρgh = 13,600 × 9.8 × 0.76 ≈ 101,325 Pa. Water would need a column of ~10.3 m. This principle led to the development of the barometer.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Which physical quantity is conserved in an elastic collision?",
    options: ["Kinetic energy only","Momentum only","Both kinetic energy and momentum","Neither — energy is lost"],
    correct_answer: 2,
    explanation: "Elastic collision: both momentum AND kinetic energy are conserved. Inelastic collision: only momentum conserved (KE is lost to heat/sound/deformation). Perfectly inelastic: objects stick together, maximum KE loss. Billiard ball collisions are approximately elastic.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Snell's Law of refraction is expressed as:",
    options: ["n₁sinθ₁ = n₂sinθ₂","n₁cosθ₁ = n₂cosθ₂","sinθ₁/sinθ₂ = v₁/v₂ only","n₁θ₁ = n₂θ₂"],
    correct_answer: 0,
    explanation: "Snell's Law: n₁sinθ₁ = n₂sinθ₂ (where θ is angle from the normal). Also: n₁v₁ = n₂v₂ is wrong — actually n = c/v so n₁/n₂ = v₂/v₁ = sinθ₂/sinθ₁. Light bends toward normal when entering denser medium (n₂ > n₁).",
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
