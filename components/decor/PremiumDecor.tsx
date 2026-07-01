import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { 
  Path, 
  Defs, 
  LinearGradient, 
  Stop, 
  G, 
  Circle, 
  Rect,
  Ellipse,
  RadialGradient,
  Filter,
  FeGaussianBlur,
  FeMerge,
  FeMergeNode,
  Pattern
} from 'react-native-svg';

interface DecorProps {
  size?: number;
  color?: string;
  focused?: boolean;
}

export const HomeDecor = ({ size = 28, focused = false }: DecorProps) => {
  const primary = focused ? '#00D4C7' : '#64748B';
  const glow = focused ? '#00F5E4' : 'transparent';
  
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="home_grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primary} />
          <Stop offset="100%" stopColor={focused ? '#0EA5E9' : '#4A5568'} />
        </LinearGradient>
      </Defs>
      <G opacity={focused ? 1 : 0.7}>
        {/* Tech House Shape */}
        <Path 
          d="M3 10L12 3L21 10V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V10Z" 
          stroke="url(#home_grad)" 
          strokeWidth="2" 
          fill={focused ? "url(#home_grad)" : "none"}
          fillOpacity={0.15}
        />
        <Path d="M9 21V12H15V21" stroke="url(#home_grad)" strokeWidth="2" strokeLinecap="round" />
        {focused && <Circle cx="12" cy="7.5" r="1.5" fill="#00F5E4" />}
      </G>
    </Svg>
  );
};

export const LearnDecor = ({ size = 28, focused = false }: DecorProps) => {
  const primary = focused ? '#00D4C7' : '#64748B';
  
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="learn_grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primary} />
          <Stop offset="100%" stopColor={focused ? '#A78BFA' : '#4A5568'} />
        </LinearGradient>
      </Defs>
      <G opacity={focused ? 1 : 0.7}>
        {/* Digital Book */}
        <Path 
          d="M4 19.5V4.5C4 3.39543 4.89543 2.5 6 2.5H18C19.1046 2.5 20 3.39543 20 4.5V19.5C20 20.6046 19.1046 21.5 18 21.5H6C4.89543 21.5 4 20.6046 4 19.5Z" 
          stroke="url(#learn_grad)" 
          strokeWidth="2" 
          fill={focused ? "url(#learn_grad)" : "none"}
          fillOpacity={0.15}
        />
        <Path d="M8 7H16M8 11H16M8 15H13" stroke="url(#learn_grad)" strokeWidth="2" strokeLinecap="round" opacity={0.6} />
        <Path d="M4 17.5H20" stroke="url(#learn_grad)" strokeWidth="1" />
      </G>
    </Svg>
  );
};

export const MigaDecor = ({ size = 32, focused = false }: DecorProps) => {
  // New Design: "Crystalline Voice Core"
  // Fits better with the Deep Space Blue background.
  
  // Bright Cyan & Pure White for focus
  const activeColor = '#00F5E4'; 
  const activeDetail = '#FFFFFF';
  
  // Cool Slate/Silver for inactive (Harmonizes with blue bg)
  const inactiveColor = '#94A3B8'; 
  const inactiveDetail = '#64748B';

  const primary = focused ? activeColor : inactiveColor;
  const secondary = focused ? activeDetail : inactiveDetail;

  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Defs>
        <LinearGradient id="core_grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={focused ? '#22D3EE' : '#475569'} />
          <Stop offset="100%" stopColor={focused ? '#00D4C7' : '#334155'} />
        </LinearGradient>
        <Filter id="core_glow">
          <FeGaussianBlur stdDeviation={focused ? 2 : 0} />
        </Filter>
      </Defs>

      {/* Main Container Group */}
      <G opacity={focused ? 1 : 0.8}>
        
        {/* 1. The Neural Hexagon (AI Brain) */}
        <Path 
          d="M16 4L23 8V16L16 20L9 16V8L16 4Z" 
          fill="url(#core_grad)" 
          stroke={secondary} 
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* 2. Internal Circuitry */}
        <Path 
          d="M16 8V12M16 12L19 14M16 12L13 14" 
          stroke={secondary} 
          strokeWidth="1.5" 
          strokeLinecap="round" 
        />

        {/* 3. Orbiting Voice Waves (Floating Rings) */}
        <Path 
          d="M4 16C4 9.37258 9.37258 4 16 4M28 16C28 22.6274 22.6274 28 16 28" 
          stroke={primary} 
          strokeWidth="2" 
          strokeLinecap="round" 
          opacity={0.6}
        />
        
        {/* 4. Bottom Data Link */}
        <Rect x="15" y="22" width="2" height="6" rx="1" fill={primary} opacity={0.5} />
        <Rect x="12" y="24" width="2" height="4" rx="1" fill={primary} opacity={0.3} />
        <Rect x="18" y="24" width="2" height="4" rx="1" fill={primary} opacity={0.3} />

        {/* 5. Active Glow Pulse */}
        {focused && (
          <Circle cx="16" cy="12" r="3" fill="white" filter="url(#core_glow)" opacity={0.7} />
        )}
      </G>
    </Svg>
  );
};

