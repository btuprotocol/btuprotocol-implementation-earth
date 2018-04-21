import React from 'react'
import _ from 'lodash'
import {
  List,
  Button,
  Card,
  Icon,
  Transition
} from 'semantic-ui-react'

class AvailabilityDisplay extends React.Component {
    constructor(props, context) {
        super(props, context)
        let { tiles, availabilities } = props
        this.state = {
            tiles: tiles,
            availabilities: availabilities,
            displayers: []
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        let displayers = []
        for (let i = 0; i < nextProps.tiles.length; i++) {
            displayers[i] = prevState.displayers[i] || false
        }
        return {
            tiles: nextProps.tiles,
            availabilities: nextProps.availabilities,
            displayers: displayers
        }
    }

    toggleVisibility = (i) => {
        let displayers = this.state.displayers
        displayers[i] = !displayers[i]
        this.setState({ displayers: displayers })
    }

    render() {
        const items = _.times(this.state.tiles.length, i => (
            <List.Item key={i}>
                <Card fluid>
                    <Card.Content>
                        <p>
                            <Icon name='address book outline' />
                            {this.state.availabilities[i].prettyDisplay()}
                            <Button color="teal" floated="right" size="small" content={this.state.displayers[i] ? 'Hide details' : 'Show details'} onClick={() => this.toggleVisibility(i)} />
                        </p>
                    </Card.Content>
                </Card>
                <Transition visible={this.state.displayers[i]} mountOnShow unmountOnHide animation='scale' duration={500}>
                    {this.state.tiles[i]}
                </Transition>
            </List.Item>
          )
        )
        return (
            <List>{items}</List>
        )
    }
}
export default AvailabilityDisplay