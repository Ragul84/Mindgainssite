require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:18,topic:'TNPSC Geography: Agriculture & Crop Patterns in TN',
intro:`Today we study the 'Granary of Tamil Nadu'. Agriculture is the largest employer in the state. From the paddy fields of the Cauvery delta to the tea gardens of the Nilgiris and the banana plantations of the South—TN has a diverse cropping pattern. We explore the 3 main cropping seasons (Sornavari, Samba, Navarai) and the major crops like Paddy, Millets, and Sugarcane. For TNPSC, knowing which district leads in which crop (e.g., Thanjavur for Paddy) is a must. Let's dig in.`,
notes:[
{title:'TN Cropping Seasons',detail:'1. Sornavari (Kharif): April-May to Aug-Sep. 2. Samba (Main): July-Aug to Jan-Feb (Paddy). 3. Navarai (Rabi): Nov-Dec to Feb-March. Samba is the longest and most important season for Paddy.'},
{title:'Paddy (நெல்)',detail:'TN\'s primary food crop. Highest producer: Thanjavur (Granary of South India). Methods: Trans-plantation and System of Rice Intensification (SRI). Tiruvarur, Nagapattinam, and Kanchipuram are other major producers.'},
{title:'Millets & Pulses',detail:'Millets (Cumbu, Ragi, Cholam): Grown in dry regions (Dharmapuri, Salem, Perambalur). Pulses (Black gram, Green gram): Grown in all districts, especially in rice fallows. TN is a major pulse producer.'},
{title:'Commercial Crops',detail:'Sugarcane: TN is a leading producer. Cotton: Coimbatore and Madurai region. Oilseeds: Groundnut is most common (Namakkal, Villupuram).'},
{title:'Plantation Crops',detail:'Tea: Nilgiris and Anaimalai (TN stands 2nd in India after Assam/WB). Coffee: Yercaud (Salem), Palani Hills, Nilgiris. Rubber: Kanyakumari. Spices: Cardamom and Pepper in the Western Ghats.'}
],
cards:[
{front:'Which district is the "Granary of South India"?',back:'Thanjavur.'},
{front:'Main cropping season for Paddy in TN?',back:'Samba (July-Jan).'},
{front:'Where is Tea mostly grown in TN?',back:'Nilgiris and Anaimalai Hills.'},
{front:'Which district leads in Rubber production?',back:'Kanyakumari.'},
{front:'Which district leads in Coffee production in TN?',back:'Salem (Yercaud).'}
],
q:[
{q:'தென்னிந்தியாவின் நெற்களஞ்சியம் எது?',options:['மதுரை','திருச்சி','தஞ்சாவூர்','கோயம்புத்தூர்'],ai:2,exp:'Thanjavur (Cauvery Delta) is known as the Granary of South India.'},
{q:'தமிழகத்தின் மிக முக்கியமான பயிர் பருவம் எது?',options:['சொர்ணவாரி','சம்பா','நவராய','கோடை'],ai:1,exp:'Samba is the major season for the state\'s primary crop, Paddy.'},
{q:'தேயிலை உற்பத்தியில் தமிழகம் இந்தியாவில் எத்தனையாவது இடம்?',options:['முதல்','இரண்டாவது','மூன்றாவது','நான்காவது'],ai:1,exp:'TN stands second in India in tea production.'},
{q:'ரப்பர் உற்பத்தி தமிழகத்தில் எங்கு அதிகம்?',options:['நீலகிரி','சேலம்','கன்னியாகுமரி','திண்டுக்கல்'],ai:2,exp:'Kanyakumari district leads in rubber plantations due to its climate.'}
],
hook:'Thanjavur=Paddy. Nilgiris=Tea. Samba=Main season. Kanyakumari=Rubber. Salem=Coffee. TN is 2nd in Tea.',
summary:'Classification of cropping seasons in TN. Major food and commercial crops. Leading districts in crop production. Importance of plantation crops in hill regions.'},

