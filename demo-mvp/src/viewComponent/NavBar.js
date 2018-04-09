import React, { Component } from "react";
import {
  Container,
  Image,
  Menu,
  Responsive
} from "semantic-ui-react";
import logo from "../img/logo.png";

function handleClick() {
  window.open("http://booking-token.launchrock.com/");
}

const NavBarDesktop = ({ index }) => (
  <Menu fixed="top" inverted>
    <Menu.Item>
      <Image  onClick={handleClick} size="mini" src={logo} />
    </Menu.Item>
    <Menu.Item>
      <p>DEMO BOOKING TOKEN UNIT PROTOCOL</p>
    </Menu.Item>
  </Menu>
);

const NavBarChildren = ({ children }) => (
  <Container style={{ marginTop: "5em" }}>{children}</Container>
);

class NavBar extends Component {
  render() {
    const { children } = this.props;
    return (
      <div>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <NavBarDesktop />
          <NavBarChildren>{children}</NavBarChildren>
        </Responsive>
      </div>
    );
  }
}
export default NavBar;
