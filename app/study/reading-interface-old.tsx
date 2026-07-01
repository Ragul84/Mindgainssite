// 📖 StudyHub Reading Interface – immersive, branded, distraction-free
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { useAuth } from '@/hooks/useAuth';
import { safeGoBack } from '@/utils/navigationHelper';
import FlashcardLessonInterface from '@/components/ui/FlashcardLessonInterface';
import UniversalCompletion from '@/components/ui/UniversalCompletion';

// Dynamic content system for all topics
const getTopicContent = (topicId: string) => {
  const contentMap: { [key: string]: any } = {
    // HISTORY TOPICS
    'delhi-sultanate': DELHI_SULTANATE_CONTENT,
    'ancient-india': ANCIENT_INDIA_CONTENT,
    'mughal-empire': MUGHAL_EMPIRE_CONTENT,
    'maratha-empire': MARATHA_EMPIRE_CONTENT,
    'british-india': BRITISH_INDIA_CONTENT,
    'freedom-struggle': FREEDOM_STRUGGLE_CONTENT,
    'post-independence': POST_INDEPENDENCE_CONTENT,
    'art-culture': ART_CULTURE_CONTENT,
    
    // POLITY TOPICS
    'constitution-basics': CONSTITUTION_BASICS_CONTENT,
    'fundamental-rights': FUNDAMENTAL_RIGHTS_CONTENT,
    'dpsp': DPSP_CONTENT,
    'parliament': PARLIAMENT_CONTENT,
    'judiciary': JUDICIARY_CONTENT,
    'executive': EXECUTIVE_CONTENT,
    'federalism': FEDERALISM_CONTENT,
    'local-govt': LOCAL_GOVT_CONTENT,
    
    // GEOGRAPHY TOPICS
    'physical-geography': PHYSICAL_GEOGRAPHY_CONTENT,
    'indian-geography': INDIAN_GEOGRAPHY_CONTENT,
    'world-geography': WORLD_GEOGRAPHY_CONTENT,
    'climate-weather': CLIMATE_WEATHER_CONTENT,
    'resources': RESOURCES_CONTENT,
    'agriculture': AGRICULTURE_CONTENT,
    'industries': INDUSTRIES_CONTENT,
    'transport': TRANSPORT_CONTENT,
    
    // ECONOMY TOPICS
    'basic-concepts': BASIC_CONCEPTS_CONTENT,
    'indian-economy': INDIAN_ECONOMY_CONTENT,
    'planning': PLANNING_CONTENT,
    'agriculture-economy': AGRICULTURE_ECONOMY_CONTENT,
    'industry-economy': INDUSTRY_ECONOMY_CONTENT,
    'services': SERVICES_CONTENT,
    'banking': BANKING_CONTENT,
    'budget': BUDGET_CONTENT,
    
    // SCIENCE & TECHNOLOGY TOPICS
    'physics': PHYSICS_CONTENT,
    'chemistry': CHEMISTRY_CONTENT,
    'biology': BIOLOGY_CONTENT,
    'space-tech': SPACE_TECH_CONTENT,
    'defense-tech': DEFENSE_TECH_CONTENT,
    'it-computers': IT_COMPUTERS_CONTENT,
    'biotechnology': BIOTECHNOLOGY_CONTENT,
    'renewable-energy': RENEWABLE_ENERGY_CONTENT,
    
    // CURRENT AFFAIRS TOPICS
    'national-affairs': NATIONAL_AFFAIRS_CONTENT,
    'international-affairs': INTERNATIONAL_AFFAIRS_CONTENT,
    'economy-current': ECONOMY_CURRENT_CONTENT,
    'science-current': SCIENCE_CURRENT_CONTENT,
    'sports-current': SPORTS_CURRENT_CONTENT,
    'awards-honors': AWARDS_HONORS_CONTENT,
    
    // ENVIRONMENT TOPICS
    'ecology': ECOLOGY_CONTENT,
    'climate-change': CLIMATE_CHANGE_CONTENT,
    'pollution': POLLUTION_CONTENT,
    'conservation': CONSERVATION_CONTENT,
    'renewable-resources': RENEWABLE_RESOURCES_CONTENT,
    'environmental-laws': ENVIRONMENTAL_LAWS_CONTENT,
    
    // ART & CULTURE TOPICS
    'indian-art': INDIAN_ART_CONTENT,
    'music-dance': MUSIC_DANCE_CONTENT,
    'literature': LITERATURE_CONTENT,
    'architecture': ARCHITECTURE_CONTENT,
    'festivals': FESTIVALS_CONTENT,
    'languages': LANGUAGES_CONTENT,
  };
  
  return contentMap[topicId] || DELHI_SULTANATE_CONTENT;
};

// Get related topics based on current topic
const getRelatedTopics = (topicId: string): { id: string; name: string; icon: string }[] => {
  const relatedMap: { [key: string]: { id: string; name: string; icon: string }[] } = {
    // History relations
    'delhi-sultanate': [
      { id: 'mughal-empire', name: 'Mughal Empire', icon: 'crown' },
      { id: 'ancient-india', name: 'Ancient India', icon: 'landmark' }
    ],
    'ancient-india': [
      { id: 'delhi-sultanate', name: 'Delhi Sultanate', icon: 'fort-awesome' },
      { id: 'mughal-empire', name: 'Mughal Empire', icon: 'crown' }
    ],
    'mughal-empire': [
      { id: 'maratha-empire', name: 'Maratha Empire', icon: 'horse-head' },
      { id: 'british-india', name: 'British India', icon: 'chess-rook' }
    ],
    'maratha-empire': [
      { id: 'mughal-empire', name: 'Mughal Empire', icon: 'crown' },
      { id: 'british-india', name: 'British India', icon: 'chess-rook' }
    ],
    'british-india': [
      { id: 'freedom-struggle', name: 'Freedom Struggle', icon: 'fist-raised' },
      { id: 'post-independence', name: 'Post Independence', icon: 'flag' }
    ],
    'freedom-struggle': [
      { id: 'british-india', name: 'British India', icon: 'chess-rook' },
      { id: 'post-independence', name: 'Post Independence', icon: 'flag' }
    ],
    'post-independence': [
      { id: 'freedom-struggle', name: 'Freedom Struggle', icon: 'fist-raised' },
      { id: 'constitution-basics', name: 'Constitution', icon: 'scroll' }
    ],
    'art-culture': [
      { id: 'ancient-india', name: 'Ancient India', icon: 'landmark' },
      { id: 'mughal-empire', name: 'Mughal Empire', icon: 'crown' }
    ],
    
    // Polity relations
    'constitution-basics': [
      { id: 'fundamental-rights', name: 'Fundamental Rights', icon: 'shield-alt' },
      { id: 'dpsp', name: 'DPSP', icon: 'compass' }
    ],
    'fundamental-rights': [
      { id: 'dpsp', name: 'DPSP', icon: 'compass' },
      { id: 'judiciary', name: 'Judiciary', icon: 'balance-scale' }
    ],
    'dpsp': [
      { id: 'fundamental-rights', name: 'Fundamental Rights', icon: 'shield-alt' },
      { id: 'parliament', name: 'Parliament', icon: 'university' }
    ],
    'parliament': [
      { id: 'executive', name: 'Executive', icon: 'user-tie' },
      { id: 'judiciary', name: 'Judiciary', icon: 'balance-scale' }
    ],
    'judiciary': [
      { id: 'parliament', name: 'Parliament', icon: 'university' },
      { id: 'fundamental-rights', name: 'Fundamental Rights', icon: 'shield-alt' }
    ],
    'executive': [
      { id: 'parliament', name: 'Parliament', icon: 'university' },
      { id: 'federalism', name: 'Federalism', icon: 'sitemap' }
    ],
    'federalism': [
      { id: 'local-govt', name: 'Local Government', icon: 'home' },
      { id: 'executive', name: 'Executive', icon: 'user-tie' }
    ],
    'local-govt': [
      { id: 'federalism', name: 'Federalism', icon: 'sitemap' },
      { id: 'constitution-basics', name: 'Constitution', icon: 'scroll' }
    ],
    
    // Geography relations
    'physical-geography': [
      { id: 'indian-geography', name: 'Indian Geography', icon: 'map' },
      { id: 'climate-weather', name: 'Climate & Weather', icon: 'cloud-rain' }
    ],
    'indian-geography': [
      { id: 'physical-geography', name: 'Physical Geography', icon: 'mountain' },
      { id: 'resources', name: 'Natural Resources', icon: 'gem' }
    ],
    'world-geography': [
      { id: 'physical-geography', name: 'Physical Geography', icon: 'mountain' },
      { id: 'climate-weather', name: 'Climate & Weather', icon: 'cloud-rain' }
    ],
    'climate-weather': [
      { id: 'agriculture', name: 'Agriculture', icon: 'seedling' },
      { id: 'indian-geography', name: 'Indian Geography', icon: 'map' }
    ],
    'resources': [
      { id: 'industries', name: 'Industries', icon: 'industry' },
      { id: 'agriculture', name: 'Agriculture', icon: 'seedling' }
    ],
    'agriculture': [
      { id: 'resources', name: 'Natural Resources', icon: 'gem' },
      { id: 'climate-weather', name: 'Climate & Weather', icon: 'cloud-rain' }
    ],
    'industries': [
      { id: 'resources', name: 'Natural Resources', icon: 'gem' },
      { id: 'transport', name: 'Transport', icon: 'truck' }
    ],
    'transport': [
      { id: 'industries', name: 'Industries', icon: 'industry' },
      { id: 'indian-geography', name: 'Indian Geography', icon: 'map' }
    ],
    
    // Economy relations
    'basic-concepts': [
      { id: 'indian-economy', name: 'Indian Economy', icon: 'chart-bar' },
      { id: 'planning', name: 'Economic Planning', icon: 'calendar-alt' }
    ],
    'indian-economy': [
      { id: 'agriculture-economy', name: 'Agriculture', icon: 'tractor' },
      { id: 'services', name: 'Services Sector', icon: 'laptop' }
    ],
    'planning': [
      { id: 'budget', name: 'Union Budget', icon: 'file-invoice-dollar' },
      { id: 'indian-economy', name: 'Indian Economy', icon: 'chart-bar' }
    ],
    'agriculture-economy': [
      { id: 'industry-economy', name: 'Industries', icon: 'cogs' },
      { id: 'indian-economy', name: 'Indian Economy', icon: 'chart-bar' }
    ],
    'industry-economy': [
      { id: 'services', name: 'Services Sector', icon: 'laptop' },
      { id: 'agriculture-economy', name: 'Agriculture', icon: 'tractor' }
    ],
    'services': [
      { id: 'banking', name: 'Banking & Finance', icon: 'university' },
      { id: 'industry-economy', name: 'Industries', icon: 'cogs' }
    ],
    'banking': [
      { id: 'budget', name: 'Union Budget', icon: 'file-invoice-dollar' },
      { id: 'services', name: 'Services Sector', icon: 'laptop' }
    ],
    'budget': [
      { id: 'banking', name: 'Banking & Finance', icon: 'university' },
      { id: 'planning', name: 'Economic Planning', icon: 'calendar-alt' }
    ],
    
    // Science & Technology relations
    'physics': [
      { id: 'chemistry', name: 'Chemistry', icon: 'flask' },
      { id: 'space-tech', name: 'Space Technology', icon: 'rocket' }
    ],
    'chemistry': [
      { id: 'biology', name: 'Biology', icon: 'dna' },
      { id: 'biotechnology', name: 'Biotechnology', icon: 'microscope' }
    ],
    'biology': [
      { id: 'biotechnology', name: 'Biotechnology', icon: 'microscope' },
      { id: 'chemistry', name: 'Chemistry', icon: 'flask' }
    ],
    'space-tech': [
      { id: 'defense-tech', name: 'Defense Technology', icon: 'fighter-jet' },
      { id: 'physics', name: 'Physics', icon: 'atom' }
    ],
    'defense-tech': [
      { id: 'space-tech', name: 'Space Technology', icon: 'rocket' },
      { id: 'it-computers', name: 'IT & Computers', icon: 'microchip' }
    ],
    'it-computers': [
      { id: 'defense-tech', name: 'Defense Technology', icon: 'fighter-jet' },
      { id: 'biotechnology', name: 'Biotechnology', icon: 'microscope' }
    ],
    'biotechnology': [
      { id: 'biology', name: 'Biology', icon: 'dna' },
      { id: 'chemistry', name: 'Chemistry', icon: 'flask' }
    ],
    'renewable-energy': [
      { id: 'physics', name: 'Physics', icon: 'atom' },
      { id: 'climate-change', name: 'Climate Change', icon: 'thermometer-half' }
    ],
    
    // Environment relations
    'ecology': [
      { id: 'conservation', name: 'Conservation', icon: 'tree' },
      { id: 'climate-change', name: 'Climate Change', icon: 'thermometer-half' }
    ],
    'climate-change': [
      { id: 'renewable-resources', name: 'Renewable Resources', icon: 'solar-panel' },
      { id: 'pollution', name: 'Pollution', icon: 'smog' }
    ],
    'pollution': [
      { id: 'environmental-laws', name: 'Environmental Laws', icon: 'balance-scale' },
      { id: 'conservation', name: 'Conservation', icon: 'tree' }
    ],
    'conservation': [
      { id: 'ecology', name: 'Ecology', icon: 'leaf' },
      { id: 'environmental-laws', name: 'Environmental Laws', icon: 'balance-scale' }
    ],
    'renewable-resources': [
      { id: 'renewable-energy', name: 'Renewable Energy', icon: 'sun' },
      { id: 'climate-change', name: 'Climate Change', icon: 'thermometer-half' }
    ],
    'environmental-laws': [
      { id: 'conservation', name: 'Conservation', icon: 'tree' },
      { id: 'pollution', name: 'Pollution', icon: 'smog' }
    ],
    
    // Current Affairs relations
    'national-affairs': [
      { id: 'international-affairs', name: 'International Affairs', icon: 'globe-americas' },
      { id: 'economy-current', name: 'Economy News', icon: 'chart-line' }
    ],
    'international-affairs': [
      { id: 'national-affairs', name: 'National Affairs', icon: 'flag' },
      { id: 'economy-current', name: 'Economy News', icon: 'chart-line' }
    ],
    'economy-current': [
      { id: 'science-current', name: 'Science News', icon: 'atom' },
      { id: 'national-affairs', name: 'National Affairs', icon: 'flag' }
    ],
    'science-current': [
      { id: 'space-tech', name: 'Space Technology', icon: 'rocket' },
      { id: 'awards-honors', name: 'Awards & Honors', icon: 'trophy' }
    ],
    'sports-current': [
      { id: 'awards-honors', name: 'Awards & Honors', icon: 'trophy' },
      { id: 'national-affairs', name: 'National Affairs', icon: 'flag' }
    ],
    'awards-honors': [
      { id: 'sports-current', name: 'Sports News', icon: 'medal' },
      { id: 'science-current', name: 'Science News', icon: 'atom' }
    ],
    
    // Art & Culture relations
    'indian-art': [
      { id: 'architecture', name: 'Architecture', icon: 'monument' },
      { id: 'music-dance', name: 'Music & Dance', icon: 'music' }
    ],
    'music-dance': [
      { id: 'literature', name: 'Literature', icon: 'book' },
      { id: 'festivals', name: 'Festivals', icon: 'calendar-day' }
    ],
    'literature': [
      { id: 'languages', name: 'Languages', icon: 'language' },
      { id: 'indian-art', name: 'Indian Art', icon: 'palette' }
    ],
    'architecture': [
      { id: 'indian-art', name: 'Indian Art', icon: 'palette' },
      { id: 'ancient-india', name: 'Ancient India', icon: 'landmark' }
    ],
    'festivals': [
      { id: 'music-dance', name: 'Music & Dance', icon: 'music' },
      { id: 'art-culture', name: 'Art & Culture', icon: 'palette' }
    ],
    'languages': [
      { id: 'literature', name: 'Literature', icon: 'book' },
      { id: 'festivals', name: 'Festivals', icon: 'calendar-day' }
    ],
  };
  
  return relatedMap[topicId] || [
    { id: 'constitution-basics', name: 'Constitution', icon: 'scroll' },
    { id: 'ancient-india', name: 'Ancient India', icon: 'landmark' }
  ];
};

