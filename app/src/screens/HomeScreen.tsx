import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Modal, FlatList, Alert, TouchableWithoutFeedback } from 'react-native';
import { SPACING } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import client from '../api/client';
import CollectionCard from '../components/CollectionCard';
import BookmarkCard from '../components/BookmarkCard';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function HomeScreen() {
    const navigation = useNavigation<any>();
    const { colors } = useTheme();
    // const styles = getStyles(colors); // Removed for Tailwind

    const [loading, setLoading] = useState(false);
    const [collections, setCollections] = useState<any[]>([]);
    const [unsortedBookmarks, setUnsortedBookmarks] = useState<any[]>([]);
    const [unsortedCount, setUnsortedCount] = useState(0);

    // Move Bookmark State
    const [moveModalVisible, setMoveModalVisible] = useState(false);
    const [selectedBookmark, setSelectedBookmark] = useState<any>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const collectionsRes = await client.get('/collections');
            setCollections(collectionsRes.data);

            const unsortedRes = await client.get('/bookmarks?collectionId=unsorted');
            setUnsortedBookmarks(unsortedRes.data);
            setUnsortedCount(unsortedRes.data.length);

        } catch (error) {
            console.error('Home fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    const handleLongPressBookmark = (bookmark: any) => {
        setSelectedBookmark(bookmark);
        setMoveModalVisible(true);
    };

    const moveBookmarkToCollection = async (collectionId: string) => {
        if (!selectedBookmark) return;
        try {
            console.log(`Moving bookmark ${selectedBookmark._id} to ${collectionId}`);
            // Explicitly print the URL for debugging
            console.log(`Requesting PUT /bookmarks/${selectedBookmark._id}`);

            await client.put(`/bookmarks/${selectedBookmark._id}`, {
                collectionId: collectionId
            });

            setMoveModalVisible(false);
            fetchData();
        } catch (error) {
            console.error("Move failed", error);
            Alert.alert("Error", "Could not move bookmark.");
        }
    };

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
            <ScrollView
                contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} tintColor={colors.primary} />}
            >
                {/* Header */}
                <View className="mb-6 flex-row justify-between items-center">
                    <Text className="text-2xl font-bold" style={{ color: colors.text }}>Pixel Bookmarks</Text>
                </View>

                {/* Collections Section */}
                <View className="flex-row items-center mb-4 mt-2">
                    <Text className="text-lg font-semibold mr-2" style={{ color: colors.text }}>Recent Collections</Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                    {collections.length === 0 ? (
                        <View className="w-[150px] h-[100px] justify-center items-center rounded-xl" style={{ backgroundColor: colors.surface }}>
                            <Text className="text-sm" style={{ color: colors.textSecondary }}>No collections yet.</Text>
                        </View>
                    ) : (
                        collections.map((item) => (
                            <CollectionCard
                                key={item._id}
                                name={item.name}
                                count={item.bookmarkCount || 0}
                                color={item.color}
                                style={{ width: 150, marginRight: SPACING.m }}
                                onPress={() => navigation.navigate('Collections', { screen: 'Detail', params: { collection: item } })}
                            />
                        ))
                    )}
                </ScrollView>

                {/* Unsorted Section */}
                <View className="flex-row items-center mb-4 mt-2">
                    <Text className="text-lg font-semibold mr-2" style={{ color: colors.text }}>Unsorted Bookmarks</Text>
                    {unsortedCount > 0 && (
                        <Text className="px-2 py-0.5 rounded-lg text-xs overflow-hidden" style={{ backgroundColor: colors.surface, color: colors.textSecondary }}>
                            {unsortedCount}
                        </Text>
                    )}
                </View>

                {unsortedBookmarks.length === 0 ? (
                    <View className="p-8 items-center">
                        <Text className="text-sm" style={{ color: colors.textSecondary }}>No unsorted bookmarks.</Text>
                        <Text className="text-xs mt-2" style={{ color: colors.textSecondary }}>Tap + to add one.</Text>
                    </View>
                ) : (
                    unsortedBookmarks.map((bookmark) => (
                        <BookmarkCard
                            key={bookmark._id}
                            title={bookmark.title}
                            domain={bookmark.domain}
                            image={bookmark.image}
                            url={bookmark.url}
                            onLongPress={() => handleLongPressBookmark(bookmark)}
                        />
                    ))
                )}

            </ScrollView>

            {/* Floating Action Button */}
            <TouchableOpacity
                className="absolute bottom-6 right-6 w-14 h-14 rounded-full justify-center items-center shadow-lg"
                style={{ backgroundColor: colors.primary, elevation: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }}
                onPress={() => navigation.navigate('AddBookmark')}
                activeOpacity={0.8}
            >
                <Ionicons name="add" size={32} color="#FFF" />
            </TouchableOpacity>

            {/* Move Bookmark Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={moveModalVisible}
                onRequestClose={() => setMoveModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setMoveModalVisible(false)}>
                    <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <TouchableWithoutFeedback>
                            <View className="p-6 pb-16 rounded-t-3xl" style={{ backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
                                <Text className="text-xl font-bold mb-1" style={{ color: colors.text }}>Move to Collection</Text>
                                <Text className="text-sm mb-4" style={{ color: colors.textSecondary }}>Select a collection for "{selectedBookmark?.domain}"</Text>

                                <FlatList
                                    data={collections}
                                    keyExtractor={(item) => item._id}
                                    style={{ maxHeight: 300 }}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            className="flex-row items-center py-4 border-b"
                                            style={{ borderBottomColor: colors.border }}
                                            onPress={() => moveBookmarkToCollection(item._id)}
                                        >
                                            <Ionicons name="folder-outline" size={20} color={colors.primary} style={{ marginRight: 10 }} />
                                            <Text className="text-base" style={{ color: colors.text }}>{item.name}</Text>
                                        </TouchableOpacity>
                                    )}
                                />

                                <TouchableOpacity
                                    className="mt-6 items-center p-4 rounded-xl border"
                                    style={{ backgroundColor: colors.background, borderColor: colors.border }}
                                    onPress={() => setMoveModalVisible(false)}
                                >
                                    <Text className="font-semibold text-base" style={{ color: colors.text }}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

        </SafeAreaView>
    );
}


