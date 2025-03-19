import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Clipboard from "expo-clipboard";
import { StyleSheet, TouchableOpacity } from "react-native";
import { toast } from "sonner-native";
import * as DropdownMenu from "zeego/dropdown-menu";

type MoreButtonProps = {
  pageName: string;
};

//These paths are used to open apps from outside.
const MoreButton = ({ pageName }: MoreButtonProps) => {
  const copyToClipboard = async () => {
    const path = `todoist://(auth)/(tabs)/${pageName.toLowerCase()}`;
    await Clipboard.setStringAsync(path);
    toast.success("Copied to clipboard");
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <TouchableOpacity style={styles.button} activeOpacity={0.6}>
          <Ionicons
            name="ellipsis-horizontal-outline"
            size={30}
            color={Colors.primary}
          />
        </TouchableOpacity>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item key="link" onSelect={copyToClipboard}>
          <DropdownMenu.ItemTitle>Copy</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon ios={{ name: "link", pointSize: 24 }} />
        </DropdownMenu.Item>
        <DropdownMenu.Group>
          <DropdownMenu.Item key="select">
            <DropdownMenu.ItemTitle>Select Tasks</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemIcon
              ios={{ name: "square.stack", pointSize: 24 }}
            />
          </DropdownMenu.Item>
          <DropdownMenu.Item key="view">
            <DropdownMenu.ItemTitle>View</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemIcon
              ios={{ name: "slider.horizontal.3", pointSize: 24 }}
            />
          </DropdownMenu.Item>
          <DropdownMenu.Item key="activity">
            <DropdownMenu.ItemTitle>Activity Log</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemIcon
              ios={{ name: "chart.xyaxis.line", pointSize: 24 }}
            />
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default MoreButton;
const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
});
