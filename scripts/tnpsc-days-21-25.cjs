require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:21,topic:'Indian National Movement: Key Events 1905-1947',
notes:[
{title:'Partition of Bengal to Non-Cooperation',detail:'Partition of Bengal (1905, Curzon): Led to Swadeshi Movement and rise of Extremists (Tilak, Lal-Bal-Pal). Annulled 1911. Lucknow Pact (1916): Congress-Muslim League unity. Home Rule Leagues: Tilak (1916) and Annie Besant (1916). Rowlatt Act (1919): No appeal law. Jallianwala Bagh Massacre (April 13, 1919, Amritsar, Dyer). Non-Cooperation Movement (1920-22): Gandhi launched. Chauri Chaura (Feb 1922): Violence → Gandhi withdrew movement.'},
{title:'Civil Disobedience to Quit India',detail:'Dandi March (March 12-April 6, 1930): Gandhi walked 241 miles. Salt Satyagraha. Poona Pact (1932): Gandhi-Ambedkar. Reserved seats for untouchables (instead of separate electorates). Quit India Movement (Aug 8, 1942): "Do or Die." Cripps Mission (1942) failed. Wavell Plan, Simla Conference (1945) failed.'},
{title:'Towards Independence',detail:'Cabinet Mission Plan (1946): Proposed federal structure. INA (Indian National Army): Subhas Chandra Bose. INA trials (1945-46) created nationalist sentiment. Mountbatten Plan (June 3, 1947): Partition of India. Independence: August 15, 1947. Pakistan: August 14, 1947.'},
{title:'Key Facts for TNPSC',detail:'First Session of INC: 1885, Bombay, W.C. Bonnerjee. Surat Split (1907): Extremists vs Moderates. Gandhi enters politics: 1915 (returned from South Africa). Champaran (1917), Kheda (1918), Ahmedabad (1918): Gandhi\'s first three Satyagrahas in India.'}
],
hook:'TNPSC Pattern: Year-event matching is the core question type. Key years: 1905(Partition of Bengal)+1907(Surat Split)+1919(Rowlatt+Jallianwala)+1920(NCM)+1930(Dandi)+1942(Quit India)+1947(Independence). Chauri Chaura(1922)=reason Gandhi withdrew NCM. Poona Pact(1932)=Gandhi-Ambedkar=reserved seats NOT separate electorates.',
cards:[
{front:'Jallianwala Bagh Massacre — எப்போது? யார் நடத்தினார்?',back:'April 13, 1919. Amritsar (Punjab). General Reginald Dyer ordered firing. Occasion: Baisakhi gathering. After Rowlatt Act protests. Hunter Commission enquired. Udham Singh assassinated Dyer\'s superior O\'Dwyer (1940) in revenge.'},
{front:'Non-Cooperation Movement ஏன் திரும்பப் பெறப்பட்டது?',back:'Chauri Chaura incident (February 5, 1922, Gorakhpur, UP). Angry crowd set fire to police station — 22 policemen killed. Gandhi withdrew NCM saying non-violence principle violated. Most controversial decision of Gandhi\'s political career.'},
{front:'Dandi March எப்போது? எத்தனை மைல்?',back:'March 12, 1930 to April 6, 1930. Gandhi walked 241 miles (388 km) from Sabarmati Ashram (Ahmedabad) to Dandi (coastal village in Gujarat) to make salt. Began Salt Satyagraha / Civil Disobedience Movement.'}
],
q:[{q:'Which event led Mahatma Gandhi to withdraw the Non-Cooperation Movement in 1922?',options:['Jallianwala Bagh massacre','Chauri Chaura violence','Simon Commission visit','Surat Split'],answer_index:1,explanation:'Chauri Chaura (February 5, 1922): Protesters in Gorakhpur burned a police station killing 22 policemen. Gandhi considered this a betrayal of non-violence and unilaterally withdrew the NCM — much to the disappointment of other Congress leaders.'},
{q:'The Poona Pact (1932) was signed between Mahatma Gandhi and whom?',options:['Muhammad Ali Jinnah','B.R. Ambedkar','Jawaharlal Nehru','Subhash Chandra Bose'],answer_index:1,explanation:'Poona Pact (September 24, 1932) between Gandhi and Dr. B.R. Ambedkar. Result: Instead of separate electorates for untouchables (Communal Award), reserved seats were given within general Hindu electorate. Gandhi was on fast-unto-death against separate electorates.'}
],
pyq:'Very High — TNPSC Modern History. Year-event-person matching is the primary question format.',
summary:'Key events: Partition of Bengal(1905,Curzon)→Surat Split(1907)→Jallianwala Bagh(Apr13,1919,Dyer)→NCM(1920,Gandhi)→Chauri Chaura(1922,withdrawal)→Dandi March(Mar12-Apr6,1930,241 miles)→Poona Pact(1932,Gandhi-Ambedkar)→Quit India(Aug8,1942)→Independence(Aug15,1947). Samacheer 10th Std History.'},

