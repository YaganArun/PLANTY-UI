import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Modal,
  Image,
  ActivityIndicator,
} from "react-native";
import { Camera } from "expo-camera";
import * as firebase from "firebase";
import * as ScreenOrientation from "expo-screen-orientation";
// custom comps
import Component from "./Content";
import ApiKey from "../constants/ApiKey";
import { deleteAsync } from "expo-file-system";

// firebase initilization
firebase.initializeApp(ApiKey);

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [imageUri, setImageUri] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [leafDetails, setLeafDetails] = useState({
    leaf: "NIL",
    details: "NIL",
    status: "NIL",
  });

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator animating={animating} size="large" />
      <View style={styles.topBar}>
        <Text style={styles.title}>P L A N T Y</Text>
      </View>
      <Camera
        style={{ flex: 1 }}
        type={type}
        ref={(ref) => {
          setCameraRef(ref);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            justifyContent: "flex-end",
          }}
        ></View>
      </Camera>
      <View style={styles.dock}>
        <TouchableOpacity
          style={{ alignSelf: "center" }}
          onPress={async () => {
            if (cameraRef) {
              let photo = await cameraRef.takePictureAsync({
                base64: true,
              });
              setImageUri(photo.uri);
              setAnimating(true); // show loading
              await uploadImageToFirebase(photo.uri, "leaf_image"); // wait for image to be uploaded
              orient = await ScreenOrientation.getOrientationAsync();
              console.log(orient);
              let response = await fetch(
                "http://172.20.10.9:8080/getLeafDetails",
                {
                  method: "GET",
                }
              );
              let responseJson = await response.json();
              setAnimating(false); // close loading
              setModalVisible(!isModalVisible);
              setLeafDetails(responseJson);
            }
          }}
        >
          <View
            style={{
              borderWidth: 2,
              borderRadius: "50%",
              borderColor: "white",
              height: 50,
              width: 50,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                borderWidth: 2,
                borderRadius: "50%",
                borderColor: "white",
                height: 40,
                width: 40,
                backgroundColor: "white",
              }}
            ></View>
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <Modal
          animationType={"slide"}
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has now been closed.");
          }}
        >
          <View style={styles.modal}>
            <View style={{ alignItems: "center" }}>
              <Image source={{ uri: imageUri }} style={styles.modalImage} />
            </View>
            <View>
              <Component leaf={leafDetails} />
            </View>
            <View style={styles.modalCloseButtonCon}>
              <TouchableOpacity
                onPress={async () => {
                  await deleteAsync(imageUri); // delete the temp file after closing overlay
                  setModalVisible(!isModalVisible);
                }}
              >
                <View
                  style={{
                    borderWidth: 2,
                    borderRadius: "50%",
                    borderColor: "black",
                    height: 40,
                    width: 40,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View>
                    <Text style={styles.modalCloseButton}>X</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    margin: 20,
  },

  title: {
    marginTop: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "black",
    color: "white",
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
  },

  container: {
    flex: 3,
    justifyContent: "center",
    backgroundColor: "#000000",
  },

  dock: {
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    padding: 24,
  },
  modal: {
    backgroundColor: "white",
    width: "95%",
    height: "78%",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#fff",
    marginTop: 80,
    marginLeft: 10,
    marginRight: 10,
  },
  modalImage: {
    marginTop: 20,
    width: 180,
    height: 180,
    borderRadius: 30,
  },
  modalCloseButtonCon: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 30,
  },
  modalCloseButton: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

const uploadImageToFirebase = async (uri, imageName) => {
  let response = await fetch(uri);
  let blob = await response.blob();
  var ref = firebase
    .storage()
    .ref()
    .child("images/" + imageName);
  return ref.put(blob);
};
