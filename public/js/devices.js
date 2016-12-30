function createNOTLogicGate(x,y) {
	var newNode = new NODE("NOT Gate");
	newNode.updateOutput = function(val) {				
		if (typeof(val) === 'undefined' || val === null)
			newNode.outputs[0].setValue(undefined);
		else if (typeof(val) === 'boolean')
			newNode.outputs[0].setValue(!val);
	}
	myNodes[myNodes.length] = newNode;
	newNode.setPos(x,y);	
	newNode.setBackgroundImage(50,35,100,100,'images/sidebar/not-icon.png');
	newNode.addOutputTerminal(183,75,true);
	newNode.addInputTerminal(-2,75,false,null,newNode.updateOutput);	
	newNode.setSize(200,125);
	scene.appendChild(newNode.element);
}

function createBufferLogicGate(x,y) {
	var newNode = new NODE("BUFFER Gate");
	myNodes[myNodes.length] = newNode;
	newNode.updateOutput = function(val) {		
		newNode.outputs[0].setValue(val);
	}
	newNode.setPos(x,y);	
	newNode.setBackgroundImage(50,35,100,100,'images/sidebar/buffer-icon.png');
	newNode.addOutputTerminal(183,75,false);
	newNode.addInputTerminal(-2,75,false,null,newNode.updateOutput);
	newNode.setSize(200,125);	
	scene.appendChild(newNode.element);
}

function createNANDLogicGate(x,y) {
	var newNode = new NODE("NAND Gate");
	myNodes[myNodes.length] = newNode;
	newNode.updateOutput = function() {		
		var val1 = newNode.inputs[0].value;
		var val2 = newNode.inputs[1].value;
		if (typeof(val1) === 'undefined' || typeof(val2) === 'undefined' || val1 === null || val2 === null)
			newNode.outputs[0].setValue(undefined);
		else
			newNode.outputs[0].setValue(!(val1 && val2));
	}	
	newNode.setPos(x,y);	
	newNode.setBackgroundImage(50,62,100,100,'images/sidebar/nand-icon.png');
	newNode.addOutputTerminal(183,100,true);
	newNode.addInputTerminal(-2,75,false,null,newNode.updateOutput);
	newNode.addInputTerminal(-2,125,false,null,newNode.updateOutput);
	newNode.setSize(200,175);
	scene.appendChild(newNode.element);
}

function createANDLogicGate(x,y) {
	var newNode = new NODE("AND Gate");
	myNodes[myNodes.length] = newNode;
	newNode.updateOutput = function() {		
		var val1 = newNode.inputs[0].value;
		var val2 = newNode.inputs[1].value;
		//if (typeof(val1) === 'undefined' || typeof(val2) === 'undefined' || val1 === null || val2 === null)
		//	newNode.outputs[0].setValue(undefined);
		//else
			newNode.outputs[0].setValue(val1 && val2);
	}	
	newNode.setPos(x,y);	
	newNode.setBackgroundImage(50,62,100,100,'images/sidebar/and-icon.png');
	newNode.addOutputTerminal(183,100,false);
	newNode.addInputTerminal(-2,75,false,null,newNode.updateOutput);
	newNode.addInputTerminal(-2,125,false,null,newNode.updateOutput);
	newNode.setSize(200,175);
	scene.appendChild(newNode.element);
}

function createORLogicGate(x,y) {
	var newNode = new NODE("OR Gate");
	myNodes[myNodes.length] = newNode;
	newNode.updateOutput = function() {		
		var val1 = newNode.inputs[0].value;
		var val2 = newNode.inputs[1].value;
		//if (typeof(val1) === 'undefined' || typeof(val2) === 'undefined' || val1 === null || val2 === null)
		//	newNode.outputs[0].setValue(undefined);
		//else
			newNode.outputs[0].setValue(val1 || val2);
	}	
	newNode.setPos(x,y);	
	newNode.setBackgroundImage(50,62,100,100,'images/sidebar/or-icon.png');
	newNode.addOutputTerminal(183,100,true);
	newNode.addInputTerminal(-2,75,false,null,newNode.updateOutput);
	newNode.addInputTerminal(-2,125,false,null,newNode.updateOutput);
	newNode.setSize(200,175);
	scene.appendChild(newNode.element);
}

