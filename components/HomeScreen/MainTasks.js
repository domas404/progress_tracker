import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

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
            // height: 25,
            width: '80%',
            alignItems: 'center',
            marginTop: 10,
            justifyContent: "space-between",
            flexDirection: 'row',
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
        },
        sortButton: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 10,
            paddingRight: 10,
            borderRadius: 10,
        },
        sortIcon: {
            height: 20,
            width: 20,
            marginRight: 5,
        }
    })

    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        setTasks(props.mappedTasks);
    }, [props.mappedTasks]);

    const myRef = useRef();
    const [position, setPosition] = useState({ px: 0, py: 0 });

    const getPosition = async () => {
        myRef.current.measure((fx, fy, width, height, px, py) => {
            const location = {
                px: Math.round(px),
                py: Math.round(py),
            };
            setPosition(location);
        })
    };

    useEffect(() => {
        setTimeout(() => {
            getPosition();
        }, 100);
    }, []);

    useEffect(() => {
        props.openSortMenu(position);
    }, [position]);

    // console.log("Tasks", props.mappedTasks);

    return (
        <View style={styles.mainTasksContainer}>
            <View style={styles.sortByContainer}>
                <Text style={styles.all}>All</Text>
                <TouchableOpacity 
                    style={styles.sortButton}
                    onPress={async () => {
                        getPosition();
                    }}
                    ref={myRef}
                >
                    <Image style={styles.sortIcon} source={require("../../assets/sort_descending_green.png")} resizeMode='contain' />
                    <Text style={styles.sortBy}>{sortingOrder}</Text>
                </TouchableOpacity>
            </View>
            {/* {props.mappedTasks} */}
            {props.mappedTasks.length != 0 ? tasks : <View style={styles.noTasksContainer}><Text style={styles.noTasksText}>Nothing to display &#128542;</Text></View>}
        </View>
    )
}

