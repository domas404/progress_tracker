import React from "react";
import { StyleSheet, Text, View, Image, SafeAreaView, Dimensions } from 'react-native';
import SubTask from "./SubTask"

export default function MainTasks(props) {

    // console.log(props);

    const styles = StyleSheet.create({
        mainTasksContainer: {
            width: '100%',
            backgroundColor: props.appColors.body_background,
            alignItems: 'center',
            flex: 2,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            paddingBottom: 110,
        },
        sortByContainer: {
            height: 25,
            width: '80%',
            alignItems: 'center',
            marginTop: 15,
            justifyContent: "space-between",
            flexDirection: 'row'
        },
        all: {
            fontWeight: 700,
            color: props.appColors.body_text,
            fontSize: 16
        },
    })

    return (
        <View style={styles.mainTasksContainer}>
            <View style={styles.sortByContainer}>
                <Text style={styles.all}>To do</Text>
            </View>
            {props.taskList}
        </View>
    )
}