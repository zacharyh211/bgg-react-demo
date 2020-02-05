import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  withRouter,
} from "react-router-dom";
import onClickOutside from "react-onclickoutside";
import './App.css';
import Select from 'react-select';
import axios from 'axios';
import qs from 'qs';
import {DebounceInput} from 'react-debounce-input';


class App extends React.Component {
  render() {
    return  (
      <Router>
        <BoardgameSearchWithRouter/>
      </Router>
    )
  }
}


class BoardgameSearch extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      current_data: [],
      source: 'boardgames',
      db_url: 'https://bgdbbackend.herokuapp.com/bgdb/search/',
      exclusive_search_pref: ['designer','artist','publisher','boardgame'],
      show_details:false,
      selected_data:Object(),
      searchQuery: '',
      searchType: 'boardgame',
    }
  }

  componentDidMount() {
    this.update_current_data();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.location.search !== this.props.location.search) {
      this.update_current_data();
    }
  }

  setSelectedItem(data) {
    this.setState({selected_data:data})
  }

  setShowDetails(val) {
    this.setState({show_details:val})
  }

  render() {
    
    return (
      <div className = 'BoardgameSearch'>
        <SearchBar 
          updateSearch = {()=>this.setQueryParam(this.state.searchType+'__name',this.state.searchQuery)}
          searchType = {this.state.searchType}
          searchQuery = {this.state.searchQuery}
          setSearchType = {type => this.setState({'searchType':type})}
          setSearchQuery = {q => this.setState({'searchQuery':q})}
        />
        <div className = 'lower-panel'>
          <div className = 'filter-panel'>
            <FilterGroup 
              handleFiltering={this.handleFiltering.bind(this)}
              db_url = {this.state.db_url}
              form_data = {this.parseParams()}
            />
          </div>
          <div className = 'display-panel'>
            <Toolbar
              onDirectionChange={this.handleFiltering.bind(this)}
              onOrderChange={this.handleFiltering.bind(this)}
              form_data = {this.parseParams()}
            />
            <div className = 'viewer-container'>
              <div className = 'display-view'>
                {
                  this.state.pageCount &&
                  <PaginationBar 
                    pageCount = {this.state.pageCount || 1} 
                    curPage = {this.parseParams().page ? this.parseParams().page[0] : 1} 
                    updateCurPage = {x=>this.setQueryParam('page',x)}/>
                }
                <GameView
                  data = {this.state.current_data}
                  set_show_details = {this.setShowDetails.bind(this)}
                  set_selected = {this.setSelectedItem.bind(this)}
                />
                {
                  this.state.pageCount &&
                  <PaginationBar 
                    pageCount = {this.state.pageCount || 1} 
                    curPage = {this.parseParams().page ? this.parseParams().page[0] : 1} 
                    updateCurPage = {x=>this.setQueryParam('page',x)}/>
                }
              </div>
              <GameEntryDetailPanelBlurClose 
                data={this.state.selected_data} 
                search_redirect={(k,v)=>this.setQueryParam(k+'__name', v)} 
                show_details={this.state.show_details} 
                show={this.setShowDetails.bind(this)}/>
            </div>
          </div>
        </div>
      </div>
    )
  }

  getSearch() {
    let params = this.parseParams();
    let type = ['boardgame','designer','publisher','artist'].find(s=>s+'__name' in params)
    
    if(type !== undefined)
      return {searchType:type, searchQuery:params[type+'__name']}
    return {searchType:'boardgame', 'searchQuery':''}

  }

  parseParams() {
    let search_str = this.props.location.search
    if(search_str) {
      let tmp = qs.parse(search_str, {comma: true, ignoreQueryPrefix: true})
      let tru = {}
      Object.entries(tmp).forEach(([key,value])=> tru[key] = Array.isArray(value) ? value : (value ? [value]: []))
      return tru
    }
    return Object()
  }

  setParams(settings) {
    let cur_settings = this.parseParams();

    if(settings.page === undefined)
      settings.page = ["1"]
    if(cur_settings.page !== undefined && settings.page[0] === cur_settings.page[0])
      settings.page = ["1"]
    Object.entries(settings).forEach(([k,v])=> {
      if(v === '' || v === undefined)
        delete settings[k]
    })

    this.props.history.push({
      pathname: '',
      search: qs.stringify(settings, {arrayFormat: 'comma'}),
    })
  }

  setQueryParam(key,value) {
    let cur = this.parseParams()
    if(this.state.exclusive_search_pref.some(e=>key.startsWith(e)))
      cur = Object.keys(cur
        ).filter(key => !this.state.exclusive_search_pref.some(e=>key.startsWith(e))
        ).reduce((next, curKey) => {next[curKey] = cur[curKey]; return next}, {})
    cur[key] = value
    this.setParams(cur)
  }

  handleFiltering(e, field) {
    let cur = this.parseParams()
    if(field)
      if(e !== null && (!Array.isArray(e) || e.length > 0))
        cur[field] = e.map(x=>x.value)
      else
        delete cur[field]
    else if(e.target.value)
      cur[e.target.name] = e.target.value
    else
      delete cur[e.target.name]
    if('ordering' in cur && !('order_direction' in cur))
      cur['order_direction'] = 'desc'
    this.setParams(cur)
  }

  update_current_data() {
    let search_str = this.props.location.search
    let objs =  qs.parse(search_str, {comma: true, ignoreQueryPrefix: true})
    let to_send = {...this.state.additional_params, ...objs}
    axios.get(this.state.db_url + this.state.source, 
      {
        params: to_send,
        paramsSerializer: params => qs.stringify(params, { arrayFormat: 'comma' }),
      }
    ).then(res => ({current_data:res.data.results.map(x=>({id:x.id, content:x})), pageCount:res.data.total_pages}))
    .then(res => this.setState({...res, ...this.getSearch()}))
  }
}

