require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:85,topic:'SSC Reasoning: Coding-Decoding & Series',
intro:`Today we study the 'Code of Logic'. Coding-Decoding and Number/Letter Series are the bread and butter of SSC Reasoning. From 'Opposite letters' to 'Prime number gaps'—the patterns are fixed. Do you know the rank of 'R'? Or what is the 'EJOTY' rule? Let's master the codes today.`,
notes:[
{title:'EJOTY Rule',detail:'E=5, J=10, O=15, T=20, Y=25. Helps in finding the rank of any alphabet quickly.'},
{title:'Opposite Letters',detail:'Sum of ranks is always 27. (e.g., A=1, Z=26. 1+26=27. B=2, Y=25. 2+25=27). Pairs: AZ, BY, CX, DW, EV, FU, GT, HS, IR, JQ, KP, LO, MN.'},
{title:'Series Patterns',detail:'1. Prime numbers. 2. Squares/Cubes (+/- n). 3. Multiplication + Addition. 4. Double difference.'},
{title:'Coding Types',detail:'Letter-to-Letter, Letter-to-Number, Symbol coding. Look for shifting (+n/-n) or reversal.'},
{title:'Odd One Out',detail:'Find the element that doesn\'t fit based on squares, primes, or vowel/consonant count.'}
],
cards:[
{front:'Rank of "R"?',back:'18.'},
{front:'Opposite of "H"?',back:'S (HS - High School).'},
{front:'Rank of "K"?',back:'11 (Kings 11 Punjab).'},
{front:'EJOTY values?',back:'5, 10, 15, 20, 25.'},
{front:'Opposite of "L"?',back:'O (LO - LOVE).'}
],
q:[
{q:'If COLD is coded as DPME, how is HOT coded?',options:['IPU','GNS','IQU','INS'],ai:0,exp:'C+1=D, O+1=P, L+1=M, D+1=E. So H+1=I, O+1=P, T+1=U.'},
{q:'Find the next in series: 2, 5, 10, 17, ?',options:['24','26','25','27'],ai:1,exp:'Pattern is n^2 + 1. 1^2+1, 2^2+1, 3^2+1, 4^2+1. Next is 5^2+1 = 26.'},
{q:'Which is the "Odd One Out"?',options:['121','169','225','250'],ai:3,exp:'All others are perfect squares (11^2, 13^2, 15^2).'},
{q:'In a code, RED is 27. What is BLUE?',options:['40','36','42','45'],ai:0,exp:'R(18)+E(5)+D(4) = 27. B(2)+L(12)+U(21)+E(5) = 40.'}
],
hook:'EJOTY=5/10/15/20/25. Opposite sum=27. Pattern check: Squares/Primes. Letter rank mastery.',
summary:'Alphabet ranking and opposite letter pairs. Types of coding-decoding patterns. Identifying numerical and alphabetical series. Logic for classification (Odd One Out).'},

{day:86,topic:'SSC Reasoning: Syllogism & Venn Diagrams',
intro:`Today we study 'Sets and Logic'. Syllogism (All/Some/No) tests your deductive reasoning. Venn diagrams help you visualize relationships between groups. In SSC, 'Basic Syllogism' and 'Logical Venn' are high-yield. Do you know why 'Some A are B' doesn't mean 'Some B are not A'? Let's master the circles today.`,
notes:[
{title:'Syllogism Basics',detail:'1. All (Inside circle). 2. Some (Overlapping). 3. No (Separated). 4. Some Not (Partial exclusion).'},
{title:'Conclusion Rule',detail:'A conclusion is true only if it is true in ALL possible diagrams. (Possibility cases are rare in SSC, focus on Definite).'},
{title:'Logical Venn Diagrams',detail:'Representing words as circles. (e.g., Fruits, Apples, Mangoes -> Two small circles inside a big one).'},
{title:'Common Relationships',detail:'Subset (All), Overlap (Some), Disjoint (No).'},
{title:'Data Venn',detail:'Calculating values in overlapping regions (e.g., people who like tea, coffee, or both).'}
],
cards:[
{front:'"All A are B" diagram?',back:'Circle A inside Circle B.'},
{front:'"No A is B" diagram?',back:'Separated circles.'},
{front:'"Some A are B" diagram?',back:'Overlapping circles.'},
{front:'If "All A are B" and "All B are C", then "All A are C"?',back:'YES.'},
{front:'Relationship: Doctor, Male, Father?',back:'Father inside Male, Overlap with Doctor.'}
],
q:[
{q:'Statement: Some Cats are Dogs. Some Dogs are Rats. Conclusion: Some Cats are Rats.',options:['True','False','Maybe','None'],ai:1,exp:'Cat and Rat circles might not overlap in a basic diagram.'},
{q:'Identify Venn Diagram: Animals, Tigers, Lions.',options:['Overlapping','Separate','One inside two','Two separate inside one'],ai:3,exp:'Tiger and Lion are different animals, both inside the Animal category.'},
{q:'"Some students are players. Some players are singers." Does it mean some students are singers?',options:['Definitely','Not necessarily','Impossible','Always'],ai:1,exp:'Logic requires overlap across all three for a definite conclusion.'},
{q:'Relationship: Gold, Metal, Zinc.',options:['All overlapping','Two separate inside one','Separate','One inside other inside other'],ai:1,exp:'Both Gold and Zinc are separate Metals.'}
],
hook:'All=Inside. Some=Overlap. No=Separate. Conclusion must be 100% true. Venn=Real world logic.',
summary:'Rules of syllogistic deduction. Diagrammatic representation of logical statements. Solving multi-category Venn relationship problems.'},

