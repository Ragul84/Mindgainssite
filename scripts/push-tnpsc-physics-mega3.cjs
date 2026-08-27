require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const BASE  = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
const KEY   = 'quiz:subject:physics';
const HDR   = { Authorization:`Bearer ${TOKEN}`, 'Content-Type':'application/json' };

const questions = [
  // --- Projectile Motion ---
  {
    question_text: "The horizontal range of a projectile is maximum when the angle of projection is:",
    options: ["30°","45°","60°","90°"],
    correct_answer: 1,
    explanation: "Range R = u²sin(2θ)/g. Maximum when sin(2θ) = 1 → 2θ = 90° → θ = 45°. At 45°, R_max = u²/g. Complementary angles (30° and 60°) give the same range. A ball thrown at 45° travels farthest horizontally.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "In projectile motion (neglecting air resistance), the horizontal component of velocity:",
    options: ["Increases throughout the flight","Decreases due to gravity","Remains constant throughout the flight","Becomes zero at the highest point"],
    correct_answer: 2,
    explanation: "Projectile motion: horizontal velocity (v_x = ucosθ) is constant — no horizontal force acts (neglecting air resistance). Vertical velocity changes due to gravity (v_y =usinθ − gt). Only the vertical component is zero at the highest point.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The trajectory of a projectile (path traced) in the absence of air resistance is a:",
    options: ["Straight line","Circle","Parabola","Ellipse"],
    correct_answer: 2,
    explanation: "Projectile trajectory is a parabola: y = x·tanθ − gx²/(2u²cos²θ). The vertical displacement varies as x² while horizontal displacement is linear → parabolic path. With air resistance, trajectory is no longer a perfect parabola.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Circular Motion ---
  {
    question_text: "The angular velocity (ω) of a body in circular motion is related to its linear velocity (v) by:",
    options: ["v = ω/r","v = ω × r","ω = v × r","v = ω²r"],
    correct_answer: 1,
    explanation: "v = ωr. Angular velocity ω = 2πf = 2π/T (rad/s). For Earth's rotation: T = 24 hours, ω = 2π/86400 = 7.27 × 10⁻⁵ rad/s. A point on Earth's equator: v = ωR = 465 m/s ≈ 1674 km/h.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "A car going around a banked curve is able to maintain speed without depending on friction because:",
    options: ["The road surface increases traction","The component of normal force toward the centre provides centripetal force","The car's weight provides centripetal force","Centrifugal force balances gravity"],
    correct_answer: 1,
    explanation: "Banking: road tilted at angle θ. Normal force N has horizontal component N·sinθ toward centre = centripetal force (mv²/r) and vertical component N·cosθ = mg. Ideal banking angle: tanθ = v²/rg. Racing tracks, highways, railway curves are banked.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // --- Waves & Standing Waves ---
  {
    question_text: "Beats in sound are produced when two sound waves of:",
    options: ["Same frequency are superposed","Slightly different frequencies are superposed — the ear perceives periodic variations in loudness","Very different frequencies are combined","The same amplitude interfere"],
    correct_answer: 1,
    explanation: "Beats: superposition of two sounds with slightly different frequencies (f₁ and f₂). Beat frequency = |f₁ − f₂| per second. Periodic loud-soft-loud variations. Used in: tuning musical instruments (beats disappear when exactly in tune), stethoscopes, two-tone alarm systems.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Standing waves are formed by the superposition of two waves that are:",
    options: ["Of different frequencies traveling in the same direction","Of the same frequency and amplitude traveling in opposite directions","Of different amplitudes traveling perpendicularly","Of any two waves meeting at a surface"],
    correct_answer: 1,
    explanation: "Standing (stationary) waves: two identical waves traveling in opposite directions. Nodes (zero displacement) and antinodes (maximum displacement) form at fixed positions. Examples: vibrating strings (guitar), organ pipes, microwave oven (why turntable is needed).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The fundamental frequency of a vibrating string depends on:",
    options: ["Length only","Tension only","Length, tension, and linear mass density: f = (1/2L)√(T/μ)","The material of the string only"],
    correct_answer: 2,
    explanation: "String fundamental frequency: f = (1/2L)√(T/μ). Shorter string → higher pitch (guitar fret). Higher tension → higher pitch (tuning pegs). Heavier string (higher μ) → lower pitch (bass strings are thicker). Harmonics: fn = nf₁.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "In a closed organ pipe (closed at one end), the fundamental mode has a wavelength equal to:",
    options: ["L (length of pipe)","2L","4L","L/2"],
    correct_answer: 2,
    explanation: "Closed pipe: closed end = node, open end = antinode. Fundamental: λ/4 = L → λ = 4L. Only odd harmonics (1st, 3rd, 5th...). Open pipe (open both ends): fundamental λ/2 = L → λ = 2L. All harmonics present. Flute: open. Clarinet: closed-like.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // --- Light: More Details ---
  {
    question_text: "The wavelength range of visible light is approximately:",
    options: ["10–400 nm","400–700 nm","700–1000 nm","200–400 nm"],
    correct_answer: 1,
    explanation: "Visible light: 400 nm (violet) to 700 nm (red). Violet: ~380–450 nm, Blue: ~450–495 nm, Green: ~495–570 nm, Yellow: ~570–590 nm, Orange: ~590–620 nm, Red: ~620–750 nm. UV < 400 nm, IR > 700 nm.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "A diffraction grating separates light into its component wavelengths. The grating equation is:",
    options: ["nλ = d·cosθ","nλ = d·sinθ (n = order, d = grating spacing, θ = diffraction angle)","nλ = d/sinθ","nλ = d + sinθ"],
    correct_answer: 1,
    explanation: "Diffraction grating: d·sinθ = nλ. Grating with many slits gives sharp, bright maxima at specific angles for each wavelength. Separates white light into pure spectrum. Used in spectroscopy (identifying elements by their emission spectra). Better resolution than prism.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The critical angle for total internal reflection in glass-air interface (for glass with n = 1.5) is:",
    options: ["30°","41.8°","60°","90°"],
    correct_answer: 1,
    explanation: "Critical angle: sinC = 1/n = 1/1.5 = 0.667 → C ≈ 41.8°. For diamond (n = 2.42): C ≈ 24.4° (very small → many facets create TIR → brilliance). For water (n = 1.33): C ≈ 48.8°. TIR occurs for angles greater than C.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // --- Electricity: More ---
  {
    question_text: "Resistivity (specific resistance) of a material is defined as resistance of a material of:",
    options: ["1 m length and 1 m² cross-sectional area","Any length and any area","1 cm length and 1 cm² area","1 mm length and 1 mm² area"],
    correct_answer: 0,
    explanation: "Resistivity ρ = RA/L (SI unit: Ω·m). R = ρL/A. Copper: 1.7 × 10⁻⁸ Ω·m (conductor). Silicon: ~640 Ω·m (semiconductor). Glass: ~10¹² Ω·m (insulator). Resistivity increases with temperature for metals; decreases for semiconductors.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "When temperature of a metallic conductor increases, its resistance:",
    options: ["Decreases","Increases (positive temperature coefficient)","Remains constant","First decreases then increases"],
    correct_answer: 1,
    explanation: "Metals: resistance increases with temperature (positive temperature coefficient). Reason: more thermal vibrations of lattice ions → more electron collisions. Semiconductors: resistance decreases with temperature (more charge carriers excited). Thermistors use this for temperature sensing.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The emf (electromotive force) of a battery is defined as the work done per unit charge by the:",
    options: ["External resistance","Internal source (battery) in moving charge through the complete circuit","Capacitor in the circuit","Load resistance only"],
    correct_answer: 1,
    explanation: "EMF (ε): work done by battery's internal energy source (chemical) per coulomb of charge = ε = W/q. Terminal voltage V = ε − Ir (where I = current, r = internal resistance). V < ε when battery supplies current. EMF is a property of the source, not the circuit.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Thermodynamics: More ---
  {
    question_text: "The process in which no heat is exchanged between the system and surroundings is called:",
    options: ["Isothermal process","Isobaric process","Isochoric process","Adiabatic process"],
    correct_answer: 3,
    explanation: "Adiabatic process: Q = 0 (no heat exchange). Fast processes or perfectly insulated systems. For adiabatic: PV^γ = constant. Isothermal: constant temperature (slow, isothermal expansion: PV = constant). Isobaric: constant pressure. Isochoric (isovolumetric): constant volume.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "In a heat engine, the efficiency can never be 100% because:",
    options: ["Friction always dissipates energy","The Second Law of Thermodynamics requires heat to be rejected to a cold sink","Not enough fuel can be burned","The engine parts have too much mass"],
    correct_answer: 1,
    explanation: "Second Law: heat engine must reject some heat to cold sink. 100% efficiency would require T₂ = 0 K (absolute zero) or T₁ = ∞ — both impossible. Even Carnot engine (ideal) is less than 100%. Real engines are even less efficient due to irreversibilities.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // --- Electrostatics ---
  {
    question_text: "The electric potential at a point is defined as the work done in bringing a unit positive charge from infinity to that point. Its SI unit is:",
    options: ["Coulomb","Farad","Volt (J/C)","Ampere"],
    correct_answer: 2,
    explanation: "Electric potential V = W/q. 1 Volt = 1 Joule/Coulomb. Potential difference (voltage) drives current. Potential at distance r from charge Q: V = kQ/r. Equipotential surfaces: no work done moving charge along them (field lines perpendicular to them).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Lightning rods protect buildings by:",
    options: ["Reflecting lightning away","Providing a low-resistance path for lightning to reach ground safely","Preventing clouds from forming above","Absorbing lightning energy"],
    correct_answer: 1,
    explanation: "Lightning rod (Benjamin Franklin, 1752): pointed metal rod connected to ground. Prevents build-up of charge (corona discharge slowly neutralizes clouds). If lightning strikes, low-resistance path directs current safely to ground, protecting the building.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Magnetism ---
  {
    question_text: "Magnetic field lines emerge from the _______ pole of a bar magnet and enter the _______ pole:",
    options: ["South; North","North; South","North; North","South; South"],
    correct_answer: 1,
    explanation: "Magnetic field lines: outside the magnet, they go from North pole to South pole. Inside the magnet, they go from South to North (forming closed loops — field lines have no start or end, unlike electric field lines). Unlike poles attract; like poles repel.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Diamagnetic materials are:",
    options: ["Strongly attracted by magnetic fields","Weakly attracted by magnetic fields","Weakly repelled by magnetic fields","Not affected by magnetic fields"],
    correct_answer: 2,
    explanation: "Diamagnetic: weakly repelled by magnets (χ < 0). Examples: bismuth, copper, water, wood, gold, silver. Paramagnetic: weakly attracted (χ > 0, small). Examples: aluminium, platinum, oxygen. Ferromagnetic: strongly attracted. Examples: iron, nickel, cobalt.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The Curie temperature of a ferromagnetic material is the temperature above which it:",
    options: ["Melts completely","Becomes superconducting","Loses its ferromagnetic properties and becomes paramagnetic","Gains stronger magnetism"],
    correct_answer: 2,
    explanation: "Curie temperature (Tc): above Tc, thermal energy disrupts magnetic domain alignment → ferromagnetic becomes paramagnetic. Tc: Iron = 770°C, Nickel = 358°C, Cobalt = 1120°C. Named after Pierre Curie. Used in: temperature-sensitive magnetic switches.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // --- Quantum Mechanics ---
  {
    question_text: "The Schrödinger equation gives the:",
    options: ["Exact position of an electron","Probability distribution (wave function ψ) of finding a particle at a particular location","Energy of a photon","Speed of atomic particles"],
    correct_answer: 1,
    explanation: "Schrödinger Equation (1926): wave equation for quantum mechanical systems. |ψ|² gives probability density of finding particle at a location. Replaced Bohr's fixed orbits with probability clouds (orbitals). Nobel Prize: Schrödinger shared with Dirac (1933).",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Quantum entanglement refers to:",
    options: ["Electrons sharing the same orbital","Two particles sharing physical properties such that the state of one instantly influences the state of the other regardless of distance","Atoms bonding in quantum states","Quantum particles colliding at high energy"],
    correct_answer: 1,
    explanation: "Quantum entanglement: two particles with correlated quantum states — measuring one instantly determines the state of the other, regardless of distance (Einstein called it 'spooky action at a distance'). Basis of quantum cryptography, quantum computing, quantum teleportation.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // --- Indian Physics & Science ---
  {
    question_text: "BARC (Bhabha Atomic Research Centre) is located at:",
    options: ["Bengaluru","Chennai","Trombay, Mumbai","Hyderabad"],
    correct_answer: 2,
    explanation: "BARC: established 1954 at Trombay, Mumbai. India's premier nuclear research center. Named after Homi J. Bhabha (father of Indian nuclear program). Houses India's research reactors (Apsara, Dhruva, Cirus), conducts nuclear energy, weapons, and radiation research.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "IGCAR (Indira Gandhi Centre for Atomic Research) located at Kalpakkam, Tamil Nadu primarily researches:",
    options: ["Space technology","Fast breeder reactor technology","Defence missiles","Satellite communication"],
    correct_answer: 1,
    explanation: "IGCAR (Kalpakkam): research on fast breeder reactor technology (using thorium fuel cycle — India has large thorium reserves). India's Prototype Fast Breeder Reactor (PFBR) at Kalpakkam uses liquid sodium coolant. Part of India's three-stage nuclear power programme.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The Variable Energy Cyclotron Centre (VECC) is located at:",
    options: ["Mumbai","Kolkata","Delhi","Chennai"],
    correct_answer: 1,
    explanation: "VECC: in Kolkata, operated by DAE (Department of Atomic Energy). Uses cyclotron (particle accelerator) to produce radioactive isotopes for medicine and research. Also conducts nuclear physics and accelerator research.",
    difficulty: "hard",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "S.N. Bose's contribution to quantum physics was the development of (along with Einstein):",
    options: ["Bose-Einstein Condensate statistics — describing how integer-spin particles (bosons) behave at low temperatures","Radioactivity theory","Special Relativity","Quantum tunneling theory"],
    correct_answer: 0,
    explanation: "Satyendra Nath Bose (1924): developed statistical mechanics for photons (bosons). Einstein generalized it to all integer-spin particles → Bose-Einstein statistics. Bose-Einstein Condensate (new state of matter at near 0K) confirmed 1995 (Nobel Prize to Cornell, Wieman, Ketterle). 'Boson' named after Bose.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Meghnad Saha is famous for the Saha Ionization Equation, which explains:",
    options: ["How stars generate energy through fusion","The degree of ionization of elements in stellar atmospheres depending on temperature and pressure","How black holes form","The expansion of the universe"],
    correct_answer: 1,
    explanation: "Saha Equation (Meghnad Saha, 1920): relates degree of ionization of elements in stars to temperature and pressure. Explained stellar spectra and why different elements appear at different star temperatures. Key to astrophysics and stellar classification.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // --- Applications ---
  {
    question_text: "The working principle of a tube light (fluorescent lamp) involves:",
    options: ["Heating a filament to incandescence","Mercury vapour emitting UV when electrically excited; UV excites phosphor coating to emit visible light","Burning gas to produce light","LED electroluminescence"],
    correct_answer: 1,
    explanation: "Fluorescent tube: electric discharge excites mercury vapour → UV emission → UV strikes white phosphor coating on tube → fluorescence → visible light. More efficient than incandescent (less heat wasted). CFL (compact fluorescent): coiled tube version.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "An incandescent light bulb produces light by:",
    options: ["Electroluminescence","Passing current through a thin tungsten filament that heats to ~2500°C and glows (thermal radiation)","UV causing phosphor to fluoresce","Plasma discharge in noble gas"],
    correct_answer: 1,
    explanation: "Incandescent bulb: tungsten filament (high melting point 3422°C) heated by electric current to ~2500°C → emits white light (thermal/blackbody radiation). Only ~5% of energy → light; rest → heat. Inefficient. Being phased out globally in favor of LED/CFL.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Electric discharge in neon gas produces orange-red light. This principle is used in:",
    options: ["Laser devices","Neon signs and gas discharge lamps","Fluorescent tubes","Incandescent bulbs"],
    correct_answer: 1,
    explanation: "Gas discharge lamps: high voltage excites gas atoms → electrons jump to higher energy levels → fall back → emit specific wavelengths. Neon: orange-red. Mercury: blue-white. Sodium: yellow-orange (street lights). Argon with mercury: blue. Each gas has a unique spectral 'fingerprint'.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "A rocket works on Newton's Third Law. The thrust of a rocket engine is generated by:",
    options: ["Air pushing against the rocket from behind","Burning fuel pushing exhaust gases backward (action) → rocket is pushed forward (reaction)","The rocket pushing against the ground","Magnetism repelling the rocket from Earth"],
    correct_answer: 1,
    explanation: "Rocket propulsion: high-pressure exhaust gases expelled backward at high velocity → rocket thrust forward (Newton's 3rd Law). Works in vacuum (no air needed). F = v_exhaust × (dm/dt). Tsiolkovsky rocket equation: Δv = v_e × ln(m₀/m_f).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Maglev (Magnetic Levitation) trains float above the track because:",
    options: ["They use jet engines","Electromagnetic repulsion (or attraction) between superconducting magnets in the train and magnets in the track","Air pressure under the train","Bernoulli effect from high speed"],
    correct_answer: 1,
    explanation: "Maglev: superconducting electromagnets in train create strong magnetic field; repulsion from track magnets lifts the train. No friction → speeds up to 600 km/h possible. Japan's SCMaglev holds record: 603 km/h (2015). Shanghai Maglev: world's first commercial maglev (~431 km/h).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Energy Sources ---
  {
    question_text: "A hydroelectric power plant converts:",
    options: ["Chemical energy of water to electricity","Nuclear energy of hydrogen to electricity","Gravitational potential energy of stored water to kinetic energy of turbines to electrical energy","Thermal energy of water to electricity"],
    correct_answer: 2,
    explanation: "Hydroelectric: water stored at height (PE = mgh) → falls through penstocks → drives turbines (KE) → generators (electricity). Clean, renewable energy. India's largest: Tehri Dam (Uttarakhand, 1000 MW). Sardar Sarovar Dam on Narmada is multipurpose.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Wind energy is converted to electricity using wind turbines. The power available from wind is proportional to:",
    options: ["Wind speed","Square of wind speed","Cube of wind speed (P ∝ v³)","Wind direction"],
    correct_answer: 2,
    explanation: "Wind power P = ½ρAv³. Power is proportional to cube of wind speed. Double the wind speed → 8× the power. Hence even small increases in wind speed dramatically increase power output. India's largest wind farm: Muppandal (Tamil Nadu). India: 4th largest wind power capacity globally.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "India's target for non-fossil fuel-based electricity capacity by 2030 is:",
    options: ["200 GW","500 GW","100 GW","300 GW"],
    correct_answer: 1,
    explanation: "India's NDC (updated 2022): 500 GW non-fossil fuel electricity capacity by 2030 (500 GW renewable target). Includes solar (280 GW), wind (140 GW), hydro, nuclear. India reached 200 GW solar in 2024. World's 3rd largest renewable energy capacity.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // --- Common Instruments & Tools ---
  {
    question_text: "A galvanometer detects and measures:",
    options: ["Large electrical currents","High voltage","Very small electrical currents (μA or mA range)","Magnetic flux"],
    correct_answer: 2,
    explanation: "Galvanometer: very sensitive current-detecting instrument. A galvanometer + shunt resistor (in parallel) = ammeter. A galvanometer + series resistor (high resistance) = voltmeter. Named after Luigi Galvani. Moving coil galvanometer works on F = BIL principle.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "An oscilloscope is used to:",
    options: ["Measure resistance","Display and analyze electronic waveforms (voltage vs time)","Generate radio waves","Detect X-rays"],
    correct_answer: 1,
    explanation: "Oscilloscope: electronic instrument that displays signal voltage as a function of time on a screen. Measures: frequency, amplitude, phase, waveform shape. Used in electronics labs, hospitals (ECG monitors), radio/TV repair. Digital storage oscilloscopes (DSO) are modern standard.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb"]
  },
  {
    question_text: "A hydrometer measures:",
    options: ["Humidity in air","Electrical current in water","Relative density (specific gravity) of liquids","Water pressure"],
    correct_answer: 2,
    explanation: "Hydrometer: glass instrument that floats in liquid — higher it floats (less immersed), denser the liquid. Measures specific gravity based on Archimedes' Principle. Used in: checking battery acid (specific gravity), testing milk quality, measuring alcohol content (lactometer for milk).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The instrument used to measure the humidity of the atmosphere is:",
    options: ["Barometer","Thermometer","Hygrometer","Anemometer"],
    correct_answer: 2,
    explanation: "Hygrometer: measures relative humidity (% moisture in air). Types: hair hygrometer (hair length changes with humidity), wet-and-dry bulb psychrometer, electronic capacitive sensors. Anemometer: wind speed. Barometer: atmospheric pressure.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "An anemometer is used to measure:",
    options: ["Atmospheric pressure","Wind speed (and direction — if weathervane attached)","Humidity","Temperature"],
    correct_answer: 1,
    explanation: "Anemometer: measures wind speed. Cup anemometer: rotating cups spin faster in stronger wind. Also: ultrasonic anemometer (no moving parts). Wind direction measured by wind vane. Beaufort Scale (0–12): describes wind force from calm to hurricane.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Physics of Daily Life ---
  {
    question_text: "Why does a needle float on water despite being denser than water?",
    options: ["It contains air pockets","Surface tension of water supports the needle's weight (it does not break the surface film)","Capillary action holds it up","The needle is magnetic and repelled by Earth's field"],
    correct_answer: 1,
    explanation: "Surface tension: the needle rests on the water surface, which acts like a thin elastic film. The water surface is depressed but not broken. Force = surface tension × perimeter of contact. This also explains water strider insects walking on water.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "When you press the nozzle of a spray bottle, liquid is drawn up and sprayed because of:",
    options: ["Gravity pulling the liquid up","Venturi effect — fast-moving air stream at the nozzle creates low pressure, drawing liquid up the tube","Electric field in the bottle","Capillary action"],
    correct_answer: 1,
    explanation: "Spray bottle/perfume atomizer: fast air stream over tube opening (from pump) → low pressure (Bernoulli/Venturi effect) → atmospheric pressure pushes liquid up the tube → liquid enters air stream → atomized into fine droplets. Same principle in carburettors, paint spray guns.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Ice forms on the surface of a pond rather than at the bottom because:",
    options: ["Water at 0°C is denser than ice","Ice forms where it is coldest (surface) and ice (being less dense than water at 4°C) floats","Warm water rises to the top","Cold air touches only the surface"],
    correct_answer: 1,
    explanation: "Anomalous expansion of water: water is densest at 4°C. When surface water cools below 4°C, it becomes less dense and stays at top. At 0°C it freezes into ice (density 0.917 g/cm³ < water 1 g/cm³) → ice floats. This protects aquatic life in winter.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The cooking time is less in a hilly region because:",
    options: ["More oxygen is available at higher altitudes","Atmospheric pressure is lower at higher altitudes → water boils at a lower temperature than 100°C","Lower gravity reduces cooking time","Air is cleaner at higher altitudes"],
    correct_answer: 1,
    explanation: "Boiling point decreases with altitude (lower atmospheric pressure). At 5000 m altitude: water boils at ~83°C. Lower boiling temperature means less cooking energy → food actually cooks slower (harder to reach needed temperature). Pressure cookers compensate by raising pressure and thus boiling point.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Why does a straw work to sip a drink?",
    options: ["The straw creates suction by pulling the liquid","Sucking reduces air pressure inside the straw; atmospheric pressure on drink surface pushes liquid up","Capillary action pulls liquid up","Gravity is reversed inside the straw"],
    correct_answer: 1,
    explanation: "Straw: sucking → reduced pressure inside straw → atmospheric pressure (acting on liquid surface in glass) pushes liquid up through the straw. In space (zero atmospheric pressure): straws don't work! This also explains why suction pumps cannot lift water above 10.3 m.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The phenomenon of capillary action (capillarity) occurs because of:",
    options: ["Gravity acting on liquid","Combination of adhesion (liquid-glass attraction) and cohesion (liquid-liquid attraction) and surface tension","Atmospheric pressure","Magnetic forces"],
    correct_answer: 1,
    explanation: "Capillarity: h = 2T·cosθ/(ρgr). Adhesion > cohesion: water wets glass → concave meniscus → rises (h > 0). Cohesion > adhesion: mercury doesn't wet glass → convex meniscus → depression. Used in: plant water transport (xylem), pen ink, paper towels, brick water absorption.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- More Nuclear ---
  {
    question_text: "India's three-stage nuclear power programme was designed to use which fuel in the third stage?",
    options: ["Uranium-235","Plutonium-239","Thorium-232 (India has world's 2nd largest thorium reserves)","Uranium-238"],
    correct_answer: 2,
    explanation: "India's three-stage nuclear programme (Homi Bhabha): Stage 1: Pressurized Heavy Water Reactors (U-235/U-238); Stage 2: Fast Breeder Reactors (Pu-239, breed U-233 from Th-232); Stage 3: Thorium-232 based reactors. India has ~25% of world's thorium reserves.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The process by which a radioactive nucleus emits an electron (beta particle) and an antineutrino is called:",
    options: ["Alpha decay","Beta-minus (β⁻) decay — neutron converts to proton + electron + antineutrino","Gamma decay","Neutron emission"],
    correct_answer: 1,
    explanation: "Beta-minus decay: n → p + e⁻ + ν̄_e. Mass number unchanged (A same); atomic number increases by 1 (Z+1). Example: Carbon-14 → Nitrogen-14 + β⁻ + ν̄ (basis of radiocarbon dating). Beta-plus decay: p → n + e⁺ + ν_e (Z decreases by 1).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // --- Physics in Medicine ---
  {
    question_text: "CT scan (Computed Tomography) uses:",
    options: ["Magnetic fields and radio waves","Sound waves","Rotating X-ray beam and computer processing to create cross-sectional images","Positron emission"],
    correct_answer: 2,
    explanation: "CT scan: rotating X-ray source takes multiple X-ray images at different angles; computer reconstructs 3D/cross-sectional images. Excellent for bone fractures, bleeding, tumors. Higher radiation dose than X-ray. Spiral/helical CT is modern standard.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "PET scan (Positron Emission Tomography) detects cancer by:",
    options: ["Using magnetic resonance","Using X-rays","Detecting gamma rays from positron-electron annihilation of a radiotracer (FDG) in metabolically active cancer cells","Using ultrasound to detect tumour blood flow"],
    correct_answer: 2,
    explanation: "PET scan: radioactive tracer (FDG — fluorine-18 glucose) injected → concentrates in metabolically active cells (cancer) → β⁺ decay emits positron → positron annihilates with electron → two 511 keV gamma rays detected. Shows metabolic activity, not just anatomy.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Radiation therapy for cancer uses high-energy radiation to:",
    options: ["Heat cancer cells to kill them","Kill cancer cells by damaging their DNA so they cannot divide","Deliver chemotherapy drugs","Freeze cancer cells"],
    correct_answer: 1,
    explanation: "Radiation therapy: high-energy X-rays, gamma rays, protons, or heavy ions damage cancer cell DNA → cells cannot divide and die. External beam therapy or brachytherapy (internal radioactive source). Linear accelerators (LINAC) generate X-rays for treatment. Proton therapy: precise targeting.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // --- More Famous Concepts ---
  {
    question_text: "The photoelectric effect shows that the energy of ejected photoelectrons depends on:",
    options: ["Intensity of light","Frequency of incident light (not intensity)","Distance from light source","Colour only (not frequency)"],
    correct_answer: 1,
    explanation: "Photoelectric effect: KE_max = hf − φ. KE depends on frequency (f), not intensity. Intensity affects the NUMBER of electrons emitted (not their energy). This particle-like behavior of light challenged classical wave theory and established quantum mechanics.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Which statement about gamma rays is correct?",
    options: ["They are charged particles","They have the longest wavelength in the EM spectrum","They are high-energy electromagnetic radiation with no charge and no mass, with very penetrating power","They travel slower than X-rays"],
    correct_answer: 2,
    explanation: "Gamma rays: electromagnetic radiation (λ < 0.01 nm, E > 100 keV), emitted from excited nuclear transitions. No charge, no mass. Most penetrating (stopped by thick lead or concrete). Source: radioactive decay, nuclear reactions, cosmic events. All EM waves travel at c.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "In which process does a high-energy photon interact with a nucleus and eject a neutron?",
    options: ["Photoelectric effect","Pair production","Photodisintegration (photonuclear reaction)","Compton scattering"],
    correct_answer: 2,
    explanation: "Photodisintegration: γ + nucleus → daughter nucleus + neutron (or proton). Requires photon energy above ~8 MeV. Example: γ + D → p + n (splitting of deuteron). Used in gamma-neutron sources. Different from Compton effect (γ + electron) and pair production (γ → e⁺ + e⁻).",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The force of gravity between the Sun and Earth keeps Earth in its orbit. This is an example of:",
    options: ["Contact force","Non-contact (action-at-a-distance) force","Magnetic force","Electromagnetic force"],
    correct_answer: 1,
    explanation: "Gravitational force: long-range, non-contact force. Acts between all massive objects across empty space. Four fundamental forces: gravity (weakest), electromagnetic, weak nuclear, strong nuclear (strongest). In General Relativity, gravity is not a force but spacetime curvature.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The strong nuclear force holds:",
    options: ["Electrons in their orbits","Protons and neutrons together in the nucleus (overcoming proton-proton repulsion)","Atoms in chemical bonds","Molecules in liquids"],
    correct_answer: 1,
    explanation: "Strong nuclear force: strongest fundamental force, but very short range (< 3 fm). Binds quarks into protons/neutrons, and holds protons/neutrons in nucleus despite electromagnetic repulsion between protons. Mediated by gluons. ~100× stronger than electromagnetism.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The weak nuclear force is responsible for:",
    options: ["Binding quarks in protons","Radioactive beta decay and certain nuclear reactions","Electromagnetic phenomena","Holding protons in the nucleus"],
    correct_answer: 1,
    explanation: "Weak nuclear force: responsible for beta decay (neutron → proton + electron + antineutrino), some radioactive decay modes, and nuclear fusion in stars. Mediated by W and Z bosons. Short range (~10⁻¹⁸ m). Unified with electromagnetism as 'electroweak force' (Glashow-Salam-Weinberg, Nobel 1979).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // --- More Applied ---
  {
    question_text: "A thermal power plant's steam turbine is driven by:",
    options: ["Compressed air","High-pressure steam generated by burning coal/oil/natural gas to heat water","Direct combustion gases","Nuclear fission directly spinning the turbine"],
    correct_answer: 1,
    explanation: "Thermal power plant: fuel (coal/gas/oil) burnt → heats boiler water → high-pressure steam → steam turbine → generator → electricity. Efficiency ~30-40% (Carnot limits). India's largest: Vindhyachal Super Thermal Power Station (4760 MW). Thermal power: ~60% of India's electricity.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Why are power transmission lines at very high voltage (e.g., 400 kV)?",
    options: ["High voltage requires less wire","Higher voltage with lower current reduces I²R power losses in transmission","High voltage is safer","Transformers only work with high voltage"],
    correct_answer: 1,
    explanation: "Power P = VI. For same power, higher V → lower I. Transmission loss = I²R. Lower current dramatically reduces losses. A step-up transformer raises voltage for transmission; step-down transformer at destination reduces to safe 220V. India's transmission grid: 765 kV Ultra High Voltage.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The efficiency of a machine is always less than 100% because:",
    options: ["Machines are poorly designed","Some energy is always lost to friction, air resistance, and heat","Energy is destroyed inside the machine","The input energy is always less than output"],
    correct_answer: 1,
    explanation: "Efficiency η = (useful output energy / input energy) × 100%. Always < 100% due to: friction between moving parts, air resistance, heat generation, sound. First Law says energy is conserved, but useful work output < energy input (some converted to 'waste' heat). η = MA/VR × 100%.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "An electric bell uses an electromagnet to:",
    options: ["Produce sound by direct vibration of the electromagnet","Repeatedly attract and release a striker to hit a bell via an interrupting contact mechanism","Store electrical energy","Convert electrical to thermal energy"],
    correct_answer: 1,
    explanation: "Electric bell: electromagnet attracts armature/striker → hits bell → in doing so, breaks the contact → electromagnet loses magnetism → spring pulls striker back → contact remade → electromagnet re-energized → cycle repeats rapidly → continuous ringing sound.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Vernier, SI units, concepts ---
  {
    question_text: "Which of the following is a derived SI unit (not a base unit)?",
    options: ["Kilogram","Second","Joule","Ampere"],
    correct_answer: 2,
    explanation: "Joule (J) is a derived unit: J = kg·m²/s² = N·m. The 7 SI base units are: metre, kilogram, second, ampere, kelvin, mole, candela. Derived units are combinations of base units: Newton = kg·m/s², Pascal = kg/(m·s²), Watt = kg·m²/s³.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The dimensional formula of velocity is:",
    options: ["[MLT⁻¹]","[LT⁻¹]","[MLT⁻²]","[L²T⁻¹]"],
    correct_answer: 1,
    explanation: "Velocity = distance/time = [L]/[T] = [LT⁻¹]. Has no mass dimension. Acceleration = [LT⁻²]. Force = mass × acceleration = [MLT⁻²]. Momentum = mass × velocity = [MLT⁻¹]. Energy = force × distance = [ML²T⁻²].",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The principle of homogeneity in dimensional analysis states that:",
    options: ["All variables in physics must be equal","Only quantities with the same dimensions can be added, subtracted, or equated","All physical laws must be derived from Newton's laws","All dimensions must cancel in an equation"],
    correct_answer: 1,
    explanation: "Dimensional homogeneity: both sides of a physical equation must have the same dimensions. Used to: check correctness of equations, derive relationships between quantities, convert between unit systems. Limitation: cannot determine dimensionless constants.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "If force (F), acceleration (A), and time (T) are taken as fundamental quantities, the dimension of mass would be:",
    options: ["[FA⁻¹]","[FAT⁻²]","[FA⁻¹T⁰]","[FA⁻¹T²]"],
    correct_answer: 0,
    explanation: "F = ma → m = F/a. If F and A are fundamental: m = F/A = [FA⁻¹]. This is how dimensional analysis works with different chosen fundamental quantities. The choice of fundamental quantities is a convention — physics remains the same.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // --- ISRO & Space Physics ---
  {
    question_text: "India's first satellite, Aryabhata, was launched in:",
    options: ["1969","1975","1980","1984"],
    correct_answer: 1,
    explanation: "Aryabhata: India's first satellite, launched April 19, 1975 (by Soviet Kosmos-3M rocket from USSR). Named after ancient Indian mathematician-astronomer. It was a scientific satellite studying X-rays, neutrons, and gamma rays. ISRO was established in 1969.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "PSLV (Polar Satellite Launch Vehicle) is used to launch satellites into:",
    options: ["Geostationary orbit","Polar and Sun-synchronous orbits (lower altitudes, ~600-900 km)","Deep space","Lunar orbit"],
    correct_answer: 1,
    explanation: "PSLV: India's workhorse rocket. Launches remote sensing/navigation satellites into polar orbits and sun-synchronous orbits. PSLV-C37 (Feb 2017): world record — launched 104 satellites in one flight. GSLV (Geosynchronous Launch Vehicle) puts heavier satellites in GTO.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "India's Mars Orbiter Mission (Mangalyaan) successfully entered Mars orbit in:",
    options: ["September 2013","September 2014","October 2015","July 2016"],
    correct_answer: 1,
    explanation: "Mangalyaan (Mars Orbiter Mission): launched November 5, 2013; successfully entered Mars orbit on September 24, 2014. India became first country to reach Mars on its first attempt and first Asian nation to do so. Cost: ~Rs 450 crore ($74 million) — cheapest Mars mission.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- More Everyday Physics ---
  {
    question_text: "A rainbow can only be seen when the observer has their back to the sun. The centre of a rainbow is always:",
    options: ["At the horizon directly in front","At the observer's shadow (anti-solar point)","At 45° above the horizon","At the zenith (directly above)"],
    correct_answer: 1,
    explanation: "Rainbow: always appears opposite to the sun (anti-solar point = observer's shadow direction). Primary rainbow: 40°-42° from anti-solar point (red outside, violet inside). Secondary rainbow (52°): colours reversed (violet outside). The full rainbow is a complete circle; horizon cuts most of it.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The stars appear to twinkle (scintillation) but planets do not, because:",
    options: ["Stars are hotter than planets","Stars emit their own light while planets reflect","Stars are point sources (light undergoes more atmospheric refraction fluctuations) while planets are extended discs","Planets are closer to Earth"],
    correct_answer: 2,
    explanation: "Twinkling: stars are so far away they appear as point sources. Atmospheric turbulence causes refractive index fluctuations → star's point image rapidly shifts → appears to twinkle. Planets are nearby → appear as small discs → atmospheric variations average out → steady light.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Why is the sky dark at night even though the universe contains billions of stars in all directions (Olbers' Paradox is resolved by)?",
    options: ["Stars are too far away","The universe is finite","The universe had a beginning (Big Bang) and light from distant stars hasn't reached us yet; also universe expansion redshifts light out of visible range","Clouds block starlight"],
    correct_answer: 2,
    explanation: "Olbers' Paradox (Heinrich Olbers, 1823): if universe is infinite and eternal with uniform stars, the sky should be uniformly bright. Resolution: universe has finite age (13.8 billion years) → light from very distant stars hasn't arrived yet; cosmic expansion redshifts distant starlight out of visible spectrum.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The phenomenon of 'persistence of vision' (visual persistence for ~1/16 second) is the basis of:",
    options: ["Photography","Television and cinema (rapid sequence of still images appears as continuous motion)","Telescope operation","Night vision"],
    correct_answer: 1,
    explanation: "Persistence of vision: the eye retains an image for ~1/16 second (about 60 ms) after the stimulus stops. Movies at 24 fps and TV at 25/30 fps exploit this — rapid still frames appear as smooth motion. Also the basis of stroboscopic effects.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "A mirage is an optical illusion caused by:",
    options: ["Water on the road reflecting sunlight","Refraction of light through layers of air with different temperatures (total internal reflection in hot air near ground)","Diffraction of light by dust particles","Reflection from clouds"],
    correct_answer: 1,
    explanation: "Mirage: hot ground heats air above it → temperature decreases with height → refractive index increases with height → light from sky bends (refracted) upward in increasingly dense air → appears to come from the ground → looks like water/reflection. Inferior mirage (desert/hot road).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Which scientist established that the speed of light is finite by observing the eclipses of Jupiter's moon Io?",
    options: ["Isaac Newton","Galileo Galilei","Ole Rømer","James Bradley"],
    correct_answer: 2,
    explanation: "Ole Rømer (1676): noticed discrepancies in timing of Io's eclipses depending on Earth-Jupiter distance → deduced light travels at finite speed ≈ 220,000 km/s (first measurement). James Bradley (1729): measured c ≈ 301,000 km/s by stellar aberration. Exact value: 299,792,458 m/s.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The colour of the sunset sky appears red or orange because:",
    options: ["The Sun emits more red light at sunset","Clouds reflect red light from the Sun","Rayleigh scattering removes blue/violet light through longer atmospheric path — only longer wavelengths (red, orange) reach the observer","Ozone absorbs blue light at sunset angles"],
    correct_answer: 2,
    explanation: "Sunset: sunlight travels longer path through atmosphere near horizon. Most blue/violet light is scattered away (Rayleigh scattering). Remaining transmitted light is enriched in longer wavelengths → red, orange, yellow sunset. Same reason: Sun appears red when seen through smoke or dust.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The Moon appears larger at the horizon than overhead. This is:",
    options: ["A real physical effect — the Moon is actually closer at the horizon","Due to atmospheric lensing magnifying the Moon","The Moon Illusion — a psychological phenomenon where brain uses nearby objects as reference, making Moon appear larger","Refraction making the Moon's image larger"],
    correct_answer: 2,
    explanation: "Moon Illusion: the Moon's actual angular size (0.5°) is the same overhead and at horizon. Brain compares it to nearby objects (trees, buildings) on horizon → Moon appears larger. A purely perceptual/psychological phenomenon, not a physical effect. Camera shows no size difference.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Newton's law of cooling states that the rate of cooling of an object is proportional to:",
    options: ["Temperature of the object","Temperature of surroundings","Difference between object's temperature and surroundings' temperature","Mass of the object"],
    correct_answer: 2,
    explanation: "Newton's Law of Cooling: dT/dt ∝ (T − T_surrounding). Hot coffee cools faster at first (big temperature difference), then slower as it approaches room temperature. Forensic science uses this to estimate time of death. Applies when temperature difference is small.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The Kelvin temperature scale and Celsius scale are related by:",
    options: ["K = °C − 273","K = °C × 273","K = °C + 273.15","K = (°C + 32) × 5/9"],
    correct_answer: 2,
    explanation: "T(K) = T(°C) + 273.15. Water freezes: 0°C = 273.15 K. Water boils: 100°C = 373.15 K. Absolute zero: 0 K = −273.15°C. Fahrenheit: °F = (°C × 9/5) + 32. Body temp: 37°C = 310.15 K = 98.6°F.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The gravitational potential energy of an object of mass m at height h near Earth's surface is:",
    options: ["mgh (with ground as reference, PE = 0)","mg/h","mh/g","gh/m"],
    correct_answer: 0,
    explanation: "GPE = mgh. Reference level: ground (h = 0, PE = 0). As height increases, PE increases. This energy is 'released' when object falls (PE → KE). For objects far from Earth: PE = −GMm/r (negative, zero at infinity). Roller coasters, dams, hydroelectric plants all use GPE.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "What is the relationship between mass and weight?",
    options: ["They are the same quantity","Weight = Mass × acceleration due to gravity (W = mg)","Mass = Weight × g","Weight is measured in kilograms, mass in Newtons"],
    correct_answer: 1,
    explanation: "Weight W = mg. Mass (m): amount of matter (scalar, constant, measured in kg). Weight (W): gravitational force on the object (vector, varies with g, measured in Newtons). On Moon (g = 1.63 m/s²): weight is 1/6 of Earth weight. Mass remains the same everywhere.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The phenomenon of 'supercooling' refers to:",
    options: ["Cooling a substance below its boiling point","Cooling a liquid below its freezing point without it solidifying (metastable state)","Ultra-fast cooling using liquid nitrogen","Cooling that occurs when pressure is released"],
    correct_answer: 1,
    explanation: "Supercooling: liquid cooled below freezing point without solidifying (metastable). Needs nucleation sites to crystallize. Purified water can be supercooled to −40°C. Any disturbance causes rapid crystallization. Also: superheating (liquid above boiling point without boiling → dangerous, can cause 'bumping').",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Kirchhoff's law of radiation states that a good absorber of radiation is also a:",
    options: ["Poor emitter","Good emitter (at the same wavelength and temperature)","Perfect reflector","Transparent medium"],
    correct_answer: 1,
    explanation: "Kirchhoff's law of radiation: emissivity = absorptivity at any given temperature and wavelength. A black body (perfect absorber) is also a perfect emitter. A shiny surface (poor absorber = high reflectance) is also a poor emitter. Thermos flask uses silvered surface to minimize both absorption and emission.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The unit of frequency is named after the physicist who first experimentally demonstrated electromagnetic waves. The physicist was:",
    options: ["James Clerk Maxwell","Michael Faraday","Heinrich Rudolf Hertz","Nikola Tesla"],
    correct_answer: 2,
    explanation: "Hertz (Hz = cycles per second): named after Heinrich Rudolf Hertz (1857–1894). He confirmed Maxwell's prediction of electromagnetic waves in 1887 using spark gap transmitter and receiver. 1 Hz = 1 cycle/second. AM radio: kHz. FM radio: MHz. WiFi: GHz.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The unit of power (Watt) is named after James Watt, who:",
    options: ["Invented electricity","Discovered steam power","Developed the steam engine and defined 'horsepower' (1 hp = 746 W)","Invented the light bulb"],
    correct_answer: 2,
    explanation: "James Watt (1736–1819): Scottish engineer who developed the modern steam engine (improved Newcomen's engine with separate condenser). Defined 'horsepower' for marketing steam engines. 1 Watt = 1 Joule/second = 1 J/s. Named in his honour as the SI unit of power (1889).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The unit of inductance (Henry) is named after Joseph Henry, who discovered:",
    options: ["Electromagnetic induction independently (simultaneously with Faraday) and self-induction","The electron","Radioactivity","The proton"],
    correct_answer: 0,
    explanation: "Joseph Henry (1797–1878): American physicist who discovered electromagnetic induction independently (around the same time as Faraday, 1830-31) and self-induction. The Henry (H) is the SI unit of inductance. Henry's discovery of self-induction led to electric motors and generators.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Which law states that the total electric flux through a closed surface is proportional to the total charge enclosed?",
    options: ["Faraday's Law","Ampere's Law","Gauss's Law of electrostatics","Lenz's Law"],
    correct_answer: 2,
    explanation: "Gauss's Law: ΦE = Q_enclosed / ε₀. One of Maxwell's four equations. Used to find electric field for symmetric charge distributions (sphere, cylinder, infinite plane). Similarly, Gauss's Law for magnetism: ΦB = 0 (no magnetic monopoles).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Lenz's Law states that induced current always flows in a direction that:",
    options: ["Aids the change in magnetic flux causing it","Opposes the change in magnetic flux that caused it (conservation of energy)","Is perpendicular to the magnetic field","Has maximum magnitude"],
    correct_answer: 1,
    explanation: "Lenz's Law: induced current creates a magnetic field opposing the change in flux that caused it (like 'electromagnetic inertia'). It is a consequence of conservation of energy. The negative sign in Faraday's Law (EMF = −dΦ/dt) represents Lenz's Law.",
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
