var app = angular.module('quizApp', []);

app.config(function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
	$httpProvider.defaults.withCredentials = true;
	delete $httpProvider.defaults.headers.common["X-Requested-With"];
	$httpProvider.defaults.headers.common["Accept"] = "application/json";
	$httpProvider.defaults.headers.common["Content-Type"] = "application/json";
});

app.directive('quiz', function(quizFactory, $http) {
	return {
		restrict: 'AE',
		scope: {},
		templateUrl: 'template.html',
		link: function(scope, elem, attrs) {
			//var baseUrl = 'http://localhost:5000/';
			var baseUrl = 'http://machine-learning-investidor.herokuapp.com/';
			scope.start = function() {
				scope.id = 0;
				scope.quizOver = false;
				scope.inProgress = true;
				scope.quizCompleted = false;
				scope.listAnswer = [];
				scope.inputAnswers = {};
				scope.investors = ["conservador", "moderado", "arrojado"];
				scope.getQuestion();
			};

			scope.reset = function() {
				scope.inProgress = false;
				scope.score = 0;
				scope.quizCompleted = false;
				scope.listAnswer = [];
				scope.inputAnswers = {};
			}

			scope.getQuestion = function() {
				scope.questionNumber = "Pergunta " + (scope.id + 1) + " de " + quizFactory.getSize();
				var q = quizFactory.getQuestion(scope.id);
				if(q) {
					scope.question = q.question;
					scope.options = q.options;
					scope.answer = q.answer;
					scope.answerMode = true;
				} else {
					//$http.defaults.headers.post["Content-Type"] = "application/json";
					scope.inputAnswers = {
						p1: scope.listAnswer[0],
						p2: scope.listAnswer[1],
						p3: scope.listAnswer[2],
						p4: scope.listAnswer[3],
						p5: scope.listAnswer[4],
						p6: scope.listAnswer[5],
						p7: scope.listAnswer[6],
						p8: scope.listAnswer[7],
						p9: scope.listAnswer[8],
						p10: scope.listAnswer[9],
						p11: scope.listAnswer[10],
						p12: scope.listAnswer[11]
					}
					$http({
				        url: baseUrl + 'prediction',
				        method: "POST",
				        data: { 'input' : scope.inputAnswers }
				    })
				    .then(function(response) {

				    		var resultado = response.data;
				    		scope.decisionTreeResponse = resultado.decisionTree;
				    		scope.bayesianResponse = resultado.bayesian;
				    		scope.logistic = resultado.logistic;

				            var radios = document.getElementsByName("investorType");
						    for (var i = 0; i < radios.length; i++) {
						        if (radios[i].value === scope.decisionTreeResponse) {
						            radios[i].checked = true;
						        }
						    }
				            scope.quizCompleted = true;
				    },
				    function(error) { // optional
				            // failed
				            console.log("falhou: " + JSON.stringify(error));
				            scope.reset();
				    });
					scope.quizOver = true;
				}
			};

			scope.nextQuestion = function() {
				if(!$('input[name=answer]:checked').length) return;

				scope.listAnswer.push($(":radio[name='answer']").index($(":radio[name='answer']:checked")));

				scope.id++;
				scope.getQuestion();
			}

			scope.sendNewInvestorProfile = function() {
				if(!$('input[name=investorType]:checked').length) return;

				var newInvestorProfile = $('input[name=investorType]:checked').val();
				newInvestorProfile = newInvestorProfile.trim();

				//bayesian;decisionTree;logistic;userDecision
				var message = scope.bayesianResponse + ";" + scope.decisionTreeResponse + ";" + scope.logistic + ";" + newInvestorProfile;

				var newData = {
					input: scope.inputAnswers,
					message
				};

				$http({
				        url: baseUrl + 'newDataSet',
				        method: "POST",
				        data: newData
				    });

				scope.reset();
			}

			scope.reset();
		}
	}
});

