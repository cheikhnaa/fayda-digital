import React from 'react';
import { View, Image, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface PodcastModalProps {
  visible: boolean;
  onClose: () => void;
  item: any;
  theme: any;
  onPlay: () => void;
  onBookmark?: () => void;
  tag?: string;
}

export function PodcastModal({ visible, onClose, item, theme, onPlay, onBookmark, tag }: PodcastModalProps) {
  if (!item) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 50 }}>
          <TouchableOpacity onPress={onClose}>
            <Text style={{ fontSize: 24, color: theme.text }}>✕</Text>
          </TouchableOpacity>
          {onBookmark && (
            <TouchableOpacity onPress={onBookmark}>
              <Text style={{ fontSize: 24, color: theme.text }}>🔖</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Image */}
          <View style={{
            width: '100%',
            aspectRatio: 1,
            marginBottom: 20,
            borderRadius: 1,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 5,
          }}>
            <Image
              source={(item as any).modalImage || item.image || require('../assets/thierno.png')}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 1,
              }}
              resizeMode="cover"
            />
          </View>

          {/* Informations du son en bas de l'image */}
          <View style={{ marginBottom: 20, paddingHorizontal: 0 }}>
            {tag && (
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#0F5132', textTransform: 'uppercase' }}>{tag}</Text>
              </View>
            )}
            <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 12, lineHeight: 28, color: theme.text }} numberOfLines={2}>
              {item.title}
            </Text>
            {item.description && (
              <Text style={{ fontSize: 14, marginBottom: 12, lineHeight: 20, color: theme.textSecondary }} numberOfLines={3}>
                {item.description}
              </Text>
            )}
            <Text style={{ fontSize: 13, fontWeight: '500', color: theme.textSecondary }}>
              {item.date} • {item.duration || '--:--'}
            </Text>
          </View>

          {/* Boutons de contrôle */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30, gap: 12 }}>
            <TouchableOpacity 
              style={{
                flex: 1,
                borderRadius: 5,
                overflow: 'hidden',
                shadowColor: '#0F5132',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              }}
              onPress={onPlay}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#0F5132', '#0B3C5D']}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 16,
                  paddingHorizontal: 20,
                  gap: 10,
                }}
              >
                <Text style={{ fontSize: 20, color: '#ffffff' }}>▶</Text>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#ffffff' }}>Play</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: theme.cardBackground,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Text style={{ fontSize: 24, color: theme.text }}>⋯</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}


