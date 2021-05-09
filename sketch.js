/**
 * Σ : F, +, -
n : 3
ω : F-F-F-F
δ : 90º
p1 : F → +FF

0: F-F-F-F
1: +FF-+FF-+FF-+FF
2: ++FF+FF-++FF+FF-++FF+FF-++FF+FF
3: +++FF+FF++FF+FF-+++FF+FF++FF+FF-+++FF+FF++FF+FF-+++FF+FF++FF+FF
 
 */

var angle;
var axiom;
var iterations;
var len = 100;
var alphabet = [];
var rules = [];
var result;

function preload() {
    result = loadStrings("/grammar.txt", associate);
}

function associate(result) {
    result.forEach((element) => {
        if (element.match(/n/))
            alphabet = element.replace("Σ.*:", "").trim().split(", ");

        if (element.match(/n/)) iterations = element.replace("n.*:", "").trim();

        if (element.match(/ω/)) axiom = element.replace("ω.*:", "").trim();

        if (element.match(/δ/)) angle = element.replace("δ.*:", "").trim();

        if (element.matches(/p[0-9]*/)) {
            var rule = element.replace("p.*:", "").trim().split("→");
            rules.push({ char: rule[0], change: rule[1] });
        }
    });
}

var sentence = axiom;

function generate() {
    len *= 0.75;
    var nextSentence = "";
    for (var i = 0; i < sentence.length; i++) {
        var current = sentence.charAt(i);
        var found = false;
        for (var j = 0; j < rules.length; j++) {
            if (current == rules[j].char) {
                found = true;
                nextSentence += rules[j].change;
                break;
            }
        }
        if (!found) {
            nextSentence += current;
        }
    }
    sentence = nextSentence;
    createP(sentence);
    turtle();
}

function turtle() {
    background(51);
    resetMatrix();
    translate(width / 2, height);
    stroke(255, 100);
    for (var i = 0; i < sentence.length; i++) {
        var current = sentence.charAt(i);

        if (current == "F") {
            line(0, 0, 0, -len);
            translate(0, -len);
        } else if (current == "+") {
            rotate(angle);
        } else if (current == "-") {
            rotate(-angle);
        } else if (current == "[") {
            push();
        } else if (current == "]") {
            pop();
        }
    }
}

function setup() {
    console.log(result);
    createCanvas(400, 400);
    angle = radians(25);
    background(51);
    createP(axiom);
    turtle();
    var button = createButton("generate");
    button.mousePressed(generate);

    var load = createButton("load text file");
    load.mousePressed(generate);
}

function readFile() {
    var input = document.getElementById("myFile");
    var output = document.getElementById("output");

    input.addEventListener("change", function() {
        if (this.files && this.files[0]) {
            var myFile = this.files[0];
            var reader = new FileReader();

            reader.addEventListener("load", function(e) {
                output.textContent = e.target.result;
            });

            reader.readAsBinaryString(myFile);
        }
    });
}