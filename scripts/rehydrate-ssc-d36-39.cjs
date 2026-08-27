require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:36,topic:'SSC Science: Biology — Nervous System & Senses',
intro:`Today we study the 'Control Center'. The Nervous system coordinates everything we do. We explore the Brain (Cerebrum, Cerebellum), the Spinal Cord, and the Reflex actions. We also look at Sense organs like the Eye and Ear. In SSC, the 'Parts of the Brain' and their functions (e.g., Balancing, Thinking) are high-yield. Let's master the mind today.`,
notes:[
{title:'Nervous System Unit',detail:'Neuron (Nerve cell). Longest cell in human body. Components: Cyton, Dendrites, Axon.'},
{title:'The Human Brain',detail:'1. Cerebrum: Largest part, controls intelligence, memory, voluntary actions. 2. Cerebellum: Controls posture and balance (affected by alcohol). 3. Medulla Oblongata: Controls involuntary actions (Heartbeat, Breathing).'},
{title:'Reflex Action',detail:'Sudden, automatic response. Controlled by the Spinal Cord. (e.g., withdrawing hand from fire).'},
{title:'The Human Eye',detail:'Cornea (Light entry), Iris (Color/Pupil size), Lens, Retina (Image formation - inverted/real). Rods (Night vision), Cones (Color vision).'},
{title:'The Human Ear',detail:'External, Middle, Inner ear. Auditory nerve carries sound to brain. Stapes (smallest bone) is in the middle ear.'}
],
cards:[
{front:'Smallest bone in the human body?',back:'Stapes (Ear).'},
{front:'Which part of the brain controls balance?',back:'Cerebellum.'},
{front:'Largest part of the human brain?',back:'Cerebrum.'},
{front:'Unit of the nervous system?',back:'Neuron.'},
{front:'Where is the image formed in the eye?',back:'Retina.'}
],
q:[
{q:'Which part of the brain is responsible for "Memory and Intelligence"?',options:['Cerebrum','Cerebellum','Medulla','Hypothalamus'],ai:0,exp:'Cerebrum is the seat of higher cognitive functions.'},
{q:'"Reflex actions" are controlled by:',options:['Brain','Spinal Cord','Heart','Nerves'],ai:1,exp:'Spinal cord manages rapid responses without brain intervention.'},
{q:'Alcohol primarily affects which part of the brain first?',options:['Cerebrum','Cerebellum','Medulla','Pons'],ai:1,exp:'This leads to loss of balance and coordination.'},
{q:'The "Pupil" of the eye is controlled by:',options:['Cornea','Retina','Iris','Optic Nerve'],ai:2,exp:'Iris regulates the amount of light entering the eye.'}
],
hook:'Cerebrum=Intelligence. Cerebellum=Balance. Medulla=Heartbeat. Neuron=Unit. Stapes=Smallest bone. Retina=Image.',
summary:'Structure and functions of the human brain. Types of nervous systems. Mechanism of reflex actions. Anatomy and common defects of the eye and ear.'},