{day:22,topic:'Current Affairs TN: Schemes & Recent Developments',
notes:[
{title:'Tamil Nadu Government Flagship Schemes',detail:'Pudhumai Penn (2023): Rs.1000/month scholarship for girl students from govt schools going to college. Kalaignar Magalir Urimai Thogai (2023): Rs.1000/month for women heads of household below certain income. Mukhyamantri Breakfast Scheme (2023): Free breakfast for govt school students (Classes 1-5). CM Dashboard: Digital governance monitoring.'},
{title:'Important TN Infrastructure Projects',detail:'Chennai Metro Rail: Phase 1 operational (2015). Phase 2 ongoing. Chennai-Bangalore Expressway. SIPCOT Industrial Parks. Coimbatore International Airport expansion. Thoothukudi (Tuticorin) Port: Major cargo port. Ennore Port: Largest port in TN, near Chennai.'},
{title:'TN Achievement Rankings',detail:'Education: TN has one of the highest school enrollment rates in India. Health: Low Infant Mortality Rate (IMR) and Maternal Mortality Rate (MMR). Ease of Doing Business: Consistently ranked in top 5 states. Industrial Output: Top producer of cars, two-wheelers, electronics, textile.'},
{title:'Important Dams & Irrigation',detail:'Mettur Dam (Stanley Reservoir): Cauvery river, Salem district. Biggest in TN. Built 1934. Vaigai Dam: Vaigai river, Dindigul district. Krishnagiri Dam: Ponnaiyar river. Sathanur Dam: Ponnaiyar river. Amaravathi Dam: Coimbatore. Cauvery delta: Cauvery+Grand Anicut (Kallanai, oldest dam, 2nd century CE, Karikala Chola).'}
],
hook:'TNPSC Current Affairs Trap: Kallanai (Grand Anicut) is the world\'s OLDEST functioning dam. Built by Karikala Chola in 2nd century CE on Cauvery river in Thanjavur district. NOT Mettur Dam (which is the biggest dam in TN, built 1934). Mettur=Salem district. Kallanai=Thanjavur district.',
cards:[
{front:'கல்லணை (Grand Anicut) — யார் கட்டினார்? எந்த நதி?',back:'Built by Karikala Chola (~2nd century CE). On Cauvery river in Thanjavur district. World\'s oldest functioning dam. Diverts water for Cauvery delta irrigation.'},
{front:'Pudhumai Penn scheme என்ன?',back:'Rs.1000/month scholarship for girl students from government schools continuing to higher education (college/polytechnic). Launched by TN government 2023. Aims to increase female higher education enrollment.'},
{front:'Mettur Dam எங்கு உள்ளது? எந்த ஆண்டு கட்டப்பட்டது?',back:'Salem district. Cauvery river. Built 1934. Stanley Reservoir. Largest dam in Tamil Nadu. Major water source for agricultural irrigation in TN.'}
],
q:[{q:'The Grand Anicut (Kallanai) is considered the world\'s oldest functioning dam. It was built by?',options:['Raja Raja Chola I','Rajendra Chola','Karikala Chola','Mahendravarman I'],answer_index:2,explanation:'Kallanai (Grand Anicut) on Cauvery river was built by Karikala Chola in the 2nd century CE. It is one of the world\'s oldest functioning water diversion structures and still serves irrigation purposes in the Cauvery delta region.'},
{q:'Mettur Dam (Stanley Reservoir) is built across which river?',options:['Vaigai','Tamirabarani','Cauvery','Palar'],answer_index:2,explanation:'Mettur Dam = Stanley Reservoir is built across Cauvery river in Salem district. Completed in 1934. Largest dam in Tamil Nadu. Regulates Cauvery water for irrigation in delta districts.'}
],
pyq:'High — TNPSC Unit 9 Current Affairs and Geography. Dam-river matching is a standard question.',
summary:'TN Schemes: Pudhumai Penn(2023,Rs.1000 girl scholarship)+Kalaignar Magalir Urimai(Rs.1000 women)+CM Breakfast(Classes1-5). Dams: Kallanai/Grand Anicut(world\'s oldest,Karikala Chola,Cauvery,Thanjavur)+Mettur(Stanley Reservoir,1934,Salem,Cauvery,largest in TN). Ennore Port(largest in TN). Chennai Metro(Phase 1,2015). TN ranked top in education+health.'},

