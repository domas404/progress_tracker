import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

export default function MainHead(props) {

    const styles = StyleSheet.create({
        header: {
            width: '100%',
            alignItems: 'center',
            height: 'auto',
            // paddingTop: '10%',
            marginBottom: '5%'
        },
        mainTextContainer: {
            width: '90%',
            margin: '5%'
        },
        pinnedTextContainer: {
            width: "90%",
            flexDirection: 'row',
        },
        mainText: {
            color: 'white',
            fontSize: 32,
            fontWeight: 700,
            textAlign: 'center'
        },
        pinnedLabelText: {
            color: props.appColors.header_labelText,
            fontWeight: 700,
            fontSize: 16,
            marginLeft: 20,
        },
        dateContainer: {
            width: '90%',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            position: 'absolute',
            top: 20,
        },
        goBack: {
            width: 24,
            height: 24,
            
        },
        goBackContainer: {
            padding: 8,
        },
    });

    return (
        <View style={styles.header}>
            {/* <View style={styles.dateContainer}>
                <TouchableOpacity
                    // onPress={() => props.navigation.navigate('home')}
                    style={styles.goBackContainer}
                >
                    <Image style={styles.goBack} source={require("../../assets/menu_light_green.png")} resizeMode='contain' />
                </TouchableOpacity>
            </View> */}
            <View style={styles.mainTextContainer}>
                <Text style={styles.mainText}>My tasks</Text>
            </View>
            <View style={styles.pinnedTextContainer}>
                <Text style={styles.pinnedLabelText}>Pinned</Text>
            </View>
            {props.mappedTasks}
        </View>
    )
}
