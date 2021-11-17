import React, { Component } from 'react';
import { Text, View } from 'react-native';
import React, { Component } from 'react';
import { Text, View, SafeAreaView, ImageBackground, Image, Platform, StyleSheet, StatusBar, Alert } from 'react-native';
import axios from 'axios';

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


render() {
    if(Object.keys(this.state.location).length === 0){
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

    }
    
}

}