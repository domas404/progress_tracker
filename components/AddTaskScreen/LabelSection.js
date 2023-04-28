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
        }
    });

    let initialLabels = [
        { labelName: 'univeras', checked: false, id: 0 },
        { labelName: 'karo studijos', checked: true, id: 1 }
    ];

    const [chosenLabels, setChosenLabels] = useState([]);
    const [labels, setLabels] = useState(initialLabels);

    const onLabelCheck = (option) => {
        setLabels((prevLabels) => {
            newLabel = [...prevLabels];
            newLabel[option.id].checked = !prevLabels[option.id].checked;
            return newLabel;
        });
    }

    useEffect(() => {

    }, [labels]);

    return (
        <View style={styles.container}>
            <View style={styles.chosenLabelsContainer}>
                <Text style={styles.chosenLabel}>univeras</Text>
                <Text style={styles.chosenLabel}>karo studijos</Text>
            </View>
            <View style={styles.allLabelContainer}>
                <TouchableOpacity style={styles.searchContainer}>
                    <Image style={styles.searchIcon} source={require("../../assets/search.png")} resizeMode='contain' />
                    <TextInput style={styles.searchInput} placeholder="Search or create..."/>
                </TouchableOpacity>
                <View style={styles.optionsContainer}>
                    {
                        labels.map((label) => {
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