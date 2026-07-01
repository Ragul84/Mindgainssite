require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:32,topic:'SSC Science: Biology — Cell & Tissues',
intro:`Today we study the 'Micro-World'. The Cell is the fundamental unit of life. In SSC, questions often focus on 'Cell Organelles' and their nicknames (e.g., Powerhouse, Suicide bag). We also explore Tissues—the groups of cells that perform specific functions. Toppers focus on 'Plant vs Animal cells'. Let's master the biology of the cell today.`,
notes:[
{title:'Cell Theory',detail:'All living things are made of cells. Proposed by Schleiden and Schwann. First observed by Robert Hooke (1665 - dead cell) and Leeuwenhoek (living cell).'},
{title:'Cell Organelles (The Nicknames)',detail:'1. Mitochondria: Powerhouse of the cell (produces ATP). 2. Lysosomes: Suicide bags (digestive enzymes). 3. Ribosomes: Protein factories. 4. Golgi Bodies: Packaging house. 5. Chloroplast: Kitchen of the cell (only in plants).'},
{title:'Nucleus',detail:'Brain of the cell. Contains DNA and Chromosomes. Prokayotic (no nucleus - Bacteria) vs Eukaryotic (nucleus present - Animals/Plants).'},
{title:'Plant vs Animal Cell',detail:'Plant: Cell wall (Cellulose), large vacuole, Chloroplast. Animal: No cell wall, small vacuoles, Centrioles.'},
{title:'Tissues',detail:'Group of similar cells. Animal: Epithelial, Connective (Blood/Bone), Muscular, Nervous. Plant: Meristematic (Growth) and Permanent (Xylem - Water, Phloem - Food).'}
],
cards:[
{front:'Powerhouse of the cell?',back:'Mitochondria.'},
{front:'Suicide bags of the cell?',back:'Lysosomes.'},
{front:'Protein factory of the cell?',back:'Ribosomes.'},
{front:'Tissue that carries water in plants?',back:'Xylem.'},
{front:'Main component of plant cell wall?',back:'Cellulose.'}
],
q:[
{q:'Which organelle is known as the "Suicide Bag" of the cell?',options:['Ribosome','Mitochondria','Lysosome','Golgi body'],ai:2,exp:'They contain digestive enzymes that can destroy the cell if it is damaged.'},
{q:'Plants prepare their food in which part of the cell?',options:['Mitochondria','Vacuole','Chloroplast','Ribosome'],ai:2,exp:'Chloroplast contains chlorophyll for photosynthesis.'},
{q:'Blood is which type of tissue?',options:['Epithelial','Connective','Muscular','Nervous'],ai:1,exp:'It is a fluid connective tissue.'},
{q:'Who discovered the "Cell" for the first time?',options:['Robert Hooke','Robert Brown','Leeuwenhoek','Purkinje'],ai:0,exp:'He observed honeycomb-like structures in a cork slice in 1665.'}
],
hook:'Mito=Power. Lyso=Suicide. Ribo=Protein. Xylem=Water. Phloem=Food. Blood=Connective. Hooke=Cell.',
summary:'Structure and function of cell organelles and their popular nicknames. Comparison of plant and animal cells. Introduction to plant and animal tissue systems.'},

