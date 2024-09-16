import locationHelperBuilder from "redux-auth-wrapper/history4/locationHelper";
import { connectedRouterRedirect } from "redux-auth-wrapper/history4/redirect";

const locationHelper = locationHelperBuilder({});

export const userIsAuthenticated = connectedRouterRedirect({
    authenticatedSelector: state => state.user.isLoggedIn && state.user.userInfo.roleId !== 'R3',
    wrapperDisplayName: 'UserIsAuthenticated',
    redirectPath: '/login'
});

export const userIsNotPatient = connectedRouterRedirect({
    authenticatedSelector: state => state.user.isLoggedIn && state.user.userInfo.roleId !== 'R3',
    wrapperDisplayName: 'UserIsNotPatient',
    redirectPath: '/login'
});

export const userIsNotPatientAndDoctor = connectedRouterRedirect({
    authenticatedSelector: state => state.user.isLoggedIn && state.user.userInfo.roleId !== 'R3' && state.user.userInfo.roleId !== 'R2',
    wrapperDisplayName: 'UserIsNotPatientAndDoctor',
    redirectPath: '/login'
});

export const userIsNotAuthenticated = connectedRouterRedirect({
    // Want to redirect the user when they are authenticated
    authenticatedSelector: state => !state.user.isLoggedIn,
    wrapperDisplayName: 'UserIsNotAuthenticated',
    redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/',
    allowRedirectBack: false
});