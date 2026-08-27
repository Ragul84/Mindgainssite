import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

export const Title: React.FC<TextProps> = ({ style, ...props }) => {
  return (
    <Text
      style={[styles.title, style]}
      {...props}
    />
  );
};

export const Subtitle: React.FC<TextProps> = ({ style, ...props }) => {
  return (
    <Text
      style={[styles.subtitle, style]}
      {...props}
    />
  );
};

export const Heading: React.FC<TextProps> = ({ style, ...props }) => {
  return (
    <Text
      style={[styles.heading, style]}
      {...props}
    />
  );
};

export const Body: React.FC<TextProps> = ({ style, ...props }) => {
  return (
    <Text
      style={[styles.body, style]}
      {...props}
    />
  );
};

export const Label: React.FC<TextProps> = ({ style, ...props }) => {
  return (
    <Text
      style={[styles.label, style]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: theme.tokens.typography.titleLarge.fontSize,
    fontWeight: theme.tokens.typography.titleLarge.fontWeight as any,
    lineHeight: theme.tokens.typography.titleLarge.lineHeight,
    color: theme.tokens.color.onBackground,
  },
  subtitle: {
    fontSize: theme.tokens.typography.bodyMedium.fontSize,
    fontWeight: theme.tokens.typography.bodyMedium.fontWeight as any,
    lineHeight: theme.tokens.typography.bodyMedium.lineHeight,
    color: theme.tokens.color.onBackground,
    opacity: 0.7,
  },
  heading: {
    fontSize: theme.tokens.typography.headlineSmall.fontSize,
    fontWeight: theme.tokens.typography.headlineSmall.fontWeight as any,
    lineHeight: theme.tokens.typography.headlineSmall.lineHeight,
    color: theme.tokens.color.onBackground,
  },
  body: {
    fontSize: theme.tokens.typography.bodyLarge.fontSize,
    fontWeight: theme.tokens.typography.bodyLarge.fontWeight as any,
    lineHeight: theme.tokens.typography.bodyLarge.lineHeight,
    color: theme.tokens.color.onBackground,
  },
  label: {
    fontSize: theme.tokens.typography.labelMedium.fontSize,
    fontWeight: theme.tokens.typography.labelMedium.fontWeight as any,
    lineHeight: theme.tokens.typography.labelMedium.lineHeight,
    color: theme.tokens.color.onBackground,
  },
});
