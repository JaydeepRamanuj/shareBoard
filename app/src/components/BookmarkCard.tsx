import React from 'react';
import { View, Text, StyleSheet, Image, Linking, TouchableOpacity } from 'react-native';
import { SPACING, SIZES } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

interface BookmarkCardProps {
    title: string;
    domain: string;
    image?: string | null;
    url: string;
    onLongPress?: () => void;
}

export default function BookmarkCard({ title, domain, image, url, onLongPress }: BookmarkCardProps) {
    const { colors } = useTheme();
    const styles = getStyles(colors);

    const handlePress = () => {
        Linking.openURL(url);
    };

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={handlePress}
            onLongPress={onLongPress}
            delayLongPress={500}
            activeOpacity={0.8}
        >
            {image && (
                <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
            )}
            <View style={styles.content}>
                <Text style={styles.domain}>{domain}</Text>
                <Text style={styles.title} numberOfLines={2}>
                    {title}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: SIZES.borderRadius,
        overflow: 'hidden',
        marginBottom: SPACING.m,
        flexDirection: 'row',
        height: 100,
    },
    image: {
        width: 100,
        height: '100%',
    },
    content: {
        flex: 1,
        padding: SPACING.m,
        justifyContent: 'center',
    },
    domain: {
        color: colors.textSecondary,
        fontSize: 12,
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    title: {
        color: colors.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
