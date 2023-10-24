import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, TextInput } from 'react-native';

export default function SubTask(props) {

    // console.log(props);

    const basicStyle = StyleSheet.create({
        taskContainer: {
            width: '90%',
            paddingTop: 15,
            paddingBottom: 15,
            borderRadius: 28,
            marginTop: 10,
            backgroundColor: props.appColors.body_taskBackground,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: props.appColors.shadow,
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
            borderColor: props.appColors.body_outline,
            height: '100%',
            borderRadius: 15,
        },
        subTaskText: {
            fontSize: 20,
            color: props.appColors.body_text,
            fontWeight: 500,
            width: '84%',
        },
        checked: {
            backgroundColor: props.appColors.body_completeBar,
            borderWidth: 0,
            justifyContent: 'center',
            alignItems: 'center',
        },
        tick: {
            height: 18,
            width: 18,
            tintColor: props.appColors.icon
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
            backgroundColor: props.appColors.body_background,
            borderRadius: 18,
            paddingLeft: 15,
            paddingRight: 15,
            paddingTop: 2,
            paddingBottom: 2,
        },
        editSubTaskText: {
            fontSize: 20,
            color: props.appColors.body_text,
            fontWeight: '500',
            width: '90%',
        },
        weight: {
            paddingLeft: 10,
            paddingTop: 2,
            paddingBottom: 2,
            borderRadius: 20,
            minWidth: 50,
            alignItems: 'center',
        },
        weightInput: {
            textAlign: 'center',
        },
        textInputContainer: {
            borderBottomWidth: 1,
            borderColor: props.appColors.options_border,
            paddingBottom: 10,
        },
        weightInputText: {
            fontSize: 16,
            fontWeight: 700,
            color: props.appColors.body_text,
        },
        weightLabelText: {
            fontSize: 14,
            fontWeight: 700,
            color: props.appColors.body_text,
            paddingRight: 10,
            borderRightWidth: 1,
            borderColor: props.appColors.otherText,
        },
        doneButton: {
            height: 36,
            justifyContent: 'center',
            paddingLeft: 15,
            paddingRight: 15,
            backgroundColor: props.appColors.button_background,
            borderRadius: 18
        },
        doneButtonText: {
            color: props.appColors.button_text,
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

    const [taskEditing, setTaskEditing] = useState(props.autoFocus);

    const [title, setTitle] = useState(props.title);
    const [weight, setWeight] = useState(props.weight);

    // console.log(props);

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
                        style={[basicStyle.textInputContainer, basicStyle.editSubTaskText]}
                        onChangeText={value => setTitle(value)}
                        defaultValue={props.title}
                        placeholder='Add subtask title...'
                        placeholderTextColor='rgba(0,0,0,0.4)'
                        multiline
                        autoFocus
                    />
                    <View style={basicStyle.editWeightContainer}>
                        <View style={basicStyle.editWeight}>
                            <Text style={basicStyle.weightLabelText}>Weight</Text>
                            <TouchableOpacity style={basicStyle.weight}>
                                <TextInput
                                    style={basicStyle.weightInput}
                                    onChangeText={value => setWeight(value)}
                                    defaultValue={JSON.stringify(props.weight)}
                                    keyboardType='numeric'
                                    maxLength={2}
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={basicStyle.doneButton}
                            onPress={() => {
                                setTaskEditing(prevState => !prevState);
                                props.addNewSubtask(props.complete, props.id, title, parseInt(weight));
                            }}
                        >
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
                                    <Image style={basicStyle.tick} source={require("../../assets/tick.png")} />
                                </View>
                            :
                                <View style={basicStyle.checkBoxShape}></View>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={basicStyle.subTaskTextContainer}
                        onPress={() => {
                            setTaskEditing(prevState => !prevState);
                            props.toggleAddButtonVisibility();
                        }}
                    >
                        <Text style={basicStyle.subTaskText}>{props.title}</Text>
                    </TouchableOpacity>
                </>
            }
        </TouchableOpacity>
    )
}