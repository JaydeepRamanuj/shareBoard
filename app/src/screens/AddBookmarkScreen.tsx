
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Image, ActivityIndicator, TouchableOpacity, Keyboard } from 'react-native';
import { SPACING, SIZES } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import client from '../api/client';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import * as Clipboard from 'expo-clipboard';

export default function AddBookmarkScreen() {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const styles = getStyles(colors);

    const [url, setUrl] = useState('');
    const [loadingPreview, setLoadingPreview] = useState(false);
    const [preview, setPreview] = useState<any>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        checkClipboard();
    }, []);

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
        setSaving(true);

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
                collectionId: null // Save to Unsorted explicitly
            });
            navigation.goBack();
        } catch (error) {
            console.error('Save failed', error);
            alert('Failed to save bookmark');
        } finally {
            setSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.title}>New Bookmark</Text>
                <View style={{ width: 50 }} />
            </View>

            <View style={styles.content}>
                <Text style={styles.label}>Paste the link you'd like to save.</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="https://..."
                        placeholderTextColor={colors.textSecondary}
                        value={url}
                        onChangeText={setUrl}
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="done"
                        onSubmitEditing={handlePreview}
                    />
                    {loadingPreview && <ActivityIndicator color={colors.primary} style={styles.loader} />}
                </View>

                {/* Skeleton Loader or Preview */}
                {loadingPreview && !preview && (
                    <View style={styles.skeletonCard}>
                        <View style={styles.skeletonImage} />
                        <View style={styles.skeletonContent}>
                            <View style={styles.skeletonText} />
                            <View style={[styles.skeletonText, { width: '60%' }]} />
                        </View>
                    </View>
                )}

                {preview && !loadingPreview && (
                    <View style={styles.previewCard}>
                        {preview.image && (
                            <Image source={{ uri: preview.image }} style={styles.previewImage} resizeMode="cover" />
                        )}
                        <View style={styles.previewContent}>
                            <TextInput
                                style={[styles.previewTitle, styles.editableInput]}
                                value={preview.title}
                                onChangeText={(t) => setPreview({ ...preview, title: t })}
                            />
                            <Text style={styles.previewDomain}>{preview.domain}</Text>
                        </View>
                    </View>
                )}
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.saveButton, (!url || saving) && styles.disabledButton]}
                    onPress={handleSave}
                    disabled={!url || saving}
                >
                    {saving ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.saveButtonText}>Save</Text>
                    )}
                </TouchableOpacity>
            </View>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.m,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    cancelText: {
        color: colors.textSecondary,
        fontSize: 16,
    },
    content: {
        padding: SPACING.l,
    },
    label: {
        color: colors.textSecondary,
        marginBottom: SPACING.m,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: SIZES.borderRadius,
        paddingHorizontal: SPACING.m,
        marginBottom: SPACING.l,
    },
    input: {
        flex: 1,
        height: 50,
        color: colors.text,
        fontSize: 16,
    },
    loader: {
        marginLeft: SPACING.s,
    },
    previewCard: {
        backgroundColor: colors.surface,
        borderRadius: SIZES.borderRadius,
        overflow: 'hidden',
    },
    previewImage: {
        width: '100%',
        height: 150,
    },
    previewContent: {
        padding: SPACING.m,
    },
    previewTitle: {
        color: colors.text,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    editableInput: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingBottom: 4,
    },
    previewDomain: {
        color: colors.primary,
        fontSize: 14,
    },
    // Skeleton Styles
    skeletonCard: {
        backgroundColor: colors.surface,
        borderRadius: SIZES.borderRadius,
        overflow: 'hidden',
        height: 220,
    },
    skeletonImage: {
        width: '100%',
        height: 150,
        backgroundColor: colors.border,
        opacity: 0.5,
    },
    skeletonContent: {
        padding: SPACING.m,
    },
    skeletonText: {
        height: 16,
        backgroundColor: colors.border,
        marginBottom: 8,
        borderRadius: 4,
        opacity: 0.5,
    },
    footer: {
        marginTop: 'auto',
        padding: SPACING.l,
    },
    saveButton: {
        backgroundColor: colors.primary,
        height: 50,
        borderRadius: SIZES.borderRadius,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.5,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
