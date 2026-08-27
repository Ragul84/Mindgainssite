require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:71,topic:'UPSC Economy: National Income & Basic Concepts',
intro:`Today we study the 'Scorecard of the Nation'. How do we measure the progress of 1.4 billion people? We explore the concepts of GDP, GNP, NNP, and the Human Development Index (HDI). For UPSC, focus on the 'Difference between Nominal and Real GDP', the 'GDP Deflator', and the various methods of calculating national income. This is the macro-foundation of the Indian Economy.`,
notes:[
{title:'GDP (Gross Domestic Product)',detail:'Total value of all final goods and services produced WITHIN the geographical boundary of a country in a year. (Focus on "Where").'},
{title:'GNP (Gross National Product)',detail:'Total value of final goods and services produced by the CITIZENS of a country, regardless of where they are. GNP = GDP + NFIA (Net Factor Income from Abroad).'},
{title:'Real vs Nominal GDP',detail:'Nominal: Calculated at current market prices. Real: Calculated at base year prices (adjusts for inflation). Real GDP is the true indicator of economic growth.'},
{title:'GDP Deflator',detail:'Ratio of Nominal GDP to Real GDP. It is a comprehensive measure of inflation in an economy.'},
{title:'HDI (Human Development Index)',detail:'By UNDP. 3 Dimensions: 1. Health (Life expectancy). 2. Education (Mean/Expected years of schooling). 3. Standard of Living (GNI per capita).'}
],
cards:[
{front:'What is GDP?',back:'Value of goods/services produced WITHIN a country.'},
{front:'GNP = GDP + ?',back:'NFIA (Net Factor Income from Abroad).'},
{front:'Why is Real GDP better?',back:'Because it accounts for inflation (calculated at base year prices).'},
{front:'Dimensions of HDI?',back:'Health, Education, Standard of Living.'},
{front:'Formula for GDP Deflator?',back:'(Nominal GDP / Real GDP) × 100.'}
],
q:[
{q:'If a country\'s GDP is growing but its GNP is falling, it implies:',options:['Citizens working abroad are earning more','Foreigners working in the country are earning more','Export is greater than import','Inflation is high'],ai:1,exp:'GNP = GDP + (Income of citizens abroad - Income of foreigners in India). If foreigners earn more, GNP falls.'},
{q:'"Base Year" prices are used to calculate:',options:['Nominal GDP','Real GDP','Potential GDP','Market GDP'],ai:1,exp:'This removes the effect of price changes (inflation) to show actual volume growth.'},
{q:'Which of the following publishes the Human Development Report?',options:['IMF','World Bank','UNDP','WTO'],ai:2,exp:'The United Nations Development Programme (UNDP) has been publishing it since 1990.'},
{q:'The "Gini Coefficient" is used to measure:',options:['Inflation','Unemployment','Income Inequality','National Income'],ai:2,exp:'A value of 0 means perfect equality, 1 means perfect inequality.'}
],
hook:'GDP=Where. GNP=Who. Real=Base Year. HDI=Health/Edu/GNI. Gini=Inequality. Deflator=Nominal/Real.',
summary:'Definitions of GDP, GNP, and NNP. Comparison of Real and Nominal measures. Introduction to HDI and its dimensions. Tools for measuring inequality.'},

