import { useAddSubUserMutation } from "@/hooks/queries/users";
import { useThemeContext } from "@/hooks/useThemeContext";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface User {
  id: number;
  username: string;
  email: string;
  password?: string; // Optional for display purposes
  phoneNumber?: string;
}

interface AddUsersModalProps {
  maxUsers?: number;
}

export default function AddUsersModal({ maxUsers = 4 }: AddUsersModalProps) {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);

  const { mutateAsync: addSubUser, isPending: isAddingUser } =
    useAddSubUserMutation();

  const [visible, setVisible] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const addUser = async () => {
    if (users.length >= maxUsers) {
      Alert.alert(
        "Limit Reached",
        `You can only add a maximum of ${maxUsers} users.`
      );
      return;
    }

    if (!form.username || !form.email || !form.password) {
      Alert.alert("Missing Information", "All fields are required.");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    try {
      // Call API to add sub-user
      const response = await addSubUser({
        username: form.username,
        email: form.email,
        password: form.password,
        phoneNumber: "1231231231",
      });

      // Add user to local state for display
      const newUser: User = {
        id: response.id || Date.now(), // Use API response ID or fallback
        username: form.username,
        email: form.email,
        phoneNumber: "+911231231231",
        // Don't store password in display state for security
      };

      setUsers([...users, newUser]);
      setForm({ username: "", email: "", password: "" });

      Alert.alert(
        "Success",
        `User ${form.username} has been added successfully!`
      );
    } catch (error) {
      console.error("Error adding sub-user:", error.response.data.message);
      Alert.alert("Error", "Failed to add user. Please try again.");
    }
  };

  const removeUser = async (id: number, username: string) => {
    Alert.alert(
      "Confirm Removal",
      `Are you sure you want to remove ${username}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            // In a real app, you'd call an API to remove the user from backend
            // For now, just remove from local state
            setUsers(users.filter((u) => u.id !== id));
            Alert.alert("Success", `${username} has been removed.`);
          },
        },
      ]
    );
  };

  const closeModal = () => {
    setVisible(false);
    // Reset form when closing
    setForm({ username: "", email: "", password: "" });
  };

  return (
    <View style={styles.container}>
      {/* Button to open modal */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.primaryButtonText}>
          Add Users ({users.length}/{maxUsers})
        </Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.heading}>Add Sub-Users</Text>
            <Text style={styles.subText}>
              You can add up to {maxUsers} sub-users. ({users.length}/{maxUsers}{" "}
              added)
            </Text>

            {/* Form Inputs */}
            <TextInput
              placeholder="Username"
              value={form.username}
              onChangeText={(t) => setForm({ ...form, username: t })}
              style={styles.input}
              placeholderTextColor={theme.subText}
              editable={!isAddingUser}
            />
            <TextInput
              placeholder="Email"
              value={form.email}
              onChangeText={(t) => setForm({ ...form, email: t })}
              style={styles.input}
              placeholderTextColor={theme.subText}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isAddingUser}
            />
            <TextInput
              placeholder="Password"
              value={form.password}
              onChangeText={(t) => setForm({ ...form, password: t })}
              secureTextEntry
              style={styles.input}
              placeholderTextColor={theme.subText}
              editable={!isAddingUser}
            />

            <View style={styles.buttonRow}>
              {/* Add Button */}
              <TouchableOpacity
                style={[
                  styles.addButton,
                  {
                    opacity: isAddingUser || users.length >= maxUsers ? 0.6 : 1,
                  },
                ]}
                onPress={addUser}
                disabled={isAddingUser || users.length >= maxUsers}
              >
                {isAddingUser ? (
                  <ActivityIndicator size="small" color={theme.headText} />
                ) : (
                  <Text style={styles.primaryButtonText}>
                    {users.length >= maxUsers ? "Limit Reached" : "Add User"}
                  </Text>
                )}
              </TouchableOpacity>

              {/* Close Modal */}
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={closeModal}
                disabled={isAddingUser}
              >
                <Text style={styles.secondaryButtonText}>Close</Text>
              </TouchableOpacity>
            </View>

            {/* Added Users List */}
            {users.length > 0 && (
              <>
                <Text style={styles.listTitle}>Added Users:</Text>
                <FlatList
                  data={users}
                  keyExtractor={(item) => item.id.toString()}
                  style={{ maxHeight: 200 }}
                  renderItem={({ item }) => (
                    <View style={styles.card}>
                      <View style={styles.userInfo}>
                        <Text style={styles.cardTitle}>{item.username}</Text>
                        <Text style={styles.cardSubtitle}>{item.email}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => removeUser(item.id, item.username)}
                        disabled={isAddingUser}
                      >
                        <Text style={styles.removeBtn}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </>
            )}

            {users.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No users added yet</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

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
    container: { flex: 1, alignItems: "center" },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalBox: {
      width: "95%",
      maxHeight: "80%",
      backgroundColor: theme.background,
      borderRadius: 16,
      padding: 20,
      elevation: 10,
    },
    heading: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 8,
      textAlign: "center",
      color: theme.headText,
    },
    subText: {
      fontSize: 14,
      color: theme.subText,
      textAlign: "center",
      marginBottom: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.subText,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 12,
      color: theme.headText,
      fontSize: 16,
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    addButton: {
      flex: 1,
      marginRight: 10,
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: "center",
      backgroundColor: theme.tint,
      borderWidth: 1,
      borderColor: theme.headText,
    },
    primaryButton: {
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: "center",
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.headText,
      width: "100%",
    },
    primaryButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.headText,
    },
    secondaryButton: {
      flex: 1,
      marginLeft: 10,
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.subText,
    },
    secondaryButtonText: {
      fontSize: 15,
      color: theme.headText,
    },
    listTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.headText,
      marginBottom: 10,
    },
    card: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.subText,
      borderRadius: 10,
      padding: 12,
      marginBottom: 8,
      backgroundColor: theme.tint || theme.background,
    },
    userInfo: {
      flex: 1,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.headText,
      marginBottom: 2,
    },
    cardSubtitle: {
      fontSize: 14,
      color: theme.subText,
    },
    removeBtn: {
      color: "red",
      fontWeight: "bold",
      padding: 8,
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    emptyStateText: {
      fontSize: 16,
      color: theme.subText,
      fontStyle: "italic",
    },
  });
}
