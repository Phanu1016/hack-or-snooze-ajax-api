"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** Shows submit form on click */
function navSubmitStoryClick(evt) {
  console.debug("navSubmitStoryClick", evt);
  hidePageComponents()
  $submitForm.show()
  $allStoriesList.show()
  
}

$navSubmit.on("click", navSubmitStoryClick);

/** Shows favorites on click */
function navFavoritesClick(evt) {
  console.debug("navFavoritesClick", evt);
  hidePageComponents()
  putFavoritesOnPage()
}

$navFavorites.on("click", navFavoritesClick);

/** Shows user stories on click */
function navStoriesClick(evt) {
  console.debug("navStoriesClick", evt);
  hidePageComponents()
  putUserStoriesOnPage()
  $allUserStoriesList.show()
}

$navStories.on("click", navStoriesClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();

  $navLeft.show()
  $navUserProfile.text(`${currentUser.username}`).show();
}
