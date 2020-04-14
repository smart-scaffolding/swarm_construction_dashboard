import React, { Component } from "react";
import "./voxels.css";

export default class BlockSimulation extends Component {
  getVoxels() {
    let blueprint = [
      [[1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0]],
      [[1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0]],
      [[1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0]],
      [[1, 0, 0, 0], [1, 1, 0, 0], [1, 1, 1, 1]],
      [[1, 0, 0, 0], [1, 1, 1, 0], [1, 1, 1, 1]],
      [[1, 0, 0, 0], [1, 1, 1, 1], [1, 1, 1, 1]]
    ];

    var voxels = [];
    var i,
      j,
      k = 0;
    for (i = 0; i < blueprint.length; i++) {
      for (j = 0; j < blueprint[i].length; j++) {
        for (k = 0; k < blueprint[i][j].length; k++) {
          if (blueprint[i][j][k] === 1) {
            var x = i;
            var y = -k;
            var z = j;

            var coordinates = x + " " + y + " " + z;
            console.log("Coordinates", coordinates);
            voxels.push(
              <voxel
                key={coordinates}
                style={{ coordinates: coordinates }}
                className="grass"
              />
            );
          }
        }
      }
    }
    return voxels;
  }

  componentDidMount() {
    // this.display_robot();
    // main();

    var voxels = document.querySelectorAll("voxel");
    console.log(voxels);
    console.log("Should be seeing vocels");
    Array.prototype.clean = function(deleteValue) {
      for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
          this.splice(i, 1);
          i--;
        }
      }
      return this;
    };

    for (var i = 0; i < voxels.length; i++) {
      var e = voxels[i];

      var c = e.style.coordinates;
      var translate = "";
      c = c.split(" ").clean("");
      console.log(c);
      for (var j = 0; j < c.length; j++) {
        var scale = parseInt(c[j]) * 4;
        console.log(scale);
        translate = translate + scale + "em,";
      }
      translate = translate.substring(0, translate.length - 1);
      e.style.transform = "translate3d(" + translate + ")";

      var t = document.createElement("top");
      var b = document.createElement("bottom");
      var l = document.createElement("left");
      var r = document.createElement("right");
      var f = document.createElement("front");
      var ba = document.createElement("back");
      e.appendChild(t);
      e.appendChild(b);
      e.appendChild(l);
      e.appendChild(r);
      e.appendChild(f);
      e.appendChild(ba);
    }
  }
  render() {
    return <figure id="blueprint_figure">{this.getVoxels()}</figure>;
  }
}
