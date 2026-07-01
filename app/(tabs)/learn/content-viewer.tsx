// 📚 Universal Content Viewer – Premium Milky White Redesign
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { MotiView } from 'moti';
import Markdown from 'react-native-markdown-display';
import { XPService } from '@/utils/xpService';
import { SupabaseService } from '@/utils/supabaseService';
import HapticService from '@/utils/hapticService';
import { V2026 } from '@/theme/v2026-tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ContentViewer() {
  const params = useLocalSearchParams();
  const { title, directContent, source } = params;
  
  const [activeTab, setActiveTab] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);

  const contentStr = typeof directContent === 'string' ? directContent : '';
  
  // Logic to split content into readable chunks/tabs if it's long
  const chunks = contentStr.split('\n\n\n') || [contentStr];
  const tabs = chunks.length > 1 ? chunks.map((c, i) => ({ id: i, title: `Part ${i+1}`, content: c })) : [
      { id: 0, title: 'Overview', content: contentStr }
  ];

  const handleComplete = async () => {
    if (!completed.includes(activeTab)) {
        HapticService.success();
        const newCompleted = [...completed, activeTab];
        setCompleted(newCompleted);
        
        if (newCompleted.length === tabs.length) {
            // Award XP
            const user = await SupabaseService.getCurrentUser();
            if (user) {
                await XPService.awardStudyXP(user.id, {
                    topicId: 'viewer',
                    subjectName: title as string,
                } as any);
            }
        }
    }
  };

  const handleShare = () => {
    HapticService.light();
    Share.share({ message: contentStr });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => { HapticService.light(); router.back(); }} style={styles.headerBtn}>
            <Ionicons name="chevron-back" size={20} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
             <Text numberOfLines={1} style={styles.headerTitle}>{title || 'Study Material'}</Text>
             <Text style={styles.headerSubtitle}>{source?.toString().toUpperCase() || 'DOCUMENT'}</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7} onPress={handleShare} style={styles.headerBtn}>
            <Ionicons name="share-outline" size={18} color="#0F172A" />
          </TouchableOpacity>
        </View>

        {/* Source Badge */}
        <View style={styles.progressContainer}>
           <View style={styles.progressBar}>
              <MotiView 
                animate={{ width: `${(completed.length / tabs.length) * 100}%` }}
                style={styles.progressFill} 
              />
           </View>
           <Text style={styles.progressText}>{Math.round((completed.length / tabs.length) * 100)}% EXPLORED</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
           <MotiView 
             from={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: 1, scale: 1 }}
             style={styles.card}
           >
              <Markdown style={markdownStyles as any}>
                 {tabs[activeTab].content}
              </Markdown>
           </MotiView>

           <TouchableOpacity style={styles.completeBtn} activeOpacity={0.9} onPress={handleComplete}>
              <LinearGradient colors={['#6366F1', '#4F46E5']} style={styles.completeGrad}>
                 <Ionicons name={completed.includes(activeTab) ? "checkmark-circle" : "sparkles"} size={18} color="#FFF" />
                 <Text style={styles.completeText}>
                    {completed.includes(activeTab) ? "SECTION COMPLETED" : "MARK AS READ"}
                 </Text>
              </LinearGradient>
           </TouchableOpacity>

           {tabs.length > 1 && (
              <View style={styles.navigation}>
                 <TouchableOpacity 
                    disabled={activeTab === 0} 
                    activeOpacity={0.7} onPress={() => { HapticService.light(); setActiveTab(a => a - 1); }}
                    style={[styles.navBtn, activeTab === 0 && { opacity: 0.3 }]}
                 >
                    <Ionicons name="arrow-back" size={18} color="#0F172A" />
                 </TouchableOpacity>
                 <Text style={styles.navText}>{activeTab + 1} / {tabs.length}</Text>
                 <TouchableOpacity 
                    disabled={activeTab === tabs.length - 1} 
                    activeOpacity={0.7} onPress={() => { HapticService.light(); setActiveTab(a => a + 1); }}
                    style={[styles.navBtn, activeTab === tabs.length - 1 && { opacity: 0.3 }]}
                 >
                    <Ionicons name="arrow-forward" size={18} color="#0F172A" />
                 </TouchableOpacity>
              </View>
           )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.05)',
    backgroundColor: '#FFFFFF',
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.06)',
    ...V2026.shadows.milky,
  },
  headerInfo: { flex: 1, marginLeft: 12 },
  headerTitle: { color: '#0F172A', fontSize: 15, fontFamily: 'Poppins-Bold' },
  headerSubtitle: { color: '#64748B', fontSize: 9.5, fontFamily: 'Poppins-Bold', letterSpacing: 0.8, marginTop: 1 },
  progressContainer: {
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 10,
  },
  progressBar: {
    height: 5,
    backgroundColor: 'rgba(15, 23, 42, 0.05)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366F1',
  },
  progressText: {
    color: '#64748B',
    fontSize: 9,
    fontFamily: 'Poppins-Bold',
    marginTop: 5,
    letterSpacing: 0.8,
  },
  content: { paddingHorizontal: 16, paddingBottom: 60, paddingTop: 10 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.05)',
    ...V2026.shadows.milky,
  },
  completeBtn: {
    marginTop: 20,
    borderRadius: 18,
    overflow: 'hidden',
    ...V2026.shadows.milky,
  },
  completeGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 8,
  },
  completeText: { color: '#FFFFFF', fontSize: 13, fontFamily: 'Poppins-Bold', letterSpacing: 0.8 },
  navigation: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     marginTop: 20,
     backgroundColor: '#FFFFFF',
     borderRadius: 16,
     padding: 6,
     borderWidth: 1,
     borderColor: 'rgba(15, 23, 42, 0.05)',
     ...V2026.shadows.milky,
  },
  navBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(15, 23, 42, 0.04)' },
  navText: { color: '#0F172A', fontSize: 12, fontFamily: 'Poppins-Bold' },
});

const markdownStyles = {
  body: {
    color: '#334155',
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'Inter-Medium',
  },
  heading1: { color: '#0F172A', fontSize: 20, fontFamily: 'Poppins-Bold', marginBottom: 12 },
  heading2: { color: '#0F172A', fontSize: 16, fontFamily: 'Poppins-Bold', marginTop: 16, marginBottom: 8 },
  strong: { color: '#6366F1', fontFamily: 'Inter-Bold' },
  em: { color: '#334155', fontStyle: 'italic' },
};