import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LabelSection(props) {

    // console.log("Label props:", props);

    const styles = StyleSheet.create({
        container: {
            width: '90%',
            minHeight: 200,
            marginLeft: '5%',
        },
        chosenLabelsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        chosenLabel: {
            backgroundColor: props.appColors.body_emptyBar,
            margin: 5,
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 15,
            paddingRight: 15,
            borderRadius: 15,
            color:  props.appColors.body_text,
            fontWeight: 700,
            fontSize: 16,
        },
        allLabelContainer: {
            marginTop: 10,
            width: '100%',
            backgroundColor:  props.appColors.body_taskBackground,
            padding: 10,
            borderRadius: 24,
            maxHeight: 250,
            overflow: 'visible',
        },
        searchIcon: {
            height: 18,
            width: 18,
            marginLeft: 10,
        },
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
        },
        searchInput: {
            marginLeft: 10,
            fontSize: 16,
        },
        checkBox: {
            height: 20,
            width: 20,
            borderWidth: 1,
            borderColor:  props.appColors.body_outline,
            borderRadius: 6,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 3,
        },
        checkedCheckBox: {
            backgroundColor:  props.appColors.body_completeBar,
            borderWidth: 0,
        },
        labelOption: {
            marginBottom: 5,
            marginTop: 0,
            flexDirection: 'row',
            padding: 8,
            alignItems: 'center',
        },
        optionsContainer: {
            marginTop: 10,
        },
        labelText: {
            marginLeft: 10,
            fontSize: 16,
        },
        tickIcon: {
            height: 14,
            width: 14,
        },
        noLabels: {
            margin: 5,
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 5,
            paddingRight: 15,
            color:  props.appColors.otherText,
            fontSize: 16,
        },
        createLabelOption: {
            marginLeft: 10,
            paddingTop: 8,
            paddingBottom: 8,
            flexDirection: 'row',
        },
        addIcon: {
            height: 18,
            width: 18,
            marginRight: 10,
        }
    });
    // label: { checked, id, labelName }
    const [chosenLabels, setChosenLabels] = useState([]);     // labels that are displayed on top of the list
    const [labels, setLabels] = useState([]);                 // ALL labels from local storage (+ new labels added when editing/creating task)
    const [filteredLabels, setFilteredLabels] = useState([]); // labels that fit search pattern
    const [searchInput, setSearchInput] = useState("");       // label search input

    // set initial labels to display
    const getInitialLabels = async () => {
        let storedLabels = await AsyncStorage.getItem('labels'); // get from storage
        storedLabels = JSON.parse(storedLabels); // convert to object
        storedLabels.map(label => label.checked = false); // make sure all are unchecked
        if(props.taskLabels != 0) { // if task is being edited
            setChosenLabels(props.taskLabels); // set labels to display
            storedLabels = storedLabels.map(label => {
                var newLabel = {...label};
                var index = props.taskLabels.findIndex(e => e.id == label.id);
                if(index > -1) {
                    newLabel.checked = !newLabel.checked;
                }
                return newLabel;
            })
        }
        setLabels(storedLabels); // set to labels state variable
        setFilteredLabels(storedLabels);
    }
    useEffect(() => {
        getInitialLabels();
    }, []);

    useEffect(() => {
        props.updateLabels(chosenLabels);
    }, [chosenLabels]);

    const onLabelCheck = (option) => {

        let isChecked = !option.checked;
        var newLabel = [...labels];
        const labelIndex = labels.findIndex((label) => label.id == option.id);
        newLabel[labelIndex].checked = !labels[labelIndex].checked;
        setLabels(newLabel);
        
        if(isChecked) {
            setChosenLabels((prevLabels) => {
                const newLabelList = [...prevLabels, option];
                return newLabelList;
            });
        } else {
            let labelToRemove = chosenLabels.findIndex((label) => label.id == option.id);
            let newLabelList = [...chosenLabels];
            newLabelList.splice(labelToRemove, 1);
            setChosenLabels(newLabelList);
        }
    }

    const handleSearch = (input) => {
        setSearchInput(input);
        filterResults(input);
    };

    const filterResults = (input) => {
        results = labels.filter((label) => {
            label.labelName = label.labelName.toLowerCase();
            return label.labelName.startsWith(input.toLowerCase());
        })
        setFilteredLabels(results);
    }

    const handleNewLabel = (name) => {
        let newLabelObject = {
            id: labels.length,
            checked: false,
            labelName: name,
        }
        newLabelList = [...labels, newLabelObject];
        setLabels((prevLabels) => {
            return [...prevLabels, newLabelObject];
        })
        setSearchInput("");
        onLabelCheck(newLabelObject);
        setFilteredLabels(newLabelList);
    }

    return (
        <View style={styles.container}>
            <View style={styles.chosenLabelsContainer}>
                {   
                    chosenLabels.length == 0 ?
                        <Text style={styles.noLabels}>No labels selected</Text>
                    :
                    chosenLabels.map((label) => {
                        return (
                            <Text style={styles.chosenLabel} key={label.id}>{label.labelName}</Text>
                        )
                    })
                }
            </View>
            <View style={styles.allLabelContainer}>
                <TouchableOpacity style={styles.searchContainer}>
                    <Image style={styles.searchIcon} source={require("../../assets/search.png")} resizeMode='contain' />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search or create..."
                        value={searchInput}
                        onChangeText={text => handleSearch(text)}
                    />
                </TouchableOpacity>
                <ScrollView nestedScrollEnabled={true} style={styles.optionsContainer} keyboardShouldPersistTaps='handled'>
                    {
                        filteredLabels.length == 0 && searchInput != "" ?
                            <TouchableOpacity
                                style={styles.createLabelOption}
                                onPress={() => handleNewLabel(searchInput)}
                            >
                                <Image style={styles.addIcon} source={require("../../assets/add_green.png")} resizeMode='contain' />
                                <Text>Create "{searchInput}"</Text>
                            </TouchableOpacity>
                        :
                        filteredLabels.map((label) => {
                            return (
                                <TouchableOpacity
                                    style={styles.labelOption}
                                    onPress={() => onLabelCheck(label)}
                                    key={label.id}
                                >
                                    {
                                        label.checked ?
                                        <View style={[styles.checkBox, styles.checkedCheckBox]}>
                                            <Image style={styles.tickIcon} source={require("../../assets/tick_light_green.png")} resizeMode='contain' />
                                        </View>
                                        :
                                        <View style={styles.checkBox} />
                                    }
                                    <Text style={styles.labelText}>{label.labelName}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </ScrollView>
            </View>
        </View>
    )
}