	"use strict";
		
		//id used to keep track of how many select tags are on screen
		var id = 0;
		//data sets
		var myJSON;
		var currentObj;
		var ie = false;
		var ie8Below = false;
		
		//calls when body element loads
		function init(){
			//first check the browser
			testBrowser();
			//sets the storage data into the correct fields
			populateFields();
			//load data loads the json file, then creates the first tag
			loadData();
		}
		
		//function to test which broswer is being used
		function testBrowser(){
			//redirects user if browser is older than ie7
			if(!document.getElementById){
				window.location="oldBrowser.html";
			}
			if(document.attachEvent){
				ie = true;
				console.log("You're in IE")
			}
			//tells if the user if the browser is IE
			if(document.attachEvent && !window.addEventListener){
				console.log("You're in IE8 or Below");
				ie8Below = true;
			}
		}
		
		//grabs storage and inputs the data into the form fields
		function populateFields(){
			//check if ie
			if(ie){
				//if it's their first time and there are no set cookies
				if(GetCookie('first') === null){
					return;
				}else{
					//grabs the cookies and places them in the correlating text fields
					document.getElementsByName('first')[0].value = GetCookie("first");
					document.getElementsByName('last')[0].value = GetCookie("last");
					document.getElementsByName('email')[0].value = GetCookie("email");
				}
			}else{//if not ie
				//grabs the local storage and places them in correlating text fields
				document.getElementsByName('first')[0].value = window.localStorage.getItem("first");
				document.getElementsByName('last')[0].value = window.localStorage.getItem("last");
				document.getElementsByName('email')[0].value = window.localStorage.getItem("email");
			}
		}
		
		/*onchange function for all select tags
		 @param that - the dom element of selected tag
		*/
		function doSelectTag(that){
			//if it's ie7, 'that' is not a dom element but an event
			if(ie7){
				//assign 'that' to be the events source
				that = that || event;
				that = that.target || that.srcElement;
			}
			//method used to find the correct object in the JSON
			findObjectWithChild(myJSON,that.value);
			//loop through all the children in the JSON object
			//to check if they have the selected value.
			for(var i = 0; i < currentObj.children.length; i++){
				//make sure there are children
				if(currentObj.children[i] === undefined){
					continue;
				}
				//When the correct JSON object correlates with the dom value
				if(currentObj.children[i].text === that.value){
					//make the current object the objects child
					currentObj = currentObj.children[i];
					//method to remove select tags and images
					removeSelectTags(that);
					//method used to remove the title
					removeTitle();
					//if the child has an image source then make an image
					if(currentObj.imgSrc !== undefined){doImages(currentObj);}
					//if the new object has children, make another select tag
					if(currentObj.children.length > 0){createSelectTag(currentObj);}
					//if there are no more select options to make, print the title
					else if(currentObj.children.length == 0 && currentObj.imgSrc !== undefined){
						createTitle();
					}
				}
			}
		}
		
		/*removes select tags and images
		 @param that - the dom element recently changed select tag
		*/
		function removeSelectTags(that){
			//make sure there is a dom element after 'that' dome element
			if(that.nextSibling != null){
				//loop through recursively 
				removeSelectTags(that.nextSibling);
				//remove the next element
				$('selectors').removeChild(that.nextSibling);
				//remove the last image
				$('imageContainer').removeChild($('imageContainer').lastChild);
				id--;
			}
			//removes the image of the corresponding select tag the user just changed
			if($('imageContainer').childNodes.length > 0 && $('imageContainer').childNodes[id]){
				$('imageContainer').removeChild($('imageContainer').childNodes[id]);
			}

		}
		
		/*Dynamically creates select tag
		 @param obj - the JSON object that holds the select tags data
		*/
		function createSelectTag(obj){
			currentObj = obj;
			//increase the id to keep track of number of select tags
			id++;
			//the select attribute
			var selectEle = document.createElement('select');
			//ie7's way of adding onchange
			if(ie7){
				selectEle.attachEvent('onchange',doSelectTag);
				selectEle.setAttribute('id',"select"+id);
			}
			//for all other browsers
			else{
				selectEle.setAttribute('onchange','doSelectTag(this);'); //doesn't work in ie7 (use addEventListener)
				selectEle.setAttribute('id',"select"+id);
			}
			
			//loop through and set the options
			for(var i = 0; i < currentObj.children.length; i++){
				//make sure there is a child of the JSON object
				if(currentObj.children[i] !== undefined){
					//create the option and assign it to the select tag
					var optionEle = createOption(currentObj.children[i].text);
					selectEle.appendChild(optionEle);
				}
			}
			//assign the select tag to the end of div
			$('selectors').appendChild(selectEle);
		}
		
		/*Creates an option tag for a select tag
		 @param value - the value of the select option
		 @return - returns option dom element
		*/
		function createOption(value){
			var optionEle1 = document.createElement('option');
			optionEle1.setAttribute('value',value)
			optionEle1.appendChild(document.createTextNode(value));
			return optionEle1;
		}
		
		//function handles writing text to screen
		function createTitle(){
			//creates the title element
			var h1Ele = document.createElement('h1');
			h1Ele.appendChild(document.createTextNode(currentObj.title));
			h1Ele.style.textAlign = 'center';
			h1Ele.style.opacity = '0.0';
			//sets it to correlated div
			$('textContainer').appendChild(h1Ele);
			
			//creates the subtext element
			var h3Ele = document.createElement('h3');
			h3Ele.appendChild(document.createTextNode("Like your choice? Fill out the form bellow to apply for your new house!"));
			h3Ele.style.opacity = '0.0';
			$('textContainer').appendChild(h3Ele);
			
			//method to make the element fade in
			printTitle(h1Ele);
			printTitle(h3Ele);
		}
		
		/*onchange function for all select tags
		 @param dom - a dom element
		*/
		function printTitle(dom){
			//increases dom's opacity until it is '1'
			if(dom.style.opacity < 1){
				dom.style.opacity = parseFloat(dom.style.opacity) + 0.01 + "";
				setTimeout(function(){printTitle(dom);},1);
			}
		}
		
		//removes the titles
		function removeTitle(){
			//allows for putting as many elements into the 'textContainer' div
			//without worrying how many to remove
			if($('textContainer').childNodes.length > 0){
				var num = $('textContainer').childNodes.length;
				for(var i = 0; i < num; i++){
					$('textContainer').removeChild($('textContainer').lastChild);
				}
			}
		}
		
		/*Dynamically creates select tag
		 @param obj - the JSON object that holds the image tags data
		*/
		function doImages(obj){
			//create image element
			var imageEle = document.createElement('img');
			imageEle.setAttribute('src',obj.imgSrc);
			imageEle.setAttribute('width',obj.width);
			imageEle.setAttribute('height',obj.height);
			imageEle.setAttribute('name','images');
			imageEle.setAttribute('alt','IMAGE');
			//style it to be offset to the right
			//and to be invisible
			imageEle.style.right = obj.right;
			imageEle.style.top = obj.top;
			imageEle.style.opacity = "0.0";
			imageEle.style.position = 'absolute';
			//append the element
			$('imageContainer').appendChild(imageEle);
			//slides and increases the opacity of the image element
			slide(imageEle,parseInt(obj.slideStop));
		}
		
		/*Dynamically creates select tag
		 @param dom - dom element of image tag to change style
		 @param num - the distance the element slides to
		*/
		function slide(dom,num){
			//if the dom element slides to place, change its style attributes
			if(parseInt(dom.style.right) >= num){
				resetAttributes(dom);
			}
			//make the dom element slide from the right and increase opacity
			if(parseInt(dom.style.right) < num){
				dom.style.right=parseInt(dom.style.right) + 3 + "px";
				dom.style.opacity = parseFloat(dom.style.opacity) + 0.01 + "";
				setTimeout(function(){slide(dom,num);},1);//use a function wrapper
			}
		}
		
		function resetAttributes(dom){
			dom.style.position = 'relative';
			dom.style.top = "0px";
			dom.style.left = "0px";
			dom.style.right = "0px";
			dom.style.opacity = '1';
			dom.style.float = 'left';
		}
		
		function findObjectWithChild(obj,value){
			if(obj.children !== undefined && obj !== undefined){
				for(var i = 0; i < obj.children.length; i++){
					if(obj.children[i] === undefined){
						break;
					}
					if(obj.children[i].text === value){
						currentObj = obj;
						return;
					}else{
						findObjectWithChild(obj.children[i],value);
					}//end of else
				}//end of for
			}//end of if
		}
		
		//utilities
		function $(id){
			return document.getElementById(id);
		}
	
		function $$(tag,index){
			return document.getElementsByTagName(tag)[index];
		}
		
		function loadData(){
			var xhr;
			if (window.XMLHttpRequest) {
				try {
					xhr = new XMLHttpRequest();
				} catch (ex) {
					xhr = new window.ActiveXObject("Microsoft.XMLHTTP");
				}
			}
			var url = "elements.json";
			xhr.open('GET',url,true);
			// try to prevent browser caching by sending a header to the server
			xhr.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2010 00:00:00 GMT");
			if(ie8Below){
				xhr.onreadystatechange = function () { //Call a function when the state changes.
					if (xhr.readyState == 4 && xhr.status == 200) {
						myJSON = eval('(' + xhr.responseText + ')');
						saveGlobalJSON(myJSON);
						createSelectTag(myJSON);
					}
				}
			}else{
				xhr.onload = function(){
				// JSON.parse() converts a string to JSON.
 				// myJSON = JSON.parse( xhr.responseText );
 				
 				myJSON = eval('(' + xhr.responseText + ')');

 				saveGlobalJSON(myJSON);
 				
 				createSelectTag(myJSON);

				}
			}
			xhr.send();
		}
		
		function saveGlobalJSON(obj){
			myJSON = obj;
		}
		
		function validateForm(form){
			console.log("validate");
			var first = form["first"].value;
			var last = form["last"].value;
			var email = form["email"].value;
			var error= false;
			if(first == null || first == "" || 
				last == null || last == ""){
				$('nameText').style.color = "#ff0000";
				error = true;
			}
			if(email == null || email == ""){
				$('emailText').style.color = "#ff0000";
				error = true;
			}
			if(error){
				return false;
			}else{
				if(ie){
					SetCookie('first',first);
					SetCookie('last',last);
					SetCookie('email',email);
				}else{
					window.localStorage.setItem("first",first);
					window.localStorage.setItem("last",last);
					window.localStorage.setItem("email",email);
				}
			}
		}