require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:40,topic:'SSC Science: Biology — Botany & Plant Kingdom',
intro:`Today we study the 'Green World'. Botany in SSC is about 'Classification' and 'Physiology'. From Thallophyta to Angiosperms, and from Photosynthesis to Plant Hormones (Auxins, Gibberellins)—the facts are precise. Do you know which plant is called the 'Amphibian of the Plant Kingdom'? Or why fruits ripen? Let's master the kingdom of plants today.`,
notes:[
{title:'Plant Classification',detail:'1. Thallophyta: Algae (no differentiation). 2. Bryophyta: Amphibians (need water for fertilization, e.g., Moss). 3. Pteridophyta: 1st vascular plants (Ferns). 4. Gymnosperms: Naked seeds (Pine). 5. Angiosperms: Flowering plants.'},
{title:'Photosynthesis',detail:'Process of making food using Sunlight, CO2, and Water. Occurs in Chloroplast. O2 is released as a byproduct (comes from water splitting).'},
{title:'Plant Hormones',detail:'Auxin (Growth, bending towards light). Gibberellins (Stem elongation). Cytokinins (Cell division). Ethylene (Fruit ripening - only gaseous hormone). Abscisic Acid (Growth inhibitor/stomata closing).'},
{title:'Plant Nutrition',detail:'Xylem (Water/Minerals - unidirectional). Phloem (Food - bidirectional). Transpiration: Loss of water from leaves (creates suction pull).'},
{title:'Economic Botany',detail:'Cinchona (Quinine for Malaria). Saffron (Stigma of Crocus). Cloves (Flower bud).'}
],
cards:[
{front:'"Amphibians of the Plant Kingdom"?',back:'Bryophyta.'},
{front:'Gaseous plant hormone?',back:'Ethylene.'},
{front:'Quinine is obtained from?',back:'Bark of Cinchona tree.'},
{front:'Part of plant that becomes Fruit?',back:'Ovary.'},
{front:'Hormone responsible for fruit ripening?',back:'Ethylene.'}
],
q:[
{q:'Which of the following is known as the "Amphibian" of the plant kingdom?',options:['Thallophyta','Bryophyta','Gymnosperms','Angiosperms'],ai:1,exp:'They live on land but require water for sexual reproduction.'},
{q:'The gas released during photosynthesis is:',options:['Carbon dioxide','Oxygen','Nitrogen','Hydrogen'],ai:1,exp:'O2 is produced during the photolysis of water.'},
{q:'"Auxin" is a plant hormone that helps in:',options:['Fruit ripening','Growth and cell elongation','Seed dormancy','Water transport'],ai:1,exp:'It causes the plant to grow towards light (Phototropism).'},
{q:'Saffron is obtained from which part of the plant?',options:['Leaf','Seed','Stigma','Root'],ai:2,exp:'It is the dried stigma of the Crocus sativus flower.'}
],
hook:'Bryophyta=Amphibian. Ethylene=Ripening. Cinchona=Malaria. Xylem=Water. Ovary=Fruit. Ovule=Seed.',
summary:'Classification of the plant kingdom. Mechanism and requirements of Photosynthesis. Functions of major plant hormones. Plant transport systems and economic botany.'},

