import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#6cd9f5',
      alignItems: 'center',
      justifyContent: 'center',
    },
    chartContainer: {
      margin: 50,
      flex: 1,
      backgroundColor: '#6cd9f5',
      alignItems: 'center',
      justifyContent: 'center',
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
      marginBottom: 50
    },
    subtitleText:{
      margin: 10
    },
    alarmButton: {
      padding: 10,
      // marginBottom:20,
      // marginRight:40,
      // marginLeft:40,
      // marginTop:10,
      margin:30,
      paddingTop:10,
      paddingBottom:10,
      backgroundColor:'white',
      borderRadius:10,
      borderWidth: 1,
      borderColor: '#000405'
    },
    alarmText:{
      color:'red',
      textAlign:'center',
      paddingLeft : 10,
      paddingRight : 10,
      fontSize: 25
  },
  panicButton: {
    padding:20,
    marginRight:40,
    marginLeft:40,
    marginTop:10,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:'red',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#000405'
  },
  panicText:{
    color:'black',
    textAlign:'center',
    paddingLeft : 10,
    paddingRight : 10,
    fontSize: 25
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
    logOutButton:{
      color: 'black',
      marginRight: 10,
      fontSize: 15
    }
  });