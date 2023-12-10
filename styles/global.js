import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6cd9f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartContainer: {
    flex: 1,
    backgroundColor: '#6cd9f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: -60,
  },
  textInput: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: 'white'
  },
  titleText: {
    fontFamily: 'TiltPrism-Regular',
    fontSize: 80,
    margin: 25,
    marginBottom: 50,
    padding: 40
  },
  subtitleText:{
    margin: 10
  },
  alarmButton: {
    padding: 10,
    paddingRight: 30,
    paddingLeft:30,
    marginTop: 25,
    marginRight: 80,
    backgroundColor:'black',
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'black'
  },
  // alarmText:{
  //   color:'black',
  //   textAlign:'center',
  //   paddingLeft : 10,
  //   paddingRight : 10,
  //   fontSize: 25,
  //   fontWeight: 'bold'
  // },
  panicButton: {
    paddingTop:10,
    paddingBottom:10,
    paddingRight: 25,
    paddingLeft: 25,
    marginBottom: 30,
    backgroundColor: '#ed0505',
    borderRadius:10,
    borderWidth: 3,
    borderColor: '#ed0505',
    borderRadius: 50,
  },
  panicText:{
    color:'white',
    textAlign:'center',
    paddingLeft : 20,
    paddingRight : 20,
    fontSize: 25,
    fontWeight: 'bold',
  },
  connectScreenButton:{
    marginRight:40,
    marginLeft:40,
    marginTop:10,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:'#1E6738',
    borderRadius: 80,
    borderWidth: 1,
    borderColor: '#1E6738'
  },
  loginText:{
      color:'#fff',
      textAlign:'center',
      paddingTop: 20,
      padding: 10,
      paddingLeft : 10,
      paddingRight : 10,
      fontSize: 25,
      fontWeight: 'bold',
      color: 'white'
  },
  // disconnectText:{
  //   color: 'white',
  //   textAlign:'center',
  //   paddingLeft : 10,
  //   paddingRight : 10,
  //   fontSize: 25,
  //   fontWeight: 'bold'
  // },
  disconnectButton: {
    padding: 10,
    paddingRight: 30,
    paddingLeft: 30,
    marginTop: 25,
    marginLeft: 80,
    backgroundColor:'black',
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'black'
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Adjust this as needed
    marginBottom: 0, // Adjust spacing as needed
  },
  alertText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold'
  }
});