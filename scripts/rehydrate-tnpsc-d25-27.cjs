require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:25,topic:'TNPSC Geography: Agriculture & Major Crops in India',
intro:`Today we study the 'Backbone of India'. India is a global leader in agriculture. From the wheat fields of Punjab to the rice bowls of Bengal and the coffee plantations of Karnataka—the scale is immense. We explore the 3 main seasons (Kharif, Rabi, Zaid) and the Green Revolution which made India self-sufficient. For TNPSC, knowing which state leads in which crop (e.g., UP for Sugarcane) and the various agricultural revolutions (White, Blue, Golden) is a high-yield area.`,
notes:[
{title:'Indian Cropping Seasons',detail:'1. Kharif: June-Sep (Rice, Maize, Cotton). 2. Rabi: Oct-March (Wheat, Mustard, Gram). 3. Zaid: April-June (Watermelon, Vegetables).'},
{title:'Food Crops',detail:'Rice: Leading producer is West Bengal. Requires high temp and humidity. Wheat: Leading producer is Uttar Pradesh. Rabi crop. Pulses: India is the largest producer and consumer (MP is the lead state).'},
{title:'Commercial & Plantation Crops',detail:'Sugarcane: UP is the leader. Cotton: Gujarat/Maharashtra. Jute: West Bengal ("Golden Fiber"). Tea: Assam (India is a major exporter). Coffee: Karnataka.'},
{title:'Agricultural Revolutions',detail:'Green (Food grains), White (Milk - Verghese Kurien), Blue (Fish), Golden (Horticulture/Honey), Silver (Eggs/Poultry), Yellow (Oilseeds), Round (Potato).'},
{title:'Green Revolution (1960s)',detail:'Introduced HYV seeds, fertilizers, and irrigation. M.S. Swaminathan is the "Father of Green Revolution in India". First implemented in Punjab/Haryana.'}
],
cards:[
{front:'Father of Green Revolution in India?',back:'M.S. Swaminathan.'},
{front:'Leading producer of Wheat in India?',back:'Uttar Pradesh.'},
{front:'Leading producer of Rice in India?',back:'West Bengal.'},
{front:'What is the "Golden Fiber"?',back:'Jute.'},
{front:'White Revolution is related to?',back:'Milk (Verghese Kurien).'}
],
q:[
{q:'இந்திய பசுமைப் புரட்சியின் தந்தை யார்?',options:['வர்கீஸ் குரியன்','எம்.எஸ். சுவாமிநாதன்','நார்மன் போர்லாக்','அம்ரிதா படேல்'],ai:1,exp:'M.S. Swaminathan spearheaded the high-yielding variety program in India.'},
{q:'"தங்க இழை" என அழைக்கப்படும் பயிர் எது?',options:['பருத்தி','சணல்','நெல்','தேயிலை'],ai:1,exp:'Jute is called Golden Fiber due to its color and value.'},
{q:'இந்தியாவில் கோதுமை உற்பத்தியில் முதலிடம் வகிக்கும் மாநிலம்:',options:['பஞ்சாப்','ஹரியானா','உத்தரப்பிரதேசம்','மத்தியப்பிரதேசம்'],ai:2,exp:'UP is the largest producer of wheat in India.'},
{q:'வெள்ளைப்புரட்சி எதனோடு தொடர்புடையது?',options:['மீன்','பால்','முட்டை','எண்ணெய் வித்துக்கள்'],ai:1,exp:'White Revolution (Operation Flood) aimed to increase milk production.'}
],
hook:'Green=Food. White=Milk. Golden=Jute/Honey. Rice=WB. Wheat=UP. Swaminathan=Green Rev. Seasons=Kharif, Rabi, Zaid.',
summary:'Classification of Indian cropping seasons. Major food and commercial crops and their lead states. Summary of agricultural revolutions in India. Impact of the Green Revolution.'},

