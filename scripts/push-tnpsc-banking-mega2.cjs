require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const BASE  = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
const KEY   = 'quiz:subject:banking';
const HDR   = { Authorization:`Bearer ${TOKEN}`, 'Content-Type':'application/json' };

const questions = [
  // More Banking Fundamentals
  {
    question_text: "Which of these is NOT a function of the Reserve Bank of India?",
    options: ["Issue currency notes", "Banker to the government", "Regulate commercial banks", "Accept deposits from the public"],
    correct_answer: 3,
    explanation: "RBI does not accept deposits from the general public. Its functions include issuing currency, acting as banker to government, regulating banks, managing forex, and maintaining monetary stability.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The RBI Act empowers RBI to issue currency notes of all denominations except the ₹1 note. Who issues ₹1 note?",
    options: ["SBI", "Ministry of Finance", "NPCI", "GOI through RBI"],
    correct_answer: 1,
    explanation: "The ₹1 note is issued by the Government of India (Ministry of Finance) and bears the signature of the Finance Secretary. RBI issues all other denominations.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's 'Prompt Corrective Action (PCA)' framework applies to banks that:",
    options: ["Open new branches", "Breach certain risk thresholds (NPA, capital, returns)", "Merge with other banks", "Launch new products"],
    correct_answer: 1,
    explanation: "PCA is an RBI framework that restricts the activities of banks that breach thresholds on capital adequacy, asset quality (NPA), and profitability metrics.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'Bad Bank' concept in India refers to:",
    options: ["Failed commercial banks", "National Asset Reconstruction Company Limited (NARCL)", "Banks under PCA", "Banks with negative growth"],
    correct_answer: 1,
    explanation: "India's 'Bad Bank' — NARCL (National Asset Reconstruction Company Ltd) — was set up in 2021 to acquire stressed assets (NPAs) from banks and resolve them.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "What is a 'Bank Run'?",
    options: ["Bank's annual marathon event", "Mass withdrawal of deposits by panicked customers", "Banks running multiple branches", "Banks issuing too many loans"],
    correct_answer: 1,
    explanation: "A bank run occurs when a large number of customers withdraw their deposits simultaneously due to fear that the bank may fail, which can actually cause the bank to become insolvent.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Which of the following is a Public Sector Bank in India?",
    options: ["HDFC Bank", "ICICI Bank", "Canara Bank", "Axis Bank"],
    correct_answer: 2,
    explanation: "Canara Bank is a Public Sector Bank (PSB) — a government-owned bank. HDFC, ICICI, and Axis Bank are private sector banks.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "How many public sector banks are there in India as of 2024?",
    options: ["19", "12", "27", "10"],
    correct_answer: 1,
    explanation: "After the merger of several PSBs between 2017-2020, India has 12 Public Sector Banks as of 2024 (down from 27 in 2017).",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The term 'Credit Crunch' refers to:",
    options: ["Increase in available credit", "Sudden reduction in the availability of loans and credit", "Rising inflation", "Decline in currency value"],
    correct_answer: 1,
    explanation: "A credit crunch occurs when there is a sudden reduction in the availability of loans or credit from financial institutions, often due to tightened lending standards.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'Lender of Last Resort' function is performed by:",
    options: ["Finance Ministry", "Reserve Bank of India", "SBI", "NABARD"],
    correct_answer: 1,
    explanation: "The RBI acts as the lender of last resort to commercial banks facing a liquidity crisis — providing emergency credit to prevent banking system collapse.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "LIBOR (London Interbank Offered Rate) has been replaced by:",
    options: ["MIBOR", "SOFR (Secured Overnight Financing Rate)", "EONIA", "TIBOR"],
    correct_answer: 1,
    explanation: "LIBOR was phased out by June 2023 and replaced primarily by SOFR (Secured Overnight Financing Rate) in the USA and other risk-free rates in other markets.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // Accounts & Deposits
  {
    question_text: "A Current Account is primarily used by:",
    options: ["Salaried individuals", "Students", "Businesses for frequent transactions", "Retirees"],
    correct_answer: 2,
    explanation: "Current accounts are designed for businesses and individuals with high transaction volumes. They offer unlimited transactions but earn no interest.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "The minimum balance requirement in a savings account varies by bank. Zero-balance savings accounts are called:",
    options: ["Premium accounts", "Basic Savings Bank Deposit (BSBD) accounts", "NRI accounts", "Fixed accounts"],
    correct_answer: 1,
    explanation: "Basic Savings Bank Deposit (BSBD) accounts (introduced 2012) require no minimum balance and provide basic banking facilities to promote financial inclusion.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "An NRE (Non-Resident External) account is opened by NRIs to park their:",
    options: ["Indian rupee earnings", "Foreign earnings converted to INR", "Indian property income", "All of the above"],
    correct_answer: 1,
    explanation: "NRE accounts allow NRIs to park their foreign earnings in India. They are maintained in Indian rupees. Both principal and interest are freely repatriable.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "An FCNR (Foreign Currency Non-Resident) account is maintained in:",
    options: ["Indian rupees only", "Foreign currency (USD, GBP, EUR, etc.)", "Special Drawing Rights", "Gold-backed currency"],
    correct_answer: 1,
    explanation: "FCNR(B) accounts are term deposits held in foreign currency (USD, GBP, EUR, CAD, AUD, JPY). They protect against exchange rate fluctuations.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "A dormant account is one that has had no transactions for:",
    options: ["6 months", "1 year", "2 years", "5 years"],
    correct_answer: 2,
    explanation: "An account is classified as dormant/inoperative after 2 years of no customer-initiated transactions. Banks try to activate these by contacting customers.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "PPF (Public Provident Fund) accounts have a lock-in period of:",
    options: ["3 years", "5 years", "10 years", "15 years"],
    correct_answer: 3,
    explanation: "PPF has a maturity period of 15 years. Partial withdrawal is allowed from the 7th year. It offers tax exemption under Section 80C and EEE (Exempt-Exempt-Exempt) status.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  // Loans and Credit
  {
    question_text: "In India, the Benchmark Prime Lending Rate (BPLR) system was replaced by:",
    options: ["LIBOR", "Base Rate, then MCLR", "Repo Rate", "CRR-based rate"],
    correct_answer: 1,
    explanation: "BPLR was replaced by Base Rate in 2010, and then by MCLR (Marginal Cost of Funds Based Lending Rate) in April 2016 for better interest rate transmission.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "MCLR (Marginal Cost of Funds-Based Lending Rate) was introduced in India in:",
    options: ["2014", "2015", "2016", "2017"],
    correct_answer: 2,
    explanation: "MCLR replaced the Base Rate system from April 1, 2016. New loans from that date were linked to MCLR for better transmission of monetary policy.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "From October 2019, RBI mandated banks to link new floating rate retail loans to:",
    options: ["MCLR", "LIBOR", "External Benchmark Rate (Repo Rate)", "Bank Rate"],
    correct_answer: 2,
    explanation: "From October 2019, RBI mandated all new floating rate loans in the retail and MSME segment be linked to an External Benchmark Rate (Repo Rate, T-Bill rate, etc.).",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "A 'Secured Loan' is one where:",
    options: ["The borrower has a good credit score", "The loan is backed by collateral/security", "Interest rate is fixed", "Repayment is guaranteed by government"],
    correct_answer: 1,
    explanation: "A secured loan requires the borrower to pledge an asset (house, vehicle, gold, etc.) as collateral. If the borrower defaults, the lender can claim the asset.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "Home loans in India are regulated by:",
    options: ["NHB (National Housing Bank)", "SEBI", "Ministry of Housing", "HUDCO"],
    correct_answer: 0,
    explanation: "The National Housing Bank (NHB), a subsidiary of RBI established in 1988, regulates housing finance companies (HFCs) that provide home loans.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Under Section 80C of Income Tax Act, investments in which instrument qualify for tax deduction?",
    options: ["Shares in private companies", "PPF, ELSS, NSC, LIC premium, etc.", "Savings account interest", "Fixed Deposit in private banks (all)"],
    correct_answer: 1,
    explanation: "Section 80C allows deduction of up to ₹1.5 lakh for investments in PPF, ELSS, NSC, life insurance premiums, tax-saving FDs (5 yr), SCSS, ULIP, home loan principal, etc.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "Kisan Credit Card (KCC) scheme provides short-term credit to farmers for:",
    options: ["Purchase of land", "Working capital for agricultural operations, post-harvest expenses", "Home construction", "Children's education"],
    correct_answer: 1,
    explanation: "KCC provides farmers with timely credit for agricultural operations, maintenance of farm assets, post-harvest expenses, and short-term credit needs at subsidised rates.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  // Financial Markets 2
  {
    question_text: "A 'Bull Market' refers to a market where:",
    options: ["Prices are falling", "Prices are rising consistently", "Trading is restricted", "Only bonds are traded"],
    correct_answer: 1,
    explanation: "A bull market is a market condition where prices of securities are rising or expected to rise. A 'bear market' is the opposite — prices falling 20%+ from recent highs.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "Mutual Funds in India are regulated by:",
    options: ["RBI", "IRDAI", "SEBI", "Ministry of Finance"],
    correct_answer: 2,
    explanation: "Mutual funds in India are regulated by SEBI under the SEBI (Mutual Funds) Regulations, 1996.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "An 'ELSS' (Equity Linked Savings Scheme) has a lock-in period of:",
    options: ["1 year", "2 years", "3 years", "5 years"],
    correct_answer: 2,
    explanation: "ELSS mutual funds have a mandatory lock-in period of 3 years — the shortest lock-in among tax-saving instruments under Section 80C.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "NAV (Net Asset Value) of a mutual fund unit is calculated as:",
    options: ["Total assets of fund / number of units", "(Total assets - Total liabilities) / number of outstanding units", "Face value of units", "Purchase price of fund"],
    correct_answer: 1,
    explanation: "NAV = (Total Assets - Total Liabilities) / Number of Outstanding Units. It is calculated at the end of each trading day.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "SIP (Systematic Investment Plan) in mutual funds means:",
    options: ["Single large investment", "Regular fixed-amount investments at periodic intervals", "Investing only in safe bonds", "Government-guaranteed returns"],
    correct_answer: 1,
    explanation: "SIP allows investors to invest a fixed amount at regular intervals (weekly, monthly) in mutual funds. It averages out purchase cost (rupee cost averaging) and builds discipline.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "A 'Debt Mutual Fund' primarily invests in:",
    options: ["Company shares", "Fixed income instruments (bonds, T-bills, commercial paper)", "Gold and commodities", "Real estate"],
    correct_answer: 1,
    explanation: "Debt funds invest primarily in fixed-income securities like government bonds, corporate bonds, T-bills, and money market instruments. They are less risky than equity funds.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  // Banking History
  {
    question_text: "The first bank established in India was:",
    options: ["Bank of Bengal", "Bank of Calcutta", "Bank of Hindostan", "Allahabad Bank"],
    correct_answer: 2,
    explanation: "Bank of Hindostan (1770) was the first bank established in India. Bank of Calcutta (1806, later renamed Bank of Bengal) was the first Presidency Bank.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The three Presidency Banks (Bank of Bengal, Bank of Bombay, Bank of Madras) were merged to form the:",
    options: ["State Bank of India", "Reserve Bank of India", "Imperial Bank of India", "Bank of India"],
    correct_answer: 2,
    explanation: "The three Presidency Banks were merged in 1921 to form the Imperial Bank of India, which was later nationalised in 1955 to become the State Bank of India.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 14 major banks nationalised in July 1969 were those with deposits exceeding:",
    options: ["₹50 crore", "₹100 crore", "₹200 crore", "₹500 crore"],
    correct_answer: 1,
    explanation: "PM Indira Gandhi nationalised 14 major commercial banks in July 1969 — those with deposits of ₹100 crore or more. This covered 80% of bank deposits.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Narasimham Committee (1991) recommended:",
    options: ["Bank nationalisation", "Financial sector reforms — reducing CRR/SLR, PSL targets, competition", "Creation of development banks", "UPI framework"],
    correct_answer: 1,
    explanation: "The first Narasimham Committee (1991) recommended liberalisation of the banking sector: reducing CRR and SLR, freeing interest rates, allowing new private banks, reducing PSL targets.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Special Banking
  {
    question_text: "Small Finance Banks (SFBs) need a minimum paid-up equity capital of:",
    options: ["₹100 crore", "₹200 crore", "₹500 crore", "₹1000 crore"],
    correct_answer: 0,
    explanation: "Small Finance Banks require minimum paid-up equity capital of ₹200 crore (raised from ₹100 crore for existing SFBs seeking universal bank status the threshold is different).",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Which is the first Small Finance Bank in India?",
    options: ["Equitas SFB", "Ujjivan SFB", "Capital SFB (AU)", "Jana SFB"],
    correct_answer: 0,
    explanation: "Equitas Small Finance Bank was among the first SFBs to receive RBI approval (September 2015) and commence operations. AU Small Finance Bank also received early approval.",
    difficulty: "hard",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The role of 'Priority Sector' in banking includes mandated lending to:",
    options: ["Only agriculture", "Agriculture, MSME, housing, education, renewable energy, others", "Only government projects", "Export-oriented industries only"],
    correct_answer: 1,
    explanation: "RBI mandates 40% of ANBC towards Priority Sectors including agriculture (18%), MSME, education, housing, renewable energy, social infrastructure, export credit, and others.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'lead bank scheme' in India assigns responsibility for coordinating banking development in each district to:",
    options: ["RBI regional offices", "One designated bank for that district", "SBI in all districts", "NABARD"],
    correct_answer: 1,
    explanation: "Under the Lead Bank Scheme (1969), one bank is designated as the lead bank for each district to coordinate banking activities, prepare district credit plans, and promote financial inclusion.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // More Banking Terms
  {
    question_text: "The term 'Narrow Money' (M1) in India includes:",
    options: ["Currency + savings deposits", "Currency notes and coins in circulation + demand deposits", "All bank deposits", "Currency + fixed deposits"],
    correct_answer: 1,
    explanation: "M1 (Narrow Money) = Currency notes and coins + Demand Deposits (savings + current accounts) + Other deposits with RBI. It is the most liquid measure of money supply.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Broad Money (M3) includes all of M1 plus:",
    options: ["Gold reserves", "Fixed deposits and time deposits with banks", "Foreign exchange reserves", "Government bonds only"],
    correct_answer: 1,
    explanation: "M3 (Broad Money) = M1 + Time Deposits (fixed deposits) with banks. M3 is the most widely used measure for monetary policy analysis in India.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Velocity of money refers to:",
    options: ["Speed of digital transactions", "How quickly money circulates in the economy", "Interest rate changes", "Bank processing speed"],
    correct_answer: 1,
    explanation: "Velocity of money (MV = PQ) is the rate at which money circulates in the economy — how many times a unit of currency is used in transactions in a given period.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Financial Resolution and Deposit Insurance (FRDI) Bill (2017) proposed creating a:",
    options: ["New banking regulator", "Resolution Corporation to resolve failing financial firms", "National insurance fund", "Digital rupee"],
    correct_answer: 1,
    explanation: "The FRDI Bill (2017, later withdrawn) proposed a Resolution Corporation to take over and resolve failing banks and financial institutions before they collapsed.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "What does 'TDS' (Tax Deducted at Source) on fixed deposit interest mean?",
    options: ["Tax paid by bank on FD", "Tax deducted by bank on FD interest before crediting to customer", "Tax on withdrawal from FD", "GST on banking services"],
    correct_answer: 1,
    explanation: "Banks deduct TDS on FD interest exceeding ₹40,000/year (₹50,000 for senior citizens) at 10%. If PAN is not provided, TDS is deducted at 20%.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc"]
  },
  // Banking Regulations
  {
    question_text: "The Banking Regulation Act that governs commercial banks in India was enacted in:",
    options: ["1934", "1945", "1949", "1956"],
    correct_answer: 2,
    explanation: "The Banking Regulation Act was enacted in 1949. It provides a comprehensive framework for regulation and supervision of banking companies in India.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The RBI can direct banks to merge under which provision?",
    options: ["RBI Act Section 35", "Banking Regulation Act Section 45", "Companies Act", "IBC"],
    correct_answer: 1,
    explanation: "RBI can direct a bank to merge with another bank under Section 45 of the Banking Regulation Act in the public interest or to protect depositors.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Banking ombudsman scheme in India was launched to:",
    options: ["Regulate interest rates", "Resolve customer complaints against banks", "Audit bank accounts", "Supervise bank mergers"],
    correct_answer: 1,
    explanation: "Banking Ombudsman Scheme (1995, revised multiple times) provides a cost-free, expeditious mechanism for resolving customer complaints against deficiency in banking services.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The Integrated Ombudsman Scheme 2021 merged ombudsman schemes for banks, NBFCs, and:",
    options: ["Insurance companies", "Digital payment systems", "Both insurance and digital payments", "Mutual funds"],
    correct_answer: 1,
    explanation: "The Integrated Ombudsman Scheme 2021 merged the Banking Ombudsman, NBFC Ombudsman, and Digital Payments Ombudsman into one scheme. Insurance has a separate ombudsman.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // Economy-Banking Link
  {
    question_text: "When RBI increases Repo Rate, what typically happens to loan interest rates?",
    options: ["Decrease", "Increase", "Stay the same", "Become more volatile"],
    correct_answer: 1,
    explanation: "When RBI increases Repo Rate, banks' cost of borrowing from RBI increases, which is passed on to customers — leading to higher interest rates on home loans, car loans, etc.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "Quantitative Easing (QE) is a monetary policy tool where:",
    options: ["Taxes are reduced", "Central bank buys assets to inject liquidity into the economy", "Government increases spending", "Banks reduce lending rates"],
    correct_answer: 1,
    explanation: "QE is an unconventional monetary policy where a central bank purchases large quantities of government securities or other securities to increase money supply and stimulate the economy.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Credit Multiplier effect means that an initial deposit in a bank leads to:",
    options: ["Same amount of money creation", "Multiple times the initial deposit as credit in the economy", "Reduction in money supply", "Investment in government bonds"],
    correct_answer: 1,
    explanation: "The money multiplier effect: when a bank receives a deposit, it keeps a fraction as reserve and lends the rest, which becomes a deposit elsewhere, creating a multiplier effect on money supply.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Financial Sector Entities
  {
    question_text: "CIBIL (Credit Information Bureau India Limited) provides:",
    options: ["Banking licences", "Credit scores and credit reports for individuals and businesses", "Insurance products", "Forex services"],
    correct_answer: 1,
    explanation: "CIBIL (now TransUnion CIBIL) is one of four RBI-licensed credit information companies in India that maintain credit records and provide credit scores.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "The Housing Finance Company (HFC) is regulated by:",
    options: ["RBI only", "NHB (National Housing Bank) under RBI oversight", "SEBI", "Ministry of Housing"],
    correct_answer: 1,
    explanation: "Housing Finance Companies are regulated by the National Housing Bank (NHB). Post-2019, the regulatory oversight was also extended to RBI for some HFCs.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Gold Monetisation Scheme (GMS) allows households to:",
    options: ["Buy gold from government", "Deposit idle gold with banks to earn interest", "Import gold duty-free", "Exchange old gold for new jewellery"],
    correct_answer: 1,
    explanation: "Gold Monetisation Scheme (GMS, 2015) enables households and institutions to deposit their idle gold with designated banks and earn interest, while banks use the gold productively.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Sovereign Gold Bond (SGB) is issued by the Government of India through:",
    options: ["SEBI", "RBI", "NITI Aayog", "Ministry of Finance directly"],
    correct_answer: 1,
    explanation: "Sovereign Gold Bonds are issued by the Government of India through the Reserve Bank of India. They offer 2.5% interest per annum and can be used as collateral.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's first credit card was introduced by:",
    options: ["SBI Cards", "Central Bank of India (Centralcard)", "Citibank", "Standard Chartered"],
    correct_answer: 1,
    explanation: "Central Bank of India introduced India's first credit card 'Centralcard' in 1980. Citibank later popularised credit cards when it entered India in 1982.",
    difficulty: "hard",
    exam_types: ["tnpsc"]
  },
  // Banking Numbers
  {
    question_text: "IFSC (Indian Financial System Code) is a unique identifier of bank branches used for:",
    options: ["Identifying customers", "Electronic fund transfers (NEFT, RTGS, IMPS)", "Opening new accounts", "KYC verification"],
    correct_answer: 1,
    explanation: "IFSC is an 11-character code assigned to each bank branch participating in electronic fund transfer systems. Used in NEFT, RTGS, and IMPS transactions.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "MICR (Magnetic Ink Character Recognition) code on cheques helps in:",
    options: ["Encryption of cheque data", "Fast and accurate processing of cheques by machines", "Detecting forged cheques", "Printing cheques"],
    correct_answer: 1,
    explanation: "MICR code is a 9-digit code on cheques (printed with magnetic ink) that enables fast, accurate, and automated processing of cheques by cheque clearing machines.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "The 'Cheque Truncation System (CTS)' improves cheque processing by:",
    options: ["Eliminating cheques completely", "Transmitting cheque image electronically instead of physical movement", "Increasing cheque clearing time", "Requiring extra security features"],
    correct_answer: 1,
    explanation: "CTS eliminates the physical movement of cheques — instead, images and data of cheques are transmitted electronically for clearing, making the process faster and more secure.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The maximum validity period of a cheque in India is:",
    options: ["3 months", "6 months", "1 year", "Till amount is available"],
    correct_answer: 0,
    explanation: "In India, a cheque is valid for 3 months from the date of issue. After this period, the cheque becomes stale and the bank will not honour it.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  // Rural Banking
  {
    question_text: "Self-Help Groups (SHGs) in India are mostly linked to banks through the:",
    options: ["Government direct scheme", "SHG-Bank Linkage Programme by NABARD", "MFI route only", "Cooperative societies only"],
    correct_answer: 1,
    explanation: "NABARD launched the SHG-Bank Linkage Programme in 1992 to link savings-and-credit groups of rural poor women with banks, making it the world's largest microfinance programme.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Atal Pension Yojana (APY) is a pension scheme for:",
    options: ["Government employees", "Organised sector workers", "Unorganised sector workers (age 18-40)", "Senior citizens"],
    correct_answer: 2,
    explanation: "APY (2015) is a social security scheme for workers in the unorganised sector. It guarantees a pension of ₹1,000-₹5,000/month after age 60, based on contributions.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The minimum and maximum monthly pension under APY (Atal Pension Yojana) is:",
    options: ["₹500 to ₹2,000", "₹1,000 to ₹5,000", "₹500 to ₹10,000", "₹2,000 to ₹10,000"],
    correct_answer: 1,
    explanation: "Under APY, subscribers can receive guaranteed minimum pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000, or ₹5,000 per month after age 60, based on contributions started at age 18-40.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // More Key Concepts
  {
    question_text: "TDS deducted on bank interest is deposited to the government by the bank. The form for TDS certificate is:",
    options: ["Form 16", "Form 16A", "Form 26AS", "Form 15G"],
    correct_answer: 1,
    explanation: "Form 16A is the TDS certificate issued by banks for TDS deducted on interest income (FD, RD, etc.). Form 16 is for salary TDS.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "Form 15G/15H is submitted to banks to request:",
    options: ["Higher interest rate", "No TDS deduction on interest income", "Loan approval", "Change of nominee"],
    correct_answer: 1,
    explanation: "Form 15G (individuals below 60) and Form 15H (senior citizens) are declarations submitted to banks to avoid TDS on interest income when total income is below taxable limit.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "The 'Pradhan Mantri Jan Dhan Yojana' RuPay cards provide accidental insurance of:",
    options: ["₹50,000", "₹1 lakh", "₹2 lakh", "₹5 lakh"],
    correct_answer: 2,
    explanation: "PMJDY RuPay debit cards come with accidental insurance cover of ₹2 lakh (for accounts opened after August 28, 2018) and life insurance cover of ₹30,000.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Account aggregator (AA) framework allows customers to:",
    options: ["Aggregate multiple bank accounts for higher interest", "Share their financial data securely with third parties for services", "Merge multiple bank accounts", "Access loans without KYC"],
    correct_answer: 1,
    explanation: "Account Aggregator framework (RBI, 2021) enables customers to control and share their financial data across institutions (banks, insurers, mutual funds) with consent, in real time.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Financial Inclusion Index (FI-Index) published by RBI measures financial inclusion on a scale of:",
    options: ["0 to 10", "0 to 100", "1 to 50", "1 to 10"],
    correct_answer: 1,
    explanation: "RBI's FI-Index is a composite index measuring the extent of financial inclusion in India on a scale of 0 to 100 (0 = complete exclusion, 100 = full inclusion).",
    difficulty: "hard",
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
