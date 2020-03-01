import SmartConnect from "wslink/src/SmartConnect";
import "normalize.css";

import RemoteRenderer from "paraviewweb/src/NativeUI/Canvas/RemoteRenderer";
import SizeHelper from "paraviewweb/src/Common/Misc/SizeHelper";
import ParaViewWebClient from "paraviewweb/src/IO/WebSocket/ParaViewWebClient";
import * as React from "react";
// document.body.style.padding = "0";
// document.body.style.margin = "0";

// const divRenderer = document.createElement("div");
// document.body.appendChild(divRenderer);

// divRenderer.style.position = "relative";
// divRenderer.style.width = "100vw";
// divRenderer.style.height = "100vh";
// divRenderer.style.overflow = "hidden";

export default class Paraview extends React.Component {
  componentDidMount() {
    const divRenderer = document.getElementById("paraview_div");
    divRenderer.style.position = "relative";
    divRenderer.style.width = "100vw";
    divRenderer.style.height = "100vh";
    divRenderer.style.overflow = "hidden";
    const config = { sessionURL: "ws://localhost:1234/ws" };
    const smartConnect = SmartConnect.newInstance({ config });
    smartConnect.onConnectionReady(connection => {
      const pvwClient = ParaViewWebClient.createClient(connection, [
        "MouseHandler",
        "ViewPort",
        "ViewPortImageDelivery"
      ]);
      const renderer = new RemoteRenderer(pvwClient);
      renderer.setContainer(divRenderer);
      renderer.onImageReady(() => {
        console.log("We are good");
      });
      window.renderer = renderer;
      SizeHelper.onSizeChange(() => {
        renderer.resize();
      });
      SizeHelper.startListening();
    });
    smartConnect.connect();
  }
  render() {
    return <div id="paraview_div"></div>;
  }
}