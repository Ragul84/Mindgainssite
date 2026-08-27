require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:67,topic:'TNPSC Science: Physics — Nature of Universe & Units',
intro:`Today we study the 'Laws of Nature'. Physics in TNPSC focuses on 'Standard Units', 'Newton's Laws', and 'Universe'. From Light years to the Big Bang—these are the fundamental facts from Samacheer books. Do you know which unit is used to measure Astronomical distances? Let's master the physics today.`,
notes:[
{title:'SI Units',detail:'Length (Meter), Mass (kg), Time (sec), Temp (Kelvin), Current (Ampere), Amount (Mole), Luminous Intensity (Candela).'},
{title:'Newton\'s Laws',detail:'1. Inertia. 2. F=ma. 3. Action=Reaction (Rocket propulsion).'},
{title:'Universe & Light',detail:'1 Light Year = 9.46 x 10^12 km. AU = 1.496 x 10^8 km. Speed of light = 3 x 10^8 m/s.'},
{title:'Work, Power, Energy',detail:'Work = F*d (Joule). Power = Work/Time (Watt). Kinetic = 1/2mv^2. Potential = mgh.'},
{title:'Optics',detail:'Convex (Converging - Hypermetropia). Concave (Diverging - Myopia). Reflection and Refraction basics.'}
],
cards:[
{front:'SI Unit of Temperature?',back:'Kelvin.'},
{front:'Newton\'s 1st Law is law of?',back:'Inertia.'},
{front:'Light Year measures?',back:'Distance.'},
{front:'Lens for Myopia?',back:'Concave.'},
{front:'Speed of light?',back:'3 x 10^8 m/s.'}
],
q:[
{q:'Which of the following is the SI unit of "Luminous Intensity"?',options:['Mole','Ampere','Candela','Kelvin'],ai:2,exp:'Standard base unit.'},
{q:'"Rocket Propulsion" is based on which of Newton\'s laws?',options:['1st','2nd','3rd','All'],ai:2,exp:'Every action has an equal and opposite reaction.'},
{q:'A "Light Year" is a unit of:',options:['Time','Distance','Speed','Intensity'],ai:1,exp:'Distance traveled by light in one year.'},
{q:'"Myopia" (Short-sightedness) can be corrected using a:',options:['Convex lens','Concave lens','Bifocal lens','None'],ai:1,exp:'Concave lens diverges light to focus on the retina.'}
],
hook:'Candela=Light. 3rd Law=Rocket. Light Year=Distance. Concave=Myopia. Kelvin=Temp.',
summary:'Identification of SI base units and derived units. Application of Newton\'s laws of motion. Core concepts of astronomical distances and optics. Basic energy and power relations.'},

{day:68,topic:'TNPSC Science: Chemistry — Elements & Acids',
intro:`Today we study the 'Building Blocks of Matter'. Chemistry in TNPSC is about 'Periodic table', 'Acids, Bases & Salts', and 'Daily Life Chemistry'. From the pH scale to the 'King of Chemicals'—these are high-yield facts. Do you know the pH of pure water? Let's master the elements today.`,
notes:[
{title:'Matter',detail:'Elements (Pure), Compounds (Chemically bonded), Mixtures (Physically combined).'},
{title:'Acids, Bases & Salts',detail:'Acids: Sour, Blue to Red litmus, pH < 7. Bases: Bitter, Red to Blue, pH > 7. Neutral: pH = 7.'},
{title:'pH Values',detail:'Blood (7.4), Lemon (2.2), Milk (6.5), Gastric juice (1.2), Pure Water (7.0).'},
{title:'Important Chemicals',detail:'Baking Soda (Sodium Bicarbonate), Washing Soda (Sodium Carbonate), Bleaching Powder (Calcium Oxychloride).'},
{title:'Periodic Table',detail:'Modern law by Moseley (Atomic number). Groups (18), Periods (7). Halogens (Group 17), Noble Gases (Group 18).'}
],
cards:[
{front:'"King of Chemicals"?',back:'Sulphuric Acid (H2SO4).'},
{front:'pH of Blood?',back:'7.4.'},
{front:'Baking Soda formula?',back:'NaHCO3.'},
{front:'pH of pure water?',back:'7.'},
{front:'Modern periodic law based on?',back:'Atomic Number.'}
],
q:[
{q:'Which acid is known as the "King of Chemicals"?',options:['HCl','HNO3','H2SO4','CH3COOH'],ai:2,exp:'Sulphuric acid, due to its industrial importance.'},
{q:'What is the pH value of "Human Blood"?',options:['6.4','7.0','7.4','8.2'],ai:2,exp:'Slightly alkaline.'},
{q:'"Washing Soda" is the common name for:',options:['Sodium Bicarbonate','Sodium Carbonate','Sodium Chloride','Calcium Carbonate'],ai:1,exp:'Sodium Carbonate (Na2CO3).'},
{q:'Which gas is used in fire extinguishers?',options:['Oxygen','Nitrogen','Carbon Dioxide','Helium'],ai:2,exp:'CO2 displaces oxygen to put out fire.'}
],
hook:'H2SO4=King. 7.4=Blood. NaHCO3=Baking. Na2CO3=Washing. Atomic No=Moseley. CO2=Fire.',
summary:'Classification of matter and periodic trends. Properties and pH indicators of acids and bases. Chemical names and formulas of common substances. Role of chemistry in everyday life.'},