{day:19,topic:'TNPSC Geography: Minerals & Industries in TN',
intro:`Today we master the 'Industrial Powerhouse'. Tamil Nadu is one of the most industrialized states in India, often called the 'Detroit of Asia'. From the lignite mines of Neyveli to the textile mills of Coimbatore and the firecracker units of Sivakasi—the state has a massive industrial footprint. We explore the 'Industrial Clusters' and the mineral wealth like Magnesite and Gypsum. For TNPSC, knowing the 'Industrial Hubs' (Unit 9) is essential for both Geography and Administration.`,
notes:[
{title:'Minerals in Tamil Nadu',detail:'Lignite (Brown Coal): Neyveli (Cuddalore) - largest deposits in India. Magnesite: Salem (Chalk hills). Bauxite: Shevaroy Hills. Iron Ore: Kanjamalai (Salem). Limestone: Distributed across state (Cement industry).'},
{title:'Textile Industry',detail:'"Manchester of South India": Coimbatore. "Textile Valley of TN": Tirupur, Erode, Coimbatore. Tirupur is the leader in knitwear exports.'},
{title:'Automobile Industry',detail:'"Detroit of Asia": Chennai. Major hubs: Chennai, Hosur. TN accounts for 21% of India\'s automobile exports. Home to Ford, Hyundai, BMW, and TVS.'},
{title:'Other Major Industries',detail:'Sugar: Distributed (Erode, Vellore). Leather: Vellore, Ambur, Vaniyambadi (TN accounts for 60% of India\'s leather output). Fireworks & Printing: Sivakasi (Central hub). Cement: Ariyalur, Virudhunagar, Sankaridurg.'},
{title:'Industrial Hubs (TIDCO/SIPCOT)',detail:'Electronic Hub: Sriperumbudur. IT Hub: OMR (Chennai). Heavy Engineering: Trichy (BHEL). Salem Steel Plant.'}
],
cards:[
{front:'Where is Lignite found in TN?',back:'Neyveli (Cuddalore).'},
{front:'Which city is the "Manchester of South India"?',back:'Coimbatore.'},
{front:'Where is the largest Leather production center in TN?',back:'Vellore district (Ambur, Vaniyambadi).'},
{front:'Which city is the "Detroit of Asia"?',back:'Chennai.'},
{front:'Where is the firecracker capital of India?',back:'Sivakasi.'}
],
q:[
{q:'"தென்னிந்தியாவின் மான்செஸ்டர்" எது?',options:['மதுரை','சென்னை','கோயம்புத்தூர்','ஈரோடு'],ai:2,exp:'Coimbatore is the hub for textile mills.'},
{q:'நெய்வேலியில் எவ்வகை நிலக்கரி கிடைக்கிறது?',options:['ஆந்த்ரசைட்','பிட்டுமினஸ்','லிக்னைட்','பீட்'],ai:2,exp:'Lignite (Brown coal) is the primary mineral in Neyveli.'},
{q:'"ஆசியாவின் டெட்ராய்ட்" என அழைக்கப்படும் நகரம்?',options:['ஹோசூர்','திருச்சி','சென்னை','ஈரோடு'],ai:2,exp:'Chennai is the global hub for automobile manufacturing.'},
{q:'தமிழகத்தில் தோல் பதனிடும் தொழிற்சாலைகள் எங்கு அதிகம்?',options:['வேலூர்','சேலம்','திண்டுக்கல்','மதுரை'],ai:0,exp:'Vellore (Ambur/Vaniyambadi) is the leather capital of TN.'}
],
hook:'Neyveli=Lignite. Cbe=Textile. Chennai=Auto. Vellore=Leather. Sivakasi=Fireworks. Ariyalur=Cement. Trichy=BHEL.',
summary:'Mineral distribution in TN (Lignite, Magnesite). Key industrial sectors: Textiles, Automobiles, Leather. Major industrial clusters and their nicknames. Role of government agencies in industrial growth.'},

