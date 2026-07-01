require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const BASE  = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
const KEY   = 'quiz:subject:physics';
const HDR   = { Authorization:`Bearer ${TOKEN}`, 'Content-Type':'application/json' };

const questions = [
  {
    question_text: "The principle of conservation of energy in a simple pendulum means:",
    options: ["Speed is always constant","Total mechanical energy (KE + PE) remains constant throughout the swing (ignoring friction)","It swings forever without stopping","Mass determines the swing speed"],
    correct_answer: 1,
    explanation: "Pendulum: at lowest point — all KE, no PE. At highest points — all PE, no KE. Total energy = ½mv²_max = mgh_max = constant. In reality, air resistance and friction gradually dissipate energy — the pendulum eventually stops. Driven pendulums (clocks) receive energy impulses to maintain oscillation.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Optical fibers are used in internet cables because:",
    options: ["They are cheaper than copper","Light signals travel at higher speeds and carry much more data than electrical signals in copper cables","They are flexible","They are immune to weather"],
    correct_answer: 1,
    explanation: "Optical fiber advantages: light pulses carry data at ~2/3 of c (~200,000 km/s in fiber), enormous bandwidth (Tbps), no electromagnetic interference, low signal loss over long distances (silica glass), secure (hard to tap without detection). Single-mode fiber for long distances; multi-mode for shorter runs.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "A micrometer is used to measure dimensions with a precision of 0.01 mm. This instrument uses the principle of:",
    options: ["Diffraction","Vernier scale","Screw thread — every full rotation advances the screw by one pitch","Resonance"],
    correct_answer: 2,
    explanation: "Screw gauge (micrometer): uses screw thread principle. Pitch = 0.5 mm (advance per rotation). Thimble has 50 divisions. LC = pitch/divisions = 0.5/50 = 0.01 mm. Reading = main scale + (thimble reading × LC). Used to measure wire diameter, glass thickness, ball bearing dimensions.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The magnetic flux through a surface is defined as:",
    options: ["B × A (flux density × area, for uniform field perpendicular to surface)","B × I (field × current)","B/A","B + A"],
    correct_answer: 0,
    explanation: "Magnetic flux Φ = B·A·cosθ (θ = angle between B and normal to surface). Unit: Weber (Wb). Faraday's Law: EMF = −dΦ/dt. Flux through a closed surface = 0 (Gauss's Law for magnetism — no magnetic monopoles). Flux is maximum when B is perpendicular to the surface (θ = 0°).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The phenomenon of 'tunneling microscopy' in a Scanning Tunneling Microscope (STM) allows imaging of individual atoms using:",
    options: ["Visible light focused by a lens","Electron beams scattered off atoms","Quantum tunneling current between a sharp metal tip and the surface","X-ray diffraction"],
    correct_answer: 2,
    explanation: "STM (Binnig and Rohrer, Nobel 1986): sharp metal tip scanned over conductive surface. Quantum tunneling electrons flow between tip and surface (even without contact) — current is exponentially sensitive to tip-surface distance (0.1 nm). Resolution: atomic scale. Can image individual atoms and molecules.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "In photoelectric effect, doubling the intensity of light (at constant frequency above threshold):",
    options: ["Doubles the kinetic energy of each photoelectron","Halves the number of photoelectrons","Doubles the number of photoelectrons emitted (but not their energy)","Has no effect"],
    correct_answer: 2,
    explanation: "In photoelectric effect: intensity = number of photons per second. More photons → more electrons emitted (proportional). But energy of each electron depends only on frequency: KE = hf − φ. Intensity does NOT change KE of individual electrons — this disproved classical wave theory of light.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The energy equivalent of 1 atomic mass unit (1 amu = 1.66 × 10⁻²⁷ kg) using E = mc² is approximately:",
    options: ["1 MeV","931.5 MeV","9.31 MeV","93.15 MeV"],
    correct_answer: 1,
    explanation: "E = mc² = 1.66 × 10⁻²⁷ × (3×10⁸)² = 1.49 × 10⁻¹⁰ J = 931.5 MeV. This is why nuclear physicists use MeV for energy. Proton mass = 1.00728 amu = 938.3 MeV/c². Electron: 0.000549 amu = 0.511 MeV/c². Mass defect of nuclei in amu → binding energy in MeV.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "When a ray of white light is passed through a prism, which colour deviates the LEAST?",
    options: ["Violet","Blue","Red","Green"],
    correct_answer: 2,
    explanation: "Red light has the longest wavelength and lowest refractive index in glass → least bending (smallest angle of deviation). Violet has shortest wavelength, highest refractive index → most deviation. VIBGYOR from least to most deviation: Violet bends most, Red bends least. (Same order as increasing wavelength).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The magnifying power of a simple microscope (magnifying glass) is:",
    options: ["M = D/f","M = 1 + D/f (where D = 25 cm near point, f = focal length of lens)","M = f/D","M = D × f"],
    correct_answer: 1,
    explanation: "Simple microscope (magnifying glass): M = 1 + D/f. For D = 25 cm and f = 5 cm: M = 1 + 25/5 = 6×. When image at infinity: M = D/f = 5×. Shorter focal length → higher magnification. Used in: watchmaking, philately, reading fine print, dermatoscopy.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "If a source of sound moves toward a stationary observer at speed v_s (v_s < speed of sound), the observed frequency is:",
    options: ["Lower than source frequency","Higher than source frequency (sound waves are compressed ahead of the source)","Equal to source frequency","Zero"],
    correct_answer: 1,
    explanation: "Doppler Effect: source approaching → sound waves compressed ahead → shorter wavelength → higher frequency heard. f_observed = f_source × (v_sound)/(v_sound − v_source). Ambulance siren sounds higher-pitched as it approaches, lower as it moves away. Used in speed cameras.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The phenomenon of 'acoustic resonance' is best demonstrated by:",
    options: ["Sound travelling through walls","A wine glass shattering when a singer hits the right frequency (resonant frequency of the glass)","Echo in a mountain valley","Ultrasound scanning"],
    correct_answer: 1,
    explanation: "Acoustic resonance: external sound at the natural (resonant) frequency of an object → amplitude dramatically increases → can shatter glass. Also: soldiers must break step on bridges (resonance could collapse bridge), Tacoma Narrows Bridge (1940) collapsed due to resonance with wind.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The fourth state of matter (besides solid, liquid, gas) is:",
    options: ["Bose-Einstein condensate","Plasma (ionized gas — electrons stripped from atoms, e.g., stars, lightning, fluorescent tubes, fusion reactors)","Superfluid","Fermionic condensate"],
    correct_answer: 1,
    explanation: "Plasma: 4th state of matter. Gas heated to very high temperature → electrons stripped from atoms → mixture of ions and free electrons. Examples: Sun and stars (99% of visible universe is plasma), lightning, aurora, fluorescent lights, plasma TVs, fusion reactors (tokamak). Different from gas — conducts electricity, affected by magnetic fields.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The Bernoulli equation (P + ½ρv² + ρgh = constant) applies to:",
    options: ["Any fluid under any conditions","Ideal (inviscid), incompressible, steady-state fluid flow along a streamline","Turbulent flows only","Compressible gases only"],
    correct_answer: 1,
    explanation: "Bernoulli's equation: ideal (no viscosity), incompressible (constant density), steady (no time variation), irrotational flow along a streamline. Real fluids: Bernoulli gives approximate results. For viscous flows: Hagen-Poiseuille equation. Applications: wing lift, carburettors, siphons, Venturi meters.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The de Broglie wavelength of a particle is significant (observable diffraction effects) only when it is:",
    options: ["Very large — visible to naked eye","Comparable to the scale of the atomic/subatomic structure it is interacting with","Larger than the speed of light","Greater than the wavelength of visible light"],
    correct_answer: 1,
    explanation: "de Broglie wavelength λ = h/mv. For macroscopic objects (e.g., cricket ball 0.16 kg at 40 m/s): λ ≈ 10⁻³⁴ m — far smaller than any atomic structure → no observable quantum effects. For electrons (9.1 × 10⁻³¹ kg): wavelength is comparable to atomic spacing → electron diffraction observed.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Nuclear fusion requires extremely high temperatures (~10⁷–10⁸ K) because:",
    options: ["Neutrons need high energy to overcome gravity","Protons need enough kinetic energy to overcome their electromagnetic repulsion (Coulomb barrier) to get close enough for the strong force to take over","High temperature creates more neutrons","Fusion works only in zero gravity"],
    correct_answer: 1,
    explanation: "Fusion: two positively charged nuclei repel each other (Coulomb barrier). To fuse, they must get within ~10⁻¹⁵ m → need kinetic energy ≈ few keV. At T ~ 10⁸ K, thermal energy is sufficient. ITER (international fusion project, France) aims to achieve net energy gain from D-T fusion.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The Chandrasekhar limit (~1.4 solar masses) is:",
    options: ["Maximum mass of a main-sequence star","Maximum mass of a white dwarf star (above this, it collapses into neutron star or black hole)","Minimum mass for a star to form","Maximum mass of a neutron star"],
    correct_answer: 1,
    explanation: "Chandrasekhar limit: S. Chandrasekhar (Nobel 1983) showed white dwarfs above ~1.4 M_sun cannot be supported by electron degeneracy pressure → collapse into neutron star or explode as Type Ia supernova. Key for measuring cosmic distances. Chandrasekhar was an Indian-American astrophysicist.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Subrahmanyan Chandrasekhar was awarded the Nobel Prize in Physics in 1983 for:",
    options: ["Discovery of Raman Effect","Studies on the physical processes of importance to the structure and evolution of stars","Discovering neutron stars","Theory of black holes"],
    correct_answer: 1,
    explanation: "Chandrasekhar (1910–1995): Nobel Prize 1983 shared with William Fowler. Won for theoretical studies on physical processes important to stellar structure/evolution, including the Chandrasekhar limit. Born in Lahore (then India), became a US citizen. X-ray telescope Chandra is named after him.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The first element produced in the Big Bang nucleosynthesis (besides hydrogen) was:",
    options: ["Carbon","Oxygen","Helium (about 25% of all matter by mass was helium)","Lithium"],
    correct_answer: 2,
    explanation: "Big Bang nucleosynthesis (first 3–20 minutes): H (75%), He-4 (25%), traces of D, He-3, Li-7. Heavier elements made in stars (stellar nucleosynthesis) and supernovae. The saying 'we are made of stardust' — carbon, oxygen, iron in our bodies were forged in stars billions of years ago.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The instrument used to separate isotopes in a mass spectrometer uses:",
    options: ["Gravity","Centrifuge only","Magnetic force deflecting ions — heavier isotopes deflect less","Chemical reactions"],
    correct_answer: 2,
    explanation: "Mass spectrometer: ions accelerated, then pass through magnetic field. Magnetic force causes circular motion: r = mv/qB. Heavier ions (larger m) → larger radius → land farther. Separates isotopes by mass. Used in: isotope analysis, carbon dating, drug testing, atmospheric gas analysis, proteomics.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "A cyclotron accelerates charged particles using:",
    options: ["High-frequency alternating electric field between two D-shaped magnets (dees) within a magnetic field","Continuous DC electric field","Laser pulses","Gravitational slingshot"],
    correct_answer: 0,
    explanation: "Cyclotron (Lawrence, Nobel 1939): alternating electric field across gap between two D-shaped ('dee') hollow electrodes in uniform magnetic field. Particles spiral outward, gaining energy each time they cross the gap. Maximum energy limited by relativistic mass increase. Used in medicine (PET isotope production) and nuclear physics.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The phenomenon of 'pair production' requires the photon energy to be at least:",
    options: ["0.511 MeV","1.022 MeV (= 2 × electron rest mass energy, to create electron-positron pair)","9.1 MeV","938 MeV"],
    correct_answer: 1,
    explanation: "Pair production: γ → e⁻ + e⁺ requires E_γ ≥ 2 × m_e × c² = 2 × 0.511 MeV = 1.022 MeV. Energy above 1.022 MeV goes into kinetic energy of the pair. Reverse process: pair annihilation → two 0.511 MeV gamma photons (used in PET scan detection).",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "An optical fibre works on total internal reflection. The angle of incidence must be:",
    options: ["Less than the critical angle (to refract out)","Equal to the critical angle","Greater than the critical angle (to reflect completely inside)","90° always"],
    correct_answer: 2,
    explanation: "TIR condition: angle of incidence at the core-cladding interface must be GREATER than the critical angle C = sin⁻¹(n_cladding/n_core). The 'acceptance cone' of the fiber: rays entering within a certain angle from the fiber axis will undergo TIR and propagate through. Numerical aperture defines this cone.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The electric field (E) and electric potential (V) are related by:",
    options: ["E = V/d (for uniform field, d = distance between plates)","E = V × d","E = d/V","V = E²/d"],
    correct_answer: 0,
    explanation: "For uniform electric field: E = V/d (field strength = potential difference / plate separation). In general: E = −dV/dx (negative gradient of potential). SI unit of E: V/m = N/C. A 12V battery with 1 cm plate spacing → E = 12/0.01 = 1200 V/m. Field points from high to low potential.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "A thermocouple is used to measure temperature by:",
    options: ["Thermal expansion of mercury","Seebeck effect — two different metals joined at two junctions; temperature difference → small EMF proportional to temperature","Resistance change with temperature","Bimetallic strip bending"],
    correct_answer: 1,
    explanation: "Thermocouple: two dissimilar metals (e.g., copper-constantan, chromel-alumel) joined at two junctions. If junctions are at different temperatures → Seebeck EMF (millivolts). Measures wide temperature range (−200°C to 1800°C). Used in: industry, furnaces, engines, scientific instruments.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "A Geiger-Müller (GM) counter detects:",
    options: ["Infrared radiation","Magnetic field strength","Ionizing radiation (alpha, beta, gamma, X-rays) by gas ionization creating electrical pulses","Sound waves"],
    correct_answer: 2,
    explanation: "GM counter (Hans Geiger, 1908): tube filled with inert gas (Argon/Helium). Ionizing radiation → ionizes gas → ions accelerate to electrodes → current pulse → amplified → clicking sound/count. Used in: radiation monitoring, nuclear physics, prospecting. Not precise enough to distinguish radiation types.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The principle of 'complementarity' in quantum mechanics (Bohr) states that:",
    options: ["Energy and time are complementary","Wave and particle behaviours are complementary — you cannot observe both simultaneously","Position and velocity are the same","Spin up and spin down are identical"],
    correct_answer: 1,
    explanation: "Bohr's Complementarity Principle: quantum objects exhibit either wave-like (interference/diffraction) or particle-like (localized impact) behaviour depending on the experiment — never both simultaneously. This is deeper than uncertainty: wave/particle are mutually exclusive but both needed for complete description.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Which of the following correctly describes a 'black body' radiator?",
    options: ["A body painted black","A theoretical perfect absorber and emitter of electromagnetic radiation at all wavelengths","An opaque body that reflects all radiation","A body that only emits infrared radiation"],
    correct_answer: 1,
    explanation: "Black body: ideal object that absorbs ALL incident radiation (absorptivity = 1, reflectivity = 0) and emits radiation at all wavelengths according to Planck's Law. Real 'black bodies': cavity with small hole, carbon black, Sun (approximate). Planck's explanation of black body spectrum launched quantum theory (1900).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "In a step-up transformer, if the turns ratio (N₂/N₁) is 10, and input is 220V at 5A, then output voltage and current are:",
    options: ["2200V at 0.5A (power conserved: P=VI constant for ideal transformer)","220V at 50A","22V at 50A","2200V at 50A"],
    correct_answer: 0,
    explanation: "Step-up transformer: V₂/V₁ = N₂/N₁ = 10 → V₂ = 10 × 220 = 2200V. For ideal transformer: P_in = P_out → V₁I₁ = V₂I₂ → I₂ = V₁I₁/V₂ = (220 × 5)/2200 = 0.5A. Higher voltage → lower current (and vice versa). Power transmission uses this to minimize I²R losses.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "When sound waves pass from air into water, which property remains unchanged?",
    options: ["Speed","Wavelength","Frequency","Amplitude"],
    correct_answer: 2,
    explanation: "When waves (sound or light) pass from one medium to another, FREQUENCY remains unchanged (determined by the source). Speed changes (water ~1500 m/s, air ~340 m/s). Wavelength changes (λ = v/f). Amplitude changes due to reflection/transmission at interface. Same rule as light changing media.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The photoelectric effect experiment showed that increasing the intensity of light at a fixed frequency:",
    options: ["Increases the stopping potential","Increases the maximum kinetic energy of emitted electrons","Increases the number of photoelectrons but not their energy","Decreases the photoelectric current"],
    correct_answer: 2,
    explanation: "Key result: intensity ∝ number of photons ∝ number of electrons emitted (photoelectric current). BUT maximum KE of electrons depends ONLY on frequency: KE_max = hf − φ. Stopping potential (V₀ = KE_max/e) also depends only on frequency. This proved light is quantized (photons), not a continuous wave.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The Raman effect (for which C.V. Raman won Nobel 1930) involves:",
    options: ["Absorption of light by a gas","Inelastic scattering of light by molecules — scattered light has different wavelength (loses or gains energy from molecular vibrations)","Reflection of light by crystals","Diffraction of X-rays by crystal lattice"],
    correct_answer: 1,
    explanation: "Raman Effect (1928): when monochromatic light passes through a transparent substance, most scatters at the same wavelength (Rayleigh scattering), but a small fraction scatters at longer wavelengths (Stokes lines) or shorter wavelengths (anti-Stokes). The frequency shift is characteristic of the molecule. Used in analytical chemistry (Raman spectroscopy).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Two resistors of 6Ω and 3Ω are connected in parallel. The equivalent resistance is:",
    options: ["9Ω","2Ω","18Ω","0.5Ω"],
    correct_answer: 1,
    explanation: "Parallel: 1/R = 1/6 + 1/3 = 1/6 + 2/6 = 3/6 = 1/2 → R = 2Ω. Rule: parallel resistance is always LESS than the smallest individual resistance (here smallest is 3Ω, result is 2Ω). Quick formula for two resistors: R = R₁R₂/(R₁+R₂) = 6×3/(6+3) = 18/9 = 2Ω.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The work function of sodium is 2.3 eV. Incident light has energy 3.0 eV. The maximum kinetic energy of emitted photoelectron is:",
    options: ["5.3 eV","3.0 eV","0.7 eV","2.3 eV"],
    correct_answer: 2,
    explanation: "KE_max = hf − φ = 3.0 − 2.3 = 0.7 eV. Stopping potential V₀ = KE_max/e = 0.7 V. Photoelectrons will have kinetic energies from 0 to 0.7 eV (depending on depth from surface). The maximum is for electrons at the surface needing minimum extra energy to escape.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The energy stored in a stretched spring (spring constant k, extension x) is:",
    options: ["kx","kx²","½kx²","2kx²"],
    correct_answer: 2,
    explanation: "Elastic PE = ½kx². Same formula as ½mv² (kinetic energy) in form but represents stored elastic potential energy. In SHM: total energy E = ½kA² = ½mv²_max (where A = amplitude). Work done to stretch spring from 0 to x: W = ½kx² (area under F vs x graph — triangle).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Bose-Einstein Condensate (BEC) is a state of matter observed when:",
    options: ["Matter is heated to extremely high temperatures","Bosons are cooled to near absolute zero — they all occupy the same quantum ground state, forming a single quantum entity","Pressure is increased to extreme levels","A gas is compressed to liquid state slowly"],
    correct_answer: 1,
    explanation: "BEC: predicted by Bose and Einstein (1924-25). Realized in lab in 1995 (Cornell, Wieman, Ketterle — Nobel 2001). Dilute gas of bosons cooled to nano-Kelvin temperatures → atoms condense into lowest quantum state → behave as single quantum entity. Exhibits superfluidity, quantum interference. 5th state of matter.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The gravitational field strength at a point is defined as:",
    options: ["Force × mass","Force per unit mass (g = F/m = GM/r²) — the acceleration a unit mass would experience","Mass × distance","Pressure per unit area"],
    correct_answer: 1,
    explanation: "Gravitational field strength g = F/m = GM/r². At Earth's surface: g ≈ 9.8 N/kg = 9.8 m/s² (same value — force per kg = acceleration). Field strength decreases with distance from planet centre. On Moon: g = 1.63 N/kg. Used to calculate weight W = mg anywhere in the universe.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "What is the relationship between the wavelength (λ), frequency (f), and speed (v) of a wave?",
    options: ["v = f/λ","v = fλ","v = λ/f","f = vλ"],
    correct_answer: 1,
    explanation: "Wave equation: v = fλ. Speed = frequency × wavelength. For EM waves in vacuum: c = fλ → f = c/λ. Radio waves (f = 1 MHz, λ = 300 m). Visible light (f = 5×10¹⁴ Hz, λ = 600 nm). Higher frequency → shorter wavelength for same speed.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The phenomenon of optical fibre communication over very long distances (thousands of km) is possible because of:",
    options: ["Strong light sources","Total internal reflection with very low attenuation in ultra-pure silica glass (~0.2 dB/km) and periodic amplification using erbium-doped fibre amplifiers (EDFAs)","Frequent signal boosters every 10 km","Infrared light requiring no amplification"],
    correct_answer: 1,
    explanation: "Modern optical fibre: ultra-pure silica glass with attenuation ~0.2 dB/km at 1550 nm wavelength. Signals need amplification every ~80-100 km using EDFAs (no optical-electrical-optical conversion). Wavelength Division Multiplexing (WDM): many wavelengths (colours) in one fiber → Tbps data rates. Submarine cables span oceans.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Which of the following devices works on the principle of mutual induction?",
    options: ["Electric motor","Solar cell","Transformer","Capacitor"],
    correct_answer: 2,
    explanation: "Mutual induction: changing current in primary coil → changing magnetic flux → EMF induced in secondary coil. Transformer works on this principle. Self-induction: EMF induced in same coil due to its own changing current (inductor/choke). Motor: motor effect (F on current in B). Solar cell: photovoltaic.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The electrical conductivity of a semiconductor INCREASES with temperature because:",
    options: ["Lattice vibrations decrease","More electrons gain enough thermal energy to jump from valence band to conduction band","Crystal structure changes","Electron mass decreases"],
    correct_answer: 1,
    explanation: "Semiconductor band gap: ~1-3 eV (Silicon: 1.12 eV). At higher temperatures: more electrons thermally excited from valence band → conduction band (and holes created in valence band). More charge carriers → higher conductivity. Opposite of metals (lattice scattering increases with T → conductivity decreases).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The solar wind, which causes auroras (Northern and Southern Lights), consists of:",
    options: ["Light particles from the Sun","Charged particles (mainly electrons and protons) ejected from the Sun's corona","Sound waves from solar explosions","Neutrinos from nuclear fusion in the Sun"],
    correct_answer: 1,
    explanation: "Solar wind: stream of charged particles (electrons, protons, helium nuclei) from Sun's corona (~400-800 km/s). Earth's magnetic field deflects most particles. At polar regions, field lines converge → particles enter atmosphere → excite gas atoms → Aurora Borealis (N) / Aurora Australis (S).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Who formulated the three laws of planetary motion?",
    options: ["Galileo Galilei","Nicolaus Copernicus","Johannes Kepler","Isaac Newton"],
    correct_answer: 2,
    explanation: "Johannes Kepler (1609, 1619): (1) Planets orbit Sun in ellipses with Sun at one focus. (2) Line from Sun to planet sweeps equal areas in equal times. (3) T² ∝ a³ (orbital period squared proportional to semi-major axis cubed). Newton later derived these from his laws of gravitation.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The phenomenon where a rotating black hole drags spacetime around it (as predicted by GR) is called:",
    options: ["Gravitational lensing","Frame dragging (Lense-Thirring effect)","Hawking radiation","Geodetic precession"],
    correct_answer: 1,
    explanation: "Frame dragging (Lense-Thirring effect): rotating massive bodies drag the fabric of spacetime around them. Confirmed experimentally by Gravity Probe B (2011). Relevant for rotating black holes (Kerr metric) and neutron stars. Causes the ergosphere around Kerr black holes where nothing can remain stationary.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'photoelectric effect' is used in which of the following practical applications?",
    options: ["MRI scanning","Automatic street lights that switch on at dusk (using a photocell/LDR that detects falling light)","Nuclear reactors","Hydroelectric generators"],
    correct_answer: 1,
    explanation: "Photocell applications: automatic street lights (light-dependent resistor — LDR), exposure meters in cameras, flame detectors in boilers, burglar alarms, solar panels (photovoltaic), photomultiplier tubes in scientific instruments. These devices convert light to electrical signal.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "A body travelling at constant speed in a circle has:",
    options: ["Zero acceleration","Constant velocity","Acceleration directed toward the centre (centripetal acceleration = v²/r)","Acceleration directed outward (centrifugal)"],
    correct_answer: 2,
    explanation: "Uniform circular motion: speed constant but velocity direction changes continuously → acceleration exists (centripetal a = v²/r = ω²r, directed toward centre). This is why it is NOT uniform velocity. The centripetal force (mv²/r) is the real force; centrifugal is a pseudo-force in the rotating frame.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "What distinguishes a renewable energy source from a non-renewable one?",
    options: ["Renewable sources are always cheaper","Renewable sources are naturally replenished on human timescales (solar, wind, hydro, geothermal, biomass); non-renewable sources are finite (coal, oil, gas, nuclear)","Non-renewable sources cause no pollution","Renewable sources produce only DC electricity"],
    correct_answer: 1,
    explanation: "Renewable: replenished naturally within human lifespan. Solar (sunlight), Wind, Hydro (rain replenishes reservoirs), Geothermal (Earth's heat), Tidal, Biomass. Non-renewable: took millions of years to form — coal, petroleum, natural gas (fossil fuels), nuclear (finite uranium). India's renewable energy capacity growing rapidly.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "CERN's Large Hadron Collider (LHC) accelerates protons to near light speed. The LHC is located:",
    options: ["USA (Fermilab, Chicago)","Japan (KEK, Tsukuba)","Switzerland-France border (near Geneva)","Russia (Dubna)"],
    correct_answer: 2,
    explanation: "LHC: world's largest and highest energy particle accelerator. 27 km circumference, on Swiss-French border near Geneva. Operated by CERN (founded 1954, 23 member states). Discovered Higgs boson (2012). Proton beams reach 99.9999991% of light speed. Uses 1232 superconducting dipole magnets at 1.9 K.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The uncertainty principle ΔE·Δt ≥ ℏ/2 means that:",
    options: ["Energy cannot be measured precisely","Short-lived quantum states (small Δt) have uncertain energy (large ΔE) — explaining the natural linewidth of spectral lines","Energy is not conserved at short timescales","Time cannot be measured"],
    correct_answer: 1,
    explanation: "Energy-time uncertainty: short-lived excited states (Δt = lifetime) → uncertain energy → broad spectral lines (natural linewidth). Virtual particles can exist briefly by 'borrowing' energy. Excited nuclear states (broad resonances in cross-sections). Heisenberg uncertainty is fundamental — not a measurement limitation.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The study of motion without considering its causes (forces) is called:",
    options: ["Dynamics","Statics","Kinematics","Mechanics"],
    correct_answer: 2,
    explanation: "Kinematics: study of motion (displacement, velocity, acceleration, time) without reference to forces or mass. Equations: v = u + at, s = ut + ½at², v² = u² + 2as, s = (u+v)t/2. Dynamics: motion + forces (Newton's laws). Statics: bodies in equilibrium. Mechanics = kinematics + dynamics.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The energy of a photon with wavelength 600 nm (visible orange light) is approximately:",
    options: ["2.07 eV","5.0 eV","0.5 eV","10 eV"],
    correct_answer: 0,
    explanation: "E = hc/λ = (6.626×10⁻³⁴ × 3×10⁸) / (600×10⁻⁹) = 3.31×10⁻¹⁹ J = 2.07 eV. Visible light: ~1.8 eV (red, 700 nm) to ~3.1 eV (violet, 400 nm). UV photons have higher energy (can break chemical bonds, cause sunburn). X-rays: keV. Gamma rays: MeV.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The binding energy per nucleon is greatest for:",
    options: ["Hydrogen (lightest element)","Iron-56 (most stable nucleus)","Uranium-238 (heaviest natural nucleus)","Carbon-12"],
    correct_answer: 1,
    explanation: "Binding energy per nucleon peaks at iron-56 (~8.8 MeV/nucleon) — most stable nucleus. Elements lighter than Fe: fusion releases energy (Sun's process). Elements heavier than Fe: fission releases energy (nuclear reactors). This 'iron peak' explains why both fusion (stars) and fission (reactors) can release energy.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Indian physicist G.N. Ramachandran is best known for:",
    options: ["Development of the cyclotron","Ramachandran Plot — describing the allowed conformations of amino acids in proteins (key to structural biology)","Discovery of X-ray diffraction","Theory of superconductivity"],
    correct_answer: 1,
    explanation: "G.N. Ramachandran (1922–2001): Indian physicist/biologist at IISc Bengaluru. Developed the Ramachandran plot (1963) — shows allowed dihedral angle combinations (φ, ψ) in polypeptide chains. Essential tool in protein structure analysis. Also proposed the triple-helical structure of collagen.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "What does a 'black body' temperature of 5778 K tell us about our Sun?",
    options: ["The Sun's core temperature","The Sun's surface temperature (photosphere) — which determines its peak emission in yellow-green visible light","The temperature of sunspots","The temperature of the solar corona"],
    correct_answer: 1,
    explanation: "Wien's Displacement Law: λ_max × T = 2.898 × 10⁻³ m·K. For Sun (T = 5778 K): λ_max ≈ 501 nm (green-yellow, visible). The Sun appears yellow-white as our eyes perceive the mix. Sun's core: ~15 million K. Sunspots: ~3700 K (cooler → appear dark). Corona: ~1-3 million K.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The fundamental frequency of a stretched string is 200 Hz. The second harmonic has a frequency of:",
    options: ["100 Hz","200 Hz","400 Hz","600 Hz"],
    correct_answer: 2,
    explanation: "Harmonics of a stretched string: f_n = n × f₁ (n = 1, 2, 3...). Fundamental (1st harmonic): f₁ = 200 Hz. 2nd harmonic: f₂ = 2 × 200 = 400 Hz. 3rd harmonic: f₃ = 600 Hz. All harmonics are present in a vibrating string (unlike closed organ pipe which has only odd harmonics).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The ITER project (International Thermonuclear Experimental Reactor) being built in France aims to demonstrate:",
    options: ["Advanced nuclear fission efficiency","Net energy gain from nuclear fusion (Q > 1), using D-T plasma confined by magnetic fields (tokamak)","Thorium-based breeder reactors","Space-based solar power"],
    correct_answer: 1,
    explanation: "ITER (35 nations, under construction in Cadarache, France): world's largest tokamak. Goal: produce 500 MW fusion power from 50 MW input (Q = 10). Uses D-T (deuterium-tritium) plasma at 150 million°C confined by superconducting magnets. If successful → DEMO → first fusion power plant.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
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
