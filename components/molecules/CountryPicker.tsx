import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import { Country } from "../../constants/enums";

interface CountryPickerProps {
  value: Country;
  onValueChange: (value: Country) => void;
  style?: any;
}

const CountryPicker = ({ value, onValueChange, style }: CountryPickerProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const countryOptions = Object.values(Country);

  const handleSelect = (country: Country) => {
    onValueChange(country);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[pickerStyles.container, style]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={pickerStyles.text}>{value}</Text>
        <Text style={pickerStyles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={pickerStyles.modalOverlay}>
          <View style={pickerStyles.modalContent}>
            <View style={pickerStyles.modalHeader}>
              <Text style={pickerStyles.modalTitle}>Select Country</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={pickerStyles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={pickerStyles.optionsList}>
              {countryOptions.map((country) => (
                <TouchableOpacity
                  key={country}
                  style={[
                    pickerStyles.option,
                    value === country && pickerStyles.optionSelected,
                  ]}
                  onPress={() => handleSelect(country)}
                >
                  <Text
                    style={[
                      pickerStyles.optionText,
                      value === country && pickerStyles.optionTextSelected,
                    ]}
                  >
                    {country}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const pickerStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    minWidth: 200,
  },
  text: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  arrow: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    fontSize: 24,
    color: "#666",
  },
  optionsList: {
    maxHeight: 400,
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  optionSelected: {
    backgroundColor: "#e3f2fd",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  optionTextSelected: {
    color: "#007AFF",
    fontWeight: "600",
  },
});

export default CountryPicker;
