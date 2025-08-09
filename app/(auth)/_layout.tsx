// app/(auth)/_layout.tsx
import { useUserContext } from "@/context/userContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, ScrollView, StatusBar, StyleSheet, View } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function AuthLayout() {
  const { theme, colorScheme } = useThemeContext();
  const { token, loading } = useUserContext();
  const router = useRouter();

  const styles = createStyles(theme, colorScheme);

  useEffect(() => {
    if (!loading) {
      router.replace("/(main)/home/index");
    }
  }, [loading]);

  console.log("token", token, loading);
  // if (loading || !token) {
  //   return (
  //     <View
  //       style={[
  //         styles.container,
  //         { justifyContent: "center", alignItems: "center" },
  //       ]}
  //     >
  //       <ActivityIndicator size="large" color={theme.subText || "#000"} />
  //     </View>
  //   );
  // }
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={`${colorScheme === "dark" ? "light" : "dark"}-content`}
      />
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headingIcon}>
            <View style={{ marginTop: 14, height: hp(22), width: wp(100) }}>
              <Image
                style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                  resizeMode: "contain",
                }}
                source={require("@/assets/images/auth/SysscanLogo.png")}
              />
            </View>
          </View>

          <View style={styles.bottomBar}>
            <Slot />
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function createStyles(
  theme: {
    text?: string;
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
      backgroundColor: theme.background,
      flex: 1,
    },
    bottomBar: {
      borderRadius: 24,
      backgroundColor: theme.tint,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      paddingVertical: 30,
      paddingHorizontal: 26,
    },
    headingIcon: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 20,
    },
  });
}
