//addresses for local testing and testing on the server.
//var requestAddr = "http://52.34.125.250:3000/"; 
var requestAddr = "https://ancient-shelf-87214.herokuapp.com/";
//var requestAddr = "http://flip1.engr.oregonstate.edu:55454/"; 

//state of the app
//credentials save here, data model save here
//login.pass:pass, login.name:name, model:model
var userState = {
login:{name:null, pass:null}	
};

//on boot. Display immutable modal with login fields.
function onPageLoadLogin(){
	//make backdrop immutable and display modal
	$('#alertLogin').hide();
	$('#myModal').modal({backdrop:'static'});
	$('#myModal').modal('show');
	
	$('#modalSubmit').on('click', function(event){
		//get info from fields and submit it for processing
		var req = new XMLHttpRequest();
		var payload = {};
		//get stuff from the form and add it to the POST.
		console.log("userState:");
		console.log(userState);
		console.log("----------------");
		userState.login.name = $('#loginName').val();
		payload.username = userState.login.name;
		
		userState.login.pass = $('#loginPass').val();
		payload.password = userState.login.pass;
		//console.log($('#loginName').val());
		
		//req.open('POST', requestAddr + 'login', true);
		req.open('POST', 'https://web.engr.oregonstate.edu/~aluyorg/auth.php' , true);
		req.setRequestHeader('Content-Type', 'application/json'); // text/plain application/json
		req.addEventListener('load',function(){
			 if(req.status >= 200 && req.status < 400){
				 console.log(req.response);
				 var response = JSON.parse(req.response);
				 console.log("DB server response:");
				 console.log(response);
				 
				 //if success
				 if(response.login){
					$('#myModal').modal('hide');
					getQuestions();
				 } else {
					 $('#alertLogin').show();
				 };
		} else {
			 console.log("Error in network request: " + request.statusText);
		}
		});
		req.send(JSON.stringify(payload));
		
		
		
		//if failure
		
	})
}

onPageLoadLogin();

//save the new data.
//should prolly validate here too.
$('#btnSubmitQuestions').on('click', function(event){
	console.log('submit clicked:');
	
	$('.inpt').each(function(){
		console.log(this);
		var inptHandle = this;
		var nameClean = this.id.replace("inpt", "");
		//console.log(this.type);
		if(this.type == "checkbox"){
			console.log("we in checkbox:");
			console.log($(this).prop('checked'));
			userState.model.forEach(function(question){
				if(question.name == nameClean){
					question.answer = $(inptHandle).prop('checked');
					console.log("pong!");
				}
			});
			
		}else{
			console.log($(this).val());
			userState.model.forEach(function(question){
				if(question.name == nameClean){
					question.answer = $(inptHandle).val();
					console.log("ping!");
				}
			});
		}	
		
	});
	
	console.log("done writing");
	console.log(userState.model);
	
	var req = new XMLHttpRequest();
	var payload = {};
	//get stuff from the form and add it to the POST.
	payload.username = "k4";
	payload.password = "123";
	payload.email = "k4@123.com"
	
	//req.open('POST', requestAddr + 'getQuestions', true);
	//req.open('POST', "https://ml-health-app-stage.herokuapp.com/api/login", true);
	req.open('POST', "https://web.engr.oregonstate.edu/~aluyorg/registeruser.php", true);
	req.setRequestHeader('Content-Type', 'application/json'); //application/json application/x-www-form-urlencoded
	req.addEventListener('load',function(){
		 if(req.status >= 200 && req.status < 400){
			 var response = JSON.parse(req.response);
			 console.log(response);
			 //return response;
			 
		} else {
			 console.log("Error in network request: " + req.statusText);
		}
	});
	req.send(JSON.stringify(payload));
	//console.log("sent: " + payload);
	
	//event.preventDefault();

	
});


