import React from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


// initializeCount = async () => {
//     isInitialised = await AsyncStorage.getItem('taskCount')
//     if(isInitialised === null)
//         await AsyncStorage.setItem('taskCount', JSON.stringify(0));
// }

// initializeCount();

// getMyStringValue = async () => {
//     // console.log(await AsyncStorage.getItem('36'));
    
// }


clearAll = async () => {
    await AsyncStorage.clear()
    console.log('Cleared.')
}

// clearAll();

export default function AddSubTaskScreen(props) {

    const navigation = props.navigation;

    const getValuesByKey = async (key) => {
        values = await AsyncStorage.getItem(key);
        return JSON.parse(values);
    }

    console.log(props.id);

    const storeNewSubTask = async (value) => {
        // key = props.id;
        // try {
        //     taskObject = getValuesByKey();
        //     allSubtasks = taskObject.taskList;
        //     allSubtasks = [...allSubtasks, value];
        //     taskObject = {...taskObject, allSubtasks};
        //     const jsonValue = JSON.stringify(taskObject);
        //     await AsyncStorage.setItem(JSON.stringify(key), jsonValue);
        //     // await AsyncStorage.setItem('taskCount', JSON.stringify(key+1));
        // } catch (e) {
        //     // saving error
        // }
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
                            storeNewSubTask({
                                "title": title,
                                "weight": weight === '' ? 1 : weight,
                                "complete": false,
                            })
                            navigation.navigate('task');
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