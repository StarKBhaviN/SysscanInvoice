// app/(auth)/_layout.tsx
import { useThemeContext } from "@/hooks/useThemeContext";
import { Slot } from "expo-router";
import { Image, ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function AuthLayout() {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);

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
            {/* <Text style={{ color: "white", fontSize: 20 }}>
              SYSSCAN SOFTWARE
            </Text> */}
            <View style={{marginTop : 14, height : hp(22), width : wp(100)}}>
              <Image
                style={{ flex: 1, width: "100%", height: "100%", resizeMode: "contain" }}
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
      // height: hp(55),
      borderRadius: 24,
      backgroundColor: theme.tint,
      borderBottomLeftRadius : 0,
      borderBottomRightRadius : 0,
      paddingVertical: 30,
      paddingHorizontal: 26
    },
    headingIcon: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 20,
    },
  });
}
