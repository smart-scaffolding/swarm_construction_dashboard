import fusioncharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFC from "react-fusioncharts";
import React, { Component } from "react";

// Resolves charts dependancy
charts(fusioncharts);

export default class Gauge extends React.Component {
  constructor() {
    super();
    this.state = {
      battery_life: 50
    };
  }

  componentDidMount() {
    this.setState({
      battery_life: this.props.battery
    });
  }
  render() {
    const battery_life = this.props.battery;
    console.log("Battery life: ", this.props.battery);
    var dataSource = {
      chart: {
        caption: "Battery Life",
        lowerlimit: "0",
        upperlimit: "100",
        showvalue: "1",
        numbersuffix: "%",
        theme: "ecommerce",
        showtooltip: "1",
        showGaugeBorder: "0",
        showHoverEffect: "1"
      },
      colorrange: {
        color: [
          {
            minvalue: "0",
            maxvalue: "50",
            code: "#F2726F"
          },
          {
            minvalue: "50",
            maxvalue: "75",
            code: "#FFC533"
          },
          {
            minvalue: "75",
            maxvalue: "100",
            code: "#62B58F"
          }
        ]
      },
      dials: {
        dial: [
          {
            value: battery_life
          }
        ]
      },
      trendpoints: {
        point: [
          {
            startValue: "60",
            endValue: "100",
            radius: "100",
            innerRadius: "5",
            displayValue: "Safe",
            color: "#0075c2",
            alpha: "40"
          }
        ]
      }
    };

    console.log(dataSource);
    return (
      <ReactFC
        type="angulargauge"
        width="100%"
        height="100%"
        dataFormat="json"
        containerBackgroundOpacity="0"
        dataSource={dataSource}
      />
    );
  }
}
