import { useSignupMutation } from "@/hooks/queries/users";
import { useThemeContext } from "@/hooks/useThemeContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignupScreen() {
  const { theme } = useThemeContext();
  const router = useRouter();
  const { mutateAsync, isPending } = useSignupMutation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const onSubmit = async () => {
    await mutateAsync({ username, email, password, phoneNumber });
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create Account</Text>
      <TextInput
        placeholder="Username"
        placeholderTextColor="grey"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Email"
        placeholderTextColor="grey"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="grey"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        placeholder="Phone Number"
        placeholderTextColor="grey"
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TouchableOpacity
        style={[styles.button, { borderColor: theme.icon }]}
        onPress={onSubmit}
        disabled={isPending}
      >
        <Text style={[styles.buttonText, { color: theme.icon }]}>
          {isPending ? "Creating..." : "Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    padding: 16,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#333",
  },
  button: {
    marginTop: 8,
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonText: {
    fontWeight: "bold",
  },
});
