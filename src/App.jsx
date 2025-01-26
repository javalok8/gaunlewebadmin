import Home from "./admin/pages/home/Home";
import Login from "./admin/pages/login/Login";
import List from "./admin/pages/list/List";
import UserList from "./admin/pages/userlist/UserList";
import Single from "./admin/pages/single/Single";
import New from "./admin/pages/new/New";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { productInputs, userInputs, newUserInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import NewUser from "./admin/pages/usernew/NewUser";
import NewsList from "./admin/pages/newslist/NewsList";
import NewsNew from "./admin/pages/newsnew/NewsNew";
import GharList from "./admin/pages/gharlist/GharList";
import NewGhar from "./admin/pages/gharnew/NewGhar";
import ServiceNew from "./admin/pages/service/ServiceNew";
import store from "./reduxtool/store";
import { Provider } from "react-redux";

function App() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />

              {/* User Routes */}
              <Route path="users">
                <Route index element={<UserList />} />
                <Route path=":userId" element={<Single />} />
                <Route
                  path="newUser"
                  element={
                    <NewUser inputs={newUserInputs} title="Add New User" />
                  }
                />
              </Route>
              {/* News Routes */}
              <Route path="news">
                <Route index element={<NewsList />} />
                <Route
                  path="newsNew"
                  element={<NewsNew inputs={newUserInputs} title="Add News" />}
                />
              </Route>

              {/* HomeStay Routes */}
              <Route path="ghar">
                <Route index element={<GharList />} />
                <Route path="gharDetail" element={<ServiceNew />} />
                <Route
                  path="newGhar"
                  element={
                    <NewGhar inputs={newUserInputs} title="Add Home Stay" />
                  }
                />
              </Route>

              <Route path="products">
                <Route index element={<List />} />
                <Route path=":productId" element={<Single />} />
                <Route
                  path="new"
                  element={
                    <New inputs={productInputs} title="Add New Product" />
                  }
                />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
