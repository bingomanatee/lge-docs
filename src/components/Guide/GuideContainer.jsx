import React, {Component} from 'react';
import mdStore from "../../util/mdStore";
import PageView from '../PageView';

const guideStore = mdStore('guide');

export default class GuideContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {...guideStore.state};
  }

  componentDidMount() {
    this._sub = guideStore.subscribe((store) => {
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
    return (
      <PageView {...this.state} header="Usage Guide" link="status" label="Status and Initialization"/>
    );
  }
}