{day:69,topic:'TNPSC Science: Biology — Life Science & Diseases',
intro:`Today we study the 'Living World'. Biology in TNPSC focuses on 'Human Systems', 'Genetics', and 'Diseases'. From Vitamins to the 'Powerhouse of the Cell'—these are the core biological facts. Do you know which organ is called the 'Chemical Laboratory' of the body? Let's master the life today.`,
notes:[
{title:'Cell Biology',detail:'Cell (Basic unit). Mitochondria (Powerhouse), Ribosomes (Protein factory), Nucleus (Control center).'},
{title:'Human Organs',detail:'Liver (Largest gland), Skin (Largest organ), Femur (Longest bone), Stapes (Smallest bone).'},
{title:'Vitamins & Deficiency',detail:'A (Night blindness), B1 (Beriberi), C (Scurvy), D (Rickets), K (Blood clotting failure).'},
{title:'Diseases',detail:'Bacterial (Cholera, TB, Typhoid), Viral (AIDS, Polio, Common cold), Fungal (Ringworm).'},
{title:'Genetics',detail:'Father of Genetics: Gregor Mendel. DNA (Double helix - Watson & Crick). 23 pairs of chromosomes.'}
],
cards:[
{front:'"Powerhouse of the cell"?',back:'Mitochondria.'},
{front:'Vitamin for blood clotting?',back:'Vitamin K.'},
{front:'Longest bone in human body?',back:'Femur.'},
{front:'Disease caused by Vit C?',back:'Scurvy.'},
{front:'Father of Genetics?',back:'Gregor Mendel.'}
],
q:[
{q:'Which organelle is known as the "Powerhouse of the Cell"?',options:['Ribosome','Lysosome','Mitochondria','Golgi bodies'],ai:2,exp:'Where ATP (energy) is produced.'},
{q:'"Night Blindness" is caused by the deficiency of:',options:['Vitamin A','Vitamin B','Vitamin C','Vitamin D'],ai:0,exp:'Retinol deficiency.'},
{q:'How many "Chromosomes" are there in a normal human cell?',options:['23','44','46','48'],ai:2,exp:'23 pairs.'},
{q:'"TB" (Tuberculosis) is a disease caused by:',options:['Virus','Bacteria','Fungi','Protozoa'],ai:1,exp:'Mycobacterium tuberculosis.'}
],
hook:'Mitochondria=Energy. Vit A=Eyes. Vit K=Clotting. Femur=Longest. Bacteria=TB. Mendel=Genetics.',
summary:'Anatomy of the plant and animal cell. List of essential vitamins and their deficiency symptoms. Classification of common human diseases. Basics of heredity and genetics.'},

{day:70,topic:'TNPSC REVISION: Aptitude & Science Finale',
intro:`Today we consolidate the 'Logic and Facts'. You have mastered the advanced aptitude (3D, DI, Stats) and the core science (Physics, Chemistry, Bio). In TNPSC, Science is about 'Conceptual Clarity' and Aptitude is about 'Speed'. Today, we drill the formulas. If you see 'Mode', you say '3Med-2Mean'. If you see 'H2SO4', you say 'King'. Let's lock in the marks today.`,
notes:[
{title:'Aptitude Recap',detail:'Vol Sphere (4/3 pir3). Vol Cone (1/3 pir2h). HCF*LCM=Prod. Mode=3Med-2Mean. 360 deg=100%.'},
{title:'Physics Recap',detail:'Newton 3rd (Rocket). Concave (Myopia). Light Year (Distance). SI Temp (Kelvin).'},
{title:'Chemistry Recap',detail:'pH Blood (7.4). Baking (NaHCO3). Washing (Na2CO3). Modern Periodic (Atomic No).'},
{title:'Biology Recap',detail:'Mitochondria (Powerhouse). Vit K (Clotting). Vit A (Eyes). Bacteria (TB). Mendel (Genetics).'},
{title:'Science in TN',detail:'Focus on Samacheer book facts. Practical applications in TN industry/health.'}
],
cards:[
{front:'Formula for Mode?',back:'3 Median - 2 Mean.'},
{front:'Volume of Sphere?',back:'(4/3) pi r^3.'},
{front:'pH of Milk?',back:'6.5.'},
{front:'Smallest bone?',back:'Stapes (Ear).'},
{front:'Is your Science ready?',back:'YES.'}
],
q:[
{q:'Find the Mode if Mean is 15 and Median is 20.',options:['25','30','35','40'],ai:1,exp:'3(20) - 2(15) = 60 - 30 = 30.'},
{q:'Which lens is used for "Hypermetropia"?',options:['Concave','Convex','Bifocal','Cylindrical'],ai:1,exp:'Convex lens.'},
{q:'What is the chemical name of "Baking Soda"?',options:['Sodium Carbonate','Sodium Bicarbonate','Sodium Chloride','Potassium Nitrate'],ai:1,exp:'NaHCO3.'},
{q:'"Scurvy" is caused by deficiency of:',options:['Vit A','Vit B','Vit C','Vit D'],ai:2,exp:'Fact check.'}
],
hook:'Science complete. Aptitude complete. Formula drill. Fact check. Accuracy high. Victory.',
summary:'Full revision of advanced quantitative and logical topics. High-speed drill of physics and chemistry constants. Comparison of biological systems and diseases. Final Aptitude/Science mock quiz.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'tnpsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ TNPSC Science Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'TN Science Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'TNPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('TNPSC Science '+d.topic),why:'Consolidating science for TNPSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | REVISION DAY',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'tnpsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ TNPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();
