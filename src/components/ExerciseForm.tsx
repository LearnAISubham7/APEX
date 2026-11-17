
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

import { Exercise, ExerciseType } from "../types/routine";
import { COLORS } from "../theme/colors";


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

  useEffect(() => {
    if (!visible) return;

    setName(exercise?.name ?? "");
    setCategory(exercise?.category ?? "STRENGTH");
    setType(exercise?.type ?? "Reps");
    setTarget(exercise?.target ?? "");
    setDetail(exercise?.detail ?? "");
  }, [visible, exercise]);

  const placeholder = {
    Reps: "e.g. 3 × 12",
    Time: "e.g. 3 × 30 sec",
    Distance: "e.g. 2 km",
    Weight: "e.g. 3 × 10 at 20 kg",
  }[type];

  const handleSave = () => {
    if (!name.trim() || !target.trim()) return;

    onSave({
      id: exercise?.id ?? `${Date.now()}-${Math.random()}`,
      name: name.trim(),
      category: category.trim().toUpperCase() || "GENERAL",
      type,
      target: target.trim(),
      detail: detail.trim() || `${type} target`,
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
