/**
 * Insert audit log into Audits collection
 * @param {*} operationType 
 * @param {*} documentId 
 */
async function generateAuditLog(operationType, documentId) {
    try {
        const createUrl = generateAuditCreateUrl();
        await domo.post(createUrl, {content: {
            userId: global.currentUser.id,
            userEmail: global.currentUser.email,
            userName: global.currentUser.displayName,
            operationType: operationType,
            documentId: documentId
        }});
        console.log("Audit log has been inserted successfully");
    } catch (error) {
        console.error("Error while generating audit log ...", error);
    }
}

/**
 * Fetch Audits collection's data from domo
 */
async function fetchAuditData() {
    try {
      // Fetch data from domo dataset
      const getUrl = generateFetchUrl(global.AUDIT_COLLECTION);
      console.log(`Triggering GET call ${getUrl} ...`);
      const data = await domo.get(getUrl);
      console.log("Audits content", data);
  
      // Get current user
      if (global.currentUser == null) {
        global.currentUser = await getCurrentUserInfo();
        console.log("Initialized current user in global");
      }
  
      // Draw table
      drawTable(data.map(item => {return {...item.content, id: item.id}}), 'audits-table', {selectedFields: [], editable: false, actions: {}})
  
    } catch (error) {
      console.error("Error fetching audits data: ", error);
    }
  }

/**
 * Build create url to create a tracker document
 * @param {*} collectionName collection name
 */
function generateAuditCreateUrl() {
    return `${global.BASE_URL}/${global.AUDIT_COLLECTION}/documents/`;
}

// Start loading data
if (isCurrentPageOpen('Audits')) {
    fetchAuditData();
}
