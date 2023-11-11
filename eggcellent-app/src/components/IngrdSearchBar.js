import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import "./SearchBar.css";
import { FaSearch } from "react-icons/fa";



function updateIngrdTable(object) { //object should appear in the format: { ingrdList : ["milk", "egg"] }
    const ingrdList = object.ingrdList;   //an array

    let list = []
    for (let i = 0; i < ingrdList.length; i++){
        list.push({id: i, value: ingrdList[i]});
    }
    const root = ReactDOM.createRoot(
        document.getElementById("ingrdTable")
    );
    const element = <ul className="ingrd-table">
        {list.map(item => (
            <li key={item.id} className="ingrd-items">{item.value}</li>
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
        const response = await fetch("http://localhost:8000/ingrd-add", {
          method: "POST",
          headers: {
            'Content-type': "application/json"
          },
          body: JSON.stringify({ ingredient: val })
          })
        .then((response) => response.json())
        .then((json) => updateIngrdTable(JSON.parse(json)));
      })();
      setText("Added");
    }
  
    return (
      <button className="searchSuggestions-bttn" data-bttnval={value} onClick={onClickHandler}>{text}</button>
    );

  }




function updateIngrdSuggestionsTable(object) { //object should appear in the format: { searchSuggestions : ["egg", "eggo-waffles"], valid : "yes" }
    const searchSuggestions = object.searchSuggestions;   //an array
    const valid = object.valid;
    
    if (searchSuggestions.length == 0 && valid == "no") { //search term is not long enough
        const root = ReactDOM.createRoot(
            document.getElementById("searchSuggestions")
        );
        const element = <p></p>
        root.render(element);
        return;
        }
    
    if (searchSuggestions.length == 0 && valid == "yes") { //search term does not exist in databse
        const root = ReactDOM.createRoot(
            document.getElementById("searchSuggestions")
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
        document.getElementById("searchSuggestions")
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
    if (input.length<2) { //if the user did not type a string that is long enough to search into the text box
        updateIngrdSuggestionsTable({searchSuggestions: [], valid: "no"});
        }
    else {
        (async () => {
            console.log("searching: "+input);
            const response = await fetch("http://localhost:8000/ingrd-search", {
              method: "POST",
              headers: {
                'Content-type': "application/json"
              },
              body: JSON.stringify({ searchTerm: input })
              })
            .then((response) => response.json())
            .then((json) => updateIngrdSuggestionsTable({ searchSuggestions: JSON.parse(json).searchSuggestions, valid: "yes" }));
          })();
    }

}




export const IngrdSearchBar = () => {
    const [input, setInput] = useState("")
    return (
      <div className="Search">
        <div className="SearchBar">
            <input className="input-box" placeholder="Enter an ingredient..." value={input} onChange={(e)=>{setInput(e.target.value); onChangeHandler(e.target.value)}}/>
            <FaSearch className="search-icon" />
            </div>
        <div id="searchSuggestions" className="SearchSuggestions"></div>
      </div>
    );
  }