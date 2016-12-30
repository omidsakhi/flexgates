function getPos(ele){
    var x=0;
    var y=0;
    while(true){
        x += ele.offsetLeft;
        y += ele.offsetTop;
        if(ele.offsetParent === null){
            break;
        }
        ele = ele.offsetParent;
    }
    return [x, y];
}

function TERMINAL(x,y,defaultValue,dir,cb) {
	var terminal = this;
	this.value = defaultValue;
	this.wires = [];	
	this.element = document.createElement('div');	
	this.element.className = dir;		
	this.element.style.top = y;
	this.element.style.left = x;	
	this.element.terminal = function() {
		return terminal;
	}
	this.element.addWire = function(wire) {
		terminal.wires[terminal.wires.length] = wire;
	}
	this.element.removeWire = function(wire) {
		var i = terminal.wires.indexOf(wire);
		if (i !== -1)		
			terminal.wires.splice(i,1);
	}
	this.element.wires = function() {
		return terminal.wires;
	}
	this.setValue = function(val) {
		terminal.element.setValue(val);
	}
	this.element.setValue = function(val) {			
		if (this.value === val)
			return;			
		this.value = val;
		terminal.value = val;
		if (typeof(val) === 'undefined' || val === null)
		{
			this.style.background = 'radial-gradient(circle,rgb(250,214,67),rgb(237,143,8))';		
		}
		else if (typeof(val) === 'boolean')
		{
			if (val)				
				this.style.background = 'radial-gradient(circle,rgb(250,110,67),rgb(237,22,8))';				
			else				
				this.style.background = 'radial-gradient(circle,rgb(199,250,68),rgb(113,237,8))';								
		}
		else if (typeof(val) === 'number')
		{
			this.style.background = 'radial-gradient(circle,rgb(250,214,67),rgb(237,143,8))';
		}
		for (var i=0;i<terminal.wires.length;i++)
			terminal.wires[i].setValue(val);
		if (terminal.callBack)
			terminal.callBack(val);
	}	
	this.element.setValue(defaultValue);
	if (cb)
		this.callBack = cb
}

function NODE(tag) {	

	this.element = document.createElement('div');
	this.element.className = 'node';		
	this.element.onmousedown = onNodeMouseDown;	
	this.element.parentContainer = this;
	this.outputs = [];
	this.inputs = [];	
	this.isSelected = false;
	
	if (tag)
	{
		this.titleElem = document.createElement('div');
		this.titleElem.className = 'node-title';
		this.titleElem.innerHTML = tag;
		this.element.appendChild(this.titleElem);
	}
}

NODE.prototype.setBackgroundImage = function(x,y,w,h,imageURL) {
	this.element.style.backgroundImage = "url("+imageURL+")";	
	this.element.style.backgroundSize = w.toString()+'px '+h.toString()+'px';
	this.element.style.backgroundPosition = x.toString()+'px '+y.toString()+'px';
}
NODE.prototype.addInputTerminal = function (x,y,defaultValue,dir,cb) {
	dir = dir || 'terminal-left';
	var terminal = new TERMINAL(x,y,defaultValue,dir,cb);
	terminal.element.onmousedown = onInputTerminalDown;
	terminal.element.onmouseup = onInputTerminalUp;				
	this.element.appendChild(terminal.element);
	this.inputs[this.inputs.length] = terminal;		
}

NODE.prototype.addOutputTerminal = function (x,y,defaultValue,dir,cb) {
	dir = dir || 'terminal-right';				
	var terminal = new TERMINAL(x,y,defaultValue,dir,cb);
	terminal.element.onmousedown = onOutputTerminalDown;
	terminal.element.onmouseup = onOutputTerminalUp;
	this.element.appendChild(terminal.element);		
	this.outputs[this.outputs.length] = terminal;				
}		
	
NODE.prototype.setPos = function(x,y) {
	this.element.style.left = x;
	this.element.style.top  = y;
}

NODE.prototype.setY = function(y) {	
	this.element.style.top  = y;
}

NODE.prototype.setX = function(x) {
	this.element.style.left = x;	
}

NODE.prototype.moveBy = function(x,y) {
	this.element.style.left = (this.element.offsetLeft + x);
	this.element.style.top  = (this.element.offsetTop + y);
}

