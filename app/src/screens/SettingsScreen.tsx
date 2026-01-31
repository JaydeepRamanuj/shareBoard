import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SPACING, SIZES } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen() {
    const { isDarkMode, toggleTheme, colors } = useTheme();

    const handleSignOut = () => {
        Alert.alert('Sign Out', 'This is a demo user. Signing out is not implemented.');
    };

    const styles = getStyles(colors);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Settings</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Account Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <View style={styles.row}>
                        <View style={styles.rowLeft}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>D</Text>
                            </View>
                            <View>
                                <Text style={styles.rowLabel}>Demo User</Text>
                                <Text style={styles.rowSubLabel}>demo@shareboard.app</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Preferences */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <View style={styles.row}>
                        <View style={styles.rowLeft}>
                            <Ionicons name="moon" size={22} color={colors.text} style={styles.icon} />
                            <Text style={styles.rowLabel}>Dark Mode</Text>
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
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <TouchableOpacity style={styles.row}>
                        <View style={styles.rowLeft}>
                            <Ionicons name="information-circle" size={22} color={colors.text} style={styles.icon} />
                            <Text style={styles.rowLabel}>Version</Text>
                        </View>
                        <Text style={styles.rowValue}>1.0.0 (MVP)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.row}>
                        <View style={styles.rowLeft}>
                            <Ionicons name="code-slash" size={22} color={colors.text} style={styles.icon} />
                            <Text style={styles.rowLabel}>Developer</Text>
                        </View>
                        <Text style={styles.rowValue}>Gemini</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        padding: SPACING.m,
        paddingBottom: SPACING.s,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
    },
    content: {
        padding: SPACING.m,
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        fontSize: 14,
        color: colors.primary,
        marginBottom: SPACING.s,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: SPACING.m,
        borderRadius: SIZES.borderRadius,
        marginBottom: SPACING.xs,
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: SPACING.m,
    },
    rowLabel: {
        fontSize: 16,
        color: colors.text,
    },
    rowSubLabel: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    rowValue: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primaryVariant,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.m,
    },
    avatarText: {
        color: colors.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
    signOutButton: {
        marginTop: SPACING.l,
        padding: SPACING.m,
        borderRadius: SIZES.borderRadius,
        borderWidth: 1,
        borderColor: colors.error,
        alignItems: 'center',
    },
    signOutText: {
        color: colors.error,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
