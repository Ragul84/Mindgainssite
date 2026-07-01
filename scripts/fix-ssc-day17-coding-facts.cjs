const path = require('path');
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const { data, error } = await supabase
    .from('master_content_vault')
    .select('track_id, day_number, topic_title, content_json')
    .eq('track_id', 'ssc_ecosystem')
    .eq('day_number', 17)
    .maybeSingle();

  if (error) throw error;
  const payload = typeof data.content_json === 'string' ? JSON.parse(data.content_json) : data.content_json;

  payload.quick_note_cards = [
    {
      title: 'Logic Card',
      front: 'If CLOUD is coded by shifting every letter +4, what is the code?',
      back: 'GPSYH. C->G, L->P, O->S, U->Y, D->H.',
    },
    {
      title: 'Logic Card',
      front: 'Using opposite-letter coding, what is the code of LOVE?',
      back: 'OLEV. L->O, O->L, V->E, E->V. Opposite-letter pairs always sum to 27.',
    },
    {
      title: 'Logic Card',
      front: 'How do you solve substitution coding like red is called blue, blue is called green?',
      back: 'Find the real object first, then replace it with the name assigned in the chain.',
    },
    {
      title: 'Logic Card',
      front: 'What is the sum of letter positions in DOG?',
      back: '26. D=4, O=15, G=7, so 4+15+7=26.',
    },
    {
      title: 'Logic Card',
      front: 'What is the opposite letter of G?',
      back: 'T. G is 7 and T is 20; opposite-letter positions sum to 27.',
    },
  ];

  payload.snapshot = payload.snapshot || {};
  payload.snapshot.exam_hook = 'SSC Speed Hook: letter shifting, opposite-letter pairs, direct A=1 position values, fictitious-language elimination, and substitution-chain logic.';
  payload.snapshot.quick_notes = [
    {
      title: 'Letter Shifting',
      detail: 'For a constant forward shift, add the same number to every letter. Example: CLOUD shifted +4 becomes GPSYH.',
    },
    {
      title: 'Opposite Letter Coding',
      detail: 'Use A=Z, B=Y, C=X. The two letter positions sum to 27. Example: LOVE becomes OLEV.',
    },
    {
      title: 'Number Coding',
      detail: 'Use A=1, B=2, ... Z=26. DOG has position sum 4+15+7=26.',
    },
    {
      title: 'Fictitious Language Coding',
      detail: 'Compare common words across coded sentences. The word repeated in both English sentences matches the code repeated in both coded sentences.',
    },
    {
      title: 'Substitution Coding',
      detail: 'Find the real answer first, then move through the given name chain exactly once. Do not answer the real object name unless the chain says so.',
    },
    {
      title: 'Reverse Word Coding',
      detail: 'If the rule is reversing letter order only, LOVE becomes EVOL. This is different from opposite-letter coding.',
    },
  ];

  payload.curriculum_metadata = {
    ...(payload.curriculum_metadata || {}),
    manual_fact_fix_at: new Date().toISOString(),
    manual_fact_fix_reason: 'Corrected invalid CLOUD shift and LOVE opposite-letter coding facts.',
  };

  const { error: updateError } = await supabase
    .from('master_content_vault')
    .update({
      content_json: payload,
      updated_at: new Date().toISOString(),
    })
    .eq('track_id', 'ssc_ecosystem')
    .eq('day_number', 17);

  if (updateError) throw updateError;
  console.log('SSC_DAY_17_FACTS_FIXED');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
