import React from 'react'

import Clue from './Clue'

const Category = React.createClass({
  render: function() {
    let cluesList = (
      <ul className="clues-list">
        <Clue clickHandler={this.props.clickHandler} clue={this.props.clues[0]} key="1"/>
        <Clue clickHandler={this.props.clickHandler} clue={this.props.clues[1]} key="2"/>
        <Clue clickHandler={this.props.clickHandler} clue={this.props.clues[2]} key="3"/>
        <Clue clickHandler={this.props.clickHandler} clue={this.props.clues[3]} key="4"/>
        <Clue clickHandler={this.props.clickHandler} clue={this.props.clues[4]} key="5"/>
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
