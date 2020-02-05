(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{46:function(e,a,t){e.exports=t(78)},51:function(e,a,t){},52:function(e,a,t){},78:function(e,a,t){"use strict";t.r(a);var n=t(0),r=t.n(n),i=t(14),s=t.n(i),c=(t(51),t(18)),l=t(26),o=t(22),u=t(4),m=t(5),d=t(6),h=t(7),p=t(8),g=t(43),v=t(17),f=t(42),_=(t(52),t(29)),y=t(21),E=t.n(y),b=t(20),k=t.n(b),C=t(27),w=function(e){function a(){return Object(u.a)(this,a),Object(d.a)(this,Object(h.a)(a).apply(this,arguments))}return Object(p.a)(a,e),Object(m.a)(a,[{key:"render",value:function(){return r.a.createElement(g.a,null,r.a.createElement(P,null))}}]),a}(r.a.Component),O=function(e){function a(e){var t;return Object(u.a)(this,a),(t=Object(d.a)(this,Object(h.a)(a).call(this,e))).state={current_data:[],source:"boardgames",db_url:"https://bgdbbackend.herokuapp.com/bgdb/search/",exclusive_search_pref:["designer","artist","publisher","boardgame"],show_details:!1,selected_data:Object(),searchQuery:"",searchType:"boardgame"},t}return Object(p.a)(a,e),Object(m.a)(a,[{key:"componentDidMount",value:function(){this.update_current_data()}},{key:"componentDidUpdate",value:function(e,a){e.location.search!==this.props.location.search&&this.update_current_data()}},{key:"setSelectedItem",value:function(e){this.setState({selected_data:e})}},{key:"setShowDetails",value:function(e){this.setState({show_details:e})}},{key:"render",value:function(){var e=this;return r.a.createElement("div",{className:"BoardgameSearch"},r.a.createElement(N,{updateSearch:function(){return e.setQueryParam(e.state.searchType+"__name",e.state.searchQuery)},searchType:this.state.searchType,searchQuery:this.state.searchQuery,setSearchType:function(a){return e.setState({searchType:a})},setSearchQuery:function(a){return e.setState({searchQuery:a})}}),r.a.createElement("div",{className:"lower-panel"},r.a.createElement("div",{className:"filter-panel"},r.a.createElement(H,{handleFiltering:this.handleFiltering.bind(this),db_url:this.state.db_url,form_data:this.parseParams()})),r.a.createElement("div",{className:"display-panel"},r.a.createElement(j,{onDirectionChange:this.handleFiltering.bind(this),onOrderChange:this.handleFiltering.bind(this),form_data:this.parseParams()}),r.a.createElement("div",{className:"viewer-container"},r.a.createElement("div",{className:"display-view"},this.state.pageCount&&r.a.createElement(T,{pageCount:this.state.pageCount||1,curPage:this.parseParams().page?this.parseParams().page[0]:1,updateCurPage:function(a){return e.setQueryParam("page",a)}}),r.a.createElement(S,{data:this.state.current_data,set_show_details:this.setShowDetails.bind(this),set_selected:this.setSelectedItem.bind(this)}),this.state.pageCount&&r.a.createElement(T,{pageCount:this.state.pageCount||1,curPage:this.parseParams().page?this.parseParams().page[0]:1,updateCurPage:function(a){return e.setQueryParam("page",a)}})),r.a.createElement(G,{data:this.state.selected_data,search_redirect:function(a,t){return e.setQueryParam(a+"__name",t)},show_details:this.state.show_details,show:this.setShowDetails.bind(this)})))))}},{key:"getSearch",value:function(){var e=this.parseParams(),a=["boardgame","designer","publisher","artist"].find(function(a){return a+"__name"in e});return void 0!==a?{searchType:a,searchQuery:e[a+"__name"]}:{searchType:"boardgame",searchQuery:""}}},{key:"parseParams",value:function(){var e=this.props.location.search;if(e){var a=k.a.parse(e,{comma:!0,ignoreQueryPrefix:!0}),t={};return Object.entries(a).forEach(function(e){var a=Object(o.a)(e,2),n=a[0],r=a[1];return t[n]=Array.isArray(r)?r:r?[r]:[]}),t}return Object()}},{key:"setParams",value:function(e){var a=this.parseParams();void 0===e.page&&(e.page=["1"]),void 0!==a.page&&e.page[0]===a.page[0]&&(e.page=["1"]),Object.entries(e).forEach(function(a){var t=Object(o.a)(a,2),n=t[0],r=t[1];""!==r&&void 0!==r||delete e[n]}),this.props.history.push({pathname:"",search:k.a.stringify(e,{arrayFormat:"comma"})})}},{key:"setQueryParam",value:function(e,a){var t=this,n=this.parseParams();this.state.exclusive_search_pref.some(function(a){return e.startsWith(a)})&&(n=Object.keys(n).filter(function(e){return!t.state.exclusive_search_pref.some(function(a){return e.startsWith(a)})}).reduce(function(e,a){return e[a]=n[a],e},{})),n[e]=a,this.setParams(n)}},{key:"handleFiltering",value:function(e,a){var t=this.parseParams();a?null!==e&&(!Array.isArray(e)||e.length>0)?t[a]=e.map(function(e){return e.value}):delete t[a]:e.target.value?t[e.target.name]=e.target.value:delete t[e.target.name],"ordering"in t&&!("order_direction"in t)&&(t.order_direction="desc"),this.setParams(t)}},{key:"update_current_data",value:function(){var e=this,a=this.props.location.search,t=k.a.parse(a,{comma:!0,ignoreQueryPrefix:!0}),n=Object(l.a)({},this.state.additional_params,{},t);E.a.get(this.state.db_url+this.state.source,{params:n,paramsSerializer:function(e){return k.a.stringify(e,{arrayFormat:"comma"})}}).then(function(e){return{current_data:e.data.results.map(function(e){return{id:e.id,content:e}}),pageCount:e.data.total_pages}}).then(function(a){return e.setState(Object(l.a)({},a,{},e.getSearch()))})}}]),a}(r.a.Component),P=Object(v.d)(O);function S(e){return r.a.createElement("div",{className:"GameViewer"}," ",e.data.map(function(a){return r.a.createElement(D,{data:a.content,structure:"Grid",key:a.id,select:e.set_selected,show:e.set_show_details})}))}function N(e){return r.a.createElement("div",{className:"search-panel"},r.a.createElement("select",{name:"searchType",onChange:function(a){return e.setSearchType(a.target.value)},value:e.searchType,className:"ToolbarSelector"},r.a.createElement("option",{value:"boardgame"},"Boardgame"),r.a.createElement("option",{value:"designer"},"Designer"),r.a.createElement("option",{value:"artist"},"Artist"),r.a.createElement("option",{value:"publisher"},"Publisher")),r.a.createElement("input",{type:"string",id:"searchQ",name:"searchQQQ",value:e.searchQuery,onChange:function(a){return e.setSearchQuery(a.target.value)},onKeyDown:function(a){"Enter"===a.key&&e.updateSearch()}}),r.a.createElement("button",{onClick:function(){return e.updateSearch()}},"Search"))}function j(e){return r.a.createElement("div",{className:"toolbar"},r.a.createElement("select",{name:"ordering",onChange:e.onOrderChange,value:"ordering"in e.form_data?e.form_data.ordering[0]:"bayes_average_ordering",className:"ToolbarSelector"},r.a.createElement("option",{value:"bayes_average_rating"},"Geek Rating"),r.a.createElement("option",{value:"average_rating"},"Average Rating"),r.a.createElement("option",{value:"average_weight"},"Average Complexity"),r.a.createElement("option",{value:"year_published"},"Year Published"),r.a.createElement("option",{value:"num_ratings"},"Number of Ratings"),r.a.createElement("option",{value:"wishing"},"Wishlist Count"),r.a.createElement("option",{value:"owned"},"Number Owned"),r.a.createElement("option",{value:" playing_time"},"Average Play Time")),r.a.createElement("select",{name:"order_direction",onChange:e.onDirectionChange,value:"order_direction"in e.form_data?e.form_data.order_direction[0]:"desc",className:"ToolbarSelector"},r.a.createElement("option",{value:"asc"},"Ascending"),r.a.createElement("option",{value:"desc"},"Descending")))}function F(e){return r.a.createElement("li",{onClick:function(){return e.onClick&&e.onClick(e.num)},key:e.num,style:{padding:"4px",textDecoration:e.selected===e.num?"underline":"none",backgroundColor:"#C7C6D1",margin:"5px",borderRadius:"4px",display:"inline-block"}},r.a.createElement("div",null,e.num))}var Q={justifyContents:"center",listStyleType:"none",position:"relative",width:"100%"};function T(e){var a=e.pageCount,t=e.curPage,n=e.updateCurPage;t=Math.min(t,a);var i=Math.max(t-2,1),s=Math.min(i+5,a);return r.a.createElement("ul",{style:Q},1<i&&r.a.createElement(F,{num:1,onClick:n,selected:t}),1<i&&r.a.createElement(F,{num:"..."}),Object(c.a)(Array(s-i+1).keys()).map(function(e){return r.a.createElement(F,{num:e+i,key:e+i,onClick:n,selected:t})}),s<a&&r.a.createElement(F,{num:"..."}),s<a&&r.a.createElement(F,{num:a,onClick:n,selected:t}))}function D(e){return r.a.createElement("div",{className:"GameEntry",onClick:function(){e.select(e.data),e.show(!0)}},r.a.createElement("img",{src:e.data.thumbnail,alt:e.data.name}),r.a.createElement("div",null,e.data.name))}function x(e){var a=Object(n.useState)(!1),t=Object(o.a)(a,2),i=t[0],s=t[1],c=e.children?e.children.length:0;return r.a.createElement("div",null,r.a.createElement("ul",null,e.children&&e.children.slice(0,Math.min(c,i?c:e.previewCount)).map(function(e,a){return r.a.createElement("li",{key:a}," ",e," ")})),c>e.previewCount&&r.a.createElement("div",{className:"ShowMoreButton",key:"show",onClick:function(){return s(!i)}},i?"less":"more"))}function A(e){return A.handleClickOutside=function(){e.show(!1)},r.a.createElement("div",{className:"GameEntryDetailPanel "+(e.show_details?"is-open":"")},r.a.createElement("div",{className:"ActionBar",onClick:function(){return e.show(!1)}}),r.a.createElement("div",{className:"GameEntryDetailPanelMain"},r.a.createElement("div",{className:"GameTitleBar"},r.a.createElement("b",null,e.data.name),"  ","(".concat(e.data.year_published,")")),r.a.createElement("img",{src:e.data.thumbnail,alt:e.data.name}),r.a.createElement("div",null,r.a.createElement("a",{href:"https://boardgamegeek.com/boardgame/"+e.data.id,target:"_blank",rel:"noopener noreferrer"}," ","Visit BoardGameGeek page"," ")),r.a.createElement("div",{className:"GameCreatorInfo"},r.a.createElement("h4",null,"Designers:"),r.a.createElement(x,{previewCount:2},e.data.designer_set&&e.data.designer_set.map(function(a,t){return r.a.createElement("span",{className:"SearchLink",key:t,onClick:function(){return e.search_redirect("designer",a.name)}},a.name)})),r.a.createElement("h4",null,"Artists:"),r.a.createElement(x,{previewCount:2},e.data.artist_set&&e.data.artist_set.map(function(a,t){return r.a.createElement("span",{className:"SearchLink",key:t,onClick:function(){return e.search_redirect("artist",a.name)}},a.name)})),r.a.createElement("h4",null,"Publishers:"),r.a.createElement(x,{previewCount:2},e.data.publisher_set&&e.data.publisher_set.map(function(a,t){return r.a.createElement("span",{className:"SearchLink",key:t,onClick:function(){return e.search_redirect("publisher",a.name)}},a.name)})),r.a.createElement("h4",null,"Description:"),r.a.createElement("p",{className:"GameDescription",dangerouslySetInnerHTML:e.data.description&&{__html:e.data.description.replace("&#226;&#128;&#147;","\u2013")}}))))}var M={handleClickOutside:function(){return A.handleClickOutside},stopPropagation:!0},G=Object(f.a)(A,M);function B(e){var a="min_"+e.category,t="max_"+e.category,n=e.category+"__gte",i=e.category+"__lte";return r.a.createElement("div",null,r.a.createElement("div",null,r.a.createElement("span",{className:"filter_headers"},e.rangeHeader)),r.a.createElement("div",{className:"range_input"},r.a.createElement("span",null,r.a.createElement("label",{htmlFor:a},"Min:"),r.a.createElement(C.DebounceInput,{type:"number",id:a,name:n,debounceTimeout:1e3,value:e.data[n],onChange:e.handleFiltering})),r.a.createElement("span",null,r.a.createElement("label",{htmlFor:t},"Max:"),r.a.createElement(C.DebounceInput,{type:"number",id:t,name:i,debounceTimeout:1e3,value:e.data[i],onChange:e.handleFiltering}))),r.a.createElement("br",null))}var H=function(e){function a(e){var t;return Object(u.a)(this,a),(t=Object(d.a)(this,Object(h.a)(a).call(this,e))).state={db_url:e.db_url,handleFiltering:e.handleFiltering},t}return Object(p.a)(a,e),Object(m.a)(a,[{key:"componentDidMount",value:function(){var e=this;E.a.get(this.state.db_url+"mechanics/").then(function(e){return e.data.map(function(e){return{value:e.name,label:e.name}})}).then(function(a){return e.setState({mechanic_list:a})}),E.a.get(this.state.db_url+"categories/").then(function(e){return e.data.map(function(e){return{value:e.name,label:e.name}})}).then(function(a){return e.setState({category_list:a})})}},{key:"render",value:function(){var e=this;return r.a.createElement("div",null,r.a.createElement("div",null,r.a.createElement("span",{className:"filter_headers"},"Mechanics")),r.a.createElement(_.a,{options:this.state.mechanic_list,onChange:function(a){return e.state.handleFiltering(a,"mechanics")},value:"mechanics"in this.props.form_data?this.props.form_data.mechanics.map(function(e){return{value:e,label:e}}):[],name:"mechanic",isMulti:!0}),r.a.createElement("div",null,r.a.createElement("span",{className:"filter_headers"},"Categories")),r.a.createElement(_.a,{options:this.state.category_list,onChange:function(a){return e.state.handleFiltering(a,"categories")},value:"categories"in this.props.form_data?this.props.form_data.categories.map(function(e){return{value:e,label:e}}):[],name:"category",isMulti:!0}),r.a.createElement(B,{rangeHeader:"Year Published",category:"year_published",data:this.props.form_data,handleFiltering:this.state.handleFiltering}),r.a.createElement(B,{rangeHeader:"Average Rating (1 - 10)",category:"average_rating",data:this.props.form_data,handleFiltering:this.state.handleFiltering}),r.a.createElement(B,{rangeHeader:"Number of Ratings",category:"num_ratings",data:this.props.form_data,handleFiltering:this.state.handleFiltering}),r.a.createElement(B,{rangeHeader:"Average Complexity Rating (1 - 5)",category:"average_weight",data:this.props.form_data,handleFiltering:this.state.handleFiltering}),r.a.createElement(B,{rangeHeader:"Average Play Time (mins)",category:"playing_time",data:this.props.form_data,handleFiltering:this.state.handleFiltering}),r.a.createElement(B,{rangeHeader:"Number of Owners",category:"owned",data:this.props.form_data,handleFiltering:this.state.handleFiltering}))}}]),a}(r.a.Component),I=w;Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(r.a.createElement(I,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[46,1,2]]]);
//# sourceMappingURL=main.8807a531.chunk.js.map