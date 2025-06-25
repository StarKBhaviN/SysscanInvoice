import { useThemeContext } from "@/hooks/useThemeContext";
import React, { ReactNode } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface ShowModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  children: ReactNode;
  title?: string;
  showSaveBtn?: boolean;
}

export const ShowModal: React.FC<ShowModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  children,
  title,
  showSaveBtn,
}) => {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);

  return (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      transparent
      onRequestClose={() => setIsModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {title && <Text style={styles.modalTitle}>{title}</Text>}

          {children}

          <View
            style={{
              flexDirection: "row",
              marginTop: 20,
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Pressable
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
            {showSaveBtn && (
              <Pressable
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Save</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

function createStyles(
  theme: {
    headText?: string;
    subText?: string;
    background: any;
    tint?: string;
    icon?: string;
    tabIconDefault?: string;
    tabIconSelected?: string;
  },
  colorScheme: string
) {
  return StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
      backgroundColor: theme.background,
      padding: 14,
      borderRadius: 12,
      alignItems: "flex-start",
      justifyContent: "center",
      width: "80%",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      paddingHorizontal: 16,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.headText,
      marginBottom: 12,
    },
    closeButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
      backgroundColor: theme.tint || "#007BFF",
    },
    closeButtonText: {
      color: theme.headText || "#fff",
      fontWeight: "600",
      fontSize: 16,
    },
  });
}
