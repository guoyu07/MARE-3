var keystone = require('keystone'),
	Types = keystone.Field.Types;

// Create model
var Child = new keystone.List('Child', {
	track: true,
	autokey: { path: 'key', from: 'registrationNumber', unique: true },
	map: { name: 'name.full' },
	defaultSort: 'name.full'
});

// Create fields
Child.add('Child Information', {
	registrationNumber: { type: Number, label: 'registration number', format: false, required: true, initial: true },
	registrationDate: { type: Types.Text, label: 'registration date', note: 'mm/dd/yyyy', required: true, initial: true },

	video: { type: Types.Url, label: 'Video' },

	name: {
		first: { type: Types.Text, label: 'first name', required: true, initial: true },
		middle: { type: Types.Text, label: 'middle name', initial: true },
		last: { type: Types.Text, label: 'last name', required: true, initial: true },
		alias: { type: Types.Text, label: 'alias', initial: true },
		nickName: { type: Types.Text, label: 'nickname', initial: true },
		full: { type: Types.Text, label: 'name', hidden: true, noedit: true, initial: false }
	},

	birthDate: { type: Types.Text, label: 'date of birth', note: 'mm/dd/yyyy', required: true, initial: true },
	language: { type: Types.Relationship, label: 'language', ref: 'Language', many: true, required: true, initial: true },
	statusChangeDate: { type: Types.Text, label: 'status change date', note: 'mm/dd/yyyy', initial: true }, // TODO: Logic needed, see line 14 of https://docs.google.com/spreadsheets/d/1Opb9qziX2enTehJx5K1J9KAT7v-j2yAdqwyQUMSsFwc/edit#gid=1235141373
	status: { type: Types.Relationship, label: 'status', ref: 'Child Status', required: true, initial: true },
	gender: { type: Types.Relationship, label: 'gender', ref: 'Gender', required: true, initial: true },
	race: { type: Types.Relationship, label: 'race', ref: 'Race', many: true, required: true, initial: true },
	legalStatus: { type: Types.Relationship, label: 'legal status', ref: 'Legal Status', required: true, initial: true },
	yearEnteredCare: { type: Types.Text, label: 'year entered care', note: 'yyyy', initial: true },

	hasContactWithSiblings: { type: Types.Boolean, label: 'has contact with siblings?', initial: true },
	siblingTypeOfContact: { type: Types.Text, label: 'type of contact', initial: true },
	siblingContacts: { type: Types.Relationship, label: 'siblings to be placed together (comma separated)', ref: 'Child', many: true, initial: true },
	hasContactWithBirthFamily: { type: Types.Boolean, label: 'has contact with birth family?', initial: true },
	birthFamilyTypeOfContact: { type: Types.Text, label: 'type of contact', initial: true },

	residence: { type: Types.Relationship, label: 'where does the child presently live?', ref: 'Residence', initial: true },
	city: { type: Types.Relationship, label: 'city/town of child\'s current location', ref: 'City or Town', initial: true },
	careFacilityName: { type: Types.Text, label: 'name of residential/group care facility', initial: true },
	dateMovedToResidence: { type: Types.Text, label: 'date moved to current residence', note: 'mm/dd/yyyy', required: true, initial: true }

}, 'Special Needs', {

	physicalNeeds: { type: Types.Select, label: 'physical needs', options: 'none, mild, moderate, severe', required: true, initial: true },
	physicalNeedsDescription: { type: Types.Textarea, label: 'description of physical needs', dependsOn: { physicalNeeds: ['mild', 'moderate', 'severe'] }, initial: true },
	emotionalNeeds: { type: Types.Select, label: 'emotional needs', options: 'none, mild, moderate, severe', required: true, initial: true },
	emotionalNeedsDescription: { type: Types.Textarea, label: 'description of emotional needs', dependsOn: { emotionalNeeds: ['mild', 'moderate', 'severe'] }, initial: true },
	intellectualNeeds: { type: Types.Select, label: 'intellectual needs', options: 'none, mild, moderate, severe', required: true, initial: true },
	intellectualNeedsDescription: { type: Types.Textarea, label: 'description of intellectual needs', dependsOn: { intellectualNeeds: ['mild', 'moderate', 'severe'] }, initial: true },

	disabilities: { type: Types.Relationship, label: 'disabilities', ref: 'Disability', many: true, initial: true },

	specialNeedsNotes: { type: Types.Textarea, label: 'notes', dependsOn: { physicalNeeds: ['mild', 'moderate', 'severe'], emotionalNeeds: ['mild', 'moderate', 'severe'], intellectualNeeds: ['mild', 'moderate', 'severe'] }, initial: true }
	// specialNeedsNotes: { type: Types.Textarea, label: 'Notes', initial: true }

}, 'Placement Considerations', {

	recommendedFamilyConstellation: { type: Types.Relationship, label: 'recommended family constellations', ref: 'Family Constellation', many: true, required: true, initial: true },
	otherFamilyConstellationConsideration: { type: Types.Relationship, label: 'other family constellation consideration', ref: 'Other Family Constellation Consideration', many: true, initial: true },
	otherConsiderations: { type: Types.Relationship, label: 'other considerations', ref: 'Other Consideration', many: true, initial: true }

}, 'Agency Information', {

	registeredBy: { type: Types.Select, label: 'registered by', options: 'unknown, adoption worker, recruitment worker', required: true, initial: true },
	adoptionWorker: { type: Types.Relationship, label: 'adoption worker', ref: 'Social Worker', filters: { position: 'adoption worker' }, initial: true },
	recruitmentWorker: { type: Types.Relationship, label: 'recruitment worker', ref: 'Social Worker', filters: { position: 'recruitment worker' }, initial: true },
	region: { type: Types.Relationship, label: 'region', ref: 'Region', initial: true }

}, 'Photolisting Information', {

	profile: {
		part1: { type: Types.Textarea, label: 'let me tell you more about myself...', required: true, initial: true },
		part2: { type: Types.Textarea, label: 'and here\'s what others say...', required: true, initial: true },
		part3: { type: Types.Textarea, label: 'if I could have my own special wish...', required: true, initial: true }
	},

	hasPhotolistingWriteup: { type: Types.Boolean, label: 'photolisting writeup', initial: true },
	photolistingWriteupDate: { type: Types.Text, label: 'date of photolisting writeup', note: 'mm/dd/yyyy', dependsOn: { hasPhotolistingWriteup: true }, initial: true },
	hasPhotolistingPhoto: { type: Types.Boolean, label: 'photolisting photo', initial: true },
	photolistingPhotoDate: { type: Types.Text, label: 'date of photolisting photo', note: 'mm/dd/yyyy', dependsOn: { hasPhotolistingPhoto: true }, initial: true },
	photolistingPageNumber: { type: Number, label: 'photolisting page', format: false, initial: true },
	previousPhotolistingPageNumber: { type: Number, label: 'previous photolisting page', format: false, initial: true },

	// image: { type: Types.CloudinaryImage, folder: 'children/', select: true, selectPrefix: 'children/', publicID: 'slug', autoCleanup: true },
	image: { type: Types.CloudinaryImage, label: 'image', folder: 'children/', publicID: 'name.identifying', autoCleanup: true },
	galleryImage: {type: Types.Url, hidden: true },
	detailImage: {type: Types.Url, hidden: true },
	extranetUrl: { type: Types.Url, label: 'extranet and related profile url', initial: true } // Since this is redudant as this just points the the url where the photo exists (the child's page), we may hide this field.  This must be kept in as it will help us track down the child information in the old system in the event of an issue.

}, 'Recruitment Options', {

	hasVideoSnapshot: { type: Types.Boolean, label: 'video snapshot', initial: true },
	videoSnapshotDate: { type: Types.Text, label: 'date of video snapshot', note: 'mm/dd/yyyy', dependsOn: { hasVideoSnapshot: true }, initial: true },

	onMAREWebsite: { type: Types.Boolean, label: 'MARE website', initial: true },
	onMAREWebsiteDate: { type: Types.Text, label: 'date on MARE website', note: 'mm/dd/yyyy', dependsOn: { onMAREWebsite: true }, initial: true },

	onAdoptuskids: { type: Types.Boolean, label: 'Adoptuskids website', initial: true },
	onAdoptuskidsDate: { type: Types.Text, label: 'date on Adoptuskids', note: 'mm/dd/yyyy', dependsOn: { onAdoptuskids: true }, initial: true },

	onOnlineMatching: { type: Types.Boolean, label: 'online matching website', initial: true },
	onOnlineMatchingDate: { type: Types.Text, label: 'date on online matching', note: 'mm/dd/yyyy', dependsOn: { onOnlineMatching: true }, initial: true },

	wednesdaysChild: { type: Types.Boolean, label: 'Wednesday\'s Child?', initial: true },
	wednesdaysChildDate: { type: Types.Text, label: 'date of Wednesday\'s Child', note: 'mm/dd/yyyy', dependsOn: { wednesdaysChild: true }, initial: true },

	coalitionMeeting: { type: Types.Boolean, label: 'coalition meeting', initial: true },
	coalitionMeetingDate: { type: Types.Text, label: 'date of coalition meeting', note: 'mm/dd/yyyy', dependsOn: { coalitionMeeting: true }, initial: true },

	matchingEvent: { type: Types.Boolean, label: 'matching event', initial: true },
	matchingEventDate: { type: Types.Text, label: 'date of matching event', note: 'mm/dd/yyyy', dependsOn: { matchingEvent: true }, initial: true },

	adoptionParties: { type: Types.Relationship, label: 'adoption parties', ref: 'Event', filters: { type: 'adoption party' }, many: true, initial: true },

	mediaEligibility: { type: Types.Relationship, label: 'media eligibility', ref: 'Media Eligibility', many: true, initial: true },
	otherMediaDescription: { type: Types.Textarea, label: 'description', dependsOn: { mediaEligibility: 'Other' }, initial: true } // THIS DOESN'T WORK, MAKE IT WORK!

}, 'Attachments', {

	photolistingPage: {
		type: Types.S3File,
		s3path: '/child/photolisting-pages',
		filename: function(item, filename){
			// prefix file name with registration number and add the user's name for easier identification
			return fileName;
		}
	},

	otherAttachement: {
		type: Types.S3File,
		s3path: '/child/other',
		filename: function(item, filename){
			// prefix file name with registration number and add the user's name for easier identification
			return fileName;
		}
	}

}, 'System Information', {

	fileName: { type: Types.Text, hidden: true }

});

