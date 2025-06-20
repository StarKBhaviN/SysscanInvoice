import { useThemeContext } from '@/hooks/useThemeContext';
import { StyleSheet, Text, View } from 'react-native';

export default function LoginScreen() {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>This is the Login Form</Text>
    </View>
  );
}

function createStyles(theme: { text?: string; background: any; tint?: string; icon?: string; tabIconDefault?: string; tabIconSelected?: string; }, colorScheme: string) {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      flex: 1,
      alignItems : "center",
      justifyContent : "center"
    },
    heading: {
      // height : hp(4),
      backgroundColor: "white",
      boxShadow: "1px 1px 4px black",
    },
  });
}