//on click, send a request to the ML server for data
$('#tab_Correlation_btn').on('click', function(){
	var req = new XMLHttpRequest();
	var payload = {};
	//get stuff from the form and add it to the POST.
	payload.user = "123";
	payload.password = "";
	
	req.open('POST', requestAddr + 'getMLResults', true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load',function(){
		 if(req.status >= 200 && req.status < 400){
			 var response = JSON.parse(req.response);
			 console.log("ML Response:");
			 console.log(response);
			 //doo graph voodoo here
			 
			 //buildQuestionUI(response);
			 //return response;
			 
		} else {
			 console.log("Error in network request: " + req.statusText);
		}
	});
	req.send(JSON.stringify(payload));
	//console.log("sent: " + payload);
	
	//event.preventDefault();
	
	
	//draw graph.
	var data = [4, 8, 15, 16, 23, 42, 13, 22, 17, 24, 11];

var height = 200,
    barWidth = 40;

var x = d3.scale.linear()
    .domain([0, d3.max(data)])
    .range([0, height]);

var chart = d3.select(".chart")
    .attr("height", height)
    .attr("width", barWidth * data.length);

var bar = chart.selectAll("g")
    .data(data)
  .enter().append("g")
    .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

bar.append("rect")
    .attr("height", x)
    .attr("width", barWidth - 1);

bar.append("text")
    .attr("x", function(d) { return x(d) - 3; })
    .attr("y", barWidth / 2)
    .attr("dx", ".35em")
    .text(function(d) { return d; });
	
});


// when tab is opened, render the state of the questionnaire
$('#tab_NewModel_btn').on('click', function(){
	buildQuestionUI(userState.model, '#newModelRender');
	
});


$('#npAdd').on('click', function(){
	var newProblem = {};
	
	newProblem.name = $('#npName').val();
	newProblem.type = $('#npType').val();
	newProblem.question = $('#npQuestion').val();
	newProblem.problem = $('#npProblem').prop('checked');
	
	console.log(newProblem);
	
	userState.model.push(newProblem);
	
	buildQuestionUI(userState.model, '#newModelRender');
});

$('#npReset').on('click', function(){
	userState.model = [];
	console.log(userState);
	buildQuestionUI(userState.model, '#newModelRender');
});
////////////////////////////ADD/////////////////////////////////////
/*document.getElementById('input-machine-btn').addEventListener('click', function(event){
	var req = new XMLHttpRequest();
	req.open('GET', requestAddr + 'mGetTable', true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load',function(){
		 if(req.status >= 200 && req.status < 400){
			var response = JSON.parse(req.response);
			 console.log(response);
			var list = document.getElementById("input-machine-dd");
			//clean old table
			while(list.firstChild){
				list.removeChild(list.firstChild);
			}
			for (var row = 0; row < response.length; row++){ 
				
				var opt = response[row]['mName'];  
				var li = document.createElement("li");
				var link = document.createElement("a");             
				var text = document.createTextNode(opt);
				link.appendChild(text);
				link.href = "#";
				li.appendChild(link);
				list.appendChild(li);
			}
			 
			 
	} else {
		 console.log("Error in network request: " + request.statusText);
	}
	});
	req.send(null);


		
		event.preventDefault();
});*/

function getQuestions() {
		var req = new XMLHttpRequest();
		var payload = {};
		//get stuff from the form and add it to the POST.
		payload.username = userState.login.name;
		payload.password = userState.login.pass;
		
		//req.open('POST', requestAddr + 'getQuestions', true);
		//req.open('POST', "https://ml-health-app-stage.herokuapp.com/api/login", true);
		req.open('POST', "https://web.engr.oregonstate.edu/~aluyorg/userquestions.php", true);
		req.setRequestHeader('Content-Type', 'application/json');
		req.addEventListener('load',function(){
			 if(req.status >= 200 && req.status < 400){
				 var response = JSON.parse(req.response);
				 console.log(response);
				 userState.model = response;
				 buildQuestionUI(response, '#questionContainer');
				 //return response;
				 
			} else {
				 console.log("Error in network request: " + req.statusText);
			}
		});
		req.send(JSON.stringify(payload));
		//console.log("sent: " + payload);
		
		//event.preventDefault();
}
	
