import { useNavigation } from "@react-navigation/native";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BODY_FONT, BODY_FONT_BOLD } from "../../constants/typography";
import { GAME_COLORS } from "../../constants/colours";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ROUTE } from "../../constants/constants";

interface QuitModalProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  onQuit?: () => void;
}

const QuitModal = ({ showModal, setShowModal, onQuit }: QuitModalProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const handleConfirmQuit = () => {
    if (onQuit) {
      onQuit();
    } else {
      navigation.replace(ROUTE.HOME);
    }
    setShowModal(false);
  };

  return (
    <Modal visible={showModal} transparent={true} animationType="fade">
      <View style={styles.modalContainer}>
        <Text style={styles.modalText}>
          Are you sure you want to quit? You will lose your progress!
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleConfirmQuit}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowModal(false)}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  modalText: {
    ...BODY_FONT,
    textAlign: "center",
    marginBottom: 20,
    width: "80%",
  },
  button: {
    backgroundColor: GAME_COLORS.primary_button,
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  buttonText: {
    ...BODY_FONT_BOLD,
  },
});

export default QuitModal;