// COMPLETE Delhi Sultanate content with ALL 5 dynasties
const DELHI_SULTANATE_CONTENT = {
  overview: "The Delhi Sultanate (1206-1526 CE) was a Muslim sultanate based in Delhi, ruled by five successive dynasties. It marked the beginning of Muslim political dominance in the Indian subcontinent and laid the foundation for Indo-Islamic culture.",
  sections: [
    {
      id: 'timeline',
      title: 'Complete Timeline & All 5 Dynasties',
      icon: 'crown',
      gradient: ['#FF6B6B', '#FF8E53'],
      content: [
        {
          subtitle: '🏰 Slave Dynasty (Mamluk) (1206-1290)',
          color: '#8B5CF6',
          points: [
            '🎯 **Qutb-ud-din Aibak (1206-1210)**: Founder of Delhi Sultanate, built Quwwat-ul-Islam mosque, started Qutub Minar',
            '⚔️ **Iltutmish (1211-1236)**: Real founder, got recognition from Caliph, introduced silver tanka and copper jital',
            '👸 **Razia Sultan (1236-1240)**: First and only female Muslim ruler, progressive policies, killed in rebellion',
            '🛡️ **Ghiyas ud din Balban (1266-1287)**: Theory of kingship, Persian court culture, "blood and iron" policy',
            '📊 **Key Features**: Turkish nobility, Iqta system, military autocracy, orthodox Islamic policies'
          ],
        },
        {
          subtitle: '🗡️ Khilji Dynasty (1290-1320)',
          color: '#8B5CF6',
          points: [
            '💰 **Alauddin Khilji (1296-1316)**: Market control system, price regulation, expansionist policies',
            '⚔️ **Military Campaigns**: Conquered Gujarat, Rajputana, Deccan (Devagiri, Warangal, Dwarasamudra)',
            '🏛️ **Administrative Reforms**: Standing army, revenue reforms, intelligence system (Barid)',
            '🛡️ **Mongol Invasions**: Successfully repelled multiple Mongol attacks (1299-1308)',
            '📈 **Economic Policies**: Fixed prices, rationing system, market inspectors (Shahna-i-Mandi)'
          ],
        },
        {
          subtitle: '🏛️ Tughlaq Dynasty (1320-1414)',
          color: '#8B5CF6',
          points: [
            '🌟 **Ghiyas-ud-din Tughlaq (1320-1325)**: Founded dynasty, agricultural reforms, built Tughlaqabad',
            '🔄 **Muhammad bin Tughlaq (1325-1351)**: Transfer of capital to Daulatabad, token currency experiment',
            '🏗️ **Firoz Shah Tughlaq (1351-1388)**: Welfare state, public works, founded Firozabad, Jaunpur',
            '📊 **Innovations**: Canal irrigation, hospitals (Dar-us-Shifa), employment bureau, postal system',
            '⚡ **Major Experiments**: Symbolic currency, agricultural loans, price control, slave welfare'
          ],
        },
        {
          subtitle: '🕌 Sayyid Dynasty (1414-1451)',
          color: '#8B5CF6',
          points: [
            '👑 **Khizr Khan (1414-1421)**: Founder, appointed by Timur, never took title of Sultan',
            '⚔️ **Mubarak Shah (1421-1434)**: First to assume title of Sultan, built Mubarakabad',
            '🎯 **Muhammad Shah (1434-1443)**: Faced rebellions, lost control over provinces',
            '📉 **Alam Shah (1443-1451)**: Last ruler, weak control, retired to Badaun',
            '🔍 **Characteristics**: Weak dynasty, constant rebellions, loss of territorial control'
          ],
        },
        {
          subtitle: '🏺 Lodi Dynasty (1451-1526)',
          color: '#8B5CF6',
          points: [
            '🎖️ **Bahlul Lodi (1451-1489)**: Afghan noble, restored Delhi Sultanate power, tribal chieftain approach',
            '⚔️ **Sikandar Lodi (1489-1517)**: Greatest Lodi ruler, founded Agra, promoted trade and agriculture',
            '👑 **Ibrahim Lodi (1517-1526)**: Last Sultan, defeated by Babur in First Battle of Panipat (1526)',
            '🏛️ **Administration**: Afghan tribal system, council of nobles, Pashto revival',
            '📜 **End**: Marked end of Delhi Sultanate, beginning of Mughal Empire'
          ],
        },
      ],
    },
    {
      id: 'administration',
      title: 'Administrative Machinery',
      icon: 'balance-scale',
      gradient: ['#10B981', '#059669'],
      content: [
        {
          subtitle: '🏛️ Central Government Structure',
          color: '#8B5CF6',
          points: [
            '👑 **Sultan**: Supreme commander, final authority, divine right theory (especially under Balban)',
            '🎯 **Wazir (Vizier)**: Prime Minister, head of revenue department, most powerful after Sultan',
            '⚔️ **Ariz-i-Mumalik**: Head of military department, recruitment and organization of army',
            '📝 **Diwan-i-Insha**: Correspondence department, royal orders and diplomatic communications',
            '💰 **Diwan-i-Mustakharaj**: Revenue collection department, tax assessment and collection',
            '⚖️ **Chief Qazi**: Head of judicial system, Islamic law interpretation and implementation'
          ],
        },
        {
          subtitle: '🗺️ Provincial & Local Administration',
          color: '#8B5CF6',
          points: [
            '🏰 **Iqta System**: Land grants to nobles for military service, foundation of feudal structure',
            '👨‍💼 **Muqtis/Walis**: Provincial governors, responsible for revenue and military in their regions',
            '🏛️ **Shiqdar**: Administrative head of Pargana (district), law and order maintenance',
            '👥 **Village Level**: Traditional panchayat system continued, minimal interference by Sultanate',
            '📊 **Revenue Collection**: Land revenue main source, 1/3rd to 1/2 of produce as tax'
          ],
        },
      ],
    },
    {
      id: 'military',
      title: 'Military Organization',
      icon: 'swords',
      gradient: ['#8B5CF6', '#7C3AED'],
      content: [
        {
          subtitle: '🏇 Army Composition & Structure',
          color: '#8B5CF6',
          points: [
            '🐎 **Cavalry**: Backbone of army, Turkish and Afghan horsemen, superior mobility',
            '🐘 **War Elephants**: Used for breaking enemy lines, psychological warfare, royal prestige',
            '🏹 **Infantry**: Foot soldiers with swords, spears, and bows, mostly Indian recruits',
            '💣 **Artillery**: Introduced during later period, cannons and firearms from Central Asia',
            '🏰 **Fortification**: Strong forts as military bases, advanced siege warfare techniques'
          ],
        },
        {
          subtitle: '📋 Military Reforms & Innovations',
          color: '#8B5CF6',
          points: [
            '💰 **Alauddin\'s Reforms**: Standing army, direct payment in cash, branding of horses (dagh)',
            '📝 **Descriptive Roll**: Detailed records of soldiers (huliya), prevention of fake recruitment',
            '🎯 **Military Colonies**: Settlement of soldiers in conquered territories, garrison duties',
            '⚔️ **Warfare Tactics**: Mobile cavalry, hit-and-run tactics, siege warfare expertise',
            '🛡️ **Defense Strategy**: Network of forts, early warning systems, border security'
          ],
        },
      ],
    },
    {
      id: 'economy',
      title: 'Economic Structure & Trade',
      icon: 'coins',
      gradient: ['#F59E0B', '#D97706'],
      content: [
        {
          subtitle: '🌾 Revenue System & Agriculture',
          color: '#8B5CF6',
          points: [
            '🏞️ **Land Revenue (Kharaj)**: Primary source, 1/5th to 1/2 of produce, varied by region and ruler',
            '🕌 **Jizya**: Poll tax on non-Muslims, significant revenue source, exemptions for poor/women/children',
            '💎 **Zakat**: Religious tax on Muslims, 2.5% of wealth, used for welfare and military',
            '🚢 **Trade Taxes**: Customs duties on imports/exports, market taxes, commercial licensing',
            '💧 **Irrigation**: Canal systems (especially under Firoz Tughlaq), improved agricultural productivity'
          ],
        },
        {
          subtitle: '🏪 Trade, Commerce & Urban Economy',
          color: '#D97706',
          points: [
            '🌍 **International Trade**: Active trade with Central Asia, Middle East, Southeast Asia via Indian Ocean',
            '🏭 **Karkhanas**: Royal workshops for luxury goods, textiles, weapons, court requirements',
            '💰 **Currency System**: Silver tanka and copper jital, standardized weights and measures',
            '🛒 **Market Control**: Alauddin\'s price control system, fixed prices for essential commodities',
            '🏙️ **Urban Centers**: Delhi, Lahore, Multan as major commercial hubs, guild system for craftsmen'
          ],
        },
      ],
    },
    {
      id: 'culture',
      title: 'Art, Architecture & Cultural Synthesis',
      icon: 'palette',
      gradient: ['#EC4899', '#DB2777'],
      content: [
        {
          subtitle: '🏛️ Architectural Marvels & Innovations',
          color: '#EC4899',
          points: [
            '🗼 **Qutub Minar**: 73m tall victory tower, Indo-Islamic architecture masterpiece, UNESCO World Heritage',
            '🚪 **Alai Darwaza**: First true arch in India, perfect example of Islamic architecture principles',
            '🏰 **Tughlaqabad Fort**: Massive fortification, advanced military architecture, urban planning',
            '🕌 **Tomb Architecture**: Introduction of dome and arch, Persian influence, geometric patterns',
            '🎨 **Decorative Elements**: Calligraphy, geometric patterns, arabesque designs, colored tiles'
          ],
        },
        {
          subtitle: '📚 Literature, Language & Cultural Developments',
          color: '#DB2777',
          points: [
            '🎵 **Amir Khusrau**: Father of Qawwali, invented sitar and tabla, Persian-Hindavi poetry',
            '📖 **Persian Literature**: Court language, historical chronicles, Sufi literature flourished',
            '🗣️ **Urdu Development**: Fusion of Persian, Arabic, and local languages, common communication medium',
            '🕊️ **Sufi Movement**: Chishti, Suhrawardi orders, synthesis of Islamic and Indian mysticism',
            '🎭 **Cultural Fusion**: Hindu-Muslim synthesis in music, dance, festivals, cuisine'
          ],
        },
      ],
    },
    {
      id: 'decline',
      title: 'Factors Leading to Decline',
      icon: 'chart-line-down',
      gradient: ['#EF4444', '#DC2626'],
      content: [
        {
          subtitle: '🏠 Internal Weaknesses & Political Instability',
          color: '#8B5CF6',
          points: [
            '👑 **Succession Disputes**: No fixed law of succession, constant civil wars, weak central authority',
            '💸 **Economic Drain**: Continuous warfare, expensive military, administrative corruption',
            '⚔️ **Military Defeats**: Loss of key battles, weakening of military efficiency, obsolete tactics',
            '🏛️ **Administrative Decay**: Corruption in iqta system, loss of central control over provinces',
            '👥 **Social Tensions**: Hindu-Muslim conflicts, oppressive policies, loss of popular support'
          ],
        },
        {
          subtitle: '🌪️ External Invasions & Regional Powers',
          color: '#8B5CF6',
          points: [
            '⚡ **Timur\'s Invasion (1398)**: Devastated Delhi, massive destruction, economic collapse',
            '🏰 **Rise of Regional Kingdoms**: Bahmani, Vijayanagara, Gujarat, Bengal became independent',
            '🏔️ **Afghan Challenge**: Rise of Sur dynasty, Sher Shah\'s efficient administration',
            '🐎 **Mughal Arrival**: Babur\'s victory at Panipat (1526), superior artillery and tactics',
            '🗺️ **Geographical Factors**: Loss of fertile regions, control limited to Delhi-Agra area'
          ],
        },
      ],
    },
    {
      id: 'legacy',
      title: 'Historical Legacy & Impact',
      icon: 'star',
      gradient: ['#06B6D4', '#0891B2'],
      content: [
        {
          subtitle: '🏛️ Political & Administrative Legacy',
          color: '#06B6D4',
          points: [
            '👑 **Centralized Monarchy**: Established pattern of strong central rule, influenced later empires',
            '📋 **Administrative Systems**: Revenue collection methods, provincial governance, influenced Mughals',
            '⚖️ **Legal Framework**: Integration of Islamic law with local customs, judicial precedents',
            '🏰 **Urban Planning**: Development of Delhi as imperial capital, architectural heritage',
            '💰 **Economic Institutions**: Market regulation, currency systems, trade networks'
          ],
        },
        {
          subtitle: '🎭 Cultural & Social Impact',
          color: '#0891B2',
          points: [
            '🎨 **Indo-Islamic Culture**: Synthesis of Islamic and Indian traditions, lasting cultural impact',
            '📚 **Educational Development**: Madrasas, libraries, translation of Sanskrit texts to Persian',
            '🗣️ **Linguistic Legacy**: Development of Urdu, Persian influence on regional languages',
            '🍽️ **Culinary Fusion**: Introduction of new cooking techniques, spices, Mughlai cuisine origins',
            '🏛️ **Architectural Heritage**: Foundation of Indo-Islamic architecture, influenced later monuments'
          ],
        },
      ],
    },
  ],
};

// ANCIENT INDIA CONTENT
const ANCIENT_INDIA_CONTENT = {
  overview: "Ancient India (3300 BCE - 650 CE) encompasses the Indus Valley Civilization, Vedic period, and classical age. This era saw the foundation of Indian civilization, major religions, and sophisticated political systems.",
  sections: [
    {
      id: 'indus-valley',
      title: 'Indus Valley Civilization',
      icon: 'building',
      gradient: ['#FF6B6B', '#FF8E53'],
      content: [
        {
          subtitle: 'Major Cities & Features',
          color: '#8B5CF6',
          points: [
            '**Harappa**: First discovered site, gave name to civilization, advanced drainage system',
            '**Mohenjo-daro**: "Mound of the Dead", Great Bath, planned city layout',
            '**Dholavira**: Largest Harappan site in India, sophisticated water management',
            '**Lothal**: Important port city, dockyard, bead manufacturing center',
            '**Kalibangan**: Pre-Harappan and Harappan phases, fire altars discovered'
          ],
        },
        {
          subtitle: 'Civilization Characteristics',
          color: '#8B5CF6',
          points: [
            '**Urban Planning**: Grid pattern streets, advanced drainage, standardized bricks',
            '**Trade**: Extensive trade networks, weights and measures, seals for identification',
            '**Technology**: Bronze working, pottery, cotton cultivation, wheel technology',
            '**Script**: Undeciphered script, over 400 symbols discovered',
            '**Decline**: Climate change, river drying, Aryan invasion theory debated'
          ],
        },
      ],
    },
    {
      id: 'vedic-period',
      title: 'Vedic Period',
      icon: 'scroll',
      gradient: ['#10B981', '#059669'],
      content: [
        {
          subtitle: 'Early Vedic Period (1500-1000 BCE)',
          color: '#8B5CF6',
          points: [
            '**Rigveda**: Oldest text, 1028 hymns, composed by Rishis',
            '**Society**: Tribal, pastoral, worship of nature gods (Indra, Agni, Vayu)',
            '**Political**: Raja as leader, Sabha and Samiti as assemblies',
            '**Economy**: Cattle rearing, agriculture secondary, barter system',
            '**Geography**: Punjab and western UP, Sapta Sindhu region'
          ],
        },
        {
          subtitle: 'Later Vedic Period (1000-600 BCE)',
          color: '#8B5CF6',
          points: [
            '**Literature**: Samaveda, Yajurveda, Atharvaveda, Brahmanas, Upanishads',
            '**Society**: Varna system crystallized, caste hierarchy emerged',
            '**Political**: Larger kingdoms, hereditary kingship, royal rituals',
            '**Economy**: Iron technology, agriculture dominant, trade expansion',
            '**Religion**: Brahmanical supremacy, sacrifice rituals, early philosophy'
          ],
        },
      ],
    },
    {
      id: 'mahajanapadas',
      title: 'Mahajanapadas & Early Kingdoms',
      icon: 'chess-rook',
      gradient: ['#8B5CF6', '#7C3AED'],
      content: [
        {
          subtitle: '16 Mahajanapadas',
          color: '#8B5CF6',
          points: [
            '**Magadha**: Most powerful, Rajgir and Pataliputra capitals, strategic location',
            '**Kosala**: Ayodhya capital, birthplace of Rama, merged with Magadha',
            '**Vatsa**: Kausambi capital, important trade center on Yamuna',
            '**Avanti**: Ujjain capital, western trade routes, later conquered by Magadha',
            '**Gandhara**: Taxila capital, center of learning, Persian influence'
          ],
        },
        {
          subtitle: 'Rise of Magadha',
          color: '#8B5CF6',
          points: [
            '**Bimbisara (544-492 BCE)**: Founded Magadha empire, matrimonial alliances',
            '**Ajatashatru (492-460 BCE)**: Expanded empire, fortified Pataliputra',
            '**Geographical Advantages**: Iron ore deposits, fertile plains, river transport',
            '**Military**: Use of elephants, new weapons, fortified cities',
            '**Administration**: Efficient bureaucracy, revenue collection system'
          ],
        },
      ],
    },
    {
      id: 'mauryan-empire',
      title: 'Mauryan Empire',
      icon: 'crown',
      gradient: ['#F59E0B', '#D97706'],
      content: [
        {
          subtitle: 'Chandragupta Maurya (322-298 BCE)',
          color: '#8B5CF6',
          points: [
            '**Foundation**: Overthrew Nandas with Chanakya\'s help, established dynasty',
            '**Expansion**: Conquered northwestern India from Greeks, vast empire',
            '**Administration**: Centralized system, detailed in Arthashastra',
            '**Military**: Large standing army, 600,000 infantry, 30,000 cavalry',
            '**Abdication**: Became Jain monk, died in Sravanabelagola'
          ],
        },
        {
          subtitle: 'Ashoka the Great (268-232 BCE)',
          color: '#D97706',
          points: [
            '**Kalinga War**: Turning point, massive casualties, embraced Buddhism',
            '**Dhamma**: Moral and ethical code, religious tolerance, welfare state',
            '**Edicts**: Rock and pillar edicts, spread Buddhist teachings',
            '**Administration**: Dhamma Mahamatras, efficient bureaucracy',
            '**Legacy**: Buddhism spread, Ashoka Chakra, symbol of modern India'
          ],
        },
      ],
    },
    {
      id: 'post-mauryan',
      title: 'Post-Mauryan Period',
      icon: 'exchange-alt',
      gradient: ['#EC4899', '#DB2777'],
      content: [
        {
          subtitle: 'Foreign Invasions',
          color: '#EC4899',
          points: [
            '**Indo-Greeks**: Menander most famous, coins with Greek and Kharoshthi scripts',
            '**Shakas (Scythians)**: Central Asian tribes, Western Kshatrapas in Gujarat',
            '**Parthians**: Brief rule in northwest, displaced by Kushans',
            '**Kushans**: Kanishka greatest ruler, Gandhara art, Buddhism patron',
            '**Cultural Fusion**: Hellenistic influence, Indo-Greek art and architecture'
          ],
        },
        {
          subtitle: 'Indigenous Dynasties',
          color: '#DB2777',
          points: [
            '**Sungas**: Pushyamitra founder, Brahmanical revival, Patanjali\'s time',
            '**Kanvas**: Short-lived dynasty, succeeded Sungas in Magadha',
            '**Satavahanas**: Deccan rulers, maritime trade, Prakrit patronage',
            '**Chedi-Cheta**: Kalinga rulers, Kharavela most famous',
            '**Tamil Kingdoms**: Cheras, Cholas, Pandyas, Sangam literature period'
          ],
        },
      ],
    },
    {
      id: 'gupta-empire',
      title: 'Gupta Golden Age',
      icon: 'star',
      gradient: ['#06B6D4', '#0891B2'],
      content: [
        {
          subtitle: 'Major Rulers',
          color: '#06B6D4',
          points: [
            '**Chandragupta I**: Founded Gupta era (320 CE), married Licchhavi princess',
            '**Samudragupta**: Great conqueror, Allahabad pillar inscription, patron of arts',
            '**Chandragupta II (Vikramaditya)**: Peak of empire, Fa-hien visited, cultural flowering',
            '**Kumaragupta I**: Maintained empire, founded Nalanda University',
            '**Skandagupta**: Last great ruler, faced Hun invasions, empire declined'
          ],
        },
        {
          subtitle: 'Golden Age Achievements',
          color: '#0891B2',
          points: [
            '**Literature**: Kalidasa\'s works, Amarakosha, Panchatantra',
            '**Science**: Aryabhata\'s astronomy, Sushruta\'s surgery, zero concept',
            '**Art**: Ajanta-Ellora caves, classical sculpture, temple architecture',
            '**Religion**: Hindu renaissance, Puranas composed, temple worship',
            '**Economy**: Flourishing trade, guilds, agricultural prosperity'
          ],
        },
      ],
    },
  ],
};

// MUGHAL EMPIRE CONTENT
const MUGHAL_EMPIRE_CONTENT = {
  overview: "The Mughal Empire (1526-1857 CE) was founded by Babur and reached its zenith under Akbar, Jahangir, Shah Jahan, and Aurangzeb. It created a synthesis of Persian, Islamic, and Indian cultures.",
  sections: [
    {
      id: 'foundation',
      title: 'Foundation & Early Rulers',
      icon: 'swords',
      gradient: ['#FF6B6B', '#FF8E53'],
      content: [
        {
          subtitle: 'Babur (1526-1530)',
          color: '#8B5CF6',
          points: [
            '**First Battle of Panipat (1526)**: Defeated Ibrahim Lodi, used gunpowder and artillery',
            '**Battle of Khanwa (1527)**: Defeated Rana Sanga, established Mughal supremacy',
            '**Challenges**: Homesickness, difficult climate, financial problems',
            '**Baburnama**: Autobiography in Turki, detailed account of India',
            '**Legacy**: Founded Mughal dynasty, introduced new military techniques'
          ],
        },
        {
          subtitle: 'Humayun (1530-1540, 1555-1556)',
          color: '#8B5CF6',
          points: [
            '**Challenges**: Divided empire among brothers, Sher Shah\'s rising power',
            '**Exile Period**: Defeated by Sher Shah, fled to Persia, gained Persian support',
            '**Restoration**: Returned with Persian help, recaptured Delhi before death',
            '**Personality**: Scholar, astronomer, but weak military leader',
            '**Death**: Fell from library stairs, tragic end to troubled reign'
          ],
        },
      ],
    },
    {
      id: 'akbar-great',
      title: 'Akbar the Great',
      icon: 'crown',
      gradient: ['#10B981', '#059669'],
      content: [
        {
          subtitle: 'Military Conquests',
          color: '#8B5CF6',
          points: [
            '**Second Battle of Panipat (1556)**: Defeated Hemu, established Mughal rule',
            '**Rajput Policy**: Marriage alliances, Man Singh, Birbal as advisors',
            '**Deccan Campaigns**: Conquered Ahmadnagar, Bijapur, Golconda',
            '**Gujarat & Bengal**: Added wealthy provinces, controlled trade routes',
            '**Northwest Frontier**: Campaigns in Kashmir, Kabul, extended boundaries'
          ],
        },
        {
          subtitle: 'Administrative Reforms',
          color: '#8B5CF6',
          points: [
            '**Mansabdari System**: Military ranks, salary in cash, loyalty to emperor',
            '**Revenue System**: Todar Mal\'s land survey, Dahsala system',
            '**Religious Policy**: Sulh-i-kul (universal peace), abolished jizya',
            '**Din-i-Ilahi**: New religion synthesis, failed to gain followers',
            '**Court**: Navratnas (nine gems), cultural patronage, Ibadat Khana'
          ],
        },
      ],
    },
    {
      id: 'shah-jahan',
      title: 'Shah Jahan - Builder Emperor',
      icon: 'building',
      gradient: ['#8B5CF6', '#7C3AED'],
      content: [
        {
          subtitle: 'Architectural Achievements',
          color: '#8B5CF6',
          points: [
            '**Taj Mahal**: Tomb for Mumtaz Mahal, epitome of Mughal architecture',
            '**Red Fort**: Delhi palace complex, Diwan-i-Am, Diwan-i-Khas',
            '**Jama Masjid**: Largest mosque in India, congregational prayers',
            '**Peacock Throne**: Jewel-encrusted throne, symbol of Mughal wealth',
            '**Shahjahanabad**: New Delhi city, planned urban development'
          ],
        },
        {
          subtitle: 'Reign Characteristics',
          color: '#8B5CF6',
          points: [
            '**Golden Age**: Peak of Mughal culture, art, and architecture',
            '**Deccan Wars**: Expensive campaigns, drained treasury',
            '**Economic Prosperity**: Trade flourished, revenue increased',
            '**War of Succession**: Sons fought for throne, empire weakened',
            '**Imprisonment**: Aurangzeb imprisoned him in Agra Fort'
          ],
        },
      ],
    },
    {
      id: 'aurangzeb',
      title: 'Aurangzeb - Last Great Mughal',
      icon: 'balance-scale',
      gradient: ['#F59E0B', '#D97706'],
      content: [
        {
          subtitle: 'Religious Policies',
          color: '#8B5CF6',
          points: [
            '**Orthodox Islam**: Strict Islamic practices, banned music and dance',
            '**Jizya Restoration**: Reimposed tax on non-Muslims, caused resentment',
            '**Temple Destruction**: Demolished Hindu and Sikh temples',
            '**Fatwa-i-Alamgiri**: Compilation of Islamic law',
            '**Personal Piety**: Simple living, copied Quran, cap-making for income'
          ],
        },
        {
          subtitle: 'Military Campaigns & Challenges',
          color: '#D97706',
          points: [
            '**Deccan Wars**: 25 years in south, conquered Bijapur and Golconda',
            '**Maratha Resistance**: Shivaji\'s guerrilla warfare, constant rebellions',
            '**Rajput Wars**: Ended alliance policy, faced Rajput revolts',
            '**Sikh Opposition**: Executed Guru Tegh Bahadur, faced Sikh militancy',
            '**Economic Decline**: Expensive wars, rebellions, weakened empire'
          ],
        },
      ],
    },
  ],
};

