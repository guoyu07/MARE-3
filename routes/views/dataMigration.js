const keystone									= require( 'keystone' );
const async										= require( 'async' );

// mappings used across imports
const mediaTypesMap								= require( '../middleware/data-migration-maps/media-type' );
const statesMap									= require( '../middleware/data-migration-maps/state' );
const regionsMap								= require( '../middleware/data-migration-maps/region' );
const contactGroupsMap							= require( '../middleware/data-migration-maps/outside-contact-group' );
const mailingListsMap							= require( '../middleware/data-migration-maps/mailing-list' );
const childStatusesMap							= require( '../middleware/data-migration-maps/child-status' );
const gendersMap 								= require( '../middleware/data-migration-maps/gender' );
const languagesMap 								= require( '../middleware/data-migration-maps/language' );
const legalStatusesMap							= require( '../middleware/data-migration-maps/legal-status' );
const racesMap 									= require( '../middleware/data-migration-maps/race' );
const disabilityStatusesMap						= require( '../middleware/data-migration-maps/disability-status' );
const familyConstellationsMap					= require( '../middleware/data-migration-maps/family-constellation' );
const otherFamilyConstellationConsiderationsMap	= require( '../middleware/data-migration-maps/other-family-constellation-consideration' );
const mediaEligibilitiesMap						= require( '../middleware/data-migration-maps/media-eligibility' );
const disabilitiesMap							= require( '../middleware/data-migration-maps/disability' );
const closedReasonsMap							= require( '../middleware/data-migration-maps/closed-reason' );
const familyStatusesMap							= require( '../middleware/data-migration-maps/family-status' );
const cityRegionsMap							= require( '../middleware/data-migration-maps/city-region' );
const childTypesMap								= require( '../middleware/data-migration-maps/child-type' );
const inquiryMethodsMap							= require( '../middleware/data-migration-maps/inquiry-method' );

// data imports
const adminImport								= require( '../middleware/data-migration-middleware/import-admin' );
const sourcesImport								= require( '../middleware/data-migration-middleware/import-sources' );
const mediaFeaturesImport						= require( '../middleware/data-migration-middleware/import-media-features' );
const agenciesImport							= require( '../middleware/data-migration-middleware/import-agencies' );
const agencyContactsImport						= require( '../middleware/data-migration-middleware/import-agency-contacts' );
const outsideContactImport						= require( '../middleware/data-migration-middleware/import-outside-contacts' );
const socialWorkerImport						= require( '../middleware/data-migration-middleware/import-social-workers' );
const childrenImport							= require( '../middleware/data-migration-middleware/import-children' );
const childMediaEligibilitiesImport				= require( '../middleware/data-migration-middleware/import-child-media-eligibilities' );
const childDisabilitiesImport					= require( '../middleware/data-migration-middleware/import-child-disabilities' );
const childSiblingsImport						= require( '../middleware/data-migration-middleware/import-child-siblings' );
const childRecruitmentChecklistImport			= require( '../middleware/data-migration-middleware/import-child-recruitment-checklists' );
const childMediaFeaturesImport					= require( '../middleware/data-migration-middleware/import-child-media-features' );
const mediaFeatureChildImport					= require( '../middleware/data-migration-middleware/import-media-feature-child' );
const familiesImport							= require( '../middleware/data-migration-middleware/import-families' );
const familySocialWorkersImport					= require( '../middleware/data-migration-middleware/import-family-social-workers' );
const familyRacePreferencesImport				= require( '../middleware/data-migration-middleware/import-family-race-preferences' );
const familyDisabilityPreferencesImport			= require( '../middleware/data-migration-middleware/import-family-disability-preferences' );
const familySupportServicesImport				= require( '../middleware/data-migration-middleware/import-family-support-services' );
const familyContactsImport						= require( '../middleware/data-migration-middleware/import-family-contacts' );
const familyChildrenImport						= require( '../middleware/data-migration-middleware/import-family-children' );
const placementsImport							= require( '../middleware/data-migration-middleware/import-placements' );
const eventsImport								= require( '../middleware/data-migration-middleware/import-events' );
const eventAttendeeImport						= require( '../middleware/data-migration-middleware/import-event-attendees' );
// const inquiriesExtranetImport					= require( '../middleware/data-migration-middleware/import-inquiries-extranet' );
const inquiriesImport							= require( '../middleware/data-migration-middleware/import-inquiries');
const inquiryAgenciesImport						= require( '../middleware/data-migration-middleware/import-inquiry-agencies' );
const inquiryChildrenImport						= require( '../middleware/data-migration-middleware/import-inquiry-children' );
const inquiryNotesImport						= require( '../middleware/data-migration-middleware/import-inquiry-notes' );
const mailingListAttendeesImport    					= require( '../middleware/data-migration-middleware/import-mailing-list-attendees');
// const internalNotesImport						= require( '../middleware/data-migration-middleware/import-internal-notes' );

