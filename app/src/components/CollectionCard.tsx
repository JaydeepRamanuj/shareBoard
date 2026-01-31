import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface CollectionCardProps {
    name: string;
    count?: number;
    color?: string;
    onPress: () => void;
    style?: any;
}

export default function CollectionCard({ name, count = 0, color, onPress, style }: CollectionCardProps) {
    const { colors } = useTheme();


    // Use passed color or fallback to primary from theme
    const baseColor = color || colors.primary;

    return (
        <TouchableOpacity
            className="p-4 h-[120px] w-[47%] mb-4 justify-between rounded-xl border"
            style={[
                style,
                { backgroundColor: baseColor + '15', borderColor: baseColor + '30', borderWidth: 1 }
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View className="flex-1 justify-between">
                <View className="flex-row justify-between">
                    <Text className="text-base font-bold flex-1" style={{ color: colors.text }} numberOfLines={2}>
                        {name}
                    </Text>
                </View>
                <View className="flex-row justify-between items-end">
                    <View className="p-1 rounded-md" style={{ backgroundColor: baseColor + '30' }}>
                        <Ionicons name="folder" size={20} color={baseColor} />
                    </View>
                    <Text className="text-xs" style={{ color: colors.textSecondary }}>{count}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}


