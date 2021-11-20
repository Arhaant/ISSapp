import React, { Component } from 'react';
import { Text, View, SafeAreaView, ImageBackground, Image, Platform, StyleSheet, StatusBar, Alert, Dimensions } from 'react-native';
import axios from 'axios';
import { FlatList } from 'react-native-gesture-handler';

export default class Meteors extends Component {
constructor(props){
    super();
    this.state = {
        meteors: {}
    }
  
}

componentDidMount(){
    // setInterval(this.getISSLocation,2000);
    this.getMeteors();    
}

getMeteors = () =>{
    axios   
        .get("https://api.nasa.gov/neo/rest/v1/feed?api_key=nAkq24DJ2dHxzqXyzfdreTvczCVOnwJuFLFq4bDZ")
        .then(response => {
            this.setState(
                {
                    meteors:response.data.near_earth_objects
                }
            )
        })
        .catch(error => {    
             Alert.alert(error.message)
        })
}

renderItem = ({item}) =>{
    let meteor = item;
    let bg_image, meteor_image, size

    if(meteor.threat_score<=30){
        bg_image = require('../assets/meteor_bg1.png')
        meteor_image = require('../assets/meteor_speed1.gif')
        size = 100
    }
    else if(meteor.threat_score<=75){
        bg_image = require('../assets/meteor_bg2.png')
        meteor_image = require('../assets/meteor_speed2.gif')
        size = 150
    }
    else{
        bg_image = require('../assets/meteor_bg3.png')
        meteor_image = require('../assets/meteor_speed3.gif')
        size = 200
    }

    return(
      <View>
          <ImageBackground source = {bg_image} style = {styles.bAcKgRoUnDiMaGe}>
            <View style = {styles.gifContainer}>
                <Image source = {meteor_image} style = {{width:size, height:size, alignSelf:'center'}}></Image>
                <View>
                    <Text style = {[styles.cardTitle,{marginTop:250}]} >{item.name}</Text>
                    <Text style = {[styles.cardText,{marginTop:20}]}>CLosest to Earth : {item.close_approach_data[0].close_approach_date_full}</Text>
                    <Text style = {[styles.cardText,{marginTop:5}]}>Minimum diameter : {item.estimated_diameter.kilometers.estimated_diameter_min}</Text>
                    <Text style = {[styles.cardText,{marginTop:5}]}>Maximum diameter : {item.estimated_diameter.kilometers.estimated_diameter_max}</Text>
                    <Text style = {[styles.cardText,{marginTop:5}]}>Velocity (km/h)  : {item.close_approach_data[0].relative_velocity.kilometers_per_hour}</Text>
                    <Text style = {[styles.cardText,{marginTop:5}]}>Missing Earth by(k): {item.close_approach_data[0].miss_distance.kilometers}</Text>
                </View>
            </View>
          </ImageBackground>
      </View>  
    )
}

render() {
    if(Object.keys(this.state.meteors).length === 0){
        return(
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Text>Loading...</Text>
            </View>
        )
    }
    else{

        let meteor_arr = Object.keys(this.state.meteors).map(meteor_date => {
            return this.state.meteors[meteor_date]
        })
        
        let meteors = [].concat.apply([], meteor_arr); //flattens the array of arrays into a single dimensional array   
 
        meteors.forEach(function (element) {
            let diameter = (element.estimated_diameter.kilometers.estimated_diameter_min + element.estimated_diameter.kilometers.estimated_diameter_max) / 2
            let threatScore = (diameter / element.close_approach_data[0].miss_distance.kilometers) * 1000000000
            element.threat_score = threatScore;
        });
        meteors.sort(function(a,b){
            return b.threat_score - a.threat_score

        })
        meteors = meteors.slice(0,5)
        return(
            <View style = {styles.container}>
                <SafeAreaView style = {styles.droidSafeArea}/>
                <FlatList 
                keyExtractor = {(item,index)=>index.toString()}
                data={meteors}
                renderItem = {this.renderItem}
                horizontal = {true}
                />
            </View>
        ) 
    }

}

}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    droidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    bAcKgRoUnDiMaGe: {
        flex: 1,
        resizeMode: 'cover',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    gifContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    cardTitle:{
        fontSize: 20,
        fontWeight: 'bold',
        color:'white',
        marginBottom: 10
    },
    cardText:{
        color: 'white'
    }
})

