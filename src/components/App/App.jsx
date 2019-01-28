import React from "react";
import sc from 'styled-components';
import {
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Image,
  List,
  Menu,
  Segment,
} from 'semantic-ui-react'
import Intro from './../Intro';
import Start from './../Start';
import Guide from './../Guide';
import Status from './../Status';
import Api from './../Api';

import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import Headline from "../../views/Headline";

const MIRROR_GIRL = require('../../img/mirrorGirl.svg');
const LOGO = require('../../img/logo.png');
const fixedImage = {
  position: 'fixed',
  left: '-11rem',
  top: '1.5rem'
};

const MainSection = sc.section`
height: 100vh;
display: flex;
flex-direction: column;
justify-content: stretch;
`;

const StyledContainer = sc.article`
margin-top: 2.8rem !important;
padding-left: 26rem !important;
padding-top: 2rem;
max-width: 1200px;
flex-grow: 1;`;

export default () => (

  <Router>
    <MainSection>
      <Menu fixed='top'>
        <Container>
          <Menu.Item as='a' header>
            <Image size='mini' src={LOGO} style={{marginRight: '1.5em'}}/>
            Looking Glass Image
          </Menu.Item>
          <Menu.Item><a href="/">Home</a></Menu.Item>

          <Dropdown item simple text='Guide'>
            <Dropdown.Menu>
              <Dropdown.Item><Link to="/start">Quick Start</Link></Dropdown.Item>
              <Dropdown.Item><Link to="/guide">Usage Guide</Link></Dropdown.Item>
              <Dropdown.Item><Link to="/status">Status and Initialization</Link></Dropdown.Item>
              <Dropdown.Item><Link to="/api">API Documentation</Link></Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Container>
      </Menu>
      <Image src={MIRROR_GIRL} style={fixedImage}/>
      <StyledContainer>
        <Headline as="h1">Looking Glass Engine</Headline>
        <Switch>
          <Route path="/" exact component={Intro}/>
          <Route path="/start" component={Start}/>
          <Route path="/guide" component={Guide}/>
          <Route path="/status" component={Status}/>
          <Route path="/api" component={Api}/>
        </Switch>
      </StyledContainer>

      <Segment inverted vertical style={{margin: '5em 0em 0em', padding: '5em 0em'}}>
        <Container textAlign='center'>
          <Grid divided inverted stackable>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='Group 1'/>
              <List link inverted>
                <List.Item as='a'>Link One</List.Item>
                <List.Item as='a'>Link Two</List.Item>
                <List.Item as='a'>Link Three</List.Item>
                <List.Item as='a'>Link Four</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='Group 2'/>
              <List link inverted>
                <List.Item as='a'>Link One</List.Item>
                <List.Item as='a'>Link Two</List.Item>
                <List.Item as='a'>Link Three</List.Item>
                <List.Item as='a'>Link Four</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='Group 3'/>
              <List link inverted>
                <List.Item as='a'>Link One</List.Item>
                <List.Item as='a'>Link Two</List.Item>
                <List.Item as='a'>Link Three</List.Item>
                <List.Item as='a'>Link Four</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={7}>
              <Header inverted as='h4' content='Footer Header'/>
              <p>
                Extra space for a call to action inside the footer that could help re-engage users.
              </p>
            </Grid.Column>
          </Grid>

          <Divider inverted section/>
          <Image centered size='mini' src='/logo.png'/>
          <List horizontal inverted divided link size='small'>
            <List.Item as='a' href='#'>
              Site Map
            </List.Item>
            <List.Item as='a' href='#'>
              Contact Us
            </List.Item>
            <List.Item as='a' href='#'>
              Terms and Conditions
            </List.Item>
            <List.Item as='a' href='#'>
              Privacy Policy
            </List.Item>
          </List>
        </Container>
      </Segment>
    </MainSection>
  </Router>
)
