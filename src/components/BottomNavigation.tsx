
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { AppTab } from "../types/routine";
import { COLORS } from "../theme/colors";

type Props = {
  activeTab: AppTab;
  onChange: (tab: AppTab) => void;
};

const TABS: { name: AppTab; icon: string }[] = [
  { name: "Today", icon: "◈" },
  { name: "Routines", icon: "▤" },
  { name: "History", icon: "◷" },
  { name: "Stats", icon: "▥" },
];

export default function BottomNavigation({
  activeTab,
  onChange,
}: Props) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const active = activeTab === tab.name;

        return (
          <Pressable
            key={tab.name}
            onPress={() => onChange(tab.name)}
            style={styles.item}
          >
            <Text style={[styles.icon, active && styles.active]}>
              {tab.icon}
            </Text>

            <Text style={[styles.label, active && styles.active]}>
              {tab.name}
            </Text>

            {active && <View style={styles.indicator} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#10130F",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
    paddingBottom: 10,
  },
  item: {
    minWidth: 60,
    alignItems: "center",
    gap: 4,
  },
  icon: {
    color: COLORS.textSecondary,
    fontSize: 20,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 9,
    fontWeight: "700",
  },
  active: {
    color: COLORS.green,
  },
  indicator: {
    width: 14,
    height: 3,
    borderRadius: 5,
    backgroundColor: COLORS.green,
    marginTop: 2,
  },
});