// Displaly associations via the Relationship field type
Child.relationship({ path: 'children', ref: 'Child', refPath: 'siblingContacts' });
// Child.relationship({ path: 'siblings', ref: 'Sibling', refPath: 'child1' });
Child.relationship({ path: 'placements', ref: 'Placement', refPath: 'child' });
Child.relationship({ path: 'inquiries', ref: 'Inquiry', refPath: 'child' });
Child.relationship({ path: 'internal-notes', ref: 'Internal Note', refPath: 'child' });

// Pre Save
Child.schema.pre('save', function(next) {
	'use strict';

	// TODO: Play with lowering quality to 0 and doubling the image size as an optimization technique
	this.galleryImage = this._.image.thumbnail(430,430,{ quality: 60 });
	this.detailImage = this._.image.thumbnail(200,200,{ quality: 60 });

	// Build the name string for better identification when linking through Relationship field types
	var firstName	= this.name.first,
		middleName	= (this.name.middle && this.name.middle.length > 0) ? ' ' + this.name.middle : '',
		lastName	= (this.name.last && this.name.last.length > 0) ? ' ' + this.name.last : ''


	this.name.full = firstName + middleName + lastName;
	// Create an identifying name for file uploads
	this.fileName = this.registrationNumber + '_' + this.name.first.toLowerCase();

	// TODO: Assign a registration number if one isn't assigned
	next();
});

// // Define default columns in the admin interface and register the model
Child.defaultColumns = 'registrationNumber, name.full, ethnicity, legalStatus, gender';
Child.register();
