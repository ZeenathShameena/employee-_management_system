const jwt = require('jsonwebtoken');

exports.identifier = (req, res, next) => {
	let token;
	if ( req.headers.authorization) {
		token = req.headers.authorization;
	} else {
		token = req.cookies['Authorization'];
	}

	if (!token) {
		return res.status(403).json({ success: false, message: 'No token provided' });
	}

	try {
		const userToken = token.split(' ')[1];
		const jwtVerified = jwt.verify(userToken, process.env.TOKEN_SECRET);
		if (jwtVerified) {
			req.user = jwtVerified;
			next();
		} else {
			throw new Error('error in the token');
		}
	} catch (error) {
		console.log(error);
		res.status(403).json({ message: 'Invalid or expired token' });
	}
};



// Authorization Middleware: Checks allowed roles
exports.authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied: insufficient role' });
  }
  next();
};



