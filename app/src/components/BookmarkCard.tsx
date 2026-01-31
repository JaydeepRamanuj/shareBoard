import React from 'react';
import { View, Text, Image, Linking, TouchableOpacity } from 'react-native';

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


    const handlePress = () => {
        Linking.openURL(url);
    };

    return (
        <TouchableOpacity
            className="flex-row h-[100px] mb-4 rounded-xl overflow-hidden"
            style={{ backgroundColor: colors.surface }}
            onPress={handlePress}
            onLongPress={onLongPress}
            delayLongPress={500}
            activeOpacity={0.8}
        >
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


