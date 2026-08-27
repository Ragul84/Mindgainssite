require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:18,topic:'SSC Reasoning: Blood Relations — The Family Tree',
intro:`Today we master 'Relationships'. Blood Relations is one of the most scoring chapters in SSC, but it's easy to get confused if you don't use a 'Family Tree'. In SSC, questions come in three formats: Pointing to a photograph, Statement-based, and Coded relationships (A + B means A is father of B). Toppers don't visualize the family; they draw it using standard symbols for gender and generations. Let's master the 'Tree Method' to solve any relationship puzzle in 15 seconds.`,
notes:[
{title:'Standard Symbols for Family Tree',detail:'Square/Plus (+): Male. Circle/Minus (-): Female. Horizontal Line (—): Siblings. Double Horizontal (==): Married couple. Vertical Line (|): Different generations (Father/Son).'},
{title:'Generation Gaps',detail:'Generation 0: Self, Brother, Sister, Cousin, Husband, Wife. Generation +1: Father, Mother, Uncle, Aunt. Generation +2: Grandfather, Grandmother. Generation -1: Son, Daughter, Nephew, Niece.'},
{title:'Key Terms to Remember',detail:'Paternal: From father\'s side. Maternal: From mother\'s side. Only son/daughter: No other siblings of that gender. Spouse: Husband or Wife. In-laws: Relationships through marriage.'},
{title:'Pointing to a Photo Shortcut',detail:'Start from the end of the sentence ("My mother\'s son") and work backwards. "My mother\'s only son" is ME (if male) or MY BROTHER. This eliminates confusion.'},
{title:'Coded Blood Relations',detail:'"A + B" means A is father. "A - B" means A is mother. Treat it like a math equation and substitute relationships to draw the tree.'}
],
cards:[
{front:'In-laws meaning?',back:'Relations created through marriage (e.g., Father-in-law).'},
{front:'Paternal vs Maternal?',back:'Paternal = Father\'s side. Maternal = Mother\'s side.'},
{front:'Who is a "Nephew"?',back:'Son of your brother or sister.'},
{front:'Who is a "Niece"?',back:'Daughter of your brother or sister.'},
{front:'Relationship: "Mother\'s brother\'s only daughter"?',back:'Maternal Cousin.'}
],
q:[
{q:'Pointing to a man, a woman said, "He is the only son of my mother\'s only daughter." How is the woman related to the man?',options:['Sister','Mother','Grandmother','Aunt'],ai:1,exp:'"My mother\'s only daughter" is the woman herself. The man is the "only son" of the woman. So she is the Mother.'},
{q:'A is the brother of B. C is the father of D. E is the mother of B. A and D are brothers. How is E related to C?',options:['Sister','Daughter','Wife','Cousin'],ai:2,exp:'A, B, D are siblings. E is their mother. C is D\'s father. So C and E are husband and wife.'},
{q:'If "P + Q" means P is the husband of Q; "P ÷ Q" means P is the sister of Q and "P × Q" means P is the son of Q. What does "A × B + C" mean?',options:['A is the daughter of C','A is the son of C','A is the father of C','A is the uncle of C'],ai:1,exp:'B + C means B is husband of C (so C is wife). A × B means A is son of B. Therefore, A is the son of C.'},
{q:'Introducing a girl, Rahul says, "She is the daughter of my mother\'s only child." How is the girl related to Rahul?',options:['Sister','Niece','Daughter','Aunt'],ai:2,exp:'"My mother\'s only child" is Rahul himself. The girl is the daughter of Rahul.'}
],
hook:'Draw a tree. Square=Male, Circle=Female. Horizontal=Same generation. Vertical=Next generation. Work backward for photo questions.',
summary:'Family tree symbols and generation gaps. Types of blood relation questions. Shortcut for photo-based questions. Coded relationship logic.'},

