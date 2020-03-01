import React, { Component } from "react";

import { Container, Nav } from "./styled-components";

// fusioncharts
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import Maps from "fusioncharts/fusioncharts.maps";
import USARegion from "fusionmaps/maps/es/fusioncharts.usaregion";
import ReactFC from "react-fusioncharts";
import Widgets from "fusioncharts/fusioncharts.widgets";

import Zoomline from "fusioncharts/fusioncharts.zoomline";
import "./charts-theme";

import config from "./config";
import Dropdown from "react-dropdown";
import formatNum from "./format-number";
import Robot from "./Robot";
import Gauge from "./Gauge";
import UserImg from "../assets/images/user-img-placeholder.jpeg";
import Console from "./Console";
import Paraview from "./Paraview";
import Pusher from "pusher-js";

ReactFC.fcRoot(FusionCharts, Charts, Maps, USARegion, Widgets);

Charts(FusionCharts);

const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values:batchGet?ranges=Sheet1&majorDimension=ROWS&key=${config.apiKey}`;

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
      amRevenue: null,
      ebRevenue: null,
      etRevenue: null,
      totalRevenue: null,
      productViews: null,
      purchaseRate: " ",
      checkoutRate: " ",
      abandonedRate: " ",
      ordersTrendStore: [],
      position: [0, 0, 0],
      angles: [20, 20, 20],
      id: "ROBOT",
      connection_status: "OFFLINE",
      gripper_status: [],
      battery_life: 30,
      blocks_placed: 0,
      a_link_blocks: 0,
      d_link_blocks: 0,
      robot_state: "WAITING"
    };

    let grippers = [];
    grippers.push({
      label: "A Gripper",
      value: 0,
      displayValue: `${0}`
    });
    grippers.push({
      label: "D Gripper",
      value: 0,
      displayValue: `${0}`
    });
    this.setState({
      gripper_status: grippers
    });
  }

  getData = arg => {
    // google sheets data
    const arr = this.state.items;
    const arrLen = arr.length;

    // kpi's
    // amazon revenue
    let amRevenue = 0;
    //ebay revenue
    let ebRevenue = 0;
    // etsy revenue
    let etRevenue = 0;
    // total revenue
    let totalRevenue = 0;
    // product views
    let productViews = 0;
    // purchase rate
    let purchaseRate = 0;
    // checkout rate
    let checkoutRate = 0;
    // abandoned rate
    let abandonedRate = 0;
    // order trend by brand
    let ordersTrendStore = [];
    // order trend by region
    let ordersTrendRegion = [];
    let orderesTrendnw = 0;
    let orderesTrendsw = 0;
    let orderesTrendc = 0;
    let orderesTrendne = 0;
    let orderesTrendse = 0;

    // let selectedValue = null;

    for (let i = 0; i < arrLen; i++) {
      if (arg === arr[i]["month"]) {
        if (arr[i]["source"] === "AM") {
          amRevenue += parseInt(arr[i].revenue);
          ordersTrendStore.push({
            label: "Motor 1",
            value: arr[i].orders,
            displayValue: `${arr[i].orders}`
          });
        } else if (arr[i]["source"] === "EB") {
          ebRevenue += parseInt(arr[i].revenue);
          ordersTrendStore.push({
            label: "Motor 2",
            value: arr[i].orders,
            displayValue: `${arr[i].orders}`
          });
        } else if (arr[i]["source"] === "ET") {
          etRevenue += parseInt(arr[i].revenue);
          ordersTrendStore.push({
            label: "Motor 3",
            value: arr[i].orders,
            displayValue: `${arr[i].orders}`
          });
        }
        productViews += parseInt(arr[i].product_views);
        purchaseRate += parseInt(arr[i].purchase_rate / 3);
        checkoutRate += parseInt(arr[i].checkout_rate / 3);
        abandonedRate += parseInt(arr[i].abandoned_rate / 3);
        orderesTrendnw += parseInt(arr[i].orders_nw);
        orderesTrendsw += parseInt(arr[i].orders_sw);
        orderesTrendc += parseInt(arr[i].orders_c);
        orderesTrendne += parseInt(arr[i].orders_ne);
        orderesTrendse += parseInt(arr[i].orders_se);
      }
    }

    totalRevenue = amRevenue + ebRevenue + etRevenue;
    ordersTrendRegion.push(
      {
        id: "01",
        value: orderesTrendne
      },
      {
        id: "02",
        value: orderesTrendnw
      },
      {
        id: "03",
        value: orderesTrendse
      },
      {
        id: "04",
        value: orderesTrendsw
      },
      {
        id: "05",
        value: orderesTrendc
      }
    );

    // selectedValue = "0";

    // setting state
    this.setState({
      amRevenue: formatNum(amRevenue),
      ebRevenue: formatNum(ebRevenue),
      etRevenue: formatNum(etRevenue),
      totalRevenue: formatNum(totalRevenue),
      productViews: formatNum(productViews),
      purchaseRate: purchaseRate,
      checkoutRate: checkoutRate,
      abandonedRate: abandonedRate,
      ordersTrendStore: ordersTrendStore,
      ordersTrendRegion: ordersTrendRegion
      // selectedValue: selectedValue
    });
  };

  updateDashboard = event => {
    this.getData(event.value);
    this.setState({ selectedValue: event.value });
  };

  check_alive_status = () => {
    this.setState({ connection_status: "OFFLINE" });
  };

  componentDidMount() {
    this.alive = setInterval(this.check_alive_status, 15000);

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
          displayValue: `${data["grippers"].a}`
        });
        grippers.push({
          label: "D Gripper",
          value: data["grippers"].d,
          displayValue: `${data["grippers"].d}`
        });
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
          robot_state: data["robot_state"]
        });
      }
      // } else {
      //   let new_dropdown_options = this.state.dropdownOptions;
      //   new_dropdown_options.push(data["id"]);
      //   this.setState({ dropdownOptions: new_dropdown_options });
      // }
    });
    fetch(url)
      .then(response => response.json())
      .then(data => {
        let batchRowValues = data.valueRanges[0].values;

        const rows = [];
        for (let i = 1; i < batchRowValues.length; i++) {
          let rowObject = {};
          for (let j = 0; j < batchRowValues[i].length; j++) {
            rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
          }
          rows.push(rowObject);
        }

        // dropdown options
        // let dropdownOptions = [];

        // for (let i = 0; i < rows.length; i++) {
        //   dropdownOptions.push(i);
        // }

        // dropdownOptions = Array.from(new Set(dropdownOptions));

        this.setState(
          {
            items: rows
            // dropdownOptions: dropdownOptions,
            // selectedValue: "0"
          },
          () => this.getData("Jan 2019")
        );
      });
  }

  render() {
    console.log("Robot battery: ", this.state.battery_life);
    return (
      <div>
        <Container className="container-fluid pr-5 pl-5 pt-5 pb-5">
          {/* row 1 - revenue */}
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

                <Container className="card-value pt-4 text-x-large">
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

          {/* row 2 - conversion */}
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

          {/* row 3 - orders trend */}
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
                          subCaption: "Grippers"
                        },
                        data: this.state.gripper_status
                      }
                    }}
                  />
                </Container>
              </Container>
            </Container>

            <Container className="col-md-6 mb-4">
              {/* <Container className="card is-card-dark chart-card"> */}
              <Container className="card grid-card is-light-text mb-4 is-card-dark">
                <Container className="card-heading mb-3">
                  <Container className="is-dark-text-light letter-spacing text-small">
                    Robot State:
                  </Container>
                </Container>
                <Container className="card-value pt-1 text-x-large">
                  {this.state.robot_state}
                  {/* {this.state.productViews} */}
                  {/* <span className="text-medium pl-2 is-dark-text-light">
                    blocks
                  </span> */}
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
              {/* <Container className="chart-container large full-height">
                  <ReactFC
                    {...{
                      type: "usaregion",
                      width: "100%",
                      height: "100%",
                      dataFormat: "json",
                      containerBackgroundOpacity: "0",
                      dataEmptyMessage: "Loading Data...",
                      dataSource: {
                        chart: {
                          theme: "ecommerce",
                          caption: "Orders Trend",
                          subCaption: "By Region"
                        },
                        colorrange: {
                          code: "#F64F4B",
                          minvalue: "0",
                          gradient: "1",
                          color: [
                            {
                              minValue: "10",
                              maxvalue: "25",
                              code: "#EDF8B1"
                            },
                            {
                              minvalue: "25",
                              maxvalue: "50",
                              code: "#18D380"
                            }
                          ]
                        },
                        data: this.state.ordersTrendRegion
                      }
                    }}
                  />
                </Container> */}
              {/* </Container> */}
            </Container>
          </Container>

          {/* row 4 - orders trend */}

          {/* <Container className="row" style={{ minHeight: "400px" }}>
            <Container className="col-md-6 mb-4">
              <Container className="card is-card-dark chart-card">
                <Container className="chart-container large full-height scrollable">
                  <Console />
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
                          caption: "End Effector Position",
                          xAxisName: "Timestamp",
                          yAxisName: "Position (m)",
                          lineThickness: "2",
                          paletteColors: "#3B70C4, #000000"
                        },
                        data: [
                          {
                            label: "9:46:01",
                            value: "15"
                          },
                          {
                            label: "09:47:31",
                            value: "14"
                          },
                          {
                            label: "09:47:52",
                            value: "23"
                          },
                          {
                            label: "09:48:01",
                            value: "91"
                          },
                          {
                            label: "09:48:43",
                            value: "15"
                          },
                          {
                            label: "09:49:10",
                            value: "20"
                          },
                          {
                            label: "09:49:33",
                            value: "19"
                          }
                        ]
                        // trendlines: [
                        //   {
                        //     line: [
                        //       {
                        //         startvalue: "18500",
                        //         color: "#29C3BE",
                        //         displayvalue:
                        //           "Average{br}weekly{br}footfall",
                        //         valueOnRight: "1",
                        //         thickness: "2"
                        //       }
                        //     ]
                        //   }
                        // ]
                      }
                    }}
                  />
                </Container>
              </Container>
            </Container>
          </Container> */}

          {/* row 5 - orders trend */}

          <Container className="row" style={{ minHeight: "400px" }}>
            <Container className="col-md-6 mb-4">
              <Container className="card is-card-dark chart-card">
                <Container className="chart-container large full-height">
                  Robot Angle Simulation
                  {/* <div id="robot"></div> */}
                  <Robot />
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
                          caption: "End Effector Position",
                          xAxisName: "Timestamp",
                          yAxisName: "Position (m)",
                          lineThickness: "2",
                          paletteColors: "#3B70C4, #000000"
                        },
                        data: [
                          {
                            label: "9:46:01",
                            value: "15"
                          },
                          {
                            label: "09:47:31",
                            value: "14"
                          },
                          {
                            label: "09:47:52",
                            value: "23"
                          },
                          {
                            label: "09:48:01",
                            value: "91"
                          },
                          {
                            label: "09:48:43",
                            value: "15"
                          },
                          {
                            label: "09:49:10",
                            value: "20"
                          },
                          {
                            label: "09:49:33",
                            value: "19"
                          }
                        ]
                        // trendlines: [
                        //   {
                        //     line: [
                        //       {
                        //         startvalue: "18500",
                        //         color: "#29C3BE",
                        //         displayvalue:
                        //           "Average{br}weekly{br}footfall",
                        //         valueOnRight: "1",
                        //         thickness: "2"
                        //       }
                        //     ]
                        //   }
                        // ]
                      }
                    }}
                  />
                </Container>
              </Container>
            </Container>
          </Container>

          {/* {Row 6} */}
          <Container className="row" style={{ minHeight: "400px" }}>
            {/* <Container className="col-md-6 mb-4"> */}
            <Container className="is-card-dark chart-card">
              <Container className=" large full-height scrollable">
                <Console />
              </Container>
              {/* </Container> */}
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
