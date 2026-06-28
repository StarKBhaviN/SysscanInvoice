import AddUsersModal from "@/components/AddUserModal";
import PlanCard from "@/components/ui/PlanCard";
import { useCreatePairingMutation } from "@/hooks/queries/pairing";
import { useCheckoutMutation } from "@/hooks/queries/payment";
import {
  useLoginMutation,
  useRefreshTokenMutation,
  useSignupMutation,
} from "@/hooks/queries/users";
import { useThemeContext } from "@/hooks/useThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

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
  const { mutateAsync: login } = useLoginMutation();
  const { mutateAsync: paymentCheckout, isPending: isCheckoutPending } =
    useCheckoutMutation();
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
  const [expiresIn, setExpiresIn] = useState<number | null>(null);
  const [isPaired, setIsPaired] = useState(false);

  const [userData, setUserData] = useState<{
    id: number;
    email: string;
  } | null>(null);
  const [currentToken, setCurrentToken] = useState<string | null>("");

  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [showWebView, setShowWebView] = useState(false);

  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const pairingCheckRef = useRef<NodeJS.Timeout | null>(null);

  const startCountdown = (expiryTime: string) => {
    const expiry = new Date(expiryTime).getTime();
    const now = Date.now();
    const diffSeconds = Math.floor((expiry - now) / 1000);
    setExpiresIn(diffSeconds);

    if (countdownRef.current) clearInterval(countdownRef.current);

    countdownRef.current = setInterval(() => {
      setExpiresIn((prev) => {
        if (prev && prev > 0) return prev - 1;

        if (countdownRef.current) clearInterval(countdownRef.current);
        generatePairingCode(); // auto-generate new code
        return 0;
      });
    }, 1000);
  };

  /** ---------------- Pairing Code Generation ---------------- */
  const generatePairingCode = async () => {
    try {
      const pairingRes = await createPairing();
      if (!pairingRes?.code || !pairingRes?.expiresAt) {
        throw new Error("Invalid pairing response");
      }
      setPairingCode(pairingRes.code);
      startCountdown(pairingRes.expiresAt);
    } catch (err) {
      console.error("Error generating pairing code:", err);
      Alert.alert("Error", "Failed to generate pairing code. Try again.");
    }
  };

  /** ---------------- Signup Flow ---------------- */
  const handleSignup = async () => {
    try {
      const signUpRes = await signUp({
        username,
        email,
        password,
        phoneNumber,
      });
      const loginRes = await login({ email, password });

      const token = loginRes?.accessToken;
      if (!token) throw new Error("Login failed: No token received");

      setCurrentToken(token);
      await AsyncStorage.setItem("Invoice_Token", token);

      setUserData({ id: signUpRes.id, email: signUpRes.email });
      nextStep();
    } catch (err) {
      console.error("Signup error:", err);
      Alert.alert("Signup failed", "Please check your details and try again.");
    }
  };

  /** ---------------- Payment Flow ---------------- */
  const handlePayment = async () => {
    try {
      if (!userData || !currentToken) throw new Error("User data not found.");

      const checkoutRes = await paymentCheckout({
        amount: plan === "2" ? 199 : 349,
        provider: "cashfree",
      });

      const { checkoutUrl, orderId } = checkoutRes;
      setCheckoutUrl(checkoutUrl);
      setShowWebView(true);

      const checkPaymentStatus = async () => {
        try {
          const res = await fetch(
            `${process.env.EXPO_PUBLIC_API_URL}payment/status?order_id=${orderId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${currentToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          const data = await res.json();
          return data?.status || "pending";
        } catch {
          return "pending";
        }
      };

      const intervalId = setInterval(async () => {
        const status = await checkPaymentStatus();

        if (status === "succeeded") {
          clearInterval(intervalId);
          setShowWebView(false);

          const refreshRes = await refreshToken();
          if (refreshRes?.accessToken) {
            setCurrentToken(refreshRes.accessToken);
            await AsyncStorage.setItem("Invoice_Token", refreshRes.accessToken);
          }

          await generatePairingCode();
          nextStep();
        } else if (status === "failed") {
          clearInterval(intervalId);
          setShowWebView(false);
          Alert.alert("Payment failed", "Please try again.");
        }
      }, 3000);
    } catch (error) {
      console.error("Payment error:", error);
      Alert.alert("Error", "Payment initiation failed.");
    }
  };

  /** ---------------- Pairing Status Polling ---------------- */
  useEffect(() => {
    if (!pairingCode) return; // avoid checking when no code

    if (pairingCheckRef.current) clearInterval(pairingCheckRef.current);

    pairingCheckRef.current = setInterval(async () => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}pairing/status/${pairingCode}`
        );
        const data = await res.json();

        if (data?.isActive) {
          setIsPaired(true);
          clearInterval(pairingCheckRef.current!);
          nextStep();
        }
      } catch {
        // suppress logs to avoid spam
      }
    }, 3000);

    return () => {
      if (pairingCheckRef.current) clearInterval(pairingCheckRef.current);
    };
  }, [pairingCode]);

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

  const nextStep = async () => {
    setStep((prev) => {
      const newStep = Math.min(prev + 1, steps.length - 1);
      AsyncStorage.setItem("Signup_Step", String(newStep));
      return newStep;
    });
  };

  const prevStep = async () => {
    setStep((prev) => {
      const newStep = Math.max(prev - 1, 0);
      AsyncStorage.setItem("Signup_Step", String(newStep));
      return newStep;
    });
  };

  useEffect(() => {
    const checkProgress = async () => {
      const storedToken = await AsyncStorage.getItem("Invoice_Token");
      const savedStep = await AsyncStorage.getItem("Signup_Step");

      if (storedToken) {
        setCurrentToken(storedToken);

        if (savedStep !== null) {
          setStep(Number(savedStep));
        } else {
          setStep(1); // start after signup if token exists but step missing
        }
      } else {
        setStep(0); // no token, start fresh
      }
    };

    checkProgress();
  }, []);

  const handleFinish = async () => {
    await AsyncStorage.removeItem("Signup_Step");
    router.replace("/home");
  };

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (pairingCheckRef.current) clearInterval(pairingCheckRef.current);
    };
  }, []);

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
                disabled={isCheckoutPending || isRefreshPending}
              >
                <Text style={styles.primaryButtonText}>
                  {isCheckoutPending || isRefreshPending
                    ? "Processing..."
                    : "Pay & Continue"}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {step === 3 && (
            <>
              <Text style={styles.heading}>Pair Desktop App</Text>
              {pairingCode ? (
                <View style={{ alignItems: "center", marginBottom: 16 }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      color: theme.headText,
                    }}
                  >
                    Code: {pairingCode}
                  </Text>
                  {expiresIn !== null && (
                    <Text style={{ fontSize: 14, color: theme.subText }}>
                      Expires in {expiresIn} sec
                    </Text>
                  )}
                </View>
              ) : (
                <Text style={styles.subText}>Generating code...</Text>
              )}

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

        {showWebView && checkoutUrl && (
          <Modal visible={showWebView} animationType="slide">
            <WebView
              source={{ uri: checkoutUrl }}
              onNavigationStateChange={(navState) => {
                if (navState.url.startsWith("myapp://payment-success")) {
                  alert("Payment successful!");
                  setShowWebView(false);
                  nextStep(); // move to next step
                }
                if (navState.url.startsWith("myapp://payment-failed")) {
                  alert("Payment failed. Please try again.");
                  setShowWebView(false);
                  // optionally let user retry
                }
              }}
            />
            <TouchableOpacity onPress={() => setShowWebView(false)}>
              <Text style={{ textAlign: "center", padding: 10 }}>Close</Text>
            </TouchableOpacity>
          </Modal>
        )}
        {/* Back Navigation */}
        {step > 1 && step !== 3 && step < steps.length - 1 && !isPaired && (
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
