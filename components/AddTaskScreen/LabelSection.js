import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LabelSection(props) {

    const styles = StyleSheet.create({
        container: {
            width: '95%',
            // height: '40%',
            minHeight: 200,
            margin: '2.5%',
        },
        chosenLabelsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        chosenLabel: {
            backgroundColor: '#AED3C5',
            margin: 5,
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 15,
            paddingRight: 15,
            borderRadius: 15,
            color: '#13573F',
            fontWeight: 700,
        },
        allLabelContainer: {
            marginTop: 10,
            width: '100%',
            backgroundColor: 'white',
            padding: 10,
            borderRadius: 24,
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
        },
        checkBox: {
            height: 20,
            width: 20,
            borderWidth: 1,
            borderColor: '#13573F',
            borderRadius: 6,
            alignItems: 'center',
            justifyContent: 'center',
        },
        checkedCheckBox: {
            backgroundColor: '#13573F',
            borderWidth: 0,
        },
        labelOption: {
            marginBottom: 5,
            marginTop: 0,
            flexDirection: 'row',
            padding: 8
        },
        optionsContainer: {
            marginTop: 10,
        },
        labelText: {
            marginLeft: 10,
        },
        tickIcon: {
            height: 14,
            width: 14,
        },
        noLabels: {
            // backgroundColor: '#AED3C5',
            margin: 5,
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 5,
            paddingRight: 15,
            color: '#666',
            // fontWeight: 500,
        },
        createLabelOption: {
            marginLeft: 10,
            // backgroundColor: 'red',
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

    let initialLabels = [
        { labelName: 'univeras', checked: false, id: 0 },
        { labelName: 'karo studijos', checked: false, id: 1 }
    ];

    let initialChosenLabels = initialLabels.filter((label) => label.checked);
    // console.log(initialChosenLabels);

    const [chosenLabels, setChosenLabels] = useState(initialChosenLabels);
    const [labels, setLabels] = useState(initialLabels);
    const [filteredLabels, setFilteredLabels] = useState(initialLabels);
    const [searchInput, setSearchInput] = useState("");

    const onLabelCheck = (option) => {

        let isChecked = !option.checked;
        
        setLabels((prevLabels) => {
            newLabel = prevLabels;
            labelIndex = prevLabels.findIndex((label) => label.id == option.id);
            newLabel[labelIndex].checked = !prevLabels[labelIndex].checked;
            return newLabel;
        });

        if(isChecked) {
            setChosenLabels((prevLabels) => {
                return [...prevLabels, option];
            });
        } else {
            let labelToRemove = chosenLabels.findIndex((label) => label.id == option.id);
            // console.log("Labels", chosenLabels);
            // console.log("Label to remove", labelToRemove);
            setChosenLabels((prevChosenLabels) => {
                let newLabelList = [...prevChosenLabels];
                newLabelList.splice(labelToRemove, 1);
                // console.log("NewLabelList after splicing:", newLabelList);
                return newLabelList;
            });
        }
    }

    
    const handleSearch = (input) => {
        // console.log("Input:", input);
        setSearchInput(input);
        filterResults(input);
    };

    // console.log(searchInput);

    const filterResults = (input) => {
        results = labels.filter((label) => {
            label.labelName = label.labelName.toLowerCase();
            return label.labelName.startsWith(input.toLowerCase());
        })
        setFilteredLabels(results);
        // console.log("Results:", results);
    }

    const handleNewLabel = (name) => {
        console.log("New label:", name);
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
                {/* <Text style={styles.chosenLabel}>univeras</Text>
                <Text style={styles.chosenLabel}>karo studijos</Text> */}
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
                <View style={styles.optionsContainer}>
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
                                <TouchableOpacity style={styles.labelOption} onPress={() => onLabelCheck(label)} key={label.id}>
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
                </View>
            </View>
        </View>
    )
}