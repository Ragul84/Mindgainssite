import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { MotiView, AnimatePresence } from 'moti';
import { SupabaseService } from '@/utils/supabaseService';
import HapticService from '@/utils/hapticService';
import UniversalNavigation from '@/utils/universalNavigation';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function SmartVisionScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const cameraRef = useRef<CameraView>(null);

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    HapticService.selection();
    
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: true,
      });

      if (photo) {
        setCapturedImage(photo.uri);
        await processImage(photo.base64!, 'image/jpeg');
      }
    } catch (e) {
      Alert.alert("Error", "Failed to capture image.");
    }
  };

  const handlePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      setCapturedImage(result.assets[0].uri);
      await processImage(result.assets[0].base64!, result.assets[0].type || 'image/jpeg');
    }
  };

  const processImage = async (base64: string, type: string) => {
    setLoading(true);
    setProcessingStep('Neural Scan...');
    HapticService.medium();

    try {
      setProcessingStep('Decoding Knowledge...');
      const response = await SupabaseService.callEdgeFunction('process-image-ocr', {
        imageData: `data:${type};base64,${base64}`,
        imageType: type
      });

      if (response?.success && response.extractedText) {
          setProcessingStep('Synthesizing Result...');
          UniversalNavigation.navigateTo({
              pathname: '/learn/content-viewer',
              params: { 
                  contentId: response.contentAnalysis?.studyNotesId || '', 
                  contentType: 'study_notes', 
                  source: 'camera', 
                  title: 'Vision Scan', 
                  directContent: response.extractedText 
              }
          });
      } else {
          throw new Error("OCR Failed");
      }
    } catch (e) {
      Alert.alert("Error", "Failed to analyze image. Ensure text is clear.");
      setCapturedImage(null);
    } finally {
      setLoading(false);
      setProcessingStep('');
    }
  };

  if (!permission) return <View style={styles.container} />;
  if (!permission.granted) {
      return (
          <View style={styles.container}>
              <LinearGradient colors={['#020617', '#080C14']} style={StyleSheet.absoluteFill} />
              <SafeAreaView style={styles.permissionWrap}>
                  <Ionicons name="camera" size={60} color="#60A5FA" />
                  <Text style={styles.permissionTitle}>Camera Access Required</Text>
                  <Text style={styles.permissionSubtitle}>Smart Vision needs camera access to scan your questions and notes.</Text>
                  <TouchableOpacity style={styles.permissionBtn} activeOpacity={1} onPress={requestPermission}>
                      <Text style={styles.permissionBtnText}>GRANT ACCESS</Text>
                  </TouchableOpacity>
              </SafeAreaView>
          </View>
      );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent />
      
      {!capturedImage ? (
          <CameraView ref={cameraRef} style={styles.camera}>
              <View style={styles.cameraOverlay}>
                <View style={[styles.header, { marginTop: 40 }]}>
                    <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="close" size={28} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.visionTitle}>SMART VISION</Text>
                    <View style={{ width: 44 }} />
                </View>

                <View style={styles.scanFrameContainer}>
                    <MotiView 
                        from={{ opacity: 0.3 }}
                        animate={{ opacity: 0.8 }}
                        transition={{ loop: true, type: 'timing', duration: 1500 }}
                        style={styles.scanFrame}
                    >
                        <View style={[styles.corner, styles.tl]} />
                        <View style={[styles.corner, styles.tr]} />
                        <View style={[styles.corner, styles.bl]} />
                        <View style={[styles.corner, styles.br]} />
                    </MotiView>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity onPress={handlePick} style={styles.galleryBtn} activeOpacity={1} >
                        <Ionicons name="images" size={24} color="#FFF" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={handleCapture} style={styles.captureBtn} activeOpacity={1} >
                        <View style={styles.captureInner} />
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={1} onPress={() => {}} style={styles.galleryBtn}>
                        <Ionicons name="flash" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>
              </View>
          </CameraView>
      ) : (
          <View style={styles.previewWrap}>
              <Image source={{ uri: capturedImage }} style={styles.previewImg} />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={StyleSheet.absoluteFill} />
          </View>
      )}

      <AnimatePresence>
          {loading && (
              <MotiView 
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={styles.loadingOverlay}
              >
                  <BlurBackground />
                  <MotiView 
                    from={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={styles.loadingCard}
                  >
                      <ActivityIndicator size="large" color="#60A5FA" />
                      <Text style={styles.loadingStep}>{processingStep.toUpperCase()}</Text>
                  </MotiView>
              </MotiView>
          )}
      </AnimatePresence>
    </View>
  );
}

const BlurBackground = () => (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(2, 6, 23, 0.8)' }]} />
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  camera: { flex: 1 },
  cameraOverlay: {
      flex: 1,
      justifyContent: 'space-between',
      paddingVertical: 20,
  },
  header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
  },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 22 },
  visionTitle: { color: '#FFF', fontSize: 13, fontWeight: '900', letterSpacing: 3 },
  scanFrameContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
  },
  scanFrame: {
      width: SCREEN_WIDTH * 0.8,
      height: SCREEN_WIDTH * 0.8,
      position: 'relative',
  },
  corner: { position: 'absolute', width: 40, height: 40, borderColor: '#60A5FA', borderWidth: 4 },
  tl: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  tr: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bl: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  br: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingBottom: 40,
  },
  captureBtn: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 4,
      borderColor: '#FFF',
      padding: 6,
  },
  captureInner: {
      flex: 1,
      borderRadius: 40,
      backgroundColor: '#FFF',
  },
  galleryBtn: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: 'rgba(255,255,255,0.1)',
      alignItems: 'center',
      justifyContent: 'center',
  },
  previewWrap: { flex: 1 },
  previewImg: { flex: 1, resizeMode: 'cover' },
  loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
  },
  loadingCard: {
      alignItems: 'center',
      gap: 20,
  },
  loadingStep: {
      color: '#60A5FA',
      fontSize: 12,
      fontWeight: '900',
      letterSpacing: 2,
  },
  permissionWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  permissionTitle: { color: '#FFF', fontSize: 22, fontWeight: '900', marginTop: 30 },
  permissionSubtitle: { color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 12, lineHeight: 22 },
  permissionBtn: {
      marginTop: 40,
      paddingHorizontal: 40,
      paddingVertical: 18,
      backgroundColor: '#60A5FA',
      borderRadius: 16,
  },
  permissionBtnText: { color: '#FFF', fontWeight: '900', letterSpacing: 1 },
});

