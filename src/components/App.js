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
import RobotDashboard from "./RobotDashboard";
import HomeBlockDashboard from "./HomeBlockDashboard";
import Pusher from "pusher-js";

ReactFC.fcRoot(FusionCharts, Charts, Maps, USARegion, Widgets);

Charts(FusionCharts);

// const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values:batchGet?ranges=Sheet1&majorDimension=ROWS&key=${config.apiKey}`;

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
      selectedValue: "Select robot here",
      amRevenue: null,
      ebRevenue: null,
      etRevenue: null,
      totalRevenue: null,
      productViews: null,
      purchaseRate: " ",
      checkoutRate: " ",
      abandonedRate: " ",
      ordersTrendStore: [],

      display: "robot"
    };
  }

  // getData = arg => {
  //   // google sheets data
  //   const arr = this.state.items;
  //   const arrLen = arr.length;

  //   // kpi's
  //   // amazon revenue
  //   let amRevenue = 0;
  //   //ebay revenue
  //   let ebRevenue = 0;
  //   // etsy revenue
  //   let etRevenue = 0;
  //   // total revenue
  //   let totalRevenue = 0;
  //   // product views
  //   let productViews = 0;
  //   // purchase rate
  //   let purchaseRate = 0;
  //   // checkout rate
  //   let checkoutRate = 0;
  //   // abandoned rate
  //   let abandonedRate = 0;
  //   // order trend by brand
  //   let ordersTrendStore = [];
  //   // order trend by region
  //   let ordersTrendRegion = [];
  //   let orderesTrendnw = 0;
  //   let orderesTrendsw = 0;
  //   let orderesTrendc = 0;
  //   let orderesTrendne = 0;
  //   let orderesTrendse = 0;

  //   // let selectedValue = null;

  //   for (let i = 0; i < arrLen; i++) {
  //     if (arg === arr[i]["month"]) {
  //       if (arr[i]["source"] === "AM") {
  //         amRevenue += parseInt(arr[i].revenue);
  //         ordersTrendStore.push({
  //           label: "Motor 1",
  //           value: arr[i].orders,
  //           displayValue: `${arr[i].orders}`
  //         });
  //       } else if (arr[i]["source"] === "EB") {
  //         ebRevenue += parseInt(arr[i].revenue);
  //         ordersTrendStore.push({
  //           label: "Motor 2",
  //           value: arr[i].orders,
  //           displayValue: `${arr[i].orders}`
  //         });
  //       } else if (arr[i]["source"] === "ET") {
  //         etRevenue += parseInt(arr[i].revenue);
  //         ordersTrendStore.push({
  //           label: "Motor 3",
  //           value: arr[i].orders,
  //           displayValue: `${arr[i].orders}`
  //         });
  //       }
  //       productViews += parseInt(arr[i].product_views);
  //       purchaseRate += parseInt(arr[i].purchase_rate / 3);
  //       checkoutRate += parseInt(arr[i].checkout_rate / 3);
  //       abandonedRate += parseInt(arr[i].abandoned_rate / 3);
  //       orderesTrendnw += parseInt(arr[i].orders_nw);
  //       orderesTrendsw += parseInt(arr[i].orders_sw);
  //       orderesTrendc += parseInt(arr[i].orders_c);
  //       orderesTrendne += parseInt(arr[i].orders_ne);
  //       orderesTrendse += parseInt(arr[i].orders_se);
  //     }
  //   }

  //   totalRevenue = amRevenue + ebRevenue + etRevenue;
  //   ordersTrendRegion.push(
  //     {
  //       id: "01",
  //       value: orderesTrendne
  //     },
  //     {
  //       id: "02",
  //       value: orderesTrendnw
  //     },
  //     {
  //       id: "03",
  //       value: orderesTrendse
  //     },
  //     {
  //       id: "04",
  //       value: orderesTrendsw
  //     },
  //     {
  //       id: "05",
  //       value: orderesTrendc
  //     }
  //   );

  //   // selectedValue = "0";

  //   // setting state
  //   this.setState({
  //     amRevenue: formatNum(amRevenue),
  //     ebRevenue: formatNum(ebRevenue),
  //     etRevenue: formatNum(etRevenue),
  //     totalRevenue: formatNum(totalRevenue),
  //     productViews: formatNum(productViews),
  //     purchaseRate: purchaseRate,
  //     checkoutRate: checkoutRate,
  //     abandonedRate: abandonedRate,
  //     ordersTrendStore: ordersTrendStore,
  //     ordersTrendRegion: ordersTrendRegion
  //     // selectedValue: selectedValue
  //   });
  // };

  updateDashboard = event => {
    this.getData(event.value);
    this.setState({ selectedValue: event.value });
  };

  componentDidMount() {
    channel.bind("state", data => {
      // alert(JSON.stringify(data));
      if (data["id"] in this.state.dropdownOptions) {
        // if (this.state.selectedValue === data["id"]) {
        //   this.setState({
        //     connection_status: "CONNECTED",
        //     position: data["position"],
        //     id: data["id"],
        //     angles: data["angles"]
        //   });
        // }
      } else {
        let new_dropdown_options = this.state.dropdownOptions;
        // console.log(this.state.dropdownOptions);
        // console.log(data["id"]);
        new_dropdown_options.push(data["id"]);
        this.setState({ dropdownOptions: [...new Set(new_dropdown_options)] });
      }
    });
    // fetch(url)
    //   .then(response => response.json())
    //   .then(data => {
    //     let batchRowValues = data.valueRanges[0].values;

    //     const rows = [];
    //     for (let i = 1; i < batchRowValues.length; i++) {
    //       let rowObject = {};
    //       for (let j = 0; j < batchRowValues[i].length; j++) {
    //         rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
    //       }
    //       rows.push(rowObject);
    //     }

    //     // dropdown options
    //     // let dropdownOptions = [];

    //     // for (let i = 0; i < rows.length; i++) {
    //     //   dropdownOptions.push(i);
    //     // }

    //     // dropdownOptions = Array.from(new Set(dropdownOptions));

    //     this.setState(
    //       {
    //         items: rows
    //         // dropdownOptions: dropdownOptions,
    //         // selectedValue: "0"
    //       },
    //       () => this.getData("Jan 2019")
    //     );
    //   });
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
      this.setState({ display: "homeBlock" });
    } else {
      this.setState({ display: "robot" });
    }
  };

  render() {
    return (
      <Container>
        {/* static navbar - top */}
        <Nav className="navbar navbar-expand-lg fixed-top is-white is-dark-text">
          <Container className="navbar-brand h1 mb-0 text-large font-medium">
            Smart Scaffolding
          </Container>
          <Container className="navbar-nav ml-auto">
            <Container className="user-detail-section">
              <span className="pr-2">LOGO</span>
              {/* <span className="img-container">
                <img src={UserImg} className="rounded-circle" alt="user" />
              </span> */}
            </Container>
          </Container>
        </Nav>

        {/* static navbar - bottom */}
        <Nav className="navbar fixed-top nav-secondary is-dark is-light-text">
          {/* <Container className="text-medium">Dashboard</Container> */}
          <button
            class="btn btn-primary text-medium"
            onClick={this.changeDashboard}
          >
            Switch Dashboard
          </button>

          <Container className="navbar-nav ml-auto">
            <Dropdown
              className="pr-2 custom-dropdown"
              options={this.state.dropdownOptions}
              onChange={this.updateDashboard}
              value={"Robot ID:   " + this.state.selectedValue}
              placeholder="Select an option"
            />
          </Container>
        </Nav>

        {/* content area start */}
        {this.showDashboard()}
      </Container>
    );
  }
}

export default App;
