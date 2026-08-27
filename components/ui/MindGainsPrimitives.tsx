import React from 'react';
import { 
  Box, 
  Text, 
  HStack, 
  VStack, 
  Heading,
} from '@gluestack-ui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

/**
 * MindGains Design System Primitives - V2026 Core
 * High-performance, high-fidelity UI foundations.
 */

export const MGCard = ({ children, ...props }: any) => (
  <Box
    bg="$coolGray800"
    borderRadius="$2xl"
    p="$5"
    borderWidth={1}
    borderColor="rgba(255,255,255,0.08)"
    {...props}
  >
    {children}
  </Box>
);

export const MGGlassCard = ({ children, ...props }: any) => (
  <Box
    borderRadius="$2xl"
    p="$5"
    borderWidth={1}
    borderColor="rgba(255,255,255,0.1)"
    style={{ overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.04)' }}
    {...props}
  >
    {children}
  </Box>
);

export const MGTopBarShell = ({ children, isDarkMode = true, ...props }: any) => (
  <Box
    bg={isDarkMode ? "$coolGray900" : "$white"}
    borderBottomWidth={1}
    borderColor={isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}
    {...props}
  >
    {children}
  </Box>
);

export const MGSectionTitle = ({ children, ...props }: any) => (
  <Heading
    size="sm"
    color="$coolGray100"
    fontFamily="Poppins-Bold"
    mb="$3"
    {...props}
  >
    {children}
  </Heading>
);

export const MGChip = ({ children, ...props }: any) => (
  <Box
    bg="rgba(0, 212, 199, 0.1)"
    px="$3"
    py="$1"
    borderRadius="$full"
    borderWidth={1}
    borderColor="rgba(0, 212, 199, 0.3)"
    {...props}
  >
    {children}
  </Box>
);

export const MGChipText = ({ children, ...props }: any) => (
  <Text
    size="xs"
    color="#00D4C7"
    fontWeight="$bold"
    fontFamily="Inter-Bold"
    {...props}
  >
    {children}
  </Text>
);

export const MGStatBadge = ({ children, ...props }: any) => (
  <Box
    flex={1}
    bg="rgba(255,255,255,0.03)"
    p="$3"
    borderRadius="$xl"
    borderWidth={1}
    borderColor="rgba(255,255,255,0.05)"
    alignItems="center"
    {...props}
  >
    {children}
  </Box>
);

export const MGStatValue = ({ children, ...props }: any) => (
  <Text
    size="md"
    color="$white"
    fontWeight="$bold"
    fontFamily="Poppins-Bold"
    {...props}
  >
    {children}
  </Text>
);

export const MGStatLabel = ({ children, ...props }: any) => (
  <Text
    size="xs"
    color="$coolGray400"
    fontFamily="Inter-Medium"
    {...props}
  >
    {children}
  </Text>
);

// Helper styles for gradients
const styles = StyleSheet.create({
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
});