export const RanksDecor = ({ size = 24, focused = false }: DecorProps) => {
  const primary = focused ? '#FFD76F' : '#64748B';
  
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="ranks_grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primary} />
          <Stop offset="100%" stopColor={focused ? '#FFA500' : '#4A5568'} />
        </LinearGradient>
      </Defs>
      <Path 
        d="M5 15H19L22 6L16.5 10.5L12 3L7.5 10.5L2 6L5 15Z" 
        stroke="url(#ranks_grad)" 
        strokeWidth="2" 
        strokeLinejoin="round"
        fill={focused ? "url(#ranks_grad)" : "none"}
        fillOpacity={0.2}
      />
      <Rect x="5" y="17" width="14" height="2" rx="1" fill="url(#ranks_grad)" opacity={0.6} />
    </Svg>
  );
};

export const ProfileDecor = ({ size = 24, focused = false }: DecorProps) => {
  const primary = focused ? '#8B5CF6' : '#64748B';
  
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="profile_grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primary} />
          <Stop offset="100%" stopColor={focused ? '#A78BFA' : '#4A5568'} />
        </LinearGradient>
      </Defs>
      <G opacity={focused ? 1 : 0.8}>
        <Circle cx="12" cy="8" r="4" stroke="url(#profile_grad)" strokeWidth="2" />
        <Path 
          d="M4 20C4 17 8 15 12 15C16 15 20 17 20 20" 
          stroke="url(#profile_grad)" 
          strokeWidth="2" 
          strokeLinecap="round"
        />
        {focused && (
          <Rect x="10" y="19" width="4" height="1" rx="0.5" fill="#A78BFA" />
        )}
      </G>
    </Svg>
  );
};

export const KnowledgeDecor = ({ size = 48, focused = true }: DecorProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Defs>
        <RadialGradient id="shard_core" cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="0%" stopColor="#00D4C7" />
          <Stop offset="100%" stopColor="transparent" />
        </RadialGradient>
      </Defs>
      <G>
        <Path 
          d="M24 4L34 14L24 44L14 14L24 4Z" 
          fill="#00D4C7" 
          fillOpacity={0.1}
          stroke="#00D4C7"
          strokeWidth="1"
        />
        <Circle cx="24" cy="14" r="8" fill="url(#shard_core)" opacity={0.6} />
        <Path 
          d="M20 12L24 16L28 12" 
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
};

export const DoseDecor = ({ size = 32, focused = true }: DecorProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Defs>
        <LinearGradient id="pill_grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#00D4C7" />
          <Stop offset="50%" stopColor="#00D4C7" />
          <Stop offset="50%" stopColor="#008080" />
          <Stop offset="100%" stopColor="#008080" />
        </LinearGradient>
      </Defs>
      <Rect 
        x="12" y="4" width="8" height="24" rx="4" 
        fill="url(#pill_grad)" 
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
        transform="rotate(45 16 16)"
      />
      <Circle cx="16" cy="16" r="10" stroke="#00D4C7" strokeWidth="0.5" opacity={0.3} />
    </Svg>
  );
};

