import React from 'react';
import ReactDOM from 'react-dom';
import faker from './images/faker.jpeg';
import './search.less';
import { common } from  '../../common/index'

class Search extends React.Component {
    constructor() {
        super()
        this.state = {
            Text: null
        }
        this.loadComponent = () => {
            import('./text.js').then((Text) => {
                this.setState({
                    Text: Text.default
                })
            })
        }
        this.loadComponent = this.loadComponent.bind(this)
    }
    render() {
        const { Text } = this.state;
        console.log(Text)
        return <div className="search-text">
            {common()}
            搜索文字的内容<img src={ faker } onClick={this.loadComponent}/>
            {
                Text ? <Text /> : null
            }
        </div>;
    }
}

ReactDOM.render(
    <Search />,
    document.getElementById('root')
)
