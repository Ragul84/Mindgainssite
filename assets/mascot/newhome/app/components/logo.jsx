import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Logo() {
  // Automatically detect time of day
  const hours = new Date().getHours();
  const time =
    hours < 12 ? 'morning' :
    hours < 18 ? 'afternoon' : 'evening';

  const name = 'Ragul'; //replace with real user name from db after importing

  return (
    <View style={styles.info}>
      <Text style={[styles.logo, styles.txt]}>MindGains</Text>
      <Text style={[styles.greetings, styles.txt]}>
        Good {time}, {name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  info: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
  },
  logo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  greetings: {
    fontSize: 16,
    marginTop: 5,
    color: '#b9dcf992',
  },
});