// CONSTITUTION BASICS CONTENT
const CONSTITUTION_BASICS_CONTENT = {
  overview: "The Indian Constitution, adopted on 26 November 1949 and enacted on 26 January 1950, is the world\'s longest written constitution. It establishes India as a sovereign, socialist, secular, democratic republic.",
  sections: [
    {
      id: 'making',
      title: 'Making of Constitution',
      icon: 'file-alt',
      gradient: ['#FF6B6B', '#FF8E53'],
      content: [
        {
          subtitle: 'Constituent Assembly - Key Facts',
          color: '#8B5CF6',
          points: [
            '**Formation**: Cabinet Mission Plan 1946, based on provincial assemblies',
            '**Members**: 389 initially (292 from provinces, 93 from states, 4 from chief commissioners)',
            '**After Partition**: Reduced to 299 members (229 provinces, 70 states)',
            '**Dr. Rajendra Prasad**: President of Constituent Assembly',
            '**Dr. B.R. Ambedkar**: Chairman of 7-member Drafting Committee',
            '**Important Members**: Nehru, Patel, K.M. Munshi, Alladi Krishnaswamy Ayyar',
            '**H.C. Mukherjee**: Vice President; T.T. Krishnamachari (played vital role)',
            '**Duration**: 2 years, 11 months, 18 days (166 days of actual meetings)',
            '**11 Sessions**: Total held between Dec 1946 - Nov 1949',
            '**Cost**: ₹64 lakhs (total expenditure on making constitution)'
          ],
        },
        {
          subtitle: 'Important Committees',
          color: '#F59E0B',
          points: [
            '**Drafting Committee**: Dr. B.R. Ambedkar (Chairman), 7 members total',
            '**Union Powers Committee**: Jawaharlal Nehru (Chairman)',
            '**Provincial Constitution Committee**: Sardar Vallabhbhai Patel',
            '**Advisory Committee on Fundamental Rights**: Sardar Patel',
            '**Rules of Procedure Committee**: Dr. Rajendra Prasad',
            '**States Committee**: Nehru (for negotiating with princely states)',
            '**Steering Committee**: Dr. Rajendra Prasad',
            '**Finance & Staff Committee**: Dr. Rajendra Prasad',
            '**Flag Committee**: J.B. Kripalani (selected tricolor flag)',
            '**Committee on Functions**: G.V. Mavlankar'
          ],
        },
        {
          subtitle: 'Sources & Influences (Very Important for Exams)',
          color: '#8B5CF6',
          points: [
            '**Government of India Act 1935**: Federal scheme, governors, emergency, public service commissions (75% content)',
            '**British Constitution**: Parliamentary government, rule of law, legislative procedure, single citizenship, cabinet system',
            '**US Constitution**: Fundamental rights, federal structure, judicial review, impeachment, removal of judges',
            '**Irish Constitution**: Directive Principles (DPSP), method of President election, Rajya Sabha nominations',
            '**Canadian Constitution**: Federation with strong center, residuary powers, appointment of governors',
            '**Australian Constitution**: Concurrent list, freedom of trade, joint sitting of Parliament',
            '**Weimar Constitution (Germany)**: Suspension of fundamental rights during emergency',
            '**Soviet Constitution**: Fundamental duties, ideal of justice (social, economic, political)',
            '**French Constitution**: Republic, ideals of liberty, equality, fraternity in Preamble',
            '**South African Constitution**: Amendment procedure, election of Rajya Sabha members',
            '**Japanese Constitution**: Procedure established by law'
          ],
        },
      ],
    },
    {
      id: 'features',
      title: 'Salient Features (Must Know All)',
      icon: 'star',
      gradient: ['#10B981', '#059669'],
      content: [
        {
          subtitle: 'Unique Characteristics',
          color: '#8B5CF6',
          points: [
            '**Lengthiest Written Constitution**: Originally 395 Articles, 22 Parts, 8 Schedules',
            '**Currently**: 470 Articles, 25 Parts, 12 Schedules (after 105+ amendments)',
            '**Drawn from Various Sources**: Blend of multiple constitutions',
            '**Blend of Rigidity & Flexibility**: Some articles need special majority, others simple',
            '**Federal with Unitary Bias**: Federal in normal times, unitary in emergency',
            '**Parliamentary Form**: PM is real executive, President nominal head',
            '**Synthesis of Parliamentary Sovereignty & Judicial Supremacy**: Balance between two',
            '**Integrated & Independent Judiciary**: Single hierarchy of courts',
            '**Universal Adult Franchise**: Voting right at 18 years (61st Amendment, 1989)',
            '**Single Citizenship**: Only Indian citizenship, no state citizenship',
            '**Emergency Provisions**: National (352), State (356), Financial (360)'
          ],
        },
        {
          subtitle: 'Fundamental Aspects',
          color: '#F59E0B',
          points: [
            '**Sovereign**: India is internally & externally sovereign',
            '**Socialist**: Added by 42nd Amendment (1976), socialistic pattern of society',
            '**Secular**: Added by 42nd Amendment, equal treatment of all religions',
            '**Democratic**: Political, economic, and social democracy',
            '**Republic**: Elected head of state, not hereditary',
            '**Justice**: Social, economic, political (Preamble)',
            '**Liberty**: Of thought, expression, belief, faith, worship',
            '**Equality**: Of status and opportunity',
            '**Fraternity**: Assuring dignity of individual, unity & integrity',
            '**Basic Structure Doctrine**: Kesavananda Bharati case (1973) - cannot be amended'
          ],
        },
        {
          subtitle: 'Parts of Constitution (Important)',
          color: '#3B82F6',
          points: [
            '**Part I**: Union and its Territory (Articles 1-4)',
            '**Part II**: Citizenship (Articles 5-11)',
            '**Part III**: Fundamental Rights (Articles 12-35)',
            '**Part IV**: DPSP (Articles 36-51)',
            '**Part IVA**: Fundamental Duties (Article 51A) - Added by 42nd Amendment',
            '**Part V**: The Union (Articles 52-151) - President, Parliament, etc.',
            '**Part VI**: The States (Articles 152-237)',
            '**Part IX**: Panchayats (Articles 243-243O) - 73rd Amendment',
            '**Part IXA**: Municipalities (Articles 243P-243ZG) - 74th Amendment',
            '**Part X**: Scheduled & Tribal Areas (Articles 244-244A)',
            '**Part XI**: Relations between Union & States (Articles 245-263)',
            '**Part XII**: Finance, Property, Contracts (Articles 264-300A)',
            '**Part XIV**: Services under Union & States (Articles 308-323)',
            '**Part XV**: Elections (Articles 324-329)',
            '**Part XVIII**: Emergency Provisions (Articles 352-360)'
          ],
        },
      ],
    },
    {
      id: 'schedules',
      title: '12 Schedules (Exam Important)',
      icon: 'list',
      gradient: ['#EC4899', '#F472B6'],
      content: [
        {
          subtitle: 'List of All Schedules',
          color: '#8B5CF6',
          points: [
            '**First Schedule**: List of States & Union Territories with their boundaries',
            '**Second Schedule**: Salaries of President, Governors, Judges, CAG, etc.',
            '**Third Schedule**: Forms of Oaths and Affirmations',
            '**Fourth Schedule**: Allocation of Rajya Sabha seats to states & UTs',
            '**Fifth Schedule**: Administration of Scheduled Areas & Scheduled Tribes',
            '**Sixth Schedule**: Administration of Tribal Areas in Assam, Meghalaya, Tripura, Mizoram',
            '**Seventh Schedule**: Division of powers (Union, State, Concurrent Lists)',
            '**Eighth Schedule**: 22 Official Languages (originally 14)',
            '**Ninth Schedule**: Laws protected from judicial review (added by 1st Amendment)',
            '**Tenth Schedule**: Anti-defection provisions (52nd Amendment, 1985)',
            '**Eleventh Schedule**: Panchayat powers - 29 subjects (73rd Amendment)',
            '**Twelfth Schedule**: Municipal powers - 18 subjects (74th Amendment)'
          ],
        },
      ],
    },
    {
      id: 'amendments',
      title: 'Amendment Procedure (Article 368)',
      icon: 'edit',
      gradient: ['#3B82F6', '#2563EB'],
      content: [
        {
          subtitle: 'Types of Amendments',
          color: '#10B981',
          points: [
            '**Simple Majority**: Ordinary legislative process (name changes, boundary alterations)',
            '**Special Majority**: Majority of total membership + 2/3 present & voting',
            '**Special Majority + State Ratification**: For federal provisions, needs approval of half states',
            '**Important Amendments by Simple Majority**: Formation of new states, abolition of Legislative Council',
            '**Provisions Needing State Ratification**: Election of President, extent of executive power, Supreme & High Courts, distribution of legislative powers, any of the lists in 7th schedule, representation of states in Parliament',
            '**Cannot be Amended**: Basic structure of Constitution (judicial doctrine)',
            '**Total Amendments**: 106 as of 2023 (latest: 106th - reservation for women)'
          ],
        },
      ],
    },
    {
      id: 'important-articles',
      title: 'Must-Know Articles for Exams',
      icon: 'bookmark',
      gradient: ['#F59E0B', '#F97316'],
      content: [
        {
          subtitle: 'Critical Articles',
          color: '#EC4899',
          points: [
            '**Article 1**: India, that is Bharat, shall be a Union of States',
            '**Article 14-18**: Right to Equality',
            '**Article 19**: Six Freedoms (speech, assembly, association, movement, residence, profession)',
            '**Article 21**: Right to Life and Personal Liberty',
            '**Article 21A**: Right to Education (6-14 years) - 86th Amendment',
            '**Article 32**: Right to Constitutional Remedies (Heart and Soul - Ambedkar)',
            '**Article 51A**: Fundamental Duties (11 duties)',
            '**Article 74**: Council of Ministers to aid President',
            '**Article 76**: Attorney General of India',
            '**Article 110**: Money Bills definition',
            '**Article 112**: Annual Financial Statement (Budget)',
            '**Article 123**: Ordinance making power of President',
            '**Article 124**: Establishment of Supreme Court',
            '**Article 148**: Comptroller and Auditor General',
            '**Article 280**: Finance Commission',
            '**Article 352**: National Emergency',
            '**Article 356**: President\'s Rule (State Emergency)',
            '**Article 360**: Financial Emergency',
            '**Article 368**: Amendment of Constitution'
          ],
        },
      ],
    },
  ],
};

// Placeholder content for all other topics (to be expanded)
const MARATHA_EMPIRE_CONTENT = {
  overview: "The Maratha Empire (1674-1818 CE) was founded by Shivaji and became the dominant power in 18th century India, challenging Mughal supremacy and British expansion.",
  sections: [
    { id: 'shivaji-foundation', title: 'Shivaji and Foundation', icon: 'swords', gradient: ['#FF6B6B', '#FF8E53'],
      content: [
        { subtitle: 'Early Life & Rise (1630-1680)', color: '#8B5CF6', points: [
          '**Birth**: Born to Shahaji Bhosle and Jijabai in 1630 at Shivneri Fort',
          '**Training**: Educated by Dadaji Kondadev in warfare and administration',
          '**First Conquest**: Captured Torna Fort at age 16 (1646)',
          '**Guerrilla Tactics**: Developed innovative warfare against larger Mughal armies',
          '**Swarajya Concept**: Vision of independent Hindu kingdom'
        ]},
        { subtitle: 'Military Innovations & Coronation', color: '#F59E0B', points: [
          '**Fort Network**: Built 300+ forts across Western Ghats for strategic control',
          '**Naval Force**: First Indian ruler to build organized navy',
          '**Coronation (1674)**: Crowned as Chhatrapati at Raigad Fort',
          '**Ashtapradhan**: Council of 8 ministers for administration',
          '**Religious Tolerance**: Respected all religions, patronized Hindu culture'
        ]}
      ]
    },
    { id: 'peshwa-expansion', title: 'Peshwa Period & Expansion', icon: 'map', gradient: ['#4ECDC4', '#44A08D'],
      content: [
        { subtitle: 'Rise of Peshwas (1714-1761)', color: '#10B981', points: [
          '**Balaji Vishwanath**: First effective Peshwa, gained Chauth and Sardeshmukhi rights',
          '**Baji Rao I**: Greatest Peshwa, expanded empire to North India',
          '**Maratha Confederacy**: Decentralized system with Peshwa as head',
          '**Delhi Capture**: Marathas reached Delhi, controlled Mughal emperor',
          '**Peak Territory**: Empire covered 2.8 million sq km at its zenith'
        ]},
        { subtitle: 'Major Maratha Families', color: '#3B82F6', points: [
          '**Peshwas of Pune**: Central authority, controlled confederacy policy',
          '**Gaekwads of Baroda**: Controlled Gujarat, wealthy trading region',
          '**Holkars of Indore**: Dominated Malwa region, strong cavalry',
          '**Scindias of Gwalior**: Controlled North-Central India, modern army',
          '**Bhonsles of Nagpur**: Ruled Central Provinces and Berar'
        ]}
      ]
    },
    { id: 'decline-fall', title: 'Decline & Anglo-Maratha Wars', icon: 'sword', gradient: ['#FC466B', '#3F5EFB'],
      content: [
        { subtitle: 'Internal Weaknesses & Panipat', color: '#EC4899', points: [
          '**Battle of Panipat (1761)**: Catastrophic defeat by Ahmad Shah Abdali',
          '**Loss of Leadership**: Death of key leaders, succession disputes',
          '**Confederacy Weakness**: Lack of unity among Maratha houses',
          '**Financial Crisis**: Constant warfare drained treasury',
          '**British Threat**: Growing British power in Bengal and South'
        ]},
        { subtitle: 'Anglo-Maratha Wars (1775-1818)', color: '#F59E0B', points: [
          '**First War (1775-82)**: Treaty of Salbai, temporary British withdrawal',
          '**Second War (1803-05)**: British victory, subsidiary treaties imposed',
          '**Third War (1817-18)**: Final defeat, end of Maratha independence',
          '**Peshwa Abolition**: Last Peshwa Baji Rao II exiled to Kanpur',
          '**Legacy**: Inspired later freedom fighters, revived Hindu nationalism'
        ]}
      ]
    }
  ],
};

const BRITISH_INDIA_CONTENT = {
  overview: "British rule in India (1757-1947) began with the East India Company\'s victory at Plassey and evolved into direct Crown rule, fundamentally transforming Indian society.",
  sections: [
    { id: 'company-establishment', title: 'East India Company Rule', icon: 'building', gradient: ['#FF6B6B', '#FF8E53'],
      content: [
        { subtitle: 'Early Trading Phase (1600-1757)', color: '#8B5CF6', points: [
          '**Royal Charter (1600)**: Queen Elizabeth I granted monopoly for East Indian trade',
          '**Factory System**: Established trading posts in Surat, Madras, Bombay, Calcutta',
          '**Mughal Relations**: Obtained trading privileges through Mughal farmans',
          '**European Rivalry**: Competition with Dutch, French, Portuguese companies',
          '**Fortification**: Built fortified settlements for protection and storage'
        ]},
        { subtitle: 'Political Takeover (1757-1858)', color: '#F59E0B', points: [
          '**Battle of Plassey (1757)**: Robert Clive defeated Siraj-ud-Daulah',
          '**Battle of Buxar (1764)**: Victory over allied forces, gained Diwani rights',
          '**Dual Government**: Company\'s political control with Mughal administrative facade',
          '**Subsidiary Alliance**: Wellesley\'s policy to control Indian rulers',
          '**Doctrine of Lapse**: Dalhousie\'s annexation of states without heir'
        ]}
      ]
    },
    { id: 'administrative-system', title: 'Colonial Administration', icon: 'clipboard', gradient: ['#4ECDC4', '#44A08D'],
      content: [
        { subtitle: 'Revenue Systems', color: '#10B981', points: [
          '**Permanent Settlement (1793)**: Zamindari system in Bengal, fixed land revenue',
          '**Ryotwari System**: Direct settlement with peasants in Madras, Bombay',
          '**Mahalwari System**: Village-based revenue collection in North India',
          '**Commercial Agriculture**: Forced cultivation of cash crops for export',
          '**Economic Drain**: Wealth extraction from India to Britain'
        ]},
        { subtitle: 'Legal & Social Reforms', color: '#3B82F6', points: [
          '**Charter Acts**: Constitutional regulation of Company governance',
          '**Education Policy**: Macaulay\'s minutes promoting English education',
          '**Legal System**: Introduction of British legal concepts and procedures',
          '**Social Legislation**: Abolition of Sati, widow remarriage act',
          '**Civil Services**: Merit-based recruitment through competitive exams'
        ]}
      ]
    },
    { id: 'crown-rule', title: 'British Crown Rule (1858-1947)', icon: 'crown', gradient: ['#FC466B', '#3F5EFB'],
      content: [
        { subtitle: 'Transfer to Crown Government', color: '#EC4899', points: [
          '**Government of India Act 1858**: Company rule ended, Crown took control',
          '**Viceroy System**: Governor-General became Viceroy representing Crown',
          '**Secretary of State**: British Cabinet minister responsible for India',
          '**Council of India**: Advisory body in London for Indian affairs',
          '**Royal Proclamation**: Queen Victoria\'s promises to Indian subjects'
        ]},
        { subtitle: 'Constitutional Reforms', color: '#F59E0B', points: [
          '**Indian Councils Acts (1861, 1892)**: Limited Indian representation',
          '**Morley-Minto Reforms (1909)**: Separate electorates introduced',
          '**Montagu-Chelmsford Reforms (1919)**: Dyarchy in provincial subjects',
          '**Simon Commission (1928)**: All-white commission, Indian boycott',
          '**Government of India Act (1935)**: Provincial autonomy, federal structure planned'
        ]}
      ]
    }
  ],
};

const FREEDOM_STRUGGLE_CONTENT = {
  overview: "India\'s freedom struggle (1857-1947) evolved from sepoy mutiny to mass movements led by Gandhi, ultimately achieving independence through non-violent resistance.",
  sections: [
    { id: 'revolt-1857', title: 'Revolt of 1857', icon: 'swords', gradient: ['#FF6B6B', '#FF8E53'],
      content: [{ subtitle: 'First War of Independence', color: '#8B5CF6', points: ['**Causes**: Greased cartridges, Doctrine of Lapse', '**Leaders**: Mangal Pandey, Rani Lakshmibai, Kunwar Singh', '**Impact**: End of Company rule, beginning of Crown rule'] }] },
  ],
};

const POST_INDEPENDENCE_CONTENT = {
  overview: "Post-independence India (1947-present) faced challenges of partition, integration, and development while building democratic institutions and pursuing economic growth.",
  sections: [
    { id: 'partition', title: 'Partition & Integration', icon: 'map', gradient: ['#FF6B6B', '#FF8E53'],
      content: [{ subtitle: 'Challenges of Partition', color: '#8B5CF6', points: ['**Mass Migration**: 14 million people displaced', '**Refugee Crisis**: Rehabilitation challenges', '**Integration**: 562 princely states merged'] }] },
  ],
};

const ART_CULTURE_CONTENT = {
  overview: "Indian art and culture represents a synthesis of diverse traditions spanning ancient, medieval, and modern periods, reflecting the subcontinent\'s rich heritage.",
  sections: [
    { id: 'classical-art', title: 'Classical Art Forms', icon: 'palette', gradient: ['#FF6B6B', '#FF8E53'],
      content: [{ subtitle: 'Sculpture & Painting', color: '#8B5CF6', points: ['**Ajanta Caves**: Buddhist paintings and sculptures', '**Ellora Caves**: Hindu, Buddhist, Jain monuments', '**Temple Architecture**: Various regional styles'] }] },
  ],
};

// Polity placeholders
const FUNDAMENTAL_RIGHTS_CONTENT = {
  overview: "Fundamental Rights (Articles 12-35) are basic human rights guaranteed by the Constitution, protecting individual liberty and ensuring equality before law.",
  sections: [
    { id: 'equality', title: 'Right to Equality', icon: 'balance-scale', gradient: ['#10B981', '#059669'],
      content: [
        { subtitle: 'Articles 14-18', color: '#8B5CF6', points: [
          '**Article 14**: Equality before law',
          '**Article 15**: Prohibition of discrimination on grounds of religion, race, caste, sex or place of birth',
          '**Article 16**: Equality of opportunity in public employment',
          '**Article 17**: Abolition of Untouchability',
          '**Article 18**: Abolition of titles except military and academic'
        ]}
      ]
    },
    { id: 'freedom', title: 'Right to Freedom', icon: 'dove', gradient: ['#3B82F6', '#1D4ED8'],
      content: [
        { subtitle: 'Articles 19-22', color: '#F59E0B', points: [
          '**Article 19**: Six freedoms - speech, assembly, association, movement, residence, profession',
          '**Article 20**: Protection against ex-post-facto laws and double jeopardy',
          '**Article 21**: Right to life and personal liberty',
          '**Article 21A**: Right to education (6-14 years)',
          '**Article 22**: Protection against arbitrary arrest and detention'
        ]}
      ]
    },
    { id: 'exploitation', title: 'Right Against Exploitation', icon: 'shield-alt', gradient: ['#EF4444', '#DC2626'],
      content: [
        { subtitle: 'Articles 23-24', color: '#8B5CF6', points: [
          '**Article 23**: Prohibition of traffic in human beings and forced labour',
          '**Article 24**: Prohibition of employment of children below 14 years in factories/mines'
        ]}
      ]
    },
    { id: 'religion', title: 'Right to Freedom of Religion', icon: 'pray', gradient: ['#F59E0B', '#D97706'],
      content: [
        { subtitle: 'Articles 25-28', color: '#10B981', points: [
          '**Article 25**: Freedom of conscience and free profession of religion',
          '**Article 26**: Freedom to manage religious affairs',
          '**Article 27**: Freedom from payment of taxes for promotion of any religion',
          '**Article 28**: Freedom from religious instruction in certain educational institutions'
        ]}
      ]
    },
    { id: 'cultural', title: 'Cultural and Educational Rights', icon: 'university', gradient: ['#8B5CF6', '#7C3AED'],
      content: [
        { subtitle: 'Articles 29-30', color: '#EC4899', points: [
          '**Article 29**: Protection of interests of minorities',
          '**Article 30**: Right of minorities to establish educational institutions'
        ]}
      ]
    },
    { id: 'remedies', title: 'Right to Constitutional Remedies', icon: 'gavel', gradient: ['#EC4899', '#DB2777'],
      content: [
        { subtitle: 'Articles 32-35', color: '#3B82F6', points: [
          '**Article 32**: Right to approach Supreme Court for enforcement of Fundamental Rights',
          '**Five Writs**: Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo Warranto',
          '**Article 33**: Power of Parliament to modify rights for Armed Forces',
          '**Article 34**: Restrictions during martial law',
          '**Article 35**: Legislation for giving effect to fundamental rights'
        ]}
      ]
    }
  ],
};

const DPSP_CONTENT = {
  overview: "Directive Principles of State Policy (Articles 36-51) are guidelines for governance, aimed at establishing social and economic democracy.",
  sections: [
    { id: 'socialistic', title: 'Socialistic Principles', icon: 'users', gradient: ['#10B981', '#059669'],
      content: [
        { subtitle: 'Social Justice', color: '#8B5CF6', points: [
          '**Article 38**: Promote welfare of people by securing social order',
          '**Article 39**: Equal livelihood, prevent concentration of wealth',
          '**Article 39A**: Equal justice and free legal aid',
          '**Article 41**: Right to work, education and public assistance',
          '**Article 42**: Just and humane work conditions, maternity relief'
        ]}
      ]
    },
    { id: 'gandhian', title: 'Gandhian Principles', icon: 'leaf', gradient: ['#F59E0B', '#D97706'],
      content: [
        { subtitle: 'Rural Development', color: '#10B981', points: [
          '**Article 40**: Organization of village panchayats',
          '**Article 43**: Living wage for workers, cottage industries',
          '**Article 46**: Promotion of educational interests of SC/ST',
          '**Article 47**: Improvement of public health and nutrition',
          '**Article 48**: Prohibition of intoxicating drinks and drugs'
        ]}
      ]
    },
    { id: 'liberal', title: 'Liberal-Intellectual Principles', icon: 'balance-scale', gradient: ['#3B82F6', '#1D4ED8'],
      content: [
        { subtitle: 'Modern Values', color: '#EC4899', points: [
          '**Article 44**: Uniform Civil Code throughout India',
          '**Article 45**: Early childhood care and education till 6 years',
          '**Article 48A**: Protection of environment and wildlife',
          '**Article 49**: Protection of monuments and heritage',
          '**Article 50**: Separation of judiciary from executive',
          '**Article 51**: Promotion of international peace and security'
        ]}
      ]
    }
  ],
};

