require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:92,topic:'UPSC S&T: Space Technology — ISRO & Missiles',
intro:`Today we study the 'Final Frontier'. India has become a global space power with the success of Chandrayaan-3 and the upcoming Gaganyaan mission. We explore 'Launch Vehicles' (PSLV, GSLV), 'Satellite Orbits' (LEO, GEO), and India's 'Missile Program' (IGMDP). For UPSC, focus on 'Cryogenic engines', 'NavIC', and the difference between 'Ballistic and Cruise missiles'. Let's launch your knowledge today.`,
notes:[
{title:'Launch Vehicles',detail:'1. PSLV (Workhorse): 4 stages (Solid-Liquid-Solid-Liquid). 2. GSLV: 3 stages (Solid-Liquid-Cryogenic). 3. LVM3: India\'s heaviest rocket (used for Chandrayaan-3).'},
{title:'Satellite Orbits',detail:'1. LEO (Low Earth): Remote sensing (IRS). 2. GEO (Geostationary): Communication (INSAT), stays fixed at 36,000km. 3. SSO (Sun-Synchronous): Passing over poles.'},
{title:'NavIC (IRNSS)',detail:'India\'s independent navigation system. 7 satellites (3 Geostationary, 4 Geosynchronous). Provides precision positioning over India and 1,500km around.'},
{title:'Missile Program (IGMDP)',detail:'Founded by Dr. Kalam. 5 Missiles (PATNA): Prithvi, Agni, Trishul, Nag, Akash. Agni is a ballistic missile; BrahMos is a supersonic cruise missile.'},
{title:'Upcoming Missions',detail:'Gaganyaan (Human spaceflight), Shukrayaan (Venus), Aditya-L1 (Sun - already at L1 point).'}
],
cards:[
{front:'What is "NavIC"?',back:'India\'s indigenous GPS system (7 satellites).'},
{front:'PSLV vs GSLV?',back:'PSLV = 4 stages (Earth obs). GSLV = 3 stages with Cryogenic (Comm satellites).'},
{front:'Heaviest rocket of ISRO?',back:'LVM3 (formerly GSLV Mk III).'},
{front:'Difference between Ballistic and Cruise missile?',back:'Ballistic = Parabolic path (space). Cruise = Jet-engine, flies low (within atmosphere).'},
{front:'First satellite of India?',back:'Aryabhata (1975).'}
],
q:[
{q:'Which of the following launch vehicles is known as the "Workhorse of ISRO"?',options:['ASLV','PSLV','GSLV','SLV-3'],ai:1,exp:'PSLV has an incredible track record of success since the 1990s.'},
{q:'A satellite in "Geostationary Orbit" is placed at an altitude of approximately:',options:['400 km','2000 km','36,000 km','1,00,000 km'],ai:2,exp:'This altitude allows the satellite\'s orbital period to match the Earth\'s rotation.'},
{q:'The "BrahMos" missile was developed jointly by India and:',options:['USA','Israel','Russia','France'],ai:2,exp:'Named after Brahmaputra and Moskva rivers.'},
{q:'What is "Cryogenic Engine"?',options:['Engine using solid fuel','Engine using liquid oxygen and hydrogen at low temps','Engine using nuclear fuel','Jet engine'],ai:1,exp:'Essential for high-thrust stages in GSLV.'}
],
hook:'PSLV=4 stages. GSLV=Cryo. NavIC=7 sats. Agni=Ballistic. BrahMos=Cruise/Russia. L1=Sun point. LVM3=Heaviest.',
summary:'ISRO\'s launch vehicle evolution (PSLV/GSLV). Classification of satellite orbits. India\'s indigenous navigation (NavIC). Missile technology and IGMDP program.'},

