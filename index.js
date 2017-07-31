var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

var limdu = require('limdu');
var ml = require('machine_learning');

var conservador = "conservador";
var moderado = "moderado";
var arrojado = "arrojado";

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL || '-@gmail.com',
    pass: process.env.EMAIL_PASS || '-'
  }
});

var decissionTreeClassifier = new limdu.classifiers.DecisionTree();
var bayesianClassifier = new limdu.classifiers.Bayesian();
var logisticClassifier;

var dataset = [
    { input: { p1: 4, p2: 4, p3: 4, p4: 3, p5: 2, p6: 3, p7: 4, p8: 2, p9: 3, p10: 2,
		p11: 2 }, output: moderado},
    { input: { p1: 4, p2: 2, p3: 1, p4: 1, p5: 1, p6: 4, p7: 2, p8: 0, p9: 0, p10: 2,
		p11: 1 }, output: conservador},
    { input: { p1: 3, p2: 4, p3: 4, p4: 4, p5: 3, p6: 4, p7: 3, p8: 4, p9: 3, p10: 4,
      	p11: 0 }, output: arrojado},
	{ input: { p1: 2, p2: 3, p3: 2, p4: 1, p5: 2, p6: 3, p7: 2, p8: 1, p9: 2, p10: 2,
    	p11: 2 }, output: moderado},
	{ input: { p1: 4, p2: 3, p3: 4, p4: 2, p5: 4, p6: 4, p7: 2, p8: 3, p9: 3, p10: 4,
    	p11: 3 }, output: arrojado},
  	{ input: {p1: 1, p2: 1, p3: 2, p4: 3, p5: 1, p6: 1, p7: 3, p8: 3, p9: 3, p10: 2,
      	p11: 2 }, output: moderado},
	{ input: {p1: 1, p2: 1, p3: 4, p4: 3, p5: 0, p6: 1, p7: 2, p8: 0, p9: 4, p10: 2,
		p11: 2 }, output: conservador},
	{ input: {p1: 4, p2: 4, p3: 4, p4: 0, p5: 0, p6: 3, p7: 3, p8: 2, p9: 1, p10: 2,
      	p11: 0 }, output: moderado},
	{ input: {p1: 0, p2: 1, p3: 4, p4: 2, p5: 3, p6: 3, p7: 1, p8: 0, p9: 1, p10: 2,
		p11: 0 }, output: conservador},
	{ input: {p1: 4, p2: 2, p3: 4, p4: 3, p5: 3, p6: 2, p7: 4, p8: 4, p9: 3, p10: 4,
		p11: 3 }, output: arrojado},
	{ input: { p1: 3, p2: 1, p3: 2, p4: 2, p5: 0, p6: 0, p7: 1, p8: 0, p9: 2, p10: 2,
		p11: 0 }, output: conservador},
	{ input: { p1: 4, p2: 3, p3: 2, p4: 4, p5: 3, p6: 2, p7: 0, p8: 4, p9: 4, p10: 2, 
      	p11: 2 }, output: arrojado},                        
	{ input: { p1: 0, p2: 0, p3: 2, p4: 1, p5: 2, p6: 0, p7: 1, p8: 3, p9: 0, p10: 2,
      	p11: 2 }, output: conservador},                        
	{ input: { p1: 0, p2: 2, p3: 2, p4: 1, p5: 0, p6: 2, p7: 0, p8: 4, p9: 2, p10: 1, 
      	p11: 1 }, output: conservador},
  	{ input: { p1: 1, p2: 1, p3: 2, p4: 3, p5: 0, p6: 1, p7: 2, p8: 3, p9: 3, p10: 2, 
      	p11: 1 }, output: conservador},
  	{ input: { p1: 0, p2: 4, p3: 3, p4: 0, p5: 1, p6: 2, p7: 4, p8: 2, p9: 1, p10: 0, 
      	p11: 3 }, output: moderado},
  	{ input: { p1: 4, p2: 2, p3: 0, p4: 0, p5: 0, p6: 4, p7: 2, p8: 4, p9: 0, p10: 2, 
      	p11: 4 }, output: moderado},
  	{ input: { p1: 2, p2: 2, p3: 4, p4: 3, p5: 2, p6: 4, p7: 3, p8: 4, p9: 4, p10: 2, 
      	p11: 4 }, output: arrojado},
  	{ input: { p1: 1, p2: 1, p3: 2, p4: 3, p5: 3, p6: 1, p7: 2, p8: 3, p9: 1, p10: 2, 
      	p11: 2 }, output: moderado},
  	{ input: { p1: 0, p2: 1, p3: 2, p4: 0, p5: 0, p6: 2, p7: 0, p8: 2, p9: 1, p10: 1, 
      	p11: 2 }, output: conservador},                      
	{ input: { p1: 1, p2: 2, p3: 3, p4: 3, p5: 1, p6: 2, p7: 2, p8: 1, p9: 3, p10: 2,
		p11: 1 }, output: moderado},                        
	{ input: { p1: 4, p2: 3, p3: 4, p4: 4, p5: 3, p6: 2, p7: 2, p8: 4, p9: 3, p10: 3,
      	p11: 4 }, output: arrojado},
  	{ input: { p1: 4, p2: 4, p3: 4, p4: 1, p5: 0, p6: 2, p7: 2, p8: 2, p9: 1, p10: 4, 
      	p11: 0 }, output: moderado},
	{ input: { p1: 4, p2: 4, p3: 4, p4: 1, p5: 0, p6: 3, p7: 4, p8: 4, p9: 3, p10: 1, 
      	p11: 0 }, output: arrojado},
	{ input: { p1: 4, p2: 4, p3: 4, p4: 2, p5: 0, p6: 2, p7: 1, p8: 2, p9: 0, p10: 4, 
      	p11: 0 }, output: conservador},
	{ input: {p1: 1, p2: 2, p3: 3, p4: 3, p5: 1, p6: 1, p7: 2, p8: 3, p9: 2, p10: 1,
		p11: 2 }, output: moderado},
	{ input: {p1: 2, p2: 3, p3: 3, p4: 2, p5: 4, p6: 2, p7: 4, p8: 3, p9: 4, p10: 2, 
		p11: 3 }, output: arrojado},
	{ input: {p1: 3, p2: 2, p3: 2, p4: 4, p5: 3, p6: 3, p7: 3, p8: 2, p9: 2, p10: 0, 
		p11: 2 }, output: moderado},
	{ input: {p1: 4, p2: 4, p3: 4, p4: 3, p5: 4, p6: 4, p7: 3, p8: 4, p9: 2, p10: 1, 
		p11: 4 }, output: arrojado}
];


