const jwt = require('jsonwebtoken');
const admin = require('../model/admin');
const Employee = require('../model/employee');
const Department = require('../model/department');



const {
	signupSchema,
	acceptFPCodeSchema,
} = require('../middlewares/validator');
const { doHash, doHashValidation, hmacProcess } = require('../utils/hashing');
const transport = require('../middlewares/sendMail');


exports.registerAdmin = async (req, res) => {
	const { name, email, password, role} = req.body;
	try {

		 const { error, value } = signupSchema.validate({ email, password });
		 if (error) {
		 	return res
		 		.status(401)
		 		.json({ success: false, error: error.details[0].message });
		 }

		const existingUser = await admin.findOne({ email });
		if (existingUser) {
			return res
				.status(401)
				.json({ success: false, error: 'eamil already exists!' });
		}

		const hashedPassword = await doHash(password, 12);
		const newUser = new admin({
				name,
				email,
				password: hashedPassword,
				role,
			});	
		const result = await newUser.save();
		result.password = undefined;
		res
		.status(201).json({
			success: true,
			message: 'Your account has been created successfully',
			result,
		});
	} catch (error) {
		console.log(error);
		return res .json({ success: false, error: error, message: "Error registering admin"});

	}
};


exports.signin = async (req, res) => {
	const { email, password } = req.body;
	try {
		let existingUser = await admin.findOne({ email }).select('+password');
		if (!existingUser) {
             existingUser = await Employee.findOne({ email }).select('+password');
		}
		if (!existingUser) {
				return res
					.status(401)
					.json({ success: false, error: 'User does not exists!' });
		}
		
		const result = await doHashValidation(password, existingUser.password);
		if (!result) {
			return res
				.status(402)
				.json({ success: false, message: 'Invalid Password!' });
		}
		const role=existingUser.role;
		const userId=existingUser._id;
		const name = [existingUser.firstName, existingUser.lastName].filter(Boolean).join(' ')
		const token = jwt.sign(
			{
				name,
				role,
				userId,
				email
			},
			process.env.TOKEN_SECRET,
			{
				expiresIn: '8h',
			}
		);
		res
			.cookie('Authorization', 'Bearer ' + token, {
				expires: new Date(Date.now() + 8 * 3600000),
				httpOnly: process.env.NODE_ENV === 'production',
				secure: process.env.NODE_ENV === 'production',
			})
			.json({
				success: true,
				message: "login successfull",
				role,
				token,
				userId
			});
	} catch (error) {
		console.log(error);
		return res .json({ success: false, error: error, message: "Error during login"});
	}
};


exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { userId, role } = req.user; 

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Old and new password are required' });
    }

    // Find user from correct collection
    let userModel = role === 'admin' ? admin : Employee;
    const user = await userModel.findById(userId).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await doHashValidation(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Old password is incorrect' });
    }

    const hashedNewPassword = await doHash(newPassword, 12);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });

  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.sendForgotPasswordCode = async (req, res) => {
	const { email } = req.body;
	try {
		const existingUser = await admin.findOne({ email });
		if (!existingUser) {
			return res
				.status(404)
				.json({ success: false, error: 'admin does not exists!' });
		}

		const codeValue = Math.floor(Math.random() * 1000000).toString();
		let info = await transport.sendMail({
			from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
			to: existingUser.email,
			subject: 'Forgot password code',
			html:
			 `<h1>Your Code to reset ABC Consulting service Admin Password ${codeValue}</h1>`,
		});

		if (info.accepted[0] === existingUser.email) { // it lists the emails successfully accepted by the mail server.
			const hashedCodeValue = hmacProcess(
				codeValue,
				process.env.HMAC_VERIFICATION_CODE_SECRET
			);
			existingUser.forgotPasswordCode = hashedCodeValue;
			existingUser.forgotPasswordCodeValidation = Date.now();
			await existingUser.save();
			return res.status(200).json({ success: true, message: 'Code sent!' });
		}
		res.status(400).json({ success: false, error: 'Code sent failed!' });
	} catch (error) {
		console.log(error);
	}
};

exports.verifyForgotPasswordCode = async (req, res) => {
	const { email, providedCode, newPassword } = req.body;
	try {
		const { error, value } = acceptFPCodeSchema.validate({
			email,
			providedCode,
			newPassword,
		});
		if (error) {
			return res
				.status(401)
				.json({ success: false, error: error.details[0].message });
		}

		const codeValue = providedCode.toString();
		const existingUser = await admin.findOne({ email }).select(
			'+forgotPasswordCode +forgotPasswordCodeValidation'
		);

		if (!existingUser) {
			return res
				.status(401)
				.json({ success: false, error: 'admin does not exists!' });
		}

		if (
			!existingUser.forgotPasswordCode ||
			!existingUser.forgotPasswordCodeValidation
		) {
			return res
				.status(400)
				.json({ success: false, error: 'something is wrong with the code!' });
		}

		if (
			Date.now() - existingUser.forgotPasswordCodeValidation >
			5 * 60 * 1000
		) {
			return res
				.status(400)
				.json({ success: false, error: 'code has been expired!' });
		}

		const hashedCodeValue = hmacProcess(
			codeValue,
			process.env.HMAC_VERIFICATION_CODE_SECRET
		);

		if (hashedCodeValue === existingUser.forgotPasswordCode) {
			const hashedPassword = await doHash(newPassword, 12);
			existingUser.password = hashedPassword;
			existingUser.forgotPasswordCode = undefined;
			existingUser.forgotPasswordCodeValidation = undefined;
			await existingUser.save();
			return res
				.status(200)
				.json({ success: true, message: 'Password updated!!' });
		}
		return res
			.status(400)
			.json({ success: false, error: 'unexpected occured!!' });
	} catch (error) {
		console.log(error);
		return res .json({ success: false, error: error, message: "Error with verify froget password"});
	}
};


exports.logout = (req, res) => {
  res.clearCookie('Authorization');
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
};


exports.getCounts = async (req, res) => {
  try {
    const employeeCount = await Employee.countDocuments();
    const departmentCount = await Department.countDocuments();

    res.status(200).json({
      success: true,
      totalEmployees: employeeCount,
      totalDepartments: departmentCount
    });
  } catch (error) {
    console.error('Error fetching counts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};