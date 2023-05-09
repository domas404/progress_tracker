import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';

export default function Task(props) {

    // console.log(props);

    const basicStyle = StyleSheet.create({
        taskContainer: {
            width: '90%',
            height: 120,
            borderRadius: 24,
            flexDirection: 'column',
            marginTop: 15,
            shadowColor: props.appColors.mono3,
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
            width: '90%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            overflow: 'visible',
            alignItems: 'center',
        },
        taskTitle: {
            fontWeight: 700,
            // width: '80%',
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
            marginLeft: 15,
            overflow:'visible',
        },
        labelText: {
            marginRight: 10,
            color: props.appColors.lightAccent,
            textDecorationLine: 'underline',
        },
        pinIcon: {
            width: 20,
            height: 20,
            marginRight: 5,
        },
        pinAndTitle: {
            flexDirection: 'row',
            alignItems: 'center',
        }
    })

    const styles1 = StyleSheet.create({
        taskContainer: {
            backgroundColor: props.appColors.mono1,
            color: props.appColors.darkAccent,
        },
        taskTitle: {
            color: props.appColors.darkAccent,
            marginLeft: 10,
        },
        progressBarWhole: {
            backgroundColor: props.appColors.lightAccent,
        },
        progressBarComplete: {
            backgroundColor: props.appColors.darkAccent,
        },
        progressPercent: {
            color: props.appColors.mono1,
        },
        tag: {
            color: props.appColors.lightAccent,
        }
    });

    const styles2 = StyleSheet.create({
        taskContainer: {
            borderWidth: 1,
            borderColor: props.appColors.lightAccent,
            backgroundColor: props.appColors.darkAccent,
        },
        taskTitle: {
            color: props.appColors.mono1,
        },
        progressBarWhole: {
            backgroundColor: props.appColors.darkAccent,
            borderWidth: 1,
            borderColor: props.appColors.lightAccent,
        },
        progressBarComplete: {
            backgroundColor: props.appColors.lightAccent,
            marginLeft: -1,
            marginTop: -1,
        },
        progressPercent: {
            color: props.appColors.darkAccent,
        },
        tag: {
            color: props.appColors.lightAccent,
        },
    });

    const styles = props.pinned ? styles2 : styles1;

    const myRef = useRef();
    const [position, setPosition] = useState({ px: 0, py: 0 });

    const getPosition = () => {
        myRef.current.measure((fx, fy, width, height, px, py) => {
            const location = {
                px: Math.round(px),
                py: Math.round(py),
            };
            setPosition(location);
        });
        // console.log("Updated task positions.");
    };

    useEffect(() => {
        setTimeout(() => {
            getPosition();
        }, 10);
    }, []);

    useEffect(() => {
        // console.log(props.id, position);
        props.optionsMenu(props.id, position);
    }, [position]);


    return (
        <TouchableOpacity
            style={[basicStyle.taskContainer, styles.taskContainer]}
            activeOpacity={0.7}
            onPress={() => props.navigation.navigate('task', {
                id: props.id,
                addedSubTask: false,
                appColors: props.appColors
            })}
        >
            <View style={[basicStyle.taskTitleContainer, styles.taskTitleContainer]}>
                <View style={basicStyle.titleAndMenu}>
                    <View style={basicStyle.pinAndTitle}>
                        { props.pinned && <Image style={basicStyle.pinIcon} source={require("../../assets/thumbtacks_light_green.png")} resizeMode='contain' />}
                        <Text style={[basicStyle.taskTitle, styles.taskTitle]}>{props.title}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            getPosition();
                            // props.optionsMenu(props.id, position);
                        }}
                        ref={myRef}
                    >
                        <Image style={basicStyle.taskMenu} source={require("../../assets/dots_light_green.png")} resizeMode='contain' />
                    </TouchableOpacity>
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
                <View style={[basicStyle.tag, styles.tag]}>
                    {
                        props.labels ?
                            props.labels.map((label) => {
                                return (
                                    <TouchableOpacity key={label.id}>
                                        <Text style={basicStyle.labelText}>
                                            {label.labelName}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })
                        :
                        ">:("
                    }
                </View>
            </View>            
        </TouchableOpacity>
    )
}