import React from "react";
import { StyleSheet, Text, View, Image, SafeAreaView, Dimensions } from 'react-native';
import SubTask from "./SubTask"

export default function MainTasks(props) {

    const sortingOrder = 'Date';

    const styles = StyleSheet.create({
        mainTasksContainer: {
            width: '100%',
            backgroundColor: '#eee',
            alignItems: 'center',
            // justifyContent: 'center',
            flex: 2,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
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
            color: '#13573F',
            fontSize: 16
        },
        sortBy: {
            fontWeight: 700,
            color: '#13573F',
            fontSize: 16
        }
    })

    return (
        <View style={styles.mainTasksContainer}>
            <View style={styles.sortByContainer}>
                <Text style={styles.all}>All</Text>
                <Text style={styles.sortBy}>Sort By: {sortingOrder}</Text>
            </View>
            <SubTask title="Sukurti setting lango dizainą" percent={80} pinned={false} ></SubTask>
            <SubTask title="Sumodeliuot duomenų bazę" percent={80} pinned={false} ></SubTask>
            <SubTask title="Pakeist task menu" percent={80} pinned={false} ></SubTask>
            <SubTask title="Pridėt progress bar" percent={80} pinned={false} ></SubTask>
            <SubTask title="Subtask placeholder" percent={80} pinned={false} ></SubTask>
            <SubTask title="Subtask placeholder" percent={80} pinned={false} ></SubTask>
            <SubTask title="Subtask placeholder" percent={80} pinned={false} ></SubTask>
        </View>
    )
}