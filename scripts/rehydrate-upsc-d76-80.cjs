require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:76,topic:'UPSC Economy: Fiscal Policy & Budgeting',
intro:`Today we study the 'Pocket of the Government'. Fiscal policy is the use of government spending and taxation to influence the economy. We explore the components of the 'Union Budget', the different types of deficits (Fiscal, Revenue, Primary), and the role of the 'Finance Commission'. For UPSC, focus on the 'FRBM Act' and the difference between 'Capital' and 'Revenue' expenditure. This is the heart of the annual Economic Survey.`,
notes:[
{title:'Union Budget (Art 112)',detail:'Termed as "Annual Financial Statement". Divided into Revenue Budget and Capital Budget.'},
{title:'Revenue vs Capital',detail:'Revenue: Recurring, no asset creation (Salaries, Interest, Subsidies). Capital: Non-recurring, creates assets or reduces liability (Building roads, Repaying loans).'},
{title:'Types of Deficits',detail:'1. Revenue Deficit: Revenue Exp > Revenue Receipts. 2. Fiscal Deficit: Total Exp - Total Receipts (excluding borrowings). 3. Primary Deficit: Fiscal Deficit - Interest Payments.'},
{title:'FRBM Act (2003)',detail:'Fiscal Responsibility and Budget Management Act. Aimed to limit fiscal deficit to 3% of GDP. Includes an "Escape Clause" for emergencies.'},
{title:'Finance Commission (Art 280)',detail:'Constitutional body appointed every 5 years. Decides the vertical and horizontal distribution of taxes between Center and States. Current: 16th FC.'}
],
cards:[
{front:'What is the "Annual Financial Statement" article?',back:'Article 112.'},
{front:'GNP - Depreciation = ?',back:'NNP (Net National Product).'},
{front:'Fiscal Deficit - Interest Payments = ?',back:'Primary Deficit.'},
{front:'Who appoints the Finance Commission?',back:'The President of India.'},
{front:'Main goal of FRBM Act?',back:'Fiscal discipline (Targeting 3% deficit).'}
],
q:[
{q:'"Subsidies" and "Interest Payments" fall under which category?',options:['Capital Expenditure','Revenue Expenditure','Capital Receipts','Revenue Receipts'],ai:1,exp:'They are recurring expenses that do not create any physical or financial assets.'},
{q:'The "Primary Deficit" in a budget is zero if:',options:['Revenue deficit is zero','Net interest payment is zero','Fiscal deficit is equal to interest payments','Total expenditure is equal to total revenue'],ai:2,exp:'Primary Deficit = Fiscal Deficit - Interest. If they are equal, the result is zero.'},
{q:'Which of the following is NOT a constitutional body?',options:['Finance Commission','Election Commission','NITI Aayog','UPSC'],ai:2,exp:'NITI Aayog is an executive body (think-tank).'},
{q:'Horizontal Devolution in Finance Commission refers to:',options:['Transfer between Center and States','Transfer among different States','Transfer between States and Panchayats','Loans to States'],ai:1,exp:'It is the sharing of the divisible pool among the states based on criteria like population and forest cover.'}
],
hook:'Art 112=Budget. Fiscal Deficit=Borrowing need. Primary=Fiscal-Interest. Revenue=Recurring. FRBM=Discipline.',
summary:'Structure of the Union Budget. Analysis of fiscal indicators and deficits. Role of the Finance Commission. Importance of the FRBM Act in managing national debt.'},

