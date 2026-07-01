require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:85,topic:'UPSC Environment: Ecology & Ecosystems',
intro:`Today we study the 'Web of Life'. Ecology is the study of how organisms interact with their environment. We explore the components of an ecosystem, the flow of energy through 'Trophic Levels', and the various 'Biotic Interactions' (Mutualism, Parasitism). For UPSC, focus on 'Ecological Niche', 'Ecological Succession', and the '10% Law of Energy Transfer'. This is the foundation of environmental science.`,
notes:[
{title:'Basic Concepts',detail:'Ecology (Haeckel). Ecosystem (Tansley). Ecocline: Gradual transition between two ecosystems. Ecotone: Sharp transition zone (e.g., Mangroves).'},
{title:'Ecological Niche',detail:'The unique functional role of a species in its ecosystem (where it lives and what it does). No two species can have the same niche (Competitive Exclusion Principle).'},
{title:'Energy Flow',detail:'Unidirectional flow. 10% Law (Lindeman): Only 10% of energy is transferred to the next trophic level. Energy decreases as we go up.'},
{title:'Biotic Interactions',detail:'1. Mutualism (+/+): Both benefit (Lichen). 2. Commensalism (+/0): One benefits, other unaffected (Barnacles on whale). 3. Parasitism (+/-): One benefits at others cost. 4. Amensalism (-/0): One harmed, other unaffected.'},
{title:'Ecological Succession',detail:'Primary: On bare rock (Lichen as pioneer). Secondary: On already existing soil (after fire/flood). Seral stages lead to a Climax Community.'}
],
cards:[
{front:'What is an "Ecotone"?',back:'Transition zone between two ecosystems (e.g., Mangroves).'},
{front:'What is the "10% Law"?',back:'Only 10% of energy is passed to the next trophic level.'},
{front:'Lichen is an example of?',back:'Mutualism (Algae + Fungi).'},
{front:'What is an "Ecological Niche"?',back:'The unique functional role of a species.'},
{front:'Who coined the term "Ecology"?',back:'Ernst Haeckel.'}
],
q:[
{q:'"Mangroves" are a classic example of:',options:['Ecotone','Ecocline','Climax community','Biotic interaction'],ai:0,exp:'They are a transition zone between terrestrial and marine ecosystems.'},
{q:'In an energy pyramid, which level has the most energy?',options:['Producers','Primary Consumers','Secondary Consumers','Apex Predators'],ai:0,exp:'Producers capture the maximum solar energy; it decreases at each higher level.'},
{q:'"Allelopathy" in plants is an example of which interaction?',options:['Mutualism','Commensalism','Amensalism','Parasitism'],ai:2,exp:'When a plant releases chemicals to inhibit growth of others (-/0).'},
{q:'The first species to colonize a bare rock in primary succession is called:',options:['Climax species','Pioneer species','Seral species','Invasive species'],ai:1,exp:'Lichen is the most common pioneer species for rocks.'}
],
hook:'Ecotone=Edge effect. 10% Law=Energy loss. Mutualism=Lichen. Niche=Role. Pioneer=Lichen. Tansley=Ecosystem.',
summary:'Fundamental concepts of Ecology. Energy flow and Trophic levels. Detailed study of Biotic interactions. Process of Ecological Succession and niche theory.'},

