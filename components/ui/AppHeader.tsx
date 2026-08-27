import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';
import { Title, Subtitle } from '@/components/ui/Typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderAction {
  key: string;
  element: React.ReactNode;
  onPress?: () => void;
}

interface Props {
  title: string;
  subtitle?: string;
  containerStyle?: ViewStyle;
  leftAction?: HeaderAction;
  rightActions?: HeaderAction[];
  compact?: boolean;
}

export const AppHeader: React.FC<Props> = ({ title, subtitle, containerStyle, leftAction, rightActions, compact }) => {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={["rgba(255,255,255,0.02)", "rgba(255,255,255,0.00)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.wrap, { paddingTop: Math.max(compact ? 6 : 12, insets.top), paddingBottom: compact ? 6 : 12 }, containerStyle]}
    >
      <View style={styles.row}>
        {leftAction ? (
          <TouchableOpacity onPress={leftAction.onPress} activeOpacity={0.85}>
            {leftAction.element}
          </TouchableOpacity>
        ) : <View style={{ width: 40 }} />}

        <View style={styles.center}>
          <Title numberOfLines={1} ellipsizeMode="tail" style={[styles.title, compact && styles.titleCompact]}>{title}</Title>
          {subtitle ? (
            <Subtitle numberOfLines={1} ellipsizeMode="tail" style={[styles.subtitle, compact && styles.subtitleCompact]}>
              {subtitle}
            </Subtitle>
          ) : null}
        </View>

        <View style={styles.actions}>
          {(rightActions || []).map(action => (
            <TouchableOpacity key={action.key} onPress={action.onPress} activeOpacity={0.85}>
              {action.element}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  wrap: { paddingTop: 12, paddingBottom: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  row: { flexDirection: 'row', alignItems: 'center' },
  center: { flex: 1, alignItems: 'flex-start' },
  title: { fontFamily: theme.fonts.heading, fontSize: 20, letterSpacing: -0.2 },
  titleCompact: { fontSize: 18 },
  subtitle: { marginTop: 2, opacity: 0.8 },
  subtitleCompact: { marginTop: 0, fontSize: 12, opacity: 0.7 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});

export default AppHeader;
