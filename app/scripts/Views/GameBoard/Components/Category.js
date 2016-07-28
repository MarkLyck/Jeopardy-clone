import React from 'react'

import Clue from './Clue'

const Category = React.createClass({
  render: function() {
    let cluesList = (
      <ul className="clues-list">
        <Clue clickHandler={this.props.clickHandler} clue={this.props.clues[0]} categoryName={this.props.categoryName} key="1"/>
        <Clue clickHandler={this.props.clickHandler} clue={this.props.clues[1]} categoryName={this.props.categoryName} key="2"/>
        <Clue clickHandler={this.props.clickHandler} clue={this.props.clues[2]} categoryName={this.props.categoryName} key="3"/>
        <Clue clickHandler={this.props.clickHandler} clue={this.props.clues[3]} categoryName={this.props.categoryName} key="4"/>
        <Clue clickHandler={this.props.clickHandler} clue={this.props.clues[4]} categoryName={this.props.categoryName} key="5"/>
      </ul>
    )
    return (
      <div className="category-container">
        <h3 className="category-name">{this.props.categoryName}</h3>
        {cluesList}
      </div>
    )
  }
})

export default Category