{day:87,topic:'SSC Reasoning: Blood Relations & Direction',
intro:`Today we study the 'Family Tree and Compass'. Blood Relations test your generation logic, and Directions test your spatial awareness. In SSC, 'Coded Blood Relations' and 'Shortest Distance (Pythagoras)' are frequent. Do you know who is your father's sister's daughter's brother? Let's master the trees and turns today.`,
notes:[
{title:'Blood Relation Symbols',detail:'+ (Male), - (Female). = (Couple), | (Generation gap), - (Siblings).'},
{title:'Relationships',detail:'Maternal (Mother\'s side), Paternal (Father\'s side). Brother-in-law, Sister-in-law, Cousin.'},
{title:'Direction Sense',detail:'Standard Map: North (Up), South (Down), East (Right), West (Left).'},
{title:'Turns',detail:'Clockwise (Right), Anti-clockwise (Left). A 90° right turn from North is East.'},
{title:'Shortest Distance',detail:'Usually forms a right-angled triangle. Use sqrt(a^2 + b^2). (Pythagoras).'}
],
cards:[
{front:'Father\'s brother is?',back:'Uncle (Paternal).'},
{front:'Mother\'s sister is?',back:'Aunt (Maternal).'},
{front:'Pythagoras for distance?',back:'sqrt(Base^2 + Perp^2).'},
{front:'Facing North, take a Right turn, you face?',back:'East.'},
{front:'Sun rises in East, where is shadow in morning?',back:'West.'}
],
q:[
{q:'Pointing to a lady, a man said, "She is the only daughter of my father\'s only son." Relation?',options:['Mother','Sister','Daughter','Aunt'],ai:2,exp:'Man\'s father\'s only son is the man himself. His only daughter is his daughter.'},
{q:'A man walks 3km North, then 4km East. How far is he from start?',options:['5km','7km','1km','10km'],ai:0,exp:'sqrt(3^2 + 4^2) = 5km.'},
{q:'If A is B\'s sister, and C is B\'s mother, how is C related to A?',options:['Aunt','Mother','Grandmother','Sister'],ai:1,exp:'A and B are siblings; C is their common mother.'},
{q:'Starting from home, a boy goes 5km West, then turns left and goes 3km. Direction from home?',options:['North-West','South-West','North-East','South-East'],ai:1,exp:'West then South -> South-West.'}
],
hook:'Tree symbols: +=Male, -=Female, ==Couple. North-South-East-West. Pythagoras for distance. Generation gap=Vertical.',
summary:'Standard symbols for family trees. Solving point-to-person and coded relations. Compass rules and right/left turn logic. Calculating shortest distance between points.'},

