import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';

export default function Task(props) {

    const basicStyle = StyleSheet.create({
        taskContainer: {
            width: '90%',
            // height: 120,
            borderRadius: 24,
            flexDirection: 'column',
            marginTop: 15,
            shadowColor: props.appColors.shadow,
            elevation: 3,
            paddingBottom: 10,
        },
        taskTitleContainer: {
            paddingTop: 15,
            paddingBottom: 10,
            justifyContent: 'center',
            alignItems: 'flex-end',
            flexDirection: 'row',
        },
        progressBar: {
            // flex: 1,
            justifyContent: 'center',
            alignSelf: 'center',
            width: '90%',
        },
        taskTags: {
            // flex: 0.6,
            alignItems: 'center',
            paddingLeft: 10,
            paddingTop: 5,
            // flexDirection: 'row',
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
            maxWidth: 260,
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
            flexDirection: 'row',
        },
        taskMenu: {
            height: 28,
            width: 28,
            marginLeft: 15,
            overflow:'visible',
        },
        labelText: {
            marginRight: 10,
            color: props.appColors.body_labels,
            textDecorationLine: 'underline',
        },
        pinIcon: {
            width: 24,
            height: 24,
            marginRight: 5,
        },
        pinAndTitle: {
            flexDirection: 'row',
            alignItems: 'center',
        }
    })

    const headerStyle = StyleSheet.create({
        taskContainer: {
            backgroundColor: props.appColors.header_taskBackground,
            borderWidth: 1,
            borderColor: props.appColors.header_outline,
        },
        taskTitle: {
            color: props.appColors.header_text,
            marginLeft: 10,
        },
        progressBarWhole: {
            backgroundColor: props.appColors.header_emptyBar,
            borderWidth: 1,
            borderColor: props.appColors.header_outline,
        },
        progressBarComplete: {
            backgroundColor: props.appColors.header_completeBar,
            marginLeft: -1,
            marginTop: -1,
        },
        progressPercent: {
            color: props.appColors.header_percentage,
        },
        tag: {
            color: props.appColors.header_labels,
        }
    });

    const bodyStyle = StyleSheet.create({
        taskContainer: {
            backgroundColor: props.appColors.body_taskBackground,
        },
        taskTitle: {
            color: props.appColors.body_text,
        },
        progressBarWhole: {
            backgroundColor: props.appColors.body_emptyBar,
        },
        progressBarComplete: {
            backgroundColor: props.appColors.body_completeBar,
        },
        progressPercent: {
            color: props.appColors.body_percentage,
        },
        tag: {
            color: props.appColors.body_labels,
        },
    });

    const styles = props.pinned ? headerStyle : bodyStyle;

    const myRef = useRef();
    const [position, setPosition] = useState({ px: -1, py: -1 });

    const getPosition = () => {
        myRef.current.measure((fx, fy, width, height, px, py) => {
            const location = {
                px: Math.round(px),
                py: Math.round(py),
            };
            setPosition(location);
        });
    };

    useEffect(() => {
        if(position.px != -1)
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
                        onPress={() => getPosition() }
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
                        props.labels.length > 0 ?
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
                        <Text></Text>
                    }
                </View>
            </View>            
        </TouchableOpacity>
    )
}