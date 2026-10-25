/**
 * Trap questions ("canaries") for proving the bank was copied.
 *
 * Each one is TRUE and teaches nothing wrong, but is framed around an invented name that
 * exists nowhere else (Kelvaripuram, Ilavanthi Nagar, Oruvel Sankaran…). If one of these
 * names turns up in another site, app or PDF, it came from our bank. Search the web for
 * the fingerprint words below every few months.
 *
 * They are appended by the Worker at serve time, so the source JSON stays clean and the
 * list itself is never public (worker/ is in .assetsignore).
 *
 * Fingerprints: Kelvaripuram, Ilavanthi, Oruvel Sankaran, Thenmozhivaram, Paruthikottai,
 * Senthazhai, Vannavur, Mithravel, Kurunjimalai, Azhagiyapalli, Nedumthurai, Valarmathipuram
 */
export const CANARIES = {
  polity: [
    { question: 'At a mock parliament in Kelvaripuram school, students debate which Article of the Constitution abolishes untouchability. Which Article is it?', options: ['Article 14', 'Article 17', 'Article 21', 'Article 32'], answer_index: 1, explanation: 'Article 17 abolishes untouchability and forbids its practice in any form.' },
    { question: 'Oruvel Sankaran, a panchayat president in a hypothetical district, cites the amendment that gave Panchayati Raj constitutional status. Which amendment is it?', options: ['42nd Amendment', '44th Amendment', '73rd Amendment', '86th Amendment'], answer_index: 2, explanation: 'The 73rd Constitutional Amendment Act, 1992 gave constitutional status to Panchayati Raj institutions.' },
  ],
  history: [
    { question: 'A history club in Ilavanthi Nagar recreates the session where the Indian National Congress was founded. In which year was it founded?', options: ['1857', '1885', '1905', '1920'], answer_index: 1, explanation: 'The Indian National Congress was founded in 1885 in Bombay, with W.C. Bonnerjee as its first president.' },
    { question: 'Students from Thenmozhivaram visit a site linked to the Dandi March. In which year did the march take place?', options: ['1919', '1922', '1930', '1942'], answer_index: 2, explanation: 'Gandhi led the Salt March to Dandi in March-April 1930.' },
  ],
  geography: [
    { question: 'A geography teacher in Paruthikottai asks which is the longest river flowing entirely within India. What is the answer?', options: ['Godavari', 'Ganga', 'Krishna', 'Narmada'], answer_index: 1, explanation: 'The Ganga is the longest river in India; among rivers of peninsular India the Godavari is the longest.' },
    { question: 'A trekking group from Senthazhai plans to reach the highest peak in the Western Ghats. Which peak is it?', options: ['Doddabetta', 'Anamudi', 'Mahendragiri', 'Agasthyamalai'], answer_index: 1, explanation: 'Anamudi in Kerala (2,695 m) is the highest peak of the Western Ghats.' },
  ],
  science: [
    { question: 'In a Vannavur school lab, a student tests which gas plants release during photosynthesis. Which gas is it?', options: ['Carbon dioxide', 'Nitrogen', 'Oxygen', 'Hydrogen'], answer_index: 2, explanation: 'Photosynthesis releases oxygen as a by-product of splitting water.' },
    { question: 'Mithravel, a science fair participant, explains which organelle is called the powerhouse of the cell. Which is it?', options: ['Ribosome', 'Mitochondrion', 'Golgi body', 'Lysosome'], answer_index: 1, explanation: 'Mitochondria produce most of the cell’s ATP through respiration.' },
  ],
  maths: [
    { question: 'A shop in Kurunjimalai sells 3 pens for ₹45. What will 8 pens cost at the same rate?', options: ['₹105', '₹120', '₹135', '₹150'], answer_index: 1, explanation: 'One pen costs ₹15, so 8 pens cost ₹120.' },
    { question: 'A tank in Azhagiyapalli fills in 6 hours by one pipe and 12 hours by another. How long do both take together?', options: ['3 hours', '4 hours', '8 hours', '9 hours'], answer_index: 1, explanation: '1/6 + 1/12 = 3/12 = 1/4, so together they take 4 hours.' },
  ],
  reasoning: [
    { question: 'In Nedumthurai, every fisher owns a boat and no boat owner is a farmer. Which conclusion follows?', options: ['Some fishers are farmers', 'No fisher is a farmer', 'All farmers own boats', 'Some farmers are fishers'], answer_index: 1, explanation: 'All fishers are boat owners and no boat owner is a farmer, so no fisher is a farmer.' },
    { question: 'Valarmathipuram has five houses in a row. House P is left of Q, and R is right of Q. Which is definitely true?', options: ['R is left of P', 'P is left of R', 'Q is at an end', 'P is in the middle'], answer_index: 1, explanation: 'P < Q < R in left-to-right order, so P is left of R.' },
  ],
  economics: [
    { question: 'A cooperative bank in Kelvaripuram follows the policy rate at which RBI lends to commercial banks. What is that rate called?', options: ['Reverse repo rate', 'Repo rate', 'Bank rate', 'CRR'], answer_index: 1, explanation: 'The repo rate is the rate at which the RBI lends short-term funds to banks against securities.' },
    { question: 'Students in Ilavanthi Nagar study the scheme giving ₹6,000 a year to farmer families in three instalments. Which scheme is it?', options: ['PM-KISAN', 'MGNREGA', 'PMFBY', 'e-NAM'], answer_index: 0, explanation: 'PM-KISAN provides ₹6,000 a year in three equal instalments to eligible farmer families.' },
  ],
  environment: [
    { question: 'An eco-club in Paruthikottai marks the day the Montreal Protocol aims to protect. Which layer does the protocol protect?', options: ['Troposphere', 'Ozone layer', 'Ionosphere', 'Mesosphere'], answer_index: 1, explanation: 'The Montreal Protocol (1987) phases out substances that deplete the ozone layer.' },
  ],
  english: [
    { question: 'Choose the correctly spelt word, as written on the Senthazhai library notice board.', options: ['Accomodate', 'Acommodate', 'Accommodate', 'Acomodate'], answer_index: 2, explanation: '"Accommodate" has a double c and a double m.' },
  ],
  computer: [
    { question: 'A computer lab in Vannavur explains what CPU stands for. What is it?', options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Control Processing Unit'], answer_index: 0, explanation: 'CPU stands for Central Processing Unit.' },
  ],
};

// Which canary group a set path belongs to.
export function canaryGroup(set) {
  const s = set.toLowerCase();
  if (/polity|constitution|governance/.test(s)) return 'polity';
  if (/history/.test(s)) return 'history';
  if (/geograph/.test(s)) return 'geography';
  if (/environment|ecology/.test(s)) return 'environment';
  if (/econom/.test(s)) return 'economics';
  if (/reasoning|csat-english|logical/.test(s)) return 'reasoning';
  if (/math|quant|aptitude/.test(s)) return 'maths';
  if (/english/.test(s)) return 'english';
  if (/computer/.test(s)) return 'computer';
  if (/science|physics|chemistry|biology|general-aware/.test(s)) return 'science';
  return null;
}