{day:19,topic:'SSC Reasoning: Direction Sense — The 8-Point Compass',
intro:`Today we master 'Orientation'. Direction Sense questions test your ability to visualize movement in space. In SSC, you'll be asked to find the final direction or the shortest distance between two points. Toppers don't just guess 'North' or 'East'; they use the 'Pythagoras Theorem' for distance and a 'Standard Compass' for direction. Let's master the 8-point compass and the 'Turning Logic' today.`,
notes:[
{title:'The 8-Point Compass',detail:'Main: North (Top), South (Bottom), East (Right), West (Left). Sub: North-East, North-West, South-East, South-West.'},
{title:'Turning Logic (Degree & Direction)',detail:'Clockwise (Right turn): 90° turn moves you to the next main direction. Anti-clockwise (Left turn): 90° turn. 180° turn means you are facing the EXACT OPPOSITE direction.'},
{title:'Shortest Distance (Pythagoras)',detail:'In a right-angled triangle, Shortest Distance (Hypotenuse)² = (Base)² + (Perpendicular)². Memory drill: Common triplets (3,4,5), (6,8,10), (5,12,13), (8,15,17).'},
{title:'Shadow Logic',detail:'In the Morning (Sunrise in East): Shadow is always in the WEST. In the Evening (Sunset in West): Shadow is always in the EAST. At 12 Noon: No shadow (Sun is overhead).'},
{title:'Left/Right Shortcut',detail:'If facing North: Left=West, Right=East. If facing South: Left=East, Right=West. (Left and Right are REVERSED when you face South!).'}
],
cards:[
{front:'Pythagoras triplets for distance?',back:'(3,4,5), (5,12,13), (8,15,17).'},
{front:'Where is the shadow at Sunset?',back:'East.'},
{front:'Where is the shadow at Sunrise?',back:'West.'},
{front:'Facing North, what is a 180° turn?',back:'Facing South.'},
{front:'Facing East, what is a 90° Clockwise turn?',back:'Facing South.'}
],
q:[
{q:'A man walks 3km North, then turns right and walks 4km. How far and in which direction is he from the starting point?',options:['5km North-East','5km East','7km North-East','5km South-East'],ai:0,exp:'Distance = √(3² + 4²) = 5km. Direction: 3 North + 4 East = North-East.'},
{q:'If South-East becomes North, North-East becomes West and so on, what will West become?',options:['North-East','South-East','South-West','North-West'],ai:1,exp:'SE to N is a 135° anti-clockwise turn. Applying same to West: West (90° AC) -> South, (45° more AC) -> South-East.'},
{q:'One morning after sunrise, Suresh was standing facing a pole. The shadow of the pole fell exactly to his right. Which direction was he facing?',options:['North','South','East','West'],ai:1,exp:'Morning shadow is in West. Shadow is to his right, so West is his right. If West is right, he is facing South.'},
{q:'A person starts from point A and walks 10m West, then turns left and walks 10m. He then turns left and walks 10m. Where is he from A?',options:['10m West','10m North','10m South','At A'],ai:2,exp:'W 10, then S 10, then E 10. He is 10m directly South of A.'}
],
hook:'N-S-E-W. Clockwise=Right, Anti=Left. Shortest dist=√(a²+b²). Triplets (3,4,5). Morning shadow=West. South facing=L/R reversed.',
summary:'8-point compass layout. Turning logic and degree calculations. Pythagoras theorem for shortest distance. Shadow logic for morning and evening. Directional mapping.'},

{day:20,topic:'SSC Reasoning: Order & Ranking — The Total Formula',
intro:`Today we master 'Positioning'. Order and Ranking questions ask you to find the total number of people in a row or the position of a person after swapping. In SSC, this is a 100% predictable chapter. Toppers don't count on fingers; they use the 'Master Formula': Total = (Position from Left + Position from Right) - 1. Why minus 1? Because you counted the same person twice! Let's master the ranking logic today.`,
notes:[
{title:'The Master Formula (Single Person)',detail:'Total = (Left Position + Right Position) - 1. Also: Left = (Total - Right) + 1. Memory tip: You always +1 or -1 because of the overlap.'},
{title:'Two Persons / Swapping Case',detail:'If A is 10th from left and B is 15th from right. They swap. Now A becomes 20th from left. Logic: The distance between A\'s old and new position is 10 units. So B\'s new position from right will be 15 + 10 = 25th.'},
{title:'Minimum vs Maximum (Overlap Case)',detail:'Maximum = Left + Right + Middle. Minimum (Overlap) = (Left + Right) - (Middle + 2). Note: Use Minimum formula only if (L+R) > (Total+2).'},
{title:'Ranking in Class',detail:'Top/Bottom is the same as Left/Right. Formula: Total = (Rank from top + Rank from bottom) - 1.'},
{title:'Finding "Between" People',detail:'Number of people between X and Y = (Total) - (X\'s rank + Y\'s rank). Only if X and Y ranks are from opposite ends and don\'t overlap.'}
],
cards:[
{front:'Master Ranking Formula?',back:'Total = (Left + Right) - 1.'},
{front:'How to find Left rank if Total and Right are known?',back:'Left = (Total - Right) + 1.'},
{front:'Why -1 in the total formula?',back:'Because the same person is counted from both the left and the right.'},
{front:'Minimum people in overlap case?',back:'(L + R) - (Middle + 2).'},
{front:'Maximum people formula?',back:'Left + Right + Middle.'}
],
q:[
{q:'In a row of 40 students, A is 13th from the left. What is his rank from the right?',options:['27th','28th','26th','29th'],ai:1,exp:'Right = (Total - Left) + 1 = (40 - 13) + 1 = 28th.'},
{q:'A is 10th from the top and B is 15th from the bottom. If there are 5 people between them, find the total number of students.',options:['30','28','25','32'],ai:0,exp:'Total = Top + Bottom + Between = 10 + 15 + 5 = 30.'},
{q:'In a row of boys, A is 7th from left and B is 9th from right. When they swap positions, A becomes 11th from left. How many boys are in the row?',options:['18','19','20','21'],ai:1,exp:'A\'s new left (11) + A\'s new right (which is B\'s old right 9) - 1 = 11 + 9 - 1 = 19.'},
{q:'Manoj is 16th from the top and 15th from the bottom in an examination. How many students are there in the class?',options:['31','30','32','29'],ai:1,exp:'Total = (16 + 15) - 1 = 30.'}
],
hook:'Total=L+R-1. Swap: New L + Old R - 1. Overlap min=(L+R)-(M+2). Top/Bottom = Left/Right. Always overlap check.',
summary:'Ranking formulas for single and multiple people. Swapping position logic. Overlap vs Non-overlap cases. Finding total and rank from opposite ends.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'ssc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ SSC Speed Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Logic Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'SSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('SSC CGL '+d.topic+' tricks'),why:'Visualizing logic for SSC speed.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | Reasoning',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'ssc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ SSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('SSC Days 18-20 v2 COMPLETE');
}
push();
