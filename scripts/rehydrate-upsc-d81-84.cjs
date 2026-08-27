require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:81,topic:'UPSC Economy: External Sector & BOP',
intro:`Today we study 'India and the World Market'. No economy is an island. We explore the Balance of Payments (BOP), the 'Current' and 'Capital' accounts, and the concepts of FDI and FPI. For UPSC, focus on 'Why India has a trade deficit', 'Convertibility of Rupee', and the 'Foreign Exchange Reserves'. Let's master the global flow of money today.`,
notes:[
{title:'Balance of Payments (BOP)',detail:'A systematic record of all economic transactions of a country with the rest of the world. Always balances in accounting terms.'},
{title:'Current Account',detail:'Transactions of goods (Trade balance), services (Invisibles), and transfers (Remittances). India usually has a Current Account Deficit (CAD) due to oil/gold imports.'},
{title:'Capital Account',detail:'Transactions involving assets and liabilities. Includes FDI, FPI, External Commercial Borrowings (ECB), and NRI deposits.'},
{title:'FDI vs FPI',detail:'FDI (Foreign Direct Investment): Stable, long-term, >10% stake, management control. FPI (Foreign Portfolio Investment): Volatile, "Hot Money", <10% stake.'},
{title:'Rupee Convertibility',detail:'Current Account: Fully convertible. Capital Account: Partially convertible (to prevent sudden flight of capital). Tarapore Committee reports.'}
],
cards:[
{front:'What is "BOP"?',back:'Balance of Payments (Record of transactions with world).'},
{front:'Components of Current Account?',back:'Goods, Services, Transfers (Remittances).'},
{front:'Is the Rupee fully convertible on Capital Account?',back:'No, only partially.'},
{front:'What is "Hot Money"?',back:'FPI (because it can leave quickly).'},
{front:'Largest component of India\'s imports?',back:'Crude Oil.'}
],
q:[
{q:'"Remittances" from Indians abroad are recorded in which account?',options:['Current Account','Capital Account','Trade Account','Financial Account'],ai:0,exp:'They are part of "Invisibles" in the Current Account.'},
{q:'If a country has a "Current Account Deficit", it implies:',options:['Exports > Imports','Imports > Exports','Inflation is low','Currency is strong'],ai:1,exp:'Specifically, the value of imported goods/services exceeds exports.'},
{q:'Which committee recommended Capital Account Convertibility in India?',options:['Narasimham','Tarapore','Raghuram Rajan','Urjit Patel'],ai:1,exp:'S.S. Tarapore committee (1997 and 2006).'},
{q:'"Foreign Direct Investment" (FDI) is considered better than FPI because:',options:['It is cheaper','It is more stable and brings technology','It can be withdrawn easily','It is for short term'],ai:1,exp:'FDI involves building capacity and long-term commitment.'}
],
hook:'Current=Goods/Services/Remit. Capital=FDI/FPI/Loans. CAD=India\'s reality. Hot Money=FPI. Tarapore=Convertibility.',
summary:'Structure of the Balance of Payments. Detailed study of Current and Capital accounts. FDI and FPI comparison. Rupee convertibility and Forex reserves.'},

