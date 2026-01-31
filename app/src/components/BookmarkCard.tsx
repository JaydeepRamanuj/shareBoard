import React from 'react';
import { View, Text, Image, Linking, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Added Ionicons import

import { useTheme } from '../context/ThemeContext';

interface BookmarkCardProps {
    title: string;
    domain: string;
    image?: string; // Changed from string | null
    url?: string; // Changed to optional
    onPress?: () => void; // Added onPress
    onLongPress?: () => void;
    selected?: boolean; // Added selected
    selectionMode?: boolean; // Added selectionMode
}

/**
 * WHAT:
 * - A reusable component to display a single bookmark.
 * - Supports normal view and "Selection Mode" view.
 * 
 * WHY:
 * - Consistent representation of bookmarks across Home and Detail screens.
 * 
 * HOW:
 * - Receives props for title, image, domain, etc.
 * - Handles long-press to trigger parent's selection logic.
 */
export default function BookmarkCard({ title, domain, image, url, onPress, onLongPress, selected, selectionMode }: BookmarkCardProps) {
    const { colors } = useTheme();

    // Removed handlePress as onPress prop is now used directly

    return (
        <TouchableOpacity
            onPress={onPress} // Changed from handlePress
            onLongPress={onLongPress}
            // Removed delayLongPress={500}
            activeOpacity={0.7} // Changed from 0.8
            className={`flex-row h-[100px] mb-4 rounded-xl overflow-hidden border-2`}
            style={{
                backgroundColor: colors.surface,
                borderColor: selected ? colors.primary : 'transparent'
            }}
        >
            {/* Selection Overlay/Icon */}
            {selectionMode && (
                <View className="absolute z-10 top-2 left-2 w-6 h-6 rounded-full justify-center items-center" style={{ backgroundColor: selected ? colors.primary : 'rgba(0,0,0,0.4)', borderWidth: 1, borderColor: '#FFF' }}>
                    {selected && <Ionicons name="checkmark" size={16} color="#FFF" />}
                </View>
            )}

            {image && (
                <Image source={{ uri: image }} className="w-[100px] h-full" resizeMode="cover" />
            )}
            <View className="flex-1 justify-center p-4">
                <Text className="text-xs mb-1 uppercase" style={{ color: colors.textSecondary }}>{domain}</Text>
                <Text className="text-base font-bold" style={{ color: colors.text }} numberOfLines={2}>
                    {title}
                </Text>
            </View>
        </TouchableOpacity>
    );
}


