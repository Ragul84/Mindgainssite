import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

interface MarkdownRendererProps {
  content: string;
  style?: any;
}

export default function MarkdownRenderer({ content, style }: MarkdownRendererProps) {
  const styles = getStyles(theme);
  // Parse markdown-like content and render it properly
  const renderContent = () => {
    // Remove raw markdown symbols and format the text
    let formattedContent = content;
    
    // Remove bold markers and apply styling
    formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, '$1');
    
    // Remove italic markers
    formattedContent = formattedContent.replace(/\*(.*?)\*/g, '$1');
    
    // Remove heading markers
    formattedContent = formattedContent.replace(/^#{1,6}\s+/gm, '');
    
    // Remove bullet points and format as proper list
    formattedContent = formattedContent.replace(/^[-*]\s+/gm, '• ');
    
    // Remove code blocks markers
    formattedContent = formattedContent.replace(/```[\s\S]*?```/g, (match) => {
      return match.replace(/```/g, '');
    });
    
    // Remove inline code markers
    formattedContent = formattedContent.replace(/`(.*?)`/g, '$1');
    
    // Split content into paragraphs
    const paragraphs = formattedContent.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      const words = paragraph.split(' ');
      const secondWord = words.length > 1 ? words[1] : null;
      const isHeading = /^[🎬🎯🌟⚡🧠📝💡⭐🎭🏆✅📊🦹‍♂️💚🎪🎨🔥🎵]/.test(paragraph) && 
                       (secondWord ? paragraph.includes(secondWord.toUpperCase()) : false);
      
      // Check if it's a list item
      const isListItem = paragraph.trim().startsWith('•');
      
      return (
        <Text 
          key={index} 
          style={[
            styles.paragraph,
            isHeading && styles.heading,
            isListItem && styles.listItem,
            style
          ]}
        >
          {paragraph.trim()}
        </Text>
      );
    });
  };

  return <View style={styles.container}>{renderContent()}</View>;
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    gap: theme?.tokens?.spacing?.md || theme?.spacing?.md || 16,
  },
  paragraph: {
    fontSize: 16,
    fontFamily: theme?.fonts?.body,
    color: theme?.tokens?.color?.onBackground || theme?.colors?.text?.primary || '#000000',
    lineHeight: 24,
  },
  heading: {
    fontSize: 18,
    fontFamily: theme?.fonts?.heading,
    color: theme?.tokens?.color?.primary || theme?.colors?.text?.primary || '#000000',
    fontWeight: 'bold',
    marginTop: theme?.tokens?.spacing?.sm || theme?.spacing?.sm || 8,
  },
  listItem: {
    paddingLeft: theme?.tokens?.spacing?.md || theme?.spacing?.md || 16,
  },
});