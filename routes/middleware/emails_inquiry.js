var keystone = require( 'keystone' );

exports.sendInquiryCreatedEmailToStaff = ( inquiry, inquiryData, done ) => {

	// find the email template in templates/emails/
	new keystone.Email({
		templateExt 	: 'hbs',
		templateEngine 	: require( 'handlebars' ),
		templateName 	: 'inquiry_staff-notification'
	}).send({
		to: inquiryData.emailAddressesStaff,
		from: {
			name 	: 'MARE',
			email 	: 'admin@adoptions.io'
		},
		subject: 'staff email',
		inquiry: inquiry,
		inquiryData: inquiryData
	// TODO: we should be handling success/failure better, possibly with a flash message if we can make it appear in the model screen
	}, ( err, message ) => {
		// log any errors
		if( err ) {
			console.log( `error sending staff email: ${ err }` );
			done();
		}
		// the response object is stored as the 0th element of the returned message
		const response = message ? message[ 0 ] : undefined;
		// if the email failed to send, or an error occurred ( which is does, rarely ) causing the response message to be empty
		if( response && [ 'rejected', 'invalid', undefined ].includes( response.status ) ) {
			console.log( `staff notification email failed to send: ${ message }` );
			console.log( `error: ${ err }` );
			done();
		}

		console.log( `staff notification email sent successfully` );
		// mark the staff notification email as having been sent to prevent it being sent in the future
		inquiry.emailSentToStaff = true;
		done();
	});

};

exports.sendThankYouEmailToInquirer = ( inquiry, inquiryData, done ) => {
	// find the email template in templates/emails/
	new keystone.Email({
		templateExt 	: 'hbs',
		templateEngine 	: require( 'handlebars' ),
		templateName 	: 'inquiry_thank-you-to-inquirer'
	}).send({
		to: inquiryData.emailAddressInquirer,
		from: {
			name 	: 'MARE',
			email 	: 'admin@adoptions.io'
		},
		subject: 'your inquiry has been received',
		inquiry: inquiry,
		inquiryData: inquiryData
	}, ( err, message ) => {
		// the response object is stored as the 0th element of the returned message
		const response = message ? message[ 0 ] : undefined;
		// if the email failed to send, or an error occurred ( which is does, rarely ) causing the response message to be empty
		if( response && [ 'rejected', 'invalid', undefined ].includes( response.status ) ) {
			console.log( `thank you to inquirer email failed to send: ${ message }` );
			console.log( `error: ${ err }` );
			done();
		}

		console.log( `thank you to inquirer email sent successfully` );
		// mark the inquiry thank you email as having been sent to prevent it being sent in the future
		inquiry.thankYouSentToInquirer = true;
		done();
	});

};

exports.sendThankYouEmailToFamilyOnBehalfOfInquirer = ( inquiry, inquiryData, done ) => {
	// find the email template in templates/emails/
	new keystone.Email({
		templateExt 	: 'hbs',
		templateEngine 	: require( 'handlebars' ),
		templateName 	: 'inquiry_thank-you-to-family-on-behalf-of-social-worker'
	}).send({
		to: inquiryData.emailAddressFamilyOnBehalfOf,
		from: {
			name 	: 'MARE',
			email 	: 'admin@adoptions.io'
		},
		subject: 'your inquiry has been received',
		inquiry: inquiry,
		inquiryData: inquiryData
	}, ( err, message ) => {
		// the response object is stored as the 0th element of the returned message
		const response = message ? message[ 0 ] : undefined;
		// if the email failed to send, or an error occurred ( which is does, rarely ) causing the response message to be empty
		if( response && [ 'rejected', 'invalid', undefined ].includes( response.status ) ) {
			console.log( `thank you to family on behalf of inquirer email failed to send: ${ message }` );
			console.log( `error: ${ err }` );
			done();
		}

		console.log( `thank you to family on behalf of inquirer email sent successfully` );
		// mark the inquiry thank you email as having been sent to prevent it being sent in the future
		inquiry.thankYouSentToFamilyOnBehalfOfInquirer = true;
		done();
	});

};

