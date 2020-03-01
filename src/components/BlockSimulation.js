import React, { Component } from "react";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "./OrbitControls.js";
import { main } from "./Block.js";

export default class BlockSimulation extends Component {
  //   display_robot() {
  //     var scene = new THREE.Scene();
  //     var robot_div = document.getElementById("block");
  //     // Camera
  //     var aspect =
  //       robot_div.parentNode.clientWidth / robot_div.parentNode.clientHeight;
  //     var camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
  //     camera.position.z = 5;
  //     camera.position.x = 5;
  //     camera.position.y = 5;
  //     camera.lookAt(0, 1.5, 0);
  //     camera.updateProjectionMatrix();
  //     // var controls = new THREE.OrbitControls( camera );

  //     // Renderer
  //     var renderer = new THREE.WebGLRenderer({ antialias: true });
  //     renderer.setSize(
  //       robot_div.parentNode.clientWidth,
  //       robot_div.parentNode.clientHeight
  //     );
  //     robot_div.appendChild(renderer.domElement);

  //     var material = new THREE.MeshStandardMaterial();

  //     var geometry = new THREE.BoxGeometry(1, 1, 1);
  //     var base = new THREE.Mesh(geometry, material);
  //     scene.add(base);
  //     base.position.x = 0;

  //     geometry = new THREE.BoxGeometry(1, 1, 1);
  //     base = new THREE.Mesh(geometry, material);
  //     scene.add(base);
  //     base.position.x = 1;

  //     let blueprint = [
  //       [[1, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [1, 1, 1]],
  //       [[1, 0, 0], [1, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
  //       [[1, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
  //       [[1, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
  //       [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
  //       [[1, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
  //       [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
  //       [[1, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]]
  //     ];
  //     var i,
  //       j,
  //       k = 0;
  //     for (i = 0; i < blueprint.length; i++) {
  //       for (j = 0; j < blueprint[i].length; j++) {
  //         for (k = 0; k < blueprint[i][j].length; k++) {
  //           if (blueprint[i][j][k] == 1) {
  //             geometry = new THREE.BoxGeometry(1, 1, 1);
  //             base = new THREE.Mesh(geometry, material);
  //             scene.add(base);
  //             base.position.x = i;
  //             base.position.y = j;
  //             base.position.z = k;
  //           }
  //         }
  //       }
  //     }

  //     // Light
  //     var light = new THREE.DirectionalLight(0xffffff, 1.0);
  //     light.position.set(10, 5, 10);
  //     light.target = base;
  //     scene.add(light);

  //     light = new THREE.AmbientLight(0xffffff, 0.5);
  //     scene.add(light);

  //     // Options (DAT.GUI)
  //     var options = {
  //       base: 0,
  //       cameray: 0,
  //       cameraz: 0,
  //       camerax: 0

  //       // shoulder: 0,
  //       // elbow: -44,
  //       // secondElbow: -56,
  //       // newArm: -68,
  //     };
  //     // DAT.GUI Related Stuff
  //     var gui = new dat.GUI();
  //     gui.add(options, "base", -180, 180).listen();
  //     gui.add(options, "cameray", -180, 180).listen();
  //     gui.add(options, "cameraz", -180, 180).listen();
  //     gui.add(options, "camerax", -180, 180).listen();

  //     // gui.add(options, 'elbow', -180, 180).listen();
  //     // gui.add(options, 'secondElbow', -180, 180).listen();
  //     // gui.add(options, 'newArm', -180, 180).listen();

  //     // Rendering
  //     var zAxis = new THREE.Vector3(0, 0, 1);
  //     var yAxis = new THREE.Vector3(0, 1, 0);
  //     var xAxis = new THREE.Vector3(1, 0, 0);

  //     var show = function() {
  //       requestAnimationFrame(show);

  //       // Rotate joints
  //       base.setRotationFromAxisAngle(yAxis, (options.base * Math.PI) / 180);
  //       camera.setRotationFromAxisAngle(yAxis, (options.cameray * Math.PI) / 180);
  //       camera.setRotationFromAxisAngle(zAxis, (options.cameraz * Math.PI) / 180);
  //       camera.setRotationFromAxisAngle(xAxis, (options.camerax * Math.PI) / 180);