{day:41,topic:'SSC Science: Chemistry — Acids, Bases & Salts',
intro:`Today we study the 'Chemistry of Reactions'. Acids and Bases are part of our daily life—from the lemon in your tea to the soap you use. In SSC, 'Natural Sources' (e.g., Formic acid in Ants) and 'Common Names' (e.g., Washing Soda) are high-yield. Do you know the pH of milk? Or why antacids are used for acidity? Let's master the reactive world today.`,
notes:[
{title:'Acids',detail:'Sour, turn Blue litmus RED. pH < 7. Release H+ ions. Strong: HCl, H2SO4 (King of Chemicals). Weak: Acetic acid.'},
{title:'Bases',detail:'Bitter, soapy, turn Red litmus BLUE. pH > 7. Release OH- ions. Examples: NaOH (Caustic Soda), Mg(OH)2 (Milk of Magnesia - Antacid).'},
{title:'Natural Acids (Memorize!)',detail:'Vinegar (Acetic), Lemon (Citric), Tomato (Oxalic), Tamarind (Tartaric), Curd (Lactic), Ants (Formic/Methanoic).'},
{title:'Indicators',detail:'Litmus (Lichen), Turmeric, Phenolphthalein (Pink in Base, colorless in Acid), Methyl Orange.'},
{title:'Important Salts',detail:'Washing Soda (Na2CO3.10H2O), Baking Soda (NaHCO3), Bleaching Powder (CaOCl2), Plaster of Paris (CaSO4.1/2H2O).'}
],
cards:[
{front:'Acid in Vinegar?',back:'Acetic Acid.'},
{front:'Common name for NaHCO3?',back:'Baking Soda.'},
{front:'pH of pure water?',back:'7 (Neutral).'},
{front:'"King of Chemicals"?',back:'Sulfuric Acid (H2SO4).'},
{front:'Acid in Ant sting?',back:'Formic (Methanoic) Acid.'}
],
q:[
{q:'What is the chemical name of "Baking Soda"?',options:['Sodium Carbonate','Sodium Bicarbonate','Sodium Chloride','Sodium Hydroxide'],ai:1,exp:'NaHCO3 is used in baking and as an antacid.'},
{q:'Which acid is present in a "Tomato"?',options:['Citric Acid','Oxalic Acid','Lactic Acid','Acetic Acid'],ai:1,exp:'Tomato also contains Vitamin C but Oxalic is the primary acid.'},
{q:'"Milk of Magnesia" is used as:',options:['Dye','Antacid','Fertilizer','Explosive'],ai:1,exp:'It neutralizes excess stomach acid.'},
{q:'Plaster of Paris (POP) is chemically:',options:['Calcium Carbonate','Calcium Sulfate Hemihydrate','Calcium Chloride','Sodium Sulfate'],ai:1,exp:'Hardens into gypsum when mixed with water.'}
],
hook:'Vinegar=Acetic. Ant=Formic. Baking=Bicarbonate. Washing=Carbonate. POP=Sulfate. pH < 7=Acid.',
summary:'Properties of acids and bases. pH scale and its importance. List of natural acids and their sources. Chemical names and formulas of common household salts.'},

{day:42,topic:'SSC REVISION: Biology & Chemistry (Days 36–41)',
intro:`Today we consolidate the 'Advanced Science' block. You have mastered the human brain, the skeletal frame, the invaders (diseases), the plant kingdom, and the chemistry of daily life. In SSC, the 'Mix' of Biology and Chemistry is lethal if not revised. Today, we drill the chemical names and biological units. If you see 'Stapes', you say 'Ear'. If you see 'Baking Soda', you say 'NaHCO3'. Let's lock in the science marks today.`,
notes:[
{title:'Biology Recap',detail:'Cerebellum (Balance). Stapes (Smallest bone). Adrenaline (Emergency). Widal (Typhoid). Retinol (Vit A). Ethylene (Ripening).'},
{title:'Chemistry Recap',detail:'pH < 7 (Acid). H2SO4 (King). Baking Soda (NaHCO3). Washing Soda (Na2CO3). Formic Acid (Ants).'},
{title:'Pathogen & Test Recap',detail:'Typhoid=Widal. AIDS=ELISA. TB=BCG. Malaria=Female Anopheles.'},
{title:'Vitamins Recap',detail:'A (Night blind), B1 (Beri Beri), C (Scurvy), D (Rickets), K (Clotting).'},
{title:'Plant Recap',detail:'Bryophyta (Amphibian). Xylem (Water). Phloem (Food). Auxin (Growth).'}
],
cards:[
{front:'Common name of CaOCl2?',back:'Bleaching Powder.'},
{front:'Smallest bone?',back:'Stapes.'},
{front:'Universal Recipient?',back:'AB+.'},
{front:'Acid in curd?',back:'Lactic Acid.'},
{front:'Hormone for sugar regulation?',back:'Insulin.'}
],
q:[
{q:'"Scurvy" is related to which organ/part?',options:['Eyes','Skin','Gums','Bones'],ai:2,exp:'Bleeding gums is the main symptom of Vitamin C deficiency.'},
{q:'Which of the following is used in "Pencil Lead"?',options:['Lead','Graphite','Charcoal','Silicon'],ai:1,exp:'Graphite is a soft allotrope of carbon.'},
{q:'The "Master Gland" is:',options:['Thyroid','Pituitary','Adrenal','Ovary'],ai:1,exp:'Pituitary regulates most other glands.'},
{q:'What is the chemical formula of "Washing Soda"?',options:['NaHCO3','Na2CO3','NaOH','NaCl'],ai:1,exp:'Sodium Carbonate (usually with 10 water molecules).'}
],
hook:'Biology+Chemistry revision. Fact drill. Master the scientific names. Success is in the details.',
summary:'Full revision of advanced Biology and daily life Chemistry. High-speed drill of formulas, scientific names, and deficiency diseases. Final science core mock quiz.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'ssc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ SSC Science Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Science Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'SSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('SSC CGL '+d.topic),why:'Consolidating science facts for SSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | Science',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'ssc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ SSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();
