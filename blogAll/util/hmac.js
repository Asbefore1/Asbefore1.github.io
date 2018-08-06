const crypto = require('crypto');
const hmac = crypto.createHmac('sha256', 'afjasldfsdjfhsdfha');

module.exports=(str)=>{	
	
	return hmac.digest('hex')
}
