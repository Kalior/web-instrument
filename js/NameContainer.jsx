import React from "react";

export default class NameContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nextName: props.name,
      changingName: false
    };
  }
  onNameChange = () => {
    const { nextName } = this.state;
    this.setState({ changingName: false });
    this.props.onNameChange(nextName);
  };
  onInput = event => {
    this.setState({ nextName: event.target.value });
  };
  startChangingName = () => {
    this.setState({ changingName: true });
  };
  handleKeyPress = event => {
    if (event.key === "Enter") {
      this.onNameChange();
    }
  };

  render() {
    const { changingName, nextName } = this.state;
    const { name } = this.props;
    if (changingName) {
      return (
        <div className="container name-container">
          <input
            type="text"
            value={nextName}
            onChange={this.onInput}
            onKeyPress={this.handleKeyPress}
          />
          <i
            className="fa fa-check"
            onClick={(e) => this.onNameChange()}
          />
        </div>
      );
    } else {
      return (
        <div className="container name-container">
          <h3>{name}</h3>
          <i
            className="fa fa-pencil"
            onClick={this.startChangingName}
          />
        </div>
      );
    }
  }
}