{day:33,topic:'SSC Science: Biology — Digestive & Respiratory Systems',
intro:`Today we study 'Fuel and Oxygen'. The digestive system breaks down food into nutrients, while the respiratory system provides the oxygen needed to burn that fuel for energy. In SSC, the 'Enzymes' (Pepsin, Amylase) and the 'Organs' (Lungs, Small Intestine) are favorite topics. Do you know where most digestion happens? Or why we pant after running? Let's master the human machine today.`,
notes:[
{title:'Digestive System (Alimentary Canal)',detail:'Starts from Mouth, ends at Anus. 1. Mouth: Amylase digests starch. 2. Stomach: HCl + Pepsin digests protein. 3. Small Intestine: Site of COMPLETE digestion and absorption. 4. Large Intestine: Water absorption.'},
{title:'Digestive Glands',detail:'Liver: Largest gland, produces Bile (stored in Gall bladder, helps digest fats). Pancreas: Produces insulin and digestive enzymes.'},
{title:'Respiratory System',detail:'Nasal cavity -> Pharynx -> Larynx (Voice box) -> Trachea -> Lungs (Alveoli). Alveoli are the site of gas exchange.'},
{title:'Breathing Mechanism',detail:'Inhalation (Diaphragm moves down). Exhalation (Diaphragm moves up). Aerobic (with O2) vs Anaerobic (without O2 - produces lactic acid causing muscle cramps).'},
{title:'Enzyme Quick Table',detail:'Saliva (Amylase - Starch). Gastric (Pepsin - Protein). Pancreatic (Trypsin - Protein, Lipase - Fats).'}
],
cards:[
{front:'Where does complete digestion happen?',back:'Small Intestine.'},
{front:'Largest gland in the human body?',back:'Liver.'},
{front:'Voice box of humans?',back:'Larynx.'},
{front:'Enzyme that digests milk protein?',back:'Renin.'},
{front:'Site of gas exchange in lungs?',back:'Alveoli.'}
],
q:[
{q:'Which of the following is the largest gland in the human body?',options:['Pancreas','Thyroid','Liver','Pituitary'],ai:2,exp:'Liver performs over 500 vital functions including bile production.'},
{q:'The process of digestion of food in humans begins in:',options:['Stomach','Small Intestine','Mouth','Oesophagus'],ai:2,exp:'Salivary amylase starts breaking down starch immediately.'},
{q:'"Bile Juice" is stored in which organ?',options:['Liver','Pancreas','Gall Bladder','Spleen'],ai:2,exp:'Produced in the liver but concentrated and stored in the gall bladder.'},
{q:'Anaerobic respiration in human muscles produces:',options:['Carbon dioxide','Ethanol','Lactic Acid','Water'],ai:2,exp:'This causes the burning sensation and fatigue during intense exercise.'}
],
hook:'Mouth=Starch. Stomach=Protein. Small Intestine=Complete. Liver=Largest. Alveoli=Gas. Bile=Gall bladder.',
summary:'Pathway of food and important digestive enzymes. Functions of liver and pancreas. Respiratory organs and the mechanism of gas exchange. Aerobic vs Anaerobic respiration.'},

{day:34,topic:'SSC Science: Biology — Circulatory & Excretory Systems',
intro:`Today we study the 'Transport and Filtration'. The heart pumps blood to every cell, and the kidneys filter out the waste. In SSC, 'Blood Groups', 'Parts of the Heart', and the 'Nephron' are high-yield. Do you know why veins are blue? Or who is the 'Universal Donor'? Let's master the hydraulics of the body today.`,
notes:[
{title:'Circulatory System',detail:'Heart, Blood, and Blood Vessels. Human heart has 4 chambers (2 Atria, 2 Ventricles). Arteries: Carry oxygenated blood AWAY from heart (Except Pulmonary Artery). Veins: Carry deoxygenated blood TOWARDS heart (Except Pulmonary Vein).'},
{title:'Blood Components',detail:'Plasma (Liquid). RBCs (Erythrocytes - carry O2 via Hemoglobin). WBCs (Leucocytes - immunity). Platelets (Thrombocytes - clotting). RBC life span ~120 days.'},
{title:'Blood Groups (Landsteiner)',detail:'A, B, AB, O. AB+ is Universal Recipient. O- is Universal Donor. Rh factor (Rhesus monkey).'},
{title:'Excretory System',detail:'Kidneys (filtering unit), Ureters, Bladder, Urethra. Basic unit of Kidney: NEPHRON.'},
{title:'Waste Products',detail:'Urea is produced in the Liver and filtered by the Kidney. Dialysis is the artificial filtration used when kidneys fail.'}
],
cards:[
{front:'Universal Donor blood group?',back:'O negative.'},
{front:'Basic unit of Kidney?',back:'Nephron.'},
{front:'Life span of RBC?',back:'120 days.'},
{front:'Instrument used to measure Blood Pressure?',back:'Sphygmomanometer.'},
{front:'Blood vessel that carries deoxygenated blood to lungs?',back:'Pulmonary Artery.'}
],
q:[
{q:'Which part of the heart receives oxygenated blood from the lungs?',options:['Right Atrium','Right Ventricle','Left Atrium','Left Ventricle'],ai:2,exp:'Blood returns from the lungs via pulmonary veins to the left atrium.'},
{q:'The filtering unit of the kidney is called:',options:['Neuron','Nephron','Axon','Ureter'],ai:1,exp:'Nephrons remove waste and excess water from blood.'},
{q:'"Universal Recipient" blood group is:',options:['A','B','AB','O'],ai:2,exp:'AB positive can receive blood from any group.'},
{q:'Normal blood pressure of a human is:',options:['120/80','100/60','140/90','80/120'],ai:0,exp:'120 mmHg (Systolic) and 80 mmHg (Diastolic).'}
],
hook:'RBC=120 days. O-=Donor. AB+=Recipient. Nephron=Kidney. Sphygmo=BP. Pulmonary=Exception. Heart=4 chambers.',
summary:'Function and components of blood. Structure of the heart and blood flow. Detailed study of the urinary system and nephrons. Blood groups and donation logic.'},

