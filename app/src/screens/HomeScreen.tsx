import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Modal, FlatList, Alert, TouchableWithoutFeedback } from 'react-native';
import { SPACING, SIZES } from '../constants/theme';
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
    const styles = getStyles(colors);

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
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} tintColor={colors.primary} />}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.appTitle}>Pixel Bookmarks</Text>
                </View>

                {/* Collections Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Collections</Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                    {collections.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No collections yet.</Text>
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
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Unsorted Bookmarks</Text>
                    {unsortedCount > 0 && <Text style={styles.badge}>{unsortedCount}</Text>}
                </View>

                {unsortedBookmarks.length === 0 ? (
                    <View style={styles.emptyVerticalState}>
                        <Text style={styles.emptyText}>No unsorted bookmarks.</Text>
                        <Text style={styles.subText}>Tap + to add one.</Text>
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
                style={styles.fab}
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
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Move to Collection</Text>
                                <Text style={styles.modalSubtitle}>Select a collection for "{selectedBookmark?.domain}"</Text>

                                <FlatList
                                    data={collections}
                                    keyExtractor={(item) => item._id}
                                    style={{ maxHeight: 300 }}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={styles.collectionOption}
                                            onPress={() => moveBookmarkToCollection(item._id)}
                                        >
                                            <Ionicons name="folder-outline" size={20} color={colors.primary} style={{ marginRight: 10 }} />
                                            <Text style={styles.optionText}>{item.name}</Text>
                                        </TouchableOpacity>
                                    )}
                                />

                                <TouchableOpacity style={styles.cancelButton} onPress={() => setMoveModalVisible(false)}>
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

        </SafeAreaView>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        padding: SPACING.m,
        paddingBottom: 80,
    },
    header: {
        marginBottom: SPACING.l,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    appTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.m,
        marginTop: SPACING.s,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginRight: SPACING.s,
    },
    badge: {
        backgroundColor: colors.surface,
        color: colors.textSecondary,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        fontSize: 12,
        overflow: 'hidden',
    },
    horizontalScroll: {
        marginBottom: SPACING.l,
    },
    emptyState: {
        width: 150,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: SIZES.borderRadius,
    },
    emptyVerticalState: {
        padding: SPACING.xl,
        alignItems: 'center',
    },
    emptyText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    subText: {
        color: colors.textSecondary,
        fontSize: 12,
        marginTop: SPACING.s,
    },
    fab: {
        position: 'absolute',
        bottom: SPACING.l,
        right: SPACING.l,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: SIZES.borderRadius * 2,
        borderTopRightRadius: SIZES.borderRadius * 2,
        padding: SPACING.l,
        paddingBottom: SPACING.xl * 2,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: SPACING.xs,
    },
    modalSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: SPACING.m,
    },
    collectionOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.m,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    optionText: {
        fontSize: 16,
        color: colors.text,
    },
    cancelButton: {
        marginTop: SPACING.l,
        alignItems: 'center',
        padding: SPACING.m,
        backgroundColor: colors.background,
        borderRadius: SIZES.borderRadius,
        borderWidth: 1,
        borderColor: colors.border,
    },
    cancelButtonText: {
        color: colors.text,
        fontWeight: '600',
        fontSize: 16,
    }
});
