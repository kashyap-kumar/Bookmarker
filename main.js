document.getElementsByClassName("loader")[0].style.display = "none";

let del;              // for getting the classes with the name delete, can't initialised here because the elements with the class name delete are created in local scope(function)
let isUpdate = false; // for checking whether the values in the form should be updated or added in the bookmarks
let editItemIndex;    // index of the item to be edited when clicked on edit button of a bookmark

const siteName_elm  = document.getElementById("siteName");
const siteUrl_elm   = document.getElementById("siteUrl");

/**
 * ************* ADD NEW BOOKMARK ************* 
 */
function addItem() {
  // get the values of form inputs
  let siteName  = siteName_elm.value;
  let siteUrl   = siteUrl_elm.value;

  // create an item object
  const bookmark = {
    siteName: siteName,
    siteUrl: siteUrl
  };

  // check for url whether it is valid or not
  if(!isUrlValid(siteUrl)){
    alert("Enter a valid url");
    return;
  }

  // if localstorage key doesn't exists create one
  if(localStorage.getItem("bookmark") == null)
    localStorage.setItem("bookmark", "[]");

  // get the localstorage data as an array of objects, add new item and then update localstorage
  const bookmarks = JSON.parse(localStorage.getItem("bookmark"));
  bookmarks.push(bookmark);
  localStorage.setItem("bookmark", JSON.stringify(bookmarks));

  // after adding a new item we need to load them in the UI
  loadItems();

  // clear the input fields
  siteName_elm.value  = "";
  siteUrl_elm.value   = "";
}

/**
 * ************* EDIT/UPDATE BOOKMARK ************* 
 */
function editItem(e){
  // for indicating that we are updating an existing item
  isUpdate = true;
  document.getElementById("submitBtn").value = "UPDATE";

  // get the index of clicked item
  editItemIndex = nodeIndex(e);

  // get the bookmarks from localstorage
  const bookmarks = JSON.parse(localStorage.getItem("bookmark"));

  // get the values of the item in the form inputs
  siteName_elm.value  = bookmarks[editItemIndex].siteName;
  siteUrl_elm.value   = bookmarks[editItemIndex].siteUrl;

  // returns the index of the element relative to its siblings
  function nodeIndex(el) {
    let i = 0;
    while (el.previousElementSibling) {
      el = el.previousElementSibling;
      i++;
    }
    return i;
  }
}

// update button is clicked to update an existing item after editing
function updateItem(){  
  // get the values of form in a new item object
  let siteName  = siteName_elm.value;
  let siteUrl   = siteUrl_elm.value;
  const bookmark = {
    siteName: siteName,
    siteUrl: siteUrl
  };

  // check for url whether it is valid or not
  if(!isUrlValid(siteUrl)){
    alert("Enter a valid url");
    return;
  }
  
  // get the bookmarks from localstorage as an array
  const bookmarks = JSON.parse(localStorage.getItem("bookmark"));

  // replace the new object with its respective object in bookmarks array
  bookmarks[editItemIndex] = bookmark;

  // update in localstorage
  localStorage.setItem("bookmark", JSON.stringify(bookmarks));

  // updating finished
  isUpdate = false;
  document.getElementById("submitBtn").value = "ADD";
}

/**
 * ************* LOAD BOOKMARKS ************* 
 */
function loadItems() {
  document.getElementById("bookmarks").innerHTML = "";

  if (localStorage.getItem("bookmark") != null) {
    const bookmarks = JSON.parse(localStorage.getItem("bookmark"));
    bookmarks.forEach((e) => {
      document.getElementById("bookmarks").innerHTML += `
                <div class="bookmark">
                    <p><a href="${e.siteUrl}" target="blank">${e.siteName}</a></p>
                    <span class="edit fa fa-pen" onclick="editItem(this.parentElement)"></span>
                    <span class="delete fa fa-trash-alt"></span>
                </div>
            `;
    });
  }

  // for deleting bookmarks
  del = document.getElementsByClassName("delete");
  for(let i=0; i<del.length; i++){
    del[i].addEventListener("click", delFunc);
  }
}

/**
 * ************* URL VALIDATION ************* 
 */
function isUrlValid(userInput) {
    var res = userInput.match(
      /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
    );
    if(res == null)
        return false;
    else
        return true;
}

/**
 * ************* DELETE BOOKMARK ************* 
 */  
function delFunc(){
  // getting the bookmarks from local storage and deleting the bookmark from local storage
  let bookmarks = JSON.parse(localStorage.getItem("bookmark"));
  // console.log(Array.from(del).indexOf(this));
  
  if(confirm("Are you sure, you want to delete this item?")){
    bookmarks = bookmarks.filter(bookmark => bookmark !== bookmarks[Array.from(del).indexOf(this)]);
    localStorage.setItem("bookmark", JSON.stringify(bookmarks));
  
    // deleting the bookmark from the UI
    this.parentNode.parentNode.removeChild(this.parentNode);  
  }
}
