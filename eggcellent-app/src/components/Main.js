import "./Main.css";
import { SearchBar } from "./SearchBar";

export const Main = () => {
  return (
    <div className="Main">
        <div className="IngrdBox">
            <SearchBar />
            <h1>Your ingredients~</h1>
            <div id="ingrdTable" className="IngrdTable"></div>
        </div>
        <div className="RecpeBox">Box2</div>
    </div>
  );
}