// import React from 'react';
// import faker from './images/faker.jpg';
// import './search.less';
// import { common } from '../../common/index';
const React = require('react');
const faker = require('./images/faker.jpg');
require('./search.less');
const { common } = require('../../common/index');

class Search extends React.Component {
  constructor() {
    super();
    this.state = {
      Text: null,
    };
    this.loadComponent = () => {
      import('./text.js').then((Text) => {
        this.setState({
          Text: Text.default,
        });
      });
    };
    this.loadComponent = this.loadComponent.bind(this);
  }

  render() {
    const { Text } = this.state;
    return (
      <div className="searchText">
        {common()}
        搜索文字的内容
        <img src={faker} onClick={this.loadComponent} alt="" />
        {
          Text ? <Text /> : null
        }
      </div>
    );
  }
}

module.exports = <Search />;
