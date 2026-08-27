require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:29,topic:'SSC Science: Physics — Motion & Newton\'s Laws',
intro:`Today we master the 'Laws of the Universe'. Physics in SSC is highly practical. You don't need to derive equations; you need to know why you fall forward when a bus stops or why a cricketer pulls his hands back while catching. We study Units, Speed, Velocity, and the 3 Laws of Motion. Toppers focus on 'Daily Life Examples' because that's where the questions come from. Let's master the physics of motion today.`,
notes:[
{title:'SI Units (Memorize These)',detail:'Length: Meter. Mass: Kilogram. Time: Second. Electric Current: Ampere. Temperature: Kelvin. Luminous Intensity: Candela. Amount of Substance: Mole. Pressure: Pascal. Power: Watt.'},
{title:'Newton\'s First Law (Law of Inertia)',detail:'An object stays at rest or moves at constant speed unless acted on by a force. Example: Passengers leaning forward when a bus stops (Inertia of Motion) or leaning back when it starts (Inertia of Rest).'},
{title:'Newton\'s Second Law',detail:'Force = Mass × Acceleration (F = ma). Example: A cricketer pulls his hands back to increase the time of impact, thereby reducing the force.'},
{title:'Newton\'s Third Law',detail:'To every action, there is an equal and opposite reaction. Example: Recoil of a gun, Jet engine propulsion, Swimming.'},
{title:'Friction',detail:'Force that opposes motion. Static > Sliding > Rolling. Lubricants and ball bearings are used to reduce friction.'}
],
cards:[
{front:'SI unit of Pressure?',back:'Pascal.'},
{front:'SI unit of Current?',back:'Ampere.'},
{front:'Which law is called the "Law of Inertia"?',back:'Newton\'s First Law.'},
{front:'Formula for Force?',back:'Force = Mass × Acceleration.'},
{front:'Why does a swimmer push water back?',back:'Newton\'s Third Law (Reaction pushes him forward).'}
],
q:[
{q:'A passenger in a moving bus is thrown forward when the bus stops suddenly. This is due to:',options:['Inertia of rest','Inertia of motion','Centrifugal force','Gravity'],ai:1,exp:'His lower body stops with the bus, but the upper body continues to move due to inertia of motion.'},
{q:'What is the SI unit of Luminous Intensity?',options:['Lumen','Candela','Lux','Watt'],ai:1,exp:'Candela is the standard unit for light intensity.'},
{q:'A cricketer pulls his hands back while catching a ball to reduce:',options:['Force','Momentum','Impulse','Acceleration'],ai:0,exp:'Increasing the time of impact reduces the force exerted on the hands (F = Δp/t).'},
{q:'The force that opposes the motion of an object is:',options:['Gravity','Inertia','Friction','Acceleration'],ai:2,exp:'Friction always acts in the direction opposite to motion.'}
],
hook:'1st Law=Inertia. 2nd Law=F=ma. 3rd Law=Action/Reaction. Pressure=Pascal. Current=Ampere. Friction: Static > Rolling.',
summary:'Fundamental SI units. Newton\'s three laws of motion with real-life applications. Concept of Inertia and Friction. Relationship between force and momentum.'},

{day:30,topic:'SSC Science: Physics — Work, Energy & Optics',
intro:`Today we study 'Power and Light'. In SSC, 'Energy Transformation' (e.g., Microphone converts Sound to Electric) and 'Optics' (Mirrors/Lenses) are high-yield areas. Do you know why the sky is blue? Or why a diamond sparkles? Toppers focus on 'Refraction' and 'Total Internal Reflection'. Let's master the energy and light that surrounds us.`,
notes:[
{title:'Work & Power',detail:'Work = Force × Displacement. SI Unit: Joule. Power = Work / Time. SI Unit: Watt. (1 Horsepower = 746 Watts).'},
{title:'Energy Transformations',detail:'Law of Conservation: Energy cannot be created or destroyed. 1. Dynamo: Mechanical -> Electric. 2. Electric Motor: Electric -> Mechanical. 3. Microphone: Sound -> Electric. 4. Loudspeaker: Electric -> Sound.'},
{title:'Optics: Reflection & Mirrors',detail:'Concave Mirror: Used in Shaving mirrors, Headlights, Solar furnaces (produces real/enlarged image). Convex Mirror: Used in Rear-view mirrors of vehicles (provides a wide field of view).'},
{title:'Refraction & Scattering',detail:'Twinkling of stars: Atmospheric Refraction. Mirage: Total Internal Reflection (TIR). Blue color of sky: Scattering of light. Sparkle of Diamond: TIR. Rainbow: Dispersion, Refraction, and TIR.'},
{title:'Human Eye & Defects',detail:'Myopia (Short-sightedness): Corrected by Concave lens. Hypermetropia (Long-sightedness): Corrected by Convex lens. Astigmatism: Cylindrical lens.'}
],
cards:[
{front:'1 Horsepower = ? Watts',back:'746 Watts.'},
{front:'Mirror used as rear-view in cars?',back:'Convex Mirror.'},
{front:'Lens used to correct Myopia?',back:'Concave Lens.'},
{front:'Why does a diamond sparkle?',back:'Total Internal Reflection (TIR).'},
{front:'Scattering of light causes?',back:'Blue color of sky.'}
],
q:[
{q:'A dynamo is a device which converts:',options:['Electric to Mechanical','Mechanical to Electric','Heat to Electric','Light to Electric'],ai:1,exp:'Generators (dynamos) produce electricity from mechanical motion.'},
{q:'Which defect of vision is corrected by a concave lens?',options:['Myopia','Hypermetropia','Presbyopia','Cataract'],ai:0,exp:'Myopia (can\'t see far) needs a diverging (concave) lens.'},
{q:'The twinkling of stars is due to:',options:['Total Internal Reflection','Atmospheric Refraction','Scattering of light','Interference'],ai:1,exp:'Light from stars passes through different layers of atmosphere with varying densities.'},
{q:'1 kilowatt-hour (kWh) is a unit of:',options:['Power','Energy','Force','Momentum'],ai:1,exp:'It is the commercial unit of electrical energy.'}
],
hook:'HP=746W. Dynamo=Mech->Elec. Convex=Rear-view. Concave=Shaving. TIR=Diamond/Mirage. Myopia=Concave lens.',
summary:'Definitions and units of Work, Power, and Energy. Common energy transformation devices. Basics of Reflection, Refraction, and TIR. Human eye defects and their corrections.'},

