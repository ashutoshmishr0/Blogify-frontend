import "./single.css";
import Sidebar from "../../components/sidebar/Sidebar";
import SinglePost from "../../components/singlePost/SinglePost";

export default function Single() {
  return (
    <div className="single">
      <div className="singlePost">
      <SinglePost/>
      </div>
      <div className="sidebar">
      <Sidebar />
      </div>
    </div>
  );
}