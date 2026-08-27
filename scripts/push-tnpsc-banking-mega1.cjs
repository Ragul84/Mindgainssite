require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const BASE  = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
const KEY   = 'quiz:subject:banking';
const HDR   = { Authorization:`Bearer ${TOKEN}`, 'Content-Type':'application/json' };

const questions = [
  // Banking Basics
  {
    question_text: "The Reserve Bank of India was established in:",
    options: ["1930", "1934", "1935", "1947"],
    correct_answer: 2,
    explanation: "The Reserve Bank of India was established on April 1, 1935 under the Reserve Bank of India Act, 1934. It was nationalised in January 1949.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The headquarters of RBI is located in:",
    options: ["New Delhi", "Kolkata", "Mumbai", "Chennai"],
    correct_answer: 2,
    explanation: "RBI's central office (headquarters) is in Mumbai (Fort area). It was initially located in Kolkata and moved to Mumbai in 1937.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The SBI (State Bank of India) was formed through nationalisation of:",
    options: ["Imperial Bank of India", "Bank of India", "Central Bank of India", "Punjab National Bank"],
    correct_answer: 0,
    explanation: "SBI was formed in 1955 by nationalising the Imperial Bank of India (established 1921) through the State Bank of India Act, 1955.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "CRR (Cash Reserve Ratio) is the minimum percentage of deposits that banks must keep:",
    options: ["With themselves as cash", "With RBI as cash reserves", "Invested in government securities", "As liquid assets"],
    correct_answer: 1,
    explanation: "CRR is the minimum percentage of total deposits that commercial banks are required to maintain with the Reserve Bank of India in the form of cash reserves.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "SLR (Statutory Liquidity Ratio) requires banks to maintain a certain percentage of their deposits in:",
    options: ["Cash only", "Gold or approved securities", "Fixed deposits", "Foreign currency"],
    correct_answer: 1,
    explanation: "SLR requires every bank to maintain a specified percentage of their Net Demand and Time Liabilities (NDTL) in gold, government securities, or other approved liquid assets.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Repo Rate is the rate at which:",
    options: ["RBI borrows from commercial banks", "Commercial banks borrow from RBI", "Banks lend to each other", "RBI charges penalty"],
    correct_answer: 1,
    explanation: "Repo rate is the rate at which the Reserve Bank of India lends short-term funds to commercial banks against government securities.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The Reverse Repo Rate is the rate at which:",
    options: ["RBI lends to banks", "Banks park their excess funds with RBI", "Banks charge customers", "RBI penalises defaulters"],
    correct_answer: 1,
    explanation: "Reverse Repo Rate is the rate at which banks can park their excess short-term funds with the Reserve Bank of India. It is always lower than the Repo Rate.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Bank Rate is the rate at which RBI:",
    options: ["Lends funds against securities (short-term)", "Provides long-term credit to banks", "Lends overnight funds", "Charges CRR penalty"],
    correct_answer: 1,
    explanation: "Bank Rate (also called Discount Rate) is the rate at which the RBI is ready to buy or rediscount bills of exchange or other commercial paper. It is used for medium to long-term purposes.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The concept of NEFT (National Electronic Funds Transfer) allows transfer of:",
    options: ["Money up to ₹1 lakh only", "Any amount with no maximum limit", "Only ₹2 lakh at a time", "Only between same bank accounts"],
    correct_answer: 1,
    explanation: "NEFT allows transfer of any amount (no minimum or maximum limit set by RBI) between bank accounts. It was made 24×7 operational from December 2019.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "RTGS (Real Time Gross Settlement) is used for transfers of minimum:",
    options: ["₹1 lakh", "₹2 lakh", "₹5 lakh", "₹10 lakh"],
    correct_answer: 1,
    explanation: "RTGS is used for large-value transactions with a minimum amount of ₹2 lakh. It settles transactions in real time on a one-to-one basis.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  // Types of Banks
  {
    question_text: "A 'Scheduled Bank' is one that is included in the:",
    options: ["Companies Act", "Second Schedule of RBI Act 1934", "Banking Regulation Act", "FEMA Act"],
    correct_answer: 1,
    explanation: "A Scheduled Bank is a bank listed in the Second Schedule of the Reserve Bank of India Act, 1934. It must have a minimum paid-up capital and reserves of ₹5 lakh.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "A 'Cooperative Bank' in India is governed primarily under:",
    options: ["Companies Act", "RBI Act 1934", "Cooperative Societies Act", "Banking Regulation Act"],
    correct_answer: 2,
    explanation: "Cooperative Banks are registered under State Cooperative Societies Acts or Multi-State Cooperative Societies Act. They are also subject to RBI regulations.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "NABARD (National Bank for Agriculture and Rural Development) was established in:",
    options: ["1975", "1980", "1982", "1990"],
    correct_answer: 2,
    explanation: "NABARD was established on July 12, 1982 as the apex development bank for promoting sustainable and equitable agriculture and rural development.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "SIDBI (Small Industries Development Bank of India) was established in:",
    options: ["1985", "1988", "1990", "1995"],
    correct_answer: 2,
    explanation: "SIDBI was established on April 2, 1990 under SIDBI Act, 1989 as the principal financial institution for MSMEs.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "EXIM Bank (Export-Import Bank of India) was established to:",
    options: ["Regulate forex markets", "Finance and promote India's international trade", "Provide housing loans", "Fund infrastructure projects"],
    correct_answer: 1,
    explanation: "EXIM Bank was established in 1982 to provide financial assistance to exporters and importers and promote India's international trade and investment.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The regional rural banks (RRBs) in India were established based on recommendations of the:",
    options: ["Narasimham Committee (1969)", "Narsimham Committee (1975) / Kelkar Committee", "M. Narasimham Working Group 1975", "Chakravarti Committee"],
    correct_answer: 2,
    explanation: "RRBs were established on October 2, 1975 based on the recommendations of the Working Group set up by M. Narasimham to provide credit to rural poor.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Banking Functions
  {
    question_text: "The primary function of commercial banks is:",
    options: ["Print currency notes", "Accept deposits and provide loans", "Regulate monetary policy", "Issue government securities"],
    correct_answer: 1,
    explanation: "The primary function of commercial banks is accepting deposits from the public and providing loans/advances to borrowers for various purposes.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "A 'Demand Deposit' is one that:",
    options: ["Has a fixed maturity", "Can be withdrawn any time without prior notice", "Earns no interest", "Is kept for minimum 1 year"],
    correct_answer: 1,
    explanation: "Demand deposits are deposits that can be withdrawn by the depositor at any time without prior notice, such as current account and savings account balances.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "A 'Fixed Deposit' is also known as:",
    options: ["Demand deposit", "Term deposit", "Call money", "Savings deposit"],
    correct_answer: 1,
    explanation: "Fixed deposits (FDs) are also called term deposits as they are deposited for a fixed period of time. They offer higher interest rates than savings accounts.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "KYC (Know Your Customer) norms were introduced to:",
    options: ["Increase customer satisfaction", "Prevent money laundering and terrorist financing", "Expand banking services", "Reduce loan defaults"],
    correct_answer: 1,
    explanation: "KYC norms require banks to verify the identity and address of customers to prevent money laundering, fraud, and terrorist financing.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "The SARFAESI Act (Securitisation and Reconstruction of Financial Assets and Enforcement of Security Interest) helps banks to:",
    options: ["Open new branches", "Recover non-performing assets without court intervention", "Provide housing loans", "Issue bonds"],
    correct_answer: 1,
    explanation: "SARFAESI Act 2002 empowers banks and financial institutions to recover non-performing assets (NPAs) without going through the courts, by directly enforcing security interest.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // NPA and Credit
  {
    question_text: "An NPA (Non-Performing Asset) is a loan that has been:",
    options: ["Repaid in full", "Overdue for 90 days or more", "Sanctioned but not disbursed", "Less than ₹1 lakh"],
    correct_answer: 1,
    explanation: "NPA is a loan or advance where principal or interest payment remains overdue for a period of more than 90 days. The 90-day norm was introduced in 2004.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "A 'Substandard Asset' in banking is an NPA that has been overdue for:",
    options: ["3-12 months", "Less than or equal to 12 months", "12-36 months", "More than 3 years"],
    correct_answer: 1,
    explanation: "An asset is classified as Substandard if it has remained an NPA for a period of up to or equal to 12 months.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Priority Sector Lending (PSL) requires banks to lend a minimum of ___ % of ANBC to priority sectors.",
    options: ["30%", "35%", "40%", "45%"],
    correct_answer: 2,
    explanation: "RBI mandates that domestic scheduled commercial banks lend at least 40% of their Adjusted Net Bank Credit (ANBC) to priority sectors (agriculture, MSME, education, housing, etc.).",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "PMLA (Prevention of Money Laundering Act) requires banks to report Suspicious Transaction Reports (STRs) to:",
    options: ["RBI", "CBI", "FIU-India", "SEBI"],
    correct_answer: 2,
    explanation: "Under PMLA 2002, banks must report Suspicious Transaction Reports (STRs) and Cash Transaction Reports (CTRs) to FIU-India (Financial Intelligence Unit).",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Insurance
  {
    question_text: "IRDAI (Insurance Regulatory and Development Authority of India) was established under the IRDA Act:",
    options: ["1992", "1996", "1999", "2002"],
    correct_answer: 2,
    explanation: "IRDAI was established in 1999 under the Insurance Regulatory and Development Authority Act, 1999 to regulate and develop the insurance industry in India.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Life Insurance Corporation of India (LIC) was nationalised in:",
    options: ["1947", "1950", "1956", "1960"],
    correct_answer: 2,
    explanation: "LIC was established on September 1, 1956, when the Government of India nationalised 245 private life insurance companies by merging them under the LIC Act, 1956.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY) provides life insurance cover of:",
    options: ["₹1 lakh", "₹2 lakh", "₹5 lakh", "₹10 lakh"],
    correct_answer: 1,
    explanation: "PMJJBY provides renewable life insurance cover of ₹2 lakh for a premium of ₹436/year, available to people aged 18-50 years.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "PMSBY (Pradhan Mantri Suraksha Bima Yojana) provides accidental death cover of:",
    options: ["₹1 lakh", "₹2 lakh", "₹5 lakh", "₹10 lakh"],
    correct_answer: 1,
    explanation: "PMSBY provides accidental death and full disability cover of ₹2 lakh (partial disability: ₹1 lakh) for a premium of ₹20/year for people aged 18-70.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Pradhan Mantri Fasal Bima Yojana (PMFBY) is a type of:",
    options: ["Health insurance", "Crop insurance", "Life insurance", "Vehicle insurance"],
    correct_answer: 1,
    explanation: "PMFBY (2016) is a crop insurance scheme providing comprehensive coverage for pre-sowing to post-harvest losses due to natural calamities, pests, and diseases.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  // Capital Markets
  {
    question_text: "SEBI (Securities and Exchange Board of India) was given statutory status under:",
    options: ["SEBI Act 1988", "SEBI Act 1992", "Companies Act 1956", "Capital Markets Act"],
    correct_answer: 1,
    explanation: "SEBI was established as a non-statutory body in 1988 and given statutory status through the SEBI Act, 1992.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The BSE SENSEX consists of ___ companies.",
    options: ["20", "30", "50", "100"],
    correct_answer: 1,
    explanation: "BSE SENSEX (Sensitive Index) is a free-float market-weighted stock market index of 30 well-established and financially sound companies listed on BSE.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "The NIFTY 50 index consists of ___ companies listed on NSE.",
    options: ["30", "50", "100", "200"],
    correct_answer: 1,
    explanation: "NIFTY 50 (or NIFTY) is a benchmark stock market index comprising the 50 largest and most liquid Indian companies listed on the National Stock Exchange.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "IPO stands for:",
    options: ["International Portfolio Offering", "Initial Public Offering", "Institutional Purchase Option", "India Public Order"],
    correct_answer: 1,
    explanation: "IPO (Initial Public Offering) is the process by which a private company offers shares to the public for the first time to raise capital.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "A 'Demat Account' is used to hold:",
    options: ["Physical currency", "Securities in electronic/dematerialised form", "Gold deposits", "Fixed deposits"],
    correct_answer: 1,
    explanation: "A Demat (dematerialised) account holds shares, bonds, mutual funds, and other securities in electronic form, eliminating the need for physical certificates.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "The Depositories in India that maintain Demat accounts are:",
    options: ["NSE and BSE", "CDSL and NSDL", "SEBI and RBI", "Banks and NBFCs"],
    correct_answer: 1,
    explanation: "India has two depositories: CDSL (Central Depository Services Limited) promoted by BSE, and NSDL (National Securities Depository Limited) promoted by NSE.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Monetary Policy
  {
    question_text: "The Monetary Policy Committee (MPC) of RBI was constituted under the RBI Act amendment in:",
    options: ["2012", "2014", "2016", "2018"],
    correct_answer: 2,
    explanation: "The MPC was established by amending the RBI Act in 2016. It consists of 6 members (3 from RBI, 3 external) and decides key policy rates.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's inflation targeting framework (flexible inflation targeting) was formally adopted in:",
    options: ["2014", "2016", "2017", "2019"],
    correct_answer: 1,
    explanation: "India formally adopted inflation targeting in 2016 with a target of 4% CPI inflation with ±2% band (i.e., 2%-6%).",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Open Market Operations (OMO) by RBI involve:",
    options: ["Opening new bank branches", "Buying or selling government securities to manage liquidity", "Setting up money markets", "Issuing new currency notes"],
    correct_answer: 1,
    explanation: "OMO is an instrument where RBI buys or sells government securities in the open market to inject or absorb liquidity from the banking system.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The MSF (Marginal Standing Facility) rate is typically:",
    options: ["Equal to Repo Rate", "Higher than Repo Rate", "Lower than Repo Rate", "Same as Bank Rate"],
    correct_answer: 1,
    explanation: "MSF is a window for banks to borrow overnight funds from RBI at a rate higher than the Repo Rate (typically Repo + 0.25%). It is used in emergency situations.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Financial Inclusion
  {
    question_text: "Jan Dhan Yojana was launched to provide basic banking services. As of 2024, the number of Jan Dhan accounts exceeded:",
    options: ["30 crore", "40 crore", "50 crore", "60 crore"],
    correct_answer: 2,
    explanation: "PMJDY has opened over 50 crore accounts as of 2024, with majority of account holders being women. Each account includes RuPay debit card and accident insurance.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Business Correspondent (BC) model in banking was introduced to:",
    options: ["Expand bank branches in cities", "Extend banking services to unbanked areas via agents", "Hire more bank employees", "Automate banking operations"],
    correct_answer: 1,
    explanation: "BC model allows banks to appoint Business Correspondents (agents) to provide basic banking services in areas without bank branches, enabling financial inclusion.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'India Post Payments Bank' was launched to provide banking services through:",
    options: ["Mobile apps only", "Post office network across India", "ATM network", "NBFCs"],
    correct_answer: 1,
    explanation: "India Post Payments Bank (IPPB) was launched in 2018, leveraging India's postal network of 1.55 lakh post offices and 3 lakh postmen to deliver banking services.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  // NBFCs and Other FIs
  {
    question_text: "An NBFC (Non-Banking Financial Company) differs from a bank in that it:",
    options: ["Cannot accept deposits at all", "Can accept deposits but is not regulated", "Cannot accept demand deposits and is not part of payment/settlement system", "Is not subject to any RBI regulations"],
    correct_answer: 2,
    explanation: "NBFCs cannot accept demand deposits (like savings/current accounts), are not part of the payment and settlement system, and are not required to maintain CRR/SLR like banks.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Microfinance Institutions (MFIs) provide small loans primarily to:",
    options: ["Large corporations", "Government departments", "Low-income individuals without access to formal banking", "Foreign companies"],
    correct_answer: 2,
    explanation: "MFIs provide small collateral-free loans (microfinance) to low-income individuals, especially women in rural areas, who lack access to formal banking services.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "MUDRA Yojana loan categories are Shishu, Kishore, and Tarun with maximum loan amounts of:",
    options: ["₹50k, ₹1L, ₹5L", "₹50k, ₹5L, ₹10L", "₹1L, ₹5L, ₹20L", "₹25k, ₹2L, ₹5L"],
    correct_answer: 1,
    explanation: "MUDRA loan categories: Shishu (up to ₹50,000), Kishore (₹50,001 to ₹5 lakh), Tarun (₹5 lakh to ₹10 lakh) for non-farm micro enterprises.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // International Banking
  {
    question_text: "The Bank for International Settlements (BIS) is headquartered in:",
    options: ["Geneva", "New York", "Basel, Switzerland", "Frankfurt"],
    correct_answer: 2,
    explanation: "BIS (Bank for International Settlements) is headquartered in Basel, Switzerland. It serves as a bank for central banks and coordinates global financial regulation.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Basel III norms relate to:",
    options: ["International trade regulations", "Capital adequacy, stress testing, and liquidity requirements for banks", "Insurance regulations", "Cryptocurrency regulations"],
    correct_answer: 1,
    explanation: "Basel III is a global regulatory framework developed by the Basel Committee on Banking Supervision to strengthen bank capital requirements and improve risk management.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Capital Adequacy Ratio (CAR) as per Basel III for Indian banks must be at least:",
    options: ["7%", "8%", "9%", "10%"],
    correct_answer: 2,
    explanation: "RBI requires Indian banks to maintain a minimum Capital Adequacy Ratio (CAR/CRAR) of 9%, which is higher than the 8% minimum set by Basel III.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // Currency & Forex
  {
    question_text: "FOREX means:",
    options: ["Foreign Exchange", "Forward Exchange", "Fixed Rate Exchange", "Financial Order Exchange"],
    correct_answer: 0,
    explanation: "FOREX stands for Foreign Exchange — the global marketplace for exchanging national currencies. India's forex reserves are managed by RBI.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "India's foreign exchange reserves include:",
    options: ["Only US dollars", "Foreign currency assets, gold, SDRs, and reserve tranche with IMF", "Only government securities", "Gold only"],
    correct_answer: 1,
    explanation: "India's forex reserves comprise: Foreign Currency Assets (largest component), Gold, SDRs (Special Drawing Rights from IMF), and Reserve Tranche Position in the IMF.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "FEMA (Foreign Exchange Management Act) replaced the earlier:",
    options: ["FERA", "FEMA 1947", "FERMA", "FOREXMA"],
    correct_answer: 0,
    explanation: "FEMA 1999 replaced FERA (Foreign Exchange Regulation Act) 1973. FEMA treats forex violations as civil offences, while FERA treated them as criminal offences.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's current account convertibility means:",
    options: ["Full freedom for capital transactions", "Freedom for trade-related transactions (goods, services, income)", "Freedom to hold foreign currency accounts", "Freedom to invest abroad"],
    correct_answer: 1,
    explanation: "Current account convertibility allows free exchange of currency for trade in goods and services. India has full current account convertibility since 1994.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // Financial Markets
  {
    question_text: "The Call Money Market deals with:",
    options: ["Long-term loans", "Overnight and very short-term borrowing between banks", "Stock trading", "Foreign exchange"],
    correct_answer: 1,
    explanation: "Call money market is a short-term money market where commercial banks borrow and lend overnight funds (1 day) to manage their daily cash reserve requirements.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "T-Bills (Treasury Bills) in India are short-term government securities issued for:",
    options: ["1 year only", "91, 182, and 364 days", "5-10 years", "2-3 years"],
    correct_answer: 1,
    explanation: "Treasury Bills are short-term government securities issued by RBI on behalf of the Government. They are available in three maturities: 91-day, 182-day, and 364-day.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "G-Secs (Government Securities) are issued by the Government of India to:",
    options: ["Fund the fiscal deficit through market borrowing", "Provide investment options only to FIIs", "Regulate money supply", "Control exchange rates"],
    correct_answer: 0,
    explanation: "G-Secs (dated securities with maturity >1 year) are issued by the Government of India to fund the fiscal deficit through market borrowing. RBI manages government borrowing.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Banking Terms
  {
    question_text: "EMI (Equated Monthly Instalment) consists of:",
    options: ["Only principal repayment", "Only interest payment", "Principal and interest combined", "Processing fee only"],
    correct_answer: 2,
    explanation: "EMI is a fixed payment amount made monthly to repay a loan. It comprises both the principal component and the interest component.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "CIBIL Score is a 3-digit numerical summary of a person's:",
    options: ["Savings account balance", "Credit history and creditworthiness", "Net worth", "Income"],
    correct_answer: 1,
    explanation: "CIBIL Score (Credit Information Bureau India Limited) ranges from 300-900. A higher score (750+) indicates good creditworthiness and makes loan approval easier.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "Collateral in banking refers to:",
    options: ["Interest rate on loans", "An asset pledged as security for a loan", "Bank's capital reserves", "Penalty for loan default"],
    correct_answer: 1,
    explanation: "Collateral is an asset pledged by a borrower as security for a loan. If the borrower defaults, the lender can seize the collateral to recover the loan amount.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "A 'Recurring Deposit' (RD) account allows customers to:",
    options: ["Deposit lump sum and withdraw periodically", "Deposit fixed amount every month and receive maturity amount with interest", "Withdraw unlimited times", "Deposit in foreign currency"],
    correct_answer: 1,
    explanation: "A Recurring Deposit account allows customers to deposit a fixed amount every month for a pre-determined period. Interest is compounded quarterly and paid at maturity.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "The DICGC (Deposit Insurance and Credit Guarantee Corporation) insures bank deposits up to:",
    options: ["₹1 lakh", "₹3 lakh", "₹5 lakh", "₹10 lakh"],
    correct_answer: 2,
    explanation: "DICGC (a subsidiary of RBI) provides deposit insurance up to ₹5 lakh per depositor per bank. This limit was increased from ₹1 lakh to ₹5 lakh in February 2020.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  // Digital Banking
  {
    question_text: "UPI (Unified Payments Interface) was launched by NPCI in:",
    options: ["2014", "2015", "2016", "2017"],
    correct_answer: 2,
    explanation: "UPI was launched by NPCI (National Payments Corporation of India) in April 2016 and initially went live with 21 banks. It has become the world's largest real-time payment system.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "IMPS (Immediate Payment Service) allows transfers:",
    options: ["Only during banking hours", "24×7 in real time up to ₹5 lakh per transaction", "Only within same bank", "Only above ₹1 lakh"],
    correct_answer: 1,
    explanation: "IMPS enables instant interbank electronic transfer of funds through mobile phones 24×7. The limit per transaction is ₹5 lakh.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "RuPay is India's own card payment network. It was launched by:",
    options: ["SBI", "RBI", "NPCI", "Ministry of Finance"],
    correct_answer: 2,
    explanation: "RuPay is a domestic card payment network launched by NPCI in 2012 as an alternative to Visa and MasterCard. It processes transactions within India.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "Payment Banks in India can accept deposits up to:",
    options: ["₹50,000", "₹1 lakh", "₹2 lakh", "₹5 lakh"],
    correct_answer: 2,
    explanation: "Payment Banks (introduced 2015) can accept deposits up to ₹2 lakh per customer. They cannot lend but can offer remittances, debit cards, internet banking, etc.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's Central Bank Digital Currency (CBDC) or 'Digital Rupee' was launched in pilot by RBI in:",
    options: ["2021", "2022", "2023", "2024"],
    correct_answer: 1,
    explanation: "RBI launched the Digital Rupee (e-RUPI CBDC) in pilot form in November 2022 (wholesale) and December 2022 (retail), making India one of the few countries with an active CBDC pilot.",
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
