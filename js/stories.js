"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  let startType = "fa-star far"
  let ownStory = ""
  if(currentUser != undefined){
    for(let storyFav of currentUser.favorites){
      if(storyFav.storyId == story.storyId){
        startType = "fa-star fas"
        break
      }
    }

    for(let userOwnStory of currentUser.ownStories){
      if(userOwnStory.storyId == story.storyId){
        ownStory = '<span class="fa-trash fas"></span>'
        break
      }
    }
  }

  return $(`
      <li id="${story.storyId}">
        ${ownStory}
        <span class="${startType} ${currentUser == undefined ? "hidden" : ""}"></span> 
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();

}

/** Gets user favorite list of stories from server, generates their HTML, and puts on page. */

function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");

  $allUserFavStoriesList.empty();

  for (let story of storyList.stories) {
    for (let favStory of currentUser.favorites){
      if(favStory.storyId == story.storyId){
        const $story = generateStoryMarkup(story);
        $allUserFavStoriesList.append($story);
      }
    }
  }

  if($allUserFavStoriesList.text() == ""){
    $allUserFavStoriesList.text("No favorite story")
  }

  $allUserFavStoriesList.show();

}

/** Gets user list of stories from server, generates their HTML, and puts on page. */

function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");

  $allUserStoriesList.empty();

  for (let story of storyList.stories) {
    for (let ownStory of currentUser.ownStories){
      if(ownStory.storyId == story.storyId){
        const $story = generateStoryMarkup(story);
        $allUserStoriesList.append($story);
      }
    }
  }

  if($allUserStoriesList.text() == ""){
    $allUserStoriesList.text("No own story")
  }

  $allUserStoriesList.show();

}

/** Event listener for submitting a new story */

$submitForm.on("submit", async function submitNewStory(event){
  console.debug("submitNewStory")
  event.preventDefault()
  const $authorInput = $("#author-input")
  const $titleInput = $("#title-input")
  const $urlInput = $("#url-input")

  // create new story instance
  const newStory = await storyList.addStory(currentUser, {author: $authorInput.val(), title: $titleInput.val(), url: $urlInput.val()})
  // add new story to user's own stories
  currentUser.ownStories.push(newStory)
  // add new story to storyList
  storyList.stories.splice(0, 0, newStory)
  // create new story HTML and prepend it to all-story-list
  const newStoryHTML = generateStoryMarkup(newStory)
  $allStoriesList.prepend(newStoryHTML)
  $authorInput.val("")
  $titleInput.val("")
  $urlInput.val("")
  $submitForm.hide()
})

/** Event listener for deleting user's own stories */

$body.on('click', '.fa-trash', async function (event){
  const $story = $(event.target).parent()
  const storyId = $(event.target).parent().attr('id')
  removeStory(storyId)
  $story.remove()
  console.log("Removed Story")
})

/** Event listener for add/remove to/from favorite */


$body.on('click', '.fa-star', async function (event){
  const $star = $(event.target)
  const storyId = $star.parent().attr('id')
  $star.toggleClass('far')
  $star.toggleClass('fas')
  if($star.hasClass("fas")){
    // Add
    await addFavorite(storyId)
    console.log("Added favorite")
  }
  else{
    // Remove
    await removeFavorite(storyId)
    console.log("Removed favorite")
  }
})
