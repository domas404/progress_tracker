import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


// getMyStringValue = async () => {
//     // console.log(await AsyncStorage.getItem('36'));
    
// }


clearAll = async () => {
    await AsyncStorage.clear()
    console.log('Cleared.')
}

// clearAll();

export default function AddSubTaskScreen(props) {

    let appColors = props.route.params.appColors;
    // console.log(appColors);

    const styles = StyleSheet.create({
        headerContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: appColors.darkAccent,
            flex: 1,
            marginTop: 20,
        },
        header: {
            fontSize: 32,
            color: appColors.mono1,
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
            backgroundColor: appColors.mono1,
            padding: 10,
            borderRadius: 25,
            paddingLeft: 15,
            fontSize: 16,
        },
        descriptionInput: {
            height: 100,
            textAlignVertical: 'top',
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
            color: appColors.mono1,
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
        buttonContainer: {
            width: '100%',
            alignItems: 'flex-end',
            padding: '2.5%',
        }
      });

    const navigation = props.navigation;

    const getValuesByKey = async (key) => {
        values = await AsyncStorage.getItem(key);
        return JSON.parse(values);
    }

    // console.log(props.id);

    const [task, setTask] = useState({});

    promisedSetTasks = (newTask) => new Promise(resolve => {
        setTask((prevTask) => {
            return {...prevTask, newTask};
        });
        resolve(newTask);
    })

    const storeNewSubTask = async (value) => {
        
        key = props.route.params.id;
        // console.log("Key", key);
        try {
            let taskObject = await getValuesByKey(key);
            // console.log(taskObject);
            let taskCount = taskObject.subTaskCount + 1;   // increment task count
            let taskID = taskObject.taskLog + 1;           // determine new subtask's ID
            let allSubtasks = taskObject.taskList;         // take all task's existing subtasks
            // console.log("Before:", taskObject);
            value = {...value, id: taskID}                 // set new subtask's ID
            allSubtasks = [...allSubtasks, value];         // add new subtask to subtask array

            // replace subtask array with a new one
            taskObject = {
                ...taskObject,
                taskList: allSubtasks,
                subTaskCount: taskCount,
                taskLog: taskID,
                weightSum: taskObject.weightSum + value.weight,
            };
            // console.log("After:", taskObject);
            await promisedSetTasks(taskObject);
            // console.log("aaaa");
            const jsonValue = JSON.stringify(taskObject);
            // console.log(jsonValue);
            await AsyncStorage.mergeItem(key, jsonValue);
            return(await promisedSetTasks(taskObject));
            // console.log("Done.");
            // return(taskObject);
            // await AsyncStorage.setItem('taskCount', JSON.stringify(key+1));
        } catch (e) {
            // saving error
        }
        // getMyStringValue();
    }


    const [title, setTitle] = React.useState('');
    const [weight, setWeight] = React.useState('');

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                {/* <Text style={styles.header}>Add a new task</Text> */}
                <TextInput
                    style={[styles.titleInput, styles.header]}
                    onChangeText={newTitle => setTitle(newTitle)}
                    defaultValue={title}
                    placeholder='Add subtask title...'
                    placeholderTextColor='rgba(255,255,255,0.7)'
                    multiline={true}
                    autoFocus={true}
                />
            </View>
            <View style={styles.formContainer}>
                <Text style={styles.inputLabel}>Weight</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={newWeight => setWeight(newWeight)}
                    defaultValue={weight}
                    placeholder='Add weight (default equals 1)'
                    inputMode='numeric'
                />
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => {
                            const storedTask = storeNewSubTask({
                                "title": title,
                                "weight": weight === '' ? 1 : parseInt(weight),
                                "complete": false,
                            })
                            // console.log(task);
                            setTimeout(() => {
                                // console.log("Task in AddSubTaskScreen: ", storedTask);
                                navigation.navigate('task', {
                                    // description: task.taskObject.description,
                                    // title: task.taskObject.title,
                                    id: props.route.params.id,
                                    // percent: task.taskObject.percent
                                    addedSubTask: true,
                                    appColors: appColors
                                });
                                ToastAndroid.show("Subtask added", ToastAndroid.SHORT);
                            }, 100);
                        }}
                    >
                        <Text style={styles.buttonText}>ADD</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}