{day:72,topic:'UPSC Economy: Inflation & Business Cycles',
intro:`Today we study the 'Erosion of Value'. Inflation is the sustained rise in the general price level, affecting everything from your cup of tea to the nation's budget. We explore WPI, CPI, and the concepts of 'Headline' vs 'Core' inflation. For UPSC, focus on 'Why inflation happens' (Demand-pull vs Cost-push) and the 'Impact of inflation' on debtors and creditors. Let's master the dynamics of prices today.`,
notes:[
{title:'What is Inflation?',detail:'A persistent increase in the price level. Leads to a fall in the purchasing power of money. Measured as a percentage rate.'},
{title:'Types of Inflation',detail:'1. Demand-Pull: Too much money chasing too few goods. 2. Cost-Push: Increase in cost of production (Raw materials, Wages). 3. Built-in: Wage-price spiral.'},
{title:'Measurement in India',detail:'CPI (Consumer Price Index): Retail level. Used by RBI for monetary policy. WPI (Wholesale Price Index): Wholesale level. CPI is more representative of the common man.'},
{title:'Headline vs Core Inflation',detail:'Headline: Total inflation including volatile food and fuel. Core: Excludes food and fuel to show the stable underlying trend.'},
{title:'Impact of Inflation',detail:'Debtors (Borrowers) GAIN; Creditors (Lenders) LOSE. Fixed income groups lose. Exports become less competitive.'}
],
cards:[
{front:'Which index does RBI use for inflation targeting?',back:'CPI (Combined).'},
{front:'What is "Core Inflation"?',back:'Headline inflation minus volatile items (Food & Fuel).'},
{front:'Who gains from inflation: Debtor or Creditor?',back:'Debtor (Borrower).'},
{front:'What is "Stagflation"?',back:'High Inflation + Low Growth + High Unemployment.'},
{front:'What is "Deflation"?',back:'Persistent fall in the general price level.'}
],
q:[
{q:'"Demand-pull inflation" can be caused by:',options:['Increase in interest rates','Increase in government spending','Decrease in money supply','Decrease in population'],ai:1,exp:'More govt spending puts more money in hands of people, increasing demand.'},
{q:'Which of the following is the most comprehensive measure of inflation in an economy?',options:['WPI','CPI','GDP Deflator','PPI'],ai:2,exp:'GDP Deflator covers all goods and services produced in the economy, unlike indexes with fixed baskets.'},
{q:'When inflation rises, the purchasing power of money:',options:['Increases','Decreases','Stays same','Fluctuates'],ai:1,exp:'You need more money to buy the same amount of goods.'},
{q:'"Headline Inflation" in India is currently measured using:',options:['CPI-IW','CPI-Combined','WPI','PPI'],ai:1,exp:'RBI shifted to CPI-Combined (Urban+Rural) as its primary anchor.'}
],
hook:'CPI=Retail/RBI anchor. Core=No food/fuel. Stagflation=High prices+Low growth. Debtors gain. Deflator=Whole economy.',
summary:'Causes of inflation (Demand-pull/Cost-push). Comparison of WPI and CPI. Headline vs Core inflation. Social and economic impact of rising prices.'},

{day:73,topic:'UPSC Economy: Banking & Monetary Policy',
intro:`Today we study the 'Nerves of the Economy'. The banking system and the Reserve Bank of India (RBI) control the flow of money in the nation. We explore the 'Monetary Policy Committee' (MPC) and its tools like Repo, Reverse Repo, and CRR. For UPSC, focus on 'How RBI controls inflation' and the significance of 'NPAs' and 'Insolvency and Bankruptcy Code' (IBC). This is the most practical and frequently tested part of Economy.`,
notes:[
{title:'Reserve Bank of India (RBI)',detail:'Established 1935 (Hiltion Young Commission). Central bank of India. Functions: Currency issue, Govt\'s bank, Bankers\' bank, Controller of Credit.'},
{title:'Monetary Policy Committee (MPC)',detail:'6 members (3 from RBI, 3 from Govt). Headed by RBI Governor. Meets 4 times a year to decide the Repo Rate to target inflation (4% +/- 2%).'},
{title:'Quantitative Tools',detail:'1. Repo Rate: Rate at which RBI lends to banks. 2. Reverse Repo: Rate at which banks park money with RBI. 3. CRR (Cash Reserve Ratio): % of deposits banks must keep with RBI. 4. SLR: % banks must keep with themselves in liquid assets.'},
{title:'Qualitative Tools',detail:'Moral Suasion, Margin Requirements, Credit Rationing. Used to direct credit to specific sectors.'},
{title:'Non-Performing Assets (NPAs)',detail:'Loans where interest/principal is overdue for >90 days. "Twin Balance Sheet problem": Stress on both banks and corporates.'}
],
cards:[
{front:'When was RBI established?',back:'1935.'},
{front:'Who heads the MPC?',back:'RBI Governor.'},
{front:'What is "Repo Rate"?',back:'Rate at which RBI lends short-term money to banks.'},
{front:'What is "CRR"?',back:'Cash Reserve Ratio (money banks keep with RBI).'},
{front:'What is the inflation target for RBI?',back:'4% (+/- 2%).'}
],
q:[
{q:'If RBI wants to control inflation, it will:',options:['Decrease Repo Rate','Increase Repo Rate','Decrease CRR','Buy securities in open market'],ai:1,exp:'Increasing Repo rate makes borrowing expensive, reducing money supply.'},
{q:'Which commission recommended the establishment of RBI?',options:['Simon Commission','Hilton Young Commission','Fowler Commission','Macaulay Commission'],ai:1,exp:'Also known as the Royal Commission on Indian Currency and Finance.'},
{q:'The "Statutory Liquidity Ratio" (SLR) is maintained by banks in the form of:',options:['Only Cash','Only Gold','Cash, Gold, and Govt Securities','Only Securities'],ai:2,exp:'Banks must maintain a percentage of their NDTL in these liquid forms.'},
{q:'A loan becomes an NPA when payment is overdue for more than:',options:['30 days','60 days','90 days','180 days'],ai:2,exp:'90 days is the standard trigger for asset classification.'}
],
hook:'RBI=1935. MPC=6 members. Repo=Lend to banks. CRR=Keep with RBI. NPA=90 days. Target=4%.',
summary:'Structure and functions of RBI. Mechanisms of the Monetary Policy Committee. Detailed study of liquidity control tools (Repo/CRR/SLR). Analysis of the NPA crisis in Indian banking.'},

