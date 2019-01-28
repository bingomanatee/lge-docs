import React, {Component} from 'react';
import mdStore from "../../util/mdStore";
import PageView from '../PageView';

const apiStore = mdStore('api');

export default class ApiContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {...apiStore.state};
  }

  componentDidMount() {
    this._sub = apiStore.subscribe((store) => {
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
    console.log('rendering API');
    return (
      <PageView {...this.state} header="LGE API Documentation"/>
    );
  }
}
