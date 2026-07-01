import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../utils/supabaseService';

export default function TestStructure() {
  const [data, setData] = useState<any>({});
  
  useEffect(() => {
    checkStructure();
  }, []);
  
  const checkStructure = async () => {
    console.log('🔍 CHECKING DATABASE STRUCTURE...');
    
    // 1. Get topics
    const { data: topics } = await supabase
      .from('topics')
      .select('id, name')
      .order('name')
      .limit(10);
    
    console.log('Topics:', topics);
    
    // 2. Get subtopics  
    const { data: subtopics } = await supabase
      .from('subtopics')
      .select('*')
      .limit(10);
    
    console.log('Subtopics:', subtopics);
    
    // 3. Get Indian Constitution topic details
    const { data: indianConst } = await supabase
      .from('topics')
      .select('*')
      .eq('name', 'Indian Constitution')
      .single();
    
    console.log('Indian Constitution topic:', indianConst);
    
    if (indianConst) {
      // 4. Get subtopics for Indian Constitution
      const { data: constSubtopics } = await supabase
        .from('subtopics')
        .select('*')
        .eq('topic_id', indianConst.id);
      
      console.log('Indian Constitution subtopics:', constSubtopics);
      
      // 5. Get lesson parts for Indian Constitution
      const { data: constLessonParts } = await supabase
        .from('lesson_parts')
        .select('*')
        .eq('topic_id', indianConst.id)
        .order('part_number')
        .limit(5);
      
      console.log('Indian Constitution lesson parts (first 5):', constLessonParts);
      
      // 6. Check if lesson parts have detailed_intro
      if (constLessonParts && constLessonParts.length > 0) {
        const firstPart = constLessonParts[0];
        console.log('First lesson part detailed_intro:', firstPart.detailed_intro);
        console.log('First lesson part has_intro:', firstPart.has_intro);
        
        // 7. Get lesson pages for first part
        const { data: pages } = await supabase
          .from('lesson_pages')
          .select('*')
          .eq('lesson_part_id', firstPart.id)
          .order('page_number')
          .limit(2);
        
        console.log('Lesson pages for first part:', pages);
      }
    }
    
    // 8. Check database counts
    const { count: topicCount } = await supabase
      .from('topics')
      .select('*', { count: 'exact', head: true });
    
    const { count: subtopicCount } = await supabase
      .from('subtopics')
      .select('*', { count: 'exact', head: true });
    
    const { count: lessonPartCount } = await supabase
      .from('lesson_parts')
      .select('*', { count: 'exact', head: true });
    
    const { count: pageCount } = await supabase
      .from('lesson_pages')
      .select('*', { count: 'exact', head: true });
    
    const summary = {
      topicCount,
      subtopicCount,
      lessonPartCount,
      pageCount,
      topics: topics?.slice(0, 5),
      subtopics: subtopics?.slice(0, 5)
    };
    
    console.log('📊 DATABASE SUMMARY:', summary);
    setData(summary);
  };
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F23' }}>
      <ScrollView style={{ padding: 20 }}>
        <Text style={{ color: 'white', fontSize: 24, marginBottom: 20 }}>
          Database Structure Test
        </Text>
        
        <Text style={{ color: 'white', fontSize: 18, marginBottom: 10 }}>
          Summary:
        </Text>
        
        <Text style={{ color: '#4ADE80', fontSize: 16 }}>
          Topics: {data.topicCount || 'Loading...'}
        </Text>
        <Text style={{ color: '#60A5FA', fontSize: 16 }}>
          Subtopics: {data.subtopicCount || 'Loading...'}
        </Text>
        <Text style={{ color: '#F87171', fontSize: 16 }}>
          Lesson Parts: {data.lessonPartCount || 'Loading...'}
        </Text>
        <Text style={{ color: '#FBBF24', fontSize: 16 }}>
          Lesson Pages: {data.pageCount || 'Loading...'}
        </Text>
        
        <Text style={{ color: 'white', fontSize: 14, marginTop: 20 }}>
          Check browser console for detailed structure
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}