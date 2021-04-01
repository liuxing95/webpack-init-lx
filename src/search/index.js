import React from 'react';
import ReactDOM from 'react-dom';
import faker from './images/faker.jpeg';
import './search.less';
import { common } from  '../../common/index'

class Search extends React.Component {
    render() {
        return <div className="search-text">
            {common()}
            搜索文字的内容<img src={ faker } />
        </div>;
    }
}

ReactDOM.render(
    <Search />,
    document.getElementById('root')
)
