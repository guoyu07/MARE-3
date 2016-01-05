var keystone = require('keystone'),
	Types = keystone.Field.Types;

// Create model. Additional options allow menu name to be used what auto-generating URLs
var EventType = new keystone.List('Event Type', {
	autokey: { path: 'key', from: 'eventType', unique: true },
	map: { name: 'eventType' }
});

// Create fields
EventType.add({

	eventType: { type: String, label: 'Event Type', required: true, index: true, initial: true }
	
});

// Define default columns in the admin interface and register the model
EventType.defaultColumns = 'eventType';
EventType.register();