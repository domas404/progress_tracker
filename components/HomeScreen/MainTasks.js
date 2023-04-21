import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, Alert } from 'react-native';
import Task from "./Task"
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MainTasks(props) {
    // Determines how to sort tasks
    const sortingOrder = 'Date';

    return (
        <View style={styles.mainTasksContainer}>
            <View style={styles.sortByContainer}>
                <Text style={styles.all}>All</Text>
                <Text style={styles.sortBy}>Sort By: {sortingOrder}</Text>
            </View>
            {props.mappedTasks}
        </View>
    )
}

const styles = StyleSheet.create({
    mainTasksContainer: {
        width: '100%',
        backgroundColor: '#eee',
        alignItems: 'center',
        flexGrow: 1,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingBottom: 20,
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