export const FlameDecor = ({ size = 32, focused = true }: DecorProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Defs>
        <LinearGradient id="flame_grad" x1="50%" y1="0%" x2="50%" y2="100%">
          <Stop offset="0%" stopColor="#FF6B4D" />
          <Stop offset="100%" stopColor="#FFD76F" />
        </LinearGradient>
        <Filter id="flame_glow">
          <FeGaussianBlur stdDeviation="2" />
        </Filter>
      </Defs>
      <G filter="url(#flame_glow)">
        <Path 
          d="M16 2C16 2 24 10 24 18C24 23.5 19.5 28 16 28C12.5 28 8 23.5 8 18C8 10 16 2Z" 
          fill="url(#flame_grad)" 
        />
        <Path 
          d="M16 12C16 12 20 16 20 20C20 22.2 18.2 24 16 24C13.8 24 12 22.2 12 20C12 16 16 12Z" 
          fill="white" 
          fillOpacity={0.3}
        />
      </G>
    </Svg>
  );
};

export const BookDecor = ({ size = 32, focused = true }: DecorProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <LinearGradient id="book_grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#8B5CF6" />
        <Stop offset="100%" stopColor="#00D4C7" />
      </LinearGradient>
      <Path 
        d="M6 4H24C25.1 4 26 4.9 26 6V26C26 27.1 25.1 28 24 28H6C4.9 28 4 27.1 4 26V6C4 4.9 4.9 4 6 4Z" 
        stroke="url(#book_grad)" 
        strokeWidth="2" 
        fill="url(#book_grad)"
        fillOpacity={0.1}
      />
      <Path d="M8 10H22M8 16H22M8 22H18" stroke="url(#book_grad)" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
};

export const CookieDecor = ({ size = 32, focused = true }: DecorProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Circle cx="16" cy="16" r="12" fill="#3D2914" stroke="#FFD76F" strokeWidth="1.5" />
      <Circle cx="12" cy="12" r="2" fill="#FFD76F" />
      <Circle cx="20" cy="14" r="1.5" fill="#FFD76F" opacity={0.8} />
      <Circle cx="14" cy="20" r="2" fill="#FFD76F" />
      <Path d="M24 10C24 10 21 11 20 14" stroke="#FFD76F" strokeWidth="1" strokeLinecap="round" />
    </Svg>
  );
};

export const HeistDecor = ({ size = 32, focused = true }: DecorProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Defs>
        <LinearGradient id="heist_grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#8B5CF6" />
          <Stop offset="100%" stopColor="#22D3EE" />
        </LinearGradient>
      </Defs>
      <G>
        <Path 
          d="M16 4C10 4 6 8 6 12C6 16 10 20 16 20C22 20 26 16 26 12C26 8 22 4 16 4ZM10 11C11 11 12 12 12 13C12 14 11 15 10 15C9 15 8 14 8 13C8 12 9 11 10 11ZM22 11C23 11 24 12 24 13C24 14 23 15 22 15C21 15 20 14 20 13C20 12 21 11 22 11Z" 
          fill="url(#heist_grad)" 
        />
        <Path d="M10 24L16 28L22 24" stroke="url(#heist_grad)" strokeWidth="2" strokeLinecap="round" />
      </G>
    </Svg>
  );
};

