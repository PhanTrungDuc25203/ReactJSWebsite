import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import appReducer from "./appReducer";
import adminReducer from "./adminReducer"; // Redux-getGender-(9):import xong rồi thì tạo key và export ra ở cuối
import userReducer from "./userReducer";
import searchReducer from "./searchReducer";

import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

//trong một dự án có rất nhiều reducers, nên ta cần mọto file chung để tổng hợp nó lại
//chính là file rootReducer, ở hàm export cuối cóchuwx combine

const persistCommonConfig = {
  storage: storage,
  stateReconciler: autoMergeLevel2,
};

const userPersistConfig = {
  ...persistCommonConfig,
  key: "user",
  whitelist: ["isLoggedIn", "userInfo"],
};

//để khi chuyển đổi ngôn ngữ thì toàn bộ dự án cũng dược đổi
const appPersistConfig = {
  ...persistCommonConfig,
  key: "app",
  whitelist: ["language"],
};

export default (history) =>
  combineReducers({
    //key: reducer
    //để truy cập vào userReducer thì dùng key là user, truy cập vào appReducer thì dùng key là app
    //ví dụ ở những hàm máptateToProps trong mỗi component ta có sử dụng:
    //language: state.app.language,
    // thì từ app đây chính là để sử dụng reducer appReducer
    //còn language trong state.app.language thì là mộtt thuộc tính của initialState được khai báo trong reducer tương ứng, ở đây là appReducer
    router: connectRouter(history),
    user: persistReducer(userPersistConfig, userReducer),
    app: persistReducer(appPersistConfig, appReducer),
    // Redux-getGender-(10):tạo key
    admin: adminReducer,
    search: searchReducer,
    // Redux-getGender-(11): đến đây thì cấu hình thành công
    // Redux-getGender-(12): trở lại adminReducer để viết code
  });
