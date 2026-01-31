import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Modal, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SPACING, SIZES } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import client from '../api/client';
import CollectionCard from '../components/CollectionCard';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function CollectionsScreen() {
    const navigation = useNavigation<any>();
    const { colors } = useTheme();
    const styles = getStyles(colors);
    const INITIAL_COLOR = colors.primary;

    const [collections, setCollections] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Create Collection State
    const [modalVisible, setModalVisible] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');
    const [creating, setCreating] = useState(false);

    const fetchCollections = async () => {
        setLoading(true);
        try {
            const res = await client.get('/collections');
            setCollections(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const COLLECTION_COLORS = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
        '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#2ECC71'
    ];
    const [selectedColor, setSelectedColor] = useState(INITIAL_COLOR);

    const handleCreateCollection = async () => {
        if (!newCollectionName.trim()) return;
        setCreating(true);
        try {
            await client.post('/collections', {
                name: newCollectionName.trim(),
                color: selectedColor
            });
            setModalVisible(false);
            setNewCollectionName('');
            setSelectedColor(INITIAL_COLOR);
            fetchCollections();
        } catch (error) {
            Alert.alert('Error', 'Failed to create collection');
        } finally {
            setCreating(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchCollections();
        }, [])
    );

    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.title}>All Collections</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* ... (keep FlatList and FAB) */}
            <FlatList
                data={collections}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContent}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                ListHeaderComponent={renderHeader}
                renderItem={({ item }) => (
                    <CollectionCard
                        name={item.name}
                        count={item.bookmarkCount || 0}
                        color={item.color}
                        onPress={() => navigation.navigate('Detail', { collection: item })}
                    />
                )}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchCollections} tintColor={colors.primary} />}
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.8}
            >
                <Ionicons name="add" size={32} color="#FFF" />
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>New Collection</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Collection Name"
                            placeholderTextColor={colors.textSecondary}
                            value={newCollectionName}
                            onChangeText={setNewCollectionName}
                            autoFocus
                        />

                        <Text style={styles.label}>Select Color</Text>
                        <View style={styles.colorContainer}>
                            {COLLECTION_COLORS.map((color) => (
                                <TouchableOpacity
                                    key={color}
                                    style={[
                                        styles.colorSwatch,
                                        { backgroundColor: color },
                                        selectedColor === color && styles.selectedSwatch
                                    ]}
                                    onPress={() => setSelectedColor(color)}
                                >
                                    {selectedColor === color && <Ionicons name="checkmark" size={16} color="#FFF" />}
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.createButton} onPress={handleCreateCollection} disabled={creating}>
                                <Text style={styles.createButtonText}>{creating ? "Creating..." : "Create"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    // ... (keep existing styles)
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    listContent: {
        padding: SPACING.m,
        paddingBottom: 80,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.l,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
    },
    columnWrapper: {
        justifyContent: 'space-between',
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
        marginBottom: SPACING.m,
    },
    input: {
        backgroundColor: colors.background,
        padding: SPACING.m,
        borderRadius: SIZES.borderRadius,
        color: colors.text,
        marginBottom: SPACING.l,
        borderWidth: 1,
        borderColor: colors.border,
    },
    label: {
        color: colors.textSecondary,
        marginBottom: SPACING.s,
        fontWeight: '600',
    },
    colorContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: SPACING.l,
    },
    colorSwatch: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: SPACING.s,
        marginBottom: SPACING.s,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedSwatch: {
        borderWidth: 2,
        borderColor: colors.text,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        padding: SPACING.m,
        flex: 1,
        marginRight: SPACING.s,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: colors.textSecondary,
        fontWeight: '600',
    },
    createButton: {
        backgroundColor: colors.primary,
        padding: SPACING.m,
        borderRadius: SIZES.borderRadius,
        flex: 2,
        alignItems: 'center',
    },
    createButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
});
