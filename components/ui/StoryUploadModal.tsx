import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { mascotApi } from '@/services/mascotApi';

interface StoryUploadModalProps {
  visible: boolean;
  onClose: () => void;
  onUploadSuccess: (uploadId: string, sourceType?: 'file' | 'url' | 'youtube') => void;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
  sessionId?: string;
  allowYouTube?: boolean;
}

export const StoryUploadModal: React.FC<StoryUploadModalProps> = ({
  visible,
  onClose,
  onUploadSuccess,
  onUploadStart,
  onUploadEnd,
  sessionId,
  allowYouTube = true,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [activeTab, setActiveTab] = useState<'file' | 'url'>('file');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [urlType, setUrlType] = useState<'web'>('web');
  const isLocked = isUploading;

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
      }
    } catch (err) {
      console.warn('Document picker error:', err);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedFile({
            uri: result.assets[0].uri,
            name: result.assets[0].fileName || 'image.jpg',
            mimeType: result.assets[0].mimeType || 'image/jpeg',
            size: result.assets[0].fileSize || 0
        });
      }
    } catch (err) {
        console.warn('Image picker error:', err);
    }
  };

  const handleUpload = async () => {
    setIsUploading(true);
    setProgressPct(5);
    onUploadStart?.();
    const progressTimer = setInterval(() => {
      setProgressPct((prev) => {
        if (prev >= 92) return prev;
        return prev + Math.floor(Math.random() * 4) + 1;
      });
    }, 450);
    try {
      let response;
      if (activeTab === 'file') {
          if (!selectedFile) return;
          response = await mascotApi.uploadStoryDoc(selectedFile, sessionId);
      } else {
          if (!youtubeUrl.trim()) return;
          const isYouTube = youtubeUrl.includes('youtube.com') || youtubeUrl.includes('youtu.be');
          const nextUrlType: 'youtube' | 'web' = isYouTube ? 'youtube' : urlType;
          if (isYouTube && !allowYouTube) {
            Alert.alert("YouTube Disabled", "YouTube links are disabled for this flow. Please use a blog/website URL.");
            return;
          }
          response = await mascotApi.uploadStoryUrl(youtubeUrl, nextUrlType, sessionId);
      }
      
      setProgressPct(100);
      onUploadSuccess(response.upload_id, activeTab === 'file' ? 'file' : (youtubeUrl.includes('youtube.com') || youtubeUrl.includes('youtu.be') ? 'youtube' : 'url'));
      onClose();
    } catch (error) {
      console.warn('Story upload failed:', error);
      Alert.alert("Upload Failed", "Could not process content. Check connection or backend.");
    } finally {
      clearInterval(progressTimer);
      setIsUploading(false);
      setSelectedFile(null);
      setYoutubeUrl('');
      setUrlType('web');
      setProgressPct(0);
      onUploadEnd?.();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
        
        <View style={styles.container}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close-circle" size={32} color="rgba(255,255,255,0.5)" />
          </TouchableOpacity>

          <Text style={styles.title}>Story Source</Text>

          <ScrollView
            contentContainerStyle={styles.contentScroll}
            showsVerticalScrollIndicator={false}
          >
            {/* Tabs */}
            <View style={styles.tabRow}>
              <TouchableOpacity 
                  style={[styles.tab, activeTab === 'file' && styles.activeTab, isLocked && styles.disabledTab]} 
                  onPress={() => !isLocked && setActiveTab('file')}
                  disabled={isLocked}
              >
                  <Text style={[styles.tabText, activeTab === 'file' && styles.activeTabText]}>Document / Image</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                  style={[styles.tab, activeTab === 'url' && styles.activeTab, isLocked && styles.disabledTab]} 
                  onPress={() => !isLocked && setActiveTab('url')}
                  disabled={isLocked}
              >
                  <Text style={[styles.tabText, activeTab === 'url' && styles.activeTabText]}>Blog/Website URL</Text>
              </TouchableOpacity>
            </View>

            {activeTab === 'file' ? (
              <View style={styles.uploadArea}>
                  <TouchableOpacity style={styles.dropZone} onPress={pickDocument} disabled={isLocked}>
                      {selectedFile ? (
                      <View style={styles.fileInfo}>
                          <Ionicons name="document-text" size={36} color="#8AB4F8" />
                          <Text style={styles.fileName} numberOfLines={1}>{selectedFile.name}</Text>
                          <Text style={styles.fileSize}>{selectedFile.size ? (selectedFile.size / 1024).toFixed(0) + ' KB' : ''}</Text>
                      </View>
                      ) : (
                      <View style={styles.placeholder}>
                          <Ionicons name="cloud-upload" size={40} color="rgba(255,255,255,0.2)" />
                          <Text style={styles.placeholderText}>Tap to pick PDF, Docx, or Image</Text>
                      </View>
                      )}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={pickImage} style={styles.secondaryAction} disabled={isLocked}>
                      <Text style={styles.secondaryActionText}>or select from Gallery</Text>
                  </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.uploadArea}>
                  <View style={styles.inputWrap}>
                      <Ionicons name="link-outline" size={22} color="#8AB4F8" />
                      <TextInput 
                          style={styles.urlInput}
                          placeholder="Paste Blog/Website Link..."
                          placeholderTextColor="rgba(255,255,255,0.3)"
                          value={youtubeUrl}
                          onChangeText={setYoutubeUrl}
                          autoCapitalize="none"
                          autoCorrect={false}
                          editable={!isLocked}
                      />
                  </View>
                  <Text style={styles.hint}>MIGA will read the page and turn it into a story.</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.uploadBtn, (isUploading || (activeTab === 'file' && !selectedFile) || (activeTab === 'url' && !youtubeUrl)) && styles.disabledBtn]}
              onPress={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? (
                <View style={styles.progressWrap}>
                  <ActivityIndicator color="#000" />
                  <Text style={styles.progressText}>{progressPct}%</Text>
                </View>
              ) : (
                <Text style={styles.uploadBtnText}>Begin Adventure</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(8,10,14,0.6)' },
  container: { width: '90%', maxHeight: '82%', backgroundColor: '#121722', borderRadius: 24, padding: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  closeBtn: { position: 'absolute', top: 16, right: 16, zIndex: 10 },
  title: { color: '#E8EEF7', fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 10 },
  contentScroll: { paddingBottom: 8 },
  tabRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: 'rgba(255,255,255,0.08)' },
  disabledTab: { opacity: 0.6 },
  tabText: { color: 'rgba(232,238,247,0.5)', fontWeight: '600' },
  activeTabText: { color: '#E8EEF7' },
  uploadArea: { minHeight: 150, justifyContent: 'center' },
  dropZone: { height: 130, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)' },
  placeholder: { alignItems: 'center', gap: 10 },
  placeholderText: { color: 'rgba(232,238,247,0.5)' },
  fileInfo: { alignItems: 'center' },
  fileName: { color: '#E8EEF7', fontWeight: '600', marginTop: 10, maxWidth: 220 },
  fileSize: { color: 'rgba(232,238,247,0.5)', fontSize: 12 },
  secondaryAction: { alignSelf: 'center', marginTop: 12 },
  secondaryActionText: { color: '#8AB4F8', fontSize: 12, fontWeight: '600' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 14, paddingHorizontal: 14, height: 52, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', gap: 10 },
  urlInput: { flex: 1, color: '#E8EEF7', fontSize: 14 },
  hint: { color: 'rgba(232,238,247,0.5)', fontSize: 12, textAlign: 'center', marginTop: 10 },
  urlTypeRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  urlTypeButton: { flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  urlTypeButtonActive: { backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.2)' },
  urlTypeText: { color: 'rgba(255,255,255,0.5)', fontWeight: '600', fontSize: 12 },
  urlTypeTextActive: { color: '#FFF' },
  uploadBtn: { backgroundColor: '#8AB4F8', paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 18 },
  disabledBtn: { opacity: 0.5 },
  uploadBtnText: { color: '#0B1220', fontWeight: '700', fontSize: 15, letterSpacing: 0.4 },
  progressWrap: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  progressText: { color: '#0B1220', fontWeight: '700', fontSize: 14 },
});
