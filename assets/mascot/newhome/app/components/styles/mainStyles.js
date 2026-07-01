import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  navbar: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  notificationWrapper: {
    padding: 20,
    borderRadius: 60,
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 100,
  },
  lessonContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  neonWrapper: {
  },
  neonButton: {
    padding: 10,
    borderRadius: 50,
    width: '90%',
    height: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'red'
  },
  lessonText: {
    color: 'white',
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },
  left: {
    alignSelf: 'flex-start',
    marginLeft: 50,
  },
  right: {
    alignSelf: 'flex-end',
    marginRight: 50,
  },
  topicIcon: {
    flexDirection: 'row',
    width: 90,
    height: 90,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ⚡ Neon Divider on Top of Each Day
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    marginTop: 60,
    marginBottom: 80,
    alignSelf: 'center',
  },
  line: {
    flex: 1,
    height: 2,
    borderRadius: 2,
    marginHorizontal: 10,
  },
  day: {
    padding: 10,
    borderRadius: 20,
    width: 'auto',
    textShadowColor: '#030844ad',
    textShadowOffset: { width: 5, height: 10 },
    textShadowRadius: 8,
  },
  dayText: {
    color: '#fff',
    fontSize: 15,
    letterSpacing: 1,
    fontWeight: '700',
    alignSelf: 'center',
  },
  lottieAnimation: {
    position: 'absolute',
    top: -70,
    left: 200,
    zIndex: 1,
    width: 200,
    height: 200, 
  },
  lottieWrapper: {
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 30,
  marginBottom: -20,
  },

  lottieLeft: {
    alignItems: 'flex-start',
    paddingLeft: 40,
  },

  lottieRight: {
    alignItems: 'flex-end',
    paddingRight: 40,
  },
  arcGroup: {
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: 50,
},
lessonContainer: {
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
},
chestAnimation: {
  alignContent: 'center',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: -70,
  marginBottom: -70,
  padding: 0,
}

});
