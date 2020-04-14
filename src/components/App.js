// fusioncharts
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import Maps from "fusioncharts/fusioncharts.maps";
import Widgets from "fusioncharts/fusioncharts.widgets";
import USARegion from "fusionmaps/maps/es/fusioncharts.usaregion";
import Pusher from "pusher-js";
import React, { Component } from "react";
import Dropdown from "react-dropdown";
import ReactFC from "react-fusioncharts";
import "./charts-theme";
import HomeBlockDashboard from "./HomeBlockDashboard";
import RobotDashboard from "./RobotDashboard";
import { Container, Nav } from "./styled-components";

ReactFC.fcRoot(FusionCharts, Charts, Maps, USARegion, Widgets);

Charts(FusionCharts);

Pusher.logToConsole = true;

var pusher = new Pusher("b19a4591cdd9ad1d70f7", {
  cluster: "us2",
  forceTLS: true
});

var channel = pusher.subscribe("robot");
class App extends Component {
  constructor() {
    super();
    this.state = {
      items: [],
      dropdownOptions: [],
      selectedValue: "Select robot",
      display: "robot"
    };
  }

  updateDashboard = event => {
    // this.getData(event.value);
    this.setState({ selectedValue: event.value });
  };

  componentDidMount() {
    channel.bind("state", data => {
      // alert(JSON.stringify(data));
      if (data["id"] in this.state.dropdownOptions) {
      } else {
        let new_dropdown_options = this.state.dropdownOptions;
        new_dropdown_options.push(data["id"]);
        this.setState({ dropdownOptions: [...new Set(new_dropdown_options)] });
      }
    });
  }

  showDashboard = () => {
    if (this.state.display === "robot") {
      return <RobotDashboard robot_id={this.state.selectedValue} />;
    } else {
      return <HomeBlockDashboard />;
    }
  };

  changeDashboard = () => {
    if (this.state.display === "robot") {
      this.setState({ display: "homeblock" });
    } else {
      this.setState({ display: "robot" });
    }
  };

  showDropdown = () => {
    if (this.state.display === "robot") {
      return (
        <Container className="navbar-nav ml-auto">
          <Dropdown
            className="pr-2 custom-dropdown"
            options={this.state.dropdownOptions}
            onChange={this.updateDashboard}
            value={"Robot ID:   " + this.state.selectedValue}
            placeholder="Select an option"
          />
        </Container>
      );
    }
  };

  render() {
    return (
      <Container>
        <Nav className="navbar navbar-expand-lg fixed-top is-white is-dark-text">
          <Container className="navbar-brand h1 mb-0 text-large font-medium">
            Smart Scaffolding
          </Container>
          <Container className="navbar-nav ml-auto">
            <Container className="user-detail-section">
              <span className="pr-2">Swarm Construction</span>
            </Container>
          </Container>
        </Nav>

        <Nav className="navbar fixed-top nav-secondary is-dark is-light-text">
          <button
            class="btn btn-primary text-medium"
            onClick={this.changeDashboard}
          >
            Switch Dashboard
          </button>

          {this.showDropdown()}
        </Nav>

        {this.showDashboard()}
        <div className="is-light-text h4 navbar">Made by Caleb Wagner</div>
      </Container>
    );
  }
}

export default App;
