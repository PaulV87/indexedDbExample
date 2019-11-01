// Making navbar sticky
window.onscroll = function() {
	stickyFunction();
}


var navbar = document.getElementById("navbar");

var sticky =navbar.offsetTop;

function stickyFunction() {
	if (window.pageYOffset >= sticky) {
		navbar.classList.add("sticky")
	} else {
		navbar.classList.remove("sticky");
	}
}
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

window.IDBTransaction = window.IDBTransaction || 
window.webkitIDBTransaction || window.msIDBTransaction;

window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || 
window.msIDBKeyRange
 
if (!window.indexedDB) {
	window.alert("Browser does not support IndexedDb");
}
var db;

var request = window.indexedDB.open("myDb", 1);

// not used anymore. Example of our indexedDb data structure
const employeeData = [
	{ id: "01", name: "Anadi", age: 30, email: "anadi@tut.com" },
	{ id: "02", name: "Shivu", age: 35, email: "shivu@tut.com" }
];

request.onerror = function(event) {
	console.log("error: ");
};

request.onsuccess = function(event) {
	db = request.result;
	console.log("success: " + db);
};

request.onupgradeneeded = function(event) {
	var db = event.target.result;
	var objectStore = db.createObjectStore("employee", { keyPath: "id" });
	for (var i in employeeData) {
		console.log(i);
		objectStore.add(employeeData[i]);
	}
}

// function replaced by drawTable
// function to read all of the data from the objectStore employee
function readAll() {
	// clears the previously written data to the HTML element 
	document.getElementById("myDataTable").innerHTML="";
	
	console.log("readall function called");
	// starts the transaction to open the objectstore employee and read all the 
	// information
	
	var objectStore = db.transaction("employee").objectStore("employee");
	objectStore.openCursor().onsuccess = function(event) {
		var cursor = event.target.result;
		if (cursor) {
			// alert("Name for id " + cursor.key + " is " + cursor.value.name + ", Age: " + cursor.value.age + ", Email: " + cursor.value.email);
			// console.log("Name for id " + cursor.key + " is " + cursor.value.name + ", Age: " + cursor.value.age + ", Email: " + cursor.value.email);
			var node = document.createElement("LI");
			var textnode = document.createTextNode("Name for id " + cursor.key + " is " + cursor.value.name + ", Age: " + cursor.value.age + ", Email: " + cursor.value.email);
			node.appendChild(textnode)
			document.getElementById("myDataTable")
			.appendChild(node)
			cursor.continue();
		}
	};
}
// function to add data to the objectStore
function add() {
	// reads the user input from html elements
	var idData = document.getElementById("idBox").value;
	var nameData = document.getElementById("nameBox").value;
	var ageData = document.getElementById("ageBox").value;
	var emailData = document.getElementById("emailBox").value;
	/*
	console.log(idData + ", " + nameData + ", " + ageData + ", " + emailData);
	console.log("add function called");
	*/
	// Starts the transaction to open the objectStore employee and gets
	// it ready to write to it.
	var request = db.transaction(["employee"], "readwrite")
	.objectStore("employee")
	.add({ id: idData, name: nameData, age: ageData, email: emailData });
	// sends an alert if it was successfull
	request.onsuccess = function(event) {
		alert("Success: " + nameData +" has been added to the database");
	};
	// sends an alert if there was an error
	request.onerror = function(event) {
		alert("Unable to add to the database");
	};
	drawOnLoad();
} 