function createNORLogicGate(x,y) {
	var newNode = new NODE("NOR Gate");
	myNodes[myNodes.length] = newNode;
	newNode.updateOutput = function() {		
		var val1 = newNode.inputs[0].value;
		var val2 = newNode.inputs[1].value;
		if (typeof(val1) === 'undefined' || typeof(val2) === 'undefined' || val1 === null || val2 === null)
			newNode.outputs[0].setValue(undefined);
		else
			newNode.outputs[0].setValue(!(val1 || val2));
	}	
	newNode.setPos(x,y);
	newNode.setBackgroundImage(50,62,100,100,'images/sidebar/nor-icon.png');
	newNode.addOutputTerminal(183,100,true);
	newNode.addInputTerminal(-2,75,false,null,newNode.updateOutput);
	newNode.addInputTerminal(-2,125,false,null,newNode.updateOutput);
	newNode.setSize(200,175);
	scene.appendChild(newNode.element);
}

function createXORLogicGate(x,y) {
	var newNode = new NODE("XOR Gate");
	myNodes[myNodes.length] = newNode;
	newNode.updateOutput = function() {		
		var val1 = newNode.inputs[0].value;
		var val2 = newNode.inputs[1].value;
		if (typeof(val1) === 'undefined' || typeof(val2) === 'undefined' || val1 === null || val2 === null)
			newNode.outputs[0].setValue(undefined);
		else
			newNode.outputs[0].setValue(( val1 || val2 ) && !( val1 && val2 ));
	}	
	newNode.setPos(x,y);
	newNode.setBackgroundImage(50,62,100,100,'images/sidebar/xor-icon.png');
	newNode.addOutputTerminal(183,100,false);
	newNode.addInputTerminal(-2,75,false,null,newNode.updateOutput);
	newNode.addInputTerminal(-2,125,false,null,newNode.updateOutput);
	newNode.setSize(200,175);
	scene.appendChild(newNode.element);
}

function createXNORLogicGate(x,y) {
	var newNode = new NODE("XNOR Gate");
	myNodes[myNodes.length] = newNode;
	newNode.updateOutput = function() {		
		var val1 = newNode.inputs[0].value;
		var val2 = newNode.inputs[1].value;
		if (typeof(val1) === 'undefined' || typeof(val2) === 'undefined' || val1 === null || val2 === null)
			newNode.outputs[0].setValue(undefined);
		else
			newNode.outputs[0].setValue(!(( val1 || val2 ) && !( val1 && val2 )));
	}	
	newNode.setPos(x,y);
	newNode.setBackgroundImage(50,62,100,100,'images/sidebar/xnor-icon.png');
	newNode.addOutputTerminal(183,100,true);
	newNode.addInputTerminal(-2,75,false,null,newNode.updateOutput);
	newNode.addInputTerminal(-2,125,false,null,newNode.updateOutput);
	newNode.setSize(200,175);
	scene.appendChild(newNode.element);
}

function createDFlipFlop(x,y) {
	var newNode = new NODE("D-Flip-Flop");
	myNodes[myNodes.length] = newNode;
	newNode.oldClock = false;
	newNode.updateOutput = function() {		
		var vald = newNode.inputs[0].value;
		var valc = newNode.inputs[1].value;
		var vals = newNode.inputs[2].value;
		var valr = newNode.inputs[3].value;
		if (typeof(valr) === 'boolean' && typeof(vals) === 'boolean')
		{
			if (valr && vals)
			{
				newNode.outputs[0].setValue(true);
				newNode.outputs[1].setValue(true);			
				return;
			}
			else if (valr && !vals)
			{
				newNode.outputs[0].setValue(false);
				newNode.outputs[1].setValue(true);						
				return;
			}
			else if (!valr && vals)
			{
				newNode.outputs[0].setValue(false);
				newNode.outputs[1].setValue(true);						
				return;
			}
		}
		if (typeof(vald) === 'undefined' || typeof(valc) === 'undefined' || vald === null || valc === null)	
		{
			newNode.outputs[0].setValue(undefined);
			newNode.outputs[1].setValue(undefined);
		}
		else
		{
			if (newNode.oldClock === false && valc === true)
			{				
				newNode.outputs[0].setValue(vald);
				newNode.outputs[1].setValue(!vald);
			}
			newNode.oldClock = valc;			
		}
	}	
	newNode.setPos(x,y);
	newNode.setBackgroundImage(50,62,100,100,'images/sidebar/d-flip-flop.png');	
	newNode.addOutputTerminal(183,75,false);
	newNode.addOutputTerminal(183,120,true);
	newNode.addInputTerminal(-2,75,false,null,newNode.updateOutput);
	newNode.addInputTerminal(-2,125,false,null,newNode.updateOutput);
	newNode.addInputTerminal(88,50,false,'terminal-top',newNode.updateOutput);
	newNode.addInputTerminal(88,150,false,'terminal-bottom',newNode.updateOutput);	
	newNode.setSize(200,175);	
	scene.appendChild(newNode.element);
}

