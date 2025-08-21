import { useThemeContext } from "@/hooks/useThemeContext";
import React, { useMemo } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Payment {
  id: number;
  amount: number;
  date: string;
  status: string;
}

interface PaymentHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  payments: Payment[];
}

export default function PaymentHistoryModal({
  visible,
  onClose,
  payments,
}: PaymentHistoryModalProps) {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);

  const sortedPayments = useMemo(
    () =>
      [...payments].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [payments]
  );

  const renderItem = ({ item, index }: { item: Payment; index: number }) => (
    <View style={styles.timelineRow}>
      {/* Left timeline with dot & connector */}
      <View style={styles.timeline}>
        <View
          style={[
            styles.dot,
            { backgroundColor: item.status === "succeeded" ? "green" : "red" },
          ]}
        />
        {index !== payments.length - 1 && <View style={styles.line} />}
      </View>

      {/* Payment details */}
      <View style={styles.detailBox}>
        <Text style={styles.amount}>₹{item.amount}</Text>
        <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
        <Text
          style={[
            styles.status,
            { color: item.status === "succeeded" ? "green" : "red" },
          ]}
        >
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Payment History</Text>

          {sortedPayments.length > 0 ? (
            <FlatList
              data={sortedPayments}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          ) : (
            <Text style={styles.noPayments}>No payment records found</Text>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function createStyles(theme: any) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 10,
    },
    modalContainer: {
      width: "95%",
      backgroundColor: theme.tint,
      borderRadius: 20,
      padding: 20,
      maxHeight: "85%",
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 20,
      color: theme.headText,
      textAlign: "center",
    },
    timelineRow: {
      flexDirection: "row",
      marginBottom: 20,
    },
    timeline: {
      width: 30,
      alignItems: "center",
    },
    dot: {
      height: 14,
      width: 14,
      borderRadius: 7,
    },
    line: {
      flex: 1,
      width: 2,
      backgroundColor: "#ccc",
      marginTop: 2,
    },
    detailBox: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 14,
      borderRadius: 12,
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    amount: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.headText,
    },
    date: {
      fontSize: 13,
      color: theme.subText,
      marginVertical: 4,
    },
    status: {
      fontWeight: "600",
    },
    noPayments: {
      color: theme.subText,
      textAlign: "center",
      marginVertical: 20,
    },
    closeButton: {
      marginTop: 10,
      backgroundColor: theme.background,
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: "center",
    },
    closeText: {
      color: theme.headText,
      fontWeight: "bold",
      fontSize: 16,
    },
  });
}
