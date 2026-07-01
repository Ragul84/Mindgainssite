require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const BASE  = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
const KEY   = 'quiz:subject:economics';
const HDR   = { Authorization:`Bearer ${TOKEN}`, 'Content-Type':'application/json' };

const questions = [
  {
    question_text: "The term 'Repo Rate' — the rate at which RBI lends to commercial banks — stands for:",
    options: ["Reserve Purchase Rate","Repurchase Agreement Rate","Regulatory Policy Rate","Refinancing Percentage Rate"],
    correct_answer: 1,
    explanation: "Repo (Repurchase Agreement) Rate: RBI lends funds to banks for 1 day against government securities, with banks agreeing to repurchase them next day. Currently 6.5% (as of 2024). Key monetary policy tool.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc","banking"]
  },
  {
    question_text: "Which of the following is NOT a function of NABARD?",
    options: ["Refinancing commercial banks for agriculture loans","Regulating and supervising cooperative banks and RRBs","Issuing currency notes","Providing long-term credit for rural infrastructure"],
    correct_answer: 2,
    explanation: "NABARD (1982): refinances banks for agri/rural credit, supervises cooperative banks and RRBs, finances rural infrastructure (RIDF). Currency issuance is exclusively RBI's function. NABARD doesn't issue currency.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc","banking"]
  },
  {
    question_text: "The Pradhan Mantri Jan Dhan Yojana (PMJDY) was launched on:",
    options: ["August 15, 2014","August 28, 2014","October 2, 2014","January 26, 2015"],
    correct_answer: 1,
    explanation: "PMJDY launched August 28, 2014 — National Mission for Financial Inclusion. Features: zero-balance account, RuPay debit card, Rs 1 lakh accident insurance, Rs 30,000 life cover, overdraft facility. Guinness record for most accounts opened in a week.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc","banking"]
  },
  {
    question_text: "Foreign Portfolio Investment (FPI) differs from Foreign Direct Investment (FDI) because FPI:",
    options: ["Involves only real estate purchases","Does not involve management control — it's passive investment in stocks/bonds","Is restricted to government securities only","Has no equity component"],
    correct_answer: 1,
    explanation: "FPI: passive investment in financial instruments (stocks, bonds) without management control. FDI: significant ownership/management control (≥10% equity per OECD definition). FPI is more volatile (hot money) vs FDI (more stable).",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc","banking"]
  },
  {
    question_text: "The 'Twin Balance Sheet Problem' in India referred to stressed balance sheets of:",
    options: ["Government and RBI","Over-indebted corporates AND banks with high NPAs","Central government and state governments","Public sector banks and private sector banks"],
    correct_answer: 1,
    explanation: "Twin Balance Sheet (TBS) problem: (1) corporate sector over-leveraged (unable to service debt) + (2) banks with rising NPAs. Identified by Economic Survey 2016-17. Led to IBC 2016 and bank recapitalization.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","banking"]
  },
  {
    question_text: "India's Wholesale Price Index (WPI) is published by:",
    options: ["RBI","CSO/NSO","Ministry of Commerce and Industry (Office of the Economic Adviser)","MOSPI"],
    correct_answer: 2,
    explanation: "WPI: published monthly by Office of the Economic Adviser (OEA), Department for Promotion of Industry and Internal Trade (DPIIT), Ministry of Commerce and Industry. Base year 2011-12, 697 commodities.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The Monetary Policy Committee (MPC) consists of how many members, and who has the casting vote?",
    options: ["4 members; RBI Deputy Governor","6 members; RBI Governor","8 members; Finance Minister","6 members; Finance Minister"],
    correct_answer: 1,
    explanation: "MPC: 6 members — 3 from RBI (Governor, 2 Deputy Governors) + 3 external members appointed by Government. RBI Governor chairs and has casting vote in case of tie. Meets every 2 months. Inflation target: 4% ± 2%.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","banking"]
  },
  {
    question_text: "India became a member of the International Monetary Fund (IMF) and World Bank in:",
    options: ["1944 (at Bretton Woods)","1945","1947","1950"],
    correct_answer: 2,
    explanation: "India joined IMF and World Bank (IBRD) in 1945. Both institutions were created at Bretton Woods Conference (July 1944) in New Hampshire, USA. IMF: financial stability; World Bank: development loans.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The National Food Security Act (NFSA) 2013 provides subsidized food grains to what percentage of India's population?",
    options: ["50%","67%","75%","81%"],
    correct_answer: 1,
    explanation: "NFSA 2013: covers up to 75% rural + 50% urban population = ~67% of total population (~81.35 crore people). Provides 5 kg/person/month at subsidized rates: Rice Rs 3, Wheat Rs 2, Coarse grains Rs 1/kg.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The concept of 'Demographic Dividend' for India refers to the economic benefit arising from:",
    options: ["Large elderly population needing care industry","Large working-age population relative to dependents (young + old)","High birth rate boosting consumption","Migration of skilled workers abroad (remittances)"],
    correct_answer: 1,
    explanation: "Demographic Dividend: large working-age population (15-64) relative to dependents boosts savings, investment, and growth. India's window: ~2020-2040. Median age ~28 years. Requires jobs and skill development.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc","banking"]
  },
  {
    question_text: "Demonetization in India (November 8, 2016) scrapped currency notes of which denominations?",
    options: ["Rs 100 and Rs 500","Rs 500 and Rs 1000","Rs 1000 and Rs 2000","Rs 500, Rs 1000, and Rs 2000"],
    correct_answer: 1,
    explanation: "Demonetization (November 8, 2016): PM Modi announced scrapping of Rs 500 and Rs 1000 notes (86% of currency in circulation). New Rs 500 and Rs 2000 notes introduced. Aims: counter black money, counterfeit, terror financing.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc","banking"]
  },
  {
    question_text: "The concept of 'Creative Destruction' associated with Joseph Schumpeter describes:",
    options: ["Environmental destruction from industrialization","Innovation that destroys existing industries while creating new ones, driving capitalist progress","Bankruptcy and liquidation of companies","War's role in economic development"],
    correct_answer: 1,
    explanation: "Schumpeter's Creative Destruction: innovation (new products, methods, markets) makes existing industries obsolete, destroying old capital while creating new. Key driver of long-run capitalist dynamism. (E.g., smartphones destroyed film cameras.)",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'Big Bang' approach to economic reforms (as opposed to 'gradualism') involves:",
    options: ["Slow, phased implementation of reforms","Rapid, simultaneous implementation of multiple major reforms","Only monetary reforms","Only trade reforms"],
    correct_answer: 1,
    explanation: "Big Bang reforms: comprehensive, rapid liberalization across sectors simultaneously (Poland 1990, Russia early 1990s). Contrasts with China's and India's gradual approach. India's 1991 reforms were bold but not full 'big bang.'",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "UNCTAD (United Nations Conference on Trade and Development) is headquartered in:",
    options: ["New York","Washington D.C.","Geneva","Vienna"],
    correct_answer: 2,
    explanation: "UNCTAD: established 1964; headquarters in Geneva, Switzerland (same as WTO). Publishes World Investment Report (FDI data), Trade and Development Report. India is a founding member.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The concept of 'Opportunity Cost' is best illustrated by:",
    options: ["A factory's monthly electricity bill","A student choosing to study instead of working (foregone salary = opportunity cost of education)","A tax paid to the government","Depreciation of machinery"],
    correct_answer: 1,
    explanation: "Opportunity Cost: value of the next best alternative foregone when making a choice. Example: studying full-time costs the salary you could have earned. It's implicit (not a cash payment) but real economic cost.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc","banking"]
  },
  {
    question_text: "India's Planning Commission was replaced by NITI Aayog in January 2015 with a change in focus from:",
    options: ["Heavy industry to agriculture","Central planning with resource allocation to policy advisory and competitive federalism","Five year plans to annual plans","Public sector to private sector"],
    correct_answer: 1,
    explanation: "Planning Commission (1950-2014): top-down central planning, resource allocation to states. NITI Aayog (Jan 1, 2015): policy think-tank, cooperative federalism, no fund-allocation power. PM is its chairman.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The External Commercial Borrowings (ECB) framework allows Indian companies to borrow from:",
    options: ["Domestic banks only","Foreign lenders (banks, bond markets) in foreign currency","RBI directly","Government of India through special bonds"],
    correct_answer: 1,
    explanation: "ECB: foreign currency loans raised by Indian corporates from foreign lenders (recognized lenders like foreign banks, foreign bondholders). Regulated by RBI under FEMA. Used to access cheaper foreign funds.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","banking"]
  },
  {
    question_text: "Which index measures the inequality of income or wealth distribution in a country?",
    options: ["Human Development Index (HDI)","Gini Coefficient","Consumer Price Index (CPI)","Multidimensional Poverty Index (MPI)"],
    correct_answer: 1,
    explanation: "Gini Coefficient (Corrado Gini, 1912): 0 = perfect equality; 1 = maximum inequality. Derived from Lorenz Curve. India's Gini ~0.36 (income). Used alongside HDI to measure inclusive development.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc","banking"]
  },
  {
    question_text: "What is the role of the Comptroller and Auditor General (CAG) of India in public finance?",
    options: ["Prepare the Union Budget","Audit all government expenditures and receipts to ensure accountability","Manage government debt","Regulate banks"],
    correct_answer: 1,
    explanation: "CAG (Article 148): supreme audit institution. Audits accounts of Union and State governments, PSUs. Reports tabled in Parliament (Union) and State Legislatures. Independent of executive; reports to President.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "India's GDP composition (2022-23 estimates) shows which sector contributing the most to GDP?",
    options: ["Agriculture (~45%)","Industry (~25%)","Services (~55%)","Manufacturing (~35%)"],
    correct_answer: 2,
    explanation: "India's GDP by sector (2022-23): Services ~55%, Industry ~25-28%, Agriculture ~17-18%. Services (IT, finance, trade, transport) dominate GDP. But agriculture employs ~45% of workforce — structural dualism.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc","banking"]
  },
  {
    question_text: "The Economic Survey is presented in Parliament just before the Union Budget by:",
    options: ["RBI Governor","Chief Economic Adviser to the Government of India","Finance Minister","NITI Aayog Vice Chairman"],
    correct_answer: 1,
    explanation: "Economic Survey: prepared by the Economic Division of Ministry of Finance under the Chief Economic Adviser (CEA). Reviews the economy's performance. Presented before Union Budget. Volume 1: thematic; Volume 2: data.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc","banking"]
  },
  {
    question_text: "The concept of 'Financial Repression' refers to:",
    options: ["High interest rates imposed by central banks","Government policies that keep interest rates below inflation, effectively taxing savers to benefit borrowers (especially government)","Restrictions on foreign banks operating in India","Reducing credit to the private sector"],
    correct_answer: 1,
    explanation: "Financial Repression: government caps interest rates below inflation rate, making real rates negative. Savers lose; government borrows cheaply (financial sector 'repressed'). Common in post-WWII period and some developing nations.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's UPI (Unified Payments Interface) was developed by:",
    options: ["RBI","SEBI","National Payments Corporation of India (NPCI)","Ministry of Finance"],
    correct_answer: 2,
    explanation: "UPI: developed by NPCI (National Payments Corporation of India) in 2016, launched April 11, 2016. Enables instant 24×7 inter-bank fund transfers via mobile. India processes ~10 billion UPI transactions/month (2023).",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc","banking"]
  },
  {
    question_text: "Masala Bonds are rupee-denominated bonds issued by Indian entities in:",
    options: ["Indian domestic markets","Overseas (international) markets to foreign investors","Only in Singapore","Only in the London Stock Exchange"],
    correct_answer: 1,
    explanation: "Masala Bonds: rupee-denominated bonds issued by Indian entities (corporates, government-backed) in overseas markets. Currency risk borne by foreign investors. First issued by IFC (World Bank arm) in 2014 on LSE.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","banking"]
  },
  {
    question_text: "The Revenue Deficit is defined as:",
    options: ["Total expenditure minus total receipts","Revenue expenditure minus revenue receipts","Fiscal deficit minus interest payments","Capital expenditure minus capital receipts"],
    correct_answer: 1,
    explanation: "Revenue Deficit = Revenue Expenditure − Revenue Receipts. Shows that current (non-capital) spending exceeds current income, meaning government borrows even for day-to-day expenses (not just investment). Negative for fiscal health.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc","banking"]
  },
  {
    question_text: "India's first Five Year Plan (1951-56) primarily focused on:",
    options: ["Heavy industrialization","Agricultural development and rehabilitation of refugees","Export promotion","Social sector development"],
    correct_answer: 1,
    explanation: "First FYP (1951-56): Harrod-Domar model; focus on agriculture (after 1943 Bengal famine memories), power, transport, rehabilitation of 1947 partition refugees. Bhakra Nangal dam a key project. Exceeded growth targets.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The Kuznets Curve (Environmental Kuznets Curve) in economics hypothesizes that environmental degradation:",
    options: ["Increases continuously with economic growth","First increases then decreases as per-capita income rises (inverted U-shape)","Decreases with industrialization","Is unrelated to income levels"],
    correct_answer: 1,
    explanation: "EKC: at low income levels, growth increases pollution. Beyond a threshold, cleaner technologies and stricter regulations reduce pollution. Named after Simon Kuznets (who proposed income-inequality inverted-U, not environment).",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's National Pension System (NPS) is regulated by:",
    options: ["SEBI","RBI","Pension Fund Regulatory and Development Authority (PFRDA)","Insurance Regulatory and Development Authority (IRDAI)"],
    correct_answer: 2,
    explanation: "NPS regulated by PFRDA (Pension Fund Regulatory and Development Authority), established under PFRDA Act 2013. NPS launched 2004 for government employees (replaced old pension). Extended to all citizens 2009.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc","banking"]
  },
  {
    question_text: "The MSME sector in India is defined under the MSME Development (Amendment) Act 2020 based on:",
    options: ["Number of employees only","Investment in plant & machinery/equipment AND annual turnover","Annual turnover only","Capital employed only"],
    correct_answer: 1,
    explanation: "MSME 2020 definition: Micro (Investment ≤Rs 1 cr, Turnover ≤Rs 5 cr), Small (Investment ≤Rs 10 cr, Turnover ≤Rs 50 cr), Medium (Investment ≤Rs 50 cr, Turnover ≤Rs 250 cr). Composite criteria (investment + turnover).",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc","banking"]
  },
  {
    question_text: "Which authority approves the Union Budget in India?",
    options: ["Cabinet Committee on Economic Affairs","Lok Sabha (lower house of Parliament)","Both Houses of Parliament","President of India"],
    correct_answer: 1,
    explanation: "Appropriation Bill and Finance Bill (forming Union Budget) must pass Lok Sabha — money bills are exclusively Lok Sabha's domain (Article 110). Rajya Sabha can only suggest amendments (no power to reject). President's assent follows.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The Directorate General of Foreign Trade (DGFT) is responsible for:",
    options: ["Collecting import/export duties","Formulating and implementing India's Foreign Trade Policy (FTP)","Regulating foreign exchange transactions","Negotiating trade agreements"],
    correct_answer: 1,
    explanation: "DGFT: under Ministry of Commerce and Industry. Implements FTP, issues Importer Exporter Code (IEC), administers export promotion schemes (EPCG, Advance Authorization, MEIS/RODTEP). Also issues export/import licenses.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "India's Sovereign Wealth Fund equivalent is:",
    options: ["RBI's foreign exchange reserves","National Investment and Infrastructure Fund (NIIF)","GPF (General Provident Fund)","EPFO corpus"],
    correct_answer: 1,
    explanation: "NIIF (2015): India's quasi-sovereign wealth fund. Government of India owns 49%, remaining 51% from institutional investors (ADIA of Abu Dhabi, CDPQ of Canada, etc.). Invests in infrastructure assets.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","banking"]
  },
  {
    question_text: "The term 'Helicopter Money' (popularized by Milton Friedman) refers to:",
    options: ["Emergency aid dropped in disaster zones","Central bank directly distributing money to the public to stimulate economy","Helicopter transport subsidies","Air freight subsidies"],
    correct_answer: 1,
    explanation: "Helicopter Money: Friedman's metaphor for central bank dropping cash from helicopter (direct transfers to citizens) to stimulate demand. Unlike QE (which goes through banks), helicopter money bypasses banks. Discussed during deflation crises.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's forex reserves are managed by:",
    options: ["Ministry of Finance","State Bank of India","Reserve Bank of India","EXIM Bank"],
    correct_answer: 2,
    explanation: "RBI manages India's foreign exchange reserves (~$640-650 billion as of 2024): includes foreign currency assets (FCAs), gold, SDRs, reserve tranche with IMF. Under FEMA 1999. 4th largest globally.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc","banking"]
  },
  {
    question_text: "The Marginal Propensity to Save (MPS) + Marginal Propensity to Consume (MPC) always equals:",
    options: ["0","Less than 1","1","Greater than 1"],
    correct_answer: 2,
    explanation: "MPC + MPS = 1 (an additional unit of income is either consumed or saved, nothing else). Investment Multiplier k = 1/(1−MPC) = 1/MPS. Higher MPC → higher multiplier effect of government spending.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc","banking"]
  },
  {
    question_text: "The 'Smile Curve' concept in international trade (coined by Stan Shih of Acer) shows that:",
    options: ["Profits are highest in the middle of the value chain (manufacturing)","Profits are highest at both ends of the value chain (R&D/design and marketing/services), not in manufacturing","Developing countries benefit most from trade","Small economies grow faster"],
    correct_answer: 1,
    explanation: "Smile Curve: value added is highest at R&D/design (upstream) and brand/marketing/services (downstream) ends; manufacturing in the middle captures less value. Explains why Apple earns more than Foxconn despite Foxconn making iPhones.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's National Monetization Pipeline (NMP) aims to monetize government/PSU brownfield assets worth approximately:",
    options: ["Rs 1 lakh crore","Rs 3 lakh crore","Rs 6 lakh crore","Rs 10 lakh crore"],
    correct_answer: 2,
    explanation: "NMP (August 2021): Rs 6 lakh crore worth of brownfield infrastructure assets to be monetized over 4 years (FY2022-25). Assets: NHAI roads, railway stations, airports, power lines, gas pipelines, telecom towers. NITI Aayog designed it.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","banking"]
  },
  {
    question_text: "The first Indian bank to be established (1806) was:",
    options: ["Punjab National Bank","Imperial Bank of India","Bank of Calcutta (later Bank of Bengal)","Allahabad Bank"],
    correct_answer: 2,
    explanation: "Bank of Calcutta (1806) → renamed Bank of Bengal. Three Presidency Banks (Bengal 1806, Bombay 1840, Madras 1843) merged in 1921 to form Imperial Bank of India, which became State Bank of India in 1955.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc","banking"]
  },
  {
    question_text: "The Index of Industrial Production (IIP) uses which base year and is published by:",
    options: ["2004-05, Ministry of Commerce","2011-12, National Statistical Office (NSO)","2011-12, Ministry of Commerce","2004-05, NSO"],
    correct_answer: 1,
    explanation: "IIP: base year 2011-12 (revised from 2004-05 in 2017). Published monthly by NSO (National Statistical Office) under MoSPI. Measures growth in industry: Mining (14.4%), Manufacturing (77.6%), Electricity (8%).",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "India's longest Five Year Plan period — which plan ran for 7 years?",
    options: ["7th Five Year Plan","5th Five Year Plan","3rd Five Year Plan","Annual Plans (1966-69) filled the gap after 3rd FYP"],
    correct_answer: 3,
    explanation: "3rd FYP (1961-66) was followed by Annual Plans (1966-69) — a 'plan holiday' due to 1965 Indo-Pak War and drought. Then 5th FYP (1974-78) was terminated early by Janata government (1978). 6th FYP: two versions!",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The New Development Bank (NDB), also called BRICS Bank, is headquartered in:",
    options: ["Beijing, China","Moscow, Russia","New Delhi, India","Shanghai, China"],
    correct_answer: 3,
    explanation: "NDB (established 2015, Fortaleza Declaration 2014): headquarters in Shanghai, China. President from India initially (K.V. Kamath). Capital $50 billion. Funds infrastructure and sustainable development in member and non-member countries.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "India's Consumer Price Index (CPI) gives the highest weight to which category?",
    options: ["Housing","Miscellaneous","Food and beverages","Fuel and light"],
    correct_answer: 2,
    explanation: "CPI (Combined, Base 2012): Food and beverages have the highest weight ~45.86% (rural ~54.18%, urban ~36.29%). Housing: ~10.07% (urban only in combined). This high food weight makes India's CPI sensitive to food inflation.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc","banking"]
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