const PARLIAMENT_CONTENT = {
  overview: "Indian Parliament consists of President, Lok Sabha, and Rajya Sabha, serving as the supreme legislative body with powers to make laws and control executive.",
  sections: [
    { id: 'lok-sabha', title: 'Lok Sabha (House of People)', icon: 'users', gradient: ['#10B981', '#059669'],
      content: [
        { subtitle: 'Composition & Powers', color: '#8B5CF6', points: [
          '**Total Seats**: 545 (543 elected + 2 nominated)',
          '**Term**: 5 years unless dissolved earlier',
          '**Speaker**: Presides over sessions, maintains order',
          '**Money Bills**: Exclusive power to pass money bills',
          '**No-confidence Motion**: Can remove government',
          '**Budget**: Approves annual financial statement'
        ]}
      ]
    },
    { id: 'rajya-sabha', title: 'Rajya Sabha (Council of States)', icon: 'landmark', gradient: ['#3B82F6', '#1D4ED8'],
      content: [
        { subtitle: 'Composition & Powers', color: '#F59E0B', points: [
          '**Total Seats**: 250 (238 elected + 12 nominated)',
          '**Term**: Permanent body, 1/3rd retire every 2 years',
          '**Chairman**: Vice-President is ex-officio Chairman',
          '**Special Powers**: Can create All-India Services',
          '**State List**: Can legislate on state subjects',
          '**Delaying Power**: Can delay bills for 6 months'
        ]}
      ]
    },
    { id: 'legislative-process', title: 'Legislative Process', icon: 'scroll', gradient: ['#EC4899', '#DB2777'],
      content: [
        { subtitle: 'How Laws are Made', color: '#10B981', points: [
          '**First Reading**: Introduction of bill',
          '**Second Reading**: Discussion on principles',
          '**Committee Stage**: Detailed examination',
          '**Third Reading**: Final vote on bill',
          '**Other House**: Same process in other house',
          '**Presidential Assent**: Becomes law after assent'
        ]}
      ]
    },
    { id: 'parliamentary-procedures', title: 'Parliamentary Procedures', icon: 'gavel', gradient: ['#F59E0B', '#D97706'],
      content: [
        { subtitle: 'Important Sessions & Motions', color: '#3B82F6', points: [
          '**Question Hour**: First hour of every session',
          '**Zero Hour**: After Question Hour for urgent matters',
          '**Adjournment Motion**: To discuss urgent public matter',
          '**Calling Attention**: Draw attention to urgent issue',
          '**Budget Session**: February to May',
          '**Monsoon Session**: July to August',
          '**Winter Session**: November to December'
        ]}
      ]
    }
  ],
};

const JUDICIARY_CONTENT = {
  overview: "Indian judiciary is independent with Supreme Court at apex, providing constitutional interpretation, judicial review, and protection of fundamental rights.",
  sections: [
    { id: 'supreme-court', title: 'Supreme Court', icon: 'balance-scale', gradient: ['#10B981', '#059669'],
      content: [
        { subtitle: 'Composition & Appointment', color: '#8B5CF6', points: [
          '**Strength**: 1 Chief Justice + 33 Judges (can be increased by Parliament)',
          '**Appointment**: President appoints after consultation with CJI',
          '**Qualifications**: 5 years as High Court Judge OR 10 years as advocate',
          '**Tenure**: Until 65 years of age',
          '**Removal**: Impeachment by Parliament for proven misbehavior'
        ]},
        { subtitle: 'Jurisdictions', color: '#F59E0B', points: [
          '**Original**: Inter-state disputes, Centre vs State disputes, fundamental rights violation',
          '**Appellate**: Appeals from High Courts in civil, criminal, constitutional matters',
          '**Advisory**: President can seek advice on constitutional matters',
          '**Writ**: Can issue writs - habeas corpus, mandamus, prohibition, certiorari, quo warranto',
          '**Review**: Can review its own judgments',
          '**Curative**: Rarest of rare cases to prevent miscarriage of justice'
        ]}
      ]
    },
    { id: 'high-courts', title: 'High Courts', icon: 'university', gradient: ['#3B82F6', '#1D4ED8'],
      content: [
        { subtitle: 'Structure & Powers', color: '#10B981', points: [
          '**Total**: 25 High Courts covering all states and UTs',
          '**Appointment**: President appoints judges after consultation with CJI',
          '**Tenure**: Until 62 years of age',
          '**Original Jurisdiction**: Matrimonial, taxation, company law matters',
          '**Appellate Jurisdiction**: Appeals from subordinate courts',
          '**Supervisory**: Control over subordinate courts in their jurisdiction',
          '**Writ Power**: Can issue writs for fundamental rights enforcement'
        ]}
      ]
    },
    { id: 'subordinate-courts', title: 'Subordinate Courts', icon: 'gavel', gradient: ['#EC4899', '#DB2777'],
      content: [
        { subtitle: 'District & Session Courts', color: '#3B82F6', points: [
          '**District Judge**: Highest judicial authority in district',
          '**Sessions Judge**: Criminal cases, can award death sentence',
          '**Additional/Assistant**: Help main judges in case disposal',
          '**Civil Courts**: Property disputes, contracts, family matters',
          '**Criminal Courts**: Magistrate courts - ACMM, MM, JMFC',
          '**Special Courts**: Fast track, family, commercial, cyber crime'
        ]}
      ]
    },
    { id: 'judicial-review', title: 'Judicial Review & Independence', icon: 'shield-alt', gradient: ['#F59E0B', '#D97706'],
      content: [
        { subtitle: 'Powers & Safeguards', color: '#EC4899', points: [
          '**Judicial Review**: Power to examine constitutionality of laws and executive actions',
          '**Basic Structure Doctrine**: Parliament cannot alter basic features of Constitution',
          '**Independence**: Security of tenure, fixed salaries, separate budget',
          '**Contempt of Court**: Power to punish for contempt to maintain dignity',
          '**Public Interest Litigation**: Courts can take suo moto cognizance',
          '**Judicial Activism**: Active role in governance and policy matters'
        ]}
      ]
    }
  ],
};

const EXECUTIVE_CONTENT = {
  overview: "Indian executive includes President as head of state and Prime Minister as head of government, implementing laws and policies made by Parliament.",
  sections: [
    { id: 'president', title: 'President of India', icon: 'medal', gradient: ['#10B981', '#059669'],
      content: [
        { subtitle: 'Election & Qualifications', color: '#8B5CF6', points: [
          '**Election**: Indirect election by Electoral College (MPs + MLAs)',
          '**Term**: 5 years, eligible for re-election',
          '**Qualifications**: Indian citizen, 35+ years, qualified for Lok Sabha',
          '**Oath**: Administered by Chief Justice of India',
          '**Impeachment**: By Parliament for violation of Constitution'
        ]},
        { subtitle: 'Powers & Functions', color: '#F59E0B', points: [
          '**Executive**: Appoints PM, ministers, governors, judges, service chiefs',
          '**Legislative**: Assent to bills, can return bills, summon Parliament',
          '**Emergency**: Can declare national, state, financial emergency',
          '**Judicial**: Pardoning power, commute death sentences',
          '**Diplomatic**: Represents India internationally, receives foreign dignitaries',
          '**Military**: Supreme commander of defense forces'
        ]}
      ]
    },
    { id: 'prime-minister', title: 'Prime Minister & Council', icon: 'user-tie', gradient: ['#3B82F6', '#1D4ED8'],
      content: [
        { subtitle: 'Role & Powers', color: '#10B981', points: [
          '**Leader**: Head of government, leader of ruling party/coalition',
          '**Appointment**: Appointed by President, must have Lok Sabha confidence',
          '**Cabinet Formation**: Recommends ministers to President',
          '**Policy Making**: Chief architect of government policies',
          '**Parliament**: Leader of House in Lok Sabha, answers questions',
          '**Coordination**: Links President and Cabinet, chairs Cabinet meetings'
        ]},
        { subtitle: 'Council of Ministers', color: '#EC4899', points: [
          '**Categories**: Cabinet, State, Deputy Ministers',
          '**Collective Responsibility**: All ministers collectively responsible to Lok Sabha',
          '**Individual Responsibility**: Each minister responsible for their department',
          '**Resignation**: If no-confidence motion passed, entire council resigns',
          '**Size**: Total strength cannot exceed 15% of Lok Sabha strength'
        ]}
      ]
    },
    { id: 'governor', title: 'Governor & State Executive', icon: 'landmark', gradient: ['#EC4899', '#DB2777'],
      content: [
        { subtitle: 'Governor Powers', color: '#3B82F6', points: [
          '**Appointment**: By President for 5 years',
          '**Executive**: Appoints Chief Minister and ministers',
          '**Legislative**: Assent to state bills, can reserve for President',
          '**Emergency**: Can recommend President\'s rule in state',
          '**Discretionary**: Can act independently in certain situations',
          '**Universities**: Chancellor of state universities'
        ]},
        { subtitle: 'Chief Minister', color: '#F59E0B', points: [
          '**Head**: Head of state government, leader of state legislature party',
          '**Powers**: Similar to PM at state level',
          '**Appointment**: By Governor, must have Assembly confidence',
          '**Council**: Recommends state ministers to Governor',
          '**Policy**: Implements central and state government policies'
        ]}
      ]
    }
  ],
};

const FEDERALISM_CONTENT = {
  overview: "Indian federalism divides powers between Union and States through three lists, with Union having more powers making it a strong federal system.",
  sections: [
    { id: 'division-powers', title: 'Legislative Division', icon: 'clipboard-list', gradient: ['#10B981', '#059669'],
      content: [
        { subtitle: 'Three Lists (7th Schedule)', color: '#8B5CF6', points: [
          '**Union List (List I)**: 97 subjects - Defense, foreign affairs, currency',
          '**State List (List II)**: 66 subjects - Police, agriculture, local government, public health',
          '**Concurrent List (List III)**: 47 subjects - Education, marriage, bankruptcy, electricity',
          '**Residuary Powers**: Subjects not in any list belong to Union Parliament',
          '**Conflict Resolution**: In concurrent list, Union law prevails over state law'
        ]}
      ]
    },
    { id: 'federal-features', title: 'Federal Features', icon: 'balance-scale', gradient: ['#3B82F6', '#1D4ED8'],
      content: [
        { subtitle: 'Quasi-Federal Structure', color: '#F59E0B', points: [
          '**Dual Government**: Union government and state governments',
          '**Written Constitution**: Clearly defines powers and responsibilities',
          '**Rigid Constitution**: Special procedure for constitutional amendments',
          '**Independent Judiciary**: Supreme Court settles Centre-State disputes',
          '**Bicameral Legislature**: Rajya Sabha represents states in Parliament'
        ]},
        { subtitle: 'Unitary Features', color: '#10B981', points: [
          '**Strong Centre**: More powers to Union government',
          '**Governor**: Central appointee as state head',
          '**Emergency Provisions**: Centre can control states during emergency',
          '**Single Citizenship**: Only Indian citizenship, no state citizenship',
          '**Integrated Services**: All-India services like IAS, IPS, IFS'
        ]}
      ]
    },
    { id: 'centre-state-relations', title: 'Centre-State Relations', icon: 'handshake', gradient: ['#EC4899', '#DB2777'],
      content: [
        { subtitle: 'Administrative Relations', color: '#3B82F6', points: [
          '**Article 256**: States must comply with Union laws',
          '**Article 257**: Union can give directions to states',
          '**All-India Services**: IAS, IPS, IFS serve both Centre and states',
          '**Inter-state Council**: For coordination between governments',
          '**Zonal Councils**: Regional cooperation and development'
        ]},
        { subtitle: 'Financial Relations', color: '#EC4899', points: [
          '**Finance Commission**: Distributes taxes between Centre and states',
          '**GST Council**: Decides GST rates and structure',
          '**Planning Commission/NITI Aayog**: Development planning coordination',
          '**Central Grants**: Plan and non-plan grants to states',
          '**Borrowing**: States need Centre permission for external borrowing'
        ]}
      ]
    }
  ],
};

const LOCAL_GOVT_CONTENT = {
  overview: "Local governance in India operates through Panchayati Raj in rural areas and municipalities in urban areas, ensuring grassroots democracy.",
  sections: [
    { id: 'panchayati-raj', title: 'Panchayati Raj System', icon: 'home-city', gradient: ['#10B981', '#059669'],
      content: [
        { subtitle: 'Three-Tier Structure (73rd Amendment)', color: '#8B5CF6', points: [
          '**Gram Panchayat**: Village level, population 500-3000',
          '**Panchayat Samiti**: Block/Intermediate level, coordinates villages',
          '**Zilla Panchayat**: District level, planning and coordination',
          '**Gram Sabha**: All adult members of village, supreme body',
          '**Elections**: Direct election every 5 years by adult suffrage'
        ]},
        { subtitle: 'Powers & Functions', color: '#F59E0B', points: [
          '**11th Schedule**: 29 subjects including agriculture, education, health',
          '**Development**: Rural development, poverty alleviation programs',
          '**Infrastructure**: Roads, water supply, sanitation, street lighting',
          '**Social Justice**: Welfare schemes for SC/ST/OBC/women',
          '**Finance**: Village budget, local taxes, government grants'
        ]}
      ]
    },
    { id: 'urban-local-govt', title: 'Urban Local Government', icon: 'city', gradient: ['#3B82F6', '#1D4ED8'],
      content: [
        { subtitle: 'Municipal Structure (74th Amendment)', color: '#10B981', points: [
          '**Municipal Corporation**: Cities with 1 million+ population',
          '**Municipal Council**: Smaller cities and large towns',
          '**Nagar Panchayat**: Transitional areas from rural to urban',
          '**Ward Committees**: Facilitate citizen participation',
          '**Mayor/Chairperson**: Elected head of municipal body'
        ]},
        { subtitle: 'Functions & Services', color: '#EC4899', points: [
          '**12th Schedule**: 18 subjects including urban planning, water supply',
          '**Infrastructure**: Roads, bridges, street lighting, parks',
          '**Public Health**: Sanitation, waste management, hospitals',
          '**Services**: Public transport, fire services, burial grounds',
          '**Revenue**: Property tax, professional tax, service charges'
        ]}
      ]
    },
    { id: 'constitutional-provisions', title: 'Constitutional Framework', icon: 'scroll', gradient: ['#EC4899', '#DB2777'],
      content: [
        { subtitle: '73rd & 74th Amendments', color: '#3B82F6', points: [
          '**Constitutional Status**: Local governments got constitutional recognition',
          '**State Election Commission**: Conducts elections to local bodies',
          '**State Finance Commission**: Recommends financial devolution',
          '**Reservation**: 1/3rd seats for women, SC/ST as per population',
          '**Audit**: CAG audits accounts of local bodies'
        ]},
        { subtitle: 'Challenges & Reforms', color: '#F59E0B', points: [
          '**Financial**: Dependence on state government grants',
          '**Capacity**: Lack of technical and administrative capacity',
          '**Functionaries**: Inadequate devolution of functions',
          '**E-Governance**: Digital platforms for service delivery',
          '**Swachh Bharat**: Cleanliness and sanitation mission'
        ]}
      ]
    }
  ],
};

// GEOGRAPHY CONTENT - Comprehensive coverage

// PHYSICAL GEOGRAPHY - Expanded
const PHYSICAL_GEOGRAPHY_CONTENT = {
  overview: "Physical geography studies Earth\'s natural features including landforms, climate, soil, vegetation, and their distribution patterns across the globe.",
  sections: [
    { id: 'landforms', title: 'Major Landforms', icon: 'mountain', gradient: ['#3B82F6', '#2563EB'],
      content: [
        { subtitle: 'Mountain Systems', color: '#3B82F6', points: [
          '**Fold Mountains**: Himalayas, Alps, Andes formed by tectonic plate collision',
          '**Block Mountains**: Vosges, Black Forest, formed by faulting and uplift',
          '**Volcanic Mountains**: Mt. Fuji, Vesuvius, formed by volcanic activity',
          '**Dome Mountains**: Black Hills, formed by magma pushing upward',
          '**Plateau Mountains**: Deccan Plateau, Colorado Plateau, elevated flatlands'
        ]},
        { subtitle: 'Plains and Plateaus', color: '#10B981', points: [
          '**Alluvial Plains**: Ganga-Brahmaputra, Mississippi, formed by river deposits',
          '**Coastal Plains**: Atlantic, Pacific coastal lowlands, marine deposition',
          '**Glacial Plains**: Great Plains of North America, glacial outwash',
          '**Structural Plateaus**: Brazilian Highlands, Peninsular India, ancient rocks',
          '**Volcanic Plateaus**: Ethiopian Highlands, Columbia Plateau, lava flows'
        ]}
      ]
    },
    { id: 'weather-climate', title: 'Weather and Climate', icon: 'cloud-sun', gradient: ['#F59E0B', '#D97706'],
      content: [
        { subtitle: 'Climatic Elements', color: '#F59E0B', points: [
          '**Temperature**: Solar radiation, latitude, altitude, ocean currents effects',
          '**Precipitation**: Convectional, orographic, frontal rainfall patterns',
          '**Pressure**: High and low pressure systems, seasonal variations',
          '**Winds**: Trade winds, westerlies, monsoons, local wind systems',
          '**Humidity**: Absolute, relative humidity, evaporation, condensation'
        ]},
        { subtitle: 'Climate Classification', color: '#EC4899', points: [
          '**Tropical**: Hot and humid, rainforest, savanna climates',
          '**Temperate**: Moderate temperatures, continental, maritime influences',
          '**Polar**: Cold climates, tundra, ice cap conditions',
          '**Arid**: Desert, semi-arid, low precipitation regions',
          '**Mountain**: Alpine, highland climates, altitudinal variations'
        ]}
      ]
    },
    { id: 'water-bodies', title: 'Hydrosphere', icon: 'water', gradient: ['#06B6D4', '#0891B2'],
      content: [
        { subtitle: 'Ocean Systems', color: '#06B6D4', points: [
          '**Ocean Currents**: Gulf Stream, Kuroshio, climate regulation',
          '**Tides**: Gravitational pull of moon and sun, tidal energy',
          '**Ocean Floor**: Continental shelf, abyssal plains, mid-ocean ridges',
          '**Marine Ecosystems**: Coral reefs, deep sea, coastal wetlands',
          '**Ocean Resources**: Fisheries, minerals, petroleum, renewable energy'
        ]},
        { subtitle: 'Freshwater Systems', color: '#059669', points: [
          '**River Systems**: Drainage basins, water cycle, erosion and deposition',
          '**Lakes**: Origin, types, seasonal variations, economic importance',
          '**Groundwater**: Aquifers, water table, springs, groundwater depletion',
          '**Glaciers**: Formation, movement, glacial landforms, climate indicators',
          '**Wetlands**: Marshes, swamps, biodiversity, flood control'
        ]}
      ]
    }
  ],
};

// INDIAN GEOGRAPHY - Comprehensive coverage
const INDIAN_GEOGRAPHY_CONTENT = {
  overview: "India\'s geography encompasses diverse physical features from Himalayas to coastal plains, influencing climate, agriculture, and human settlement patterns.",
  sections: [
    { id: 'physical-features', title: 'Physical Divisions', icon: 'map', gradient: ['#3B82F6', '#2563EB'],
      content: [
        { subtitle: 'Northern Mountains', color: '#3B82F6', points: [
          '**Himalayas**: Highest mountain range, young fold mountains, 2400 km long',
          '**Three Ranges**: Himadri (Great Himalayas), Himachal (Lesser Himalayas), Shiwaliks (Outer Himalayas)',
          '**Important Peaks**: Everest (8848m), Kanchenjunga (8586m), Nanda Devi (7816m)',
          '**River Systems**: Indus, Ganga, Brahmaputra originate from Himalayas',
          '**Passes**: Khyber, Bolan, Nathu La, strategic importance'
        ]},
        { subtitle: 'Northern Plains', color: '#10B981', points: [
          '**Indus-Ganga-Brahmaputra Plains**: Alluvial deposits, most fertile region',
          '**Three Divisions**: Punjab Plains, Ganga Plains, Brahmaputra Plains',
          '**Soil Types**: New alluvium (Khadar), Old alluvium (Bhangar)',
          '**Economic Importance**: Agricultural heartland, 40% of India\'s population',
          '**Major Cities**: Delhi, Kolkata, Lucknow, Patna, Kanpur'
        ]},
        { subtitle: 'Peninsular Plateau', color: '#F59E0B', points: [
          '**Deccan Plateau**: Triangular landmass, ancient rocks, lava flows',
          '**Western Ghats**: Sahyadri range, biodiversity hotspot, monsoon barrier',
          '**Eastern Ghats**: Discontinuous hills, river valleys, mineral resources',
          '**Central Highlands**: Vindhyas, Satpuras, Aravalli ranges',
          '**Rivers**: Narmada, Tapti (west flowing), Godavari, Krishna, Cauvery (east flowing)'
        ]}
      ]
    },
    { id: 'climate-monsoon', title: 'Climate and Monsoons', icon: 'cloud-rain', gradient: ['#059669', '#047857'],
      content: [
        { subtitle: 'Monsoon System', color: '#059669', points: [
          '**Southwest Monsoon (June-September)**: Arabian Sea, Bay of Bengal branches',
          '**Northeast Monsoon (October-December)**: Winter monsoon, Tamil Nadu rainfall',
          '**Pre-monsoon (March-May)**: Hot and dry, local storms',
          '**Post-monsoon (October-November)**: Retreating monsoon, cyclones',
          '**Rainfall Distribution**: 75% of annual rainfall in 4 months'
        ]},
        { subtitle: 'Regional Variations', color: '#EC4899', points: [
          '**Tropical Wet**: Kerala, coastal Karnataka, heavy rainfall (>300cm)',
          '**Tropical Dry**: Central India, Deccan interior, moderate rainfall',
          '**Subtropical**: North India, hot summers, cold winters',
          '**Arid**: Rajasthan, Kutch, very low rainfall (<25cm)',
          '**Alpine**: High Himalayas, permanent snow, glacial climate'
        ]}
      ]
    },
    { id: 'natural-resources', title: 'Natural Resources', icon: 'gem', gradient: ['#DC2626', '#B91C1C'],
      content: [
        { subtitle: 'Mineral Resources', color: '#DC2626', points: [
          '**Coal**: Jharia, Raniganj, Korba coalfields, 70% of energy needs',
          '**Iron Ore**: Jharkhand, Odisha, Chhattisgarh, high-grade hematite',
          '**Petroleum**: Mumbai High, Assam, Gujarat, limited reserves',
          '**Bauxite**: Jharkhand, Odisha, aluminum ore, industrial use',
          '**Other Minerals**: Manganese, mica, limestone, copper'
        ]},
        { subtitle: 'Water Resources', color: '#06B6D4', points: [
          '**River Systems**: 12 major rivers, seasonal flow variations',
          '**Groundwater**: Over-exploitation, depletion in northwest',
          '**Irrigation**: Canals, tube wells, tanks, drip irrigation',
          '**Hydroelectric Power**: Western Ghats, Himalayas, renewable energy',
          '**Water Conflicts**: Inter-state disputes, Cauvery, Krishna rivers'
        ]}
      ]
    }
  ],
};

