const keystone			= require( 'keystone' );
const Types				= keystone.Field.Types;

// create model
var Featured = new keystone.List( 'Featured Item', {
	autokey: { path: 'key', from: 'title', unique: true },
	map: { name: 'title' }
});

// create fields
Featured.add({

	title: { type: Types.Text, label: 'title', default: 'Featured Items', noedit: true, initial: true }

}, 'About Us', {

	aboutUs: {
		target: { type: Types.Relationship, ref: 'Page', label: 'about us page', filter: { type: 'aboutUs' }, required: true, initial: true },
		image: { type: Types.CloudinaryImage, label: 'about us image', folder: 'featured/', select: true, selectPrefix: 'featured/', publicID: 'aboutUsFileName', autoCleanup: true }, // TODO: add publicID attribute for better naming in Cloudinary
		title: { type: Types.Text, hidden: true, noedit: true },
		imageScaled: { type: Types.Url, hidden: true },
		url: { type: Types.Url, label: 'about us url', noedit: true }
	}

}, 'Success Story', {

	successStory: {
		target: { type: Types.Relationship, ref: 'Success Story', label: 'success story', required: true, initial: true },
		image: { type: Types.CloudinaryImage, label: 'success story image', folder: 'featured/', select: true, selectPrefix: 'featured/', publicID: 'successStoryFileName', autoCleanup: true }, // TODO: add publicID attribute for better naming in Cloudinary
		title: { type: Types.Text, hidden: true, noedit: true },
		imageScaled: { type: Types.Url, hidden: true },
		url: { type: Types.Url, label: 'success story url', noedit: true }
	}

}, 'Upcoming Event', {

	event: {
		target: { type: Types.Relationship, ref: 'Event', label: 'event', filters: { isActive: true }, required: true, initial: true },
		image: { type: Types.CloudinaryImage, label: 'event image', folder: 'featured/', select: true, selectPrefix: 'featured/', publicID: 'eventFileName', autoCleanup: true }, // TODO: add publicID attribute for better naming in Cloudinary
		title: { type: Types.Text, hidden: true, noedit: true },
		imageScaled: { type: Types.Url, hidden: true },
		url: { type: Types.Url, label: 'event url', noedit: true }
	}
/* container for all system fields (add a heading if any are meant to be visible through the admin UI) */
}, {

	// system fields to store an appropriate file prefix
	aboutUsFileName: { type: Types.Text, hidden: true },
	successStoryFileName: { type: Types.Text, hidden: true },
	eventFileName: { type: Types.Text, hidden: true }

});

// pre save
Featured.schema.pre( 'save', function( next ) {
	'use strict';

	// create objects of values to pass into the updateFieldsFunction
	const aboutUsOptions		= { id: this.aboutUs.target, targetModel: 'Page', field: 'aboutUs', title: 'title' },
		  successStoryOptions	= { id: this.successStory.target, targetModel: 'Success Story', field: 'successStory', title: 'heading', url: '/success-stories/' },
		  eventOptions			= { id: this.event.target, targetModel: 'Event', field: 'event', title: 'name' };
	// call updateFields for each of the three main model sections and receive a promise back for each
	const aboutUsUpdated		= this.updateFields( aboutUsOptions );
	const successStoryUpdated	= this.updateFields( successStoryOptions );
	const eventUpdated			= this.updateFields( eventOptions );
	// once all three model sections have been updated
	Promise.all( [ aboutUsUpdated, successStoryUpdated, eventUpdated ] ).then( () => {
		// create identifying names for file uploads
		this.setFileNames();

		next();
	});
});

Featured.schema.methods.setFileNames = function setFileNames() {
	'use strict';
	// pull the title from each of featured item
	const aboutUsTitle		= this.aboutUs.title,
		  successStoryTitle	= this.successStory.title,
		  eventTitle		= this.event.title;
	// generate a readable file name for each featured item
	this.aboutUsFileName		= aboutUsTitle ?
									`about-us_${ aboutUsTitle.toLowerCase().replace( /\s/g, '-' ) }` :
									'about-us_no-page';

	this.successStoryFileName	= successStoryTitle ?
									`success-story_${ successStoryTitle.toLowerCase().replace( /\s/g, '-' ) }` :
									'success-story_no-page';

	this.eventFileName			= eventTitle ?
									`event_${ eventTitle.toLowerCase().replace( /\s/g, '-' ) }` :
									'event_no-page';
};

Featured.schema.methods.updateFields = function updateFields( { id, targetModel, field, title, url } ) {
	// return a promise for cleaner asynchronous processing
	return new Promise( ( resolve, reject ) => {
		// if selection was made, we won't have an _id, abort execution and resolve with an undefined value
		if( !id ) {
			return resolve();
		}
		// fetch the model specified in the field using it's _id value
		keystone.list( targetModel ).model
				.findById( id )
				.exec()
				.then( model => {
					// if we can't find the model (it may have been deleted since last save), abort execution and resolve with an undefined value
					if( !model ) {
						return resolve();
					}
					// populate the related fields
					this[ field ].title = model.get( title );
					this[ field ].url = url ? url : model.get( 'url' );
					// this may be confusing, but it's the same as this._.aboutUs.image.thumbnail(...) if field were 'aboutUs'
					this[ field ].imageScaled = this._[ field ].image.thumbnail( 640,640,{ quality: 100 } );
					// resolve with the _id of model for easy refetching further down the line
					resolve( model.get( '_id' ) );

				}, err => {
					// if there was an error while fetching the model, reject the promise and return the error 
					reject( err );
				});
	});
};

// define default columns in the admin interface and register the model
Featured.defaultColumns = 'title, aboutUs.target, successStory.target, event.target';
Featured.register();