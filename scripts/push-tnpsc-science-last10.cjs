require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const BASE  = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
const KEY   = 'quiz:subject:science';
const HDR   = { Authorization:`Bearer ${TOKEN}`, 'Content-Type':'application/json' };

async function rpush(items) {
  const values = items.map(q => JSON.stringify(q));
  const r = await fetch(`${BASE}/pipeline`, {
    method: 'POST', headers: HDR,
    body: JSON.stringify([['RPUSH', KEY, ...values]]),
  });
  return r.json();
}

const questions = [
  { question_text:"The instrument used to measure temperature is:", options:["Thermometer — clinical thermometer: 35°C–42°C range; laboratory: uses mercury or alcohol; digital: uses thermistors","Barometer","Manometer","Hygrometer"], correct_answer:0, explanation:"Thermometer measures temperature. Clinical (medical) thermometer: 35-42°C range, mercury-in-glass (being phased out) or digital. Laboratory: wider range. Galileo thermometer (1593) was the first. Fahrenheit scale (Gabriel Fahrenheit, 1724); Celsius (Anders Celsius, 1742); Kelvin (William Thomson, 1848).", difficulty:"easy", exam_types:["tnpsc","ssc"] },
  { question_text:"The chemical formula of glucose is:", options:["C₆H₁₂O₆ — a monosaccharide (simple sugar); main energy source for cells; produced in photosynthesis","C₁₂H₂₂O₁₁ (sucrose)","C₆H₁₂O₅","CH₂O"], correct_answer:0, explanation:"Glucose (C₆H₁₂O₆) is the primary cellular fuel. Produced in photosynthesis (6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂). Broken down in cellular respiration (glycolysis → Krebs cycle → ETC) to produce ATP. Blood glucose normally: 70-100 mg/dL fasting. Sucrose (table sugar): C₁₂H₂₂O₁₁ = glucose + fructose.", difficulty:"easy", exam_types:["tnpsc","ssc","upsc"] },
  { question_text:"Which planet is known as the 'Red Planet'?", options:["Mars — reddish color due to iron oxide (rust) on its surface; has the largest volcano (Olympus Mons) and deepest canyon (Valles Marineris) in the solar system","Venus (hottest planet)","Jupiter","Saturn"], correct_answer:0, explanation:"Mars: 4th planet from Sun, reddish appearance from iron oxide (Fe₂O₃) on surface. Features: Olympus Mons (21 km high, largest volcano in solar system), Valles Marineris (4,000 km long canyon). 2 tiny moons: Phobos and Deimos. India's Mangalyaan (MOM) reached Mars in 2014 — India's first interplanetary mission, at a record low cost.", difficulty:"easy", exam_types:["tnpsc","ssc","upsc"] },
  { question_text:"The SI unit of electric resistance is:", options:["Ohm (Ω) — defined as 1 Volt per Ampere; named after Georg Simon Ohm who formulated Ohm's Law (V=IR)","Ampere","Watt","Farad"], correct_answer:0, explanation:"Ohm (Ω): SI unit of electrical resistance, named after Georg Simon Ohm (Ohm's Law, 1827: V = IR). 1 Ω = 1 V/A. Resistors oppose current flow. In series: R_total = R₁+R₂+... In parallel: 1/R_total = 1/R₁+1/R₂+... Conductance (1/R) measured in Siemens (S).", difficulty:"easy", exam_types:["tnpsc","ssc"] },
  { question_text:"The largest organ of the human body is:", options:["Skin — surface area ~1.5-2 m², weighs ~3-5 kg; functions: protection, temperature regulation, sensation, Vitamin D synthesis","Liver (largest internal organ)","Lungs","Brain"], correct_answer:0, explanation:"Skin is the largest organ: 1.5-2 m² surface area, ~3-5 kg. Three layers: epidermis (outer, waterproof), dermis (collagen, blood vessels, hair follicles), hypodermis (fat, insulation). Functions: barrier against pathogens/UV, temperature regulation (sweat, vasodilation/constriction), sensory (touch, pain, temperature), Vitamin D synthesis. Liver is the largest internal organ.", difficulty:"easy", exam_types:["tnpsc","ssc","upsc"] },
  { question_text:"The Chandrayaan-1 mission's major discovery was:", options:["Confirmed presence of water molecules on the Moon's surface (2008) — using Moon Impact Probe and M³ spectrometer from NASA","First Moon landing by India","Discovered lunar helium-3","Found oxygen in lunar soil"], correct_answer:0, explanation:"Chandrayaan-1 (October 2008): India's first lunar mission. Key discovery: NASA's Moon Mineralogy Mapper (M³) instrument on board confirmed the presence of water/hydroxyl (OH) molecules on the lunar surface (announced 2009). Also discovered magnesium, aluminum, silicon in lunar soil. Moon Impact Probe (MIP) crash-landed on Moon.", difficulty:"medium", exam_types:["tnpsc","ssc","upsc"] },
  { question_text:"Which branch of biology deals with the study of heredity and variation?", options:["Genetics — founded by Gregor Mendel's pea plant experiments (1856-1863); Watson & Crick discovered DNA structure in 1953","Ecology","Taxonomy","Physiology"], correct_answer:0, explanation:"Genetics studies how traits are inherited (heredity) and how variations arise in populations. Mendel discovered laws of inheritance using pea plants. Modern genetics: DNA structure (Watson, Crick, Franklin, 1953), Human Genome Project (2003), CRISPR gene editing (2012). 'Gene' coined by Wilhelm Johannsen (1909).", difficulty:"easy", exam_types:["tnpsc","ssc"] },
  { question_text:"Laughing gas (used as anesthetic) is:", options:["Nitrous oxide (N₂O) — mild anesthetic and analgesic; causes euphoria and mild hallucinations at lower doses; used in dentistry and minor surgeries","Nitrogen dioxide (NO₂, toxic)","Nitrogen (N₂, inert)","Ammonia (NH₃, irritating"], correct_answer:0, explanation:"Nitrous oxide (N₂O, laughing gas): colorless, sweet-smelling gas. First used as anesthetic by Humphry Davy (1799) and Horace Wells (dentistry, 1844). Produces mild euphoria and analgesia. Also used as oxidizer in rocket engines and as propellant in whipped cream canisters. Also a greenhouse gas and ozone-depleting substance.", difficulty:"easy", exam_types:["tnpsc","ssc"] },
  { question_text:"The nervous system of humans is divided into:", options:["Central Nervous System (brain + spinal cord) and Peripheral Nervous System (all nerves outside CNS — somatic + autonomic)","Brain and heart","Only brain","Voluntary and involuntary only"], correct_answer:0, explanation:"Nervous system divisions: (1) Central Nervous System (CNS): brain (cerebrum, cerebellum, brainstem) + spinal cord — processes and integrates information. (2) Peripheral Nervous System (PNS): all nerves outside CNS. PNS subdivides into: Somatic NS (voluntary movement, sensory input) and Autonomic NS (involuntary: sympathetic + parasympathetic).", difficulty:"easy", exam_types:["tnpsc","ssc","upsc"] },
  { question_text:"The primary function of white blood cells (leukocytes) is:", options:["Immune defense — fighting infections and foreign substances; includes neutrophils (bacterial infections), lymphocytes (viral infections, antibody production), monocytes, eosinophils, basophils","Carrying oxygen (RBCs do that)","Blood clotting (platelets do that)","Transporting nutrients"], correct_answer:0, explanation:"WBCs (leukocytes): 5,000-10,000 per microliter of blood. Types: neutrophils (most common, ~60%, phagocytose bacteria), lymphocytes (~30%, T-cells coordinate immunity, B-cells make antibodies), monocytes (phagocytes), eosinophils (parasites, allergies), basophils (inflammation, allergies). WBC count increases during infection (leukocytosis).", difficulty:"easy", exam_types:["tnpsc","ssc","upsc"] },
];

async function main() {
  console.log(`Adding ${questions.length} science questions to ${KEY}...`);
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
