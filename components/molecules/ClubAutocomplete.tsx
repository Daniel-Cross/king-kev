import { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Club, Country } from "../../constants/enums";
import { normalizeName } from "../../helpers/nameHelpers";
import { PRIMARY } from "../../constants/colours";
import { BODY_FONT } from "../../constants/typography";
import Ionicons from "@expo/vector-icons/Ionicons";

interface ClubAutocompleteProps {
  value: string;
  country: Country;
  clubs: Club[];
  onChangeText: (text: string) => void;
  onSelectClub: (club: Club) => void;
  placeholder?: string;
  style?: any;
}

const ClubAutocomplete = ({
  value,
  country,
  clubs,
  onChangeText,
  onSelectClub,
  placeholder = "Club name",
  style,
}: ClubAutocompleteProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Get clubs for the selected country
  const clubsForCountry = useMemo(
    () => clubs.filter((club) => club.country === country),
    [clubs, country]
  );

  // Filter clubs based on input and country
  useEffect(() => {
    if (!isFocused) {
      setFilteredClubs([]);
      setShowSuggestions(false);
      return;
    }

    // If input is empty, show all clubs for the country (up to 20)
    // If input has text, filter clubs that match
    if (!value.trim()) {
      // Show all clubs for the country when focused and empty
      setFilteredClubs(clubsForCountry.slice(0, 20));
      setShowSuggestions(clubsForCountry.length > 0);
    } else {
      // Filter clubs based on input
      const normalizedInput = normalizeName(value).toLowerCase();
      const matchingClubs = clubsForCountry
        .filter((club) =>
          normalizeName(club.name).toLowerCase().includes(normalizedInput)
        )
        .slice(0, 10); // Limit to 10 suggestions when filtering

      setFilteredClubs(matchingClubs);
      setShowSuggestions(matchingClubs.length > 0);
    }
  }, [value, clubsForCountry, isFocused]);

  const handleSelectClub = (club: Club) => {
    onChangeText(club.name);
    onSelectClub(club);
    setShowSuggestions(false);
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleFocus = () => {
    setIsFocused(true);
    // The useEffect will handle showing clubs when focused
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow for selection
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
    }, 200);
  };

  const clubExists = filteredClubs.some(
    (club) =>
      normalizeName(club.name).toLowerCase() ===
      normalizeName(value).toLowerCase()
  );

  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            clubExists && value.trim() && styles.inputExists,
            !clubExists && value.trim() && styles.inputNew,
          ]}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={PRIMARY.input_icon}
        />
        {value.trim() && (
          <View style={styles.statusIcon}>
            {clubExists ? (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={PRIMARY.green}
              />
            ) : (
              <Ionicons name="add-circle" size={20} color={PRIMARY.orange} />
            )}
          </View>
        )}
      </View>
      {showSuggestions && filteredClubs.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={filteredClubs}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSelectClub(item)}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={PRIMARY.green}
                  style={styles.suggestionIcon}
                />
                <Text style={styles.suggestionText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            style={styles.suggestionsList}
            nestedScrollEnabled={true}
          />
        </View>
      )}
      {value.trim() && !clubExists && (
        <Text style={styles.hintText}>
          This club is not in the database and will be submitted for review
        </Text>
      )}
      {isFocused && !value.trim() && clubsForCountry.length > 0 && (
        <Text style={styles.hintText}>
          Select a club from the list above, or type to search/filter. You can
          also add a new club.
        </Text>
      )}
      {isFocused && !value.trim() && clubsForCountry.length === 0 && (
        <Text style={styles.hintText}>
          No clubs found for this country. Type a club name to add a new one.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: PRIMARY.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: PRIMARY.black_main,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  inputExists: {
    borderColor: PRIMARY.green,
    borderWidth: 2,
  },
  inputNew: {
    borderColor: PRIMARY.orange,
    borderWidth: 2,
  },
  statusIcon: {
    position: "absolute",
    right: 12,
    zIndex: 1,
  },
  suggestionsContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: PRIMARY.white,
    borderRadius: 12,
    marginTop: 4,
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  suggestionIcon: {
    marginRight: 8,
  },
  suggestionText: {
    ...BODY_FONT,
    fontSize: 16,
    color: PRIMARY.black_main,
    flex: 1,
  },
  hintText: {
    ...BODY_FONT,
    fontSize: 12,
    color: PRIMARY.orange,
    marginTop: 4,
    fontStyle: "italic",
  },
});

export default ClubAutocomplete;
