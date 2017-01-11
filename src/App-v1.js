/**
 * Created by pandachain on 2017-01-06.
 */

import React, { Component } from 'react';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

const isSearched = (query) => (item) => !query || item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list,
      query: ''
    };

    this.handleInput = this.handleInput.bind(this);
  }

  handleInput(e) {
    this.setState({query: e.target.value});
  }

  render() {
    const { query, list } = this.state;
    return (
      <div>
        <form>
          <input value={query} onChange={this.handleInput} type="text" />
        </form>
        <div>
          {list.filter(isSearched(query)).map(item => {
            return (
              <div key={item.objectID}>
                <span><a href={item.url}>{item.title}</a></span>
                <span>{item.author}</span>
                <span>{item.num_comments}</span>
                <span>{item.points}</span>
              </div>
            )

          })}
        </div>
      </div>
    )
  }

}

export default App