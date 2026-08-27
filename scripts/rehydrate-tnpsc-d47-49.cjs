require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:47,topic:'TNPSC Economy: Rural Welfare & Schemes',
intro:`Today we study the 'Heart of India'. Rural development is a major focus in TNPSC Economy. In TNPSC, 'MGNREGA', 'SHGs', and 'PMAY' are high-yield. Do you know which scheme is called the 'Magna Carta' of rural employment? Let's master the welfare facts today.`,
notes:[
{title:'MGNREGA (2005)',detail:'Mahatma Gandhi National Rural Employment Guarantee Act. Provides 100 days of guaranteed wage employment. Legal right to work.'},
{title:'Self Help Groups (SHGs)',detail:'TN is a pioneer in SHGs. "Mahalir Thittam" (1989). Linked with NABARD (est. 1982) for micro-credit.'},
{title:'Housing Schemes',detail:'PMAY (Pradhan Mantri Awas Yojana) - "Housing for All". IAY (Indira Awas Yojana) was the precursor.'},
{title:'Connectivity & Infrastructure',detail:'PMGSY (Gram Sadak Yojana) for all-weather roads. PURA (Providing Urban Amenities in Rural Areas - APJ Abdul Kalam).'},
{title:'Poverty Alleviation',detail:'Antyodaya Anna Yojana (AAY) - Food security for poorest of poor. IRDP, TRYSEM, DWACRA merged into SGSY (1999).'}
],
cards:[
{front:'MGNREGA Act year?',back:'2005.'},
{front:'"Mahalir Thittam" year?',back:'1989.'},
{front:'NABARD established in?',back:'1982.'},
{front:'PURA concept by?',back:'A.P.J. Abdul Kalam.'},
{front:'100 days work guarantee scheme?',back:'MGNREGA.'}
],
q:[
{q:'In which year was the "MGNREGA" Act passed?',options:['2004','2005','2006','2009'],ai:1,exp:'Enacted in 2005, implemented in 2006.'},
{q:'"NABARD" (National Bank for Agriculture and Rural Development) was established in:',options:['1975','1980','1982','1985'],ai:2,exp:'Apex regulatory body for rural finance.'},
{q:'The concept of "PURA" was advocated by:',options:['Gandhi','Nehru','A.P.J. Abdul Kalam','Periyar'],ai:2,exp:'Providing Urban Amenities in Rural Areas.'},
{q:'Which TN scheme focuses on the development of "Self Help Groups" for women?',options:['Kalaignar Magalir Urimai','Mahalir Thittam','Puthumai Penn','None'],ai:1,exp:'Launched in 1989.'}
],
hook:'MGNREGA=2005. NABARD=1982. Mahalir Thittam=1989. PURA=Kalam. 100 Days=Work.',
summary:'Analysis of major rural employment and housing schemes. Role of SHGs and micro-finance in rural TN. Objectives and impact of NABARD. Poverty alleviation strategies through direct benefit schemes.'},

