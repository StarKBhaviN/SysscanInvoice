import { useCompanyContext } from "@/context/companyContext";
import { useUserContext } from "@/context/userContext";
import { useThemeContext } from "@/hooks/useThemeContext";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Profile() {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);
  const { user } = useUserContext();
  const { companies } = useCompanyContext();

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileImage}>
          {user?.profileImage && (
            <Image
              source={{
                uri: "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg",
              }}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
          )}
          <Text>Image</Text>
        </View>
        <View>
          <Text style={styles.name}>{user?.username || "Unknown User"}</Text>
          <Text style={styles.role}>{user?.role || "No Role Provided"}</Text>
        </View>
      </View>

      {/* Company Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Companies</Text>
        {companies.map((company, index) => (
          <Text key={index} style={styles.cardItem}>
            {company.name}
          </Text>
        ))}
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>Manage Companies</Text>
        </TouchableOpacity>
      </View>

      {/* Subscription Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Subscription Details</Text>
        <Text style={styles.cardItem}>Remaining Time : 3 Months</Text>
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>Payment History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Renew Subscription</Text>
        </TouchableOpacity>
      </View>

      {/* Users Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Added Users (4/4)</Text>
        <Text style={styles.cardItem}>
          You can add only 4 users in your current plan.
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <View style={styles.userRow}>
            {[...Array(4)].map((_, i) => (
              <View key={i} style={styles.userItem}>
                <View style={styles.avatar}></View>
                <Text style={{ color: theme.subText }}>User</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={{ color: theme.icon }}>View All</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notifications Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Notifications</Text>
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>Manage Notifications</Text>
        </TouchableOpacity>
      </View>

      {/* Developer Contact Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Developer Info</Text>
        <Text style={styles.cardItem}>Contact : stark.bhavin@gmail.com</Text>
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>Contact Support</Text>
        </TouchableOpacity>
      </View>

      {/* Sync Button */}
      <TouchableOpacity style={styles.syncButton}>
        <Text style={styles.syncText}>Sync New Data</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function createStyles(
  theme: {
    headText: any;
    subText: any;
    background: any;
    tint: any;
    icon: any;
    tabIconDefault?: string;
    tabIconSelected?: string;
  },
  colorScheme: string
) {
  return StyleSheet.create({
    container: {
      padding: 8,
      backgroundColor: theme.background,
    },
    profileHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    profileImage: {
      height: 80,
      width: 80,
      borderRadius: 40,
      borderWidth: 2,
      marginRight: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    name: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.headText,
    },
    role: {
      fontSize: 14,
      color: theme.subText,
    },
    card: {
      backgroundColor: theme.tint,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
      color: theme.headText,
    },
    cardItem: {
      fontSize: 14,
      color: theme.subText,
      marginBottom: 4,
    },
    linkButton: {
      marginTop: 8,
    },
    linkText: {
      color: theme.icon,
      textDecorationLine: "underline",
    },
    actionButton: {
      marginTop: 12,
      backgroundColor: theme.background,
      paddingVertical: 10,
      borderRadius: 10,
      alignItems: "center",
    },
    actionText: {
      color: theme.headText,
      fontWeight: "bold",
    },
    userRow: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      marginTop: 10,
      justifyContent: "space-between",
      flex: 0.9,
    },
    userItem: {
      alignItems: "center",
      marginBottom: 10,
    },
    avatar: {
      height: 40,
      width: 40,
      borderRadius: 20,
      borderWidth: 1,
      marginBottom: 4,
    },
    viewAllButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderWidth: 1,
      borderRadius: 20,
      borderColor: theme.icon,
    },
    syncButton: {
      backgroundColor: theme.tint,
      padding: 14,
      borderRadius: 14,
      alignItems: "center",
      marginBottom: 12,
    },
    syncText: {
      color: theme.headText,
      fontWeight: "bold",
    },
  });
}
