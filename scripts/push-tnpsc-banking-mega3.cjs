require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const BASE  = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
const KEY   = 'quiz:subject:banking';
const HDR   = { Authorization:`Bearer ${TOKEN}`, 'Content-Type':'application/json' };

const questions = [
  // More Banking Concepts
  {
    question_text: "Inflation targeting by RBI aims to maintain CPI inflation at:",
    options: ["2%", "4% with ±2% band", "6%", "3%"],
    correct_answer: 1,
    explanation: "RBI's inflation target is 4% CPI inflation with a tolerance band of ±2% (i.e., 2-6%). This was formalised in 2016 under the Monetary Policy Framework Agreement.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Bank credit growth is measured as annual % change in:",
    options: ["Bank profits", "Total outstanding bank loans and advances", "Deposits", "Number of bank accounts"],
    correct_answer: 1,
    explanation: "Bank credit growth measures the year-on-year percentage change in total outstanding loans and advances extended by banks to various sectors of the economy.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The term 'Stagflation' refers to a situation with:",
    options: ["High growth and low inflation", "High inflation and stagnant economic growth (with high unemployment)", "Deflation and growth", "Low inflation and high growth"],
    correct_answer: 1,
    explanation: "Stagflation is an economic condition combining stagnant economic growth, high unemployment, and high inflation — a rare and difficult-to-manage situation.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'twin balance sheet problem' in India refers to stressed balance sheets of:",
    options: ["Central and state governments", "Corporate sector and banking sector", "Export and import sectors", "Public and private sector PSUs"],
    correct_answer: 1,
    explanation: "The twin balance sheet problem refers to heavily indebted corporates (unable to repay loans) and banks burdened with NPAs, constraining credit growth.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "What is 'haircut' in banking/finance?",
    options: ["Banks' profit margin", "Reduction in value of an asset when used as collateral", "Fee charged for banking services", "Banker's salary cut"],
    correct_answer: 1,
    explanation: "A haircut is the difference between the market value of an asset and the value assigned to it when used as collateral. E.g., a 10% haircut on ₹100 asset means it's valued at ₹90 as collateral.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "In Insolvency & Bankruptcy Code (IBC), the resolution process for corporates must be completed within:",
    options: ["90 days", "180 days (extendable to 270 days)", "1 year", "2 years"],
    correct_answer: 1,
    explanation: "Under IBC, the Corporate Insolvency Resolution Process (CIRP) must be completed within 180 days, extendable by 90 days (total 270 days) with NCLT approval.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // Investment Products
  {
    question_text: "National Savings Certificate (NSC) has a maturity period of:",
    options: ["3 years", "5 years", "7 years", "10 years"],
    correct_answer: 1,
    explanation: "NSC has a maturity period of 5 years. Interest is compounded annually but paid at maturity. Investments qualify for tax deduction under Section 80C.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "Senior Citizens Savings Scheme (SCSS) has a tenure of:",
    options: ["3 years", "5 years (extendable by 3 years)", "7 years", "10 years"],
    correct_answer: 1,
    explanation: "SCSS has a tenure of 5 years, extendable by 3 more years. It is available to those above 60 years (55 years for retirees). It offers higher interest rates than FDs.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "KVP (Kisan Vikas Patra) doubles the investment in approximately:",
    options: ["7 years", "8 years", "10 years", "Depends on interest rate"],
    correct_answer: 3,
    explanation: "KVP's doubling period changes with interest rates. At the current rate (7.5% p.a.), it doubles in approximately 115 months (~9 years 7 months). The period varies with rate revisions.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "Sukanya Samriddhi Yojana (SSY) can be opened for a girl child up to age:",
    options: ["5 years", "8 years", "10 years", "12 years"],
    correct_answer: 2,
    explanation: "Sukanya Samriddhi Account (SSA) can be opened for a girl child below 10 years of age. Deposits can be made for 15 years and the account matures when the girl turns 21.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The interest on Sukanya Samriddhi Account is:",
    options: ["Taxable", "Tax-exempt (EEE – exempt at investment, accrual, and withdrawal)", "Partially taxable", "Taxable above ₹1 lakh"],
    correct_answer: 1,
    explanation: "SSA has EEE tax status — investment qualifies for 80C deduction, interest accrued is exempt, and maturity amount is tax-free.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // RBI Functions
  {
    question_text: "The RBI's Market Stabilisation Scheme (MSS) was introduced to absorb excess liquidity arising from:",
    options: ["Fiscal deficit", "Large capital inflows (forex)", "CRR reduction", "Government bond issuance"],
    correct_answer: 1,
    explanation: "MSS was introduced in 2004 to sterilise excess liquidity arising from large capital inflows. RBI issues government securities under MSS to absorb surplus rupees.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'Liquidity Adjustment Facility' (LAF) consists of:",
    options: ["CRR and SLR adjustments", "Repo and Reverse Repo operations", "Open Market Operations", "Bank Rate adjustments"],
    correct_answer: 1,
    explanation: "LAF is the mechanism through which RBI injects or absorbs daily liquidity via Repo (injection) and Reverse Repo (absorption) operations.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Standing Deposit Facility (SDF) introduced in 2022 allows banks to park excess liquidity with RBI:",
    options: ["At a rate higher than Reverse Repo", "Without any collateral at a rate below Repo", "At the Bank Rate", "Only overnight"],
    correct_answer: 1,
    explanation: "SDF (introduced April 2022) allows banks to deposit excess funds with RBI without pledging any collateral. SDF rate is lower than Repo Rate but may be higher than Reverse Repo rate.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's Sovereign Wealth Fund equivalent is:",
    options: ["NIIF (National Investment and Infrastructure Fund)", "EPFO", "NPS", "LIC"],
    correct_answer: 0,
    explanation: "NIIF (National Investment and Infrastructure Fund), set up in 2015, is India's quasi-sovereign wealth fund that invests in infrastructure and growth sectors.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // Types of Risks in Banking
  {
    question_text: "Credit Risk in banking refers to the risk of:",
    options: ["Interest rate changes", "Borrowers failing to repay loans", "Technology failures", "Currency fluctuation"],
    correct_answer: 1,
    explanation: "Credit risk is the risk of financial loss due to a borrower's failure to make required repayments. It is the primary risk faced by banks.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Liquidity Risk in banking refers to:",
    options: ["Risk of losing customers", "Risk that a bank may not be able to meet its financial obligations", "Risk from stock market", "Risk of NPA increase"],
    correct_answer: 1,
    explanation: "Liquidity risk is the risk that a bank may not be able to meet its short-term financial obligations due to inability to convert assets to cash quickly enough.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Systemic Risk is the risk that the failure of one financial institution:",
    options: ["Only affects shareholders", "Triggers a cascade of failures across the financial system", "Affects only that bank's customers", "Has no broader impact"],
    correct_answer: 1,
    explanation: "Systemic risk is the risk that the failure of one institution could trigger a domino effect — causing widespread failures across the financial system.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Indian Banking Milestones
  {
    question_text: "The first cooperative bank in India was established in:",
    options: ["1889", "1896", "1904", "1912"],
    correct_answer: 2,
    explanation: "The first cooperative credit societies in India were established under the Cooperative Credit Societies Act 1904, with the first being Kanyakumari Cooperative Society.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The first foreign bank to start operations in India was:",
    options: ["HSBC", "Standard Chartered (Chartered Mercantile Bank)", "Citibank", "Deutsche Bank"],
    correct_answer: 1,
    explanation: "The Chartered Mercantile Bank (1853) was among the first foreign banks in India. Standard Chartered was formed by the merger of Chartered Bank and Standard Bank. HSBC also has a long history in India.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's first women-owned commercial bank (Bhartiya Mahila Bank) was merged with:",
    options: ["HDFC Bank", "SBI", "PNB", "Bank of Baroda"],
    correct_answer: 1,
    explanation: "Bhartiya Mahila Bank, India's first bank exclusively for women (established 2013), was merged with State Bank of India (SBI) in 2017.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Bank of India was established in which year?",
    options: ["1895", "1900", "1906", "1912"],
    correct_answer: 2,
    explanation: "Bank of India was founded in 1906 by a group of eminent businessmen in Mumbai. It was nationalised in 1969.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "Punjab National Bank (PNB), the second largest PSB, was founded in:",
    options: ["1894", "1900", "1906", "1910"],
    correct_answer: 0,
    explanation: "Punjab National Bank was founded in 1894 in Lahore (now in Pakistan). It was the first bank to have been founded by Indians, with fully Indian management.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Financial Crisis and Resolution
  {
    question_text: "The 2008 global financial crisis was triggered primarily by the collapse of:",
    options: ["Dotcom companies", "Subprime mortgage market and mortgage-backed securities", "Sovereign debt", "Commodity prices"],
    correct_answer: 1,
    explanation: "The 2008 Global Financial Crisis was triggered by the collapse of the subprime mortgage market in the USA, which infected mortgage-backed securities held by banks worldwide.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Systemically Important Banks (SIBs) in India are also known as:",
    options: ["Universal Banks", "D-SIBs (Domestic Systemically Important Banks)", "Priority Sector Banks", "Scheduled Banks"],
    correct_answer: 1,
    explanation: "D-SIBs (Domestic Systemically Important Banks) are banks whose failure can have serious consequences for the financial system. RBI designates them and requires higher capital buffers.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Asset Reconstruction Company (ARC) in India buys NPAs from banks at:",
    options: ["Full value", "A discount (below book value)", "A premium", "Face value with interest"],
    correct_answer: 1,
    explanation: "ARCs purchase NPAs from banks at a discounted price (below book value). They then attempt to recover the full amount or resolve the assets, profiting from the difference.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Key Government Banking Schemes
  {
    question_text: "Pradhan Mantri Mudra Yojana (PMMY) was launched in which year?",
    options: ["2014", "2015", "2016", "2017"],
    correct_answer: 1,
    explanation: "PMMY was launched on April 8, 2015 to provide institutional credit to non-corporate, non-farm small/micro enterprises through MUDRA Bank (now MUDRA Ltd).",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE) provides:",
    options: ["Direct loans to MSMEs", "Guarantee cover to banks for collateral-free MSME loans", "Subsidised interest rates", "Government grants to MSMEs"],
    correct_answer: 1,
    explanation: "CGTMSE provides collateral-free credit guarantees to banks and financial institutions for loans to MSMEs up to ₹5 crore, helping MSMEs without assets to get loans.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Emergency Credit Line Guarantee Scheme (ECLGS) was launched during:",
    options: ["Demonetisation 2016", "COVID-19 pandemic 2020", "Global financial crisis 2008", "2018 IL&FS crisis"],
    correct_answer: 1,
    explanation: "ECLGS was launched in May 2020 under Aatmanirbhar Bharat package to provide 100% guaranteed collateral-free loans to MSMEs hit by COVID-19.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Voluntary Retention Route (VRR) allows Foreign Portfolio Investors (FPIs) to invest in:",
    options: ["Equity markets", "Government and corporate bonds with minimum retention period", "Real estate", "Gold"],
    correct_answer: 1,
    explanation: "VRR was introduced by RBI (2019) to attract long-term FPI investment in debt instruments (government and corporate bonds) with mandatory 3-year minimum retention.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // Bank Products
  {
    question_text: "A 'Letter of Credit' (LC) in banking is a document issued by a bank that:",
    options: ["Certifies a customer's creditworthiness", "Guarantees payment to a seller on behalf of a buyer", "Approves a home loan", "Lists all bank branches"],
    correct_answer: 1,
    explanation: "A Letter of Credit is a bank document guaranteeing that a buyer's payment to a seller will be received on time. If the buyer can't pay, the bank covers the full or remaining amount.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "A Bank Guarantee (BG) is different from a Letter of Credit in that:",
    options: ["BG is only for imports", "BG is an obligation to pay if the customer fails; LC ensures payment in trade transactions", "LC is for domestic trade only", "BG covers credit risk only"],
    correct_answer: 1,
    explanation: "Both are bank undertakings: LC is used for payment in international trade. BG is a promise to pay if a party fails to fulfill contractual obligations (performance/financial guarantee).",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "An 'overdraft' facility allows a current account holder to:",
    options: ["Earn extra interest", "Withdraw more than the available balance up to a sanctioned limit", "Open multiple accounts", "Transfer funds internationally"],
    correct_answer: 1,
    explanation: "An overdraft is a credit facility where a current account holder can withdraw funds beyond their available balance up to a pre-approved limit, paying interest on the overdrawn amount.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "Cash Credit (CC) facility is most commonly availed by:",
    options: ["Students for education", "Businesses for working capital needs", "Individuals for home purchase", "Governments for deficit financing"],
    correct_answer: 1,
    explanation: "Cash Credit is a short-term loan facility where businesses can borrow up to a specified limit to meet working capital requirements. Interest is charged only on the amount utilised.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Financial Literacy
  {
    question_text: "KYC documents in India include:",
    options: ["Voter ID and Aadhaar only", "Aadhaar, PAN, Passport, Driving Licence, Voter ID, etc.", "Only Passport", "Only PAN card"],
    correct_answer: 1,
    explanation: "Officially Valid Documents (OVDs) for KYC include: Aadhaar, Passport, Driving Licence, Voter ID, NREGA Job Card, and National Population Register letter.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "AML (Anti-Money Laundering) compliance requires banks to report cash transactions above:",
    options: ["₹5 lakh", "₹10 lakh", "₹20 lakh", "₹1 crore"],
    correct_answer: 1,
    explanation: "Banks must report Cash Transaction Reports (CTR) to FIU-India for all cash transactions (both deposits and withdrawals) above ₹10 lakh in a month.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Which bank in India has the largest network of branches?",
    options: ["Bank of Baroda", "Punjab National Bank", "State Bank of India", "Canara Bank"],
    correct_answer: 2,
    explanation: "SBI has the largest banking network in India with over 22,000 branches and 65,000+ ATMs as of 2024.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "RBI's 'Project Financial Literacy' aims to:",
    options: ["Train bankers in finance", "Spread financial literacy among common people including students, rural masses, SHGs", "Provide scholarships to finance students", "Train RBI employees"],
    correct_answer: 1,
    explanation: "Project Financial Literacy (RBI, 2007) aims to spread basic financial literacy about RBI, banking concepts, and financial products to various target groups including rural people, students, and SHGs.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  // Miscellaneous Banking
  {
    question_text: "The 'Minimum Alternate Tax (MAT)' concept applies to:",
    options: ["Savings account holders", "Companies that must pay a minimum tax even if normal tax is zero", "Foreign banks operating in India", "Banks with NPAs above a threshold"],
    correct_answer: 1,
    explanation: "MAT (under Income Tax Act Section 115JB) requires companies with zero or very low tax liability (due to deductions/exemptions) to pay at least 15% of book profits as tax.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'Net Interest Margin (NIM)' is a key profitability measure for banks, calculated as:",
    options: ["Net profit / Total assets", "(Interest income - Interest paid) / Average earning assets", "Return on equity", "Operating expenses / Revenue"],
    correct_answer: 1,
    explanation: "NIM measures the difference between interest income generated and interest paid out, relative to interest-earning assets. Higher NIM indicates better bank profitability.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Return on Assets (ROA) ratio for banks measures:",
    options: ["Revenue per employee", "Profitability as a percentage of total assets", "Capital adequacy", "NPA ratio"],
    correct_answer: 1,
    explanation: "ROA = Net Profit / Total Assets × 100. It measures how efficiently a bank uses its assets to generate profit. A higher ROA indicates better management efficiency.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Which organisation conducts the stress tests for Indian banks annually?",
    options: ["SEBI", "Ministry of Finance", "Reserve Bank of India", "IBA (Indian Banks Association)"],
    correct_answer: 2,
    explanation: "RBI conducts macro stress tests on Indian banks as part of its Financial Stability Report (FSR) to assess resilience under adverse macroeconomic scenarios.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'Account Portability' in banking refers to:",
    options: ["Using ATMs of other banks", "Ability to keep same account number while changing banks", "Mobile banking on any device", "Using virtual accounts"],
    correct_answer: 1,
    explanation: "Account portability (not yet fully implemented in India) would allow customers to switch banks while retaining their account number, similar to mobile number portability.",
    difficulty: "hard",
    exam_types: ["tnpsc"]
  },
  // Special Economic Zones & Banking
  {
    question_text: "IFSC (International Financial Services Centre) in India is located at:",
    options: ["SEEPZ Mumbai", "GIFT City, Gandhinagar", "Noida Special Economic Zone", "Pune IT Park"],
    correct_answer: 1,
    explanation: "India's first IFSC is established at GIFT City (Gujarat International Finance Tec-City) in Gandhinagar, allowing international financial services within India.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "IFSCA (International Financial Services Centres Authority) was established to regulate:",
    options: ["All foreign banks in India", "Financial services in IFSCs like GIFT City", "Foreign investment in India", "Indian banks operating abroad"],
    correct_answer: 1,
    explanation: "IFSCA was set up in 2020 as an integrated regulator for financial services in IFSCs (GIFT City), covering banking, insurance, securities, and funds.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // Important Banking Dates
  {
    question_text: "The 14 Indian Banks were nationalised on:",
    options: ["July 19, 1969", "August 15, 1969", "January 1, 1970", "April 1, 1969"],
    correct_answer: 0,
    explanation: "14 major commercial banks were nationalised by PM Indira Gandhi's ordinance on July 19, 1969. The 6 more banks were nationalised on April 15, 1980.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Demonetisation in India was announced by PM Modi on:",
    options: ["November 8, 2016", "September 30, 2016", "January 1, 2017", "October 15, 2016"],
    correct_answer: 0,
    explanation: "PM Narendra Modi announced demonetisation of ₹500 and ₹1000 currency notes on November 8, 2016. New ₹500 and ₹2000 notes were introduced.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "After demonetisation (2016), which new note was introduced but later discontinued?",
    options: ["₹200 note", "₹2000 note", "₹500 new note", "₹1000 new note"],
    correct_answer: 1,
    explanation: "₹2000 note was introduced after demonetisation in 2016. In May 2023, RBI announced withdrawal of ₹2000 notes from circulation, though they remain legal tender.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  // Banking Regulation & Supervision
  {
    question_text: "RBI conducts on-site inspections of banks under:",
    options: ["Companies Act", "Section 35 of Banking Regulation Act", "FEMA", "RBI Act Section 42"],
    correct_answer: 1,
    explanation: "RBI inspects commercial banks under Section 35 of the Banking Regulation Act 1949. CAMELS (Capital, Asset quality, Management, Earnings, Liquidity, Systems) rating is used.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Annual Report of a bank must be approved by:",
    options: ["RBI Governor", "Shareholders at AGM", "Ministry of Finance", "SEBI"],
    correct_answer: 1,
    explanation: "Annual reports of banks (listed companies) must be approved by shareholders at the Annual General Meeting (AGM), similar to other public limited companies.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "Which Act governs the operations of Regional Rural Banks (RRBs)?",
    options: ["Banking Regulation Act 1949", "Regional Rural Banks Act 1976", "RBI Act 1934", "Cooperative Societies Act"],
    correct_answer: 1,
    explanation: "RRBs are governed by the Regional Rural Banks Act 1976. They are sponsored by public sector banks and can only operate in specific areas.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // More Banking Concepts
  {
    question_text: "The 'Debt-to-Equity Ratio' for a bank measures:",
    options: ["How much profit it makes", "Proportion of financing from creditors (debt) versus shareholders (equity)", "NPA ratio", "Liquidity position"],
    correct_answer: 1,
    explanation: "Debt-to-Equity ratio = Total Liabilities / Shareholders' Equity. For banks, this includes deposits and borrowings as debt.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's payment aggregator and payment gateway (PA/PG) is regulated by:",
    options: ["Ministry of Finance", "NPCI", "RBI", "SEBI"],
    correct_answer: 2,
    explanation: "Payment Aggregators (PAs) and Payment Gateways (PGs) are regulated by the Reserve Bank of India under the Payment and Settlement Systems Act 2007.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Tokenisation of credit/debit cards was mandated by RBI for card-on-file transactions from:",
    options: ["January 2022", "October 2022", "January 2023", "October 2021"],
    correct_answer: 1,
    explanation: "RBI mandated card tokenisation for card-on-file (CoF) storage from October 1, 2022. Merchants cannot store actual card data; instead, unique tokens are used.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'NACH' (National Automated Clearing House) system operates for:",
    options: ["Real-time fund transfer", "Bulk electronic transactions (ECS, salary, dividend, subsidy disbursements)", "International remittances", "Cash management"],
    correct_answer: 1,
    explanation: "NACH is NPCI's payment system for processing high-volume, interbank, low-value transactions like ECS credits (salary, dividends, subsidy) and ECS debits (EMI, insurance premiums).",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'Bharat Bill Payment System (BBPS)' is operated by:",
    options: ["RBI directly", "NPCI Bharat BillPay Limited (NBBL)", "Ministry of Finance", "All banks jointly"],
    correct_answer: 1,
    explanation: "BBPS/Bharat BillPay is operated by NPCI Bharat BillPay Limited (NBBL), a subsidiary of NPCI. It allows bill payment for utilities, insurance, education fees, etc.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's 'Central Payments Intelligence Platform (CPIP)' was developed to:",
    options: ["Launch new payment products", "Detect and prevent payment frauds through data analytics", "Regulate fintech companies", "Issue digital currency"],
    correct_answer: 1,
    explanation: "CPIP is RBI's initiative to integrate data from payment systems for fraud detection and prevention using advanced analytics and machine learning.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "SWIFT (Society for Worldwide Interbank Financial Telecommunication) is used for:",
    options: ["Domestic fund transfers", "International interbank messaging and fund transfers", "Central bank monetary policy communication", "Internal bank audit"],
    correct_answer: 1,
    explanation: "SWIFT provides a secure messaging network for international financial transactions between banks and financial institutions worldwide. India uses SFMS domestically.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Neobanks or Digital Banks differ from traditional banks in that they:",
    options: ["Have more branches", "Operate entirely online without physical branches", "Only offer savings accounts", "Are government-owned"],
    correct_answer: 1,
    explanation: "Neobanks are digital-only financial services companies with no physical branches. They offer banking-like services through mobile apps and websites.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "India's FASTag (for highway tolls) is linked to a prepaid wallet or bank account and uses:",
    options: ["NFC technology", "RFID (Radio Frequency Identification) technology", "Bluetooth", "QR code scanning"],
    correct_answer: 1,
    explanation: "FASTag uses RFID technology — a tag on the windshield communicates with RFID readers at toll plazas for automatic toll deduction without stopping.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "The 'One Time Password' (OTP) based 2-factor authentication for digital banking transactions was mandated by:",
    options: ["SEBI", "RBI", "MeitY", "NPCI"],
    correct_answer: 1,
    explanation: "RBI mandated two-factor authentication (including OTP) for online transactions under the Payment Card Security guidelines to protect against fraud.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "India's Goods and Services Tax Network (GSTN) serves the banking sector by enabling:",
    options: ["GST payment through banks", "Verification of GSTIN for business loans/credit", "Tax audit of banks", "Bank transfer of GST collections"],
    correct_answer: 1,
    explanation: "Banks use GSTN/GSTIN data for borrower verification, GST payment services, and to assess the financial health of MSME/corporate borrowers applying for credit.",
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
