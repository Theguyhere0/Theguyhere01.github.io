/**
 * Copy text to clipboard.
 * @param {string} text 
 */
function copy(text) {
  const type = "text/plain";
  const blob = new Blob([text], { type })
  let data = [new ClipboardItem({ [type]: blob })];

  navigator.clipboard.write(data).then(function () {
  }, function (err) {
    console.log(err);
  });
}

/**
 * Add a class to an element, if the class does not already exist.
 * @param {Element} element 
 * @param {string} name 
 */
function addClass(element, name) {
  let elementClasses = element.className.split(" ");
  if (elementClasses.indexOf(name) == -1) {
    element.className += " " + name;
  }
}

/**
 * Remove a class from an element, if the class exists.
 * @param {Element} element 
 * @param {string} name 
 */
function removeClass(element, name) {
  let elementClasses = element.className.split(" ");
  if (elementClasses.indexOf(name) > -1) {
    elementClasses.splice(elementClasses.indexOf(name), 1);
  }
  element.className = elementClasses.join(" ");
}

/**
 * Remove all numeric classes.
 * @param {Element} element 
 */
function removeNumberClasses(element) {
  let elementClasses = element.className.split(" ");
  for (let i = 0; i < elementClasses.length; i++) {
    if (!isNaN(elementClasses[i])) {
      removeClass(element, elementClasses[i]);
    }
  }
}

/**
 * Updates the visibility of filterable elements based on filters and search criteria.
 */
function updateFilterables() {
  // Gather enabled filters
  const enabledFilters = document.getElementById("filters").children;

  // Gather search criteria
  const search = document.getElementById("search").value.toLowerCase();

  const filterables = document.getElementsByClassName("filterable");
  let elementIndex = 0;
  for (let i = 0; i < filterables.length; i++) {
    const filterable = filterables[i];

    // Remove pagination numbers
    removeNumberClasses(filterable);

    // Hide filterables without enabled filters or not matching search criteria
    let hidden = true;
    for (let j = 0; j < enabledFilters.length; j++) {
      const enabledFilterClasses = enabledFilters[j].className.split(" ");
      if (enabledFilterClasses.indexOf("disabled") == -1 &&
        filterable.getElementsByClassName(enabledFilterClasses[1]).length > 0 &&
        filterable.getElementsByClassName("title")[0].textContent.split(/\r?\n/)[0].toLowerCase().indexOf(search) > -1) {
        hidden = false;
      }
    }
    if (hidden) {
      addClass(filterable, "hidden");
    } else {
      removeClass(filterable, "hidden");

      // Assign pagination number
      addClass(filterable, Math.floor(elementIndex++ / 10) + 1);
    }
  }

  // Set up initial pages and set to first page
  setPage(1, Math.floor(elementIndex / 10) + 1);
}

/**
 * Toggles a filter between being enabled and disabled, then updates visibility of filterable elements.
 * @param {Element} filter 
 */
function toggleFilter(filter) {
  // Toggle actual filter
  let filterClasses = filter.className.split(" ");
  if (filterClasses.indexOf("disabled") == -1) {
    addClass(filter, "disabled");
  } else {
    removeClass(filter, "disabled");
  }

  // Update
  updateFilterables();
}

/**
 * Execute a function if a certain key is pressed.
 * @param {KeyboardEvent} event 
 * @param {string} key 
 * @param {Function} execution 
 */
function keyPressHelper(event, key, execution) {
  if (event.key == key) {
    execution();
  }
}

/**
 * Sets up the pagination list given a positive number of pages and the active page.
 * @param {number} page
 * @param {number} pages 
 */
function setPage(page, pages = document.getElementsByClassName("pagination")[0].lastElementChild.previousElementSibling.firstChild.innerHTML) {
  // Adjust visibility of elements to match the page
  const filterables = document.getElementsByClassName("filterable");
  for (let i = 0; i < filterables.length; i++) {
    const filterable = filterables[i];
    if (filterable.className.indexOf(page) > -1) {
      removeClass(filterable, "hidden");
    } else {
      addClass(filterable, "hidden");
    }
  }

  // Prepare proper pages
  let innerHTML;
  if (page > 1) {
    innerHTML = '<li><a class="button small" onclick="setPreviousPage()">Prev</a></li>';
  } else {
    innerHTML = '<li><a class="button small disabled">Prev</a></li>';
  }

  if (pages == 1) {
    innerHTML += '<li><a class="page">1</a></li>';
    innerHTML += '<li><a class="button small disabled">Next</a></li>';
  } else if (pages < 7) {
    for (let i = 0; i < pages; i++) {
      if (i + 1 == page) {
        innerHTML += '<li><a class="page active">' + (i + 1) + '</a></li>';
      } else {
        innerHTML += '<li><a class="page" onclick="setPage(' + (i + 1) + ')">' + (i + 1) + '</a></li>';
      }
    }
    if (page >= pages) {
      innerHTML += '<li><a class="button small disabled">Next</a></li>';
    } else {
      innerHTML += '<li><a class="button small" onclick="setNextPage()">Next</a></li>';
    }
  } else {
    if (page > 3 && page < pages - 2) {
      innerHTML += '<li><a class="page" onclick="setPage(1)">1</a></li>';
      innerHTML += '<li><span>&hellip;</span></li>';
      innerHTML += '<li><a class="page" onclick="setPage(' + (page - 1) + ')">' + (page - 1) + '</a></li>';
      innerHTML += '<li><a class="page active">' + page + '</a></li>';
      innerHTML += '<li><a class="page" onclick="setPage(' + (page + 1) + ')">' + (page + 1) + '</a></li>';
      innerHTML += '<li><span>&hellip;</span></li>';
      innerHTML += '<li><a class="page" onclick="setPage(' + pages + ')">' + pages + '</a></li>';
    } else {
      for (let i = 0; i < 3; i++) {
        if (i + 1 == page) {
          innerHTML += '<li><a class="page active">' + (i + 1) + '</a></li>';
        } else {
          innerHTML += '<li><a class="page" onclick="setPage(' + (i + 1) + ')">' + (i + 1) + '</a></li>';
        }
      }
      innerHTML += '<li><span>&hellip;</span></li>';
      for (let i = pages - 3; i < pages; i++) {
        if (i + 1 == page) {
          innerHTML += '<li><a class="page active">' + (i + 1) + '</a></li>';
        } else {
          innerHTML += '<li><a class="page" onclick="setPage(' + (i + 1) + ')">' + (i + 1) + '</a></li>';
        }
      }
    }
    if (page >= pages) {
      innerHTML += '<li><a class="button small disabled">Next</a></li>';
    } else {
      innerHTML += '<li><a class="button small" onclick="setNextPage()">Next</a></li>';
    }
  }

  // Set up pagination lists
  const paginations = document.getElementsByClassName("pagination");
  for (let i = 0; i < paginations.length; i++) {
    paginations[i].innerHTML = innerHTML;
  }
}

function setPreviousPage() {
  setPage(parseInt(document.getElementsByClassName("pagination")[0].getElementsByClassName("active")[0].textContent) - 1);
}

function setNextPage() {
  setPage(parseInt(document.getElementsByClassName("pagination")[0].getElementsByClassName("active")[0].textContent) + 1);
}
