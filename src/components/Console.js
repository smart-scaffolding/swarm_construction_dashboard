import React, { Component } from "react";
import { TweetBody } from "./tweet";
import {
  PullToRefresh,
  PullDownContent,
  ReleaseContent,
  RefreshContent
} from "react-js-pull-to-refresh";
import "./Console.css";

class Console extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
    this.handleRefresh = this.handleRefresh.bind(this);
    this.getUser = this.getUser.bind(this);
  }

  handleRefresh() {
    return new Promise(resolve => {
      this.getUser();
    });
  }

  componentWillMount() {
    this.getUser();
    this.getUser();
    this.getUser();
    this.getUser();
  }

  getUser() {
    fetch("https://randomuser.me/api/")
      .then(response => {
        if (response.ok) return response.json();
        throw new Error("Request failed.");
      })
      .then(data => {
        this.setState({
          users: [
            {
              name: data.results[0].name,
              //   image: data.results[0].picture.medium,
              image: "",

              tweet: data.results[0].email
            },
            ...this.state.users
          ]
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <PullToRefresh
        pullDownContent={<PullDownContent />}
        releaseContent={<ReleaseContent />}
        refreshContent={<RefreshContent />}
        pullDownThreshold={2}
        onRefresh={this.handleRefresh}
        triggerHeight={20}
        backgroundColor="black"
      >
        <div className="main-body">
          {[...this.state.users].map((user, index) => {
            let name = "Path Planning";
            let handle = "09:36:47";
            let image = user.image;
            let tweet = "Searching Through A* Nodes";
            console.log(image);
            return (
              <TweetBody
                key={index}
                name={name}
                handle={handle}
                tweet={tweet}
                image={image}
              />
            );
          })}
        </div>
      </PullToRefresh>
    );
  }
}

export default Console;
