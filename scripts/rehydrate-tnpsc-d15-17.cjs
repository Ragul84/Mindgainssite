require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:15,topic:'TNPSC Geography: Physical Features of Tamil Nadu',
intro:`Today we start the 'Landscape of Tamil Nadu' (Unit 9 link). Tamil Nadu is the 10th largest state in India, known for its unique position between the Eastern and Western Ghats. We study its boundaries, the Palani Hills, the Javadi Hills, and the long coastline (the 2nd longest in India!). For TNPSC, knowing the highest peaks (Doddabetta) and the various mountain passes like Palakkad and Shencottah is vital. Let's map your home state today.`,
notes:[
{title:'Location & Boundaries',detail:'Latitude: 8°4\' N to 13°35\' N. Longitude: 76°18\' E to 80°20\' E. Boundaries: Kerala (W), Karnataka (NW), Andhra (N), Bay of Bengal (E), Indian Ocean (S). Coastal length: ~1076 km (2nd longest after Gujarat).'},
{title:'Western Ghats in TN',detail:'Starts from Nilgiris to Kanyakumari. Major Hills: Nilgiris, Anaimalai, Palani Hills, Cardamom Hills, Varushanadu, Pothigai Hills. Highest Peak: Doddabetta (2,637m) in Nilgiris. Anaimudi is in Kerala but near the border.'},
{title:'Eastern Ghats in TN',detail:'Discontinuous range. Major Hills: Javadi, Shevaroy (Salem), Kalrayan, Pachaimalai (Trichy), Kolli Hills (Namakkal). Highest peak: Shervaroyan Temple (1,623m).'},
{title:'Passes (Gaps)',detail:'Palakkad Gap (between Nilgiris and Anaimalai), Shencottah Gap, Aralvaimozhi Gap, Achankovil Gap. These gaps are crucial for trade and monsoon winds.'},
{title:'Coastal Plains',detail:'Known as the Coromandel Coast (Cholamandalam). Features: Marina Beach (2nd longest in world), Gulf of Mannar (Biosphere Reserve), Palk Strait.'}
],
cards:[
{front:'Highest peak in Tamil Nadu?',back:'Doddabetta (2,637m).'},
{front:'Coastal length of Tamil Nadu?',back:'~1076 km.'},
{front:'Gap between Nilgiris and Anaimalai?',back:'Palakkad Gap.'},
{front:'Where are Shevaroy Hills located?',back:'Salem district.'},
{front:'Where is the Gulf of Mannar located?',back:'Between Tamil Nadu and Sri Lanka (South-East).'}
],
q:[
{q:'தமிழ்நாட்டின் மிக உயர்ந்த சிகரம் எது?',options:['ஆனைமுடி','தொட்டபெட்டா','மகேந்திரகிரி','சேர்வராயன்'],ai:1,exp:'Doddabetta (2,637m) is the highest in TN. Anaimudi is the highest in South India (Kerala).'},
{q:'இந்தியாவின் இரண்டாவது நீண்ட கடற்கரை எது?',options:['குஜராத்','தமிழ்நாடு','ஆந்திரா','கேரளா'],ai:1,exp:'Tamil Nadu has the 2nd longest coastline (~1076 km).'},
{q:'நீலகிரி மற்றும் ஆனைமலைக்கு இடையே உள்ள கணவாய் எது?',options:['செங்கோட்டை','பாலக்காடு','ஆரல்வாய்மொழி','அச்சன்கோவில்'],ai:1,exp:'Palakkad Gap connects TN with Kerala between these ranges.'},
{q:'சேர்வராயன் மலை எங்கு அமைந்துள்ளது?',options:['நாமக்கல்','சேலம்','திருச்சி','திண்டுக்கல்'],ai:1,exp:'Shevaroy Hills are located in Salem district.'}
],
hook:'Doddabetta=Highest (2,637m). Coast=1076km. Shervaroy=Salem. Kolli=Namakkal. Gaps connect to Kerala. Coromandel coast.',
summary:'Physical location and boundaries of TN. Comparison of Western and Eastern Ghats in the state. Important peaks and passes. Features of the coastline.'},