{day:77,topic:'UPSC Economy: Taxation in India',
intro:`Today we study the 'Revenue Stream'. Taxes are the primary source of government income. We explore the shift from a complex tax regime to the 'Goods and Services Tax' (GST) and the importance of 'Direct' vs 'Indirect' taxes. For UPSC, focus on 'Laffer Curve', 'Tax-to-GDP ratio', and the concept of 'Tax Buoyancy'. Let's master the logic of taxation today.`,
notes:[
{title:'Direct Taxes',detail:'Incidence and Impact on the same person. (e.g., Income Tax, Corporate Tax). Progressive in nature (higher income = higher tax).'},
{title:'Indirect Taxes',detail:'Impact and Incidence on different persons. (e.g., GST, Customs Duty). Regressive in nature (affects poor more as a % of income).'},
{title:'GST (Goods and Services Tax)',detail:'101st Amendment. "One Nation, One Tax". Destination-based consumption tax. Dual GST (CGST/SGST/IGST). 5 Tiers: 0%, 5%, 12%, 18%, 28%.'},
{title:'Laffer Curve',detail:'Relationship between tax rates and tax revenue. Suggests that beyond a certain point, increasing taxes reduces total revenue (due to evasion/lack of incentive).'},
{title:'Key Concepts',detail:'Tax Buoyancy: Responsiveness of tax growth to GDP growth. Tax Elasticity: Response of tax growth to changes in tax laws.'}
],
cards:[
{front:'Which amendment introduced GST?',back:'101st Amendment (2016).'},
{front:'Is Income Tax Progressive or Regressive?',back:'Progressive.'},
{front:'What is "Tax Buoyancy"?',back:'Ratio of tax growth to GDP growth.'},
{front:'Who heads the GST Council?',back:'Union Finance Minister.'},
{front:'What is the "Laffer Curve"?',back:'Graph showing the relationship between tax rate and tax revenue.'}
],
q:[
{q:'Which of the following is a "Direct Tax"?',options:['GST','Customs Duty','Corporate Tax','Excise Duty'],ai:2,exp:'Corporate tax is paid by companies on their profits directly to the govt.'},
{q:'GST is a ____ based tax.',options:['Origin','Destination','Production','Investment'],ai:1,exp:'Tax is collected by the state where the goods/services are consumed.'},
{q:'A tax is "Progressive" when:',options:['Rate increases with income','Rate decreases with income','Rate is fixed for all','It is an indirect tax'],ai:0,exp:'It aims to reduce income inequality.'},
{q:'The "GST Council" is a constitutional body under Article:',options:['280','279A','324','360'],ai:1,exp:'Inserted by the 101st Amendment to manage GST policy.'}
],
hook:'101st Amend=GST. 279A=GST Council. Progressive=Direct. Regressive=Indirect. Laffer=Optimal rate. Destination=GST.',
summary:'Classification of taxes in India. Detailed study of GST mechanism and its impact. Analysis of tax-to-GDP ratio. Key economic concepts like Laffer curve and tax buoyancy.'},

{day:78,topic:'UPSC Economy: Poverty, Inequality & Unemployment',
intro:`Today we study the 'Social Reality'. Despite high growth, India faces the challenges of persistent poverty and rising inequality. We explore the 'Poverty Lines' (Lakdawala, Tendulkar, Rangarajan) and the different types of unemployment. For UPSC, focus on the 'Multidimensional Poverty Index' (MPI) and the 'Periodic Labour Force Survey' (PLFS) data. This is crucial for both Economy and Social Issues (GS1/GS2).`,
notes:[
{title:'Poverty Measurement',detail:'In India, traditionally based on calorie intake or monthly per capita expenditure (MPCE). Commissions: Tendulkar (2009), Rangarajan (2014).'},
{title:'MPI (Multidimensional Poverty Index)',detail:'By OPHI and UNDP. Goes beyond income. Dimensions: Health, Education, Standard of Living (10 indicators). NITI Aayog publishes India\'s National MPI.'},
{title:'Types of Unemployment',detail:'1. Structural: Lack of skills. 2. Cyclical: Due to economic downturn. 3. Frictional: Time between jobs. 4. Disguised: More people working than needed (common in Agri). 5. Seasonal.'},
{title:'Unemployment Indicators',detail:'LFPR (Labor Force Participation Rate). WPR (Worker Population Ratio). UR (Unemployment Rate). Data source: NSO\'s PLFS.'},
{title:'Gini Coefficient',detail:'Measures income/wealth distribution. 0 = Perfect equality. 1 = Perfect inequality.'}
],
cards:[
{front:'What is "Disguised Unemployment"?',back:'Marginal productivity of labor is zero (too many workers).'},
{front:'Who publishes the National MPI in India?',back:'NITI Aayog.'},
{front:'Tendulkar Committee relates to?',back:'Poverty estimation.'},
{front:'What is "Structural Unemployment"?',back:'Mismatch between skills available and skills needed.'},
{front:'0 on Gini Scale means?',back:'Perfect Equality.'}
],
q:[
{q:'"Disguised Unemployment" is most prominent in which sector?',options:['Industry','Services','Agriculture','IT'],ai:2,exp:'Large families working on small plots of land with zero marginal output.'},
{q:'The "Poverty Line" in India is currently defined by:',options:['Income level','Consumption expenditure','Asset ownership','Nutritional status'],ai:1,exp:'India uses expenditure-based poverty lines rather than income.'},
{q:'"Stagflation" is characterized by:',options:['High growth, High inflation','Low growth, Low inflation','Low growth, High inflation','High growth, Low inflation'],ai:2,exp:'Stagnation + Inflation.'},
{q:'Which survey is the official source of unemployment data in India?',options:['Census','NFHS','PLFS','ASI'],ai:2,exp:'The Periodic Labour Force Survey conducted by NSO.'}
],
hook:'Tendulkar=Poverty. Disguised=Agri. Gini=Inequality. MPI=UNDP/NITI. PLFS=Unemployment. Stagflation=Bad economy.',
summary:'Evolution of poverty estimation in India. Understanding the Multidimensional Poverty Index. Classification of unemployment types. Analysis of labor market indicators.'},

