function drawTable(dataSet, targetElement, {idColumn='id', selectedFields, editable=false, actions} = {}) {
  var tableEl = document.getElementById(targetElement, tableEl);
  tableEl.innerHTML = "";
  if(!dataSet || !dataSet.length) {
    tableEl.append("No items to display yet!");
    return;
  }

  const header = !!selectedFields && selectedFields.length > 0 && !selectedFields.includes('All') ? selectedFields : Object.keys(dataSet[dataSet.length -1]);
  const thead = addHeader(header, selectedFields);
  const tbody = addRows(dataSet, idColumn, selectedFields, editable, header, actions);
  tableEl.appendChild(thead);
  tableEl.appendChild(tbody);

  removeSpinner();
}

function addHeader(header, selectedFields) {
  const thead = document.createElement('thead');
  var headerRow = document.createElement('tr');

  header.forEach(function(column) {
    if (!!selectedFields && selectedFields.length > 0 && !selectedFields.includes('All') && !selectedFields.includes(column)) {
      return;
    }
    var text = document.createTextNode(humanize(column));
    var headerCell = document.createElement('th');
    headerCell.setAttribute('data-column-name', column);
    headerCell.appendChild(text);
    headerRow.appendChild(headerCell);
  });

  thead.appendChild(headerRow);
  return thead;
}

function addRows(dataSet, idColumn, selectedFields, editable, header, actions) {
  const tbody = document.createElement('tbody');
  dataSet.forEach(function(row) {
    var tr = document.createElement('tr');
    const id = row[idColumn];
    tr.setAttribute('id', id);
    Object.entries(row).forEach(function([key, val]) {
      if (!!selectedFields && selectedFields.length > 0 && !selectedFields.includes('All') && !selectedFields.includes(key)) {
        // Not render this field
        return;
      }

      const td = document.createElement('td');
      td.setAttribute('data-value', val);

      if (checkIfFile(val)) {
        const a = document.createElement('a');
        a.setAttribute('href', val);
        a.appendChild(document.createTextNode('Download'))
        a.addEventListener('click', function(e) {
          e.stopPropagation();
        });
        tr.appendChild(td).appendChild(a);

        return;
      }

      td.appendChild(document.createTextNode(val));
      tr.appendChild(td);
    });

    if (tr.children.length < header.length) {
      tr.appendChild(document.createElement('td'));
    }

    tr.addEventListener('click', function(e) {
      e.stopImmediatePropagation();
      drawModalWithTableData(e, id, editable, actions);
    });
    tbody.appendChild(tr);

  });
  return tbody;
}

function drawModalWithTableData(e, id, editable, actions) {
  const EMPTY_FORM = {
    Brand_Name: "",
    Campaign_Name : "",
    Supplier: "",
    Placement_Id: "",
    Client_Placement_Id: "",
    Scheduled_Launch_Date: "",
    Actual_Launch_Date: "",
    End_Date: ""
  };
  const data = id == null ? EMPTY_FORM : getTableValues(e.composedPath());
  const title = id == null ? 'Create Document' : 'View Document';
  const modal = new Modal(data, {id, title, editable, actions});
  modal.open();
}

function getTableHeaders(path) {
  const tableIdx = path.map(node => node.nodeName).indexOf('TABLE');
  const header = path[tableIdx].tHead.children[0].children;

  return Array.from(header).map(el => el.getAttribute('data-column-name'));
}

function getTableValues(path) {
  const pathIdx = path.map(node => node.nodeName).indexOf('TR');
  const row = path[pathIdx].children;
  const colVals = Array.from(row).map(el => el.getAttribute('data-value'));

  const headers = getTableHeaders(path);

  const values = {};
  for (const i in headers) {
    if (colVals.length == i) continue;
    values[headers[i]] = colVals[i];
  }

  return values;
}