{day:16,topic:'TNPSC Geography: Rivers & Water Resources of TN',
intro:`Today we master the 'Lifelines of Tamil Nadu'. Unlike the perennial rivers of the North, TN rivers are rain-fed and seasonal. The Cauvery is the 'Dakshina Ganga' and the most important river for the state's agriculture. We also study the Vaigai, the Thamirabarani (only perennial river in TN!), and the major dams like Mettur and Kallanai. For TNPSC, knowing the origin points and tributaries of these rivers is a frequent exam area. Let's trace the water flow today.`,
notes:[
{title:'River Cauvery (Kaveri)',detail:'Origin: Talakaveri (Kodagu, Karnataka). Enters TN at Hogenakkal falls. Major Tributaries: Bhavani, Amaravathi, Noyyal, Arkavathi. It divides into Coleroon and Cauvery at Srirangam. Delta is the "Granary of South India".'},
{title:'Palar & Ponnaiyar',detail:'Palar: Origin in Karnataka (Kolar), flows through Vellore/Kanchipuram. Ponnaiyar: Origin in Karnataka, flows through Dharmapuri/Cuddalore. Sathanur Dam is on Ponnaiyar.'},
{title:'Vaigai & Thamirabarani',detail:'Vaigai: Origin in Varushanadu hills, flows through Madurai. Thamirabarani: Origin in Pothigai hills. It is the ONLY perennial (year-round) river in TN due to both monsoons. Famous for "Copper" contents.'},
{title:'Other Rivers',detail:'Vellar, Thenpennai, Chittar, Gundar. Most TN rivers flow from West to East into the Bay of Bengal.'},
{title:'Major Dams & Projects',detail:'Mettur Dam (Cauvery) - Stanley Reservoir. Kallanai (Grand Anicut) - built by Karikala Chola. Lower Anaicut. Bhavani Sagar. Mullaiperiyar (on Periyar river, supplying water to TN).'}
],
cards:[
{front:'Which is the only perennial river in Tamil Nadu?',back:'Thamirabarani.'},
{front:'Where does River Cauvery originate?',back:'Talakaveri (Karnataka).'},
{front:'Hogenakkal falls is on which river?',back:'Cauvery.'},
{front:'Dam built on Ponnaiyar river?',back:'Sathanur Dam.'},
{front:'Which river flows through Madurai?',back:'Vaigai.'}
],
q:[
{q:'தமிழ்நாட்டின் வற்றாத ஜீவநதி எது?',options:['காவிரி','வைகை','தாமிரபரணி','பாலார்'],ai:2,exp:'Thamirabarani is the only perennial river in TN.'},
{q:'காவிரி ஆறு தமிழ்நாட்டிற்குள் நுழையும் இடம் எது?',options:['மேட்டூர்','ஒகேனக்கல்','திருச்சி','ஈரோடு'],ai:1,exp:'Hogenakkal falls is the entry point for Cauvery into TN.'},
{q:'மேட்டூர் அணை எந்த ஆற்றின் குறுக்கே கட்டப்பட்டுள்ளது?',options:['பாலாறு','காவிரி','பெண்ணையாறு','வைகை'],ai:1,exp:'Mettur Dam (Stanley Reservoir) is built on the Cauvery.'},
{q:'வைகை ஆறு எங்கு உற்பத்தி ஆகிறது?',options:['அகத்தியர் மலை','வருசநாடு மலை','நீலகிரி','கொல்லிமலை'],ai:1,exp:'Vaigai originates in the Varushanadu hills.'}
],
hook:'Thamirabarani=Perennial. Cauvery=Hogenakkal entry. Mettur=Cauvery. Vaigai=Madurai. Kallanai=World\'s oldest dam.',
summary:'Major rivers of TN (Cauvery, Palar, Vaigai, Thamirabarani). Origin and tributaries. Important dams and irrigation projects. Significance of the Cauvery delta.'},

