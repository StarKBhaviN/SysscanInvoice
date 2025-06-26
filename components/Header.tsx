import { useThemeContext } from "@/hooks/useThemeContext";
import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { CompanyDropdownWithChips } from "./ui/CompanySelectionDropdown";
import { ShowModal } from "./ui/ShowModal";

export default function Header() {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Image
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            resizeMode: "contain",
          }}
          source={require("@/assets/images/header/headerSysscanLogo.png")}
        />
      </View>
      <View style={styles.headingContent}>
        <Text
          style={{
            marginBottom: 2,
            color: theme.headText,
            fontSize: 16,
          }}
        >
          SYSSCAN SOFTWARE
        </Text>
        <Pressable onPress={() => setIsModalVisible(true)}>
          <Text style={{ marginBottom: 0, color: theme.headText }}>
            Company Name (Select Company)
          </Text>
        </Pressable>
        <Text style={{ marginBottom: 0, color: theme.headText, fontSize: 10 }}>
          2500 rs
        </Text>
      </View>

      {/* Custom Modal */}
      <ShowModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        title="Select Company"
        showSaveBtn={false}
      >
        <CompanyDropdownWithChips
          companies={["Company A", "Company B", "Company C", "Company D"]}
          onSelectionChange={(selected) => console.log("Selected:", selected)}
        />
      </ShowModal>
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
      backgroundColor: theme.tint,
      height: 80,
      padding: 10,
      flexDirection: "row",
    },
    logoBox: {
      width: 110,
      height: "100%",
      marginRight: 12,
    },
    headingContent: {
      flexGrow: 1,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
      backgroundColor: "#fff",
      padding: 20,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      width: "80%",
    },
  });
}
