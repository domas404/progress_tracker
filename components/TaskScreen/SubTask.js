import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, TextInput } from 'react-native';

export default function SubTask(props) {

    // console.log(props);

    const basicStyle = StyleSheet.create({
        taskContainer: {
            width: '90%',
            // height: 80,
            paddingTop: 15,
            paddingBottom: 15,
            borderRadius: 28,
            // flexDirection: 'column',
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
            width: '84%',
        },
        checked: {
            backgroundColor: props.appColors.darkAccent,
            borderWidth: 0,
            justifyContent: 'center',
            alignItems: 'center',
        },
        tick: {
            height: 18,
            width: 18,
            // borderWidth: 1,
            // borderColor: colors.accentDark,
        },
        subTaskTextContainer: {
            width: '90%',
        },
        subTaskEditContainer: {
            width: '95%',
            paddingLeft: '5%',
        },
        editWeightContainer: {
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        editWeight: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: props.appColors.mono2,
            borderRadius: 18,
            paddingLeft: 15,
            paddingRight: 15,
            paddingTop: 2,
            paddingBottom: 2,
        },
        editSubTaskText: {
            fontSize: 20,
            color: props.appColors.darkAccent,
            fontWeight: 500,
            width: '90%',
        },
        weight: {
            paddingLeft: 10,
            // paddingRight: 10,
            paddingTop: 2,
            paddingBottom: 2,
            borderRadius: 20,
            minWidth: 50,
            // backgroundColor: props.appColors.lightAccent,
            alignItems: 'center',
        },
        weightInput: {
            textAlign: 'center',
        },
        textInputContainer: {
            borderBottomWidth: 1,
            borderColor: props.appColors.mono2,
            paddingBottom: 10,
        },
        weightInputText: {
            fontSize: 16,
            fontWeight: 700,
            color: props.appColors.darkAccent,
        },
        weightLabelText: {
            fontSize: 14,
            fontWeight: 700,
            color: props.appColors.darkAccent,
            paddingRight: 10,
            borderRightWidth: 1,
            borderColor: props.appColors.mono1,
        },
        doneButton: {
            // paddingTop: 8,
            // paddingBottom: 8,
            height: 36,
            justifyContent: 'center',
            paddingLeft: 15,
            paddingRight: 15,
            backgroundColor: props.appColors.darkAccent,
            borderRadius: 18
        },
        doneButtonText: {
            color: props.appColors.mono1,
            fontWeight: 700,
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

    const [taskEditing, setTaskEditing] = useState(false);



    return (
        <TouchableOpacity
            style={basicStyle.taskContainer}
            activeOpacity={0.8}
            onLongPress={onLongSubtaskPress}
        >
            {
                taskEditing ?
                <View style={basicStyle.subTaskEditContainer}>
                    <TextInput
                        style={basicStyle.textInputContainer}
                        multiline
                        autoFocus
                    >
                        <Text style={basicStyle.editSubTaskText}>{props.title}</Text>
                    </TextInput>
                    <View style={basicStyle.editWeightContainer}>
                        <View style={basicStyle.editWeight}>
                            <Text style={basicStyle.weightLabelText}>Weight</Text>
                            <TouchableOpacity style={basicStyle.weight}>
                                <TextInput style={basicStyle.weightInput} keyboardType='numeric' maxLength={2} >
                                    <Text style={basicStyle.weightInputText}>{props.weight}</Text>
                                </TextInput>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={basicStyle.doneButton} onPress={() => setTaskEditing(prevState => !prevState)}>
                            <Text style={basicStyle.doneButtonText}>SAVE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                :
                <>
                    <TouchableOpacity
                        style={basicStyle.checkBox}
                        onPress={onSubtaskPress}
                    >
                        {
                            complete ?
                                <View style={[basicStyle.checkBoxShape, basicStyle.checked]}>
                                    <Image style={basicStyle.tick} source={require("../../assets/tick_light_green.png")} />
                                </View>
                            :
                                <View style={basicStyle.checkBoxShape}></View>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity style={basicStyle.subTaskTextContainer} onPress={() => setTaskEditing(prevState => !prevState)} >
                        <Text style={basicStyle.subTaskText}>{props.title}</Text>
                    </TouchableOpacity>
                </>
            }
        </TouchableOpacity>
    )
}