app.factory('quizFactory', function() {
	var questions = [
    {
      question: "Qual a sua idade?",
      options: ["60 anos ou mais", "Entre 50 e 59 anos", "Entre 40 e 49 anos",
       "Entre 30 e 39 anos", "Até 30 anos"],
      answer: 0
    },
    {
      question: "Quantos dependentes você possuí?",
      options: ["Mais de 3", "3", "2", "1", "Nenhum"],
      answer: 0
    },
    {
      question: "Quanto do seu patrimônio (dinheiro e bens acumulados) você destina a investimentos financeiros?",
      options: ["Mais de 85%", "Entre 70 e 85%", "Entre 55 e 70%", "Entre 40 e 55%", "Menos de 40%"],
      answer: 0
    },
    {
      question: "Qual o seu grau de interesse em assuntos ligados à Economia e ao Mercado Financeiro?",
      options: ["Nenhum Interesse", "Pouco Interesse", "Relativo Interesse", "Bom Interesse",
       "Muito Interesse"],
      answer: 0
    },
    {
      question: "Quais os tipos de investimentos que você mais se identifica?",
      options: ["Não me identifico com nenhum investimento",
       "Poupança e Títulos emitidos e com garantia do governo",
        "Aplicações de curto prazo, fundos de renda fixa e fundos de ações",
         "Aplicações de curto prazo, fundos de renda fixa, fundos de ações e aplicações diretas em ações (homebroker)",
          "Fundos de Ações, aplicações diretas em ações (homebroker), opções e derivativos"],
      answer: 0
    },
    {
      question: "O que você faria com seus rendimentos obtidos através dos seus investimentos?",
      options: ["Utilizaria para o pagamento de dividas",
       "Complementaria minha renda principal no pagamento de contas",
       "Destinaria esse recurso para o lazer e consumo",
       "Reinvestiria parte desse rendimento",
       "Reinvestiria todo esse rendimento"],
      answer: 0
    },
    {
      question: "Qual a importância da performance diária dos seus investimentos?",
      options: ["Fundamental para a manutenção do padrão de vida",
       "Necessário e importante, contudo não chega a ser fundamental",
       "É importante pois interfere diretamente no crescimento do meu padrão de vida",
        "Possibilidade de elevar meu atual padrão de vida",
         "Indiferente, pois trato como uma diversificação dos meus investimentos"],
      answer: 0
    },
    {
      question: "O que você faria se recebesse uma importância em dinheiro?",
      options: ["Consumiria tudo",
       "Guardaria uma grande parte na poupança e consumiria o restante",
        "Em uma aplicação visando primeiro a segurança e depois a rentabilidade",
         "Em uma aplicação com uma razoável segurança mas que ofereça uma renda um pouco mais elevada",
         "Em uma aplicação visando primeiro a rentabilidade e depois a segurança"],
      answer: 0
    },
    {
      question: "Como você reagiria caso o seu perfil de investimentos escolhido tivesse uma perda de 10%",
      options: ["Considerando que eu não sou adepto a grandes flutuações em meus investimentos, ficaria muito preocupado",
       "Caso o quadro não se revertesse ou apresentasse melhoras consistentes em três meses, ficaria preocupado",
        "Apesar de entender que um investimento com essa rentabilidade negativa tenha uma visão de longo prazo, ainda assim ficaria atento aos próximos resultados",
         "Caso a grande parte da rentabilidade obtida até então fosse mantida, não me preocuparia",
          "Minha única preocupação seria com o resultado no longo prazo e nesse caso, pelo curto espaço de tempo, não me preocuparia"],
      answer: 0
    },
    {
      question: "Caso possuísse recursos investidos no mercado financeiro, quando seria um prazo adequado para resgates destes investimentos?",
      options: ["Até 6 meses", "Entre 6 meses e 1 ano", "Entre 1 e 2 anos",
       "Entre 2 e 4 anos", "Mais de 4 anos"],
      answer: 0
    },
    {
      question: "Diante do seu contato direto ou indireto com temas ligados à Investimentos, Economia e Mercado Financeiro, como você qualificaria seu nível de conhecimento sobre o assunto?",
      options: ["Nenhum conhecimento e com dificuldades sobre o assunto",
       "Pouco conhecimento e algumas dificuldades sobre o assunto",
        "Algum conhecimento e relativa dificuldade sobre o assunto",
         "Bom conhecimento sobre o tema e facilidade sobre o assunto",
          "Muito conhecimento e facilidade sobre o assunto"],
      answer: 0
    }
	];

	return {
		getQuestion: function(id) {
			if(id < questions.length) {
				return questions[id];
			} else {
				return false;
			}
		},
		getSize: function() {
			return questions.length;
		}
	};
});
