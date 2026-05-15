import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import * as Location from 'expo-location';

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const SEARCH_RADIUS = 1000; // metres

// ─── HELPERS (pre-written — focus on the fetch and rendering below) ───────────

// Builds an Overpass QL query to find restaurants near a GPS point
// Docs: http://osmlab.github.io/learnoverpass/en/docs/filters/around/
const buildQuery = (latitude, longitude) =>
  `[out:json];node[amenity=restaurant](around:${SEARCH_RADIUS},${latitude},${longitude});out body;`;

// Assembles a readable address from OSM tags (some fields may be missing)
const formatAddress = (tags) => {
  const parts = [
    tags['addr:housenumber'],
    tags['addr:street'],
    tags['addr:city'],
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : 'Address not listed';
};

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function LocationScreen() {
  const [restaurants, setRestaurants] = useState([]);
  const [location, setLocation]       = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  const findRestaurants = async () => {
    setLoading(true);
    setError(null);
    setRestaurants([]);

    // TODO 1: Request foreground location permission using expo-location.
    // If permission is not granted, call setError() with a message and return early.
    // Docs: https://docs.expo.dev/versions/latest/sdk/location/
    
    let { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      setError('Permission to access location was denied');
      return;
    }

    let fetchedLocation = await Location.getCurrentPositionAsync({});
    console.log(fetchedLocation);
    setLocation(fetchedLocation.coords);

    // TODO 2: Get the device's current GPS position.
    // Destructure latitude and longitude from position.coords.
    // Then call setLocation({ latitude, longitude }) to display the coordinates.
    
    // const { latitude, longitude } = fetchedLocation.coords;
    // setLocation({ latitude, longitude });


    // TODO 3: Build the Overpass query using buildQuery(latitude, longitude).
    // Fetch from: https://overpass-api.de/api/interpreter?data=QUERY
    // Hint: use encodeURIComponent() to safely include the query in the URL.
    // Parse the response as JSON.
    try {
      let overpassQuery = buildQuery(fetchedLocation.coords.latitude, fetchedLocation.coords.longitude);
      // console.log(encodeURIComponent(overpassQuery));
      const data = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`);
      const result = await data.json();
      const named = result.elements.filter((el) => el.tags?.name);
      setRestaurants(named);
      // console.log(named)
    } catch (err) {
      setError(err)
    }

    // TODO 4: Filter data.elements to only include restaurants that have a name tag.
    // Hint: use .filter() and optional chaining (?.)
    // Pass the filtered array to setRestaurants().


    setLoading(false);
  };

  const renderRestaurant = ({ item }) => {
    const { tags } = item;

    return (
      <View style={styles.card}>

        {/* TODO 5: Display the restaurant name using tags.name */}
        <Text style={styles.restaurantName}>{tags.name}</Text>

        {/* TODO 6: Conditionally display the cuisine type using tags.cuisine.
            Use the styles.cuisine style. Only render this if cuisine exists. */}
        {tags.cuisine && <Text style={styles.cuisine}>{tags.cuisine}</Text>}


        {/* TODO 7: Display the formatted address using the formatAddress() helper.
            Use the styles.address style. */}
        <Text style={styles.address}>{formatAddress(tags)}</Text>


        {/* TODO 8: Conditionally display opening hours using tags.opening_hours.
            Use the styles.hours style and add a 🕐 emoji. */}
        {tags.opening_hours && <Text style={styles.hours}>🕐 5{tags.opening_hours}</Text>}


        {/* TODO 9: Conditionally display the phone number using tags.phone.
            Use the styles.phone style and add a 📞 emoji. */}
        {tags.phone && <Text style={styles.phone}>📞 {tags.phone}</Text>}

      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🍽️ Nearby Restaurants</Text>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={findRestaurants}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Searching...' : 'Find Restaurants Near Me'}
        </Text>
      </TouchableOpacity>

      {location && (
        <Text style={styles.coords}>
          📍 {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
        </Text>
      )}

      {loading && (
        <ActivityIndicator size="large" color="#FF6B35" style={{ marginTop: 24 }} />
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      {!loading && restaurants.length === 0 && location && !error && (
        <Text style={styles.empty}>No restaurants found nearby.</Text>
      )}

      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRestaurant}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  coords: {
    color: '#888',
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 16,
  },
  list: {
    paddingTop: 8,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#1c1c2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  cuisine: {
    fontSize: 13,
    color: '#FF6B35',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  address: {
    fontSize: 13,
    color: '#999',
    marginBottom: 6,
  },
  hours: {
    fontSize: 13,
    color: '#aaa',
    marginBottom: 4,
  },
  phone: {
    fontSize: 13,
    color: '#aaa',
  },
  error: {
    color: '#f44336',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
  empty: {
    color: '#888',
    textAlign: 'center',
    marginTop: 32,
    fontSize: 14,
  },
});
