/* Parameters for symbolset generation */
var charHeight = 50;
var barWidth = 20;
var charWidth = 25;
var dotRadius = 3;
var punctHeight = 10;

/* Symbolsets: 0=ancient, 1=modern */
var symbols = [
	[
		new Path([[0,0], [0, charHeight/2]]),
		new Group([
			new Path([[0,0], [0,charHeight]]),
			new Path([[-barWidth/2,charHeight/2], [barWidth/2,charHeight/2]])
		]),
		new Group([
			new Path([[0,0], [0, charHeight/2]]),
			new Path([[-barWidth/2,charHeight/2], [barWidth/2,charHeight/2]])
		]),
		new Path([[0,0], [0, charHeight]])
	],
	[
		new Path([[0,0], [0, charHeight]]),
		new Group([
			new Path([[0,0], [0,charHeight]]),
			new Path([[-barWidth/2,charHeight/2], [barWidth/2,charHeight/2]])
		]),
		new Group([
			new Path([[0,0], [0, charHeight]]),
			new Path([[-barWidth/2,charHeight], [barWidth/2,charHeight]])
		]),
		new Group([
			new Path([[0,0], [0, charHeight]]),
			new Path([[-barWidth/2,charHeight/2], [barWidth/2,charHeight/2]]),
			new Path([[-barWidth/2,charHeight], [barWidth/2,charHeight]])
		])
	]
];

/* Punctuation symbols */
var punctdot = new Path.Circle(new Point(0, 0), dotRadius);
punctdot.fillColor = 'black';
punctdot.pivot = new Point(0, 0);

var punctring = new Path.Circle(new Point(0, 0), dotRadius);
punctring.strokeColor = 'black';
punctring.pivot = new Point(0, 0);

punctdot = new SymbolDefinition(punctdot, false);
punctring = new SymbolDefinition(punctring, false);

var punctuation = [
	punctdot.place(new Point(0, 0)),
	new Group([
		punctdot.place(new Point(0, 0)),
		new Path([[0, punctHeight], [0, -punctHeight]])
	]),
	punctring.place(new Point(0, 0)),
	new Group([
		punctdot.place(new Point(0, 0)),
		new Path([[0, punctHeight], [0, -punctHeight]]),
		new Path([[-punctHeight, punctHeight], [punctHeight, -punctHeight]]),
		new Path([[-punctHeight, -punctHeight], [punctHeight, punctHeight]])
	]),
	new Group([
		punctring.place(new Point(0, 0)),
		new Path([[0, punctHeight], [0, -punctHeight]]),
		new Path([[-punctHeight, punctHeight], [punctHeight, -punctHeight]]),
		new Path([[-punctHeight, -punctHeight], [punctHeight, punctHeight]])
	]),
	new Group([
		punctring.place(new Point(0, 0)),
		new Path([[0, punctHeight], [0, -punctHeight]])
	]),
	new Group([
		punctring.place(new Point(0, 0)),
		new Path([[-punctHeight, punctHeight], [punctHeight, -punctHeight]]),
		new Path([[-punctHeight, -punctHeight], [punctHeight, punctHeight]])
	]),
	new Group([
		new Path([[-punctHeight, punctHeight], [punctHeight, -punctHeight]]),
		new Path([[-punctHeight, -punctHeight], [punctHeight, punctHeight]])
	]),
	new Group([
		punctdot.place([0, -punctHeight]),
		punctdot.place([0, punctHeight])
	])
]

/* Compile all symbols */
for(var i = 0; i<symbols.length; i++) {
	for (var j = 0; j<symbols[i].length; j++) {
		symbols[i][j].strokeColor = 'black';
		symbols[i][j].pivot = new Point(0,0);
		symbols[i][j] = new SymbolDefinition(symbols[i][j], false);
	}
}
for(var i = 0; i<punctuation.length; i++) {
	punctuation[i].strokeColor = 'black';
	punctuation[i].fillColor = 'black';
	punctuation[i].pivot = new Point(0,0);
	punctuation[i] = new SymbolDefinition(punctuation[i], false);
}

