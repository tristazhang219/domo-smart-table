const global = {
    TRACKERS_COLUMNS: ['All', 'id', 'Brand_Name', 'Campaign_Name', 'Supplier', 'Placement_Id', 'Scheduled_Launch_Date', 'Actual_Launch_Date', 'End_Date', 'Client_Placement_Id'],
    TRACKERS_COLLECTION: 'Trackers',
    BASE_URL: '/domo/datastores/v1/collections',
    AUDIT_COLLECTION: 'Audits',
    OPERATIONS: Object.freeze({
        ADD: "ADD",
        UPDATE: "UPDATE",
        DELETE: "DELETE"
      })
};