{day:79,topic:'UPSC Economy: Planning & NITI Aayog',
intro:`Today we study the 'Vision of the State'. From the Soviet-inspired 5-Year Plans to the cooperative federalism of NITI Aayog, India's planning approach has evolved. We study the transition from a 'Command Economy' to a 'Market Economy'. For UPSC, focus on the 'Differences between Planning Commission and NITI Aayog' and the 'Strategy of the 12th 5-Year Plan'. Let's master the administrative side of economy today.`,
notes:[
{title:'Era of Five-Year Plans (1951–2017)',detail:'1st: Harrod-Domar (Agri). 2nd: Mahalanobis (Heavy Industry). 12th (Final): Faster, Sustainable, and more Inclusive growth.'},
{title:'Planning Commission (1950–2014)',detail:'Advisory body. Centralized planning. Allocated funds to states. "Top-down" approach.'},
{title:'NITI Aayog (Jan 1, 2015)',detail:'Think-tank. National Institution for Transforming India. Focus on "Cooperative Federalism" and "Bottom-up" approach. No fund allocation power.'},
{title:'Structure of NITI',detail:'Chairman: PM. Vice-Chairman: Appointed by PM. CEO: Appointed by PM. Governing Council: PM + CMs of all states + LGs of UTs.'},
{title:'Key Reports/Indexes',detail:'SDG India Index, Composite Water Management Index, School Education Quality Index, Innovation Index.'}
],
cards:[
{front:'When was NITI Aayog established?',back:'January 1, 2015.'},
{front:'Who is the Chairman of NITI Aayog?',back:'The Prime Minister.'},
{front:'Mahalanobis model was for which plan?',back:'2nd Five-Year Plan.'},
{front:'Planning Commission vs NITI Aayog?',back:'PC = Top-down, fund allocation. NITI = Bottom-up, think-tank.'},
{front:'Slogan of 12th FYP?',back:'Faster, Sustainable, and more Inclusive growth.'}
],
q:[
{q:'Which of the following is NOT a feature of NITI Aayog?',options:['Cooperative Federalism','Fund allocation to states','Bottom-up approach','Think-tank role'],ai:1,exp:'Fund allocation is handled by the Finance Ministry; PC used to do it.'},
{q:'The "Governing Council" of NITI Aayog includes:',options:['Only PM and Cabinet ministers','PM and CMs of all states','PM, CMs, and LGs of UTs','Only nominated experts'],ai:2,exp:'This ensures a platform for cooperative federalism.'},
{q:'The First Five-Year Plan was based on which model?',options:['Mahalanobis','Harrod-Domar','Solow','Gadgil'],ai:1,exp:'It focused on agricultural development post-independence.'},
{q:'"Indication Planning" was introduced in India during which plan?',options:['4th','6th','8th','12th'],ai:2,exp:'8th plan (1992-97) marked the shift towards a market-oriented economy.'}
],
hook:'PC=1950. NITI=2015. 1st=Agri. 2nd=Industry. NITI=Think-tank/Cooperative Federalism. PM=Chair.',
summary:'Evolution of planning in India. Comparison of Planning Commission and NITI Aayog. Goals of the final 5-year plans. Role of NITI Aayog in promoting cooperative federalism.'},

