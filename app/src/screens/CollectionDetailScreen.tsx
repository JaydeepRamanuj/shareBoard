import React, { useState, useEffect } from 'react';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Modal, TouchableWithoutFeedback, TextInput, Alert, KeyboardAvoidingView, Platform, Linking, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import client from '../api/client';
import BookmarkCard from '../components/BookmarkCard';
import MoveBookmarksModal from '../components/MoveBookmarksModal';
import ConfirmModal from '../components/ConfirmModal';
import { useTheme } from '../context/ThemeContext';

/**
 * WHAT:
 * - A view to see all bookmarks within a specific collection.
 * - Allows managing the collection itself (Rename, Recolor, Delete).
 * 
 * WHY:
 * - Users need a way to see the contents of a folder.
 * - Central place for folder-specific actions.
 * 
 * HOW:
 * - Receives `collection` object via navigation params.
 * - Fetches bookmarks filtered by this `collection._id`.
 * - Uses `ConfirmModal` for safe deletions.
 */
export default function CollectionDetailScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();

    const { collection: initialCollection } = route.params;
    const { colors } = useTheme();
    // const styles = getStyles(colors); // Removed for Tailwind

    const [collection, setCollection] = useState(initialCollection);
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editModalVisible, setEditModalVisible] = useState(false);

    // Selection & Move State
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedBookmarks, setSelectedBookmarks] = useState<string[]>([]);
    const [moveModalVisible, setMoveModalVisible] = useState(false);

    // Edit State
    const [editName, setEditName] = useState(collection.name);
    const [editColor, setEditColor] = useState(collection.color);
    const [isSaving, setIsSaving] = useState(false);

    // Confirmation
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [confirmAction, setConfirmAction] = useState<() => Promise<void> | void>(() => { });
    const [confirmMessage, setConfirmMessage] = useState('');
    const [confirmTitle, setConfirmTitle] = useState('');

    const COLLECTION_COLORS = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
        '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#2ECC71'
    ];

    useEffect(() => {
        fetchBookmarks();
    }, [collection._id]);

    // Handle Back Press for Selection Mode
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                if (isSelectionMode) {
                    setIsSelectionMode(false);
                    setSelectedBookmarks([]);
                    return true; // Prevent default behavior
                }
                return false;
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => subscription.remove();
        }, [isSelectionMode])
    );

    const fetchBookmarks = async () => {
        try {
            const res = await client.get(`/bookmarks?collectionId=${collection._id}`);
            setBookmarks(res.data);
            // Reset selection on refresh
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
        if (selectedBookmarks.length === bookmarks.length) {
            setSelectedBookmarks([]);
            setIsSelectionMode(false);
        } else {
            // @ts-ignore
            setSelectedBookmarks(bookmarks.map(b => b._id));
        }
    };

    const handleCancelSelection = () => {
        setIsSelectionMode(false);
        setSelectedBookmarks([]);
    };

    const handleUpdateCollection = async () => {
        if (!editName.trim()) return;
        setIsSaving(true);
        try {
            const res = await client.put(`/collections/${collection._id}`, {
                name: editName.trim(),
                color: editColor
            });
            setCollection(res.data);
            setEditModalVisible(false);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to update collection');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteCollection = () => {
        setEditModalVisible(false); // Close edit modal first
        setTimeout(() => { // Wait for modal to close
            setConfirmTitle('Delete Collection');
            setConfirmMessage('Are you sure? Bookmarks will be moved to Unsorted.');
            setConfirmAction(() => async () => {
                try {
                    await client.delete(`/collections/${collection._id}`);
                    navigation.goBack();
                } catch (error) {
                    Alert.alert("Error", "Could not delete collection");
                } finally {
                    setConfirmVisible(false);
                }
            });
            setConfirmVisible(true);
        }, 300);
    };

    const renderHeader = () => (
        <View className="flex-row items-center justify-between mb-6 z-10 transition-all">
            {isSelectionMode ? (
                <>
                    <TouchableOpacity onPress={handleCancelSelection} className="mr-3 p-2">
                        <Ionicons name="close" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text className="text-lg font-bold flex-1" style={{ color: colors.text }}>
                        {selectedBookmarks.length} Selected
                    </Text>
                    <TouchableOpacity onPress={handleSelectAll} className="p-2">
                        <Text style={{ color: colors.primary, fontWeight: 'bold' }}>
                            {selectedBookmarks.length === bookmarks.length ? 'Deselect All' : 'Select All'}
                        </Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 p-2 rounded-full" style={{ backgroundColor: colors.surface }}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>

                    <View className="flex-1 flex-row items-center">
                        <View className="p-2 rounded-xl mr-3" style={{ backgroundColor: collection.color ? collection.color + '20' : colors.primary + '20' }}>
                            <Ionicons name="folder" size={24} color={collection.color || colors.primary} />
                        </View>
                        <Text className="text-2xl font-bold flex-1" style={{ color: colors.text }} numberOfLines={1}>{collection.name}</Text>
                    </View>

                    <TouchableOpacity onPress={() => {
                        setEditName(collection.name);
                        setEditColor(collection.color);
                        setEditModalVisible(true);
                    }} className="p-2 rounded-full ml-2" style={{ backgroundColor: colors.surface }}>
                        <Ionicons name="ellipsis-horizontal" size={24} color={colors.text} />
                    </TouchableOpacity>
                </>
            )}
        </View>
    );

    const handleBulkDelete = () => {
        setConfirmTitle('Delete Bookmarks');
        setConfirmMessage(`Are you sure you want to delete ${selectedBookmarks.length} bookmarks?`);
        setConfirmAction(() => async () => {
            try {
                await client.post('/bookmarks/bulk-delete', { bookmarkIds: selectedBookmarks });
                await fetchBookmarks(); // Refresh list
                setIsSelectionMode(false);
                setSelectedBookmarks([]);
            } catch (error) {
                console.error('Failed to delete bookmarks', error);
                Alert.alert('Error', 'Failed to delete bookmarks');
            } finally {
                setConfirmVisible(false);
            }
        });
        setConfirmVisible(true);
    };

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
                            onPress={() => handlePressBookmark(item)}
                            onLongPress={() => handleLongPressBookmark(item._id)}
                            selected={selectedBookmarks.includes(item._id)}
                            selectionMode={isSelectionMode}
                        />
                    )}
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchBookmarks} tintColor={colors.primary} />}
                    ListEmptyComponent={
                        <View className="flex-1 justify-center items-center mt-20">
                            <Text className="text-base font-medium" style={{ color: colors.textSecondary }}>No bookmarks in this collection.</Text>
                        </View>
                    }
                />
            </View>

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

                    <TouchableOpacity onPress={handleBulkDelete} className="items-center">
                        <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
                        <Text className="text-xs mt-1" style={{ color: '#FF6B6B' }}>Delete</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Edit Collection Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={editModalVisible}
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View className="flex-1 justify-end">
                    {/* Backdrop / Overlay */}
                    <TouchableWithoutFeedback onPress={() => setEditModalVisible(false)}>
                        <View className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} />
                    </TouchableWithoutFeedback>

                    {/* Modal Content */}
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                    >
                        <View className="p-6 pb-8 rounded-t-3xl" style={{ backgroundColor: colors.surface }}>
                            <View className="flex-row justify-between items-center mb-6">
                                <Text className="text-xl font-bold" style={{ color: colors.text }}>Edit Collection</Text>
                                <TouchableOpacity onPress={handleDeleteCollection}>
                                    <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
                                </TouchableOpacity>
                            </View>

                            <Text className="mb-2 font-semibold" style={{ color: colors.textSecondary }}>Name</Text>
                            <TextInput
                                className="p-4 rounded-xl mb-6 border"
                                style={{
                                    backgroundColor: colors.background,
                                    color: colors.text,
                                    borderColor: colors.border
                                }}
                                value={editName}
                                onChangeText={setEditName}
                            />

                            <Text className="mb-2 font-semibold" style={{ color: colors.textSecondary }}>Color</Text>
                            <View className="flex-row flex-wrap mb-6">
                                {COLLECTION_COLORS.map((color) => (
                                    <TouchableOpacity
                                        key={color}
                                        className={`w-[30px] h-[30px] rounded-full mr-2 mb-2 justify-center items-center ${editColor === color ? 'border-2' : ''}`}
                                        style={{ backgroundColor: color, borderColor: colors.text }}
                                        onPress={() => setEditColor(color)}
                                    >
                                        {editColor === color && <Ionicons name="checkmark" size={16} color="#FFF" />}
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View className="flex-row justify-between">
                                <TouchableOpacity
                                    className="flex-1 p-4 mr-2 items-center"
                                    onPress={() => setEditModalVisible(false)}
                                >
                                    <Text className="font-semibold" style={{ color: colors.textSecondary }}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="flex-[2] p-4 rounded-xl items-center"
                                    style={{ backgroundColor: colors.primary }}
                                    onPress={handleUpdateCollection}
                                    disabled={isSaving}
                                >
                                    <Text className="text-white font-bold">{isSaving ? "Saving..." : "Save Changes"}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>

            {/* Move Bookmarks Modal */}
            <MoveBookmarksModal
                visible={moveModalVisible}
                onClose={() => setMoveModalVisible(false)}
                onMoveSuccess={() => {
                    fetchBookmarks();
                    setIsSelectionMode(false);
                    setSelectedBookmarks([]);
                }}
                bookmarkIds={selectedBookmarks}
                currentCollectionId={collection._id}
            />

            <ConfirmModal
                visible={confirmVisible}
                title={confirmTitle}
                message={confirmMessage}
                onConfirm={confirmAction}
                onCancel={() => setConfirmVisible(false)}
                isDestructive={true}
                loading={false}
            />
        </SafeAreaView>
    );
}