{day:82,topic:'UPSC Economy: Agriculture & Subsidies',
intro:`Today we study the 'Primary Sector'. Agriculture is not just a source of food but a way of life in India. We explore the 'Minimum Support Price' (MSP), the 'WTO Boxes' (Amber, Green, Blue), and the debate over food subsidies. For UPSC, focus on the 'Ashok Dalwai Committee' (Doubling farmers' income), 'PDS reforms', and the 'Agreement on Agriculture'. Let's master the economics of the farm today.`,
notes:[
{title:'MSP (Minimum Support Price)',detail:'Guaranteed price for 23 crops. Recommended by CACP (Commission for Agri Costs and Prices); approved by Cabinet Committee on Economic Affairs (CCEA).'},
{title:'FRP (Fair and Remunerative Price)',detail:'Specific to Sugarcane. Paid by sugar mills to farmers.'},
{title:'WTO Boxes (Subsidies)',detail:'1. Amber: Distorts trade, restricted (MSP falls here). 2. Green: No trade distortion, allowed (Research, Environment). 3. Blue: Production-limiting, allowed.'},
{title:'PDS (Public Distribution System)',detail:'Food security for the poor. Managed by FCI (procurement/storage) and States (distribution). Issue of "Leakage" and "Buffer stocks".'},
{title:'Agriculture Reforms',detail:'E-NAM (Electronic National Agri Market), PM-KISAN (Direct income support), Model APMC Act. Goal of doubling farmers\' income.'}
],
cards:[
{front:'Who recommends MSP?',back:'CACP.'},
{front:'Who approves MSP?',back:'Cabinet Committee on Economic Affairs (CCEA).'},
{front:'How many crops are covered under MSP?',back:'23.'},
{front:'What is the "Amber Box"?',back:'WTO category for trade-distorting subsidies (e.g., MSP).'},
{front:'What is "FRP"?',back:'Fair and Remunerative Price (for Sugarcane).'}
],
q:[
{q:'The "Minimum Support Price" (MSP) for crops is based on which cost?',options:['A2','A2 + FL','C2','Market Price'],ai:1,exp:'Govt uses A2+FL (Actual cost + Family Labor) as per MS Swaminathan\'s recommendation.'},
{q:'Which of the following WTO boxes includes subsidies for agricultural research?',options:['Amber Box','Blue Box','Green Box','Red Box'],ai:2,exp:'Green box subsidies are considered non-trade distorting.'},
{q:'The "CACP" (Commission for Agri Costs and Prices) is under which ministry?',options:['Finance','Agriculture','Commerce','Consumer Affairs'],ai:1,exp:'It is an attached office of the Ministry of Agriculture.'},
{q:'PM-KISAN scheme provides an annual income support of:',options:['₹2000','₹4000','₹6000','₹10000'],ai:2,exp:'Direct benefit transfer in three installments of ₹2000 each.'}
],
hook:'MSP=23 crops. CACP=Recommend. CCEA=Approve. Amber=Trade distort. Green=Research. FRP=Sugarcane. PM-KISAN=6k.',
summary:'Mechanism of MSP and its recommendation process. WTO Agreement on Agriculture and subsidy boxes. Food security and PDS reforms. Modern agricultural initiatives in India.'},

{day:83,topic:'UPSC Economy: International Organizations',
intro:`Today we study the 'Global Governance of Money'. In a globalized world, institutions like the IMF, World Bank, and WTO play a vital role in financial stability and trade. We explore their 'Functions', 'Reports', and 'India's relationship' with them. For UPSC, focus on 'SDR' (Special Drawing Rights), 'GATT vs WTO', and the 'Washington Consensus'. Let's master the global financial architecture today.`,
notes:[
{title:'IMF (International Monetary Fund)',detail:'Bretton Woods twin. Focus: Global financial stability, BOP support. Currency: SDR (Basket of 5: $, €, ¥, £, Yuan). Report: World Economic Outlook.'},
{title:'World Bank',detail:'Bretton Woods twin. Focus: Long-term development, poverty reduction (IBRD + IDA). Report: World Development Report.'},
{title:'WTO (World Trade Organization)',detail:'Successor to GATT (1995). Focus: Trade liberalization, dispute settlement. Principles: MFN (Most Favored Nation), National Treatment.'},
{title:'ADB & AIIB',detail:'Asian Development Bank (Manila). Asian Infrastructure Investment Bank (Beijing). India is a founding member and major borrower.'},
{title:'G20 & BRICS',detail:'G20: Global economic cooperation (India hosted 2023). BRICS: Emerging economies. NDB (New Development Bank) - Shanghai.'}
],
cards:[
{front:'What are "SDRs"?',back:'Special Drawing Rights (IMF\'s reserve asset).'},
{front:'"World Economic Outlook" is published by?',back:'IMF.'},
{front:'"World Development Report" is published by?',back:'World Bank.'},
{front:'HQ of WTO?',back:'Geneva.'},
{front:'What is "MFN" status?',back:'Most Favored Nation (Non-discrimination in trade).'}
],
q:[
{q:'Which of the following is NOT part of the SDR basket?',options:['US Dollar','Japanese Yen','Indian Rupee','Chinese Yuan'],ai:2,exp:'SDR includes USD, Euro, Yen, Pound, and Yuan.'},
{q:'The "International Development Association" (IDA) is known as the:',options:['Hard loan window','Soft loan window','Commercial window','Export window'],ai:1,exp:'IDA (part of World Bank) provides interest-free loans to poorest countries.'},
{q:'The "Uruguay Round" led to the formation of:',options:['IMF','World Bank','WTO','G7'],ai:2,exp:'The round of GATT negotiations that culminated in WTO (1995).'},
{q:'Which organization publishes the "Ease of Doing Business" index? (Legacy Knowledge)',options:['IMF','WTO','World Bank','WEF'],ai:2,exp:'The World Bank published it (now discontinued due to data controversies).'}
],
hook:'IMF=BOP/SDR. WB=Development. WTO=Trade/Geneva. SDR=5 currencies. MFN=Equality. NDB=BRICS.',
summary:'Structure and role of IMF and World Bank. History and principles of the WTO. Significance of regional banks (ADB/AIIB). Impact of global financial groupings (G20/BRICS).'},

