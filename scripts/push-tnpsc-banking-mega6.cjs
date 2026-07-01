require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const BASE  = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
const KEY   = 'quiz:subject:banking';
const HDR   = { Authorization:`Bearer ${TOKEN}`, 'Content-Type':'application/json' };

const questions = [
  // Trade Finance & Letters of Credit
  {
    question_text: "What is a Letter of Credit (LC) in trade finance?",
    options: ["A loan given by the importer's bank", "A bank guarantee that payment will be made to the exporter upon fulfilling conditions", "A document certifying the goods are shipped", "An insurance policy for cargo"],
    correct_answer: 1,
    explanation: "An LC is a commitment by the importer's bank to pay the exporter once the specified documents (bill of lading, invoice, etc.) are presented, reducing trade risk.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is a 'Bill of Lading' in international trade?",
    options: ["A bank guarantee for imports", "A receipt issued by the carrier acknowledging goods for shipment", "A customs duty payment receipt", "A letter of credit issued by the exporter"],
    correct_answer: 1,
    explanation: "A Bill of Lading is issued by the carrier/shipping company, acting as a receipt, a contract of carriage, and a document of title for the goods shipped.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Documentary Collection' in trade finance?",
    options: ["Bank collects documents from the importer on behalf of the exporter", "Exporter collects payment before shipping goods", "Central bank collects foreign exchange from exporters", "Bank collects loan documents from borrowers"],
    correct_answer: 0,
    explanation: "In documentary collection, the exporter's bank sends shipping documents to the importer's bank, which releases them to the importer against payment (D/P) or acceptance (D/A).",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Forfaiting' in trade finance?",
    options: ["Forfeiting export incentives for faster payment", "Purchase of medium to long-term export receivables by a bank at a discount", "A penalty on late payment in trade", "Cancellation of an export order"],
    correct_answer: 1,
    explanation: "Forfaiting is a form of trade finance where the forfaiter (bank/financial institution) buys the exporter's receivables (typically medium-term) at a discount, providing immediate cash without recourse.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What does 'FOB' (Free On Board) mean in international trade?",
    options: ["The seller pays all costs until goods reach the buyer's warehouse", "The seller delivers goods on board the ship; risk transfers to buyer at that point", "The buyer pays all freight and insurance costs", "Free of all banking charges"],
    correct_answer: 1,
    explanation: "FOB means the seller is responsible for goods until they are loaded on the vessel. After that, risk and cost transfer to the buyer. It is an Incoterm used in trade contracts.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // Derivatives and Capital Markets
  {
    question_text: "What is a 'derivative' financial instrument?",
    options: ["A primary security like stocks or bonds", "A contract whose value is derived from an underlying asset", "A type of bank deposit", "A government bond"],
    correct_answer: 1,
    explanation: "Derivatives derive their value from underlying assets like stocks, bonds, currencies, commodities, or indices. Common derivatives include futures, options, swaps, and forwards.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is a 'futures contract'?",
    options: ["A contract to buy/sell an asset at a predetermined price on a future date, traded on an exchange", "A loan to be repaid in the future", "A bank guarantee for future payments", "A government scheme for future savings"],
    correct_answer: 0,
    explanation: "A futures contract obligates the buyer and seller to transact at a predetermined price on a specified future date. They are standardized and traded on exchanges like NSE/BSE.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is a 'call option' in financial markets?",
    options: ["The right to sell an asset at a specified price before expiry", "The right to buy an asset at a specified price before expiry", "A mandatory purchase agreement", "A type of bank loan"],
    correct_answer: 1,
    explanation: "A call option gives the holder the right (but not obligation) to buy the underlying asset at the strike price on or before the expiry date. If the market price exceeds the strike price, it is 'in the money'.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is an 'Interest Rate Swap'?",
    options: ["Exchanging fixed-rate loan obligation for floating-rate or vice versa between two parties", "RBI swapping interest rates between banks", "A scheme where government subsidizes interest rates", "Converting home loan to personal loan interest rate"],
    correct_answer: 0,
    explanation: "In an interest rate swap, two parties agree to exchange interest payment obligations — typically one pays fixed rate while the other pays floating rate — on a notional principal amount.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Where are most derivative contracts (futures and options) traded in India?",
    options: ["BSE only", "NSE (National Stock Exchange)", "MCX only", "RBI directly"],
    correct_answer: 1,
    explanation: "NSE is the largest exchange in India for trading equity derivatives (futures and options). NSE's F&O segment accounts for the highest trading volumes globally for stock index options.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // Microfinance and Financial Inclusion
  {
    question_text: "What is the maximum loan limit under the Pradhan Mantri MUDRA Yojana's 'Tarun' category?",
    options: ["₹50,000", "₹5 lakh", "₹10 lakh", "₹20 lakh"],
    correct_answer: 2,
    explanation: "MUDRA loans are classified as: Shishu (up to ₹50,000), Kishore (₹50,001 to ₹5 lakh), and Tarun (₹5 lakh to ₹10 lakh). All are for non-farm income-generating activities.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the primary objective of 'Financial Inclusion'?",
    options: ["Including more banks in stock markets", "Providing affordable financial services to all segments of society, especially the unbanked", "Including foreign banks in Indian banking system", "Merging all small banks into large banks"],
    correct_answer: 1,
    explanation: "Financial inclusion aims to ensure that individuals and businesses have access to useful and affordable financial products and services — including transactions, payments, savings, credit, and insurance.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is a 'Self-Help Group' (SHG) in the context of microfinance?",
    options: ["A group of bank employees who help customers", "An informal group of individuals pooling savings and accessing credit collectively", "A government committee for banking reforms", "A group of banks helping each other during crisis"],
    correct_answer: 1,
    explanation: "SHGs are informal groups (typically 10-20 members, mostly women) who pool regular savings and provide members with small loans. NABARD's SHG-Bank Linkage Programme (1992) connects them to formal banks.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the concept of 'Grameen Bank' associated with?",
    options: ["Rural cooperative banks in India", "A Bangladeshi bank founded by Muhammad Yunus pioneering microfinance", "A government bank for agricultural loans", "A type of Regional Rural Bank in India"],
    correct_answer: 1,
    explanation: "Grameen Bank, founded by Nobel laureate Muhammad Yunus in Bangladesh in 1983, pioneered the microfinance model of providing small collateral-free loans to impoverished rural women.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Under RBI guidelines, what is the annual interest rate cap on microfinance loans for NBFC-MFIs?",
    options: ["10% per annum", "26% per annum (historical cap replaced by margin cap approach)", "No cap exists", "36% per annum"],
    correct_answer: 1,
    explanation: "Earlier, the MFIN/RBI imposed a 26% interest rate cap for NBFC-MFIs. From 2022, RBI replaced the absolute cap with a margin-based approach where NBFC-MFIs set rates within a maximum margin cap over their cost of funds.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // Banking Sector Reforms
  {
    question_text: "What was the key recommendation of the Narasimham Committee (1991) regarding banking?",
    options: ["Nationalise all private banks", "Liberalise banking, reduce SLR/CRR, allow new private banks, and create a 4-tier banking structure", "Merge all public sector banks into one", "Ban foreign banks from operating in India"],
    correct_answer: 1,
    explanation: "The Narasimham Committee I (1991) recommended reducing SLR and CRR, allowing new private banks (HDFC, ICICI), creating a 3-4 tier banking structure, and strengthening bank supervision to align with global standards.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the 'Indradhanush Plan' (2015) in Indian banking?",
    options: ["A scheme to provide rainbow-themed bank cards", "A 7-point reform plan for revitalising Public Sector Banks (PSBs)", "A plan to merge all Regional Rural Banks", "A RBI initiative to control inflation"],
    correct_answer: 1,
    explanation: "The 2015 Indradhanush Plan has 7 elements (like a rainbow): Appointments, Bank Board Bureau, Capitalisation, De-stressing, Empowerment, Framework of accountability, and Governance — aimed at transforming PSBs.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'EASE' (Enhanced Access and Service Excellence) in banking?",
    options: ["A RBI mobile app for customers", "A reform agenda to benchmark Public Sector Banks on service quality and performance", "An index to measure ease of getting a bank loan", "A digital payment portal"],
    correct_answer: 1,
    explanation: "EASE is an annual reform index launched in 2018 that benchmarks PSBs on customer experience, credit offtake, financial inclusion, MSMEs, governance, and digital/data usage to drive banking reforms.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "How many public sector banks (PSBs) are there in India as of 2024?",
    options: ["27", "21", "12", "8"],
    correct_answer: 2,
    explanation: "After multiple mergers, India has 12 PSBs as of 2024: SBI, Bank of Baroda, PNB, Canara Bank, Union Bank, Indian Bank, Bank of India, Central Bank of India, Indian Overseas Bank, UCO Bank, Bank of Maharashtra, and Punjab & Sind Bank.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What was the significance of the 1969 bank nationalisation in India?",
    options: ["All banks were nationalised", "14 major private banks with deposits above ₹50 crore were nationalised by Indira Gandhi's government", "Foreign banks were nationalised", "Rural banks were formed through nationalisation"],
    correct_answer: 1,
    explanation: "On July 19, 1969, the Indira Gandhi government nationalised 14 major commercial banks with deposits exceeding ₹50 crore (not ₹100 crore). In 1980, 6 more banks with deposits above ₹200 crore were nationalised.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // Insurance Sector
  {
    question_text: "Which regulatory body oversees the insurance sector in India?",
    options: ["RBI", "SEBI", "IRDAI (Insurance Regulatory and Development Authority of India)", "Ministry of Finance"],
    correct_answer: 2,
    explanation: "IRDAI, established in 1999 under the IRDAI Act 1999, is headquartered in Hyderabad and regulates and promotes the insurance industry in India. It issues licenses, sets solvency norms, and protects policyholders.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Term Life Insurance'?",
    options: ["Life insurance that provides lifelong coverage with guaranteed returns", "Pure life insurance providing coverage for a specified term; pays only on death, no maturity benefit", "Insurance that matures after a term with savings component", "Insurance linked to stock market returns"],
    correct_answer: 1,
    explanation: "Term insurance is the simplest and cheapest form of life insurance. It covers only the risk of death during the policy term. If the insured survives, no maturity benefit is paid — making premiums much lower than other life insurance types.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is a 'Unit Linked Insurance Plan' (ULIP)?",
    options: ["Insurance linked to the unit of measurement of coverage", "A product combining life insurance with market-linked investment", "A fixed deposit with insurance benefits", "A government scheme linking insurance to employment"],
    correct_answer: 1,
    explanation: "ULIPs are insurance-cum-investment products where part of the premium pays for life cover and the rest is invested in equity/debt funds. They have a 5-year lock-in period and are regulated by IRDAI.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the 'Surrender Value' of an insurance policy?",
    options: ["Amount insurer pays when insured surrenders the policy before maturity", "Fine paid for not renewing the policy", "Bonus declared by the insurer", "Premium waiver in case of disability"],
    correct_answer: 0,
    explanation: "Surrender value is the amount the policyholder receives if they terminate an insurance policy before its maturity date. It is calculated as a percentage of premiums paid after deducting charges.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Under which ministry does the Life Insurance Corporation (LIC) of India operate?",
    options: ["Ministry of Commerce", "Ministry of Finance", "Ministry of Corporate Affairs", "IRDAI"],
    correct_answer: 1,
    explanation: "LIC of India, established in 1956 by nationalising 245 private insurance companies, operates under the Ministry of Finance. LIC is India's largest institutional investor.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // RBI Tools and Policies
  {
    question_text: "What is the 'Standing Deposit Facility' (SDF) introduced by RBI in April 2022?",
    options: ["A long-term deposit scheme for senior citizens", "A floor rate for absorption of excess liquidity from banks WITHOUT providing collateral to banks", "A new fixed deposit product", "A facility for banks to deposit customer funds with RBI"],
    correct_answer: 1,
    explanation: "SDF, introduced in April 2022, allows RBI to absorb excess liquidity from banks without giving them government securities as collateral (unlike reverse repo). SDF rate = Repo Rate minus 25 basis points, forming the LAF corridor floor.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Corridor System' in RBI's Liquidity Adjustment Facility (LAF)?",
    options: ["A physical security corridor in RBI offices", "The band between SDF rate (floor) and MSF rate (ceiling) within which overnight rates fluctuate", "A system of bank ratings", "A geographic region for banking operations"],
    correct_answer: 1,
    explanation: "RBI's LAF corridor: SDF rate (floor, currently Repo-25bps) → Repo Rate (policy rate) → MSF Rate (ceiling, Repo+25bps). Market overnight rates (call money) are expected to stay within this corridor.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Selective Credit Control' (SCC) used by RBI?",
    options: ["RBI selecting which banks get credit", "Directing credit flow away from sensitive/speculative commodities to productive sectors", "Selecting borrowers based on credit score", "A special credit facility for selected industries"],
    correct_answer: 1,
    explanation: "Selective Credit Control allows RBI to restrict bank credit to specific commodities (like food grains, sugar, edible oils) to prevent hoarding and speculation. It directs credit away from unproductive uses.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the 'Prompt Corrective Action' (PCA) framework of RBI?",
    options: ["Immediate loan approval process", "A supervisory framework triggering corrective actions when bank indicators breach thresholds", "A scheme for prompt customer service", "A fast-track resolution process for NPAs"],
    correct_answer: 1,
    explanation: "PCA framework triggers automatic corrective actions (restrictions on lending, dividends, expansion) when banks breach thresholds for Capital Adequacy Ratio, Net NPA Ratio, or Return on Assets — protecting depositors and systemic stability.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What does RBI's 'Financial Stability Report' (FSR) assess?",
    options: ["The financial stability of a single bank", "Risks and resilience of the overall financial system through stress tests and macro-financial analysis", "Stock market stability", "Only government finances"],
    correct_answer: 1,
    explanation: "The bi-annual FSR, published by RBI's Financial Stability Unit, assesses the stability and resilience of the Indian financial system, including macro-financial risks, banking sector health through stress tests, and emerging vulnerabilities.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // Economic Concepts Related to Banking
  {
    question_text: "What is the 'Twin Balance Sheet Problem' in Indian banking?",
    options: ["Banks having two types of balance sheets", "Simultaneous stress on corporate sector (over-leveraged firms) and banking sector (high NPAs)", "Maintaining balance between assets and liabilities", "Twin deficits in current and fiscal accounts"],
    correct_answer: 1,
    explanation: "The Twin Balance Sheet problem (identified ~2015) refers to simultaneous stress: corporations with excessive debt (stressed corporate balance sheets) caused NPAs at banks (stressed bank balance sheets), creating a credit crunch.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Quantitative Easing' (QE)?",
    options: ["A method to quantify bank risk", "Central bank buying securities to inject money into the economy when conventional tools are exhausted", "Limiting the quantity of loans", "A quality check system for bank operations"],
    correct_answer: 1,
    explanation: "QE is an unconventional monetary policy where central banks purchase government securities or other financial assets to inject liquidity into the economy, lower long-term interest rates, and stimulate economic activity — used after 2008 crisis and COVID-19.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Moral Hazard' in banking?",
    options: ["Banks being morally responsible for customer losses", "Risk that a party takes more risks because they don't bear the full consequences (e.g., banks expect government bailout)", "Ethical issues in bank management", "Hazard of moral policing by RBI"],
    correct_answer: 1,
    explanation: "Moral hazard occurs when parties take excessive risks because the negative consequences fall on others — e.g., banks taking risky positions expecting government/central bank bailouts ('too big to fail'). The 2008 crisis highlighted this.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Stagflation'?",
    options: ["Rapid economic growth with low inflation", "Simultaneous stagnant economic growth (or recession) and high inflation", "Stable inflation with high growth", "Stage-wise inflation control"],
    correct_answer: 1,
    explanation: "Stagflation is a rare and problematic economic condition combining high inflation, slow economic growth (stagnation), and high unemployment. Traditional monetary tools face a dilemma: raising rates fights inflation but worsens stagnation.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the 'Velocity of Money'?",
    options: ["Speed at which ATMs dispense cash", "The rate at which money circulates in the economy (GDP/Money Supply)", "Interest rate change speed", "RBI's rapid policy response mechanism"],
    correct_answer: 1,
    explanation: "Velocity of Money = Nominal GDP / Money Supply. It measures how frequently a unit of currency is used for transactions in a given period. High velocity means money circulates quickly; low velocity indicates economic sluggishness.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is a 'Credit Default Swap' (CDS)?",
    options: ["Swapping one loan for another", "A financial derivative where the seller compensates the buyer if a borrower defaults on a debt", "A scheme where banks swap their default loans", "An RBI scheme for credit recovery"],
    correct_answer: 1,
    explanation: "A CDS is like insurance against default — the buyer pays periodic premiums to the seller and receives a payout if the reference entity (borrower/bond issuer) defaults. CDSs played a key role in the 2008 financial crisis.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // Cooperative Banks and Rural Banking
  {
    question_text: "Which body regulates urban cooperative banks (UCBs) in India?",
    options: ["NABARD only", "State Registrar of Cooperative Societies only", "RBI (for banking functions) and State/Central Registrar (for cooperative functions) — dual regulation", "SEBI"],
    correct_answer: 2,
    explanation: "UCBs are under dual regulation: RBI regulates their banking functions (liquidity, capital, loans) while the State Registrar of Cooperative Societies/Central Registrar governs their cooperative aspects. The Banking Regulation Amendment 2020 strengthened RBI's oversight.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the structure of cooperative credit in rural India?",
    options: ["Single-tier: only one type of rural cooperative", "Three-tier: State Cooperative Banks → District Central Cooperative Banks → Primary Agricultural Credit Societies (PACS)", "Two-tier: State and District only", "Four-tier: National → State → District → Village"],
    correct_answer: 1,
    explanation: "Rural cooperative credit follows a 3-tier structure: State Cooperative Banks (apex, 1 per state) → District Central Cooperative Banks (DCCB, 1 per district) → Primary Agricultural Credit Societies (PACS, village level). NABARD refinances this structure.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the role of NABARD in rural banking?",
    options: ["Direct lending to farmers only", "Apex development bank providing refinance to rural financial institutions and supervising cooperative banks and RRBs", "Regulating all banks in India", "Providing insurance to rural borrowers"],
    correct_answer: 1,
    explanation: "NABARD (1982) is the apex institution for agricultural and rural credit. It: (1) provides refinance to banks lending to agriculture, (2) supervises RRBs and cooperative banks, (3) runs development programmes, and (4) supports financial inclusion in rural areas.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the Kisan Credit Card (KCC) scheme?",
    options: ["A credit card for purchasing farm equipment online", "A revolving credit facility providing farmers flexible access to credit for agricultural needs at subsidised rates", "A government subsidy card for farmers", "A card to collect government MSP payments"],
    correct_answer: 1,
    explanation: "KCC (launched 1998-99) provides farmers short-term credit for crop cultivation, maintenance of farm assets, and allied activities. It works like a revolving credit facility with a 5-year period. The government subsidises interest for timely repayers.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "How many Primary Agricultural Credit Societies (PACS) are there approximately in India?",
    options: ["About 5,000", "About 95,000+", "About 500", "About 10,000"],
    correct_answer: 1,
    explanation: "India has approximately 95,000+ PACS at the village level, making them the largest network of rural credit institutions. However, many are dormant or financially weak. Government has been computerising PACS under a central scheme.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // Digital Banking and Fintech
  {
    question_text: "What is 'Open Banking'?",
    options: ["Banks with no closing hours", "A system where banks share customer financial data with third parties through APIs, with customer consent", "Banks open to public without KYC", "Opening new bank branches freely"],
    correct_answer: 1,
    explanation: "Open Banking allows banks to share customer financial data with authorised third-party providers (fintechs, other banks) through secure APIs with the customer's consent. India's Account Aggregator framework is India's version of open banking.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'RegTech' in banking?",
    options: ["Technology used for bank registration", "Use of technology to help financial institutions comply with regulations efficiently", "Regulations about banking technology", "A special regulatory bank"],
    correct_answer: 1,
    explanation: "RegTech (Regulatory Technology) uses technologies like AI, ML, and big data to automate regulatory compliance, reporting, risk management, and identity verification, reducing costs for financial institutions.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'SupTech' (Supervisory Technology)?",
    options: ["Technology for superior banking services", "Technology used by regulators and supervisors to enhance their oversight and monitoring of financial institutions", "A supercomputer for banking calculations", "Technology for supporting bank customers"],
    correct_answer: 1,
    explanation: "SupTech refers to technology used by regulators (like RBI) to improve their supervisory functions — using data analytics, AI, and automated reporting to detect risks, monitor compliance, and improve regulatory oversight efficiency.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Tokenisation' of cards mandated by RBI from October 2022?",
    options: ["Replacing credit/debit cards with tokens for transportation", "Replacing card numbers with unique tokens for online transactions, enhancing security", "A type of cryptocurrency payment", "Tokenising bank deposits into digital assets"],
    correct_answer: 1,
    explanation: "Card tokenisation replaces sensitive card data (16-digit number, expiry, CVV) with a unique token for each device-merchant combination. RBI mandated that online merchants cannot store actual card data from October 1, 2022.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Central Bank Digital Currency' (CBDC) and when did India launch its pilot?",
    options: ["A private cryptocurrency backed by central bank", "A digital form of sovereign currency issued by the central bank; India launched pilot in November-December 2022", "A digital banking application by RBI", "A cryptocurrency exchange regulated by RBI"],
    correct_answer: 1,
    explanation: "CBDC (Digital Rupee e₹) is a digital form of the Indian Rupee issued by RBI. Wholesale CBDC pilot launched November 1, 2022 (for interbank settlements), and Retail CBDC pilot launched December 1, 2022 (for general public).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // Key Financial Ratios
  {
    question_text: "What is 'Net Interest Margin' (NIM) in banking?",
    options: ["Total profit of a bank", "(Interest Income − Interest Expenses) / Average Earning Assets — measures bank's core profitability", "Difference between lending and borrowing customers", "Margin banks charge on net loans"],
    correct_answer: 1,
    explanation: "NIM = (Interest Income − Interest Paid) / Average Earning Assets × 100. It measures how effectively a bank invests its funds compared to its interest expenses. Higher NIM = better profitability from core banking operations.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Return on Assets' (ROA) in banking?",
    options: ["Total value of bank assets", "Net Profit / Total Assets — measures how efficiently a bank uses its assets to generate profit", "Return on government securities held", "Asset quality ratio"],
    correct_answer: 1,
    explanation: "ROA = Net Profit / Total Assets × 100. For Indian PSBs, ROA of 1% is generally considered healthy. ROA improved significantly for PSBs from negative values (2017-18) to positive after NPA resolution and improved profitability.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What does 'GNPA ratio' indicate in banking?",
    options: ["Growth in Net Profit Assets", "Gross Non-Performing Assets as a percentage of Gross Advances — measures overall asset quality", "Government NPA assistance ratio", "General NPA rate across all countries"],
    correct_answer: 1,
    explanation: "GNPA Ratio = Gross NPAs / Gross Advances × 100. It indicates what percentage of total loans have gone bad (not paid for 90+ days). India's GNPA ratio has declined from ~11.5% (2018) to below 4% (2024), reflecting improved bank health.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the 'Credit-Deposit (CD) Ratio' of a bank?",
    options: ["Ratio of credit cards to deposits", "Total loans disbursed as a percentage of total deposits — indicates how much of deposits are lent out", "RBI credit given to bank as deposit ratio", "Certificate of Deposit to total deposits ratio"],
    correct_answer: 1,
    explanation: "CD Ratio = (Total Loans / Total Deposits) × 100. A high CD ratio means most deposits are deployed as loans (more profitable but less liquid). RBI monitors this for banking system assessment. RRBs and cooperative banks in states with low CD ratios get attention.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Capital Adequacy Ratio' (CAR) also known as?",
    options: ["Credit Asset Ratio", "CRAR (Capital to Risk-weighted Assets Ratio) — the ratio of capital to risk-weighted assets", "Cash Adequacy Reserve", "Central Allocation Ratio"],
    correct_answer: 1,
    explanation: "CAR (also CRAR) = (Tier 1 + Tier 2 Capital) / Risk-Weighted Assets × 100. It measures a bank's ability to absorb losses. Under Basel III, RBI mandates a minimum CRAR of 9% for Indian banks (higher than Basel's 8%).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // Government Securities and Debt Market
  {
    question_text: "What is a 'Treasury Bill' (T-Bill) in India?",
    options: ["A bill issued by the Treasury for domestic payments", "Short-term government security of maturity up to 364 days, issued by Government of India through RBI", "A bill for treasury department operations", "A type of commercial paper"],
    correct_answer: 1,
    explanation: "T-Bills are short-term money market instruments (91-day, 182-day, 364-day) issued by GoI through RBI at a discount to face value. They carry no coupon; investor profit = (face value − issue price). They are risk-free and highly liquid.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is a 'Government Security' (G-Sec)?",
    options: ["Security provided by government buildings", "Dated government bonds with fixed coupon, issued for more than 1 year by Central or State governments", "Securities traded in government-run exchanges", "A government guarantee for private bonds"],
    correct_answer: 1,
    explanation: "G-Secs are medium to long-term (2-40 years) fixed-income instruments issued by RBI on behalf of the Central Government. They carry fixed or floating interest (coupon) and are considered risk-free as they are backed by the sovereign.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is an 'Inflation-Indexed Bond' (IIB)?",
    options: ["A bond whose interest rate is indexed to the repo rate", "A bond where both principal and/or interest payments are linked to an inflation index like CPI to protect against inflation", "A bond that controls inflation", "A bond index measuring inflation"],
    correct_answer: 1,
    explanation: "IIBs protect investors from inflation erosion by linking returns to CPI or WPI. India issued IIBs in 2013. The real return remains constant, but nominal returns rise with inflation, making them attractive for long-term investors like pension funds.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What does 'Yield' of a bond mean?",
    options: ["Total face value of the bond", "Annual return an investor earns on the bond considering its market price", "Number of years the bond is held", "The coupon rate printed on the bond"],
    correct_answer: 1,
    explanation: "Bond yield = (Annual coupon payment / Current market price) × 100. Yield and bond price are inversely related: when bond prices rise (due to demand), yield falls, and vice versa. The 10-year G-Sec yield is India's benchmark interest rate.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is an 'inverted yield curve' and what does it signal?",
    options: ["A yield curve that is above normal levels", "When short-term bond yields are higher than long-term bond yields, often signalling an impending recession", "A yield curve for inverted securities", "When RBI inverts its policy on yields"],
    correct_answer: 1,
    explanation: "Normally, long-term bonds have higher yields than short-term bonds (compensation for time risk). An inverted yield curve (short-term > long-term yields) has historically preceded recessions in major economies as it signals expectations of future rate cuts and economic slowdown.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // Miscellaneous Banking
  {
    question_text: "What is 'Project Finance' in banking?",
    options: ["Financing of a bank's project management department", "Long-term financing of infrastructure/industrial projects based on projected cash flows, not borrower's balance sheet", "Short-term loans for working capital projects", "Government financing for infrastructure only"],
    correct_answer: 1,
    explanation: "Project Finance funds large infrastructure (power plants, highways, ports) by creating a Special Purpose Vehicle (SPV). Loans are repaid from the project's own cash flows; the project assets serve as collateral, not the sponsors' balance sheets.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is a 'Syndicated Loan'?",
    options: ["A loan syndicated through TV", "A large loan arranged by a lead bank and funded by a group of banks sharing the credit risk", "Multiple small loans combined into one", "A government-sponsored loan scheme"],
    correct_answer: 1,
    explanation: "A syndicated loan is a single large credit facility where a group of lenders (syndicate) share the risk and funding. A 'lead arranger' or 'mandated arranger' structures the deal. Used for large corporate, project, or acquisition financing beyond one bank's capacity.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Securitisation' in banking?",
    options: ["Adding security features to bank branches", "Pooling illiquid assets (loans) and issuing tradeable securities backed by those assets to investors", "Providing security to bank deposits", "A process of securing inter-bank loans"],
    correct_answer: 1,
    explanation: "Securitisation converts illiquid bank loans (mortgages, auto loans) into marketable securities called Asset-Backed Securities (ABS) or Mortgage-Backed Securities (MBS). Banks get immediate cash, transfer credit risk, and free up capital for new lending.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the 'Insolvency and Bankruptcy Code (IBC) 2016' primarily designed for?",
    options: ["Preventing bank frauds", "Time-bound resolution of corporate insolvency within 180+90=270 days", "Regulating all bank loans", "Preventing bank mergers"],
    correct_answer: 1,
    explanation: "IBC 2016 provides a time-bound framework (180 days + 90-day extension = 270 days) for corporate insolvency resolution through the CIRP (Corporate Insolvency Resolution Process) before the National Company Law Tribunal (NCLT). If unresolved, liquidation follows.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is a 'Special Purpose Vehicle' (SPV) in banking?",
    options: ["A special vehicle used to transport bank officials", "A subsidiary created for a specific purpose (securitisation, project finance) that is kept off the parent's balance sheet", "A special savings vehicle account", "A type of mutual fund"],
    correct_answer: 1,
    explanation: "An SPV (also called Special Purpose Entity/SPE) is a legally separate entity created by a bank or company for a specific, limited purpose — such as securitisation, asset isolation, or project financing. It has no operations of its own.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What does 'Lien' mean in banking?",
    options: ["A type of loan product", "The right of a lender to retain or claim possession of a borrower's assets until a debt is settled", "Interest on a late payment", "A foreign currency transaction"],
    correct_answer: 1,
    explanation: "A lien is a legal right or claim against an asset by a creditor as security for a debt. Banks create a lien on deposits (e.g., FD) when they give loans against them — if the borrower defaults, the bank can recover from the pledged asset.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the 'Priority Sector Lending' (PSL) target for foreign banks with fewer than 20 branches?",
    options: ["40% of ANBC", "32% of ANBC", "No PSL requirement", "20% of ANBC"],
    correct_answer: 1,
    explanation: "Foreign banks with less than 20 branches have a PSL target of 40% of ANBC (Adjusted Net Bank Credit), with 32% in the form of exports and other sub-targets. From 2020, the government mandated all foreign banks (regardless of branch count) to meet 40% PSL.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Financial Action Task Force' (FATF)?",
    options: ["An Indian anti-fraud unit", "An intergovernmental body setting standards to combat money laundering, terrorism financing, and proliferation financing", "A financial task force under RBI", "A UN body for financial crimes"],
    correct_answer: 1,
    explanation: "FATF (est. 1989, Paris) sets international standards (40 Recommendations) for AML/CFT. Countries on its 'grey list' face enhanced monitoring; 'black list' countries face calls for enhanced due diligence. India is an FATF member since 2010.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the difference between 'hard currency' and 'soft currency'?",
    options: ["Physical coins vs paper notes", "Hard currency is widely accepted internationally and stable (USD, EUR, GBP); soft currency is not widely accepted and volatile (less stable currencies)", "Hard currency has higher denomination", "Currency issued by government vs RBI"],
    correct_answer: 1,
    explanation: "Hard currencies (USD, EUR, GBP, JPY, CHF) are universally accepted, stable in value, and easily convertible. Soft currencies have limited international acceptance, high volatility, and currency controls. Hard currencies form most of India's forex reserves.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Capital Flight'?",
    options: ["Central bank increasing capital requirements rapidly", "Large-scale movement of capital out of a country due to economic/political instability or better opportunities elsewhere", "Flying capital (cash) to international banks", "Bank raising fresh capital by issuing shares"],
    correct_answer: 1,
    explanation: "Capital flight is the rapid outflow of financial assets from a country due to political instability, economic uncertainty, currency depreciation, or higher returns elsewhere. It can cause exchange rate depreciation and reduce investment in the affected country.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Hawala' and why is it illegal in India?",
    options: ["A type of formal bank transfer", "An informal money transfer system bypassing official banking channels, used for illegal fund transfers", "A legal Islamic banking product", "A government scheme for rural money transfer"],
    correct_answer: 1,
    explanation: "Hawala is an informal trust-based money transfer network operating outside formal banking. Funds move through a network of brokers (hawaladars) without physical transfer of money. It is illegal in India under FEMA and PMLA as it evades taxes and can fund crime/terrorism.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is a 'Neobank' or 'Challenger Bank'?",
    options: ["A new public sector bank", "A digital-only bank with no physical branches, operating entirely online via mobile/web", "A bank that challenges RBI regulations", "A cooperative bank in new areas"],
    correct_answer: 1,
    explanation: "Neobanks are fintech companies offering banking services entirely digitally without physical branches. They typically partner with licensed banks in India (as RBI hasn't yet issued standalone neobank licenses) to offer savings accounts, payments, and loans via apps.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the role of the 'Deposit Insurance and Credit Guarantee Corporation' (DICGC)?",
    options: ["Provides insurance against all bank risks", "Insures bank deposits up to ₹5 lakh per depositor per bank; subsidiary of RBI", "Guarantees bank profits to depositors", "An insurance company owned by all banks"],
    correct_answer: 1,
    explanation: "DICGC (established 1978, subsidiary of RBI) insures deposits of all commercial banks, cooperative banks, and RRBs up to ₹5 lakh per depositor per bank (increased from ₹1 lakh in 2020). Premiums are paid by the insured banks.",
    difficulty: "easy",
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
