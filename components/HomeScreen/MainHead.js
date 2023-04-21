import React from "react";
import { StyleSheet, Text, View, Image, SafeAreaView, Dimensions } from 'react-native';
import Task from "./Task"

export default function MainHead() {

    const styles = StyleSheet.create({
        header: {
            width: '100%',
            alignItems: 'center',
            // flex: 1,
            height: 'auto',
            paddingTop: '15%',
            marginBottom: '5%'
        },
        mainTextContainer: {
            width: '90%',
            margin: '5%'
        },
        pinnedTextContainer: {
            width: "80%",
        },
        mainText: {
            color: 'white',
            fontSize: 32,
            fontWeight: 700,
            textAlign: 'center'
        },
        pinnedLabelText: {
            color: '#AED3C5',
            fontWeight: 700,
            fontSize: 16
        }
    })

    return (
        <View style={styles.header}>
            <View style={styles.mainTextContainer}>
                <Text style={styles.mainText}>My tasks</Text>
            </View>
            <View style={styles.pinnedTextContainer}>
                <Text style={styles.pinnedLabelText}>Pinned</Text>
            </View>
            <Task title="Unit testai" percent={65}  pinned={true} />
            {/* <Task title="Selenium užd. #1" percent={95}  pinned={true} /> */}
        </View>
    )
}