import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import "./FilterBox.css";
import "./SearchBar.css";
import { FaSearch } from "react-icons/fa";

export const CloseButton = ({value}) => {
  
    const onClickHandler = e => {
        //remove filter from backend, filters list 
        //receive the updated filters list as a response
        updateFilterBar({filters : []});
    }
  
    return (
        <button className="searchSuggestions-bttn" data-bttnval={value} onClick={onClickHandler}>X</button>
    );

  }

function updateFilterBar(json) { //json should appear in the format: { filters : ["cholesterol", "sugar"] }
    const filters = json.filters;   //an array
    let list = []
    for (let i = 0; i < filters.length; i++){
        list.push({id: i, value: filters[i]});
    }
    const root = ReactDOM.createRoot(
        document.getElementById("filterBar")
    );
    const element = <ul className="filter-table">
        {list.map(item => (
            <li key={item.id} className="filter-items">
                <div>{item.value}</div>
                <CloseButton value={item.value} />
            </li>
        ))}
        </ul>;
    root.render(element);
}

export const Button = ({value}) => {

    const [text, setText] = useState(value)
  
    const onClickHandler = e => {
      let val = e.currentTarget.getAttribute('data-bttnval')
      //get updated list from backend afeter appending new term
      updateFilterBar({filters: [val, "egg"]});
      setText("Added");
    }
  
    return (
      <button className="searchSuggestions-bttn" data-bttnval={value} onClick={onClickHandler}>{text}</button>
    );

  }


function updateSuggestionsTable(json) { //json should appear in the format: { searchSuggestions : ["egg", "eggo-waffles"], valid : "yes" }
    const searchSuggestions = json.searchSuggestions;   //an array
    const valid = json.valid;
    if (searchSuggestions.length == 0 && valid == "no") {
        const root = ReactDOM.createRoot(
            document.getElementById("filterSuggestions")
        );
        const element = <p>No results</p>
        root.render(element);
        return;
        }
    
    if (searchSuggestions.length == 0 && valid == "yes") {
        const root = ReactDOM.createRoot(
            document.getElementById("filterSuggestions")
        );
        const element = <p></p>
        root.render(element);
        return;
        }

    let list = []
    for (let i = 0; i < searchSuggestions.length; i++){
        list.push({id: i, value: searchSuggestions[i]});
    }
    const root = ReactDOM.createRoot(
        document.getElementById("filterSuggestions")
    );
    const element = <ul className="suggestions-table">
        {list.map(item => (
            <li key={item.id} className="suggestion-items">
                <Button value={item.value} />
            </li>
        ))}
        </ul>;
    root.render(element);
}



function onChangeHandler(input) {
    let suggestions = [input]
    let terms = suggestions
    if (input.length<1) { //if the user did not type a string that is not long enough to search in the text box
        updateSuggestionsTable({searchSuggestions: [], valid: "yes"});
        }
    else if (terms.length==0) { //if the user's search does not exist
        updateSuggestionsTable({searchSuggestions: [], valid: "no"});
        }
    else { //if there are suggestions based on the user's typing
        updateSuggestionsTable({searchSuggestions: terms, valid: "yes"});
       }
}

export const FilterBox = () => {
    const [input, setInput] = useState("")
    return (
      <div className="FilterBox">
        <div id="filterBar"></div>
        <div className="filter-SearchBar">
            <input className="input-box" placeholder="Enter an ingredient..." value={input} onChange={(e)=>{setInput(e.target.value); onChangeHandler(e.target.value)}}/>
            <FaSearch className="search-icon" />
            </div>
        <div id="filterSuggestions" className="SearchSuggestions"></div>
      </div>
    );
  }