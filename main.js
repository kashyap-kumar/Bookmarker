// Welcome to JavaScript city, Source Code

document.getElementsByClassName("loader")[0].style.display = "none";

const form = document.getElementById("form");
form.addEventListener("submit", addItem);

let del; // for getting the classes with the name delete, can't initialised here because the elements with the class name delete are created in local scope(function)

// add new bookmark
function addItem(e) {
  e.preventDefault();

  let siteName = document.getElementById("siteName").value;
  let siteUrl = document.getElementById("siteUrl").value;
  const bookmark = {
    siteName: siteName,
    siteUrl: siteUrl
  };

  if(!isUrlValid(siteUrl)){
    alert("Enter a valid url");
    return;
  }

  if(localStorage.getItem("bookmark") == null){
    localStorage.setItem("bookmark", "[]");
  }
  const bookmarks = JSON.parse(localStorage.getItem("bookmark"));
  bookmarks.push(bookmark);
  localStorage.setItem("bookmark", JSON.stringify(bookmarks));

  loadItems();

  // clear the input fields
  document.getElementById("siteName").value = "";
  document.getElementById("siteUrl").value = "";
}

// load the bookmarks
function loadItems() {
  document.getElementById("bookmarks").innerHTML = "";

  if (localStorage.getItem("bookmark") != null) {
    const bookmarks = JSON.parse(localStorage.getItem("bookmark"));
    bookmarks.forEach((e) => {
      document.getElementById("bookmarks").innerHTML += `
                <div class="bookmark">
                    <h4>${e.siteName}</h4>
                    <a href="${e.siteUrl}" target="blank">Visit</a>
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

// url  validation
function isUrlValid(userInput) {
    var res = userInput.match(
      /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
    );
    if(res == null)
        return false;
    else
        return true;
}

// function for deleting bookmark  
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
