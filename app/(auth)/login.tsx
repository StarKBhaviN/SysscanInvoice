import { useUserContext } from "@/context/userContext";
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
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

export default function LoginScreen() {
  const { theme, colorScheme } = useThemeContext();
  const { login } = useUserContext();

  const styles = createStyles(theme, colorScheme);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.mainLabel}>SIGN IN</Text>

      <View style={styles.inpContainer}>
        <Text style={styles.inpLabel}>User Name</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.inputs}
          placeholder="Email Address"
          placeholderTextColor="grey"
        />
      </View>

      <View style={styles.inpContainer}>
        <Text style={styles.inpLabel}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          style={styles.inputs}
          placeholder="Password"
          placeholderTextColor="grey"
          secureTextEntry
        />
      </View>

      <View style={[styles.inpContainer, { alignItems: "center" }]}>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => login(email, password)}
        >
          <Text style={styles.btnText}>SIGN IN</Text>
        </TouchableOpacity>

        <Text style={{ color: theme.subText }}>Forgot password?</Text>

        <TouchableOpacity
          style={[
            styles.signInButton,
            { backgroundColor: theme.background, borderWidth: 0 },
          ]}
          onPress={() => router.push("/signup")}
        >
          <Text
            style={[
              styles.btnText,
              { fontSize: 20, padding: 5, color: "#8FAACC" },
            ]}
          >
            Create Account
          </Text>
        </TouchableOpacity>
      </View>
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
    container: {
      flex: 1,
    },
    mainLabel: {
      color: theme.headText,
      fontSize: 32,
      marginBottom: 12,
    },
    inpContainer: {
      marginBottom: 24,
    },
    inpLabel: {
      color: theme.subText,
      fontSize: hp(1.7),
      marginBottom: 4,
    },
    inputs: {
      borderWidth: 1,
      borderColor: theme.subText,
      borderRadius: 10,
      paddingHorizontal: 12,
      color: theme.subText,
    },
    signInButton: {
      width: wp(50),
      padding: 5,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: "#778DA9",
      borderRadius: 100,
      marginTop: 20,
      marginBottom: 8,
    },
    btnText: {
      color: "#8FAACC",
      fontSize: 24,
    },
  });
}
