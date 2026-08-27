require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const BASE  = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
const KEY   = 'quiz:subject:chemistry';
const HDR   = { Authorization:`Bearer ${TOKEN}`, 'Content-Type':'application/json' };

const questions = [
  // --- Atomic Structure ---
  {
    question_text: "The number of protons in the nucleus of an atom determines its:",
    options: ["Mass number","Atomic number (and thus what element it is)","Neutron count","Isotope type"],
    correct_answer: 1,
    explanation: "Atomic number (Z) = number of protons. It uniquely identifies an element. Carbon always has 6 protons; oxygen always has 8. Mass number (A) = protons + neutrons. Isotopes have the same Z but different A (different neutron counts). Electrons = protons in a neutral atom.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Isotopes of an element have the same number of protons but different numbers of:",
    options: ["Electrons","Protons","Neutrons","Energy levels"],
    correct_answer: 2,
    explanation: "Isotopes: same element (same Z), different mass number (different neutron count). Carbon-12 (6p, 6n), Carbon-13 (6p, 7n), Carbon-14 (6p, 8n). Same chemical properties (same electrons), different physical properties (mass, radioactivity). C-14 is radioactive and used in radiocarbon dating.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The maximum number of electrons that can occupy the second shell (n=2) of an atom is:",
    options: ["2","8","18","32"],
    correct_answer: 1,
    explanation: "Maximum electrons per shell = 2n². Shell 1 (n=1): 2 electrons. Shell 2 (n=2): 8 electrons. Shell 3 (n=3): 18 electrons. Shell 4 (n=4): 32 electrons. Electron configuration: first fill inner shells. Valence electrons (outermost shell) determine chemical behaviour.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Valence electrons are the electrons present in the:",
    options: ["First shell only","Nucleus","Outermost (valence) shell of an atom","Second shell always"],
    correct_answer: 2,
    explanation: "Valence electrons: electrons in the outermost shell. They determine chemical bonding and reactivity. Na (2,8,1): 1 valence electron (forms Na⁺). Cl (2,8,7): 7 valence electrons (gains 1 to form Cl⁻). Noble gases: 8 valence electrons → stable, unreactive (octet rule).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Periodic Table ---
  {
    question_text: "The modern periodic table is based on:",
    options: ["Atomic mass (Mendeleev's original)","Atomic number (Moseley's periodic law — properties repeat with atomic number)","Valency","Electronegativity"],
    correct_answer: 1,
    explanation: "Moseley's periodic law (1913): properties of elements are a periodic function of their atomic numbers. Modern periodic table: 118 elements in 7 periods and 18 groups. Mendeleev (1869) used atomic mass but left gaps for undiscovered elements. Moseley corrected anomalies in Mendeleev's table.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The number of periods in the modern periodic table is:",
    options: ["5","7","9","18"],
    correct_answer: 1,
    explanation: "Modern periodic table: 7 periods (rows) and 18 groups (columns). Period 1: 2 elements (H, He). Period 2: 8 elements. Period 3: 8 elements. Periods 4 and 5: 18 elements each. Periods 6 and 7: 32 elements each (include lanthanides and actinides). Total: 118 elements currently known.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Alkali metals are found in Group 1 of the periodic table. They react vigorously with water to produce:",
    options: ["Acids","Metal hydroxides and hydrogen gas","Metal oxides and oxygen","Salts only"],
    correct_answer: 1,
    explanation: "Alkali metals + water → metal hydroxide + H₂. 2Na + 2H₂O → 2NaOH + H₂↑. Reactivity increases down Group 1 (Li < Na < K < Rb < Cs < Fr). Stored in kerosene/oil (to prevent contact with air/water). Solutions are strongly alkaline.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Halogens are found in Group 17. They are highly reactive because they:",
    options: ["Have a full outer shell","Have 7 valence electrons and need just one more to complete octet","Have the lowest atomic mass","Are all gases at room temperature"],
    correct_answer: 1,
    explanation: "Halogens (F, Cl, Br, I, At): 7 valence electrons → need 1 more for stable octet → very reactive, strong oxidizers. Fluorine is most reactive (strongest oxidizer). Reactivity decreases down: F > Cl > Br > I. At room temperature: F₂ (gas), Cl₂ (gas), Br₂ (liquid), I₂ (solid).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Noble gases (Group 18) are inert because they have:",
    options: ["High atomic mass","Complete outermost shell (8 electrons, except He with 2) — very stable configuration","High density","No protons"],
    correct_answer: 1,
    explanation: "Noble gases: He (2e), Ne (2,8), Ar (2,8,8), Kr, Xe, Rn. Complete valence shells → no tendency to gain/lose/share electrons → chemically inert. Used in: lighting (neon signs, argon in bulbs), inert atmosphere welding, balloons (helium), medical imaging (xenon anaesthesia). Rn is radioactive.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Electronegativity generally increases across a period (left to right) because:",
    options: ["Atomic mass increases","Nuclear charge increases while atomic radius decreases — stronger pull on bonding electrons","Number of electron shells increases","Atomic radius increases"],
    correct_answer: 1,
    explanation: "Electronegativity: ability to attract bonding electrons. Increases across period (more protons, smaller radius → stronger pull) and decreases down a group (more shielding, larger radius). Fluorine (F) is the most electronegative element (EN = 4.0 on Pauling scale). Caesium is least electronegative metal.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Atomic radius generally decreases across a period (left to right) because:",
    options: ["Electrons are removed","Nuclear charge increases while electrons are added to the same shell — stronger pull contracts the atom","Number of shells decreases","Mass decreases"],
    correct_answer: 1,
    explanation: "Across a period: nuclear charge (protons) increases, but electrons are added to the same shell (no new shielding layer) → effective nuclear charge on outer electrons increases → atomic radius decreases. Down a group: radius increases (new shells added). Cs has the largest atomic radius among stable elements.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Chemical Bonding ---
  {
    question_text: "An ionic bond is formed by:",
    options: ["Sharing of electrons between two atoms","Complete transfer of one or more electrons from a metal to a non-metal — electrostatic attraction between ions","Overlap of atomic orbitals","Sharing of electrons between two non-metals"],
    correct_answer: 1,
    explanation: "Ionic bond: metal loses electrons → cation (positive). Non-metal gains electrons → anion (negative). Electrostatic attraction between oppositely charged ions. Example: Na → Na⁺ + e⁻; Cl + e⁻ → Cl⁻; Na⁺ + Cl⁻ → NaCl. High melting/boiling points, conduct electricity when dissolved/melted.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "A covalent bond is formed by:",
    options: ["Transfer of electrons","Electrostatic attraction between ions","Sharing of electron pairs between two atoms (usually non-metals)","Metallic bonding"],
    correct_answer: 2,
    explanation: "Covalent bond: atoms share one or more electron pairs. Single bond (H-H), double bond (O=O), triple bond (N≡N). Generally between non-metals. Molecules: H₂O, CO₂, CH₄. Directional, lower melting points than ionic compounds. Covalent network solids (diamond, SiO₂) have very high melting points.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Hydrogen bonding occurs between molecules that contain a hydrogen atom bonded to:",
    options: ["Carbon","A highly electronegative atom with a lone pair (F, O, or N)","Another hydrogen","Any metal"],
    correct_answer: 1,
    explanation: "Hydrogen bond: H bonded to F, O, or N (highly electronegative, small size) → H acquires partial positive charge (δ+) → attracted to lone pair on F/O/N of adjacent molecule. Examples: water (H₂O), DNA base pairs, proteins (α-helix, β-sheet). Explains water's unusually high boiling point (100°C vs expected −80°C).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Metallic bonding is described as:",
    options: ["Electron pairs shared between specific atoms","A lattice of positive metal ions surrounded by a 'sea' of delocalized electrons","Transfer of electrons between metals","Hydrogen bonding in metals"],
    correct_answer: 1,
    explanation: "Metallic bond: metal cations fixed in lattice, surrounded by mobile delocalized electrons (electron sea). Explains: electrical conductivity (mobile electrons carry charge), thermal conductivity (electrons transfer energy), malleability/ductility (layers can slide — electron sea maintains cohesion), metallic lustre (electrons reflect light).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The VSEPR theory (Valence Shell Electron Pair Repulsion) predicts that electron pairs around a central atom arrange themselves to:",
    options: ["Maximize overlap","Minimize repulsion between electron pairs → specific molecular geometry","Be as close as possible","Point toward electronegative atoms"],
    correct_answer: 1,
    explanation: "VSEPR: electron pairs (bonding and lone pairs) repel each other and arrange to minimize repulsion. Lone pairs have greater repulsion. Examples: BeCl₂ (linear, 180°), BF₃ (trigonal planar, 120°), CH₄ (tetrahedral, 109.5°), NH₃ (pyramidal, 107°), H₂O (bent, 104.5°).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // --- Acids, Bases, Salts ---
  {
    question_text: "According to the Arrhenius theory, an acid is a substance that:",
    options: ["Donates a proton to water","Accepts a proton","Produces H⁺ ions in aqueous solution","Produces OH⁻ ions in aqueous solution"],
    correct_answer: 0,
    explanation: "Arrhenius acid: produces H⁺ (or H₃O⁺) in water. HCl → H⁺ + Cl⁻. Arrhenius base: produces OH⁻ in water. NaOH → Na⁺ + OH⁻. Brønsted-Lowry (broader): acid = H⁺ donor, base = H⁺ acceptor. Lewis (broadest): acid = electron pair acceptor, base = electron pair donor.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The pH scale measures the acidity or basicity of a solution. A solution with pH 7 is:",
    options: ["Acidic","Basic (alkaline)","Neutral (pure water at 25°C)","Strongly acidic"],
    correct_answer: 2,
    explanation: "pH = −log[H⁺]. pH 7 = neutral (pure water: [H⁺] = [OH⁻] = 10⁻⁷ M). pH < 7 = acidic. pH > 7 = basic. Each unit change = 10× change in H⁺ concentration. pH 1 (battery acid) → pH 14 (NaOH). Blood: pH 7.35–7.45. Stomach acid: pH 1.5–3.5. Baking soda: pH ~8.3.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Litmus is a common acid-base indicator. In acidic solutions it turns:",
    options: ["Blue","Yellow","Red","Green"],
    correct_answer: 2,
    explanation: "Litmus: natural dye from lichens (Roccella tinctoria). Red in acid (pH < 7), blue in base (pH > 7), purple in neutral. Other indicators: Phenolphthalein (colourless in acid, pink in base), Methyl orange (red in acid, yellow in base), Universal indicator (range of colours across pH scale).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "When an acid reacts with a metal carbonate, the products are:",
    options: ["Salt and water","Salt, water, and hydrogen gas","Salt, water, and carbon dioxide gas","Metal oxide and water"],
    correct_answer: 2,
    explanation: "Acid + Metal Carbonate → Salt + Water + CO₂. Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑. The CO₂ gas turns lime water milky (Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O). Used to test for carbonates in qualitative analysis. Baking soda (NaHCO₃) reacts with vinegar (acetic acid) this way — fizzing.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Neutralization is a reaction between an acid and a base to form:",
    options: ["Two acids","Two bases","Salt and water (H⁺ + OH⁻ → H₂O)","Only gases"],
    correct_answer: 2,
    explanation: "Neutralization: HCl + NaOH → NaCl + H₂O. Net ionic: H⁺ + OH⁻ → H₂O. The salt formed depends on the acid and base (NaCl, CaSO₄, etc.). Heat is released (exothermic). The resulting solution may be neutral, acidic, or basic depending on whether it's strong-strong, strong-weak, or weak-strong combination.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Common salt (table salt) is chemically:",
    options: ["CaCO₃","NaOH","NaCl (Sodium chloride)","Na₂CO₃"],
    correct_answer: 2,
    explanation: "NaCl (Sodium chloride): common salt. Ionic compound, white crystalline solid. Sources: seawater (evaporation), rock salt mines. Uses: food seasoning, food preservation, making chlorine (electrolysis), caustic soda (Cl-alkali process), glass, soap, de-icing roads. India's major salt producers: Gujarat, Rajasthan, Tamil Nadu (Tuticorin).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Baking soda (used in cooking) is chemically:",
    options: ["Na₂CO₃","NaHCO₃ (Sodium bicarbonate/Sodium hydrogen carbonate)","NaCl","NaOH"],
    correct_answer: 1,
    explanation: "Baking soda = NaHCO₃. Releases CO₂ when heated or mixed with acid → leavening agent in baking. NaHCO₃ + H⁺ → Na⁺ + H₂O + CO₂↑ (with buttermilk/vinegar). Also used as antacid (neutralizes stomach acid), fire extinguisher, cleaning agent. Washing soda = Na₂CO₃·10H₂O (decahydrate).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Plaster of Paris is obtained by heating gypsum (CaSO₄·2H₂O) to about 150°C. Its chemical formula is:",
    options: ["CaSO₄","CaSO₄·½H₂O (hemihydrate)","CaSO₄·2H₂O","Ca(OH)₂"],
    correct_answer: 1,
    explanation: "Plaster of Paris (POP) = CaSO₄·½H₂O. Made by heating gypsum: CaSO₄·2H₂O → CaSO₄·½H₂O + 1.5H₂O. Mixed with water → hardens back to gypsum (CaSO₄·2H₂O), expanding slightly (ideal for moulds, casts). Used in: medical casts (bone fractures), building, dentistry, statues, chalk.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Chemical Reactions ---
  {
    question_text: "In a chemical reaction, the law of conservation of mass means:",
    options: ["Mass can be created","Mass can be destroyed in reactions","Total mass of reactants = total mass of products (Lavoisier's Law)","Energy is conserved, not mass"],
    correct_answer: 2,
    explanation: "Lavoisier's Law of Conservation of Mass (1789): mass is neither created nor destroyed in a chemical reaction. Total mass of reactants = total mass of products. This led to quantitative chemistry and balancing chemical equations. Only in nuclear reactions is mass 'converted' to energy (E=mc²).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "A combination (synthesis) reaction involves:",
    options: ["Breaking down one compound into simpler substances","Two or more reactants combining to form a single product (A + B → AB)","Exchange of ions between two compounds","Oxidation-reduction"],
    correct_answer: 1,
    explanation: "Combination (synthesis): A + B → AB. Examples: H₂ + Cl₂ → 2HCl; 2Mg + O₂ → 2MgO; CaO + CO₂ → CaCO₃; S + O₂ → SO₂. Decomposition (opposite): AB → A + B. Displacement: A + BC → AC + B. Double displacement: AB + CD → AD + CB.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "In a decomposition reaction, a compound breaks down into simpler substances. An example is:",
    options: ["H₂ + Cl₂ → 2HCl","2H₂O → 2H₂ + O₂ (electrolysis of water)","2Na + Cl₂ → 2NaCl","Fe + S → FeS"],
    correct_answer: 1,
    explanation: "Decomposition: single reactant → two or more products. Types: thermal (CaCO₃ → CaO + CO₂), electrolytic (2H₂O → 2H₂ + O₂), photolytic (2AgCl → 2Ag + Cl₂, used in photography). The reverse of combination reactions.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Combustion is an example of which type of chemical reaction?",
    options: ["Endothermic","Decomposition","Exothermic oxidation reaction (releases heat and light)","Displacement"],
    correct_answer: 2,
    explanation: "Combustion: fuel + O₂ → CO₂ + H₂O + heat + light. Example: CH₄ + 2O₂ → CO₂ + 2H₂O. Exothermic (releases energy). Complete combustion: CO₂ + H₂O (clean). Incomplete combustion: CO (poisonous) + soot (when insufficient O₂). Spontaneous combustion: happens on its own (white phosphorus, haystacks).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Rusting of iron is an example of:",
    options: ["Combination reaction","Oxidation reaction — iron reacts with O₂ and water to form hydrated iron oxide (Fe₂O₃·xH₂O)","Reduction reaction","Decomposition reaction"],
    correct_answer: 1,
    explanation: "Rusting: 4Fe + 3O₂ + 6H₂O → 4Fe(OH)₃ → Fe₂O₃·xH₂O (rust). Requires both O₂ and water — dry air or water alone doesn't rust iron. Prevented by: painting, galvanizing (zinc coating), electroplating, alloying (stainless steel), oiling. Costs ~3-4% of GDP globally in industrial nations.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Redox Reactions ---
  {
    question_text: "Oxidation is defined as:",
    options: ["Gain of hydrogen","Gain of electrons","Loss of electrons (or gain of oxygen, or increase in oxidation number)","Loss of oxygen"],
    correct_answer: 2,
    explanation: "Oxidation: OIL (Oxidation Is Loss of electrons). Reduction: RIG (Reduction Is Gain of electrons). OILRIG mnemonic. Example: Zn → Zn²⁺ + 2e⁻ (Zn is oxidized, loses 2e). Cu²⁺ + 2e⁻ → Cu (Cu²⁺ is reduced, gains 2e). In a redox reaction, both oxidation and reduction occur simultaneously.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "A reducing agent is a substance that:",
    options: ["Gets oxidized while reducing another substance (donates electrons)","Gets reduced while oxidizing another substance","Prevents oxidation by forming a barrier","Lowers pH"],
    correct_answer: 0,
    explanation: "Reducing agent: donates electrons (gets oxidized itself). Oxidizing agent: accepts electrons (gets reduced itself). Example: H₂ + Cl₂ → 2HCl. H₂ is reducing agent (H: 0 → +1, oxidized), Cl₂ is oxidizing agent (Cl: 0 → -1, reduced). Strong reducing agents: H₂, CO, Al, Mg, Fe.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The oxidation state of oxygen in most compounds is:",
    options: ["+2","−1","−2","0"],
    correct_answer: 2,
    explanation: "Oxygen oxidation state: usually −2 (in most compounds: H₂O, CO₂, SO₄²⁻). Exceptions: O₂ (0), OF₂ (+2, fluorine more electronegative), H₂O₂ (−1, peroxide). Rules: free element = 0, monoatomic ion = charge, sum of oxidation states in neutral molecule = 0.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Electrochemistry ---
  {
    question_text: "Electrolysis is a process in which electrical energy is used to:",
    options: ["Generate electricity from chemical reactions","Drive a non-spontaneous chemical reaction using electricity (decompose compounds)","Produce heat from chemical reactions","Convert AC to DC"],
    correct_answer: 1,
    explanation: "Electrolysis: non-spontaneous redox reaction driven by external electrical energy. Cathode (−): reduction occurs (cations gain electrons). Anode (+): oxidation occurs (anions lose electrons). Applications: electroplating, extraction of aluminium (Hall-Héroult process), chloralkali process (NaCl → Cl₂ + NaOH + H₂).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "In electroplating, the object to be plated is connected to the:",
    options: ["Anode (positive terminal)","Cathode (negative terminal) — metal ions are reduced and deposited on it","Both anode and cathode alternately","Neither — it floats in solution"],
    correct_answer: 1,
    explanation: "Electroplating: object = cathode (metal ions from solution deposit on it). Plating metal (e.g., copper) = anode (dissolves to replenish metal ions). Electrolyte = solution of plating metal salt. Applications: gold/silver plating jewellery, chrome plating car parts, zinc plating (galvanizing), tin plating food cans.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Faraday's first law of electrolysis states that the mass of substance deposited at an electrode is:",
    options: ["Inversely proportional to charge passed","Directly proportional to the quantity of electricity (charge) passed through the electrolyte","Proportional to the temperature","Independent of current"],
    correct_answer: 1,
    explanation: "Faraday's 1st Law: m = ZIt (Z = electrochemical equivalent, I = current, t = time). Mass deposited ∝ charge (Q = It). Faraday's 2nd Law: masses of different substances deposited by same charge are proportional to their equivalent weights. 1 Faraday = 96,485 C/mol of electrons.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Aluminium is extracted from its ore bauxite (Al₂O₃) by:",
    options: ["Carbon reduction (like iron)","Electrolysis of molten aluminium oxide (Hall-Héroult process) — carbon reduction fails because Al₂O₃ melting point is too high","Acid dissolution","Displacement by more reactive metal"],
    correct_answer: 1,
    explanation: "Hall-Héroult process (1886): Al₂O₃ dissolved in molten cryolite (Na₃AlF₆, lowers melting point from 2072°C to ~960°C) → electrolysis. Cathode: Al³⁺ + 3e⁻ → Al(l). Anode: carbon burns off (C + O₂ → CO₂). Very energy-intensive (~15 kWh/kg Al). This is why recycling aluminium saves 95% energy.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Chemical Equilibrium ---
  {
    question_text: "Le Chatelier's Principle states that when a system at equilibrium is disturbed, the equilibrium shifts to:",
    options: ["Increase the concentration of reactants","Oppose the disturbance and re-establish equilibrium","Increase temperature","Increase pressure always"],
    correct_answer: 1,
    explanation: "Le Chatelier's Principle: if equilibrium is disturbed (concentration, temperature, pressure change), the system shifts to counteract the disturbance. Examples: Add more reactant → shifts right (more product). Increase temperature for endothermic reaction → shifts right. Increase pressure on gas reaction → shifts toward fewer moles of gas.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The Haber process for industrial synthesis of ammonia uses:",
    options: ["N₂ + 3H₂ → 2NH₃, high pressure (150-300 atm), moderate temperature (400-500°C), iron catalyst","N₂ + H₂ at low temperature and pressure","Decomposition of ammonium salts","Electrolysis of nitrogen compounds"],
    correct_answer: 0,
    explanation: "Haber process: N₂ + 3H₂ ⇌ 2NH₃ (exothermic). Conditions: 150-300 atm, 400-500°C, Fe catalyst (with K₂O and Al₂O₃ promoters). High pressure favours NH₃ (4 → 2 moles of gas). Lower temperature favours yield but is too slow → compromise at 400-500°C. NH₃ is basis of all fertilizers.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "A catalyst in a chemical reaction:",
    options: ["Increases the yield of products","Is consumed in the reaction","Increases the rate of reaction by providing an alternative pathway with lower activation energy — not consumed","Changes the equilibrium position"],
    correct_answer: 2,
    explanation: "Catalyst: increases reaction rate, not consumed, doesn't change equilibrium position (speeds up both forward and reverse equally). Lowers activation energy (E_a). Types: homogeneous (same phase as reactants), heterogeneous (different phase, e.g., Pt in catalytic converters), biological (enzymes). Inhibitor: slows down reactions.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Organic Chemistry ---
  {
    question_text: "Organic chemistry is the branch of chemistry dealing with compounds of:",
    options: ["Oxygen","Metals","Carbon (especially carbon-hydrogen compounds and their derivatives)","Silicon"],
    correct_answer: 2,
    explanation: "Organic chemistry: study of carbon compounds (except CO, CO₂, carbonates, carbides — these are inorganic). ~10 million known organic compounds vs ~500,000 inorganic. Carbon's tetravalency and ability to form C-C chains (catenation) allows vast molecular diversity. Wöhler (1828): first synthesised organic compound (urea) from inorganic substances.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Hydrocarbons contain only carbon and hydrogen atoms. Alkanes have the general formula:",
    options: ["CₙH₂ₙ","CₙH₂ₙ₊₂ (saturated, single C-C bonds only)","CₙH₂ₙ₋₂","CₙHₙ"],
    correct_answer: 1,
    explanation: "Hydrocarbons: Alkanes (CₙH₂ₙ₊₂): methane (CH₄), ethane (C₂H₆), propane (C₃H₈), butane (C₄H₁₀) — saturated (all single bonds), least reactive. Alkenes (CₙH₂ₙ): ethene (C₂H₄) — double bond. Alkynes (CₙH₂ₙ₋₂): ethyne/acetylene (C₂H₂) — triple bond. Alkenes and alkynes are unsaturated.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Methane (CH₄) is the main component of:",
    options: ["LPG","CNG and natural gas","Biogas only","Coal gas"],
    correct_answer: 1,
    explanation: "Natural gas: ~85-95% methane (CH₄). CNG (Compressed Natural Gas) used in vehicles. Biogas: 55-65% CH₄ (from decomposition of organic matter). LPG (Liquefied Petroleum Gas): mainly propane (C₃H₈) and butane (C₄H₁₀). Methane: colourless, odourless, least reactive alkane, greenhouse gas (GWP = 25× CO₂ over 100 years).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Ethanol (C₂H₅OH) is produced by fermentation of sugars using yeast. The reaction is:",
    options: ["C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂ (anaerobic fermentation)","C₂H₄ + H₂O → C₂H₅OH","C₂H₅OH → C₂H₄ + H₂O","6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂"],
    correct_answer: 0,
    explanation: "Fermentation: glucose (C₆H₁₂O₆) → 2 ethanol + 2CO₂ (by yeast enzymes, anaerobic, 20-30°C). Ethanol: alcohol in beverages, biofuel (E10 fuel = 10% ethanol + 90% petrol), solvent, antiseptic (70% solution kills bacteria), raw material for acetic acid. Dehydration of ethanol → ethylene (industrial).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Acetic acid (vinegar) has the chemical formula:",
    options: ["HCOOH","CH₃COOH (ethanoic acid)","C₆H₅COOH","H₂CO₃"],
    correct_answer: 1,
    explanation: "Acetic acid (ethanoic acid) = CH₃COOH. Vinegar is 4-8% acetic acid in water. Weak acid (pKa = 4.76). Made by fermentation of ethanol (by Acetobacter bacteria) or Wacker oxidation of ethylene (industrial). Used in: food preservation, descaling, chemical synthesis, dyes, synthetic fibres (cellulose acetate).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Benzene (C₆H₆) is the simplest aromatic compound. Its special stability comes from:",
    options: ["Six single bonds","Six double bonds","Resonance — delocalized π electrons over all six carbon atoms in the ring","Three alternating single and double bonds that are fixed"],
    correct_answer: 2,
    explanation: "Benzene: Kekulé's ring structure (1865). Special stability due to resonance (delocalized π electrons). Bond length between single and double bond. Aromatic compounds follow Hückel's rule (4n+2 π electrons). Used in: dyes, drugs, pesticides, plastics. Carcinogenic — exposure regulated strictly.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Polymers are large molecules formed by the joining of many small repeating units called:",
    options: ["Isomers","Monomers","Dimers","Oligomers"],
    correct_answer: 1,
    explanation: "Polymer (Greek: poly = many, meros = parts): large macromolecule from many monomer units. Addition polymerization: monomers join without losing atoms (polyethylene from ethylene). Condensation polymerization: monomers join losing small molecules like H₂O (nylon from diamine + dicarboxylic acid, PET).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Bakelite (a thermosetting plastic) is made from:",
    options: ["Polyethylene monomer","Phenol and formaldehyde (condensation polymerization)","Natural rubber vulcanization","PVC chlorination"],
    correct_answer: 1,
    explanation: "Bakelite (Leo Baekeland, 1907): world's first synthetic plastic. Phenol + formaldehyde → phenol-formaldehyde resin. Thermosetting (cannot be resoftened once set). Uses: electrical fittings, handles, billiard balls (historically), circuit boards. Hard, heat-resistant, electrical insulator.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Natural rubber is a polymer of:",
    options: ["Styrene","Isoprene (2-methylbuta-1,3-diene) — cis-polyisoprene","Ethylene","Chloroprene"],
    correct_answer: 1,
    explanation: "Natural rubber: polymer of isoprene (cis-1,4-polyisoprene). Latex from Hevea brasiliensis (rubber tree). Vulcanization (Charles Goodyear, 1839): heating rubber with sulphur creates cross-links → less sticky, more elastic, temperature-stable. Used in tyres, gloves, seals. Synthetic rubbers: neoprene, SBR, nitrile rubber.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "PVC (Polyvinyl Chloride) is made from the monomer:",
    options: ["Ethylene (CH₂=CH₂)","Vinyl chloride (CH₂=CHCl)","Propylene","Styrene"],
    correct_answer: 1,
    explanation: "PVC: addition polymer of vinyl chloride (chloroethylene, CH₂=CHCl). Rigid PVC: pipes, window frames, credit cards. Flexible PVC (with plasticizers): cables, flooring, clothing. One of the most produced plastics globally. Concerns: toxic additives (lead stabilizers) and dioxins from burning.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Elements & Compounds ---
  {
    question_text: "The chemical formula of water is H₂O. Its IUPAC name is:",
    options: ["Hydrogen monoxide","Dihydrogen monoxide","Dihydrogen oxide","Oxidodihydrogen (or simply water — IUPAC accepts 'water')"],
    correct_answer: 3,
    explanation: "Water (H₂O): IUPAC accepts 'water' as acceptable name. Systematic name: oxidane (2013 IUPAC recommendations) or dihydrogen oxide. A universal solvent, covers 71% of Earth's surface, covers 60% of human body. Unique properties: high specific heat, maximum density at 4°C, hydrogen bonding.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Carbon dioxide (CO₂) is produced during:",
    options: ["Photosynthesis","Combustion of carbon-containing fuels, respiration, and decomposition","Electrolysis of water","Nitrogen fixation"],
    correct_answer: 1,
    explanation: "CO₂ sources: combustion (CH₄ + 2O₂ → CO₂ + 2H₂O), respiration (C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O), decomposition of carbonates (heating), fermentation. CO₂ is a greenhouse gas. Absorbed by: photosynthesis (6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂), oceans. Dry ice = solid CO₂ (sublimes at −78.5°C).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Ozone (O₃) is an allotrope of oxygen. It is found mainly in the:",
    options: ["Troposphere","Stratosphere (15–35 km altitude), absorbing harmful UV radiation","Thermosphere","Mesosphere"],
    correct_answer: 1,
    explanation: "Ozone layer: stratosphere (15–35 km). Absorbs UV-B and UV-C. CFCs (chlorofluorocarbons) destroy ozone (one Cl atom can destroy 100,000 O₃ molecules). Montreal Protocol (1987): phase-out of CFCs. Ozone hole: forms over Antarctica each September–November. Tropospheric ozone: pollutant, forms in smog.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Ammonia (NH₃) is an important industrial chemical used primarily as:",
    options: ["A fuel","A fertilizer feedstock (converted to urea, ammonium nitrate, ammonium sulphate)","A refrigerant only","A bleaching agent"],
    correct_answer: 1,
    explanation: "Ammonia (NH₃): produced by Haber process (N₂ + 3H₂ → 2NH₃). 80% of global NH₃ production → fertilizers. Also used in: refrigeration (older systems), nitric acid manufacture (Ostwald process), cleaning agents, synthetic fibres (nylon), explosives (ammonium nitrate). World's most produced chemical.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Sulphuric acid (H₂SO₄) is manufactured industrially by the:",
    options: ["Haber process","Contact process (S → SO₂ → SO₃ + H₂O → H₂SO₄)","Ostwald process","Solvay process"],
    correct_answer: 1,
    explanation: "Contact process: (1) S burns → SO₂, (2) SO₂ + ½O₂ → SO₃ (V₂O₅ catalyst, 450°C), (3) SO₃ + H₂SO₄ → H₂S₂O₇ (oleum), (4) H₂S₂O₇ + H₂O → 2H₂SO₄. World's most produced industrial chemical (~250 million tonnes/year). Used in: fertilizers (superphosphate), dyes, drugs, batteries (lead-acid), oil refining.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Nitrogen (N₂) makes up approximately what percentage of air?",
    options: ["21%","78%","0.9%","99%"],
    correct_answer: 1,
    explanation: "Air composition: N₂ ≈ 78%, O₂ ≈ 21%, Ar ≈ 0.93%, CO₂ ≈ 0.04%, trace gases (Ne, He, Kr, Xe, H₂). Nitrogen is chemically inert (triple bond N≡N, very stable). Liquid N₂ (−196°C): used for cryopreservation of cells, quick-freeze food, MRI cooling. N₂ used in packaging of chips (prevents oxidation).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Chlorine gas is used in water purification because it is a powerful:",
    options: ["Catalyst","Reducing agent","Disinfectant — kills bacteria, viruses, and pathogens (by forming HOCl in water)","pH buffer"],
    correct_answer: 2,
    explanation: "Chlorination: Cl₂ + H₂O → HCl + HOCl (hypochlorous acid). HOCl kills microorganisms by oxidizing cell membrane and proteins. Residual chlorine (0.2–0.5 mg/L) protects through distribution network. Over-chlorination produces trihalomethanes (THMs) — potential carcinogens. Ozonation and UV also used as alternatives.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Metals ---
  {
    question_text: "The most abundant metal in the Earth's crust is:",
    options: ["Iron","Copper","Aluminium (about 8% of Earth's crust by mass)","Silicon"],
    correct_answer: 2,
    explanation: "Earth's crust composition: O (46%), Si (28%), Al (8.1%), Fe (5%), Ca (3.6%), Na (2.8%), K (2.6%), Mg (2.1%). Aluminium: most abundant metal. Found in clay, feldspar, bauxite (Al₂O₃). Silicon: most abundant metalloid/semiconductor. Iron: most used metal (steel production).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Iron is extracted from its ores (haematite Fe₂O₃, magnetite Fe₃O₄) in a:",
    options: ["Electrolytic cell","Blast furnace using coke (carbon) as reducing agent","Reverberatory furnace","Froth flotation process"],
    correct_answer: 1,
    explanation: "Blast furnace: haematite (Fe₂O₃) + coke (C) + limestone (CaCO₃) at ~1500°C. Coke burns: C + O₂ → CO₂ → CO. CO reduces Fe₂O₃: Fe₂O₃ + 3CO → 2Fe + 3CO₂. Limestone removes silica slag. Pig iron (4% C) → steel (0.1–1.5% C) by removing excess carbon. Also: wrought iron (almost pure), cast iron (>2% C).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Stainless steel is an alloy of iron with which elements that prevent rusting?",
    options: ["Iron + Carbon only","Iron + Chromium (>10.5%) + Nickel (often) — chromium forms protective Cr₂O₃ layer","Iron + Copper + Zinc","Iron + Manganese + Silicon"],
    correct_answer: 1,
    explanation: "Stainless steel: Fe + ≥10.5% Cr + often Ni, Mo, Ti. Chromium forms a thin passive Cr₂O₃ layer that blocks oxygen → prevents rust. Grades: 304 SS (18% Cr, 8% Ni — kitchen utensils), 316 SS (with Mo — marine, surgical), 400 series (only Cr — magnetic). 304 SS is most common.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Galvanizing is the process of coating iron/steel with:",
    options: ["Tin","Copper","Zinc to prevent corrosion","Chromium"],
    correct_answer: 2,
    explanation: "Galvanizing: coating iron/steel with zinc. Hot-dip galvanizing: steel dipped in molten zinc (450°C). Zinc protects by: (1) physical barrier, (2) cathodic/sacrificial protection (zinc is more reactive → corrodes preferentially, protecting iron). Used for: corrugated iron sheets, buckets, pipes, guardrails.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Copper is widely used for electrical wiring because it has:",
    options: ["Highest tensile strength","Lowest cost","Excellent electrical conductivity (second only to silver among common metals) and ductility","Highest melting point"],
    correct_answer: 2,
    explanation: "Copper: electrical conductivity ≈ 5.8 × 10⁷ S/m (only silver is better but too expensive). Highly ductile (drawn into thin wires), corrosion-resistant (forms green patina Cu₂CO₃(OH)₂), good thermal conductor. Used in: wiring, motors, transformers, pipes, PCBs, coins. Mined from chalcopyrite (CuFeS₂).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Bronze is an alloy of:",
    options: ["Copper + Zinc","Copper + Tin (typically 88% Cu + 12% Sn)","Iron + Carbon","Aluminium + Copper"],
    correct_answer: 1,
    explanation: "Bronze: Cu + Sn (copper-tin alloy). Harder than pure copper, better casting properties. Bronze Age (~3000 BCE): first use of bronze for tools/weapons. Brass: Cu + Zn (used in musical instruments, taps). German silver: Cu + Zn + Ni (no silver). Bell metal: 80% Cu + 20% Sn (makes clearer sound).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Non-metals ---
  {
    question_text: "Diamond and graphite are allotropes of carbon. Diamond is the hardest natural substance because:",
    options: ["It has a simple molecular structure","Each carbon atom is bonded to 4 others in a tetrahedral 3D covalent network — extremely strong bonds in all directions","It contains more carbon per gram","It has metallic bonding"],
    correct_answer: 1,
    explanation: "Diamond: each C atom sp³ hybridized, bonded to 4 other C atoms tetrahedrally → 3D covalent network → hardest natural substance (10 on Mohs scale). Graphite: each C sp² hybridized, hexagonal layers → soft (layers slide), electrical conductor (delocalized π electrons). Diamond conducts heat but not electricity.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Graphite is used as a lubricant and in pencils because:",
    options: ["It has a 3D structure like diamond","It is very hard","Its hexagonal layers are held together by weak van der Waals forces — layers slide easily over each other","It is magnetic"],
    correct_answer: 2,
    explanation: "Graphite: 2D layers of hexagons (sp² C). Within layers: strong covalent bonds. Between layers: weak van der Waals → layers slide easily. Uses: pencil 'lead' (graphite + clay), lubricant (especially at high temperatures), electrode in batteries/electrolysis, nuclear reactor moderator, carbon fibre composites.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Buckminsterfullerene (Buckyball) is an allotrope of carbon with the formula:",
    options: ["C₆₀ — 60 carbon atoms arranged like a soccer ball (truncated icosahedron)","C₁₂","C₁₂₀","C₆"],
    correct_answer: 0,
    explanation: "Buckminsterfullerene (C₆₀): discovered 1985 by Kroto, Curl, Smalley (Nobel 1996). 60 carbons in 20 hexagons and 12 pentagons (like a soccer ball). Other fullerenes: C₇₀, C₈₄. Carbon nanotubes (CNTs): rolled graphene sheets. Graphene: single layer of graphite, strongest material, excellent conductor. All are carbon allotropes.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Sulphur dioxide (SO₂) released by burning fossil fuels combines with water in the atmosphere to form:",
    options: ["Carbonic acid","Sulphuric acid (H₂SO₄) — a major component of acid rain","Hydrochloric acid","Nitric acid"],
    correct_answer: 1,
    explanation: "Acid rain: SO₂ + H₂O → H₂SO₃ (sulphurous acid) → oxidized → H₂SO₄ (sulphuric acid). Also NO₂ + H₂O → HNO₃ (nitric acid). pH of acid rain < 5.6. Damages: marble/limestone buildings (CaCO₃ + H₂SO₄ → CaSO₄ + H₂O + CO₂), forests, aquatic life. Taj Mahal affected by acid rain.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Solutions ---
  {
    question_text: "Molarity (M) of a solution is defined as:",
    options: ["Moles of solute per kg of solvent (molality)","Moles of solute per litre of solution (mol/L or M)","Mass of solute per volume of solution","Equivalents of solute per litre"],
    correct_answer: 1,
    explanation: "Molarity (M) = moles of solute / volume of solution in litres. 1 M NaCl = 58.5 g NaCl dissolved to make 1 litre solution. Molality (m) = moles/kg solvent. Normality (N) = equivalents/litre. Mole fraction = moles of component / total moles. Molarity changes with temperature (volume changes); molality doesn't.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Osmosis is the movement of solvent molecules through a semipermeable membrane from a region of:",
    options: ["Higher solute concentration to lower solute concentration","Lower solute concentration to higher solute concentration (from dilute to concentrated solution)","Higher pressure to lower pressure","Any direction randomly"],
    correct_answer: 1,
    explanation: "Osmosis: solvent (usually water) moves from dilute solution (low solute, high water potential) to concentrated solution (high solute, low water potential) through semipermeable membrane. Osmotic pressure: pressure needed to stop osmosis. Reverse osmosis (RO): apply pressure greater than osmotic pressure → desalination, water purification.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The solubility of a gas in a liquid (at constant temperature) is proportional to the partial pressure of the gas above the liquid. This is:",
    options: ["Raoult's Law","Henry's Law","Graham's Law","Dalton's Law"],
    correct_answer: 1,
    explanation: "Henry's Law: C = k_H × P. Carbonated drinks: CO₂ dissolved under high pressure → opened → pressure released → CO₂ escapes (fizzing). Deep-sea divers: avoid quick ascent (nitrogen in blood 'fizzes' out → bends/decompression sickness). Oxygen in blood follows Henry's Law (dissolved by pressure in lungs).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Thermochemistry ---
  {
    question_text: "An exothermic reaction is one that:",
    options: ["Absorbs heat from the surroundings","Releases heat to the surroundings (ΔH < 0, products have lower energy than reactants)","Requires electricity to proceed","Occurs only at high temperatures"],
    correct_answer: 1,
    explanation: "Exothermic (ΔH < 0): releases heat → surroundings warm up. Examples: combustion, neutralization, respiration, rusting (slow), dissolving NaOH in water, crystallization. Endothermic (ΔH > 0): absorbs heat → surroundings cool. Examples: photosynthesis, dissolving NH₄NO₃ in water (cold pack), baking soda + vinegar, thermal decomposition.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Hess's Law of Constant Heat Summation states that:",
    options: ["Heat of reaction depends on the path taken","Total enthalpy change of a reaction is the same regardless of the route taken (since enthalpy is a state function)","Endothermic reactions are always reversible","Exothermic reactions are faster"],
    correct_answer: 1,
    explanation: "Hess's Law: ΔH_total = ΔH₁ + ΔH₂ + ... (path independent). Allows calculation of ΔH for reactions that can't be measured directly, by combining known reactions. Example: ΔH for C + O₂ → CO₂ can be calculated from ΔH of C + ½O₂ → CO and CO + ½O₂ → CO₂.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Biochemistry Basics ---
  {
    question_text: "Carbohydrates are biomolecules composed of:",
    options: ["Carbon, hydrogen, nitrogen","Carbon, hydrogen, oxygen (ratio H:O approximately 2:1, general formula Cₙ(H₂O)ₙ)","Carbon, nitrogen, sulphur","Carbon and hydrogen only"],
    correct_answer: 1,
    explanation: "Carbohydrates: Cₙ(H₂O)ₙ. Monosaccharides (glucose C₆H₁₂O₆, fructose, galactose), Disaccharides (sucrose = glucose + fructose; lactose = glucose + galactose; maltose = glucose + glucose), Polysaccharides (starch, glycogen, cellulose — all polymers of glucose). Primary energy source (4 kcal/g).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Proteins are polymers of:",
    options: ["Sugars","Fatty acids","Amino acids joined by peptide bonds","Nucleotides"],
    correct_answer: 2,
    explanation: "Proteins: polymers of amino acids (20 standard types) linked by peptide bonds (-CO-NH-). Primary structure: amino acid sequence. Secondary: α-helix, β-sheet (H-bonds). Tertiary: 3D folding. Quaternary: multiple polypeptide chains. Functions: enzymes, antibodies, hormones (insulin), structural (collagen), transport (haemoglobin).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Fats (lipids) are esters of fatty acids and:",
    options: ["Amino acids","Glycerol (triglycerides — 3 fatty acids + 1 glycerol)","Glucose","Nucleic acids"],
    correct_answer: 1,
    explanation: "Triglycerides (fats/oils): glycerol + 3 fatty acids (via esterification). Saturated fatty acids (no double bonds, solid at room temp): butter, lard, coconut oil. Unsaturated (one or more double bonds, liquid): olive oil, fish oil. Energy: 9 kcal/g. Saponification: fat + NaOH → soap (sodium fatty acid salt) + glycerol.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Fertilizers ---
  {
    question_text: "Urea (NH₂CONH₂) is the most widely used nitrogenous fertilizer. Its nitrogen content is approximately:",
    options: ["14%","28%","46% — highest N content among solid fertilizers","60%"],
    correct_answer: 2,
    explanation: "Urea: 46% N by mass (highest among common solid fertilizers). Made from NH₃ + CO₂ → NH₂COONH₄ (ammonium carbamate) → urea + H₂O. Water soluble. Converted to NH₄⁺ in soil by urease enzyme. DAP (diammonium phosphate): 18%N + 46%P₂O₅. NPK fertilizers contain nitrogen, phosphorus, potassium.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Which of the following is the chemical formula of common washing soda?",
    options: ["NaHCO₃","Na₂CO₃·10H₂O (sodium carbonate decahydrate)","NaCl","NaOH"],
    correct_answer: 1,
    explanation: "Washing soda = Na₂CO₃·10H₂O (sodium carbonate decahydrate). Made by Solvay process. Used in: laundry, water softening (removes temporary and permanent hardness by precipitating Ca²⁺ and Mg²⁺), glass making, paper industry. Anhydrous Na₂CO₃ = soda ash. Baking soda = NaHCO₃.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Environmental Chemistry ---
  {
    question_text: "The primary greenhouse gas contributing to global warming from human activities is:",
    options: ["Water vapour (H₂O)","Methane (CH₄)","Carbon dioxide (CO₂) from fossil fuel combustion","Nitrous oxide (N₂O)"],
    correct_answer: 2,
    explanation: "CO₂ is the primary human-caused greenhouse gas (by total forcing). Pre-industrial: 280 ppm; current: 420+ ppm (highest in 3 million years). Sources: fossil fuels (76%), deforestation (11%), agriculture/industry. Other GHGs: CH₄ (more potent but less abundant), N₂O, CFCs/HFCs. Carbon capture is one solution.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The pH of normal rainwater is slightly acidic (about 5.6) due to dissolution of:",
    options: ["Nitrogen from factories","CO₂ from the atmosphere forming carbonic acid (H₂CO₃)","Sulphur compounds from sea","Ozone"],
    correct_answer: 1,
    explanation: "Normal rain: CO₂ + H₂O → H₂CO₃ (carbonic acid) → pH ≈ 5.6. Acid rain (pH < 5.6): additional H₂SO₄ (from SO₂) and HNO₃ (from NOₓ). pH of acid rain: 4–5 (most areas), as low as 2–3 in heavily polluted regions. Clean rain: pH ≈ 5.6, acid rain: < 5.6.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Which gas is primarily responsible for the 'hole' in the ozone layer?",
    options: ["CO₂","CFCs (chlorofluorocarbons — release Cl atoms that catalytically destroy O₃)","SO₂","NO₂"],
    correct_answer: 1,
    explanation: "CFCs (Freon): used in refrigerators, AC, aerosol sprays. In stratosphere, UV breaks Cl from CFC: CFCl₃ → CFCl₂ + Cl•. Cl• + O₃ → ClO + O₂; ClO + O → Cl• + O₂ (Cl• regenerated → catalytic cycle destroys thousands of O₃). Montreal Protocol (1987): phase-out of CFCs → ozone layer slowly recovering.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  // --- Miscellaneous ---
  {
    question_text: "The pH of human blood is maintained between:",
    options: ["6.5–7.0","7.0–7.2","7.35–7.45 (slightly alkaline)","7.8–8.0"],
    correct_answer: 2,
    explanation: "Blood pH: 7.35–7.45 (slightly alkaline). Maintained by carbonic acid-bicarbonate buffer system (H₂CO₃ ⇌ H⁺ + HCO₃⁻). Acidosis: pH < 7.35 (serious). Alkalosis: pH > 7.45 (also dangerous). Lungs regulate CO₂ (and thus H₂CO₃). Kidneys regulate HCO₃⁻ excretion. Even small deviations affect enzyme function.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Hard water is called 'hard' because it:",
    options: ["Is physically hard to touch","Contains dissolved Ca²⁺ and Mg²⁺ salts that react with soap to form insoluble scum instead of lather","Is at very high pressure","Contains iron compounds"],
    correct_answer: 1,
    explanation: "Hard water: contains dissolved Ca²⁺, Mg²⁺ (from CaCO₃, CaSO₄, MgCO₃, MgCl₂). Reacts with soap (sodium stearate) → insoluble calcium stearate scum instead of lather. Temporary hardness (Ca(HCO₃)₂): removed by boiling. Permanent hardness (CaSO₄, CaCl₂): removed by adding Na₂CO₃, ion exchange, or distillation.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The chemical name of limestone (used in construction and cement) is:",
    options: ["Calcium sulphate","Calcium hydroxide","Calcium carbonate (CaCO₃)","Calcium chloride"],
    correct_answer: 2,
    explanation: "CaCO₃ (calcium carbonate): limestone, marble, chalk — all polymorphs. Heated → CaO (quicklime/calcium oxide) + CO₂. CaO + H₂O → Ca(OH)₂ (slaked lime/calcium hydroxide). Ca(OH)₂ + CO₂ → CaCO₃ (lime water test for CO₂). Cement: heated CaCO₃ + SiO₂ + Al₂O₃ + Fe₂O₃ → complex silicates.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The chemical formula of glucose (blood sugar) is:",
    options: ["C₆H₁₂O₆","C₁₂H₂₂O₁₁","C₆H₁₂O₆ and C₁₂H₂₂O₁₁ are both glucose","CH₂O"],
    correct_answer: 0,
    explanation: "Glucose: C₆H₁₂O₆. Simple sugar (monosaccharide, hexose). Main energy source for cells. Normal blood glucose: 70–100 mg/dL (fasting). Sucrose (table sugar): C₁₂H₂₂O₁₁ (disaccharide = glucose + fructose). Photosynthesis produces glucose: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Which of the following is NOT a property of metals?",
    options: ["Good conductors of electricity","High melting points generally","Brittle (breaks without bending) — this is a property of ceramics/ionic compounds, not metals","Malleable and ductile"],
    correct_answer: 2,
    explanation: "Metals are generally: good conductors (electricity and heat), malleable (can be beaten into sheets), ductile (drawn into wires), lustrous (shiny), high melting point (except Hg, Cs, Ga). Brittle is NOT a metal property — brittleness is characteristic of ceramics, ionic compounds, and some metalloids. Exceptions: metals become brittle at very low temperatures.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Which acid is present in car batteries (lead-acid batteries)?",
    options: ["Hydrochloric acid","Sulphuric acid (H₂SO₄ dilute, ~37% w/w, ~4.5 M)","Nitric acid","Acetic acid"],
    correct_answer: 1,
    explanation: "Lead-acid battery: dilute H₂SO₄ (38% solution, ~4.2 M). Lead plates (anode: Pb → PbSO₄) and lead oxide plates (cathode: PbO₂ → PbSO₄). Both electrodes form PbSO₄ during discharge. Charging reverses the process. Typical car battery: 12V (6 cells × 2V each). Battery SG measured by hydrometer (1.28 when fully charged).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The process of converting vegetable oils (liquid) to fats (solid/semi-solid) by reacting with hydrogen in the presence of a nickel catalyst is called:",
    options: ["Saponification","Hydrogenation (adds H₂ across double bonds of unsaturated fatty acids)","Esterification","Fermentation"],
    correct_answer: 1,
    explanation: "Hydrogenation: vegetable oil + H₂ → partially saturated fat (vegetable ghee/margarine). Ni catalyst, ~150–200°C. Converts unsaturated C=C to saturated C-C. Product: 'vanaspati' or margarine. Trans fats form during partial hydrogenation — linked to cardiovascular disease. Now partially replaced by interesterification.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Soaps are made by the saponification reaction of fats with:",
    options: ["Hydrochloric acid","Sodium hydroxide (NaOH) for hard soap or KOH for soft/liquid soap","Sulphuric acid","Ammonia"],
    correct_answer: 1,
    explanation: "Saponification: Fat (triglyceride) + NaOH → Glycerol + 3 sodium fatty acid salts (soap). Hard soap (NaOH): solid bar soap. Soft soap (KOH): liquid/soft soap. Soap molecules: hydrophilic head (ionic -COONa) + hydrophobic tail (hydrocarbon chain) → forms micelles in water that trap grease. Detergents work in hard water, soaps don't.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Laughing gas (used as anaesthetic and in whipped cream dispensers) is:",
    options: ["NO","N₂O (nitrous oxide)","NO₂","N₂"],
    correct_answer: 1,
    explanation: "Nitrous oxide (N₂O): colourless gas, slightly sweet smell. Called 'laughing gas' (causes euphoria at low doses). Uses: dental/minor surgery anaesthetic (since Humphry Davy discovered in 1800), food (propellant in whipped cream cans), vehicle engine booster (NOS — nitrous oxide system). Greenhouse gas (298× CO₂ GWP).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Rust (iron oxide) has the approximate chemical formula:",
    options: ["FeO","Fe₂O₃","Fe₂O₃·xH₂O (hydrated iron(III) oxide)","Fe₃O₄"],
    correct_answer: 2,
    explanation: "Rust = Fe₂O₃·xH₂O (hydrated iron oxide, where x varies). The reddish-brown colour comes from the hydrated iron(III) oxide. Rusting requires both oxygen AND water. Fe₃O₄ (magnetite) is found in wüstite/magnetite scale. FeO is iron(II) oxide. Rust is porous (unlike aluminium oxide passivation layer which is protective).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The active ingredient in bleaching powder is:",
    options: ["CaCl₂","Ca(OCl)Cl — calcium hypochlorite and calcium chloride mixture","NaOCl","Cl₂ gas"],
    correct_answer: 1,
    explanation: "Bleaching powder: Ca(OCl)Cl (calcium hypochlorite + calcium chloride). Made by passing Cl₂ over slaked lime: Ca(OH)₂ + Cl₂ → Ca(OCl)Cl + H₂O. Releases HOCl (hypochlorous acid) on contact with water/acid → oxidizing bleaching action. Used in: water purification, laundry, paper bleaching. Sodium hypochlorite (NaOCl) = liquid bleach (Clorox).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The chemical used in photography that is sensitive to light (turns dark on exposure) is:",
    options: ["Silver chloride","Silver bromide (AgBr) — light reduces Ag⁺ to Ag (black) forming latent image","Silver nitrate","Silver sulphide"],
    correct_answer: 1,
    explanation: "Photographic film: AgBr (and AgI) crystals in gelatin emulsion. Light → Ag⁺ + Br⁻ → Ag⁰ (metallic silver, black) forms latent image. Developer chemical reduces more Ag⁺ → darker image. Fixer (Na₂S₂O₃, hypo) dissolves unexposed AgBr → prevents further reaction. Digital cameras have replaced film photography.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Aspirin (used as a painkiller) is chemically:",
    options: ["Paracetamol","Acetylsalicylic acid (ASA, C₉H₈O₄)","Ibuprofen","Codeine"],
    correct_answer: 1,
    explanation: "Aspirin = Acetylsalicylic acid. Synthesized by Felix Hoffmann (Bayer, 1897). Made from salicylic acid + acetic anhydride. Mechanism: inhibits COX enzymes → reduces prostaglandins → anti-inflammatory, analgesic (pain relief), antipyretic (fever reducer), antiplatelet. Low-dose aspirin prevents heart attacks and strokes.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "DDT (dichlorodiphenyltrichloroethane) is an organochlorine pesticide that was banned due to:",
    options: ["Its high cost","Its ineffectiveness against insects","Bioaccumulation up the food chain (biomagnification) causing reproductive failure in birds (eagle egg shells thinned) and environmental persistence","Its smell"],
    correct_answer: 2,
    explanation: "DDT: effective insecticide (malaria control), but persists in environment for years (non-biodegradable). Bioaccumulates in fatty tissue (lipophilic) and biomagnifies up food chain → top predators (eagles, ospreys) got high doses → eggshell thinning → reproductive failure. Rachel Carson's 'Silent Spring' (1962) raised awareness. Banned in most countries by 1970s. Stockholm Convention (2001) restricted DDT globally.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "Vulcanization of rubber involves adding sulphur to create:",
    options: ["Double bonds in rubber","Cross-links between rubber polymer chains — makes rubber harder, more elastic, and temperature-stable","A lubricant coating on rubber","Electrical conductivity in rubber"],
    correct_answer: 1,
    explanation: "Vulcanization (Charles Goodyear, 1839): rubber + S (heating at 150°C) → disulfide cross-links between polyisoprene chains. Before: rubber is sticky when hot, brittle when cold. After vulcanization: maintains elasticity across temperature range, stronger, more durable. Tyres: ~30% S for hard rubber; 1-3% S for elastic vulcanized rubber.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","rrb","upsc"]
  },
  {
    question_text: "The Solvay process (ammonia-soda process) is used to manufacture:",
    options: ["Sulphuric acid","Ammonia","Sodium carbonate (Na₂CO₃, soda ash) and sodium bicarbonate (NaHCO₃)","Chlorine gas"],
    correct_answer: 2,
    explanation: "Solvay process (Ernest Solvay, 1863): NaCl + NH₃ + CO₂ + H₂O → NaHCO₃↓ + NH₄Cl. NaHCO₃ heated → Na₂CO₃ + H₂O + CO₂. NH₃ recovered from NH₄Cl + Ca(OH)₂. Raw materials: NaCl (brine), CaCO₃ (limestone for CO₂). Na₂CO₃ used in: glass, paper, detergents, water treatment.",
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
