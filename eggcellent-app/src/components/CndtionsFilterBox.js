import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import "./FilterBox.css";
import "./SearchBar.css";
import { FaSearch } from "react-icons/fa";

export const CloseButton = ({value}) => {
  
    const onClickHandler = e => {
        let val = e.currentTarget.getAttribute('data-bttnval');
        //remove filter from backend, filters list 
        //receive the updated filters list as a response
        (async () => {
            console.log("clearing ingredient list");
            const response = await fetch("http://localhost:8000/cndtion-remove", {
              method: "POST",
              headers: {
                'Content-type': "application/json"
              },
              body: JSON.stringify({ filter: val })
              })
            .then((response) => response.json())
            .then((json) => updateFilterBar(JSON.parse(json)));
        })();

    }
  
    return (
        <button className="searchSuggestions-bttn" data-bttnval={value} onClick={onClickHandler}>X</button>
    );

  }

  
function updateFilterBar(object) { //json should appear in the format: { filters : ["cholesterol", "sugar"] }
    const filters = object.filters;   //an array
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
        let val = e.currentTarget.getAttribute('data-bttnval');
      //get updated list from backend afeter appending new term
      (async () => {
        console.log("begin");
        const response = await fetch("http://localhost:8000/cndtion-add", {
          method: "POST",
          headers: {
            'Content-type': "application/json"
          },
          body: JSON.stringify({ filter: val })
          })
        .then((response) => response.json())
        .then((json) => updateFilterBar(JSON.parse(json)));
      })();
      setText("Added");
    }
  
    return (
      <button className="searchSuggestions-bttn" data-bttnval={value} onClick={onClickHandler}>{text}</button>
    );

  }


function updateCndtionSuggestionsTable(object) { //json should appear in the format: { searchSuggestions : ["egg", "eggo-waffles"], valid : "yes" }
    const searchSuggestions = object.searchSuggestions;   //an array
    const valid = object.valid;

    if (searchSuggestions.length == 0 && valid == "no") { //search term is not long enough
        const root = ReactDOM.createRoot(
            document.getElementById("filterSuggestions")
        );
        const element = <p></p>
        root.render(element);
        return;
        }

    if (searchSuggestions.length == 0 && valid == "yes") { //search term does not exist in databse
        const root = ReactDOM.createRoot(
            document.getElementById("filterSuggestions")
        );
        const element = <p>No results</p>
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
    if (input.length<2) { //if the user did not type a string that is long enough to search into the text box
        updateCndtionSuggestionsTable({ searchSuggestions: [], valid: "no" });
        }
    else {
        (async () => {
            console.log("searching: "+input);
            const response = await fetch("http://localhost:8000/cndtion-search", {
              method: "POST",
              headers: {
                'Content-type': "application/json"
              },
              body: JSON.stringify({ searchTerm: input })
              })
            .then((response) => response.json())
            .then((json) => updateCndtionSuggestionsTable({ searchSuggestions: JSON.parse(json).searchSuggestions, valid: "yes" }));
          })();
    }

}

export const CndtionsFilterBox = () => {
    const [input, setInput] = useState("")
    return (
      <div className="FilterBox">
        <div id="filterBar"></div>
        <div className="filter-SearchBar">
            <input className="input-box" placeholder="Enter a health filter..." value={input} onChange={(e)=>{setInput(e.target.value); onChangeHandler(e.target.value)}}/>
            <FaSearch className="search-icon" />
            </div>
        <div id="filterSuggestions" className="SearchSuggestions"></div>
      </div>
    );
  }