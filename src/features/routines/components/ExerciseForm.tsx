
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { Exercise, ExerciseType } from "../../../types/routine";
import { COLORS } from "../../../theme/colors";
import {
  exerciseLibrary,
  ExerciseTemplate,
} from "../data/exerciseLibrary";
import {
  loadCustomExercises,
  saveCustomExercise,
} from "../../../services/exerciseLibraryStorage";

const TYPES: ExerciseType[] = [
  "Reps",
  "Time",
  "Distance",
  "Weight",
];

type Props = {
  visible: boolean;
  day: string;
  exercise?: Exercise | null;
  onClose: () => void;
  onSave: (exercise: Exercise) => void;
};

export default function ExerciseForm({
  visible,
  day,
  exercise,
  onClose,
  onSave,
}: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("STRENGTH");
  const [type, setType] = useState<ExerciseType>("Reps");
  const [target, setTarget] = useState("");
  const [detail, setDetail] = useState("");

  const [search, setSearch] = useState("");
  const [customExercises, setCustomExercises] = useState<ExerciseTemplate[]>([]);
  const [selectedFromLibrary, setSelectedFromLibrary] = useState(false);

  useEffect(() => {
    if (!visible) return;

    setName(exercise?.name ?? "");
    setCategory(exercise?.category ?? "STRENGTH");
    setType(exercise?.type ?? "Reps");
    setTarget(exercise?.target ?? "");
    setDetail(exercise?.detail ?? "");

    setSearch("");
    setSelectedFromLibrary(false);

    loadCustomExercises()
      .then(setCustomExercises)
      .catch((error) => {
        console.error("Could not load exercise library:", error);
      });
  }, [visible, exercise]);

  // Custom exercises take priority over built-in templates with the same name.
  const customNames = new Set(
    customExercises.map((item) => item.name.trim().toLowerCase())
  );

  const allExercises = [
    ...exerciseLibrary.filter(
      (item) => !customNames.has(item.name.trim().toLowerCase())
    ),
    ...customExercises,
  ];

  const searchResults = search.trim()
    ? allExercises
        .filter((item) =>
          item.name.toLowerCase().includes(search.trim().toLowerCase())
        )
        .slice(0, 8)
    : [];

  const selectExercise = (item: ExerciseTemplate) => {
    setName(item.name);
    setCategory(item.category);
    setType(item.type);
    setTarget(item.target);
    setDetail(item.detail);

    setSelectedFromLibrary(true);
    setSearch("");
  };

  const placeholder = {
    Reps: "e.g. 3 × 12",
    Time: "e.g. 3 × 30 sec",
    Distance: "e.g. 2 km",
    Weight: "e.g. 3 × 10 at 20 kg",
  }[type];

  const handleSave = async () => {
    if (!name.trim() || !target.trim()) return;

    const cleanedName = name.trim();
    const cleanedCategory = category.trim().toUpperCase() || "GENERAL";
    const cleanedTarget = target.trim();
    const cleanedDetail = detail.trim() || `${type} target`;

    // Save manually created exercises for future reuse.
    // Editing a routine or selecting a library exercise does not
    // modify the original library template.
    if (!exercise && !selectedFromLibrary) {
      try {
        await saveCustomExercise({
          name: cleanedName,
          category: cleanedCategory,
          type,
          target: cleanedTarget,
          detail: cleanedDetail,
        });
      } catch (error) {
        console.error("Could not save custom exercise:", error);
      }
    }

    onSave({
      id: exercise?.id ?? `${Date.now()}-${Math.random()}`,
      name: cleanedName,
      category: cleanedCategory,
      type,
      target: cleanedTarget,
      detail: cleanedDetail,
      completed: exercise?.completed ?? false,
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>{day.toUpperCase()}</Text>
              <Text style={styles.title}>
                {exercise ? "Edit exercise" : "New exercise"}
              </Text>
            </View>

            <Pressable onPress={onClose} style={styles.close}>
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* EXERCISE LIBRARY */}
            {!exercise && (
              <View style={styles.librarySection}>
                <Text style={styles.libraryHeading}>
                  EXERCISE LIBRARY
                </Text>

                <View style={styles.searchContainer}>
                  <Text style={styles.searchIcon}>⌕</Text>
                  <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Search exercises..."
                    placeholderTextColor={COLORS.textSecondary}
                    style={styles.searchInput}
                    autoCorrect={false}
                  />
                  {search.length > 0 && (
                    <Pressable onPress={() => setSearch("")}>
                      <Text style={styles.clearSearch}>×</Text>
                    </Pressable>
                  )}
                </View>

                {search.trim().length > 0 && (
                  <View style={styles.resultsContainer}>
                    {searchResults.length > 0 ? (
                      searchResults.map((item, index) => (
                        <Pressable
                          key={`${item.name}-${index}`}
                          style={styles.resultItem}
                          onPress={() => selectExercise(item)}
                        >
                          <View style={styles.resultInfo}>
                            <Text style={styles.resultName}>
                              {item.name}
                            </Text>
                            <Text style={styles.resultDetail}>
                              {item.category} · {item.type}
                            </Text>
                            <Text style={styles.resultTarget}>
                              Suggested: {item.target}
                            </Text>
                          </View>
                          <Text style={styles.resultAdd}>+</Text>
                        </Pressable>
                      ))
                    ) : (
                      <Text style={styles.noResults}>
                        No exercise found. You can create it manually below.
                      </Text>
                    )}
                  </View>
                )}

                <Text style={styles.libraryHint}>
                  Search and select an exercise to fill the form automatically.
                </Text>
              </View>
            )}

            {/* EXISTING EXERCISE FORM */}
            <Text style={styles.label}>EXERCISE NAME *</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Push-ups"
              placeholderTextColor={COLORS.textSecondary}
              style={styles.input}
            />

            <Text style={styles.label}>CATEGORY</Text>
            <TextInput
              value={category}
              onChangeText={setCategory}
              placeholder="e.g. CHEST, CARDIO, LEGS"
              placeholderTextColor={COLORS.textSecondary}
              style={styles.input}
            />

            <Text style={styles.label}>EXERCISE TYPE</Text>
            <View style={styles.types}>
              {TYPES.map((item) => {
                const selected = item === type;

                return (
                  <Pressable
                    key={item}
                    onPress={() => setType(item)}
                    style={[
                      styles.typeButton,
                      selected && styles.typeSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeText,
                        selected && styles.typeTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.label}>TARGET *</Text>
            <TextInput
              value={target}
              onChangeText={setTarget}
              placeholder={placeholder}
              placeholderTextColor={COLORS.textSecondary}
              style={styles.input}
            />

            <Text style={styles.label}>ADDITIONAL DETAILS</Text>
            <TextInput
              value={detail}
              onChangeText={setDetail}
              placeholder="e.g. Easy pace, 60 sec rest"
              placeholderTextColor={COLORS.textSecondary}
              style={styles.input}
            />

            <Pressable
              disabled={!name.trim() || !target.trim()}
              onPress={handleSave}
              style={[
                styles.saveButton,
                (!name.trim() || !target.trim()) && styles.disabled,
              ]}
            >
              <Text style={styles.saveText}>
                {exercise ? "SAVE CHANGES" : "ADD TO ROUTINE"}
              </Text>
            </Pressable>

            <Pressable onPress={onClose} style={styles.cancel}>
              <Text style={styles.cancelText}>CANCEL</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: "flex-end",
  },
  card: {
    backgroundColor: "#11150F",
    borderTopLeftRadius: 27,
    borderTopRightRadius: 27,
    borderWidth: 1,
    borderColor: "#303F25",
    padding: 23,
    paddingBottom: 30,
    maxHeight: "92%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 23,
  },
  eyebrow: {
    color: COLORS.green,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "900",
  },
  close: {
    width: 37,
    height: 37,
    borderRadius: 12,
    backgroundColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    color: COLORS.text,
    fontSize: 25,
  },
  librarySection: {
    marginBottom: 8,
  },
  libraryHeading: {
    color: COLORS.green,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: "#30372B",
    borderRadius: 12,
    paddingHorizontal: 13,
  },
  searchIcon: {
    color: COLORS.green,
    fontSize: 23,
    marginRight: 9,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    paddingVertical: 13,
    fontSize: 13,
  },
  clearSearch: {
    color: COLORS.textSecondary,
    fontSize: 22,
    paddingLeft: 8,
  },
  resultsContainer: {
    marginTop: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: "#30372B",
    borderRadius: 12,
    overflow: "hidden",
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#30372B",
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "800",
  },
  resultDetail: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 4,
  },
  resultTarget: {
    color: COLORS.green,
    fontSize: 10,
    marginTop: 4,
    fontWeight: "700",
  },
  resultAdd: {
    color: COLORS.green,
    fontSize: 23,
    fontWeight: "700",
    paddingHorizontal: 8,
  },
  noResults: {
    color: COLORS.textSecondary,
    fontSize: 11,
    padding: 13,
    lineHeight: 17,
  },
  libraryHint: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 9,
    lineHeight: 15,
  },
  label: {
    color: COLORS.green,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginBottom: 9,
    marginTop: 16,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: "#30372B",
    borderRadius: 12,
    color: COLORS.text,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 13,
  },
  types: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 13,
    paddingVertical: 11,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: "#30372B",
    borderRadius: 10,
  },
  typeSelected: {
    backgroundColor: COLORS.greenDark,
    borderColor: COLORS.green,
  },
  typeText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "700",
  },
  typeTextSelected: {
    color: COLORS.green,
  },
  saveButton: {
    backgroundColor: COLORS.green,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
  },
  disabled: {
    opacity: 0.4,
  },
  saveText: {
    color: COLORS.background,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },
  cancel: {
    padding: 16,
    alignItems: "center",
    marginTop: 5,
  },
  cancelText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: "700",
  },
});