// WORLD GEOGRAPHY - Comprehensive coverage
const WORLD_GEOGRAPHY_CONTENT = {
  overview: "World geography studies distribution of continents, oceans, countries, and their physical and human characteristics across the globe.",
  sections: [
    { id: 'continents-oceans', title: 'Continents & Oceans', icon: 'globe', gradient: ['#3B82F6', '#2563EB'],
      content: [
        { subtitle: 'Seven Continents', color: '#3B82F6', points: [
          '**Asia**: Largest continent (30% land area), 60% world population',
          '**Africa**: Second largest, cradle of humanity, Sahara desert',
          '**North America**: USA, Canada, Mexico, Great Lakes region',
          '**South America**: Amazon rainforest, Andes mountains, Brazil largest',
          '**Antarctica**: Frozen continent, 90% world\'s ice, research stations',
          '**Europe**: Smallest continent, high development, Mediterranean climate',
          '**Australia**: Island continent, unique flora and fauna, Outback desert'
        ]},
        { subtitle: 'Five Oceans', color: '#06B6D4', points: [
          '**Pacific Ocean**: Largest, deepest, Ring of Fire, trade routes',
          '**Atlantic Ocean**: Second largest, S-shaped, separates Americas from Europe-Africa',
          '**Indian Ocean**: Third largest, monsoon influence, important shipping lanes',
          '**Southern Ocean**: Surrounds Antarctica, rough seas, marine life',
          '**Arctic Ocean**: Smallest, ice-covered, climate change impact'
        ]}
      ]
    },
    { id: 'global-climate', title: 'Global Climate Patterns', icon: 'thermometer-half', gradient: ['#F59E0B', '#D97706'],
      content: [
        { subtitle: 'Climate Zones', color: '#F59E0B', points: [
          '**Equatorial**: Amazon, Congo Basin, hot and wet all year',
          '**Tropical**: Monsoon regions, wet-dry seasons, savanna grasslands',
          '**Subtropical**: Mediterranean, hot dry summers, mild wet winters',
          '**Temperate**: Western Europe, eastern USA, moderate climate',
          '**Continental**: Central Asia, extreme seasonal temperature variation',
          '**Polar**: Arctic, Antarctic, permanently cold, permafrost'
        ]},
        { subtitle: 'Ocean Currents', color: '#06B6D4', points: [
          '**Warm Currents**: Gulf Stream, Kuroshio, North Atlantic Drift',
          '**Cold Currents**: Labrador, Peru, Canary currents',
          '**Thermohaline Circulation**: Global conveyor belt, climate regulation',
          '**El Niño/La Niña**: Pacific oscillation, global weather impact',
          '**Monsoon Circulation**: Seasonal wind reversal, Asia-Pacific region'
        ]}
      ]
    },
    { id: 'human-geography', title: 'Human Geography', icon: 'users', gradient: ['#EC4899', '#DB2777'],
      content: [
        { subtitle: 'Population Distribution', color: '#EC4899', points: [
          '**Population Clusters**: East Asia, South Asia, Europe, Eastern North America',
          '**Megacities**: Tokyo, Delhi, Shanghai, Mumbai over 10 million',
          '**Rural-Urban Migration**: Urbanization, 55% world population in cities',
          '**Demographic Transition**: Birth rates, death rates, population growth',
          '**Population Density**: Monaco (highest), Mongolia (lowest)'
        ]},
        { subtitle: 'Economic Geography', color: '#10B981', points: [
          '**Developed Countries**: High GDP per capita, North America, Europe, Japan',
          '**Developing Countries**: Middle income, Brazil, India, China',
          '**Least Developed**: Low income, mostly in Africa, limited infrastructure',
          '**Global Trade**: Shipping routes, trade blocs, WTO',
          '**Resource Distribution**: Oil (Middle East), minerals (Africa), agriculture (temperate zones)'
        ]}
      ]
    }
  ],
};

// CLIMATE AND WEATHER - Comprehensive coverage
const CLIMATE_WEATHER_CONTENT = {
  overview: "Climate and weather patterns are influenced by latitude, altitude, ocean currents, and atmospheric pressure, affecting global and regional conditions.",
  sections: [
    { id: 'weather-elements', title: 'Weather Elements', icon: 'cloud-sun', gradient: ['#3B82F6', '#2563EB'],
      content: [
        { subtitle: 'Temperature Patterns', color: '#3B82F6', points: [
          '**Solar Radiation**: Primary energy source, latitude effect on intensity',
          '**Diurnal Variation**: Daily temperature range, land-water contrast',
          '**Seasonal Variation**: Earth\'s axial tilt, solstices and equinoxes',
          '**Altitude Effect**: Temperature decreases 6.5°C per 1000m (lapse rate)',
          '**Continental vs Maritime**: Land heats/cools faster than water'
        ]},
        { subtitle: 'Precipitation Types', color: '#06B6D4', points: [
          '**Convectional Rain**: Thermal heating, equatorial regions, afternoon showers',
          '**Orographic Rain**: Mountain barrier effect, windward-leeward difference',
          '**Frontal Rain**: Warm-cold air mass meeting, temperate cyclones',
          '**Cyclonic Rain**: Low pressure systems, tropical cyclones',
          '**Snow and Hail**: Freezing precipitation, altitude and temperature dependent'
        ]}
      ]
    },
    { id: 'pressure-winds', title: 'Atmospheric Pressure and Winds', icon: 'wind', gradient: ['#F59E0B', '#D97706'],
      content: [
        { subtitle: 'Pressure Belts', color: '#F59E0B', points: [
          '**Equatorial Low**: ITCZ, convergence zone, ascending air',
          '**Subtropical High**: 30°N/S, descending air, desert formation',
          '**Subpolar Low**: 60°N/S, frontal activity, storm tracks',
          '**Polar High**: 90°N/S, cold dense air, outflowing winds',
          '**Seasonal Migration**: Pressure belts shift with sun\'s position'
        ]},
        { subtitle: 'Wind Systems', color: '#059669', points: [
          '**Trade Winds**: Tropical easterlies, consistent direction',
          '**Westerlies**: Mid-latitude winds, variable weather',
          '**Polar Easterlies**: Cold polar winds, limited extent',
          '**Monsoons**: Seasonal wind reversal, land-sea thermal contrast',
          '**Local Winds**: Sea-land breeze, mountain-valley winds'
        ]}
      ]
    },
    { id: 'climate-classification', title: 'Climate Classification', icon: 'map', gradient: ['#059669', '#047857'],
      content: [
        { subtitle: 'Köppen Climate System', color: '#059669', points: [
          '**Tropical (A)**: Hot climates, rainforest, monsoon, savanna',
          '**Dry (B)**: Arid and semi-arid, desert and steppe climates',
          '**Temperate (C)**: Moderate climates, humid subtropical, mediterranean',
          '**Continental (D)**: Cold winters, warm summers, subarctic',
          '**Polar (E)**: Tundra and ice cap, permanently cold'
        ]},
        { subtitle: 'Climate Controls', color: '#EC4899', points: [
          '**Latitude**: Primary control, solar angle variation',
          '**Altitude**: Temperature decrease with height, mountain climates',
          '**Ocean Currents**: Moderate coastal temperatures, humidity',
          '**Distance from Sea**: Continental vs maritime influence',
          '**Topography**: Mountain barriers, rain shadows, local variations'
        ]}
      ]
    }
  ],
};

// NATURAL RESOURCES - Comprehensive coverage
const RESOURCES_CONTENT = {
  overview: "Natural resources include renewable and non-renewable materials from Earth, essential for human survival and economic development.",
  sections: [
    { id: 'mineral-resources', title: 'Mineral Resources', icon: 'gem', gradient: ['#3B82F6', '#2563EB'],
      content: [
        { subtitle: 'Metallic Minerals', color: '#3B82F6', points: [
          '**Iron Ore**: Jharkhand (40%), Odisha (25%), Chhattisgarh (15%)',
          '**Coal**: Jharia, Raniganj, Korba coalfields, 70% of India\'s energy',
          '**Petroleum**: Mumbai High (60%), Assam, Gujarat, limited reserves',
          '**Bauxite**: Jharkhand, Odisha, aluminum production',
          '**Copper**: Rajasthan, Jharkhand, electrical industries',
          '**Manganese**: Odisha, Karnataka, steel production'
        ]},
        { subtitle: 'Non-metallic Minerals', color: '#10B981', points: [
          '**Limestone**: Cement industry, Rajasthan, Madhya Pradesh',
          '**Mica**: Electronics, Jharkhand, Andhra Pradesh',
          '**Salt**: Rajasthan, Gujarat, marine and rock salt',
          '**Gypsum**: Cement retarder, Rajasthan dominant producer',
          '**Phosphate**: Fertilizer industry, Rajasthan, Madhya Pradesh'
        ]}
      ]
    },
    { id: 'energy-resources', title: 'Energy Resources', icon: 'bolt', gradient: ['#F59E0B', '#D97706'],
      content: [
        { subtitle: 'Conventional Energy', color: '#F59E0B', points: [
          '**Thermal Power**: Coal-based (70%), natural gas, oil-fired',
          '**Hydroelectric**: River dams, 12% of total, monsoon dependent',
          '**Nuclear Power**: Uranium, thorium reserves, 22 reactors operating',
          '**Natural Gas**: Domestic production insufficient, imports from Qatar',
          '**Energy Security**: Import dependence, strategic petroleum reserves'
        ]},
        { subtitle: 'Renewable Energy', color: '#059669', points: [
          '**Solar Energy**: Rajasthan, Gujarat solar parks, rooftop installations',
          '**Wind Energy**: Tamil Nadu, Gujarat, Maharashtra, offshore potential',
          '**Biomass**: Agricultural waste, biogas, ethanol production',
          '**Small Hydro**: Mini/micro hydro projects, hill states',
          '**Geothermal**: Limited potential, experimental projects'
        ]}
      ]
    },
    { id: 'water-resources', title: 'Water Resources', icon: 'tint', gradient: ['#06B6D4', '#0891B2'],
      content: [
        { subtitle: 'Surface Water', color: '#06B6D4', points: [
          '**River Systems**: Ganga, Indus, Brahmaputra basins, seasonal flow',
          '**Reservoirs**: Major dams, irrigation, power generation',
          '**Inter-linking**: River connecting projects, water transfer',
          '**Flood Management**: Early warning, reservoir management',
          '**Water Quality**: Pollution control, treatment plants'
        ]},
        { subtitle: 'Groundwater', color: '#0891B2', points: [
          '**Aquifers**: Underground water storage, recharge rates',
          '**Overexploitation**: Punjab, Haryana, Rajasthan critical areas',
          '**Rainwater Harvesting**: Traditional methods, modern techniques',
          '**Groundwater Management**: Regulation, artificial recharge',
          '**Water Conservation**: Drip irrigation, efficient use'
        ]}
      ]
    }
  ],
};

// AGRICULTURE - Comprehensive coverage
const AGRICULTURE_CONTENT = {
  overview: "Agriculture forms the backbone of Indian economy, employing 50% of workforce and providing food security through diverse cropping patterns.",
  sections: [
    { id: 'cropping-patterns', title: 'Cropping Systems', icon: 'seedling', gradient: ['#059669', '#047857'],
      content: [
        { subtitle: 'Kharif Crops (Monsoon Season)', color: '#059669', points: [
          '**Rice**: Major food grain, West Bengal, Punjab, requires high water',
          '**Cotton**: Cash crop, Gujarat (40%), Maharashtra, export potential',
          '**Sugarcane**: Commercial crop, UP (50%), Maharashtra, water intensive',
          '**Pulses**: Arhar, moong, urad, protein source, nitrogen fixation',
          '**Oilseeds**: Groundnut, sesame, cotton seed, edible oil production'
        ]},
        { subtitle: 'Rabi Crops (Winter Season)', color: '#F59E0B', points: [
          '**Wheat**: Second major grain, Punjab, UP, Haryana, Green Revolution',
          '**Barley**: Coarse grain, Rajasthan, UP, drought resistant',
          '**Gram**: Major pulse, Madhya Pradesh, Rajasthan, chickpea',
          '**Mustard**: Oilseed, Rajasthan, Haryana, cold climate crop',
          '**Peas**: Vegetable crop, UP, Haryana, export quality'
        ]},
        { subtitle: 'Zaid Crops (Summer Season)', color: '#EC4899', points: [
          '**Rice**: Irrigated areas, Punjab, Haryana, summer variety',
          '**Maize**: Fodder crop, corn production, Bihar, Karnataka',
          '**Fodder**: Animal feed, dairy farming support',
          '**Vegetables**: Cucumber, watermelon, seasonal cultivation',
          '**Oilseeds**: Sunflower, sesame, limited cultivation'
        ]}
      ]
    },
    { id: 'green-revolution', title: 'Agricultural Development', icon: 'tractor', gradient: ['#10B981', '#059669'],
      content: [
        { subtitle: 'Green Revolution (1960s-70s)', color: '#10B981', points: [
          '**High Yielding Varieties**: Wheat, rice, increased productivity',
          '**Chemical Fertilizers**: NPK fertilizers, soil fertility',
          '**Irrigation**: Tube wells, canal systems, assured water supply',
          '**Technology**: Tractors, threshers, mechanization',
          '**Results**: Food self-sufficiency, export surplus'
        ]},
        { subtitle: 'Modern Challenges', color: '#DC2626', points: [
          '**Sustainability**: Soil degradation, water depletion, chemical residues',
          '**Climate Change**: Erratic rainfall, temperature rise, crop stress',
          '**Small Holdings**: Average 1.08 hectares, fragmentation',
          '**Market Access**: Price volatility, storage facilities, cold chain',
          '**Farmer Distress**: Debt burden, crop failure, suicide cases'
        ]}
      ]
    },
    { id: 'agricultural-policies', title: 'Government Policies', icon: 'file-contract', gradient: ['#8B5CF6', '#7C3AED'],
      content: [
        { subtitle: 'Support Systems', color: '#8B5CF6', points: [
          '**Minimum Support Price (MSP)**: Price guarantee, procurement system',
          '**Crop Insurance**: Risk mitigation, weather-based insurance',
          '**Subsidies**: Fertilizer, seed, irrigation, power subsidies',
          '**Credit Systems**: Cooperative banks, self-help groups, microfinance',
          '**Research**: ICAR, agricultural universities, extension services'
        ]},
        { subtitle: 'Recent Initiatives', color: '#EC4899', points: [
          '**Digital Agriculture**: Soil health cards, drone technology',
          '**Organic Farming**: Certification, export promotion, health benefits',
          '**Water Management**: Micro irrigation, watershed development',
          '**Value Addition**: Food processing, agribusiness, rural industrialization',
          '**Market Reforms**: e-NAM, direct marketing, contract farming'
        ]}
      ]
    }
  ],
};

// INDUSTRIES - Comprehensive coverage
const INDUSTRIES_CONTENT = {
  overview: "Indian industries range from traditional handicrafts to modern manufacturing, contributing significantly to GDP and employment generation.",
  sections: [
    { id: 'heavy-industries', title: 'Heavy Industries', icon: 'industry', gradient: ['#3B82F6', '#2563EB'],
      content: [
        { subtitle: 'Iron and Steel', color: '#3B82F6', points: [
          '**Major Plants**: TISCO (Jamshedpur), SAIL (Bhilai, Durgapur, Bokaro)',
          '**Private Sector**: JSW, Essar Steel, Jindal Steel and Power',
          '**Raw Materials**: Iron ore (domestic), coking coal (imported)',
          '**Production**: 100+ million tonnes annually, 2nd largest globally',
          '**Applications**: Construction, automobiles, defense'
        ]},
        { subtitle: 'Chemical Industries', color: '#10B981', points: [
          '**Petrochemicals**: Reliance (Jamnagar), ONGC, IOC refineries',
          '**Fertilizers**: IFFCO, NFL, urea and phosphate production',
          '**Pharmaceuticals**: Generic drugs, API production, global hub',
          '**Specialty Chemicals**: Dyes, pigments, Gujarat chemical corridor',
          '**Plastics**: Polymer production, packaging industry'
        ]}
      ]
    },
    { id: 'manufacturing', title: 'Manufacturing Sector', icon: 'cogs', gradient: ['#F59E0B', '#D97706'],
      content: [
        { subtitle: 'Automobile Industry', color: '#F59E0B', points: [
          '**Passenger Vehicles**: Maruti Suzuki, Hyundai, Tata Motors',
          '**Commercial Vehicles**: Ashok Leyland, Eicher Motors',
          '**Two Wheelers**: Hero MotoCorp, Bajaj Auto, TVS Motor',
          '**Auto Components**: Bosch, Motherson Sumi, global suppliers',
          '**Clusters**: Chennai, Pune, Gurgaon, Aurangabad'
        ]},
        { subtitle: 'Textile Industry', color: '#EC4899', points: [
          '**Cotton Textiles**: Maharashtra, Tamil Nadu, Gujarat clusters',
          '**Synthetic Fibers**: Polyester, nylon, technical textiles',
          '**Handloom**: Traditional weaving, employment generation',
          '**Garment Exports**: Ready-made garments, global supply chain',
          '**Technical Textiles**: Medical, automotive, industrial applications'
        ]}
      ]
    },
    { id: 'service-industries', title: 'Service Industries', icon: 'laptop', gradient: ['#8B5CF6', '#7C3AED'],
      content: [
        { subtitle: 'Information Technology', color: '#8B5CF6', points: [
          '**Software Services**: TCS, Infosys, Wipro, global delivery model',
          '**IT Hubs**: Bangalore, Hyderabad, Pune, Chennai, NCR',
          '**ITES/BPO**: Call centers, data processing, back-office operations',
          '**Startups**: Unicorns, fintech, e-commerce innovations',
          '**Digital India**: Government digitization, public services'
        ]},
        { subtitle: 'Financial Services', color: '#059669', points: [
          '**Banking**: Public (SBI) and private (HDFC, ICICI) banks',
          '**Insurance**: LIC, private insurers, penetration growth',
          '**Capital Markets**: Stock exchanges, mutual funds, pension funds',
          '**Fintech**: Digital payments, lending, wealth management',
          '**NBFC**: Vehicle finance, housing finance, microfinance'
        ]}
      ]
    }
  ],
};

// TRANSPORT - Comprehensive coverage
const TRANSPORT_CONTENT = {
  overview: "Transportation network includes roadways, airways, and waterways, facilitating movement of people and goods across the country.",
  sections: [
    { id: 'road-transport', title: 'Road Transport', icon: 'road', gradient: ['#F59E0B', '#D97706'],
      content: [
        { subtitle: 'Road Network', color: '#F59E0B', points: [
          '**Total Length**: 6.4 million km roads, 2nd largest network',
          '**National Highways**: 1.5 lakh km, high-speed connectivity',
          '**State Highways**: Inter-district connectivity, state maintenance',
          '**Rural Roads**: PMGSY scheme, all-weather village connectivity',
          '**Expressways**: Mumbai-Pune, Yamuna, Delhi-Meerut expressways'
        ]},
        { subtitle: 'Road Transport Industry', color: '#DC2626', points: [
          '**Freight Movement**: 70% of freight by road, truck transport',
          '**Passenger Transport**: Buses, taxis, shared mobility',
          '**Vehicle Manufacturing**: Largest two-wheeler market globally',
          '**Electric Vehicles**: Government push, charging infrastructure',
          '**Logistics**: Warehousing, last-mile delivery, e-commerce'
        ]}
      ]
    },
    { id: 'aviation-waterways', title: 'Aviation & Waterways', icon: 'plane', gradient: ['#059669', '#047857'],
      content: [
        { subtitle: 'Civil Aviation', color: '#059669', points: [
          '**Airports**: 487 airports, 103 international, AAI management',
          '**Airlines**: Air India, IndiGo, SpiceJet, domestic competition',
          '**Growth**: Fastest growing aviation market, UDAN scheme',
          '**Cargo**: Air freight, express delivery, perishables',
          '**MRO**: Maintenance, repair, overhaul facilities'
        ]},
        { subtitle: 'Water Transport', color: '#06B6D4', points: [
          '**Major Ports**: 13 major ports, JNPT (largest container port)',
          '**Minor Ports**: 200+ minor ports, state government control',
          '**Inland Waterways**: Ganga, Brahmaputra, coastal shipping',
          '**Shipping**: Indian flag vessels, coastal and overseas trade',
          '**Maritime Policy**: Sagarmala project, port modernization'
        ]}
      ]
    }
  ],
};

// Economy topics
// ECONOMY CONTENT - Comprehensive coverage

