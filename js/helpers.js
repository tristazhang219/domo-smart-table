/**
 * @returns true if current oage is opened
 */
function isCurrentPageOpen(expectedHeader) {
  // Check if Tracker's page is opening
  const headerElement = document.getElementById('page-header');
  if (!!headerElement && headerElement.innerText === expectedHeader) {
    return true;
  } else {
    return false;
  }
}

/**
 * Show message on top of the page and remove it after 5s
 * @param {*} message 
 */
function showMessage(message, backgroundColor) {
  const messageElement = document.createElement("div");
  messageElement.style.position = "fixed";
  messageElement.style.top = "0";
  messageElement.style.left = "0";
  messageElement.style.width = "100%";
  messageElement.style.backgroundColor = backgroundColor;
  messageElement.style.color = "black";
  messageElement.style.textAlign = "center";
  messageElement.style.padding = "10px";
  messageElement.style.zIndex = "1000";
  messageElement.textContent = message;

  document.body.appendChild(messageElement);

  setTimeout(function() {
    document.body.removeChild(messageElement);
  }, 5000);
}

/**
 * Build fetch url to get tracker data
 * @param {*} collectionName collection name
 * @param {*} selectedFields list of strings of selected field names
 */
function generateFetchUrl(collectionName, selectedFields) {
  let encodeUrl = global.BASE_URL + "/" + collectionName + "/documents";
  if (!!selectedFields && selectedFields.length > 0 && !selectedFields.includes('All')) {
    const fieldsQueryParams = selectedFields.map(field => encodeURIComponent(field)).join(',');
    encodeUrl = `${encodeUrl}?fields=${fieldsQueryParams}`;
  }
  console.log("encodeUrl", encodeUrl);
  return encodeUrl;
}

/**
 * Build update url to update certain tracker document
 * @param {*} collectionName collection name
 * @param {*} documentId the document id
 */
function generateUpdateUrl(collectionName, documentId) {
  return `${global.BASE_URL}/${collectionName}/documents/${documentId}`;
}

/**
 * Build create url to create a tracker document
 * @param {*} collectionName collection name
 */
function generateCreateUrl(collectionName) {
  return `${global.BASE_URL}/${collectionName}/documents/`;
}

function humanize(str) {
  const allCapsCases = ['id'];
  var frags = str.split('_');
  for (const i in frags) {
    if (allCapsCases.includes(frags[i].toLowerCase())) {
      frags[i] = frags[i].toUpperCase();
    } else {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
  }

  return frags.join(' ');
}

function checkIfFile(str) {
  return typeof str === 'string' &&
        str.startsWith('/domo/data-files/v1')
}

function createSpinner(target='body') {
  const spinner = document.createElement('div');
  spinner.setAttribute('id', 'spinner');
  document.querySelector(target).appendChild(spinner);
}

function removeSpinner() {
  const spinner = document.querySelector('#spinner');
  if (spinner) {
    spinner.remove();
    return true;
  }

  return false;
}

function FileUpload(callback) {
  try {
    if (!callback) {
      throw 'Error: "callback" is a required parameter';
    }
    this.constructor(callback);
  } catch (e) {
    console.error(e);
  }
}

FileUpload.prototype = {
  callback: undefined,

  constructor(callback) {
    this.callback = callback;
  }
}