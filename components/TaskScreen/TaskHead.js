import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

export default function TaskHead(props) {

    // console.log(props);

    const styles = StyleSheet.create({
        header: {
            width: '100%',
            alignItems: 'center',
            height: 'auto',
            paddingTop: '5%',
            marginBottom: '5%'
        },
        mainTextContainer: {
            width: '80%',
            margin: '5%'
        },
        pinnedTextContainer: {
            width: "80%",
        },
        mainText: {
            color: 'white',
            fontSize: 24,
            fontWeight: 700,
            textAlign: 'center'
        },
        pinnedLabelText: {
            color: props.appColors.header_labelText,
            fontWeight: 700,
            fontSize: 16
        },
        progressBar: {
            flex: 1,
            justifyContent: 'center',
            alignSelf: 'center',
            width: '80%',
            marginTop: '5%',

        },
        progressBarWhole: {
            height: 30,
            borderRadius: 15,
            backgroundColor: props.appColors.header_emptyBar,
            borderWidth: 1,
            borderColor: props.appColors.header_outline,
        },
        progressBarComplete: {
            width: `${props.percent}%`,
            minWidth: '15%',
            height: 30,
            borderRadius: 15,
            backgroundColor: props.appColors.header_completeBar,
            marginTop: -1,
        },
        progressPercent: {
            fontSize: 18,
            textAlign: 'right',
            lineHeight: 30,
            paddingRight: 10,
            fontWeight: 700,
            color: props.appColors.header_percentage,
        },
        taskTags: {
            width: '80%',
            marginTop: '2%',
        },
        tag: {
            flexWrap: 'wrap',
            flexDirection: 'row',
            marginTop: 10,
        },
        labelText: {
            marginRight: 5,
            marginBottom: 5,
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 3,
            paddingBottom: 3,
            borderRadius: 15,
            color: props.appColors.header_labels,
            borderWidth: 1,
            borderColor: props.appColors.header_outline,
        },
        dateContainer: {
            width: '90%',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row'
        },
        dueDate: {
            color: props.appColors.header_labelText,
            fontWeight: 700,
        },
        goBack: {
            width: 24,
            height: 24,
            tintColor: props.appColors.icon
        },
        goBackContainer: {
            padding: 8,
        }
    })

    const dateToDisplay = new Date(Date.parse(props.dueDate));

    return (
        <View style={styles.header}>
            <View style={styles.dateContainer}>
                <TouchableOpacity
                    onPress={() => props.navigation.navigate('home')}
                    style={styles.goBackContainer}
                >
                    <Image style={styles.goBack} source={require("../../assets/go_back_light_green.png")} resizeMode='contain' />
                </TouchableOpacity>
                <Text style={styles.dueDate}>
                    Due: {
                        `${dateToDisplay.getFullYear()}-` +
                        `${dateToDisplay.getMonth() < 9 ? "0" + (dateToDisplay.getMonth() + 1) : dateToDisplay.getMonth()+1}-` +
                        `${dateToDisplay.getDate() < 10 ? "0" + dateToDisplay.getDate() : dateToDisplay.getDate()}`
                    }
                </Text>
            </View>
            <View style={styles.mainTextContainer}>
                <Text style={styles.mainText}>{props.name}</Text>
            </View>
            <View style={styles.pinnedTextContainer}>
                {props.description !== "" && <Text style={styles.pinnedLabelText}>{props.description}</Text>}
            </View>
            <View style={styles.taskTags}>
                <View style={styles.tag}>
                    {
                        props.labels ? props.labels.map((label) => {
                            return (
                                <TouchableOpacity key={label.id}>
                                    <Text style={styles.labelText}>
                                        {label.labelName}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })
                        :
                        <Text>{">:("}</Text>
                    }
                </View>
            </View>
            <View style={styles.progressBar}>
                <View style={styles.progressBarWhole}>
                    <View style={styles.progressBarComplete}>
                        <Text style={styles.progressPercent}>{props.percent}%</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}