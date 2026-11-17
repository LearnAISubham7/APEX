
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import BottomNavigation from "./src/components/BottomNavigation";
import TodayScreen from "./src/features/workouts/screens/TodayScreen";
import RoutinesScreen from "./src/features/routines/screens/RoutinesScreen";
import HistoryScreen from "./src/features/history/screens/HistoryScreen";
import StatsScreen from "./src/features/stats/screens/StatsScreen";
import SettingsScreen from "./src/features/settings/screens/SettingsScreen";

import { AppTab, getTodayName } from "./src/types/routine";
import { useRoutines } from "./src/hooks/useRoutines";
import { COLORS } from "./src/theme/colors";

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>("Today");
  const [selectedRoutineDay, setSelectedRoutineDay] =
    useState(getTodayName());
  const [showSettings, setShowSettings] = useState(false);

  const {
    loading,
    saveError,
    totalExercises,
    history,
    getExercises,
    addExercise,
    updateExercise,
    deleteExercise,
    toggleExercise,
    restoreData,
  } = useRoutines();

  const today = getTodayName();
  const todayExercises = getExercises(today);

  if (loading && !showSettings) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.loading}>
          <StatusBar style="light" />
          <Text style={styles.logo}>
            APEX<Text style={styles.dot}>.</Text>
          </Text>
          <Text style={styles.loadingText}>
            Loading your workouts...
          </Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />

        <View style={styles.app}>
          <View style={styles.content}>
            {showSettings ? (
              <SettingsScreen
                onBack={() => setShowSettings(false)}
                onRestore={restoreData}
              />
            ) : (
              <>
                {activeTab === "Today" && (
                  <TodayScreen
                    exercises={todayExercises}
                    onToggle={(id) => toggleExercise(today, id)}
                    onEditPlan={() => {
                      setSelectedRoutineDay(today);
                      setActiveTab("Routines");
                    }}
                    onOpenSettings={() => setShowSettings(true)}
                  />
                )}

                {activeTab === "Routines" && (
                  <RoutinesScreen
                    selectedDay={selectedRoutineDay}
                    onDayChange={setSelectedRoutineDay}
                    getExercises={getExercises}
                    onAdd={addExercise}
                    onUpdate={updateExercise}
                    onDelete={deleteExercise}
                  />
                )}

                {activeTab === "History" && (
                  <HistoryScreen history={history} />
                )}

                {activeTab === "Stats" && (
                  <StatsScreen
                    totalExercises={totalExercises}
                    todayExercises={todayExercises}
                    history={history}
                  />
                )}
              </>
            )}
          </View>

          {saveError && (
            <Text style={styles.error}>{saveError}</Text>
          )}

          {!showSettings && (
            <BottomNavigation
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  app: {
    flex: 1,
    backgroundColor: COLORS.background,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  content: {
    flex: 1,
  },
  loading: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    color: COLORS.text,
    fontSize: 35,
    fontWeight: "900",
    letterSpacing: 4,
  },
  dot: {
    color: COLORS.green,
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  error: {
    color: COLORS.danger,
    fontSize: 11,
    textAlign: "center",
    padding: 8,
  },
});