{day:37,topic:'SSC Science: Biology — Hormones & Skeleton',
intro:`Today we study the 'Chemical Messengers and the Frame'. Endocrine glands produce hormones that regulate growth and metabolism. We also explore the Skeletal system—the 206 bones that support us. In SSC, 'Glands' (Pituitary, Thyroid, Adrenal) and 'Bone names' (Femur, Humerus) are favorites. Do you know which is the 'Master Gland'? Or the 'Fight or Flight' hormone? Let's master the internal regulators today.`,
notes:[
{title:'Endocrine Glands (Ductless)',detail:'1. Pituitary: Master Gland (controls others). Produces Growth Hormone. 2. Thyroid: Produces Thyroxine (Iodine needed). 3. Adrenal: "Emergency Gland". Produces Adrenaline (Fight or Flight).'},
{title:'Pancreas (Dual Gland)',detail:'Produces Insulin (lowers blood sugar) and Glucagon (raises sugar). Deficiency of Insulin causes Diabetes Mellitus.'},
{title:'Skeletal System',detail:'Adult human has 206 bones. Axial (Skull, Ribs, Spine) and Appendicular (Limbs).'},
{title:'Key Bones',detail:'Femur: Thigh bone (Largest/Strongest). Stapes: Ear bone (Smallest). Tibia/Fibula: Leg. Humerus/Radius/Ulna: Arm.'},
{title:'Connective Tissues',detail:'Ligament: Connects Bone to Bone. Tendon: Connects Muscle to Bone.'}
],
cards:[
{front:'"Master Gland" of the body?',back:'Pituitary Gland.'},
{front:'"Fight or Flight" hormone?',back:'Adrenaline.'},
{front:'Largest bone in the human body?',back:'Femur.'},
{front:'Which element is needed for Thyroid health?',back:'Iodine.'},
{front:'Ligament connects ? to ?',back:'Bone to Bone.'}
],
q:[
{q:'Which gland is known as the "Master Gland"?',options:['Thyroid','Pituitary','Adrenal','Pancreas'],ai:1,exp:'Located at the base of the brain, it regulates all other endocrine glands.'},
{q:'"Insulin" is secreted by which organ?',options:['Liver','Pancreas','Spleen','Gall Bladder'],ai:1,exp:'Specifically by the Islets of Langerhans in the pancreas.'},
{q:'A "Tendon" connects:',options:['Bone to Bone','Muscle to Muscle','Muscle to Bone','Nerve to Bone'],ai:2,exp:'Tendons are fibrous tissues that allow muscles to pull bones.'},
{q:'The number of bones in a human adult is:',options:['200','206','300','306'],ai:1,exp:'Newborns have around 300, which fuse into 206.'}
],
hook:'Pituitary=Master. Adrenaline=Emergency. Insulin=Pancreas. Femur=Largest. Ligament=B to B. Tendon=M to B.',
summary:'Function of major endocrine glands and hormones. Structure of the human skeleton and important bone names. Connective tissues of the musculoskeletal system.'},

{day:38,topic:'SSC Science: Biology — Human Diseases',
intro:`Today we study the 'Invaders'. Human diseases can be caused by Bacteria, Viruses, Fungi, or Protozoa. In SSC, the 'Pathogen' (which virus?) and 'Affected Organ' (Lungs? Liver?) are high-yield. We also look at 'Vaccines' and 'Diagnostic Tests'. Do you know which test is for Typhoid? Or which organ is affected by Jaundice? Let's master the science of health today.`,
notes:[
{title:'Viral Diseases',detail:'AIDS (HIV), COVID-19, Polio, Rabies (Hydrophobia), Dengue, Measles, Smallpox (1st vaccine - Jenner).'},
{title:'Bacterial Diseases',detail:'Tuberculosis (TB - BCG vaccine), Cholera, Typhoid (Widal test), Tetanus, Plague, Leprosy.'},
{title:'Protozoan Diseases',detail:'Malaria (caused by Plasmodium, carried by Female Anopheles), Kala-azar, Sleeping Sickness.'},
{title:'Fungal & Other',detail:'Ringworm, Athlete\'s foot. Hemophilia (Royal disease - genetic). Night blindness (Vit A deficiency).'},
{title:'Diagnostic Tests',detail:'Widal (Typhoid). ELISA (AIDS). Biopsy (Cancer). EEG (Brain). ECG (Heart).'}
],
cards:[
{front:'Test for Typhoid?',back:'Widal Test.'},
{front:'BCG vaccine is for?',back:'Tuberculosis (TB).'},
{front:'"Hydrophobia" is a symptom of?',back:'Rabies.'},
{front:'Vector of Malaria?',back:'Female Anopheles mosquito.'},
{front:'"Royal Disease" name?',back:'Hemophilia.'}
],
q:[
{q:'"Widal Test" is used for the diagnosis of:',options:['AIDS','Malaria','Typhoid','Cholera'],ai:2,exp:'It tests for antibodies against Salmonella typhi.'},
{q:'Which of the following is a viral disease?',options:['Typhoid','Polio','Cholera','Tuberculosis'],ai:1,exp:'Polio is caused by the Poliovirus.'},
{q:'"Jaundice" is a disease of which organ?',options:['Heart','Kidney','Liver','Pancreas'],ai:2,exp:'Characterized by high levels of bilirubin in blood.'},
{q:'The first vaccine was developed by:',options:['Louis Pasteur','Edward Jenner','Alexander Fleming','Jonas Salk'],ai:1,exp:'He developed the Smallpox vaccine.'}
],
hook:'Widal=Typhoid. BCG=TB. ELISA=AIDS. Female Anopheles=Malaria. Jenner=1st Vaccine. Jaundice=Liver.',
summary:'Classification of diseases based on pathogens. Important vaccines and their discoverers. Common diagnostic tests and affected organs. Vector-borne diseases and their control.'},

