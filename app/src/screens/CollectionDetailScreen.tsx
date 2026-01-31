import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SPACING, SIZES } from '../constants/theme';
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
    const styles = getStyles(colors);

    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const collectionColor = collection.color || colors.primary;

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.header, { backgroundColor: collectionColor + '15', borderBottomColor: collectionColor + '30' }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>{collection.name}</Text>
                {/* Visual indicator of color */}
                <View style={[styles.colorDot, { backgroundColor: collectionColor }]} />
            </View>

            {loading ? (
                <View style={styles.listContent}>
                    {[1, 2, 3].map((i) => (
                        <View key={i} style={styles.skeletonCard}>
                            <View style={styles.skeletonImage} />
                            <View style={styles.skeletonContent}>
                                <View style={styles.skeletonText} />
                                <View style={[styles.skeletonText, { width: '60%' }]} />
                            </View>
                        </View>
                    ))}
                </View>
            ) : (
                <FlatList
                    data={bookmarks}
                    keyExtractor={(item: any) => item._id}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <BookmarkCard
                            title={item.title}
                            domain={item.domain}
                            image={item.image}
                            url={item.url}
                        />
                    )}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Text style={styles.emptyText}>No bookmarks in here yet.</Text>
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => navigation.navigate('AddBookmark')}
                            >
                                <Text style={styles.addButtonText}>Add New Bookmark</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.m,
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        padding: SPACING.xs,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    colorDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    listContent: {
        padding: SPACING.m,
        flexGrow: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: SPACING.xl,
    },
    emptyText: {
        color: colors.textSecondary,
        fontSize: 16,
        marginBottom: SPACING.l,
    },
    addButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: SPACING.l,
        paddingVertical: SPACING.m,
        borderRadius: SIZES.borderRadius,
    },
    addButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    // Skeleton Styles
    skeletonCard: {
        backgroundColor: colors.surface,
        borderRadius: SIZES.borderRadius,
        overflow: 'hidden',
        height: 100, // Matching BookmarkCard height
        marginBottom: SPACING.m,
        flexDirection: 'row',
    },
    skeletonImage: {
        width: 100,
        height: '100%',
        backgroundColor: colors.border,
        opacity: 0.3,
    },
    skeletonContent: {
        flex: 1,
        padding: SPACING.m,
        justifyContent: 'center',
    },
    skeletonText: {
        height: 12,
        backgroundColor: colors.border,
        marginBottom: 8,
        borderRadius: 4,
        opacity: 0.3,
        width: '80%',
    },
});
