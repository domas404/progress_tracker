import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


initializeCount = async () => {
    isInitialised = await AsyncStorage.getItem('taskCount')
    if(isInitialised === null)
        await AsyncStorage.setItem('taskCount', JSON.stringify(0));
}

initializeCount();

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

export default function AddTaskScreen({navigation}) {

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
        // console.log('Value set.');
        getMyStringValue();
    }

    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [tags, setTags] = React.useState('');

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
            <View style={styles.formContainer}>
                <Text style={styles.inputLabel}>Due date</Text>
                <View style={styles.datetimeContainer}>
                    <View style={styles.dateContainer}>
                        <Text style={styles.date}>yyyy-mm-dd</Text>
                    </View>
                    <View style={styles.dateContainer}>
                        <Text style={styles.date}>-- : --</Text>
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
                <TextInput
                    style={styles.input}
                    onChangeText={newTags => setTags(newTags)}
                    defaultValue={tags}
                    placeholder='Add labels'
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
                            })
                            navigation.navigate('home');
                        }}
                    >
                        <Text style={styles.buttonText}>ADD</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#13573F',
        flex: 1,
        marginTop: 20,
    },
    header: {
        fontSize: 32,
        color: 'white',
    },
    formContainer: {
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        backgroundColor: '#eee',
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
        height: 100,
        textAlignVertical: 'top',
    },
    container: {
        flex: 1,
        backgroundColor: '#13573F',
    },
    addButton: {
        width: '35%',
        height: 60,
        backgroundColor: '#13573F',
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
        color: '#13573F',
        fontSize: 16,
        marginLeft: '5%',
        marginTop: 15,
    },
    dateContainer: {
        backgroundColor: '#AED3C5',
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
        color: '#13573F'
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