{day:35,topic:'SSC REVISION: Biology Part 1 (Days 32–34)',
intro:`Today we consolidate the 'Foundations of Life'. You have mastered the cell nicknames, the digestive path, the heart's rhythm, and the kidney's filtration. In SSC Science, Biology accounts for the maximum questions. Today, we drill the facts. If you see 'Powerhouse', you say 'Mito'. If you see 'Universal Donor', you say 'O-'. Let's lock in the biology marks today.`,
notes:[
{title:'Cell Recap',detail:'Mito (Power), Lyso (Suicide), Ribo (Protein). Robert Hooke (Cell). Plant (Wall) vs Animal (No wall).'},
{title:'Digestion Recap',detail:'Mouth (Amylase), Stomach (Pepsin), Small Intestine (Absorption). Liver (Largest gland). Bile stored in Gall bladder.'},
{title:'Circulation Recap',detail:'Heart (4 chambers). RBC (120 days/Hemoglobin). O- (Donor), AB+ (Recipient). Sphygmomanometer (BP).'},
{title:'Excretion Recap',detail:'Kidney (Nephron). Urea produced in Liver, filtered by Kidney. Dialysis (Artificial filtration).'},
{title:'Plant Tissue Recap',detail:'Xylem (Water), Phloem (Food), Meristematic (Growth).'}
],
cards:[
{front:'Kitchen of the cell?',back:'Chloroplast.'},
{front:'Blood pressure measuring tool?',back:'Sphygmomanometer.'},
{front:'Where is insulin produced?',back:'Pancreas.'},
{front:'Largest artery in the body?',back:'Aorta.'},
{front:'Who discovered blood groups?',back:'Karl Landsteiner.'}
],
q:[
{q:'"Meristematic tissue" in plants is responsible for:',options:['Food transport','Growth','Water transport','Support'],ai:1,exp:'Found in root and shoot tips for active cell division.'},
{q:'Which of the following carries oxygenated blood?',options:['Pulmonary artery','Vena cava','Aorta','Right ventricle'],ai:2,exp:'Aorta is the main artery carrying oxygenated blood to the body.'},
{q:'The acid present in the human stomach for digestion is:',options:['Sulfuric acid','Nitric acid','Hydrochloric acid','Acetic acid'],ai:2,exp:'HCl activates pepsin and kills bacteria.'},
{q:'"Neuron" is the unit of which system?',options:['Digestive','Circulatory','Excretory','Nervous'],ai:3,exp:'Neurons are nerve cells (Don\'t confuse with Nephrons!).'}
],
hook:'Mito=Power. Small Intestine=Absorption. O-=Donor. Nephron=Kidney. Neuron=Nerve. Xylem=Water. 120/80=Normal BP.',
summary:'Full revision of Cell Biology and Human Physiology. Comparison of various organ systems and their units. High-speed drill of biological nicknames and instruments. Final Biology Part 1 mock quiz.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'ssc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ SSC Biology Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Biology Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'SSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('SSC CGL Biology '+d.topic),why:'Mastering human systems for SSC exams.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | Science',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'ssc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ SSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();
