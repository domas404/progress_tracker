import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

const colors = {
    accentDark: '#13573F',
    accentLight: '#AED3C5'
}

export default function Task(props) {

    // console.log(props.id);

    const basicStyle = StyleSheet.create({
        taskContainer: {
            width: '90%',
            height: 120,
            borderRadius: 24,
            flexDirection: 'column',
            marginTop: 15,
            shadowColor: '#666',
            elevation: 3
        },
        taskTitleContainer: {
            flex: 0.8,
            justifyContent: 'center',
            alignItems: 'flex-end',
            flexDirection: 'row',
        },
        progressBar: {
            flex: 1,
            justifyContent: 'center',
            alignSelf: 'center',
            width: '90%',
        },
        taskTags: {
            flex: 0.6,
            alignItems: 'center',
        },
        titleAndMenu: {
            width: '85%',
            flexDirection: 'row',
            justifyContent: 'flex-start'
        },
        taskTitle: {
            fontWeight: 700,
            width: '90%',
            fontSize: 18,
        },
        progressBarWhole: {
            height: 30,
            borderRadius: 15,
        },
        progressBarComplete: {
            width: `${props.percent}%`,
            minWidth: '15%',
            height: 30,
            borderRadius: 15,
        },
        progressPercent: {
            fontSize: 18,
            textAlign: 'right',
            lineHeight: 30,
            paddingRight: 10,
            fontWeight: 700
        },
        tag: {
            width: '90%',
            flexWrap: 'wrap',
        },
        taskMenu: {
            height: 28,
            width: 28,
            marginLeft: 15
        }
    })

    const styles1 = StyleSheet.create({
        taskContainer: {
            backgroundColor: '#fff',
            color: colors.accentDark,
        },
        taskTitle: {
            color: colors.accentDark,
        },
        progressBarWhole: {
            backgroundColor: colors.accentLight,
        },
        progressBarComplete: {
            backgroundColor: colors.accentDark,
        },
        progressPercent: {
            color: 'white',
        },
        tag: {
            color: colors.accentLight,
        }
    });

    const styles2 = StyleSheet.create({
        taskContainer: {
            borderWidth: 1,
            borderColor: colors.accentLight,
            backgroundColor: colors.accentDark,
        },
        taskTitle: {
            color: '#fff',
        },
        progressBarWhole: {
            backgroundColor: colors.accentDark,
            borderWidth: 1,
            borderColor: colors.accentLight,
        },
        progressBarComplete: {
            backgroundColor: colors.accentLight,
            marginLeft: -1,
            marginTop: -1,
        },
        progressPercent: {
            color: colors.accentDark,
        },
        tag: {
            color: colors.accentLight,
        }
    });

    const styles = props.pinned ? styles2 : styles1;

    // console.log(props.id);

    return (
        <TouchableOpacity
            style={[basicStyle.taskContainer, styles.taskContainer]}
            activeOpacity={0.7}
            onPress={() => props.navigation.navigate('task', {
                id: props.id,
                // percent: props.percent,
                // description: props.description,
                // title: props.title
            })}
        >
            
            <View style={[basicStyle.taskTitleContainer, styles.taskTitleContainer]}>
                <View style={basicStyle.titleAndMenu}>
                    <Text style={[basicStyle.taskTitle, styles.taskTitle]}>{props.title}</Text>
                    <Image style={basicStyle.taskMenu} source={require("../../assets/dots_light_green.png")} resizeMode='contain' />
                </View>
            </View>
            <View style={[basicStyle.progressBar, styles.progressBar]}>
                <View style={[basicStyle.progressBarWhole, styles.progressBarWhole]}>
                    <View style={[basicStyle.progressBarComplete, styles.progressBarComplete]}>
                        <Text style={[basicStyle.progressPercent, styles.progressPercent]}>{props.percent}%</Text>
                    </View>
                </View>
            </View>
            <View style={[basicStyle.taskTags, styles.taskTags]}>
                <Text style={[basicStyle.tag, styles.tag]}>#Tags #tags #tags #tags #tags</Text>
            </View>
            
        </TouchableOpacity>
    )
}

