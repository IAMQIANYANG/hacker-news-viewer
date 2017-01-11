
import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = 100;

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search?';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';


// const isSearched = (query) => (item) => !query || item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1;

const SearchInput = ({value, onChange}) =>
  <form>
    <input value={value} onChange={onChange} type="text" />
  </form>;

const SearchResultDisplay = ({searchTerm, list}) =>
  <div className="table">
    {list.map(item => {
      return (
        <div key={item.objectID} className="table-row">
          <span><a href={item.url}>{item.title}</a></span>
          <span>{item.author}</span>
          <span>{item.num_comments}</span>
          <span>{item.points}</span>
        </div>
      )

    })}
  </div>;

const Button = ({onClick, children}) =>
  <button type="submit" onClick={onClick}>{children}</button>;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      query: DEFAULT_QUERY,
      searchKey: ''
    };

    this.handleInput = this.handleInput.bind(this);
    this.fetchTopStories = this.fetchTopStories.bind(this);
    this.updateResults = this.updateResults.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  handleInput(e) {
    this.setState({query: e.target.value});
  }

  fetchTopStories(query, page) {
    fetch(`${PATH_BASE}${PATH_SEARCH}${PARAM_SEARCH}${query}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.updateResults(result));
  }

  updateResults(result) {
    const {hits, page} = result;
    const { searchKey } = this.state;
    const oldHits = page === 0? [] : this.state.results[searchKey].hits;
    const updatedHits = [...oldHits, ...hits ];
    this.setState({
      results: {
        ...this.state.results,
        [searchKey]: {hits: updatedHits, page}
      }
    });
  }

  componentDidMount() {
    const {query} = this.state;
    this.setState({searchKey: query});
    this.fetchTopStories(query, DEFAULT_PAGE)

  }

  onSearchSubmit() {
    const { query } = this.state;
    this.setState({searchKey: query});
    if (!this.state.results[query]) {
      console.log("yoyo");
      this.fetchTopStories(query, DEFAULT_PAGE);
    }
  }

  render() {
    const { query, results, searchKey } = this.state;
    const  page  = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];

    return (
      <div className="page">
        <div className="interactions">
          <SearchInput value={query} onChange={this.handleInput} />
          <Button onClick={this.onSearchSubmit}>Search</Button>
          <SearchResultDisplay searchTerm={query} list={list} />

          <Button onClick={() => this.fetchTopStories(searchKey, page + 1)}> More </Button>
        </div>
      </div>
    )
  }

}

export default App

export {
  Button,
  SearchInput,
  SearchResultDisplay}