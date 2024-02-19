/**
 * Get current user's information
 */
async function getCurrentUserInfo() {
  try {
    const response = await domo.get(`/domo/users/v1/${domo.env.userId}?includeDetails=true`);
    return {
      id: domo.env.userId,
      active: response.detail.active,
      email: response.detail.email,
      title: response.detail.title,
      displayName: response.displayName,
      role: response.role,
      roleId: response.roleId
    };
  } catch (error) {
    console.error("Error getting current user information: ", error);
  }
}

/**
 * Fetch collection's data from domo
 * @param {*} collectionName the name of collection to fetch
 * @param {*} selectedFields the selected fields to be shown
 */
async function fetchTrackerData(collectionName, selectedFields=[]) {
  try {
    // Fetch data from domo dataset
    const getUrl = generateFetchUrl(collectionName, selectedFields);
    console.log(`Triggering GET call ${getUrl} ...`);
    const data = await domo.get(getUrl);
    console.log("trackers content", data);

    // Get current user
    if (global.currentUser == null) {
      global.currentUser = await getCurrentUserInfo();
      console.log("Initialized current user in global");
    }
    console.log('currentUser', global.currentUser);

    // Draw dropdown for the table
    generateSelectOptions('trackers-dropdown', global.TRACKERS_COLUMNS);

    // Draw table
    drawTable(data.map(item => {return {...item.content, id: item.id}}), 'trackers-table', {selectedFields: selectedFields, editable: true, actions: {saveAction: saveAction, deleteAction: deleteAction}})

  } catch (error) {
    console.error("Error fetching trackers data: ", error);
  }
}

/**
 * Create a document
 * @param {*} newDocument the new document
 */
async function createAction(newDocument) {
  try {
    // Update document
    const createUrl = generateCreateUrl(global.TRACKERS_COLLECTION);
    const response = await domo.post(createUrl, newDocument);
    console.log("Tracker document got created successfully!", response);

    // Refresh page
    fetchTrackerData(global.TRACKERS_COLLECTION);

    // Audit log
    generateAuditLog(global.OPERATIONS.ADD, response.id);
  } catch (error) {
    console.error("Error while creating document", error);
  }
}

/**
 * Update certain document
 * @param {*} documentId the document id
 * @param {*} newDocument the new document
 */
async function saveAction(documentId, newDocument) {
  try {
    // Update document
    const updateUrl = generateUpdateUrl(global.TRACKERS_COLLECTION, documentId);
    await domo.put(updateUrl, newDocument);
    console.log("Tracker document got updated successfully!");

    // Refresh page
    fetchTrackerData(global.TRACKERS_COLLECTION);

    // Audit log
    generateAuditLog(global.OPERATIONS.UPDATE, documentId);
  } catch (error) {
    console.error("Error while saving document", error);
  }
}

/**
 * Delete a document by id
 * @param {*} documentId the document id
 */
async function deleteAction(documentId) {
  try {
    // Delete document
    const updateUrl = generateUpdateUrl(global.TRACKERS_COLLECTION, documentId);
    await domo.delete(updateUrl);
    console.log("Tracker document got deleted successfully!");

    // Refresh page
    fetchTrackerData(global.TRACKERS_COLLECTION);

    // Audit log
    generateAuditLog(global.OPERATIONS.DELETE, documentId);
  } catch (error) {
    console.error("Error while deleting document", error);
  }
}

/**
 * Generate options for select element
 * @param {*} selectId 
 * @param {*} items 
 */
function generateSelectOptions(selectId, items) {
  // Find the select element by its ID
  const selectElement = document.getElementById(selectId);

  if (!selectElement) {
    return;
  }

  // Clear existing options
  selectElement.innerHTML = '';

  // Iterate over the items array
  items.forEach(item => {
      // Create a new option element
      const option = document.createElement('option');
      option.value = item; // Set the value attribute
      option.textContent = item; // Set the display text

      // Append the option to the select element
      selectElement.appendChild(option);
  });

  // Add event listener to dropdown so that we will refresh the table every time we select new options
  selectElement.addEventListener('blur', function() {
      const selectedOptions = Array.from(this.selectedOptions).map(option => option.value);
      console.log('Selected values:', selectedOptions);
      fetchTrackerData(global.TRACKERS_COLLECTION, selectedOptions);
  });
}

/**
 * Export all of your collections to dataset
 */
async function runExportUrl() {
  try {
    const response = await domo.post('/domo/datastores/v1/export');
    console.log("Collections are exported successfully", response);
    showMessage("Syncing in progress. Please check after a few minutes ...", "lightgreen");
  } catch (e) {
    console.error("Error while exporting collections ...", e);
  }
}

/**
 * Create a button on the page
 * @param {*} divId 
 * @param {*} buttonText 
 * @param {*} buttonId 
 */
function addCreateButtonInDiv(divId, buttonText, buttonId) {

  const targetDiv = document.getElementById(divId);

  if (!targetDiv) {
    return;
  }

  const buttonElmt = document.createElement("button");
  buttonElmt.textContent = buttonText;
  buttonElmt.id = buttonId;

  // Add listner
  buttonElmt.addEventListener("click", function(e) {
    e.stopImmediatePropagation();
    drawModalWithTableData(e, null, true, {createAction: createAction});
  });

  targetDiv.appendChild(buttonElmt);
}

/**
 * Create a button on the page
 * @param {*} divId 
 * @param {*} buttonText 
 * @param {*} buttonId 
 */
function addSyncButtonInDiv(divId, buttonText, buttonId) {

  const targetDiv = document.getElementById(divId);

  if (!targetDiv) {
    return;
  }

  const buttonElmt = document.createElement("button");
  buttonElmt.textContent = buttonText;
  buttonElmt.id = buttonId;

  // Add listner
  buttonElmt.addEventListener("click", function(e) {
    e.stopImmediatePropagation();
    runExportUrl();
  });

  targetDiv.appendChild(buttonElmt);
}

// Start initial load
if (isCurrentPageOpen("Trackers")) {
  addCreateButtonInDiv('left-control', 'Create Record', 'create-record');
  addSyncButtonInDiv('left-control', 'Sync Now', 'sync-record');
  fetchTrackerData(global.TRACKERS_COLLECTION);
}