export const StateInsignia = ({ size = 40, stateName = 'default' }: { size?: number, stateName?: string }) => {
  const colors = ['#38BDF8', '#A78BFA', '#F472B6', '#34D399', '#FBBF24', '#00D4C7', '#FB7185', '#94A3B8', '#6366F1', '#EC4899', '#8B5CF6', '#10B981'];
  const charCode = stateName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const primary = colors[charCode % colors.length];
  const secondary = colors[(charCode + 4) % colors.length];
  
  const patternType = charCode % 12;

  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Defs>
        <LinearGradient id={`insig_grad_${stateName}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primary} />
          <Stop offset="100%" stopColor={secondary} />
        </LinearGradient>
      </Defs>
      <G>
        {/* Shield Frame - High Fidelity Beveled Look */}
        <Path 
          d="M20 2L35 8V18C35 26 28 34 20 38C12 34 5 26 5 18V8L20 2Z" 
          fill={primary} 
          fillOpacity={0.1}
          stroke={`url(#insig_grad_${stateName})`}
          strokeWidth="2"
        />
        
        {/* Unique Complex Patterns (12 Varieties) */}
        <G transform="translate(10, 10)">
          {patternType === 0 && ( // The Ancient Citadel
            <Path d="M2 18V10H4V6H8V4H12V6H16V10H18V18H2ZM5 11V16H15V11H5ZM9 7V9H11V7H9Z" fill={primary} />
          )}
          {patternType === 1 && ( // The Cyber Pulse
            <G>
              <Circle cx="10" cy="10" r="5" stroke={primary} strokeWidth="1.5" />
              <Path d="M2 10H6M14 10H18M10 2V6M10 14V18" stroke={primary} strokeWidth="2" strokeLinecap="round" />
              <Circle cx="10" cy="10" r="2" fill="white" />
            </G>
          )}
          {patternType === 2 && ( // The Phoenix Flight
            <Path d="M2 8C5 4 15 4 18 8L10 18L2 8Z M10 6C8 6 4 8 4 8L10 14L16 8C16 8 12 6 10 6Z" fill={primary} />
          )}
          {patternType === 3 && ( // The Quantum Core
            <G>
              <Circle cx="10" cy="10" r="8" stroke={primary} strokeWidth="0.5" strokeDasharray="2 2" />
              <Ellipse cx="10" cy="10" rx="9" ry="3" stroke={primary} strokeWidth="1.5" transform="rotate(45 10 10)" />
              <Ellipse cx="10" cy="10" rx="9" ry="3" stroke={primary} strokeWidth="1.5" transform="rotate(-45 10 10)" />
            </G>
          )}
          {patternType === 4 && ( // The Sovereign Star
            <Path d="M10 2L13 8L19 9L15 14L16 20L10 17L4 20L5 14L1 9L7 8L10 2Z" fill={primary} />
          )}
          {patternType === 5 && ( // The Neural Matrix
            <G>
              <Rect x="2" y="2" width="5" height="5" rx="1" fill={primary} />
              <Rect x="13" y="2" width="5" height="5" rx="1" fill={primary} />
              <Rect x="2" y="13" width="5" height="5" rx="1" fill={primary} />
              <Rect x="13" y="13" width="5" height="5" rx="1" fill={primary} />
              <Path d="M7 4.5H13M7 15.5H13M4.5 7V13M15.5 7V13" stroke={primary} strokeWidth="1" />
            </G>
          )}
          {patternType === 6 && ( // The Vanguard Arrow
            <Path d="M2 10L10 2L18 10L14 10V18H6V10L2 10Z" fill={primary} stroke="white" strokeWidth="0.5" />
          )}
          {patternType === 7 && ( // The Logic Hex
            <Path d="M10 2L18 6.5V13.5L10 18L2 13.5V6.5L10 2ZM10 5L15 8V12L10 15L5 12V8L10 5Z" fill={primary} />
          )}
          {patternType === 8 && ( // The Laurel Wreath (New)
            <G>
              <Path d="M4 18C4 18 1 14 1 10C1 6 4 4 4 4" stroke={primary} strokeWidth="2" strokeLinecap="round" />
              <Path d="M16 18C16 18 19 14 19 10C19 6 16 4 16 4" stroke={primary} strokeWidth="2" strokeLinecap="round" />
              <Circle cx="10" cy="10" r="3" fill={primary} />
            </G>
          )}
          {patternType === 9 && ( // The Solar Flare (New)
            <G>
              <Path d="M10 2V5M10 15V18M2 10H5M15 10H18M4.5 4.5L6.5 6.5M13.5 13.5L15.5 15.5M4.5 15.5L6.5 13.5M13.5 4.5L15.5 6.5" stroke={primary} strokeWidth="2" strokeLinecap="round" />
              <Circle cx="10" cy="10" r="4" fill={primary} />
            </G>
          )}
          {patternType === 10 && ( // The Explorer Compass (New)
            <G>
              <Path d="M10 2L12 10L10 18L8 10L10 2Z" fill={primary} />
              <Path d="M2 10L10 8L18 10L10 12L2 10Z" fill={primary} opacity={0.6} />
              <Circle cx="10" cy="10" r="1.5" fill="white" />
            </G>
          )}
          {patternType === 11 && ( // The Infinite Loop (New)
            <Path d="M5 10C5 7.5 7.5 5 10 5C12.5 5 15 10 15 10C15 10 17.5 15 20 15C22.5 15 25 12.5 25 10" stroke={primary} strokeWidth="2.5" strokeLinecap="round" transform="translate(-5, 0)" />
          )}
        </G>
        
        {/* Beveled Bottom Accent */}
        <Path d="M15 35L20 38L25 35" stroke={secondary} strokeWidth="1" strokeLinecap="round" />
      </G>
    </Svg>
  );
};

export const GoldenFrame = ({ children, style }: { children?: React.ReactNode, style?: any }) => {
  return (
    <View style={[{ position: 'relative' }, style]}>
      {children}
      <Svg 
        style={[StyleSheet.absoluteFillObject, { zIndex: 10 }]} 
        pointerEvents="none" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <Defs>
          <LinearGradient id="gold_metallic" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#D9C375" />
            <Stop offset="45%" stopColor="#C47E09" />
            <Stop offset="55%" stopColor="#CCC6BE" />
            <Stop offset="100%" stopColor="#904207" />
          </LinearGradient>
          <Filter id="heavy_glow">
            <FeGaussianBlur stdDeviation="3" />
          </Filter>
        </Defs>

        {/* Ornate Thick Corners - Top Left */}
        <Path d="M0 25 V5 Q0 0 5 0 H25" stroke="url(#gold_metallic)" strokeWidth="4" fill="none" vectorEffect="non-scaling-stroke" />
        <Path d="M8 20 V8 H20" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" />

        {/* Top Right */}
        <Path d="M100 25 V5 Q100 0 95 0 H75" stroke="url(#gold_metallic)" strokeWidth="4" fill="none" vectorEffect="non-scaling-stroke" />
        <Path d="M92 20 V8 H80" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" />

        {/* Bottom Left */}
        <Path d="M0 75 V95 Q0 100 5 100 H25" stroke="url(#gold_metallic)" strokeWidth="4" fill="none" vectorEffect="non-scaling-stroke" />
        <Path d="M8 80 V92 H20" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" />

        {/* Bottom Right */}
        <Path d="M100 75 V95 Q100 100 95 100 H75" stroke="url(#gold_metallic)" strokeWidth="4" fill="none" vectorEffect="non-scaling-stroke" />
        <Path d="M92 80 V92 H80" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" />
        
        {/* Center Royal Emblems */}
        <Circle cx="50" cy="0" r="3" fill="url(#gold_metallic)" />
        <Circle cx="50" cy="100" r="3" fill="url(#gold_metallic)" />
        <Rect x="0" y="45" width="2" height="10" rx="1" fill="url(#gold_metallic)" />
        <Rect x="98" y="45" width="2" height="10" rx="1" fill="url(#gold_metallic)" />
      </Svg>

      {/* Extreme Outer Glow Layer */}
      <Svg 
        style={[StyleSheet.absoluteFillObject, { zIndex: 5 }]} 
        pointerEvents="none" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <G filter="url(#heavy_glow)" opacity={0.4}>
           <Path d="M2 2 H98 V98 H2 Z" stroke="#C47E09" strokeWidth="2" fill="none" />
        </G>
      </Svg>
    </View>
  );
};

// 🏅 Modern Cyber-Medal Frame (Alternative to GoldenFrame)
export const CyberMedalFrame = ({ style, children }: { style?: any, children?: React.ReactNode }) => {
  return (
    <View style={[style, { overflow: 'hidden' }]}>
      {children}
      <Svg style={StyleSheet.absoluteFillObject} viewBox="0 0 100 100" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="cyber_grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#00D4C7" />
            <Stop offset="50%" stopColor="#22D3EE" />
            <Stop offset="100%" stopColor="#3B82F6" />
          </LinearGradient>
          <LinearGradient id="glass_sheen" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
            <Stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </LinearGradient>
          <Filter id="cyan_glow">
            <FeGaussianBlur stdDeviation="2" />
          </Filter>
        </Defs>

        {/* Top Tech Border */}
        <Path 
          d="M0 15 L15 0 H85 L100 15 H0 Z" 
          fill="url(#glass_sheen)" 
          stroke="url(#cyber_grad)" 
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        
        {/* Bottom Tech Border */}
        <Path 
          d="M0 85 L15 100 H85 L100 85 H0 Z" 
          fill="url(#glass_sheen)" 
          stroke="url(#cyber_grad)" 
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />

        {/* Side Connectors */}
        <Rect x="0" y="30" width="2" height="40" fill="url(#cyber_grad)" />
        <Rect x="98" y="30" width="2" height="40" fill="url(#cyber_grad)" />

        {/* Corner Accents */}
        <Path d="M0 15 V30 M100 15 V30 M0 85 V70 M100 85 V70" stroke="url(#cyber_grad)" strokeWidth="3" vectorEffect="non-scaling-stroke" />

        {/* Center Jewel */}
        <G filter="url(#cyan_glow)">
           <Circle cx="50" cy="0" r="4" fill="#22D3EE" />
           <Circle cx="50" cy="100" r="4" fill="#22D3EE" />
        </G>
      </Svg>
    </View>
  );
};

// 💎 Elegant Minimal Frame (Unified & Simple)
// A clean, high-fidelity frame that doesn't distract.
export const RoyalGoldMedalFrame = ({ style, children }: { style?: any, children?: React.ReactNode }) => {
  return (
    <View style={[style, { overflow: 'hidden' }]}>
      {children}
      <Svg style={StyleSheet.absoluteFillObject} viewBox="0 0 100 100" preserveAspectRatio="none">
        <Defs>
           {/* Pure, clean gradient */}
          <LinearGradient id="clean_border" x1="0%" y1="0%" x2="100%" y2="100%">
             <Stop offset="0%" stopColor="rgba(56, 189, 248, 0.3)" />
             <Stop offset="50%" stopColor="rgba(0, 212, 199, 0.6)" />
             <Stop offset="100%" stopColor="rgba(56, 189, 248, 0.3)" />
           </LinearGradient>
        </Defs>

        {/* 1. Main Border using Rect for perfect scaling */}
        <Rect 
            x="1" y="1" width="98" height="98" rx="2" ry="2"
            fill="rgba(0,0,0,0.2)" // Slight dark tint to foster legibility
            stroke="url(#clean_border)"
            strokeWidth="0.5"
            vectorEffect="non-scaling-stroke"
        />

        {/* 2. Cinematic Corner Brackets (The "Frame" essence) */}
        {/* Top Left */}
        <Path d="M1 20 V1 H20" stroke="#00D4C7" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
        {/* Top Right */}
        <Path d="M80 1 H99 V20" stroke="#00D4C7" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
        {/* Bottom Left */}
        <Path d="M1 80 V99 H20" stroke="#00D4C7" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
        {/* Bottom Right */}
        <Path d="M80 99 H99 V80" stroke="#00D4C7" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />

      </Svg>
    </View>
  );
};

// 🌌 Subtle Background Decor: Elegant Hex Mesh
export const SubtleHexPattern = ({ opacity = 0.03 }: { opacity?: number }) => (
    <Svg style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <Defs>
            <Pattern id="hex" x="0" y="0" width="40" height="60" patternUnits="userSpaceOnUse">
                <Path d="M20 0 L40 10 V30 L20 40 L0 30 V10 Z" fill="none" stroke="#FFFFFF" strokeWidth="1" />
            </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#hex)" opacity={opacity} />
    </Svg>
);

// 🌠 Subtle Background Decor: Deep Space Nebula Glow
export const DeepSpaceNebula = () => (
    <Svg style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <Defs>
            <RadialGradient id="nebula_glow" cx="50%" cy="0%" rx="80%" ry="40%">
                <Stop offset="0%" stopColor="#38BDF8" stopOpacity="0.08" />
                <Stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.03" />
                <Stop offset="100%" stopColor="transparent" />
            </RadialGradient>
        </Defs>
        <Rect width="100%" height="50%" fill="url(#nebula_glow)" />
    </Svg>
);