// function to read a specific data array from indexDB
let countSearch = 1;
function read() {
		
	// reads the user input ID for the data array to read
	var idData = document.getElementById("idSearchBox").value;
	
	// starts the transaction to read the data from objectstore employee
	var transaction = db.transaction(["employee"]);
	var objectStore = transaction.objectStore(["employee"]);
	var request = objectStore.get(idData);
	
	request.onerror = function(event){
		alert("Uable to retrieve data from the database");
	};
	
	// on success we can return the data retrieve from the objectStore
	// to the user
	request.onsuccess = function(event) {
		// Do something with the request result
		if (request.result) {
			/* alert("Name: " + request.result.name + ", Age: " + request.result.age 
				  + ", Email: " + request.result.email); */
		// creats a new html elements "LI" and writes the data from the object 
		//table to it. Usage request.result.(dbkey)
		// find the table html element
			var tableDb = document.getElementById("tableData");
			// create a new row starting from the top (<tr>)
			var row = tableDb.insertRow(countSearch);
			// create cells for each row (<td>)
			var cell1 = row.insertCell(0);
			var cell2 = row.insertCell(1);
			var cell3 = row.insertCell(2);
			var cell4 = row.insertCell(3);
			// add text to the new cells
			cell1.innerHTML = request.result.id;
			cell2.innerHTML = request.result.name;
			cell3.innerHTML = request.result.age;
			cell4.innerHTML = request.result.email;
			countSearch++;
	    }
		else {
			alert("That id isn't currently in the database.");
		}
	};
}

// function to delete data from the object store employee
function remove() {
	// stores the user data in a variable
	var idData = document.getElementById("idDeleteBox").value;

	// starts the transaction to delete the chosen elements
	var request = db.transaction(["employee"], "readwrite")
	.objectStore("employee")
	.delete(idData);

	// sends an alert when deletion was successfull
	request.onsuccess = function (event) {
		drawOnLoad();
	};
}
// Reads the data in the database to Id fields
function readToHtml() {
	// reads the user input ID for the data array to read
	var idData = document.getElementById("idEditIdBox").value;
	
	// starts the transaction to read the data from objectstore employee
	var transaction = db.transaction(["employee"]);
	var objectStore = transaction.objectStore(["employee"]);
	var request = objectStore.get(idData);
	
	request.onerror = function (event){
		alert("Uable to retrieve data from the database");
	};
	
	// on success we can return the data retrieve from the objectStore
	// to the user
	request.onsuccess = function (event) {
		// Do something with the request result
		if (request.result) {
			
			// add database results to input boxes
			document.getElementById("idEditBox").value = request.result.id;
			document.getElementById("nameEditBox").value = request.result.name;
			document.getElementById("ageEditBox").value = request.result.age;
			document.getElementById("emailEditBox").value = request.result.email;
		}
		else {
			alert("That id isn't currently in the database.");
		}
	};
}

// function to change the data in an indexedDB
function amend() {
	// reads all the data from the html elements to variables
	var idData = document.getElementById("idEditBox").value;
	var nameData = document.getElementById("nameEditBox").value;
	var ageData = document.getElementById("ageEditBox").value;
	var emailData = document.getElementById("emailEditBox").value;
	console.log("Ammend function called");
	// starts the transaction to amend the employee objectstore data
	var transaction = db.transaction(["employee"], "readwrite")
	var edit = transaction.objectStore(["employee"]);
	// uses the user provided data to create a new data array and write
	// it over an existing one ammending it.
	var employee =
		{ id: idData, name: nameData, age: ageData, email: emailData };
		edit.put(employee);
		request.onsuccess = function(event) {
			console.log("ages has been changed successfully")
		}
		request.onerror = function(event) {
			console.log("ages has not been changed")
		}
	drawTable();			
}

// function to read the data from the indexDB and write it to a table
function drawTable() {
	let count = 1;
	// clears existing data
	clearTable();
	// Starts the transaction to read the data in the objectStore "employee"
	var objectStore = db.transaction("employee").objectStore("employee");
	// opens a cursor to read each entry in the object store
	objectStore.openCursor().onsuccess = function(event) {
		var cursor = event.target.result;
		if (cursor) {
			// find the table html element
			var tableDb = document.getElementById("tableData");
			// create a new row starting from the top (<tr>)
			var row = tableDb.insertRow(count);
			// create cells for each row (<td>)
			var cell1 = row.insertCell(0);
			var cell2 = row.insertCell(1);
			var cell3 = row.insertCell(2);
			var cell4 = row.insertCell(3);
			// add text to the new cells
			cell1.innerHTML = cursor.key;
			cell2.innerHTML = cursor.value.name;
			cell3.innerHTML = cursor.value.age;
			cell4.innerHTML = cursor.value.email;
			// increment count for the next row		
			count++;
			cursor.continue();
		}
	};
}