{day:74,topic:'UPSC Economy: Money & Capital Markets',
intro:`Today we study the 'Engine of Investment'. The financial market is where those with surplus funds (investors) meet those who need funds (corporates/govt). We explore the 'Money Market' (short-term) and the 'Capital Market' (long-term/Stock market). For UPSC, focus on 'Financial Instruments' like T-Bills, Commercial Papers, and the role of 'SEBI'. Let's master the language of the stock exchange today.`,
notes:[
{title:'Money Market',detail:'Market for short-term funds (<1 year). Regulated by RBI. Instruments: Treasury Bills (T-Bills - issued by Govt), Commercial Paper (issued by companies), Certificate of Deposit (by banks).'},
{title:'Capital Market',detail:'Market for long-term funds (>1 year). Regulated by SEBI. Primary Market: New securities (IPO). Secondary Market: Existing securities (Stock exchange - BSE, NSE).'},
{title:'Equity vs Debt',detail:'Equity (Shares): Ownership in company, returns via dividends/capital gain. Debt (Bonds/Debentures): Loan to company, returns via fixed interest.'},
{title:'SEBI (Securities & Exchange Board of India)',detail:'Statutory body (1992). Protects interests of investors. Regulates stock exchanges and mutual funds.'},
{title:'FDI vs FPI',detail:'FDI (Foreign Direct Investment): Long-term, involves management control (e.g., building a factory). FPI (Foreign Portfolio Investment): Short-term, "hot money", investment in stocks/bonds.'}
],
cards:[
{front:'Who regulates the Money Market?',back:'RBI.'},
{front:'Who regulates the Capital Market?',back:'SEBI.'},
{front:'What is an "IPO"?',back:'Initial Public Offering (first time a company sells shares).'},
{front:'What are "T-Bills"?',back:'Treasury Bills (short-term debt issued by Central Govt).'},
{front:'Is FPI "Hot Money"?',back:'Yes, because it can leave the country quickly.'}
],
q:[
{q:'"Treasury Bills" in India are issued by:',options:['RBI','State Governments','Central Government','SEBI'],ai:2,exp:'RBI issues them ON BEHALF of the Central Govt. State govts cannot issue T-Bills.'},
{q:'A "Bull" in the stock market refers to an investor who:',options:['Expects prices to fall','Expects prices to rise','Invests only in bonds','Is afraid of risk'],ai:1,exp:'Bulls are optimistic; Bears are pessimistic.'},
{q:'Which of the following is a "Money Market" instrument?',options:['Shares','Debentures','Commercial Paper','Mutual Funds'],ai:2,exp:'Commercial Paper is a short-term unsecured promissory note issued by corporates.'},
{q:'The "Sensex" is the index of which stock exchange?',options:['NSE','BSE','NYSE','NASDAQ'],ai:1,exp:'Bombay Stock Exchange (BSE) index based on 30 largest companies.'}
],
hook:'Money Market=RBI/<1yr. Capital Market=SEBI/>1yr. T-Bills=Central Govt. IPO=Primary. FDI=Long term. Sensex=BSE.',
summary:'Structure of Indian financial markets. Comparison of Money and Capital markets. Key financial instruments and their issuers. Role of SEBI in investor protection.'},

