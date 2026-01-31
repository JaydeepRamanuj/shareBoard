import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SPACING } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

/**
 * WHAT:
 * - Application settings and user preferences.
 * - Handles Dark Mode toggling using `ThemeContext`.
 * 
 * WHY:
 * - Allows users to customize their experience (Theme) and view app info.
 * 
 * HOW:
 * - Accesses global theme state from context.
 * - Displays static account info (Mock for MVP).
 */
export default function SettingsScreen() {
    const { isDarkMode, toggleTheme, colors } = useTheme();

    const handleSignOut = () => {
        Alert.alert('Sign Out', 'This is a demo user. Signing out is not implemented.');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View className="p-4 pb-2">
                <Text className="text-2xl font-bold" style={{ color: colors.text }}>Settings</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {/* Account Section */}
                <View className="mb-8">
                    <Text className="text-sm font-semibold mb-2 uppercase" style={{ color: colors.primary }}>Account</Text>
                    <View className="flex-row justify-between items-center p-4 rounded-xl mb-1" style={{ backgroundColor: colors.surface }}>
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 rounded-full justify-center items-center mr-4" style={{ backgroundColor: colors.primaryVariant }}>
                                <Text className="text-lg font-bold" style={{ color: colors.text }}>J</Text>
                            </View>
                            <View>
                                <Text className="text-base" style={{ color: colors.text }}>JD</Text>
                                <Text className="text-xs" style={{ color: colors.textSecondary }}>demo@shareboard.app</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Preferences */}
                <View className="mb-8">
                    <Text className="text-sm font-semibold mb-2 uppercase" style={{ color: colors.primary }}>Preferences</Text>
                    <View className="flex-row justify-between items-center p-4 rounded-xl mb-1" style={{ backgroundColor: colors.surface }}>
                        <View className="flex-row items-center">
                            <Ionicons name="moon" size={22} color={colors.text} style={{ marginRight: 16 }} />
                            <Text className="text-base" style={{ color: colors.text }}>Dark Mode</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#767577", true: colors.primary }}
                            thumbColor={isDarkMode ? "#f4f3f4" : "#f4f3f4"}
                            onValueChange={toggleTheme}
                            value={isDarkMode}
                        />
                    </View>
                </View>

                {/* About */}
                <View className="mb-8">
                    <Text className="text-sm font-semibold mb-2 uppercase" style={{ color: colors.primary }}>About</Text>
                    <TouchableOpacity className="flex-row justify-between items-center p-4 rounded-xl mb-1" style={{ backgroundColor: colors.surface }}>
                        <View className="flex-row items-center">
                            <Ionicons name="information-circle" size={22} color={colors.text} style={{ marginRight: 16 }} />
                            <Text className="text-base" style={{ color: colors.text }}>Version</Text>
                        </View>
                        <Text className="text-base" style={{ color: colors.textSecondary }}>1.0.0 (MVP)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row justify-between items-center p-4 rounded-xl mb-1" style={{ backgroundColor: colors.surface }}>
                        <View className="flex-row items-center">
                            <Ionicons name="code-slash" size={22} color={colors.text} style={{ marginRight: 16 }} />
                            <Text className="text-base" style={{ color: colors.text }}>Developer</Text>
                        </View>
                        <Text className="text-base" style={{ color: colors.textSecondary }}>Gemini</Text>
                    </TouchableOpacity>
                </View>

                {/* 
                <TouchableOpacity
                    className="mt-6 p-4 rounded-xl border items-center"
                    style={{ borderColor: colors.error }}
                    onPress={handleSignOut}
                >
                    <Text className="text-base font-bold" style={{ color: colors.error }}>Sign Out</Text>
                </TouchableOpacity> 
                */}

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
