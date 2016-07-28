import React from 'react'

const Modal = React.createClass({
  removeModal: function(e) {
    this.props.removeModal()
  },
  render: function() {
    return (
      <div onClick={this.removeModal} className="modal-container">
        <div className="modal">
          {this.props.children}
        </div>
      </div>
    )
  }
})

export default Modal
