require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const BASE  = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
const KEY   = 'quiz:subject:economics';
const HDR   = { Authorization:`Bearer ${TOKEN}`, 'Content-Type':'application/json' };

const questions = [
  // --- International Trade Theory ---
  {
    question_text: "Who introduced the concept of Absolute Advantage in international trade?",
    options: ["David Ricardo","Adam Smith","John Stuart Mill","Alfred Marshall"],
    correct_answer: 1,
    explanation: "Adam Smith in 'The Wealth of Nations' (1776) introduced Absolute Advantage — a country should export goods it can produce more efficiently (absolutely) than others.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The Heckscher-Ohlin theorem states that a country will export goods that are intensive in its:",
    options: ["Scarce factor of production","Abundant factor of production","Advanced technology","Cheapest imports"],
    correct_answer: 1,
    explanation: "The H-O theorem: a country exports goods that intensively use its abundant factors. E.g., labour-abundant India exports labour-intensive goods.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Leontief Paradox showed that the USA, a capital-abundant nation, exported:",
    options: ["Capital-intensive goods","Labour-intensive goods","Technology-intensive goods","Agricultural goods"],
    correct_answer: 1,
    explanation: "Wassily Leontief (1953) found the USA paradoxically exported labour-intensive goods, contradicting the H-O theorem. This is called the Leontief Paradox.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Currency depreciation differs from devaluation in that depreciation is:",
    options: ["Government-decreed reduction in exchange rate","Market-driven fall in currency value","IMF-mandated adjustment","Fixed exchange rate change"],
    correct_answer: 1,
    explanation: "Depreciation = market-driven fall in currency value (floating exchange rates). Devaluation = government-decreed reduction under fixed/pegged exchange rate system.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "Which component of Balance of Payments records foreign direct investment and portfolio investment?",
    options: ["Current Account","Capital Account","Financial Account","Trade Account"],
    correct_answer: 2,
    explanation: "The Financial Account records FDI, FPI (portfolio investment), and other investment flows. The Capital Account records capital transfers and non-produced assets.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "Purchasing Power Parity (PPP) theory suggests that exchange rates should equalize:",
    options: ["Interest rates across countries","Wage rates across countries","Price levels across countries","Inflation rates across countries"],
    correct_answer: 2,
    explanation: "PPP: exchange rates adjust so that identical goods cost the same across countries. The 'Big Mac Index' by The Economist is a popular PPP measure.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The current account of Balance of Payments includes all EXCEPT:",
    options: ["Merchandise trade","Services trade","Income (salaries/dividends)","Foreign Direct Investment"],
    correct_answer: 3,
    explanation: "FDI belongs to the Financial Account. The Current Account covers: (1) merchandise trade, (2) services, (3) primary income (wages/investment income), (4) secondary income (remittances).",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  // --- Public Finance ---
  {
    question_text: "The Consolidated Fund of India is governed by which Article of the Constitution?",
    options: ["Article 265","Article 266","Article 267","Article 280"],
    correct_answer: 1,
    explanation: "Article 266 establishes the Consolidated Fund of India. All revenues, loans raised, and loan repayments received by the Government of India go into this fund.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Contingency Fund of India is kept at the disposal of:",
    options: ["Parliament","Finance Commission","Prime Minister","President of India"],
    correct_answer: 3,
    explanation: "The Contingency Fund of India (Article 267) is at the President's disposal for urgent unforeseen expenditures. Its size is Rs 500 crore; Parliament must ratify later.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "A tax where the rate increases as the taxable amount increases is called:",
    options: ["Regressive tax","Proportional tax","Progressive tax","Flat tax"],
    correct_answer: 2,
    explanation: "Progressive tax: higher income → higher tax rate. India's personal income tax uses progressive slabs. Regressive taxes (like indirect taxes) burden lower incomes more.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc","banking"]
  },
  {
    question_text: "Tax incidence refers to:",
    options: ["The tax rate applied","Who legally pays the tax","Who ultimately bears the economic burden of the tax","The amount of tax collected"],
    correct_answer: 2,
    explanation: "Tax incidence = who ultimately bears the tax burden after shifting. Legal incidence (statutory) differs from economic incidence. E.g., GST is legally on seller but shifted to consumer.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Revenue expenditure in the Union Budget is different from Capital expenditure because it:",
    options: ["Creates long-term assets","Does not create assets; is recurring in nature","Is financed by borrowings only","Is not approved by Parliament"],
    correct_answer: 1,
    explanation: "Revenue expenditure: recurring, does not create assets (salaries, subsidies, interest payments). Capital expenditure: creates assets or reduces liabilities (infrastructure, PSU equity).",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc","banking"]
  },
  {
    question_text: "The Public Account of India is used for transactions where the government acts as:",
    options: ["A borrower from RBI","A banker/trustee for funds not belonging to it","A lender to states","A guarantor for PSU bonds"],
    correct_answer: 1,
    explanation: "Public Account (Article 266(2)): government acts as banker — Provident Funds, small savings, deposits. These are liabilities; Parliament's approval not needed for withdrawals.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Primary deficit is defined as:",
    options: ["Fiscal deficit minus revenue deficit","Fiscal deficit minus interest payments","Revenue deficit minus capital receipts","Total expenditure minus revenue receipts"],
    correct_answer: 1,
    explanation: "Primary Deficit = Fiscal Deficit − Interest Payments. It shows deficit excluding past borrowing costs, indicating current policy's fiscal gap.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","banking"]
  },
  {
    question_text: "The Pigouvian tax is designed to correct:",
    options: ["Income inequality","Negative externalities (social costs)","Public goods under-provision","Natural monopolies"],
    correct_answer: 1,
    explanation: "Pigouvian tax (A.C. Pigou): tax equal to marginal external cost to correct negative externalities (pollution). Makes private cost = social cost. Carbon tax is a Pigouvian tax.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // --- Money Supply & Banking ---
  {
    question_text: "Which money supply measure in India includes Currency with Public + Demand Deposits + Other Deposits with RBI?",
    options: ["M0","M1","M2","M3"],
    correct_answer: 1,
    explanation: "M1 = Currency with public + Demand deposits with banks + Other deposits with RBI. M0 = Reserve Money (monetary base). M3 = Broad Money (M1 + time deposits).",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","banking"]
  },
  {
    question_text: "Reserve Money (M0) is also called:",
    options: ["Narrow Money","Broad Money","High-Powered Money","Near Money"],
    correct_answer: 2,
    explanation: "M0 or Reserve Money = Currency in Circulation + Banker's Deposits with RBI + Other deposits with RBI. Called 'High-Powered Money' as it creates credit through the multiplier.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","banking"]
  },
  {
    question_text: "The credit multiplier (money multiplier) is the reciprocal of:",
    options: ["Repo Rate","Cash Reserve Ratio (CRR)","Statutory Liquidity Ratio","Bank Rate"],
    correct_answer: 1,
    explanation: "Credit Multiplier = 1/CRR. If CRR = 4%, multiplier = 25. Every Rs 1 of base money creates Rs 25 of deposits. Higher CRR → lower multiplier → less credit creation.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","banking"]
  },
  {
    question_text: "Quantitative Easing (QE) involves a central bank:",
    options: ["Raising interest rates to curb inflation","Buying financial assets to inject liquidity","Selling government securities to absorb liquidity","Increasing CRR to reduce credit"],
    correct_answer: 1,
    explanation: "QE: central bank purchases government bonds/other assets from commercial banks to inject money into the economy, lower long-term rates, and stimulate growth when rates near zero.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","banking"]
  },
  {
    question_text: "Non-Banking Financial Companies (NBFCs) differ from banks primarily because they:",
    options: ["Cannot accept any form of deposits","Do not lend money","Cannot accept demand deposits and are not part of payment/settlement system","Are not regulated by RBI"],
    correct_answer: 2,
    explanation: "NBFCs cannot accept demand deposits (current/savings accounts) and are not part of payment and settlement systems. They lend and invest but with less regulation than banks.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","banking"]
  },
  {
    question_text: "Priority Sector Lending (PSL) requires Indian commercial banks to lend what percentage of ANBC to priority sectors?",
    options: ["25%","30%","40%","50%"],
    correct_answer: 2,
    explanation: "PSL target: 40% of Adjusted Net Bank Credit (ANBC) for domestic scheduled commercial banks. Priority sectors: Agriculture (18%), MSMEs, Education, Housing, Weaker Sections (10%).",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","banking"]
  },
  {
    question_text: "The Capital to Risk-weighted Assets Ratio (CRAR) under Basel III norms requires banks to maintain minimum:",
    options: ["6%","8%","10%","12%"],
    correct_answer: 2,
    explanation: "Basel III: minimum CRAR = 8% + Capital Conservation Buffer 2.5% = 10.5% total. India's RBI requires 9% minimum. CRAR = Total Capital / Risk-Weighted Assets.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc","banking"]
  },
  {
    question_text: "Tier 1 capital of a bank consists of:",
    options: ["Subordinated debt and hybrid instruments","Core equity capital: paid-up equity, retained earnings, disclosed reserves","Revaluation reserves and investment fluctuation reserves","Preference share capital only"],
    correct_answer: 1,
    explanation: "Tier 1 (Core Capital) = Equity share capital + Retained earnings + Disclosed free reserves. It's the highest quality capital. Tier 2 = Supplementary capital (subordinated debt, revaluation reserves).",
    difficulty: "hard",
    exam_types: ["tnpsc","banking"]
  },
  // --- Development Economics ---
  {
    question_text: "W.W. Rostow's 'Stages of Economic Growth' identifies how many stages of development?",
    options: ["3","4","5","6"],
    correct_answer: 2,
    explanation: "Rostow (1960): 5 stages — (1) Traditional Society, (2) Pre-conditions for Take-off, (3) Take-off, (4) Drive to Maturity, (5) Age of High Mass Consumption.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Harrod-Domar model of economic growth emphasizes the role of:",
    options: ["Human capital and education","Savings and investment rate","Natural resources and technology","International trade"],
    correct_answer: 1,
    explanation: "Harrod-Domar: Growth Rate = Savings Rate / Capital-Output Ratio. Higher savings → higher investment → higher growth. Used to justify foreign aid (filling 'savings gap') for developing countries.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Arthur Lewis's Dual Economy model describes development as movement of labour from:",
    options: ["Urban to rural sector","Traditional agricultural to modern industrial sector","Informal to formal economy","Agriculture to services"],
    correct_answer: 1,
    explanation: "Lewis (1954): unlimited labour supply in subsistence agriculture moves to the industrial/modern sector at a subsistence wage, fueling industrial growth until wages equalize.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Human Capital Theory, associated with Gary Becker and Theodore Schultz, argues that:",
    options: ["Physical capital is the only driver of growth","Investment in education and health raises productivity like investment in machines","Natural resources determine development","Trade is the engine of growth"],
    correct_answer: 1,
    explanation: "Human Capital Theory: education, health, training are investments that increase individual productivity and economic growth. Schultz won Nobel 1979; Becker won Nobel 1992.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'Washington Consensus' — a set of economic policy prescriptions — was coined by economist:",
    options: ["Paul Krugman","Joseph Stiglitz","John Williamson","Jeffrey Sachs"],
    correct_answer: 2,
    explanation: "John Williamson (1989) coined 'Washington Consensus' — 10 prescriptions: fiscal discipline, tax reform, trade liberalization, FDI openness, privatization, deregulation. Controversial for developing nations.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // --- Labour Economics ---
  {
    question_text: "Frictional unemployment occurs when:",
    options: ["The economy is in recession","Workers are between jobs or searching for better jobs","Jobs exist but skills don't match","Seasonal work ends"],
    correct_answer: 1,
    explanation: "Frictional unemployment: temporary unemployment while workers transition between jobs or search for better ones. It's natural and exists even in a healthy economy (part of 'natural rate of unemployment').",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "Structural unemployment is caused by:",
    options: ["Economic downturns reducing demand","Seasonal variations in production","Mismatch between workers' skills and available jobs due to technological change","Workers voluntarily changing jobs"],
    correct_answer: 2,
    explanation: "Structural unemployment: skills mismatch due to technology changes, industry shifts, or globalization. Long-term; requires retraining. E.g., manufacturing workers displaced by automation.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The Code on Wages, 2019 subsumes how many existing labour laws?",
    options: ["2","4","8","29"],
    correct_answer: 1,
    explanation: "Code on Wages 2019 subsumes 4 laws: Payment of Wages Act 1936, Minimum Wages Act 1948, Payment of Bonus Act 1965, and Equal Remuneration Act 1976.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Periodic Labour Force Survey (PLFS) in India is conducted by:",
    options: ["NITI Aayog","Ministry of Labour","National Statistical Office (NSO)","NSSO under MOSPI"],
    correct_answer: 2,
    explanation: "PLFS is conducted by NSO (National Statistical Office) under MoSPI. Launched 2017-18, provides quarterly urban + annual rural employment/unemployment estimates.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Labour Force Participation Rate (LFPR) measures:",
    options: ["Percentage of working-age population that is employed","Percentage of population employed in formal sector","Percentage of working-age population that is employed or actively seeking employment","Percentage of population below poverty line"],
    correct_answer: 2,
    explanation: "LFPR = (Labour Force / Working-age Population) × 100. Labour Force = Employed + Unemployed (those seeking jobs). India's female LFPR is among the lowest globally (~25%).",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","banking"]
  },
  // --- Agricultural Economics ---
  {
    question_text: "The Agriculture Produce Market Committee (APMC) Act was designed to:",
    options: ["Export agricultural produce","Protect farmers by regulating markets and preventing exploitation by middlemen","Provide crop insurance","Promote organic farming"],
    correct_answer: 1,
    explanation: "APMC Acts (state subject) created regulated mandis to ensure fair prices for farmers. Critics say they create cartels. The three Farm Acts 2020 (later repealed) aimed to allow sales outside APMCs.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "e-NAM (electronic National Agriculture Market) is a pan-India online trading platform launched in:",
    options: ["2013","2016","2018","2020"],
    correct_answer: 1,
    explanation: "e-NAM launched April 14, 2016 by SFAC (Small Farmers Agribusiness Consortium) under Ministry of Agriculture. Connects APMC mandis online for transparent price discovery.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi) provides annual income support of how much to farmer families?",
    options: ["Rs 4,000","Rs 6,000","Rs 8,000","Rs 10,000"],
    correct_answer: 1,
    explanation: "PM-KISAN (launched December 2018, effective Feb 2019): Rs 6,000 per year in 3 installments of Rs 2,000 directly to farmers' bank accounts (DBT). Covers all landholding farmers.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc","banking"]
  },
  {
    question_text: "The Soil Health Card scheme launched in 2015 aims to:",
    options: ["Subsidize fertilizers","Provide farmers with soil nutrient status and fertilizer recommendations","Promote organic certification","Map agricultural land via satellite"],
    correct_answer: 1,
    explanation: "Soil Health Card: issued every 2 years to farmers; provides information on 12 parameters (N, P, K, pH, micronutrients) with crop-wise recommendations to optimize fertilizer use.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "NABARD's Rural Infrastructure Development Fund (RIDF) provides loans to:",
    options: ["Farmers directly for crop loans","State governments for rural infrastructure projects","Commercial banks for priority sector shortfall","Microfinance institutions"],
    correct_answer: 1,
    explanation: "RIDF: state governments and state-owned corporations borrow from NABARD to build rural infrastructure (roads, bridges, irrigation). Funded by shortfall in banks' PSL targets.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","banking"]
  },
  {
    question_text: "Kisan Credit Card (KCC) scheme provides short-term credit to farmers for:",
    options: ["Land purchase only","Purchase of farm machinery only","Crop cultivation, post-harvest expenses, maintenance, and allied activities","Long-term investment in irrigation"],
    correct_answer: 2,
    explanation: "KCC (1998, NABARD): provides revolving credit for crop cultivation, post-harvest expenses, allied activities (fisheries, animal husbandry since 2018-19), and maintenance needs at subsidized rates.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc","banking"]
  },
  // --- Price Theory ---
  {
    question_text: "Consumer Surplus is the difference between:",
    options: ["Market price and producer cost","What consumers are willing to pay and what they actually pay","Demand price and supply price","Marginal utility and average utility"],
    correct_answer: 1,
    explanation: "Consumer Surplus = Willingness to Pay − Market Price. It represents the benefit consumers gain from buying at the market price, which is lower than their maximum willingness to pay.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc","banking"]
  },
  {
    question_text: "A Giffen good is one where demand increases as price increases because:",
    options: ["It has high brand value (Veblen effect)","It is an inferior good where the income effect dominates the substitution effect","Supply decreases with price","It has no close substitutes"],
    correct_answer: 1,
    explanation: "Giffen goods (Robert Giffen): inferior goods where price rise reduces real income so severely that consumers buy more (cannot afford the superior substitute). Classic example: bread in 19th-century England.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "A Veblen good is characterized by:",
    options: ["Demand increasing as price falls","Demand increasing as price rises due to conspicuous consumption","Perfectly inelastic demand","Zero price elasticity"],
    correct_answer: 1,
    explanation: "Veblen goods (Thorstein Veblen): luxury goods where higher price signals higher status, increasing demand (diamonds, luxury cars, designer goods). Upward-sloping demand curve.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "A price floor is effective (binding) only when it is set:",
    options: ["Below the equilibrium price","At the equilibrium price","Above the equilibrium price","At zero"],
    correct_answer: 2,
    explanation: "Price floor (minimum price) is binding only above equilibrium price, creating a surplus (supply > demand). E.g., MSP set above market price creates surplus procurement. Below equilibrium = non-binding.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "Deadweight loss in economics refers to:",
    options: ["Direct cost of taxes collected","Loss of economic efficiency when equilibrium is not achieved (lost surplus)","Government spending on welfare","Production costs that exceed revenue"],
    correct_answer: 1,
    explanation: "Deadweight loss: reduction in total surplus (consumer + producer) due to market inefficiency caused by taxes, price controls, monopoly, or externalities. Represents foregone transactions.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // --- National Income & GDP ---
  {
    question_text: "The GDP Deflator is used to convert:",
    options: ["Nominal GDP to Real GDP","Real GDP to Nominal GDP","Current prices to base year prices (and vice versa)","Both A and C"],
    correct_answer: 3,
    explanation: "GDP Deflator = (Nominal GDP / Real GDP) × 100. It measures price level change across all goods in GDP (broader than CPI). Used to convert nominal to real GDP: Real GDP = Nominal GDP / Deflator × 100.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","banking"]
  },
  {
    question_text: "Which method of calculating GDP sums up wages, profits, rent, and interest paid in the economy?",
    options: ["Expenditure method","Production/Output method","Income method","Value-added method"],
    correct_answer: 2,
    explanation: "Income Method: GDP = Compensation of Employees + Gross Operating Surplus + Gross Mixed Income + Taxes − Subsidies on production. Sums factor incomes generated in production.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","banking"]
  },
  {
    question_text: "India's base year for National Income calculation was revised in 2015 from 2004-05 to:",
    options: ["2009-10","2010-11","2011-12","2012-13"],
    correct_answer: 2,
    explanation: "In January 2015, CSO (now NSO) revised the base year for GDP calculation to 2011-12 from 2004-05. Also shifted to GDP at market prices from GDP at factor cost as primary aggregate.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "Transfer payments like pensions, scholarships, and unemployment benefits are NOT included in GDP because:",
    options: ["They are too small to measure","They do not represent production of goods or services","They are paid by the government","They are in foreign currency"],
    correct_answer: 1,
    explanation: "GDP measures only final goods and services produced. Transfer payments redistribute existing income without corresponding production, so including them would double-count economic activity.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc","banking"]
  },
  // --- Indian Economic History ---
  {
    question_text: "Dadabhai Naoroji's 'Drain Theory' argued that British rule caused economic drain through:",
    options: ["Cultural imperialism","Forced export of raw materials and remittance of profits/salaries to Britain without equivalent return","Military conquest","Religious conversion"],
    correct_answer: 1,
    explanation: "Naoroji (1867): calculated India's 'drain' — export surplus not returned as imports but as remittances to Britain (Home Charges, profit repatriation). Estimated drain as ~£15-30 million/year.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Bombay Plan (1944) was drafted by Indian industrialists including Tata and Birla, proposing:",
    options: ["Free market economy with no government intervention","Central planning with significant state investment in industry","Complete nationalization of all industries","Agricultural-led growth model"],
    correct_answer: 1,
    explanation: "Bombay Plan: 8 industrialists (JRD Tata, GD Birla, etc.) proposed a 15-year plan with heavy state investment in infrastructure and industry, import substitution, and mixed economy framework.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's Industrial Policy Resolution of 1956 classified industries into schedules. Schedule A industries were exclusively reserved for:",
    options: ["Private sector","Public sector (State)","Cooperative sector","Joint sector"],
    correct_answer: 1,
    explanation: "IPR 1956: Schedule A (17 industries) — exclusive State domain (arms, atomic energy, railways, coal, steel). Schedule B — State to establish, private allowed. Schedule C — private sector.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // --- Social & Welfare Schemes ---
  {
    question_text: "POSHAN 2.0 (2021) merged which earlier schemes?",
    options: ["ICDS and MGNREGA","POSHAN Abhiyaan and Supplementary Nutrition Programme and other nutrition schemes","NHM and ICDS","Anganwadi and PM POSHAN"],
    correct_answer: 1,
    explanation: "POSHAN 2.0: merged POSHAN Abhiyaan, ICDS (Supplementary Nutrition), National Creche Scheme, Kishori Shakti Yojana into an integrated nutrition support programme under Mission Saksham Anganwadi.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "PM CARES Fund (Prime Minister's Citizen Assistance and Relief in Emergency Situations Fund) was established in:",
    options: ["January 2020","March 2020","June 2020","December 2019"],
    correct_answer: 1,
    explanation: "PM CARES Fund was established on March 28, 2020 to deal with COVID-19 pandemic. It is a public charitable trust; donations are tax-exempt under 80G. Separate from PM National Relief Fund.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "PM POSHAN scheme (renamed from Mid-Day Meal in 2021) covers students up to:",
    options: ["Class V","Class VIII","Class X","Class XII"],
    correct_answer: 1,
    explanation: "PM POSHAN: covers students from pre-primary (Balvatika) to Class VIII in government and government-aided schools. ~11.8 crore students across ~11.2 lakh schools.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "Pradhan Mantri Kaushal Vikas Yojana (PMKVY) is the flagship scheme for:",
    options: ["Agricultural skilling","Short-term skill training and certification for youth","Entrepreneurship development for women","Digital literacy in rural areas"],
    correct_answer: 1,
    explanation: "PMKVY (2015): short-term skill training by NSDC through Training Partners. Provides free training, assessment, certification, and monetary reward. Target: skill 1 crore people.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc","banking"]
  },
  // --- Infrastructure ---
  {
    question_text: "The Sagarmala Programme focuses on:",
    options: ["Inland waterways development","Port-led development, coastal shipping, port connectivity","Deep-sea fishing modernization","Naval defence infrastructure"],
    correct_answer: 1,
    explanation: "Sagarmala Programme (2015, Ministry of Ports): port modernization, port connectivity, port-led industrialization, and coastal community development. Aims to reduce logistics costs via coastal shipping.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "Bharatmala Pariyojana Phase-I focuses on development of:",
    options: ["Rural roads connecting villages","National highways including ring roads, expressways, economic corridors","Coastal highways only","Border roads in strategic areas"],
    correct_answer: 1,
    explanation: "Bharatmala Phase-I: 34,800 km of national highways including Economic Corridors, Inter Corridors, Ring Roads, National Corridor Efficiency Improvements. Outlay ~Rs 5.35 lakh crore.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The Delhi-Mumbai Industrial Corridor (DMIC) is a joint initiative with which country?",
    options: ["USA","China","Japan","Germany"],
    correct_answer: 2,
    explanation: "DMIC: India-Japan joint project along the 1,483-km Western Dedicated Freight Corridor. 24 manufacturing cities/nodes planned across 6 states. Japan invested in DMIC Development Corporation.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The Dedicated Freight Corridors (Eastern and Western) in India are primarily meant for:",
    options: ["High-speed passenger trains","Freight trains to free up existing rail lines for faster passenger services","Bullet trains","Export goods only"],
    correct_answer: 1,
    explanation: "DFCs: separate tracks exclusively for freight trains (2×25 kV electrification, 25 tonne axle load, 100 km/h speed). Free up existing trunk routes for faster passenger trains. DFCCIL implements them.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  // --- Environment Economics ---
  {
    question_text: "Carbon credits are tradable certificates representing:",
    options: ["1 tonne of carbon dioxide emitted","Permission to emit 1 tonne of CO2 equivalent","1 tonne of CO2 emission reduction","Carbon tax paid"],
    correct_answer: 2,
    explanation: "Carbon credit: 1 credit = right to emit 1 tonne CO2 equivalent. Companies that reduce emissions below cap earn credits to sell. Cap-and-trade system. Kyoto Protocol established CDM for developing nations.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "Green GDP adjusts conventional GDP by:",
    options: ["Adding agricultural output only","Subtracting environmental degradation and depletion of natural resources","Adding social welfare spending","Excluding defence expenditure"],
    correct_answer: 1,
    explanation: "Green GDP = GDP − Cost of environmental degradation (pollution, resource depletion, ecosystem services lost). Attempts to measure sustainable economic progress. India's SEEA (System of Environmental-Economic Accounting).",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Paris Agreement (2015) aims to limit global temperature increase to:",
    options: ["1°C above pre-industrial levels","Well below 2°C, pursuing 1.5°C above pre-industrial levels","3°C above pre-industrial levels","2.5°C above pre-industrial levels"],
    correct_answer: 1,
    explanation: "Paris Agreement (COP21, December 2015): hold global temperature to well below 2°C above pre-industrial levels, pursuing 1.5°C. NDCs (Nationally Determined Contributions) by each country.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  // --- Financial Markets ---
  {
    question_text: "A futures contract obligates the buyer to purchase an asset at:",
    options: ["Market price on the day of trading","A predetermined price on a specified future date","The lowest price in the contract period","A floating price determined at settlement"],
    correct_answer: 1,
    explanation: "Futures contract: standardized, exchange-traded obligation to buy/sell an asset at a set price on a specified future date. Both buyer and seller are obligated (unlike options, where buyer has the right).",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","banking"]
  },
  {
    question_text: "Treasury Bills (T-Bills) in India are short-term government securities issued for maturities of:",
    options: ["7 days and 14 days only","91 days, 182 days, and 364 days","1 year to 5 years","6 months and 1 year"],
    correct_answer: 1,
    explanation: "T-Bills: zero-coupon short-term instruments. India has 3 types: 91-day, 182-day, 364-day T-Bills. Issued at discount, redeemed at face value. Used for short-term government cash management.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","banking"]
  },
  {
    question_text: "In India, the secondary market for government securities is regulated by:",
    options: ["SEBI","Ministry of Finance","RBI","NSE/BSE"],
    correct_answer: 2,
    explanation: "RBI regulates the Government Securities (G-Sec) market. G-Secs trade on NDS-OM (Negotiated Dealing System – Order Matching) platform operated by RBI. SEBI regulates corporate bonds.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","banking"]
  },
  // --- RBI Functions ---
  {
    question_text: "RBI acts as the 'Lender of Last Resort' which means:",
    options: ["It lends to the government only","It provides emergency liquidity to banks facing temporary shortages to prevent systemic collapse","It is the last bank to make profits","It lends to countries in balance of payments crisis"],
    correct_answer: 1,
    explanation: "Lender of Last Resort: RBI provides emergency credit to solvent but illiquid banks to prevent bank runs and financial crises. This function was conceptualized by Walter Bagehot (1873).",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","banking"]
  },
  {
    question_text: "The RBI was nationalized (transferred to Government of India ownership) in:",
    options: ["1935","1947","1949","1956"],
    correct_answer: 2,
    explanation: "RBI was established on April 1, 1935 (as a private shareholders' bank). It was nationalized on January 1, 1949 under the RBI (Transfer of Public Ownership) Act, 1948.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc","banking"]
  },
  {
    question_text: "Which RBI instrument provides short-term liquidity adjustment, where banks park excess funds with RBI overnight?",
    options: ["Repo Rate","Reverse Repo Rate","Bank Rate","MSF Rate"],
    correct_answer: 1,
    explanation: "Reverse Repo: banks park excess funds with RBI overnight and earn interest (currently Repo − 25 bps = SDF rate). Repo: banks borrow from RBI against G-Secs. Together they form the LAF corridor.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","banking"]
  },
  {
    question_text: "Standing Deposit Facility (SDF) introduced by RBI in April 2022 replaced:",
    options: ["Repo Rate","Reverse Repo Rate as the floor of LAF corridor","Bank Rate","CRR"],
    correct_answer: 1,
    explanation: "SDF (April 8, 2022): banks park excess liquidity with RBI without collateral, earning interest. Replaced Reverse Repo as LAF corridor floor. SDF rate = Repo − 25 bps. MSF = Repo + 25 bps (ceiling).",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc","banking"]
  },
  // --- Economic Indicators ---
  {
    question_text: "The Global Innovation Index (GII) is published jointly by:",
    options: ["World Bank and IMF","WIPO, INSEAD, and Cornell University","UNDP and OECD","WEF and World Bank"],
    correct_answer: 1,
    explanation: "GII published by WIPO (World Intellectual Property Organization), INSEAD, and Cornell University. Ranks economies on innovation inputs and outputs. India has improved significantly (from rank 81 in 2015 to 39 in 2023).",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The Ease of Doing Business (EoDB) Index was published by the World Bank under which report?",
    options: ["World Development Report","Doing Business Report","Global Competitiveness Report","Human Development Report"],
    correct_answer: 1,
    explanation: "World Bank's 'Doing Business Report' published EoDB rankings from 2003 to 2021 (discontinued). India improved from rank 142 (2014) to 63 (2019). Report discontinued after data integrity concerns.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "EASE (Enhanced Access and Service Excellence) Index is related to which sector?",
    options: ["Agriculture banking","Public Sector Banks' performance reforms","MSE sector growth","Digital payment ecosystem"],
    correct_answer: 1,
    explanation: "EASE Index: annual banking reforms index for Public Sector Banks by Indian Banks' Association and Boston Consulting Group. Tracks PSB performance on customer service, credit, governance, fintech.",
    difficulty: "hard",
    exam_types: ["tnpsc","banking"]
  },
  {
    question_text: "India's Logistics Performance Index (LPI) rank has been improving. The LPI is published by the:",
    options: ["Ministry of Commerce","Asian Development Bank","World Bank","WEF"],
    correct_answer: 2,
    explanation: "Logistics Performance Index: World Bank biennial survey. Ranks countries on customs efficiency, infrastructure, international shipments, logistics competence, tracking, timeliness. India ranked 38 in 2023.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  // --- Tamil Nadu Economy ---
  {
    question_text: "TIDCO (Tamil Nadu Industrial Development Corporation) was established in:",
    options: ["1958","1965","1972","1985"],
    correct_answer: 1,
    explanation: "TIDCO established in 1965 as a state-level industrial development corporation. Promotes large and medium industries in Tamil Nadu through equity participation, investment promotion, and infrastructure.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "Tamil Nadu's SIPCOT (State Industries Promotion Corporation of Tamil Nadu) primarily promotes:",
    options: ["Agriculture processing industries","Micro and small industries","Medium and large industries by developing industrial parks and SEZs","Cottage industries"],
    correct_answer: 2,
    explanation: "SIPCOT (1971): develops industrial parks, estates, and SEZs for medium/large industries in Tamil Nadu. Has 60+ industrial parks. SIDCO (1970) handles small industries.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "Tirupur, known as the 'Knitwear Capital of India', exports what percentage of India's total knitwear exports?",
    options: ["About 20%","About 50%","About 80%","About 35%"],
    correct_answer: 2,
    explanation: "Tirupur (Tiruppur): accounts for ~50% of India's total knitwear exports. Known as 'Dollar City' (exports ~Rs 35,000 crore annually). Major products: T-shirts, vests, socks exported to EU/USA.",
    difficulty: "hard",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The TANGEDCO (Tamil Nadu Generation and Distribution Corporation) was formed by bifurcating which earlier entity?",
    options: ["TNEB (Tamil Nadu Electricity Board)","TIDCO","TWAD","TANFEED"],
    correct_answer: 0,
    explanation: "TNEB was bifurcated in 2010 into TANGEDCO (generation and distribution) and TANTRANSCO (transmission). This complied with the Electricity Act 2003 requirement to unbundle electricity utilities.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "Tamil Nadu's 'Vision Tamil Nadu 2023' document set a target of making Tamil Nadu:",
    options: ["The richest state in India","A $1 trillion economy","Carbon neutral by 2030","India's manufacturing hub"],
    correct_answer: 1,
    explanation: "Tamil Nadu Vision 2023: target to become a $1 trillion economy. TN is among India's top 3 economies (after Maharashtra and UP in GDP terms, or top 2-3 depending on year). GDP ~Rs 27 lakh crore (2023-24).",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  // --- Economic Policies ---
  {
    question_text: "The Insolvency and Bankruptcy Code (IBC) 2016 established the National Company Law Tribunal (NCLT) as the:",
    options: ["Appellate authority","Adjudicating authority for corporate insolvency resolution","Liquidating agency","Regulator of insolvency professionals"],
    correct_answer: 1,
    explanation: "IBC 2016: NCLT is the adjudicating authority for corporate insolvency (companies). NCLT approves resolution plan. DRT (Debt Recovery Tribunal) handles individual/partnership insolvency. IBBI is the regulator.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","banking"]
  },
  {
    question_text: "The One District One Product (ODOP) initiative under Aatmanirbhar Bharat promotes:",
    options: ["Agricultural products from one district per state","Local products, crafts, and industries that each district is known for","One factory per district","Uniform product standards across districts"],
    correct_answer: 1,
    explanation: "ODOP: each district identifies a signature product (handicraft, GI-tagged item, agricultural produce) for promotion, branding, and export. Started in UP (2018), scaled nationally under Aatmanirbhar Bharat.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The Production Linked Incentive (PLI) scheme provides incentive as a percentage of:",
    options: ["Fixed capital investment","Incremental sales over a base year","Employment generated","Export value"],
    correct_answer: 1,
    explanation: "PLI: companies receive incentive (4-20% depending on sector) on incremental sales above their base year (2019-20). Covers 14 sectors. Aims to attract investment, enhance manufacturing, and boost exports.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc","banking"]
  },
  {
    question_text: "India's Foreign Trade Policy 2023-28 sets a target for merchandise and services exports by 2030 of:",
    options: ["$1 trillion merchandise + $1 trillion services","$2 trillion merchandise + $1 trillion services","$1 trillion total exports","$2 trillion total exports"],
    correct_answer: 1,
    explanation: "FTP 2023-28 (effective April 1, 2023): target $2 trillion merchandise + $1 trillion services exports by 2030 = $3 trillion total. Key focus: e-commerce exports, ease of doing business, districts as export hubs.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The Atmanirbhar Bharat Abhiyan package announced in May 2020 was worth approximately:",
    options: ["Rs 5 lakh crore","Rs 10 lakh crore","Rs 20 lakh crore","Rs 50 lakh crore"],
    correct_answer: 2,
    explanation: "Aatmanirbhar Bharat: Rs 20 lakh crore package (~10% of GDP) announced in 5 tranches by Finance Minister in May 2020. Covered MSMEs, agriculture, migrant workers, education, health, structural reforms.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc","banking"]
  },
  // --- Microeconomics Theory ---
  {
    question_text: "The concept of 'Invisible Hand' introduced by Adam Smith suggests that:",
    options: ["Government should control prices","Individual self-interest in free markets leads to efficient resource allocation for society","Monopolies are beneficial","International trade should be restricted"],
    correct_answer: 1,
    explanation: "Adam Smith's 'Invisible Hand' (Wealth of Nations, 1776): individuals pursuing their own interest in free markets unintentionally promote society's economic well-being. Foundation of laissez-faire capitalism.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc","banking"]
  },
  {
    question_text: "Economies of Scale occur when:",
    options: ["Per unit cost increases as production increases","Per unit cost decreases as production increases","Revenue increases proportionally with output","Only in manufacturing sector"],
    correct_answer: 1,
    explanation: "Economies of Scale: long-run average cost falls as output increases. Reasons: specialization, indivisibilities, financial economies, bulk purchasing. Diseconomies of scale: cost rises with scale (management issues).",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc","banking"]
  },
  {
    question_text: "Monopsony refers to a market where there is:",
    options: ["A single seller","A single buyer","Two sellers","Two buyers"],
    correct_answer: 1,
    explanation: "Monopsony = single buyer with market power over sellers (opposite of monopoly). E.g., single employer in a company town (wage setting below competitive level). Labour market monopsonies are common.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Nash Equilibrium (game theory) is a situation where:",
    options: ["Both players cooperate to maximize joint outcome","No player can benefit by changing strategy given the other player's strategy","The government intervenes to set prices","One player dominates the market"],
    correct_answer: 1,
    explanation: "Nash Equilibrium (John Nash, Nobel 1994): each player's strategy is the best response to others' strategies — no one has incentive to deviate. Prisoner's Dilemma is the classic example.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // --- Social Sector ---
  {
    question_text: "The ASHA (Accredited Social Health Activist) programme was launched under which mission?",
    options: ["ICDS","National Health Mission (NHM)","Ayushman Bharat","National Rural Livelihood Mission"],
    correct_answer: 1,
    explanation: "ASHA workers: introduced under National Rural Health Mission (NRHM, 2005) — now NHM. ~10 lakh ASHAs serve as community health workers, linking villages to the healthcare system.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "Ayushman Bharat PM-JAY (Jan Arogya Yojana) provides health cover of how much per family per year?",
    options: ["Rs 1 lakh","Rs 3 lakh","Rs 5 lakh","Rs 10 lakh"],
    correct_answer: 2,
    explanation: "PM-JAY (launched September 23, 2018): Rs 5 lakh per family per year for secondary and tertiary care hospitalization. World's largest government health insurance scheme. ~55 crore beneficiaries (50 crore poor).",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc","banking"]
  },
  {
    question_text: "The Swachh Bharat Mission (Urban) 2.0 focuses on:",
    options: ["Rural toilet construction","Making cities garbage-free with waste management, wastewater treatment","Open defecation free status only","Digital waste reporting"],
    correct_answer: 1,
    explanation: "SBM-Urban 2.0 (launched October 1, 2021): garbage-free cities, waste management (dry/wet/hazardous segregation), used water management (UWM), remediation of legacy dump sites. SBM-U 1.0 focused on ODF.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  // --- Miscellaneous Economics ---
  {
    question_text: "Special Drawing Rights (SDRs) are:",
    options: ["Physical gold reserves with IMF","IMF's international reserve asset and unit of account; a basket of 5 currencies","World Bank loans to developing nations","WTO trade credits"],
    correct_answer: 1,
    explanation: "SDR: IMF reserve asset created in 1969. Based on basket of 5 currencies: USD (43.38%), EUR (29.31%), CNY (12.28%), JPY (7.59%), GBP (7.44%). 1 SDR ≈ $1.33. Allocated to member countries.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","banking"]
  },
  {
    question_text: "The Feldstein-Horioka Puzzle refers to the high correlation between:",
    options: ["Fiscal deficit and inflation","Domestic savings and domestic investment (implying limited capital mobility globally)","GDP growth and employment","Trade deficit and currency depreciation"],
    correct_answer: 1,
    explanation: "Feldstein-Horioka (1980): if capital is globally mobile, domestic savings should flow worldwide seeking highest returns, disconnecting national savings from national investment. But they found high correlation — a 'puzzle.'",
    difficulty: "hard",
    exam_types: ["upsc"]
  },
  {
    question_text: "Crowdfunding is regulated in India by:",
    options: ["RBI only","SEBI for securities-based crowdfunding, RBI for lending-based","Ministry of Finance","NABARD"],
    correct_answer: 1,
    explanation: "SEBI regulates equity/securities-based crowdfunding. RBI regulates peer-to-peer (P2P) lending (a form of crowdfunding) through NBFC-P2P guidelines (2017). Donation/reward crowdfunding largely unregulated.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc","banking"]
  },
  {
    question_text: "The term 'Stagflation' was coined during which decade and event?",
    options: ["1930s Great Depression","1950s post-war boom","1970s OPEC oil crisis","1990s dot-com bust"],
    correct_answer: 2,
    explanation: "Stagflation = stagnation + inflation. Coined by UK politician Iain Macleod in 1965, but the phenomenon prominently occurred in the 1970s OPEC oil crises (1973, 1979). Contradicted the Phillips Curve.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "India's GIFT City (Gujarat International Finance Tec-City) hosts India's first:",
    options: ["Stock exchange for foreign companies","International Financial Services Centre (IFSC)","Cryptocurrency exchange","Commodity futures exchange"],
    correct_answer: 1,
    explanation: "GIFT City (Gandhinagar, Gujarat): India's first IFSC operational since 2015. Houses NSE IFSC, BSE IFSC, India INX. Special regulations: USD transactions, foreign currency products. IFSCA regulates it.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","banking"]
  },
  {
    question_text: "The Insolvency and Bankruptcy Board of India (IBBI) was established in:",
    options: ["2014","2016","2018","2019"],
    correct_answer: 1,
    explanation: "IBBI: established October 1, 2016 under IBC 2016. Regulates insolvency professionals, insolvency professional agencies, information utilities. Its establishment was key to operationalizing IBC.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","banking"]
  },
  {
    question_text: "India's current account surplus in 2020-21 (the only surplus in recent years) was primarily due to:",
    options: ["Record merchandise exports","Collapse of imports (crude oil, gold) due to COVID lockdowns and low oil prices","Surge in remittances","Increase in software exports"],
    correct_answer: 1,
    explanation: "India's CA surplus (0.9% of GDP) in 2020-21: COVID lockdowns drastically reduced crude oil and gold imports (major CA deficit drivers). Software exports remained stable. This surplus was exceptional.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","banking"]
  },
  {
    question_text: "The Market Stabilization Scheme (MSS) allows RBI to issue government securities to:",
    options: ["Finance the fiscal deficit","Absorb excess liquidity from large capital inflows","Provide long-term credit to banks","Fund infrastructure projects"],
    correct_answer: 1,
    explanation: "MSS (2004): RBI issues T-Bills/dated securities to mop up excess liquidity from large capital inflows. Proceeds held in separate MSS account with RBI (not used for government expenditure). Sterilization tool.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc","banking"]
  },
  {
    question_text: "Financial Stability and Development Council (FSDC) is chaired by:",
    options: ["RBI Governor","Finance Minister","Prime Minister","SEBI Chairman"],
    correct_answer: 1,
    explanation: "FSDC (2010): apex body for financial stability, inter-regulatory coordination, and financial sector development. Chaired by Finance Minister. Members: heads of RBI, SEBI, IRDA, PFRDA, IBBI, FMC, DEA.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","banking"]
  },
  {
    question_text: "The concept of 'Animal Spirits' in economics, referring to psychological factors driving investment decisions, was introduced by:",
    options: ["Milton Friedman","Joseph Schumpeter","John Maynard Keynes","Paul Samuelson"],
    correct_answer: 2,
    explanation: "Keynes (General Theory, 1936): 'Animal Spirits' = spontaneous optimism or pessimism driving business investment decisions beyond rational calculation. Akerlof & Shiller revived concept in their 2009 book.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Goods and Services Tax (GST) in India has how many tax rate slabs?",
    options: ["3 slabs (5%, 12%, 18%)","4 slabs (5%, 12%, 18%, 28%) + 0% exempt","5 slabs (0%, 5%, 12%, 18%, 28%)","2 slabs (12% and 28%)"],
    correct_answer: 3,
    explanation: "GST has 4 slabs: 5%, 12%, 18%, 28% + 0% for exempt goods. Special rates for gold (3%), diamonds (0.25%). Cess on top of 28% for luxury/sin goods (cars, tobacco, aerated drinks). 101st Constitutional Amendment.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc","banking"]
  },
  {
    question_text: "The Marginal Standing Facility (MSF) rate is always:",
    options: ["Equal to Repo rate","25 basis points above the Repo rate","25 basis points below the Repo rate","Equal to Bank Rate"],
    correct_answer: 1,
    explanation: "MSF = Repo + 25 bps (ceiling of LAF corridor). Banks borrow overnight from RBI against their own SLR securities (up to 1% of NDTL). MSF = Bank Rate. SDF = Repo − 25 bps (floor). Repo = 6.5% → MSF = 6.75%.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","banking"]
  },
  {
    question_text: "What is the primary objective of the Competition Commission of India (CCI)?",
    options: ["Regulating foreign investment","Preventing anti-competitive practices and promoting market competition","Setting prices for essential commodities","Regulating stock markets"],
    correct_answer: 1,
    explanation: "CCI (est. 2003, operational 2009): statutory body under Competition Act 2002. Prevents anti-competitive agreements, abuses of dominant position, and regulates mergers/acquisitions to protect consumer interest.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc","banking"]
  },
  {
    question_text: "India's National Investment and Infrastructure Fund (NIIF) was established to:",
    options: ["Provide subsidies to farmers","Attract long-term domestic and foreign capital for infrastructure","Regulate FDI in India","Manage India's foreign exchange reserves"],
    correct_answer: 1,
    explanation: "NIIF (2015): quasi-sovereign wealth fund. Master Fund, Fund of Funds, and Strategic Opportunities Fund. Invests in infrastructure (roads, ports, airports, energy). Government owns 49%, rest from global investors.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","banking"]
  },
  {
    question_text: "The concept of 'Inclusive Growth' as India's official growth strategy was emphasized prominently in which Five Year Plan?",
    options: ["9th Five Year Plan","10th Five Year Plan","11th Five Year Plan","12th Five Year Plan"],
    correct_answer: 2,
    explanation: "11th Five Year Plan (2007-12): 'Towards Faster and More Inclusive Growth' was its theme. Included social sector targets: education, health, women empowerment, infrastructure alongside GDP growth.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Who is known as the 'Father of Indian Economic Planning'?",
    options: ["Jawaharlal Nehru","P.C. Mahalanobis","Manmohan Singh","V.K.R.V. Rao"],
    correct_answer: 1,
    explanation: "P.C. Mahalanobis (1893-1972): statistician and planner, architect of India's second Five Year Plan (1956-61). Founder of ISI (Indian Statistical Institute). His 'two-sector' model emphasized heavy industry.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The Goods and Services Tax Network (GSTN) is a:",
    options: ["Government department under Ministry of Finance","Non-government, not-for-profit private company providing IT backbone for GST","RBI subsidiary for tax processing","SEBI-regulated financial infrastructure company"],
    correct_answer: 1,
    explanation: "GSTN: non-government, not-for-profit company (Section 8). Provides IT infrastructure for GST registration, return filing, and tax payment. Government holds 50% (Centre 24.5% + States 24.5%), rest by PSBs/financial institutions.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","banking"]
  },
  {
    question_text: "The term 'Dutch Disease' in economics refers to:",
    options: ["Economic downturn caused by flood/natural disaster","Decline in manufacturing sector caused by a large discovery/boom in natural resources (e.g., oil)","High inflation in a welfare state","Economic recession caused by high wages"],
    correct_answer: 1,
    explanation: "Dutch Disease: named after Netherlands' 1960s natural gas discovery. Resource boom → currency appreciates → exports of other sectors (manufacturing) become uncompetitive → deindustrialization. Affects many resource-rich nations.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Pradhan Mantri Fasal Bima Yojana (PMFBY) launched in 2016 replaced which earlier crop insurance schemes?",
    options: ["RKVY and NAIS","NAIS (National Agricultural Insurance Scheme) and MNAIS","PM-KISAN and RKVY","PMRY and NAIS"],
    correct_answer: 1,
    explanation: "PMFBY (January 2016): replaced NAIS (1999) and MNAIS (2010). Premium rates: Kharif 2%, Rabi 1.5%, commercial/horticultural crops 5%. Actuarial premium difference borne by Centre and State.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "Which committee recommended the rationalization of centrally sponsored schemes (CSS) in India?",
    options: ["Rangarajan Committee","Kelkar Committee","B.K. Chaturvedi Committee","Shivraj Patil Committee"],
    correct_answer: 2,
    explanation: "B.K. Chaturvedi Committee (2011): recommended rationalizing and restructuring CSS. Later, Sub-Group of CMs under CM Shivraj Singh Chouhan (2015) recommended reducing CSS from 66 to 28 for more flexibility.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
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
