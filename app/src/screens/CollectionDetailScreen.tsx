import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Modal, TouchableWithoutFeedback } from 'react-native';
// import { SPACING, SIZES } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import client from '../api/client';
import BookmarkCard from '../components/BookmarkCard';
import { useTheme } from '../context/ThemeContext';

export default function CollectionDetailScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { collection } = route.params;
    const { colors } = useTheme();
    // const styles = getStyles(colors); // Removed for Tailwind

    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [moveModalVisible, setMoveModalVisible] = useState(false);

    useEffect(() => {
        fetchBookmarks();
    }, [collection._id]);

    const fetchBookmarks = async () => {
        try {
            const res = await client.get(`/bookmarks?collectionId=${collection._id}`);
            setBookmarks(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLongPressBookmark = (bookmark: any) => {
        // Implement long press functionality, e.g., show options to move/edit/delete
        console.log('Long pressed bookmark:', bookmark.title);
        // For now, let's just open the modal for demonstration
        setMoveModalVisible(true);
    };

    const renderHeader = () => (
        <View className="flex-row items-center mb-6">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <View className="flex-1 flex-row items-center">
                <View className={`w-4 h-4 rounded-full mr-3`} style={{ backgroundColor: collection.color }} />
                <Text className="text-2xl font-bold flex-1" style={{ color: colors.text }} numberOfLines={1}>{collection.name}</Text>
            </View>
            <TouchableOpacity onPress={() => setMoveModalVisible(true)}>
                <Ionicons name="create-outline" size={24} color={colors.text} />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
            {/* Header Background Strip - Optional aesthetic touch, using simplified approach for now */}

            <View className="flex-1 px-4 pt-2">
                {renderHeader()}

                <FlatList
                    data={bookmarks}
                    keyExtractor={(item: any) => item._id}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    renderItem={({ item }) => (
                        <BookmarkCard
                            title={item.title}
                            domain={item.domain}
                            image={item.image}
                            url={item.url}
                            onLongPress={() => handleLongPressBookmark(item)}
                        />
                    )}
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchBookmarks} tintColor={colors.primary} />}
                    ListEmptyComponent={
                        <View className="flex-1 justify-center items-center mt-20">
                            <Text className="text-base" style={{ color: colors.textSecondary }}>No bookmarks in this collection.</Text>
                        </View>
                    }
                />
            </View>

            {/* Move/Edit Modal - Reusing the one from Home/Collections generally, but here focusing on moving out or editing? 
                 Actually the task.md mentioned "Move Bookmark" functionality. 
                 The current code has `moveModalVisible` but `renderHeader` has an edit icon triggering it? 
                 Wait, looking at original code: `renderHeader` has `create-outline` triggering `setMoveModalVisible`.
                 And there is a Modal at the bottom.
                 Let's migrate the Modal styles too.
             */}

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
                                <Text className="text-xl font-bold mb-4" style={{ color: colors.text }}>Collection Options</Text>
                                {/* Placeholder for more options later, for now just simpler management or info */}
                                <Text className="mb-4" style={{ color: colors.textSecondary }}>Editing {collection.name}</Text>

                                <TouchableOpacity
                                    className="p-4 rounded-xl items-center border"
                                    style={{ borderColor: colors.border }}
                                    onPress={() => setMoveModalVisible(false)}
                                >
                                    <Text className="font-semibold" style={{ color: colors.text }}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

        </SafeAreaView>
    );
}
