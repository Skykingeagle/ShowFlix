import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import SearchPage from "./views/SearchPage/SearchPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer";
import MovieDetail from "./views/MovieDetail/MovieDetail";
import ProfilePage from "./views/ProfilePage/ProfilePage";
import ActorPage from "./views/ActorPage";
import AnalysisState from "../context/AnalysisState";
import Chat from "../components/Chat";

//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside

function App() {
  return (
    <AnalysisState>
      <Suspense fallback={<div>Loading...</div>}>
        <NavBar />
        <div style={{ paddingTop: "69px", minHeight: "calc(100vh - 80px)" }}>
          <Switch>
            <Route exact path="/" component={Auth(LandingPage, null)} />
            <Route exact path="/search" component={Auth(SearchPage, null)} />
            <Route exact path="/login" component={Auth(LoginPage, false)} />
            <Route
              exact
              path="/register"
              component={Auth(RegisterPage, false)}
            />
            <Route
              exact
              path="/movie/:movieId"
              component={Auth(MovieDetail, null)}
            />
            <Route exact path="/profile" component={Auth(ProfilePage, true)} />
            <Route
              exact
              path="/actor/:actorId"
              component={Auth(ActorPage, true)}
            />
          </Switch>
        </div>
        <Chat/>
        <Footer />
      </Suspense>
    </AnalysisState>
  );
}

export default App;
