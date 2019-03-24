

const byDefault = (sQty) => {
	
	var gcd = function(a, b) {
		if (b < 0.0000001) return a;
	
		return gcd(b, Math.floor(a % b));
	};
	
	var fraction = sQty;
	var len = fraction.toString().length - 2;
	
	var denominator = Math.pow(10, len);
	var numerator = fraction * denominator;
	
	var divisor = gcd(numerator, denominator);   
	
	numerator /= divisor;                        
	denominator /= divisor;                      

	return Math.floor(numerator) + '/' + Math.floor(denominator);

};
 

const closeEnough = function(a, b) {
	return Math.abs(a - b) < 0.009;
};

export const formatQuantity = function(sInQty) {

	sQty = sInQty;

	// bomb out if not a number
	if (isNaN(sQty)) {

		return '-1';
	}

	var dQty = sQty - 0;

	if (dQty === 0) {

		return '';
	}

	var iFloor = Math.floor(dQty);
	var sFloor = (iFloor === 0.0 ? '' : iFloor + ' ');
	var dDecimal = dQty - iFloor;

	// Handle integers first.  Just return the given value.
	if (dDecimal === 0) {

		return sInQty + '';
	}

	// Handle infinitely repeating decimals next, since
	// we'll never get an exact match for a switch case:
	if (closeEnough(dDecimal, 0.3)) {

		sQty = sFloor + '1/3';

	} else if (closeEnough(dDecimal, 0.66)) {

		sQty = sFloor + '2/3';

	} else if (closeEnough(dDecimal, 0.2)) {

		sQty = sFloor + '1/5';

	} else if (closeEnough(dDecimal, 0.4)) {

		sQty = sFloor + '2/5';

	} else if (closeEnough(dDecimal, 0.6)) {

		sQty = sFloor + '3/5';

	} else if (closeEnough(dDecimal, 0.7)) {

		sQty = sFloor + '3/4';

	} else if (closeEnough(dDecimal, 0.8)) {

		sQty = sFloor + '4/5';

	} else {

		switch (dDecimal) {
			case 0.125: sQty = sFloor + '1/8'; break;
			case 0.2:   sQty = sFloor + '1/5'; break;
			case 0.25:  sQty = sFloor + '1/4'; break;
			case 0.3:   sQty = sFloor + '1/3'; break; // *
			case 0.4:   sQty = sFloor + '2/5'; break;
			case 0.5:   sQty = sFloor + '1/2'; break;
			case 0.6:   sQty = sFloor + '3/5'; break;
			case 0.625: sQty = sFloor + '5/8'; break;
			case 0.7:   sQty = sFloor + '3/4'; break; // *
			case 0.8:   sQty = sFloor + '4/5'; break;
			case 0.9: sQty = sFloor + '1'; break;
			default:
				if(sFloor) {
					sQty = sQty;
				} else {
					sQty = byDefault(sQty);
				}
				
		}
	}

	return sQty + '';
	
};