{day:93,topic:'UPSC S&T: Biotechnology & Health',
intro:`Today we study the 'Code of Life'. Biotechnology is revolutionizing medicine and agriculture. We explore 'DNA Technology', 'CRISPR-Cas9' (Gene editing), and the different types of 'Vaccines' (mRNA, Viral Vector). For UPSC, focus on 'GM Crops' (BT Cotton/Mustard), 'Stem Cell therapy', and 'Three-parent babies'. This is a high-priority area for Prelims.`,
notes:[
{title:'DNA & RNA Basics',detail:'DNA (Double helix, permanent code). RNA (Single strand, temporary message). Recombinant DNA tech: Combining DNA from two sources.'},
{title:'Gene Editing (CRISPR-Cas9)',detail:'"Molecular Scissors". Allows precise cutting and pasting of DNA. Nobel prize winner. Potential to cure genetic diseases.'},
{title:'Vaccine Types',detail:'1. Inactivated (Covaxin). 2. Viral Vector (Covishield). 3. mRNA (Pfizer/Moderna). 4. DNA Vaccine (ZyCoV-D - India\'s 1st).'},
{title:'Genetically Modified (GM) Crops',detail:'Only BT Cotton is legally allowed for commercial use in India. BT Mustard (DMH-11) is under review. Issues: Biodiversity loss, corporate monopoly.'},
{title:'Stem Cells',detail:'Totipotent (can form anything), Pluripotent, Multipotent. Used in regenerative medicine. Cord blood banking is a major industry.'}
],
cards:[
{front:'What is "CRISPR-Cas9"?',back:'A gene-editing tool.'},
{front:'What are "Three-parent babies"?',back:'Mitochondrial replacement therapy (using 2 eggs + 1 sperm).'},
{front:'Only legal GM crop in India?',back:'BT Cotton.'},
{front:'What is a "DNA Vaccine"?',back:'Uses genetically engineered DNA to produce an immune response.'},
{front:'Stem cells from umbilical cord are?',back:'Multipotent.'}
],
q:[
{q:'The "CRISPR-Cas9" technology is used for:',options:['Space communication','Gene editing','Nuclear fusion','Quantum computing'],ai:1,exp:'It is a precise tool for editing the genome of organisms.'},
{q:'"ZyCoV-D", developed by Zydus Cadila, is the world\'s first:',options:['mRNA vaccine','DNA-plasmid vaccine','Protein subunit vaccine','Viral vector vaccine'],ai:1,exp:'A needle-free vaccine developed in India.'},
{q:'"Three-Parent Baby" technology is used to prevent:',options:['Cancers','Mitochondrial diseases','Heart diseases','HIV'],ai:1,exp:'It involves replacing faulty mitochondria from the mother with healthy ones from a donor.'},
{q:'Which of the following is a "BT" crop?',options:['Golden Rice','BT Cotton','Flavr Savr Tomato','All of the above'],ai:1,exp:'BT Cotton is the only one commercially released in India.'}
],
hook:'CRISPR=Scissors. BT Cotton=Legal. 3-Parent=Mito. DNA Vaccine=ZyCoV-D. mRNA=Pfizer. Stem cells=Healing.',
summary:'Basics of genetic engineering. Mechanism of CRISPR-Cas9. Classification of modern vaccines. Status of GM crops in India. Applications of stem cell therapy.'},

{day:94,topic:'UPSC S&T: IT, Robotics & AI',
intro:`Today we study the 'Digital Revolution'. From the 'Internet of Things' (IoT) to 'Generative AI' and 'Blockchain', technology is re-shaping our lives. We explore '5G/6G', 'Quantum Computing', and 'Web3'. For UPSC, focus on 'How AI works', 'Cybersecurity threats', and 'Edge Computing'. This is the most dynamic part of the S&T syllabus.`,
notes:[
{title:'Artificial Intelligence (AI)',detail:'Machine learning, Neural networks. Generative AI (LLMs like ChatGPT). Ethical issues: Deepfakes, algorithmic bias.'},
{title:'Blockchain & Web3',detail:'Decentralized ledger technology. Web 1.0 (Read), Web 2.0 (Read-Write/Social), Web 3.0 (Read-Write-Own/Blockchain).'},
{title:'Quantum Computing',detail:'Uses Qubits (Superposition and Entanglement). Exponentially faster than classical computers for specific tasks. National Quantum Mission launched.'},
{title:'Communication (5G/6G)',detail:'High speed, Low latency, Massive connectivity. 6G aims for terahertz frequencies. Li-Fi: Light-based communication (faster than Wi-Fi).'},
{title:'Internet of Things (IoT)',detail:'Network of physical objects embedded with sensors and software (e.g., Smart homes). Edge Computing: Processing data closer to the source.'}
],
cards:[
{front:'What is a "Qubit"?',back:'A quantum bit (can be 0, 1, or both simultaneously).'},
{front:'What is "Li-Fi"?',back:'Communication via light (instead of radio waves).'},
{front:'What is "Web 3.0"?',back:'Decentralized internet based on blockchain.'},
{front:'What is "Edge Computing"?',back:'Data processing at the source/edge of the network (reduces latency).'},
{front:'What are "Deepfakes"?',back:'AI-generated realistic but fake videos/images.'}
],
q:[
{q:'"Quantum Computing" works on the principle of:',options:['Binary logic','Superposition and Entanglement','Transistors','Vacuum tubes'],ai:1,exp:'These quantum mechanical properties allow parallel processing.'},
{q:'What is the main advantage of "5G" over 4G?',options:['Higher range','Higher latency','Higher speed and lower latency','Cheaper devices'],ai:2,exp:'Enables applications like autonomous vehicles and remote surgery.'},
{q:'"Blockchain" is a technology mainly used for:',options:['Secure databases','Encryption','Image processing','Antivirus'],ai:0,exp:'It is a decentralized, immutable ledger system.'},
{q:'"ChatGPT" is based on which technology?',options:['Blockchain','Generative AI (Large Language Models)','Quantum Computing','IoT'],ai:1,exp:'It uses deep learning to generate human-like text.'}
],
hook:'Qubit=Quantum. Li-Fi=Light. Web3=Blockchain. Edge=Local processing. 5G=Low latency. Deepfakes=AI risk.',
summary:'Evolution of AI and Generative models. Principles of Quantum Computing. Transition from Web2 to Web3. Features of 5G/6G and IoT. Cybersecurity and data privacy issues.'},