function createTFlipFlop(x,y) {
	var newNode = new NODE("T-Flip-Flop");
	myNodes[myNodes.length] = newNode;
	newNode.oldClock = false;
	newNode.updateOutput = function() {		
		var valt = newNode.inputs[0].value;
		var valc = newNode.inputs[1].value;
		if (typeof(valt) === 'undefined' || typeof(valc) === 'undefined' || valt === null || valc === null)	
		{
			newNode.outputs[0].setValue(false);
			newNode.outputs[1].setValue(true);
		}
		else
		{
			if (valt === true)
			if ((valc === true && newNode.oldClock === false) || (valc === false && newNode.oldClock === true))
			{
				if (valc === true)
				{
					var q = newNode.outputs[0].value;
					newNode.outputs[0].setValue(!q);
					newNode.outputs[1].setValue(q);						
				}
				newNode.oldClock = valc;
			}
		}
	}	
	newNode.setPos(x,y);	
	newNode.setBackgroundImage(35,46,130,130,'images/sidebar/t-flip-flop.png');	
	newNode.addOutputTerminal(183,75,false);
	newNode.addOutputTerminal(183,120,true);
	newNode.addInputTerminal(-2,75,false,null,newNode.updateOutput);
	newNode.addInputTerminal(-2,125,false,null,newNode.updateOutput);
	newNode.setSize(200,175);
	scene.appendChild(newNode.element);
}

function createJKFlipFlop(x,y) {
	var newNode = new NODE("JK-Flip-Flop");
	myNodes[myNodes.length] = newNode;
	newNode.updateOutput = function() {		
		var valj = newNode.inputs[0].value;
		var valc = newNode.inputs[1].value;
		var valk = newNode.inputs[2].value;
		if (typeof(valj) === 'undefined' ||
			typeof(valc) === 'undefined' ||
			typeof(valk) === 'undefined' ||
			valj === null ||
			valc === null ||
			valk === null)
			{
				newNode.outputs[0].setValue(false);
				newNode.outputs[1].setValue(false);				
			}
			else
			{
				if (valc !== newNode.oldClock)
				{
					newNode.oldClock = valc;
					if (valc === true)
					{
						var q = newNode.outputs[0].value;
						if (valj === true && valk === true)
						{
							newNode.outputs[0].setValue(!q);
							newNode.outputs[1].setValue(q);					
						}
						else if (valj !== valk)
						{
							newNode.outputs[1].setValue(!valj);
							newNode.outputs[0].setValue(valj);											
						}						
					}
				}
			}
		}
	newNode.setPos(x,y);	
	newNode.setBackgroundImage(32,43,140,140,'images/sidebar/jk-flip-flop.png');	
	newNode.addOutputTerminal(183,75,false);
	newNode.addOutputTerminal(183,120,true);
	newNode.addInputTerminal(-2,75,false,null,newNode.updateOutput);
	newNode.addInputTerminal(-2,100,false,null,newNode.updateOutput);
	newNode.addInputTerminal(-2,125,false,null,newNode.updateOutput);
	newNode.setSize(200,175);
	newNode.oldClock = true;
	scene.appendChild(newNode.element);
}

function createGatedDLatch(x,y) {
	var newNode = new NODE("Gated D Latch");
	myNodes[myNodes.length] = newNode;	
	newNode.updateOutput = function() {		
		var vald = newNode.inputs[0].value;
		var vale = newNode.inputs[1].value;
		if (typeof(vald) === 'undefined' || typeof(vale) === 'undefined' || vald === null || vale === null)	
		{
			newNode.outputs[0].setValue(false);
			newNode.outputs[1].setValue(true);
		}
		else
		{
			if (vale === true)			
			{
				if (typeof(vald) === 'boolean')
				{					
					newNode.outputs[0].setValue(vald);
					newNode.outputs[1].setValue(!vald);						
				}				
			}
		}
	}	
	newNode.setPos(x,y);	
	newNode.setBackgroundImage(35,46,130,130,'images/sidebar/gated-d-latch.png');	
	newNode.addOutputTerminal(183,75,false);
	newNode.addOutputTerminal(183,120,true);
	newNode.addInputTerminal(-2,75,false,null,newNode.updateOutput);
	newNode.addInputTerminal(-2,125,false,null,newNode.updateOutput);
	newNode.setSize(200,175);
	scene.appendChild(newNode.element);
}

