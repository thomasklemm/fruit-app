import React from "react";

import CameraView from "./components/CameraView";
import SnapView from "./components/SnapView";
import ResultsView from "./components/ResultsView";

export default class App extends React.Component {
  state = {
    snap: null,
    submitted: false
  };

  setSnap = snap => {
    this.setState({ snap: snap, submitted: false });
  };

  resetSnap = () => {
    this.setState({ snap: null, submitted: false });
  };

  submitSnap = () => {
    this.setState({ submitted: true });
  };

  render() {
    const { snap, submitted } = this.state;
    if (submitted) {
      return <ResultsView snap={snap} resetSnap={this.resetSnap} />;
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
