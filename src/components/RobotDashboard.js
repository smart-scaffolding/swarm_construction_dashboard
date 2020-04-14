// fusioncharts
import FusionCharts from "fusioncharts";
import {
  default as Charts,
  default as Column2D
} from "fusioncharts/fusioncharts.charts";
import Widgets from "fusioncharts/fusioncharts.widgets";
import Pusher from "pusher-js";
import React, { Component } from "react";
import { Radar } from "react-chartjs-2";
import ReactFC from "react-fusioncharts";
import { Tree, TreeNode } from "react-organizational-chart";
import "./charts-theme";
import Console from "./Console";
import Gauge from "./Gauge";
import Paraview from "./Paraview";
import { Container } from "./styled-components";

ReactFC.fcRoot(FusionCharts, Charts, Widgets, Column2D);

Charts(FusionCharts);

Pusher.logToConsole = true;

var pusher = new Pusher("b19a4591cdd9ad1d70f7", {
  cluster: "us2",
  forceTLS: true
});

var channel = pusher.subscribe("robot");

export default class RobotDashboard extends Component {
  constructor() {
    super();
    this.state = {
      items: [],
      dropdownOptions: [],
      selectedValue: null,
      position: [0, 0, 0],
      angles: [20, 20, 20],
      id: "ROBOT",
      connection_status: "OFFLINE",
      gripper_status: [0, 100],
      battery_life: 30,
      blocks_placed: 0,
      a_link_blocks: 0,
      d_link_blocks: 0,
      robot_state: "WAITING",
      end_effector_velocity: [
        { label: 0, value: 0 },
        { label: 1, value: 2 },
        { label: 2, value: 4 },
        { label: 3, value: 5 },
        { label: 4, value: 4 },
        { label: 5, value: 4 },
        { label: 6, value: 2 },
        { label: 7, value: 0 }
      ],
      last_behavior_id: "behavior_root",
      behavior_times: [28, 48, 40, 300, 96]
    };
  }

  check_alive_status = () => {
    this.setState({ connection_status: "OFFLINE" });
  };

  selectBehavior = input => {
    let select_behavior = "";
    switch (input) {
      case "wait":
        select_behavior = "behavior_wait";
        break;
      case "update":
        select_behavior = "behavior_update";
        break;

      case "build":
        select_behavior = "behavior_build";
        break;

      case "build_MoveToBlockToRemove":
        select_behavior = "behavior_build_nav_one";
        break;

      case "build_RemoveBlock":
        select_behavior = "behavior_build_remove";
        break;
      case "build_MoveToPlaceBlock":
        select_behavior = "behavior_build_nav_two";
        break;
      case "build_PlaceBlock":
        select_behavior = "behavior_build_place";
        break;

      case "ferry":
        select_behavior = "behavior_ferry";
        break;

      case "ferry_MoveToBlockToRemove":
        select_behavior = "behavior_ferry_nav_one";
        break;

      case "ferry_RemoveBlock":
        select_behavior = "behavior_ferry_remove";
        break;
      case "ferry_MoveToPlaceBlock":
        select_behavior = "behavior_ferry_nav_two";
        break;
      case "ferry_PlaceBlock":
        select_behavior = "behavior_ferry_place";
        break;

      case "root":
      default:
        select_behavior = "behavior_root";
        break;
    }
    document.getElementById(select_behavior).classList.add("selected_behavior");

    document
      .getElementById(this.state.last_behavior_id)
      .classList.remove("selected_behavior");

    this.setState({ last_behavior_id: select_behavior });
  };
  componentDidMount() {
    let grippers = [];
    grippers.push({
      label: "A Gripper",
      value: 0,
      displayValue: `${0}`
    });
    grippers.push({
      label: "D Gripper",
      value: 100,
      displayValue: `${0}`
    });
    this.setState({
      gripper_status: grippers
    });
    this.alive = setInterval(this.check_alive_status, 15000);

    channel.bind("behavior_tree", data => {
      console.log(data);
      var behavior = data["behavior"];
      var parent = data["parent"];
      console.log(parent);
      if (this.props.robot_id === data["id"]) {
        if (parent == null) {
          this.selectBehavior(behavior);
          console.log("Parent is not there");
        } else {
          this.selectBehavior(parent + "_" + behavior);
        }
      }
    });

    channel.bind("behavior_time", data => {
      console.log(data);
      console.log(this.props.robot_id);
      console.log(data["id"]);
      if (this.props.robot_id === data["id"]) {
        this.setState({
          behavior_times: [
            data["wait"],
            data["update"],
            data["move"],
            data["ferry"],
            data["build"]
          ]
        });
      }
    });

    channel.bind("behavior", data => {
      this.selectBehavior(data["behavior"]);
    });
    channel.bind("state", data => {
      // alert(JSON.stringify(data));
      clearInterval(this.alive);
      this.alive = setInterval(this.check_alive_status, 15000);

      // if (data["id"] in this.state.dropdownOptions) {
      if (this.props.robot_id === data["id"]) {
        let grippers = [];
        grippers.push({
          label: "A Gripper",
          value: data["grippers"].a,
          displayValue: `A Gripper: ${data["grippers"].a}`
        });
        grippers.push({
          label: "D Gripper",
          value: data["grippers"].d,
          displayValue: `${data["grippers"].d}`
        });

        let velocity = this.state.end_effector_velocity;
        if (velocity.length > 7) {
          velocity.splice(0, 1);
        }
        velocity.push(data["end_effector_velocity"]);
        velocity.flat(Infinity);
        this.setState({
          connection_status: "CONNECTED",
          position: data["position"],
          id: data["id"],
          angles: data["angles"],
          gripper_status: grippers,
          battery_life: data["battery"],
          blocks_placed: data["blocks_placed"],
          a_link_blocks: data["a_link_blocks"],
          d_link_blocks: data["d_link_blocks"],
          robot_state: data["robot_state"],
          end_effector_velocity: velocity
        });
      }
    });
  }

