import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Modal, TextInput, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
// import { SPACING, SIZES } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import client from '../api/client';
import CollectionCard from '../components/CollectionCard';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

/**
 * WHAT:
 * - Displays a grid view of all user collections.
 * - Allowing creating new collections.
 * 
 * WHY:
 * - Users need a dedicated space to browse and organize their folders.
 * 
 * HOW:
 * - Fetches all collections from `/api/collections`.
 * - Uses a custom Modal for creating new collections with color selection.
 */
export default function CollectionsScreen() {
    const navigation = useNavigation<any>();
    const { colors } = useTheme();
    // const styles = getStyles(colors); // Removed for Tailwind
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
        <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold" style={{ color: colors.text }}>All Collections</Text>
        </View>
    );

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
            <FlatList
                data={collections}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
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
                className="absolute bottom-6 right-6 w-14 h-14 rounded-full justify-center items-center shadow-lg"
                style={{ backgroundColor: colors.primary, elevation: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }}
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
                    className="flex-1 justify-end"
                    style={{ backgroundColor: 'transparent' }} // Removed shadow
                >
                    <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                        <View className="flex-1 justify-end">
                            <TouchableWithoutFeedback>
                                <View className="p-6 pb-16 rounded-t-3xl" style={{ backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
                                    <Text className="text-xl font-bold mb-4" style={{ color: colors.text }}>New Collection</Text>
                                    <TextInput
                                        className="p-4 rounded-xl mb-6 border"
                                        style={{
                                            backgroundColor: colors.background,
                                            color: colors.text,
                                            borderColor: colors.border
                                        }}
                                        placeholder="Collection Name"
                                        placeholderTextColor={colors.textSecondary}
                                        value={newCollectionName}
                                        onChangeText={setNewCollectionName}
                                        autoFocus
                                    />

                                    <Text className="mb-2 font-semibold" style={{ color: colors.textSecondary }}>Select Color</Text>
                                    <View className="flex-row flex-wrap mb-6">
                                        {COLLECTION_COLORS.map((color) => (
                                            <TouchableOpacity
                                                key={color}
                                                className={`w-[30px] h-[30px] rounded-full mr-2 mb-2 justify-center items-center ${selectedColor === color ? 'border-2' : ''}`}
                                                style={{ backgroundColor: color, borderColor: colors.text }}
                                                onPress={() => setSelectedColor(color)}
                                            >
                                                {selectedColor === color && <Ionicons name="checkmark" size={16} color="#FFF" />}
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    <View className="flex-row justify-between">
                                        <TouchableOpacity
                                            className="flex-1 p-4 mr-2 items-center"
                                            onPress={() => setModalVisible(false)}
                                        >
                                            <Text className="font-semibold" style={{ color: colors.textSecondary }}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            className="flex-[2] p-4 rounded-xl items-center"
                                            style={{ backgroundColor: colors.primary }}
                                            onPress={handleCreateCollection} disabled={creating}
                                        >
                                            <Text className="text-white font-bold">{creating ? "Creating..." : "Create"}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
}
