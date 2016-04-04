/**
 * This script automatically creates a default Admin user when an
 * empty database is used for the first time. You can use this
 * technique to insert data into any List you have defined.
 *
 * Alternatively, you can export a custom function for the update:
 * module.exports = function(done) { ... }
 */

exports.create = {
	Admin: [{
		permissions: {
			isVerified: true,
			isActive: true
		},
		name: {
			first: 'Admin',
			last: 'User'
		},
		password: 'admin',
		email: 'admin@keystonejs.com'
	},{
		permissions: {
			isVerified: true,
			isActive: true
		},
		name: {
			first: 'Jared',
			last: 'Collier'
		},
		password: 'JaredCollier',
		email: 'jared.j.collier@gmail.com'
	},{
		permissions: {
			isVerified: true,
			isActive: true
		},
		name: {
			first: 'Tom',
			last: 'Koch'
		},
		password: 'TomKoch',
		email: 'tommysalsa@gmail.com'
	},{
		permissions: {
			isVerified: true,
			isActive: true
		},
		name: {
			first: 'Guillermo',
			last: 'Martin'
		},
		password: 'GuillermoMartin',
		email: 'guillermo.mare@gmail.com'
	},{
		permissions: {
			isVerified: true,
			isActive: true
		},
		name: {
			first: 'Lisa',
			last: 'Funaro'
		},
		password: 'LisaFunaro',
		email: 'lisafd4@gmail.com'
	}]
};