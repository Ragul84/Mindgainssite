require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:43,topic:'TNPSC Economy: Nature of Indian Economy & Planning',
intro:`Today we study the 'Engine of Growth'. Indian Economy in TNPSC focuses on 'Five Year Plans' and 'Planning Commission history'. From the Harrod-Domar model to the LPG reforms of 1991—these are the structural facts. Do you know which plan is called the 'Holiday Plan'? Let's master the planning era today.`,
notes:[
{title:'Nature of Indian Economy',detail:'Mixed Economy (Private + Public). Developing economy. Large labor force. High importance of Agriculture.'},
{title:'Planning Commission',detail:'Established 15 March 1950. Non-constitutional body. Chairman: PM. 1st Deputy Chairman: Gulzarilal Nanda.'},
{title:'Five Year Plans (Top 3)',detail:'1. 1st Plan (1951-56): Harrod-Domar model (Agri). 2. 2nd Plan (1956-61): Mahalanobis model (Industry). 3. 12th Plan (2012-17): Sustainable growth.'},
{title:'Plan Holidays',detail:'1966-69 (due to war and drought). Rolling Plan (1978-79 - Janata govt). Annual Plans (1990-92).'},
{title:'LPG Reforms (1991)',detail:'Liberalization, Privatization, Globalization. Launched under Narasimha Rao govt with Manmohan Singh as Finance Minister.'}
],
cards:[
{front:'Chairman of Planning Commission?',back:'Prime Minister.'},
{front:'1st Plan model?',back:'Harrod-Domar.'},
{front:'2nd Plan model?',back:'Mahalanobis.'},
{front:'Year of LPG reforms?',back:'1991.'},
{front:'"Mixed Economy" means?',back:'Public and Private coexist.'}
],
q:[
{q:'"Mahalanobis Model" was the basis for which Five Year Plan?',options:['1st','2nd','3rd','4th'],ai:1,exp:'Focused on heavy industrialization.'},
{q:'In which year was the "Planning Commission" established?',options:['1947','1950','1952','1956'],ai:1,exp:'Set up by a cabinet resolution.'},
{q:'The "Plan Holiday" period was:',options:['1961-66','1966-69','1970-75','1990-92'],ai:1,exp:'Interruption due to Indo-Pak war and drought.'},
{q:'Who was the Finance Minister during the 1991 Economic Reforms?',options:['Narasimha Rao','Manmohan Singh','Chidambaram','Pranab Mukherjee'],ai:1,exp:'Known for the LPG policy.'}
],
hook:'1st=Agri. 2nd=Mahalanobis. 1950=PC. 1991=LPG. Mixed Economy. Plan Holiday=1966-69.',
summary:'Characteristics of the Indian economy. History and structure of the Planning Commission. Analysis of major Five Year Plans and their objectives. Impact of the 1991 LPG reforms.'},

{day:44,topic:'TNPSC Economy: NITI Aayog & Finance Commission',
intro:`Today we study the 'Think Tank and the Treasury'. NITI Aayog replaced the Planning Commission, and the Finance Commission handles the 'Money sharing' between Center and States. In TNPSC, '15th Finance Commission' and 'SDG Index' are high-yield. Do you know who is the CEO of NITI Aayog? Let's master the modern institutions today.`,
notes:[
{title:'NITI Aayog',detail:'Established 1 Jan 2015. "National Institution for Transforming India". Bottom-up approach. Cooperative Federalism.'},
{title:'Structure of NITI',detail:'Chairman: PM. Vice-Chairman (Appointed by PM). CEO. Governing Council (All CMs and L-Gs).'},
{title:'Finance Commission (Art 280)',detail:'Constitutional body. Appointed by President every 5 years. Purpose: Distribution of tax revenue between Center and States.'},
{title:'15th Finance Commission',detail:'Chairman: N.K. Singh. Period: 2021-26. Recommended State share: 41%.'},
{title:'Major Reports',detail:'SDG India Index, Composite Water Management Index, School Education Quality Index.'}
],
cards:[
{front:'NITI Aayog established on?',back:'1 Jan 2015.'},
{front:'Finance Commission Article?',back:'Article 280.'},
{front:'Chairman of 15th FC?',back:'N.K. Singh.'},
{front:'State share recommended by 15th FC?',back:'41%.'},
{front:'"Bottom-up" planning belongs to?',back:'NITI Aayog.'}
],
q:[
{q:'"NITI Aayog" was formed in which year?',options:['2014','2015','2016','2017'],ai:1,exp:'Replaced the 65-year old Planning Commission.'},
{q:'Who is the ex-officio Chairman of NITI Aayog?',options:['President','Prime Minister','Finance Minister','Vice President'],ai:1,exp:'Constitutional/Administrative rule.'},
{q:'"Article 280" of the Indian Constitution is related to:',options:['Election Commission','UPSC','Finance Commission','Planning Commission'],ai:2,exp:'Appointed by the President.'},
{q:'Who was the Chairman of the "15th Finance Commission"?',options:['Y.V. Reddy','Vijay Kelkar','N.K. Singh','C. Rangarajan'],ai:2,exp:'His report covers the period 2021-2026.'}
],
hook:'NITI=2015. 280=FC. NK Singh=15th FC. 41%=Share. PM=NITI Chair. Bottom-up.',
summary:'Origins and philosophy of NITI Aayog. Comparison between NITI Aayog and Planning Commission. Role and importance of the Finance Commission (Art 280). Key recommendations of the 15th Finance Commission.'},