function createSingleBitFullAdder(x,y) {
	var newNode = new NODE("1-Bit Full Adder");
	myNodes[myNodes.length] = newNode;	
	newNode.updateOutput = function() {		
		var valA = newNode.inputs[1].value;
		var valB = newNode.inputs[2].value;
		var valCin = newNode.inputs[0].value;
		if (valA === undefined || 
			valB === undefined || 
			valCin === undefined)
		{
			newNode.outputs[0].setValue(false);
			newNode.outputs[1].setValue(false);
		}
		else
		{
			var Cout = (valA && valB) || (valCin && (valA^valB));
			var S = valA ^ valB ^ valCin;
			newNode.outputs[0].setValue(!!S);
			newNode.outputs[1].setValue(!!Cout);
		}
	}	
	newNode.setPos(x,y);	
	newNode.setBackgroundImage(35,46,130,130,'images/sidebar/1-bit-full-adder.png');	
	newNode.addOutputTerminal(183,98,false); // S 0
	newNode.addOutputTerminal(88,157,false,'terminal-bottom'); // Cout 1
	newNode.addInputTerminal(88,40,false,'terminal-top',newNode.updateOutput); // Cin 0
	newNode.addInputTerminal(-2,75,false,null,newNode.updateOutput); // A 1
	newNode.addInputTerminal(-2,125,false,null,newNode.updateOutput); // B 2
	newNode.setSize(200,175);
	scene.appendChild(newNode.element);
}

function createClock(x,y) {
	var newNode = new NODE("Clock");
	myNodes[myNodes.length] = newNode;
	newNode.setPos(x,y);	
	newNode.addOutputTerminal(233,100,false);	
	newNode.setSize(250,175);
	newNode.interval = 1000;
	newNode.dutyCycle = 50;
	newNode.onTime = 500;
	newNode.offTime = 500;
	newNode.trigOff = function() { setTimeout(function() {
		if (newNode.dutyCycle !== 0)
			newNode.outputs[0].setValue(true);
		newNode.trigOn();
	},newNode.offTime);};	
	
	newNode.trigOn = function() { setTimeout(function() {
		if (newNode.dutyCycle !== 100)
			newNode.outputs[0].setValue(false);
		newNode.trigOff();
	},newNode.onTime);};
	
	newNode.trigOff();	
	
	scene.appendChild(newNode.element);
	var intervalBox = textBox(31,75,'Interval',1000);
	intervalBox.inpt.style.maxWidth = '70px';	
	newNode.element.appendChild(intervalBox);
	intervalBox.inpt.oninput = function() {
		setInterval(function(){
		newNode.interval = parseInt(intervalBox.inpt.value,10);
		newNode.interval = newNode.interval<0?0:newNode.interval;
		newNode.onTime = newNode.dutyCycle * newNode.interval / 100;
		newNode.offTime = newNode.interval - newNode.onTime;
		},1000);
	}	
	var dutyCycleBox = textBox(10,120,'Duty cycle',50);
	dutyCycleBox.inpt.style.maxWidth = '70px';		
	newNode.element.appendChild(dutyCycleBox);
	dutyCycleBox.inpt.oninput = function() {
		setInterval(function(){
		newNode.dutyCycle = parseInt(dutyCycleBox.inpt.value,10);
		newNode.dutyCycle = newNode.dutyCycle<0?0:newNode.dutyCycle;
		newNode.dutyCycle = newNode.dutyCycle>100?100:newNode.dutyCycle;
		newNode.onTime = newNode.dutyCycle * newNode.interval / 100;
		newNode.offTime = newNode.interval - newNode.onTime;
		},1000);
	}			
}

function create2To1Multiplexer(x,y) {
	var newNode = new NODE("2-to-1 Multiplexer");
	myNodes[myNodes.length] = newNode;	
	newNode.updateOutput = function() {
		var s = newNode.inputs[0].value;
		var i1 = newNode.inputs[1].value;
		var i2 = newNode.inputs[2].value;
		if (s !== undefined && typeof(s) === 'boolean')
		{
			if (s === false)
				newNode.outputs[0].setValue(i1);
			else
				newNode.outputs[0].setValue(i2);
		}
	}	
	newNode.setPos(x,y);	
	newNode.setBackgroundImage(35,46,130,130,'images/sidebar/2-to-1-multiplexer.png');	
	newNode.addOutputTerminal(183,98,false); 
	newNode.addInputTerminal(88,157,false,'terminal-bottom',newNode.updateOutput);	
	newNode.addInputTerminal(-2,75,false,null,newNode.updateOutput);
	newNode.addInputTerminal(-2,125,false,null,newNode.updateOutput);
	newNode.setSize(200,175);
	scene.appendChild(newNode.element);
}

