const keystone					= require( 'keystone' );
const Family 					= keystone.list( 'Family' );
// utility middleware
const utilityFunctions			= require( './utilities_functions' );
const utilityModelFetch			= require( './utilities_model-fetch' );
// csv conversion middleware
const CSVConversionMiddleware	= require( './utilities_csv-conversion' );

// create an array to hold all families.  This is created here to be available to multiple functions below
let families;
// expose done to be available to all functions below
let familySocialWorkersImportComplete;
// expose the array storing progress through the migration run
let migrationResults;

module.exports.appendFamilySocialWorkers = ( req, res, done ) => {
	// expose done to our generator
	familySocialWorkersImportComplete = done;
	// expose our migration results array
	migrationResults = res.locals.migrationResults;

	// create a promise for converting the families CSV file to JSON
	const familiesLoaded = new Promise( ( resolve, reject ) => {
		// attempt to convert the families
		CSVConversionMiddleware.fetchFamilies( resolve, reject );
	});
	// if the file was successfully converted, it will return the array of families
	familiesLoaded.then( familiesArray => {
		// store the families in a variable accessible throughout this file
		families = familiesArray;
		// kick off the first run of our generator
		familyGenerator.next();
	// if there was an error converting the families file
	}).catch( reason => {
		console.error( `error processing families` );
		console.error( reason );
		// aborting the import
		return done();
	});
};

/* a generator to allow us to control the processing of each record */
module.exports.generateFamilies = function* generateFamilies() {

	console.log( `creating families in the new system` );
	// create monitor variables to assess how many records we still need to process
	let totalRecords			= families.length,
		remainingRecords 		= totalRecords,
		batchCount				= 200, // number of records to be process simultaneously
		familyNumber			= 0; // keeps track of the current family number being processed.  Used for batch processing
	// loop through each family object we need to create a record for
	for( let family of families ) {
		// increment the familyNumber
		familyNumber++;
		// if we've hit a multiple of batchCount, pause execution to let the current records process
		if( familyNumber % batchCount === 0 ) {
			yield exports.createFamilyRecord( family, true );
		} else {
			exports.createFamilyRecord( family, false );
		}
		// decrement the counter keeping track of how many records we still need to process
		remainingRecords--;
		console.log( `families remaining: ${ remainingRecords }` );
		// if there are no more records to process call done to move to the next migration file
		if( remainingRecords === 0 ) {

			const resultsMessage = `finished creating ${ totalRecords } families in the new system`;
			// store the results of this run for display after the run
			migrationResults.push({
				dataSet: 'Families',
				results: resultsMessage
			});

			console.log( resultsMessage );
			// return control to the data migration view
			return familySocialWorkersImportComplete();
		}
	}
};

// a function paired with the generator to create a record and request the generator to process the next once finished
module.exports.createFamilyRecord = ( family, pauseUntilSaved ) => {

	// create a promise
	const familyLoaded = new Promise( ( resolve, reject ) => {
		// for fetching the family
		utilityModelFetch.getFamilyById( resolve, reject, family.fam_id );
	});
	// create a promise
	const socialWorkerLoaded = new Promise( ( resolve, reject ) => {
		// for fetching the family's social worker
		utilityModelFetch.getSocialWorkerById( resolve, reject, family.social_worker_agc_id );
	});

	Promise.all( [ familyLoaded, socialWorkerLoaded ] ).then( values => {
		// store the retrieved family and family social worker in local variables
		const [ family, familySocialWorker ] = values;
		// append the family social worker ID to the family
		family.socialWorker = familySocialWorker ? familySocialWorker.get( '_id' ) : undefined;
		// save the updated family record
		family.save( ( err, savedModel ) => {
			// if we run into an error
			if( err ) {
				// halt execution by throwing an error
				console.log( `error: ${ err }` );
				throw `[registration number: ${ family.get( 'registrationNumber' ) }] an error occured while appending a social worker to the family record.`;
			}

			// fire off the next iteration of our generator after pausing
			if( pauseUntilSaved ) {
				setTimeout( () => {
					familyGenerator.next();
				}, 1000 );
			}
		});
	});
};

// instantiates the generator used to create family records at a regulated rate
const familyGenerator = exports.generateFamilies();