// BASIC ECONOMIC CONCEPTS - Expanded
const BASIC_CONCEPTS_CONTENT = {
  overview: "Basic economic concepts include GDP, inflation, monetary policy, and fiscal measures that form foundation of economic understanding.",
  sections: [
    { id: 'national-income', title: 'National Income Accounting', icon: 'calculator', gradient: ['#F59E0B', '#D97706'],
      content: [
        { subtitle: 'GDP and Related Concepts', color: '#8B5CF6', points: [
          '**Gross Domestic Product (GDP)**: Total value of goods and services produced within country',
          '**Gross National Product (GNP)**: GDP + Net factor income from abroad',
          '**Net National Product (NNP)**: GNP - Depreciation (capital consumption)',
          '**National Income**: NNP at factor cost, actual earnings of factors',
          '**Per Capita Income**: National income divided by population',
          '**Real vs Nominal**: Real adjusted for inflation, nominal at current prices'
        ]}
      ]
    },
    { id: 'inflation-unemployment', title: 'Inflation and Employment', icon: 'chart-line', gradient: ['#EF4444', '#DC2626'],
      content: [
        { subtitle: 'Price Level and Labor Market', color: '#10B981', points: [
          '**Inflation**: General rise in price level, erosion of purchasing power',
          '**Types of Inflation**: Demand-pull, cost-push, built-in inflation',
          '**Measurement**: Consumer Price Index (CPI), Wholesale Price Index (WPI)',
          '**Unemployment**: People actively seeking work but unable to find',
          '**Types of Unemployment**: Structural, frictional, cyclical, seasonal',
          '**Phillips Curve**: Trade-off between inflation and unemployment'
        ]}
      ]
    },
    { id: 'monetary-fiscal', title: 'Monetary and Fiscal Policy', icon: 'university', gradient: ['#3B82F6', '#2563EB'],
      content: [
        { subtitle: 'Government Economic Management', color: '#EC4899', points: [
          '**Monetary Policy**: Central bank control of money supply and interest rates',
          '**Tools**: Repo rate, reverse repo, CRR, SLR, open market operations',
          '**Fiscal Policy**: Government spending and taxation policies',
          '**Budget Deficit**: Government expenditure exceeds revenue',
          '**Public Debt**: Government borrowing, debt-to-GDP ratio',
          '**Automatic Stabilizers**: Progressive taxation, unemployment benefits'
        ]}
      ]
    }
  ],
};

// INDIAN ECONOMY - Comprehensive coverage
const INDIAN_ECONOMY_CONTENT = {
  overview: "Indian economy is a mixed economy transitioning from agriculture-based to services-led growth model with increasing manufacturing contribution.",
  sections: [
    { id: 'economic-structure', title: 'Sectoral Composition', icon: 'chart-pie', gradient: ['#F59E0B', '#D97706'],
      content: [
        { subtitle: 'Three Sectors of Economy', color: '#8B5CF6', points: [
          '**Primary Sector (16% GDP)**: Agriculture, forestry, fishing, mining',
          '**Secondary Sector (30% GDP)**: Manufacturing, construction, electricity',
          '**Tertiary Sector (54% GDP)**: Services, trade, transport, communication',
          '**Employment Distribution**: 50% in agriculture, 20% in industry, 30% in services',
          '**Structural Transformation**: Shift from agriculture to services-led growth',
          '**Manufacturing Share**: Around 15-17% of GDP, target is 25%'
        ]}
      ]
    },
    { id: 'economic-reforms', title: 'Economic Reforms Since 1991', icon: 'chart-line', gradient: ['#059669', '#047857'],
      content: [
        { subtitle: 'Liberalization Process', color: '#10B981', points: [
          '**Balance of Payments Crisis (1991)**: Foreign exchange reserves at 3 weeks import',
          '**New Economic Policy**: Liberalization, Privatization, Globalization (LPG)',
          '**Industrial Policy**: Abolition of industrial licensing, MRTP Act reforms',
          '**Trade Policy**: Import liberalization, export promotion, WTO membership',
          '**Financial Sector Reforms**: Banking sector liberalization, capital market development',
          '**Foreign Investment**: FDI liberalization, sectoral caps, automatic route'
        ]}
      ]
    },
    { id: 'growth-performance', title: 'Economic Growth and Development', icon: 'trending-up', gradient: ['#3B82F6', '#2563EB'],
      content: [
        { subtitle: 'Growth Trajectory', color: '#EC4899', points: [
          '**GDP Growth**: Average 6-7% post-1991, 3.5% Hindu rate of growth pre-1991',
          '**Per Capita Income**: $2,100 (nominal), $6,700 (PPP) as of 2021',
          '**Poverty Reduction**: Declined from 45% (1993) to 21% (2011)',
          '**Human Development**: HDI rank 131 out of 189 countries',
          '**Income Inequality**: Gini coefficient around 0.82, among highest globally',
          '**Global Rankings**: 5th largest economy by nominal GDP, 3rd by PPP'
        ]}
      ]
    },
    { id: 'challenges-opportunities', title: 'Economic Challenges and Opportunities', icon: 'balance-scale', gradient: ['#DC2626', '#B91C1C'],
      content: [
        { subtitle: 'Contemporary Issues', color: '#F59E0B', points: [
          '**Employment Challenge**: Jobless growth, skill mismatch, demographic dividend',
          '**Infrastructure Deficit**: Power, transport, urban infrastructure gaps',
          '**Agricultural Distress**: Low productivity, farmer suicides, MSP issues',
          '**Informal Economy**: 90% workers in informal sector, social security gaps',
          '**Digital Economy**: Digital India, fintech revolution, e-governance',
          '**Sustainability**: Environmental concerns, renewable energy transition'
        ]}
      ]
    }
  ],
};

// ECONOMIC PLANNING - Comprehensive coverage
const PLANNING_CONTENT = {
  overview: "Economic planning in India began with Five Year Plans focusing on growth, employment, and poverty alleviation through systematic resource allocation.",
  sections: [
    { id: 'five-year-plans', title: 'Five Year Plans Evolution', icon: 'clipboard-list', gradient: ['#F59E0B', '#D97706'],
      content: [
        { subtitle: 'Early Plans (1951-1980)', color: '#8B5CF6', points: [
          '**First Plan (1951-56)**: Agriculture, irrigation, rehabilitation after partition',
          '**Second Plan (1956-61)**: Heavy industries, Mahalanobis model, steel plants',
          '**Third Plan (1961-66)**: Self-reliance, agriculture and industry balance',
          '**Plan Holiday (1966-69)**: Severe drought, Indo-Pak wars, plan suspension',
          '**Fourth Plan (1969-74)**: Growth with social justice, nationalization of banks',
          '**Fifth Plan (1974-79)**: Poverty alleviation, employment generation, IRDP'
        ]},
        { subtitle: 'Modern Plans (1980-2017)', color: '#10B981', points: [
          '**Sixth Plan (1980-85)**: Economic liberalization beginning, technology focus',
          '**Seventh Plan (1985-90)**: Food security, employment, productivity growth',
          '**Eighth Plan (1992-97)**: Human development, economic reforms, globalization',
          '**Ninth Plan (1997-2002)**: Growth with social justice, Swarna Jayanti Rojgar Yojana',
          '**Tenth Plan (2002-07)**: Doubling per capita income, fiscal consolidation',
          '**Eleventh Plan (2007-12)**: Inclusive growth, education, health, rural development'
        ]}
      ]
    },
    { id: 'planning-commission', title: 'Planning Commission to NITI Aayog', icon: 'university', gradient: ['#3B82F6', '#2563EB'],
      content: [
        { subtitle: 'Planning Commission (1950-2014)', color: '#3B82F6', points: [
          '**Establishment**: March 1950, Nehru as chairman, advisory body',
          '**Functions**: Plan formulation, resource allocation, progress monitoring',
          '**Central Planning**: Top-down approach, five-year planning cycles',
          '**Achievements**: Infrastructure development, industrial base creation',
          '**Limitations**: Rigid planning, slow decision making, federal issues'
        ]},
        { subtitle: 'NITI Aayog (2015 onwards)', color: '#EC4899', points: [
          '**Transformation**: From plan to strategy, cooperative federalism',
          '**Structure**: CEO, full-time members, part-time members, ex-officio members',
          '**Functions**: Policy think tank, development agenda, monitoring framework',
          '**Initiatives**: SDG India Index, Aspirational Districts, Atal Innovation Mission',
          '**Strategy Papers**: Three-year action agenda, fifteen-year vision document'
        ]}
      ]
    }
  ],
};

// AGRICULTURAL ECONOMICS - Comprehensive coverage
const AGRICULTURE_ECONOMY_CONTENT = {
  overview: "Agriculture contributes 16% to GDP but employs 50% of workforce, facing challenges of low productivity and farmer distress.",
  sections: [
    { id: 'green-revolution', title: 'Agricultural Revolutions', icon: 'seedling', gradient: ['#059669', '#047857'],
      content: [
        { subtitle: 'Green Revolution (1960s-70s)', color: '#059669', points: [
          '**High Yielding Varieties**: Mexican wheat, IR-8 rice, increased productivity',
          '**Irrigation**: Tube wells, canal systems, assured water supply',
          '**Chemical Inputs**: Fertilizers (NPK), pesticides, soil nutrition',
          '**Technology**: Tractors, harvesters, farm mechanization',
          '**Results**: Food self-sufficiency, wheat revolution in Punjab, Haryana',
          '**Limitations**: Regional imbalance, environmental degradation, input dependency'
        ]},
        { subtitle: 'White Revolution (1970s-80s)', color: '#06B6D4', points: [
          '**Operation Flood**: Cooperative dairy development, Verghese Kurien',
          '**Milk Production**: India became largest milk producer globally',
          '**Cooperative Structure**: Village cooperatives, state federations, NDDB',
          '**Technology**: Artificial insemination, cattle feed, veterinary care',
          '**Amul Model**: Brand building, farmer ownership, rural employment'
        ]}
      ]
    },
    { id: 'agricultural-marketing', title: 'Agricultural Marketing', icon: 'store', gradient: ['#F59E0B', '#D97706'],
      content: [
        { subtitle: 'Market Structure and Issues', color: '#F59E0B', points: [
          '**APMCs**: Agricultural Produce Marketing Committees, regulated markets',
          '**Price Discovery**: Auction system, commission agents (arhtiyas)',
          '**Storage**: Warehousing, Food Corporation of India, buffer stocks',
          '**Transportation**: Rural connectivity, cold chain, post-harvest losses',
          '**Processing**: Value addition, agro-industries, food processing zones'
        ]},
        { subtitle: 'Support Systems', color: '#8B5CF6', points: [
          '**Minimum Support Price**: Price guarantee, government procurement',
          '**Public Distribution**: Food subsidies, targeted PDS, Antyodaya',
          '**Crop Insurance**: Weather-based, yield insurance, risk mitigation',
          '**Credit Systems**: Crop loans, Kisan Credit Cards, interest subvention',
          '**Input Subsidies**: Fertilizer, seed, power, irrigation subsidies'
        ]}
      ]
    },
    { id: 'recent-reforms', title: 'Agricultural Reforms', icon: 'balance-scale', gradient: ['#EC4899', '#DB2777'],
      content: [
        { subtitle: 'Market Reforms', color: '#EC4899', points: [
          '**e-NAM**: Electronic National Agriculture Market, online trading',
          '**Direct Marketing**: Farmer-consumer interface, elimination of middlemen',
          '**Contract Farming**: Corporate tie-ups, assured procurement, quality production',
          '**FPOs**: Farmer Producer Organizations, collective bargaining power',
          '**Export Promotion**: Agricultural Export Policy, global market access'
        ]},
        { subtitle: 'Sustainability Initiatives', color: '#059669', points: [
          '**Organic Farming**: Chemical-free production, certification, premium markets',
          '**Natural Farming**: Zero Budget Natural Farming, traditional methods',
          '**Climate Smart Agriculture**: Drought-resistant varieties, weather advisories',
          '**Water Conservation**: Drip irrigation, sprinkler systems, water harvesting',
          '**Soil Health**: Soil health cards, nutrient management, organic matter'
        ]}
      ]
    }
  ],
};

// INDUSTRIAL ECONOMICS - Comprehensive coverage
const INDUSTRY_ECONOMY_CONTENT = {
  overview: "Industrial sector contributes 30% to GDP, ranging from traditional textiles to modern electronics and automotive industries.",
  sections: [
    { id: 'industrial-development', title: 'Industrial Development Strategy', icon: 'industry', gradient: ['#3B82F6', '#2563EB'],
      content: [
        { subtitle: 'Evolution of Industrial Policy', color: '#3B82F6', points: [
          '**Industrial Policy 1948**: Mixed economy, state control, import substitution',
          '**Industrial Policy 1956**: Public sector dominance, Mahalanobis model',
          '**Industrial Policy 1980**: Partial liberalization, capacity expansion',
          '**Industrial Policy 1991**: Economic reforms, private sector emphasis',
          '**Make in India (2014)**: Manufacturing hub, 25 focus sectors, ease of business'
        ]},
        { subtitle: 'Current Manufacturing Initiatives', color: '#10B981', points: [
          '**Production Linked Incentives**: PLI for electronics, pharmaceuticals, textiles',
          '**Industrial Corridors**: DMIC, Chennai-Bengaluru, smart industrial cities',
          '**Skill Development**: Industrial training, technical education, apprenticeship',
          '**MSME Support**: Credit guarantee, technology upgradation, cluster development',
          '**Startup India**: Innovation ecosystem, incubation, risk capital'
        ]}
      ]
    },
    { id: 'manufacturing-sectors', title: 'Key Manufacturing Sectors', icon: 'cogs', gradient: ['#F59E0B', '#D97706'],
      content: [
        { subtitle: 'Traditional Industries', color: '#F59E0B', points: [
          '**Textiles**: Cotton, synthetic, technical textiles, employment intensive',
          '**Food Processing**: Value addition, export potential, SAMPADA scheme',
          '**Leather**: Footwear, garments, export-oriented, Tamil Nadu cluster',
          '**Gems & Jewelry**: Diamond cutting, gold jewelry, traditional craftsmanship',
          '**Handicrafts**: Artisan products, cultural heritage, rural employment'
        ]},
        { subtitle: 'Modern Industries', color: '#8B5CF6', points: [
          '**Electronics**: Mobile phones, semiconductors, Make in India success',
          '**Automobiles**: Passenger vehicles, two-wheelers, auto components',
          '**Pharmaceuticals**: Generic drugs, API production, global market leader',
          '**Chemicals**: Specialty chemicals, petrochemicals, Gujarat hub',
          '**Renewable Energy**: Solar panels, wind turbines, energy transition'
        ]}
      ]
    },
    { id: 'industrial-policy', title: 'Industrial Policy Framework', icon: 'file-contract', gradient: ['#059669', '#047857'],
      content: [
        { subtitle: 'Regulatory Environment', color: '#059669', points: [
          '**Licensing**: Industrial licensing abolished except few sectors',
          '**Environmental Clearance**: Pollution control, impact assessment',
          '**Land Acquisition**: Industrial land banks, single window clearances',
          '**Labor Laws**: Industrial Relations Code, social security reforms',
          '**Competition Policy**: Anti-monopoly, fair competition, consumer protection'
        ]},
        { subtitle: 'Investment Climate', color: '#DC2626', points: [
          '**FDI Policy**: Sectoral caps, automatic vs approval route',
          '**Ease of Doing Business**: Ranking improvements, digital processes',
          '**Infrastructure**: Industrial parks, SEZs, connectivity projects',
          '**Finance**: Industrial credit, venture capital, corporate bonds',
          '**Technology**: R&D incentives, IPR protection, innovation hubs'
        ]}
      ]
    }
  ],
};

// SERVICES SECTOR - Comprehensive coverage
const SERVICES_CONTENT = {
  overview: "Services sector contributes 54% to GDP, led by IT services, telecommunications, banking, and retail trade.",
  sections: [
    { id: 'it-services', title: 'Information Technology Services', icon: 'laptop', gradient: ['#8B5CF6', '#7C3AED'],
      content: [
        { subtitle: 'IT Industry Overview', color: '#8B5CF6', points: [
          '**Revenue**: $227 billion (2022), 7.4% of GDP contribution',
          '**Employment**: 5 million direct, 16 million indirect employment',
          '**Global Share**: 55% of global IT services sourcing market',
          '**Exports**: $178 billion, major foreign exchange earner',
          '**Growth**: 8-10% annual growth, resilient during pandemic'
        ]},
        { subtitle: 'IT Services Segments', color: '#06B6D4', points: [
          '**Software Development**: Custom applications, product engineering',
          '**IT Consulting**: Digital transformation, cloud migration, analytics',
          '**ITES/BPO**: Business process outsourcing, customer support',
          '**Engineering R&D**: Product development, testing, embedded software',
          '**Digital Services**: AI/ML, blockchain, IoT, cybersecurity'
        ]}
      ]
    },
    { id: 'financial-services', title: 'Financial Services', icon: 'coins', gradient: ['#10B981', '#059669'],
      content: [
        { subtitle: 'Banking Sector', color: '#10B981', points: [
          '**Structure**: Public (27%), private (37%), foreign (6%) banks',
          '**Branch Network**: 1.5 lakh branches, rural penetration focus',
          '**Digital Banking**: UPI transactions, mobile banking, fintech integration',
          '**Credit Growth**: 8-12% annually, priority sector lending',
          '**Financial Inclusion**: Jan Dhan accounts, Direct Benefit Transfer'
        ]},
        { subtitle: 'Capital Markets & Insurance', color: '#F59E0B', points: [
          '**Stock Exchanges**: BSE, NSE, derivatives trading, FII/DII participation',
          '**Mutual Funds**: AUM growth, SIP culture, retail participation',
          '**Insurance**: Life (LIC dominant), general insurance, penetration low',
          '**Pension Funds**: NPS, EPFO, retirement savings, demographic dividend',
          '**Regulatory Framework**: RBI, SEBI, IRDAI, financial stability'
        ]}
      ]
    },
    { id: 'other-services', title: 'Other Service Sectors', icon: 'briefcase', gradient: ['#EC4899', '#DB2777'],
      content: [
        { subtitle: 'Trade and Commerce', color: '#EC4899', points: [
          '**Retail Trade**: Organized (12%) vs unorganized (88%), e-commerce growth',
          '**Wholesale Trade**: Distribution networks, supply chain, B2B platforms',
          '**E-commerce**: Online marketplaces, digital payments, logistics',
          '**Tourism**: Foreign tourist arrivals, domestic tourism, hospitality sector',
          '**Real Estate**: Residential, commercial, RERA regulation'
        ]},
        { subtitle: 'Professional Services', color: '#3B82F6', points: [
          '**Healthcare**: Medical tourism, telemedicine, pharmaceutical services',
          '**Education**: Skill development, online education, EdTech platforms',
          '**Legal Services**: Corporate law, litigation, legal process outsourcing',
          '**Consulting**: Management consulting, advisory services, global firms',
          '**Media & Entertainment**: Film industry, OTT platforms, digital content'
        ]}
      ]
    }
  ],
};

// BANKING SYSTEM - Comprehensive coverage
const BANKING_CONTENT = {
  overview: "Indian banking system includes public, private, and foreign banks regulated by RBI, providing credit and financial services.",
  sections: [
    { id: 'rbi-functions', title: 'Reserve Bank of India', icon: 'landmark', gradient: ['#3B82F6', '#2563EB'],
      content: [
        { subtitle: 'Central Banking Functions', color: '#3B82F6', points: [
          '**Monetary Policy**: Inflation targeting, interest rate transmission, liquidity management',
          '**Currency Management**: Sole authority to issue notes, currency security features',
          '**Banking Regulation**: License banks, inspect, prudential norms, resolution',
          '**Financial System**: Payment systems, government banking, forex management',
          '**Development**: Financial inclusion, priority sector, rural credit'
        ]},
        { subtitle: 'Monetary Policy Tools', color: '#10B981', points: [
          '**Policy Rates**: Repo rate (4%), reverse repo, marginal standing facility',
          '**Reserve Requirements**: CRR (4%), SLR (18%), liquidity management',
          '**Open Market Operations**: G-sec buying/selling, liquidity injection/absorption',
          '**Forward Guidance**: Communication strategy, market expectations',
          '**Macroprudential**: Systemic risk, countercyclical measures, financial stability'
        ]}
      ]
    },
    { id: 'banking-structure', title: 'Banking Structure', icon: 'building', gradient: ['#059669', '#047857'],
      content: [
        { subtitle: 'Public Sector Banks', color: '#059669', points: [
          '**State Bank of India**: Largest bank, merged associate banks',
          '**Nationalized Banks**: PNB, Bank of Baroda, Canara Bank (19 banks)',
          '**Market Share**: 60% of banking assets, government ownership',
          '**Challenges**: NPA issues, capital adequacy, technology upgradation',
          '**Reforms**: Bank consolidation, governance reforms, digital transformation'
        ]},
        { subtitle: 'Private Sector Banks', color: '#F59E0B', points: [
          '**Old Private**: Federal Bank, Karur Vysya Bank, pre-1980 establishment',
          '**New Private**: HDFC, ICICI, Axis Bank, post-1993 liberalization',
          '**Performance**: Better efficiency, technology adoption, customer service',
          '**Growth**: Rapid expansion, market share increase, urban focus',
          '**Innovation**: Digital banking, fintech partnerships, niche products'
        ]}
      ]
    },
    { id: 'banking-reforms', title: 'Banking Sector Reforms', icon: 'chart-line', gradient: ['#EC4899', '#DB2777'],
      content: [
        { subtitle: 'Regulatory Reforms', color: '#EC4899', points: [
          '**Basel Norms**: Capital adequacy, risk management, international standards',
          '**NPA Resolution**: IBC framework, ARC, bad bank concept',
          '**Corporate Governance**: Board independence, risk management, transparency',
          '**Financial Inclusion**: Jan Dhan, Direct Benefit Transfer, rural banking',
          '**Technology**: Core Banking Solutions, digital payments, cybersecurity'
        ]},
        { subtitle: 'Digital Transformation', color: '#8B5CF6', points: [
          '**Payment Systems**: RTGS, NEFT, UPI, immediate payment settlement',
          '**Digital Banking**: Mobile apps, internet banking, branchless banking',
          '**Fintech Integration**: API banking, open banking, innovation sandbox',
          '**Financial Inclusion**: Business correspondents, Aadhaar-enabled payments',
          '**Cybersecurity**: Digital frauds, data protection, security protocols'
        ]}
      ]
    }
  ],
};

