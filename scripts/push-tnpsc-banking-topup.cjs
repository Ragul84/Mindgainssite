require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const BASE  = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
const KEY   = 'quiz:subject:banking';
const HDR   = { Authorization:`Bearer ${TOKEN}`, 'Content-Type':'application/json' };

const questions = [
  {
    question_text: "What is 'Reverse Mortgage' in banking?",
    options: ["A mortgage that can be reversed any time", "A loan for senior citizens against their home where the bank makes periodic payments to the borrower; repaid after the borrower's death/sale of property", "Mortgage transferred from one bank to another", "A second mortgage on the same property"],
    correct_answer: 1,
    explanation: "Reverse Mortgage (for senior citizens 60+ years) allows homeowners to get periodic payments from the bank against their home equity without selling it. The loan is repaid when the borrower dies, sells the home, or moves out. NHB and banks offer this.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is a 'Balloon Loan' or 'Balloon Payment'?",
    options: ["A loan that keeps increasing like a balloon", "A loan with smaller regular payments and one large final payment at maturity", "An inflated interest rate loan", "A loan for balloon manufacturing businesses"],
    correct_answer: 1,
    explanation: "In a balloon loan, the borrower makes smaller monthly payments during the loan term and one large lump-sum 'balloon payment' at the end. This keeps regular EMIs low but creates a large liability at maturity. Common in commercial real estate.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Amortisation' in the context of bank loans?",
    options: ["The process of deleting a loan from records", "The gradual repayment of a loan through regular instalments covering both principal and interest", "Adding interest to the principal annually", "The process of writing off a bad loan"],
    correct_answer: 1,
    explanation: "Amortisation is the process of paying off a loan over time through scheduled, regular payments (EMIs). Each payment covers interest for the period and reduces the principal. In the early period, most of the EMI goes toward interest; later, more goes to principal.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Teaser Rate' or 'Introductory Rate' in home loans?",
    options: ["A rate that teases customers without actual benefit", "A low initial interest rate for a fixed period that later resets to market rates", "A high promotional rate for new customers", "A rate applicable only for the first EMI"],
    correct_answer: 1,
    explanation: "Teaser rates are artificially low interest rates offered for an initial period (1-3 years) on home loans to attract borrowers. After this period, the rate resets to the prevailing market rate, which can significantly increase EMIs. RBI has flagged concerns about these practices.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Escrow Account' in banking?",
    options: ["An account for senior citizens", "A third-party account where funds are held until specific conditions are met, protecting both parties in a transaction", "A government escrow for bank deposits", "An account held in escrow countries"],
    correct_answer: 1,
    explanation: "An escrow account is held by a neutral third party (often a bank or escrow agent) on behalf of two transacting parties. Funds are released only when agreed-upon conditions are met. Used in real estate transactions, mergers & acquisitions, and infrastructure project financing.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Moral Suasion' as a tool of monetary policy?",
    options: ["Using moral values to train bank employees", "RBI's informal persuasion of banks through meetings, guidelines, and appeals without formal legal directives", "A legal directive mandating bank behaviour", "A suasion (persuasion) technique used in bank marketing"],
    correct_answer: 1,
    explanation: "Moral suasion is an informal, non-legal monetary policy tool where RBI uses persuasion, meetings, speeches, and unofficial communications to influence banks' behaviour (credit policy, interest rates) rather than issuing formal mandatory directives.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Maturity Transformation' — a core function of banks?",
    options: ["Transforming short-term deposits into long-term loans, accepting the liquidity and interest rate risk", "Converting one type of loan to another", "Transforming bank policies at maturity", "Converting foreign currency deposits to INR"],
    correct_answer: 0,
    explanation: "Maturity transformation is how banks create value: they borrow short-term (demand deposits, savings) and lend long-term (home loans, project loans). This mismatch generates NIM but also creates liquidity risk and interest rate risk that banks must manage through ALM.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Sovereign Credit Rating' and which agencies rate India?",
    options: ["Credit rating given by the sovereign (government) to banks", "An assessment of a country's ability and willingness to repay its debts; India is rated by Moody's, S&P, and Fitch", "A rating given by RBI to government securities", "A rating for India's forex reserves"],
    correct_answer: 1,
    explanation: "Sovereign credit ratings assess a country's creditworthiness. India's rating: Moody's = Baa3 (lowest investment grade), S&P = BBB- (lowest investment grade), Fitch = BBB- (lowest investment grade). A downgrade to junk would increase government borrowing costs and trigger capital outflows.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Financial Repression' in the context of banking?",
    options: ["Repressing bank fraud cases", "Policies that direct savings to the government at below-market rates (like mandatory SLR investments), effectively taxing savers", "Reducing bank financial operations", "Suppressing financial crime reports"],
    correct_answer: 1,
    explanation: "Financial repression refers to government policies that channel funds to the government at below-market rates. SLR (requiring banks to hold government securities), priority sector lending mandates, and interest rate controls are forms of financial repression in India.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Which year was NPCI (National Payments Corporation of India) incorporated?",
    options: ["2005", "2008", "2010", "2012"],
    correct_answer: 1,
    explanation: "NPCI was incorporated in December 2008 under the Companies Act as a not-for-profit company promoted by RBI and Indian Banks' Association (IBA). It operates payment systems including IMPS, UPI, RuPay, NEFT (transferred from RBI), NACH, BHIM, and FASTag.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the maximum deposit accepted by Payment Banks in India?",
    options: ["₹1 lakh", "₹2 lakh", "₹5 lakh", "No limit"],
    correct_answer: 1,
    explanation: "Payment Banks (licensed by RBI since 2015) can accept deposits up to ₹2 lakh per customer (increased from ₹1 lakh in 2021). They cannot lend but can offer remittances, payment services, and distribute insurance/mutual fund products. Examples: Airtel Payments Bank, India Post Payments Bank.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Basel III' accord in banking regulation?",
    options: ["A meeting in Basel, Switzerland discussing bank policies", "A global regulatory framework (post-2008 crisis) strengthening bank capital requirements, liquidity standards, and leverage ratios", "The third banking regulation in India after 1935 and 1949", "A Basel (city) accord on bank mergers"],
    correct_answer: 1,
    explanation: "Basel III (2010, finalised 2017) by the Basel Committee on Banking Supervision strengthened bank capital requirements: higher Tier 1 capital (min 6%), Capital Conservation Buffer (2.5%), Countercyclical Buffer, Leverage Ratio (min 3%), LCR, and NSFR. India implemented it under RBI guidelines.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the 'Insolvency Professional' (IP) under IBC 2016?",
    options: ["A professional who creates insolvencies", "A licensed professional who administers Corporate Insolvency Resolution Process (CIRP) as Interim Resolution Professional or Resolution Professional", "A lawyer specialising in insolvency law", "An RBI official managing bank insolvencies"],
    correct_answer: 1,
    explanation: "Under IBC 2016, an Insolvency Professional (IP) is a registered professional licensed by an Insolvency Professional Agency (IPA) and regulated by the Insolvency and Bankruptcy Board of India (IBBI). They manage the CIRP process at NCLT.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What does 'Subprime Lending' mean in the context of the 2008 financial crisis?",
    options: ["Lending below the prime rate to selected customers", "Lending to borrowers with poor credit histories at higher interest rates; widespread defaults caused the 2008 global financial crisis", "Prime-quality lending by sub-banks", "Lending by sub-prime minister approved banks"],
    correct_answer: 1,
    explanation: "Subprime lending refers to providing mortgages to borrowers with poor credit histories (subprime borrowers) at high interest rates. When US housing prices crashed (2007-08), millions defaulted. The resulting MBS/CDO losses triggered the 2008 global financial crisis.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Recapitalisation' of banks and why is it done?",
    options: ["Returning capital to bank shareholders", "Infusing fresh capital into banks (especially PSBs) to strengthen their capital adequacy ratio and support lending growth", "Recycling bank capital into new products", "Capitalising on bank recessions"],
    correct_answer: 1,
    explanation: "Recapitalisation involves infusing fresh equity capital into banks to improve their Capital Adequacy Ratio (CAR). The Government of India recapitalised PSBs through ₹2.11 lakh crore of recapitalisation bonds (2017-19) to address NPA-related capital erosion and restore lending capacity.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is India's target for the fiscal deficit as a percentage of GDP under the FRBM Act?",
    options: ["3% of GDP", "4% of GDP", "5% of GDP", "No fixed target"],
    correct_answer: 0,
    explanation: "The Fiscal Responsibility and Budget Management (FRBM) Act, 2003 sets the long-term fiscal deficit target at 3% of GDP. The N.K. Singh Committee (2017) recommended a debt ceiling of 60% of GDP for general government. The 2024-25 target was 5.1%, with a glide path to 4.5% by 2025-26.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Printing of Money' or 'Monetisation of Deficit' — and why is it inflationary?",
    options: ["RBI printing physical currency notes as needed", "When RBI directly purchases government securities to fund fiscal deficit, effectively creating new money which increases money supply and causes inflation", "Government printing its own money", "RBI monetising bank assets"],
    correct_answer: 1,
    explanation: "Monetisation of deficit occurs when the government borrows directly from RBI (by selling securities), which RBI 'buys' by creating new money. This increases the money supply without a corresponding increase in goods/services, causing inflation. India prohibits direct monetisation; government must borrow from market.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Inflation Targeting' adopted by India in 2016?",
    options: ["Setting a target to increase inflation", "A monetary policy framework where RBI targets CPI inflation at 4% (±2% tolerance band) as its primary objective", "Targeting price rises in specific sectors", "Setting a limit on deflation only"],
    correct_answer: 1,
    explanation: "India formally adopted inflation targeting through the RBI Act amendment in May 2016. The Monetary Policy Framework Agreement (2015) and subsequent legislation mandated RBI to maintain CPI inflation at 4% with a ±2% tolerance band (2%-6%). MPC was constituted to achieve this mandate.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the 'PFMS' (Public Financial Management System) relevant to banking?",
    options: ["A private financial management software", "A Government of India platform for real-time tracking of fund flows under all central government schemes, integrated with bank accounts", "A planning tool for financial management", "A personal finance management system by RBI"],
    correct_answer: 1,
    explanation: "PFMS (maintained by CGA under Ministry of Finance) enables direct benefit transfers, real-time tracking of fund utilisation under centrally sponsored schemes, and payment through a single treasury system integrated with all scheduled commercial banks.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Which organisation regulates credit rating agencies in India?",
    options: ["RBI", "SEBI", "Ministry of Finance", "IRDAI"],
    correct_answer: 1,
    explanation: "SEBI regulates Credit Rating Agencies (CRAs) in India under the SEBI (Credit Rating Agencies) Regulations, 1999. Registered CRAs in India: CRISIL, ICRA, CARE, India Ratings (Fitch affiliate), Brickwork Ratings, Acuité Ratings, and Infomerics Ratings.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the 'RBI Innovation Hub' (RBIH)?",
    options: ["A hub for RBI employees to innovate", "A wholly-owned subsidiary of RBI set up to promote innovation in the financial sector, incubating fintech solutions", "A physical hub for banking technology companies", "A government scheme for bank innovation"],
    correct_answer: 1,
    explanation: "Reserve Bank Innovation Hub (RBIH), set up in 2022 as a wholly-owned subsidiary of RBI, aims to promote innovation in the financial sector. It incubates, funds, and facilitates technology-driven financial solutions to enhance access to financial services. Bengaluru is its headquarters.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'GIFT City' (Gujarat International Finance Tec-City) in banking?",
    options: ["A gifted city for banking headquarters", "India's first International Financial Services Centre (IFSC) in Gandhinagar, Gujarat, offering offshore financial services regulated by IFSCA", "A city offering free banking services", "A gifted banking zone near Ahmedabad"],
    correct_answer: 1,
    explanation: "GIFT City in Gandhinagar, Gujarat is India's first IFSC. The IFSCA (International Financial Services Centres Authority), established 2020, regulates banking, insurance, capital markets, and other financial services in GIFT City in USD and other foreign currencies — like a financial SEZ.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the 'Small Industries Development Bank of India' (SIDBI)?",
    options: ["A bank only for small industries in India", "Principal Development Financial Institution for promotion, financing, and development of MSME sector in India, established in 1990", "A subsidiary of SBI for small enterprises", "SEBI's investment division for MSMEs"],
    correct_answer: 1,
    explanation: "SIDBI (est. April 2, 1990 under SIDBI Act, 1989) serves as the apex institution for MSME finance. It provides refinance, direct lending, equity/venture capital, and capacity development support. It also regulates and supervises NBFC-MFIs and runs MUDRA Ltd.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'EXIM Bank' and its primary function?",
    options: ["A bank for extreme investments", "Export-Import Bank of India — a specialised financial institution providing financing, guarantees, and advisory services to promote India's international trade", "An extension of Import-Export Ministry", "A bank dealing in extreme risk finance"],
    correct_answer: 1,
    explanation: "EXIM Bank of India (est. January 1982 under Export-Import Bank of India Act, 1981) provides buyer's credit (to foreign importers buying Indian goods), Lines of Credit to foreign governments, and various export financing products to promote India's international trade.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the 'Household Financial Savings Rate' and why does it matter for banking?",
    options: ["Percentage of household income saved as cash at home", "Proportion of household income saved in financial instruments (bank deposits, provident funds, insurance, shares); a key source of bank deposits", "Government measurement of family finances", "A rate used to calculate household income"],
    correct_answer: 1,
    explanation: "Household Financial Savings Rate (financial savings as % of GDP) measures how much households save through financial instruments rather than physical assets (gold, property). India's household financial savings declined to 5.1% of GDP in FY23 (from 11.5% in FY21 post-COVID), raising concerns about deposit growth for banks.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the current (2024) Repo Rate set by RBI's MPC?",
    options: ["5.50%", "6.00%", "6.50%", "7.00%"],
    correct_answer: 2,
    explanation: "As of 2024, RBI's Monetary Policy Committee kept the Repo Rate at 6.50% (unchanged since February 2023). With the February 2025 MPC meeting, RBI cut repo rate by 25 bps to 6.25%. The corridor: SDF = 6.00% (floor), Repo = 6.25%, MSF = 6.50% (ceiling).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is India's 'Unified Lending Interface' (ULI) — RBI's new initiative?",
    options: ["A unified interface for all bank loans", "A platform enabling lenders to access borrower data from multiple sources (land records, GST, account aggregators) for seamless digital credit delivery", "A lending platform like UPI but for loans", "A union of all lending institutions"],
    correct_answer: 1,
    explanation: "ULI (announced by RBI Governor in 2023, pilot by RBI Innovation Hub) aims to simplify and democratise credit access by allowing lenders to access a borrower's data from multiple sources (land records, milk/fishery data, GSTN, AA) through one interface — 'JAM Trinity for Credit'.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Priority Sector Lending' (PSL) target for domestic scheduled commercial banks?",
    options: ["30% of ANBC", "35% of ANBC", "40% of ANBC", "45% of ANBC"],
    correct_answer: 2,
    explanation: "All domestic SCBs must achieve PSL of 40% of Adjusted Net Bank Credit (ANBC) or Credit Equivalent of Off-Balance Sheet Exposures, whichever is higher. Sub-targets: Agriculture (18%), Small & Marginal Farmers (10%), Micro enterprises (7.5%), Weaker sections (12%).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Open Market Operation' (OMO) conducted by RBI?",
    options: ["Opening new bank branches in open markets", "RBI buying/selling government securities in the open market to inject/absorb liquidity and manage interest rates", "Market operations in the open economy", "A type of foreign exchange operation"],
    correct_answer: 1,
    explanation: "OMOs are RBI's purchases or sales of G-Secs in the open market. Buying G-Secs injects rupee liquidity (expansionary). Selling G-Secs absorbs liquidity (contractionary). OMOs are used to manage durable liquidity, not just day-to-day liquidity (handled by LAF).",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "Which Act governs the functioning of Non-Banking Financial Companies (NBFCs) in India?",
    options: ["NBFC Act, 2002", "Reserve Bank of India Act, 1934 (Chapter III B)", "Companies Act, 2013", "SEBI Act, 1992"],
    correct_answer: 1,
    explanation: "NBFCs are governed by Chapter III B of the Reserve Bank of India Act, 1934. RBI has the authority to register, regulate, and supervise NBFCs. NBFCs with assets above ₹500 crore are called NBFC-ND-SI (systemically important) and face stricter regulations.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is a 'Debenture' in corporate finance and how is it different from a bank loan?",
    options: ["A debenture is the same as a bank loan", "A debenture is a long-term debt instrument issued by a company to the public; unlike bank loans, debentures are tradeable on stock exchanges", "A debenture is a type of equity share", "A debenture is a certificate of deposit"],
    correct_answer: 1,
    explanation: "Debentures are unsecured/secured long-term debt instruments issued by companies to raise capital from the public. They carry a fixed interest rate (coupon) and are tradeable on stock exchanges (unlike bank loans). Regulated by SEBI. Banks also subscribe to corporate debentures.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Subvention' in the context of bank loans, particularly agricultural loans?",
    options: ["A subsidy where the government pays a portion of interest on behalf of borrowers to make credit cheaper", "A ban on certain types of loans", "A type of banking supervision", "A subversion of standard banking norms"],
    correct_answer: 0,
    explanation: "Interest subvention is a government scheme where the government pays part of the interest on behalf of borrowers to reduce their effective interest rate. For short-term agricultural loans up to ₹3 lakh, the government provides 2% interest subvention + 3% incentive for prompt repayment, effectively making credit available at 4% p.a. to farmers.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the 'India Stack' concept in digital banking?",
    options: ["A stack of Indian currency notes", "A set of open APIs (Aadhaar, UPI, eKYC, DigiLocker, Account Aggregator) enabling digital identity, payments, and data sharing across financial services", "A technology stack used by Indian banks' IT systems", "A stack of financial regulations in India"],
    correct_answer: 1,
    explanation: "India Stack is a collection of open, interoperable APIs building blocks: Presence-less layer (Aadhaar eKYC), Paperless layer (DigiLocker, eSign), Cashless layer (UPI, IMPS, RuPay), and Consent layer (Account Aggregator). It enables frictionless digital financial services at scale.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Demonetisation' and when was it implemented in India most recently?",
    options: ["Removal of all currency from circulation, done annually by RBI", "Sudden withdrawal of specific currency denominations (₹500 and ₹1000 notes) from legal tender status, announced November 8, 2016 by PM Modi", "Decreasing the denomination of currency", "An RBI scheme to demote high-value notes"],
    correct_answer: 1,
    explanation: "On November 8, 2016, PM Narendra Modi announced the demonetisation of ₹500 and ₹1000 notes (86% of currency in circulation) to curb black money, counterfeit notes, and terrorism financing. New ₹500 and ₹2000 notes were introduced. ₹2000 notes were withdrawn in May 2023.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Financial Literacy' and how does RBI promote it?",
    options: ["Literacy achieved through studying finance books", "Ability to understand and use financial concepts; RBI promotes through Financial Literacy Week, FL Centres, and BC network", "A literacy programme for bank employees", "A SEBI initiative for investor education"],
    correct_answer: 1,
    explanation: "Financial Literacy is the ability to understand financial concepts (savings, investments, credit, insurance) and make informed decisions. RBI promotes it through: Annual Financial Literacy Week, Financial Literacy Centres (FLCs) at bank branches, Moneywise website, and BC (Business Correspondent) network outreach.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the 'RBI's Regulatory Sandbox' scheme?",
    options: ["A physical sandbox for testing banking ATMs", "A controlled environment allowing fintech companies to live-test innovative financial products with limited regulatory compliance requirements", "A sandbox game for learning RBI regulations", "A regulatory scheme for sand and construction finance"],
    correct_answer: 1,
    explanation: "RBI's Regulatory Sandbox (launched 2019) allows fintech companies and innovators to test new products, services, or business models in a live environment with a limited set of real customers under RBI's oversight, with relaxed regulatory requirements. Multiple cohorts have focused on retail payments, cross-border payments, MSME lending, etc.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Insurance Penetration' and what is India's approximate insurance penetration rate?",
    options: ["Number of insurance agents per area", "Ratio of insurance premium to GDP; India's insurance penetration is approximately 4% of GDP", "Percentage of population with insurance", "Number of insurance policies sold per year"],
    correct_answer: 1,
    explanation: "Insurance Penetration = (Total Insurance Premium / GDP) × 100. India's penetration is approximately 4% of GDP (3.2% life + 1% non-life) as of 2022-23, which is below the global average (~7%). IRDAI aims to achieve 'Insurance for All by 2047' targeting much higher penetration.",
    difficulty: "hard",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is the 'Marginal Standing Facility' (MSF) of RBI?",
    options: ["A facility for banks standing at the margin of insolvency", "A facility where banks can borrow overnight funds from RBI above the LAF limit, at a rate higher than Repo Rate (Repo + 25 bps)", "A standing deposit facility at the margin", "A margin loan facility for stock market operations"],
    correct_answer: 1,
    explanation: "MSF (introduced May 2011) allows SCBs to borrow overnight funds from RBI against approved government securities, at a rate 25 basis points above the Repo Rate. Banks can use this even if their SLR holdings fall below the minimum, up to 2% of their NDTL. It is the LAF corridor ceiling.",
    difficulty: "medium",
    exam_types: ["tnpsc","ssc","upsc"]
  },
  {
    question_text: "What is 'Financial Contagion' in banking?",
    options: ["Contagious diseases in banking sector", "The spread of financial distress from one institution, market, or country to others through interconnections", "Financial information spread through banking networks", "A type of bank fraud spreading to other banks"],
    correct_answer: 1,
    explanation: "Financial contagion describes how financial shocks spread through interconnected systems. The 2008 US subprime crisis spread globally through: interbank lending, MBS/CDO exposure, trade finance contraction, and loss of confidence. India was partially insulated due to limited exposure to toxic US assets.",
    difficulty: "hard",
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