{day:45,topic:'TNPSC Economy: GST & Fiscal Policy',
intro:`Today we study the 'Taxes and Budgets'. Goods and Services Tax (GST) changed the indirect tax landscape of India. In TNPSC, 'GST Council' and 'Fiscal Deficit' are high-yield. Do you know which amendment introduced GST? Or what is the 'FRBM Act'? Let's master the revenue facts today.`,
notes:[
{title:'GST (One Nation One Tax)',detail:'Implemented: 1 July 2017. 101st Constitutional Amendment. Indirect tax. Slabs: 0%, 5%, 12%, 18%, 28%.'},
{title:'GST Council (Art 279A)',detail:'Chairman: Union Finance Minister. Decision making body for GST rates.'},
{title:'Fiscal Policy',detail:'Government\'s policy regarding Revenue and Expenditure. Tool to control Inflation/Growth.'},
{title:'Fiscal Deficit',detail:'Total Expenditure - (Revenue Receipts + Non-debt Capital Receipts). Measures the borrowing needs of the govt.'},
{title:'FRBM Act (2003)',detail:'Fiscal Responsibility and Budget Management. Target: To reduce fiscal deficit and bring financial discipline.'}
],
cards:[
{front:'GST implemented on?',back:'1 July 2017.'},
{front:'GST Amendment number?',back:'101st Amendment.'},
{front:'Chairman of GST Council?',back:'Union Finance Minister.'},
{front:'Article for GST Council?',back:'Article 279A.'},
{front:'"One Nation One Tax" refers to?',back:'GST.'}
],
q:[
{q:'In which year was the "Goods and Services Tax (GST)" implemented in India?',options:['2015','2016','2017','2018'],ai:2,exp:'Launched at midnight of June 30 / July 1.'},
{q:'Which Constitutional Amendment is associated with GST?',options:['100th','101st','102nd','103rd'],ai:1,exp:'Passed in 2016.'},
{q:'Who is the Chairman of the "GST Council"?',options:['PM','President','Union Finance Minister','RBI Governor'],ai:2,exp:'Empowered by Art 279A.'},
{q:'"Fiscal Deficit" essentially represents:',options:['Govt savings','Govt borrowings','Govt profit','None'],ai:1,exp:'Difference between total expenditure and total non-debt receipts.'}
],
hook:'GST=1 July 2017. 101st Amend. 279A=Council. FM=Chair. Deficit=Borrowing. FRBM=2003.',
summary:'Concepts and structure of the Goods and Services Tax. Role and powers of the GST Council. Introduction to fiscal policy and budget management. Significance of the FRBM Act.'},

{day:46,topic:'TNPSC Economy: Agri, Industry & Services',
intro:`Today we study the 'Three Pillars'. Agriculture is the backbone, Industry is the engine, and Services is the driver of the Indian economy. In TNPSC, 'Green Revolution' and 'MSMEs' are high-yield. Do you know who is the 'Father of Green Revolution in India'? Let's master the sectors today.`,
notes:[
{title:'Agriculture (Primary Sector)',detail:'Green Revolution (1960s - M.S. Swaminathan). Major crops: Paddy, Wheat. Subsidy types: Fertilizer, Power.'},
{title:'Industry (Secondary Sector)',detail:'Navratna, Maharatna, Miniratna status for PSUs. MSME (Micro, Small, Medium Enterprises) - vital for employment in TN.'},
{title:'Services (Tertiary Sector)',detail:'Largest contributor to GDP (~54%). Banking, IT, Tourism, Insurance.'},
{title:'Unemployment Types',detail:'Disguised (Agri), Seasonal, Structural, Frictional. TN has various schemes for skill development (Naan Mudhalvan).'},
{title:'Banking & RBI',detail:'RBI (Established 1935, Nationalized 1949). Monetary Policy (Repo, Reverse Repo). Banks Nationalization (1969 - 14 banks).'}
],
cards:[
{front:'Father of Green Revolution (India)?',back:'M.S. Swaminathan.'},
{front:'RBI Nationalized in?',back:'1949.'},
{front:'Largest sector in GDP?',back:'Services.'},
{front:'Disguised unemployment occurs in?',back:'Agriculture.'},
{front:'Year of 1st Bank Nationalization?',back:'1969.'}
],
q:[
{q:'"M.S. Swaminathan" is known for which revolution in India?',options:['White','Blue','Green','Yellow'],ai:2,exp:'Introduced High Yielding Variety (HYV) seeds.'},
{q:'The "Reserve Bank of India" was established in which year?',options:['1935','1947','1949','1951'],ai:0,exp:'On the recommendation of the Hilton Young Commission.'},
{q:'Which sector contributes the most to India\'s GDP?',options:['Agriculture','Industry','Services','Mining'],ai:2,exp:'Tertiary sector is the dominant driver.'},
{q:'"Disguised Unemployment" refers to:',options:['No jobs available','Zero marginal productivity of labor','Unemployment during off-season','None'],ai:1,exp:'Mostly seen in agriculture where more people work than needed.'}
],
hook:'Agri=Swaminathan. Services=Top GDP. RBI=1935. 1969=Nationalization. Disguised=Agri. MSME=Jobs.',
summary:'Performance and challenges of the agricultural sector. Classification and importance of industries and MSMEs. Role of the service sector in national income. Basic banking and monetary policy concepts.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'tnpsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ TNPSC Economy Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'TN Economy Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'TNPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('TNPSC Economy '+d.topic),why:'Mastering Indian economy for TNPSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | Economy',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'tnpsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ TNPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();
