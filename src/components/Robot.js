import React, { Component } from "react";
import * as THREE from "three";
import * as dat from "dat.gui";

export default class Robot extends Component {
  display_robot() {
    var scene = new THREE.Scene();
    var robot_div = document.getElementById("robot");
    // Camera
    var aspect =
      robot_div.parentNode.clientWidth / robot_div.parentNode.clientHeight;
    var camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    camera.position.z = 5;
    camera.position.x = 5;
    camera.position.y = 5;
    camera.lookAt(0, 1.5, 0);
    camera.updateProjectionMatrix();
    // var controls = new THREE.OrbitControls( camera );

    // Renderer
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      robot_div.parentNode.clientWidth,
      robot_div.parentNode.clientHeight
    );
    robot_div.appendChild(renderer.domElement);

    // Model:
    var material = new THREE.MeshStandardMaterial();

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var base = new THREE.Mesh(geometry, material);
    scene.add(base);

    var shoulder = new THREE.Object3D();
    shoulder.translateY(0.5);
    base.add(shoulder);

    geometry = new THREE.BoxGeometry(0.5, 2, 0.5);
    var lowerArm = new THREE.Mesh(geometry, material);
    lowerArm.translateY(1);
    shoulder.add(lowerArm);

    var elbow = new THREE.Object3D();
    elbow.translateY(1);
    lowerArm.add(elbow);

    geometry = new THREE.BoxGeometry(0.5, 2, 0.5);
    var upperArm = new THREE.Mesh(geometry, material);
    upperArm.translateY(1);
    elbow.add(upperArm);

    var secondElbow = new THREE.Object3D();
    secondElbow.translateY(1);
    upperArm.add(secondElbow);

    geometry = new THREE.BoxGeometry(0.5, 2, 0.5);
    var otherArm = new THREE.Mesh(geometry, material);
    otherArm.translateY(1);
    secondElbow.add(otherArm);

    var newArm = new THREE.Object3D();
    newArm.translateY(2);
    secondElbow.add(newArm);

    geometry = new THREE.BoxGeometry(0.5, 2, 0.5);
    var newLink = new THREE.Mesh(geometry, material);
    newLink.translateY(1);
    newArm.add(newLink);

    var otherBase = new THREE.Object3D();
    otherBase.translateY(1);
    newLink.add(otherBase);

    geometry = new THREE.BoxGeometry(1, 1, 1);
    var newBase = new THREE.Mesh(geometry, material);
    newBase.translateY(0.5);
    otherBase.add(newBase);

    // Light
    var light = new THREE.DirectionalLight(0xffffff, 1.0);
    light.position.set(10, 5, 10);
    light.target = base;
    scene.add(light);

    light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);

    // Options (DAT.GUI)
    var options = {
      base: 0,
      shoulder: 0,
      elbow: -44,
      secondElbow: -56,
      newArm: -68
    };
    // DAT.GUI Related Stuff
    var gui = new dat.GUI({ autoPlace: false });
    gui.add(options, "base", -180, 180).listen();
    // gui.add(options, 'shoulder', -180, 180).listen();
    gui.add(options, "elbow", -180, 180).listen();
    gui.add(options, "secondElbow", -180, 180).listen();
    gui.add(options, "newArm", -180, 180).listen();

    // Rendering
    var zAxis = new THREE.Vector3(0, 0, 1);
    var yAxis = new THREE.Vector3(0, 1, 0);

    robot_div.appendChild(gui.domElement);
    var show = function() {
      requestAnimationFrame(show);

      // Rotate joints
      base.setRotationFromAxisAngle(yAxis, (options.base * Math.PI) / 180);
      // shoulder.setRotationFromAxisAngle(zAxis, options.shoulder * Math.PI / 180);
      elbow.setRotationFromAxisAngle(zAxis, (options.elbow * Math.PI) / 180);
      secondElbow.setRotationFromAxisAngle(
        zAxis,
        (options.secondElbow * Math.PI) / 180
      );
      newArm.setRotationFromAxisAngle(zAxis, (options.newArm * Math.PI) / 180);

      // Render
      renderer.render(scene, camera);
    };

    // console.log(render.domElement);
    // return ;
    show();
  }
  componentDidMount() {
    this.display_robot();
  }
  render() {
    return <div id="robot"></div>;
  }
}
