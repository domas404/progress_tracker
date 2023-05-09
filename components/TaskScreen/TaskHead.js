import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

export default function TaskHead(props) {

    // console.log(props);

    const styles = StyleSheet.create({
        header: {
            width: '100%',
            alignItems: 'center',
            // flex: 1,
            height: 'auto',
            paddingTop: '10%',
            marginBottom: '5%'
        },
        mainTextContainer: {
            width: '90%',
            margin: '5%'
        },
        pinnedTextContainer: {
            width: "80%",
        },
        mainText: {
            color: 'white',
            fontSize: 32,
            fontWeight: 700,
            textAlign: 'center'
        },
        pinnedLabelText: {
            color: props.appColors.lightAccent,
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
            backgroundColor: props.appColors.darkAccent,
            borderWidth: 1,
            borderColor: props.appColors.lightAccent,
        },
        progressBarComplete: {
            width: `${props.percent}%`,
            minWidth: '15%',
            height: 30,
            borderRadius: 15,
            backgroundColor: props.appColors.lightAccent,
            // marginLeft: -1,
            marginTop: -1,
        },
        progressPercent: {
            fontSize: 18,
            textAlign: 'right',
            lineHeight: 30,
            paddingRight: 10,
            fontWeight: 700,
            color: props.appColors.darkAccent,
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
            color: props.appColors.lightAccent,
            // backgroundColor: colors.accentLight,
            borderWidth: 1,
            borderColor: props.appColors.lightAccent,
            // fontWeight: 700,
            // fontSize: 16,
        },
        dateContainer: {
            width: '90%',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row'
        },
        dueDate: {
            color: props.appColors.lightAccent,
            fontWeight: 700,
        },
        goBack: {
            width: 24,
            height: 24,
            
        },
        goBackContainer: {
            // backgroundColor: props.appColors.lightAccent,
            padding: 8,

        }
    })

    // console.log(props.labels);

    // const taskLabels = props.labels;

    // const mappedLabels = taskLabels.map((label) => {
    //     return <Text style={styles.labelText}>{label.labelName}</Text>
    // })

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
            {/* <Task title="Unit testai" percent={65}  pinned={true} /> */}
            {/* <Task title="Selenium užd. #1" percent={95}  pinned={true} /> */}
        </View>
    )
}