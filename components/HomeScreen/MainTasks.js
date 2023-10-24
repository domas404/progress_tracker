import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

export default function MainTasks(props) {
    // Determines how to sort tasks
    let sortingOrder;
    switch (props.sortingOrder){
        case 'date':
            sortingOrder = 'Date created'
            break;
        case 'title':
            sortingOrder = 'Title'
            break;
        case 'progress':
            sortingOrder = 'Progress'
            break;
        case 'deadline':
            sortingOrder = 'Due date'
            break;
    }

    const styles = StyleSheet.create({
        mainTasksContainer: {
            width: '100%',
            backgroundColor: props.appColors.body_background,
            alignItems: 'center',
            flexGrow: 1,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            paddingBottom: 120,
        },
        sortByContainer: {
            // height: 25,
            width: '90%',
            alignItems: 'center',
            marginTop: 15,
            justifyContent: "space-between",
            flexDirection: 'row',
            
        },
        all: {
            fontWeight: 700,
            color: props.appColors.body_labelText,
            fontSize: 16,
            marginLeft: 20,
        },
        sortBy: {
            fontWeight: 700,
            color: props.appColors.body_labelText,
            fontSize: 16,
            // paddingTop: 5,
            // paddingBottom: 5,
            paddingRight: 10,
            borderRightWidth: 1,
            borderRightColor: props.appColors.border,
            
        },
        noTasksContainer: {
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            height: 100,
        },
        noTasksText: {
            fontSize: 16,
            color: props.appColors.otherText,
        },
        sortButton: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 18,
            // backgroundColor: props.appColors.mono1,
            height: 36,
        },
        sortIcon: {
            height: 24,
            width: 24,
            marginRight: 5,
            tintColor: props.appColors.icon_dark,

        },
        sortOrderContainer: {
            // backgroundColor: 'orange',
            height: 36,
            borderTopRightRadius: 18,
            borderBottomRightRadius: 18,
            justifyContent: 'center',
            // paddingLeft: 10,
            paddingRight: 10,
        },
        sortingTextContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: 'green',
            borderTopLeftRadius: 18,
            borderBottomLeftRadius: 18,
            height: 36,
            paddingLeft: 15,
            paddingRight: 10,
        },
        sortIconContainer: {
            flexDirection: "row",
            justifyContent: 'flex-end',
            marginLeft: 5,
            height: 24,
            width: 24,
        },
        sortIconAsc: {
            height: 24,
            width: 24,
            left: 12,
        },
        sortIconDesc: {
            height: 24,
            width: 24,
        },
        sortIconDarkColor: {
            tintColor: props.appColors.icon_dark
        },
        sortIconLightColor: {
            tintColor: props.appColors.icon
        }
    })

    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        setTasks(props.mappedTasks);
    }, [props.mappedTasks]);

    const myRef = useRef();
    const [position, setPosition] = useState({ px: -1, py: -1 });

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
        if(position.px != -1)
            props.openSortMenu(position);
    }, [position]);

    // console.log("Tasks", props.mappedTasks);

    const [sortAsc, setSortAsc] = useState(false);

    return (
        <View style={styles.mainTasksContainer}>
            <View style={styles.sortByContainer}>
                <Text style={styles.all}>Other</Text>
                <View 
                    style={styles.sortButton}
                    ref={myRef}
                >
                    <TouchableOpacity
                        style={styles.sortingTextContainer}
                        onPress={() => getPosition()}
                    >
                        <Text style={styles.sortBy}>{sortingOrder}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.sortOrderContainer}
                        onPress={() => {
                            setSortAsc(prevState => !prevState);
                            props.changeSortingOrder();
                        }}
                    >
                        {
                            sortAsc ?   <View style={styles.sortIconContainer}>
                                            <Image
                                                style={[styles.sortIconAsc, styles.sortIconDarkColor]}
                                                source={require("../../assets/sort_asc.png")}
                                                resizeMode='contain'
                                            />
                                            <Image
                                                style={[styles.sortIconDesc, styles.sortIconLightColor]}
                                                source={require("../../assets/sort_desc.png")}
                                                resizeMode='contain'
                                            />
                                        </View>
                            :           <View style={styles.sortIconContainer}>
                                            <Image
                                                style={[styles.sortIconAsc, styles.sortIconLightColor]}
                                                source={require("../../assets/sort_asc.png")}
                                                resizeMode='contain'
                                            />
                                            <Image
                                                style={[styles.sortIconDesc, styles.sortIconDarkColor]}
                                                source={require("../../assets/sort_desc.png")}
                                                resizeMode='contain'
                                            />
                                        </View>

                        }
                    </TouchableOpacity>
                    
                </View>
            </View>
            {/* {props.mappedTasks} */}
            {props.mappedTasks.length != 0 ? tasks : <View style={styles.noTasksContainer}><Text style={styles.noTasksText}>Nothing to display &#128542;</Text></View>}
        </View>
    )
}