{day:23,topic:'Computer Science & Digital Literacy (Samacheer)',
notes:[
{title:'Computer Basics',detail:'CPU (Central Processing Unit): brain of computer. ALU (Arithmetic Logic Unit): calculations. CU (Control Unit): controls operations. Memory: RAM (Random Access Memory) — volatile, temporary. ROM (Read Only Memory) — non-volatile, permanent. Cache memory: fastest, smallest. Secondary storage: Hard disk, SSD, USB.'},
{title:'Internet & Networking',detail:'WWW (World Wide Web): Tim Berners-Lee (1989/1991). Internet Protocol: TCP/IP. IP Address: unique address for each device. Domain Name System (DNS): converts domain names to IP addresses. Bandwidth: data transfer rate (Mbps). HTTP vs HTTPS (S=Secure, uses SSL/TLS encryption).'},
{title:'Cybersecurity Terms',detail:'Virus: self-replicating malicious program. Worm: spreads across networks without user action. Trojan: disguised as legitimate software. Ransomware: encrypts files, demands payment (e.g., WannaCry 2017). Phishing: fake emails/websites to steal credentials. Firewall: network security barrier. Antivirus: detects/removes malware.'},
{title:'Data Storage Units',detail:'Bit (b): smallest unit (0 or 1). Byte (B)=8 bits. Kilobyte(KB)=1024 Bytes. Megabyte(MB)=1024 KB. Gigabyte(GB)=1024 MB. Terabyte(TB)=1024 GB. Petabyte(PB)=1024 TB. Binary number system (base 2): only 0 and 1.'}
],
hook:'TNPSC Digital Literacy: WWW invented by Tim Berners-Lee (1989, at CERN). NOT the Internet itself (Internet=ARPANET origin, US Defense, 1960s). RAM=volatile(loses data when power off). ROM=non-volatile(retains data). Ransomware=encrypts your data and demands money. Phishing=fake website/email tricking you to reveal passwords.',
cards:[
{front:'WWW (World Wide Web) யார் கண்டுபிடித்தார்? எந்த ஆண்டு?',back:'Tim Berners-Lee. 1989 (proposed)/1991 (launched). At CERN, Geneva. WWW≠Internet. Internet is the infrastructure; WWW is a service on top of it.'},
{front:'RAM vs ROM வேறுபாடு?',back:'RAM=Random Access Memory=volatile(data lost when power off)=temporary working memory. ROM=Read Only Memory=non-volatile(data retained permanently)=stores BIOS/firmware.'},
{front:'Ransomware என்றால் என்ன? உதாரணம்?',back:'Malware that encrypts victim\'s files and demands ransom (payment) to decrypt. Example: WannaCry (2017) — affected 200,000 computers in 150 countries including hospitals and banks.'}
],
q:[{q:'Who invented the World Wide Web (WWW)?',options:['Bill Gates','Tim Berners-Lee','Charles Babbage','Steve Jobs'],answer_index:1,explanation:'Tim Berners-Lee invented the WWW in 1989 (proposal) and 1991 (public launch) at CERN, Switzerland. He is different from the inventor of the Internet (which grew from ARPANET). Berners-Lee created HTML, HTTP, and URL protocols.'},
{q:'Which type of computer memory loses its data when power is switched off?',options:['ROM','Hard Disk','RAM','Flash Drive'],answer_index:2,explanation:'RAM (Random Access Memory) is VOLATILE — data is lost when power is switched off. ROM is non-volatile. Hard disks and flash drives retain data without power. RAM is the working memory used by the CPU.'}
],
pyq:'Medium-High — TNPSC General Science and Computer section. Basic digital literacy tested in Group 4.',
summary:'CPU: ALU+CU. RAM(volatile,temp)+ROM(non-volatile,permanent). Storage: KB(1024B)→MB→GB→TB→PB. WWW=Tim Berners-Lee(1989/1991,CERN). TCP/IP protocol. DNS=domain to IP. HTTPS=secure(SSL). Cybersecurity: Virus(self-replicate)+Worm(network spread)+Trojan(disguised)+Ransomware(encrypt+ransom,WannaCry 2017)+Phishing(fake credentials). Samacheer 9th-10th Std Computer Science.'},

