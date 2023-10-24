import React, { useState, useEffect } from "react";
import { StyleSheet, Modal, Pressable, View, TouchableOpacity, Image, Text } from "react-native";

export default function SortMenuComponent(props) {

    const styles = StyleSheet.create({
        modalBackground: {
            height: '100%',
            width: '100%'
        },
        sortMenuContainer: {
            position: 'absolute',
            top: props.sortMenuPosition.y + 10,
            right: 20,
            backgroundColor: props.appColors.options_background,
            width: 200,
            borderRadius: 24,
            shadowColor: props.appColors.shadow,
            elevation: 4,
        },
        sortMenuOption: {
            padding: 16,
            marginLeft: 5,
            marginRight: 5,
            borderBottomColor: props.appColors.options_border,
            borderBottomWidth: 1,
            flexDirection: 'row',
            alignItems: 'center',
        },
        lastSortMenuOption: {
            padding: 16,
            marginLeft: 5,
            marginRight: 5,
            flexDirection: 'row',
            alignItems: 'center',
        },
        sortMenuIcon: {
            height: 20,
            width: 20,
            marginRight: 7,
            tintColor: props.appColors.icon_dark
        }
    });

    const [sortMenuVisible, setSortMenuVisible] = useState(props.sortMenuVisible);

    useEffect(() => {
        if(!sortMenuVisible)
            props.updateSortMenuVisibility();
    }, [sortMenuVisible]);

    return (
        <Modal
            transparent
            visible={sortMenuVisible}
            onRequestClose={() => setSortMenuVisible(prevState => !prevState)}
            animationType="fade"
        >
            <Pressable style={styles.modalBackground} onPress={() => setSortMenuVisible(prevState => !prevState)} />
            <View style={styles.sortMenuContainer}>
                <TouchableOpacity style={styles.sortMenuOption} onPress={() => props.manageSorting('date')} >
                    <Image style={styles.sortMenuIcon} source={require("../../assets/calendar.png")} resizeMode='contain' />
                    <Text style={styles.option}>Date created</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sortMenuOption} onPress={() => props.manageSorting('title')} >
                    <Image style={styles.sortMenuIcon} source={require("../../assets/text.png")} resizeMode='contain' />
                    <Text style={styles.option}>Title</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sortMenuOption} onPress={() => props.manageSorting('progress')} >
                    <Image style={styles.sortMenuIcon} source={require("../../assets/bar_chart.png")} resizeMode='contain' />
                    <Text style={styles.option}>Progress</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.lastSortMenuOption} onPress={() => props.manageSorting('deadline')} >
                    <Image style={styles.sortMenuIcon} source={require("../../assets/deadline.png")} resizeMode='contain' />
                    <Text style={styles.option}>Due date</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}