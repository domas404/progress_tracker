import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, ScrollView, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LabelSection from './LabelSection';

getAllKeys = async () => {
    let keys = []
    try {
      keys = await AsyncStorage.getAllKeys()
    } catch(e) {
      // read key error
    }
  
    console.log(keys);
}

// getAllKeys();

getMyStringValue = async () => {
    // console.log(await AsyncStorage.getItem('36'));
    
}


clearAll = async () => {
    await AsyncStorage.clear()
    console.log('Cleared.')
}

// clearAll();

export default function AddTaskScreen(props) {

    // console.log(props);
    appColors = props.route.params.appColors;
    // console.log("AddTaskScreen",appColors);

    const styles = StyleSheet.create({
        headerContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: appColors.darkAccent,
            height: '15%',
            marginTop: 20,
            minHeight: 100,
        },
        scrollContainer: {
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            backgroundColor: appColors.mono2,
            flex: 1,
        },
        scroll: {
            justifyContent: 'center',
            paddingBottom: 20,
            // minHeight: '100%',
        },
        header: {
            fontSize: 32,
            color: 'white',
        },
        formContainer: {
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            backgroundColor: appColors.mono2,
            flex: 4,
            paddingTop: 10,
        },
        input: {
            height: 50,
            margin: 12,
            backgroundColor: 'white',
            padding: 10,
            borderRadius: 25,
            paddingLeft: 15,
            fontSize: 16,
        },
        descriptionInput: {
            minHeight: 80,
            textAlignVertical: 'top',
            fontSize: 16,
        },
        container: {
            flex: 1,
            backgroundColor: appColors.darkAccent,
        },
        addButton: {
            width: '35%',
            height: 60,
            backgroundColor: appColors.darkAccent,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 30,
        },
        buttonText: {
            color: 'white',
            fontSize: 20,
            fontWeight: 700,
        },
        inputLabel: {
            fontWeight: 700,
            color: appColors.darkAccent,
            fontSize: 16,
            marginLeft: '5%',
            marginTop: 15,
        },
        dateContainer: {
            backgroundColor: appColors.lightAccent,
            // width: 140,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            marginLeft: '2.5%',
            marginTop: 10,
            paddingLeft: 20,
            paddingRight: 20
        },
        date: {
            fontSize: 16,
            fontWeight: 700,
            color: appColors.darkAccent
        },
        datetimeContainer: {
            flexDirection: 'row',
        },
        buttonContainer: {
            width: '100%',
            alignItems: 'flex-end',
            padding: '2.5%',
        }
      });

    const [selected, setSelected] = useState("");

    const data = [
        { key:'1', value:'Karo studijos' },
        { key:'2', value:'Univeras' },
        { key:'3', value:'Humanoidai' },
    ]

    const storeNewTask = async (value) => {
        key = JSON.parse(await AsyncStorage.getItem('taskCount'));
        // console.log(key);
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem(JSON.stringify(key+1), jsonValue)
            await AsyncStorage.setItem('taskCount', JSON.stringify(key+1));
        } catch (e) {
            // saving error
        }
    }

    const storeLabels = async (newLabels) => {
        // console.log("newLabels", newLabels);
        let storedLabels = JSON.parse(await AsyncStorage.getItem('labels'));
        // console.log("storedLabels", storedLabels);
        // console.log("aaa");
        let labelsToStore = [...storedLabels];
        for(let label of newLabels){
            if(storedLabels.find((e) => e.id == label.id)){
                continue;
            } else {
                labelsToStore.push(label);
            }
        }
        // console.log("labelsToStore", labelsToStore);
        await AsyncStorage.setItem('labels', JSON.stringify(labelsToStore));
    }

    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [labels, setLabels] = React.useState([]);

    const updateLabels = (newLabels) => {
        setLabels(newLabels);
    }

    return (
        <SafeAreaView style={styles.container}>
                <View style={styles.headerContainer}>
                    {/* <Text style={styles.header}>Add a new task</Text> */}
                    <TextInput
                        style={[styles.titleInput, styles.header]}
                        onChangeText={newTitle => setTitle(newTitle)}
                        defaultValue={title}
                        placeholder='Add task title...'
                        placeholderTextColor='rgba(255,255,255,0.7)'
                        multiline={true}
                    />
                </View>
            <View style={styles.scrollContainer}>
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps='handled'>
                <View style={styles.formContainer}>
                    <Text style={styles.inputLabel}>Due date</Text>
                    <View style={styles.datetimeContainer}>
                        <View style={styles.dateContainer}>
                            <Text style={styles.date}>2023-05-31</Text>
                        </View>
                        <View style={styles.dateContainer}>
                            <Text style={styles.date}>23:59</Text>
                        </View>
                    </View>
                    <Text style={styles.inputLabel}>Description</Text>
                    <TextInput
                        style={[styles.input, styles.descriptionInput]}
                        onChangeText={newDescription => setDescription(newDescription)}
                        defaultValue={description}
                        placeholder='Add a short description (optional)'
                        multiline={true}
                    />
                    <Text style={styles.inputLabel}>Labels</Text>
                    <LabelSection
                        updateLabels={updateLabels}
                        appColors={appColors}
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => {
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
                                });
                                storeLabels(labels);
                                props.navigation.navigate('home', { addedTask: true });
                                ToastAndroid.show("Task added", ToastAndroid.SHORT);
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