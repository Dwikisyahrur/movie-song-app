import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, StyleSheet, Image } from 'react-native';

type Song = {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
};

export default function SongListScreen() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSongs = async () => {
    try {
      const res = await fetch('https://itunes.apple.com/search?term=taylor+swift&limit=15');
      const json = await res.json();
      setSongs(json.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSongs();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.muted}>Loading songs…</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={songs}
      keyExtractor={(item) => item.trackId.toString()}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.artworkUrl100 }} style={styles.image} />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{item.trackName}</Text>
            <Text style={styles.artist}>{item.artistName}</Text>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  muted: { color: '#6B7280', marginTop: 8 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  image: { width: 64, height: 64, borderRadius: 8, marginRight: 12 },
  title: { fontWeight: '700', fontSize: 16 },
  artist: { color: '#6B7280' },
});