{day:88,topic:'SSC Reasoning: Seating & Puzzles',
intro:`Today we study the 'Order of Arrangement'. Linear and Circular seating arrangements are now common in SSC (CGL/CHSL). The key is 'Left/Right' logic and 'Connecting Clues'. Do you know the difference between 'Facing Inside' and 'Facing Outside' in a circle? Let's master the seatings today.`,
notes:[
{title:'Circular Arrangement',detail:'1. Facing Inside: Clockwise is Left, Anti-clockwise is Right. 2. Facing Outside: Clockwise is Right, Anti-clockwise is Left.'},
{title:'Linear Arrangement',detail:'Facing North: Left is towards the left of the page, Right is towards the right. Facing South: Reverse.'},
{title:'Important Terms',detail:'"Immediate Left" (No one in between). "Between" (Exactly in middle). "Opposite" (Facing across the center).'},
{title:'Constraint Solving',detail:'Start with a definite clue (e.g., A sits at the end). Use secondary clues to fill the gaps.'},
{title:'Ordering Puzzle',detail:'Arranging by height, marks, or age. (e.g., A > B but shorter than C).'}
],
cards:[
{front:'Facing Inside, Right turn is?',back:'Anti-clockwise.'},
{front:'Facing Inside, Left turn is?',back:'Clockwise.'},
{front:'Opposite in a 6-person circle?',back:'Person 1 and Person 4.'},
{front:'In North facing row, Right is?',back:'Right side of paper.'},
{front:'Always start puzzle with?',back:'Definite information.'}
],
q:[
{q:'6 people are sitting in a circle facing center. A is opposite B. C is between A and D. Where is B?',options:['Opposite D','Between A and C','Opposite C','Next to A'],ai:0,exp:'Since A-B are opposite and C is next to A, D must be opposite C.'},
{q:'In a row of 5 people, A is next to B but not next to C. If C is at the end, who is next to C?',options:['A','B','Depends','None'],ai:1,exp:'If A isn\'t next to C, B must be.'},
{q:'A is taller than B. B is taller than C. D is tallest. Who is second tallest?',options:['A','B','C','D'],ai:0,exp:'D > A > B > C.'},
{q:'In a 6-person circle facing center, if you move 3 places from A, you reach:',options:['B','The person opposite A','The person to left','The person to right'],ai:1,exp:'Midpoint of 6 is 3, which is the opposite position.'}
],
hook:'Inside circle: Right=Anti, Left=Clock. Linear: Start at ends. Opposites=n/2. Use pencil and circles.',
summary:'Mechanics of circular and linear seating arrangements. Logic for facing directions. Strategy for solving ordering and ranking puzzles.'},

{day:89,topic:'SSC Reasoning: Non-Verbal Reasoning',
intro:`Today we study the 'Visual Logic'. Paper Folding, Mirror Images, and Embedded Figures test your eye for detail. These are the 'Fastest Marks' in SSC. Do you know how 'B' looks in a mirror? Or how to trace a hidden pattern? Let's master the visuals today.`,
notes:[
{title:'Mirror Image',detail:'Left becomes Right, Right becomes Left. (Horizontal flip). Vertical orientation remains same.'},
{title:'Water Image',detail:'Top becomes Bottom, Bottom becomes Top. (Vertical flip). Horizontal orientation remains same.'},
{title:'Paper Folding & Cutting',detail:'The fold acts as a mirror line. Unfolding mirrors the pattern across the crease.'},
{title:'Embedded Figures',detail:'Finding a small pattern hidden within a larger, complex figure. Requires careful scanning.'},
{title:'Completion of Figures',detail:'Predicting the missing 1/4th of a pattern based on symmetry (horizontal/vertical).'}
],
cards:[
{front:'In Mirror image, Left becomes?',back:'Right.'},
{front:'In Water image, Top becomes?',back:'Bottom.'},
{front:'Paper fold acts as a?',back:'Mirror line.'},
{front:'Mirror image of "CLOCK"?',back:'"KC OLC" (Reversed and inverted letters).'},
{front:'Is vertical orientation changed in Mirror?',back:'NO.'}
],
q:[
{q:'Identify the "Mirror Image" of the letter "R".',options:['Inverted vertically','Inverted horizontally','Remains same','Upside down'],ai:1,exp:'Standard horizontal flip.'},
{q:'If a square paper is folded diagonally and a hole is punched, how many holes appear when unfolded?',options:['1','2','3','4'],ai:1,exp:'One fold = 2 layers.'},
{q:'"Water Image" of the number 8:',options:['Reversed','Same','Upside down','Sideways'],ai:1,exp:'8 is vertically symmetric.'},
{q:'Embedded figure questions require:',options:['Calculation','Pattern matching','Imagination','None'],ai:1,exp:'Matching the exact shape and orientation.'}
],
hook:'Mirror=L/R flip. Water=Up/Down flip. Unfold=Mirror across crease. Scan carefully. Symmetry is key.',
summary:'Rules for mirror and water image transformations. Visualization of paper cutting and unfolding. Techniques for identifying embedded and incomplete patterns.'},

