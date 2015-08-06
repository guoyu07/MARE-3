/**
 * This file contains the common middleware used by your routes.
 * 
 * Extend or replace these functions as your application requires.
 * 
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */

var _ = require('underscore');

// Load in Keystone for model references
// var keystone = require('keystone');

/**
	Initialises the standard view locals
	
	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/

exports.initLocals = function(req, res, next) {
	'use strict';

	var locals = res.locals;

	locals.navLinks = [
		{ label: 'Home', key: 'home', href: '/' }
	];

	locals.user = req.user;

	// Create the site menu navigation elements
	locals.siteNav = [
		{ title: 'About us', href: '/page/about-us' },
		{ title: 'Our Services', href: '/page/our-services' },
		{ title: 'Success Stories', href: '/page/success-stories' },
		{ title: 'Upcoming Events', href: '/page/upcoming-events' }
	];

	// Create the main menu navigation.
	locals.mainNav = [
		{ title: 'Considering Adoption?', subMenu: [
			{ title: 'Types of Adoption', href: '/page/types-of-adoption' },
			{ title: 'Can I adopt a Child from Foster Care?', href: '/page/can-i-adopt-a-child-from-foster-care' },
			{ title: 'Steps in the Process', href: '/page/steps-in-the-process' },
			{ title: 'How Can MARE Help?', href: '/page/how-can-mare-help' }
		]},
		{ title: 'Meet the Children', subMenu: [
			{ title: 'Who are the Children?', href: '/page/who-are-the-children' },
			{ title: 'Waiting Child Profiles', href: '/page/waiting-child-profiles' },
			{ title: 'Other Ways to Meet Waiting Children', href: '/page/ways-to-meet-waiting-children' },
			{ title: 'For Homestudied Families', href: '/page/for-homestudied-families' }
		]},
		{ title: 'Family Support Services', subMenu: [
			{ title: 'How Does MARE Support Families', href: '/page/how-does-mare-support-families' },
			{ title: 'Friend of the Family Mentor Program', href: '/page/friend-of-the-family-mentor-program' },
			{ title: 'Other Family Support Services', href: '/page/other-family-support-services' }
		]},
		{ title: 'For Social Workers', subMenu: [
			{ title: 'Register a Child', href: '/page/register-a-child' },
			{ title: 'How MARE can Help You', href: '/page/how-mare-can-help-you'},
			{ title: 'Recruitment Opportunities', href: '/page/recruitment-opportunities' },
			{ title: 'Attend Events', href: '/page/attend-events' },
			{ title: 'Register a Family', href: '/page/register-a-family' },
			{ title: 'Use Online Matching', href: '/page/use-online-matching' }
		]},
		{ title: 'Ways to Help', subMenu: [
			{ title: 'For Individuals', href: '/page/for-individuals' },
			{ title: 'For Businesses', href: '/page/for-businesses' },
			{ title: 'Experienced Families', href: '/page/experienced-families' },
			{ title: 'Walk for Adoption & Other Events', href: '/page/walk-for-adoption-and-other-events' },
			{ title: 'Donate Your Car', href: '/page/donate-your-car' },
			{ title: 'Creative Ways to Support MARE', subMenu: [
				{ title: 'Host a Workplace Lunch & Learn', href: '/page/host-a-workplace-lunch-and-learn' },
				{ title: 'Another Creative Way to Help', href: '/page/another-creative-way-to-help' },
				{ title: 'Yet a Third Way to Help', href: '/page/yet-a-third-way-to-help' },
				{ title: 'And Even a Fourth Way', href: '/page/and-even-a-fourth-way' }
			]}
		]}];

	next();
};

/**
	Fetches and clears the flashMessages before a view is rendered
*/

exports.flashMessages = function(req, res, next) {
	'use strict';
	
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error')
	};
	
	res.locals.messages = _.any(flashMessages, function(msgs) { return msgs.length; }) ? flashMessages : false;
	
	next();
	
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */

exports.requireUser = function(req, res, next) {
	'use strict';
	
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
	
};