{day:20,topic:'TNPSC Geography: Forests & Wildlife of TN',
intro:`Today we study the 'Green Wealth' of Tamil Nadu. About 20% of the state is under forest cover, concentrated mostly in the Western and Eastern Ghats. From the Evergreen forests of the Nilgiris to the Mangroves of Pichavaram—the biodiversity is stunning. We explore the 5 Biosphere Reserves and the numerous National Parks and Wildlife Sanctuaries. For TNPSC, knowing the location of sanctuaries like Mudumalai and Vedanthangal is a high-yield area. Let's explore the wild side today.`,
notes:[
{title:'Forest Types in TN',detail:'1. Tropical Evergreen: Heavy rain areas (Nilgiris, Tirunelveli). 2. Tropical Deciduous (Monsoon): Most common type, shed leaves in summer. 3. Thorny/Shrub: Dry regions (Sivaganga, Ramanathapuram). 4. Mangroves: Coastal (Pichavaram, Muthupet). 5. Montane (Shola): High altitude Nilgiris.'},
{title:'Biosphere Reserves',detail:'Tamil Nadu has 3: 1. Nilgiris (India\'s first). 2. Gulf of Mannar. 3. Agasthyamalai. (Note: These are globally recognized for biodiversity).'},
{title:'Wildlife Sanctuaries & Parks',detail:'Mudumalai (Nilgiris - Tiger/Elephant). Guindy NP (Chennai - inside city). Mukurthi NP. Anaimalai (Indira Gandhi NP). Vedanthangal (Oldest Bird Sanctuary in India). Point Calimere (Nagapattinam).'},
{title:'Mangroves (Pichavaram)',detail:'Located in Cuddalore. It is the 2nd largest mangrove forest in the world (after Sundarbans). It protects the coast from Tsunami and erosion.'},
{title:'Endemic Species',detail:'Nilgiri Tahr (State Animal) found in Western Ghats. Lion-tailed Macaque. TN has a rich variety of medicinal plants in the Pothigai and Kolli hills.'}
],
cards:[
{front:'What is the State Animal of Tamil Nadu?',back:'Nilgiri Tahr.'},
{front:'Where is the oldest Bird Sanctuary in India?',back:'Vedanthangal (Kanchipuram/Chengalpattu).'},
{front:'Where is the 2nd largest mangrove forest in the world?',back:'Pichavaram (Cuddalore).'},
{front:'Which was the first Biosphere Reserve in India?',back:'Nilgiris Biosphere Reserve.'},
{front:'Where is Mudumalai National Park located?',back:'Nilgiris district.'}
],
q:[
{q:'தமிழ்நாட்டின் மாநில விலங்கு எது?',options:['புலி','யானை','வரையாடு','சிங்கம்'],ai:2,exp:'Nilgiri Tahr (வரையாடு) is the state animal.'},
{q:'இந்தியாவின் மிகப்பழமையான பறவைகள் சரணாலயம் எது?',options:['முதுமலை','வேடந்தாங்கல்','கோடிக்கரை','பிச்சாவரம்'],ai:1,exp:'Vedanthangal (established 1797) is the oldest.'},
{q:'இரண்டாவது மிகப்பெரிய சதுப்புநிலக்காடு (Mangroves) எது?',options:['சுந்தரவனம்','முத்துப்பேட்டை','பிச்சாவரம்','கன்னியாகுமரி'],ai:2,exp:'Pichavaram in Cuddalore is 2nd in the world after Sundarbans.'},
{q:'முதுமலை வனவிலங்கு சரணாலயம் எந்த மாவட்டத்தில் உள்ளது?',options:['ஈரோடு','நீலகிரி','திருப்பூர்','சேலம்'],ai:1,exp:'Mudumalai is a major tiger and elephant reserve in the Nilgiris.'}
],
hook:'State Animal=Nilgiri Tahr. Vedanthangal=Oldest Bird Sanc. Pichavaram=Mangroves. Nilgiris=1st Biosphere. 20% Forest cover.',
summary:'Classification of forest types in TN. Biosphere Reserves and their importance. Key National Parks and Wildlife Sanctuaries. Significance of Mangroves and endemic species.'}
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
  console.log('TNPSC Days 18-20 v2 COMPLETE');
}
push();
