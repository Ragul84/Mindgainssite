require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const REDIS_URL = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
const KEY = 'quiz:subject:banking';

async function rpush(items) {
  const res = await fetch(`${REDIS_URL}/rpush/${encodeURIComponent(KEY)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(items.map(q => JSON.stringify(q))),
  });
  return res.json();
}

const questions = [
  { question_text: "The RBI was established in:", options: ["1930", "1935", "1947", "1949"], correct_answer: 1, explanation: "The Reserve Bank of India was established on 1 April 1935 under the Reserve Bank of India Act, 1934. It was nationalised on 1 January 1949.", difficulty: "medium", exam_types: ["banking","ssc","tnpsc"] },
  { question_text: "SLR stands for:", options: ["Standard Liquidity Ratio", "Statutory Liquidity Ratio", "Secured Lending Rate", "Special Lending Reserve"], correct_answer: 1, explanation: "SLR (Statutory Liquidity Ratio) is the minimum percentage of deposits that commercial banks must maintain in gold, cash, or approved securities. It is set by RBI.", difficulty: "medium", exam_types: ["banking","ssc","tnpsc"] },
  { question_text: "Which bank was the first to be nationalised in India?", options: ["Punjab National Bank", "Bank of Baroda", "Imperial Bank of India", "State Bank of India"], correct_answer: 2, explanation: "Imperial Bank of India was nationalised in 1955 and renamed as State Bank of India (SBI).", difficulty: "medium", exam_types: ["banking","ssc","tnpsc"] },
  { question_text: "IMPS stands for:", options: ["Immediate Money Payment System", "Immediate Payment Service", "Inter-bank Mobile Payment Service", "Instant Mobile Payment System"], correct_answer: 1, explanation: "IMPS (Immediate Payment Service) is an instant 24/7 real-time interbank electronic fund transfer service maintained by NPCI. It works on mobile and internet.", difficulty: "medium", exam_types: ["banking","ssc"] },
  { question_text: "NEFT transactions are settled:", options: ["Immediately", "In real time", "In batches every half hour", "Once a day"], correct_answer: 2, explanation: "NEFT (National Electronic Funds Transfer) settles transactions in batches (hourly). Unlike RTGS, it is not real-time. NEFT now operates 24/7.", difficulty: "medium", exam_types: ["banking","ssc"] },
  { question_text: "The minimum amount for an RTGS transaction is:", options: ["₹1 lakh", "₹2 lakhs", "₹5 lakhs", "₹10 lakhs"], correct_answer: 1, explanation: "RTGS (Real Time Gross Settlement) has a minimum transaction limit of ₹2 lakhs. It is used for high-value, real-time fund transfers.", difficulty: "medium", exam_types: ["banking","ssc"] },
  { question_text: "KYC in banking stands for:", options: ["Keep Your Cash", "Know Your Customer", "Know Your Credit", "Key Your Code"], correct_answer: 1, explanation: "KYC (Know Your Customer) is a mandatory process for financial institutions to verify the identity and address of their customers to prevent money laundering and fraud.", difficulty: "medium", exam_types: ["banking","ssc","tnpsc"] },
  { question_text: "NBFC stands for:", options: ["National Banking Financial Corporation", "Non-Banking Financial Company", "New Banking Finance Committee", "National Bureau of Financial Control"], correct_answer: 1, explanation: "NBFCs (Non-Banking Financial Companies) are financial institutions that provide banking services (loans, credit) but do not hold a banking licence and cannot accept demand deposits.", difficulty: "medium", exam_types: ["banking","ssc"] },
  { question_text: "The NPA (Non-Performing Asset) of a bank refers to:", options: ["A loan where interest is being paid regularly", "A loan/advance where repayment of principal or interest is overdue for 90 days or more", "Government bonds held by banks", "Profit-making divisions of a bank"], correct_answer: 1, explanation: "NPA is a loan or advance where the borrower has not paid interest or principal for 90 days or more. High NPAs indicate poor asset quality and weaken bank balance sheets.", difficulty: "medium", exam_types: ["banking","upsc","tnpsc"] },
  { question_text: "The headquarter of NABARD is in:", options: ["New Delhi", "Kolkata", "Mumbai", "Chennai"], correct_answer: 2, explanation: "NABARD (National Bank for Agriculture and Rural Development) is headquartered in Mumbai. It was established in 1982.", difficulty: "medium", exam_types: ["banking","ssc","tnpsc"] },
  { question_text: "What is the full form of DICGC?", options: ["Deposit Insurance and Credit Guarantee Corporation", "Direct Insurance Credit and Guarantee Corporation", "Deposit Interest and Credit Guarantee Corporation", "Direct Income Credit Guarantee Corporation"], correct_answer: 0, explanation: "DICGC provides insurance cover on bank deposits (up to ₹5 lakh per depositor per bank). It is a subsidiary of RBI.", difficulty: "hard", exam_types: ["banking","upsc"] },
  { question_text: "PMJDY stands for:", options: ["Pradhan Mantri Jan Dhan Yojana", "Prime Minister Job Development Yojana", "Pradhan Mantri Jan Development Yojana", "Prime Minister Jan Dhan Yojana"], correct_answer: 0, explanation: "PMJDY (Pradhan Mantri Jan Dhan Yojana) was launched on 28 August 2014 to ensure financial inclusion by providing universal access to banking services.", difficulty: "medium", exam_types: ["banking","ssc","tnpsc"] },
  { question_text: "The Monetary Policy Committee (MPC) consists of how many members?", options: ["3", "5", "6", "7"], correct_answer: 2, explanation: "The MPC has 6 members: 3 from RBI (including the Governor as Chairman) and 3 external members appointed by the Government. It decides the benchmark interest rates.", difficulty: "hard", exam_types: ["banking","upsc"] },
  { question_text: "UPI was developed by:", options: ["RBI", "SEBI", "NPCI", "SBI"], correct_answer: 2, explanation: "UPI (Unified Payments Interface) was developed by NPCI (National Payments Corporation of India) in 2016. It enables instant real-time mobile payments.", difficulty: "medium", exam_types: ["banking","ssc","tnpsc"] },
  { question_text: "CIBIL score ranges from:", options: ["0 to 500", "300 to 900", "0 to 1000", "100 to 800"], correct_answer: 1, explanation: "CIBIL (Credit Information Bureau India Limited) score ranges from 300 to 900. A score above 750 is considered good for loan approval.", difficulty: "medium", exam_types: ["banking","ssc"] },
  { question_text: "The term 'Basel III' relates to:", options: ["Capital adequacy and risk management standards for banks", "International trade regulations", "Stock market regulations", "Insurance norms"], correct_answer: 0, explanation: "Basel III is a global regulatory framework for banks, focusing on capital adequacy (minimum capital requirements), stress testing, and market liquidity risk. It was developed by the Basel Committee on Banking Supervision.", difficulty: "hard", exam_types: ["banking","upsc"] },
  { question_text: "MUDRA stands for:", options: ["Micro Units Development and Refinance Agency", "Micro Urban Development and Retail Agency", "Monetary Utility Development and Retail Agency", "Multi-Urban Development and Refinance Agency"], correct_answer: 0, explanation: "MUDRA (Micro Units Development and Refinance Agency) was set up under PMMY (Pradhan Mantri MUDRA Yojana) to provide loans up to ₹10 lakh to non-corporate small/micro enterprises.", difficulty: "medium", exam_types: ["banking","ssc","tnpsc"] },
  { question_text: "The 'Prompt Corrective Action' (PCA) framework is used by RBI to:", options: ["Speed up loan approval", "Restrict activities of financially weak banks", "Promote rural banking", "Reduce lending rates"], correct_answer: 1, explanation: "PCA framework is RBI's supervisory tool to initiate timely corrective measures for banks facing financial stress (poor capital adequacy, high NPAs, negative returns on assets).", difficulty: "hard", exam_types: ["banking","upsc"] },
  { question_text: "SWIFT in banking stands for:", options: ["Society for Worldwide Interbank Financial Telecommunication", "Secure Worldwide Interbank Financial Transfer", "Standard Worldwide International Financial Telecommunication", "System for World Internet Financial Trading"], correct_answer: 0, explanation: "SWIFT is a global messaging network used by banks and financial institutions to securely send and receive information about financial transactions (not the actual money, just messages).", difficulty: "hard", exam_types: ["banking","upsc"] },
  { question_text: "Which organisation regulates insurance companies in India?", options: ["RBI", "SEBI", "IRDAI", "AMFI"], correct_answer: 2, explanation: "IRDAI (Insurance Regulatory and Development Authority of India) regulates and promotes the insurance industry in India. SEBI regulates securities markets. AMFI regulates mutual funds.", difficulty: "medium", exam_types: ["banking","ssc","tnpsc"] },
];

async function main() {
  const BATCH = 50;
  let total = 0;
  for (let i = 0; i < questions.length; i += BATCH) {
    const batch = questions.slice(i, i + BATCH);
    await rpush(batch);
    total += batch.length;
    console.log(`Batch ${Math.floor(i/BATCH)+1}: pushed ${batch.length} → total ${total}`);
  }
  console.log(`Done! ${total} banking questions pushed to ${KEY}`);
}
main().catch(console.error);
