import React, { Component } from 'react';
import mdStore from "../../util/mdStore";
import PageView from '../PageView';

const statusStore = mdStore('status');

export default class StatusContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {...statusStore.state};
  }

  componentDidMount() {
    this._sub = statusStore.subscribe((store) => {
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
    return <PageView {...this.state} header="Status and Initialization"
                     link="api" label="Full API"/>
  }
}