{day:86,topic:'UPSC Environment: Biodiversity & Conservation',
intro:`Today we study the 'Library of Nature'. Biodiversity is the variety of life on Earth. We explore the 'Levels of Biodiversity' (Alpha, Beta, Gamma) and the 'In-situ' vs 'Ex-situ' methods of conservation. For UPSC, focus on 'Biodiversity Hotspots' in India, 'Red List categories' of IUCN, and the location of major National Parks. Let's master the protection of our natural heritage today.`,
notes:[
{title:'Levels of Biodiversity',detail:'Alpha (within site), Beta (between sites), Gamma (total/landscape). Genetic, Species, and Ecosystem diversity.'},
{title:'In-situ Conservation',detail:'Protecting species in their natural habitat. 1. National Parks: High protection, no human activity. 2. Wildlife Sanctuaries: Limited activity allowed. 3. Biosphere Reserves: Core (no activity), Buffer, Transition.'},
{title:'Ex-situ Conservation',detail:'Protecting species outside their natural habitat. 1. Botanical Gardens. 2. Zoos. 3. Gene Banks/Seed Banks. 4. Cryopreservation.'},
{title:'Biodiversity Hotspots',detail:'Must have 1,500 endemic vascular plants and lost 70% of original habitat. India has 4: Himalayas, Western Ghats, Indo-Burma, Sundaland.'},
{title:'IUCN Red List',detail:'Categories: Extinct, Critically Endangered (CR), Endangered (EN), Vulnerable (VU). India examples: Great Indian Bustard (CR), Tiger (EN).'}
],
cards:[
{front:'How many Biodiversity Hotspots in India?',back:'4 (Himalayas, WG, Indo-Burma, Sundaland).'},
{front:'Example of In-situ conservation?',back:'National Parks / Biosphere Reserves.'},
{front:'Example of Ex-situ conservation?',back:'Zoos / Seed Banks.'},
{front:'What is "Alpha Diversity"?',back:'Diversity within a specific ecosystem/site.'},
{front:'Criteria for a Hotspot?',back:'1,500 endemic plants + 70% habitat loss.'}
],
q:[
{q:'Which of the following is an "In-situ" method of conservation?',options:['Botanical Garden','National Park','Wildlife Safari Park','Seed Bank'],ai:1,exp:'National parks protect species within their natural environment.'},
{q:'The "Indo-Burma" hotspot includes which part of India?',options:['Western Ghats','North-East India','Andaman Islands','Lakshadweep'],ai:1,exp:'It covers parts of NE India and neighboring countries.'},
{q:'According to IUCN, the "Tiger" is classified as:',options:['Critically Endangered','Endangered','Vulnerable','Extinct'],ai:1,exp:'It is in the Endangered category due to habitat loss and poaching.'},
{q:'"Agasthyamalai" is which type of protected area?',options:['National Park','Biosphere Reserve','Gene Bank','Community Reserve'],ai:1,exp:'It is a prominent Biosphere Reserve in the Western Ghats.'}
],
hook:'Hotspots=4 in India. In-situ=Home. Ex-situ=Away. CR=GIB. EN=Tiger. Alpha=Site. First NP=Jim Corbett.',
summary:'Levels and importance of biodiversity. Comparison of In-situ and Ex-situ conservation. Criteria and locations of Biodiversity Hotspots. IUCN Red List classification system.'},

{day:87,topic:'UPSC Environment: Climate Change — Treaties & Protocols',
intro:`Today we study the 'Global Rescue Plan'. Climate Change is the greatest challenge of our time. We explore the history of international cooperation from the 1992 Earth Summit to the Paris Agreement. For UPSC, focus on 'UNFCCC', 'Kyoto Protocol' (Carbon Credits), and the 'Nationally Determined Contributions' (NDCs). This is the most frequently tested section in the Environment syllabus.`,
notes:[
{title:'UNFCCC (1992)',detail:'Earth Summit, Rio. Aim: Stabilize Greenhouse Gas (GHG) concentrations. Signed at Rio de Janeiro. COP (Conference of Parties) is the decision-making body.'},
{title:'Kyoto Protocol (1997)',detail:'Mandatory emission cuts for developed countries (Annex-I). Mechanisms: Clean Development Mechanism (CDM), Joint Implementation, Carbon Trading.'},
{title:'Paris Agreement (2015)',detail:'Limit global warming to well below 2°C (target 1.5°C). NDCs (Nationally Determined Contributions): Voluntary targets set by each country.'},
{title:'India\'s NDCs (Updated)',detail:'1. Reduce emission intensity of GDP by 45%. 2. 50% non-fossil energy by 2030. 3. Create 2.5-3 billion tons of carbon sink through forests.'},
{title:'Montreal Protocol (1987)',detail:'Most successful treaty. Aim: Protect Ozone layer by phasing out ODS (CFCs, HCFCs). Kigali Amendment: To phase out HFCs (GHGs).'}
],
cards:[
{front:'What is "COP"?',back:'Conference of Parties (Decision body of UNFCCC).'},
{front:'Montreal Protocol relates to?',back:'Ozone Layer (ODS phase out).'},
{front:'What are "NDCs"?',back:'Nationally Determined Contributions (Paris Agreement).'},
{front:'Target of Paris Agreement?',back:'Limit warming to 1.5°C / 2°C.'},
{front:'Kyoto Protocol target gas group?',back:'Greenhouse Gases (6 main ones).'}
],
q:[
{q:'Which of the following is the most successful environmental treaty?',options:['Kyoto Protocol','Paris Agreement','Montreal Protocol','Nagoya Protocol'],ai:2,exp:'Montreal has achieved almost 100% phase-out of Ozone Depleting Substances.'},
{q:'The "Kigali Amendment" is related to:',options:['Biodiversity','Ozone Layer (HFCs)','Persistent Organic Pollutants','Mercury'],ai:1,exp:'It amends Montreal to phase out Hydrofluorocarbons (HFCs).'},
{q:'India aims to achieve "Net Zero" emissions by which year?',options:['2030','2045','2050','2070'],ai:3,exp:'Announced by PM Modi at COP26 Glasgow.'},
{q:'The "Green Climate Fund" (GCF) was established under:',options:['UNFCCC','World Bank','IMF','UNEP'],ai:0,exp:'To help developing nations adapt to climate change.'}
],
hook:'1992=Rio. 1987=Montreal (Ozone). 1997=Kyoto (GHG). 2015=Paris (NDCs). 2070=India Net Zero. Kigali=HFCs.',
summary:'Timeline of international climate cooperation. Mechanisms of Kyoto Protocol. Features and targets of the Paris Agreement. India\'s climate commitments and leadership (Net Zero target).'},

