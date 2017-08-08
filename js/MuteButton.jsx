import React from 'react'

export default class Visualiser extends React.Component {
  toggleMuted = () => {
    this.props.handleToggleMuted();
  };
  render () {
    const {muted} = this.props;
    return (
      <div
        className="mute-button"
        onClick={ () => this.toggleMuted() }
      >
        {muted ?
          <i className="fa fa-volume-off" /> :
          <i className="fa fa-volume-up" />
        }
      </div>
    )
  }
}
