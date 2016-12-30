var scene;
var myNodes = [];
var itemsInDrag = [];
var dragStartX,dragStartY;
var sceneDragX,sceneDragY;
var wireInCreation = null;
var cookie;
var loginData = {};

init();

function trim(s)
{
  return s.replace(/^\s+|\s+$/, '');
} 

function validateEmail(fld) {
    var error="";
    var tfld = trim(fld.value);                        // value of field with whitespace trimmed off
    var emailFilter = /^[^@]+@[^@.]+\.[^@]*\w\w$/ ;
    var illegalChars= /[\(\)\<\>\,\;\:\\\"\[\]]/ ;
    
    if (fld.value == "") {        
        error = "You didn't enter an email address.\n";
    } else if (!emailFilter.test(tfld)) {
        error = "Please enter a valid email address.\n";
    } else if (fld.value.match(illegalChars)) {        
        error = "The email address contains illegal characters.\n";
    }
	return error;
}
function signOut() {
	sign = document.getElementById('dropmenu-sign');
	sign.innerHTML = "Sign in";
	sign.onmousedown = function() {
		document.getElementById('signin-form').style.display = 'block';
	}						
	delete loginData.token;
	delete document.cookie.username;
	delete document.cookie.password;
}

function login(username,password) {
	request = new XMLHttpRequest();
	request.open("POST","login.php",false);
	var params = "username="+username+"&password="+password;
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.onreadystatechange = function() {
		if(request.readyState == 4 && request.status == 200) {			
			var res = JSON.parse(request.responseText);			
			if (res.token !== undefined && res.token !== '') {
				loginData.token = res.token;
				sign = document.getElementById('dropmenu-sign');
				sign.innerHTML = "Sign Out";
				sign.onmousedown = function() {
					signOut();
				}					
			}
		}
	}	
}

function validateSigninOnSubmit(form) {
	var msg = document.getElementById('signin-msg');
	var emailError = validateEmail(form['username']);
	if (emailError !== '')
	{
		msg.innerHTML = emailError;
		msg.style.visibility = 'visible';		
		return false;
	}	
	if (form['password'].value === '')
	{
		msg.innerHTML = 'Password cannot be empty.';
		msg.style.visibility = 'visible';
		return false
	}	
	request = new XMLHttpRequest();
	request.open("POST","login.php",false);
	var params = "username="+form['username'].value+"&password="+form['password'].value;
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.onreadystatechange = function() {
		if(request.readyState == 4 && request.status == 200) {			
			var res = JSON.parse(request.responseText);			
			if (res.token !== undefined && res.token !== '') {
				loginData.token = res.token;
				document.cookie.username = form['username'].value;
				document.cookie.password = form['password'].value;
				msg.innerHTML = 'Logged in!'
				sign = document.getElementById('dropmenu-sign');
				sign.innerHTML = "Sign Out";
				sign.onmousedown = function() {
					signOut();
				}					
				setTimeout( function() {
					form.style.display = 'none';					
				}, 2000);
			}
			else {
				msg.innerHTML = 'Login failed!';
			}
		}
		else {			
			msg.innerHTML = 'Login failed!';
		}
		msg.style.visibility = 'visible';
	}		
	request.send(params);	
	return false;
}

function validateSignupOnSubmit(form) {
	var msg = document.getElementById('signup-msg');	
	var emailError = validateEmail(form['username']);
	if (emailError !== '')
	{
		msg.innerHTML = emailError;
		msg.style.visibility = 'visible';		
		return false;
	}
	if (form['password'].value === '')
	{
		msg.innerHTML = 'Password cannot be empty.';
		msg.style.visibility = 'visible';
		return false
	}
	if (form['password'].value !== form['confirm'].value)
	{
		msg.innerHTML = 'Your password and confirmed password must be the same.';		
		msg.style.visibility = 'visible';
		return false;
	}	

	request = new XMLHttpRequest();
	request.open("POST","register.php",false);
	var params = "username="+form['username'].value+"&password="+form['password'].value;
	var sn = form['screenname'].value;
	if (sn !== undefined && sn !== '')
		params = params + "&sn=" + sn;
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.onreadystatechange = function() {
		if(request.readyState == 4 && request.status == 200) {			
			var res = JSON.parse(request.responseText);			
			if (res.state !== undefined && res.state === 'EverythingOk!') {
				msg.innerHTML = 'Registered!'
				sign = document.getElementById('dropmenu-sign');
				sign.innerHTML = "Sign in";
				sign.onmousedown = function() {
					document.getElementById('signin-form').style.display = 'block';						
				}					
				setTimeout( function() {
					form.style.display = 'none';
					document.getElementById('signin-form').style.display = 'block';
				}, 2000);
			}
			else {
				msg.innerHTML = 'Registration failed!';
			}
		}
		else {			
			msg.innerHTML = 'Registration failed!';
		}
		msg.style.visibility = 'visible';
	}		
	request.send(params);		
	return false;
}

function closeSignupOnReset(form) {
	var msg = document.getElementById('signup-msg');
	msg.innerHTML = '';
	msg.style.visibility = 'hidden';	
	document.getElementById('signup-form').style.display = 'none';	
}

function closeSigninOnReset(form) {
	var msg = document.getElementById('signin-msg');
	msg.innerHTML = '';
	msg.style.visibility = 'hidden';	
	document.getElementById('signin-form').style.display = 'none';	
}

function allowDropOnScene(e) 
{		
	e.preventDefault();
}

function init() {
	$(function() {
		$( "#sidebar" ).accordion({autoHeight: false});
	});	
	window.oncontextmenu = function() {
		return false;
	}
	window.onkeydown = keyPress;
	scene = document.getElementById('scene');
	scene.onmousedown = onSceneMouseDown;
	drawGrid();
	
	loginData.token = null;
	
	cookie = document.cookie;
	if (cookie.username !== undefined && cookie.username !== '' &&
		cookie.password !== undefined && cookie.password !== '')
		{
			login(cookie.username,cookie.password);
		}
	else
	{
		sign = document.getElementById('dropmenu-sign');
		sign.innerHTML = "Sign up";
		sign.onmousedown = function() {
			document.getElementById('signup-form').style.display = 'block';		
		}
	}
}

function drawGrid() {
	var grid = document.getElementById('grid');
	grid.width = scene.offsetWidth;
	grid.height = scene.offsetHeight;
	var context = grid.getContext('2d');
	context.clearRect(0,0,this.width,this.height);		
	
	for (var x = 0.5; x < grid.width; x += 40) {	  
	  context.moveTo(x, 0);
	  context.lineTo(x, grid.height);
	}

	for (var y = 0.5; y < grid.height; y += 40) {
	  context.moveTo(0, y);
	  context.lineTo(grid.width, y);
	}		
	
	context.strokeStyle = "#ddd";
	context.stroke();	
}

function keyPress(e) {
	var ch = String.fromCharCode(e.keyCode || e.charCode);
	if (ch === "A" || ch === "a")
	{
		var hasSelected = false;
		var hasNotSelected = false;
		for(var i=0; i<myNodes.length; i++)
			if (myNodes[i].isSelected)
				hasSelected = true;
			else
				hasNotSelected = true;
		var q;
		if (hasSelected && hasNotSelected)
			q = true;
		else if (hasSelected === true && !hasNotSelected)
			q = false;
		else if (!hasSelected && hasNotSelected)
			q = true;
		for(var i=0; i<myNodes.length; i++)
			myNodes[i].setSelected(q);
	}
	else if (ch === "x" || ch === "X")
	{
		var len = myNodes.length;		
		while (len--)
		{			
			if (myNodes[len].isSelected)
			{		
				for (var i=0;i<myNodes[len].outputs.length;i++)
				{
					var output = myNodes[len].outputs[i];
					for(var j=0;j<output.wires.length;j++)
					{
						var wire = output.wires[j];
						wire.inputTerminal.removeWire(wire);
						wire.outputTerminal.removeWire(wire);
						scene.removeChild(wire);	
						j--;						
					}
				}				
				for (var i=0;i<myNodes[len].inputs.length;i++)
				{
					var input = myNodes[len].inputs[i];
					for(var j=0;j<input.wires.length;j++)
					{
						var wire = input.wires[j];
						wire.inputTerminal.removeWire(wire);
						wire.outputTerminal.removeWire(wire);
						scene.removeChild(wire);				
						j--;
					}
				}
				
				scene.removeChild(myNodes[len].element);												
				myNodes.splice(len,1);				
			}			
		}		
	}
}

function dragItem(e) 
{
	e.dataTransfer.setData("Identifier",e.target.id);
}

function dropOnScene(e)
{	
	e.preventDefault();
	var x = e.clientX - scene.offsetLeft;
	var y = e.clientY - scene.offsetTop;
	var id = e.dataTransfer.getData("Identifier");
	if (id === 'sidebar-not')
		createNOTLogicGate(x,y);
	else if (id === 'sidebar-nand')	
		createNANDLogicGate(x,y);
    else if (id === 'sidebar-and')			
		createANDLogicGate(x,y);
	else if (id === 'sidebar-or')	
		createORLogicGate(x,y);
	else if (id === 'sidebar-nor')	
		createNORLogicGate(x,y);
	else if (id === 'sidebar-xor')	
		createXORLogicGate(x,y);
	else if (id === 'sidebar-xnor')	
		createXNORLogicGate(x,y);
	else if (id === 'sidebar-buffer')	
		createBufferLogicGate(x,y);
	else if (id === 'sidebar-d-flip-flop')		
		createDFlipFlop(x,y);
	else if (id === 'sidebar-t-flip-flop')			
		createTFlipFlop(x,y);
	else if (id === 'sidebar-jk-flip-flop')			
		createJKFlipFlop(x,y);
	else if (id === 'sidebar-clock')			
		createClock(x,y);
	else if (id === 'sidebar-gated-d-latch')			
		createGatedDLatch(x,y);
	else if (id === 'sidebar-1-bit-full-adder')			
		createSingleBitFullAdder(x,y);
	else if (id === 'sidebar-2-to-1-multiplexer')
		create2To1Multiplexer(x,y);
	else if (id === 'sidebar-sawtooth-generator')
		createSawtoothGenerator(x,y);
	else if (id === 'sidebar-probe')
		createProbe(x,y);
	else if (id === 'sidebar-pushbutton')
		createPushbutton(x,y);
	else if (id === 'sidebar-toggleswitch')
		createToggleSwitch(x,y);
	else if (id === 'sidebar-motiondetector')
		createMotionDetector(x,y);
}	

function alignNodes(sel) {
	var top = scene.offsetHeight;
	var bottom = 0;
	var left = scene.offsetWidth;
	var right = 0;
	for(var n = 0; n < myNodes.length; n++)
	{
		var no = myNodes[n];
		if (no.isSelected)
		{
			top = Math.min(top,no.element.offsetTop);
			bottom = Math.max(bottom,no.element.offsetTop + no.element.offsetHeight);
			left = Math.min(left,no.element.offsetLeft);
			right = Math.min(right,no.element.offsetLeft + no.element.offsetWidth);		
		}
	}	
	if (sel === 0)
		for(var n = 0; n < myNodes.length; n++)
		{
			var no = myNodes[n];
			if (no.isSelected)
				no.setY(top);
		}
	else if (sel === 1)
		for(var n = 0; n < myNodes.length; n++)
		{
			var no = myNodes[n];
			if (no.isSelected)
				no.setY(bottom-no.element.offsetHeight);
		}
	else if (sel === 2)
		for(var n = 0; n < myNodes.length; n++)
		{
			var no = myNodes[n];
			if (no.isSelected)
				no.setX(left);
		}	
	else if (sel === 3)
		for(var n = 0; n < myNodes.length; n++)
		{
			var no = myNodes[n];
			if (no.isSelected)
				no.setX(right-no.element.offsetWidth);
		}
	for(var n = 0; n < myNodes.length; n++)
	{
		var no = myNodes[n];
		if (no.isSelected)
			updateWirePositions(no);
	}
}

function selectNodes() {
	for(var n = 0; n < myNodes.length; n++)
		myNodes[n].setSelected(true);
}

function deselectNodes() {
	for(var n = 0; n < myNodes.length; n++)
		myNodes[n].setSelected(false);
}

function invsersSelectionNodes() {
	for(var n = 0; n < myNodes.length; n++)
		myNodes[n].setSelected(!myNodes[n].isSelected);
}

function showDropDown(str) {
	hideDropDown('file');
	hideDropDown('edit');
	var dropmenu = document.getElementById("dropmenu-"+str);
	if (dropmenu)
		dropmenu.style.display = "block";
}

function hideDropDown(str) {
	document.getElementById("dropmenu-"+str).style.display = "none";
}

function updateWirePositions(node_) {
	var outputs = node_.outputs;
	for (var i=0; i<outputs.length; i++)
		for (var j=0; j<outputs[i].wires.length; j++)
			outputs[i].wires[j].updatePos();
	var inputs = node_.inputs;
	for (var i=0; i<inputs.length; i++)
		for (var j=0; j<inputs[i].wires.length; j++)				
			inputs[i].wires[j].updatePos();
}

function onNodeMouseMove(e) {
	console.log('onNodeMouseMove');
	e.preventDefault();
	e.stopPropagation();
	if (itemsInDrag.length>0) {
		var currentX = e.clientX;
		var currentY = e.clientY;		
		for (var k=0;k<itemsInDrag.length;k++) {
			var item = itemsInDrag[k];
			item.moveBy(currentX-dragStartX,currentY-dragStartY);			
			updateWirePositions(item);
		}
		dragStartX = currentX;
		dragStartY = currentY;
	}
}

function onSceneMouseMove(e) {
	console.log('onSceneMouseMove');
	var dX = e.clientX - sceneDragX;
	var dY = e.clientY - sceneDragY;
	for (var k = 0; k< myNodes.length;k++) {
		var item = myNodes[k];
		item.moveBy(dX,dY);
		updateWirePositions(item);
	}
	sceneDragX = e.clientX;
	sceneDragY = e.clientY;
}

function onSceneMouseDown(e) {	
	console.log('onSceneMouseDown');
	//e.preventDefault();		// To prevent browser from selecting (blue) nodes
	hideDropDown('file');
	hideDropDown('edit');
	if (myNodes.length>0)
	{
		sceneDragX = e.clientX;
		sceneDragY = e.clientY;
		window.onmousemove = onSceneMouseMove;
		window.onmouseup = onMouseUp;
		scene.style.cursor = 'move';	
	}
}

function onMouseUp(e) {
	console.log('onMouseUp');
	itemsInDrag.length = 0;
	window.onmousemove = null;
	window.onmouseup = null;	
	scene.style.cursor = 'default';	
	if (wireInCreation)
	{		
		scene.removeChild(wireInCreation);
		if (wireInCreation.outputTerminalu)
			wireInCreation.outputTerminal.removeWire(wireInCreation);
		if (wireInCreation.inputTerminal)
			wireInCreation.inputTerminal.removeWire(wireInCreation);
		wireInCreation = null;
		console.log('Wire deleted!');
	}
}

function onNodeMouseDown(e) {
	console.log('onNodeMouseDown');
	e.preventDefault();
	e.stopPropagation();
	e.cancelBubble = true;
	
	if (e.shiftKey)
	{
		if (!this.parentContainer.isActivated)
			this.parentContainer.setSelected(!this.parentContainer.isSelected);	
	}
	else
	{
		if (e.button === 0)
		{
			//if (!this.parentContainer.isSelected)
				for(var i = 0; i<myNodes.length; i++)
					myNodes[i].setSelected(false);			
			this.parentContainer.setSelected(true);			
		}
	}

	itemsInDrag.length = 0;
	for(var i = 0; i<myNodes.length; i++)
		if (myNodes[i].isSelected)
			itemsInDrag.push(myNodes[i]);
	dragStartX = e.clientX;
	dragStartY = e.clientY;	
	window.onmousemove = onNodeMouseMove;
	window.onmouseup = onMouseUp;	
}

function onWireCreationMouseMove(e) {
	console.log('onWireCreationMouseMove');
	e.preventDefault();
	e.stopPropagation();
	if (wireInCreation)
		wireInCreation.setP2(e.clientX,e.clientY);				
}


//------------------------------------------------------- Input Terminal
function onInputTerminalDown(e) {
	console.log('onInputTerminalDown');
	e.preventDefault();
	e.stopPropagation();
	if (this.terminal().wires.length>0)
	{
		wireInCreation = this.terminal().wires[0];		
		wireInCreation.outputTerminal.removeWire(wireInCreation);
		wireInCreation.setOutputTerminal(null);
		window.onmousemove = onWireCreationMouseMove;
		window.onmouseup = onMouseUp;						
	}
	else
	{
		var current = this.value;
		if (current === null)
			this.setValue(false);
		else		
			this.setValue(!current);	
	}
		
}

function onInputTerminalUp(e) {
	console.log('onInputTerminalUp');	
	e.preventDefault();
	e.stopPropagation();	
	if (wireInCreation)
	{
		if (this.terminal().wires.length === 0)
		{										
			wireInCreation.setOutputTerminal(this);
			wireInCreation.inputTerminal.addWire(wireInCreation);
			wireInCreation.outputTerminal.addWire(wireInCreation);
			this.setValue(wireInCreation.inputTerminal.value);
			wireInCreation = null;
			window.onmousemove = null;
		}
		else {
			wireInCreation.outputTerminal.removeWire(wireInCreation);
			wireInCreation.inputTerminal.removeWire(wireInCreation);
			scene.removeChild(wireInCreation);
			wireInCreation = null;
		}
	}
}

//-------------------------------------------------- Output Terminal
function onOutputTerminalDown(e) {
	console.log('onOutputTerminalDown');
	e.preventDefault();
	e.stopPropagation();
	var pos = getPos(this);
	wireInCreation = wire();
	scene.appendChild(wireInCreation);
	wireInCreation.setInputTerminal(this);
	window.onmousemove = onWireCreationMouseMove;
	window.onmouseup = onMouseUp;
}

function onOutputTerminalUp(e) {	
	console.log('onOutputTerminalUp');
	if (wireInCreation)
	{		
		scene.removeChild(wireInCreation);
		wireInCreation.inputTerminal.removeWire(wireInCreation);
		window.onmousemove = null;
		wireInCreation = null;
	}
}