{day:24,topic:'Indian Economy: Five Year Plans & Current Economic Concepts',
notes:[
{title:'Planning in India',detail:'Planning Commission: 1950-2014. 12 Five Year Plans (1951-2017). NITI Aayog: Replaced Planning Commission in 2015. First FYP (1951-56): Agriculture focus. Second FYP (1956-61): Mahalanobis model, heavy industry (Nehru-Mahalanobis model). Third FYP (1961-66): Failed due to China war (1962), Pakistan war (1965), drought.'},
{title:'NITI Aayog',detail:'National Institution for Transforming India. Established 2015. Replaces Planning Commission. Chairman: Prime Minister. CEO: appointed by PM. Key difference: NITI Aayog is a THINK TANK (advisory), NOT an allocating body. Does not allocate funds (Finance Ministry does). SDG monitoring, Aspirational Districts Programme.'},
{title:'Indian Economy Key Concepts',detail:'GDP Growth Rate: India targets 7-8% annually. Inflation Target: 4% CPI (RBI). Fiscal Deficit: 3% of GDP target (FRBM). GST (Goods and Services Tax): One nation, one tax. Implemented July 1, 2017. Replaced 17 taxes. GST Council: Finance Minister chairs.'},
{title:'Poverty & Development',detail:'Poverty Line: Tendulkar Committee methodology (until 2011-12). Rangarajan Committee (2014) gave revised estimates. MGNREGS (Mahatma Gandhi National Rural Employment Guarantee Act 2005): 100 days guaranteed work per household. PM-KISAN: Rs.6000/year direct benefit to farmers.'}
],
hook:'TNPSC Economy Trap: NITI Aayog does NOT allocate funds — it is advisory only. Finance Ministry allocates. Planning Commission DID allocate funds. GST implemented July 1, 2017 (not 2016). MGNREGS = 100 days per HOUSEHOLD (not per person). PM-KISAN = Rs.6000 per year (Rs.2000 per installment, 3 installments).',
cards:[
{front:'NITI Aayog vs Planning Commission — முக்கிய வேறுபாடு?',back:'Planning Commission (1950-2014): Allocated funds to states. NITI Aayog (2015-present): Advisory/Think tank only — does NOT allocate funds. Finance Ministry/Finance Commission allocate. Chairman of both: Prime Minister.'},
{front:'GST எப்போது நடைமுறைக்கு வந்தது? என்ன மாற்றியது?',back:'July 1, 2017. Replaced 17 indirect taxes (excise duty, service tax, VAT, etc.) with one unified tax. "One Nation, One Tax." GST Council: Finance Minister chairs. 4 slabs: 5%, 12%, 18%, 28%.'},
{front:'MGNREGS என்றால் என்ன? ஆண்டுக்கு எத்தனை நாள் வேலை?',back:'Mahatma Gandhi National Rural Employment Guarantee Scheme (Act 2005). Guarantees 100 days of paid work per RURAL HOUSEHOLD per year. Rs.220-350/day wage (varies by state). First demand-driven employment scheme.'}
],
q:[{q:'NITI Aayog was established in which year, replacing the Planning Commission?',options:['2013','2014','2015','2016'],answer_index:2,explanation:'NITI Aayog (National Institution for Transforming India) was established on January 1, 2015 by the NDA government. It replaced the Planning Commission which was dissolved in 2014. Key difference: NITI Aayog is a think tank, not a fund allocator.'},
{q:'GST in India was implemented from which date?',options:['January 1, 2016','July 1, 2017','April 1, 2018','January 1, 2017'],answer_index:1,explanation:'GST was implemented from July 1, 2017. It was the biggest tax reform in independent India, replacing 17 central and state indirect taxes with a unified Goods and Services Tax. The midnight launch was ceremonially held on July 1, 2017.'}
],
pyq:'High — TNPSC Unit 9 Economy. NITI Aayog, GST, MGNREGS are tested every year.',
summary:'Planning Commission(1950-2014,fund allocator)→NITI Aayog(2015,think tank,no allocation). GST(July 1,2017,replaced 17 taxes,4 slabs:5/12/18/28%). MGNREGS(Act 2005,100 days/household/year). PM-KISAN(Rs.6000/year,3 installments). FDI+FPI. FRBM(3% fiscal deficit). RBI(4% CPI target). India GDP growth target 7-8%. Samacheer 10th Std Economics.'},

