//only include questions which require a logical branch (yes/no answer)
var questionTree = { //logic branches, keyed by question number
	0:{
		"next":1,
	},
	1:{
		"yes":2,
		"no":3,
	},
	2:{
		"next":4,
	},
	3:{
		"next":4,
	},
	4:{
		"next":-1, //-1 signals end of questions
	},
};