exports.sendInquiryAcceptedEmailToInquirer = ( inquiry, inquiryData, done ) => {
	// find the email template in templates/emails/
	new keystone.Email({
		templateExt 	: 'hbs',
		templateEngine 	: require( 'handlebars' ),
		templateName 	: 'inquiry_inquiry-accepted-to-inquirer'
	}).send({
		to: inquiryData.emailAddressInquirer,
		from: {
			name 	: 'MARE',
			email 	: 'admin@adoptions.io'
		},
		subject: 'inquiry information for inquirer',
		inquiry: inquiry,
		inquiryData: inquiryData
	}, function() {
		// the first element is an array with the 0th element being the response object
		const response = arguments[ 1 ] ? arguments[ 1 ][ 0 ] : undefined;

		if( response && [ 'rejected', 'invalid' ].includes( response.status ) ) {
			console.log( `inquiry accepted email to inquirer failed to send: ${ arguments[ 1 ] }` );
			console.log( `error: ${ error }`);
			done();
		}
		console.log( `inquiry accepted email successfully sent to inquirer` );
		// mark the inquiry accepted email as having been sent to the inquirer to prevent it being sent in the future
		inquiry.emailSentToInquirer = true;
		done();
	});

};

exports.sendInquiryAcceptedEmailToChildsSocialWorker = ( inquiry, inquiryData, done ) => {
	// find the email template in templates/emails/
	new keystone.Email({
		templateExt 	: 'hbs',
		templateEngine 	: require( 'handlebars' ),
		templateName 	: 'inquiry_inquiry-accepted-to-social-worker'
	}).send({
		to: inquiryData.emailAddressChildsSocialWorker,
		from: {
			name 	: 'MARE',
			email 	: 'admin@adoptions.io'
		},
		subject: 'inquiry information for social worker',
		inquiry: inquiry,
		inquiryData: inquiryData
	}, function() {
		// the first element is an array with the 0th element being the response object
		const response = arguments[ 1 ] ? arguments[ 1 ][ 0 ] : undefined;

		if( response && [ 'rejected', 'invalid' ].includes( response.status ) ) {
			console.log( `inquiry accepted email to social worker failed to send: ${ arguments[ 1 ] }` );
			console.log( `error: ${ error }` );
			done();
		}
		console.log( `inquiry accepted email successfully sent to child's social worker` );
		// mark the inquiry accepted email as having been sent to the social worker to prevent it being sent in the future
		inquiry.emailSentToChildsSocialWorker = true;
		done();
	});
};

exports.sendInquiryAcceptedEmailToAgencyContacts = ( inquiry, inquiryData, done ) => {
	// find the email template in templates/emails/
	new keystone.Email({
		templateExt 	: 'hbs',
		templateEngine 	: require( 'handlebars' ),
		templateName 	: 'inquiry_inquiry-accepted-to-agency-contact'
	}).send({
		to: inquiryData.emailAddressesAgencyContacts,
		from: {
			name 	: 'MARE',
			email 	: 'admin@adoptions.io'
		},
		subject: 'inquiry information for agency contact',
		inquiry: inquiry,
		inquiryData: inquiryData
	}, function() {
		// the first element is an array with the 0th element being the response object
		const response = arguments[ 1 ] ? arguments[ 1 ][ 0 ] : undefined;

		if( response && [ 'rejected', 'invalid' ].includes( response.status ) ) {
			console.log( `inquiry accepted email to agency contacts failed to send: ${ arguments[ 1 ] }` );
			console.log( `error: ${ error }` );
			done();
		}
		console.log( `inquiry accepted email successfully sent to agency contacts` );
		// mark the inquiry accepted email as having been sent to the agency contacts to prevent it being sent in the future
		inquiry.emailSentToAgencies = true;
		done();
	});
};