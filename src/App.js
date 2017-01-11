import React, { Component } from 'react';
import './App.css';
import {sortBy} from 'lodash'

const DEFAULT_QUERY = 'redux';

const DEFAULT_PAGE = 0;

const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';

const PATH_SEARCH = '/search?';

const PARAM_SEARCH = 'query=';

const PARAM_PAGE = 'page=';

const PARAM_HPP = 'hitsPerPage=';

// const isSearched = (query) => (item) => !query || item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1;


const Button = ({onClick, children}) =>
      <button onClick={onClick} type="button"> {children} </button>;

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

const SearchTable = ({list, pattern, sortKey, onSort}) =>
      <div className="table">
        <div className="table-header">
          <span style={{ width: '40%' }}>
            <Sort
              sortKey={'TITLE'}
              onSort={onSort}
            > Title
            </Sort>
          </span>
          <span style={{ width: '30%' }}>
            <Sort
              sortKey={'AUTHOR'}
              onSort={onSort}
            >
              Author
            </Sort>
          </span>
          <span style={{ width: '15%' }}>
            <Sort
              sortKey={'COMMENTS'}
              onSort={onSort}
            > Comments
            </Sort>
          </span>
          <span style={{ width: '15%' }}>
            <Sort
              sortKey={'POINTS'}
              onSort={onSort}
            >
              Points
            </Sort>
          </span>
        </div>
        {SORTS[sortKey](list).map(item =>
          <div key={item.objectID} className="table-row">
            <span style={{ width: '40%' }}><a href={item.url}>{item.title}</a></span>
            <span style={{ width: '30%' }}>{item.author}</span>
            <span style={{ width: '15%' }}>{item.num_comments}</span>
            <span style={{ width: '15%' }}>{item.points}</span>
          </div>
        )
        }
      </div>;

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse()

};

const Sort = ({ sortKey, onSort, children }) => <Button onClick={() => onSort(sortKey)}>
  {children}
</Button>

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      results: null,
      query: DEFAULT_QUERY,
      searchKey: '',
      isLoading: false,
      sortKey: 'NONE'
    };

    this.setTopStories = this.setTopStories.bind(this);
    this.fetchTopStories = this.fetchTopStories.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.needToSearch = this.needToSearch.bind(this);
    this.onSort = this.onSort.bind(this);

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

  onSort(sortKey) {
    this.setState({sortKey})
  }

  render() {
    const {results, query, searchKey, isLoading, sortKey} = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];
    return (
      <div className="page">
        <div className="interactions">
          <SearchInput value={query} onChange={this.handleInput} onSubmit={this.onSearchSubmit}>Search</SearchInput>
          <SearchTable list={list} pattern={query} sortKey={sortKey} onSort={this.onSort}/>
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