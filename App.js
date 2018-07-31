import React from "react";
import axios from "axios";

import CameraView from "./components/CameraView";
import SnapView from "./components/SnapView";
import ResultsView from "./components/ResultsView";

export default class App extends React.Component {
  state = {
    snap: null,
    isSubmitted: false,
    labels: null
  };

  setSnap = snap => {
    this.setState({ snap: snap, isSubmitted: false, labels: null });
  };

  resetSnap = () => {
    this.setState({ snap: null, isSubmitted: false, labels: null });
  };

  fetchLabels = () => {
    this.setState({ isSubmitted: true });
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
    const { snap, isSubmitted, labels } = this.state;
    if (isSubmitted) {
      return (
        <ResultsView snap={snap} labels={labels} resetSnap={this.resetSnap} />
      );
    } else if (snap) {
      return (
        <SnapView
          snap={snap}
          submitSnap={this.fetchLabels}
          resetSnap={this.resetSnap}
        />
      );
    } else {
      return <CameraView setSnap={this.setSnap} resetSnap={this.resetSnap} />;
    }
  }
}
