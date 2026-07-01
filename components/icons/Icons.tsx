// Icon components that work on both web and mobile
import React from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { 
  DoseDecor, 
  BookDecor, 
  CookieDecor, 
  FlameDecor 
} from '@/components/decor/PremiumDecor';

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
  color?: string;
}

export const PillIcon = ({ width = 24, height = 24 }: IconProps) => (
  <DoseDecor size={Math.min(width, height)} />
);

export const BookIcon = ({ width = 24, height = 24 }: IconProps) => (
  <BookDecor size={Math.min(width, height)} />
);

export const CookieIcon = ({ width = 24, height = 24 }: IconProps) => (
  <CookieDecor size={Math.min(width, height)} />
);

export const CatIcon = ({ width = 24, height = 24, fill = '#4dc9ff', color }: IconProps) => (
  <FontAwesome5 name="cat" size={Math.min(width, height)} color={color || fill} />
);

export const FlameIcon = ({ width = 24, height = 24 }: IconProps) => (
  <FlameDecor size={Math.min(width, height)} />
);