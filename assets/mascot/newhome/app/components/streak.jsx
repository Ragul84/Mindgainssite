import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Streak() {
  const streakCount = 10;
  const diamonds = 5;

  return (
    <View style={styles.details}>
      <View style={styles.item}>
        <Ionicons style={[styles.icons, styles.streakIcon]} name="flame" />
        <Text style={styles.text}>{streakCount} </Text>
      </View>

      <View style={styles.item}>
        <Ionicons style={[styles.icons, styles.diamondIcon]} name="diamond" />
        <Text style={styles.text}>{diamonds}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  details: {
    flexDirection: 'row',
    padding: 17,
    borderRadius: 20,
    marginVertical: 6,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'space-around', // evenly space streak and diamond
  },
  item: {
    flexDirection: 'row', // <-- icon + text inline
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 5,
  },
  icons: {
    fontSize: 25,
  },
  streakIcon: {
    color: '#0eb1f1',
  },
  diamondIcon: {
    color: '#0eb1f1',
  },
});
