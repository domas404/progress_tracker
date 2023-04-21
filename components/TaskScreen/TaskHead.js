import React from "react";
import { StyleSheet, Text, View } from 'react-native';

const colors = {
    accentDark: '#13573F',
    accentLight: '#AED3C5'
}

export default function TaskHead(props) {

    // console.log(props);

    const styles = StyleSheet.create({
        header: {
            width: '100%',
            alignItems: 'center',
            // flex: 1,
            height: 'auto',
            paddingTop: '15%',
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
            color: '#AED3C5',
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
            backgroundColor: colors.accentDark,
            borderWidth: 1,
            borderColor: colors.accentLight,
        },
        progressBarComplete: {
            width: `${props.percent}%`,
            minWidth: '15%',
            height: 30,
            borderRadius: 15,
            backgroundColor: colors.accentLight,
            marginLeft: -1,
            marginTop: -1,
        },
        progressPercent: {
            fontSize: 18,
            textAlign: 'right',
            lineHeight: 30,
            paddingRight: 10,
            fontWeight: 700,
            color: colors.accentDark,
        },
        taskTags: {
            width: '80%',
            marginTop: '2%',
        },
        tag: {
            flexWrap: 'wrap',
            color: colors.accentLight,
        },
    })

    return (
        <View style={styles.header}>
            <View style={styles.mainTextContainer}>
                <Text style={styles.mainText}>{props.name}</Text>
            </View>
            <View style={styles.pinnedTextContainer}>
                <Text style={styles.pinnedLabelText}>{props.description}</Text>
            </View>
            <View style={styles.taskTags}>
                <Text style={styles.tag}>#Tags #tags #tags #tags #tags</Text>
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