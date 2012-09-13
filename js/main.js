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


	function storeData(){
		var id = Math.floor(Math.random()*10000000001);
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
			alert("There are no logs in storage.");
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
		//deleteLink.addEventListener("click", deleteItem);
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
		for(var i=0; i<radios.lenght; i++){
			if(radios[i].value == "shore" && item.shoreOrBoat[1] == "Shore"){
				radios[i].setAttribute("checked", "checked");
			}
			else if(radios[i].value == "boat" && item.shoreOrBoat[1] == "Boat"){
				radios[i].setAttribute("checked", "checked");
			}	
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

//Variable defaults
	var lengthOfDive = ["--Length in Minutes of Dive--", "10 minutes", "20 minutes", "30 minutes", "40 minutes", "50 minutes", "60 minutes"];
	diveLength();
	var diveType;


//set link and submit click events

	var displayLink = $('history');
	displayLink.addEventListener("click", getData);
	
	var clearLink = $('clear');
	clearLink.addEventListener("click", clearLocal);
	
	var save = $('submit');
	save.addEventListener("click", storeData);



});