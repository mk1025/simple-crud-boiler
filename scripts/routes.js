/*
    ROUTES / NAVIGATIONS


    - This is where you define the location or URLs of your pages and APIs.
    - The purpose of this JavaScript code here is to be imported to other JavaScript files.
*/

// APIs (Your PHP files)
export const LOGIN_API = "../../api/login.php";
export const REGISTRATION_API = "../../api/register.php";
export const DASHBOARD_API = "../../api/dashboard.php";

// PAGES (Directory of your pages)
/*
    - Notice the "../" part of the URLs? Each time it is called, it goes back one directory level.
    - If there is an "index" file located inside every directory, it will be called instead.
*/
export const HOME_PAGE = "../../";
export const LOGIN_PAGE = "../login/";
export const REGISTRATION_PAGE = "../register/";
export const DASHBOARD_PAGE = "../dashboard/";
