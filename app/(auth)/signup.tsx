import AddUsersModal from "@/components/AddUserModal";
import PlanCard from "@/components/ui/PlanCard";
import { useCreatePairingMutation } from "@/hooks/queries/pairing";
import {
  useCheckoutMutation,
  usePaymentWebhookMutation,
} from "@/hooks/queries/payment";
import {
  useLoginMutation,
  useRefreshTokenMutation,
  useSignupMutation,
} from "@/hooks/queries/users";
import { useThemeContext } from "@/hooks/useThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const steps = [
  "Basic Details",
  "Subscription",
  "Payment",
  "Pairing",
  "Add Users",
  "Success",
];

export default function SignupScreen() {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);

  const router = useRouter();
  const { mutateAsync: signUp, isPending } = useSignupMutation();
  const {
    mutateAsync: login,
    // isPending: isLoginPending,
    // isSuccess: isLoginSuccess,
  } = useLoginMutation();
  const { mutateAsync: paymentCheckout, isPending: isCheckoutPending } =
    useCheckoutMutation();
  const { mutateAsync: paymentWebhook, isPending: isWebhookPending } =
    usePaymentWebhookMutation();
  const { mutateAsync: refreshToken, isPending: isRefreshPending } =
    useRefreshTokenMutation();
  const { mutateAsync: createPairing, isPending: isPairingPending } =
    useCreatePairingMutation();

  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [plan, setPlan] = useState("");
  const [pairingCode, setPairingCode] = useState("");

  const [userData, setUserData] = useState<{
    id: number;
    email: string;
  } | null>(null);
  const [currentToken, setCurrentToken] = useState<string | null>("");

  useEffect(() => {
    const checkToken = async () => {
      const storedToken = await AsyncStorage.getItem("Invoice_Token");
      if (storedToken) {
        await AsyncStorage.removeItem("Invoice_Token");
        setStep(0);
      }
    };
    checkToken();
  }, []);

  const nextStep = () =>
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleSignup = async () => {
    const signUpRes = await signUp({ username, email, password, phoneNumber });
    const loginRes = await login({ email, password });
    const token = loginRes.accessToken;
    setCurrentToken(token);
    await AsyncStorage.setItem("Invoice_Token", token);
    setUserData({ id: signUpRes.id, email: signUpRes.email });

    nextStep();
  };

  const handlePayment = async () => {
    try {
      if (!userData || !currentToken) {
        Alert.alert("Error", "User data not found. Please restart signup.");
        return;
      }

      // Step 1: Initiate checkout
      const checkoutRes = await paymentCheckout({
        amount: plan === "2" ? 199 : 349,
        provider: "stripe", // or your payment provider
      });

      console.log("Checkout initiated:", checkoutRes);

      // Step 2: Simulate webhook (in production, this would be called by payment provider)
      const webhookRes = await paymentWebhook({
        event: "payment.succeeded",
        data: {
          userId: userData.id,
          amount: plan === "2" ? 199 : 349,
          status: "succeeded",
        },
      });

      console.log("Webhook processed:", webhookRes);

      // Step 3: Refresh token to get updated role (ADMIN)
      const refreshRes = await refreshToken();
      if (refreshRes.accessToken) {
        setCurrentToken(refreshRes.accessToken);
        await AsyncStorage.setItem("Invoice_Token", refreshRes.accessToken);
        console.log("Token refreshed with ADMIN role");
      }

      console.log("Payment Success, role upgraded to ADMIN");
      nextStep();
    } catch (error) {
      console.error("Payment error:", error);
      Alert.alert("Error", "Payment failed. Please try again.");
    }
  };

  const handlePairing = async () => {
    try {
      if (pairingCode.trim()) {
        // Create pairing code
        const pairingRes = await createPairing();
        console.log("Pairing code created:", pairingRes);
        // In a real app, you'd use the pairingCode entered by user to activate
      }
      nextStep();
    } catch (error) {
      console.error("Pairing error:", error);
      // Continue anyway since pairing is optional
      nextStep();
    }
  };

  const handleFinish = () => {
    router.replace("/home");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <View style={styles.container}>
        <View style={styles.progressBarContainer}>
          {steps.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressStep,
                {
                  backgroundColor: i <= step ? theme.icon : theme.background,
                },
              ]}
            />
          ))}
        </View>
        <Text style={styles.stepLabel}>
          Step {step + 1} of {steps.length} - {steps[step]}
        </Text>

        {/* Step Content */}
        <View style={styles.content}>
          {step === 0 && (
            <>
              <Text style={styles.heading}>Create Account</Text>
              <TextInput
                placeholder="Username"
                placeholderTextColor="#888"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
              />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#888"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#888"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TextInput
                placeholder="Phone Number"
                placeholderTextColor="#888"
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
              <TouchableOpacity
                style={[styles.primaryButton]}
                onPress={handleSignup}
                disabled={isPending}
              >
                <Text style={styles.primaryButtonText}>
                  {isPending ? "Creating..." : "Next"}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {step === 1 && (
            <>
              <Text style={styles.heading}>Choose a Subscription</Text>
              <PlanCard
                title="2 Users"
                description="Best for small teams"
                value="2"
                amount="199"
                selectedPlan={plan}
                setSelectedPlan={setPlan}
              />
              <PlanCard
                title="4 Users"
                description="For growing businesses"
                value="4"
                amount="349"
                selectedPlan={plan}
                setSelectedPlan={setPlan}
              />
              <TouchableOpacity
                style={[styles.primaryButton]}
                onPress={nextStep}
                disabled={!plan}
              >
                <Text style={styles.primaryButtonText}>Continue</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.heading}>Payment</Text>
              <Text style={styles.subText}>
                Securely complete your payment to activate subscription
              </Text>
              <TouchableOpacity
                style={[styles.primaryButton]}
                onPress={handlePayment}
                disabled={
                  isCheckoutPending || isWebhookPending || isRefreshPending
                }
              >
                <Text style={styles.primaryButtonText}>
                  {isCheckoutPending || isWebhookPending || isRefreshPending
                    ? "Processing..."
                    : "Pay & Continue"}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {step === 3 && (
            <>
              <Text style={styles.heading}>Pair Desktop App</Text>
              <TextInput
                placeholder="Enter Pairing Code"
                style={styles.input}
                value={pairingCode}
                onChangeText={setPairingCode}
                placeholderTextColor={theme.placeholderText}
              />
              <TouchableOpacity
                style={[styles.primaryButton]}
                onPress={handlePairing}
                disabled={isPairingPending}
              >
                <Text style={styles.primaryButtonText}>
                  {isPairingPending ? "Pairing..." : "Continue"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={nextStep}
              >
                <Text style={styles.secondaryButtonText}>Skip</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 4 && (
            <>
              <Text style={styles.heading}>Add Users?</Text>
              <Text style={styles.subText}>
                As an ADMIN, you can add up to {plan} sub-users
              </Text>
              <AddUsersModal maxUsers={Number(plan)} />
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={nextStep}
              >
                <Text style={styles.secondaryButtonText}>Skip</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 5 && (
            <>
              <Text style={styles.heading}>🎉 Signup Completed!</Text>
              <Text style={styles.subText}>
                Welcome aboard! Your account is now ready with ADMIN privileges.
              </Text>
              <Text style={styles.subText}>User: {userData?.email}</Text>
              <TouchableOpacity
                style={[styles.primaryButton]}
                onPress={handleFinish}
              >
                <Text style={styles.primaryButtonText}>Go to Dashboard</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Back Navigation */}
        {step > 1 && step < steps.length - 1 && (
          <View style={styles.footer}>
            <TouchableOpacity style={styles.secondaryButton} onPress={prevStep}>
              <Text style={styles.secondaryButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
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
    container: { flex: 1 },
    progressBarContainer: {
      flexDirection: "row",
      height: 6,
      borderRadius: 3,
      overflow: "hidden",
      marginBottom: 16,
    },
    progressStep: {
      flex: 1,
      marginHorizontal: 2,
      borderRadius: 3,
    },
    stepLabel: {
      textAlign: "center",
      marginBottom: 16,
      fontWeight: "600",
      color: theme.headText,
    },
    content: { flex: 1, justifyContent: "center" },
    heading: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 12,
      color: theme.headText,
    },
    subText: {
      fontSize: 14,
      color: theme.headText,
      textAlign: "center",
      marginBottom: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.subText,
      borderRadius: 10,
      paddingHorizontal: 12,
      marginBottom: 12,
      // backgroundColor: theme.background,
      // fontSize: 16,
      color: theme.headText,
    },

    primaryButton: {
      marginTop: 16,
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: "center",
      backgroundColor: theme.background,
    },
    primaryButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.headText,
    },
    secondaryButton: {
      marginTop: 10,
      borderRadius: 10,
      padding: 12,
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#ccc",
    },
    secondaryButtonText: { fontSize: 15, color: theme.headText },
    footer: { flexDirection: "row", justifyContent: "space-between" },
  });
}
