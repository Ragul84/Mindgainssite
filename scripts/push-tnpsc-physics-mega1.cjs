require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const BASE  = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
const KEY   = 'quiz:subject:physics';
const HDR   = { Authorization:`Bearer ${TOKEN}`, 'Content-Type':'application/json' };

const questions = [
  // --- Motion & Kinematics ---
  {
    question_text: "The SI unit of force is:",
    options: ["Joule","Newton","Pascal","Watt"],
    correct_answer: 1,
    explanation: "Newton (N) is the SI unit of force. 1 N = 1 kg·m/s². Named after Sir Isaac Newton. Joule is energy, Pascal is pressure, Watt is power.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "An object moves with uniform velocity. The net force acting on it is:",
    options: ["Equal to its weight","Maximum","Zero","Equal to friction"],
    correct_answer: 2,
    explanation: "Newton's First Law: an object in uniform (constant) velocity has zero acceleration → zero net force (forces are balanced). This is Newton's law of inertia.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb"]
  },
  {
    question_text: "The acceleration due to gravity on the surface of the Earth is approximately:",
    options: ["8.9 m/s²","9.8 m/s²","10.8 m/s²","11.2 m/s²"],
    correct_answer: 1,
    explanation: "g = 9.8 m/s² (often approximated as 10 m/s²) at Earth's surface. It varies slightly with latitude and altitude. At poles g is slightly higher; at equator slightly lower.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "A ball is thrown upward with initial velocity u. At the highest point, its velocity is:",
    options: ["u","u/2","Zero","2u"],
    correct_answer: 2,
    explanation: "At the highest point of projectile motion (vertical throw), the vertical velocity component = 0. The ball momentarily stops before falling back. Horizontal velocity is unaffected in projectile motion.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb"]
  },
  {
    question_text: "Which of Newton's laws explains why a gun recoils when a bullet is fired?",
    options: ["First Law","Second Law","Third Law","Law of Gravitation"],
    correct_answer: 2,
    explanation: "Newton's Third Law: every action has an equal and opposite reaction. Bullet fired forward (action) → gun recoils backward (reaction). Gun recoil is the reaction force.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The relationship between force (F), mass (m), and acceleration (a) is given by Newton's Second Law as:",
    options: ["F = m/a","F = ma","F = m + a","F = a/m"],
    correct_answer: 1,
    explanation: "Newton's Second Law: F = ma. Force equals mass multiplied by acceleration. This law defines the Newton: 1 N = force that gives 1 kg mass an acceleration of 1 m/s².",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The momentum of a body is defined as:",
    options: ["Mass × velocity","Force × time","Mass × acceleration","Force × distance"],
    correct_answer: 0,
    explanation: "Momentum (p) = mass × velocity (p = mv). SI unit: kg·m/s. Newton's Second Law: F = dp/dt (rate of change of momentum). Law of conservation of momentum: total momentum is conserved in closed systems.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The law of conservation of momentum states that the total momentum of a system remains constant when:",
    options: ["Friction is zero","No external force acts on the system","The system is at rest","Velocity is uniform"],
    correct_answer: 1,
    explanation: "Conservation of momentum: in an isolated system (no external forces), total momentum before = total momentum after any event (collision, explosion). Basis for rocket propulsion, billiards, car crashes analysis.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Escape velocity is the minimum speed needed to escape Earth's gravitational field. Its value is approximately:",
    options: ["7.9 km/s","11.2 km/s","15.0 km/s","3.0 × 10⁸ m/s"],
    correct_answer: 1,
    explanation: "Escape velocity from Earth = √(2gR) = 11.2 km/s. Orbital velocity (first cosmic velocity) = 7.9 km/s. Objects launched slower than 11.2 km/s fall back to Earth. Moon has lower escape velocity (2.38 km/s).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The period of a simple pendulum depends on:",
    options: ["Mass of the bob","Length of the pendulum and g","Amplitude of oscillation","Material of the string"],
    correct_answer: 1,
    explanation: "Period T = 2π√(L/g). Depends only on length (L) and acceleration due to gravity (g). Independent of mass and amplitude (for small amplitudes). Longer pendulum → longer period.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Work, Energy, Power ---
  {
    question_text: "Work done is defined as:",
    options: ["Force × time","Force × displacement × cos θ","Mass × acceleration × time","Power × distance"],
    correct_answer: 1,
    explanation: "Work W = F·d·cosθ, where θ is angle between force and displacement. If force is perpendicular to displacement, W = 0 (e.g., circular motion, carrying a bag horizontally). SI unit: Joule.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The SI unit of energy and work is:",
    options: ["Watt","Newton","Joule","Pascal"],
    correct_answer: 2,
    explanation: "Joule (J) is the SI unit of energy and work. 1 J = 1 N·m = 1 kg·m²/s². Named after James Prescott Joule. Other units: calorie (1 cal = 4.18 J), kilowatt-hour (1 kWh = 3.6 × 10⁶ J).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Kinetic energy of an object moving with velocity v and mass m is:",
    options: ["mv","½mv²","mv²","2mv"],
    correct_answer: 1,
    explanation: "KE = ½mv². If mass doubles, KE doubles. If velocity doubles, KE quadruples (squared relationship). Unit: Joule. This is why speed limits matter — a car at 100 km/h has 4× the KE of one at 50 km/h.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The law of conservation of energy states that energy:",
    options: ["Can be created from nothing","Can be destroyed in nuclear reactions","Can neither be created nor destroyed, only converted from one form to another","Decreases over time"],
    correct_answer: 2,
    explanation: "Conservation of Energy (First Law of Thermodynamics): total energy is constant. Energy transforms (PE→KE, chemical→electrical→light) but total amount is conserved. Perpetual motion machines violate this law.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Power is defined as:",
    options: ["Work / Time","Force × velocity only","Energy × time","Force / distance"],
    correct_answer: 0,
    explanation: "Power P = Work/Time = W/t. Also P = F·v (force × velocity). SI unit: Watt (W) = Joule/second = J/s. 1 horsepower = 746 W. Named after James Watt, inventor of the steam engine.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "A spring stretched from its natural length stores which type of energy?",
    options: ["Kinetic energy","Chemical energy","Elastic potential energy","Thermal energy"],
    correct_answer: 2,
    explanation: "Elastic potential energy = ½kx², where k is spring constant and x is extension/compression. This energy is released when spring returns to natural length (spring gun, watch mechanism, car suspension).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb"]
  },
  // --- Gravitation ---
  {
    question_text: "Newton's law of universal gravitation states that the force of attraction between two masses is:",
    options: ["Directly proportional to the product of masses and inversely proportional to the square of distance","Directly proportional to the distance between them","Inversely proportional to the product of masses","Equal to the sum of the masses divided by distance"],
    correct_answer: 0,
    explanation: "F = Gm₁m₂/r². G = 6.674 × 10⁻¹¹ N·m²/kg² (gravitational constant). Force is attractive, acts along line joining masses. Inverse square law: double distance → force becomes ¼.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Geostationary orbit is at approximately what altitude above Earth's surface?",
    options: ["200 km","2000 km","35,786 km","400,000 km"],
    correct_answer: 2,
    explanation: "Geostationary orbit: 35,786 km above Earth's equator. Satellite's orbital period = 24 hours (same as Earth's rotation), so it appears stationary. Used for communication satellites, weather satellites (INSAT series).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The weight of an object in a freely falling lift (elevator) is:",
    options: ["Equal to its normal weight","Double its normal weight","Zero (apparent weightlessness)","Half its normal weight"],
    correct_answer: 2,
    explanation: "In free fall, both the person and lift accelerate at g. The normal force = 0 → apparent weight = 0. This is weightlessness. Astronauts in orbit are in perpetual free fall, hence they experience weightlessness.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Kepler's Second Law (Law of Equal Areas) states that a planet:",
    options: ["Moves in a circular orbit","Sweeps equal areas in equal time intervals (moves faster near the Sun)","Has orbital period proportional to the square of its radius","Moves at constant speed"],
    correct_answer: 1,
    explanation: "Kepler's 2nd Law: the line connecting a planet to the Sun sweeps equal areas in equal times. Planet moves faster when close to Sun (perihelion) and slower when far (aphelion). Consequence of angular momentum conservation.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // --- Pressure & Fluids ---
  {
    question_text: "Pascal's Law states that pressure applied to an enclosed fluid is:",
    options: ["Absorbed by the container walls","Transmitted equally in all directions throughout the fluid","Concentrated at the point of application","Lost as heat"],
    correct_answer: 1,
    explanation: "Pascal's Law: pressure applied to a confined fluid is transmitted unchanged in all directions. Applications: hydraulic jack (mechanical advantage), hydraulic brakes, hydraulic press. PA₁ = FA₂ (force amplification).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Archimedes' Principle states that a body immersed in a fluid experiences an upthrust equal to:",
    options: ["Its own weight","The weight of fluid displaced by it","The volume of fluid displaced","The surface area times pressure"],
    correct_answer: 1,
    explanation: "Archimedes' Principle: buoyant force = weight of displaced fluid. If buoyancy > weight of object → floats. If buoyancy < weight → sinks. Used in ship design, submarines, hydrometers, hot air balloons.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The atmospheric pressure at sea level is approximately:",
    options: ["1 bar = 100,000 Pa","1 atm = 101,325 Pa","760 mmHg only","All of the above are equivalent"],
    correct_answer: 3,
    explanation: "Standard atmospheric pressure = 1 atm = 101,325 Pa ≈ 1.013 bar = 760 mmHg = 760 torr. Measured by a mercury barometer (Torricelli, 1643). Decreases with altitude (thinner atmosphere).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Bernoulli's theorem relates to fluids in motion, stating that as fluid speed increases:",
    options: ["Pressure increases","Temperature increases","Pressure decreases","Density increases"],
    correct_answer: 2,
    explanation: "Bernoulli's Principle: in a streamline flow, higher velocity → lower pressure. Applications: aircraft wing lift (aerofoil), carburettor, spray gun (Venturi effect), curve ball in cricket/baseball, magnus effect.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Viscosity of a liquid is a measure of its:",
    options: ["Density","Resistance to flow (internal friction)","Surface tension","Compressibility"],
    correct_answer: 1,
    explanation: "Viscosity: internal resistance of a fluid to flow (internal friction between layers). High viscosity = thick, slow flowing (honey, glycerine). Low viscosity = thin, fast flowing (water, petrol). Decreases with temperature for liquids.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb"]
  },
  {
    question_text: "Surface tension in liquids is caused by:",
    options: ["Gravity acting on the surface molecules","Net inward cohesive force on surface molecules due to unequal molecular forces","Air pressure on the surface","Viscosity of the liquid"],
    correct_answer: 1,
    explanation: "Surface tension: molecules at the surface experience net inward force (no molecules above them), creating a 'skin.' SI unit: N/m. Causes water droplets to form spheres, insects walking on water, soap bubbles, capillary action.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb"]
  },
  // --- Thermodynamics & Heat ---
  {
    question_text: "The zeroth law of thermodynamics defines:",
    options: ["Conservation of energy","Entropy and disorder","Thermal equilibrium and the concept of temperature","Absolute zero temperature"],
    correct_answer: 2,
    explanation: "Zeroth Law: if A is in thermal equilibrium with C, and B is in thermal equilibrium with C, then A and B are in thermal equilibrium with each other. This defines temperature as a measurable property.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The first law of thermodynamics is essentially:",
    options: ["Law of conservation of momentum","Law of conservation of energy applied to thermodynamic systems (ΔU = Q − W)","Law that entropy always increases","Law defining absolute zero"],
    correct_answer: 1,
    explanation: "First Law: ΔU = Q − W. Change in internal energy = heat added to system minus work done by system. Energy is conserved. It rules out perpetual motion machines of the first kind (those creating energy from nothing).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The second law of thermodynamics states that:",
    options: ["Energy is always conserved","In any natural process, the total entropy of a system and its surroundings can only increase","Heat can flow from cold to hot without work","All processes are reversible"],
    correct_answer: 1,
    explanation: "Second Law: entropy (disorder) of an isolated system always increases. Heat naturally flows from hot to cold. No heat engine can be 100% efficient. Rules out perpetual motion machines of the second kind.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Absolute zero temperature is:",
    options: ["0°C","−100°C","−273.15°C (0 Kelvin)","−459°C"],
    correct_answer: 2,
    explanation: "Absolute zero = 0 K = −273.15°C = −459.67°F. The lowest theoretically possible temperature — all molecular motion stops. The Kelvin scale starts at absolute zero. Cannot be achieved in practice (Third Law).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Specific heat capacity of water is 4200 J/kg·K. This means:",
    options: ["Water boils at 4200°C","1 kg of water needs 4200 J of heat to raise its temperature by 1 K (or 1°C)","Water can store 4200 g of heat","Water freezes at −4200°C"],
    correct_answer: 1,
    explanation: "Specific heat capacity: heat needed per unit mass per unit temperature rise. Water's high specific heat (4200 J/kg·K) makes it excellent for cooling systems. Land heats/cools faster than sea (lower specific heat of soil).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Which mode of heat transfer does not require a medium (can occur in vacuum)?",
    options: ["Conduction","Convection","Radiation","All three require a medium"],
    correct_answer: 2,
    explanation: "Radiation: electromagnetic waves (infrared) carry heat without a medium. Sun heats Earth through space by radiation. Conduction and convection require matter. Thermos flasks use vacuum to prevent radiation (silvered surfaces) and conduction.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Latent heat is the heat absorbed or released during a change of state at:",
    options: ["Constant pressure","Constant temperature","Constant volume","Constant density"],
    correct_answer: 1,
    explanation: "Latent heat: absorbed/released during phase change (solid↔liquid: latent heat of fusion; liquid↔gas: latent heat of vaporization) at constant temperature. Water's high latent heat of vaporization (2260 kJ/kg) is why sweating cools effectively.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Boyle's Law states that for a fixed amount of gas at constant temperature:",
    options: ["Pressure is proportional to volume","Pressure is inversely proportional to volume (PV = constant)","Temperature is proportional to pressure","Volume is proportional to temperature"],
    correct_answer: 1,
    explanation: "Boyle's Law (Robert Boyle, 1662): PV = constant (at constant T and n). Double the pressure → halve the volume. Explains: syringe operation, breathing mechanics (lungs), pressure cookers.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Charles' Law states that for a gas at constant pressure, volume is:",
    options: ["Inversely proportional to temperature","Directly proportional to absolute temperature (V/T = constant)","Constant regardless of temperature","Proportional to the square of temperature"],
    correct_answer: 1,
    explanation: "Charles' Law (Jacques Charles, 1787): V/T = constant (at constant P and n). Balloon shrinks in cold, expands in heat. Hot air balloon rises because heated air expands → lower density. Temperature must be in Kelvin.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Optics ---
  {
    question_text: "The speed of light in vacuum is:",
    options: ["3 × 10⁶ m/s","3 × 10⁸ m/s","3 × 10¹⁰ m/s","3 × 10⁴ m/s"],
    correct_answer: 1,
    explanation: "Speed of light in vacuum c = 3 × 10⁸ m/s (exactly 299,792,458 m/s). Highest possible speed in the universe (Einstein's Special Relativity). Light from Sun takes ~8 minutes to reach Earth.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Total Internal Reflection occurs when light travels from:",
    options: ["Rarer to denser medium at any angle","Denser to rarer medium at angles greater than the critical angle","Rarer to denser medium at the critical angle","Any medium to vacuum"],
    correct_answer: 1,
    explanation: "Total Internal Reflection: when light in a denser medium hits the interface with a rarer medium at angle > critical angle, it reflects completely back. Applications: optical fibers, diamonds' brilliance, mirages.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "A convex (converging) lens can form a real, inverted image when the object is:",
    options: ["Between F and 2F","Beyond 2F","At F","Between F and the lens"],
    correct_answer: 1,
    explanation: "Convex lens: object beyond 2F → real, inverted, diminished image beyond 2F on other side. Object at 2F → real, inverted, same-size image at 2F. Object between F and lens → virtual, erect, magnified image (magnifying glass).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb"]
  },
  {
    question_text: "The phenomenon responsible for the blue colour of the sky is:",
    options: ["Reflection of sunlight by clouds","Rayleigh scattering of shorter wavelengths (blue) more than longer wavelengths","Refraction of sunlight by the atmosphere","Absorption of red light by the atmosphere"],
    correct_answer: 1,
    explanation: "Rayleigh Scattering: atmospheric gas molecules scatter shorter wavelengths (blue, violet) much more than longer wavelengths (red, orange). We see blue (our eyes are more sensitive to blue than violet). At sunset, longer path → red/orange sky.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "A rainbow is formed due to which combination of optical phenomena?",
    options: ["Reflection and diffraction","Refraction, dispersion, and total internal reflection inside water droplets","Scattering and refraction","Diffraction and interference"],
    correct_answer: 1,
    explanation: "Rainbow: sunlight enters a water droplet (refraction + dispersion into VIBGYOR), undergoes total internal reflection inside, then exits (refraction again). Different colours exit at different angles (violet 40°, red 42°). Always seen opposite to Sun.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Myopia (short-sightedness) is corrected using:",
    options: ["Convex lens","Concave lens","Bifocal lens","Cylindrical lens"],
    correct_answer: 1,
    explanation: "Myopia: eyeball too long, image forms in front of retina. Concave (diverging) lens corrects it by diverging rays before they enter the eye, so they focus on retina. Hypermetropia (far-sighted) → corrected by convex lens.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The focal length of a lens and its power (in dioptres) are related as:",
    options: ["Power = focal length","Power = 1/focal length (f in metres)","Power = focal length²","Power = 2 × focal length"],
    correct_answer: 1,
    explanation: "Power (P) = 1/f (f in metres). Unit: Dioptre (D). Convex lens: positive power (converging). Concave lens: negative power (diverging). Spectacle power of −2D means concave lens with f = −0.5 m.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Dispersion of white light through a prism separates it because different colours have different:",
    options: ["Frequencies in vacuum","Speeds in glass (different refractive indices)","Amplitudes","Wavelengths in vacuum"],
    correct_answer: 1,
    explanation: "Dispersion: different wavelengths (colours) travel at different speeds in glass → different refractive indices. Violet bends most (highest refractive index in glass), red bends least. VIBGYOR order from violet to red.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The phenomenon of light bending around corners is called:",
    options: ["Refraction","Reflection","Diffraction","Dispersion"],
    correct_answer: 2,
    explanation: "Diffraction: bending and spreading of waves (light, sound, water) around edges/obstacles or through slits. Significant when wavelength is comparable to obstacle size. Proves light is a wave. CD/DVD use diffraction for data reading.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "A concave mirror with focal length f forms a real, inverted image. The relation 1/v + 1/u = 1/f is called:",
    options: ["Snell's Law","Mirror formula","Lens maker's equation","Refraction formula"],
    correct_answer: 1,
    explanation: "Mirror formula: 1/v + 1/u = 1/f. Also magnification m = −v/u. For concave mirror: f is negative (using sign convention). Used in: telescopes, car headlights (parallel rays → focus), torch lights, solar furnaces.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb"]
  },
  // --- Sound ---
  {
    question_text: "Sound waves are:",
    options: ["Transverse waves","Electromagnetic waves","Longitudinal waves","Both transverse and longitudinal"],
    correct_answer: 2,
    explanation: "Sound waves are longitudinal waves — particles of the medium vibrate parallel to the direction of wave propagation (compressions and rarefactions). Unlike light (transverse), sound cannot travel in vacuum.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The speed of sound in air at 0°C is approximately:",
    options: ["220 m/s","331 m/s","440 m/s","1500 m/s"],
    correct_answer: 1,
    explanation: "Speed of sound in air at 0°C = 331 m/s. Increases by ~0.6 m/s per °C rise. At 25°C ≈ 346 m/s. Sound travels fastest in solids (steel ~5000 m/s), then liquids (water ~1500 m/s), slowest in gases.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The Doppler Effect in sound refers to the change in:",
    options: ["Speed of sound as source moves","Amplitude of sound near the source","Perceived frequency of sound when source and/or observer are in relative motion","Wavelength of sound in the medium"],
    correct_answer: 2,
    explanation: "Doppler Effect: source approaching observer → higher frequency heard (blueshifted sound). Source moving away → lower frequency (redshifted). Used in radar/lidar speed guns, medical ultrasound (blood flow), astronomy (redshift of galaxies).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "An echo is heard when the reflected sound reaches the listener after at least:",
    options: ["0.01 second","0.1 second","1 second","10 seconds"],
    correct_answer: 1,
    explanation: "Echo: minimum time = 0.1 second (human ear's persistence of sound). Minimum distance for echo = (331 m/s × 0.1 s) / 2 = ~17 metres. Sonar, bats (echolocation), and ultrasound use echo principle.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Ultrasound has frequency above:",
    options: ["20 Hz","200 Hz","20,000 Hz (20 kHz)","2,000,000 Hz"],
    correct_answer: 2,
    explanation: "Human hearing range: 20 Hz to 20,000 Hz. Ultrasound: > 20 kHz (beyond human hearing). Applications: medical imaging (sonography), echocardiography, sonar, industrial flaw detection, cleaning jewellery, bat navigation.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The loudness of sound is measured in:",
    options: ["Hertz (Hz)","Decibels (dB)","Newton (N)","Watt (W)"],
    correct_answer: 1,
    explanation: "Decibel (dB): logarithmic scale for sound intensity. 0 dB = threshold of hearing. Whisper ~30 dB, Conversation ~60 dB, Traffic ~80 dB, Rock concert ~120 dB, Jet engine ~140 dB. WHO: >85 dB prolonged exposure causes hearing damage.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Resonance occurs when:",
    options: ["Sound travels through vacuum","An object vibrates at its natural frequency due to external vibration at the same frequency","Sound bounces off a wall","Two waves cancel each other"],
    correct_answer: 1,
    explanation: "Resonance: when driving frequency = natural frequency of an object, amplitude dramatically increases. Examples: Tacoma Narrows Bridge collapse (1940), tuning radio, shattering glass with voice, microwave oven heating food.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Electricity ---
  {
    question_text: "Ohm's Law states that for a conductor at constant temperature:",
    options: ["Current is proportional to resistance","Voltage is inversely proportional to current","Current is directly proportional to voltage (V = IR)","Resistance changes with current"],
    correct_answer: 2,
    explanation: "Ohm's Law: V = IR. Current (I) = Voltage (V) / Resistance (R). SI units: Volt (V), Ampere (A), Ohm (Ω). Named after Georg Simon Ohm. Valid for ohmic conductors (metals at constant temperature). Semiconductors are non-ohmic.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Electric power is given by:",
    options: ["P = VI = I²R = V²/R","P = V/I","P = IR","P = V × R"],
    correct_answer: 0,
    explanation: "Electric Power P = VI = I²R = V²/R. Unit: Watt (W). 1 kW = 1000 W. Energy = Power × Time. Electricity bill in kWh (units): 1 unit = 1 kWh. A 100W bulb for 10 hours = 1 unit of electricity.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "In a series circuit, the same _______ flows through all components:",
    options: ["Voltage","Resistance","Current","Power"],
    correct_answer: 2,
    explanation: "Series circuit: same current through all; total voltage = sum of individual voltages; total resistance = sum of individual resistances (R_total = R₁ + R₂ + ...). If one component fails, whole circuit breaks (old Christmas lights).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "In a parallel circuit, the same _______ is across all components:",
    options: ["Current","Resistance","Power","Voltage"],
    correct_answer: 3,
    explanation: "Parallel circuit: same voltage across all branches; total current = sum of branch currents; 1/R_total = 1/R₁ + 1/R₂ + ... (total resistance is LESS than smallest). Home wiring is parallel — each device at 220V independently.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "A fuse in an electric circuit is used to:",
    options: ["Increase voltage","Store electric energy","Protect the circuit by melting and breaking the circuit when current is too high","Convert AC to DC"],
    correct_answer: 2,
    explanation: "Fuse: thin wire of low melting point alloy (tin-lead) that melts when current exceeds its rating, breaking the circuit. Prevents overheating and fires. Rating (amperes): must be replaced, unlike circuit breakers (reset). MCB = modern alternative.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The frequency of AC power supply in India is:",
    options: ["50 Hz","60 Hz","100 Hz","25 Hz"],
    correct_answer: 0,
    explanation: "India uses 50 Hz AC (alternating current), 220-230 V. USA/Canada use 60 Hz, 110-120 V. Frequency = 50 cycles/second means current changes direction 100 times per second (50 complete cycles). European standard too.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Coulomb's Law gives the force between two point charges as:",
    options: ["F = kq₁q₂/r (proportional to distance)","F = kq₁q₂/r² (inversely proportional to square of distance)","F = kq₁q₂r²","F = k(q₁+q₂)/r²"],
    correct_answer: 1,
    explanation: "Coulomb's Law: F = kq₁q₂/r². k = 9 × 10⁹ N·m²/C². Like charges repel, unlike attract. Electric field E = F/q. SI unit of charge: Coulomb (C). 1 C = charge of ~6.24 × 10¹⁸ electrons.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The electric field inside a conductor in electrostatic equilibrium is:",
    options: ["Maximum at the centre","Equal to the applied voltage","Zero","Proportional to charge"],
    correct_answer: 2,
    explanation: "Inside a conductor in electrostatic equilibrium: E = 0. Free electrons rearrange to cancel external field. Charges reside on the surface only. This is the basis of Faraday cage (shielding from external electric fields — microwave oven door mesh).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // --- Magnetism & Electromagnetism ---
  {
    question_text: "Faraday's Law of Electromagnetic Induction states that the induced EMF in a coil is:",
    options: ["Proportional to current flowing through it","Proportional to the rate of change of magnetic flux through it","Constant regardless of motion","Inversely proportional to resistance"],
    correct_answer: 1,
    explanation: "Faraday's Law: EMF = −dΦ/dt (rate of change of magnetic flux). Basis of: generators, transformers, induction cooktops, electric motors (reverse). Lenz's Law: induced current opposes the change causing it (negative sign).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "A transformer works on the principle of:",
    options: ["Electrostatic induction","Mutual induction between two coils","Self-inductance","Piezoelectric effect"],
    correct_answer: 1,
    explanation: "Transformer: mutual induction. AC in primary coil → changing magnetic flux → EMF induced in secondary. V₁/V₂ = N₁/N₂ (voltage ratio = turns ratio). Step-up: N₂ > N₁. Step-down: N₂ < N₁. Works only with AC.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The right-hand thumb rule (or right-hand rule) in electromagnetism is used to find:",
    options: ["Direction of current in a circuit","Direction of magnetic field around a current-carrying conductor","Direction of electric field","Direction of friction force"],
    correct_answer: 1,
    explanation: "Right-hand thumb rule: if thumb points in direction of current, curled fingers show direction of circular magnetic field around the conductor. For a solenoid: fingers curl in current direction, thumb points to North pole.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb"]
  },
  {
    question_text: "An electric motor converts:",
    options: ["Electrical energy to mechanical energy","Mechanical energy to electrical energy","Chemical energy to electrical energy","Thermal energy to electrical energy"],
    correct_answer: 0,
    explanation: "Electric motor: electrical energy → mechanical energy (using F = qv × B force on current in magnetic field). Electric generator is the reverse (mechanical → electrical via Faraday's law). DC motor vs AC motor (induction motor).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Magnetic field strength is measured in:",
    options: ["Volt","Ampere","Tesla","Ohm"],
    correct_answer: 2,
    explanation: "Tesla (T) is the SI unit of magnetic flux density (field strength). Named after Nikola Tesla. 1 T = 1 Wb/m² = 1 kg/(A·s²). Earth's magnetic field ≈ 25–65 μT. MRI machines use 1.5–3 T superconducting magnets.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Electromagnets are used in all of the following EXCEPT:",
    options: ["Electric bells","Loudspeakers","MRI machines","Permanent bar magnets"],
    correct_answer: 3,
    explanation: "Electromagnets are temporary magnets made by passing current through a coil around iron core. Used in: electric bells, loudspeakers, MRI machines, cranes for lifting scrap metal, maglev trains. Permanent magnets (alnico, neodymium) don't use electricity.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb"]
  },
  // --- Modern Physics ---
  {
    question_text: "The photoelectric effect was explained by:",
    options: ["Isaac Newton","James Clerk Maxwell","Albert Einstein","Niels Bohr"],
    correct_answer: 2,
    explanation: "Einstein explained the photoelectric effect (1905) using quantization of light (photons). E = hf (photon energy = Planck's constant × frequency). Won him the Nobel Prize in Physics 1921. Showed light behaves as particles.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Radioactivity was discovered by:",
    options: ["Marie Curie","Wilhelm Röntgen","Henri Becquerel","Ernest Rutherford"],
    correct_answer: 2,
    explanation: "Henri Becquerel discovered radioactivity in 1896 when uranium salts fogged a photographic plate. Marie and Pierre Curie isolated radioactive elements (polonium, radium) and coined 'radioactivity.' SI unit of radioactivity: Becquerel (Bq).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Alpha (α) particles are identical to:",
    options: ["Helium-4 nuclei (2 protons + 2 neutrons)","High-energy electrons","High-energy photons","Hydrogen nuclei (protons)"],
    correct_answer: 0,
    explanation: "Alpha particles = helium-4 nuclei (2 protons + 2 neutrons, charge +2). Least penetrating (stopped by paper or skin). Beta particles = electrons (−β) or positrons (+β). Gamma rays = high-energy photons (most penetrating).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The half-life of a radioactive element is defined as:",
    options: ["Time for the element to become completely inactive","Time for half of the radioactive atoms to decay","Half the atomic mass number","Time for radiation to travel half its range"],
    correct_answer: 1,
    explanation: "Half-life (t₁/₂): time for half of radioactive nuclei to decay. After n half-lives: N = N₀ × (½)ⁿ. Carbon-14 half-life = 5730 years (radiocarbon dating). Uranium-238: 4.5 billion years. Iodine-131: 8 days (used in thyroid therapy).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Einstein's famous equation E = mc² means:",
    options: ["Energy is equal to mass times speed of light","Mass can be converted to energy (and vice versa); c = speed of light","E is kinetic energy of a moving object","c is the speed of sound"],
    correct_answer: 1,
    explanation: "E = mc²: mass-energy equivalence. c = 3 × 10⁸ m/s. A tiny mass releases enormous energy (c² is huge). Basis of nuclear power and nuclear weapons: fission of uranium-235 converts small mass to huge energy.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Nuclear fission involves:",
    options: ["Combining two light nuclei to form a heavy nucleus releasing energy","Splitting a heavy nucleus (like U-235) into two smaller nuclei releasing energy","Radioactive decay of an atom","Conversion of a neutron into a proton"],
    correct_answer: 1,
    explanation: "Nuclear Fission: heavy nucleus (U-235, Pu-239) absorbs neutron → splits into smaller nuclei + 2-3 neutrons + energy. Chain reaction: released neutrons cause more fissions. Used in nuclear power plants (controlled) and atomic bombs (uncontrolled).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Nuclear fusion, which powers the Sun, involves:",
    options: ["Splitting uranium atoms","Combining light nuclei (hydrogen isotopes) to form heavier nuclei releasing enormous energy","Radioactive decay of heavy elements","Fission followed by fusion"],
    correct_answer: 1,
    explanation: "Nuclear Fusion: light nuclei (H-2 deuterium + H-3 tritium) fuse → helium + neutron + 17.6 MeV energy. Sun fuses ~620 million tonnes H/second. Fusion releases more energy than fission per unit mass. Hydrogen bomb uses fusion.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Bohr's model of the hydrogen atom proposed that electrons:",
    options: ["Are randomly distributed in the nucleus","Move in fixed, discrete orbits (energy levels) without radiating energy","Can be at any distance from the nucleus","Have variable mass depending on speed"],
    correct_answer: 1,
    explanation: "Bohr model (1913): electrons orbit nucleus in fixed quantized energy levels (shells: n=1,2,3...). Energy emitted/absorbed only when electrons jump between levels (E = hf). Explains hydrogen's emission spectrum. Later replaced by quantum mechanics.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "X-rays were discovered by:",
    options: ["Marie Curie","Henri Becquerel","Wilhelm Conrad Röntgen","Albert Einstein"],
    correct_answer: 2,
    explanation: "Wilhelm Röntgen discovered X-rays in November 1895. Won first Nobel Prize in Physics (1901). X-rays: electromagnetic radiation, wavelength 0.01–10 nm. Used in medical imaging (bone fractures), airport security, crystallography.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The wave-particle duality of matter was proposed by:",
    options: ["Albert Einstein","Niels Bohr","Louis de Broglie","Max Planck"],
    correct_answer: 2,
    explanation: "Louis de Broglie (1924): matter (like electrons) also has wave properties. Wavelength λ = h/mv (de Broglie wavelength). Electron diffraction experiments confirmed this. Foundation of quantum mechanics; explains electron orbitals.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // --- Waves ---
  {
    question_text: "The frequency of a wave is related to its time period by:",
    options: ["f = T","f = 1/T","f = 2πT","f = T/2"],
    correct_answer: 1,
    explanation: "Frequency (f) = 1/Time period (T). Frequency: number of complete cycles per second (Hz). Period: time for one complete cycle (seconds). Wave speed v = fλ (frequency × wavelength). Higher frequency = shorter wavelength.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Electromagnetic waves are transverse waves. Which of the following is NOT an electromagnetic wave?",
    options: ["X-rays","Gamma rays","Ultrasound","Microwaves"],
    correct_answer: 2,
    explanation: "Ultrasound: mechanical longitudinal sound waves (>20,000 Hz). Not electromagnetic. All EM waves: gamma, X-ray, UV, visible light, IR, microwave, radio/TV waves. All travel at c = 3×10⁸ m/s in vacuum. No medium needed.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Infrared radiation is used in all of the following EXCEPT:",
    options: ["TV remote controls","Thermal (night vision) cameras","Sterilizing surgical equipment","Physiotherapy heating"],
    correct_answer: 2,
    explanation: "UV (ultraviolet) radiation is used to sterilize surgical equipment and drinking water. Infrared: TV remotes (near IR), thermal cameras (far IR), IR spectroscopy, physiotherapy, greenhouse warming. Also heat lamps in restaurants.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "LASER stands for:",
    options: ["Light Amplification by Stimulated Emission of Radiation","Light Absorption by Stimulated Electron Radiation","Linear Amplification of Sinusoidal Energy Radiation","Long-range Amplified Signal of Electromechanical Radiation"],
    correct_answer: 0,
    explanation: "LASER: Light Amplification by Stimulated Emission of Radiation. Properties: monochromatic (one wavelength), coherent (in phase), directional (narrow beam), intense. Applications: surgery, barcode readers, CDs/DVDs, fiber optics, range finding, welding.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Measurement & Units ---
  {
    question_text: "The SI unit of electric current is:",
    options: ["Volt","Ohm","Ampere","Coulomb"],
    correct_answer: 2,
    explanation: "Ampere (A) is the SI base unit of electric current. Named after André-Marie Ampère. 1 Ampere = 1 Coulomb of charge passing per second (1 A = 1 C/s). The other 6 SI base units: m, kg, s, K, mol, cd.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The instrument used to measure electric current in a circuit is:",
    options: ["Voltmeter","Ammeter","Galvanometer","Wattmeter"],
    correct_answer: 1,
    explanation: "Ammeter: measures current; connected in SERIES (low resistance to not affect circuit). Voltmeter: measures voltage; connected in PARALLEL (high resistance). Galvanometer: detects small currents. Wattmeter: measures power.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "A thermometer measures temperature. Which thermometer uses the principle of expansion of mercury?",
    options: ["Bimetallic strip thermometer","Clinical mercury thermometer","Thermocouple thermometer","Resistance thermometer (RTD)"],
    correct_answer: 1,
    explanation: "Clinical mercury thermometer: mercury expands uniformly with temperature. Normal human body temperature: 37°C (98.6°F). Mercury banned in EU due to toxicity; replaced by digital or alcohol thermometers. Rectal: most accurate, oral: convenient.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb"]
  },
  {
    question_text: "A manometer is used to measure:",
    options: ["Temperature","Fluid pressure","Wind speed","Electrical resistance"],
    correct_answer: 1,
    explanation: "Manometer: measures fluid (gas or liquid) pressure. U-tube manometer uses liquid column height to measure pressure difference. Bourdon gauge: measures high pressures (tyre pressure gauges). Barometer: measures atmospheric pressure.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb"]
  },
  {
    question_text: "The number of fundamental (base) units in the SI system is:",
    options: ["5","7","9","12"],
    correct_answer: 1,
    explanation: "7 SI base units: metre (length), kilogram (mass), second (time), ampere (current), kelvin (temperature), mole (amount of substance), candela (luminous intensity). All other units are derived from these 7.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The dimensional formula of pressure is:",
    options: ["[MLT⁻²]","[ML⁻¹T⁻²]","[ML²T⁻²]","[MLT⁻¹]"],
    correct_answer: 1,
    explanation: "Pressure = Force/Area = [MLT⁻²] / [L²] = [ML⁻¹T⁻²]. SI unit: Pascal (Pa) = N/m². Named after Blaise Pascal. Also: 1 Pa = 1 kg/(m·s²). Standard atmospheric pressure = 101,325 Pa.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb"]
  },
  // --- Semiconductors & Technology ---
  {
    question_text: "Semiconductors have electrical conductivity:",
    options: ["Like metals (very high)","Like insulators (very low)","Between conductors and insulators, controllable by doping","Zero at all temperatures"],
    correct_answer: 2,
    explanation: "Semiconductors (silicon, germanium): conductivity between conductors and insulators. Conductivity increases with temperature (unlike metals). Doping (adding impurities) creates p-type (positive holes) and n-type (extra electrons). Used in transistors, diodes, ICs.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "A p-n junction diode allows current to flow in:",
    options: ["Both directions equally","Only one direction (forward bias: p+, n−)","Neither direction","Alternating directions"],
    correct_answer: 1,
    explanation: "p-n junction diode: conducts in forward bias (p-side connected to +ve terminal) and blocks in reverse bias. Used for: rectification (AC to DC), signal detection, LED (light emission in forward bias), solar cells, Zener diodes (voltage regulation).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb"]
  },
  {
    question_text: "LED (Light Emitting Diode) emits light when:",
    options: ["Reverse biased","Forward biased (electrons recombine with holes, releasing photons)","Heated","Connected to AC supply"],
    correct_answer: 1,
    explanation: "LED: p-n junction diode that emits light (electroluminescence) when forward biased. Electrons recombine with holes → energy released as photons. Colour depends on bandgap. Energy-efficient (90% less energy than incandescent bulbs). Used in displays, lighting, indicators.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Superconductivity is characterized by:",
    options: ["Very high resistance at low temperatures","Zero electrical resistance below a critical temperature","Maximum conductivity at room temperature","Infinite resistance above 0°C"],
    correct_answer: 1,
    explanation: "Superconductivity: zero electrical resistance below critical temperature (Tc). Discovered by Heike Kamerlingh Onnes (1911) in mercury at 4.2 K. Applications: MRI magnets, maglev trains, particle accelerators (LHC at CERN), future quantum computers.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Famous Physicists & Their Contributions ---
  {
    question_text: "C.V. Raman received the Nobel Prize in Physics (1930) for his discovery of:",
    options: ["Radioactivity","The Raman Effect (inelastic scattering of light)","The photoelectric effect","Nuclear fission"],
    correct_answer: 1,
    explanation: "C.V. Raman: discovered Raman Effect (1928) — when light passes through a transparent medium, some light is scattered at different wavelengths (inelastic scattering). Won Nobel Prize 1930 (first Indian to win Nobel in Science). February 28 = National Science Day.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "James Clerk Maxwell is known for:",
    options: ["Discovery of electron","Laws of thermodynamics","Unification of electricity, magnetism, and optics into electromagnetic theory (Maxwell's equations)","Discovery of X-rays"],
    correct_answer: 2,
    explanation: "Maxwell (1860s): four equations unifying electricity, magnetism → predicted electromagnetic waves traveling at c = 3×10⁸ m/s (the same as measured speed of light). Proved light is EM wave. Hertz experimentally confirmed radio waves (1887).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Which physicist developed the theory of Special Relativity (1905) and General Relativity (1915)?",
    options: ["Isaac Newton","Niels Bohr","Max Planck","Albert Einstein"],
    correct_answer: 3,
    explanation: "Einstein: Special Relativity (1905) — time dilation, length contraction, E=mc². General Relativity (1915) — gravity as curvature of spacetime. Predicted gravitational waves (confirmed 2015 by LIGO). Nobel Prize 1921 for photoelectric effect.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The electron was discovered by:",
    options: ["Ernest Rutherford","J.J. Thomson","James Chadwick","Niels Bohr"],
    correct_answer: 1,
    explanation: "J.J. Thomson discovered the electron in 1897 through cathode ray tube experiments. Measured charge-to-mass ratio. Proposed 'plum pudding' model of atom. Nobel Prize 1906. Chadwick discovered neutron (1932). Rutherford discovered proton and nucleus.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The nuclear model of the atom (with a dense central nucleus) was proposed by:",
    options: ["J.J. Thomson","Niels Bohr","Ernest Rutherford","James Chadwick"],
    correct_answer: 2,
    explanation: "Rutherford's Gold Foil Experiment (1909-1911): alpha particles fired at gold foil — most passed through, some deflected back. Conclusion: atom is mostly empty space with dense, positively-charged nucleus. Discovered proton (1917).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Applied Physics / Daily Life ---
  {
    question_text: "A refrigerator works on the principle of:",
    options: ["Peltier effect only","Vapour compression refrigeration cycle (refrigerant absorbs heat when evaporating)","Magnetic cooling","Thermoelectric effect"],
    correct_answer: 1,
    explanation: "Refrigerator: vapour compression cycle. Refrigerant (Freon/HFC): compressed → condensed (releases heat outside) → expanded (evaporates, absorbs heat inside fridge, cooling it). Compressor is electrically driven. CFC-free refrigerants since Montreal Protocol.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "A pressure cooker cooks food faster because:",
    options: ["It uses microwave radiation","Increased pressure raises the boiling point of water above 100°C","It circulates steam continuously","The heat is distributed more evenly"],
    correct_answer: 1,
    explanation: "Pressure cooker: sealed vessel increases pressure → boiling point of water rises (120-135°C at 2 atm). Higher temperature cooks food 3-10× faster. Boiling point increases with pressure (and decreases at high altitudes).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Global Positioning System (GPS) works by measuring:",
    options: ["Magnetic field variations","Time for signals to travel from multiple satellites to the receiver (trilateration)","Distance to radio towers","Atmospheric pressure changes"],
    correct_answer: 1,
    explanation: "GPS: at least 4 satellites send radio signals. Receiver calculates time delay × speed of light = distance from each satellite. Trilateration (not triangulation — it uses distances, not angles) determines 3D position. 24+ satellites in orbit.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Which principle explains why aircraft wings generate lift?",
    options: ["Newton's Third Law (air pushed down, wing pushed up) and Bernoulli's Principle (faster air on top = lower pressure)","Archimedes' Principle","Bernoulli's Principle alone","Magnetic levitation"],
    correct_answer: 0,
    explanation: "Aircraft lift: two effects — (1) Bernoulli: aerofoil shape makes air travel faster over top surface → lower pressure on top → lift. (2) Newton's 3rd Law: wing pushes air downward → air pushes wing upward. Both contribute.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Nuclear power plants generate electricity using which process?",
    options: ["Nuclear fusion","Nuclear fission (U-235 or Pu-239) to heat water, drive steam turbines, generate electricity","Radioactive decay heat only","Plasma confinement"],
    correct_answer: 1,
    explanation: "Nuclear power plants: fission of U-235 heats water → steam → steam turbine → electricity generator. Moderator (heavy water/graphite) slows neutrons. Control rods (boron/cadmium) absorb neutrons. India has 22 reactors (6700 MW capacity). Tarapur: India's first (1969).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "MRI (Magnetic Resonance Imaging) uses which type of radiation?",
    options: ["X-rays","Gamma rays","Radio waves in a strong magnetic field (safe, non-ionizing)","Infrared radiation"],
    correct_answer: 2,
    explanation: "MRI: strong magnetic field (1.5–3 Tesla) aligns protons in body; radio waves pulse excites them; relaxation emits signals → computer creates image. No ionizing radiation (unlike CT/X-ray). Excellent soft tissue contrast. Cannot be used with metal implants.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Optical fibers transmit data using light. The critical technology enabling this is:",
    options: ["Refraction at the glass-air interface","Total Internal Reflection — light reflects completely inside the fiber without loss","Diffraction of laser light","Interference of multiple beams"],
    correct_answer: 1,
    explanation: "Optical fiber: glass/plastic core with higher refractive index than cladding. Light travels at angles above critical angle → Total Internal Reflection → light stays inside fiber with minimal loss. Used in: internet, telephone, medical endoscopes, sensing.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The phenomenon where certain crystals generate voltage when mechanically stressed is called:",
    options: ["Thermoelectric effect","Photoelectric effect","Piezoelectric effect","Magnetostrictive effect"],
    correct_answer: 2,
    explanation: "Piezoelectric effect: mechanical stress → electrical voltage (and vice versa). Discovered by Pierre and Jacques Curie (1880). Applications: quartz watches (oscillators), microphones, ultrasound transducers, gas lighters, SONAR, actuators.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The rotation of the Earth causes winds and ocean currents to deflect. This is called the:",
    options: ["Bernoulli Effect","Coriolis Effect","Doppler Effect","Hall Effect"],
    correct_answer: 1,
    explanation: "Coriolis Effect (Gustave-Gaspard Coriolis, 1835): Earth's rotation causes moving objects (air, water) to deflect right in Northern Hemisphere, left in Southern. Causes cyclones to rotate anticlockwise (NH) and clockwise (SH).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The Hall Effect is used to:",
    options: ["Measure temperature","Measure magnetic field strength and to identify the type of charge carrier in semiconductors","Generate electricity from heat","Measure fluid flow velocity"],
    correct_answer: 1,
    explanation: "Hall Effect (Edwin Hall, 1879): current in conductor + perpendicular magnetic field → voltage develops perpendicular to both (Hall voltage). Used in: magnetic field sensors, proximity sensors, current sensors, identifying n-type vs p-type semiconductors.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The Compton Effect demonstrated that:",
    options: ["Light travels as waves","X-rays (photons) behave as particles when they scatter off electrons (momentum transfer)","Electrons have wave nature","Gamma rays cannot be absorbed"],
    correct_answer: 1,
    explanation: "Compton scattering (Arthur Holly Compton, Nobel 1927): X-ray photons collide with electrons, transferring momentum → scattered X-ray has longer wavelength (lower energy). Proved photons have momentum p = h/λ. Confirmed particle nature of light.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The unit of radioactivity, Curie (Ci), was named after:",
    options: ["James Curie, discoverer of X-rays","Marie and Pierre Curie","Marie Curie alone","Irène Curie"],
    correct_answer: 1,
    explanation: "Curie (Ci): traditional unit of radioactivity. 1 Ci = 3.7 × 10¹⁰ disintegrations/second (radioactivity of 1 gram of Ra-226). Named after Marie and Pierre Curie. SI unit: Becquerel (Bq) = 1 disintegration/second. 1 Ci = 37 GBq.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The Hubble Space Telescope, launched in 1990, uses which type of telescope?",
    options: ["Refracting telescope (glass lenses)","Reflecting telescope (mirrors)","Radio telescope","X-ray telescope"],
    correct_answer: 1,
    explanation: "Hubble Space Telescope: 2.4m diameter reflecting telescope (primary + secondary mirrors). Above atmosphere → no atmospheric distortion. Key discoveries: age of universe (13.8 billion years), dark energy, black holes in galaxy centres.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Quantum tunneling is the phenomenon where particles:",
    options: ["Accelerate through potential energy barriers","Pass through energy barriers that classical physics says they cannot cross","Reflect off energy barriers perfectly","Lose all energy at barriers"],
    correct_answer: 1,
    explanation: "Quantum tunneling: quantum particles have wave functions that penetrate and pass through potential energy barriers, even without sufficient energy. Applications: tunnel diode, scanning tunneling microscope (STM), alpha decay, nuclear fusion in stars.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The SONAR (Sound Navigation And Ranging) system works on the principle of:",
    options: ["Electromagnetic wave reflection","Echo (reflection of sound/ultrasound waves)","Magnetic field variation","Light refraction in water"],
    correct_answer: 1,
    explanation: "SONAR: emits ultrasound pulses underwater; measures time for echo to return. Distance = (speed of sound in water × time) / 2. Used in: submarines (active sonar), fish finders, depth sounding, detecting underwater objects.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The gyroscope maintains its orientation due to the principle of:",
    options: ["Inertia and conservation of angular momentum","Magnetic alignment","Gravity compensation","Bernoulli's principle"],
    correct_answer: 0,
    explanation: "Gyroscope: spinning wheel whose axle resists changes in orientation due to conservation of angular momentum (L = Iω). Applications: navigation (ships, aircraft, spacecraft), stabilization (cameras, ships), bicycle/motorcycle stability.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Polarization of light proves that light is a:",
    options: ["Longitudinal wave","Transverse wave (vibrations perpendicular to propagation direction)","Sound-like mechanical wave","Static particle stream"],
    correct_answer: 1,
    explanation: "Polarization: restricting light vibrations to one plane. Only possible for TRANSVERSE waves. Polaroid sunglasses reduce glare (block horizontally polarized light reflected off surfaces). 3D cinema uses polarized light. LCD screens use polarizers.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "A black body in physics is defined as an object that:",
    options: ["Reflects all radiation","Appears black in visible light only","Absorbs all incident electromagnetic radiation (perfect absorber) and emits radiation at all wavelengths","Emits only infrared radiation"],
    correct_answer: 2,
    explanation: "Black body: theoretical perfect absorber and emitter of all EM radiation. Emits 'black body radiation' described by Planck's law (E = hf — foundation of quantum mechanics). The Sun, stars, and human body approximately behave as black bodies.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The mass of a proton is approximately how many times the mass of an electron?",
    options: ["100 times","837 times","1836 times","10,000 times"],
    correct_answer: 2,
    explanation: "Proton mass = 1.67 × 10⁻²⁷ kg. Electron mass = 9.11 × 10⁻³¹ kg. Ratio = 1836. Neutron mass ≈ proton mass (slightly heavier: 1839 × electron mass). Protons and neutrons are made of quarks (up and down quarks).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "The phenomenon of interference of light is observed when:",
    options: ["Light bends around corners","Two coherent light waves superpose to form alternating bright and dark fringes","Light changes speed in different media","Light is polarized"],
    correct_answer: 1,
    explanation: "Interference: two coherent waves superpose. Constructive (path difference = nλ) → bright fringe. Destructive (path difference = (n+½)λ) → dark fringe. Young's Double Slit Experiment (1801) proved light is a wave. Used in: anti-reflection coatings, holography.",
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
