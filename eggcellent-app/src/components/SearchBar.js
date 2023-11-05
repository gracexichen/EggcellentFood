import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import "./SearchBar.css";
import { FaSearch } from "react-icons/fa";

// if (e.key === 'Enter') {
//     console.log("Entered: "+e.target.value)
//     (async () => {
//         console.log("Starting query...")
//         const response = await fetch("http://localhost:3002/findSearchTerms", {
//             method: "POST",
//             headers: {
//                 'Content-type': "application/json"
//             },
//             body: JSON.stringify({ searchTerm: e.target.value })
//             })
//         .then((response) => response.json())    //backend will send a response containing a list of searchable terms from the database that are close to the input
//         .then((json) => updateSuggestions(json));
//     })()


function updateIngrdTable(json) { //json should appear in the format: { ingrdList : ["milk", "egg"] }
    const ingrdList = json.ingrdList;   //an array
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
      let val = e.currentTarget.getAttribute('data-bttnval')
      //get updated list from backend afeter appending new term
      updateIngrdTable({ingrdList: [val, "egg"]});
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
            document.getElementById("searchSuggestions")
        );
        const element = <p>No results</p>
        root.render(element);
        return;
        }
    
    if (searchSuggestions.length == 0 && valid == "yes") {
        const root = ReactDOM.createRoot(
            document.getElementById("searchSuggestions")
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
    // (async () => {
    //     const response = await fetch("http://localhost:3002/findSearchTerms", {
    //         method: "POST",
    //         headers: {
    //             'Content-type': "application/json"
    //         },
    //         body: JSON.stringify({ searchTerm: e.target.value })
    //         })
    //     .then((response) => response.json())    //backend will send a response containing a list of searchable terms from the database that are close to the input
    //     .then((json) => updateSuggestionsTable(json));
    // })()
    let suggestions = [input]
    let terms = suggestions
    if (input.length<=1) { //if the user did not type a string that is not long enough to search in the text box
        updateSuggestionsTable({searchSuggestions: [], valid: "yes"});
        }
    else if (terms.length==0) { //if the user's search does not exist
        updateSuggestionsTable({searchSuggestions: [], valid: "no"});
        }
    else { //if there are suggestions based on the user's typing
        updateSuggestionsTable({searchSuggestions: terms, valid: "yes"});
       }
}




export const SearchBar = () => {
    const [input, setInput] = useState("")
    return (
      <div className="Search">
        <div className="SearchBar">
            <input className="input-box" placeholder="Enter an ingredient..." value={input} onChange={(e)=>{setInput(e.target.value); onChangeHandler(input)}}/>
            <FaSearch className="search-icon" />
            </div>
        <div id="searchSuggestions" className="SearchSuggestions"></div>
      </div>
    );
  }