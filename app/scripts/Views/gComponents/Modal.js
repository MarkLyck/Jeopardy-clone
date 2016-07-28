import React from 'react'
import _ from 'underscore'

const Modal = React.createClass({
  removeModal: function(e) {
    let targetClassList = _.toArray(e.target.classList)
    if (targetClassList.indexOf('modal-container') !== -1) {
      this.props.removeModal()
    }
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