{day:39,topic:'SSC Science: Biology — Vitamins & Nutrition',
intro:`Today we study 'Chemical Health'. Vitamins and Minerals are essential for the body's growth and repair. In SSC, 'Scientific Names' (e.g., Retinol) and 'Deficiency Diseases' (e.g., Scurvy) are extremely frequent. Do you know which vitamin is made by the sun? Or which mineral prevents Goitre? Let's master the nutrition table today.`,
notes:[
{title:'Fat Soluble Vitamins',detail:'A (Retinol - Night Blindness), D (Calciferol - Rickets), E (Tocopherol - Fertility), K (Phylloquinone - Blood Clotting). (Mnemonic: KEDA).'},
{title:'Water Soluble Vitamins',detail:'B-complex (B1 Thiamine - Beri Beri, B12 Cobalt - Anemia), C (Ascorbic Acid - Scurvy).'},
{title:'Important Minerals',detail:'Iron (Hemoglobin/Anemia), Calcium (Bones/Teeth), Iodine (Thyroid/Goitre), Fluorine (Dental decay if in excess).'},
{title:'Macronutrients',detail:'Carbohydrates (Energy), Proteins (Body building), Fats (Storage). 1g Fat = 9 kcal (Highest).'},
{title:'Quick Facts',detail:'Vitamin D is synthesized by skin in sunlight. Vitamin B12 contains Cobalt. Vitamin C is lost on boiling.'}
],
cards:[
{front:'Scientific name of Vitamin A?',back:'Retinol.'},
{front:'Vitamin for Blood Clotting?',back:'Vitamin K.'},
{front:'"Beri Beri" is caused by deficiency of?',back:'Vitamin B1 (Thiamine).'},
{front:'"Scurvy" is caused by deficiency of?',back:'Vitamin C.'},
{front:'Mineral containing Vitamin?',back:'B12 (contains Cobalt).'}
],
q:[
{q:'Which of the following is a "Water Soluble" vitamin?',options:['A','D','C','K'],ai:2,exp:'Vitamins B and C are water-soluble; K, E, D, A are fat-soluble.'},
{q:'"Rickets" is caused by the deficiency of:',options:['Vitamin A','Vitamin B','Vitamin C','Vitamin D'],ai:3,exp:'Leads to weak and soft bones in children.'},
{q:'Which vitamin is also known as "Ascorbic Acid"?',options:['A','B12','C','D'],ai:2,exp:'Found in citrus fruits like lemon and orange.'},
{q:'"Night Blindness" is caused by deficiency of:',options:['Vitamin A','Vitamin K','Vitamin B2','Vitamin E'],ai:0,exp:'Retinol is essential for vision in low light.'}
],
hook:'KEDA=Fat. B,C=Water. A=Retinol. C=Scurvy. D=Sun/Rickets. K=Clot. B12=Cobalt. Iron=Anemia.',
summary:'Detailed list of Vitamins, their scientific names, and deficiency diseases. Classification of vitamins into fat and water soluble. Important dietary minerals. Caloric value of nutrients.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'ssc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ SSC Biology Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Biology Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'SSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('SSC CGL Biology '+d.topic),why:'High-yield biological facts for SSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | Science',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'ssc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ SSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();
