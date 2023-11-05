import "./Main.css";
import ReactDOM from 'react-dom';
import { SearchBar } from "./SearchBar";
import { FilterBox } from "./FilterBox";

function clearIngrdTable() { //json should appear in the format: { ingrdList : ["milk", "egg"] }
    const root = ReactDOM.createRoot(
        document.getElementById("ingrdTable")
        );
    const element = <p>Picture will be here</p>
    root.render(element);
}

export const Main = () => {
  return (
    <div className="Main">
        <div className="IngrdBox">
            <SearchBar />
            <h1 className="main-text">Your ingredients~</h1>
            <div id="ingrdTable" className="IngrdTable">Picture will be here</div>
            <button className="clear-bttn" onClick={clearIngrdTable}>Clear</button>
        </div>
        <div className="RecpeBox">
            <FilterBox />
        </div>
    </div>
  );
}