{day:48,topic:'TNPSC Economy: Poverty & Unemployment',
intro:`Today we study the 'Challenges of Growth'. Poverty and Unemployment are the two biggest obstacles to development. In TNPSC, 'Poverty Line Committees' (Lakdawala, Tendulkar, Rangarajan) and 'Employment data' are high-yield. Do you know the difference between 'Absolute' and 'Relative' poverty? Let's master the stats today.`,
notes:[
{title:'Poverty Line Concepts',detail:'Absolute Poverty (Minimum physical requirements). Relative Poverty (Inequality compared to others). HCR (Head Count Ratio).'},
{title:'Committees on Poverty',detail:'1. Lakdawala (1993). 2. Tendulkar (2009 - shifted to per capita exp). 3. Rangarajan (2014).'},
{title:'Types of Unemployment',detail:'Structural (Mismatch of skills), Frictional (Temporary), Cyclical (Recession), Disguised (Agriculture).'},
{title:'Lorenz Curve & Gini Coefficient',detail:'Measure of Income Inequality. 0 = Perfect equality, 1 = Perfect inequality.'},
{title:'Vicious Circle of Poverty',detail:'Concept by Ragnar Nurkse: "A country is poor because it is poor" (Low income -> Low savings -> Low investment).'}
],
cards:[
{front:'"Tendulkar Committee" is for?',back:'Poverty estimation.'},
{front:'Lorenz Curve measures?',back:'Inequality.'},
{front:'"A country is poor because it is poor" - Who said?',back:'Ragnar Nurkse.'},
{front:'Disguised unemployment is mostly in?',back:'Agriculture.'},
{front:'Gini coefficient of 0 means?',back:'Perfect Equality.'}
],
q:[
{q:'The "Lorenz Curve" is a graphical representation of:',options:['Poverty','Unemployment','Income Inequality','Inflation'],ai:2,exp:'Shows the distribution of income/wealth.'},
{q:'Which committee recommended the shifting of poverty line from calorie intake to per capita expenditure?',options:['Lakdawala','Tendulkar','Rangarajan','Alagh'],ai:1,exp:'The 2009 committee report.'},
{q:'"Gini Coefficient" of "1" indicates:',options:['Perfect equality','Perfect inequality','Neutrality','High growth'],ai:1,exp:'Value 1 means one person has all the income.'},
{q:'Which type of unemployment is characterized by "Zero Marginal Productivity"?',options:['Structural','Seasonal','Disguised','Frictional'],ai:2,exp:'Common in Indian agriculture.'}
],
hook:'Tendulkar=Poverty. Lorenz=Inequality. Gini=0 to 1. Disguised=Agri. Nurkse=Vicious Circle.',
summary:'Classification of poverty and unemployment types. Chronology of poverty estimation committees in India. Tools for measuring income inequality. Economic theories on the cycle of poverty.'},

{day:49,topic:'TNPSC REVISION: Economy Finale (Days 43–48)',
intro:`Today we consolidate the 'Financial Framework'. You have mastered Planning, NITI Aayog, GST, Sectoral analysis, and Welfare schemes. In TNPSC, Economy marks depend on 'Dates' and 'Committee Names'. Today, we drill the numbers. If you see '280', you say 'Finance Commission'. If you see '2005', you say 'MGNREGA'. Let's lock in the Economy marks today.`,
notes:[
{title:'Institutions Recap',detail:'PC (1950). NITI (2015). FC (Art 280). GST (101st Amend). RBI (1935).'},
{title:'Planning Recap',detail:'1st (Agri). 2nd (Industry). 1966-69 (Holiday). 1991 (LPG).'},
{title:'Poverty Recap',detail:'Tendulkar (2009). Lorenz (Inequality). Gini (0-1). Disguised (Agri).'},
{title:'Schemes Recap',detail:'MGNREGA (2005). NABARD (1982). Mahalir Thittam (1989). Ujjwala (LPG).'},
{title:'Taxation Recap',detail:'GST (1 July 2017). 279A (Council). FM (Chairman). Direct vs Indirect.'}
],
cards:[
{front:'Article for GST Council?',back:'Article 279A.'},
{front:'Chairman of NITI Aayog?',back:'Prime Minister.'},
{front:'Year of 1st 5-year plan?',back:'1951.'},
{front:'Who wrote "Poverty and Un-British Rule in India"?',back:'Dadabhai Naoroji.'},
{front:'Is your Economy ready?',back:'YES.'}
],
q:[
{q:'"N.K. Singh" was the chairman of:',options:['13th FC','14th FC','15th FC','16th FC'],ai:2,exp:'Recap.'},
{q:'Which amendment is known for GST?',options:['100th','101st','102nd','103rd'],ai:1,exp:'Fact check.'},
{q:'"Disguised unemployment" is a feature of:',options:['IT sector','Manufacturing','Agriculture','Banking'],ai:2,exp:'Recap.'},
{q:'The "Rolling Plan" was introduced in:',options:['1966','1978','1990','1951'],ai:1,exp:'By the Janata government.'}
],
hook:'Economy complete. Institutional dates. Welfare schemes. Tax amendments. Poverty committees. Victory.',
summary:'Full revision of Indian and TN economy topics. High-speed drill of constitutional articles and institutional dates. Comparison of development and welfare indicators. Final Economy ecosystem mock quiz.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'tnpsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ TNPSC Economy Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'TN Economy Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'TNPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('TNPSC Economy '+d.topic),why:'Consolidating economy for TNPSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | REVISION DAY',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'tnpsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ TNPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();
