import React, {Component} from 'react';
import mdStore from '../../util/mdStore';
import PageView from "../PageView";

const introStore = mdStore('intro');

export default class IntroContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {...introStore.state};
  }

  componentDidMount() {
    introStore.stream.subscribe((store) => {
      this.setState(store.state);
    }, (error) => {
      console.log('error: ', error);
      this.setState({error})
    })
  }

  render() {
    return <PageView {...this.state} header="A streaming state manager for React"
                     link="start" label="Quick Start"/>

  }
}
