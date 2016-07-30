import React from 'react'

import Clue from './Clue'

const Category = React.createClass({
  render: function() {
    // This doesn't work for some reason...
    // let cluesList = this.props.category.clues.map((category, i) => {
    //   <Clue startQuestion={this.props.startQuestion} clue={this.props.category.clueIds[i]} categoryName={this.props.category.title} key={i}/>
    // })
    let cluesList = (
      <ul className="clues-list">
        <Clue startQuestion={this.props.startQuestion} clue={this.props.category.clueIds[0]} categoryName={this.props.category.title} key="1"/>
        <Clue startQuestion={this.props.startQuestion} clue={this.props.category.clueIds[1]} categoryName={this.props.category.title} key="2"/>
        <Clue startQuestion={this.props.startQuestion} clue={this.props.category.clueIds[2]} categoryName={this.props.category.title} key="3"/>
        <Clue startQuestion={this.props.startQuestion} clue={this.props.category.clueIds[3]} categoryName={this.props.category.title} key="4"/>
        <Clue startQuestion={this.props.startQuestion} clue={this.props.category.clueIds[4]} categoryName={this.props.category.title} key="5"/>
      </ul>
    )
    return (
      <div className="category-container">
        <h3 className="category-name">{this.props.category.title}</h3>
        <ul className='clues-list'>
          {cluesList}
        </ul>
      </div>
    )
  }
})

export default Category
