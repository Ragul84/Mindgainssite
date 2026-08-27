require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const BASE  = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
const KEY   = 'quiz:subject:banking';
const HDR   = { Authorization:`Bearer ${TOKEN}`, 'Content-Type':'application/json' };

const questions = [
  // Working Capital Finance
  {
    question_text: "What is 'Working Capital' in banking terminology?",
    options: ["Capital raised by selling shares", "Funds used for day-to-day business operations (Current Assets minus Current Liabilities)", "Long-term investment funds", "Capital held at work (in machines)"],
    correct_answer: 1,
    explanation: "Working Capital = Current Assets − Current Liabilities. Banks finance working capital through Cash Credit, Overdraft, and Bill Discounting facilities. It covers raw materials, wages, and operational costs before receivables are collected.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Cash Credit' (CC) in banking?",
    options: ["Cash given to bank employees as credit", "A revolving short-term credit limit against hypothecation of stock/debtors for working capital needs", "Credit given in cash instead of cheque", "Cash available at ATMs"],
    correct_answer: 1,
    explanation: "Cash Credit is a working capital facility where a business can withdraw up to a sanctioned limit against pledging/hypothecating stocks and book debts. Interest is charged only on the amount drawn, not the entire limit.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Hypothecation' in lending?",
    options: ["A hypothetical loan scenario", "A charge created on movable assets (stock, machinery) without transferring possession to the lender", "Transfer of property ownership to the bank", "A banking hypothesis test"],
    correct_answer: 1,
    explanation: "In hypothecation, the borrower pledges movable assets as collateral but retains possession and use. The lender has a charge on the asset but no physical possession. If default occurs, the lender can seize and sell the assets.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Pledge' as a security in banking?",
    options: ["A promise to repay a loan", "Delivery of goods/assets to the lender as security, with the lender taking physical possession", "A surety provided by a third party", "A type of mortgage on land"],
    correct_answer: 1,
    explanation: "In a pledge, the borrower physically delivers the assets (gold, goods, shares) to the lender as security. The lender holds possession until the loan is repaid. If default occurs, the lender can sell the pledged assets without court intervention.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Mortgage' in the context of bank loans?",
    options: ["A pledge of movable assets", "Transfer of interest in immovable property (land, building) as security for a loan", "A form of insurance on loans", "An overdraft facility for property buyers"],
    correct_answer: 1,
    explanation: "Mortgage is the transfer of interest in immovable property (land, house) to the lender as security for a loan. The borrower retains possession (unlike pledge), but the lender has legal rights over the property. Home loans are secured by mortgage.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // RBI Historical and Statutory Facts
  {
    question_text: "Under which Act was the Reserve Bank of India established?",
    options: ["Reserve Bank of India Act, 1934", "Banking Regulation Act, 1949", "RBI Establishment Act, 1935", "Indian Currency and Finance Act, 1925"],
    correct_answer: 0,
    explanation: "RBI was established under the Reserve Bank of India Act, 1934, and commenced operations on April 1, 1935. It was nationalised on January 1, 1949, and the Banking Regulation Act, 1949 gave it expanded supervisory powers.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Who was the first Governor of the Reserve Bank of India?",
    options: ["C.D. Deshmukh", "Sir Osborne Smith", "Sir James Taylor", "Manmohan Singh"],
    correct_answer: 1,
    explanation: "Sir Osborne Smith was the first Governor of RBI (April 1, 1935 – June 30, 1937). C.D. Deshmukh was the first Indian Governor of RBI (1943–1949). The current (25th) Governor is Sanjay Malhotra (from December 2024).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the composition of the Monetary Policy Committee (MPC) of RBI?",
    options: ["All 6 members are RBI officials", "3 members from RBI + 3 external members appointed by the Central Government, chaired by RBI Governor", "5 members from Finance Ministry", "7 members including PM as ex-officio"],
    correct_answer: 1,
    explanation: "MPC has 6 members: 3 from RBI (Governor as ex-officio Chairperson, Deputy Governor, and one RBI official) + 3 external members nominated by the Central Government. Decisions are by majority; Governor has casting vote in case of a tie.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Under which section of the RBI Act does RBI issue currency notes?",
    options: ["Section 22", "Section 26", "Section 35", "Section 45"],
    correct_answer: 0,
    explanation: "Section 22 of the RBI Act, 1934 gives RBI the sole right to issue bank notes in India. The ₹1 note is issued by the Ministry of Finance (Government of India). Section 26 deals with legal tender status of notes.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Ways and Means Advances' (WMA) provided by RBI?",
    options: ["Advances given to banks to maintain SLR", "Short-term credit facility given by RBI to the Central and State Governments to bridge temporary mismatches in revenue and expenditure", "Advances given by banks for ways/infrastructure projects", "A type of overdraft for working capital"],
    correct_answer: 1,
    explanation: "WMA is a facility under Section 17(5) of RBI Act to meet temporary mismatches in the government's receipts and payments. If the government overdrafts beyond the WMA limit, it is charged the Repo Rate + 2%. States also get WMA from RBI.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // Financial Markets Structure
  {
    question_text: "What is the 'Money Market' in India?",
    options: ["A physical market where money is traded", "A market for short-term financial instruments (maturity up to 1 year) like T-Bills, Commercial Paper, CDs, and Call Money", "Stock market for large companies", "A market for foreign exchange only"],
    correct_answer: 1,
    explanation: "The money market handles short-term borrowing/lending (up to 1 year). Instruments: Call Money (overnight), T-Bills (91/182/364 days), Commercial Paper (by corporates), Certificates of Deposit (by banks), and Repo. RBI regulates the money market.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is a 'Certificate of Deposit' (CD) in banking?",
    options: ["A certificate proving bank deposit ownership", "A short-term negotiable money market instrument issued by banks at a discount for a fixed term (7 days to 1 year)", "A certificate given on FD maturity", "A digital certificate for online banking"],
    correct_answer: 1,
    explanation: "CDs are unsecured, negotiable money market instruments issued by banks (min ₹1 lakh) and financial institutions for fixed tenors (7 days to 1 year for banks, 1-3 years for FIs). They are issued at a discount and freely tradeable.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Commercial Paper' (CP) as a financial instrument?",
    options: ["Paper currency used in commerce", "Short-term, unsecured money market instrument issued by highly-rated corporates to raise working capital", "Commercial banks' capital base documents", "Papers required for commercial loans"],
    correct_answer: 1,
    explanation: "Commercial Paper is an unsecured promissory note issued by creditworthy corporations (minimum net worth ₹100 crore) for short-term (7 days to 1 year) financing. They are issued at a discount and regulated by RBI guidelines.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the 'Capital Market' in India?",
    options: ["Market for raising short-term funds", "Market for long-term financial instruments (equity shares, bonds, debentures) with maturity over 1 year, regulated by SEBI", "Market in the capital city (Delhi)", "A market for government capital expenditure"],
    correct_answer: 1,
    explanation: "Capital markets facilitate long-term fund raising through equity (shares) and debt (bonds, debentures). India's capital market comprises primary market (new issue — IPOs, FPOs) and secondary market (stock exchanges — BSE, NSE). SEBI is the regulator.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'SEBI' and when was it established?",
    options: ["Securities and Exchange Bank of India, 1992", "Securities and Exchange Board of India, established in 1988 (statutory powers from 1992)", "Stock Exchange Board of India, 1991", "State Exchange Bureau of India, 1990"],
    correct_answer: 1,
    explanation: "SEBI was set up as a non-statutory body in 1988, then given statutory powers through the SEBI Act, 1992. Headquartered in Mumbai, it regulates securities markets, protects investor interests, and promotes market development.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // Payment Systems
  {
    question_text: "What is 'NACH' (National Automated Clearing House)?",
    options: ["A physical clearing house for cash transactions", "An electronic payment system for bulk/recurring transactions like salaries, pensions, loan EMIs, run by NPCI", "A government scheme for automatic subsidies", "A system for National ATM Cash Handling"],
    correct_answer: 1,
    explanation: "NACH, operated by NPCI, is used for bulk, high-volume, repetitive transactions — salary credits, pension payments, dividend payments, loan EMI debits, insurance premiums, and utility bill payments. It replaced the old ECS (Electronic Clearing Service).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the SWIFT network used for in banking?",
    options: ["Fast domestic fund transfers", "Secure international interbank messaging for financial transactions between banks globally", "A Swift payment app by NPCI", "Secure WiFi for banking transactions"],
    correct_answer: 1,
    explanation: "SWIFT (Society for Worldwide Interbank Financial Telecommunication) is a global network (Belgium, est. 1973) enabling banks worldwide to securely send and receive financial transaction messages. India's PNB fraud involved misuse of SWIFT messaging.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What does 'IFSC' stand for and what is it used for?",
    options: ["International Financial Services Code", "Indian Financial System Code — 11-character alphanumeric code identifying specific bank branches for electronic fund transfers (NEFT, RTGS, IMPS)", "Indian Federal System Code", "Interest-Free Savings Calculation"],
    correct_answer: 1,
    explanation: "IFSC is an 11-character code: first 4 characters = bank code, 5th character = '0' (reserved), last 6 characters = branch code. It is mandatory for all electronic fund transfers (NEFT, RTGS, IMPS) in India.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'FASTag' and which technology does it use?",
    options: ["A fast bank transfer tag using NFC", "An RFID-based electronic toll collection system linked to prepaid accounts for cashless toll payment at National Highways", "A fast savings tag by banks", "A government scheme for fast banking"],
    correct_answer: 1,
    explanation: "FASTag uses RFID (Radio Frequency Identification) technology. When a vehicle passes a toll plaza, the scanner reads the FASTag sticker and automatically deducts the toll amount from the linked prepaid account/bank account. Made mandatory by NHAI from February 2021.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Bharat Bill Payment System' (BBPS)?",
    options: ["A system for paying government bills only", "An interoperable platform operated by NPCI for recurring bill payments (electricity, gas, water, telecom, DTH, insurance, EMIs)", "A payment system for Bharat-brand products", "A rural bill payment scheme by RBI"],
    correct_answer: 1,
    explanation: "BBPS (operated by NPCI as Bharat BillPay) is a centralised, interoperable bill payment system enabling customers to pay utility bills through multiple channels (banks, fintechs, BCs). It ensures standardised, reliable bill payments across India.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "When was the Unified Payments Interface (UPI) launched and by whom?",
    options: ["Launched by RBI in January 2016", "Launched by NPCI in April 2016 with pilot on August 25, 2016", "Launched by government in 2017 post-demonetisation", "Launched by SBI in 2015"],
    correct_answer: 1,
    explanation: "UPI was developed by NPCI and launched in April 2016. The pilot with 21 banks was on August 25, 2016, and publicly launched on August 25, 2016. Demonetisation (November 2016) massively boosted UPI adoption.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // Banking Ombudsman and Customer Protection
  {
    question_text: "What is the 'Integrated Ombudsman Scheme' launched by RBI in November 2021?",
    options: ["An integrated complaint system for integrated banks only", "A merged ombudsman covering banking, NBFCs, and digital payment complaints under one unified framework", "An ombudsman for banking integration issues", "A scheme for integrated banking services"],
    correct_answer: 1,
    explanation: "The Integrated Ombudsman Scheme (November 12, 2021) merged the Banking Ombudsman Scheme, NBFC Ombudsman Scheme, and Digital Payment Ombudsman Scheme into one. Customers file complaints via a centralised portal; no jurisdictional hassles.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Within how many days must a bank resolve a customer complaint before the customer can escalate to RBI Ombudsman?",
    options: ["7 days", "15 days", "30 days", "60 days"],
    correct_answer: 2,
    explanation: "Under RBI's Integrated Ombudsman Scheme, a customer must first file a complaint with the bank. If the bank does not respond within 30 days or the customer is unsatisfied, they can escalate to the Ombudsman within 1 year of the bank's final response.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the zero-liability provision for customers in case of unauthorised electronic transactions?",
    options: ["No liability in any case", "Zero customer liability if the fraud is due to bank/third-party negligence, reported within 3 working days", "Customer bears full liability always", "50% liability sharing between bank and customer"],
    correct_answer: 1,
    explanation: "Per RBI guidelines, if an unauthorised transaction is due to bank/system negligence (not the customer), the customer has ZERO liability regardless of when reported. If reported within 3 working days of receiving communication, customer has no liability even for third-party fraud.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // International Finance
  {
    question_text: "What are 'Special Drawing Rights' (SDR) issued by the IMF?",
    options: ["A currency used for international trade", "An international reserve asset created by IMF supplementing members' official reserves; valued based on a basket of currencies (USD, EUR, CNY, JPY, GBP)", "Special loans for developing countries", "Drawing rights for special IMF projects"],
    correct_answer: 1,
    explanation: "SDR (created 1969) is an IMF reserve asset supplementing members' official foreign exchange reserves. India received $17.86 billion (₹1.3 lakh crore) in SDR allocation in August 2021 as COVID-19 support. The SDR basket includes USD, EUR, CNY, JPY, and GBP.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is a 'Nostro Account' and a 'Vostro Account' in international banking?",
    options: ["Different types of savings accounts", "Nostro = our account held abroad in foreign currency; Vostro = a foreign bank's account held with us in our currency", "Nostro = new account; Vostro = old account", "Both are types of NRI accounts"],
    correct_answer: 1,
    explanation: "Nostro ('our' in Latin): Indian bank's account held with a foreign bank in foreign currency (e.g., SBI's USD account with Citibank NY). Vostro ('your' in Latin): Foreign bank's account held with an Indian bank in rupees. Used for international settlements.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is an 'External Commercial Borrowing' (ECB)?",
    options: ["Borrowing by government from external agencies only", "Loans raised by Indian companies from non-resident foreign sources for business purposes, regulated by RBI/FEMA", "Borrowing from external commercial banks in India", "Commercial bank borrowing from RBI"],
    correct_answer: 1,
    explanation: "ECBs allow eligible Indian entities (corporates, infrastructure companies) to raise funds abroad in foreign currency through bank loans, bonds, FRNs, etc. They offer access to larger loan amounts at lower interest rates. RBI regulates ECBs under FEMA.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is a 'Masala Bond' in Indian finance?",
    options: ["Bonds flavoured with Indian spices", "Rupee-denominated bonds issued in overseas markets, where currency risk is borne by the investor", "Bonds issued only in Indian spice export market", "International bonds of only FMCG companies"],
    correct_answer: 1,
    explanation: "Masala bonds are rupee-denominated bonds issued by Indian entities in overseas markets. The key feature: since bonds are in INR, the foreign investor bears the currency risk (not the Indian issuer). IFC (World Bank arm) issued the first Masala bonds in 2014.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is India's approximate rank as a remittance-receiving country globally?",
    options: ["5th largest", "10th largest", "1st largest (world's largest remittance recipient)", "3rd largest"],
    correct_answer: 2,
    explanation: "India is consistently the world's largest recipient of remittances. Remittances crossed $100 billion in 2022 (first country to do so) and remained over $100 billion in 2023-24, primarily from Indian diaspora in USA, UAE, Saudi Arabia, UK, and other countries.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // Tamil Nadu Specific Banking
  {
    question_text: "Which bank is the sponsor bank of the Tamil Nadu Grama Bank (TNGB)?",
    options: ["State Bank of India", "Indian Bank", "Canara Bank", "Indian Overseas Bank"],
    correct_answer: 1,
    explanation: "Tamil Nadu Grama Bank (TNGB), a Regional Rural Bank, is sponsored by Indian Bank. It was formed by merging Pallavan Grama Bank and Pandyan Grama Bank in 2019. It serves rural Tamil Nadu with affordable banking services.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "Where is the headquarters of City Union Bank?",
    options: ["Chennai", "Coimbatore", "Kumbakonam", "Madurai"],
    correct_answer: 2,
    explanation: "City Union Bank Limited is headquartered in Kumbakonam, Tamil Nadu. It is one of the oldest private sector banks in India, established in 1904, and primarily serves Tamil Nadu and surrounding states.",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "Which bank's headquarters is in Chennai among these?",
    options: ["City Union Bank", "Lakshmi Vilas Bank", "Indian Overseas Bank", "Karnataka Bank"],
    correct_answer: 2,
    explanation: "Indian Overseas Bank (IOB) is headquartered in Chennai (Central Office at Saidapet). Established in 1937 by M. Ct. M. Chidambaram Chettyar, IOB is a public sector bank specialising in overseas banking. City Union Bank is in Kumbakonam; Lakshmi Vilas Bank merged with DBS Bank India.",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "Lakshmi Vilas Bank, a Tamil Nadu-based bank, was merged with which bank in 2020?",
    options: ["DBS Bank India", "HDFC Bank", "Canara Bank", "Indian Bank"],
    correct_answer: 0,
    explanation: "The financially stressed Lakshmi Vilas Bank (est. 1926, headquartered in Chennai) was merged with DBS Bank India Ltd (subsidiary of Singapore's DBS Group) in November 2020 under an RBI-Government of India scheme — the first merger with a foreign bank's Indian subsidiary.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'TIIC' in Tamil Nadu's banking and financial context?",
    options: ["Tamil Nadu Investment and Insurance Corporation", "Tamil Nadu Industrial Investment Corporation — a state financial institution providing term loans to industries", "Tamil Nadu International Investment Company", "Technology and Industrial Innovation Corporation"],
    correct_answer: 1,
    explanation: "TIIC (Tamil Nadu Industrial Investment Corporation) is a state-level development financial institution that provides term loans and financial assistance to small, medium, and large industries in Tamil Nadu, promoting industrial growth in the state.",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  // Banking Fraud and Security
  {
    question_text: "What is 'Phishing' in digital banking?",
    options: ["A type of investment strategy", "A fraudulent attempt to steal sensitive information (credentials, card details) by disguising as a legitimate entity via emails/SMS/calls", "Fishing for bank customers to open accounts", "A legal regulatory audit technique"],
    correct_answer: 1,
    explanation: "Phishing attacks trick users into revealing passwords, card numbers, or OTPs by mimicking legitimate banks/institutions. Variants include smishing (SMS-based), vishing (voice/phone-based), and spear phishing (targeted attacks).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the 'Nirav Modi - PNB Fraud' associated with in banking?",
    options: ["Fake loan documents for PSL", "Fraudulent Letters of Undertaking (LoUs) issued through SWIFT, bypassing core banking, totaling ~₹14,000 crore", "Insider trading in bank shares", "Fake FD certificates worth crores"],
    correct_answer: 1,
    explanation: "In 2018, Punjab National Bank discovered one of India's biggest banking frauds: jeweller Nirav Modi and associates used fraudulent Letters of Undertaking (LoUs) sent via SWIFT messaging (which was not linked to CBS) to obtain credit from overseas banks, defrauding PNB of ~₹14,000 crore.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Money Laundering' in the banking context?",
    options: ["Physically washing currency notes", "The process of disguising illegally obtained money as legitimate funds through placement, layering, and integration stages", "Laundering bank loans without proper collateral", "Transferring money without bank approval"],
    correct_answer: 1,
    explanation: "Money laundering involves 3 stages: Placement (injecting illegal money into financial system), Layering (complex transactions to obscure source), and Integration (laundered money re-enters economy as legitimate). Prevention of Money Laundering Act (PMLA) 2002 governs this in India.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // Economic Indicators Banks Monitor
  {
    question_text: "What is India's approximate foreign exchange reserve level as of 2024?",
    options: ["$100 billion", "$300 billion", "$620-650 billion (among world's top 5)", "$1 trillion"],
    correct_answer: 2,
    explanation: "India's forex reserves stand at approximately $620-650 billion as of 2024, making India among the world's top 5 holders of foreign exchange reserves. These include foreign currency assets, gold, SDRs, and IMF reserve position, managed by RBI.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the 'Current Account Deficit' (CAD)?",
    options: ["Deficit in the current year's bank accounts", "When a country's imports of goods, services, and transfers exceed its exports — negative balance of trade in current account of BOP", "Bank's current account showing a negative balance", "Deficit in current government accounts"],
    correct_answer: 1,
    explanation: "CAD occurs when total imports (goods + services + remittances outflow) exceed total exports. India typically runs a CAD (~1-3% of GDP) as it is a net importer of oil, gold, and electronics. High CAD can depreciate the rupee.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What does 'Fiscal Deficit' mean?",
    options: ["Deficit in physical infrastructure", "Excess of total government expenditure over total revenue receipts (excluding borrowings)", "Deficit in foreign exchange", "Difference between exports and imports"],
    correct_answer: 1,
    explanation: "Fiscal Deficit = Total Expenditure − (Revenue Receipts + Non-Debt Capital Receipts). It represents the total borrowing requirement of the government. India targets the fiscal deficit under the FRBM Act. For FY24, target was 5.1% of GDP.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the 'Monetary Policy Report' (MPR) published by RBI?",
    options: ["Annual report of all monetary transactions in India", "A bi-annual report presenting MPC's projections for inflation and growth with analysis of monetary policy", "A monthly policy document", "A report on digital money by RBI"],
    correct_answer: 1,
    explanation: "RBI publishes the Monetary Policy Report twice a year (April and October) as mandated under the RBI Act. It covers MPC's inflation projections (CPI), GDP growth projections, detailed analysis of monetary policy decisions, and risks to the outlook.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // Banking Schemes
  {
    question_text: "What is the 'Stand Up India' scheme?",
    options: ["Scheme for start-ups", "Bank loans of ₹10 lakh to ₹1 crore for SC/ST borrowers and women entrepreneurs to set up greenfield enterprises", "Scheme to revive failing banks", "Initiative for banks to stand up to NPAs"],
    correct_answer: 1,
    explanation: "Stand Up India (launched April 5, 2016) facilitates bank loans (₹10 lakh–₹1 crore) per bank branch to at least one SC/ST borrower and one woman borrower for greenfield enterprises in manufacturing, services, or trading. Banks must achieve this target.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the 'PM SVANidhi' scheme?",
    options: ["A housing scheme for street vendors", "A microcredit scheme providing collateral-free loans of ₹10,000 (first loan) to ₹50,000 to urban street vendors", "A savings scheme for small vendors", "A scheme for self-help groups in villages"],
    correct_answer: 1,
    explanation: "PM SVANidhi (PM Street Vendor's AtmaNirbhar Nidhi), launched in June 2020, provides collateral-free working capital loans: ₹10,000 (1st), ₹20,000 (2nd), and ₹50,000 (3rd) to urban street vendors. Timely repayment earns an interest subsidy of 7%.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Under PMJDY, what is the overdraft facility available to account holders?",
    options: ["No overdraft facility", "₹10,000 overdraft for eligible account holders (increased from ₹5,000)", "₹1 lakh for all account holders", "₹50,000 for women account holders"],
    correct_answer: 1,
    explanation: "Under PMJDY, eligible account holders (one per household, preferably women) can avail an overdraft of ₹10,000 (increased from ₹5,000 in 2018). The first ₹2,000 is provided without any conditions; beyond that, satisfactory account operation is required.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'GeM' (Government e-Marketplace) and its relevance to banking?",
    options: ["A gem trading platform", "A digital procurement portal for government buying goods/services; banks provide payment gateway/credit facilities to GeM sellers", "A gold exchange market regulated by banks", "A government scheme for gem exporters"],
    correct_answer: 1,
    explanation: "GeM is the government's e-procurement marketplace for all government ministries/departments to buy goods/services from registered sellers (MSMEs, startups). Banks provide payment gateways, credit facilities, and MSME loans to GeM sellers, supporting financial inclusion.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the 'Emergency Credit Line Guarantee Scheme' (ECLGS) launched in 2020?",
    options: ["Emergency credit for banks facing crisis", "100% government-guaranteed additional credit up to 20% of outstanding loan for MSMEs/businesses stressed by COVID-19", "Emergency credit for emergency services sector", "A World Bank funded emergency loan"],
    correct_answer: 1,
    explanation: "ECLGS (part of Aatmanirbhar Bharat 2020) provided 100% government-guaranteed, collateral-free additional credit (up to 20% of outstanding loan as of February 2020) to MSMEs, businesses, and individual borrowers to help them survive COVID-19 disruption.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  // Miscellaneous Final Questions
  {
    question_text: "What is 'Core Banking Solution' (CBS) in banking?",
    options: ["A core savings account product", "A centralised banking software enabling real-time processing across all branches of a bank", "A banking solution for corporate clients only", "A core committee for banking solutions"],
    correct_answer: 1,
    explanation: "CBS is a centralised banking software (like Finacle, Bancs24, Temenos) where all bank branches are connected to a central server. Any transaction at any branch updates the central database in real-time, enabling anywhere-banking and 24x7 services.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the minimum capital requirement for setting up a new universal bank in India (per RBI guidelines)?",
    options: ["₹100 crore", "₹200 crore", "₹500 crore", "₹1,000 crore"],
    correct_answer: 2,
    explanation: "RBI's guidelines for on-tap licensing of universal banks (August 2016) require minimum paid-up voting equity capital of ₹500 crore. Promoters must hold minimum 26% equity for 15 years. Eligible promoters include corporations with 10 years of business track record.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is a 'Bancassurance' model?",
    options: ["Insurance against bank failures", "A partnership where banks distribute insurance products through their branch networks", "Banks and insurance companies competing", "A type of bank guarantee"],
    correct_answer: 1,
    explanation: "Bancassurance is an arrangement between a bank and insurance company to offer insurance products through the bank's distribution channels. In India, banks can tie up with one life insurer and one general insurer. Examples: SBI Life (SBI + BNP Paribas), HDFC Life (HDFC + Standard Life).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the 'Account Aggregator' (AA) framework of RBI?",
    options: ["A system that aggregates multiple bank accounts into one", "A regulated financial data-sharing framework where customers can share their financial data from multiple institutions with third parties for credit/investment decisions", "A system to aggregate all banking complaints", "An account for aggregating investments"],
    correct_answer: 1,
    explanation: "The AA framework (launched September 2021 with 8 banks) allows individuals to share their financial data (bank statements, insurance, investments) from multiple Financial Information Providers (FIPs) to Financial Information Users (FIUs) — with consent, securely, and in machine-readable format.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Deposit Mobilisation' in banking?",
    options: ["Mobile banking for deposits", "The process by which banks collect deposits from the public to fund lending and investment activities", "Moving deposits between bank branches", "Mobilising depositors to attend bank events"],
    correct_answer: 1,
    explanation: "Deposit mobilisation is the core liability-side function of banks — attracting savings from the public through current accounts, savings accounts, fixed deposits, and recurring deposits. These deposits form the primary source of funds for bank lending.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the 'Banking Regulation Act, 1949' significant for?",
    options: ["It established RBI", "It provided comprehensive legal framework for regulation and supervision of commercial banks in India", "It nationalised banks", "It established NABARD"],
    correct_answer: 1,
    explanation: "The Banking Regulation Act, 1949 (originally Banking Companies Act, 1949) gave RBI comprehensive powers to license, regulate, inspect, and control commercial banks. It governs bank licensing, capital requirements, liquid assets (SLR), branch expansion, mergers, and winding up.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Asset Liability Management' (ALM) in banks?",
    options: ["Managing both assets and liabilities separately", "A framework to manage mismatches between a bank's assets (loans) and liabilities (deposits) in terms of maturity, interest rate, and currency", "Listing all assets and liabilities", "An accounting standard for banks"],
    correct_answer: 1,
    explanation: "ALM helps banks manage the risk arising from mismatches between assets (loans, investments) and liabilities (deposits, borrowings) in terms of duration, interest rate sensitivity, and currency. Banks have an Asset Liability Committee (ALCO) for this purpose.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is a 'Deferred Payment Guarantee' (DPG) in banking?",
    options: ["A guarantee for deferred salary payments", "A bank guarantee assuring payment of deferred instalments on credit purchases of capital goods", "Guarantee given after delay", "A type of NPA guarantee"],
    correct_answer: 1,
    explanation: "A Deferred Payment Guarantee is a bank guarantee issued in favour of a supplier of capital goods (like machinery). The guarantee assures the supplier that the buyer will pay the deferred instalments as per the credit agreement.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the role of 'CIBIL TransUnion' in Indian banking?",
    options: ["A credit rating agency for government bonds", "India's first and largest Credit Information Company maintaining credit histories and providing credit scores (300-900) for individuals and businesses", "A loan disbursement company", "A subsidiary of RBI for credit monitoring"],
    correct_answer: 1,
    explanation: "TransUnion CIBIL (est. 2000) maintains credit records of ~600 million individuals and ~32 million businesses. Banks check CIBIL scores (300-900; above 750 is good) before granting loans. It is one of 4 Credit Information Companies licensed by RBI (others: Equifax, Experian, CRIF High Mark).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the 'Marginal Cost of Funds Based Lending Rate' (MCLR)?",
    options: ["A minimum lending rate set by RBI directly", "An internal benchmark lending rate computed by banks based on marginal cost of funds; replaced Base Rate from April 2016", "The maximum rate banks can charge", "A rate based on market conditions only"],
    correct_answer: 1,
    explanation: "MCLR (introduced April 2016) replaced the Base Rate system. Banks compute MCLR based on marginal cost of funds, CRR cost, operating costs, and tenor premium. From October 2019, new floating rate retail loans are linked to external benchmarks (repo rate), not MCLR.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Green Banking' or sustainable banking?",
    options: ["Banks painted green for branding", "Banking practices and products that promote environmental sustainability — green bonds, renewable energy loans, reducing carbon footprint", "Banking for agricultural (green) sector only", "A government colour-coded banking scheme"],
    correct_answer: 1,
    explanation: "Green Banking integrates environmental and social risks into banking decisions. It includes: financing renewable energy projects, issuing green bonds, digital banking to reduce paper, carbon footprint targets, and ESG (Environmental, Social, Governance) criteria for lending decisions.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the 'National Infrastructure Pipeline' (NIP) relevant to banking?",
    options: ["A pipeline project funded by banks", "A government plan outlining ₹111 lakh crore in infrastructure investment (2019-25), creating massive financing opportunities for banks and financial institutions", "A pipeline for banking data infrastructure", "An RBI initiative for bank infrastructure"],
    correct_answer: 1,
    explanation: "NIP (launched December 2019) outlines India's infrastructure investment plan of ₹111 lakh crore over 5 years (FY2020-25) across sectors like roads, railways, energy, and urban development. Banks and DFIs (like NaBFID) finance these projects, creating significant long-term lending opportunities.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'NaBFID' established in 2021?",
    options: ["National Banking and Finance Institution for Development", "National Bank for Financing Infrastructure and Development — a new DFI set up to finance long-term infrastructure projects in India", "National Bureau for Financial and Investment Development", "New Banking Framework for Industrial Development"],
    correct_answer: 1,
    explanation: "NaBFID (National Bank for Financing Infrastructure and Development) was established in 2021 as a Development Finance Institution to fill the long-term infrastructure financing gap. It provides long-term loans, partial credit guarantees, and refinancing to infrastructure projects. Initial capital: ₹20,000 crore from government.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the key difference between a 'Scheduled Bank' and a 'Non-Scheduled Bank' in India?",
    options: ["Scheduled banks follow a time schedule; non-scheduled don't", "Scheduled banks are included in the 2nd Schedule of the RBI Act meeting paid-up capital and reserve requirements; non-scheduled banks are not", "Scheduled banks are listed on stock exchanges", "Scheduled banks work in shifts; non-scheduled work 24x7"],
    correct_answer: 1,
    explanation: "Scheduled banks are listed in the Second Schedule of the RBI Act, 1934, having minimum paid-up capital and reserves of ₹5 lakh (raised by RBI). They get RBI facilities (CRR maintenance, borrowing from RBI, clearing house membership). Most commercial banks in India are scheduled banks.",
    difficulty: "medium",
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
