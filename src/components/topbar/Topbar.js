import { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";


const Topbar = () => {
   const { user, dispatch } = useContext(Context);
  const PF = "http://localhost:5000/images/"

  const getProfileImageUrl = () => {
    if (!user) return "/default-avatar.png";
    if (user.profilePic && user.profilePic.includes('cloudinary')) {
      return user.profilePic;
    }
    return "/default-avatar.png";
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };
  return (
    <div>
    <div>
      <div className="navbar bg-blue-400 text-white">
  <div className="navbar-start">
    
    
    

              <div class="dropdown">
      <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </div>
      <ul
        tabindex="0"
        class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
        <li><Link className="link text-black " to="/">Home</Link></li>
        <li><Link className="link text-black" to="/Write">Add Blog</Link></li>
        
      </ul>
    </div>
   
</div>
  <div className="navbar-center">
    <a className="btn btn-ghost text-xl">Blogify</a>
  </div>
  <div className="navbar-end">
     
     {/* serch bar */}
     <div class="form-control">
      <input type="text" placeholder="Search" className="input input-bordered w-24 h-8 text-black md:w-auto" />
    </div>
      
     {/* for profile */}

      {user ? (
      <div className="dropdown dropdown-end text-black">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src={getProfileImageUrl()} />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
        <li>
          <Link to="/settings">Setting
            <span className="badge">New</span>
          </Link>
        </li>
      
        <li className="px-4 cursor-pointer" onClick={handleLogout}>{user && "logout"}</li>
      </ul>
    </div>
      ):(
          <Link className="btn-sm" to="/login"><button>Login</button></Link>
      )}

  </div>
</div>


  </div>
</div>
    
  )
}

export default Topbar
