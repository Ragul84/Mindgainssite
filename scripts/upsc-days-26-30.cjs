require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const s = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const days = [
{
  day:26, topic:'National Income: GDP, GNP, NNP',
  notes:[
    {title:'Core Concepts', detail:'GDP (Gross Domestic Product): Total value of final goods & services produced WITHIN India in a year — regardless of who produces it. GNP = GDP + Net Factor Income from Abroad (NFIA). NNP = GNP - Depreciation (Capital Consumption). NNP at Market Price = National Income when measured at market prices.'},
    {title:'GDP at Market Price vs Factor Cost', detail:'GDP at Market Price = GDP at Factor Cost + Indirect Taxes - Subsidies. Since 2015, India calculates GDP at MARKET PRICES (not factor cost as before). Base year changed to 2011-12. This makes Indian GDP figures appear different from pre-2015 data.'},
    {title:'Real vs Nominal GDP', detail:'Nominal GDP: At current prices (includes inflation effect). Real GDP: Adjusted for inflation using base year prices. Real GDP growth = True economic growth. GDP Deflator: Nominal GDP / Real GDP × 100 — measures economy-wide inflation (broader than CPI/WPI).'},
    {title:'Per Capita & HDI', detail:'GDP Per Capita = GDP / Population. India is a large GDP economy but low per capita — because of high population. Human Development Index (UNDP): Health (life expectancy) + Education (years of schooling) + Income (GNI per capita). India ranked 132/193 in HDI 2023.'}
  ],
  hook:'UPSC Calculation Trap: NNP at Factor Cost = National Income (in the traditional sense). But since 2015, India measures GDP at Market Price. So when a question says "National Income," check if it asks for NNP at FC (old definition) or the newer GDP-at-Market-Price approach. Also: GVA (Gross Value Added) = GDP at Factor Cost — used by RBI and sector-wise analysis.',
  cards:[
    {front:'What is the formula for GNP and how does it differ from GDP?', back:'GNP = GDP + Net Factor Income from Abroad (NFIA). NFIA = Income earned by Indians abroad - Income earned by foreigners in India. GNP captures national production while GDP captures domestic production. For India, NFIA is usually positive (diaspora remittances).'},
    {front:'Why did India shift to GDP at Market Prices in 2015?', back:'To align with international standards (UN System of National Accounts 2008). Also changed base year from 2004-05 to 2011-12. GDP at Market Price includes indirect taxes but nets out subsidies — gives a more complete picture of what buyers actually pay.'},
    {front:'What is the GDP Deflator and how does it differ from CPI?', back:'GDP Deflator = (Nominal GDP / Real GDP) × 100. Measures economy-wide inflation — covers ALL goods and services. CPI covers only a fixed basket of consumer goods. GDP Deflator is broader and used to convert nominal to real GDP. CPI is used for monetary policy by RBI.'}
  ],
  q:[
    {q:'Which of the following correctly represents the relationship between GDP, GNP and NNP?', options:['GNP = GDP - NFIA; NNP = GNP + Depreciation','GNP = GDP + NFIA; NNP = GNP - Depreciation','NNP = GDP + Depreciation; GNP = NNP + NFIA','GNP = GDP - Depreciation; NNP = GNP + NFIA'], answer_index:1, explanation:'GNP = GDP + NFIA (Net Factor Income from Abroad). NNP = GNP - Depreciation. NNP at Factor Cost = National Income (traditional). These formulas are foundational and tested both in direct formula questions and indirect application questions in UPSC.'},
    {q:'Since 2015, India measures GDP using which of the following approaches?', options:['At Factor Cost with base year 2004-05','At Market Prices with base year 2011-12','At Factor Cost with base year 2011-12','At Market Prices with base year 2004-05'], answer_index:1, explanation:'In 2015, India adopted GDP at Market Prices (adding indirect taxes, netting subsidies) and changed base year to 2011-12 from 2004-05. This is why post-2015 GDP figures are not directly comparable to earlier data.'}
  ],
  pyq:'Very High — UPSC 2016, 2019, 2021, 2023. National income concepts and 2015 methodology change tested.',
  summary:'GDP(domestic production). GNP=GDP+NFIA. NNP=GNP-Depreciation. NNP at FC=National Income. India: GDP at Market Price(since 2015)+Base year 2011-12. Nominal GDP(current prices) vs Real GDP(base year prices). GDP Deflator=Nominal/Real×100(economy-wide inflation). HDI(UNDP)=Health+Education+Income. India HDI rank 132(2023).'
},
{
  day:27, topic:'Inflation: CPI, WPI & RBI Monetary Policy',
  notes:[
    {title:'CPI vs WPI', detail:'CPI (Consumer Price Index): Measures price changes at RETAIL level for a fixed basket of goods. Used by RBI as inflation anchor. CPI-Combined (urban + rural) is primary. WPI (Wholesale Price Index): Measures price changes at WHOLESALE/producer level. Published by Ministry of Commerce. NOT used by RBI for monetary policy since 2014.'},
    {title:'RBI Inflation Targeting', detail:'Flexible Inflation Targeting Framework (2016). Primary objective: Maintain CPI inflation at 4% (± 2% tolerance band = 2%-6%). If CPI is outside band for 3 consecutive quarters, RBI MUST explain to government in writing. MPC (Monetary Policy Committee): 6 members — 3 RBI + 3 government nominees. Decisions by majority vote, Governor has casting vote.'},
    {title:'Types of Inflation', detail:'Demand-Pull: Excess demand over supply (economy overheating). Cost-Push: Supply-side shock (oil price rise, input cost rise). Built-in: Wage-price spiral. Stagflation: High inflation + High unemployment (unusual — 1970s oil crisis). Deflation: Falling prices (dangerous — Japan\'s lost decade).'},
    {title:'RBI Tools — Quantitative', detail:'Repo Rate: Rate at which RBI lends to commercial banks (short-term, overnight). Reverse Repo Rate: Rate at which banks park excess money WITH RBI. CRR (Cash Reserve Ratio): % of deposits banks must keep with RBI — earns NO interest. SLR (Statutory Liquidity Ratio): % of deposits banks must keep in liquid assets (gold/govt bonds) — earns interest.'}
  ],
  hook:'UPSC Precision Trap: CRR earns ZERO interest — money literally sits with RBI. SLR is kept WITH THE BANK ITSELF (not with RBI) — invested in govt securities that earn interest. When RBI raises Repo Rate: Borrowing becomes expensive → investment falls → demand reduces → inflation controlled. This transmission chain is heavily tested.',
  cards:[
    {front:'What is the current RBI inflation target under the Flexible Inflation Targeting Framework?', back:'4% CPI inflation ± 2% tolerance band (range: 2%-6%). Adopted in 2016. If CPI stays outside band for 3 consecutive quarters, RBI must submit report to government explaining reasons and corrective steps.'},
    {front:'What is the difference between CRR and SLR?', back:'CRR: % of deposits kept as cash WITH RBI — earns NO interest. SLR: % of deposits kept by bank itself in liquid assets (gold, government securities) — earns interest. Both are monetary tools to control money supply. Higher CRR/SLR = less money available for lending = tighter money supply.'},
    {front:'Who controls the Monetary Policy Committee (MPC) and how are decisions made?', back:'MPC has 6 members: 3 from RBI (Governor + 2 Deputy Governors) + 3 External Members appointed by Government. Decisions by majority vote. In case of tie, Governor has casting vote. Meets every 2 months. Sets Repo Rate.'}
  ],
  q:[
    {q:'Which of the following correctly describes the Reverse Repo Rate?', options:['Rate at which RBI borrows from commercial banks','Rate at which commercial banks borrow from RBI','Rate at which banks lend to each other overnight','Rate at which RBI lends to State governments'], answer_index:0, explanation:'Reverse Repo Rate: RBI borrows money from commercial banks (banks park excess funds with RBI). This absorbs excess liquidity from the system. Repo Rate = RBI lends to banks. When RBI raises Reverse Repo, banks prefer to park money with RBI rather than lend — reduces money supply.'},
    {q:'The primary inflation indicator used by RBI for monetary policy decisions is which of the following?', options:['WPI — Wholesale Price Index','CPI — Consumer Price Index (Combined)','PPI — Producer Price Index','GDP Deflator'], answer_index:1, explanation:'Since 2014, RBI uses CPI-Combined (Urban + Rural) as its primary inflation anchor. WPI was previously used but switched because CPI better captures consumer-level price changes relevant to actual living standards. The 4% ± 2% target under FITF is CPI-based.'}
  ],
  pyq:'Very High — UPSC 2018, 2020, 2022. MPC composition, CPI vs WPI, CRR vs SLR — perennial topics.',
  summary:'CPI(retail,RBI anchor) vs WPI(wholesale,Commerce Ministry). Inflation target: 4%±2% CPI(2016 FITF). MPC: 6 members(3 RBI+3 govt), majority vote, Governor casting vote. Repo=RBI lends to banks. Reverse Repo=banks park with RBI. CRR(with RBI,0% interest) vs SLR(with bank,earns interest). Stagflation=inflation+unemployment. Deflation=falling prices(dangerous).'
},
{
  day:28, topic:'Banking System: RBI, CRR, SLR & Repo Rate',
  notes:[
    {title:'RBI Functions', detail:'Monetary Authority: Controls money supply via Repo, Reverse Repo, CRR, SLR, Open Market Operations (OMO). Banker to Government: Manages government accounts, advises on borrowing. Banker\'s Bank / Lender of Last Resort: Provides emergency funds to banks. Regulator: Licenses banks, sets prudential norms. Foreign Exchange Manager: Manages Forex reserves under FEMA 1999.'},
    {title:'Priority Sector Lending', detail:'Banks must lend 40% of Adjusted Net Bank Credit (ANBC) to priority sectors. Priority sectors: Agriculture (18%), Micro enterprises, Education, Housing (affordable), Social infrastructure, Renewable energy, Weaker sections. Foreign banks (20+ branches): 40%. Foreign banks (< 20 branches): 32%.'},
    {title:'Types of Banks in India', detail:'Scheduled Commercial Banks (SCBs): Public sector (SBI, nationalized banks), Private (HDFC, ICICI), Foreign (Citi, Standard Chartered), Small Finance Banks, Payment Banks. Cooperative Banks: Urban and Rural. Development Finance Institutions: NABARD (agriculture), NHB (housing), SIDBI (small industries), EXIM Bank.'},
    {title:'NABARD & Financial Inclusion', detail:'NABARD (National Bank for Agriculture and Rural Development): Apex institution for rural credit. Refinances rural banks (RRBs, cooperative banks). MUDRA Bank: Micro-lending (Shishu up to ₹50,000, Kishor up to ₹5 lakh, Tarun up to ₹10 lakh). Jan Dhan Yojana: Financial inclusion — zero-balance accounts.'}
  ],
  hook:'UPSC Classification Trap: Payment Banks (Paytm, Airtel) CANNOT give loans — they can only accept deposits (up to ₹2 lakh) and provide remittance services. Small Finance Banks CAN give loans. This distinction is tested. Also: RBI is NOT owned by the government — it is a statutory corporation. Government holds 100% shares since nationalization in 1949.',
  cards:[
    {front:'What is the difference between Open Market Operations (OMO) and Repo Rate as monetary tools?', back:'Repo Rate: Interest rate at which RBI lends to banks — affects borrowing cost. OMO: RBI directly buys (injects liquidity) or sells (absorbs liquidity) government securities in open market. OMO directly changes money supply; Repo Rate influences it through interest rate channel.'},
    {front:'What are the three categories of MUDRA loans and their limits?', back:'Shishu: Up to ₹50,000 (startups, micro-enterprises). Kishor: ₹50,000 to ₹5 lakh (established micro-businesses). Tarun: ₹5 lakh to ₹10 lakh (growth-stage small businesses). All three are collateral-free loans under Pradhan Mantri MUDRA Yojana.'},
    {front:'What is NABARD and what institutions does it refinance?', back:'National Bank for Agriculture and Rural Development — apex body for rural and agricultural credit. Refinances: Regional Rural Banks (RRBs), District Cooperative Banks, State Cooperative Banks. Does NOT directly lend to farmers — works through these intermediary institutions.'}
  ],
  q:[
    {q:'Which of the following functions does a Payment Bank in India NOT perform?', options:['Accept deposits up to ₹2 lakh','Provide internet banking services','Issue credit cards or loans','Offer money transfer/remittance services'], answer_index:2, explanation:'Payment Banks (Airtel, Paytm) cannot give loans or issue credit cards. They can: accept deposits (up to ₹2 lakh), provide debit cards, internet banking, and remittance services. Small Finance Banks CAN give loans. This structural difference is frequently tested.'},
    {q:'When RBI conducts Open Market Operations (OMO) by BUYING government securities, what is the intended effect?', options:['Absorb excess liquidity from the banking system','Inject liquidity into the banking system','Reduce government debt','Increase interest rates'], answer_index:1, explanation:'When RBI BUYS government securities, it pays banks — injecting rupees into the system (expanding money supply). When RBI SELLS securities, it collects rupees — absorbing liquidity. Buy = Inject. Sell = Absorb. This is the reverse of what students intuitively expect.'}
  ],
  pyq:'High — UPSC 2017, 2019, 2022. Payment Bank restrictions, NABARD, and OMO mechanics tested.',
  summary:'RBI: Monetary Authority+Banker to Govt+Lender of Last Resort+Forex Manager(FEMA 1999). Tools: Repo+Reverse Repo+CRR+SLR+OMO(buy=inject,sell=absorb). Priority Sector: 40% ANBC. Payment Banks: NO loans, deposits up to ₹2L. Small Finance Banks: CAN lend. MUDRA: Shishu(50K)+Kishor(5L)+Tarun(10L). NABARD: Apex for rural credit, refinances RRBs+Coops.'
},
{
  day:29, topic:'Fiscal Policy: Budget, FRBM & Deficits',
  notes:[
    {title:'Types of Deficits', detail:'Revenue Deficit: Revenue Expenditure - Revenue Receipts (govt spending more on recurring expenses than it earns). Fiscal Deficit: Total Expenditure - (Revenue Receipts + Non-debt Capital Receipts) — total borrowing requirement of govt. Primary Deficit: Fiscal Deficit - Interest Payments — deficit excluding interest burden. Effective Revenue Deficit: Revenue Deficit - Grants for capital asset creation.'},
    {title:'FRBM Act 2003', detail:'Fiscal Responsibility and Budget Management Act 2003. Targets: Reduce fiscal deficit to 3% of GDP. Eliminate Revenue Deficit. NK Singh Committee (2017) reviewed FRBM — recommended medium-term target 2.5% fiscal deficit by 2022-23 and debt-to-GDP ratio of 60% (40% Centre + 20% States). Escape clause: 0.5% relaxation during national security/national calamity.'},
    {title:'Capital vs Revenue Expenditure', detail:'Revenue Expenditure: Recurring, does NOT create assets. Salaries, pensions, subsidies, interest payments, maintenance. Capital Expenditure: Creates or reduces liabilities. Infrastructure, loans given, repayment of debt, capital injection in PSUs. Capital Expenditure is productive — FRBM allows it to be excluded from deficit calculations.'},
    {title:'Budget Components', detail:'Consolidated Fund of India (Art 266): All revenues and loans. Requires parliamentary approval for withdrawal. Public Account (Art 266): Small savings, PF, deposits — Parliament approval NOT required. Contingency Fund (Art 267): Emergency fund, operated by President. Max ₹500 crore (needs parliamentary ratification later).'}
  ],
  hook:'UPSC Formula Trap: Fiscal Deficit ≠ Revenue Deficit. Fiscal Deficit = Total Expenditure - (Revenue Receipts + Non-debt Capital Receipts). Revenue Deficit = Revenue Expenditure - Revenue Receipts. Primary Deficit = Fiscal Deficit - Interest Payments. Higher Primary Deficit = Government is adding to the debt problem, not just paying for past debt.',
  cards:[
    {front:'What is the difference between Fiscal Deficit and Primary Deficit?', back:'Fiscal Deficit: Total borrowing requirement = Total Expenditure - (Revenue Receipts + Non-debt Capital Receipts). Primary Deficit = Fiscal Deficit - Interest Payments. Primary Deficit shows current fiscal health EXCLUDING the burden of past debt. If Primary Deficit = 0, govt is borrowing only to pay past interest.'},
    {front:'What did the NK Singh Committee (2017) recommend for FRBM targets?', back:'Medium-term fiscal deficit target of 2.5% of GDP (lower than original 3%). Debt-to-GDP ratio target of 60% (40% Central + 20% States). Recommended an independent Fiscal Council to monitor compliance. Introduced the concept of escape clauses for national emergencies.'},
    {front:'What is the Consolidated Fund of India and which Article governs it?', back:'Governed by Art 266. All government revenues (taxes, fees) and loan proceeds flow into it. ALL withdrawals require Parliamentary approval via Appropriation Bill. Most important government account — virtually all government financial operations go through it.'}
  ],
  q:[
    {q:'Primary Deficit is defined as which of the following?', options:['Revenue Expenditure minus Revenue Receipts','Fiscal Deficit minus Interest Payments','Total Expenditure minus Revenue Receipts','Fiscal Deficit minus Capital Expenditure'], answer_index:1, explanation:'Primary Deficit = Fiscal Deficit - Interest Payments. It strips out the interest burden of past borrowings to show the current-year fiscal situation. If Primary Deficit = 0, the government is only borrowing to service existing debt — not adding new net debt.'},
    {q:'The FRBM Act 2003 sets the fiscal deficit target at what percentage of GDP?', options:['2%','2.5%','3%','4%'], answer_index:2, explanation:'FRBM Act 2003 targets fiscal deficit at 3% of GDP. The NK Singh Committee (2017) recommended further reducing to 2.5% as a medium-term target. In practice, India has rarely achieved the 3% target — COVID-19 pushed deficit to over 9% in 2020-21.'}
  ],
  pyq:'Very High — UPSC 2017, 2019, 2021, 2023. Deficit formulas, FRBM targets, and budget components tested.',
  summary:'Revenue Deficit=RevExp-RevReceipts. Fiscal Deficit=TotalExp-(RevReceipts+Non-debtCapReceipts). Primary Deficit=FD-Interest. Effective Revenue Deficit=RD-CapitalGrants. FRBM(2003): 3% FD target. NK Singh(2017): 2.5% medium-term+60% debt-to-GDP. Budget: Consolidated Fund(Art266,Parliamentary approval)+Public Account(Art266,no approval needed)+Contingency Fund(Art267,President operates,₹500cr).'
},
{
  day:30, topic:'External Sector: BOP, CAD & Trade Policy',
  notes:[
    {title:'Balance of Payments (BOP)', detail:'Records ALL economic transactions between India and rest of world in a year. Two accounts: Current Account (trade in goods & services, income, transfers) + Capital & Financial Account (FDI, FPI, loans, banking capital). BOP must always balance — deficit in one account means surplus in the other.'},
    {title:'Current Account Deficit (CAD)', detail:'India typically has: Deficit in Goods trade (imports > exports — especially oil and electronics). Surplus in Services (IT, BPO, tourism). Surplus in Remittances (Indian diaspora sends money home — one of world\'s largest). Net result: Usually CAD. CAD financed by Capital Account surplus (FDI, FPI inflows).'},
    {title:'FDI vs FPI', detail:'FDI (Foreign Direct Investment): Long-term investment in productive assets — factories, companies. Stable, creates employment. FPI (Foreign Portfolio Investment): Short-term investment in stocks/bonds. Volatile — can flee quickly in crisis (Hot Money). RBI prefers FDI. India allows 100% FDI in most sectors through automatic route.'},
    {title:'Exchange Rate & REER', detail:'Nominal Exchange Rate: Market rate (₹/$). Real Effective Exchange Rate (REER): Inflation-adjusted, trade-weighted exchange rate against a basket of currencies. If REER is high (overvalued rupee), Indian exports become expensive, imports cheaper — hurts export competitiveness. RBI intervenes to manage excessive volatility (managed float).'}
  ],
  hook:'UPSC Distinction Trap: India is the world\'s largest remittance receiver (World Bank data). But remittances fall under CURRENT Account (Transfers), NOT Capital Account. FPI falls under Capital/Financial Account. CAD: India almost always has a deficit in goods but surplus in services and remittances. Oil prices directly impact India\'s CAD — key link.',
  cards:[
    {front:'What is the difference between Current Account and Capital Account in BOP?', back:'Current Account: Trade in goods (merchandise), services (IT/BPO), primary income (salaries/investment returns), secondary income (remittances/transfers). Capital & Financial Account: FDI, FPI, external borrowings, banking capital, official reserve changes.'},
    {front:'Why does India prefer FDI over FPI?', back:'FDI: Long-term, creates physical assets and jobs, stable. FPI: Short-term, can be withdrawn rapidly during global risk-off events ("hot money"), creates exchange rate and stock market volatility. Sudden FPI outflow causes rupee depreciation and current account pressure.'},
    {front:'What is REER and why is it important for trade competitiveness?', back:'Real Effective Exchange Rate: Inflation-adjusted exchange rate against a basket of trading partner currencies. If India\'s REER appreciates (rupee overvalued), Indian exports become more expensive → less competitive → exports fall. RBI monitors REER to assess currency competitiveness.'}
  ],
  q:[
    {q:'Remittances received from Indian workers abroad are recorded in which account of the Balance of Payments?', options:['Capital Account — as Foreign Direct Investment','Financial Account — as Portfolio Investment','Current Account — as Secondary Income (Transfers)','Current Account — as Services exports'], answer_index:2, explanation:'Remittances are classified as Secondary Income (Transfers) under the Current Account — because they are one-sided transfers, not in exchange for goods/services/investment. India is consistently the world\'s largest remittance recipient (~$125 billion in 2023).'},
    {q:'Which of the following statements about India\'s Balance of Payments position is generally correct?', options:['India has surplus in goods trade but deficit in services','India has deficit in goods trade but surplus in services and remittances','India has surplus in both goods and services trade','India has deficit in both goods and services trade'], answer_index:1, explanation:'India\'s typical BOP pattern: Deficit in Goods (imports > exports — oil, electronics). Surplus in Services (IT, BPO, tourism). Surplus in Transfers (remittances). The goods deficit is the dominant factor causing Current Account Deficit (CAD) in most years.'}
  ],
  pyq:'High — UPSC 2018, 2020, 2022. CAD, FDI vs FPI, and remittances classification tested.',
  summary:'BOP: Current Account(goods+services+income+remittances)+Capital&Financial Account(FDI+FPI+loans). India: Goods deficit+Services surplus+Remittances surplus=net CAD. FDI(stable,long-term) preferred over FPI(hot money,volatile). CAD financed by Capital Account(FDI+FPI inflows). REER: inflation-adjusted competitiveness measure. India=world\'s largest remittance receiver(Current Account,NOT Capital Account).'
}
];

async function push() {
  for(const d of days){
    const payload = {
      topic_title:d.topic, day_number:d.day, track:'upsc_ecosystem',
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:d.pyq},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ **UPSC Ranker Hook**: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Exam Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'Mastering '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('UPSC '+d.topic+' economy prelims'),why:'Coaching-grade economy tutorial.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.answer_index,answer:q.options[q.answer_index],explanation:q.explanation}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | '+d.pyq,one_screen_summary:d.summary}
    };
    const {error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:payload,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error) console.error('Day '+d.day+':',error.message);
    else console.log('Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('UPSC Days 26-30 COMPLETE');
}
push();