/* Character table */
var charlist = [
	// Consonant table
	"" , "t", "s", "h", "c",
	"d", "" , "f", "b", "" ,
	"z", "v", "m", "k", "w",
	"r", "p", "g", "n", "x",
	"l", "" , "j", "q", "" ,
	// Vowels
	"e", "a", "i", "y", "o", "u",
	// Punctuation
	" ", ",", ".", ":", ";", "!", "?", "'", "-"
]

/* Invert it into a map */
var charmap = new Map();
for (var i = 0; i<charlist.length; i++) {
	if (charlist[i].length > 0) {
		charmap.set(charlist[i], i);
	}
}


/* Data array areas:
 * 00 - 24: Consonants (
 * 25 - 30: Vowels (EAIYOU)
 * 30 - ??: Punctuation ( ,.:;!?'-)
 */
 
function show_translation(target, symbolset) {
	// Strip whitespace around punctuation
	target = target.replace(/\s*(\W)\s*/g, "$1");
	
	// Translate input to data and capitals arrays
	var data = [];
	var capitals = [];
	for (var i = 0; i<target.length; i++) {
		var lowercase = target[i].toLowerCase();
		data.push(charmap.get(lowercase));
		capitals.push(lowercase != target[i]);
	}
	
	// Print data array for desbugging
	console.log(data);
	
	// If a translation is already on the screen, remove it
	if (typeof group !== 'undefined') {
		group.remove();
	}
	
	var path = new Path();
	group = new Group([path]);
	var p = 0;
	var addEnglish = true;
	for (var i = 0; i<data.length; i++) {
		var x = data[i];
		var center = new Point(charWidth*p, 0);
		if (x <= 30) {
			if (x <= 24) {
				var lower = x%5-1;
				var upper = Math.floor(x/5)-1;
				if (upper >= 0) {
					group.addChild(symbols[symbolset][upper].place(center).rotate(180, center));
				}
				if (lower >= 0) {
					group.addChild(symbols[symbolset][lower].place(center));
				}
				path.add(center);
				p += 1;
			}
			else {
				switch(x) {
					case 25: // E
					path.add(center, center+[charWidth/2,-charHeight/2], center+[charWidth,0]);
					break;
					case 26: // A
					path.add(center, center+[charWidth/2,charHeight/2], center+[charWidth,0]);
					break;
					case 27: // I
					path.add(center, center+[charWidth/2,-charHeight/2], center+[charWidth/2,charHeight/2], center+[charWidth,0]);
					break;s
					case 28: // Y
					path.add(center, center+[charWidth/2,charHeight/2], center+[charWidth/2,-charHeight/2], center+[charWidth,0]);
					break;
					case 29: // O
					path.add(center, center+[0,-charHeight/2], center+[charWidth,-charHeight/2], center+[charWidth,0]);
					break;
					case 30: // U
					path.add(center, center+[0,charHeight/2], center+[charWidth,charHeight/2], center+[charWidth,0]);
					break;
				}
				p += 2;
			}
			if (capitals[i]) {
				var capDot = new Path.Circle(center, dotRadius);
				capDot.fillColor = 'black';
				group.addChild(capDot);
			}
		}
		else {
			group.addChild(punctuation[x-31].place(center));
			p += 1;
			path.add(center);
		}
		if (addEnglish) {
			var textLoc = center+[0,-2*charHeight];
			if (25 <= x && x <= 30) {
				textLoc = textLoc + [charWidth/2, 0];
			}
			var textItem = new PointText(textLoc);
			textItem.content = target[i];
			textItem.fillColor = 'black';
			textItem.fontSize = 30;
			textItem.justification = 'center';
			group.addChild(textItem);
		}
	}
	group.strokeColor = 'black';
	group.position = view.center;
}

window.show_translation = show_translation;

show_translation("", 0);

function onResize(event) {
	group.position = view.center;
}