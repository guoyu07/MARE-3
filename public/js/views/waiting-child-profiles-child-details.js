( function () {
	'use strict';

	mare.views.ChildDetails = Backbone.View.extend({
		// this view controls the content of the modal window, create an element to insert into the modal
		tagName: 'section',
		// give the container for our view a class we can hook into
  		className: 'child-details',

		events: {
			'click .button--information-request' : 'openInfoRequestForm'
		},

		initialize: function initialize() {
			// store a reference to this for insde callbacks where context is lost
			var view = this;
			// create a hook to access the gallery template
			var html = $( '#child-details-template' ).html();
			// compile the template to be used during rendering/repainting the gallery
			this.template = Handlebars.compile( html );
			// initialize the details modal once we've fetched the basic child data, this is needed because the details will be appended to the same collection
			mare.promises.childrenDataLoaded.done( function() {
				view.collection = mare.collections.galleryChildren;
				// bind event handler for when child details are returned
				view.on( 'child-details-loaded', view.render );
			});
			// when we get a response from the server that the bookmark for a child has successfully updated, update the view
			mare.collections.galleryChildren.on( 'childBookmarkUpdated', function( registrationNumber, action ) {
				view.updateBookmark( registrationNumber, action );
			});
		},
		// events need to be bound every time the modal is opened, so they can't be put in an event block
		bindEvents: function bindEvents() {
  			$( '.modal__close' ).click( this.closeModal.bind( this ) );
			$( '.profile-navigation__previous' ).click( this.handleNavClick.bind( this ) );
			$( '.profile-navigation__next' ).click( this.handleNavClick.bind( this ) );
			$( '.child-bookmark-button' ).click( this.broadcastBookmarkUpdateEvent );
		},
		// events need to be unbound every time the modal is closed
		unbindEvents: function unbindEvents() {
			$( '.modal__close' ).unbind( 'click' );
			$( '.profile-navigation__previous' ).unbind( 'click' );
			$( '.profile-navigation__next' ).unbind( 'click' );
			$( '.child-bookmark' ).unbind( 'click' );
			$( '.profile-tabs__tab' ).unbind( 'click' );
		},

		render: function render( childModel ) {
			// depending on the order of the collection, the next and previous differs per rendering
			this.setNavigation( childModel );
			// pass the child model to through the template we stored during initialization
			var html = this.template( childModel.toJSON() );
			this.$el.html( html );
			// render the contents area and tabs
			$( '.modal-container__contents' ).html( this.$el );
			// remove the loading indicator and display the details content
			$( '.modal-container__loading' ).fadeOut( function() {
				$( '.modal-container__contents' ).fadeIn();
			});
			// set a data attribute with the displayed child's id for use in next/prev navigation
			this.$el.attr( 'data-registration-number', childModel.get( 'registrationNumber' ) );
			// set up the modal tab click events
			this.initializeModalTabs();
			// bind click events for the newly rendered elements
			this.bindEvents();

		},

		setNavigation: function setNavigation( childModel ) {
			// get the index of the current child model in the children collection
			var childIndex = this.collection.indexOf( childModel );
			// check to see if there are children to navigate to before and after the currently displayed child
			var hasPrevious = childIndex > 0;
			var hasNext = childIndex !== this.collection.length - 1;
			// set the index of the previous/next child for easy access in the collection
			var previousIndex = hasPrevious ? childIndex - 1 : undefined;
			var nextIndex = hasNext ? childIndex + 1 : undefined;
			// set whether there are previous and next children, as well as their indices, so we have the information during rendering
			childModel.set( 'hasPrevious', hasPrevious );
			childModel.set( 'hasNext', hasNext );
			childModel.set( 'previousIndex', previousIndex );
			childModel.set( 'nextIndex', nextIndex );
		},

		getChildByRegistrationNumber: function getChildByRegistrationNumber( registrationNumber ) {
			// find the child with the matching registration number and store it in childModel
			var childModel = this.collection.find( function( child ) {
				return child.get( 'registrationNumber' ) === registrationNumber;
			});
			// return the matching child model
			return childModel;
		},

		getChildByIndex: function getChildByIndex( index ) {
			// fetch the child at the specified index in the children collection
			return this.collection.at( index );

		},

		/* when a child card is clicked, display detailed information for that child in a modal window */
		handleGalleryClick: function handleGalleryClick( event ) {
			// store a reference to this for insde callbacks where context is lost
			var view = this;

			var selectedChild		= $( event.currentTarget ),
				registrationNumber	= selectedChild.data( 'registration-number' ),
				childModel			= this.getChildByRegistrationNumber( registrationNumber );
			// open the modal immediately with a loading indicator to keep the site feeling snappy
			this.openModal();
			// fetch the child details information
			this.getDetails( childModel );
		},

		handleNavClick: function handleNavClick( event ) {
			// store a reference to the view for callback functions that lose context
			var view = this;

			this.unbindEvents();

			var selectedChild = $( event.currentTarget ),
				index = selectedChild.data( 'child-index' );

			var child = this.getChildByIndex( index );
			// fade displayed child details if any are shown, and display the loading indicator
			$( '.modal-container__contents' ).fadeOut( function() {
				$( '.modal-container__loading' ).fadeIn( function() {
					view.getDetails( child );
				});
			});
		},

		/* make a call to fetch data for the current child to show detailed information for */
		getDetails: function getDetails( childModel ) {
			// store a reference to this for inside callbacks where context is lost
			var view = this;
			// submit a request to the service layer to fetch child data if we don't have it
			if( !childModel.get( 'hasDetails' ) ) {
				$.ajax({
					dataType: 'json',
					url: '/services/get-child-details',
					type: 'POST',
					data: {
						registrationNumber: childModel.get( 'registrationNumber' )
					}
				}).done( function( childDetails ) {
					// append the new fields to the child model and set a flag to fetch the same child information a second time
					childModel.set( childDetails );
					childModel.set( 'hasDetails', true );
					// emit an event when we have new child details to render
					view.trigger( 'child-details-loaded', childModel );

				}).fail( function( err ) {
					// TODO: show an error message to the user
					console.log( err );
				});
			} else {
				// we already have the child details but still want to show the child so announce that we have the child details
				view.trigger( 'child-details-loaded', childModel );
			}
		},

		/* TODO: all modal functions below mirror the calls made in waiting-child-profiles-sibling-group-details.js.  Both files need to use
				 a modal.js Backbone view which should handle all this.

		/* open the modal container */
		openModal: function openModal() {
			// TODO: find a better place to put this
			$( '.modal__container' ).addClass( 'modal__container--large' );
			$( '.modal__background' ).fadeIn();
			$( '.modal-container__contents' ).hide();
			$( '.modal-container__loading' ).show();
			$( '.modal__container' ).fadeIn();

			mare.utils.disablePageScrolling();
		},

		/* close the modal container */
		closeModal: function closeModal() {

			$( '.modal__background' ).fadeOut();
			$( '.modal__container' ).fadeOut();

			mare.utils.enablePageScrolling();

			this.clearModalContents();

			this.unbindEvents();
		},

		/* clear out the current contents of the modal */
		clearModalContents: function clearModalContents() {
			$( '.modal-container__contents' ).html( '' );
			// TODO: find a better place to put this
			$( '.modal__container' ).removeClass( 'modal__container--large' );
		},

		/* toggle whether the child is bookmarked */
		broadcastBookmarkUpdateEvent: function broadcastBookmarkUpdateEvent( event ) {
			// DOM cache the current target for performance
			var $currentTarget = $( event.currentTarget );
			// get the child's registration number to match them in the database
			var registrationNumber = $currentTarget.data( 'registration-number' );

			// if we are currently saving the users attempt to toggle the bookmark and the server hasn't processed the change yet, ignore the click event
			if( $currentTarget.hasClass( 'bookmark--disabled' ) ) {

				return;

			// if the child is currently bookmarked, remove them
			} else if( $currentTarget.hasClass( 'bookmark--active' ) ) {

				$currentTarget.addClass( 'bookmark--disabled' );
				// send an event that the bookmark needs to be updated
				mare.collections.galleryChildren.trigger( 'childBookmarkUpdateNeeded', registrationNumber, 'remove' );

			// if the child is not currently bookmarked, add them
			} else {

				$currentTarget.addClass( 'bookmark--disabled' );
				// send an event that the bookmark needs to be updated
				mare.collections.galleryChildren.trigger( 'childBookmarkUpdateNeeded', registrationNumber, 'add' );

			}
		},

		updateBookmark: function updateBookmark( registrationNumber, action ) {

			var target = $('.child-bookmark[data-registration-number="' + registrationNumber + '"]')

			switch( action ) {
				case 'add':
					// change the icon from a plus to a minus
					target.html( 'Remove Bookmark' );
					target.addClass( 'bookmark--active' );
					break;
				case 'remove':
					// change the icon from a minus to a plus
					target.html( 'Bookmark' );
					target.removeClass( 'bookmark--active' );
					break;
			}

			target.removeClass( 'bookmark--disabled' );
		},
		
		openInfoRequestForm: function openInfoRequestForm(event) {
			var selectedChild = $( event.currentTarget ),
				registrationNumber = selectedChild.data( 'registration-number' );
			window.location.href = '/forms/information-request-form?registrationNumber=' + registrationNumber;
		}
	});
}());
