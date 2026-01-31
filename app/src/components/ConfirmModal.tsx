import React from 'react';
import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface ConfirmModalProps {
    visible: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({
    visible,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDestructive = false,
    loading = false,
    onConfirm,
    onCancel
}: ConfirmModalProps) {
    const { colors } = useTheme();

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onCancel}
        >
            <View className="flex-1 justify-center items-center px-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <TouchableWithoutFeedback onPress={onCancel}>
                    <View className="absolute inset-0" />
                </TouchableWithoutFeedback>

                <View className="w-full max-w-sm rounded-2xl p-6 shadow-xl" style={{ backgroundColor: colors.surface }}>
                    <Text className="text-xl font-bold mb-2" style={{ color: colors.text }}>{title}</Text>
                    <Text className="text-base mb-6" style={{ color: colors.textSecondary }}>{message}</Text>

                    <View className="flex-row justify-end space-x-3">
                        <TouchableOpacity
                            onPress={onCancel}
                            className="px-4 py-2 rounded-lg mr-2"
                        >
                            <Text className="font-semibold" style={{ color: colors.text }}>{cancelText}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onConfirm}
                            disabled={loading}
                            className="px-4 py-2 rounded-lg flex-row items-center"
                            style={{ backgroundColor: isDestructive ? colors.error : colors.primary }}
                        >
                            {loading && <ActivityIndicator size="small" color="#FFF" style={{ marginRight: 8 }} />}
                            <Text className="font-bold text-white">{confirmText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
