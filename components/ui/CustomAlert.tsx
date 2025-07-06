import { useThemeContext } from "@/hooks/useThemeContext";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

type CustomAlertProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose?: () => void;
};

export default function CustomAlert({
  visible,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onClose = () => {},
}: CustomAlertProps) {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View style={styles.alertContainer}>
            <Text style={styles.alertTitle}>{title}</Text>
            <Text style={styles.alertMessage}>{message}</Text>

            <View style={styles.buttonsContainer}>
              {confirmText && (
                <TouchableOpacity style={styles.button} onPress={onConfirm}>
                  <Text style={styles.buttonText}>{confirmText}</Text>
                </TouchableOpacity>
              )}

              {cancelText && (
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onClose}
                >
                  <Text style={styles.buttonText}>{cancelText}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

function createStyles(
  theme: {
    [key: string]: any;
  },
  colorScheme: string
) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    alertContainer: {
      width: wp(80),
      backgroundColor: theme.tint,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 20,
      alignItems: "flex-start",
      elevation: 10,
    },
    alertTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.headText,
      marginBottom: 10,
    },
    alertMessage: {
      fontSize: 16,
      color: theme.subText,
      marginBottom: 20,
      textAlign: "left",
    },
    buttonsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
    },
    button: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      backgroundColor: colorScheme === "dark" ? "rgb(78, 141, 84)" : "#4CAF50", // green
      marginHorizontal: 5,
    },
    cancelButton: {
      backgroundColor: colorScheme === "dark" ? "rgb(141, 78, 78)" : "#f44336", // red
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
    },
  });
}