{day:90,topic:'SSC Reasoning: Critical & Logical Reasoning',
intro:`Today we study 'Analytical Thinking'. This includes Statement-Assumption, Statement-Conclusion, and Syllogism (recap). These questions are common in Tier 2. The key is to 'Stay within the statement'. Do you know the difference between an assumption and a conclusion? Let's master the analysis today.`,
notes:[
{title:'Statement-Assumption',detail:'Something taken for granted or supposed before saying the statement. It must be implicit.'},
{title:'Statement-Conclusion',detail:'A logical deduction that MUST follow from the statement. No outside knowledge allowed.'},
{title:'Cause and Effect',detail:'Determining if A causes B, B causes A, or both are effects of a common cause.'},
{title:'Assertion and Reason',detail:'Checking if both statements are true and if the reason correctly explains the assertion.'},
{title:'Course of Action',detail:'Choosing a practical and logical solution to a problem stated in the sentence.'}
],
cards:[
{front:'Assumption is?',back:'Implicit (taken for granted).'},
{front:'Conclusion is?',back:'Explicit deduction (must follow).'},
{front:'Can we use outside info?',back:'NO.'},
{front:'Course of action must be?',back:'Practical and corrective.'},
{front:'Is "Probably true" a conclusion?',back:'NO, it must be "Definitely true".'}
],
q:[
{q:'Statement: "Please use the lift to go to the 10th floor." Assumption: The lift is working.',options:['Implicit','Not implicit','Maybe','None'],ai:0,exp:'One wouldn\'t suggest using it if they didn\'t assume it works.'},
{q:'Statement: "All mangoes are fruits." Conclusion: "All fruits are mangoes."',options:['Follows','Does not follow','Maybe','Always'],ai:1,exp:'Logic only goes one way (A subset of B).'},
{q:'Course of Action: "A large number of people died due to contaminated water." 1. Medical help should be sent. 2. Water sources should be checked.',options:['Only 1','Only 2','Both 1 and 2','Neither'],ai:2,exp:'Both are logical and necessary actions.'},
{q:'Assertion: Water is essential for life. Reason: Body is 70% water.',options:['R explains A','R doesn\'t explain A','A is false','R is false'],ai:0,exp:'Both are true and linked.'}
],
hook:'Stay inside the statement. Assumption=Before. Conclusion=After. Practical action. No outside info.',
summary:'Differences between assumption and conclusion. Strategies for evaluating causes and effects. Logic for determining the most effective course of action.'},

{day:91,topic:'SSC REVISION: Reasoning Masterclass (Days 85–90)',
intro:`Today we wrap up 'SSC Reasoning'. You have mastered Coding, Syllogisms, Blood Relations, Seatings, and Visual Logic. Reasoning is the 'Score Booster'. Today, we drill the patterns. If you see 'Opposite', you say 'Sum 27'. If you see 'Inside Circle', you say 'Right=Anti'. Let's lock in the Reasoning marks today.`,
notes:[
{title:'Coding & Series Recap',detail:'EJOTY (5-25). Opposites (AZ, BY). Pattern: Squares, Primes, +n/-n.'},
{title:'Syllogism & Venn Recap',detail:'All (Inside), Some (Overlap). Conclusion must be definite. Animals/Tiger/Lion Venn.'},
{title:'Relation & Direction Recap',detail:'Tree (+/-, =, |). Direction: N-S-E-W. Pythagoras for shortest distance.'},
{title:'Seating & Puzzles Recap',detail:'Circle Inside: Right=Anti. Linear: Left/Right of paper. Start with definite info.'},
{title:'Visual & Analytical Recap',detail:'Mirror (L/R flip). Water (U/D flip). Assumption (Before). Conclusion (After).'}
],
cards:[
{front:'Opposite of "M"?',back:'N.'},
{front:'Rank of "V"?',back:'22.'},
{front:'Angle between North and East?',back:'90°.'},
{front:'If "Some A are B", then "Some B are A"?',back:'YES.'},
{front:'Are you a Reasoning expert?',back:'YES.'}
],
q:[
{q:'Next in series: B, D, G, K, ?',options:['P','Q','O','N'],ai:0,exp:'+2, +3, +4. Next is +5. K(11)+5 = P(16).'},
{q:'Pointing to a photo, a man says, "He is the son of the only son of my grandfather." Relation?',options:['Brother','Uncle','Cousin','Self/Brother'],ai:3,exp:'Grandfather\'s only son is Father. Father\'s son is Self or Brother.'},
{q:'Mirror image of "9"?',options:['6','Upside down 9','Backward 9','Same'],ai:2,exp:'Horizontal flip.'},
{q:'If 1st Jan is Sunday, what is 8th Jan?',options:['Monday','Saturday','Sunday','Tuesday'],ai:2,exp:'Same day after 7 days.'}
],
hook:'Reasoning complete. 100% accuracy target. Quick patterns. Visualization. Logical consistency.',
summary:'Full revision of Reasoning syllabus. High-speed drill of alphabet ranks and direction rules. Comparison of seating and puzzle logic. Final Reasoning ecosystem mock quiz.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'ssc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ SSC Reasoning Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Reasoning Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'SSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('SSC CGL Reasoning '+d.topic),why:'Mastering logic and speed for SSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | REASONING FINALE',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'ssc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ SSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();
