import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, SPACING } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

interface CollectionCardProps {
    name: string;
    count?: number;
    color?: string;
    onPress: () => void;
    style?: any;
}

export default function CollectionCard({ name, count = 0, color, onPress, style }: CollectionCardProps) {
    const { colors } = useTheme();
    const styles = getStyles(colors);

    // Use passed color or fallback to primary from theme
    const baseColor = color || colors.primary;

    return (
        <TouchableOpacity
            style={[
                styles.card,
                style,
                { backgroundColor: baseColor + '15', borderColor: baseColor + '30', borderWidth: 1 }
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={[styles.limitText, { color: colors.text }]} numberOfLines={2}>
                        {name}
                    </Text>
                </View>
                <View style={styles.footer}>
                    <View style={[styles.iconPlaceholder, { backgroundColor: baseColor + '30' }]}>
                        <Ionicons name="folder" size={20} color={baseColor} />
                    </View>
                    <Text style={styles.count}>{count}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: SIZES.borderRadius,
        padding: SPACING.m,
        height: 120,
        width: '47%',
        marginBottom: SPACING.m,
        justifyContent: 'space-between',
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    limitText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    count: {
        color: colors.textSecondary,
        fontSize: 12,
    },
    iconPlaceholder: {
        padding: SPACING.xs,
        borderRadius: SIZES.borderRadius / 2,
    }
});
