
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";

const COLORS = [
  "#B7F34D",
  "#FFFFFF",
  "#FFD166",
  "#FF8A4C",
  "#73D9FF",
  "#E7A6FF",
];

const BURSTS = [
  { left: "18%", top: 125, delay: 0 },
  { left: "50%", top: 165, delay: 180 },
  { left: "82%", top: 115, delay: 350 },
];

function FireworkBurst({
  left,
  top,
  delay,
}: {
  left: string;
  top: number;
  delay: number;
}) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 1250,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress, delay]);

  return (
    <View
      pointerEvents="none"
      style={[
        styles.burst,
        { left: left as `${number}%`, top },
      ]}
    >
      {Array.from({ length: 14 }).map((_, index) => {
        const angle = (index * Math.PI * 2) / 14;

        const distance = 75 + (index % 3) * 13;

        const translateX = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Math.cos(angle) * distance],
        });

        const translateY = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Math.sin(angle) * distance],
        });

        const opacity = progress.interpolate({
          inputRange: [0, 0.15, 0.7, 1],
          outputRange: [0, 1, 1, 0],
        });

        const scale = progress.interpolate({
          inputRange: [0, 0.2, 1],
          outputRange: [0.2, 1.3, 0.1],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                backgroundColor: COLORS[index % COLORS.length],
                opacity,
                transform: [
                  { translateX },
                  { translateY },
                  { scale },
                ],
              },
            ]}
          />
        );
      })}

      <Animated.View
        style={[
          styles.flash,
          {
            opacity: progress.interpolate({
              inputRange: [0, 0.15, 0.5, 1],
              outputRange: [0, 0.9, 0.3, 0],
            }),
            transform: [
              {
                scale: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.2, 2.5],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
}

export default function CelebrationOverlay() {
  const bannerOpacity = useRef(new Animated.Value(0)).current;
  const bannerScale = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(bannerOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.delay(1500),
        Animated.timing(bannerOpacity, {
          toValue: 0,
          duration: 450,
          useNativeDriver: false,
        }),
      ]),
      Animated.sequence([
        Animated.spring(bannerScale, {
          toValue: 1,
          friction: 5,
          tension: 100,
          useNativeDriver: false,
        }),
        Animated.delay(1500),
        Animated.timing(bannerScale, {
          toValue: 0.85,
          duration: 450,
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  }, [bannerOpacity, bannerScale]);

  return (
    <View
      pointerEvents="none"
      style={styles.overlay}
    >
      <Animated.View
        style={[
          styles.banner,
          {
            opacity: bannerOpacity,
            transform: [{ scale: bannerScale }],
          },
        ]}
      >
        <Text style={styles.bannerTop}>
          ✦ APEX ACHIEVEMENT UNLOCKED ✦
        </Text>

        <Text style={styles.bannerTitle}>
          WORKOUT COMPLETE!
        </Text>

        <Text style={styles.bannerSubtitle}>
          YOU SHOWED UP. YOU DELIVERED.
        </Text>
      </Animated.View>

      {BURSTS.map((burst, index) => (
        <FireworkBurst
          key={index}
          left={burst.left}
          top={burst.top}
          delay={burst.delay}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
 overlay: {
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 100,
  elevation: 100,
  overflow: "hidden",
},

  banner: {
    position: "absolute",
    top: 12,
    alignSelf: "center",
    backgroundColor: "#182016",
    borderWidth: 1,
    borderColor: "#B7F34D",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: "center",
    zIndex: 10,
  },

  bannerTop: {
    color: "#B7F34D",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 5,
  },

  bannerTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  bannerSubtitle: {
    color: "#A5A99D",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 5,
  },

  burst: {
    position: "absolute",
    width: 1,
    height: 1,
    zIndex: 5,
  },

  particle: {
    position: "absolute",
    width: 7,
    height: 7,
    borderRadius: 4,
    marginLeft: -3.5,
    marginTop: -3.5,
  },

  flash: {
    position: "absolute",
    width: 18,
    height: 18,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#B7F34D",
    marginLeft: -9,
    marginTop: -9,
  },
});
