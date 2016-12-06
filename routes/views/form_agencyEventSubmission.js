// TODO: break these each into their own routes, combining all these forms is going to be a mess once we start processing their expected actions
var keystone		= require( 'keystone' ),
	async			= require( 'async' ),
	listsService	= require( '../middleware/service_lists' ),
	pageService		= require( '../middleware/service_page' );

exports = module.exports = ( req, res ) => {
	'use strict';

	const view 			= new keystone.View( req, res );

	const locals 		= res.locals;
	// objects with additional search parameters
	const stateOptions	= { default: 'Massachusetts' };

	async.parallel([
		done => { listsService.getAllStates( req, res, done, stateOptions ) },
		done => { pageService.populateSidebar( req, res, done ); },
		done => { pageService.getSectionHeader( req, res, done, 'About Us' ); }
	], () => {
		// Set the layout to render with the right sidebar
		locals[ 'render-with-sidebar' ] = true;
		// Render the view once all the data has been retrieved
		view.render( 'form_agency-event-submission.hbs' );
	}, err => {

		console.log( err );
	});
};
