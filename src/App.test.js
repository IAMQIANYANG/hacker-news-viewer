import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer'
import App from './App';
import {Button, SearchInput, SearchTable} from './App';
import {shallow} from 'enzyme'

describe('App', () => {
  it('renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
  });

  test('snapshots', () => {
    const component = renderer.create(
      <App />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })

});


describe('Button', () => {
  it('renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Button> More over </Button>, div);
  });

  test('snapshots', () => {
    const component = renderer.create(
      <Button> More </Button>
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })

});

describe('SearchInput', () => {
  it('renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SearchInput> Search </SearchInput>, div);
  });

  test('snapshots', () => {
    const component = renderer.create(
      <SearchInput> Search </SearchInput>
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })

});


describe('SearchTable', () => {
  const props = { list: [
    { title: '1', author: '1', num_comments: 1, points: 2, objectID: 'y' },
    { title: '2', author: '2', num_comments: 1, points: 2, objectID: 'z' }
  ]
  };

  it('renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SearchTable {...props} />, div);
  });

  test('snapshots', () => {
    const component = renderer.create(
      <SearchTable {...props} />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('shows two items in list', () => {
    const element= shallow(
      <SearchTable {...props} />
      );

    expect(element.find('.table-row').length).toBe(2);
  })

});