app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));

app.get('/', function (req, res) {
 	res.redirect('/index.html');
});

app.post('/decisionTree', function (req, res) {
	var { input } = req.body;
	var resultado = getDecisionTree(input);
	console.log("Resultado: ", resultado);
 	res.send(resultado);
});

function getDecisionTree(input) {
	return decissionTreeClassifier.classify(input);
}

app.post('/bayesian', function (req, res) {
	var { input } = req.body;
	var resultado = getBayesian(input);
	console.log("Resultado: ", resultado);
 	res.send(resultado);
});

function getBayesian(input) {
	return bayesianClassifier.classify(input, /* explanation level = */1);
}

app.post('/logisticRegression', function (req, res) {
	var { input } = req.body;
	var resultado = getLogisticRegression(input);
	console.log("Resultado: ", resultado);
 	res.send(resultado);
});

function getLogisticRegression(input) {
	var x = [];
	x.push(getXArray(input));

	var classifierResult = logisticClassifier.predict(x);

	var array = classifierResult[0];
	var conservadorValue = array[0];
	var moderadoValue = array[1];
	var arrojadoValue = array[2];

	var result = "";
	var biggerValue = 0;
	if(conservadorValue > moderadoValue) {
		biggerValue = conservadorValue;
		result = conservador;
	} else {
		biggerValue = moderadoValue;
		result = moderado;
	}

	if(arrojadoValue > biggerValue) {
		result = arrojado;
	}

    return result;
}

app.post('/prediction', function (req, res) {
	var { input } = req.body;

	var decisionTreeResult = getDecisionTree(input);
	var bayesianResult = getDecisionTree(input);
	var logisticResult = getLogisticRegression(input);

	var resultado = {
		decisionTree: decisionTreeResult,
		bayesian: bayesianResult,
		logistic: logisticResult
	};

	console.log("Resultado: ", resultado);
 	res.send(resultado);
});

app.post('/newDataSet', function (req, res) {
	var params = req.body;
	console.log("recebido: " + JSON.stringify(params));
	var paramsString = JSON.stringify(params);
	var mailOptions = {
	  from: 'rocha.daniel52@gmail.com',
	  to: 'rocha.daniel52@gmail.com',
	  subject: 'Nova resposta de Questionario',
	  text: paramsString
	};
	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    console.log(error);
	  } else {
	    console.log('Email sent: ' + info.response);
	  }
	});
	//dataset.push(params);
	//decisionTreeTrain();
	//bayesianClassifierTrain();
 	res.send("ok");
});

app.listen(app.get('port'), function () {
  console.log('listening on port ' + app.get('port') + '!');
  decisionTreeTrain();
  bayesianClassifierTrain();
  LogisticRegressionTrain();
});

function decisionTreeTrain() {
	console.log("Iniciando treinamento [DecisionTree]");
	decissionTreeClassifier.trainBatch(dataset);
	console.log("Finalizando treinamento [DecisionTree]");
}

function bayesianClassifierTrain() {
	console.log("Iniciando treinamento [Bayesian]");
	bayesianClassifier.trainBatch(dataset);
	console.log("Finalizando treinamento [Bayesian]");
}

function LogisticRegressionTrain() {
	console.log("Iniciando treinamento [Logistic Regression]");
	var x = [];
	var y = [];

	for (var i = 0; i < dataset.length; i++) {
		
		x.push(getXArray(dataset[i].input));

		var yDataset = dataset[i].output;
	
		y.push(getYArray(yDataset));
	};

	logisticClassifier = new ml.LogisticRegression({
	    'input' : x,
	    'label' : y,
	    'n_in' : 11,
	    'n_out' : 3
	});
	 
	logisticClassifier.set('log level',0); 
	 
	var training_epochs = 800, lr = 0.05;
	 
	logisticClassifier.train({
	    'lr' : lr,
	    'epochs' : training_epochs
	});
 	
 	console.log("Finalizando treinamento [Logistic Regression]");
}

function getXArray(objeto) {
	var xArray = [];
	xArray.push(objeto.p1);
	xArray.push(objeto.p2);
	xArray.push(objeto.p3);
	xArray.push(objeto.p4);
	xArray.push(objeto.p5);
	xArray.push(objeto.p6);
	xArray.push(objeto.p7);
	xArray.push(objeto.p8);
	xArray.push(objeto.p9);
	xArray.push(objeto.p10);
	xArray.push(objeto.p11);
	return xArray;
}

function getYArray(yDataset) {
	var yArray = [];
	if(yDataset == conservador) yArray.push(1);
	else yArray.push(0);

	if(yDataset == moderado) yArray.push(1);
	else yArray.push(0);

	if(yDataset == arrojado) yArray.push(1);
	else yArray.push(0);
	return yArray;
}
