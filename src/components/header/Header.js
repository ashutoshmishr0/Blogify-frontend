import Sidebar from "../sidebar/Sidebar";
import Topbar from "../topbar/Topbar";
import "./header.css";

export default function Header() {
  return (
    
    <div className="header">
        
      <div className="headerTitles">
        <span className="headerTitleSm">Welcome to </span>
        <span className="headerTitleLg">Blog</span>
      </div>
      <img
        className="headerImg"
        src="https://cdn.pixabay.com/photo/2019/12/03/21/29/mountains-4671122_1280.jpg"
        alt=""
      />
    </div>
  );
}