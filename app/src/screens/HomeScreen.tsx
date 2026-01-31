import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Modal, FlatList, Alert, TouchableWithoutFeedback, Linking, BackHandler } from 'react-native';
import { SPACING } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation, useIsFocused } from '@react-navigation/native';
import client from '../api/client';
import CollectionCard from '../components/CollectionCard';
import BookmarkCard from '../components/BookmarkCard';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import MoveBookmarksModal from '../components/MoveBookmarksModal';
import ConfirmModal from '../components/ConfirmModal';

export default function HomeScreen() {
    const navigation = useNavigation<any>();
    const isFocused = useIsFocused();
    const { colors } = useTheme();
    // const styles = getStyles(colors); // Removed for Tailwind


    // Data State
    const [recentCollections, setRecentCollections] = useState([]);
    const [unsortedBookmarks, setUnsortedBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Selection & Move State
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedBookmarks, setSelectedBookmarks] = useState<string[]>([]);
    const [moveModalVisible, setMoveModalVisible] = useState(false);

    // Confirmation
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [confirmAction, setConfirmAction] = useState<() => Promise<void> | void>(() => { });
    const [confirmMessage, setConfirmMessage] = useState('');
    const [confirmTitle, setConfirmTitle] = useState('');

    useEffect(() => {
        if (isFocused) {
            fetchData();
        }
    }, [isFocused]);

    // Handle Back Press for Selection Mode
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                if (isSelectionMode) {
                    setIsSelectionMode(false);
                    setSelectedBookmarks([]);
                    return true; // Prevent default behavior (exit app)
                }
                return false;
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => subscription.remove();
        }, [isSelectionMode])
    );

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Collections (limiting to 5 for "Recent" mock)
            const colRes = await client.get('/collections');
            setRecentCollections(colRes.data.slice(0, 5));

            // Fetch Unsorted Bookmarks
            const bookRes = await client.get('/bookmarks?collectionId=unsorted');
            setUnsortedBookmarks(bookRes.data);

            // Reset selection on refresh/focus
            if (isSelectionMode) {
                setIsSelectionMode(false);
                setSelectedBookmarks([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // --- Selection Logic ---
    const handleLongPressBookmark = (bookmarkId: string) => {
        if (!isSelectionMode) {
            setIsSelectionMode(true);
            setSelectedBookmarks([bookmarkId]);
        }
    };

    const handlePressBookmark = (bookmark: any) => {
        if (isSelectionMode) {
            toggleSelection(bookmark._id);
        } else {
            // Default behavior: Open URL
            if (bookmark.url) Linking.openURL(bookmark.url);
        }
    };

    const toggleSelection = (bookmarkId: string) => {
        if (selectedBookmarks.includes(bookmarkId)) {
            const newSelection = selectedBookmarks.filter(id => id !== bookmarkId);
            setSelectedBookmarks(newSelection);
            if (newSelection.length === 0) {
                setIsSelectionMode(false);
            }
        } else {
            setSelectedBookmarks([...selectedBookmarks, bookmarkId]);
        }
    };

    const handleSelectAll = () => {
        if (selectedBookmarks.length === unsortedBookmarks.length) {
            setSelectedBookmarks([]);
            setIsSelectionMode(false);
        } else {
            // @ts-ignore
            setSelectedBookmarks(unsortedBookmarks.map(b => b._id));
        }
    };

    const handleCancelSelection = () => {
        setIsSelectionMode(false);
        setSelectedBookmarks([]);
    };


    const handleBulkDelete = () => {
        setConfirmTitle('Delete Bookmarks');
        setConfirmMessage(`Are you sure you want to delete ${selectedBookmarks.length} bookmarks?`);
        setConfirmAction(() => async () => {
            try {
                setLoading(true);
                await client.post('/bookmarks/bulk-delete', { bookmarkIds: selectedBookmarks });
                await fetchData(); // Refresh list
                setIsSelectionMode(false);
                setSelectedBookmarks([]);
            } catch (error) {
                console.error('Failed to delete bookmarks', error);
                Alert.alert('Error', 'Failed to delete bookmarks');
            } finally {
                setLoading(false);
                setConfirmVisible(false);
            }
        });
        setConfirmVisible(true);
    };

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
            {isSelectionMode ? (
                <View className="flex-row items-center justify-between px-4 py-2 border-b mb-2" style={{ borderBottomColor: colors.border }}>
                    <TouchableOpacity onPress={handleCancelSelection} className="mr-3 p-2">
                        <Ionicons name="close" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text className="text-lg font-bold flex-1" style={{ color: colors.text }}>
                        {selectedBookmarks.length} Selected
                    </Text>
                    <TouchableOpacity onPress={handleSelectAll} className="p-2">
                        <Text style={{ color: colors.primary, fontWeight: 'bold' }}>
                            {selectedBookmarks.length === unsortedBookmarks.length ? 'Deselect All' : 'Select All'}
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View className="p-4 flex-row justify-between items-center bg-transparent">
                    <View>
                        <Text className="text-sm font-semibold" style={{ color: colors.textSecondary }}>Good Morning,</Text>
                        <Text className="text-2xl font-bold" style={{ color: colors.text }}>JD</Text>
                    </View>
                    <TouchableOpacity
                        className="p-2 rounded-full"
                        style={{ backgroundColor: colors.surface }}
                        onPress={() => navigation.navigate('Settings')}
                    >
                        <Ionicons name="settings-outline" size={24} color={colors.text} />
                    </TouchableOpacity>
                </View>
            )}

            <ScrollView
                className="p-4"
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} tintColor={colors.primary} />}
            >
                {/* Recent Collections - Hide when selecting? No, keep context but maybe disable interaction */}
                {!isSelectionMode && (
                    <View className="mb-8">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-lg font-semibold" style={{ color: colors.text }}>Recent Collections</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Collections')}>
                                <Text style={{ color: colors.primary }}>See All</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
                            {recentCollections.length === 0 ? (
                                <View className="w-[150px] h-[100px] justify-center items-center rounded-xl mr-4 border border-dashed" style={{ borderColor: colors.border }}>
                                    <Text className="text-sm" style={{ color: colors.textSecondary }}>No collections yet.</Text>
                                </View>
                            ) : (
                                recentCollections.map((col: any) => (
                                    <CollectionCard
                                        key={col._id}
                                        name={col.name}
                                        count={col.bookmarkCount}
                                        color={col.color}
                                        onPress={() => navigation.navigate('Collections', {
                                            screen: 'Detail',
                                            params: { collection: col }
                                        })}
                                        style={{ width: 160, marginRight: 12, height: 110 }}
                                    />
                                ))
                            )}
                        </ScrollView>
                    </View>
                )}

                {/* Unsorted Bookmarks */}
                <View className="flex-row items-center mb-4 mt-2">
                    <Text className="text-lg font-semibold mr-2" style={{ color: colors.text }}>Unsorted Bookmarks</Text>
                    <Text className="px-2 py-0.5 rounded-lg text-xs overflow-hidden font-bold" style={{ backgroundColor: colors.surface, color: colors.textSecondary }}>
                        {unsortedBookmarks.length}
                    </Text>
                </View>

                {unsortedBookmarks.length === 0 ? (
                    <View className="p-8 items-center border border-dashed rounded-xl" style={{ borderColor: colors.border }}>
                        <Ionicons name="bookmark-outline" size={48} color={colors.textSecondary} />
                        <Text className="text-base mt-4 font-medium" style={{ color: colors.text }}>No unsorted bookmarks.</Text>
                        <Text className="text-sm mt-2" style={{ color: colors.textSecondary }}>Tap + to add one.</Text>
                    </View>
                ) : (
                    unsortedBookmarks.map((bookmark: any) => (
                        <BookmarkCard
                            key={bookmark._id}
                            title={bookmark.title}
                            domain={bookmark.domain}
                            image={bookmark.image}
                            url={bookmark.url}
                            onPress={() => handlePressBookmark(bookmark)}
                            onLongPress={() => handleLongPressBookmark(bookmark._id)}
                            selected={selectedBookmarks.includes(bookmark._id)}
                            selectionMode={isSelectionMode}
                        />
                    ))
                )}
            </ScrollView>

            {/* FAB - Hide in selection mode */}
            {!isSelectionMode && (
                <TouchableOpacity
                    className="absolute bottom-6 right-6 w-14 h-14 rounded-full justify-center items-center shadow-lg"
                    style={{ backgroundColor: colors.primary, elevation: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }}
                    onPress={() => navigation.navigate('AddBookmark')}
                    activeOpacity={0.8}
                >
                    <Ionicons name="add" size={32} color="#FFF" />
                </TouchableOpacity>
            )}

            {/* Selection Toolbar */}
            {isSelectionMode && (
                <View className="absolute bottom-0 left-0 right-0 p-4 pb-8 flex-row justify-around border-t" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                    <TouchableOpacity
                        className="items-center"
                        onPress={() => setMoveModalVisible(true)}
                    >
                        <Ionicons name="folder-open-outline" size={24} color={colors.primary} />
                        <Text className="text-xs mt-1" style={{ color: colors.primary }}>Move</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="items-center"
                        onPress={handleBulkDelete}
                    >
                        <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
                        <Text className="text-xs mt-1" style={{ color: '#FF6B6B' }}>Delete</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Move Bookmarks Modal */}
            <MoveBookmarksModal
                visible={moveModalVisible}
                onClose={() => setMoveModalVisible(false)}
                onMoveSuccess={() => {
                    fetchData();
                    setIsSelectionMode(false);
                    setSelectedBookmarks([]);
                }}
                bookmarkIds={selectedBookmarks}
                currentCollectionId={undefined} // Unsorted
            />

            <ConfirmModal
                visible={confirmVisible}
                title={confirmTitle}
                message={confirmMessage}
                onConfirm={confirmAction}
                onCancel={() => setConfirmVisible(false)}
                isDestructive={true}
                loading={loading}
            />
        </SafeAreaView>
    );
}