function buildQuestionUI(sampleEntry, buildTarget){
	//we are storing the questions in objects. Take those objects, cycle through them,
	//and append the question fields to the UI.
	//var sampleEntry;
	//send request to get the question object.
	
	
	
	//console.log(getQuestions());
	
	/*[{ name: "insomnia", type: "boolean", problem: true, question: "Did you experience	insomnia?", answer: null, additional:
	{ name: "insomnia-severity", type: "rating", problem: true, question: "How severe was the insomnia?", answer: null, additional: null }},
	{ name: "go-to-bed", type: "amount", problem: false, question: "When did you go to bed?", answer: null, additional: null }];
	*/
	
	
	//console.log($(buildTarget));
	$(buildTarget).empty();
	//console.log($(buildTarget));
	
	//cycle through the array of question objects and render each one
	sampleEntry.forEach(function(entry){

		$(buildTarget).append(buildUIEntry(entry));
	})
	
}

//takes an object and generates all the fields that can then be attached to the DOM.
function buildUIEntry(questionObject){
	var builtQuestion = document.createElement("div");
	var builtQuestionInput = document.createElement("div");
	builtQuestionInput.className = "input-group";
	
	var newQuestionHeader = document.createElement("h4");
	newQuestionHeader.textContent = questionObject.name;
	
	var newQuestionText = document.createElement("p");
	newQuestionText.textContent = questionObject.question;
	
	var newQuestionDesc = document.createElement("span");
	newQuestionDesc.className = "input-group-addon";
	newQuestionDesc.textContent = questionObject.name;
	
	var newQuestionInput = document.createElement("input");
	newQuestionInput.className = "form-control inpt";
	newQuestionInput.id = "inpt" + questionObject.name;
	
	//customize input based on the type of question
	switch(questionObject.type){
		case 'text':
			newQuestionInput.type = "text";
			newQuestionInput.value = "0";
			break;
		case 'amount':
			newQuestionInput.type = "number";
				newQuestionInput.value = "0";
			break;
		case 'boolean':
			newQuestionInput.type = "checkbox";
			break;
		case 'rating':
			newQuestionInput.type = "range";
			break;
		default:
			newQuestionInput.type = "text";
	}
	
	//compile pieces together
	builtQuestion.append(builtQuestionInput);
	builtQuestionInput.append(newQuestionInput);
	builtQuestionInput.insertBefore(newQuestionDesc, newQuestionInput);
	
	builtQuestion.insertBefore(newQuestionHeader, builtQuestionInput);
	builtQuestion.insertBefore(newQuestionText, builtQuestionInput);
	
	
	return builtQuestion;
	
}


//shit. dynamically built Dropdowns are a fucking nightmare.
function buildBoolDrop(questionObject){
	var builtDrop = document.createElement("div");
	builtDrop.className = "dropdown";
	
	var newDropButton = document.createElement("button");
	newDropButton.className = "btn btn-default dropdown-toggle"
	
	var newList = document.createElement("ul");
	newList.className = "dropdown-menu";
	
	var newListItem1 = document.createElement("li");
	var newListLink1 = document.createElement("a");
	newListLink1.href = "#";
	newListLink1.value = "Yes";
	newListLink1.className = questionObject.name;
	
	var newListItem2 = document.createElement("li");
	var newListLink2 = document.createElement("a");
	newListLink2.href = "#";
	newListLink2.value = "No";
	newListLink2.className = questionObject.name;
	
	//compile all the parts together
	newListItem1.append(newListLink1);
	newListItem1.append(newListLink2);
	newList.append(newListItem1);
	newList.append(newListItem2);
	
	builtDrop.append(newDropButton);
	builtDrop.append(newList);
	
	return builtDrop;	
}

function buildRateDrop(){
	
}


