var keystone = require('keystone'),
    Types = keystone.Field.Types;

// Create model. Additional options allow menu name to be used what auto-generating URLs
var FamilyHistory = new keystone.List('Family History', {
    autokey: { path: 'key', from: 'field', unique: true },
    map: { name: 'field' }
});

// Create fields
FamilyHistory.add({
    date: { type: Types.Text, label: 'date', note: 'mm/dd/yyyy', required: true, noedit: true, initial: true },
    field: { type: Types.Text, label: 'field', required: true, noedit: true, initial: true },
    previousValue: { type: Types.Text, label: 'previous value', required: true, noedit: true, initial: true },
    newValue: { type: Types.Text, label: 'new value', required: true, noedit: true, initial: true },
    modifiedBy: { type: Types.Relationship, label: 'modified by', ref: 'User', required: true, noedit: true, initial: true }
});

// Define default columns in the admin interface and register the model
FamilyHistory.defaultColumns = 'field, previousValue, newValue, modifiedBy';
FamilyHistory.register();