{day:88,topic:'UPSC Environment: Pollution & Waste Management',
intro:`Today we study the 'Side-effects of Progress'. Pollution is the unintended consequence of industrialization and urbanization. We explore Air, Water, and Soil pollution, along with the rising challenge of 'E-waste' and 'Plastic pollution'. For UPSC, focus on 'Eutrophication', 'Biomagnification', and the 'Waste Management Rules' of India. Let's master the science of cleaning our planet today.`,
notes:[
{title:'Air Pollution & AQI',detail:'Pollutants: PM2.5, PM10, SO2, NO2, O3, CO, Pb, NH3 (8 in AQI). Smog: Smoke + Fog. Acid Rain: SO2 + NOx.'},
{title:'Water Pollution',detail:'Eutrophication: Excessive nutrients lead to algal bloom and hypoxia (lack of O2). BOD (Biochemical Oxygen Demand): Measure of organic pollution. High BOD = Highly polluted.'},
{title:'Bio-accumulation & Bio-magnification',detail:'Accumulation: Within one organism. Magnification: Increase in concentration up the food chain (e.g., Mercury, DDT).'},
{title:'Waste Management Rules (2016)',detail:'Plastic Waste: Phase out single-use plastics. E-waste: EPR (Extended Producer Responsibility). Bio-medical waste: Color-coded disposal.'},
{title:'Fly Ash',detail:'By-product of coal power plants. Contains heavy metals. Used in brick making and cement.'}
],
cards:[
{front:'What is "Eutrophication"?',back:'Nutrient enrichment leading to algal blooms and fish death.'},
{front:'Higher the BOD, ____ the pollution?',back:'Higher.'},
{front:'What is "Biomagnification"?',back:'Increase in toxin concentration at higher trophic levels.'},
{front:'How many pollutants in India\'s AQI?',back:'8.'},
{front:'"Extended Producer Responsibility" (EPR) relates to?',back:'E-waste and Plastic waste management.'}
],
q:[
{q:'Which of the following is NOT included in India\'s National AQI?',options:['PM2.5','Carbon Dioxide (CO2)','Ozone (O3)','Ammonia (NH3)'],ai:1,exp:'CO2 is a GHG, not a criteria pollutant for local air quality index.'},
{q:'"Minamata Disease" is caused by which pollutant?',options:['Lead','Cadmium','Mercury','Nitrate'],ai:2,exp:'Associated with industrial discharge of methylmercury into water.'},
{q:'A lake with high nutrient content and low oxygen is called:',options:['Oligotrophic','Mesotrophic','Eutrophic','Dystrophic'],ai:2,exp:'Eutrophic lakes are highly productive but often oxygen-depleted.'},
{q:'"Fly Ash" is a by-product of:',options:['Nuclear plants','Thermal power plants','Iron and Steel industry','Textile industry'],ai:1,exp:'Produced during the combustion of pulverized coal.'}
],
hook:'BOD high=Polluted. Eutrophication=Algae. Magnification=DDT/Mercury. 8 Pollutants=AQI. EPR=Producer duty. Fly Ash=Coal.',
summary:'Analysis of air and water pollution indicators. Mechanisms of ecological toxicity (Biomagnification). Summary of India\'s waste management laws. Emerging pollutants like E-waste and Micro-plastics.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'upsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ UPSC Environment Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Environment Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'UPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('UPSC Environment '+d.topic),why:'High-yield section for Prelims success.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | High Yield',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ UPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();
