import locationHelperBuilder from "redux-auth-wrapper/history4/locationHelper";
import { connectedRouterRedirect } from "redux-auth-wrapper/history4/redirect";

const locationHelper = locationHelperBuilder({});

const isLoggedIn = (state) => state.user.isLoggedIn;
const role = (state) => state.user.userInfo?.roleId;
const position = (state) => state.user.userInfo?.positionId;

export const userIsAuthenticated = connectedRouterRedirect({
    authenticatedSelector: (state) => state.user.isLoggedIn && state.user.userInfo.roleId !== "R3",
    wrapperDisplayName: "UserIsAuthenticated",
    redirectPath: "/login",
});

export const patientIsAuthenticated = connectedRouterRedirect({
    authenticatedSelector: (state) => state.user.isLoggedIn === true && state.user.userInfo.roleId === "R3",
    wrapperDisplayName: "PatientIsAuthenticated",
    redirectPath: "/login",
    allowRedirectBack: true,
});

export const userIsNotPatient = connectedRouterRedirect({
    authenticatedSelector: (state) => state.user.isLoggedIn && state.user.userInfo.roleId !== "R3",
    wrapperDisplayName: "UserIsNotPatient",
    redirectPath: "/login",
});

export const userIsNotPatientAndDoctor = connectedRouterRedirect({
    authenticatedSelector: (state) => state.user.isLoggedIn && state.user.userInfo.roleId !== "R3" && state.user.userInfo.roleId !== "R2",
    wrapperDisplayName: "UserIsNotPatientAndDoctor",
    redirectPath: "/login",
});

export const userIsNotAuthenticated = connectedRouterRedirect({
    // Want to redirect the user when they are authenticated
    authenticatedSelector: (state) => !state.user.isLoggedIn,
    wrapperDisplayName: "UserIsNotAuthenticated",
    redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || "/",
    allowRedirectBack: false,
});

export const loginRequired = connectedRouterRedirect({
    authenticatedSelector: (state) => isLoggedIn(state),
    wrapperDisplayName: "LoginRequired",
    redirectPath: "/login",
    allowRedirectBack: true,
});

export const adminOnly = connectedRouterRedirect({
    authenticatedSelector: (state) => isLoggedIn(state) && role(state) === "R1",
    wrapperDisplayName: "AdminOnly",
    redirectPath: "/home",
});

export const staffAndAdminOnly = connectedRouterRedirect({
    authenticatedSelector: (state) => isLoggedIn(state) && (role(state) === "R1" || (role(state) === "R2" && position(state) === "P5")),
    wrapperDisplayName: "StaffAndAdminOnly",
    redirectPath: "/home",
});

export const doctorAndAdminOnly = connectedRouterRedirect({
    authenticatedSelector: (state) => isLoggedIn(state) && (role(state) === "R1" || (role(state) === "R2" && position(state) !== "P5")),
    wrapperDisplayName: "DoctorAndAdminOnly",
    redirectPath: "/home",
});
