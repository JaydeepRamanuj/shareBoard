import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, TextInput, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import client from '../api/client';

interface MoveBookmarksModalProps {
    visible: boolean;
    onClose: () => void;
    onMoveSuccess: () => void;
    bookmarkIds: string[]; // IDs of bookmarks to move
    currentCollectionId?: string; // To disable moving to the same collection (optional)
}

export default function MoveBookmarksModal({ visible, onClose, onMoveSuccess, bookmarkIds, currentCollectionId }: MoveBookmarksModalProps) {
    const { colors } = useTheme();
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [moving, setMoving] = useState(false);

    // New Collection State
    const [isCreating, setIsCreating] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');
    const [newCollectionColor, setNewCollectionColor] = useState('#4ECDC4');

    const COLLECTION_COLORS = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
        '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#2ECC71'
    ];

    // Search State
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (visible) {
            fetchCollections();
            setIsCreating(false);
            setNewCollectionName('');
            setSearchQuery('');
        }
    }, [visible]);

    const fetchCollections = async () => {
        setLoading(true);
        try {
            const res = await client.get('/collections');
            setCollections(res.data);
        } catch (error) {
            console.error('Failed to fetch collections', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCollections = collections.filter((col: any) =>
        col.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleMove = async (targetCollectionId: string | null) => {
        if (targetCollectionId === currentCollectionId && targetCollectionId !== null) {
            // Optional: Alert that it's already here, or just allow (no-op)
            return onClose();
        }

        setMoving(true);
        try {
            await client.post('/bookmarks/bulk-move', {
                bookmarkIds,
                targetCollectionId
            });
            onMoveSuccess();
            onClose();
        } catch (error) {
            console.error('Move failed', error);
            Alert.alert('Error', 'Failed to move bookmarks');
        } finally {
            setMoving(false);
        }
    };

    const handleCreateAndMove = async () => {
        if (!newCollectionName.trim()) return;
        setMoving(true);
        try {
            // 1. Create Collection
            const createRes = await client.post('/collections', {
                name: newCollectionName.trim(),
                color: newCollectionColor,
                icon: 'folder'
            });
            const newCollection = createRes.data;

            // 2. Move Bookmarks
            await client.post('/bookmarks/bulk-move', {
                bookmarkIds,
                targetCollectionId: newCollection._id
            });

            onMoveSuccess();
            onClose();
        } catch (error) {
            console.error('Create and move failed', error);
            Alert.alert('Error', 'Failed to create collection and move bookmarks');
        } finally {
            setMoving(false);
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end">
                <TouchableWithoutFeedback onPress={onClose}>
                    <View className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} />
                </TouchableWithoutFeedback>

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <View className="p-6 pb-8 rounded-t-3xl h-[80%]" style={{ backgroundColor: colors.surface }}>
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-xl font-bold" style={{ color: colors.text }}>
                                {isCreating ? 'New Collection' : 'Move to...'}
                            </Text>
                            <TouchableOpacity onPress={onClose}>
                                <Ionicons name="close" size={24} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        {/* Toggle Create / List */}
                        {!isCreating && (
                            <TouchableOpacity
                                className="flex-row items-center p-4 mb-4 rounded-xl border border-dashed"
                                style={{ borderColor: colors.primary, backgroundColor: colors.primary + '10' }}
                                onPress={() => setIsCreating(true)}
                            >
                                <Ionicons name="add-circle" size={24} color={colors.primary} />
                                <Text className="ml-3 font-semibold" style={{ color: colors.primary }}>Create New Collection</Text>
                            </TouchableOpacity>
                        )}

                        {isCreating ? (
                            <View>
                                {/* Create New Collection Form */}
                                <Text className="mb-2 font-semibold" style={{ color: colors.textSecondary }}>Name</Text>
                                <TextInput
                                    className="p-4 rounded-xl mb-6 border"
                                    style={{
                                        backgroundColor: colors.background,
                                        color: colors.text,
                                        borderColor: colors.border
                                    }}
                                    value={newCollectionName}
                                    onChangeText={setNewCollectionName}
                                    placeholder="My New Collection"
                                    placeholderTextColor={colors.textSecondary}
                                    autoFocus
                                />

                                <Text className="mb-2 font-semibold" style={{ color: colors.textSecondary }}>Color</Text>
                                <View className="flex-row flex-wrap mb-6">
                                    {COLLECTION_COLORS.map((color) => (
                                        <TouchableOpacity
                                            key={color}
                                            className={`w-[30px] h-[30px] rounded-full mr-2 mb-2 justify-center items-center ${newCollectionColor === color ? 'border-2' : ''}`}
                                            style={{ backgroundColor: color, borderColor: colors.text }}
                                            onPress={() => setNewCollectionColor(color)}
                                        >
                                            {newCollectionColor === color && <Ionicons name="checkmark" size={16} color="#FFF" />}
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <View className="flex-row">
                                    <TouchableOpacity
                                        className="flex-1 p-4 mr-2 items-center"
                                        onPress={() => setIsCreating(false)}
                                    >
                                        <Text className="font-semibold" style={{ color: colors.textSecondary }}>Back to List</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        className="flex-[2] p-4 rounded-xl items-center"
                                        style={{ backgroundColor: colors.primary }}
                                        onPress={handleCreateAndMove}
                                        disabled={moving}
                                    >
                                        {moving ? <ActivityIndicator color="#FFF" /> : <Text className="text-white font-bold">Create & Move</Text>}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <View className="flex-1">
                                {/* Search Input */}
                                <View className="mb-4">
                                    <TextInput
                                        className="p-3 rounded-xl border"
                                        style={{
                                            backgroundColor: colors.background,
                                            borderColor: colors.border,
                                            color: colors.text
                                        }}
                                        placeholder="Search collections..."
                                        placeholderTextColor={colors.textSecondary}
                                        value={searchQuery}
                                        onChangeText={setSearchQuery}
                                    />
                                </View>

                                <ScrollView showsVerticalScrollIndicator={false}>
                                    {/* Unsorted Option - Only show if it matches search or query is empty */}
                                    {('unsorted'.includes(searchQuery.toLowerCase()) || searchQuery === '') && (
                                        <TouchableOpacity
                                            className="flex-row items-center p-4 mb-2 rounded-xl border"
                                            style={{
                                                borderColor: currentCollectionId === undefined ? colors.primary : colors.border,
                                                backgroundColor: colors.background
                                            }}
                                            onPress={() => handleMove(null)}
                                        >
                                            <Ionicons name="file-tray-outline" size={24} color={colors.text} />
                                            <Text className="ml-3 font-semibold text-base" style={{ color: colors.text }}>Unsorted</Text>
                                        </TouchableOpacity>
                                    )}

                                    {loading ? (
                                        <ActivityIndicator size="small" color={colors.primary} className="mt-4" />
                                    ) : (
                                        filteredCollections.map((col: any) => (
                                            <TouchableOpacity
                                                key={col._id}
                                                className="flex-row items-center p-4 mb-2 rounded-xl border"
                                                style={{
                                                    backgroundColor: colors.background,
                                                    borderColor: col._id === currentCollectionId ? colors.primary : colors.border
                                                }}
                                                onPress={() => handleMove(col._id)}
                                                disabled={col._id === currentCollectionId}
                                            >
                                                <View className="w-6 h-6 rounded-full mr-3" style={{ backgroundColor: col.color }} />
                                                <Text className="font-semibold text-base flex-1" style={{ color: colors.text }}>{col.name}</Text>
                                                {col._id === currentCollectionId && <Ionicons name="checkmark" size={20} color={colors.primary} />}
                                            </TouchableOpacity>
                                        ))
                                    )}
                                    <View className="h-10" />
                                </ScrollView>
                            </View>
                        )}
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}