{day:80,topic:'UPSC Economy: Industry & Infrastructure',
intro:`Today we study the 'Physical Engine'. Industrial growth and robust infrastructure are the keys to a 'Viksit Bharat'. We explore the Industrial Policy Resolutions, the 'Maharatna/Navratna' status, and the modern push for Gati Shakti and PLI schemes. For UPSC, focus on the 'Core Industries', 'MSME definitions', and the 'Logistic Performance Index'. This is the real-world application of economic theory.`,
notes:[
{title:'Industrial Policy 1991',detail:'LPG Reforms (Liberalization, Privatization, Globalization). Ended "License Raj". Reduced public sector reserved areas.'},
{title:'Index of Industrial Production (IIP)',detail:'Measures short-term changes in volume of production. 8 Core Industries account for ~40% weightage (Refinery products, Electricity, Steel, Coal, Crude oil, Natural gas, Cement, Fertilizers).'},
{title:'CPSE Categorization',detail:'Maharatna, Navratna, Miniratna. Based on profit, net worth, and global presence. (e.g., ONGC, NTPC are Maharatnas).'},
{title:'MSME Definition (New)',detail:'Based on Investment and Turnover. Micro (<1cr/5cr), Small (<10cr/50cr), Medium (<50cr/250cr).'},
{title:'Infrastructure Initiatives',detail:'PM Gati Shakti (Multimodal connectivity). Bharatmala (Roads). Sagarmala (Ports). PLI (Production Linked Incentive) to boost manufacturing.'}
],
cards:[
{front:'What is "IIP"?',back:'Index of Industrial Production.'},
{front:'How many "Core Industries" are there in India?',back:'8.'},
{front:'Which core industry has the highest weightage?',back:'Refinery Products.'},
{front:'New MSME definition is based on?',back:'Investment and Turnover.'},
{front:'What is the LPG year?',back:'1991.'}
],
q:[
{q:'Which of the following is NOT one of the 8 Core Industries?',options:['Electricity','Steel','Textiles','Fertilizers'],ai:2,exp:'Refinery, Elec, Steel, Coal, Crude, Gas, Cement, Fert are the eight.'},
{q:'"Production Linked Incentive" (PLI) scheme aims to:',options:['Give loans to farmers','Boost domestic manufacturing','Reduce import duties','Privatize PSUs'],ai:1,exp:'It provides incentives based on incremental sales of made-in-India products.'},
{q:'The "Maharatna" status gives a PSU:',options:['Absolute independence','Greater financial and operational autonomy','Exemption from taxes','Control over other PSUs'],ai:1,exp:'They can invest up to ₹5,000 crore without prior govt approval.'},
{q:'What is the base year for the Index of Industrial Production (IIP)?',options:['2004-05','2011-12','2017-18','1993-94'],ai:1,exp:'Currently fixed at 2011-12.'}
],
hook:'IP 1991=LPG. 8 Core industries. MSME=Investment+Turnover. IIP=2011-12. Maharatna=Max Autonomy. Gati Shakti=Logistics.',
summary:'Analysis of Indian industrial development. Components of IIP and Core Industries. Classification of CPSEs and MSMEs. Modern infrastructure and manufacturing initiatives (PLI/Gati Shakti).'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'upsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ UPSC Economy Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Economy Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'UPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('UPSC Indian Economy '+d.topic),why:'Crucial for understanding the implementation of economic policies.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | High Yield',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ UPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();