  //       // shoulder.setRotationFromAxisAngle(zAxis, options.shoulder * Math.PI / 180);
  //       // elbow.setRotationFromAxisAngle(zAxis, options.elbow * Math.PI / 180);
  //       // secondElbow.setRotationFromAxisAngle(zAxis, options.secondElbow * Math.PI / 180);
  //       // newArm.setRotationFromAxisAngle(zAxis, options.newArm * Math.PI / 180);

  //       // Render
  //       robot_div.appendChild(gui.domElement);
  //       renderer.render(scene, camera);
  //     };
  //     // console.log(render.domElement);
  //     // return ;
  //     show();
  //   }

  //   main() {
  //     // var robot_div = document.getElementById("robot");
  //     // Camera
  //     // var aspect =
  //     //   robot_div.parentNode.clientWidth / robot_div.parentNode.clientHeight;
  //     const canvas = document.getElementById("#c");
  //     const renderer = new THREE.WebGLRenderer({ canvas });

  //     const cellSize = 256;

  //     const fov = 75;
  //     const aspect = 2; // the canvas default
  //     const near = 0.1;
  //     const far = 1000;
  //     const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  //     camera.position.set(-cellSize * 0.3, cellSize * 0.8, -cellSize * 0.3);

  //     const controls = new OrbitControls(camera, canvas);
  //     controls.target.set(cellSize / 2, cellSize / 3, cellSize / 2);
  //     controls.update();

  //     const scene = new THREE.Scene();
  //     scene.background = new THREE.Color("lightblue");

  //     {
  //       const color = 0xffffff;
  //       const intensity = 1;
  //       const light = new THREE.DirectionalLight(color, intensity);
  //       light.position.set(-1, 2, 4);
  //       scene.add(light);
  //     }
  //     let blueprint = [
  //       [[1, 0, 0], [1, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [1, 1, 1]],
  //       [[1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0], [0, 0, 0], [0, 0, 0]],
  //       [[1, 0, 0], [1, 1, 0], [0, 0, 0], [1, 0, 0], [0, 0, 0], [0, 0, 0]],
  //       [[1, 0, 0], [1, 0, 0], [0, 0, 0], [1, 0, 0], [0, 0, 0], [0, 0, 0]],
  //       [[1, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
  //       [[1, 0, 0], [0, 0, 0], [1, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
  //       [[1, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
  //       [[1, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]]
  //     ];
  //     const geometry = new THREE.BoxBufferGeometry(10, 10, 10);
  //     const material = new THREE.MeshPhongMaterial({ color: "green" });

  //     const cell = new Uint8Array(cellSize * cellSize * cellSize);
  //     for (let x = 0; x < blueprint.length; ++x) {
  //       for (let y = 0; y < blueprint[0].length; ++y) {
  //         for (let z = 0; z < blueprint[0][0].lenth; ++z) {
  //           //   if (blueprint[x][y][z] === 1) {
  //           const mesh = new THREE.Mesh(geometry, material);
  //           mesh.position.set(x, y, z);
  //           scene.add(mesh);
  //           //   }
  //         }
  //       }
  //     }

  //     function resizeRendererToDisplaySize(renderer) {
  //       const canvas = renderer.domElement;
  //       const width = canvas.clientWidth;
  //       const height = canvas.clientHeight;
  //       const needResize = canvas.width !== width || canvas.height !== height;
  //       if (needResize) {
  //         renderer.setSize(width, height, false);
  //       }
  //       return needResize;
  //     }

  //     let renderRequested = false;

  //     function show() {
  //       renderRequested = undefined;

  //       if (resizeRendererToDisplaySize(renderer)) {
  //         const canvas = renderer.domElement;
  //         camera.aspect = canvas.clientWidth / canvas.clientHeight;
  //         camera.updateProjectionMatrix();
  //       }

  //       controls.update();
  //       renderer.render(scene, camera);
  //     }
  //     show();

  //     function requestRenderIfNotRequested() {
  //       if (!renderRequested) {
  //         renderRequested = true;
  //         requestAnimationFrame(show);
  //       }
  //     }

  //     controls.addEventListener("change", requestRenderIfNotRequested);
  //     window.addEventListener("resize", requestRenderIfNotRequested);
  //   }

  componentDidMount() {
    // this.display_robot();
    main();
  }
  render() {
    return (
      <div id="block">
        <canvas id="#c" width="1000" height="1000"></canvas>
      </div>
    );
  }
}
