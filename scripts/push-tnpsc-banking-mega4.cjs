require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const BASE  = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
const KEY   = 'quiz:subject:banking';
const HDR   = { Authorization:`Bearer ${TOKEN}`, 'Content-Type':'application/json' };

const questions = [
  // Interest Rate Concepts
  {
    question_text: "Simple Interest (SI) formula is:",
    options: ["P × (1 + R/100)^T", "P × R × T / 100", "(P × R × T) / (100 × 12)", "P × (R/100)^T"],
    correct_answer: 1,
    explanation: "Simple Interest = Principal × Rate × Time / 100. Example: SI on ₹10,000 at 8% for 2 years = 10000 × 8 × 2 / 100 = ₹1,600.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "Compound Interest is calculated on:",
    options: ["Principal only", "Principal plus accumulated interest from previous periods", "Interest only", "Fixed amount regardless of period"],
    correct_answer: 1,
    explanation: "Compound interest is calculated on the principal plus the accumulated interest. CI = P(1 + R/100)^T - P. It grows faster than Simple Interest.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "If annual interest rate is 10%, what is the effective rate for monthly compounding?",
    options: ["10%", "10.43% (approx.)", "10.5%", "11%"],
    correct_answer: 1,
    explanation: "Effective Annual Rate (EAR) = (1 + r/n)^n - 1. For monthly compounding: (1 + 0.10/12)^12 - 1 ≈ 10.47%. More frequent compounding = higher effective rate.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "EMI for a home loan depends on:",
    options: ["Loan amount only", "Loan amount, interest rate, and loan tenure", "Only the loan tenure", "Property value only"],
    correct_answer: 1,
    explanation: "EMI is determined by three factors: Principal loan amount, interest rate, and loan tenure. EMI = P × r × (1+r)^n / [(1+r)^n - 1] where r = monthly interest rate, n = months.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "The 'Rule of 72' in finance helps estimate:",
    options: ["Tax liability", "Number of years to double an investment at a given interest rate", "Maximum EMI capacity", "Credit score"],
    correct_answer: 1,
    explanation: "Rule of 72: Years to double = 72 / Interest Rate. At 8% interest, money doubles in approximately 72/8 = 9 years.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc"]
  },
  // Types of Money
  {
    question_text: "Legal Tender in India means:",
    options: ["Money used for tenders only", "Currency that must be accepted for settling debts — Indian banknotes and coins", "Foreign currency accepted in India", "Coins only"],
    correct_answer: 1,
    explanation: "Legal tender is currency that must legally be accepted in payment of debts. In India, RBI notes are unlimited legal tender; coins are limited legal tender.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Black Money refers to:",
    options: ["Money held as cash", "Income not disclosed to tax authorities to evade taxes", "Money earned in black market only", "Foreign currency holdings"],
    correct_answer: 1,
    explanation: "Black money (parallel economy money) refers to income that has not been declared to tax authorities, thus no taxes have been paid on it.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "Hawala transactions are illegal because they:",
    options: ["Use digital currency", "Transfer funds through an informal network bypassing official banking channels", "Charge higher fees", "Are done at night"],
    correct_answer: 1,
    explanation: "Hawala is an informal value transfer system operating outside official banking channels and regulatory oversight, violating FEMA and PMLA provisions.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "'Hot Money' in economics refers to:",
    options: ["Physical cash in circulation", "Short-term capital that moves quickly between financial markets seeking highest returns", "Counterfeit currency", "Commodity trading profits"],
    correct_answer: 1,
    explanation: "Hot money refers to short-term speculative capital that moves rapidly between countries seeking better interest rates or exchange rate gains. It causes exchange rate volatility.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Banking Frauds & Security
  {
    question_text: "Phishing in digital banking is a type of attack where:",
    options: ["Hackers directly access bank servers", "Fraudsters trick users into revealing sensitive information through fake websites/emails", "Malware is installed on ATMs", "Bank insiders steal customer data"],
    correct_answer: 1,
    explanation: "Phishing involves sending fraudulent emails or creating fake websites mimicking legitimate banks to trick users into entering their credentials, OTP, or card details.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "ATM card skimming involves:",
    options: ["Counting cards quickly", "Illegally copying card data by installing a fake card reader on ATMs", "ATM cash shortage", "Blocked ATM card"],
    correct_answer: 1,
    explanation: "Card skimming is a type of ATM fraud where criminals install a skimming device on ATM card slots to capture card data, along with a hidden camera to capture the PIN.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "The RBI's 'Ombudsman for Digital Transactions' handles complaints about:",
    options: ["Physical branch banking issues", "UPI, mobile banking, digital wallets, and other digital payment issues", "Stock trading disputes", "International transfers only"],
    correct_answer: 1,
    explanation: "The Ombudsman for Digital Transactions (integrated into RBI Integrated Ombudsman, 2021) handles complaints related to UPI, IMPS, mobile banking, prepaid payment instruments, and internet banking.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Credit Instruments
  {
    question_text: "A 'Promissory Note' is:",
    options: ["A type of deposit", "A written, unconditional promise to pay a specific sum to a named party", "A government bond", "Bank's promise to customers"],
    correct_answer: 1,
    explanation: "A Promissory Note is a negotiable instrument containing a written, unconditional promise by the maker to pay a definite sum of money to a specified person on demand or at a future date.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "A 'Bill of Exchange' is different from a Promissory Note in that:",
    options: ["It is issued by a bank only", "It has three parties (drawer, drawee, payee) and is an order to pay", "It always matures in 90 days", "It cannot be discounted"],
    correct_answer: 1,
    explanation: "A Bill of Exchange involves three parties: the drawer (who draws the bill), the drawee (who is ordered to pay), and the payee (who receives payment). A Promissory Note has only two parties.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Discounting of a Bill of Exchange by a bank means:",
    options: ["Reducing the bill amount", "Paying the bill holder the value before maturity, deducting interest", "Guaranteeing the bill", "Extending the maturity date"],
    correct_answer: 1,
    explanation: "When a bank discounts a bill, it pays the holder the face value minus a discount (interest for the remaining period). The bank then collects the full face value at maturity.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Financial Inclusion 2
  {
    question_text: "The Pradhan Mantri Garib Kalyan Yojana (PMGKY) was a scheme to:",
    options: ["Provide rural employment", "Encourage disclosure and deposit of black money (2016)", "Provide food rations during COVID", "Build houses for poor"],
    correct_answer: 1,
    explanation: "PMGKY (2016-17) was an income declaration scheme that allowed disclosure of undisclosed income/black money with 50% tax + penalty, depositing 25% in non-interest-bearing PMGKY bonds.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "UIDAI (Unique Identification Authority of India) issues:",
    options: ["PAN cards", "Voter IDs", "Aadhaar cards", "Passports"],
    correct_answer: 2,
    explanation: "UIDAI issues Aadhaar — a 12-digit unique identification number assigned to every resident of India. Aadhaar is used for banking KYC, DBT, and various government services.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "Aadhaar-based payments through micro-ATMs use:",
    options: ["OTP authentication", "Biometric authentication (fingerprint)", "PIN authentication only", "Card swipe"],
    correct_answer: 1,
    explanation: "Aadhaar Enabled Payment System (AePS) uses biometric authentication (fingerprint or iris scan) to allow banking transactions through micro-ATMs, useful for rural areas.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Government Securities
  {
    question_text: "The yield on government securities (G-Secs) and their price are:",
    options: ["Directly related", "Inversely related — when price falls, yield rises", "Unrelated", "Always fixed"],
    correct_answer: 1,
    explanation: "Bond prices and yields are inversely related. When a bond's price falls below par, its effective yield rises because the investor pays less for the same coupon payments.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Gilt-edged securities refer to:",
    options: ["Securities with gold backing", "Government securities (highest quality, virtually risk-free)", "Securities with highest returns", "Private sector bonds"],
    correct_answer: 1,
    explanation: "Gilt-edged securities (gilts) are government bonds — the safest investment as they are backed by sovereign guarantee. They have very low risk of default.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's inflation-indexed bonds (IIBs) provide:",
    options: ["High fixed returns", "Returns linked to inflation (CPI), protecting against inflation risk", "Returns linked to stock market", "Tax-free returns only"],
    correct_answer: 1,
    explanation: "Inflation-indexed bonds have their principal adjusted for CPI inflation, with a fixed real interest rate. They protect investors from inflation eroding the value of returns.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // Capital Markets 2
  {
    question_text: "A 'Rights Issue' in capital markets means:",
    options: ["Issue of shares at face value to all investors", "Existing shareholders get right to buy new shares at a discount before public", "Bonus shares issued to employees", "Government mandatory purchase of shares"],
    correct_answer: 1,
    explanation: "A rights issue allows existing shareholders to purchase new shares at a discounted price in proportion to their existing holdings before the shares are offered to others.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "A 'Bonus Issue' of shares means:",
    options: ["Shares issued for free to existing shareholders from accumulated reserves", "Shares issued at a discount", "Shares issued as salary to employees", "New IPO shares"],
    correct_answer: 0,
    explanation: "In a bonus issue, free additional shares are issued to existing shareholders in proportion to their holdings, funded by converting reserves/retained earnings into paid-up capital.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The P/E (Price-to-Earnings) ratio measures:",
    options: ["Profit per employee", "How much investors pay per rupee of earnings (valuation metric)", "Profitability of a bank", "Price growth rate"],
    correct_answer: 1,
    explanation: "P/E = Market Price per Share / Earnings per Share. A high P/E indicates investors expect high growth; a low P/E may indicate undervaluation.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Dividend Yield is calculated as:",
    options: ["Annual dividend / Market price × 100", "Profit / Revenue × 100", "Return on equity", "Price change / original price"],
    correct_answer: 0,
    explanation: "Dividend Yield = (Annual Dividend Per Share / Current Market Price Per Share) × 100. It indicates how much a company pays in dividends relative to its stock price.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "An 'ETF' (Exchange-Traded Fund) is:",
    options: ["A type of currency", "A fund tracking an index, traded on stock exchange like a share", "A savings account", "A government bond"],
    correct_answer: 1,
    explanation: "ETF is a basket of securities tracking an index (like NIFTY 50) that trades on stock exchanges. India's first ETF was launched in 2001. Government sells shares through ETFs like Bharat 22 ETF.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Banking Organizations
  {
    question_text: "IBA (Indian Banks Association) is a body that:",
    options: ["Regulates banks", "Is a voluntary association of banks that acts as their representative body", "Provides banking licences", "Audits banks"],
    correct_answer: 1,
    explanation: "IBA (founded 1946) is a voluntary association of commercial banks and financial institutions, acting as their representative body for matters of policy and industry concerns.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Basel Committee on Banking Supervision (BCBS) is hosted by:",
    options: ["IMF", "World Bank", "Bank for International Settlements (BIS)", "Federal Reserve"],
    correct_answer: 2,
    explanation: "BCBS is hosted by the Bank for International Settlements (BIS) in Basel, Switzerland. It sets standards for the regulation, supervision, and risk management of banks.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "FATF (Financial Action Task Force) is an intergovernmental body that:",
    options: ["Facilitates trade finance", "Sets standards for combating money laundering and terrorism financing", "Manages foreign exchange", "Rates sovereign debt"],
    correct_answer: 1,
    explanation: "FATF (1989) sets global AML/CFT (Anti-Money Laundering/Counter-Terrorism Financing) standards and monitors countries' compliance. India is a FATF member.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Economy Terms in Banking
  {
    question_text: "What is 'Moral Hazard' in finance?",
    options: ["Unethical banking practices", "Risk that insured parties take more risks because they don't bear full consequences", "Market manipulation", "High NPAs in banks"],
    correct_answer: 1,
    explanation: "Moral hazard occurs when one party takes risks because they don't bear full consequences. E.g., banks taking excessive risks knowing they may be bailed out ('too big to fail').",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'too big to fail' concept means that some banks:",
    options: ["Are so large they cannot fail", "Are so systemically important that their failure would cause severe economic damage, requiring government bailout", "Cannot be nationalised", "Are exempt from RBI regulations"],
    correct_answer: 1,
    explanation: "'Too Big to Fail' refers to financial institutions so large and interconnected that their failure would be catastrophic for the financial system, creating expectation of government bailout.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Financial Repression refers to:",
    options: ["Strict financial regulation", "Government policies that keep interest rates artificially low to reduce debt burden", "Prohibition of money lending", "Excessive banking charges"],
    correct_answer: 1,
    explanation: "Financial repression occurs when governments use policies to keep interest rates below inflation, essentially taxing savers by eroding their returns, often to manage high government debt.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // Key Statistics
  {
    question_text: "India's credit-to-GDP ratio (approximately, 2024) is around:",
    options: ["30%", "50%", "70%", "90%"],
    correct_answer: 1,
    explanation: "India's domestic credit to private sector as % of GDP is approximately 55-60% — lower than China (~175%) or USA (~215%), indicating significant room for credit growth.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The benchmark 10-year government bond yield in India (2024) was approximately:",
    options: ["4-5%", "6-7%", "8-9%", "10-12%"],
    correct_answer: 1,
    explanation: "India's benchmark 10-year G-Sec yield was in the range of 6.5-7.2% in 2024, reflecting the interest rate environment with RBI's repo rate at 6.5%.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // More Specific Banking Topics
  {
    question_text: "A 'Tier 1 Capital' in banking (under Basel norms) primarily consists of:",
    options: ["Subordinated debt", "Core equity capital — common shares plus retained earnings", "Short-term borrowings", "Customer deposits"],
    correct_answer: 1,
    explanation: "Tier 1 capital (core capital) is a bank's core capital comprising common equity (common shares + retained earnings). It provides the highest quality loss-absorbing capacity.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Liquidity Coverage Ratio (LCR) under Basel III requires banks to hold:",
    options: ["High-quality liquid assets to cover 30 days of net cash outflows", "Long-term assets", "Government bonds equal to deposits", "Cash equal to SLR"],
    correct_answer: 0,
    explanation: "LCR = High-Quality Liquid Assets (HQLA) / Total Net Cash Outflows over 30 days ≥ 100%. It ensures banks can survive a 30-day liquidity stress scenario.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Net Stable Funding Ratio (NSFR) is a longer-term liquidity measure requiring:",
    options: ["Short-term stable funding", "Available stable funding ≥ required stable funding over 1 year", "Government bond investments", "Minimum CRR maintenance"],
    correct_answer: 1,
    explanation: "NSFR (Basel III, effective from 2018) = Available Stable Funding / Required Stable Funding ≥ 100%. It promotes stable funding sources over a 1-year horizon.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // Pension & Provident Fund
  {
    question_text: "EPFO (Employees' Provident Fund Organisation) is regulated by:",
    options: ["RBI", "SEBI", "Ministry of Labour and Employment", "Finance Ministry"],
    correct_answer: 2,
    explanation: "EPFO is a statutory body under the Ministry of Labour and Employment, Government of India. It administers the Employee Provident Fund and Miscellaneous Provisions Act, 1952.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Employees contribute ___ % of basic salary to EPF, with equal contribution from employer.",
    options: ["8%", "10%", "12%", "15%"],
    correct_answer: 2,
    explanation: "Both employee and employer contribute 12% of basic salary + dearness allowance to EPF. Of the employer's 12%, 3.67% goes to EPF and 8.33% to EPS (Pension Scheme).",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "PFRDA (Pension Fund Regulatory and Development Authority) regulates:",
    options: ["EPFO only", "NPS (National Pension System) and pension funds", "LIC and other insurance", "All retirement products"],
    correct_answer: 1,
    explanation: "PFRDA (established 2003, statutory status 2013) regulates the National Pension System (NPS) and pension funds in India. NPS is a voluntary, long-term retirement savings scheme.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Gratuity in India is governed by the Payment of Gratuity Act 1972. It is payable after completion of:",
    options: ["3 years", "5 years", "7 years", "10 years"],
    correct_answer: 1,
    explanation: "Gratuity is payable to an employee who has completed at least 5 years of service. Gratuity = (Last Salary × 15 × Years of Service) / 26.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  // Misc Banking
  {
    question_text: "India's highest denomination currency note ever issued was:",
    options: ["₹10,000", "₹5,000", "₹2,000", "₹1,000"],
    correct_answer: 0,
    explanation: "India issued ₹10,000 notes in 1938 and 1954, which were then demonetised. The ₹10,000 note was India's highest denomination ever.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The RBI's Financial Stability Report (FSR) is published:",
    options: ["Monthly", "Quarterly", "Half-yearly (biannually)", "Annually"],
    correct_answer: 2,
    explanation: "RBI publishes the Financial Stability Report (FSR) biannually (twice a year), assessing the health of India's financial system and macro-financial risks.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The RBI Annual Report is presented to the Central Government under:",
    options: ["RBI Act Section 53", "Companies Act Section 147", "RBI Act Section 53 (to Central Board)", "Banking Regulation Act"],
    correct_answer: 0,
    explanation: "Under Section 53 of the RBI Act, RBI submits its Annual Report to the Central Government. It contains review of the RBI's operations and annual accounts.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "ECLGS (Emergency Credit Line Guarantee Scheme) was extended and enhanced multiple times. It was a part of:",
    options: ["Digital India campaign", "Aatmanirbhar Bharat economic package (2020)", "Make in India", "Swachh Bharat"],
    correct_answer: 1,
    explanation: "ECLGS was launched as part of the Aatmanirbhar Bharat Abhiyan economic stimulus package in May 2020 to support MSMEs hit by COVID-19 lockdowns.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'EASE' (Enhanced Access and Service Excellence) banking reform index is for:",
    options: ["Private banks' competition assessment", "Public sector banks' reform progress", "NBFC regulation", "Digital payment tracking"],
    correct_answer: 1,
    explanation: "EASE Index (launched 2018) tracks reforms in Public Sector Banks across six key themes: Responsible banking, Customer responsiveness, Credit off-take, PSBs as Udyamimitra, Financial inclusion & Digitalisation, and Governance and HR.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // Payment Ecosystem
  {
    question_text: "NPCI (National Payments Corporation of India) was set up in:",
    options: ["2005", "2007", "2008", "2010"],
    correct_answer: 2,
    explanation: "NPCI was incorporated in December 2008 under the Companies Act 1956, promoted by RBI and IBA to provide infrastructure for retail payment systems.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Which of the following payment systems is NOT operated by NPCI?",
    options: ["UPI", "IMPS", "NEFT", "RuPay"],
    correct_answer: 2,
    explanation: "NEFT (National Electronic Funds Transfer) is managed and operated by the Reserve Bank of India (RBI), not NPCI. NPCI operates UPI, IMPS, RuPay, NACH, BHIM, etc.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "BHIM app (Bharat Interface for Money) was launched to facilitate:",
    options: ["Government scheme registration", "UPI-based payments for everyone", "Cryptocurrency transactions", "Tax payments"],
    correct_answer: 1,
    explanation: "BHIM (Bharat Interface for Money) is a payment app built on UPI infrastructure. It was launched on December 30, 2016 to enable digital payments for all.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "UPI 2.0 introduced which key feature?",
    options: ["International transfers", "Overdraft account linking and invoice in the inbox", "Cryptocurrency payments", "Multiple currency support"],
    correct_answer: 1,
    explanation: "UPI 2.0 (2018) introduced: Overdraft account linking, Invoice in the inbox (checks against invoice before payment), enhanced mandates (recurring payments), and block account access.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The maximum transaction limit for UPI (single transaction, 2024) is:",
    options: ["₹50,000", "₹1 lakh", "₹5 lakh for most cases, ₹10 lakh for specific categories", "₹2 lakh"],
    correct_answer: 2,
    explanation: "NPCI has set UPI transaction limit at ₹1 lakh for regular transactions, with ₹5 lakh for specific categories like capital markets, insurance, and IPO, and ₹2 lakh for P2P transfers. RBI extended this further for certain uses.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // Consumer Protection
  {
    question_text: "The Consumer Protection Act 2019 covers disputes related to banking services under:",
    options: ["Consumer Courts / Consumer Commissions", "SEBI tribunals", "Banking ombudsman only", "Civil courts"],
    correct_answer: 0,
    explanation: "Consumer disputes related to banking services can be filed at Consumer Courts/District Consumer Disputes Redressal Commission under the Consumer Protection Act 2019.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "What is the time limit for reporting unauthorised digital banking transactions to the bank under RBI guidelines?",
    options: ["Within 24 hours", "Within 3 days (for zero liability)", "Within 7 days", "Within 30 days"],
    correct_answer: 1,
    explanation: "Under RBI guidelines, if reported within 3 working days, customers have zero liability for unauthorised transactions due to bank/third party negligence. Liability increases with delay.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // Banking Abroad
  {
    question_text: "A correspondent bank is a bank that:",
    options: ["Sends letters to customers", "Provides banking services on behalf of another bank, especially in foreign transactions", "Manages ATM networks", "Processes cheque clearing only"],
    correct_answer: 1,
    explanation: "Correspondent banking involves one bank (correspondent) providing services on behalf of another bank (respondent), especially for international transactions, foreign currency, and cross-border trade.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "A 'Nostro account' is an account maintained by:",
    options: ["Customer in foreign bank", "Indian bank in a foreign bank (in foreign currency)", "Foreign bank in India", "RBI abroad"],
    correct_answer: 1,
    explanation: "Nostro account (Latin for 'our') is an account maintained by an Indian bank in a foreign bank in foreign currency. Vostro (Latin for 'your') is the reverse.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "External Commercial Borrowings (ECB) allow Indian companies to:",
    options: ["Borrow from other Indian companies", "Raise funds from foreign sources (foreign banks, bonds)", "Issue shares to foreign investors", "Get loans from RBI"],
    correct_answer: 1,
    explanation: "ECBs are loans raised by Indian entities from non-resident lenders (foreign banks, bonds, buyers' credit). They are regulated by RBI/FEMA guidelines.",
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
