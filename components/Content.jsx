import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Component(props) {
  return (
    <View>
      <View style={styles.speciesNameContainer}>
        <Text style={styles.speciesName}>{props.leaf.leaf}</Text>
      </View>
      <View>
        <Text style={styles.scientificName}>
          Scientific Name : {props.leaf.scientific_name}
        </Text>
      </View>
      <View>
        <Text style={styles.kingdom}>Kingdom : {props.leaf.kingdom}</Text>
      </View>
      <View>
        <Text style={styles.family}>Family : {props.leaf.family}</Text>
      </View>
      <Text style={styles.descLabel}> Description : </Text>
      <View style={styles.speciesDetailsContainer}>
        <Text style={styles.speciesDetails}>{props.leaf.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  speciesNameContainer: {
    margin: 20,
    alignItems: "center",
  },
  speciesName: {
    fontSize: 30,
    fontWeight: "bold",
    color: "green",
  },
  scientificName: {
    margin: 5,
    fontSize: 18,
    fontWeight: "bold",
  },
  kingdom: {
    margin: 5,
    fontSize: 18,
    fontWeight: "bold",
  },
  family: {
    margin: 5,
    fontSize: 18,
    fontWeight: "bold",
  },
  descLabel: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 2,
  },
  speciesDetailsContainer: {
    margin: 5,
  },
  speciesDetails: {
    fontSize: 18,
  },
});