function drawOnLoad() {
	window.onload = drawTable();
}

// navbar button clicks
const openDatabaseBtn = document.getElementById("openDatabase");
openDatabaseBtn.onclick = openDataBaseBtnPress;
const searchDatabaseMenuBtn = document.getElementById("searchDatabase");
searchDatabaseMenuBtn.onclick = searchDatabaseBtnPress;
const deleteDataBtn = document.getElementById("deleteData");
deleteDataBtn.onclick = deleteDataBtnPress;
const editDatabaseBtn = document.getElementById("editDatabase");
editDatabaseBtn.onclick = editIdBtnPress;
const insertIntoDatabaseBtn = document.getElementById("insertIntoDatabase");
insertIntoDatabaseBtn.onclick = insertDataBtnPress; 

// buttons in the drop down menus
const searchDataBaseBtn = document.getElementById("searchDB");
searchDataBaseBtn.onclick = read;
const deleteDataBaseBtn = document.getElementById("deleteDB");
deleteDataBaseBtn.onclick = remove;
const editIdDataBaseBtn = document.getElementById("editIdDB");
editIdDataBaseBtn.onclick = editIdBtnAllPress;
const saveEditBoxBtn = document.getElementById("saveEditBox");
saveEditBoxBtn.onclick = editSaveBtnPress;
const cancelEditBoxBtn = document.getElementById("cancelEditBox");
cancelEditBoxBtn.onclick = showAllEditFields;
const insertBtnPress = document.getElementById("insertDB");
insertBtnPress.onclick = add;

// Show dropdownbox
function showDropDn(){
	document.getElementById("dropdownDeleteFields").style.display ="none";
	document.getElementById("dropdownFields").style.display = "block";
	document.getElementById("dropdownSearchFields").style.display = "none";
	document.getElementById("dropdownEditIdFields").style.display = "none";
}

function showDropDnSearch(){
	document.getElementById("dropdownDeleteFields").style.display ="none";
	document.getElementById("dropdownFields").style.display = "none";
	document.getElementById("dropdownSearchFields").style.display = "block";
	document.getElementById("dropdownEditIdFields").style.display = "none";
	
	
}

function showDropDnDelete(){
	document.getElementById("dropdownDeleteFields").style.display = "block";
	document.getElementById("dropdownFields").style.display = "none";
	document.getElementById("dropdownSearchFields").style.display = "none";
	document.getElementById("dropdownEditIdFields").style.display = "none";
}

function showEditId() {
	document.getElementById("dropdownDeleteFields").style.display ="none";
	document.getElementById("dropdownFields").style.display = "none";
	document.getElementById("dropdownSearchFields").style.display = "none";
	document.getElementById("dropdownEditIdFields").style.display = "block";
	
}

function showAllEditFields() {
	document.getElementById("dropdownFieldsEdit").classList.toggle("show");
}
// functions to run on button clicks
function openDataBaseBtnPress() {
	drawTable();
	document.getElementById("dropdownDeleteFields").style.display ="none";
	document.getElementById("dropdownFields").style.display = "none";
	document.getElementById("dropdownSearchFields").style.display = "none";
	document.getElementById("dropdownEditIdFields").style.display = "none";
}

function searchDatabaseBtnPress() {
	showDropDnSearch();
	clearTable();
	countSearch = 1;
}

function deleteDataBtnPress() {
	showDropDnDelete();
}

function editIdBtnPress() {
	showEditId();
}

function editIdBtnAllPress() {
	document.getElementById("dropdownEditIdFields").style.display = "none";
	readToHtml();
	showAllEditFields();
}

function editSaveBtnPress() {
	amend();
	showAllEditFields();
}

function insertDataBtnPress() {
	showDropDn();
}

// Clears the html table drawn
function clearTable(){
	// clears existing data
	var elmtTable = document.getElementById("tableData");
	var tableRows = elmtTable.getElementsByTagName("tr");
	var rowCount = tableRows.length;
		for (var x = rowCount - 1; x > 0; x--) {
		elmtTable.deleteRow(x);
		}	 	
}

