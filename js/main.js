/*
Benjamin Onken
VFW 1209
.js file for additem form
*/

//wait until dom is ready
window.addEventListener("DOMContentLoaded", function(){

	//getElementById function
	function $(x){
		var theElement = document.getElementById(x);
		return theElement;
	}
//create select field element and populate with options
	function diveLength(){
		var formTag = document.getElementsByTagName("form"); //formTag is an array of all the form tags
		var selectLi = $('select');
		var makeSelect = document.createElement('select');
			makeSelect.setAttribute("id", "groups");
			for(var i=0, j=lengthOfDive.length; i<j; i++){
				var makeOption = document.createElement('option');
				var optText = lengthOfDive[i];
				makeOption.setAttribute("value", optText);
				makeOption.innerHTML = optText;
				makeSelect.appendChild(makeOption);
			}
			selectLi.appendChild(makeSelect);
	}
	
	//Find value of selected radio button
	function getSelectedRadio(){
		var radio = document.forms[0].shoreOrBoat;
		for(var i=0; i<radio.length; i++){
			if(radio[i].checked){
			diveType = radio[i].value;
			}
		}
	}
    
    function toggleControls(n){
        switch(n){
            case "on":
                $('diveLog').style.display = "none";
                $('clear').style.display = "inline";
                $('history').style.display = "none";
                $('addNew').style.display = "inline";
                $('mybody').style.backgroundImage = "none";
                break;
            case "off":
                $('diveLog').style.display = "block";
                $('clear').style.display = "inline";
                $('history').style.display = "inline";
                $('addNew').style.display = "none";
                $('items').style.display = "none";
                break;
            default:
                return false;
        }
    }


	function storeData(key){
		//if there is no key, this means this is a brand new item and we need a new key.
		if(!key){
			var id = Math.floor(Math.random()*10000000001);
		}
		else{
		//Set the id to the existing key were editing so that it will save over the data.
		//The key is the same key thats been passed along from the editSubmit event handler
		//to the validate function, and then passed here, into the storeData function.
			id = key;
		}
		//Gather all our form field values and store in an object
		//Object properties contain array with the form label and input value
		getSelectedRadio();
		var item = {};
		
		item.date = ["Date:", $('date').value];
		item.locationOfDive = ["Location:", $('diveLocation').value];
		item.typeOfDive = ["Type of Dive:", diveType]; 
		item.depth = ["Depth:", $('depth').value];
		item.divesLength = ["Length:", $('groups').value];
		item.notes = ["Notes:", $('notes').value];
		//save data into local storage : use Stringify to convert our object to a string
		localStorage.setItem(id, JSON.stringify(item));
		alert("Dive Successfully Logged!");

	}

	function getData(){
		toggleControls("on");
		if(localStorage.length === 0){
			alert("There are no logs in storage. Default data was added.");
			autoFillData();
		}
		//write data from local storage to the browser
		var makeDiv = document.createElement('div');
		makeDiv.setAttribute("id", "items");
		var makeList = document.createElement('ul');
		makeDiv.appendChild(makeList);
		document.body.appendChild(makeDiv);
		$('items').style.display = "block";
		for(var i=0, len=localStorage.length; i<len; i++){
			var makeli = document.createElement('li');
			var linksLi = document.createElement('li');
			makeList.appendChild(makeli);
			var key = localStorage.key(i);
			var value = localStorage.getItem(key);
			//convert the string from local storage value back to an object by using JSON.parse()
			var obj = JSON.parse(value);
			var makeSubList = document.createElement('ul');
			makeli.appendChild(makeSubList);
			getImage(obj.divesLength[1], makeSubList);
			for(var n in obj){
				var makeSubli = document.createElement('li');
				makeSubList.appendChild(makeSubli);
				var optSubText = obj[n][0]+" "+obj[n][1];
				makeSubli.innerHTML = optSubText;
				makeSubList.appendChild(linksLi);
			}
			makeItemLinks(localStorage.key(i), linksLi);  //Create out edit and delete buttons/links for each item in local storage.
		}
	}

	//Get the image for the right catefory
	function getImage(catName, makeSubList)
	{
		var imageLi = document.createElement('li');
		makeSubList.appendChild(imageLi);
		var newImg = document.createElement('img');
		var setSrc = newImg.setAttribute("src", "css/images/"+ catName +".png");
		imageLi.appendChild(newImg);
	}

	//Auto Populate Local Storage
	function autoFillData(){
		//The actual JSON Object required for this to work is coming from our json.js file, which is loaded from our HTML page
		//Store the JSON Object into Local Storage
		for(var n in json){
			var id = Math.floor(Math.random()*10000000001);
			localStorage.setItem(id, JSON.stringify(json[n]));
		}
	}

	// Make item links function
	//create the edit and delete links for each stored item when displayed.
	function makeItemLinks(key, linksLi){
		//add edit single item link
		var editLink = document.createElement('a');
		editLink.href = "#";
		editLink.key = key;
		var editText = "Edit Log";
		editLink.addEventListener("click", editItem);
		editLink.innerHTML = editText;
		linksLi.appendChild(editLink);

		//add line break
		var breakTag = document.createElement('br');
		linksLi.appendChild(breakTag);

		//add delete single item link
		var deleteLink = document.createElement('a');
		deleteLink.href = "#";
		deleteLink.key = key;
		var deleteText = "Delete Log";
		deleteLink.addEventListener("click", deleteItem);
		deleteLink.innerHTML = deleteText;
		linksLi.appendChild(deleteLink);

	}

	function editItem(){
		//Grab the data from our item from Local Storage
		var value = localStorage.getItem(this.key);
		var item = JSON.parse(value);

		//show form
		toggleControls("off");

		//populate the form fields with current localstorage values
		$('date').value = item.date[1];
		$('diveLocation').value = item.locationOfDive[1];
		$('depth').value = item.depth[1];
		$('groups').value = item.divesLength[1];
		$('notes').value = item.notes[1];
		var radios = document.forms[0].shoreOrBoat;
		for(var i=0; i<radios.length; i++){
			if(radios[i].value == "Shore" && item.typeOfDive[1] == "Shore"){
				radios[i].setAttribute("checked", "checked");
			}
			else if(radios[i].value == "Boat" && item.typeOfDive[1] == "Boat"){
				radios[i].setAttribute("checked", "checked");
			}	
		}

		//remove the initial listener from the input 'save contact' button.
		save.removeEventListener("click", storeData);
		//Change Submit button value to edit button
		$('submit').value = "Edit Log";
		var editSubmit = $('submit');

		//save the key value established in this function as a property of the editSubmit event
		//so we can use that value when we save the data we edited.
		editSubmit.addEventListener("click", validate);
		editSubmit.key = this.key;

	}

	function deleteItem(){
		var ask = confirm("Are you sure you wish to delete this log?");
		if(ask){
			localStorage.removeItem(this.key);
			alert("Log was deleted!");
			window.location.reload();
		}
		else{
			alert("Log was not deleted");
		}

	}

	function clearLocal(){
		if(localStorage.length === 0){
			alert("There is no data to clear.");
		}
		else{
			localStorage.clear();
			alert("All dive logs have been deleted!");
			window.location.reload();
			return false;
		}
	}

	function validate(e){
		//define the elements we want to check 
		var getDate = $('date');
		var getLocation = $('diveLocation');
		var getLength = $('groups');

		//reset error messages
		errMsg.innerHTML = "";
		getLength.style.border = "1px solid black";
		getDate.style.border = "1px solid black";
		getLocation.style.border = "1px solid black";

		//get error messages
		var messageAry = [];
		//length of dive validation
		if(getLength.value === "--Length in Minutes of Dive--"){
			var lengthError = "Please select the length of the Dive.";
			getLength.style.border = "1px solid red";
			messageAry.push(lengthError);
		}

		//Date validation
		if(getDate.value === ""){
			var dateError = "Please enter a date";
			getDate.style.border = "1px solid red";
			messageAry.push(dateError);
		}

		//Location Validation
		if(getLocation.value === ""){
			var locationError = "Please enter a location";
			getLocation.style.border = "1px solid red";
			messageAry.push(locationError);
		}

		//if there were errors, display them on the screen.
		if(messageAry.length >= 1){
			for(var i=0, j=messageAry.length; i < j; i++){
				var txt = document.createElement('li');
				txt.innerHTML = messageAry[i];
				errMsg.appendChild(txt);
			}
		e.preventDefault();
		return false;
		}
		else{
			//if no errors, save data, send the key value(which came from the editData function).
			//remember this key value was passed through the editSubmit event listener as a porperty.
			storeData(this.key);
		}


	}

//Variable defaults
	var lengthOfDive = ["--Length in Minutes of Dive--", "10minutes", "20minutes", "30minutes", "40minutes", "50minutes", "60minutes"];
	diveLength();
	var diveType;
	var errMsg = $('errors');


//set link and submit click events

	var displayLink = $('history');
	displayLink.addEventListener("click", getData);
	
	var clearLink = $('clear');
	clearLink.addEventListener("click", clearLocal);
	
	var save = $('submit');
	save.addEventListener("click", validate);



});