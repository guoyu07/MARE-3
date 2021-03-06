var keystone = require('keystone'),
	Types = keystone.Field.Types;

// Create model. Additional options allow menu name to be used what auto-generating URLs
var SlideshowItem = new keystone.List('Slideshow Item', {
	autokey: { path: 'key', from: 'heading', unique: true },
	map: { name: 'heading' }
});

// Create fields
SlideshowItem.add({

	image: { type: Types.CloudinaryImage, folder: 'slideshow/', select: true, selectPrefix: 'slideshow/', autoCleanup: true }, // TODO: add publicID attribute for better naming in Cloudinary
	imageStretched: {type: Types.Url, hidden: true},
	imageScaled: {type: Types.Url, hidden: true},
	parent: { type: Types.Relationship, label: 'slideshow', ref: 'Slideshow', initial: true },
	heading: { type: Types.Text, label: 'heading', initial: true },
	subHeading: { type: Types.Text, label: 'sub-heading', initial: true },
	guideLabel: { type: Types.Text, label: 'label', initial: true},
	order: { type: Types.Number, label: 'order', initial: true }

});

// Pre Save
SlideshowItem.schema.pre('save', function(next) {
	'use strict';

	this.imageStretched = this._.image.scale(1050,500,{ quality: 80 });
	this.imageScaled = this._.image.thumbnail(1050,500,{ quality: 80 });
	// TODO: Consider formatting the order to 0,0

	next();
});

// Define default columns in the admin interface and register the model
SlideshowItem.defaultColumns = 'heading, order, parent';
SlideshowItem.register();