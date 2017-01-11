import React, { Component } from 'react';
import './App.css';
import {sortBy} from 'lodash'
import classNames from 'classnames'

const DEFAULT_QUERY = 'redux';

const DEFAULT_PAGE = 0;

const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';

const PATH_SEARCH = '/search?';

const PARAM_SEARCH = 'query=';

const PARAM_PAGE = 'page=';

const PARAM_HPP = 'hitsPerPage=';

// const isSearched = (query) => (item) => !query || item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1;

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse()

};

const Button = ({onClick, children, className}) =>
      <button onClick={onClick} type="button" className={className}> {children} </button>;

const Loading = () =>
  <div> Loading... </div>;

const withLoading = (Component) => ({isLoading, ...rest}) =>
  isLoading? <Loading /> : <Component {...rest} /> ;

const ButtonWithLoading = withLoading(Button);

const SearchInput = ({value, onChange, children, onSubmit}) =>
      <form onSubmit={onSubmit}>
        <input type="text" value={value} onChange={onChange} />
        <button type="submit">{children}</button>
      </form>;

class SearchTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortKey: 'NONE',
      isSortReverse: false,
    }

    this.onSort = this.onSort.bind(this)

  }

  onSort(sortKey) {
    const isSortReverse = this.state.sortKey === sortKey?!this.state.isSortReverse : this.state.isSortReverse;
    this.setState({sortKey, isSortReverse})
  }

  render() {
    const {list} = this.props;
    const {sortKey, isSortReverse} = this.state;
    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse? sortedList.reverse() : sortedList;

      return (<div className="table">
        <div className="table-header">
          <span style={{ width: '40%' }}>
            <Sort
              sortKey={'TITLE'}
              onSort={this.onSort}
              activeSortKey={sortKey}
            > Title
            </Sort>
          </span>
          <span style={{ width: '30%' }}>
            <Sort
              sortKey={'AUTHOR'}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              Author
            </Sort>
          </span>
          <span style={{ width: '15%' }}>
            <Sort
              sortKey={'COMMENTS'}
              onSort={this.onSort}
              activeSortKey={sortKey}
            > Comments
            </Sort>
          </span>
          <span style={{ width: '15%' }}>
            <Sort
              sortKey={'POINTS'}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              Points
            </Sort>
          </span>
        </div>
        {reverseSortedList.map(item =>
          <div key={item.objectID} className="table-row">
            <span style={{ width: '40%' }}><a href={item.url}>{item.title}</a></span>
            <span style={{ width: '30%' }}>{item.author}</span>
            <span style={{ width: '15%' }}>{item.num_comments}</span>
            <span style={{ width: '15%' }}>{item.points}</span>
          </div>
        )
        }
      </div>);
    }
}

const Sort = ({ sortKey, activeSortKey, onSort, children }) => {
  const sortClass = classNames(
    'button-inline',
    {'button-active': sortKey === activeSortKey}
  );
  
  return (
  <Button onClick={() => onSort(sortKey) } className={sortClass}>
    {children}
  </Button> )
};

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      results: null,
      query: DEFAULT_QUERY,
      searchKey: '',
      isLoading: false,
    };

    this.setTopStories = this.setTopStories.bind(this);
    this.fetchTopStories = this.fetchTopStories.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.needToSearch = this.needToSearch.bind(this);

  }

  needToSearch(query){
    return !this.state.results[query]
  }

  setTopStories(result){
    const {hits, page} = result;
    const {searchKey} = this.state;

    const oldHits = page === 0? [] : this.state.results[searchKey].hits;
    const updatedHits = [...oldHits, ...hits];
    this.setState({results: {
                  ...this.state.results,
                  [searchKey]: {hits: updatedHits, page}
                },
                  isLoading: false
              })
  }

  fetchTopStories(query, page){
    this.setState({isLoading: true});
    fetch(`${PATH_BASE}${PATH_SEARCH}${PARAM_SEARCH}${query}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setTopStories(result))
  }

  componentDidMount() {
    const { query } = this.state;
    this.setState({searchKey: query});
    this.fetchTopStories(query, DEFAULT_PAGE);
  }

  handleInput(e){
    this.setState({query: e.target.value})
  }

  onSearchSubmit(event) {
    const { query } = this.state;
    this.setState({searchKey:query});
    if (this.needToSearch(query)) {
      this.fetchTopStories(query, DEFAULT_PAGE);
    }
    event.preventDefault();
  }

  render() {
    const {results, query, searchKey, isLoading} = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];
    return (
      <div className="page">
        <div className="interactions">
          <SearchInput value={query} onChange={this.handleInput} onSubmit={this.onSearchSubmit}>Search</SearchInput>
          <SearchTable list={list} />
        </div>
        <div className="interactions">
            <ButtonWithLoading isLoading={isLoading} onClick={() => this.fetchTopStories(searchKey, page + 1)} > More </ButtonWithLoading>
        </div>
      </div>
    );
  }
}

export default App;

export {Button, SearchInput, SearchTable }