const BoardgameSearchWithRouter = withRouter(BoardgameSearch)

function GameView(props) {

  return (
    <div className = 'GameViewer'> {
      props.data.map(item => (
        <GameEntry 
          data={item.content} 
          structure='Grid' 
          key={item.id} 
          select={props.set_selected} 
          show={props.set_show_details}
        />
      ))}
    </div>
  )
}

function SearchBar(props) {
  return (
    <div className = 'search-panel'>
      <select 
        name = 'searchType' 
        onChange = {e=>props.setSearchType(e.target.value)}
        value = {props.searchType}
        className = 'ToolbarSelector'
      >
        <option value = 'boardgame'>Boardgame</option>
        <option value = 'designer'>Designer</option>
        <option value = 'artist'>Artist</option>
        <option value = 'publisher'>Publisher</option>
      </select>

      <input 
        type='string' 
        id='searchQ'
        name={'searchQQQ'}
        value={props.searchQuery}
        onChange={e=>props.setSearchQuery(e.target.value)}
        onKeyDown={e=>{if(e.key==='Enter') props.updateSearch()}}
      />

      <button
        onClick = {()=> props.updateSearch()}
      >
      {'Search'}
      </button>
    </div>
  )
}

function Toolbar(props) {
  return (
    <div className = 'toolbar'>
      <select 
        name = 'ordering' 
        onChange = {props.onOrderChange} 
        value = {'ordering' in props.form_data ? props.form_data['ordering'][0] : 'bayes_average_ordering'}
        className = 'ToolbarSelector'
      >
        <option value = 'bayes_average_rating'>Geek Rating</option>
        <option value = 'average_rating'>Average Rating</option>
        <option value = 'average_weight'>Average Complexity</option>
        <option value = 'year_published'>Year Published</option>
        <option value = 'num_ratings'>Number of Ratings</option>
        <option value = 'wishing'>Wishlist Count</option>
        <option value = 'owned'>Number Owned</option>
        <option value = ' playing_time'>Average Play Time</option>

      </select>
      <select 
        name = 'order_direction' 
        onChange = {props.onDirectionChange} 
        value={'order_direction' in props.form_data ? props.form_data['order_direction'][0] : 'desc'}
        className = 'ToolbarSelector'
      >
        <option value = 'asc'>Ascending</option>
        <option value = 'desc'>Descending</option>
      </select>

    </div>
  )
}

