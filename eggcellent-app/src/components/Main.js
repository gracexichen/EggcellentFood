import "./Main.css";
import ReactDOM from 'react-dom';
import { IngrdSearchBar } from "./IngrdSearchBar";
import { CndtionsFilterBox } from "./CndtionsFilterBox";

function clearIngrdTable() { //json should appear in the format: { ingrdList : ["milk", "egg"] }
    (async () => {
        console.log("clearing ingredient list");
        const response = await fetch("http://localhost:8000/ingrd-clear", {
          method: "POST",
          headers: {
            'Content-type': "application/json"
          },
          body: JSON.stringify({ })
          });
      })();
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
            <IngrdSearchBar />
            <h1 className="main-text">Your ingredients~</h1>
            <div id="ingrdTable" className="IngrdTable">Picture will be here</div>
            <button className="clear-bttn" onClick={clearIngrdTable}>Clear</button>
        </div>
        <div className="RecpeBox">
            <CndtionsFilterBox />
        </div>
    </div>
  );
}