{day:75,topic:'UPSC REVISION: Macroeconomics & Banking (Days 71–74)',
intro:`Today we consolidate the 'Financial Backbone' of India. You have moved from measuring national wealth to controlling the supply of money and the dynamics of the stock market. These four days cover the 'Conceptual Core' of the UPSC Economy syllabus. If you understand these, you can solve any question based on current economic trends. Let's drill the definitions and the mechanisms today.`,
notes:[
{title:'Measurement Recap',detail:'GDP (Where), GNP (Who), Real (Base Year). HDI: Health, Edu, GNI. Gini: Inequality indicator.'},
{title:'Inflation Control Recap',detail:'Inflation = Too much money. Solution = Tight Monetary Policy. Tools: Increase Repo, Increase CRR, Increase SLR.'},
{title:'Banking & RBI Recap',detail:'RBI (1935). MPC: 6 members, targets 4% inflation. NPA: 90 days. IBC: Framework for exit.'},
{title:'Market Instruments Recap',detail:'T-Bills (Govt <1yr). Commercial Paper (Corp <1yr). Equity (Ownership). FDI (Control) vs FPI (Hot money).'},
{title:'Regulatory Drill',detail:'Banks/Money Market = RBI. Stock Market/Mutual Funds = SEBI. Insurance = IRDAI. Telecom = TRAI.'}
],
cards:[
{front:'Who publishes WPI?',back:'Office of Economic Adviser (Ministry of Commerce).'},
{front:'Who publishes CPI?',back:'NSO (National Statistical Office).'},
{front:'What is "Stagflation"?',back:'Inflation + Stagnation (Low growth).'},
{front:'Can State Govts issue T-Bills?',back:'No.'},
{front:'What is "Call Money"?',back:'Inter-bank borrowing for 1 day.'}
],
q:[
{q:'Match the following:\n1. Repo Rate\n2. CRR\n3. SLR',options:['1-RBI to Banks, 2-With RBI, 3-With Self','1-Banks to RBI, 2-With Self, 3-With RBI','1-RBI to Govt, 2-With RBI, 3-With Self','1-RBI to Banks, 2-With Self, 3-With RBI'],ai:0,exp:'Repo is the lending rate; CRR is kept with RBI; SLR is kept with the bank itself.'},
{q:'"Headline Inflation" differs from "Core Inflation" by including:',options:['Services','Manufacturing','Food and Fuel','Housing'],ai:2,exp:'Core inflation ignores the most volatile components.'},
{q:'Which of the following is NOT part of the HDI calculation?',options:['Life Expectancy','Mean years of schooling','Infant Mortality Rate','GNI per capita'],ai:2,exp:'Infant mortality is part of other indexes, but not HDI.'},
{q:'Who was the 1st Governor of RBI?',options:['C.D. Deshmukh','Osborne Smith','James Taylor','Manmohan Singh'],ai:1,exp:'Osborne Smith was the first; C.D. Deshmukh was the first Indian governor.'}
],
hook:'Repo up=Inflation down. CPI=NSO. WPI=Commerce Min. HDI=3 pillars. 90 days=NPA. SEBI=Statutory 1992.',
summary:'Full revision of macro-economic indicators. Deep dive into monetary policy and banking operations. Recap of financial market instruments and regulations. Final mock quiz for the Economy foundation.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'upsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ UPSC Economy Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Economy Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'UPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('UPSC Indian Economy '+d.topic),why:'Essential for mastering the conceptual side of Indian economy.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | High Yield',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ UPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();