function PaginationButton(props) {
  return (
    <li onClick = {()=>props.onClick && props.onClick(props.num)} key = {props.num} style = {{
      padding: '4px',
      'textDecoration' : props.selected === props.num ? 'underline' : 'none',
      'backgroundColor': '#C7C6D1',
      margin: '5px',
      borderRadius: '4px',
      display: 'inline-block',
    }}>
      <div>
        {props.num}
      </div>
    </li>
  )
}

let paginationBarStyle = {
  justifyContents: 'center',
  listStyleType:'none',
  position: 'relative',
  width: '100%',
}

function PaginationBar(props) {
  //Design Idea:   [5 pages centered around current page. if 6 pages, extend previous by 1, else add (...) last 2 pages]
  let {pageCount,curPage,updateCurPage} = props
  curPage = Math.min(curPage, pageCount)
  let lowPage = Math.max(curPage-2,1)
  let upperPage = Math.min(lowPage+5,pageCount)
  return (
    <ul style={paginationBarStyle}>
      {1 < lowPage && <PaginationButton num={1} onClick = {updateCurPage} selected = {curPage}/>}
      {1 < lowPage && <PaginationButton num='...'/>}
      {[...Array(upperPage-lowPage+1).keys()].map(e => <PaginationButton num={e+lowPage} key={e+lowPage} onClick = {updateCurPage} selected = {curPage}/>)}
      {upperPage < pageCount && <PaginationButton num='...'/>}
      {upperPage < pageCount && <PaginationButton num={pageCount} onClick = {updateCurPage} selected = {curPage}/>}
    </ul>
  )
}

function GameEntry(props) {
  return (
    <div className = 'GameEntry' onClick={ () => {
      props.select(props.data);
      props.show(true);
    }}>
      <img src = {props.data.thumbnail} alt = {props.data.name}/>
      <div>{props.data.name}</div>
    </div>
  )
}

function ShowMoreList(props) {
  let [showing, setShowMore] = useState(false)

  let numChildren = props.children ? props.children.length : 0
  return (
    <div>
      <ul>
        {
          props.children &&
            props.children.slice(0,Math.min(numChildren, showing ? numChildren : props.previewCount)).map((e,i)=>
              <li key={i}> {e} </li>
            )
        }
      </ul>
      {
        numChildren > props.previewCount && 
          <div className = 'ShowMoreButton' key='show' onClick={()=>setShowMore(!showing)}>{showing ? 'less' : 'more'}</div>
      }
    </div>
  )
}

function GameEntryDetailPanel(props) {
  GameEntryDetailPanel.handleClickOutside = () => {props.show(false)}
  return (
    <div className = {'GameEntryDetailPanel ' + (props.show_details ? 'is-open' : '')}>
      <div className = 'ActionBar' onClick = {()=>props.show(false)}/>
      <div className = 'GameEntryDetailPanelMain'>
        <div className = 'GameTitleBar'>
          <b>{props.data.name}</b>  {`(${props.data.year_published})`}
        </div>
        <img src = {props.data.thumbnail} alt = {props.data.name}/>
        <div>
          <a href = {'https://boardgamegeek.com/boardgame/' + props.data.id} target='_blank' rel='noopener noreferrer'> {'Visit BoardGameGeek page'} </a>
        </div>
        <div className = 'GameCreatorInfo'>
          <h4>{'Designers:'}</h4>
          <ShowMoreList previewCount = {2}>{
            props.data.designer_set && props.data.designer_set.map((x,i)=>(
              <span className='SearchLink' key={i} onClick={()=>props.search_redirect('designer',x.name)}>{x.name}</span>
            ))}
          </ShowMoreList>

          <h4>{'Artists:'}</h4>
          <ShowMoreList previewCount = {2}>{
            props.data.artist_set && props.data.artist_set.map((x,i)=>(
              <span className='SearchLink' key={i} onClick={()=>props.search_redirect('artist',x.name)}>{x.name}</span>
            ))}
          </ShowMoreList>

          <h4>{'Publishers:'}</h4>
          <ShowMoreList previewCount = {2}>{
            props.data.publisher_set && props.data.publisher_set.map((x,i)=>(
              <span className='SearchLink' key={i} onClick={()=>props.search_redirect('publisher',x.name)}>{x.name}</span>
            ))}
          </ShowMoreList>
          <h4>{'Description:'}</h4>
          <p className = 'GameDescription' dangerouslySetInnerHTML={props.data.description && {__html: props.data.description.replace('&#226;&#128;&#147;',"–")}}/>
        </div>
      </div>
    </div>

  )
}

