import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, ScrollView, ToastAndroid, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LabelSection from './LabelSection';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

export default function AddTaskScreen(props) {

    const appColors = props.route.params.appColors;

    const styles = StyleSheet.create({
        headerContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: appColors.header_background,
            // height: '15%',
            // marginTop: 10,
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
            // minHeight: '100%',
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
            // height: 50,
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
            // width: '35%',
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
            // marginLeft: 10,
            // marginTop: 15,
        },
        dateContainer: {
            backgroundColor: appColors.body_emptyBar,
            // width: 140,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            marginLeft: '2.5%',
            // marginTop: 10,
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
            width: 20,
            height: 20,
            marginLeft: '5%',
            marginRight: 5
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
            // elevation: 1,
            backgroundColor: appColors.header_background,
            // borderBottomWidth: 1,
            // borderBottomColor: appColors.header_outline,
            marginTop: '5%',
            // backgroundColor: 'yellow',
            // height: 50,
        },
        topNav: {
            width: '100%',
            // height: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            paddingLeft: '5%',
            paddingRight: '5%',
            // backgroundColor: appColors.header_background,
            // position: 'absolute',
            // top: 20,
        },
        goBack: {
            width: 24,
            height: 24,
        },
        goBackContainer: {
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

    const [selected, setSelected] = useState("");

    const [newTaskAdded, setNewTaskAdded] = useState(false);

    const storeNewTask = async (value) => {
        key = JSON.parse(await AsyncStorage.getItem('taskCount'));
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(JSON.stringify(key+1), jsonValue)
        await AsyncStorage.setItem('taskCount', JSON.stringify(key+1));
        setNewTaskAdded(true);
    }

    useEffect(() => {
        if(newTaskAdded)
            props.navigation.navigate('home', { addedTask: true });
    }, [newTaskAdded])

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

    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [labels, setLabels] = React.useState([]);

    const updateLabels = (newLabels) => {
        setLabels(newLabels);
    }

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

    // console.log(date);

    const handleTaskAdded = () => {
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
        storeLabels(labels);
        ToastAndroid.show("Task added", ToastAndroid.SHORT);
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
                        style={styles.goBackContainer}
                    >
                        <Image style={styles.goBack} source={require("../../assets/cancel_light_green.png")} resizeMode='contain' />
                    </TouchableOpacity>
                    <Text style={styles.add_edit}>Create</Text>
                    <TouchableOpacity
                        onPress={() => handleTaskAdded()}
                        style={styles.goBackContainer}
                    >
                        <Image style={styles.goBack} source={require("../../assets/tick_light_green.png")} resizeMode='contain' />
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