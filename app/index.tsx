import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Alert,
  TouchableOpacity,
  Vibration,
  Text,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { MaterialIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";

type Coordinate = {
  latitude: number;
  longitude: number;
};

export default function HomeScreen(): JSX.Element {
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(
    null
  );
  const [destination, setDestination] = useState<Coordinate | null>(null);
  const [distanceThreshold, setDistanceThreshold] = useState<number>(1000);
  const [mapRegion, setMapRegion] = useState<any>(null);
  const [tracking, setTracking] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [alerting, setAlerting] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Quyền truy cập bị từ chối",
          "Hãy cấp quyền truy cập vị trí để sử dụng ứng dụng"
        );
        return;
      }
      await fetchCurrentLocation();
    })();
  }, []);

  const fetchCurrentLocation = async () => {
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    const newLocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    setCurrentLocation(newLocation);
    setMapRegion({
      latitude: newLocation.latitude,
      longitude: newLocation.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };
  const stopAlert = async () => {
    Vibration.cancel();
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
    setAlerting(false);
  };
  useEffect(() => {
    if (!tracking || !destination || !currentLocation) return;
    const intervalTimer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    const interval = setInterval(async () => {
      await fetchCurrentLocation();
      if (!currentLocation) return;
      let distance = getDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        destination.latitude,
        destination.longitude
      );
      if (distance <= distanceThreshold) {
        setAlerting(true);
        setTracking(false);

        // Rung trong 30 giây
        Vibration.vibrate([500, 500], true);
        setTimeout(() => {
          stopAlert();
        }, 30000);

        // Phát âm thanh
        const { sound } = await Audio.Sound.createAsync(
          require("@/assets/alert.mp3"), // đổi thành file âm thanh của bạn
          { shouldPlay: true, isLooping: true }
        );
        setSound(sound);
        await sound.playAsync();
      }
    }, 5000);
    return () => {
      clearInterval(intervalTimer);
      clearInterval(interval);
    };
  }, [tracking, destination, distanceThreshold]);

  function getDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    function toRad(value: number): number {
      return (value * Math.PI) / 180;
    }
    let R = 6371000;
    let dLat = toRad(lat2 - lat1);
    let dLon = toRad(lon2 - lon1);
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        region={mapRegion}
        onPress={(e) => {
          setDestination(e.nativeEvent.coordinate);
          Alert.alert("Điểm đến đã được cập nhật");
        }}
      >
        {currentLocation && (
          <Marker coordinate={currentLocation} title="Vị trí hiện tại" />
        )}
        {destination && <Marker coordinate={destination} title="Điểm đến" />}
        {currentLocation && destination && (
          <Polyline
            coordinates={[currentLocation, destination]}
            strokeWidth={3}
            strokeColor="blue"
          />
        )}
      </MapView>

      {tracking && (
        <Text
          style={{
            position: "absolute",
            top: 50,
            left: "40%",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {seconds} giây
        </Text>
      )}

      <TouchableOpacity
        style={{
          position: "absolute",
          right: 20,
          bottom: 140,
          backgroundColor: "white",
          padding: 10,
          borderRadius: 50,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
        }}
        onPress={fetchCurrentLocation}
      >
        <MaterialIcons name="my-location" size={30} color="#666666" />
      </TouchableOpacity>

      {!tracking && (
        <>
          <Button
            title="Thông báo khi còn 500m"
            color={distanceThreshold === 500 ? "#1C86EE" : "#666666"}
            onPress={() => setDistanceThreshold(500)}
          />
          <Button
            title="Thông báo khi còn 1km"
            color={distanceThreshold === 1000 ? "#1C86EE" : "#666666"}
            onPress={() => setDistanceThreshold(1000)}
          />
          <Button
            color={tracking ? "blue" : "#666666"}
            title="Bắt đầu theo dõi"
            onPress={() => setTracking(true)}
          />
        </>
      )}

      {tracking && (
        <Button title="Dừng theo dõi" onPress={() => setTracking(false)} />
      )}
      {alerting && (
        <TouchableOpacity
          onPress={stopAlert}
          style={{
            position: "absolute",
            bottom: 80,
            left: 20,
            right: 20,
            padding: 15,
            backgroundColor: "red",
            borderRadius: 10,
          }}
        >
          <Text
            style={{ color: "white", textAlign: "center", fontWeight: "bold" }}
          >
            DỪNG CẢNH BÁO
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
