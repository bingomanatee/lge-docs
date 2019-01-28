import {Link} from "react-router-dom";
import {Button} from "semantic-ui-react";
import EndNote from "./EndNote";
import React from "react";

export default ({link, label}) => {
  return <EndNote>
    <Link to={`/${link}`}><Button size="massive" primary>{label}</Button></Link>
  </EndNote>
}