// GOVERNMENT BUDGET - Comprehensive coverage
const BUDGET_CONTENT = {
  overview: "Union Budget outlines government\'s revenue and expenditure plans, implementing fiscal policy for economic growth and welfare.",
  sections: [
    { id: 'budget-structure', title: 'Budget Structure', icon: 'file-invoice-dollar', gradient: ['#F59E0B', '#D97706'],
      content: [
        { subtitle: 'Revenue Receipts', color: '#F59E0B', points: [
          '**Tax Revenue (80%)**: Direct taxes (income, corporate), Indirect taxes (GST, customs)',
          '**Direct Taxes**: Income tax, corporate tax, wealth tax, capital gains',
          '**Indirect Taxes**: GST (28% weightage), customs duties, excise duties',
          '**Non-Tax Revenue (20%)**: Dividends, interest, fees, fines, spectrum auctions',
          '**Tax-GDP Ratio**: Around 11-12%, target to increase to 15%'
        ]},
        { subtitle: 'Capital Receipts', color: '#10B981', points: [
          '**Market Borrowings**: Government bonds, G-secs, institutional investors',
          '**Disinvestment**: PSU share sales, strategic sales, ETF route',
          '**Recovery of Loans**: States, PSUs, external assistance recovery',
          '**External Assistance**: World Bank, ADB, bilateral loans',
          '**Small Savings**: PPF, NSC, KVP, post office deposits'
        ]}
      ]
    },
    { id: 'expenditure-pattern', title: 'Government Expenditure', icon: 'hand-holding-usd', gradient: ['#3B82F6', '#2563EB'],
      content: [
        { subtitle: 'Revenue Expenditure', color: '#3B82F6', points: [
          '**Interest Payments**: 24% of total expenditure, debt servicing burden',
          '**Salaries & Pensions**: Government employees, defense personnel',
          '**Subsidies**: Food, fertilizer, petroleum, LPG subsidies',
          '**Grants to States**: Finance Commission, centrally sponsored schemes',
          '**Defense Revenue**: Pay, allowances, maintenance, non-capital items'
        ]},
        { subtitle: 'Capital Expenditure', color: '#059669', points: [
          '**Infrastructure**: Roads, ports, digital infrastructure',
          '**Defense Capital**: Aircraft, ships, weapons systems procurement',
          '**Loans to States**: Development projects, disaster relief, special assistance',
          '**Asset Creation**: Hospitals, schools, irrigation, power projects',
          '**Equity Participation**: PSU investments, financial institutions'
        ]}
      ]
    },
    { id: 'fiscal-indicators', title: 'Fiscal Health Indicators', icon: 'chart-bar', gradient: ['#DC2626', '#B91C1C'],
      content: [
        { subtitle: 'Deficit Management', color: '#DC2626', points: [
          '**Fiscal Deficit**: Total expenditure minus total receipt, 6.4% of GDP (2022-23)',
          '**Revenue Deficit**: Revenue expenditure exceeds revenue receipt',
          '**Primary Deficit**: Fiscal deficit minus interest payments',
          '**FRBM Act**: Fiscal responsibility targets, deficit reduction roadmap',
          '**Debt Sustainability**: Debt-GDP ratio around 90%, manageable levels'
        ]},
        { subtitle: 'Budget Process', color: '#8B5CF6', points: [
          '**Budget Preparation**: Finance Ministry, expenditure departments, consultations',
          '**Parliamentary Approval**: Budget presentation, discussion, voting',
          '**Implementation**: Expenditure control, revenue monitoring, mid-year review',
          '**Audit**: CAG audit, PAC examination, accountability mechanism',
          '**Outcomes**: Performance measurement, evaluation, course correction'
        ]}
      ]
    }
  ],
};

// SCIENCE & TECHNOLOGY - Comprehensive coverage

// PHYSICS - Expanded coverage
const PHYSICS_CONTENT = {
  overview: "Physics studies matter, energy, and their interactions, forming the foundation for technological advancement and scientific understanding.",
  sections: [
    { id: 'classical-physics', title: 'Classical Physics', icon: 'atom', gradient: ['#8B5CF6', '#7C3AED'],
      content: [
        { subtitle: 'Mechanics and Motion', color: '#8B5CF6', points: [
          '**Newton\'s Laws**: First law (inertia), second law (F=ma), third law (action-reaction)',
          '**Conservation Laws**: Energy, momentum, angular momentum conservation',
          '**Gravitation**: Universal law, planetary motion, Kepler\'s laws',
          '**Simple Harmonic Motion**: Oscillations, waves, pendulum motion',
          '**Applications**: Satellite technology, space missions, engineering mechanics'
        ]},
        { subtitle: 'Heat and Thermodynamics', color: '#F59E0B', points: [
          '**Laws of Thermodynamics**: First law (energy), second law (entropy), third law',
          '**Heat Transfer**: Conduction, convection, radiation mechanisms',
          '**Kinetic Theory**: Gas laws, molecular motion, statistical mechanics',
          '**Heat Engines**: Carnot cycle, efficiency, refrigeration cycles',
          '**Applications**: Power plants, refrigeration, automotive engines'
        ]}
      ]
    },
    { id: 'modern-physics', title: 'Modern Physics', icon: 'radiation', gradient: ['#DC2626', '#B91C1C'],
      content: [
        { subtitle: 'Quantum Physics', color: '#DC2626', points: [
          '**Quantum Theory**: Planck\'s constant, energy quantization, wave-particle duality',
          '**Atomic Structure**: Bohr model, electron orbitals, quantum numbers',
          '**Uncertainty Principle**: Heisenberg principle, quantum measurement',
          '**Applications**: Laser technology, semiconductors, quantum computing',
          '**Quantum Mechanics**: Schrödinger equation, probability interpretation'
        ]},
        { subtitle: 'Nuclear Physics', color: '#059669', points: [
          '**Nuclear Structure**: Protons, neutrons, nuclear binding energy',
          '**Radioactivity**: Alpha, beta, gamma decay, half-life concept',
          '**Nuclear Reactions**: Fission, fusion, chain reactions',
          '**Applications**: Nuclear power, medical imaging, carbon dating',
          '**Particle Physics**: Standard model, fundamental particles, accelerators'
        ]}
      ]
    },
    { id: 'applied-physics', title: 'Applied Physics', icon: 'microchip', gradient: ['#06B6D4', '#0891B2'],
      content: [
        { subtitle: 'Electronics and Semiconductor Physics', color: '#06B6D4', points: [
          '**Semiconductor Theory**: P-type, N-type materials, band theory',
          '**Electronic Devices**: Diodes, transistors, integrated circuits',
          '**Digital Electronics**: Logic gates, processors, memory devices',
          '**Applications**: Computers, smartphones, electronic gadgets',
          '**Nanotechnology**: Quantum dots, nanoelectronics, molecular devices'
        ]},
        { subtitle: 'Optics and Photonics', color: '#EC4899', points: [
          '**Wave Optics**: Interference, diffraction, polarization phenomena',
          '**Laser Physics**: Light amplification, coherence, laser applications',
          '**Fiber Optics**: Total internal reflection, optical communication',
          '**Applications**: Telecommunications, medical devices, precision instruments',
          '**Photovoltaics**: Solar cells, light-electricity conversion, renewable energy'
        ]}
      ]
    }
  ],
};

// CHEMISTRY - Comprehensive coverage
const CHEMISTRY_CONTENT = {
  overview: "Chemistry studies composition, structure, and properties of matter and chemical reactions essential for pharmaceutical and industrial applications.",
  sections: [
    { id: 'inorganic-chemistry', title: 'Inorganic Chemistry', icon: 'vial', gradient: ['#3B82F6', '#2563EB'],
      content: [
        { subtitle: 'Periodic Table and Elements', color: '#3B82F6', points: [
          '**Periodic Classification**: Groups, periods, periodic trends in properties',
          '**Chemical Bonding**: Ionic, covalent, metallic bonding theories',
          '**Coordination Compounds**: Complex ions, ligands, applications in medicine',
          '**Transition Elements**: Variable oxidation states, catalytic properties',
          '**Main Group Elements**: Alkali metals, halogens, noble gases'
        ]},
        { subtitle: 'Acids, Bases and Salts', color: '#059669', points: [
          '**Acid-Base Theories**: Arrhenius, Brønsted-Lowry, Lewis concepts',
          '**pH Scale**: Hydrogen ion concentration, buffer solutions',
          '**Salt Hydrolysis**: Acidic, basic, neutral salts formation',
          '**Industrial Acids**: Sulfuric acid, hydrochloric acid, nitric acid production',
          '**Applications**: Chemical industry, pharmaceuticals, agriculture'
        ]}
      ]
    },
    { id: 'organic-chemistry', title: 'Organic Chemistry', icon: 'flask', gradient: ['#059669', '#047857'],
      content: [
        { subtitle: 'Hydrocarbons and Functional Groups', color: '#059669', points: [
          '**Saturated Hydrocarbons**: Alkanes, single bonds, petroleum derivatives',
          '**Unsaturated Hydrocarbons**: Alkenes, alkynes, multiple bonds',
          '**Aromatic Compounds**: Benzene, aromatic substitution reactions',
          '**Functional Groups**: Alcohols, aldehydes, ketones, carboxylic acids',
          '**Organic Reactions**: Addition, substitution, elimination, oxidation-reduction'
        ]},
        { subtitle: 'Polymers and Biomolecules', color: '#8B5CF6', points: [
          '**Synthetic Polymers**: Plastics, rubber, synthetic fibers, thermoplastics',
          '**Natural Polymers**: Proteins, carbohydrates, nucleic acids, cellulose',
          '**Biomolecules**: Amino acids, sugars, fatty acids, vitamins',
          '**Pharmaceutical Chemistry**: Drug design, synthesis, medicinal compounds',
          '**Applications**: Plastics industry, pharmaceutical, biotechnology'
        ]}
      ]
    },
    { id: 'physical-chemistry', title: 'Physical Chemistry', icon: 'thermometer', gradient: ['#F59E0B', '#D97706'],
      content: [
        { subtitle: 'Chemical Thermodynamics', color: '#F59E0B', points: [
          '**Energy Changes**: Enthalpy, entropy, Gibbs free energy in reactions',
          '**Chemical Equilibrium**: Le Chatelier principle, equilibrium constant',
          '**Reaction Kinetics**: Rate laws, activation energy, catalysis',
          '**Electrochemistry**: Galvanic cells, electrolysis, corrosion',
          '**Surface Chemistry**: Adsorption, colloids, catalysis mechanisms'
        ]},
        { subtitle: 'Analytical Chemistry', color: '#DC2626', points: [
          '**Qualitative Analysis**: Identification of ions, functional groups',
          '**Quantitative Analysis**: Gravimetric, volumetric analysis methods',
          '**Instrumental Methods**: Spectroscopy, chromatography, mass spectrometry',
          '**Environmental Chemistry**: Pollution analysis, water quality, air quality',
          '**Applications**: Quality control, forensics, environmental monitoring'
        ]}
      ]
    }
  ],
};

// BIOLOGY - Comprehensive coverage
const BIOLOGY_CONTENT = {
  overview: "Biology encompasses study of living organisms, genetics, evolution, and ecology, crucial for medical and agricultural advances.",
  sections: [
    { id: 'cell-biology', title: 'Cell Biology', icon: 'microscope', gradient: ['#10B981', '#059669'],
      content: [
        { subtitle: 'Cell Structure and Function', color: '#10B981', points: [
          '**Cell Theory**: All living things made of cells, cell is basic unit of life',
          '**Prokaryotic Cells**: Bacteria, no nucleus, simple structure',
          '**Eukaryotic Cells**: Plants, animals, nucleus present, organelles',
          '**Cell Organelles**: Mitochondria, endoplasmic reticulum, Golgi apparatus',
          '**Cell Division**: Mitosis (growth), meiosis (reproduction), cancer'
        ]},
        { subtitle: 'Biochemistry', color: '#8B5CF6', points: [
          '**Biomolecules**: Carbohydrates, proteins, lipids, nucleic acids',
          '**Enzymes**: Biological catalysts, enzyme kinetics, regulation',
          '**Metabolism**: Glycolysis, Krebs cycle, electron transport chain',
          '**Photosynthesis**: Light reactions, Calvin cycle, chlorophyll',
          '**Cellular Respiration**: Aerobic, anaerobic respiration, ATP production'
        ]}
      ]
    },
    { id: 'genetics-heredity', title: 'Genetics and Heredity', icon: 'dna', gradient: ['#DC2626', '#B91C1C'],
      content: [
        { subtitle: 'Classical Genetics', color: '#DC2626', points: [
          '**Mendel\'s Laws**: Segregation, independent assortment, dominance',
          '**Chromosomal Theory**: Genes located on chromosomes, linkage',
          '**Sex Determination**: XY, ZW systems, sex-linked inheritance',
          '**Genetic Disorders**: Sickle cell, hemophilia, color blindness',
          '**Population Genetics**: Hardy-Weinberg principle, allele frequencies'
        ]},
        { subtitle: 'Molecular Genetics', color: '#8B5CF6', points: [
          '**DNA Structure**: Double helix, base pairing, Watson-Crick model',
          '**DNA Replication**: Semi-conservative, DNA polymerase, proofreading',
          '**Gene Expression**: Transcription (RNA synthesis), translation (protein synthesis)',
          '**Genetic Code**: Triplet code, codons, amino acid specification',
          '**Mutations**: Point mutations, chromosomal aberrations, genetic variations'
        ]}
      ]
    },
    { id: 'evolution-ecology', title: 'Evolution and Ecology', icon: 'tree', gradient: ['#059669', '#047857'],
      content: [
        { subtitle: 'Evolution Theory', color: '#059669', points: [
          '**Darwin\'s Theory**: Natural selection, survival of fittest, common descent',
          '**Evidence of Evolution**: Fossils, comparative anatomy, biogeography',
          '**Modern Synthesis**: Population genetics, molecular evolution',
          '**Speciation**: Geographic, reproductive isolation, adaptive radiation',
          '**Human Evolution**: Primate evolution, hominid fossils, cultural evolution'
        ]},
        { subtitle: 'Ecology and Environment', color: '#06B6D4', points: [
          '**Ecosystem Structure**: Producers, consumers, decomposers, trophic levels',
          '**Energy Flow**: Food chains, food webs, pyramid of energy',
          '**Biogeochemical Cycles**: Carbon, nitrogen, phosphorus, water cycles',
          '**Biodiversity**: Species diversity, genetic diversity, ecosystem diversity',
          '**Conservation**: Protected areas, endangered species, sustainable development'
        ]}
      ]
    }
  ],
};

// SPACE TECHNOLOGY - Comprehensive coverage
const SPACE_TECH_CONTENT = {
  overview: "India\'s space program led by ISRO has achieved remarkable success in satellite technology, Mars mission, and cost-effective space exploration.",
  sections: [
    { id: 'isro-achievements', title: 'ISRO Major Achievements', icon: 'rocket', gradient: ['#8B5CF6', '#7C3AED'],
      content: [
        { subtitle: 'Planetary Missions', color: '#8B5CF6', points: [
          '**Chandrayaan-1 (2008)**: Moon impact probe, water discovery on moon',
          '**Mangalyaan (2013)**: Mars Orbiter Mission, first attempt success globally',
          '**Chandrayaan-2 (2019)**: Orbiter success, lander Vikram partial success',
          '**Chandrayaan-3 (2023)**: Successful soft landing, Pragyan rover operations',
          '**Aditya-L1**: Solar observation mission, L1 Lagrange point'
        ]},
        { subtitle: 'Satellite Technology', color: '#06B6D4', points: [
          '**Communication Satellites**: INSAT series, DTH, mobile communication',
          '**Earth Observation**: IRS series, Cartosat, disaster management',
          '**Navigation**: NAVIC (IRNSS), regional navigation, GPS alternative',
          '**Scientific Missions**: AstroSat (astronomy), space science research',
          '**Commercial Services**: Launch services, satellite manufacturing for other countries'
        ]}
      ]
    },
    { id: 'launch-vehicles', title: 'Launch Vehicle Technology', icon: 'space-shuttle', gradient: ['#F59E0B', '#D97706'],
      content: [
        { subtitle: 'ISRO Launch Vehicles', color: '#F59E0B', points: [
          '**PSLV**: Polar Satellite Launch Vehicle, workhorse, 100+ launches',
          '**GSLV**: Geosynchronous Launch Vehicle, heavy satellites, cryogenic engine',
          '**GSLV Mk III**: Heaviest launcher, human spaceflight, 4-ton GTO capacity',
          '**SSLV**: Small Satellite Launch Vehicle, commercial small satellites',
          '**Reusable Launch Vehicle**: RLV-TD, cost reduction, space plane technology'
        ]},
        { subtitle: 'Indigenous Technologies', color: '#059669', points: [
          '**Cryogenic Engine**: Liquid hydrogen-oxygen, indigenous development',
          '**Solid Propulsion**: PSLV solid motors, composite materials',
          '**Guidance Systems**: Inertial navigation, mission computers',
          '**Heat Shields**: Thermal protection, re-entry technology',
          '**Cost Effectiveness**: Frugal engineering, innovative solutions'
        ]}
      ]
    },
    { id: 'future-missions', title: 'Future Space Missions', icon: 'satellite', gradient: ['#EC4899', '#DB2777'],
      content: [
        { subtitle: 'Human Spaceflight Program', color: '#EC4899', points: [
          '**Gaganyaan**: Human spaceflight mission, 3 astronauts, 7-day mission',
          '**Crew Module**: Atmospheric re-entry vehicle, life support systems',
          '**Astronaut Training**: Vyomanauts, training in India and Russia',
          '**Launch Abort System**: Crew safety, emergency escape mechanisms',
          '**Space Station**: Long-term plan, indigenous space station'
        ]},
        { subtitle: 'Deep Space Exploration', color: '#3B82F6', points: [
          '**Shukrayaan**: Venus mission, atmospheric studies, greenhouse effect',
          '**Mars Sample Return**: Future Mars mission, sample collection',
          '**Asteroid Mission**: Near-earth asteroid exploration',
          '**Lunar Base**: Future lunar habitat, resource utilization',
          '**Interplanetary Missions**: Jupiter, outer planets exploration'
        ]}
      ]
    }
  ],
};

// DEFENSE TECHNOLOGY - Comprehensive coverage
const DEFENSE_TECH_CONTENT = {
  overview: "Defense technology includes indigenous weapons systems, missile technology, and cyber security capabilities for national security.",
  sections: [
    { id: 'missile-systems', title: 'Missile Technology', icon: 'rocket', gradient: ['#DC2626', '#B91C1C'],
      content: [
        { subtitle: 'Strategic Missiles', color: '#DC2626', points: [
          '**Agni Series**: Ballistic missiles, nuclear capable, 700km-5000km range',
          '**Prithvi Series**: Tactical ballistic missiles, 150km-350km range',
          '**BrahMos**: Supersonic cruise missile, Indo-Russian joint venture',
          '**Nirbhay**: Subsonic cruise missile, terrain hugging capability',
          '**K-Series**: Submarine-launched ballistic missiles, nuclear triad'
        ]},
        { subtitle: 'Air Defense Systems', color: '#3B82F6', points: [
          '**Akash**: Medium-range surface-to-air missile, 25km range',
          '**Trishul**: Short-range SAM, point defense, naval version',
          '**Nag**: Anti-tank guided missile, fire-and-forget capability',
          '**Helina**: Helicopter-launched anti-tank missile',
          '**QRSAM**: Quick reaction surface-to-air missile'
        ]}
      ]
    },
    { id: 'indigenous-platforms', title: 'Indigenous Defense Platforms', icon: 'fighter-jet', gradient: ['#059669', '#047857'],
      content: [
        { subtitle: 'Aerospace Technology', color: '#059669', points: [
          '**Tejas LCA**: Light Combat Aircraft, 4th generation fighter',
          '**AMCA**: Advanced Medium Combat Aircraft, 5th generation stealth',
          '**HAL Dhruv**: Advanced Light Helicopter, multi-role platform',
          '**Rudra**: Armed helicopter, anti-tank warfare capability',
          '**Saras**: Multi-purpose light transport aircraft'
        ]},
        { subtitle: 'Naval Technology', color: '#06B6D4', points: [
          '**INS Vikrant**: Indigenous aircraft carrier, 40,000 tons',
          '**Scorpene Submarines**: Technology transfer, stealth capability',
          '**Project 75I**: Indigenous submarine program, AIP technology',
          '**Shivalik Class**: Stealth frigates, advanced sensors',
          '**Kolkata Class**: Guided missile destroyers, multi-role platforms'
        ]}
      ]
    },
    { id: 'emerging-technologies', title: 'Emerging Defense Technologies', icon: 'shield-virus', gradient: ['#8B5CF6', '#7C3AED'],
      content: [
        { subtitle: 'Cyber Security', color: '#8B5CF6', points: [
          '**Cyber Command**: Tri-service cyber warfare capability',
          '**Cyber Security**: Network protection, malware defense, encryption',
          '**Electronic Warfare**: Signal intelligence, jamming, countermeasures',
          '**Satellite Security**: Space-based communication protection',
          '**Critical Infrastructure**: Power grid, communications, financial systems'
        ]},
        { subtitle: 'Artificial Intelligence & Robotics', color: '#F59E0B', points: [
          '**AI in Defense**: Autonomous systems, decision support, surveillance',
          '**Unmanned Systems**: Drones, UAVs, unmanned ground vehicles',
          '**Robotics**: Bomb disposal robots, reconnaissance platforms',
          '**Swarm Technology**: Multiple drone coordination, distributed operations',
          '**Quantum Technology**: Quantum radar, quantum communication, cryptography'
        ]}
      ]
    }
  ],
};

