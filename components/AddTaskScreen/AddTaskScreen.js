import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, ScrollView, ToastAndroid, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LabelSection from './LabelSection';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

export default function AddTaskScreen(props) {

    // console.log(props.route.params);

    // console.log(props);

    const appColors = props.route.params.appColors;

    const styles = StyleSheet.create({
        headerContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: appColors.header_background,
            marginBottom: 10,
            maxHeight: 150,
        },
        scrollContainer: {
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            backgroundColor: appColors.body_background,
            flex: 1,
        },
        scroll: {
            justifyContent: 'center',
            paddingBottom: 20,
        },
        header: {
            fontSize: 24,
            color: props.route.params.appColors.body_text,
            marginTop: 10,
            width: '100%',
        },
        formContainer: {
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            backgroundColor: appColors.body_background,
            flex: 4,
            paddingTop: 10,
        },
        input: {
            marginLeft: '5%',
            width: '90%',
            backgroundColor: 'white',
            padding: 10,
            borderRadius: 25,
            paddingLeft: 15,
            fontSize: 16,
        },
        descriptionInput: {
            minHeight: 70,
            maxHeight: 150,
            textAlignVertical: 'top',
            fontSize: 16,
        },
        container: {
            flex: 1,
            backgroundColor: appColors.header_background,
        },
        addButton: {
            paddingLeft: 40,
            paddingRight: 40,
            height: 60,
            backgroundColor: appColors.button_background,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 30,
        },
        buttonText: {
            color: 'white',
            fontSize: 18,
            fontWeight: 700,
        },
        inputLabel: {
            fontWeight: 700,
            color: appColors.body_labelText,
            fontSize: 16,
        },
        dateContainer: {
            backgroundColor: appColors.body_emptyBar,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            marginLeft: '2.5%',
            paddingLeft: 20,
            paddingRight: 20
        },
        date: {
            fontSize: 16,
            fontWeight: 700,
            color: appColors.body_text
        },
        datetimeContainer: {
            flexDirection: 'row',
            width: '90%',
            marginLeft: '5%',
        },
        buttonContainer: {
            width: '100%',
            alignItems: 'flex-end',
            padding: '5%',
        },
        labelImage: {
            tintColor: appColors.icon_dark,
            width: 20,
            height: 20,
            marginLeft: '5%',
            marginRight: 5,
        },
        labelLabelContainer: {
            flexDirection: 'row',
            marginLeft: '5%',
            width: '90%',
            alignItems: 'center',
            marginTop: 20,
            marginBottom: 10,
        },
        titleInput: {
            padding: '2.5%',
            textAlign: 'center',
        },
        addTask: {
            height: 30,
            width: 30,
        },
        topNavContainer: {
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: appColors.header_background,
            marginTop: '5%',
        },
        topNav: {
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            paddingLeft: '5%',
            paddingRight: '5%',
        },
        icon: {
            width: 24,
            height: 24,
            tintColor: appColors.icon
        },
        iconContainer: {
            padding: 8,
        },
        add_edit: {
            color: appColors.header_labelText,
            fontWeight: 700,
            fontSize: 18,
        },
        taskTitleContainer: {
            width: '90%',
            marginLeft: '5%',
            paddingTop: 10,
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: appColors.header_outline,
            maxHeight: 200,
        }
    });

    // sets to true when new task info is saved to storage
    const [newTaskAdded, setNewTaskAdded] = useState(false);

    // stores new task
    const storeNewTask = async (value) => {
        key = JSON.parse(await AsyncStorage.getItem('taskCount'));
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(JSON.stringify(key+1), jsonValue)
        await AsyncStorage.setItem('taskCount', JSON.stringify(key+1));
        setNewTaskAdded(true);
    }

    // updates existing task
    const updateExistingTask = async (value) => {
        console.log("value", value);
        key = props.route.params.taskId; // task that's being edited
        const jsonValue = JSON.stringify(value); // updated values
        await AsyncStorage.mergeItem(key, jsonValue); // write to storage
        setNewTaskAdded(true);
    }

    useEffect(() => {
        if(newTaskAdded)
            props.navigation.navigate('home', { addedTask: true });
    }, [newTaskAdded])

    // updates label list in storage
    const storeLabels = async (newLabels) => {
        let storedLabels = JSON.parse(await AsyncStorage.getItem('labels'));
        let labelsToStore = [...storedLabels];
        for(let label of newLabels){
            if(storedLabels.find((e) => e.id == label.id)){
                continue;
            } else {
                labelsToStore.push(label);
            }
        }
        await AsyncStorage.setItem('labels', JSON.stringify(labelsToStore));
    }

    const [title, setTitle] = React.useState(''); // title value
    const [description, setDescription] = React.useState(''); // description value
    const [labels, setLabels] = React.useState([]); // labels value

    // if existing task is being edited, assign current values
    useEffect(() => {
        // console.log("Labels:", props.route.params.taskInfo.labels);
        if(props.route.params.editTask){
            setTitle(props.route.params.taskInfo.title);
            setDescription(props.route.params.taskInfo.description);
            setLabels(props.route.params.taskInfo.labels);
        }
    }, []);

    // set new labels
    const updateLabels = (newLabels) => {
        setLabels(newLabels);
    }

    // date and time
    const date_time = new Date().getTime();
    const [date, setDate] = useState(new Date(date_time));

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setDate(currentDate);
    };
    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
          value: date,
          onChange,
          mode: currentMode,
          is24Hour: true,
        });
    };
    const showTimepicker = () => {
        showMode('time');
    };
    const showDatepicker = () => {
        showMode('date');
    };

    // 
    const handleTaskAdded = () => {

        if(props.route.params.editTask) {
            updateExistingTask({
                "title": title,
                "description": description,
                "labels": labels,
                "dueDate": date,
            });
            ToastAndroid.show("Task updated", ToastAndroid.SHORT);
        } else {
            storeNewTask({
                "title": title,
                "description": description,
                "pinned": false,
                "subTaskCount": 0,
                "completeTaskCount": 0,
                "archived": false,
                "taskList": [],
                "taskLog": 0, // how many tasks were added in total (including deleted)
                "weightSum": 0,
                "completeWeightSum": 0,
                "labels": labels,
                "dueDate": date,
                "dateCreated": new Date(new Date().getTime()),
            });
            ToastAndroid.show("Task added", ToastAndroid.SHORT);
        }
        storeLabels(labels);
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topNavContainer}>
                <View style={styles.topNav}>
                    <TouchableOpacity
                        onPress={() => {
                            props.navigation.navigate('home', { addedTask: true });
                            ToastAndroid.show("Task discarded", ToastAndroid.SHORT);
                        }}
                        style={styles.iconContainer}
                    >
                        <Image style={styles.icon} source={require("../../assets/cancel_light_green.png")} resizeMode='contain' />
                    </TouchableOpacity>
                    {
                        props.route.params.editTask ? <Text style={styles.add_edit} >Edit</Text> : <Text style={styles.add_edit} >Create</Text>
                    }
                    <TouchableOpacity
                        onPress={() => handleTaskAdded()}
                        style={styles.iconContainer}
                    >
                        <Image style={styles.icon} source={require("../../assets/tick_light_green.png")} resizeMode='contain' />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.headerContainer}>
                {/* <Text style={styles.header}>Add a new task</Text> */}
                
            </View>
            <View style={styles.scrollContainer}>
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps='handled'>
                <View style={styles.taskTitleContainer}>
                    <TextInput
                        style={[styles.titleInput, styles.header]}
                        onChangeText={newTitle => setTitle(newTitle)}
                        defaultValue={title}
                        placeholder='Add task title...'
                        placeholderTextColor='rgba(0,0,0,0.6)'
                        multiline={true}
                        autoFocus={true}
                    />
                </View>
                <View style={styles.formContainer}>
                    <View style={styles.labelLabelContainer}>
                        <Image style={styles.labelImage} source={require("../../assets/calendar_green.png")} resizeMode='contain' />
                        <Text style={styles.inputLabel}>Due date</Text>
                    </View>
                    <View style={styles.datetimeContainer}>
                        <TouchableOpacity onPress={showDatepicker} style={styles.dateContainer}>
                            <Text style={styles.date}>
                                {
                                    `${date.getFullYear()}-` +
                                    `${date.getMonth() < 9 ? "0"+(date.getMonth()+1) : date.getMonth()+1}-` +
                                    `${date.getDate() < 10 ? "0"+date.getDate() : date.getDate()}`
                                }
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={showTimepicker} style={styles.dateContainer}>
                            <Text style={styles.date}>
                                {
                                    `${date.getHours() < 10 ? "0" + date.getHours() : date.getHours()}:` +
                                    `${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`
                                }
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.labelLabelContainer}>
                        <Image style={styles.labelImage} source={require("../../assets/notes_green.png")} resizeMode='contain' />
                        <Text style={styles.inputLabel}>Description</Text>
                    </View>
                    <TextInput
                        style={[styles.input, styles.descriptionInput]}
                        onChangeText={newDescription => setDescription(newDescription)}
                        defaultValue={description}
                        placeholder='Add a short description...'
                        multiline={true}
                    />
                    <View style={styles.labelLabelContainer}>
                        <Image style={styles.labelImage} source={require("../../assets/label_green.png")} resizeMode='contain' />
                        <Text style={styles.inputLabel}>Labels</Text>
                    </View>
                    <LabelSection
                        updateLabels={updateLabels}
                        appColors={appColors}
                        taskLabels={
                            props.route.params.editTask ?
                                props.route.params.taskInfo.labels
                            : 0
                        }
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => {
                                handleTaskAdded();
                            }}
                        >
                            <Text style={styles.buttonText}>ADD</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            </View>
        </SafeAreaView>
    )
}