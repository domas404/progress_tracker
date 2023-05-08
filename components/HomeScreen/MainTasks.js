import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from 'react-native';

export default function MainTasks(props) {
    // Determines how to sort tasks
    const sortingOrder = 'Date';

    const styles = StyleSheet.create({
        mainTasksContainer: {
            width: '100%',
            backgroundColor: props.appColors.mono2,
            alignItems: 'center',
            flexGrow: 1,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            paddingBottom: 120,
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
            color: props.appColors.darkAccent,
            fontSize: 16
        },
        sortBy: {
            fontWeight: 700,
            color: props.appColors.darkAccent,
            fontSize: 16
        },
        noTasksContainer: {
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            height: 100,
        },
        noTasksText: {
            fontSize: 16,
            color: props.appColors.mono4,
        }
    })

    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        setTasks(props.mappedTasks);
    }, [props.mappedTasks]);

    // console.log("Tasks", props.mappedTasks);

    return (
        <View style={styles.mainTasksContainer}>
            <View style={styles.sortByContainer}>
                <Text style={styles.all}>All</Text>
                <Text style={styles.sortBy}>Sort By: {sortingOrder}</Text>
            </View>
            {/* {props.mappedTasks} */}
            {props.mappedTasks.length != 0 ? tasks : <View style={styles.noTasksContainer}><Text style={styles.noTasksText}>Nothing to display &#128542;</Text></View>}
        </View>
    )
}