{day:95,topic:'UPSC S&T: Nano & New Materials',
intro:`Today we study the 'Small and the Strong'. Nanotechnology works at the atomic scale (1-100nm), where materials change their physical and chemical properties. We explore 'Graphene', 'Carbon Nanotubes' (CNTs), and 'Room-temperature Superconductors'. For UPSC, focus on 'Applications in medicine' (Targeted drug delivery) and 'Nano-fertilizers'. This is the future of material science.`,
notes:[
{title:'Nanotechnology Basics',detail:'Scale: 1 to 100 nanometers. High surface-area-to-volume ratio. Quantum effects become prominent. National Nano Mission (2007).'},
{title:'Graphene',detail:'A single layer of carbon atoms in a hexagonal lattice. Strongest material, highly conductive, flexible. "Wonder material".'},
{title:'Carbon Nanotubes (CNTs)',detail:'Cylindrical nanostructures. High tensile strength and thermal conductivity. Used in structural reinforcement and electronics.'},
{title:'Applications',detail:'1. Medicine: Targeted drug delivery (Magic bullets). 2. Environment: Water purification (Nanofilters). 3. Agri: Nano-urea (liquid urea). 4. Defense: Stealth technology.'},
{title:'Superconductors',detail:'Materials with zero electrical resistance. Usually at very low temps. Search for Room Temperature Superconductors is the holy grail.'}
],
cards:[
{front:'Size range of Nanoparticles?',back:'1 to 100 nanometers.'},
{front:'What is "Graphene"?',back:'A 2D sheet of carbon atoms.'},
{front:'What is "Nano-Urea"?',back:'Liquid urea with higher efficiency and lower pollution.'},
{front:'"Targeted Drug Delivery" uses?',back:'Nanoparticles to deliver medicine only to diseased cells.'},
{front:'Strongest material known?',back:'Graphene.'}
],
q:[
{q:'"Nanotechnology" primarily utilizes properties that appear at the:',options:['Macro scale','Micro scale','Atomic/Molecular scale','Cosmic scale'],ai:2,exp:'Physical and chemical behaviors change drastically at the nanoscale.'},
{q:'Which of the following is called the "Wonder Material" of the 21st century?',options:['Silicon','Graphene','Plastic','Aluminum'],ai:1,exp:'Graphene is exceptionally strong, conductive, and thin.'},
{q:'"Nano-Urea", developed by IFFCO, aims to:',options:['Replace soil','Reduce urea consumption and water pollution','Make plants glow','Increase pests'],ai:1,exp:'It is more efficient than granular urea and reduces environmental runoff.'},
{q:'In medicine, nanoparticles are used as "Magic Bullets" to:',options:['Kill viruses','Target specific cancer cells without harming healthy ones','Produce vaccines','Clean blood'],ai:1,exp:'This is the core of targeted therapy.'}
],
hook:'Nano=1-100nm. Graphene=Carbon sheet. Targeted drug delivery=Nano. CNT=Strong tubes. Nano-urea=Liquid.',
summary:'Properties of materials at the Nanoscale. Characteristics and uses of Graphene and CNTs. Applications of Nanotechnology in Health, Agri, and Environment. Basics of Superconductivity.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'upsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ UPSC S&T Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'S&T Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'UPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('UPSC Science and Technology '+d.topic),why:'Mastering modern technological applications.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | High Yield',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ UPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();
