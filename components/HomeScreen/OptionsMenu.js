import React, { useState, useEffect } from "react";
import { StyleSheet, Modal, Pressable, View, TouchableOpacity, Text } from "react-native";

export default function OptionsMenu(props) {

    const styles = StyleSheet.create({
        optionsMenuContainer: {
            position: 'absolute',
            top: props.optionsMenuPosition.y,
            right: 65,
            backgroundColor: props.appColors.options_background,
            width: 180,
            borderRadius: 24,
            shadowColor: '#666',
            elevation: 4,
        },
        optionsMenuOption: {
            padding: 16,
            marginLeft: 10,
            marginRight: 10,
            borderBottomColor: props.appColors.options_border,
            borderBottomWidth: 1,
        },
        deleteOptionsMenuOption: {
            padding: 16,
            marginLeft: 10,
            marginRight: 10,
        },
        option: {
            color: props.appColors.options_option,
            fontWeight: 700,
            fontSize: 16,
        },
        deleteOption: {
            color: props.appColors.options_deleteOption,
            fontWeight: 700,
            fontSize: 16,
        },
        modalBackground: {
            height: '100%',
            width: '100%'
        },
    });

    const [modalVisible, setModalVisible] = useState(props.modalVisible);

    useEffect(() => {
        if(!modalVisible)
            props.updateOptionsMenuVisibility();
    }, [modalVisible]);

    return (
        <Modal
            transparent
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
            animationType="fade"
        >
            <Pressable style={styles.modalBackground} onPress={() => setModalVisible(false)} />
            <View style={styles.optionsMenuContainer}>
                <TouchableOpacity style={styles.optionsMenuOption} onPress={() => props.pinSelectedTask()}>
                    <Text style={styles.option}>{props.isTaskPinned.isPinned ? "Unpin" : "Pin"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionsMenuOption} onPress={() => props.editSelectedTask()}>
                    <Text style={styles.option}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionsMenuOption} onPress={() => props.archiveSelectedTask()}>
                    <Text style={styles.option}>Archive</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteOptionsMenuOption} onPress={() => props.deleteSelectedTask()}>
                    <Text style={styles.deleteOption}>Delete</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}