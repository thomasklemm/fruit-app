import React from "react";
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  View
} from "react-native";
import { Camera, ImagePicker, Permissions } from "expo";
import axios from "axios";

export default class App extends React.Component {
  state = {
    snap: null,
    labels: null
  };

  setSnap = snap => {
    this.setState({ snap: snap, labels: null });
  };

  resetSnap = () => {
    this.setState({ snap: null, labels: null });
  };

  submitSnap = () => {
    const { snap } = this.state;
    axios
      .post(
        "https://cxl-services.appspot.com/proxy?url=https%3A%2F%2Fvision.googleapis.com%2Fv1%2Fimages%3Aannotate",
        {
          requests: [
            {
              image: {
                content: snap.base64
              },
              features: [{ type: "LABEL_DETECTION", maxResults: 5 }]
            }
          ]
        }
      )
      .then(response => {
        const labels = response.data.responses[0].labelAnnotations;
        this.setState({ labels: labels });
      });
  };

  render() {
    const { snap, labels } = this.state;
    if (labels) {
      return (
        <ResultsView labels={labels} snap={snap} resetSnap={this.resetSnap} />
      );
    } else if (snap) {
      return (
        <SnapView
          snap={snap}
          submitSnap={this.submitSnap}
          resetSnap={this.resetSnap}
        />
      );
    } else {
      return <CameraView setSnap={this.setSnap} resetSnap={this.resetSnap} />;
    }
  }
}

class CameraView extends React.Component {
  state = {
    hasCameraPermission: null,
    hasCameraRollPermission: null
  };

  componentWillMount() {
    this.askForCameraPermissions();
  }

  askForCameraPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  };

  askForCameraRollPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({ hasCameraRollPermission: status === "granted" });
  };

  takeSnap = async camera => {
    const snap = await camera.takePictureAsync({
      quality: 0.15,
      base64: true
    });
    this.props.setSnap(snap);
  };

  pickSnap = async () => {
    await this.askForCameraRollPermissions();
    await this.launchImagePicker();
  };

  launchImagePicker = async () => {
    const snap = await ImagePicker.launchImageLibraryAsync({
      quality: 0.15,
      base64: true
    });

    if (!snap.cancelled) {
      this.props.setSnap(snap);
    } else {
      this.props.resetSnap();
    }
  };

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <Text>
            Waiting for camera access. You should see a dialog asking for camera
            permissions in a moment...
          </Text>
        </SafeAreaView>
      );
    } else if (hasCameraPermission === false) {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <Text>
            Camera access doesn't seem to be granted. Please allow camera
            access..
          </Text>
        </SafeAreaView>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            style={{ flex: 1 }}
            ref={ref => {
              this.camera = ref;
            }}
          >
            <SafeAreaView style={{ flex: 1 }}>
              <Headline>Fruit App</Headline>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.buttonElement}
                  onPress={this.pickSnap}
                >
                  <Text style={styles.buttonText}>Select a Snap</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonElement}
                  onPress={() => this.takeSnap(this.camera)}
                >
                  <Text style={styles.buttonText}>Take a Snap</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </Camera>
        </View>
      );
    }
  }
}

const SnapView = ({ snap, submitSnap, resetSnap }) => {
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={snap} style={{ width: "100%", height: "100%" }}>
        <SafeAreaView style={{ flex: 1 }}>
          <Headline>Your Snap</Headline>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.buttonElement} onPress={resetSnap}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonElement} onPress={submitSnap}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const ResultsView = ({ snap, labels, resetSnap }) => {
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={snap} style={{ width: "100%", height: "100%" }}>
        <SafeAreaView style={{ flex: 1 }}>
          <Headline>Results</Headline>
          <View>
            {labels.map(result => {
              const label = result.description;
              return (
                <Text key={label}>
                  {label}, Score: {Math.floor(result.score * 100)}%
                </Text>
              );
            })}
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.buttonElement} onPress={resetSnap}>
              <Text style={styles.buttonText}>Take another snap</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const Headline = props => {
  return <Text style={styles.headlineText}>{props.children}</Text>;
};

const styles = StyleSheet.create({
  headlineText: {
    alignSelf: "center",
    marginTop: 12,
    fontSize: 42,
    fontWeight: "bold",
    color: "white"
  },
  buttonRow: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row"
  },
  buttonElement: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingTop: 16,
    paddingBottom: 16
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white"
  }
});