{day:31,topic:'SSC Science: Chemistry — Matter & Atomic Structure',
intro:`Today we study the 'Building Blocks of Everything'. Chemistry in SSC is about 'Substances' and 'Symbols'. From the states of matter to the structure of the atom (Protons, Neutrons, Electrons) and the 'Isotopes' used in medicine—everything is factual. We also look at 'Chemical Changes' vs 'Physical Changes'. Toppers know that 'Rusting of Iron' is a chemical change while 'Melting of Wax' is physical. Let's master the atoms today.`,
notes:[
{title:'States of Matter',detail:'Solid, Liquid, Gas. 4th State: Plasma (found in stars). 5th State: Bose-Einstein Condensate (BEC). Sublimation: Solid directly to Gas (e.g., Camphor, Naphthalene).'},
{title:'Physical vs Chemical Change',detail:'Physical: Reversible, no new substance (Melting, Freezing, Dissolving). Chemical: Irreversible, new substance formed (Burning, Rusting, Digestion, Curdling of milk).'},
{title:'Atomic Structure',detail:'Atom = Protons (+) and Neutrons (0) in Nucleus; Electrons (-) revolve around. Discoverers: Electron (J.J. Thomson), Proton (Rutherford/Goldstein), Neutron (Chadwick).'},
{title:'Isotopes & Isobars',detail:'Isotopes: Same Atomic Number, Different Mass Number. Uses: Carbon-14 (Dating), Iodine-131 (Goitre), Uranium-235 (Nuclear fuel). Isobars: Different Atomic Number, Same Mass Number.'},
{title:'Acid, Base & pH',detail:'Acid: Sour, turns Blue litmus RED. Base: Bitter, turns Red litmus BLUE. pH Scale (0-14): 7 is Neutral. <7 Acidic. >7 Basic. Human blood pH ~7.4.'}
],
cards:[
{front:'Discoverer of Neutron?',back:'James Chadwick.'},
{front:'pH of human blood?',back:'7.4 (Slightly basic).'},
{front:'Example of Sublimation?',back:'Camphor / Naphthalene.'},
{front:'Is "Rusting" a physical or chemical change?',back:'Chemical Change.'},
{front:'Used in cancer treatment (Isotope)?',back:'Cobalt-60.'}
],
q:[
{q:'The process of a solid directly turning into gas is called:',options:['Evaporation','Condensation','Sublimation','Fusion'],ai:2,exp:'Sublimation occurs in substances like Camphor and Dry Ice.'},
{q:'The atomic nucleus was discovered by:',options:['J.J. Thomson','Rutherford','Dalton','Chadwick'],ai:1,exp:'Rutherford\'s Alpha-scattering experiment discovered the nucleus.'},
{q:'Which of the following is a chemical change?',options:['Melting of ice','Boiling of water','Souring of milk','Breaking of glass'],ai:2,exp:'Souring of milk involves the formation of lactic acid, which is irreversible.'},
{q:'What is the pH value of a neutral solution?',options:['0','7','14','1'],ai:1,exp:'A pH of 7 indicates neutrality (like pure water).'}
],
hook:'Proton=Rutherford. Electron=Thomson. Neutron=Chadwick. Sublimation=Camphor. Rusting=Chemical. Blood pH=7.4. Cobalt-60=Cancer.',
summary:'Five states of matter and their transitions. Comparison of Physical and Chemical changes. Subatomic particles and their discoverers. Significance of Isotopes. Basics of pH scale.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'ssc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ SSC Science Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Science Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'SSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('SSC CGL '+d.topic+' notes'),why:'Application based science for SSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | Science',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'ssc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ SSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('SSC Days 29-31 v2 COMPLETE');
}
push();
