import React from 'react'

const Category = React.createClass({
  render: function() {
    return (
      <div className="category-container">
        <h3 className="category-name">{this.props.categoryName}</h3>
        <ul className="clues-list">
          {this.props.children}
        </ul>
      </div>
    )
  }
})

export default Category