const clickOutsideConfig = {
  handleClickOutside: () => GameEntryDetailPanel.handleClickOutside,
  stopPropagation: true,
};

const GameEntryDetailPanelBlurClose = onClickOutside(GameEntryDetailPanel, clickOutsideConfig)


function FilterRange(props) {
  let min_id = 'min_' + props.category
  let max_id = 'max_' + props.category
  let min_api = props.category+'__gte'
  let max_api = props.category+'__lte'
  return (
    <div>
      <div>
        <span className = 'filter_headers'>
          {props.rangeHeader}
        </span>
      </div>
      <div className = 'range_input'>
        <span>
          <label htmlFor={min_id}>{'Min:'}</label>
          <DebounceInput 
            type='number' 
            id={min_id} 
            name={min_api} 
            debounceTimeout={1000}
            value={props.data[min_api]} 
            onChange={props.handleFiltering}
          />
        </span>
        <span>
          <label htmlFor={max_id}>{'Max:'}</label>
          <DebounceInput
            type='number'
            id={max_id}
            name={max_api}
            debounceTimeout={1000}
            value={props.data[max_api]}
            onChange={props.handleFiltering}
          />
        </span>
      </div><br/>
    </div>
  )
}

class FilterGroup extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      db_url: props.db_url,
      handleFiltering: props.handleFiltering,
    }
  }

  componentDidMount() {
    axios.get(this.state.db_url+'mechanics/')
      .then(res => res.data.map(x=>({value:x.name, label:x.name})))
      .then(result => this.setState({'mechanic_list':result}))

    axios.get(this.state.db_url+'categories/')
      .then(res => res.data.map(x=>({value:x.name, label:x.name})))
      .then(result => this.setState({'category_list':result}))
  }

  render() {
    return (
      <div>
        <div>
          <span className = 'filter_headers'>
            {'Mechanics'}
          </span>
        </div>
        <Select 
          options={this.state.mechanic_list} 
          onChange={e => this.state.handleFiltering(e,'mechanics')}
          value={'mechanics' in this.props.form_data ? this.props.form_data.mechanics.map(x=>({value:x,label:x})) : []}
          name='mechanic'
          isMulti
        />
        <div>
          <span className = 'filter_headers'>
            {'Categories'}
          </span>
        </div>
        <Select 
          options={this.state.category_list} 
          onChange={e => this.state.handleFiltering(e,'categories')}
          value={'categories' in this.props.form_data ? this.props.form_data.categories.map(x=>({value:x,label:x})) : []}
          name='category'
          isMulti
        />

        <FilterRange rangeHeader = 'Year Published' category = 'year_published' data={this.props.form_data} handleFiltering = {this.state.handleFiltering}/>
        <FilterRange rangeHeader = 'Average Rating (1 - 10)' category = 'average_rating' data={this.props.form_data} handleFiltering = {this.state.handleFiltering}/>
        <FilterRange rangeHeader = 'Number of Ratings' category = 'num_ratings' data={this.props.form_data} handleFiltering = {this.state.handleFiltering}/>
        <FilterRange rangeHeader = 'Average Complexity Rating (1 - 5)' category = 'average_weight' data={this.props.form_data} handleFiltering = {this.state.handleFiltering}/>
        <FilterRange rangeHeader = 'Average Play Time (mins)' category = 'playing_time' data = {this.props.form_data} handleFiltering = {this.state.handleFiltering}/>
        <FilterRange rangeHeader = 'Number of Owners' category = 'owned' data = {this.props.form_data} handleFiltering = {this.state.handleFiltering}/>
        
      </div>
    )
  }
}

export default App;