exports = module.exports = ( req, res ) => {
    'use strict';

    const view = new keystone.View( req, res );

    const locals = res.locals;
	// create a namespace for all migration data needed for the import
	// this makes clearing memory much easier
	locals.migration = locals.migration || {
		maps: {},
		data: {}
	};
	// array to store progress messages
	locals.migrationResults = [];

    async.series([
		// map setup
		done => { mediaTypesMap.getMediaTypesMap( req, res, done ); },
		done => { statesMap.getStatesMap( req, res, done); },
		done => { regionsMap.getRegionsMap( req, res, done ); },
		done => { contactGroupsMap.getContactGroupsMap( req, res, done ); },
		done => { mailingListsMap.getMailingListsMap( req, res, done ); },
		done => { childStatusesMap.getChildStatusesMap( req, res, done ); },
		done => { gendersMap.getGendersMap( req, res, done ); },
		done => { languagesMap.getLanguagesMap( req, res, done ); },
		done => { legalStatusesMap.getLegalStatusesMap( req, res, done ); },
		done => { racesMap.getRacesMap( req, res, done ); },
		done => { disabilityStatusesMap.getDisabilityStatusesMap( req, res, done ); },
		done => { familyConstellationsMap.getFamilyConstellationsMap( req, res, done ); },
		done => { otherFamilyConstellationConsiderationsMap.getOtherFamilyConstellationConsiderationsMap( req, res, done ); },
		done => { mediaEligibilitiesMap.getMediaEligibilitiesMap( req, res, done ); },
		done => { disabilitiesMap.getDisabilitiesMap( req, res, done ); },
		done => { closedReasonsMap.getClosedReasonsMap( req, res, done ); },
		done => { familyStatusesMap.getFamilyStatusesMap( req, res, done ); },
		done => { cityRegionsMap.getCityRegionsMap( req, res, done ); },
		done => { childTypesMap.getChildTypesMap( req, res, done ); },
		done => { inquiryMethodsMap.getInquiryMethodsMap( req, res, done ); },

		// data import

		// done => { adminImport.importAdmin( req, res, done ); },
		// done => { sourcesImport.importSources( req, res, done ); },	// there's no countdown during creation like the newer imports
		// done => { mediaFeaturesImport.importMediaFeatures( req, res, done ); }, // notes have markup in them, probably need to strip this out (check display of content)
		// done => { agenciesImport.importAgencies( req, res, done ); },
		// done => { outsideContactImport.importOutsideContacts( req, res, done ); },
		// done => { socialWorkerImport.importSocialWorkers( req, res, done ); },
		// done => { agencyContactsImport.appendAgencyContacts( req, res, done ); },

		// IMPORTANT: need to comment out the following in pre-save: setImages, setRegistrationNumber, updateMustBePlacedWithSiblingsCheckbox, updateGroupBio
		// IMPORTANT: need to comment out the post-save block
		// done => { childrenImport.importChildren( req, res, done ); },
		
		// IMPORTANT: comment out the entire rest of the pre-save hook
		// done => { childMediaEligibilitiesImport.appendMediaEligibilities( req, res, done ); },
		// done => { childDisabilitiesImport.appendDisabilities( req, res, done ); },
		
		// IMPORTANT: uncomment the pre-save hook and make only the following functions active: setSiblingGroupFileName, updateMustBePlacedWithSiblingsCheckbox, updateGroupBio
		// IMPORTANT: uncomment the post-save hook and make only the following function active: updateSiblingFields
		// done => { childSiblingsImport.appendSiblings( req, res, done ); }, // there's no countdown during creation like the newer imports
		// done => { childRecruitmentChecklistImport.appendChildRecruitmentChecklists( req, res ,done ); },		// not done // DON'T NEED TO DO
		// done => { childMediaFeaturesImport.appendMediaFeatures( req, res, done ); },							// not done // DON'T THINK WE NEED TO DO, CHECK ON THIS
		// IMPORTANT: the child pre/post save hooks can be restored
		// done => { mediaFeatureChildImport.appendChildren( req, res, done ); },
		
		// IMPORTANT: comment out the following in pre-save: setHomestudyVerifiedDate, setGalleryViewingPermissions, setFullName, setFileName
		// done => { familiesImport.importFamilies( req, res, done ); },
		
		// IMPORTANT: comment out the entire pre-save hook
		// done => { familySocialWorkersImport.appendFamilySocialWorkers( req, res, done ); },
		// done => { familyRacePreferencesImport.appendFamilyRacePreferences( req, res, done ); },
		// done => { familyDisabilityPreferencesImport.appendFamilyDisabilityPreferences( req, res, done ); },
		// done => { familySupportServicesImport.appendFamilySupportServices( req, res, done ); },
		// done => { familyContactsImport.appendFamilyContacts( req, res, done ); },
		// IMPORTANT: uncomment the pre-save hook and make only the following functions active: setGalleryViewingPermissions, setFullName, setFileName
		// done => { familyChildrenImport.appendFamilyChildren( req, res, done ); },
		// done => { familyRecruitmentChecklistImport.appendFamilyRecruitmentChecklists( req, res ,done );		// not done // DON'T NEED TO DO

		// 13 left undone below

		// done => { placementsImport.importPlacements( req, res, done ); }, 									// not done family_placement.  TODO: Get details to Brian so he can help you track down the field matches 
		// placement source																						// not done
		// IMPORTANT: NEED TO TURN OFF EMAIL PRE SAVE HOOKS
		// done => { inquiriesImport.importInquiries( req, res, done ); },									// not done
		// done => { inquiryAgenciesImport.appendInquiryAgencies( req, res, done ); },								// not done
		// done => { inquiryChildrenImport.appendInquiryChildren( req, res, done ); },								// not done, call child
		// done => { inquiryNotesImport.appendInquiryNotes( req, res, done ); },									// not done, call note
		done => { eventsImport.importEvents( req, res, done ); },
		done => { eventAttendeeImport.appendEventAttendees( req, res, done ); },
		// done => { mailingListAttendeesImport.importMailingListAttendees( req, res, done ); },					// not done
		// IMPORTANT: I think family backup is family internal notes
		// done => { familyInternalNotesImport.importInternalNotes( req, res, done ); }							// not done
		// done => { childInternalNotesImport.importInternalNotes( req, res, done ); }							// not done
		// file attachment																						// not done

		
	], () => {
		// Set the layout to render without the right sidebar
		locals[ 'render-with-sidebar' ] = false;
		// Render the view once all the data has been retrieved
		view.render( 'data-migration-output' );

	});

};