{day:26,topic:'TNPSC Geography: Mineral & Power Resources of India',
intro:`Today we study the 'Fuel of Development'. India has rich deposits of minerals, especially in the Chotanagpur plateau (the Ruhr of India). We explore metallic minerals like Iron and Gold, and non-metallic minerals like Mica and Limestone. We also look at the energy sector—Coal, Petroleum, and the rising Solar power. For TNPSC, knowing the major mining hubs like Kudremukh (Iron) and Digboi (Oil) is essential. Let's power up your knowledge today.`,
notes:[
{title:'Metallic Minerals',detail:'Iron Ore: Odisha, Chhattisgarh, Karnataka (Kudremukh). Manganese: Odisha (Largest). Bauxite (Aluminium): Odisha. Gold: Kolar (Karnataka) - now mostly closed.'},
{title:'Non-Metallic Minerals',detail:'Mica: Andhra Pradesh (Nellore) - India is a leading producer. Limestone: MP, Rajasthan. Gypsum: Rajasthan.'},
{title:'Energy Resources (Conventional)',detail:'Coal: Most important (70% of electricity). Jharia (Jharkhand) is the largest coal field. Petroleum: Digboi (Assam - oldest), Mumbai High (largest). Natural Gas: Krishna-Godavari basin.'},
{title:'Non-Conventional Energy',detail:'Solar: Rajasthan/Gujarat (India has massive targets). Wind: Tamil Nadu (Muappandal) is the leader in India. Nuclear: Kalpakkam (TN), Tarapur (MH).'},
{title:'Mineral Hubs',detail:'Chotanagpur Plateau: "Ruhr of India" due to immense mineral wealth. Mumbai High: Largest offshore oil field.'}
],
cards:[
{front:'Which state is the "Ruhr of India"?',back:'Chotanagpur Plateau (Jharkhand/WB/Odisha region).'},
{front:'Where is the oldest oil well in India?',back:'Digboi (Assam).'},
{front:'Leading producer of Mica in India?',back:'Andhra Pradesh.'},
{front:'Where is the largest Coal mine in India?',back:'Jharia (Jharkhand).'},
{front:'Which state leads in Wind energy in India?',back:'Tamil Nadu.'}
],
q:[
{q:'"இந்தியாவின் ரூர்" (Ruhr of India) என அழைக்கப்படுவது எது?',options:['தக்காண பீடபூமி','சோட்டாநாக்பூர் பீடபூமி','மால்வா பீடபூமி','லடாக் பீடபூமி'],ai:1,exp:'Chotanagpur is the mineral heartland of India.'},
{q:'இந்தியாவின் மிகப்பழமையான எண்ணெய் சுத்திகரிப்பு நிலையம் எங்குள்ளது?',options:['மும்பை ஹை','டிக்பாய்','சென்னை','விசாகப்பட்டினம்'],ai:1,exp:'Digboi (Assam) started in 1901.'},
{q:'இந்தியாவில் நிலக்கரி உற்பத்தியில் முதலிடம் வகிக்கும் மாநிலம்:',options:['ஒடிசா','ஜார்க்கண்ட்','சத்தீஸ்கர்','மேற்கு வங்காளம்'],ai:1,exp:'Jharkhand (Jharia/Dhanbad) has the largest reserves.'},
{q:'மைக்கா உற்பத்தியில் முதலிடம் வகிக்கும் இந்திய மாநிலம்:',options:['ராஜஸ்தான்','பீகார்','ஆந்திரப்பிரதேசம்','மத்தியப்பிரதேசம்'],ai:2,exp:'Nellore in Andhra is famous for mica.'}
],
hook:'Chotanagpur=Ruhr. Digboi=Oldest Oil. Jharia=Coal. Nellore=Mica. TN=Wind leader. Coal=70% Power.',
summary:'Metallic and Non-metallic mineral distribution in India. Major mining centers. Conventional energy (Coal/Oil) vs Non-conventional (Solar/Wind). Mineral-rich regions of India.'},

