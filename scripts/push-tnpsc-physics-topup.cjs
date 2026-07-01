require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const BASE  = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
const KEY   = 'quiz:subject:physics';
const HDR   = { Authorization:`Bearer ${TOKEN}`, 'Content-Type':'application/json' };

const questions = [
  {
    question_text: "When a stone is dropped from a height, just before hitting the ground its energy is mostly:",
    options: ["Potential energy","Kinetic energy","Heat energy","Chemical energy"],
    correct_answer: 1,
    explanation: "As the stone falls, PE converts to KE. Just before hitting ground: nearly all energy is KE (½mv²), and PE ≈ 0. Upon hitting, KE converts to heat, sound, and deformation. Energy conservation: mgh = ½mv² → v = √(2gh).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The image formed in a plane mirror is:",
    options: ["Real, inverted, same size","Virtual, erect, same size, laterally inverted, at same distance behind mirror","Real, erect, magnified","Virtual, inverted, diminished"],
    correct_answer: 1,
    explanation: "Plane mirror image: virtual (cannot be projected on screen), erect (upright), same size as object, laterally inverted (left-right swapped), and formed as far behind the mirror as the object is in front. Used in: dressing mirrors, periscopes, kaleidoscopes.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The angle of incidence equals the angle of reflection. This is the:",
    options: ["First law of refraction","Law of reflection","Snell's Law","Brewster's Law"],
    correct_answer: 1,
    explanation: "Law of Reflection: angle of incidence (i) = angle of reflection (r), both measured from the normal. Also: incident ray, reflected ray, and normal are coplanar. Applies to all surfaces: smooth (specular reflection) and rough (diffuse reflection). Foundation of mirror optics.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Gamma rays are emitted when:",
    options: ["An alpha particle is emitted","A beta particle is emitted","The nucleus transitions from an excited energy state to a lower energy state","An electron jumps between orbital levels"],
    correct_answer: 2,
    explanation: "Gamma rays: emitted when an excited nucleus relaxes to its ground state (nuclear energy level transitions). Often accompanies alpha or beta decay (daughter nucleus left in excited state → emits gamma). No change in Z or A. Electron orbital transitions produce X-rays or visible/UV light (much lower energy).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The principle of superposition of electric fields states that the total electric field at a point due to multiple charges is:",
    options: ["The product of individual fields","The maximum of individual fields","The vector sum of individual electric fields","Equal to the field of the largest charge only"],
    correct_answer: 2,
    explanation: "Principle of superposition: E_total = E₁ + E₂ + E₃ + ... (vector sum). Each charge creates its own field independently; they add vectorially. Also applies to gravitational fields, magnetic fields, and wave amplitudes. This linearity is fundamental to electromagnetism.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "A body of mass 2 kg moving at 3 m/s has kinetic energy:",
    options: ["3 J","6 J","9 J","12 J"],
    correct_answer: 2,
    explanation: "KE = ½mv² = ½ × 2 × 3² = ½ × 2 × 9 = 9 J. If speed doubles to 6 m/s: KE = ½ × 2 × 36 = 36 J (4× increase). KE is proportional to v². This is why car crashes at high speed are much more destructive — 4× speed → 16× kinetic energy.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The refractive index of diamond is about 2.42. This means light travels in diamond at approximately:",
    options: ["3 × 10⁸ m/s","1.24 × 10⁸ m/s","2.42 × 10⁸ m/s","6 × 10⁸ m/s"],
    correct_answer: 1,
    explanation: "n = c/v → v = c/n = 3×10⁸/2.42 ≈ 1.24 × 10⁸ m/s. Light is about 2.42× slower in diamond than vacuum. High refractive index gives diamond its small critical angle (~24.4°) → many facets cause total internal reflection → sparkling brilliance.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The process by which energy is transferred from a hot body to a cold body without any material medium is:",
    options: ["Conduction","Convection","Radiation","Sublimation"],
    correct_answer: 2,
    explanation: "Radiation: EM waves (mainly infrared) carry heat without needing a medium. The Sun heats Earth across 150 million km of vacuum purely by radiation. Rate: P = σεAT⁴ (Stefan-Boltzmann). Emissivity ε: black surface ε ≈ 1 (good radiator); polished metal ε ≈ 0.05 (poor radiator — good for thermos flask).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "An object is placed 30 cm in front of a concave mirror of focal length 10 cm. The image distance is:",
    options: ["15 cm in front","30 cm behind","15 cm behind","−15 cm"],
    correct_answer: 0,
    explanation: "Mirror formula: 1/v + 1/u = 1/f. Using sign convention: u = −30 cm, f = −10 cm (concave). 1/v = 1/f − 1/u = 1/(−10) − 1/(−30) = −1/10 + 1/30 = −3/30 + 1/30 = −2/30. v = −15 cm. Negative v means real image, 15 cm in front of mirror. Magnification = −v/u = −(−15)/(−30) = −0.5 (inverted, half size).",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "A satellite revolving in a circular orbit at height h above Earth's surface. If h is doubled, the orbital period:",
    options: ["Doubles","Increases by factor 2√2 (since T ∝ r^(3/2))","Stays the same","Halves"],
    correct_answer: 1,
    explanation: "T ∝ r^(3/2) (Kepler's 3rd Law). If orbital radius R+h becomes R+2h ≈ 2r (when h >> R or for simplification), T₂/T₁ = (r₂/r₁)^(3/2) = 2^(3/2) = 2√2 ≈ 2.83. For exact calculation: use T = 2π√(r³/GM) with actual r = R + h.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Nichrome is used for making heating elements in electric appliances because:",
    options: ["It has very low resistance","It is cheap","It has high resistivity, high melting point, and does not oxidise easily at high temperatures","It is a superconductor at room temperature"],
    correct_answer: 2,
    explanation: "Nichrome (Nickel-Chromium alloy): high resistivity (~1.10 × 10⁻⁶ Ω·m, vs copper 1.7 × 10⁻⁸ Ω·m), melting point ~1400°C, does not oxidise at high temperatures. Used in: toasters, room heaters, hair dryers, electric irons, kilns. P = I²R — high R → more heat.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The frequency of a wave does NOT change when it passes from one medium to another because:",
    options: ["Frequency depends on the medium density","Frequency is determined by the source and represents oscillations per second at the source — the medium cannot create or destroy oscillations","Speed always remains constant","Wavelength compensates for speed changes"],
    correct_answer: 1,
    explanation: "Frequency = number of cycles per second produced by source. When wave enters new medium: speed changes (v = fλ), wavelength changes (λ = v/f), but f remains fixed by source. This is true for both mechanical waves (sound) and EM waves (light). Energy per photon E = hf is also constant.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Which instrument is used to detect and measure infrared (heat) radiation?",
    options: ["Photometer","Bolometer (thermopile)","Spectrometer","Geiger counter"],
    correct_answer: 1,
    explanation: "Bolometer/thermopile: detects IR radiation by measuring temperature rise. Bolometer: electrical resistance changes with absorbed radiation. Thermopile: series of thermocouples. Used in: infrared cameras, non-contact thermometers (COVID ear/forehead thermometers), night vision, missile guidance, weather satellites.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The magnitude of charge on one electron is 1.6 × 10⁻¹⁹ C. How many electrons constitute a charge of 1 coulomb?",
    options: ["1.6 × 10¹⁹","6.25 × 10¹⁸","1.6 × 10⁻¹⁹","6.022 × 10²³"],
    correct_answer: 1,
    explanation: "Number of electrons = Q/e = 1/(1.6 × 10⁻¹⁹) = 6.25 × 10¹⁸ electrons. A typical current of 1 ampere = 1 C/s means 6.25 × 10¹⁸ electrons flow per second. In a small LED: ~10⁻³ A → ~6.25 × 10¹⁵ electrons/second.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The transformer equation V₁/V₂ = N₁/N₂ is only valid when:",
    options: ["Direct current is used","Alternating current is used (transformers work only with AC)","The transformer is in water","Both primary and secondary have same resistance"],
    correct_answer: 1,
    explanation: "Transformer works ONLY with AC. AC creates changing magnetic flux → induces EMF in secondary coil (Faraday's Law). DC creates constant flux → no induced EMF → transformer doesn't work with DC. This is why AC is used for mains power (can be transformed for efficient transmission).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The phenomenon of 'beats' is used practically to:",
    options: ["Generate ultrasound","Tune musical instruments — beats disappear when two strings are at exactly the same frequency","Amplify sound","Reduce noise pollution"],
    correct_answer: 1,
    explanation: "Beats for tuning: a reference tuning fork (440 Hz) is played with the string to be tuned. If out of tune, beats are heard (pulsating loudness). The musician adjusts tension until beats disappear completely → both at exactly 440 Hz. Beat frequency = |f₁ − f₂|; when f₁ = f₂, beats = 0.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The 'dead beat' galvanometer returns to zero position quickly without oscillating because it uses:",
    options: ["Very strong magnetic field","Heavy pivot friction","Eddy current damping (electromagnetic damping via induced currents in the coil frame)","Spring resistance"],
    correct_answer: 2,
    explanation: "Dead beat (critically damped) galvanometer: coil wound on aluminium frame. When coil moves → eddy currents induced in aluminium → opposing force → coil stops quickly without oscillating. Ballistic galvanometer (opposite): minimally damped, used to measure charge (coil oscillates to measure total charge).",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Photoluminescence refers to:",
    options: ["Light emitted by heated bodies","Emission of light when a substance absorbs photons and re-emits at lower energy (fluorescence and phosphorescence are types)","Light produced by chemical reactions","Light from electric discharge"],
    correct_answer: 1,
    explanation: "Photoluminescence: excitation by light → emission of light. Types: Fluorescence (immediate emission, <10⁻⁸ s, stops when excitation stops), Phosphorescence (delayed emission, can last seconds to hours — 'glow in dark'). Chemiluminescence: light from chemical reaction. Electroluminescence: light from electric current (LED).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "In physics, 'work' is done only when:",
    options: ["A force is applied","An object moves in any direction","A force causes displacement of the object in the direction of (or having component in the direction of) the force","Energy is generated"],
    correct_answer: 2,
    explanation: "W = F·d·cosθ. Work = 0 when: force perpendicular to motion (θ = 90°, e.g., centripetal force, normal force on horizontal surface), object doesn't move (d = 0, e.g., pushing a wall). Work is positive when force and displacement are in same direction (θ < 90°), negative when opposite (θ > 90°).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Friction between two surfaces can be reduced by:",
    options: ["Increasing the contact area","Increasing the weight of the object","Using lubricants (oil, grease), polishing surfaces, or introducing ball bearings (rolling friction << sliding friction)","Increasing the normal force"],
    correct_answer: 2,
    explanation: "Friction reduction methods: Lubrication (oil fills microscopic surface irregularities), Surface polishing (reduces roughness), Ball/roller bearings (rolling friction much less than sliding), Air cushion (hovercrafts), Streamlining (fluid friction). Engine oil in cars: reduces friction between moving metal parts, increasing efficiency.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The unit of angular velocity is:",
    options: ["m/s","rad/s","rpm only","degrees/s only"],
    correct_answer: 1,
    explanation: "Angular velocity (ω) = angle swept per unit time. SI unit: radian per second (rad/s). Also expressed as RPM (revolutions per minute) in engineering. ω = 2πf = 2π/T. Relationship to linear velocity: v = ωr. Earth rotates at ω = 7.27 × 10⁻⁵ rad/s = 1 revolution/24 hours.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Which of the following is an example of a scalar physical quantity?",
    options: ["Weight","Displacement","Momentum","Work"],
    correct_answer: 3,
    explanation: "Work (W = F·d·cosθ) is a scalar — it's the dot product of two vectors (F and d), giving a single number. Scalars: work, energy, power, speed, mass, temperature, time, distance. Vectors: weight (force, has direction), displacement (has direction), momentum (has direction), velocity, acceleration, force.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "A concave lens always produces which type of image for a real object?",
    options: ["Real, inverted, diminished","Virtual, erect, magnified","Virtual, erect, diminished (smaller than object)","Real, erect, same size"],
    correct_answer: 2,
    explanation: "Concave (diverging) lens: ALWAYS produces virtual, erect, and diminished image on the same side as the object (regardless of object position). Used to correct myopia (short-sightedness). The image formed is between the optical centre and the focus on the same side as the object.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The Venturi meter measures:",
    options: ["Atmospheric pressure","Wind speed","Flow rate of fluid in a pipe (using pressure difference between wide and narrow sections)","Temperature of flowing fluid"],
    correct_answer: 2,
    explanation: "Venturi meter: pipe with a narrow constriction (throat). Bernoulli: wider section (low v, high P) → narrow section (high v, low P). Pressure difference (P₁ − P₂) → flow rate calculated. Used in: water supply, aircraft speed (pitot tube variant), fuel injection, industrial flow measurement.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The phenomenon of 'magnetic hysteresis' is important in the context of:",
    options: ["Electromagnetic induction","Transformer core energy losses — energy is lost as heat each time the magnetic domain orientation reverses with alternating current","Electrostatic shielding","Superconductivity"],
    correct_answer: 1,
    explanation: "Magnetic hysteresis: ferromagnetic material retains some magnetism after field is removed (remanence). Reversing field requires coercive force. Energy loss per cycle = area of B-H hysteresis loop. Transformer cores: use 'soft' magnetic materials (narrow loop, low hysteresis loss). Permanent magnets: 'hard' materials (wide loop).",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "According to the second law of thermodynamics, heat flows spontaneously from:",
    options: ["Cold to hot","Hot to cold","Equal temperatures","Any direction depending on pressure"],
    correct_answer: 1,
    explanation: "Clausius statement of 2nd Law: heat flows spontaneously from hot body to cold body only. Reversing this requires work (refrigerator, heat pump). Kelvin-Planck statement: impossible to convert heat entirely to work without some heat rejection to cold reservoir. Both are equivalent statements of 2nd Law.",
    difficulty: "easy",
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
