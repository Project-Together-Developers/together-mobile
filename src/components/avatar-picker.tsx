import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'lucide-react-native';
import { useAppTheme } from '../theme/theme-provider';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing } from '../theme/spacing';

interface AvatarPickerProps {
  uri?: string;
  onPick: (asset: { uri: string; name: string; type: string } | undefined) => void;
  hint: string;
  permissionDeniedMessage: string;
}

export default function AvatarPicker({
  uri,
  onPick,
  hint,
  permissionDeniedMessage,
}: AvatarPickerProps) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const [loading, setLoading] = useState(false);

  const handlePick = async () => {
    setLoading(true);
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(permissionDeniedMessage);
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (result.canceled || result.assets.length === 0) return;
      const asset = result.assets[0];
      const filename = asset.uri.split('/').pop() ?? `avatar-${Date.now()}.jpg`;
      const match = /\.(\w+)$/.exec(filename);
      const ext = match ? match[1].toLowerCase() : 'jpg';
      const type = asset.mimeType ?? `image/${ext === 'jpg' ? 'jpeg' : ext}`;
      onPick({ uri: asset.uri, name: filename, type });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handlePick}
        disabled={loading}
        style={styles.circle}
      >
        {uri ? (
          <Image source={{ uri }} style={styles.image} />
        ) : (
          <Camera size={34} color={colors.textSecondary} strokeWidth={1.8} />
        )}
        <View style={styles.badge}>
          <Camera size={14} color={colors.white} strokeWidth={2.4} />
        </View>
      </TouchableOpacity>
      <Text style={styles.hint}>{hint}</Text>
    </View>
  );
}

const AVATAR_SIZE = 112;

const createStyles = (colors: ReturnType<typeof useAppTheme>['colors']) =>
  StyleSheet.create({
    wrapper: { alignItems: 'center', marginBottom: Spacing.lg },
    circle: {
      width: AVATAR_SIZE,
      height: AVATAR_SIZE,
      borderRadius: AVATAR_SIZE / 2,
      backgroundColor: colors.card,
      borderWidth: 2,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'visible',
    },
    image: {
      width: AVATAR_SIZE - 4,
      height: AVATAR_SIZE - 4,
      borderRadius: (AVATAR_SIZE - 4) / 2,
    },
    badge: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: colors.background,
    },
    hint: {
      marginTop: Spacing.sm,
      color: colors.textMuted,
      fontFamily: FontFamily.regular,
      fontSize: FontSize.sm,
    },
  });