function createSawtoothGenerator(x,y) {
	var newNode = new NODE("Sawtooth Generator");
	myNodes[myNodes.length] = newNode;
	newNode.updateOutput = function() {		
		var clk = newNode.inputs[0].value;
		if (clk === true)
		{
			newNode.output += newNode.precision;
			newNode.output = newNode.output>1?0:newNode.output;			
			newNode.outputs[0].setValue(newNode.output);			
		}
	}
	newNode.setPos(x,y);	
	newNode.addInputTerminal(-2,75,false,null,newNode.updateOutput);	
	newNode.addOutputTerminal(233,75,0);	
	newNode.setSize(250,125);
	newNode.output = 0;
	newNode.precision = 0.01;
	scene.appendChild(newNode.element);
	var pBox = textBox(41,70,'Precision',0.01);
	pBox.inpt.style.maxWidth = '70px';	
	newNode.element.appendChild(pBox);
	pBox.inpt.oninput = function() {
		setInterval(function(){
		newNode.precision = parseFloat(pBox.inpt.value,10);
		newNode.precision = newNode.precision<0?0:newNode.precision;
		newNode.precision = newNode.precision>1?1:newNode.precision;
		},1000);
	}	
}

function createProbe(x,y) {
	var newNode = new NODE("Probe");
	newNode.updateOutput = function(val) {
		newNode.probe.value = String(newNode.inputs[0].value);
	}
	myNodes[myNodes.length] = newNode;
	newNode.setPos(x,y);	
	newNode.addInputTerminal(-2,75,false,null,newNode.updateOutput);	
	newNode.setSize(200,125);
	scene.appendChild(newNode.element);
	var pBox = textBox(41,70,'Value',0);
	pBox.inpt.style.maxWidth = '70px';	
	newNode.element.appendChild(pBox);
	newNode.probe = pBox.inpt;
}

function createPushbutton(x,y) {
	var newNode = new NODE();
	newNode.setBackgroundImage(0,5,152,120,'images/sidebar/pushbutton-1-normal.png');	
	myNodes[myNodes.length] = newNode;	
	newNode.element.addEventListener("mousedown",function() {
		newNode.setBackgroundImage(0,5,152,120,'images/sidebar/pushbutton-1-pushed.png');	
		newNode.outputs[0].setValue(true);
	});
	newNode.element.addEventListener("mouseup",function() {
		newNode.setBackgroundImage(0,5,152,120,'images/sidebar/pushbutton-1-normal.png');	
		newNode.outputs[0].setValue(false);
	});
	newNode.setPos(x,y);	
	newNode.addOutputTerminal(183,50,false);
	newNode.setSize(200,125);
	scene.appendChild(newNode.element);
}

function createToggleSwitch(x,y) {
	var newNode = new NODE();
	newNode.setBackgroundImage(20,0,130,130,'images/sidebar/switch-1-off.png');	
	myNodes[myNodes.length] = newNode;	
	newNode.updateOutput = function() {
		var q = newNode.outputs[0].value;
		if (q === false)
		{
			newNode.outputs[0].setValue(true);
			newNode.setBackgroundImage(20,0,130,130,'images/sidebar/switch-1-on.png');	
		}
		else
		{
			newNode.outputs[0].setValue(false);
			newNode.setBackgroundImage(20,0,130,130,'images/sidebar/switch-1-off.png');	
		}
	}
	newNode.element.addEventListener("mousedown",function() {
		newNode.updateOutput();
	});
	newNode.setPos(x,y);	
	newNode.addOutputTerminal(183,50,false);
	newNode.setSize(200,125);
	scene.appendChild(newNode.element);
}

function createMotionDetector(x,y) {
	var newNode = new NODE();
	newNode.setBackgroundImage(20,0,130,130,'images/sidebar/motiondetector-normal.png');	
	myNodes[myNodes.length] = newNode;	
	newNode.element.addEventListener("mouseenter",function() {
			newNode.outputs[0].setValue(true);
			newNode.setBackgroundImage(20,0,130,130,'images/sidebar/motiondetector-triggered.png');			
	});
	newNode.element.addEventListener("mouseout",function() {
			newNode.outputs[0].setValue(false);
			newNode.setBackgroundImage(20,0,130,130,'images/sidebar/motiondetector-normal.png');		
	});
	newNode.setPos(x,y);	
	newNode.addOutputTerminal(183,50,false);
	newNode.setSize(200,125);
	scene.appendChild(newNode.element);
}