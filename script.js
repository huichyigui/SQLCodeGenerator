/*
Logic for SQL Code Formatter
*/
const ActionType = {
  SELECT: "select",
  UPDATE: "update",
  DELETE: "delete",
};
const action = document.getElementById("action");
const tableName = document.getElementById("tableName");
const generateBtn = document.getElementById("generateBtn");
const clearBtn = document.getElementById("clearBtn");
const resetBtn = document.getElementById("resetBtn");
const outputContainer = document.getElementById("outputContainer");
const output = document.getElementById("output");

action.addEventListener("change", updateFields);

function updateFields() {
  clearForm();

  const actionValue = action.value;
  const fields = ["selectFields", "updateFields", "deleteFields"];
  fields.forEach((field) => {
    document.getElementById(field).classList.add("d-none");
  });

  if (actionValue) {
    document.getElementById(`${actionValue}Fields`).classList.remove("d-none");
    generateBtn.classList.remove("d-none");
    clearBtn.classList.remove("d-none");
    resetBtn.classList.remove("d-none");
    outputContainer.classList.add("d-none");

    switch (actionValue) {
      case ActionType.SELECT:
        document.getElementById("columns").focus();
        break;
      case ActionType.UPDATE:
        document.getElementById("updateTable").focus();
        break;
      case ActionType.DELETE:
        document.getElementById("fromTable").focus();
        break;
    }
  } else {
    outputContainer.classList.add("d-none");
    generateBtn.classList.add("d-none");
    clearBtn.classList.add("d-none");
    resetBtn.classList.add("d-none");
  }
}

function addJoin() {
  const joins = document.getElementById("joins");
  const div = createJoinElement();
  joins.appendChild(div);
}

function createJoinElement() {
  const div = document.createElement("div");
  div.classList.add("input-group", "mb-2");
  div.innerHTML = `
        <select class="form-select joinType me-2" style="max-width: 140px;">
            <option value="INNER JOIN">INNER JOIN</option>
            <option value="LEFT JOIN">LEFT JOIN</option>
            <option value="RIGHT JOIN">RIGHT JOIN</option>
            <option value="FULL JOIN">FULL JOIN</option>
        </select>
        <input type="text" class="form-control joinTable" placeholder="Join Table">
        <span class="input-group-text">ON</span>
        <input type="text" class="form-control joinOn" placeholder="Join Condition">
        <span class="input-group-text">=</span>
        <input type="text" class="form-control joinEquals" placeholder="Equals Condition">
        <button class="btn btn-danger" type="button" onclick="this.parentElement.remove()">Remove</button>
    `;
  return div;
}

function addWhere() {
  const whereConditions = document.getElementById("whereConditions");
  const div = createWhereElement();
  whereConditions.appendChild(div);
}

function createWhereElement() {
  const div = document.createElement("div");
  div.classList.add("input-group", "mb-2");
  div.innerHTML = `
        <select class="form-select whereOperator" style="max-width: fit-content;">
            <option value="AND">AND</option>
            <option value="OR">OR</option>
        </select>
        <input type="text" class="form-control whereCondition" placeholder="WHERE Condition">
        <button class="btn btn-danger" type="button" onclick="this.parentElement.remove()">Remove</button>
    `;
  return div;
}

function trimSymbol(text) {
  return text.trim().replace(/[,;]+$/, "");
}

function generateSQL() {
  let sql = "";
  const actionType = action.value;

  if (actionType === ActionType.SELECT) {
    sql = generateSelectSQL();
  } else if (actionType === ActionType.UPDATE) {
    sql = generateUpdateSQL();
  } else if (actionType === ActionType.DELETE) {
    sql = generateDeleteSQL();
  }

  if (sql.trim()) {
    output.innerText = sql;
    outputContainer.classList.remove("d-none");
  }
}

function generateSelectSQL() {
  const columns = trimSymbol(document.getElementById("columns").value);
  const table = tableName.value.trim();

  if (!columns || !table) {
    alert("Table Name and Columns are mandatory.");
    return "";
  }

  let sql = `SELECT ${columns} FROM ${table}`;
  sql += generateJoinSQL();
  sql += generateWhereSQL();
  sql += generateGroupBySQL();
  sql += generateHavingSQL();
  sql += generateOrderBySQL();

  return sql;
}

function generateUpdateSQL() {
  const table = trimSymbol(document.getElementById("updateTable").value);
  const setClause = trimSymbol(document.getElementById("setClause").value);
  const whereClause = trimSymbol(
    document.getElementById("whereClauseUpdate").value
  );

  if (!table || !setClause) {
    alert("Table Name and Set Clause are mandatory.");
    return "";
  }

  let sql = `UPDATE ${table} SET ${setClause}`;
  if (whereClause) sql += ` WHERE ${whereClause}`;

  return sql;
}

function generateDeleteSQL() {
  const table = trimSymbol(document.getElementById("fromTable").value);
  const whereClause = trimSymbol(
    document.getElementById("whereClauseDelete").value
  );

  if (!table) {
    alert("Table Name is mandatory.");
    return "";
  }

  let sql = `DELETE FROM ${table}`;
  if (whereClause) sql += ` WHERE ${whereClause}`;

  return sql;
}

function generateJoinSQL() {
  let sql = "";
  const joinTypes = document.querySelectorAll(".joinType");
  const joinTables = document.querySelectorAll(".joinTable");
  const joinOns = document.querySelectorAll(".joinOn");
  const joinEquals = document.querySelectorAll(".joinEquals");

  for (let i = 0; i < joinTables.length; i++) {
    const joinType = joinTypes[i].value.trim();
    const joinTable = joinTables[i].value.trim();
    const joinOn = joinOns[i].value.trim();
    const joinEquals = joinEquals[i].value.trim();

    if (joinTable && joinOn && joinEquals) {
      sql += `\n${joinType} ${joinTable} ON ${joinOn} = ${joinEquals}`;
    }
  }

  return sql;
}

function generateWhereSQL() {
  let sql = "";
  const whereOperators = document.querySelectorAll(".whereOperator");
  const whereConditions = document.querySelectorAll(".whereCondition");

  if (whereConditions.length > 0) {
    sql += "\nWHERE";
    for (let i = 0; i < whereConditions.length; i++) {
      const operator = whereOperators[i].value;
      const condition = whereConditions[i].value.trim();
      if (condition) {
        if (i > 0) sql += ` ${operator}`;
        sql += ` ${condition}`;
      }
    }
  }

  return sql;
}

function generateGroupBySQL() {
  const groupBy = trimSymbol(document.getElementById("groupBy").value);
  return groupBy ? `\nGROUP BY ${groupBy}` : "";
}

function generateHavingSQL() {
  const having = trimSymbol(document.getElementById("having").value);
  return having ? `\nHAVING ${having}` : "";
}

function generateOrderBySQL() {
  const orderByField = document.getElementById("orderByField").value.trim();
  const orderByDirection = document
    .getElementById("orderByDirection")
    .value.trim();
  return orderByField ? `\nORDER BY ${orderByField} ${orderByDirection}` : "";
}

function copyToClipboard() {
  navigator.clipboard
    .writeText(output.innerText)
    .then(() => alert("Formatted text copied to clipboard!"))
    .catch((err) => alert("Failed to copy: " + err));
}

function clearForm() {
  document.querySelectorAll("input").forEach((input) => (input.value = ""));
}

function resetForm() {
  const e = new Event("change");
  action.value = "";
  action.dispatchEvent(e);
  action.focus();
  updateFields();
}
