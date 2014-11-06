/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Generic Lada specific form.
 *
 * See http://moduscreate.com/expert-ext-js-model-integration-in-forms/ for
 * more details
 */
Ext.define('Lada.view.widgets.LadaForm', {
    extend: 'Ext.form.Panel',

    alias: 'widget.ladaform',
    bodyPadding: '10 10',
    border: 0,

    /**
     * Can be a reference to a model instance or a model class name.
     */
    model: null,
    /**
     * Set to the id of the model instance and the model will be loaded for you.
     * Only applicable if model provided is a model class name (string).
     */
    modelId: null,
    /**
     * List of errors in the form.
     * Typically set after the server validates the form submission
     */
    errors: null,
    /**
     * List of warnings in the form.
     * Typically set after the server validates the form submission
     */
    warnings: null,
    /**
     * The generic (error) message for the form.
     * Typically set after the server validates the form submission
     */
    message: null,
    /**
     * Flag to indicate if the validation succeeds.
     * Typically set after the server validates the form submission
     */
    success: null,
    /**
     * Flag to indicate if the form should be rendered in readonly mode. Will
     * be set after calling the {setReadOnly} function.
     */
    readonly: false,

    initComponent: function() {
        this.callParent(arguments);

        this.getForm().trackResetOnLoad = true; // Workaround

        if (Ext.isString(this.model)) {
            // Load a model to be updated
            if (this.modelId) {
                Ext.ClassManager.get(this.model).load(this.modelId, {
                    failure: this.onModelLoadFailure,
                    success: this.onModelLoadSuccess,
                    scope: this
                });
            // Load an empty record to be inserted
            }
            else {
                this.bindModel(Ext.create(this.model, {}));
            }
        }
        else {
            // Bind the provided model to be updated
            this.bindModel(this.model);
        }
        this.addEvents(
            'loadsuccess',
            'loadfailure',
            'savesuccess',
            'savefailure');
    },

    bindModel: function(model) {
        this.model = model;
        this.loadRecord(model);
        // Set the form to readonly if the models readonly attribute is
        // true
        if (model.get('readonly') === true) {
            this.setReadOnly(true);
        }
    },

    commit: function() {
        if (this.form.isDirty() && this.form.isValid()) {
            this.form.updateRecord(this.model);

            var data = this.model.getAllData();
            var baseUrl = this.model.getProxy().url;
            var url = baseUrl;
            var method = 'POST';
            if (this.model.getId()) {
                url += this.model.getId();
                method = 'PUT';
            }

            Ext.Ajax.request({
                url: url,
                jsonData: data,
                method: method,
                callback: function(option, success, response) {
                    this.parseResponse(response);
                    if (this.success) {
                        console.log('Save was successfull');
                        this.fireEvent(
                            'savesuccess',
                            this,
                            this.model,
                            response);
                    }
                    else {
                        console.log('Save was not successfull');
                        this.form.markInvalid(this.errors);
                        this.fireEvent(
                            'savefailure',
                            this,
                            this.model,
                            response);
                    }
                },
                scope: this
            });
        }
    },

    onModelLoadSuccess: function(record, operation) {
        this.bindModel(record);
        this.parseResponse(operation.response);
        this.fireEvent('loadsuccess', this, record, operation);
    },

    onModelLoadFailure: function(record, operation) {
        this.parseResponse(operation.response);
        this.fireEvent('loadfailure', this, record, operation);
    },

    translateReturnCodes: function(codes) {
        var translated = {};
        for (var k in codes) {
            translated[k] = Lada.getApplication().bundle.getMsg(codes[k]);
        }
        return translated;
    },
    /**
     * Will set the form into readonly state.
     * @param {Boolean} Flag to indicate if the form should be set to readonly
     * or not.
     * @param {Array} [ignoreFields="[]"] A list of fieldnames to ignore.
     */
    setReadOnly: function (bReadOnly, ignoreFields) {
        if (typeof (ignoreFields) === 'undefined') {
            ignoreFields = [];
        }
        /* Iterate over all fields and set them readonly */
        if (bReadOnly) {
            this.getForm().getFields().each(function (field) {
                // Check if the field name is in the list of fields to ignore
                var ignore = false;
                var k;
                for (k = ignoreFields.length - 1; k >= 0; k--) {
                    console.log(ignoreFields[k] + '===' + field.getName());
                    if (ignoreFields[k] === field.getName(true)) {
                        ignore = true;
                    }
                }
                // field.setDisabled(bReadOnly);
                if (!ignore) {
                    field.setReadOnly(true);
                }
            });
            /* Iterate over all toolbars of lists and hide them */
            var childs = this.query('toolbar');
            for (var i = childs.length - 1; i >= 0; i--) {
                childs[i].setVisible(false);
            }
            /*
             * Find Save-Button and hide it. Only hide it if there are not
             * fields left in the form which are editable
             * */
            if (ignoreFields.length === 0) {
                var win = this.up('window');
                var buttons = win.query('.button');
                for (var j = buttons.length - 1; j >= 0; j--) {
                    if (buttons[j].text === 'Speichern') {
                        buttons[j].setVisible(false);
                    }
                }
            }
        }
    },

    parseResponse: function(response) {
        var json = Ext.decode(response.responseText);
        if (json) {
            this.success = json.success;
            this.errors = this.translateReturnCodes(json.errors);
            this.warnings = this.translateReturnCodes(json.warnings);
            this.message = Lada.getApplication().bundle.getMsg(json.message);
            if (!Ext.Object.isEmpty(this.warnings) ||
                !Ext.Object.isEmpty(this.errors)) {
                this.createMessages();
            }
        }
        else {
            this.setReadOnly(this.model.get('readonly'));
        }
    },

    createMessages: function() {
        var messages = Ext.create('Ext.form.Panel', {
            bodyPadding: '5 5 5 5'
        });
        var key;
        var label;
        for (key in this.warnings) {
            label = Ext.create('Ext.container.Container', {
                layout: 'hbox',
                bodyPadding: '5 5 5 5',
                items: [{
                    xtype: 'image',
                    src: 'gfx/icon-warning.gif',
                    width: 18,
                    height: 18
                }, {
                    xtype: 'label',
                    text: key + ': ' + this.warnings[key],
                    margin: '4 0 0 5'
                }]
            });
            messages.insert(0, label);
        }
        for (key in this.errors) {
            label = Ext.create('Ext.container.Container', {
                layout: 'hbox',
                bodyPadding: '5 5 5 5',
                items: [{
                    xtype: 'image',
                    src: 'gfx/icon-error.gif',
                    width: 18,
                    height: 18
                }, {
                    xtype: 'label',
                    text: key + ': ' + this.errors[key],
                    margin: '4 0 0 5'
                }]
            });
            messages.insert(0, label);
        }
        this.insert(0, messages);
    }
});
