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
import BlockSimulation from "./BlockSimulation";
ReactFC.fcRoot(FusionCharts, Charts, Maps, USARegion, Widgets);

Charts(FusionCharts);

const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values:batchGet?ranges=Sheet1&majorDimension=ROWS&key=${config.apiKey}`;

export default class HomeBlockDashboard extends Component {
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
      ordersTrendStore: []
    };
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

    let selectedValue = null;

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

    selectedValue = "0";

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
      ordersTrendRegion: ordersTrendRegion,
      selectedValue: selectedValue
    });
  };

  updateDashboard = event => {
    this.getData(event.value);
    this.setState({ selectedValue: event.value });
  };

  componentDidMount() {
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
        let dropdownOptions = [];

        for (let i = 0; i < rows.length; i++) {
          dropdownOptions.push(i);
        }

        dropdownOptions = Array.from(new Set(dropdownOptions));

        this.setState(
          {
            items: rows,
            dropdownOptions: dropdownOptions,
            selectedValue: "0"
          },
          () => this.getData("Jan 2019")
        );
      });
  }

  render() {
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
                  {3}
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
                  {"(4, 4, 4)"}
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
                  {64}
                </Container>
              </Container>
            </Container>
          </Container>

          {/* row 5 - orders trend */}

          <Container className="row" style={{ minHeight: "400px" }}>
            <Container className="col-md-12 mb-4">
              <Container className="card is-card-dark chart-card">
                <Container className="chart-container large full-height">
                  Robot Angle Simulation
                  {/* <div id="robot"></div> */}
                  <BlockSimulation />
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

        {/* content area end */}
      </div>
    );
  }
}
