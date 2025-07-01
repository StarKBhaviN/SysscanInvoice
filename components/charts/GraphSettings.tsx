import { useThemeContext } from "@/hooks/useThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface GraphSettingsProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
}

const GraphSettings: React.FC<GraphSettingsProps> = ({
  isModalVisible,
  setIsModalVisible,
}) => {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);

  return (
    <>
      {/* Settings Icon Button */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Ionicons name="settings-outline" size={20} color={theme.headText || "#000"} />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Graph Settings</Text>

            {/* Your settings controls go here */}
            <Text style={{ color: theme.subText }}>Coming Soon...</Text>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default GraphSettings;

// --- Styles ---
function createStyles(
  theme: {
    headText?: string;
    subText?: string;
    background: string;
    tint?: string;
    icon?: string;
    tabIconDefault?: string;
    tabIconSelected?: string;
  },
  colorScheme: string
) {
  return StyleSheet.create({
    settingsButton: {
      zIndex: 10,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
      backgroundColor: theme.background,
      padding: 20,
      borderRadius: 12,
      width: "85%",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.headText,
      marginBottom: 16,
    },
    closeButton: {
      marginTop: 24,
      paddingVertical: 10,
      alignSelf: "flex-end",
      paddingHorizontal: 20,
      borderRadius: 8,
      backgroundColor: theme.tint || "#007BFF",
    },
    closeButtonText: {
      color: theme.headText,
      fontWeight: "600",
      fontSize: 16,
    },
  });
}
