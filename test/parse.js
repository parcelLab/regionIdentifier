const fs = require('fs');

// var parses = {
//  	'Alsace-Champagne-Ardenne-Lorraine': 'FR-A',
//  	'Aquitaine-Limousin-Poitou-Charentes': 'FR-B',
//  	'Auvergne-Rhône-Alpes': 'FR-C',
//  	'Bourgogne-Franche-Comté':'FR-D',
// 	'Bretagne': 'FR-E',
// 	'Île-de-France': 'FR-J',
// 	'Corse':'FR-H',
// 	'Normandy': 'FR-Q',
// 	'Centre': 'FR-F',
// 	'Languedoc-Roussillon-Midi-Pyrénées': 'FR-K',
// 	'Nord-Pas-de-Calais-Picardie': 'FR-O',
// 	'Pays de la Loire':'FR-R',
// 	'Provence-Alpes-Côte d\'Azur': 'FR-U',
// };

// var parses = {
// 	'Abruzzi': 'IT-65',
// 	'Basilicata': 'IT-77',
// 	'Calabria': 'IT-78',
// 	'Campania': 'IT-72',
// 	'Emilia-Romagna':'IT-45',
// 	'Friuli-Venezia Giulia':'IT-36',
// 	'Lazio': 'IT-62',
// 	'Liguria': 'IT-42',
// 	'Lombardia': 'IT-25',
// 	'Marche': 'IT-57',
// 	'Molise': 'IT-67',
// 	'Piemonte': 'IT-21',
// 	'Puglia': 'IT-75',
// 	'Sardegna': 'IT-88',
// 	'Sicilia': 'IT-82',
// 	'Toscana': 'IT-52',
// 	'Trentino-Alto Adige': 'IT-32',
// 	'Umbria': 'IT-55',
// 	'Valle D\'Aosta': 'IT-23',
// 	'Veneto': 'IT-34',
// };

// var parses = {
// 	'Provincie Drenthe': 'NL-DR',
// 	'Provincie Friesland':'NL-FR',
// 	'Provincie Flevoland': 'NL-FL',
// 	'Provincie Gelderland': 'NL-GE',
// 	'Provincie Groningen': 'NL-GR',
// 	'Provincie Limburg': 'NL-LI',
// 	'Provincie Noord-Brabant': 'NL-NB',
// 	'Provincie Noord-Holland': 'NL-NH',
// 	'Provincie Utrecht': 'NL-UT',
// 	'Provincie Overijssel':' NL-OV',
// 	'Provincie Zeeland': 'NL-ZE',
// 	'Provincie Zuid-Holland':'NL-ZH',
// };

// var parses = {
// 	'AG': 'CH-AG',
// 	'AR': 'CH-AR',
// 	'AI': 'CH-AI',
// 	'BL': 'CH-BL',
// 	'BS': 'CH-BS',
// 	'BE': 'CH-BE',
// 	'FR': 'CH-FR',
// 	'GE': 'CH-GE',
// 	'GL': 'CH-GL',
// 	'GR': 'CH-GR',
// 	'JU': 'CH-JU',
// 	'LU': 'CH-LU',
// 	'NE': 'CH-NE',
// 	'NW': 'CH-NW',
// 	'OW': 'CH-OW',
// 	'SG': 'CH-SG',
// 	'SH': 'CH-SH',
// 	'SZ': 'CH-SZ',
// 	'SO': 'CH-SO',
// 	'TG': 'CH-TG',
// 	'TI': 'CH-TI',
// 	'UR': 'CH-UR',
// 	'VS': 'CH-VS',
// 	'VD': 'CH-VD',
// 	'ZG': 'CH-ZG',
// 	'ZH': 'CH-ZH',
// };

var parses = {
	'BRU': 'BE-BRU',
	'VLG': 'BE-VLG',
	'WAL': 'BE-WAL',
};

fs.readFile('../BE.txt', function(err, data) {
	data = data.toString().split('\n');
	var result = [];
	var haveIt= [];
	data.forEach(function(code) {
		code = code.split('	');
		var parse = parses[code[4]];
		if(!code[1] || !parse) return console.log(code[4]);
		var postalCode = code[1].match(/[0-9]{4,}/)[0];
		var found = haveIt.filter((e) => {return e === postalCode; })[0];
		if(found) return;
		haveIt.push(postalCode);
		result.push({
			low: postalCode,
			// high: postalCode,
			region: parse,
		});
	});

	var bounds = {
		'BE-BRU': {
			min:99999,
			max: 0,
		},
		'BE-VLG': {
			min:99999,
			max: 0,
		},
		'BE-WAL': {
			min:99999,
			max: 0,
		},
	};

	result.forEach(function(res) {
		var bound = bounds[res.region];
		if(res.region === 'undefined' || !bound) return;
		if(res.low < bound.min)
			bound.min = res.low;
		if(res.high > bound.max)
			bound.max = res.high;
	});
	fs.writeFile('../regions/BEL.json', JSON.stringify(result), console.log);
});