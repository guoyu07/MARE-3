var keystone = require('keystone'),
	Types = keystone.Field.Types;

// Create model
var Child = new keystone.List('Child', {
	track: true,
	autokey: { path: 'slug', from: 'registrationNumber', unique: true },
	map: { name: 'name.first' },
	defaultSort: 'name.last'
});

// Create fields
Child.add({ heading: 'General Information' }, {
	registrationNumber: { type: Number, label: 'Registration Number', format: false, required: true, index: true, initial: true },
	registrationDate: { type: Types.Date, label: 'Registration Date', default: Date.now(), required: true, initial: true },
	image: { type: Types.CloudinaryImage, folder: 'children/', select: true, selectPrefix: 'children/', publicID: 'slug', autoCleanup: true },
	thumbnailImage: {type: Types.Url, hidden: true},
	detailImage: {type: Types.Url, hidden: true},
	video: { type: Types.Url, label: 'Video', initial: true },
	name: {
		first: { type: Types.Text, label: 'First Name', required: true, index: true, initial: true },
		middle: { type: Types.Text, label: 'Middle Name', initial: true },
		last: { type: Types.Text, label: 'Last Name', required: true, index: true, initial: true },
		alias: { type: Types.Text, label: 'Alias', initial: true },
		nickname: { type: Types.Text, label: 'Nickname', initial: true }
	},
	birthDate: { type: Types.Date, label: 'Date of Birth', required: true, initial: true },
	language: { type: Types.Select, label: 'Language', options: 'English, Spanish, Portuguese, Chinese, Other', default: 'English', required: true, initial: true },
	statusChangeDate: { type: Types.Date, label: 'Status Change Date', initial: true }, // TODO: Logic needed, see line 14 of https://docs.google.com/spreadsheets/d/1Opb9qziX2enTehJx5K1J9KAT7v-j2yAdqwyQUMSsFwc/edit#gid=1235141373
	status: { type: Types.Select, label: 'Status', options: 'Active, On Hold, Withdrawn, Placed, Disrupted, Reunification', required: true, index: true, initial: true },
	gender: { type: Types.Select, label: 'Gender', options: 'Male, Female', required: true, index: true, initial: true },
	race: { type: Types.Select, label: 'Race', options: 'African American, African American/Asian, African American/Caucasian, African American/Hispanic, African American/Native American, Asian, Asian/Caucasian, Asian/Hispanic, Asian/Native American, Caucasian, Caucasian/Hispanic, Caucasian/Native American, Hispanic, Hispanic/Native American, Native American, Other', required: true, index: true, initial: true },
	legalStatus: { type: Types.Select, label: 'Legal Status', options: 'Free, Legal Risk', required: true, index: true, initial: true }

}, { heading: 'Family Contacts' }, {

	hasContactWithSiblings: { type: Types.Boolean, label: 'Has contact with siblings?', index: true, initial: true },
	siblingContactsString: { type: Types.Text, label: 'Siblings (comma separated)', initial: true },
	siblingContacts: { type: Types.Relationship, label: 'Siblings', ref: 'Child', many: true, initial: true },
	hasContactWithBirthFamily: { type: Types.Boolean, label: 'Has contact with birth family?', initial: true },
	birthFamilyContactsString: { type: Types.Text, label: 'Birth Family (comma separated)', initial: true }

}, { heading: '!! Not sure what section these three go under !!' }, {	

	recommendedFamilyConstellation: { type: Types.Relationship, label: 'Recommended Family Constellation', ref: 'Recommended Family Constellations', many: true, required: true, index: true, initial: true },
	requiresOlderChildren: { type: Types.Boolean, label: 'Requires Older Children', dependsOn: { recommendedFamilyConstellation: 'Multi Child Home' }, initial: true },
	requiresYoungerChildren: { type: Types.Boolean, label: 'Requires Younger Children', dependsOn: { recommendedFamilyConstellation: 'Multi Child Home' }, initial: true },
	extranetUrl: { type: Types.Url, label: 'Extranet and Related Profile URL', initial: true },
	wednesdaysChild: { type: Types.Boolean, label: 'Wednesday\'s Child?', initial: true }

}, { heading: 'Special Needs' }, {	

	physicalNeeds: { type: Types.Select, label: 'Physical needs', options: 'None, Mild, Moderate, Severe', required: true, initial: true },
	physicalNeedsDescription: { type: Types.Textarea, label: 'Description of physical needs', dependsOn: { physicalNeeds: ['Mild', 'Moderate', 'Severe'] }, initial: true },
	emotionalNeeds: { type: Types.Select, label: 'Emotional needs', options: 'None, Mild, Moderate, Severe', required: true, initial: true },
	emotionalNeedsDescription: { type: Types.Textarea, label: 'Description of emotional needs', dependsOn: { emotionalNeeds: ['Mild', 'Moderate', 'Severe'] }, initial: true },
	intellectualNeeds: { type: Types.Select, label: 'Intellectual needs', options: 'None, Mild, Moderate, Severe', required: true, initial: true },
	intellectualNeedsDescription: { type: Types.Textarea, label: 'Description of intellectual needs', dependsOn: { intellectualNeeds: ['Mild', 'Moderate', 'Severe'] }, initial: true },
	specialNeedsNotes: { type: Types.Textarea, label: 'Notes', dependsOn: { physicalNeeds: ['Mild', 'Moderate', 'Severe'], emotionalNeeds: ['Mild', 'Moderate', 'Severe'], intellectualNeeds: ['Mild', 'Moderate', 'Severe'] }, initial: true },
	disabilities: { type: Types.Relationship, label: 'Disabilities', ref: 'Disabilities', many: true, initial: true }

}, { heading: 'Profile' }, {

	profile: {
		part1: { type: Types.Textarea, label: 'Let me tell you more about myself...', required: true, initial: true },
		part2: { type: Types.Textarea, label: 'And here\'s what others say...', required: true, initial: true },
		part3: { type: Types.Textarea, label: 'If I could have my own special wish...', required: true, initial: true }
	}

}, { heading: 'Adoption Worker' }, {	

	adoptionWorker: { type: Types.Relationship, label: 'Adoption Worker', ref: 'User', filters: { userType: 'Social Worker' }, initial: true }

}, { heading: 'Photolisting' }, {

	hasPhotolistingWriteup: { type: Types.Boolean, label: 'Photolisting Writeup', index: true, initial: true },
	photolistingWriteupDate: { type: Types.Date, label: 'Date of Photolisting Writeup', dependsOn: { hasPhotolistingWriteup: true }, initial: true },
	hasPhotolistingPhoto: { type: Types.Boolean, label: 'Photolisting Photo', index: true, initial: true },
	photolistingPhotoDate: { type: Types.Date, label: 'Date of Photolisting Photo', dependsOn: { hasPhotolistingPhoto: true }, initial: true },
	photolistingPageNumber: { type: Number, label: 'Photolisting Page', format: false, index: true, initial: true },
	previousPhotolistingPageNumber: { type: Number, label: 'Previous Photolisting Page', format: false, index: true, initial: true },
	hasVideoSnapshot: { type: Types.Boolean, label: 'Video Snapshot', index: true, initial: true },
	videoSnapshotDate: { type: Types.Date, label: 'Date of Video Snapshot', dependsOn: { hasVideoSnapshot: true }, initial: true }

}, { heading: 'Websites' }, {

	onMAREWebsite: { type: Types.Boolean, label: 'MARE Website', index: true, initial: true },
	onAdoptuskids: { type: Types.Boolean, label: 'Adoptuskids Website', index: true, initial: true },
	onOnlineMatching: { type: Types.Boolean, label: 'Online Matching Website', index: true, initial: true }

}, { heading: 'Media Eligibility' }, {

	mediaEligibility: { type: Types.Relationship, label: 'Media Eligibility', ref: 'Media Eligibility', many: true, initial: true },
	otherMediaDescription: { type: Types.Textarea, label: 'Description', dependsOn: { mediaEligibility: 'Other' }, initial: true}

}, { heading: 'Presented At' }, {

	coalitionMeeting: { type: Types.Boolean, label: 'Coalition Meeting', index: true, initial: true },
	coalitionMeetingDate: { type: Types.Date, label: 'Date of Coalition Meeting', dependsOn: { coalitionMeeting: true }, initial: true },
	matchingEvent: { type: Types.Boolean, label: 'Matching Event', index: true, initial: true },
	matchingEventDate: { type: Types.Date, label: 'Date of Matching Event', dependsOn: { matchingEvent: true }, initial: true }

}, { heading: 'Adoption Parties' }, {

	adoptionParties: { type: Types.Relationship, label: 'Adoption Parties', ref: 'Adoption Parties', many: true, initial: true }

}, { heading: 'Internal Notes' }, {

	internalNotes: { type: Types.Textarea, label: 'Internal Notes', initial: true }

}, { heading: 'Attachments' }, {

	photolistingPage: {
		type: Types.S3File,
		s3path: '/child/photolisting-pages',
		filename: function(item, filename){
			console.log(item);
			console.log('-------');
			console.log(filename);
			// prefix file name with object id
			return item._id + '-1-' + filename;
		}
	},
	otherAttachement: {
		type: Types.S3File,
		s3path: '/child/other',
		filename: function(item, filename){
			// prefix file name with object id
			return item._id + '-2-' + filename;
		}
	}
});

// Displaly associations via the Relationship field type
// Child.relationship({ path: 'events', ref: 'Event', refPath: 'the field in that model that has the relationship' });

// Pre Save
Child.schema.pre('save', function(next) {
	'use strict';
	// TODO: Fix the sizing of these images
	this.thumbnailImage = this._.image.thumbnail(415,415,{ quality: 60 });
	this.detailImage = this._.image.thumbnail(640,640,{ quality: 60 });
	
	// TODO: Assign a registration number if one isn't assigned
	next();
});

// // Define default columns in the admin interface and register the model
Child.defaultColumns = 'registrationNumber, name.first, name.last, ethnicity, legalStatus, gender';
Child.register();
