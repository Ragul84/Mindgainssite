import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import QRCode from 'react-native-qrcode-svg';

const { width } = Dimensions.get('window');

interface KnowledgeHeistEntryProps {
  onStartClash: () => void;
  onExit: () => void;
  onOpenStore: () => void;
  userStats: any;
}

const ONLINE_USERS = [
  { id: '1', name: 'Arjun_K', relation: 'Friend', score: '10000', online: true, isEye: false },
  { id: '2', name: 'Priya_M', relation: 'Friend', score: '10205', online: true, isEye: true },
  { id: '3', name: 'Rahul_S', relation: 'Clanmate', score: '6729', online: true, isEye: true },
];

const LEADERBOARD_USERS = [
  { id: '4', name: 'Gokul_S', relation: 'Friend', score: '11976', hasAvatar: true },
  { id: '5', name: 'Amit_P', relation: 'Friend', score: '11876', hasAvatar: true },
  { id: '6', name: 'Vikram_V', relation: 'Friend', score: '11688', hasAvatar: false },
];

export default function KnowledgeHeistEntry({
  onStartClash,
  onExit,
  onOpenStore,
  userStats,
}: KnowledgeHeistEntryProps) {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showQuickplay, setShowQuickplay] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Background (Clean Light Theme) */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['#FFFFFF', '#F8FAFC', '#F1F5F9']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.gridOverlay} />
      </View>

      <View style={styles.mainContent}>
        
        {/* Top Glass Banner Section */}
        <View style={styles.glassBannerContainer}>
           <View style={styles.glassBanner}>
              
              <TouchableOpacity style={styles.bannerItem} onPress={onExit}>
                 <View style={styles.shieldIconRed}>
                    <FontAwesome5 name="skull" size={14} color="#EF4444" />
                 </View>
                 <Text style={styles.bannerText}>EXIT</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.bannerTab, styles.bannerTabActive]}>
                 <View style={styles.shieldIconBlue}>
                    <FontAwesome5 name="khanda" size={14} color="#0EA5E9" />
                 </View>
                 <Text style={styles.bannerTextActive}>CLASH</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.bannerTab}>
                  <View style={styles.bubbleIcon}>
                    <FontAwesome5 name="comment-alt" size={14} color="#8B5CF6" />
                  </View>
                  <Text style={styles.bannerText}>CHAT</Text>
              </TouchableOpacity>
              
           </View>
        </View>

        {/* Social Main Body (White Glass) */}
        <View style={styles.socialContainer}>
           
           <View style={styles.socialHeader}>
               <Text style={styles.socialTitle}>Community</Text>
               <TouchableOpacity style={styles.filterBtn}>
                  <MaterialCommunityIcons name="filter-variant" size={20} color="#64748B" />
               </TouchableOpacity>
           </View>

           <ScrollView style={styles.scrollList} showsVerticalScrollIndicator={false}>
               
               {/* Online Header */}
               <View style={styles.sectionDivider}>
                   <View style={styles.dividerLine} />
                   <Text style={styles.sectionTitle}>Online</Text>
                   <View style={styles.dividerLine} />
               </View>

               {ONLINE_USERS.map((user) => (
                   <View key={user.id} style={styles.userRow}>
                     <View style={[styles.avatarBox, user.isEye && { backgroundColor: '#FEE2E2', borderColor: '#FECACA' }]}>
                        {user.isEye ? (
                           <FontAwesome5 name="eye" size={16} color="#EF4444" />
                        ) : (
                           <FontAwesome5 name="user" size={16} color="#94A3B8" />
                        )}
                        {user.online && <View style={styles.onlineDot} />}
                     </View>
                     
                     <View style={styles.userInfo}>
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={[styles.userRelation, user.relation === 'Clanmate' && { color: '#8B5CF6' }]}>
                           {user.relation}
                        </Text>
                     </View>

                     <View style={styles.trophyBox}>
                        <FontAwesome5 name="trophy" size={12} color="#F59E0B" solid />
                        <Text style={styles.scoreText}>{user.score}</Text>
                     </View>
                   </View>
               ))}

               {/* Leaderboard Header */}
               <View style={styles.sectionDivider}>
                   <View style={styles.dividerLine} />
                   <Text style={styles.sectionTitle}>Leaderboard</Text>
                   <View style={styles.dividerLine} />
               </View>
               
               {LEADERBOARD_USERS.map((user) => (
                   <View key={user.id} style={styles.userRow}>
                     <View style={[styles.avatarBox, user.hasAvatar ? { backgroundColor: '#F1F5F9', padding: 0 } : { backgroundColor: '#F1F5F9' }]}>
                        {user.hasAvatar ? (
                           <Image source={require('@/assets/images/knowledgeheist.png')} style={styles.avatarImage} />
                        ) : (
                           <FontAwesome5 name="user" size={16} color="#94A3B8" />
                        )}
                        <View style={styles.idBadge}>
                           <Text style={styles.idBadgeText}>ID</Text>
                        </View>
                     </View>

                     <View style={styles.userInfo}>
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={styles.userRelation}>{user.relation}</Text>
                     </View>

                     <View style={styles.trophyBox}>
                        <FontAwesome5 name="trophy" size={12} color="#F59E0B" solid />
                        <Text style={styles.scoreText}>{user.score}</Text>
                     </View>
                   </View>
               ))}
               <View style={{ height: 20 }} />
           </ScrollView>

           {/* Bottom Action Bar */}
           <View style={styles.bottomActions}>
               <TouchableOpacity style={styles.quickPlayBtn} onPress={() => setShowQuickplay(true)}>
                   <FontAwesome5 name="bolt" size={14} color="#FFF" />
                   <Text style={styles.quickPlayText}>Quickplay</Text>
               </TouchableOpacity>

               <TouchableOpacity style={styles.addFriendBtn} onPress={() => setShowAddFriend(true)}>
                   <FontAwesome5 name="plus" size={12} color="#0F172A" />
                   <Text style={styles.addFriendText}>Add Friends</Text>
               </TouchableOpacity>

               <TouchableOpacity style={styles.camBtn} onPress={onOpenStore}>
                   <FontAwesome5 name="camera" size={14} color="#64748B" />
               </TouchableOpacity>
           </View>

        </View>
      </View>

      {/* Add Friend Modal */}
      <Modal visible={showAddFriend} transparent animationType="fade">
         <View style={styles.modalBackdrop}>
             <View style={styles.modalBox}>
                 <TouchableOpacity style={styles.closeBtn} onPress={() => setShowAddFriend(false)}>
                     <FontAwesome5 name="times" size={14} color="#64748B" />
                 </TouchableOpacity>

                 <View style={styles.modalHeaderRow}>
                    <FontAwesome5 name="user-plus" size={16} color="#00D4C7" />
                    <Text style={styles.modalTitleText}>Add Friend</Text>
                 </View>

                 <View style={styles.qrContainer}>
                     <QRCode value="mindclash://addfriend/user" size={140} color="#0F172A" backgroundColor="transparent" />
                 </View>

                 <Text style={styles.modalDescText}>
                     Whoever scans this code will{'\n'}instantly be added as a friend!
                 </Text>

                 <View style={styles.modalActionsRow}>
                     <TouchableOpacity style={styles.modalActionBtnOutline}>
                        <Text style={styles.modalActionTextDark}>Share Link</Text>
                     </TouchableOpacity>
                     <TouchableOpacity style={styles.modalActionBtnPrimary}>
                        <Text style={styles.modalActionTextLight}>Scan Code</Text>
                     </TouchableOpacity>
                 </View>
             </View>
         </View>
      </Modal>

      {/* Quickplay Modal */}
      <Modal visible={showQuickplay} transparent animationType="fade">
         <View style={styles.modalBackdrop}>
             <View style={[styles.modalBox, { borderColor: 'rgba(14,165,233,0.3)' }]}>
                 <TouchableOpacity style={styles.closeBtn} onPress={() => setShowQuickplay(false)}>
                     <FontAwesome5 name="times" size={14} color="#64748B" />
                 </TouchableOpacity>

                 <View style={styles.modalHeaderRow}>
                    <FontAwesome5 name="bolt" size={16} color="#0EA5E9" />
                    <Text style={styles.modalTitleText}>Quickplay Match</Text>
                 </View>

                 <View style={styles.qrContainer}>
                     <QRCode value="mindclash://quickplay/match" size={140} color="#0F172A" backgroundColor="transparent" />
                 </View>
                 
                 <TouchableOpacity style={styles.vsBattleBtn} onPress={() => { setShowQuickplay(false); onStartClash(); }}>
                    <MaterialCommunityIcons name="swap-horizontal" size={18} color="#0EA5E9" />
                    <Text style={styles.vsBattleText}>Start 1v1 Battle</Text>
                 </TouchableOpacity>

                 <Text style={styles.modalDescText}>
                     Whoever scans this code will instantly start a{'\n'}match with you!
                 </Text>
             </View>
         </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  mainContent: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
  },
  glassBannerContainer: {
    width: width * 0.9,
    height: 70,
    marginBottom: 20,
    zIndex: 10,
    position: 'relative',
  },
  glassBanner: {
    flex: 1,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  bannerItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  bannerTab: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
  },
  bannerTabActive: {
    backgroundColor: '#F0F9FF',
  },
  shieldIconRed: {
    width: 28,
    height: 28,
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FECACA',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shieldIconBlue: {
    width: 28,
    height: 28,
    backgroundColor: '#F0F9FF',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleIcon: {
    width: 28,
    height: 28,
    backgroundColor: '#F3E8FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E9D5FF',
  },
  bannerText: {
    color: '#64748B',
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 1,
  },
  bannerTextActive: {
    color: '#0EA5E9',
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 1,
  },
  socialContainer: {
    flex: 1,
    width: width,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 10,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
  socialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  socialTitle: {
    color: '#0F172A',
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 0.5,
  },
  filterBtn: {
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  sectionDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginHorizontal: 16,
  },
  sectionTitle: {
    color: '#94A3B8',
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  scrollList: {
    flex: 1,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  onlineDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    backgroundColor: '#10B981',
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  idBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#475569',
    paddingHorizontal: 4,
    borderRadius: 6,
  },
  idBadgeText: {
    color: '#FFF',
    fontSize: 7,
    fontFamily: 'Poppins-SemiBold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#0F172A',
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  userRelation: {
    color: '#10B981',
    fontSize: 11,
    fontFamily: 'Inter-Medium',
  },
  trophyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scoreText: {
    marginLeft: 6,
    color: '#D97706',
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 8,
  },
  quickPlayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0EA5E9',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    flex: 1.2,
    marginRight: 12,
    justifyContent: 'center',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  quickPlayText: {
    color: '#FFF',
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  addFriendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    flex: 1,
    marginRight: 12,
    justifyContent: 'center',
  },
  addFriendText: {
    color: '#0F172A',
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    marginLeft: 8,
  },
  camBtn: {
    backgroundColor: '#F8FAFC',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: width * 0.85,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 40,
    elevation: 20,
  },
  closeBtn: {
    position: 'absolute',
    right: 16,
    top: 16,
    backgroundColor: '#F1F5F9',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitleText: {
    color: '#0F172A',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginLeft: 12,
  },
  qrContainer: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 24,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  modalDescText: {
    color: '#64748B',
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginBottom: 32,
    lineHeight: 22,
  },
  modalActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  modalActionBtnOutline: {
    backgroundColor: '#F8FAFC',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    flex: 1,
    alignItems: 'center',
  },
  modalActionBtnPrimary: {
    backgroundColor: '#00D4C7',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    flex: 1,
    alignItems: 'center',
    shadowColor: '#00D4C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  modalActionTextDark: {
    color: '#0F172A',
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
  },
  modalActionTextLight: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
  },
  vsBattleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    marginBottom: 24,
    width: '100%',
    justifyContent: 'center',
  },
  vsBattleText: {
    color: '#0EA5E9',
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
    marginLeft: 12,
  },
});

