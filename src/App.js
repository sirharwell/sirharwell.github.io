import React, { useState } from "react";
import {
  View,
  Image,
  ImageBackground,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import pandaImage from "./panda.jpg";
import bambooImage from "./bamboo.png";
const App = () => {
  const columns = [
    "Round",
    "Yellow",
    "Purple",
    "Blue",
    "Red",
    "Green",
    "Clear",
    "Pink",
    "Total",
  ];
  const rows = Array.from({ length: 10 }, (_, i) => i + 1);

  const [grid, setGrid] = useState(
    Array.from({ length: 10 }, () => Array.from({ length: 9 }, () => ""))
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    row: null,
    col: null,
    type: null,
  });
  const [inputValue, setInputValue] = useState("");
  const [checkbox, setCheckbox] = useState(false);
  const [redDice, setRedDice] = useState({ diceCount: "", diceSum: "" });

  const calculateTotalSum = () => {
    return grid.reduce((sum, row) => sum + (Number(row[8]) || 0), 0);
  };

  const handleCellPress = (row, col) => {
    if (col === 0) return; // Skip the "Round" column
    const columnName = columns[col];
    if (["Yellow", "Purple", "Green", "Clear", "Pink"].includes(columnName)) {
      setModalData({ row, col, type: columnName });
      setInputValue("");
      setModalVisible(true);
    } else if (columnName === "Blue") {
      setModalData({ row, col, type: columnName });
      setInputValue("");
      setCheckbox(false);
      setModalVisible(true);
    } else if (columnName === "Red") {
      setModalData({ row, col, type: columnName });
      setRedDice({ diceCount: "", diceSum: "" });
      setModalVisible(true);
    }
  };

  const handleInputSubmit = () => {
    const { row, col, type } = modalData;
    const updatedGrid = [...grid];

    if (type === "Yellow") {
      updatedGrid[row][col] = inputValue;
    } else if (type === "Purple") {
      updatedGrid[row][col] = (Number(inputValue) * 2).toString();
    } else if (type === "Blue") {
      const value = checkbox ? Number(inputValue) * 2 : Number(inputValue);
      updatedGrid[row][col] = value.toString();
    } else if (type === "Red") {
      const value = Number(redDice.diceCount) * Number(redDice.diceSum);
      updatedGrid[row][col] = value.toString();
    } else if (["Green", "Clear", "Pink"].includes(type)) {
      updatedGrid[row][col] = inputValue;
    }

    updatedGrid[row][8] = columns
      .slice(1, 8)
      .reduce((sum, _, i) => sum + (Number(updatedGrid[row][i + 1]) || 0), 0)
      .toString();
    setGrid(updatedGrid);
    setModalVisible(false);
  };

  const getCellBackgroundColor = (colIndex) => {
    switch (columns[colIndex]) {
      case "Yellow":
        return "rgba(244, 255, 135, 0.75)";
      case "Purple":
        return "rgba(232, 176, 255, 0.75)";
      case "Blue":
        return "rgba(135, 171, 255, 0.75)";
      case "Red":
        return "rgba(255, 135, 135, 0.75)";
      case "Green":
        return "rgba(135, 255, 135, 0.75)";
      case "Clear":
        return "rgba(255, 255, 255, 0.75)";
      case "Pink":
        return "rgba(255, 192, 203, 0.75)";
      default:
        return "rgba(240, 240, 240, 0.75)";
    }
  };

  const { width, height } = Dimensions.get("window");
  const cellWidth = width / columns.length;
  const cellHeight = height / (rows.length + 3); // Adjust for title and total row

  return (
    <ScrollView contentContainerStyle={styles.container} horizontal>
      <ImageBackground
        source={bambooImage}
        resizeMode="cover"
        style={styles.bambooImage}
      >
        <View>
          <Image source={pandaImage} style={styles.pandaImage} />
          <View style={styles.gridContainer}>
            <View style={styles.row}>
              {columns.map((col, index) => (
                <Text
                  key={index}
                  style={[styles.headerCell, { width: cellWidth }]}
                >
                  {col}
                </Text>
              ))}
            </View>
            {rows.map((rowNum, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {columns.map((_, colIndex) => (
                  <TouchableOpacity
                    key={colIndex}
                    style={[
                      styles.cell,
                      {
                        backgroundColor:
                          colIndex === 0
                            ? "#ddd"
                            : getCellBackgroundColor(colIndex),
                        width: cellWidth,
                        height: cellHeight,
                      },
                    ]}
                    onPress={() => handleCellPress(rowIndex, colIndex)}
                  >
                    <Text style={[styles.cellText, styles.outlinedText]}>
                      {colIndex === 0 ? rowNum : grid[rowIndex][colIndex]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>
              Total Sum: {calculateTotalSum()}
            </Text>
          </View>

          <Modal visible={modalVisible} transparent={true}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {modalData.type === "Red" ? (
                  <>
                    <Text>How many red dice?</Text>
                    <TextInput
                      style={styles.input}
                      value={redDice.diceCount}
                      onChangeText={(text) =>
                        setRedDice({ ...redDice, diceCount: text })
                      }
                      keyboardType="numeric"
                    />
                    <Text>Dice Sum:</Text>
                    <TextInput
                      style={styles.input}
                      value={redDice.diceSum}
                      onChangeText={(text) =>
                        setRedDice({ ...redDice, diceSum: text })
                      }
                      keyboardType="numeric"
                    />
                  </>
                ) : modalData.type === "Blue" ? (
                  <>
                    <Text>Enter blue dice totals:</Text>
                    <TextInput
                      style={styles.input}
                      value={inputValue}
                      onChangeText={setInputValue}
                      keyboardType="numeric"
                    />
                    <View style={styles.checkboxContainer}>
                      <Text>Do you have a sparkly blue?:</Text>
                      <TouchableOpacity onPress={() => setCheckbox(!checkbox)}>
                        <Text style={styles.checkbox}>
                          {checkbox ? "☑" : "☐"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    <Text>Enter a value:</Text>
                    <TextInput
                      style={styles.input}
                      value={inputValue}
                      onChangeText={setInputValue}
                      keyboardType="numeric"
                    />
                  </>
                )}
                <Button title="Submit" onPress={handleInputSubmit} />
              </View>
            </View>
          </Modal>
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  title: {
    marginBottom: 20,
  },
  pandaImage: {
    width: 400, // Adjust size as needed
    height: 100, // Adjust height as needed
    alignSelf: "center",
    marginBottom: 15,
    marginTop: 30,
    borderRadius: 10,
  },
  bambooImage: {
    flex: 1,
    justifyContent: "center",
  },
  gridContainer: { flexDirection: "column", alignItems: "center" },
  row: { flexDirection: "row" },
  headerCell: {
    padding: 10,
    textAlign: "center",
    fontWeight: "bold",
    backgroundColor: "#ddd",
    textShadowColor: "white", // Outline color
    textShadowOffset: { width: 1, height: 1 }, // Adjust offset for thicker/thinner outline
    textShadowRadius: 1, // Adjust blur radius for softer/sharper outline,
  },
  cell: {
    padding: 20,
    borderWidth: 1,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  cellText: { textAlign: "center" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    textShadowColor: "white", // Outline color
    textShadowRadius: 1, // Adjust blur radius for softer/sharper outline,
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: { marginLeft: 10, fontSize: 18 },
  totalContainer: { marginTop: 20, alignItems: "center" },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "white",
    padding: 20,
    borderWidth: 1,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});

export default App;
