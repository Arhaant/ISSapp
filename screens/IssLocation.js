import React, { Component } from 'react';
import { Text, View, SafeAreaView, ImageBackground, Image, Platform, StyleSheet, StatusBar, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';

export default class IssLocationScreen extends Component {
constructor(props){
    super();
    this.state = {
        location: {}
    }
  
}

componentDidMount(){
    // setInterval(this.getISSLocation,2000);
    this.getISSLocation();
}

getISSLocation = () =>{
    axios   
        .get("https://api.wheretheiss.at/v1/satellites/25544")
        .then(response => {
            this.setState(
                {
                    location:response.data
                }
            )
        })
        .catch(error => {
             Alert.alert(error.message)
        })
}

    render() {
        if(Object.keys(this.state.location).length === 0){
            return(
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text>Loading...</Text>
                </View>
            )
        }
        else{
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.droidSafeArea} />
                <ImageBackground source={require('../assets/bg_image.png')} style={styles.backgroundImage}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>ISS Location</Text>
                    </View>
                    <MapView
                            style={styles.map}
                             region={{
                                latitude: this.state.location.latitude,
                                longitude: this.state.location.longitude,
                                latitudeDelta: 10,
                                longitudeDelta: 10,
                            }}>
                                <Marker coordinate={{latitude:this.state.location.latitude, longitude:this.state.location.longitude}}>
                                    <Image source={require('../assets/iss_icon.png')} style={{height:50,width:50}}/>
                                </Marker>
                    </MapView>
                </ImageBackground>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>Latitude: {this.state.location.latitude}</Text>
                    <Text style={styles.infoText}>Latitude: {this.state.location.longitude}</Text>
                    <Text style={styles.infoText}>Latitude: {this.state.location.altitude}</Text>
                    <Text style={styles.infoText}>Latitude: {this.state.location.velocity}</Text>
                </View>
            </View>
        )      
                        }
}
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    droidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    titleText: {
        textAlign: 'center',
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white'
    },
    titleContainer: {
        flex: 0.1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover'
    },
    map:{
        width:"100%",
        height:'100%'
    },
    infoContainer:{
        flex:0.25,
        backgroundColor:'white',
        padding:30
    },
    infoText:{
        fontSize:20,
        fontWeight:"bold"
    }
})