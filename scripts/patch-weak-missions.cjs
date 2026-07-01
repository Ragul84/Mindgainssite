const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const YT = 'https://www.youtube.com/results?search_query=';

const patches = [
  {
    track_id: 'ssc_cgl_tier1',
    day_number: 30,
    topic_title: 'Averages, Mixtures & Alligation',
    content_json: {
      topic_title: 'Averages, Mixtures & Alligation',
      day_number: 30,
      track: 'ssc_cgl_tier1',
      snapshot: {
        quick_notes: [
          { title: 'Average core rule', detail: 'Average = total of observations / number of observations. If average and count are known, total = average x count.' },
          { title: 'Adding one new value', detail: 'When one item is added, first rebuild the old total, then add the new value, then divide by the new count.' },
          { title: 'Removing one value', detail: 'If the average changes after removing a term, convert both averages into totals and compare.' },
          { title: 'Mixture logic', detail: 'In milk-water style questions, quantity of pure part changes after replacement. Track only the pure component.' },
          { title: 'Alligation use', detail: 'Alligation gives the ratio in which two items are mixed when their prices or concentrations differ from a mean value.' },
          { title: 'When not to use alligation', detail: 'Do not force alligation into every mixture problem. If replacement or repeated dilution is involved, use quantity balance directly.' },
        ],
      },
      flashcards: [
        { front: 'Average x number of items', back: 'Total sum' },
        { front: 'New average after adding one item', back: 'Old total + new item, then divide by new count' },
        { front: 'Alligation ratio', back: 'Cheaper difference : dearer difference' },
        { front: 'Mean price between Rs 20 and Rs 32 is Rs 26. Ratio?', back: '6 : 6 = 1 : 1' },
        { front: 'Repeated replacement affects what first?', back: 'Track the pure part remaining after each step' },
        { front: 'Average rises by 3 for 8 items. Total rises by?', back: '24' },
      ],
      videos: [
        { title: 'SSC CGL Averages Short Methods', url: `${YT}ssc+cgl+averages+short+tricks`, summary: 'Direct average-to-total conversions, gain/loss in average, and one-value replacement problems.' },
        { title: 'SSC Mixture and Alligation in One Sitting', url: `${YT}ssc+cgl+mixture+alligation+questions`, summary: 'Focus on ratio setup, milk-water replacement, and exam-speed alligation problems.' },
      ],
      quiz: {
        questions: [
          { question: 'The average of 8 numbers is 24. If one more number 42 is included, the new average is:', options: ['25', '26', '27', '28'], answer_index: 1, explanation: 'Old total = 8 x 24 = 192. New total = 234. New average = 234/9 = 26.' },
          { question: 'The average of 12 numbers is 18. If the average increases by 2 after adding one more number, the added number is:', options: ['40', '42', '44', '46'], answer_index: 2, explanation: 'Old total = 216. New total = 13 x 20 = 260. Added number = 44.' },
          { question: 'Water is mixed with milk costing Rs 30 per litre. A mixture worth Rs 24 per litre is formed. Ratio of milk : water is:', options: ['4 : 1', '3 : 1', '5 : 1', '1 : 4'], answer_index: 0, explanation: 'Alligation with water at Rs 0 gives milk : water = 24 : 6 = 4 : 1.' },
          { question: 'Two varieties of rice at Rs 40 and Rs 28 are mixed to get a mean price of Rs 34. Ratio is:', options: ['1 : 1', '2 : 1', '1 : 2', '3 : 2'], answer_index: 0, explanation: 'Difference from mean is 6 and 6, so ratio = 1 : 1.' },
          { question: 'The average age of 5 boys is 16 years. If the teacher is included, the average becomes 20 years. Teacher age is:', options: ['36', '38', '40', '42'], answer_index: 2, explanation: 'Old total = 80. New total = 120. Teacher age = 40.' },
          { question: 'A vessel contains 60 litres milk. 12 litres are removed and replaced with water. Milk left is:', options: ['40.8', '42', '44', '48'], answer_index: 3, explanation: 'Milk left = 60 x (48/60) = 48 litres.' },
        ],
      },
    },
  },
  {
    track_id: 'tnpsc_group4',
    day_number: 25,
    topic_title: 'GS ரிவிஷன்: அறிவியல் (Physics + Chemistry + Biology)',
    content_json: {
      topic_title: 'GS ரிவிஷன்: அறிவியல் (Physics + Chemistry + Biology)',
      day_number: 25,
      track: 'tnpsc_group4',
      snapshot: {
        quick_notes: [
          { title: 'இயற்பியல் மீள்பார்வு', detail: 'விசை, வேகம், வேலை, ஆற்றல், மின்னோட்டம் போன்ற அடிப்படை கருத்துகள் TNPSC-ல் நேரடியாக கேட்கப்படுகின்றன.' },
          { title: 'அலகு நினைவில் வைத்தல்', detail: 'வேகம் - m/s, விசை - newton, வேலை - joule, மின்னழுத்தம் - volt.' },
          { title: 'இரசாயன அடிப்படை', detail: 'அமிலம், காரம், உப்பு, கலவை, தனிமம், சேர்மம் ஆகிய வேறுபாடுகள் முக்கியம்.' },
          { title: 'உயிரியல் அடிப்படை', detail: 'செல், திசு, உறுப்பு, உறுப்பு முறை, ஒளிச்சேர்க்கை, சுவாசம் போன்றவை அடிக்கடி வருகிறது.' },
          { title: 'தமிழ் மூலம் நினைவு', detail: 'ஒரே நாளில் எல்லாவற்றையும் கற்க வேண்டாம்; முக்கிய வரையறைகள் + எடுத்துக்காட்டுகள் + ஒரு வரி வித்தியாசம் போதுமானது.' },
          { title: 'தேர்வு பாணி', detail: 'TNPSC கேள்விகள் பொதுவாக நேரடி. தவறான சொல் மாற்றம், அலகு மாற்றம், செயல்பாடு மாற்றம் ஆகியவற்றில் கவனம் வேண்டும்.' },
        ],
      },
      flashcards: [
        { front: 'வேலையின் SI அலகு', back: 'Joule' },
        { front: 'மின்னோட்ட அலகு', back: 'Ampere' },
        { front: 'அமிலத்தின் உதாரணம்', back: 'Hydrochloric acid / Citric acid' },
        { front: 'செல்லின் அடிப்படை அலகு', back: 'உயிரினத்தின் கட்டமைப்பு மற்றும் செயல்பாட்டு அலகு' },
        { front: 'ஒளிச்சேர்க்கைக்கு தேவை', back: 'சூரியஒளி + குளோரோபில் + நீர் + கார்பன் டைஆக்சைடு' },
        { front: 'விசையின் அலகு', back: 'Newton' },
      ],
      videos: [
        { title: 'TNPSC அறிவியல் Full Revision Tamil', url: `${YT}tnpsc+group+4+science+revision+tamil`, summary: 'Physics, Chemistry, Biology basics with one-line TNPSC-style revision.' },
        { title: 'TNPSC அறிவியல் முக்கிய கேள்விகள்', url: `${YT}tnpsc+science+important+questions+tamil`, summary: 'Direct objective questions on units, acids-bases, cell, respiration, and photosynthesis.' },
      ],
      quiz: {
        questions: [
          { question: 'வேலையின் SI அலகு எது?', options: ['Newton', 'Joule', 'Volt', 'Watt'], answer_index: 1, explanation: 'வேலையின் அலகு Joule.' },
          { question: 'ஒளிச்சேர்க்கை நடைபெறும் தாவர உறுப்பு எது?', options: ['வேர்', 'தண்டு', 'இலை', 'மொட்டு'], answer_index: 2, explanation: 'இலையில் குளோரோபில் இருப்பதால் ஒளிச்சேர்க்கை நடைபெறும்.' },
          { question: 'அமிலம் மற்றும் காரம் இணையும் போது பொதுவாக உருவாகுவது:', options: ['உப்பு மற்றும் நீர்', 'காற்று மட்டும்', 'எண்ணெய்', 'உலோகம்'], answer_index: 0, explanation: 'Neutralization மூலம் உப்பு மற்றும் நீர் உருவாகும்.' },
          { question: 'விசையின் SI அலகு எது?', options: ['Pascal', 'Newton', 'Joule', 'Ampere'], answer_index: 1, explanation: 'விசையின் அலகு Newton.' },
          { question: 'உயிரினத்தின் கட்டமைப்பு அலகு எது?', options: ['அணு', 'மூலக்கூறு', 'செல்', 'திசு'], answer_index: 2, explanation: 'Cell is the basic structural unit of life.' },
          { question: 'மின்னோட்டத்தின் அலகு எது?', options: ['Volt', 'Ampere', 'Ohm', 'Watt'], answer_index: 1, explanation: 'Ampere is the SI unit of electric current.' },
        ],
      },
    },
  },
  {
    track_id: 'tnpsc_group4',
    day_number: 45,
    topic_title: 'மறுபரிசீலனை: Aptitude Week 3',
    content_json: {
      topic_title: 'மறுபரிசீலனை: Aptitude Week 3',
      day_number: 45,
      track: 'tnpsc_group4',
      snapshot: {
        quick_notes: [
          { title: 'சதவீதம் மீள்பார்வு', detail: '100-இல் ஒரு பகுதி என்ற பொருள். லாபம்-நஷ்டம், தள்ளுபடி, வட்டி போன்ற எல்லா பகுதிகளிலும் இது இணைகிறது.' },
          { title: 'விகிதம் மற்றும் சமவிகிதம்', detail: 'இரு அளவுகளின் ஒப்பீடு. TNPSC-ல் எளிய எண்ணியல் மாற்றங்கள் அதிகம்.' },
          { title: 'லாபம்-நஷ்டம்', detail: 'Profit = SP - CP, Loss = CP - SP. சதவீதத்தை அடிப்படையில் மாற்றாமல் விடாதீர்கள்.' },
          { title: 'நேரம்-வேலை', detail: 'ஒரு நாள் வேலை திறனை வைத்தே கணக்கு வேகமாக முடியும்.' },
          { title: 'சராசரி', detail: 'Average = Total / Number. குழு எண்ணிக்கை மாறினால் total-ஐ மீண்டும் அமைக்க வேண்டும்.' },
          { title: 'Week 3 நோக்கம்', detail: 'இந்த நாள் ஒவ்வொரு formula-வையும் மனப்பாடம் செய்வதற்காக அல்ல; எந்தக் கேள்விக்கு எந்த formula பயன்படுத்துவது என்ற தெளிவு பெறுவதற்காக.' },
        ],
      },
      flashcards: [
        { front: 'Profit', back: 'SP - CP' },
        { front: 'Loss', back: 'CP - SP' },
        { front: 'Average', back: 'Total / Number' },
        { front: 'Percentage', back: 'Per hundred' },
        { front: 'Work', back: 'Rate x Time' },
        { front: 'Ratio', back: 'Comparison of two like quantities' },
      ],
      videos: [
        { title: 'TNPSC Aptitude Revision Tamil', url: `${YT}tnpsc+aptitude+revision+tamil`, summary: 'Fast review of percentage, ratio, average, work, and profit-loss for Group 4.' },
        { title: 'TNPSC Aptitude Expected Questions Tamil', url: `${YT}tnpsc+group+4+aptitude+questions+tamil`, summary: 'Objective questions with direct TNPSC-style solving patterns.' },
      ],
      quiz: {
        questions: [
          { question: 'சராசரி = ?', options: ['மொத்தம் / எண்ணிக்கை', 'எண்ணிக்கை / மொத்தம்', 'மொத்தம் x எண்ணிக்கை', 'எதுவும் இல்லை'], answer_index: 0, explanation: 'Average = Total / Number.' },
          { question: 'CP = 200, SP = 240 எனில் லாபம் எவ்வளவு?', options: ['20', '30', '40', '50'], answer_index: 2, explanation: 'Profit = 240 - 200 = 40.' },
          { question: '25% = ?', options: ['1/2', '1/3', '1/4', '1/5'], answer_index: 2, explanation: '25% = 25/100 = 1/4.' },
          { question: 'Work = ?', options: ['Speed x Time', 'Rate x Time', 'Distance / Time', 'Profit / Loss'], answer_index: 1, explanation: 'Work = Rate x Time.' },
          { question: 'Ratio 2:3 என்றால் மொத்த parts எத்தனை?', options: ['2', '3', '5', '6'], answer_index: 2, explanation: '2 + 3 = 5 parts.' },
          { question: '10% of 250 = ?', options: ['20', '25', '30', '35'], answer_index: 1, explanation: '10% of 250 = 25.' },
        ],
      },
    },
  },
  {
    track_id: 'tnpsc_group4',
    day_number: 47,
    topic_title: 'Full Revision: GS Science + Geography',
    content_json: {
      topic_title: 'Full Revision: GS Science + Geography',
      day_number: 47,
      track: 'tnpsc_group4',
      snapshot: {
        quick_notes: [
          { title: 'அறிவியல் பகுதி', detail: 'அலகுகள், ஒளிச்சேர்க்கை, சுவாசம், அமிலம்-காரம், மின்னோட்டம் போன்ற நேரடி facts-ஐ மறுபடியும் துல்லியமாகப் பார்க்க வேண்டும்.' },
          { title: 'புவியியல் பகுதி', detail: 'கோள்கள், அகலாங்கு-நெடாங்கு, மலை, சமவெளி, நதி, காலநிலை, இந்திய-தமிழ்நாடு புவியியல் இரண்டையும் இணைத்து பார்க்க வேண்டும்.' },
          { title: 'India + TN focus', detail: 'கங்கை, பிரம்மபுத்திரா, காவிரி, மேற்கு தொடர்ச்சி மலை, கிழக்கு தொடர்ச்சி மலை போன்ற pair-based facts நினைவில் இருக்க வேண்டும்.' },
          { title: 'Map-free recall', detail: 'வரைபடம் இல்லாமலே திசை, மாநிலம், நதி, மலைத் தொடர்பை சொல்ல முடிந்தால் இந்த பகுதி வலுப்படும்.' },
          { title: 'Exam style', detail: 'ஒரு சரியான fact + ஒரு தவறான fact சேர்த்து option கொடுப்பது வழக்கம். அரைஅறிவு போதாது.' },
          { title: 'Revision target', detail: 'இந்த நாள் broad revision அல்ல; அதிகம் கேட்கப்படும் core science + geography points-ஐ மறக்காமல் வைத்திருக்க உதவ வேண்டிய நாள்.' },
        ],
      },
      flashcards: [
        { front: 'ஒளிச்சேர்க்கை நடைபெறும் பகுதி', back: 'இலை / குளோரோபிளாஸ்ட்' },
        { front: 'மின்னோட்ட அலகு', back: 'Ampere' },
        { front: 'இந்தியாவின் நீளமான நதி', back: 'Ganga' },
        { front: 'தமிழ்நாட்டின் முக்கிய நதி', back: 'Cauvery' },
        { front: 'அகலாங்கு', back: 'Latitude' },
        { front: 'நெடாங்கு', back: 'Longitude' },
      ],
      videos: [
        { title: 'TNPSC Science Revision Tamil', url: `${YT}tnpsc+science+revision+tamil`, summary: 'High-frequency TNPSC science facts in Tamil.' },
        { title: 'TNPSC Geography Revision Tamil', url: `${YT}tnpsc+geography+revision+tamil`, summary: 'India and Tamil Nadu geography revision with one-line factual recall.' },
      ],
      quiz: {
        questions: [
          { question: 'அகலாங்கின் ஆங்கில பெயர் எது?', options: ['Longitude', 'Latitude', 'Altitude', 'Magnitude'], answer_index: 1, explanation: 'Latitude = அகலாங்கு.' },
          { question: 'தமிழ்நாட்டின் முக்கிய நதி எது?', options: ['கோதாவரி', 'காவிரி', 'நர்மதா', 'தாப்தி'], answer_index: 1, explanation: 'காவிரி தமிழ்நாட்டின் முக்கிய நதி.' },
          { question: 'ஒளிச்சேர்க்கைக்கு அத்தியாவசியமானது எது?', options: ['ஆக்சிஜன் மட்டும்', 'சூரியஒளி', 'நைட்ரஜன் மட்டும்', 'மணல்'], answer_index: 1, explanation: 'Sunlight is essential for photosynthesis.' },
          { question: 'மின்னோட்டத்தின் SI அலகு எது?', options: ['Volt', 'Ohm', 'Ampere', 'Watt'], answer_index: 2, explanation: 'Electric current is measured in ampere.' },
          { question: 'நெடாங்கு என்றால்?', options: ['Latitude', 'Longitude', 'Plateau', 'Delta'], answer_index: 1, explanation: 'Longitude = நெடாங்கு.' },
          { question: 'இந்தியாவின் நீளமான நதி எது?', options: ['காவிரி', 'யமுனா', 'கங்கை', 'பெரியாறு'], answer_index: 2, explanation: 'Ganga is the longest river in India.' },
        ],
      },
    },
  },
  {
    track_id: 'tnpsc_group4',
    day_number: 54,
    topic_title: 'Final Mixed Mock + Confidence Boost',
    content_json: {
      topic_title: 'Final Mixed Mock + Confidence Boost',
      day_number: 54,
      track: 'tnpsc_group4',
      snapshot: {
        quick_notes: [
          { title: 'இறுதி நாள் அணுகுமுறை', detail: 'புதிய பாடம் தொடங்க வேண்டாம். ஏற்கனவே பார்த்த core facts, formula, Tamil qualification points மட்டுமே பார்க்க வேண்டும்.' },
          { title: 'தமிழ் தகுதி recap', detail: 'இணைச்சொல், எதிர்சொல், இலக்கணம், காலம், பொருத்தம் போன்றவற்றை வேகமாக மீள்பார்க்க வேண்டும்.' },
          { title: 'GS recap', detail: 'அரசியல், வரலாறு, பொருளாதாரம், அறிவியல், புவியியல் ஆகியவற்றின் direct facts-ஐ மட்டும் திரும்ப பார்க்க வேண்டும்.' },
          { title: 'Aptitude recap', detail: 'Percentage, ratio, average, profit-loss, time-work, simple interest ஆகிய அடிப்படை formula-கள் போதுமானது.' },
          { title: 'Question attempt order', detail: 'நிச்சயமாக தெரிந்த கேள்விகளை முதலில் செய்யுங்கள். நேரம் எடுத்துக் கொள்ளும் கேள்விகளில் ஆரம்பத்திலேயே சிக்கிக்கொள்ள வேண்டாம்.' },
          { title: 'இந்த நாள் value', detail: 'இந்த இறுதி நாள் loose motivation க்காக அல்ல; தேர்வுக்கு முன் recall சரியாக உள்ளதா என்பதை உறுதி செய்யும் day ஆக இருக்க வேண்டும்.' },
        ],
      },
      flashcards: [
        { front: '25%', back: '1/4' },
        { front: 'காவிரி', back: 'தமிழ்நாட்டின் முக்கிய நதி' },
        { front: 'அடிப்படை உரிமைகள் எங்கு?', back: 'இந்திய அரசியலமைப்பு' },
        { front: 'Average', back: 'Total / Number' },
        { front: 'ஒளிச்சேர்க்கை', back: 'சூரியஒளி + நீர் + கார்பன் டைஆக்சைடு' },
        { front: 'இணைச்சொல்', back: 'அர்த்தம் ஒத்த சொல்' },
      ],
      videos: [
        { title: 'TNPSC Group 4 Final Revision Tamil', url: `${YT}tnpsc+group+4+final+revision+tamil`, summary: 'Last-day factual revision for Tamil, GS, and aptitude.' },
        { title: 'TNPSC Group 4 Mixed Mock Discussion Tamil', url: `${YT}tnpsc+group+4+mixed+mock+tamil`, summary: 'Final mixed-question review before the exam.' },
      ],
      quiz: {
        questions: [
          { question: '25% = ?', options: ['1/2', '1/3', '1/4', '1/5'], answer_index: 2, explanation: '25% = 1/4.' },
          { question: 'தமிழ்நாட்டின் முக்கிய நதி எது?', options: ['கங்கை', 'காவிரி', 'நர்மதா', 'சிந்து'], answer_index: 1, explanation: 'காவிரி தமிழ்நாட்டின் முக்கிய நதி.' },
          { question: 'Average formula எது?', options: ['Total / Number', 'Number / Total', 'Total x Number', 'Difference / Number'], answer_index: 0, explanation: 'Average = Total / Number.' },
          { question: 'ஒளிச்சேர்க்கைக்கு தேவைப்படாதது எது?', options: ['சூரியஒளி', 'நீர்', 'கார்பன் டைஆக்சைடு', 'பிளாஸ்டிக்'], answer_index: 3, explanation: 'Plastic is not required for photosynthesis.' },
          { question: 'இணைச்சொல் என்றால்?', options: ['எதிர் அர்த்தம்', 'ஒத்த அர்த்தம்', 'எண்', 'வினைச்சொல் மட்டும்'], answer_index: 1, explanation: 'Synonym means similar meaning.' },
          { question: 'அரசியலமைப்பில் அடிப்படை உரிமைகள் தொடர்பான கேள்விகள் எந்தப் பகுதியில் வருகிறது?', options: ['Polity', 'Geography', 'Chemistry', 'Grammar'], answer_index: 0, explanation: 'Fundamental rights belong to polity.' },
        ],
      },
    },
  },
  {
    track_id: 'ssc_cgl_tier1',
    day_number: 31,
    topic_title: 'Simple & Compound Interest',
    content_json: {
      topic_title: 'Simple & Compound Interest',
      day_number: 31,
      track: 'ssc_cgl_tier1',
      snapshot: {
        quick_notes: [
          { title: 'Simple interest rule', detail: 'SI = (P x R x T) / 100. Amount = Principal + SI.' },
          { title: 'Compound interest rule', detail: 'CI compounds on previous amount, not just original principal.' },
          { title: 'One-year gap trick', detail: 'Difference between CI and SI appears most clearly in 2-year and 3-year questions.' },
          { title: 'Two-year difference', detail: 'For 2 years, CI - SI = P x (R/100)^2.' },
          { title: 'Half-yearly compounding', detail: 'Rate becomes half and time becomes double.' },
          { title: 'Common SSC trap', detail: 'Do not mix up amount and interest. Many options hide the right amount when the question asks only interest.' },
        ],
      },
      flashcards: [
        { front: 'SI formula', back: '(P x R x T) / 100' },
        { front: 'Amount under SI', back: 'Principal + Simple Interest' },
        { front: 'For half-yearly CI', back: 'Use R/2 and 2T' },
        { front: 'CI is always compared on what base?', back: 'The growing amount after each period' },
        { front: '2-year CI - SI difference depends on', back: 'Principal and square of rate' },
        { front: 'When annual rate is 10%, 2-year CI factor', back: '1.10 x 1.10 = 1.21' },
      ],
      videos: [
        { title: 'SSC CGL Simple Interest Fast Questions', url: `${YT}ssc+cgl+simple+interest+questions`, summary: 'Direct SI calculation, missing principal/rate/time, and option elimination.' },
        { title: 'Compound Interest for SSC in 30 Minutes', url: `${YT}ssc+cgl+compound+interest+tricks`, summary: 'Annual and half-yearly compounding with short-cut differences between CI and SI.' },
      ],
      quiz: {
        questions: [
          { question: 'Find SI on Rs 2400 at 10% for 3 years.', options: ['Rs 600', 'Rs 720', 'Rs 800', 'Rs 840'], answer_index: 1, explanation: 'SI = 2400 x 10 x 3 / 100 = 720.' },
          { question: 'If SI on a sum for 4 years at 5% is Rs 200, principal is:', options: ['Rs 800', 'Rs 1000', 'Rs 1200', 'Rs 1500'], answer_index: 1, explanation: 'P = 200 x 100 / (5 x 4) = 1000.' },
          { question: 'Amount on Rs 1000 at 10% CI for 2 years is:', options: ['Rs 1190', 'Rs 1200', 'Rs 1210', 'Rs 1220'], answer_index: 2, explanation: '1000 x 1.1 x 1.1 = 1210.' },
          { question: 'Difference between CI and SI on Rs 2000 for 2 years at 10% is:', options: ['Rs 10', 'Rs 20', 'Rs 25', 'Rs 40'], answer_index: 1, explanation: 'Difference = 2000 x (10/100)^2 = 20.' },
          { question: 'A sum doubles itself in 10 years at SI. In how many years will it become 1.5 times?', options: ['4', '5', '6', '7'], answer_index: 1, explanation: '100% gain in 10 years, so 50% gain in 5 years.' },
          { question: 'At 8% compounded half-yearly for 1 year, effective factor is:', options: ['1.08', '1.0816', '1.084', '1.16'], answer_index: 1, explanation: 'Use 4% twice: 1.04 x 1.04 = 1.0816.' },
        ],
      },
    },
  },
  {
    track_id: 'ssc_cgl_tier1',
    day_number: 45,
    topic_title: 'Para Jumbles & Sentence Rearrangement',
    content_json: {
      topic_title: 'Para Jumbles & Sentence Rearrangement',
      day_number: 45,
      track: 'ssc_cgl_tier1',
      snapshot: {
        quick_notes: [
          { title: 'Start sentence clue', detail: 'The opening line usually introduces the subject cleanly and avoids pronouns like he, she, it, they, this.' },
          { title: 'Pronoun dependency', detail: 'A sentence beginning with this, that, these, such, he, or they usually cannot open the para.' },
          { title: 'Cause-result order', detail: 'Events and ideas often move from cause to effect, problem to solution, or general to specific.' },
          { title: 'Mandatory pair', detail: 'Look for two lines that share a strong connector: article-noun, claim-example, question-answer, or contrast.' },
          { title: 'Connector logic', detail: 'Words like however, therefore, meanwhile, finally, for example almost always depend on a previous line.' },
          { title: 'SSC habit', detail: 'Do not over-read. In SSC, the right order is usually visible through logic and connector clues rather than literary style.' },
        ],
      },
      flashcards: [
        { front: 'Best opening sentence usually has', back: 'A fresh subject introduction and no backward reference' },
        { front: 'This/that/these/such often indicate', back: 'The sentence depends on an earlier idea' },
        { front: 'However usually signals', back: 'Contrast with the previous sentence' },
        { front: 'For example usually follows', back: 'A general statement or claim' },
        { front: 'Mandatory pair means', back: 'Two lines that almost certainly stay together in order' },
        { front: 'Safe SSC order pattern', back: 'Introduce topic -> develop idea -> example/result -> conclusion' },
      ],
      videos: [
        { title: 'SSC Para Jumbles Logic-Based Approach', url: `${YT}ssc+para+jumbles+sentence+rearrangement`, summary: 'Focus on opening sentence, connectors, pronoun dependency, and mandatory pairs.' },
        { title: 'SSC English Rearrangement PYQ Practice', url: `${YT}ssc+english+sentence+rearrangement+pyq`, summary: 'Exam-style para ordering with quick reasoning rather than grammar filler.' },
      ],
      quiz: {
        questions: [
          { question: 'Choose the best opening line in a para-jumble set:', options: ['This improved the situation quickly.', 'However, the issue remained serious.', 'Plastic waste has become a major urban problem.', 'Therefore, awareness campaigns were launched.'], answer_index: 2, explanation: 'The best opener introduces the topic directly without backward reference.' },
          { question: 'Which sentence should come after a line describing traffic congestion in cities?', options: ['For example, long commute times reduce productivity.', 'This is why no one likes winters.', 'However, mangoes are sold in summer.', 'Such was the beauty of the palace.'], answer_index: 0, explanation: 'It extends the same topic with a suitable example.' },
          { question: 'Pick the most logical order: A. This reduced attendance. B. The school shifted classes to late evening. C. Many students found the new timing inconvenient. D. Teachers reported lower participation.', options: ['B-C-A-D', 'A-B-D-C', 'C-B-A-D', 'B-A-C-D'], answer_index: 0, explanation: 'B introduces the event, C explains impact on students, A states result, D extends to teachers.' },
          { question: 'A sentence beginning with “However” generally appears:', options: ['First', 'After a contrasting statement', 'Before the title', 'Only at the end'], answer_index: 1, explanation: 'However marks contrast and needs a previous statement.' },
          { question: 'Choose the best closing line of a paragraph on water conservation:', options: ['This is the first sentence.', 'Hence, local conservation efforts must become routine civic practice.', 'For example, taps leak often.', 'Such a thing was impossible.'], answer_index: 1, explanation: 'A close should conclude the argument, not reopen it.' },
          { question: 'The pair most likely to stay together is:', options: ['A general claim + an unrelated example', 'A pronoun sentence + the noun it refers to', 'A conclusion + title', 'An idiom + synonym'], answer_index: 1, explanation: 'Reference dependency usually creates a mandatory pair.' },
        ],
      },
    },
  },
  {
    track_id: 'ssc_cgl_tier1',
    day_number: 51,
    topic_title: 'Para Jumbles & Cloze Test Revision',
    content_json: {
      topic_title: 'Para Jumbles & Cloze Test Revision',
      day_number: 51,
      track: 'ssc_cgl_tier1',
      snapshot: {
        quick_notes: [
          { title: 'Para-jumble revision focus', detail: 'Revise opener clues, pronoun dependency, connectors, and conclusion logic.' },
          { title: 'Cloze test focus', detail: 'Read for meaning first, then grammar. Context decides the word more often than vocabulary glamour.' },
          { title: 'Tense consistency', detail: 'In cloze tests, nearby verbs usually reveal the right tense and form.' },
          { title: 'Preposition pairing', detail: 'Look for standard combinations: depend on, consist of, comply with, aware of.' },
          { title: 'Article and determiner check', detail: 'A/an/the, this/that, some/any often eliminate two options immediately.' },
          { title: 'Revision objective', detail: 'This day should sharpen decision speed in English, not turn into broad vocabulary revision.' },
        ],
      },
      flashcards: [
        { front: 'Best para-jumble opener', back: 'Independent sentence introducing the topic clearly' },
        { front: 'Cloze test first step', back: 'Read the full sentence for meaning before choosing a word' },
        { front: 'Depend ___', back: 'on' },
        { front: 'Consist ___', back: 'of' },
        { front: 'A/an choice depends on', back: 'Sound, not just first letter' },
        { front: 'In cloze test, eliminate using', back: 'Meaning + grammar + collocation' },
      ],
      videos: [
        { title: 'SSC Cloze Test with Context Logic', url: `${YT}ssc+cloze+test+context+logic`, summary: 'Context, tense, preposition, and article-based elimination for SSC English.' },
        { title: 'SSC Para Jumbles Revision Set', url: `${YT}ssc+para+jumbles+revision+set`, summary: 'Fast revision for sentence order, connectors, and pair logic before mocks.' },
      ],
      quiz: {
        questions: [
          { question: 'Choose the correct word: The committee decided to ___ the proposal after discussion.', options: ['approve', 'approval', 'approvedly', 'approving'], answer_index: 0, explanation: 'After “to”, base verb is required.' },
          { question: 'Choose the correct preposition: She is aware ___ the consequences.', options: ['for', 'with', 'of', 'at'], answer_index: 2, explanation: 'Standard usage is aware of.' },
          { question: 'Pick the best opener in a sentence arrangement set.', options: ['This was a turning point.', 'As a result, sales improved.', 'The company launched a low-cost model in rural markets.', 'However, some dealers resisted the move.'], answer_index: 2, explanation: 'It introduces the subject directly.' },
          { question: 'Choose the correct article: He is ___ honest officer.', options: ['a', 'an', 'the', 'no article'], answer_index: 1, explanation: 'Honest begins with vowel sound.' },
          { question: 'In a cloze test, which is the strongest clue?', options: ['Random memory', 'Only dictionary meaning', 'Nearby context and grammar', 'Length of the option'], answer_index: 2, explanation: 'Context with grammar is the safest decision method.' },
          { question: 'Choose the most logical order: A. As a result, attendance improved. B. The school introduced weekly doubt sessions. C. Students felt more confident before tests. D. Teachers noticed fewer blank answer sheets.', options: ['B-C-A-D', 'A-B-C-D', 'C-B-D-A', 'B-A-C-D'], answer_index: 0, explanation: 'B starts, C shows effect on students, A general result, D observed outcome.' },
        ],
      },
    },
  },
  {
    track_id: 'tnpsc_group4',
    day_number: 25,
    topic_title: 'GS ரிவிஷன்: அறிவியல் (Physics + Chemistry + Biology)',
    content_json: {
      topic_title: 'GS ரிவிஷன்: அறிவியல் (Physics + Chemistry + Biology)',
      day_number: 25,
      track: 'tnpsc_group4',
      snapshot: {
        quick_notes: [
          { title: 'இயற்பியல் மீள்பார்வு', detail: 'விசை, வேகம், வேலை, ஆற்றல், மின்னோட்டம் போன்ற அடிப்படை கருத்துகள் TNPSC-ல் நேரடியாக கேட்கப்படுகின்றன.' },
          { title: 'அலகு நினைவில் வைத்தல்', detail: 'வேகம் - m/s, விசை - newton, வேலை - joule, மின்னழுத்தம் - volt.' },
          { title: 'இரசாயன அடிப்படை', detail: 'அமிலம், காரம், உப்பு, கலவை, தனிமம், சேர்மம் ஆகிய வேறுபாடுகள் முக்கியம்.' },
          { title: 'உயிரியல் அடிப்படை', detail: 'செல், திசு, உறுப்பு, உறுப்பு முறை, ஒளிச்சேர்க்கை, சுவாசம் போன்றவை அடிக்கடி வருகிறது.' },
          { title: 'தமிழ் மூலம் நினைவு', detail: 'ஒரே நாளில் எல்லாவற்றையும் கற்க வேண்டாம்; முக்கிய வரையறைகள் + எடுத்துக்காட்டுகள் + ஒரு வரி வித்தியாசம் போதுமானது.' },
          { title: 'தேர்வு பாணி', detail: 'TNPSC கேள்விகள் பொதுவாக நேரடி. தவறான சொல் மாற்றம், அலகு மாற்றம், செயல்பாடு மாற்றம் ஆகியவற்றில் கவனம் வேண்டும்.' },
        ],
      },
      flashcards: [
        { front: 'வேலையின் SI அலகு', back: 'Joule' },
        { front: 'மின்னோட்ட அலகு', back: 'Ampere' },
        { front: 'அமிலத்தின் உதாரணம்', back: 'Hydrochloric acid / Citric acid' },
        { front: 'செல்லின் அடிப்படை அலகு', back: 'உயிரினத்தின் கட்டமைப்பு மற்றும் செயல்பாட்டு அலகு' },
        { front: 'ஒளிச்சேர்க்கைக்கு தேவை', back: 'சூரியஒளி + குளோரோபில் + நீர் + கார்பன் டைஆக்சைடு' },
        { front: 'விசையின் அலகு', back: 'Newton' },
      ],
      videos: [
        { title: 'TNPSC அறிவியல் Full Revision Tamil', url: `${YT}tnpsc+group+4+science+revision+tamil`, summary: 'Physics, Chemistry, Biology basics with one-line TNPSC-style revision.' },
        { title: 'TNPSC அறிவியல் முக்கிய கேள்விகள்', url: `${YT}tnpsc+science+important+questions+tamil`, summary: 'Direct objective questions on units, acids-bases, cell, respiration, and photosynthesis.' },
      ],
      quiz: {
        questions: [
          { question: 'வேலையின் SI அலகு எது?', options: ['Newton', 'Joule', 'Volt', 'Watt'], answer_index: 1, explanation: 'வேலையின் அலகு Joule.' },
          { question: 'ஒளிச்சேர்க்கை நடைபெறும் தாவர உறுப்பு எது?', options: ['வேர்', 'தண்டு', 'இலை', 'மொட்டு'], answer_index: 2, explanation: 'இலையில் குளோரோபில் இருப்பதால் ஒளிச்சேர்க்கை நடைபெறும்.' },
          { question: 'அமிலம் மற்றும் காரம் இணையும் போது பொதுவாக உருவாகுவது:', options: ['உப்பு மற்றும் நீர்', 'காற்று மட்டும்', 'எண்ணெய்', 'உலோகம்'], answer_index: 0, explanation: 'Neutralization மூலம் உப்பு மற்றும் நீர் உருவாகும்.' },
          { question: 'விசையின் SI அலகு எது?', options: ['Pascal', 'Newton', 'Joule', 'Ampere'], answer_index: 1, explanation: 'விசையின் அலகு Newton.' },
          { question: 'உயிரினத்தின் கட்டமைப்பு அலகு எது?', options: ['அணு', 'மூலக்கூறு', 'செல்', 'திசு'], answer_index: 2, explanation: 'Cell is the basic structural unit of life.' },
          { question: 'மின்னோட்டத்தின் அலகு எது?', options: ['Volt', 'Ampere', 'Ohm', 'Watt'], answer_index: 1, explanation: 'Ampere is the SI unit of electric current.' },
        ],
      },
    },
  },
  {
    track_id: 'tnpsc_group4',
    day_number: 45,
    topic_title: 'மறுபரிசீலனை: Aptitude Week 3',
    content_json: {
      topic_title: 'மறுபரிசீலனை: Aptitude Week 3',
      day_number: 45,
      track: 'tnpsc_group4',
      snapshot: {
        quick_notes: [
          { title: 'சதவீதம் மீள்பார்வு', detail: '100-இல் ஒரு பகுதி என்ற பொருள். லாபம்-நஷ்டம், தள்ளுபடி, வட்டி போன்ற எல்லா பகுதிகளிலும் இது இணைகிறது.' },
          { title: 'விகிதம் மற்றும் சமவிகிதம்', detail: 'இரு அளவுகளின் ஒப்பீடு. TNPSC-ல் எளிய எண்ணியல் மாற்றங்கள் அதிகம்.' },
          { title: 'லாபம்-நஷ்டம்', detail: 'Profit = SP - CP, Loss = CP - SP. சதவீதத்தை அடிப்படையில் மாற்றாமல் விடாதீர்கள்.' },
          { title: 'நேரம்-வேலை', detail: 'ஒரு நாள் வேலை திறனை வைத்தே கணக்கு வேகமாக முடியும்.' },
          { title: 'சராசரி', detail: 'Average = Total / Number. குழு எண்ணிக்கை மாறினால் total-ஐ மீண்டும் அமைக்க வேண்டும்.' },
          { title: 'Week 3 நோக்கம்', detail: 'இந்த நாள் ஒவ்வொரு formula-வையும் மனப்பாடம் செய்வதற்காக அல்ல; எந்தக் கேள்விக்கு எந்த formula பயன்படுத்துவது என்ற தெளிவு பெறுவதற்காக.' },
        ],
      },
      flashcards: [
        { front: 'Profit', back: 'SP - CP' },
        { front: 'Loss', back: 'CP - SP' },
        { front: 'Average', back: 'Total / Number' },
        { front: 'Percentage', back: 'Per hundred' },
        { front: 'Work', back: 'Rate x Time' },
        { front: 'Ratio', back: 'Comparison of two like quantities' },
      ],
      videos: [
        { title: 'TNPSC Aptitude Revision Tamil', url: `${YT}tnpsc+aptitude+revision+tamil`, summary: 'Fast review of percentage, ratio, average, work, and profit-loss for Group 4.' },
        { title: 'TNPSC Aptitude Expected Questions Tamil', url: `${YT}tnpsc+group+4+aptitude+questions+tamil`, summary: 'Objective questions with direct TNPSC-style solving patterns.' },
      ],
      quiz: {
        questions: [
          { question: 'சராசரி = ?', options: ['மொத்தம் / எண்ணிக்கை', 'எண்ணிக்கை / மொத்தம்', 'மொத்தம் x எண்ணிக்கை', 'எதுவும் இல்லை'], answer_index: 0, explanation: 'Average = Total / Number.' },
          { question: 'CP = 200, SP = 240 எனில் லாபம் எவ்வளவு?', options: ['20', '30', '40', '50'], answer_index: 2, explanation: 'Profit = 240 - 200 = 40.' },
          { question: '25% = ?', options: ['1/2', '1/3', '1/4', '1/5'], answer_index: 2, explanation: '25% = 25/100 = 1/4.' },
          { question: 'Work = ?', options: ['Speed x Time', 'Rate x Time', 'Distance / Time', 'Profit / Loss'], answer_index: 1, explanation: 'Work = Rate x Time.' },
          { question: 'Ratio 2:3 என்றால் மொத்த parts எத்தனை?', options: ['2', '3', '5', '6'], answer_index: 2, explanation: '2 + 3 = 5 parts.' },
          { question: '10% of 250 = ?', options: ['20', '25', '30', '35'], answer_index: 1, explanation: '10% of 250 = 25.' },
        ],
      },
    },
  },
  {
    track_id: 'tnpsc_group4',
    day_number: 47,
    topic_title: 'Full Revision: GS Science + Geography',
    content_json: {
      topic_title: 'Full Revision: GS Science + Geography',
      day_number: 47,
      track: 'tnpsc_group4',
      snapshot: {
        quick_notes: [
          { title: 'அறிவியல் பகுதி', detail: 'அலகுகள், ஒளிச்சேர்க்கை, சுவாசம், அமிலம்-காரம், மின்னோட்டம் போன்ற நேரடி facts-ஐ மறுபடியும் துல்லியமாகப் பார்க்க வேண்டும்.' },
          { title: 'புவியியல் பகுதி', detail: 'கோள்கள், அகலாங்கு-நெடாங்கு, மலை, சமவெளி, நதி, காலநிலை, இந்திய-தமிழ்நாடு புவியியல் இரண்டையும் இணைத்து பார்க்க வேண்டும்.' },
          { title: 'India + TN focus', detail: 'கங்கை, பிரம்மபுத்திரா, காவிரி, மேற்கு தொடர்ச்சி மலை, கிழக்கு தொடர்ச்சி மலை போன்ற pair-based facts நினைவில் இருக்க வேண்டும்.' },
          { title: 'Map-free recall', detail: 'வரைபடம் இல்லாமலே திசை, மாநிலம், நதி, மலைத் தொடர்பை சொல்ல முடிந்தால் இந்த பகுதி வலுப்படும்.' },
          { title: 'Exam style', detail: 'ஒரு சரியான fact + ஒரு தவறான fact சேர்த்து option கொடுப்பது வழக்கம். அரைஅறிவு போதாது.' },
          { title: 'Revision target', detail: 'இந்த நாள் broad revision அல்ல; அதிகம் கேட்கப்படும் core science + geography points-ஐ மறக்காமல் வைத்திருக்க உதவ வேண்டிய நாள்.' },
        ],
      },
      flashcards: [
        { front: 'ஒளிச்சேர்க்கை நடைபெறும் பகுதி', back: 'இலை / குளோரோபிளாஸ்ட்' },
        { front: 'மின்னோட்ட அலகு', back: 'Ampere' },
        { front: 'இந்தியாவின் நீளமான நதி', back: 'Ganga' },
        { front: 'தமிழ்நாட்டின் முக்கிய நதி', back: 'Cauvery' },
        { front: 'அகலாங்கு', back: 'Latitude' },
        { front: 'நெடாங்கு', back: 'Longitude' },
      ],
      videos: [
        { title: 'TNPSC Science Revision Tamil', url: `${YT}tnpsc+science+revision+tamil`, summary: 'High-frequency TNPSC science facts in Tamil.' },
        { title: 'TNPSC Geography Revision Tamil', url: `${YT}tnpsc+geography+revision+tamil`, summary: 'India and Tamil Nadu geography revision with one-line factual recall.' },
      ],
      quiz: {
        questions: [
          { question: 'அகலாங்கின் ஆங்கில பெயர் எது?', options: ['Longitude', 'Latitude', 'Altitude', 'Magnitude'], answer_index: 1, explanation: 'Latitude = அகலாங்கு.' },
          { question: 'தமிழ்நாட்டின் முக்கிய நதி எது?', options: ['கோதாவரி', 'காவிரி', 'நர்மதா', 'தாப்தி'], answer_index: 1, explanation: 'காவிரி தமிழ்நாட்டின் முக்கிய நதி.' },
          { question: 'ஒளிச்சேர்க்கைக்கு அத்தியாவசியமானது எது?', options: ['ஆக்சிஜன் மட்டும்', 'சூரியஒளி', 'நைட்ரஜன் மட்டும்', 'மணல்'], answer_index: 1, explanation: 'Sunlight is essential for photosynthesis.' },
          { question: 'மின்னோட்டத்தின் SI அலகு எது?', options: ['Volt', 'Ohm', 'Ampere', 'Watt'], answer_index: 2, explanation: 'Electric current is measured in ampere.' },
          { question: 'நெடாங்கு என்றால்?', options: ['Latitude', 'Longitude', 'Plateau', 'Delta'], answer_index: 1, explanation: 'Longitude = நெடாங்கு.' },
          { question: 'இந்தியாவின் நீளமான நதி எது?', options: ['காவிரி', 'யமுனா', 'கங்கை', 'பெரியாறு'], answer_index: 2, explanation: 'Ganga is the longest river in India.' },
        ],
      },
    },
  },
  {
    track_id: 'tnpsc_group4',
    day_number: 54,
    topic_title: 'Final Mixed Mock + Confidence Boost',
    content_json: {
      topic_title: 'Final Mixed Mock + Confidence Boost',
      day_number: 54,
      track: 'tnpsc_group4',
      snapshot: {
        quick_notes: [
          { title: 'இறுதி நாள் அணுகுமுறை', detail: 'புதிய பாடம் தொடங்க வேண்டாம். ஏற்கனவே பார்த்த core facts, formula, Tamil qualification points மட்டுமே பார்க்க வேண்டும்.' },
          { title: 'தமிழ் தகுதி recap', detail: 'இணைச்சொல், எதிர்சொல், இலக்கணம், காலம், பொருத்தம் போன்றவற்றை வேகமாக மீள்பார்க்க வேண்டும்.' },
          { title: 'GS recap', detail: 'அரசியல், வரலாறு, பொருளாதாரம், அறிவியல், புவியியல் ஆகியவற்றின் direct facts-ஐ மட்டும் திரும்ப பார்க்க வேண்டும்.' },
          { title: 'Aptitude recap', detail: 'Percentage, ratio, average, profit-loss, time-work, simple interest ஆகிய அடிப்படை formula-கள் போதுமானது.' },
          { title: 'Question attempt order', detail: 'நிச்சயமாக தெரிந்த கேள்விகளை முதலில் செய்யுங்கள். நேரம் எடுத்துக் கொள்ளும் கேள்விகளில் ஆரம்பத்திலேயே சிக்கிக்கொள்ள வேண்டாம்.' },
          { title: 'இந்த நாள் value', detail: 'இந்த இறுதி நாள் loose motivation க்காக அல்ல; தேர்வுக்கு முன் recall சரியாக உள்ளதா என்பதை உறுதி செய்யும் day ஆக இருக்க வேண்டும்.' },
        ],
      },
      flashcards: [
        { front: '25%', back: '1/4' },
        { front: 'காவிரி', back: 'தமிழ்நாட்டின் முக்கிய நதி' },
        { front: 'அடிப்படை உரிமைகள் எங்கு?', back: 'இந்திய அரசியலமைப்பு' },
        { front: 'Average', back: 'Total / Number' },
        { front: 'ஒளிச்சேர்க்கை', back: 'சூரியஒளி + நீர் + கார்பன் டைஆக்சைடு' },
        { front: 'இணைச்சொல்', back: 'அர்த்தம் ஒத்த சொல்' },
      ],
      videos: [
        { title: 'TNPSC Group 4 Final Revision Tamil', url: `${YT}tnpsc+group+4+final+revision+tamil`, summary: 'Last-day factual revision for Tamil, GS, and aptitude.' },
        { title: 'TNPSC Group 4 Mixed Mock Discussion Tamil', url: `${YT}tnpsc+group+4+mixed+mock+tamil`, summary: 'Final mixed-question review before the exam.' },
      ],
      quiz: {
        questions: [
          { question: '25% = ?', options: ['1/2', '1/3', '1/4', '1/5'], answer_index: 2, explanation: '25% = 1/4.' },
          { question: 'தமிழ்நாட்டின் முக்கிய நதி எது?', options: ['கங்கை', 'காவிரி', 'நர்மதா', 'சிந்து'], answer_index: 1, explanation: 'காவிரி தமிழ்நாட்டின் முக்கிய நதி.' },
          { question: 'Average formula எது?', options: ['Total / Number', 'Number / Total', 'Total x Number', 'Difference / Number'], answer_index: 0, explanation: 'Average = Total / Number.' },
          { question: 'ஒளிச்சேர்க்கைக்கு தேவைப்படாதது எது?', options: ['சூரியஒளி', 'நீர்', 'கார்பன் டைஆக்சைடு', 'பிளாஸ்டிக்'], answer_index: 3, explanation: 'Plastic is not required for photosynthesis.' },
          { question: 'இணைச்சொல் என்றால்?', options: ['எதிர் அர்த்தம்', 'ஒத்த அர்த்தம்', 'எண்', 'வினைச்சொல் மட்டும்'], answer_index: 1, explanation: 'Synonym means similar meaning.' },
          { question: 'அரசியலமைப்பில் அடிப்படை உரிமைகள் தொடர்பான கேள்விகள் எந்தப் பகுதியில் வருகிறது?', options: ['Polity', 'Geography', 'Chemistry', 'Grammar'], answer_index: 0, explanation: 'Fundamental rights belong to polity.' },
        ],
      },
    },
  },
  {
    track_id: 'upsc_prelims',
    day_number: 45,
    topic_title: 'Fiscal Policy & Budget',
    content_json: {
      topic_title: 'Fiscal Policy & Budget',
      day_number: 45,
      track: 'upsc_prelims',
      snapshot: {
        quick_notes: [
          { title: 'Fiscal policy meaning', detail: 'Fiscal policy is the use of government expenditure, taxation, and borrowing to influence growth, inflation, and demand.' },
          { title: 'Revenue vs capital account', detail: 'Revenue receipts do not create liabilities or reduce assets; capital receipts either create liabilities or reduce assets.' },
          { title: 'Revenue expenditure', detail: 'It does not create durable assets. Salaries, subsidies, pensions, and interest payments usually fall here.' },
          { title: 'Fiscal deficit', detail: 'Fiscal deficit shows total borrowing requirement of the government. It is broader than revenue deficit.' },
          { title: 'Primary deficit', detail: 'Primary deficit = fiscal deficit - interest payments. It isolates the burden apart from past debt servicing.' },
          { title: 'UPSC angle', detail: 'UPSC often tests classification: whether a receipt or expenditure belongs to revenue or capital, and whether a deficit measures borrowing or current imbalance.' },
        ],
      },
      flashcards: [
        { front: 'Fiscal deficit', back: 'Total expenditure - total receipts excluding borrowings' },
        { front: 'Primary deficit', back: 'Fiscal deficit - interest payments' },
        { front: 'Revenue deficit', back: 'Revenue expenditure - revenue receipts' },
        { front: 'Disinvestment proceeds', back: 'Capital receipt' },
        { front: 'Subsidy payment', back: 'Revenue expenditure' },
        { front: 'Borrowing requirement is best reflected by', back: 'Fiscal deficit' },
      ],
      videos: [
        { title: 'UPSC Fiscal Deficit and Budget Classification', url: `${YT}upsc+fiscal+deficit+budget+classification`, summary: 'Focus on revenue/capital distinction, deficit types, and statement-style prelims questions.' },
        { title: 'UPSC Budget Basics with PYQ Lens', url: `${YT}upsc+budget+basics+pyq`, summary: 'Targeted revision of deficit concepts, receipts, and expenditure heads with prelims logic.' },
      ],
      quiz: {
        questions: [
          { question: 'Which deficit best represents the total borrowing requirement of the government?', options: ['Revenue deficit', 'Primary deficit', 'Fiscal deficit', 'Budget surplus'], answer_index: 2, explanation: 'Fiscal deficit captures the borrowing requirement.' },
          { question: 'Disinvestment receipts are classified as:', options: ['Revenue receipts', 'Capital receipts', 'Revenue expenditure', 'Primary expenditure'], answer_index: 1, explanation: 'Disinvestment reduces assets and is treated as a capital receipt.' },
          { question: 'Which one of the following is revenue expenditure?', options: ['Construction of a highway', 'Purchase of machines for a PSU', 'Payment of pensions', 'Equity infusion into a corporation'], answer_index: 2, explanation: 'Pensions are revenue expenditure.' },
          { question: 'Primary deficit is equal to:', options: ['Fiscal deficit + interest payments', 'Fiscal deficit - interest payments', 'Revenue deficit - capital receipts', 'Revenue receipts - revenue expenditure'], answer_index: 1, explanation: 'Primary deficit strips out interest burden from fiscal deficit.' },
          { question: 'Consider the following: 1. Revenue receipts create liabilities. 2. Capital receipts may create liabilities. Which of the statements given above is/are correct?', options: ['1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2'], answer_index: 1, explanation: 'Revenue receipts do not create liabilities; capital receipts may.' },
          { question: 'If interest payments rise sharply while other items remain unchanged, which deficit definitely changes?', options: ['Primary deficit only', 'Fiscal deficit only', 'Both fiscal deficit and primary deficit', 'Revenue receipts'], answer_index: 2, explanation: 'Fiscal deficit rises and primary deficit also changes because interest is part of the subtraction.' },
        ],
      },
    },
  },
  {
    track_id: 'upsc_prelims',
    day_number: 46,
    topic_title: 'Banking & Financial Institutions',
    content_json: {
      topic_title: 'Banking & Financial Institutions',
      day_number: 46,
      track: 'upsc_prelims',
      snapshot: {
        quick_notes: [
          { title: 'RBI role', detail: 'RBI is the monetary authority, banker to banks, banker to government, and regulator of currency and parts of the financial system.' },
          { title: 'Repo and reverse repo', detail: 'Repo injects liquidity into banks against collateral; reverse repo absorbs liquidity from banks.' },
          { title: 'CRR vs SLR', detail: 'CRR is cash kept with RBI. SLR is liquid assets kept by banks themselves in specified form.' },
          { title: 'NPA meaning', detail: 'A loan becomes NPA when interest or principal remains overdue beyond the prescribed period.' },
          { title: 'Development finance institutions', detail: 'Institutions such as NABARD, SIDBI, EXIM Bank support sectoral credit and development, not regular retail banking.' },
          { title: 'UPSC lens', detail: 'Prelims questions usually test precise roles, liquidity effects, and institutional differences rather than broad banking theory.' },
        ],
      },
      flashcards: [
        { front: 'Repo rate effect', back: 'RBI lends to banks; liquidity enters the system' },
        { front: 'Reverse repo effect', back: 'Banks park funds with RBI; liquidity is absorbed' },
        { front: 'CRR', back: 'Cash reserve maintained with RBI' },
        { front: 'SLR', back: 'Liquid assets maintained by banks themselves' },
        { front: 'NABARD focus', back: 'Agriculture and rural development finance' },
        { front: 'SIDBI focus', back: 'Micro, small, and medium enterprise support' },
      ],
      videos: [
        { title: 'UPSC Banking Basics for Prelims', url: `${YT}upsc+banking+basics+repo+crr+slr`, summary: 'RBI functions, repo framework, CRR-SLR distinction, and NPA basics.' },
        { title: 'Financial Institutions for UPSC', url: `${YT}upsc+nabard+sidbi+exim+bank`, summary: 'Institution-specific roles that commonly appear in prelims elimination questions.' },
      ],
      quiz: {
        questions: [
          { question: 'Which of the following directly injects liquidity into the banking system?', options: ['Reverse repo', 'Repo', 'CRR increase', 'Higher SLR'], answer_index: 1, explanation: 'Repo allows banks to borrow from RBI and injects liquidity.' },
          { question: 'CRR differs from SLR because CRR is maintained:', options: ['With commercial banks themselves', 'With RBI as cash', 'Only in government securities', 'Only in gold'], answer_index: 1, explanation: 'CRR is cash reserve kept with RBI.' },
          { question: 'NABARD is primarily associated with:', options: ['Urban housing finance', 'Rural and agricultural finance', 'Stock market regulation', 'Insurance regulation'], answer_index: 1, explanation: 'NABARD focuses on agriculture and rural development.' },
          { question: 'If RBI raises CRR, the immediate effect is likely to be:', options: ['Higher lendable funds with banks', 'Reduced lendable funds with banks', 'Rise in bank capital receipts', 'Automatic fall in NPAs'], answer_index: 1, explanation: 'Higher CRR locks more cash with RBI and reduces lendable funds.' },
          { question: 'An NPA refers to a loan in which:', options: ['Collateral value is low', 'Interest or principal remains overdue beyond the prescribed period', 'Only public sector banks are involved', 'The borrower is a large company'], answer_index: 1, explanation: 'That is the core NPA condition.' },
          { question: 'Which institution is best matched correctly?', options: ['SIDBI - insurance regulation', 'EXIM Bank - external trade finance', 'NABARD - telecom credit', 'RBI - mutual fund registration only'], answer_index: 1, explanation: 'EXIM Bank supports export-import finance.' },
        ],
      },
    },
  },
  {
    track_id: 'upsc_prelims',
    day_number: 52,
    topic_title: 'Environment & Ecology Basics',
    content_json: {
      topic_title: 'Environment & Ecology Basics',
      day_number: 52,
      track: 'upsc_prelims',
      snapshot: {
        quick_notes: [
          { title: 'Ecology meaning', detail: 'Ecology studies interactions among organisms and between organisms and their environment.' },
          { title: 'Ecosystem structure', detail: 'An ecosystem includes biotic components like producers and consumers, and abiotic components like soil, water, and climate.' },
          { title: 'Food chain and food web', detail: 'Food chain is a linear feeding sequence; food web is a network of interconnected feeding relations.' },
          { title: 'Trophic level transfer', detail: 'Only a limited fraction of energy moves to the next trophic level; most is lost as heat and life processes.' },
          { title: 'Biodiversity levels', detail: 'Biodiversity may be discussed at genetic, species, and ecosystem levels.' },
          { title: 'UPSC pattern', detail: 'Questions often test conceptual distinction: habitat vs niche, food chain vs food web, in-situ vs ex-situ, producer vs decomposer.' },
        ],
      },
      flashcards: [
        { front: 'Producer', back: 'Organism that prepares food, usually through photosynthesis' },
        { front: 'Primary consumer', back: 'Herbivore feeding on producers' },
        { front: 'Food web', back: 'Interconnected network of food chains' },
        { front: 'Abiotic component', back: 'Non-living environmental factor such as water or soil' },
        { front: 'Biodiversity levels', back: 'Genetic, species, ecosystem' },
        { front: 'Habitat', back: 'Natural home of an organism' },
      ],
      videos: [
        { title: 'UPSC Ecology Basics with Prelims Concepts', url: `${YT}upsc+ecology+basics+prelims`, summary: 'Ecosystem structure, trophic levels, biodiversity levels, and common prelims distinctions.' },
        { title: 'Environment Concepts for UPSC Prelims', url: `${YT}upsc+environment+ecology+food+chain+food+web`, summary: 'Focus on ecosystem terminology and elimination between similar ecological terms.' },
      ],
      quiz: {
        questions: [
          { question: 'Which one of the following is an abiotic component of an ecosystem?', options: ['Fungi', 'Grasshopper', 'Soil moisture', 'Decomposer bacteria'], answer_index: 2, explanation: 'Soil moisture is non-living and hence abiotic.' },
          { question: 'A food web differs from a food chain because it:', options: ['Contains only producers', 'Shows interconnected feeding relationships', 'Excludes decomposers', 'Exists only in forests'], answer_index: 1, explanation: 'Food web is a network, not a single linear chain.' },
          { question: 'Which trophic level directly depends on producers for food?', options: ['Primary consumers', 'Secondary consumers', 'Top carnivores', 'Decomposers only'], answer_index: 0, explanation: 'Primary consumers feed directly on producers.' },
          { question: 'Biodiversity at the species level refers to:', options: ['Different ecosystems only', 'Variation within genes only', 'Variety of species in a region', 'Only endangered organisms'], answer_index: 2, explanation: 'Species diversity refers to variety of species.' },
          { question: 'Habitat is best understood as:', options: ['The role performed by an organism', 'The natural living place of an organism', 'Only the climatic zone of Earth', 'A food relationship chart'], answer_index: 1, explanation: 'Habitat means the natural home or physical environment.' },
          { question: 'Energy transfer between trophic levels is limited mainly because:', options: ['All energy is stored permanently', 'Most energy is lost in life processes and as heat', 'Producers consume all sunlight', 'Carnivores block transfer'], answer_index: 1, explanation: 'Energy is dissipated in metabolism and heat at each level.' },
        ],
      },
    },
  },
  {
    track_id: 'upsc_prelims',
    day_number: 54,
    topic_title: 'Climate Change Basics',
    content_json: {
      topic_title: 'Climate Change Basics',
      day_number: 54,
      track: 'upsc_prelims',
      snapshot: {
        quick_notes: [
          { title: 'Weather vs climate', detail: 'Weather is short-term atmospheric condition; climate is long-term pattern over a region.' },
          { title: 'Greenhouse effect', detail: 'Greenhouse gases trap outgoing infrared radiation and warm the lower atmosphere.' },
          { title: 'Major greenhouse gases', detail: 'Carbon dioxide, methane, nitrous oxide, water vapour, and certain industrial gases are key in climate discussions.' },
          { title: 'Global warming vs climate change', detail: 'Global warming refers to temperature rise; climate change includes broader shifts in rainfall, extreme events, sea level, and seasonal patterns.' },
          { title: 'Mitigation vs adaptation', detail: 'Mitigation reduces causes of climate change; adaptation adjusts to its impacts.' },
          { title: 'UPSC focus', detail: 'UPSC frequently asks conceptual questions on greenhouse gases, mitigation-adaptation, climate agreements, and attribution of effects.' },
        ],
      },
      flashcards: [
        { front: 'Climate', back: 'Long-term average pattern of weather' },
        { front: 'Global warming', back: 'Rise in average global temperature' },
        { front: 'Mitigation', back: 'Reducing emissions or enhancing sinks' },
        { front: 'Adaptation', back: 'Adjusting systems to climate impacts' },
        { front: 'Methane', back: 'Powerful greenhouse gas linked to agriculture, waste, and fossil fuel systems' },
        { front: 'Sea-level rise', back: 'A long-term impact associated with climate change' },
      ],
      videos: [
        { title: 'UPSC Climate Change Fundamentals', url: `${YT}upsc+climate+change+fundamentals`, summary: 'Weather-climate distinction, greenhouse gases, warming, mitigation, and adaptation.' },
        { title: 'Climate Agreements and Concepts for UPSC', url: `${YT}upsc+climate+agreements+mitigation+adaptation`, summary: 'Build conceptual clarity before moving into UNFCCC, Paris, and COP-based questions.' },
      ],
      quiz: {
        questions: [
          { question: 'Which one best distinguishes climate from weather?', options: ['Climate is local, weather is global', 'Climate is long-term pattern; weather is short-term condition', 'Climate means rainfall only', 'Weather means seasons only'], answer_index: 1, explanation: 'Climate is long-term and weather is short-term atmospheric condition.' },
          { question: 'Greenhouse warming occurs mainly because greenhouse gases:', options: ['Block all incoming sunlight', 'Trap outgoing infrared radiation', 'Destroy all clouds', 'Increase oxygen content'], answer_index: 1, explanation: 'Greenhouse gases absorb and re-radiate outgoing infrared heat.' },
          { question: 'Which of the following is an example of adaptation?', options: ['Switching to renewable energy', 'Building flood-resilient infrastructure', 'Carbon capture in industry', 'Afforestation to enhance carbon sinks'], answer_index: 1, explanation: 'Adaptation means adjusting to impacts, such as flood resilience.' },
          { question: 'Mitigation primarily aims to:', options: ['Delay exams', 'Reduce causes of climate change', 'Measure rainfall only', 'Increase humidity'], answer_index: 1, explanation: 'Mitigation targets the drivers of climate change.' },
          { question: 'Which one is a greenhouse gas?', options: ['Nitrogen', 'Argon', 'Methane', 'Neon'], answer_index: 2, explanation: 'Methane is a major greenhouse gas.' },
          { question: 'Global warming is best understood as:', options: ['Any seasonal weather variation', 'Only local heatwaves', 'Rise in average global temperature', 'Reduction in greenhouse gases'], answer_index: 2, explanation: 'That is the core meaning of global warming.' },
        ],
      },
    },
  },
];
async function main() {
  const uniquePatches = Array.from(
    new Map(patches.map((patch) => [`${patch.track_id}:${patch.day_number}`, patch])).values()
  );

  for (const patch of uniquePatches) {
    const { error } = await supabase
      .from('master_content_vault')
      .update({
        topic_title: patch.topic_title,
        content_json: patch.content_json,
        updated_at: new Date().toISOString(),
      })
      .eq('track_id', patch.track_id)
      .eq('day_number', patch.day_number);

    if (error) {
      console.error(`Failed ${patch.track_id} day ${patch.day_number}:`, error.message);
      process.exitCode = 1;
      return;
    }

    console.log(`Patched ${patch.track_id} day ${patch.day_number}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
