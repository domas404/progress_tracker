import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';

export default function SubTask(props) {

    // console.log(props);

    const basicStyle = StyleSheet.create({
        taskContainer: {
            width: '90%',
            // height: 80,
            paddingTop: 15,
            paddingBottom: 15,
            borderRadius: 28,
            flexDirection: 'column',
            marginTop: 10,
            backgroundColor: props.appColors.mono1,
            color: props.appColors.darkAccent,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: props.appColors.mono3,
            elevation: 3
        },
        checkBox: {
            width: 30,
            height: 30,
            marginLeft: '5%',
            marginRight: '5%'
        },
        checkBoxShape: {
            width: '100%',
            borderWidth: 1,
            borderColor: props.appColors.darkAccent,
            height: '100%',
            borderRadius: 15,
        },
        subTaskText: {
            fontSize: 20,
            color: props.appColors.darkAccent,
            fontWeight: 500,
            width: '75%',
        },
        checked: {
            backgroundColor: props.appColors.lightAccent,
            justifyContent: 'center',
            alignItems: 'center',
        },
        tick: {
            height: 18,
            width: 18,
            // borderWidth: 1,
            // borderColor: colors.accentDark,
        }
    });

    const [complete, setComplete] = useState(props.complete);

    const onSubtaskPress = () => {
        setComplete((prevComplete) => !prevComplete);
        props.onCheckSubTask(props.id);
        // console.log("Current task state:", complete);
    }

    const onLongSubtaskPress = () => {
        Alert.alert("U ok?");
    }

    useEffect(() => {
        // console.log("Changed task state.");
    }, [complete]);

    return (
        <TouchableOpacity
            style={basicStyle.taskContainer}
            activeOpacity={0.7}
            onPress={onSubtaskPress}
            onLongPress={onLongSubtaskPress}
        >
            <View style={basicStyle.checkBox}>
                {
                    complete ?
                        <View style={[basicStyle.checkBoxShape, basicStyle.checked]}>
                            <Image style={basicStyle.tick} source={require("../../assets/tick_green.png")} />
                        </View>
                    :
                        <View style={basicStyle.checkBoxShape}></View>
                }
            </View>
            <Text style={basicStyle.subTaskText}>{props.title}</Text>
        </TouchableOpacity>
    )
}