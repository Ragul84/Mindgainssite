// Test page to check exact content flow
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RealDatabaseContentService } from '@/utils/realDatabaseContentService';

export default function TestContentFlow() {
  const [content, setContent] = useState<any>({});
  
  useEffect(() => {
    checkContent();
  }, []);
  
  const checkContent = async () => {
    console.log('🔍 SIMULATING FIRST LESSON CLICK\n');
    
    // 1. Homepage shows topics
    const topics = await RealDatabaseContentService.getAllTopicsWithSubtopics();
    const indianConst = topics.find(t => t.name === 'Indian Constitution');
    
    if (!indianConst) {
      console.log('Topic not found');
      return;
    }
    
    console.log('📘 STEP 1: HOMEPAGE');
    console.log('User sees:', indianConst.name);
    console.log('Description:', indianConst.description);
    console.log('[User clicks on "Indian Constitution"]\n');
    
    // 2. Lesson Intro Page
    console.log('📄 STEP 2: LESSON INTRO PAGE');
    console.log('\nBlue gradient header shows:');
    console.log('  Title:', indianConst.name);
    
    // Get subtopics
    if (indianConst.subtopics) {
      console.log('\nSubtopics Grid:');
      indianConst.subtopics.slice(0, 4).forEach((sub: any, i: number) => {
        console.log(`  ${i + 1}. ${sub.name}`);
      });
    }
    
    // Get first lesson part
    const lessonParts = await RealDatabaseContentService.getLessonPartsForTopic('Indian Constitution');
    
    if (lessonParts && lessonParts.length > 0) {
      const firstPart = lessonParts[0];
      console.log('\nFirst Lesson Part:');
      console.log('  Title:', firstPart.part_title);
      console.log('  Description:', firstPart.short_description);
      console.log('  Time:', firstPart.estimated_time_minutes, 'min');
      console.log('  XP:', firstPart.xp_reward);
      console.log('  Part', firstPart.part_number, 'of', lessonParts.length);
      
      console.log('\n[User clicks "Start Learning"]\n');
      
      // 3. Reading Interface loads content
      console.log('📚 STEP 3: FLASHCARD INTERFACE');
      
      const partWithPages = await RealDatabaseContentService.getLessonPartWithPages(firstPart.id);
      
      if (partWithPages && partWithPages.pages) {
        console.log('\nProgress Bar: [━━━━━━━━━━━━━━━] 0%');
        console.log('Stars: ⭐ ⭐ ⭐ (gray)\n');
        console.log('Title:', firstPart.part_title, '\n');
        
        console.log('LESSON PAGES:', partWithPages.pages.length, 'pages\n');
        
        partWithPages.pages.forEach((page: any, index: number) => {
          console.log('─────────────────────────');
          console.log(`PAGE ${page.page_number}:`);
          console.log(`${index === 0 ? '🔵' : '⚪'} ${page.page_title}`);
          console.log(`   "${page.page_description || 'Page content'}"`);
          
          if (page.content_points && page.content_points.length > 0) {
            console.log(`\n   Content Points (${page.content_points.length}):`);
            page.content_points.slice(0, 2).forEach((point: any, i: number) => {
              console.log(`   ${i + 1}. ${point.title || 'Point'}`);
              if (point.full) {
                console.log(`      "${point.full.substring(0, 80)}..."`);
              }
            });
          }
        });
        
        console.log('\n─────────────────────────');
        console.log('\nButtons:');
        console.log('[← Back]              [Complete ✓]');
        
        setContent({
          topic: indianConst.name,
          lessonPart: firstPart,
          pages: partWithPages.pages
        });
      }
    }
  };
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F23' }}>
      <ScrollView style={{ padding: 20 }}>
        <Text style={{ color: 'white', fontSize: 24, marginBottom: 20 }}>
          Content Flow Test
        </Text>
        
        <Text style={{ color: 'white', fontSize: 18, marginBottom: 10 }}>
          Topic: {content.topic || 'Loading...'}
        </Text>
        
        {content.lessonPart && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ color: '#3A8DFF', fontSize: 16, marginBottom: 10 }}>
              Lesson Part: {content.lessonPart.part_title}
            </Text>
            <Text style={{ color: '#AAB2BD', fontSize: 14 }}>
              {content.lessonPart.short_description}
            </Text>
            <Text style={{ color: '#4ADE80', fontSize: 14, marginTop: 10 }}>
              Pages: {content.pages?.length || 0}
            </Text>
          </View>
        )}
        
        <Text style={{ color: '#AAB2BD', fontSize: 12, marginTop: 30 }}>
          Check browser console for detailed flow
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}