{day:25,topic:'Solar System, Space Science & India\'s Space Programme',
notes:[
{title:'Solar System Basics',detail:'8 planets (Pluto declassified 2006): Mercury, Venus, Earth, Mars (inner/rocky) + Jupiter, Saturn, Uranus, Neptune (outer/gas giants). Order from Sun: My Very Excellent Mother Just Served Us Noodles. Earth: 3rd planet. Moon: Earth\'s only natural satellite. Distance: 3.84 lakh km. Light from Sun to Earth: 8 minutes 20 seconds.'},
{title:'ISRO — India\'s Space Agency',detail:'Indian Space Research Organisation. Founded 1969. HQ: Bangalore. Vikram Sarabhai: Father of Indian Space Programme. Key launch vehicle: PSLV (Polar Satellite Launch Vehicle — most reliable). GSLV (Geosynchronous Satellite Launch Vehicle). Launch site: SDSC (Satish Dhawan Space Centre, Sriharikota, Andhra Pradesh border with TN).'},
{title:'Key ISRO Missions',detail:'Chandrayaan-1 (2008): Discovered water molecules on Moon. Chandrayaan-2 (2019): Orbiter successful, Vikram lander crash-landed. Chandrayaan-3 (Aug 23, 2023): Successfully landed on Moon\'s south pole — India 4th country to soft-land on Moon (after USA, Russia, China). Mangalyaan/MOM (2014): Mars Orbiter Mission, first Asian country to reach Mars orbit, cheapest Mars mission ever.'},
{title:'Recent Developments',detail:'Aditya-L1 (Sept 2023): India\'s first solar observatory. Launched to L1 Lagrange point (1.5 million km from Earth). Gaganyaan: India\'s first crewed space mission (planned). XPoSat (2024): First Indian X-ray polarimetry satellite. Reusable Launch Vehicle (RLV): India\'s future space shuttle programme.'}
],
hook:'TNPSC Space Facts: Chandrayaan-3 (Aug 23, 2023) = India 4th country on Moon = landed on SOUTH POLE of Moon (first ever south pole landing). Mangalyaan (2014) = first Asian country to Mars orbit = first attempt success (unique). Sriharikota = in Andhra Pradesh (NOT Tamil Nadu, but on TN-AP border area). Vikram Sarabhai = Father of Indian Space Programme.',
cards:[
{front:'Chandrayaan-3 — எப்போது வெற்றிகரமாக இறங்கியது? சாதனை என்ன?',back:'August 23, 2023. First spacecraft to soft-land on Moon\'s south pole. India became 4th country to land on Moon (after USA, Russia, China). Vikram lander + Pragyan rover.'},
{front:'Mangalyaan (MOM) சாதனை என்ன?',back:'First Asian country to reach Mars orbit (2014). First country to succeed in its FIRST attempt to Mars. Cheapest interplanetary mission ever (~Rs.450 crore, less than Hollywood film Gravity\'s budget).'},
{front:'இந்திய விண்வெளி ஆராய்ச்சி நிலையம் எங்கு உள்ளது?',back:'ISRO HQ: Bangalore (Karnataka). Launch site: SDSC SHAR, Sriharikota (Andhra Pradesh). Founded 1969. Vikram Sarabhai = Father of Indian Space Programme.'}
],
q:[{q:'Chandrayaan-3 successfully landed on the Moon on which date?',options:['July 14, 2023','August 23, 2023','September 2, 2023','October 1, 2023'],answer_index:1,explanation:'Chandrayaan-3 successfully soft-landed on the Moon\'s south pole on August 23, 2023. This made India the 4th country to achieve a soft landing on the Moon and the FIRST to land on the south pole. National Space Day is now celebrated on August 23.'},
{q:'India\'s Mangalyaan (Mars Orbiter Mission) was significant because it was?',options:['First mission to land on Mars','First Asian country to reach Mars orbit, on first attempt','First mission to discover water on Mars','First crewed mission to Mars'],answer_index:1,explanation:'Mangalyaan (MOM, 2014) made India the first Asian country to reach Mars orbit AND the first country globally to succeed in its very first Mars mission attempt. USA, Russia, and Europe had failed in their first attempts.'}
],
pyq:'Very High — TNPSC General Science Current Affairs. Chandrayaan-3, ISRO missions are tested in every recent exam.',
summary:'8 planets: Mercury→Venus→Earth→Mars→Jupiter→Saturn→Uranus→Neptune. ISRO(1969,Bangalore). Vikram Sarabhai=Father. Launch: Sriharikota(AP). Chandrayaan-3(Aug23,2023)=4th country+first south pole landing. Mangalyaan(2014)=first Asian Mars orbit+first attempt success+cheapest. Aditya-L1(2023,solar observatory). Gaganyaan(planned,crewed). Samacheer 9th Std Science.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'tnpsc_ecosystem',
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:d.pyq},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏛️ TNPSC Samacheer Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Revision Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'TNPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('TNPSC '+d.topic+' samacheer'),why:'Samacheer coaching.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.answer_index,answer:q.options[q.answer_index],explanation:q.explanation}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | '+d.pyq,one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'tnpsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('TNPSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('TNPSC Days 21-25 COMPLETE');
}
push();
