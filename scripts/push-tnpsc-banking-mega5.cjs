require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const BASE  = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
const KEY   = 'quiz:subject:banking';
const HDR   = { Authorization:`Bearer ${TOKEN}`, 'Content-Type':'application/json' };

const questions = [
  // Bank Merger
  {
    question_text: "Vijaya Bank, Dena Bank, and Bank of Baroda were merged in which year?",
    options: ["2017", "2018", "2019", "2020"],
    correct_answer: 2,
    explanation: "Vijaya Bank and Dena Bank were merged with Bank of Baroda effective April 1, 2019, creating India's third largest public sector bank.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Six public sector banks were merged into four in April 2020. Oriental Bank of Commerce and United Bank of India were merged with:",
    options: ["SBI", "PNB", "Bank of Baroda", "Canara Bank"],
    correct_answer: 1,
    explanation: "Oriental Bank of Commerce and United Bank of India were merged with Punjab National Bank effective April 1, 2020, making it India's second largest PSB.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Allahabad Bank was merged with which public sector bank in 2020?",
    options: ["Union Bank of India", "Punjab National Bank", "Indian Bank", "Canara Bank"],
    correct_answer: 2,
    explanation: "Allahabad Bank was merged with Indian Bank effective April 1, 2020.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Syndicate Bank was merged with which bank in 2020?",
    options: ["Indian Bank", "Canara Bank", "Union Bank of India", "Bank of Baroda"],
    correct_answer: 1,
    explanation: "Syndicate Bank was merged with Canara Bank effective April 1, 2020.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Andhra Bank and Corporation Bank were merged with:",
    options: ["PNB", "Indian Bank", "Union Bank of India", "Bank of India"],
    correct_answer: 2,
    explanation: "Andhra Bank and Corporation Bank were merged with Union Bank of India effective April 1, 2020.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Financial Terms
  {
    question_text: "GDP (Gross Domestic Product) measures:",
    options: ["Total imports of a country", "Total value of goods and services produced within a country in a year", "Government expenditure", "Total bank deposits"],
    correct_answer: 1,
    explanation: "GDP is the total monetary value of all final goods and services produced within a country's borders during a specific period, regardless of the producers' nationality.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "GNP (Gross National Product) differs from GDP in that:",
    options: ["GNP excludes service sector", "GNP includes income of nationals abroad but excludes income of foreigners in India", "GNP includes only agricultural output", "GNP is always smaller than GDP"],
    correct_answer: 1,
    explanation: "GNP = GDP + Income earned by nationals abroad - Income earned by foreigners in India. GNP measures output by a country's residents, regardless of location.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "National Income is closest to which measure?",
    options: ["GDP at market prices", "NNP at factor cost", "GNP at market prices", "GDP at factor cost"],
    correct_answer: 1,
    explanation: "National Income = NNP at factor cost (Net National Product at Factor Cost). It measures the income of all residents of a country, net of depreciation.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The term 'Balance of Payments' refers to:",
    options: ["Balance in bank accounts", "Systematic record of all economic transactions between a country and the rest of the world", "Government budget balance", "Trade surplus"],
    correct_answer: 1,
    explanation: "Balance of Payments (BOP) is a systematic account of all transactions between residents of a country and the rest of the world over a period. It includes current account, capital account, and financial account.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "A Current Account Deficit (CAD) means:",
    options: ["Government spends more than revenue", "Country imports more goods, services, and income than it exports", "Banks have more liabilities than assets", "More FDI outflow than inflow"],
    correct_answer: 1,
    explanation: "CAD occurs when a country's total imports of goods, services, and transfers exceed total exports. India typically runs a CAD due to high oil imports.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  // RBI Data
  {
    question_text: "India's foreign exchange reserves are reported weekly by RBI. As of 2024, they were approximately:",
    options: ["$300 billion", "$400 billion", "$620-650 billion", "$500 billion"],
    correct_answer: 2,
    explanation: "India's forex reserves crossed $600 billion in 2021 and remained in the $620-660 billion range through much of 2024.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's current account deficit (CAD) was approximately ___ % of GDP in 2022-23.",
    options: ["0.5%", "1%", "2%", "3%"],
    correct_answer: 2,
    explanation: "India's CAD was approximately 2% of GDP in 2022-23, largely due to high global commodity prices (especially oil). Services exports and remittances partially offset the trade deficit.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // Finance Acts & Schemes
  {
    question_text: "The Fiscal Responsibility and Budget Management (FRBM) Act was enacted in:",
    options: ["2001", "2003", "2005", "2007"],
    correct_answer: 1,
    explanation: "FRBM Act 2003 was enacted to institutionalise financial discipline and reduce fiscal deficit. It mandates the government to eliminate revenue deficit and reduce fiscal deficit.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The N.K. Singh Committee (2017) reviewed the FRBM Act and recommended a Debt-to-GDP ratio target of:",
    options: ["40%", "50% for central government (60% general government)", "60%", "30%"],
    correct_answer: 1,
    explanation: "N.K. Singh Committee recommended reducing India's general government debt to 60% of GDP by 2022-23, with Central Government debt at 40% and States at 20%.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Revenue Deficit = Revenue Expenditure - Revenue Receipts. A revenue deficit means:",
    options: ["Government earns more than it spends", "Government needs to borrow to meet even routine expenditure", "Capital spending exceeds plan", "Tax collection is high"],
    correct_answer: 1,
    explanation: "Revenue deficit indicates government's routine expenses (salaries, interest, subsidies) exceed its revenue earnings, meaning borrowings fund even non-capital expenditure.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Primary Deficit = Fiscal Deficit - Interest Payments. A zero primary deficit means:",
    options: ["No borrowing at all", "Government borrows only to pay interest on past debt", "Government is debt-free", "Revenue surplus exists"],
    correct_answer: 1,
    explanation: "Zero primary deficit means government's current expenditure (excluding interest) equals current revenue — it borrows only to service past debt, suggesting fiscal management improvement.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // Fintech & Modern Banking
  {
    question_text: "RegTech (Regulatory Technology) in banking refers to:",
    options: ["Technology for building bank branches", "Technology solutions for regulatory compliance, reporting, and risk management", "Regulation of cryptocurrency", "Technology for detecting bank frauds only"],
    correct_answer: 1,
    explanation: "RegTech uses technology (AI, blockchain, cloud) to help financial institutions comply with regulations efficiently — automating compliance reporting, KYC, AML, and fraud detection.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Open Banking refers to the concept of:",
    options: ["Banks open 24x7", "Banks sharing customer financial data (with consent) via APIs to third parties", "Banks with no minimum balance", "Government-owned banks opening fully"],
    correct_answer: 1,
    explanation: "Open Banking uses APIs to allow third-party developers to access bank customer data (with consent) to build financial apps and services, fostering innovation.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Blockchain technology in banking is used primarily for:",
    options: ["Customer account management", "Decentralised, transparent, and tamper-proof record of transactions", "ATM management", "Printing banknotes"],
    correct_answer: 1,
    explanation: "Blockchain is a distributed ledger technology providing transparent, immutable records of transactions without a central authority. Banks use it for cross-border payments, trade finance, and KYC.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "AI (Artificial Intelligence) in banking is used for:",
    options: ["Only customer service chatbots", "Fraud detection, credit scoring, customer service, regulatory compliance, and personalised banking", "Replacing all bank employees", "Only investment advice"],
    correct_answer: 1,
    explanation: "Banks use AI across many functions: fraud detection (ML models), credit risk assessment, chatbots, robo-advisory, regulatory compliance (RegTech), and personalised product recommendations.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "India's 'Account Aggregator (AA)' framework enables consent-based sharing of financial data. How many banks were live on the AA network at launch (2021)?",
    options: ["4", "8", "21", "50"],
    correct_answer: 1,
    explanation: "The Account Aggregator ecosystem went live in September 2021 with 8 banks (SBI, ICICI, HDFC, Axis, Kotak, IndusInd, IDFC FIRST, and Federal Bank) participating initially.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // NBFC Sector
  {
    question_text: "The IL&FS crisis (2018) was significant for India's financial system because it:",
    options: ["Led to bank nationalisation", "Triggered credit squeeze in NBFC sector and broader liquidity crunch", "Caused collapse of insurance companies", "Led to currency devaluation"],
    correct_answer: 1,
    explanation: "IL&FS (Infrastructure Leasing & Financial Services) defaulted on debt in 2018, triggering a liquidity crunch in the NBFC sector as mutual funds pulled back lending to NBFCs.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "NBFCs with assets above ₹500 crore are classified as NBFC-ND-SI (Non-Deposit taking Systemically Important). They must:",
    options: ["Maintain CRR like banks", "Maintain minimum CRAR of 15% and follow enhanced disclosure norms", "Accept only secured deposits", "Limit lending to MSMEs"],
    correct_answer: 1,
    explanation: "NBFC-ND-SI must maintain Capital to Risk Weighted Assets Ratio (CRAR) of 15%, maintain leverage ratio, and follow enhanced disclosure and governance norms.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Which of the following is an NBFC?",
    options: ["SBI", "LIC Housing Finance", "RBI", "SEBI"],
    correct_answer: 1,
    explanation: "LIC Housing Finance is a Housing Finance Company (HFC), a type of NBFC. Other examples include Bajaj Finance, Mahindra Finance, and Muthoot Finance.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  // More Financial Concepts
  {
    question_text: "Amortisation in banking refers to:",
    options: ["Writing off bad debts", "Gradual repayment of loan principal over time through periodic payments", "Creating loan provisions", "Increasing collateral value"],
    correct_answer: 1,
    explanation: "Amortisation is the process of paying off a loan gradually through regular payments that cover both interest and principal, reducing the outstanding balance to zero over the loan term.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Provisioning in banking means:",
    options: ["Providing loans to customers", "Setting aside funds to cover potential losses from NPAs", "Increasing capital reserves", "Providing banking services"],
    correct_answer: 1,
    explanation: "Provisioning requires banks to set aside a percentage of the NPA amount as reserves to cover potential losses — standard: 15-25% for substandard, 100% for loss assets.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Write-off in banking context means:",
    options: ["Forgiving the entire loan", "Removing a fully provisioned NPA from the balance sheet without waiving recovery rights", "Selling the asset", "Reducing interest on the loan"],
    correct_answer: 1,
    explanation: "Technical write-off removes a fully-provisioned NPA from the bank's balance sheet. The bank retains the right to pursue recovery of the debt.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The One Time Settlement (OTS) scheme allows:",
    options: ["Loan waiver scheme for poor", "Compromise settlement between bank and defaulting borrower at a reduced amount", "Single payment for insurance", "Tax settlement with government"],
    correct_answer: 1,
    explanation: "OTS allows defaulting borrowers to settle their overdue loans at a mutually agreed amount (usually less than the full outstanding), helping banks recover NPAs.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // International Reserves & Payments
  {
    question_text: "SDR (Special Drawing Rights) is an international reserve asset created by:",
    options: ["World Bank", "BIS", "IMF (International Monetary Fund)", "G20 nations"],
    correct_answer: 2,
    explanation: "SDR is an international reserve asset created by the IMF in 1969. SDR's value is based on a basket of major currencies (USD, EUR, CNY, JPY, GBP). India holds SDRs as part of forex reserves.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's remittances from abroad (NRI remittances) make India the:",
    options: ["3rd largest recipient", "2nd largest recipient", "Largest recipient", "5th largest recipient"],
    correct_answer: 2,
    explanation: "India is consistently the world's largest recipient of remittances — receiving over $100 billion annually. NRI remittances are an important source of forex.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Which Indian bank first launched internet banking in India?",
    options: ["SBI", "ICICI Bank", "HDFC Bank", "CitiBank"],
    correct_answer: 1,
    explanation: "ICICI Bank launched India's first internet banking service in 1996. Today, all major banks offer internet and mobile banking services.",
    difficulty: "hard",
    exam_types: ["tnpsc"]
  },
  // Tamil Nadu Banking
  {
    question_text: "Which bank was the first to introduce ATM (Automated Teller Machine) services in India?",
    options: ["SBI", "HSBC", "CitiBank", "Punjab National Bank"],
    correct_answer: 2,
    explanation: "CitiBank installed India's first ATM in 1987 in Mumbai. SBI then became the largest ATM operator in India.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "The Tamil Nadu Industrial Development Corporation (TIDCO) is a:",
    options: ["Private company", "State government entity for industrial promotion", "Central government bank", "NGO"],
    correct_answer: 1,
    explanation: "TIDCO is a State Government enterprise that promotes, develops, and manages industrial and commercial activities in Tamil Nadu.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The Tamil Nadu Grama Bank (Tamil Nadu RRB) is sponsored by:",
    options: ["Canara Bank", "Indian Bank", "SBI", "Bank of India"],
    correct_answer: 1,
    explanation: "Tamil Nadu Grama Bank is a Regional Rural Bank sponsored by Indian Bank, serving rural areas of Tamil Nadu.",
    difficulty: "hard",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The City Union Bank, a private sector bank, is headquartered in:",
    options: ["Chennai", "Coimbatore", "Kumbakonam", "Madurai"],
    correct_answer: 2,
    explanation: "City Union Bank (formerly Kumbakonam Bank, est. 1904) is headquartered in Kumbakonam, Tamil Nadu. It is one of the oldest banks in South India.",
    difficulty: "hard",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "Lakshmi Vilas Bank (Tamil Nadu-based) was merged with which bank?",
    options: ["DBS Bank India", "HDFC Bank", "ICICI Bank", "Axis Bank"],
    correct_answer: 0,
    explanation: "Lakshmi Vilas Bank (est. 1926, headquartered in Karur, Tamil Nadu) was merged with DBS Bank India Limited in November 2020 under RBI's direction.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  // Advanced Banking
  {
    question_text: "What is 'Repo' in the context of money markets?",
    options: ["Repossession of assets", "Sale and repurchase agreement for short-term borrowing using securities as collateral", "Repayment of principal", "Renewal of deposits"],
    correct_answer: 1,
    explanation: "A repo (repurchase agreement) involves selling securities with an agreement to repurchase them at a higher price (the difference being the interest). Used by banks to borrow funds short-term.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "A 'Leverage Ratio' in banking measures:",
    options: ["Profit to revenue ratio", "Tier 1 capital to total exposure (assets) — limiting excessive leverage", "Loan-to-deposit ratio", "Cost-to-income ratio"],
    correct_answer: 1,
    explanation: "Leverage ratio = Tier 1 Capital / Total Exposure. Basel III mandates a minimum leverage ratio of 3% to prevent banks from building up excessive leverage.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'Yield Curve' in bond markets shows:",
    options: ["Stock price movements", "Relationship between interest rates and maturity periods of bonds", "Inflation over time", "GDP growth rate"],
    correct_answer: 1,
    explanation: "The yield curve plots yields (interest rates) against maturity for bonds of similar credit quality. A normal (upward sloping) curve means longer maturities have higher yields.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Inverted Yield Curve (long-term rates lower than short-term) is often interpreted as a signal of:",
    options: ["Economic boom", "High inflation", "Potential economic recession", "Banking crisis only"],
    correct_answer: 2,
    explanation: "An inverted yield curve historically precedes economic recessions. It suggests markets expect future interest rates to fall (usually due to expected economic slowdown).",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Covered Bond is a type of debt security where the underlying assets:",
    options: ["Are removed from issuer's balance sheet", "Remain on the issuer's balance sheet, providing dual protection to investors", "Are held by a trustee", "Are guaranteed by government only"],
    correct_answer: 1,
    explanation: "Covered bonds are debt instruments backed by ring-fenced assets (mortgages, public sector loans) that remain on the issuer's balance sheet. RBI has introduced a covered bond framework for India.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // Insurance deeper
  {
    question_text: "Unit Linked Insurance Plans (ULIPs) combine:",
    options: ["Fixed deposit and insurance", "Life insurance and investment in market-linked funds", "Health insurance and retirement pension", "Insurance and PPF"],
    correct_answer: 1,
    explanation: "ULIPs are products that combine life insurance protection with an investment component. Premium is split — one part provides insurance cover, the rest is invested in equity/debt funds.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "Term Insurance in life insurance provides:",
    options: ["Investment returns + life cover", "Pure life cover with no maturity benefits — death benefit only", "Life cover + retirement pension", "Health cover only"],
    correct_answer: 1,
    explanation: "Term insurance is the simplest, most affordable form of life insurance. It pays the sum assured only if the insured dies during the policy term. There's no maturity benefit.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "The 'Free Look Period' in insurance policies is:",
    options: ["Initial period with no premium", "Period (15-30 days) during which policyholder can review and return the policy", "Grace period for premium payment", "Period with highest insurance coverage"],
    correct_answer: 1,
    explanation: "Free Look Period (15 days, 30 days for distance marketing) allows a new policyholder to review the terms and return the policy if unsatisfied, receiving a refund minus charges.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Health insurance under the 'Ayushman Bharat PM-JAY' covers hospitalization up to:",
    options: ["₹1 lakh", "₹3 lakh", "₹5 lakh", "₹10 lakh"],
    correct_answer: 2,
    explanation: "PM-JAY provides health insurance cover of ₹5 lakh per family per year for secondary and tertiary hospitalization. It covers bottom 40% of population (~55 crore beneficiaries).",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The 'Pradhan Mantri Vaya Vandana Yojana (PMVVY)' is a pension scheme for:",
    options: ["All citizens", "Senior citizens (60 years+)", "Government employees only", "Agricultural workers"],
    correct_answer: 1,
    explanation: "PMVVY is an assured pension scheme for senior citizens (60 years+), operated by LIC with government guarantee. It provides regular monthly/quarterly/yearly pension.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Bank Rates
  {
    question_text: "As of 2024, India's repo rate was set at:",
    options: ["4%", "5.5%", "6.5%", "7%"],
    correct_answer: 2,
    explanation: "RBI's repo rate stood at 6.5% for much of 2024, maintained from February 2023. The MPC began rate cut cycle in October 2024.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's CRR (Cash Reserve Ratio) as of 2024 was:",
    options: ["3%", "4%", "5%", "6%"],
    correct_answer: 1,
    explanation: "India's CRR was at 4% for most of 2024. RBI reduced it by 50 bps to 4% in December 2024 to inject liquidity.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's SLR (Statutory Liquidity Ratio) as of 2024 was:",
    options: ["18%", "20%", "21%", "25%"],
    correct_answer: 1,
    explanation: "India's SLR was 18% as of 2024. Banks must maintain 18% of their NDTL in approved securities (government bonds, gold, etc.).",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // Questions on Key Reports
  {
    question_text: "RBI's 'Report on Currency and Finance' (RCF) focuses on:",
    options: ["Annual banking statistics only", "A theme-based analysis of monetary and economic issues", "Foreign exchange reserves", "Currency printing operations"],
    correct_answer: 1,
    explanation: "RCF is an annual publication by RBI providing theme-based analysis of current monetary policy issues — e.g., 'Towards a Greener Cleaner India' (2022), 'Fiscal-Monetary Nexus' (2021).",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'Trend and Progress of Banking in India' report is published by:",
    options: ["IBA", "SEBI", "RBI", "Ministry of Finance"],
    correct_answer: 2,
    explanation: "RBI publishes 'Report on Trend and Progress of Banking in India' annually (under Section 36(2) of Banking Regulation Act), providing comprehensive data on the banking sector.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // Key Banking Events
  {
    question_text: "The Narasimham Committee I and II (1991 and 1998) together recommended reforms to:",
    options: ["Nationalise more banks", "Move to a market-oriented banking system with prudential norms", "Create more RRBs", "Increase SLR requirements"],
    correct_answer: 1,
    explanation: "Both Narasimham Committees recommended liberalisation: reducing SLR/CRR, freeing interest rates, introducing prudential norms, allowing new banks, and improving governance.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The YES Bank crisis (2020) was resolved by:",
    options: ["YES Bank was liquidated", "RBI's reconstruction scheme with SBI and other banks investing in YES Bank", "Merger with PNB", "Government full takeover"],
    correct_answer: 1,
    explanation: "RBI placed YES Bank under moratorium in March 2020 and formulated a reconstruction scheme where SBI and other banks invested in YES Bank's equity.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "PMC Bank (Punjab and Maharashtra Cooperative Bank) fraud case led to:",
    options: ["Cooperative banks deregistration", "Strengthened cooperative bank regulation under RBI (Banking Regulation Act amendment 2020)", "Nationalisation of cooperative banks", "Merger with PSB"],
    correct_answer: 1,
    explanation: "PMC Bank fraud (2019) led to the Banking Regulation (Amendment) Act 2020, extending RBI's regulatory powers to cooperative banks for better governance and depositor protection.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // More Terms
  {
    question_text: "Escrow account in banking is used to:",
    options: ["Hold savings with high interest", "Hold funds by a third party (bank) on behalf of parties involved in a transaction until conditions are met", "Manage pension funds", "Hold forex reserves"],
    correct_answer: 1,
    explanation: "Escrow is a financial arrangement where a third party (escrow agent/bank) holds and regulates payment of funds required for two parties in a transaction. Used in real estate, mergers, and loans.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "A 'Balloon Payment' loan has:",
    options: ["Equal monthly payments throughout", "Small payments initially with a large final payment at maturity", "No interest payments", "Interest-only payments throughout"],
    correct_answer: 1,
    explanation: "A balloon payment loan involves regular (often interest-only or small) payments throughout, with a large lump-sum 'balloon' payment due at the end of the loan term.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Teaser rates in home loans are:",
    options: ["Fixed rate for entire loan tenure", "Initially low fixed rate that resets to higher floating rate after a period", "Variable rate from day one", "Special rates for premium customers only"],
    correct_answer: 1,
    explanation: "Teaser loans offer an artificially low fixed interest rate for an initial period (1-3 years), after which the rate resets to a higher floating market rate.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The term 'Moral Suasion' in RBI's toolkit means:",
    options: ["Legal directions to banks", "RBI persuades banks to follow certain policies without formal orders", "Imposing penalty on erring banks", "Nationalising defaulting banks"],
    correct_answer: 1,
    explanation: "Moral suasion is an informal RBI method where it issues directives, advice, or guidelines to banks to encourage compliance with its policies without formal statutory orders.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "RBI's 'Selective Credit Control' regulates credit specifically for:",
    options: ["All sectors uniformly", "Sensitive commodities (essential commodities prone to price speculation)", "Technology sector only", "Housing sector only"],
    correct_answer: 1,
    explanation: "Selective Credit Control allows RBI to direct credit to specific sectors or restrict it for sensitive commodities like food grains, oilseeds, etc. to prevent speculative hoarding.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // Banking History 2
  {
    question_text: "The Glass-Steagall Act (USA, 1933) separated:",
    options: ["Commercial banking and insurance", "Commercial banking and investment banking", "Banking and real estate", "Domestic and foreign banking"],
    correct_answer: 1,
    explanation: "Glass-Steagall Act separated commercial banking and investment banking activities. It was largely repealed in 1999, which some economists link to the 2008 financial crisis.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Dodd-Frank Wall Street Reform and Consumer Protection Act (USA, 2010) was enacted in response to:",
    options: ["Dot-com bubble", "2008 Global Financial Crisis", "Enron scandal", "LTCM collapse"],
    correct_answer: 1,
    explanation: "Dodd-Frank Act (2010) was a comprehensive financial reform legislation in the USA enacted in response to the 2008 financial crisis to reduce systemic risk.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's bank notes' security features include:",
    options: ["Only colour patterns", "Watermarks, security thread, intaglio printing, microlettering, latent image, fluorescent ink", "Only QR codes", "Holograms only"],
    correct_answer: 1,
    explanation: "Indian currency notes have multiple security features: watermark (Gandhi portrait), security thread (read 'Bharat' and '₹'), intaglio printing, see-through register, microlettering, and UV fluorescent ink.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "India's '₹2000 note' was withdrawn from circulation in 2023. The reason given by RBI was:",
    options: ["Counterfeiting concerns", "It had achieved its objective (post-demonetisation currency replacement) and was the 'Clean Note Policy' withdrawal", "Inflation control", "Too few users"],
    correct_answer: 1,
    explanation: "RBI's 'Clean Note Policy' led to withdrawal of ₹2000 notes in May 2023 as they were introduced post-demonetisation and had served their purpose. They remained legal tender.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'Indradhanush Plan' (2015) for PSBs aimed to:",
    options: ["Merge all PSBs into 4 banks", "Revamp PSBs through 7 reforms: appointments, bank board bureau, capitalisation, de-stressing, empowerment, framework, governance", "Privatise PSBs", "Nationalise more banks"],
    correct_answer: 1,
    explanation: "Indradhanush 7-point plan (2015) for PSB reform covered: Appointments (professional CEDs), BBB (Bank Board Bureau), Capitalisation, De-stressing (resolving NPAs), Empowerment, Framework of accountability, Governance.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's 'SETU' (self-employment and talent utilization) scheme was an initiative by:",
    options: ["RBI", "NABARD", "NITI Aayog", "Atal Bihari Vajpayee government"],
    correct_answer: 2,
    explanation: "SETU (Self-Employment and Talent Utilization) was a technological self-employment scheme launched by NITI Aayog in 2015 to support self-employment through technology platforms.",
    difficulty: "hard",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "India's 'Swavalamban scheme' (predecessor to APY) was a pension scheme for the:",
    options: ["Government employees", "Unorganised sector workers", "Farmers only", "Industrial workers"],
    correct_answer: 1,
    explanation: "Swavalamban scheme (NPS-Lite, 2010) provided government co-contribution of ₹1,000/year for unorganised sector workers who joined NPS. It was replaced by APY in 2015.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India Post's 'Sukanya Samriddhi Account' is available at:",
    options: ["Only government banks", "Banks and post offices", "Only RBI offices", "Only co-operative banks"],
    correct_answer: 1,
    explanation: "Sukanya Samriddhi Accounts can be opened at post offices (India Post) and designated commercial banks, making them widely accessible.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "The SARFAESI Act 2002 allows banks to enforce security interests without court intervention. The minimum NPA threshold for SARFAESI application is:",
    options: ["₹50,000", "₹1 lakh", "₹5 lakh", "₹10 lakh"],
    correct_answer: 1,
    explanation: "SARFAESI applies to secured loans with outstanding amount of ₹1 lakh or more. Agricultural land and loans below ₹1 lakh are exempt from SARFAESI.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Under PMJDY, every account holder receives a RuPay debit card with life insurance cover of:",
    options: ["₹10,000", "₹20,000", "₹30,000", "₹50,000"],
    correct_answer: 2,
    explanation: "PMJDY accounts come with RuPay debit card that includes life insurance cover of ₹30,000 (in addition to accidental insurance of ₹2 lakh for cards issued after 28 Aug 2018).",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
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
