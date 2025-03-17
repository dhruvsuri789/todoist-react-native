import { useAuth } from "@clerk/clerk-expo";
import { Button, StyleSheet, Text, View } from "react-native";

const Index = () => {
  const { signOut } = useAuth();

  return (
    <View>
      <Text>Index</Text>
      <Button title="Sign Out" onPress={() => signOut()} />
    </View>
  );
};

export default Index;
const styles = StyleSheet.create({});