{day:17,topic:'TNPSC Geography: Climate & Soil of Tamil Nadu',
intro:`Today we study why TN is different from the rest of India when it comes to rain. While most of India gets rain from the South-West Monsoon, Tamil Nadu gets the majority of its rainfall from the 'North-East Monsoon' (Retreating Monsoon) from October to December. We also explore the 5 main soil types of the state—from the fertile Alluvial soil of the deltas to the vast Red soil tracts. For TNPSC, knowing the 'Soil-Crop' relationship is key for the agriculture section.`,
notes:[
{title:'Climate of Tamil Nadu',detail:'Tropical climate. Summer (March-May), SW Monsoon (June-Sep), NE Monsoon (Oct-Dec), Winter (Jan-Feb). TN is a "Rain Shadow" region for the SW Monsoon (blocked by Western Ghats).'},
{title:'North-East Monsoon (The Life Giver)',detail:'Provides 48% of TN\'s rainfall. Coastal districts get heavy rain. Cyclones are frequent in the Bay of Bengal during this period.'},
{title:'Red Soil (செம்மண்)',detail:'Covers 2/3rd of Tamil Nadu (most common). Rich in iron oxides (hence red). Suitable for millets and pulses.'},
{title:'Black Soil (கரிசல் மண்)',detail:'Found in Coimbatore, Madurai, Tirunelveli. Also called "Regur Soil". High water retention. Best for Cotton cultivation.'},
{title:'Alluvial & Other Soils',detail:'Alluvial: Found in river deltas (Cauvery). Best for Paddy/Sugarcane. Laterite: Found in hills (Nilgiris/Kanchipuram). Saline: Found in coastal areas (Vedanyanyam).'}
],
cards:[
{front:'Which monsoon gives most rain to Tamil Nadu?',back:'North-East Monsoon (Oct-Dec).'},
{front:'Most common soil type in Tamil Nadu?',back:'Red Soil (covers 2/3rd of the state).'},
{front:'Best soil for Cotton?',back:'Black Soil (Regur).'},
{front:'Why does TN get less rain from SW Monsoon?',back:'Because it lies in the "Rain Shadow" region of the Western Ghats.'},
{front:'Where is Alluvial soil found in TN?',back:'Cauvery Delta and river basins.'}
],
q:[
{q:'தமிழ்நாட்டிற்கு அதிக மழையைத் தரும் பருவகாலம் எது?',options:['தென்மேற்கு பருவக்காற்று','வடகிழக்கு பருவக்காற்று','கோடைக்காலம்','முன்பனிக்காலம்'],ai:1,exp:'NE Monsoon (Oct-Dec) is the primary rainfall source for TN.'},
{q:'தமிழகத்தில் அதிக பரப்பளவில் காணப்படும் மண் எது?',options:['கரிசல் மண்','செம்மண்','வண்டல் மண்','சரளை மண்'],ai:1,exp:'Red soil covers nearly 2/3rd of the state.'},
{q:'"கரிசல் மண்" எதனைப் பயிரிட மிகவும் ஏற்றது?',options:['நெல்','கரும்பு','பருத்தி','தேயிலை'],ai:2,exp:'Black soil (Regur) is excellent for cotton.'},
{q:'தமிழ்நாடு தென்மேற்கு பருவக்காற்று காலங்களில் குறைந்த மழையைப் பெறக் காரணம்?',options:['கடற்கரை அமைவிடம்','மறைமுக மழைப்பிரதேசம்','வெப்பமண்டல அமைவிடம்','காடுகள் குறைவு'],ai:1,exp:'It is in the "Rain Shadow" region of the Western Ghats.'}
],
hook:'NE Monsoon=Main Rain. Red Soil=Most common. Black Soil=Cotton. Alluvial=Delta. TN=Rain shadow for SW monsoon.',
summary:'The four seasons of TN. Importance of the North-East Monsoon. Classification and distribution of the 5 soil types. Relationship between soil and agriculture.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'tnpsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🎯 TNPSC Geography Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Geography Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'TNPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('TNPSC Geography of Tamil Nadu '+d.topic),why:'Samacheer book based geography for TNPSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | Unit 9 link',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'tnpsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ TNPSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('TNPSC Days 15-17 v2 COMPLETE');
}
push();