NODE.prototype.updateBorder = function() {
	if (this.isSelected)
		this.element.style.borderColor = 'rgb(200,139,63)';
	else
		this.element.style.borderColor = 'rgb(38,38,38)';
}

NODE.prototype.setSelected = function(state) {
	this.isSelected = state;
	this.updateBorder();
}

NODE.prototype.updateOutput = function() {
	console.log('UpdateOutput');
}

NODE.prototype.setSize = function (w,h) {
	this.element.style.height = h;
	this.element.style.width = w;
	if (this.image)
	{
		this.image.style.height = h;
		this.image.style.width = w;
	}
}

function wire() {
	var canvas = document.createElement('canvas');
	canvas.x1 = 0;
	canvas.x2 = 0;
	canvas.y1 = 0;
	canvas.y2 = 0;
	canvas.className = 'wire';
	canvas.inputTerminal = {};
	canvas.outputTerminal = {};
	scene.appendChild(canvas);
	
	canvas.draw = function() {
		this.x2 = this.x2 === 0? this.x1:this.x2;
		this.y2 = this.y2 === 0? this.y1:this.y2;
		var context = canvas.getContext('2d');
		context.clearRect(0,0,this.width,this.height);		
		
		y2y1 = Math.abs(this.y2-this.y1);
		x2x1 = Math.abs(this.x2-this.x1);
		var d = Math.sqrt(y2y1*y2y1+x2x1*x2x1)/2;
		var h = (y2y1+d/2)*2;
		var w = (x2x1+d/2)*2;			
		
		var x1 = w/2;
		var y1 = h/2;
		
		var x2 = w/2+this.x2-this.x1;
		var y2 = h/2+this.y2-this.y1;
		
		this.width  = w;
		this.height = h;
		this.style.left = this.x1 - w/2;
		this.style.top = this.y1 - h/2;
				
		context.beginPath();
		context.moveTo(x1,y1);		
		context.bezierCurveTo(x1+d,y1,x2-d,y2,x2,y2);
		context.strokeStyle = "rgb(200,139,63)";		
		context.lineWidth = 2;		
		context.stroke();
	}
	canvas.setP1 = function(x,y) {
		canvas.x1 = x+18-scene.offsetLeft;
		canvas.y1 = y+13-scene.offsetTop;
		canvas.draw();	
	}
	canvas.setP2 = function(x,y) {
		canvas.x2 = x+3-scene.offsetLeft;
		canvas.y2 = y+13-scene.offsetTop;			
		canvas.draw();
	}
	
	canvas.setInputTerminal = function(terminal) {
		canvas.inputTerminal = terminal;
		if (terminal)
		{
			var pos = getPos(terminal);
			this.setP1(pos[0],pos[1]);
		}
	}

	canvas.setOutputTerminal = function(terminal) {
		canvas.outputTerminal = terminal;
		if (terminal)
		{
			var pos = getPos(terminal);
			this.setP2(pos[0],pos[1]);
		}
	}
	
	canvas.setValue = function(val) {
		if (canvas.outputTerminal)
			canvas.outputTerminal.setValue(val);
	}
	canvas.updatePos = function() {		
		if (canvas.inputTerminal)
		{
			var pos = getPos(canvas.inputTerminal);	
			this.setP1(pos[0],pos[1]);
		}
		
		if (canvas.outputTerminal)
		{
			var pos = getPos(canvas.outputTerminal);			
			this.setP2(pos[0],pos[1]);
		}		
	}
	return canvas;
}

function textBox(x,y,tag,defVal) {
	var box = document.createElement('div');
	box.style.left = x;
	box.style.top = y;
	box.className = "TextBox";
	var label = document.createElement('label');
	label.className = 'TextBoxLabel';
	label.innerHTML = tag;
	var inpt = document.createElement('input');
	inpt.className = 'TextBoxInput';
	inpt.defaultValue = defVal;
	box.appendChild(label);
	box.appendChild(inpt);

	box.onmousedown = function() {
		inpt.focus();
	}
	box.onmouseout = function() {
		inpt.blur();
	}
	
	box.getValue = function() {
		return inpt.spinner('value');
	}
	box.inpt = inpt;
	return box;
}