{day:27,topic:'TNPSC Geography: Industries & Trade in India',
intro:`Today we master the 'Industrial Map of India'. We study the major industrial sectors like Iron & Steel (the backbone), Textiles (largest employer), and Information Technology (the future). We also explore the 'Golden Quadrilateral' and the trade patterns of India. For TNPSC, knowing the location of major steel plants (Bhilai, Bokaro) and the software hubs is vital. Let's map the economic engines today.`,
notes:[
{title:'Iron & Steel Industry',detail:'TISCO (Jamshedpur 1907) - 1st private. Bhilai (CG - USSR help), Rourkela (Odisha - Germany), Durgapur (WB - UK), Bokaro (Jharkhand - USSR). Steel is the index of industrial development.'},
{title:'Textile Industry',detail:'1st mill: Fort Gloster (Calcutta 1818). Mumbai is the "Cottonopolis of India". Largest employer in organized sector. Jute mills concentrated in West Bengal (Hooghly river).'},
{title:'IT & Electronics',detail:'"Silicon Valley of India": Bengaluru. Software exports are a major part of India\'s GDP. Major hubs: Hyderabad, Chennai, Pune, Gurugram.'},
{title:'Transport & Trade',detail:'Golden Quadrilateral: Connects Delhi-Mumbai-Chennai-Kolkata. Major Ports: 13 major (Mumbai is largest). Trade: India exports Software, Gems, Spices; imports Petroleum, Gold.'},
{title:'Industrial Regions',detail:'Mumbai-Pune, Hugli, Bengaluru-Tamil Nadu, Gujarat, Chotanagpur, Vishakhapatnam-Guntur.'}
],
cards:[
{front:'"Silicon Valley of India"?',back:'Bengaluru.'},
{front:'First Iron & Steel plant in India?',back:'TISCO (Jamshedpur, 1907).'},
{front:'"Cottonopolis of India"?',back:'Mumbai.'},
{front:'What is the "Golden Quadrilateral"?',back:'Highway project connecting 4 major metros (Delhi, Mumbai, Chennai, Kolkata).'},
{front:'Where was the first Textile mill started?',back:'Fort Gloster, Calcutta (1818).'}
],
q:[
{q:'"இந்தியாவின் சிலிகான் பள்ளத்தாக்கு" எது?',options:['சென்னை','ஹைதராபாத்','பெங்களூரு','மும்பை'],ai:2,exp:'Bengaluru is the IT hub of India.'},
{q:'டாட்டா இரும்பு எஃகு நிறுவனம் (TISCO) தொடங்கப்பட்ட ஆண்டு:',options:['1901','1907','1911','1923'],ai:1,exp:'Established by Jamshedji Tata in Jamshedpur.'},
{q:'"இந்தியாவின் பருத்தி நகரம்" (Cottonopolis) எது?',options:['அகமதாபாத்','மும்பை','சூரத்','கோயம்புத்தூர்'],ai:1,exp:'Mumbai has the largest concentration of cotton mills.'},
{q:'தங்க நாற்கரச் சாலைத் திட்டம் எவற்றை இணைக்கிறது?',options:['4 முக்கிய நகரங்கள்','4 துறைமுகங்கள்','4 மாநிலங்கள்','4 ஆறுகள்'],ai:0,exp:'It connects Delhi, Mumbai, Chennai, and Kolkata.'}
],
hook:'Silicon Valley=Bengaluru. TISCO=1907. Cottonopolis=Mumbai. Bhilai=USSR help. Golden Quad=Metros. Jute=WB.',
summary:'Major industrial sectors in India (Steel, Textiles, IT). History and location of key industrial units. Transport infrastructure (Golden Quadrilateral). India\'s international trade pattern.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'tnpsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🎯 TNPSC Geography Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Geography Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'TNPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('TNPSC Indian Geography '+d.topic),why:'Economic geography of India for TNPSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | High Yield',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'tnpsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ TNPSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('TNPSC Days 25-27 v2 COMPLETE');
}
push();