{day:84,topic:'UPSC REVISION: Fiscal Policy, External & Global Economy',
intro:`Today we wrap up 'Indian Economy'. You have mastered the budget, the tax system, the global trade dynamics, and the agricultural backbones of our nation. Economy is the most 'Dynamic' subject in UPSC—it changes every year with the Budget and the Survey. Today, we consolidate the 'Static' concepts that help you decode the 'Current' changes. Let's master the final block of economy today.`,
notes:[
{title:'Fiscal Recap',detail:'Art 112 (Budget). Deficits: Fiscal (total borrowing), Revenue, Primary (Fiscal - Interest). Finance Commission (Art 280).'},
{title:'Taxation Recap',detail:'Direct (Progressive), Indirect (Regressive). GST (101st Amend, 279A). Laffer Curve (Rate vs Revenue).'},
{title:'External Sector Recap',detail:'BOP = Current + Capital. CAD = Trade gap. FDI (Long-term) vs FPI (Hot Money). Tarapore (Convertibility).'},
{title:'Agriculture Recap',detail:'MSP (CACP/CCEA). WTO Boxes: Amber (MSP), Green (Research). 3 Seasons: Kharif, Rabi, Zaid.'},
{title:'Global Org Recap',detail:'IMF (SDR/WEO). World Bank (WDR). WTO (MFN/Geneva). G20 (Global cooperation).'}
],
cards:[
{front:'"Twin Deficit" problem?',back:'High Fiscal Deficit + High Current Account Deficit.'},
{front:'"Angel Tax"?',back:'Tax on capital raised by unlisted companies (Startups).'},
{front:'"Crowding Out" effect?',back:'High govt borrowing reduces funds available for private investment.'},
{front:'"Base Erosion and Profit Shifting" (BEPS)?',back:'Tax avoidance by MNCs (OECD initiative).'},
{front:'"Phillips Curve"?',back:'Inverse relationship between Inflation and Unemployment.'}
],
q:[
{q:'A high "Tax-to-GDP" ratio implies:',options:['Better tax compliance','High tax evasion','Low economic growth','High inflation'],ai:0,exp:'It shows the govt\'s ability to generate revenue relative to the size of the economy.'},
{q:'"Balance of Payments" is always:',options:['In deficit for India','In surplus for China','Balanced in accounting','Negative'],ai:2,exp:'Accounting identity: Current + Capital + Reserves = 0.'},
{q:'Which of the following increases the "Fiscal Deficit"?',options:['Reduction in tax rates','Increase in subsidies','Economic recession','All of the above'],ai:3,exp:'Reduced revenue or increased spending both widen the deficit.'},
{q:'"Sovereign Gold Bond" scheme aims to:',options:['Increase gold imports','Reduce physical demand for gold','Fund the fiscal deficit','Help jewelry industry'],ai:1,exp:'Convert physical gold demand into financial investment.'}
],
hook:'Fiscal=Borrowing. Current=Trade. Capital=FDI. MSP=CACP. IMF=SDR. Phillips=Inflation/Unemployment. BEPS=Tax avoidance.',
summary:'Full revision of the Indian Economy syllabus. Consolidation of fiscal, external, and global economic concepts. High-speed drill of committees and acts. Final Economy mock quiz.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'upsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ UPSC Economy Finale Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Revision Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'UPSC Indian Economy: Full Recap',url:'https://youtube.com/results?search_query=UPSC+Indian+Economy+Full+Revision',why:'Complete mastery of the economy syllabus for Prelims.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | ECONOMY FINALE',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ UPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();
