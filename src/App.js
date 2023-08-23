import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { useEffect, useState } from "react";
import Privacy from "./components/PrivacyPolicy/Privacy";
import Bookmarks from "./pages/Bookmarks";
import Home from "./pages/Home";
import jwt from "jsonwebtoken";
import Settings from "./pages/Settings";
import { setJwtInRequestHeader } from "./api-services/httpService";
import Explore from "./pages/Explore";
import SavedCollection from "./pages/SavedCollection";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "./store/actions/user.action";
import PageLoader from "./components/Loader/PageLoader";
import { setLoggedInUser } from "./store/Slices/user.slice";

function App() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  //for responsiveness
  let width;
  if (typeof window !== "undefined") {
    width = window.innerWidth;
  }
  const [windowWidth, setWindowWidth] = useState(width);

  useEffect(() => {
    function watchWidth() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", watchWidth);
  }, [windowWidth]);

  // To set JWT token in request header for authorization on each API call
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !auth.isLoggedIn) {
      setJwtInRequestHeader(token);
      dispatch(setLoggedInUser({token}));
      dispatch(getUserDetails({ token }));
    }
  }, []);

  if (auth.isLoggedIn && auth.isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing page  */}
          <Route path="/" element={<LandingPage windowWidth={windowWidth} />} />

          <Route
            path="/signup"
            element={
              auth.isLoggedIn ? (
                <Navigate to={`/${auth?.username}`} />
              ) : (
                <Signup windowWidth={windowWidth} />
              )
            }
          />
          <Route
            path="/login"
            element={
              auth.isLoggedIn ? (
                <Navigate to={`/${auth?.username}`} />
              ) : (
                <Login windowWidth={windowWidth} />
              )
            }
          />
          <Route
            path="/:username"
            element={<Home windowWidth={windowWidth} />}
          />
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<SavedCollection />} />

          <Route path="/privacy" element={<Privacy />} />
          {/* <Route path="/settings" element={<Settings />} /> */}
          <Route
            path="/:username/c/:collectionId"
            element={<Bookmarks windowWidth={windowWidth} />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
