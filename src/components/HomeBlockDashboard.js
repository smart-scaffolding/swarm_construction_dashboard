// fusioncharts
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import Widgets from "fusioncharts/fusioncharts.widgets";
import Pusher from "pusher-js";
import React, { Component } from "react";
import ReactFC from "react-fusioncharts";
import "./charts-theme";
import Console from "./Console";
import { Container } from "./styled-components";

ReactFC.fcRoot(FusionCharts, Charts, Widgets);

Charts(FusionCharts);

Pusher.logToConsole = true;

var pusher = new Pusher("b19a4591cdd9ad1d70f7", {
  cluster: "us2",
  forceTLS: true
});

var channel = pusher.subscribe("homeblock");

export default class HomeBlockDashboard extends Component {
  constructor() {
    super();
    this.state = {
      robot_count: 10,
      dimensions: "(0, 0, 0)",
      blocks_to_place: 23,
      blueprint_id: "Temple"
    };
  }

  getImageSource = label => {
    switch (label) {
      case "EmpireStateBuilding":
        return require("../assets/images/EmpireStateBuilding.png");
      case "Temple":
        return require("../assets/images/Temple.png");
      case "TajMahal":
        return require("../assets/images/TajMahal.png");
      case "Colosseum":
        return require("../assets/images/Colosseum.png");
      case "Cube_10x10x10":
        return require("../assets/images/Cube_10x10x10.png");
      case "Playground":
        return require("../assets/images/Playground.png");
      case "StarTrek":
        return require("../assets/images/StarTrek.png");
      default:
        return require("../assets/images/TajMahal.png");
    }
  };
  componentDidMount() {
    channel.bind("state", data => {
      console.log(data);
      this.setState({
        robot_count: data["robot_count"],
        dimensions: data["building_dimensions"],
        blocks_to_place: data["blocks_to_place"],
        blueprint_id: data["blueprint"]
      });
    });
  }

  render() {
    return (
      <div>
        <Container className="container-fluid pr-5 pl-5 pt-5 pb-5">
          {/* row 1 */}
          <Container className="row full-height">
            <Container className="col-lg-3 col-sm-6 is-light-text mb-4">
              <Container className="card grid-card is-card-dark">
                <Container className="card-heading">
                  <Container className="is-dark-text-light letter-spacing text-small">
                    Connection Status
                  </Container>
                  <Container className="card-heading-brand">
                    <i className="fas fa-wifi text-large logo-adjust" />
                  </Container>
                </Container>

                <Container className="card-value pt-4 text-x-large">
                  {"CONNECTED"}
                </Container>
              </Container>
            </Container>

            <Container className="col-lg-3 col-sm-6 is-light-text mb-4">
              <Container className="card grid-card is-card-dark">
                <Container className="card-heading">
                  <Container className="is-dark-text-light letter-spacing text-small">
                    Robot Count
                  </Container>
                  <Container className="card-heading-brand">
                    <i className="far fa-compass text-large" />
                  </Container>
                </Container>

                <Container className="card-value pt-4 text-x-large">
                  {this.state.robot_count}
                </Container>
              </Container>
            </Container>

            <Container className="col-lg-3 col-sm-6 is-light-text mb-4">
              <Container className="card grid-card is-card-dark">
                <Container className="card-heading">
                  <Container className="is-dark-text-light letter-spacing text-small">
                    Dimensions
                  </Container>
                  <Container className="card-heading-brand">
                    <i className="fas fa-map-marked-alt" />
                  </Container>
                </Container>

                <Container className="card-value pt-4 text-x-large">
                  {this.state.dimensions}
                </Container>
              </Container>
            </Container>

            <Container className="col-lg-3 col-sm-6 is-light-text mb-4">
              <Container className="card grid-card is-card-dark">
                <Container className="card-heading">
                  <Container className="is-dark-text-light letter-spacing text-small">
                    Blocks To Place
                  </Container>
                  <Container className="card-heading-brand">
                    <i className="fas fa-map-marked-alt" />
                  </Container>
                </Container>

                <Container className="card-value pt-4 text-x-large">
                  {this.state.blocks_to_place}
                </Container>
              </Container>
            </Container>
          </Container>

          {/* row 5 */}

          <Container className="row" style={{ minHeight: "400px" }}>
            <Container className="col-md-12 mb-4">
              <Container className="card is-card-dark chart-card">
                <Container className="chart-container large full-height blueprint_card is-dark-text-light">
                  Blueprint: {this.blueprint_id}
                  <Container className="card-value pt-4 text-x-large">
                    <img
                      className="center"
                      src={this.getImageSource(this.state.blueprint_id)}
                      alt={"Blueprint currently being built by robots"}
                    />
                  </Container>
                </Container>
              </Container>
            </Container>
          </Container>

          {/* {Row 6} */}
          <Container className="row" style={{ minHeight: "400px" }}>
            <Container className="is-card-dark chart-card">
              <Container className=" large full-height scrollable">
                <Console />
              </Container>
            </Container>
          </Container>
        </Container>

        {/* content area end */}
      </div>
    );
  }
}
