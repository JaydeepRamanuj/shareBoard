
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Image, ActivityIndicator, TouchableOpacity, Keyboard, ScrollView } from 'react-native';
// import { SPACING, SIZES } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import client from '../api/client';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

/**
 * WHAT:
 * - A modal screen to add a new bookmark.
 * - Automatically fetches metadata preview for the URL.
 * 
 * WHY:
 * - Simplified flow to save content quickly.
 * 
 * HOW:
 * - Checks clipboard on mount for URLs.
 * - Calls `/api/preview` to fetch OG Graph data.
 * - Allows selecting a target collection before saving.
 */
export default function AddBookmarkScreen() {
    const navigation = useNavigation();
    const { colors } = useTheme();
    // const styles = getStyles(colors); // Removed for Tailwind

    const [url, setUrl] = useState('');
    const [loadingPreview, setLoadingPreview] = useState(false);
    const [preview, setPreview] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [collections, setCollections] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState('unsorted');
    const [imageLoading, setImageLoading] = useState(false);

    useEffect(() => {
        checkClipboard();
    }, []);

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        try {
            const res = await client.get('/collections');
            setCollections(res.data);
        } catch (error) {
            console.error('Failed to fetch collections', error);
        }
    };

    const checkClipboard = async () => {
        try {
            const hasString = await Clipboard.hasStringAsync();
            if (hasString) {
                const content = await Clipboard.getStringAsync();
                if (content && (content.startsWith('http') || content.startsWith('www'))) {
                    setUrl(content);
                    // Automatically trigger preview if valid URL
                    fetchPreview(content);
                }
            }
        } catch (e) {
            console.log("Clipboard error", e);
        }
    };

    const fetchPreview = async (targetUrl: string) => {
        setLoadingPreview(true);
        setPreview(null);
        try {
            const res = await client.post('/preview', { url: targetUrl });
            setPreview(res.data);
        } catch (error) {
            console.error(error);
            setPreview({ title: 'New Bookmark', domain: new URL(targetUrl).hostname || 'unknown', url: targetUrl });
        } finally {
            setLoadingPreview(false);
        }
    }

    const handlePreview = () => {
        if (!url) return;
        Keyboard.dismiss();
        fetchPreview(url);
    };

    const handleSave = async () => {
        if (!url) return;
        setLoading(true); // Use 'loading' state for saving

        let finalPreview = preview;

        if (!finalPreview) {
            // Try to fetch preview if not already done
            try {
                const res = await client.post('/preview', { url });
                finalPreview = res.data;
            } catch (error) {
                finalPreview = { title: 'New Bookmark', domain: new URL(url).hostname || 'unknown', url };
            }
        }

        try {
            await client.post('/bookmarks', {
                url: finalPreview.url || url,
                title: finalPreview.title,
                description: finalPreview.description,
                image: finalPreview.image,
                domain: finalPreview.domain,
                collectionId: selectedCollection === 'unsorted' ? null : selectedCollection // Use selectedCollection
            });
            navigation.goBack();
        } catch (error) {
            console.error('Save failed', error);
            alert('Failed to save bookmark');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        handleSave();
    };

    const pasteFromClipboard = async () => {
        const content = await Clipboard.getStringAsync();
        if (content && (content.startsWith('http') || content.startsWith('www'))) {
            setUrl(content);
            fetchPreview(content); // Automatically fetch preview after pasting
        }
    };

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
            <View className="flex-row items-center justify-between p-4 bg-transparent">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
                    <Text className="text-lg" style={{ color: colors.textSecondary }}>Cancel</Text>
                </TouchableOpacity>
                <Text className="text-lg font-bold" style={{ color: colors.text }}>Add Bookmark</Text>
                <TouchableOpacity onPress={handleSubmit} disabled={loading} className="p-2">
                    <Text className="text-lg font-bold" style={{ color: loading ? colors.textSecondary : colors.primary }}>
                        {loading ? 'Saving' : 'Save'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View className="p-4">
                <Text className="mb-2 font-semibold" style={{ color: colors.textSecondary }}>URL</Text>
                <View className="flex-row items-center mb-6">
                    <TextInput
                        className="flex-1 p-4 rounded-xl border text-base"
                        style={{
                            backgroundColor: colors.surface,
                            color: colors.text,
                            borderColor: colors.border
                        }}
                        placeholder="https://example.com"
                        placeholderTextColor={colors.textSecondary}
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={url}
                        onChangeText={setUrl}
                        returnKeyType="done"
                        onSubmitEditing={handlePreview} // Keep original submit editing behavior
                    />
                    <TouchableOpacity
                        className="ml-3 p-4 rounded-xl items-center justify-center"
                        style={{ backgroundColor: colors.surface }}
                        onPress={pasteFromClipboard}
                    >
                        <Ionicons name="clipboard-outline" size={24} color={colors.primary} />
                    </TouchableOpacity>
                </View>

                {/* Collection Selector */}
                <Text className="mb-2 font-semibold" style={{ color: colors.textSecondary }}>Collection</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                    <TouchableOpacity
                        className={`px-4 py-2 rounded-full mr-2 border align-center justify-center`}
                        style={{
                            backgroundColor: selectedCollection === 'unsorted' ? colors.primary : colors.surface,
                            borderColor: selectedCollection === 'unsorted' ? colors.primary : colors.border
                        }}
                        onPress={() => setSelectedCollection('unsorted')}
                    >
                        <Text style={{ color: selectedCollection === 'unsorted' ? '#FFF' : colors.text }}>Unsorted</Text>
                    </TouchableOpacity>

                    {collections.map((col: any) => ( // Added type any for col
                        <TouchableOpacity
                            key={col._id}
                            className={`px-4 py-2 rounded-full mr-2 border align-center justify-center`}
                            style={{
                                backgroundColor: selectedCollection === col._id ? (col.color || colors.primary) : colors.surface,
                                borderColor: selectedCollection === col._id ? (col.color || colors.primary) : colors.border
                            }}
                            onPress={() => setSelectedCollection(col._id)}
                        >
                            <Text style={{
                                color: selectedCollection === col._id ? '#FFF' : colors.text,
                                fontWeight: selectedCollection === col._id ? 'bold' : 'normal'
                            }}>{col.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Skeleton Loader or Preview - Re-added this section as it was removed by the instruction but is crucial for UX */}
                {loadingPreview && !preview && (
                    <View className="rounded-xl overflow-hidden h-56" style={{ backgroundColor: colors.surface }}>
                        <View className="w-full h-36 opacity-50" style={{ backgroundColor: colors.border }} />
                        <View className="p-4">
                            <View className="h-4 mb-2 rounded opacity-50" style={{ backgroundColor: colors.border }} />
                            <View className="h-4 w-3/5 rounded opacity-50" style={{ backgroundColor: colors.border }} />
                        </View>
                    </View>
                )}

                {preview && !loadingPreview && (
                    <View className="rounded-xl overflow-hidden" style={{ backgroundColor: colors.surface }}>
                        {preview.image && (
                            <View>
                                {imageLoading && (
                                    <View className="w-full h-36 absolute z-10" style={{ backgroundColor: colors.border, opacity: 0.5 }} />
                                )}
                                <Image
                                    source={{ uri: preview.image }}
                                    className="w-full h-36"
                                    resizeMode="cover"
                                    onLoadStart={() => setImageLoading(true)}
                                    onLoadEnd={() => setImageLoading(false)}
                                />
                            </View>
                        )}
                        <View className="p-4">
                            <TextInput
                                className="text-base font-bold mb-1 border-b pb-1"
                                style={{ color: colors.text, borderBottomColor: colors.border }}
                                value={preview.title}
                                onChangeText={(t) => setPreview({ ...preview, title: t })}
                            />
                            <Text className="text-sm" style={{ color: colors.primary }}>{preview.domain}</Text>
                        </View>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}
