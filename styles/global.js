import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#6cd9f5',
      alignItems: 'center',
      justifyContent: 'center',
    },
    chartContainer: {
      // margin: 50,
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
      fontSize: 60,
      margin: 20,
      marginBottom: 60,
      padding: 30
    },
    subtitleText:{
      margin: 10
    },
    alarmButton: {
      padding: 10,
      margin:30,
      paddingTop:10,
      paddingBottom:10,
      backgroundColor:'white',
      borderRadius:10,
      borderWidth: 1,
      borderColor: 'white'
    },
    alarmText:{
      color:'black',
      textAlign:'center',
      paddingLeft : 10,
      paddingRight : 10,
      fontSize: 25,
      fontWeight: 'bold'
  },
  panicButton: {
    padding: 10,
    margin:30,
    paddingTop:10,
    paddingBottom:10,
    paddingRight: 25,
    paddingLeft: 25,
    backgroundColor:'red',
    borderRadius:10,
    borderWidth: 1,
    borderColor: 'red',
  },
  panicText:{
    color:'white',
    textAlign:'center',
    paddingLeft : 29,
    paddingRight : 29,
    fontSize: 25,
    fontWeight: 'bold'
},
    connectScreenButton:{
      marginRight:40,
      marginLeft:40,
      marginTop:10,
      paddingTop:10,
      paddingBottom:10,
      backgroundColor:'#1E6738',
      borderRadius:10,
      borderWidth: 1,
      borderColor: '#000405'
    },
    loginText:{
        color:'#fff',
        textAlign:'center',
        paddingLeft : 10,
        paddingRight : 10,
        fontSize: 25
    },
    disconnectText:{
      color: 'white',
      textAlign:'center',
      paddingLeft : 10,
      paddingRight : 10,
      fontSize: 25,
      fontWeight: 'bold'
    },
    disconnectButton: {
      padding: 10,
      marginTop: 0,
      marginBottom: 30,
      paddingTop:10,
      paddingBottom:10,
      paddingRight: 25,
      paddingLeft: 25,
      backgroundColor:'black',
      borderRadius:10,
      borderWidth: 1,
      borderColor: 'black',
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