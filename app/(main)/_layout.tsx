// app/(main)/_layout.tsx
import FooterNav from "@/components/FooterNav";
import Header from "@/components/Header";
import { Slot } from "expo-router";
import { SafeAreaView, StyleSheet, View } from "react-native";

export default function MainLayout() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Slot /> {/* Renders the page content */}
      </View>
      <FooterNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
