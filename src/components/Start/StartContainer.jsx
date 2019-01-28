import React, { Component } from 'react';
import mdStore from "../../util/mdStore";
import PageView from "../PageView";

const startStore = mdStore('start');

export default class StartContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {...startStore.state};
  }

  componentDidMount() {
    this._sub = startStore.subscribe((store) => {
      this.setState(store.state)
    },
      (error) => {
      this.setState({error})
      }
      );
  }

  componentWillUnmount() {
    if (this._sub) {
      this._sub.unsubscribe();
    }
  }

  render() {
    return <PageView {...this.state} header="Quick Start"
                     link="guide" label="Usage Guide"/>
  }
}