  render() {
    console.log("EE Velocity: ", this.state.end_effector_velocity);
    return (
      <div>
        <Container className="container-fluid pr-5 pl-5 pt-5 pb-5">
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
                  {this.state.connection_status}
                </Container>
              </Container>
            </Container>

            <Container className="col-lg-3 col-sm-6 is-light-text mb-4">
              <Container className="card grid-card is-card-dark">
                <Container className="card-heading">
                  <Container className="is-dark-text-light letter-spacing text-small">
                    Robot Orientation
                  </Container>
                  <Container className="card-heading-brand">
                    <i className="far fa-compass text-large" />
                  </Container>
                </Container>

                <Container className="card-value pt-4 text-x-large ">
                  {"HORIZONTAL"}
                </Container>
              </Container>
            </Container>

            <Container className="col-lg-3 col-sm-6 is-light-text mb-4">
              <Container className="card grid-card is-card-dark">
                <Container className="card-heading">
                  <Container className="is-dark-text-light letter-spacing text-small">
                    Robot Position
                  </Container>
                  <Container className="card-heading-brand">
                    <i className="fas fa-map-marked-alt" />
                  </Container>
                </Container>

                <Container className="card-value pt-4 text-x-large">
                  ({this.state.position[0]}, {this.state.position[1]},{" "}
                  {this.state.position[2]})
                </Container>
              </Container>
            </Container>

            <Container className="col-lg-3 col-sm-6 is-light-text mb-4">
              <Container className="card chart-card is-card-dark">
                <Container className="chart-container full-height">
                  <Gauge battery={this.state.battery_life} />
                </Container>
                {/* </Container> */}
              </Container>
            </Container>
          </Container>

          {/* row 2  */}
          <Container className="row">
            <Container className="col-md-4 col-lg-3 is-light-text mb-4">
              <Container className="card grid-card is-card-dark">
                <Container className="card-heading mb-3">
                  <Container className="is-dark-text-light letter-spacing text-small">
                    Blocks Placed
                  </Container>
                </Container>
                <Container className="card-value pt-4 text-x-large">
                  {this.state.blocks_placed}
                  <span className="text-medium pl-2 is-dark-text-light">
                    blocks
                  </span>
                </Container>
              </Container>
            </Container>

            <Container className="col-md-8 col-lg-9 is-light-text mb-4">
              <Container className="card is-card-dark chart-card">
                <Container className="row full-height">
                  <Container className="col-sm-4 full height">
                    <Container className="chart-container full-height">
                      <ReactFC
                        {...{
                          type: "doughnut2d",
                          width: "100%",
                          height: "100%",
                          dataFormat: "json",
                          containerBackgroundOpacity: "0",
                          dataSource: {
                            chart: {
                              caption: "Joint 1",
                              theme: "ecommerce",
                              defaultCenterLabel: `${this.state.angles[0]}º`,
                              paletteColors: "#3B70C4, #000000"
                            },
                            data: [
                              {
                                label: "active",
                                value: `${this.state.angles[0]}`
                              },
                              {
                                label: "inactive",
                                alpha: 5,
                                value: `${360 - this.state.angles[0]}`
                              }
                            ]
                          }
                        }}
                      />
                    </Container>
                  </Container>
                  <Container className="col-sm-4 full-height border-left border-right">
                    <Container className="chart-container full-height">
                      <ReactFC
                        {...{
                          type: "doughnut2d",
                          width: "100%",
                          height: "100%",
                          dataFormat: "json",
                          containerBackgroundOpacity: "0",
                          dataSource: {
                            chart: {
                              caption: "Joint 2",
                              theme: "ecommerce",
                              defaultCenterLabel: `${this.state.angles[1]}º`,
                              paletteColors: "#41B6C4, #000000"
                            },
                            data: [
                              {
                                label: "active",
                                value: `${this.state.angles[1]}`
                              },
                              {
                                label: "inactive",
                                alpha: 5,
                                value: `${360 - this.state.angles[1]}`
                              }
                            ]
                          }
                        }}
                      />
                    </Container>
                  </Container>
                  <Container className="col-sm-4 full-height">
                    <Container className="chart-container full-height">
                      <ReactFC
                        {...{
                          type: "doughnut2d",
                          width: "100%",
                          height: "100%",
                          dataFormat: "json",
                          containerBackgroundOpacity: "0",
                          dataSource: {
                            chart: {
                              caption: "Joint 3",
                              theme: "ecommerce",
                              defaultCenterLabel: `${this.state.angles[2]}º`,
                              paletteColors: "#EDF8B1, #000000"
                            },
                            data: [
                              {
                                label: "active",
                                value: `${this.state.angles[2]}`
                              },
                              {
                                label: "inactive",
                                alpha: 5,
                                value: `${360 - this.state.angles[2]}`
                              }
                            ]
                          }
                        }}
                      />
                    </Container>
                  </Container>
                </Container>
              </Container>
            </Container>
          </Container>

          {/* row 3 */}
          <Container className="row" style={{ minHeight: "400px" }}>
            <Container className="col-md-6 mb-4">
              <Container className="card is-card-dark chart-card">
                <Container className="chart-container large full-height">
                  <ReactFC
                    {...{
                      type: "bar2d",
                      width: "100%",
                      height: "100%",
                      dataFormat: "json",
                      containerBackgroundOpacity: "0",
                      dataEmptyMessage: "Loading Data...",
                      dataSource: {
                        chart: {
                          theme: "ecommerce",
                          caption: "% Closed",
                          subCaption: "Grippers",
                          yaxisname: "Percent closed",
                          yAxisMaxValue: "100"
                        },
                        data: this.state.gripper_status
                      }
                    }}
                  />
                </Container>
              </Container>
            </Container>

            <Container className="col-md-6 mb-4">
              <Container className="card grid-card is-light-text mb-4 is-card-dark">
                <Container className="card-heading mb-3">
                  <Container className="is-dark-text-light letter-spacing text-small">
                    Robot State:
                  </Container>
                </Container>
                <Container className="card-value pt-1 text-x-large">
                  {this.state.robot_state}
                </Container>
                <Container className="card-heading mb-3 pt-5">
                  <Container className="is-dark-text-light letter-spacing text-small">
                    A Link Number Blocks
                  </Container>
                </Container>
                <Container className="card-value pt-1 text-x-large">
                  {this.state.a_link_blocks}
                  <span className="text-medium pl-2 is-dark-text-light">
                    block(s)
                  </span>
                </Container>
                <Container className="card-heading mb-3 pt-5">
                  <Container className="is-dark-text-light letter-spacing text-small">
                    D Link Number Blocks
                  </Container>
                </Container>
                <Container className="card-value pt-1 text-x-large">
                  {this.state.d_link_blocks}
                  <span className="text-medium pl-2 is-dark-text-light">
                    block(s)
                  </span>
                </Container>
              </Container>
            </Container>
          </Container>

          {/* row 5 */}

          <Container className="row" style={{ minHeight: "400px" }}>
            <Container className="col-md-6 mb-4">
              <Container className="card is-card-dark chart-card">
                <Container className="chart-container large full-height is-dark-text-light">
                  Robot Behavior Time
                  <Radar
                    height={1}
                    width={1}
                    data={{
                      labels: ["Wait", "Update", "Move", "Ferry", "Build"],
                      datasets: [
                        {
                          label: "Behavior Time (seconds)",
                          pointLabelFontColor: "white",
                          backgroundColor: "rgba(59, 112, 196, 0.2)",
                          borderColor: "#3B70C4",
                          pointBackgroundColor: "#fff",
                          pointBorderColor: "#fff",
                          pointHoverBackgroundColor: "#fff",
                          pointHoverBorderColor: "rgba(59, 112, 196, 0.2)",
                          data: this.state.behavior_times
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      scale: {
                        gridLines: {
                          color: [
                            "rgb(128, 145, 171, 0.2)",
                            "rgb(128, 145, 171, 0.2)",
                            "rgb(128, 145, 171, 0.2)",
                            "rgb(128, 145, 171, 0.2)",
                            "rgb(128, 145, 171, 0.2)",
                            "rgb(128, 145, 171, 0.2)",
                            "rgb(128, 145, 171, 0.2)",
                            "rgb(128, 145, 171, 0.2)",
                            "rgb(128, 145, 171, 0.2)"
                          ]
                        },
                        pointLabels: {
                          fontColor: "white"
                        }
                      }
                    }}
                  />
                </Container>
              </Container>
            </Container>

            <Container className="col-md-6 mb-4">
              <Container className="card is-card-dark chart-card">
                <Container className="chart-container large full-height">
                  <ReactFC
                    {...{
                      type: "line",
                      width: "100%",
                      height: "100%",
                      dataFormat: "json",
                      containerBackgroundOpacity: "0",
                      dataSource: {
                        chart: {
                          theme: "ecommerce",
                          caption: "End Effector Velocity (norm)",
                          xAxisName: "Timestamp",
                          yAxisName: "Velocity (m/s)",
                          lineThickness: "2",
                          paletteColors: "#3B70C4, #000000"
                        },
                        data: this.state.end_effector_velocity
                      }
                    }}
                  />
                </Container>
              </Container>
            </Container>
          </Container>

          <Container className="row" style={{ minHeight: "400px" }}>
            <Container className="is-card-dark chart-card scrollable-x">
              <Container className=" large full-height scrollable-x behavior_container">
                <Tree
                  lineWidth={"2px"}
                  lineColor={"white"}
                  lineBorderRadius={"10px"}
                  label={
                    <div
                      id="behavior_root"
                      className="behavior behavior_extra selected_behavior"
                    >
                      Root
                    </div>
                  }
                >
                  <TreeNode
                    label={
                      <div id="behavior_update" className="behavior">
                        Update
                      </div>
                    }
                  />
                  <TreeNode
                    label={
                      <div id="behavior_build" className="behavior">
                        Build
                      </div>
                    }
                  >
                    <TreeNode
                      label={
                        <div id="behavior_build_nav_one" className="behavior">
                          Navigate To Point
                        </div>
                      }
                    />
                    <TreeNode
                      label={
                        <div id="behavior_build_remove" className="behavior">
                          Remove Block
                        </div>
                      }
                    />
                    <TreeNode
                      label={
                        <div id="behavior_build_nav_two" className="behavior">
                          Navigate To Point
                        </div>
                      }
                    />
                    <TreeNode
                      label={
                        <div id="behavior_build_place" className="behavior">
                          Place Block
                        </div>
                      }
                    />
                  </TreeNode>
                  <TreeNode
                    label={
                      <div id="behavior_ferry" className="behavior">
                        Ferry
                      </div>
                    }
                  >
                    <TreeNode
                      label={
                        <div id="behavior_ferry_nav_one" className="behavior">
                          Navigate To Point
                        </div>
                      }
                    />
                    <TreeNode
                      label={
                        <div id="behavior_ferry_remove" className="behavior">
                          Remove Block
                        </div>
                      }
                    />
                    <TreeNode
                      label={
                        <div id="behavior_ferry_nav_two" className="behavior">
                          Navigate To Point
                        </div>
                      }
                    />
                    <TreeNode
                      label={
                        <div id="behavior_ferry_place" className="behavior">
                          Place Block
                        </div>
                      }
                    />
                  </TreeNode>
                  <TreeNode
                    label={
                      <div id="behavior_wait" className="behavior">
                        Wait
                      </div>
                    }
                  />
                </Tree>
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
        <Container className="row" style={{ minHeight: "400px" }}>
          <Paraview />
        </Container>

        {/* content area end */}
      </div>
    );
  }
}