// INFORMATION TECHNOLOGY - Comprehensive coverage
const IT_COMPUTERS_CONTENT = {
  overview: "Information Technology revolutionized computing, internet, artificial intelligence, and digital transformation across all sectors.",
  sections: [
    { id: 'computer-fundamentals', title: 'Computer Science Fundamentals', icon: 'laptop-code', gradient: ['#3B82F6', '#2563EB'],
      content: [
        { subtitle: 'Computer Architecture', color: '#3B82F6', points: [
          '**CPU Architecture**: Processor design, instruction sets, pipelining',
          '**Memory Hierarchy**: Cache, RAM, storage systems, virtual memory',
          '**Input/Output Systems**: Peripheral devices, interfaces, communication',
          '**Computer Networks**: LAN, WAN, internet protocols, network security',
          '**Operating Systems**: Process management, memory management, file systems'
        ]},
        { subtitle: 'Programming and Software', color: '#10B981', points: [
          '**Programming Languages**: High-level languages, compilers, interpreters',
          '**Data Structures**: Arrays, linked lists, trees, graphs, algorithms',
          '**Database Systems**: RDBMS, SQL, NoSQL, data modeling',
          '**Software Engineering**: SDLC, agile development, testing, maintenance',
          '**Web Technologies**: HTML, CSS, JavaScript, frameworks, responsive design'
        ]}
      ]
    },
    { id: 'artificial-intelligence', title: 'Artificial Intelligence & Machine Learning', icon: 'brain', gradient: ['#8B5CF6', '#7C3AED'],
      content: [
        { subtitle: 'AI Techniques', color: '#8B5CF6', points: [
          '**Machine Learning**: Supervised, unsupervised, reinforcement learning',
          '**Deep Learning**: Neural networks, convolutional networks, RNNs',
          '**Natural Language Processing**: Text analysis, language models, chatbots',
          '**Computer Vision**: Image recognition, object detection, facial recognition',
          '**Expert Systems**: Knowledge representation, inference engines, decision support'
        ]},
        { subtitle: 'AI Applications', color: '#F59E0B', points: [
          '**Healthcare**: Medical diagnosis, drug discovery, telemedicine',
          '**Finance**: Algorithmic trading, fraud detection, credit scoring',
          '**Transportation**: Autonomous vehicles, traffic optimization, navigation',
          '**Smart Cities**: IoT integration, urban planning, resource management',
          '**Industry 4.0**: Smart manufacturing, predictive maintenance, robotics'
        ]}
      ]
    },
    { id: 'digital-transformation', title: 'Digital Transformation', icon: 'digital-tachograph', gradient: ['#059669', '#047857'],
      content: [
        { subtitle: 'Cloud Computing', color: '#059669', points: [
          '**Service Models**: IaaS, PaaS, SaaS, cloud deployment models',
          '**Cloud Providers**: AWS, Microsoft Azure, Google Cloud Platform',
          '**Benefits**: Scalability, cost reduction, accessibility, disaster recovery',
          '**Challenges**: Security, privacy, vendor lock-in, compliance',
          '**Hybrid Cloud**: Public-private cloud integration, edge computing'
        ]},
        { subtitle: 'Emerging Technologies', color: '#DC2626', points: [
          '**Internet of Things (IoT)**: Connected devices, sensors, smart environments',
          '**Blockchain Technology**: Distributed ledger, cryptocurrency, smart contracts',
          '**Augmented/Virtual Reality**: AR/VR applications, metaverse, immersive experiences',
          '**5G Technology**: High-speed connectivity, low latency, network slicing',
          '**Quantum Computing**: Quantum algorithms, cryptography, computational supremacy'
        ]}
      ]
    }
  ],
};

// BIOTECHNOLOGY - Comprehensive coverage
const BIOTECHNOLOGY_CONTENT = {
  overview: "Biotechnology uses biological systems for technological applications in medicine, agriculture, and industrial processes.",
  sections: [
    { id: 'genetic-engineering', title: 'Genetic Engineering & Gene Therapy', icon: 'dna', gradient: ['#DC2626', '#B91C1C'],
      content: [
        { subtitle: 'Genetic Engineering Techniques', color: '#DC2626', points: [
          '**Recombinant DNA Technology**: Gene cloning, plasmids, restriction enzymes',
          '**CRISPR-Cas9**: Gene editing, precise modifications, therapeutic applications',
          '**PCR Technology**: DNA amplification, diagnostics, forensics',
          '**Gene Sequencing**: Human Genome Project, personalized medicine',
          '**Transgenic Organisms**: GMOs, gene insertion, expression systems'
        ]},
        { subtitle: 'Medical Biotechnology', color: '#8B5CF6', points: [
          '**Gene Therapy**: Genetic disorder treatment, vector systems, clinical trials',
          '**Biopharmaceuticals**: Insulin, growth hormones, monoclonal antibodies',
          '**Regenerative Medicine**: Stem cell therapy, tissue engineering, organ replacement',
          '**Personalized Medicine**: Pharmacogenomics, targeted therapy, precision medicine',
          '**Diagnostic Tools**: Biosensors, biomarkers, molecular diagnostics'
        ]}
      ]
    },
    { id: 'agricultural-biotech', title: 'Agricultural Biotechnology', icon: 'seedling', gradient: ['#059669', '#047857'],
      content: [
        { subtitle: 'Crop Improvement', color: '#059669', points: [
          '**GM Crops**: Herbicide resistance, insect resistance, nutritional enhancement',
          '**Golden Rice**: Vitamin A enrichment, micronutrient deficiency',
          '**Bt Cotton**: Insect resistance, yield improvement, pesticide reduction',
          '**Disease Resistance**: Viral, bacterial, fungal disease protection',
          '**Climate Resilience**: Drought tolerance, salt tolerance, heat stress'
        ]},
        { subtitle: 'Sustainable Agriculture', color: '#10B981', points: [
          '**Biopesticides**: Microbial pesticides, reduced chemical use',
          '**Biofertilizers**: Nitrogen fixation, phosphorus solubilization',
          '**Plant Breeding**: Marker-assisted selection, genomics-assisted breeding',
          '**Tissue Culture**: Plant propagation, disease-free planting material',
          '**Organic Farming**: Biological control agents, natural products'
        ]}
      ]
    },
    { id: 'industrial-biotech', title: 'Industrial Biotechnology', icon: 'industry', gradient: ['#F59E0B', '#D97706'],
      content: [
        { subtitle: 'Biofuels and Energy', color: '#F59E0B', points: [
          '**Bioethanol**: Fermentation, sugarcane, corn-based production',
          '**Biodiesel**: Vegetable oils, algae-based fuels, renewable diesel',
          '**Biogas**: Anaerobic digestion, methane production, waste treatment',
          '**Hydrogen Production**: Biological hydrogen, fuel cells, clean energy',
          '**Biomass Conversion**: Cellulosic ethanol, lignocellulose processing'
        ]},
        { subtitle: 'Industrial Processes', color: '#3B82F6', points: [
          '**Enzyme Technology**: Industrial enzymes, detergents, textile processing',
          '**Fermentation**: Antibiotics production, amino acids, vitamins',
          '**Bioremediation**: Pollution cleanup, waste treatment, environmental restoration',
          '**Biomaterials**: Bioplastics, biodegradable materials, packaging',
          '**Food Technology**: Food processing, preservation, functional foods'
        ]}
      ]
    }
  ],
};

// RENEWABLE ENERGY - Comprehensive coverage
const RENEWABLE_ENERGY_CONTENT = {
  overview: "Renewable energy includes solar, wind, hydro, and biomass sources, crucial for sustainable development and climate change mitigation.",
  sections: [
    { id: 'solar-energy', title: 'Solar Energy Technology', icon: 'sun', gradient: ['#F59E0B', '#D97706'],
      content: [
        { subtitle: 'Solar Power Technologies', color: '#F59E0B', points: [
          '**Photovoltaic (PV)**: Silicon solar cells, efficiency improvements, cost reduction',
          '**Concentrated Solar Power (CSP)**: Thermal power generation, energy storage capability',
          '**Solar Thermal**: Water heating, space heating, industrial applications',
          '**Thin Film Technology**: Flexible panels, building integration, lower cost',
          '**Perovskite Cells**: Next-generation technology, higher efficiency potential'
        ]},
        { subtitle: 'Solar Deployment in India', color: '#059669', points: [
          '**National Solar Mission**: 100 GW target, ultra-mega solar parks',
          '**Solar Parks**: Rajasthan, Gujarat, Andhra Pradesh, large-scale installations',
          '**Rooftop Solar**: Distributed generation, net metering, residential sector',
          '**Grid Integration**: Transmission infrastructure, grid stability, storage',
          '**Manufacturing**: Make in India, domestic production, import substitution'
        ]}
      ]
    },
    { id: 'wind-energy', title: 'Wind Energy Systems', icon: 'wind', gradient: ['#059669', '#047857'],
      content: [
        { subtitle: 'Wind Power Technology', color: '#059669', points: [
          '**Wind Turbines**: Horizontal axis, vertical axis, generator systems',
          '**Offshore Wind**: Marine installations, higher wind speeds, transmission',
          '**Small Wind Systems**: Distributed generation, rural applications, hybrid systems',
          '**Wind Resource Assessment**: Wind mapping, site selection, feasibility studies',
          '**Grid Integration**: Variable output, forecasting, grid stability'
        ]},
        { subtitle: 'Wind Energy Development', color: '#3B82F6', points: [
          '**Wind Capacity**: 60 GW installed, 4th largest globally, growth potential',
          '**Major States**: Tamil Nadu, Gujarat, Maharashtra, Karnataka, Rajasthan',
          '**Offshore Potential**: 70 GW capacity, policy framework, auction mechanism',
          '**Technology**: Larger turbines, higher capacity factors, cost reduction',
          '**Challenges**: Grid integration, transmission constraints, land acquisition'
        ]}
      ]
    },
    { id: 'other-renewables', title: 'Other Renewable Sources', icon: 'leaf', gradient: ['#10B981', '#059669'],
      content: [
        { subtitle: 'Hydroelectric Power', color: '#10B981', points: [
          '**Large Hydro**: Dam-based generation, multipurpose projects, irrigation',
          '**Small Hydro**: Run-of-river, micro-hydro, rural electrification',
          '**Pumped Storage**: Grid balancing, energy storage, peak power',
          '**Environmental Impact**: Ecosystem disruption, rehabilitation, sustainable practices',
          '**Potential**: Himalayan rivers, Western Ghats, untapped capacity'
        ]},
        { subtitle: 'Biomass and Other Sources', color: '#8B5CF6', points: [
          '**Biomass Power**: Agricultural residues, wood waste, bagasse-based',
          '**Biogas**: Anaerobic digestion, rural energy, waste treatment',
          '**Geothermal**: Limited potential, hot springs, experimental projects',
          '**Ocean Energy**: Tidal, wave energy, early-stage development',
          '**Hybrid Systems**: Solar-wind combination, storage integration, grid stability'
        ]}
      ]
    }
  ],
};

// CURRENT AFFAIRS - Comprehensive coverage
const NATIONAL_AFFAIRS_CONTENT = { overview: "National affairs cover domestic politics, governance, social issues, and policy developments affecting India\'s internal dynamics.", sections: [{ id: 'governance', title: 'Governance Reforms', icon: 'building', gradient: ['#06B6D4', '#0891B2'], content: [{ subtitle: 'Digital India', color: '#06B6D4', points: ['**e-Governance**: Online government services', '**Digital Infrastructure**: Broadband connectivity', '**Digital Literacy**: Training programs'] }] }] };

const INTERNATIONAL_AFFAIRS_CONTENT = { overview: "International affairs encompass India\'s foreign policy, diplomatic relations, trade agreements, and global strategic partnerships.", sections: [{ id: 'foreign-policy', title: 'Foreign Policy', icon: 'globe-americas', gradient: ['#06B6D4', '#0891B2'], content: [{ subtitle: 'Strategic Partnerships', color: '#06B6D4', points: ['**USA**: Defense cooperation, technology transfer', '**Russia**: Traditional ally, energy cooperation', '**Neighborhood First**: Regional connectivity'] }] }] };

const ECONOMY_CURRENT_CONTENT = { overview: "Economic current affairs include GDP growth, inflation trends, policy reforms, and global economic impacts on India.", sections: [{ id: 'economic-trends', title: 'Economic Trends', icon: 'chart-line', gradient: ['#06B6D4', '#0891B2'], content: [{ subtitle: 'Growth Indicators', color: '#06B6D4', points: ['**GDP Growth**: Quarterly growth rates', '**Inflation**: CPI and WPI trends', '**Employment**: Job creation statistics'] }] }] };

const SCIENCE_CURRENT_CONTENT = { overview: "Recent scientific developments include space missions, medical breakthroughs, technology innovations, and research achievements.", sections: [{ id: 'recent-discoveries', title: 'Recent Discoveries', icon: 'microscope', gradient: ['#06B6D4', '#0891B2'], content: [{ subtitle: 'Space Achievements', color: '#06B6D4', points: ['**Aditya L1**: Solar observation mission', '**Gaganyaan**: Human spaceflight program', '**Commercial Launches**: Private space sector'] }] }] };

const SPORTS_CURRENT_CONTENT = { overview: "Sports current affairs cover major tournaments, athlete achievements, sports policies, and infrastructure development in India.", sections: [{ id: 'major-events', title: 'Major Events', icon: 'trophy', gradient: ['#06B6D4', '#0891B2'], content: [{ subtitle: 'International Competitions', color: '#06B6D4', points: ['**Olympics**: Indian performance and medals', '**Commonwealth Games**: Multi-sport events', '**Asian Games**: Continental championships'] }] }] };

const AWARDS_HONORS_CONTENT = { overview: "Awards and honors recognize excellence in various fields including Padma Awards, Nobel Prizes, and international recognitions.", sections: [{ id: 'national-awards', title: 'National Awards', icon: 'medal', gradient: ['#06B6D4', '#0891B2'], content: [{ subtitle: 'Padma Awards', color: '#06B6D4', points: ['**Padma Vibhushan**: Highest civilian honor', '**Padma Bhushan**: Distinguished service', '**Padma Shri**: Distinguished achievement'] }] }] };

// Environment placeholders
const ECOLOGY_CONTENT = { overview: "Ecology studies relationships between organisms and environment, crucial for biodiversity conservation and ecosystem management.", sections: [{ id: 'ecosystems', title: 'Ecosystems', icon: 'leaf', gradient: ['#059669', '#047857'], content: [{ subtitle: 'Forest Ecosystems', color: '#8B5CF6', points: ['**Tropical Forests**: High biodiversity, carbon storage', '**Temperate Forests**: Deciduous and coniferous', '**Mangrove Forests**: Coastal protection, nurseries'] }] }] };

const CLIMATE_CHANGE_CONTENT = { overview: "Climate change refers to long-term changes in global temperature and weather patterns, primarily caused by human activities.", sections: [{ id: 'global-warming', title: 'Global Warming', icon: 'thermometer', gradient: ['#059669', '#047857'], content: [{ subtitle: 'Greenhouse Effect', color: '#8B5CF6', points: ['**Greenhouse Gases**: CO2, methane, nitrous oxide', '**Temperature Rise**: 1.1°C above pre-industrial levels', '**Climate Impacts**: Sea level rise, extreme weather'] }] }] };

const POLLUTION_CONTENT = { overview: "Pollution includes air, water, soil, and noise contamination affecting human health and environmental quality.", sections: [{ id: 'air-pollution', title: 'Air Pollution', icon: 'wind', gradient: ['#059669', '#047857'], content: [{ subtitle: 'Air Quality Issues', color: '#8B5CF6', points: ['**PM2.5**: Fine particulate matter, health hazards', '**Vehicle Emissions**: Major source in urban areas', '**Industrial Pollution**: Factory emissions, regulations'] }] }] };

const CONSERVATION_CONTENT = { overview: "Conservation efforts protect wildlife, forests, and natural habitats through protected areas, wildlife sanctuaries, and national parks.", sections: [{ id: 'wildlife-protection', title: 'Wildlife Protection', icon: 'paw', gradient: ['#059669', '#047857'], content: [{ subtitle: 'Protected Areas', color: '#8B5CF6', points: ['**National Parks**: Core conservation areas', '**Wildlife Sanctuaries**: Species protection', '**Biosphere Reserves**: Ecosystem conservation'] }] }] };

const RENEWABLE_RESOURCES_CONTENT = { overview: "Renewable resources include solar, wind, hydro, and biomass energy sources that can be replenished naturally.", sections: [{ id: 'sustainable-energy', title: 'Sustainable Energy', icon: 'recycle', gradient: ['#059669', '#047857'], content: [{ subtitle: 'Green Energy', color: '#8B5CF6', points: ['**Solar Power**: Photovoltaic technology', '**Wind Energy**: Wind turbines, offshore wind', '**Hydropower**: Dam-based electricity generation'] }] }] };

const ENVIRONMENTAL_LAWS_CONTENT = { overview: "Environmental laws provide legal framework for pollution control, conservation, and sustainable development.", sections: [{ id: 'legislation', title: 'Environmental Legislation', icon: 'balance-scale', gradient: ['#059669', '#047857'], content: [{ subtitle: 'Major Acts', color: '#8B5CF6', points: ['**Environment Protection Act 1986**: Umbrella legislation', '**Water Act 1974**: Water pollution control', '**Air Act 1981**: Air pollution prevention'] }] }] };

// Art & Culture placeholders
const INDIAN_ART_CONTENT = { overview: "Indian art encompasses painting, sculpture, and crafts representing diverse cultural traditions and regional styles.", sections: [{ id: 'classical-art', title: 'Classical Art', icon: 'palette', gradient: ['#EC4899', '#DB2777'], content: [{ subtitle: 'Painting Traditions', color: '#EC4899', points: ['**Miniature Paintings**: Mughal, Rajasthani, Pahari schools', '**Mural Paintings**: Ajanta, Kerala, Shekhawati', '**Folk Art**: Madhubani, Warli, Pattachitra'] }] }] };

const MUSIC_DANCE_CONTENT = { overview: "Indian music and dance traditions include classical forms like Bharatanatyam, Kathak, and Hindustani music with rich cultural heritage.", sections: [{ id: 'classical-dance', title: 'Classical Dance', icon: 'theater-masks', gradient: ['#EC4899', '#DB2777'], content: [{ subtitle: 'Eight Classical Forms', color: '#EC4899', points: ['**Bharatanatyam**: Tamil Nadu, temple dance', '**Kathak**: North Indian, storytelling dance', '**Odissi**: Odisha, sculptural poses'] }] }] };

const LITERATURE_CONTENT = { overview: "Indian literature spans ancient Sanskrit texts, medieval vernacular works, and modern writings in multiple languages.", sections: [{ id: 'classical-literature', title: 'Classical Literature', icon: 'book-open', gradient: ['#EC4899', '#DB2777'], content: [{ subtitle: 'Sanskrit Literature', color: '#EC4899', points: ['**Vedas**: Ancient religious texts', '**Epics**: Ramayana, Mahabharata', '**Drama**: Kalidasa\'s works'] }] }] };

const ARCHITECTURE_CONTENT = { overview: "Indian architecture reflects diverse styles from ancient rock-cut caves to Mughal monuments and modern buildings.", sections: [{ id: 'temple-architecture', title: 'Temple Architecture', icon: 'building', gradient: ['#EC4899', '#DB2777'], content: [{ subtitle: 'Architectural Styles', color: '#EC4899', points: ['**Nagara Style**: North Indian temple architecture', '**Dravidian Style**: South Indian temple design', '**Vesara Style**: Hybrid architectural form'] }] }] };

const FESTIVALS_CONTENT = { overview: "Indian festivals celebrate religious, seasonal, and cultural occasions, reflecting unity in diversity across the subcontinent.", sections: [{ id: 'major-festivals', title: 'Major Festivals', icon: 'calendar-star', gradient: ['#EC4899', '#DB2777'], content: [{ subtitle: 'Religious Festivals', color: '#EC4899', points: ['**Diwali**: Festival of lights, Hindu new year', '**Eid**: Islamic festivals, community celebrations', '**Christmas**: Christian festival, national holiday'] }] }] };

const LANGUAGES_CONTENT = { overview: "India has 22 official languages and hundreds of dialects, representing one of the world\'s most diverse linguistic landscapes.", sections: [{ id: 'language-families', title: 'Language Families', icon: 'comments', gradient: ['#EC4899', '#DB2777'], content: [{ subtitle: 'Major Language Groups', color: '#EC4899', points: ['**Indo-Aryan**: Hindi, Bengali, Gujarati, Punjabi', '**Dravidian**: Tamil, Telugu, Kannada, Malayalam', '**Sino-Tibetan**: Assamese, Manipuri, tribal languages'] }] }] };

export default function ReadingInterface() {
  const { subjectName, topicId, topicName, lessonId, sectionId } = useLocalSearchParams();
  const { user } = useAuth();
  const [showCompletion, setShowCompletion] = useState(false);
  const [completionXP, setCompletionXP] = useState(0);
  const [lessonProgress, setLessonProgress] = useState<any>(null);
  const sessionStartRef = useRef(Date.now());

  const resolvedSubjectName = (subjectName as string) || 'Subject';
  const resolvedTopicName = (topicName as string) || 'Study Topic';

  const currentContent = useMemo(
    () => getTopicContent((topicId as string) || ''),
    [topicId]
  );

  const handleLessonCompletion = async (progress: any) => {
    // Route to the detailed lesson reader with lesson content and progress data
    router.push({
      pathname: '/study/lesson-reader',
      params: {
        lessonId: lessonId || topicId,
        title: resolvedTopicName,
        subject: resolvedSubjectName,
        topicId: topicId as string,
        introCompleted: 'true',
        progressData: JSON.stringify(progress),
        contentData: JSON.stringify(currentContent),
      },
    });
  };

  const readingMinutes = lessonProgress
    ? Math.max(1, Math.round((Date.now() - sessionStartRef.current) / 60000))
    : undefined;

  return (
    <>
      <FlashcardLessonInterface
        topicName={resolvedTopicName}
        subjectName={resolvedSubjectName}
        content={currentContent}
        topicId={topicId as string}
        onBack={() => safeGoBack('/(tabs)/learn')}
        onComplete={handleLessonCompletion}
      />

      <UniversalCompletion
        visible={showCompletion}
        score={lessonProgress?.completedLessons.length || 0}
        totalQuestions={lessonProgress?.currentIndex || currentContent.sections.length}
        xpEarned={completionXP}
        streakDays={lessonProgress?.streakCount || 0}
        context="duolingo_lesson"
        contextData={{
          title: resolvedTopicName,
          activityType: 'duolingo-lesson',
          sectionsCompleted: lessonProgress?.completedLessons.length || 0,
          totalSections: lessonProgress?.currentIndex || currentContent.sections.length,
          readingTime: readingMinutes,
          streakCount: lessonProgress?.streakCount || 0,
        }}
        onContinue={() => {
          setShowCompletion(false);
          setLessonProgress(null);
          router.push('/(tabs)/');
        }}
      />
    </>
  );
}
