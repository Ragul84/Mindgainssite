import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  StatusBar,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { router, useLocalSearchParams } from 'expo-router';
import MascotAvatar from '@/components/ui/MascotAvatar';

// XPBar Component (extracted from dev's code)
const XPBar = ({ progress = 0.75, streak = 3 }) => {
  const percent = Math.round(progress * 100);

  return (
    <LinearGradient 
      colors={['rgba(255, 255, 255, 0)', '#000f2907']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={xpStyles.container}
    >
      {/* LEFT: XP number */}
      <View style={xpStyles.left}>
        <Text style={xpStyles.xpText}></Text>
      </View>

      {/* CENTER: PROGRESS BAR */}
      <View style={xpStyles.progressWrapper}>

        {/* --- FLOATING PERCENT BOX (locked to circle tip) --- */}
        <View style={[xpStyles.percentBoxWrapper, { width: `${percent}%` }]}>
          <View style={xpStyles.percentBox}>
            <Text style={xpStyles.percentText}>{percent}%</Text>
          </View>
        </View>

        {/* BAR */}
        <LinearGradient
          colors={['#d6d9e0dc', '#ffffffdc']}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={xpStyles.barContainer}
        >
          <View style={[xpStyles.fillWrapper, { width: `${percent}%` }]}>

            {/* BAR FILL */}
            <LinearGradient
              colors={['#00aeff', '#174cfcd8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={xpStyles.barFill}
            />

            {/* CIRCLE TIP */}
            <View style={xpStyles.circleTip} />
          </View>
        </LinearGradient>
      </View>

      {/* RIGHT: STREAK ICONS */}
      <View style={xpStyles.right}>
        {/* Stars instead of hearts */}
        <View style={xpStyles.starsContainer}>
          {[1, 2, 3].map((star, index) => (
            <Text key={star} style={[xpStyles.star, index < streak ? xpStyles.starActive : xpStyles.starInactive]}>⭐</Text>
          ))}
        </View>
      </View>
    </LinearGradient>
  );
};

// Lesson content - using dev's Constitution example
const constitutionInfo = [
  {
    title: "Formation",
    full: "Cabinet Mission Plan 1946, based on provincial assemblies",
  },
  {
    title: "Members", 
    full: "389 initially (292 provinces, 93 states, 4 chief commissioners)",
  },
  {
    title: "After Partition",
    full: "Reduced to 299 members (229 provinces, 70 states)",
  },
  {
    title: "President",
    full: "Dr. Rajendra Prasad became the President of Constituent Assembly",
  },
];

function InfoItem({ item }) {
  const [open, setOpen] = useState(false);
  const heightAnim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    setOpen(!open);

    Animated.timing(heightAnim, {
      toValue: open ? 0 : 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const animatedHeight = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 70], // adjust reveal height
  });

  return (
    <View style={styles.infoItem}>
      {/* Circle Indicator */}
      <TouchableOpacity onPress={toggle} style={styles.circleWrapper} activeOpacity={1} >
        <View
          style={[
            styles.circle,
            { backgroundColor: open ? "#00a3ff" : "#d3d3d3" },
          ]}
        />
      </TouchableOpacity>

      {/* Text Block */}
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{item.title}</Text>

        {/* Animated reveal */}
        <Animated.View style={{ height: animatedHeight, overflow: "hidden" }}>
          <Text style={styles.itemFull}>{item.full}</Text>
        </Animated.View>
      </View>
    </View>
  );
}

export default function LessonDevScreen() {
  const params = useLocalSearchParams();
  
  // Initialize any required state
  const [loading, setLoading] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={['#123f94ff', '#000f2963']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.background}
      >
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
          <XPBar progress={0.75} streak={2} />
          
          <View style={styles.contentContainer}>
            {/* Floating Mascot */}
            <View style={styles.lottieWrapper}>
              <MascotAvatar
                emotion="wave"
                size={250}
                style={styles.loaderCat}
              />
            </View>

            {/* MAIN CARD */}
            <LinearGradient colors={["#f0f8fdff", "#cae1f0ff"]} style={styles.card}>
              <Text style={styles.title}>Making of Constitution</Text>
              <Text style={styles.subtitle}>Constituent Assembly</Text>

              {/* Scrollable List */}
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                {constitutionInfo.map((item, index) => (
                  <InfoItem key={index} item={item} />
                ))}
              </ScrollView>

              {/* Navigation Buttons */}
              <View style={styles.navigationRow}>
                <TouchableOpacity activeOpacity={1} onPress={() => router.back()}>
                  <Ionicons name="chevron-back-circle" size={60} color="#00aeff" />
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} onPress={() => router.back()}>
                  <Ionicons name="chevron-forward-circle" size={60} color="#00aeff" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

// XPBar Styles
const xpStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 16,
    width: '100%',
    height: 90,
    alignSelf: 'center',
  },
  xpText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  progressWrapper: {
    flex: 1,
    position: 'relative',
  },
  percentBoxWrapper: {
    position: 'absolute',
    top: -25,
    alignItems: 'flex-end',
    zIndex: 20,
    height: 20,
  },
  percentBox: {
    backgroundColor: '#ffffffdd',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  percentText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#003060',
  },
  barContainer: {
    height: 35,
    padding: 3.5,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 1, height: 4 },
    shadowRadius: 4,
  },
  fillWrapper: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  barFill: {
    flex: 1,
    height: '60%',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#61b8ffec',
    alignSelf: 'center'
  },
  circleTip: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#4dc9ff',
    borderWidth: 3,
    borderColor: '#ffffffaa',
    marginLeft: -11,
    shadowColor: '#4dc9ff',
    shadowOpacity: 0.7,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  right: {
    marginLeft: 10,
    marginRight: 20,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  star: {
    fontSize: 16,
  },
  starActive: {
    opacity: 1,
  },
  starInactive: {
    opacity: 0.3,
  },
});

// Main Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  lottieWrapper: {
    position: "absolute",
    top: -60,
    zIndex: 20,
    width: 500,
    height: 250,
  },
  loaderCat: {
    width: 250,
    height: 250,
  },
  card: {
    width: "90%",
    height: 550,
    paddingVertical: 25,
    paddingHorizontal: 18,
    borderRadius: 28,
    borderWidth: 4,
    overflow: "hidden",
    borderColor: "#00aeff",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowOffset: { width: 5, height: 15 },
    shadowRadius: 4,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: '700',
    color: '#000',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: '600',
    color: '#000',
  },
  infoItem: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#ffffffcc",
    borderRadius: 20,
    marginBottom: 12,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 1, height: 4 },
    shadowRadius: 4,
  },
  circleWrapper: {
    marginRight: 15,
    paddingTop: 5,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  itemTitle: {
    fontSize: 17,
    color: "#0d1b6b",
    fontWeight: '600',
  },
  itemFull: {
    marginTop: 6,
    color: "#2e2e31d3",
    lineHeight: 20,
    fontSize: 14.5,
    fontWeight: "600",
    width: "95%",
  },
  navigationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
});