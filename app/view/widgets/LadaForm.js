Ext.define('Lada.view.widgets.LadaForm', {
    extend: 'Ext.form.Panel',

    alias: 'widget.ladaform',
    /**
     * http://moduscreate.com/expert-ext-js-model-integration-in-forms/
     */

    /**
     * Can be a reference to a model instance or a model class name.
     */
    model: null,
    /**
     * Set to the id of the model instance and the model will be loaded for you.
     * Only applicable if model provided is a model class name (string).
     */
    modelId: null,
    bodyPadding: '10 10',
    border: 0,

    errors: null,
    warnings: null,
    message: null,

    initComponent: function() {

        this.callParent();

        this.getForm().trackResetOnLoad = true; //Workaround

        if (Ext.isString(this.model)) {

            //Load a model to be updated
            if (this.modelId) {

                Ext.ClassManager.get(this.model).load(this.modelId, {
                    failure: this.onModelLoadFailure,
                    success: this.onModelLoadSuccess,
                    scope: this
                });

            //Load an empty record to be inserted
            } else {
                this.bindModel(Ext.create(this.model, {}));
            }

        } else {

            //Bind the provided model to be updated
            this.bindModel(this.model);

        }

        this.addEvents('loadsuccess', 'loadfailure', 'savesuccess', 'savefailure');
    },

    bindModel: function(model) {
        this.model = model;
        this.loadRecord(model);
    },

    commit: function(callback, scope) {
        if (this.form.isDirty()) {
            this.form.updateRecord(this.model);

            this.model.save({
                callback: function(records, operation) {
                    this.parseResponse(operation);
                    if (operation.wasSuccessful()) {
                        console.log('Save was successfull');
                        this.fireEvent('savesuccess', this, records, operation);
                    } else {
                        console.log('Save was not successfull');
                        this.form.markInvalid(this.errors);
                        this.fireEvent('savefailure', this, records, operation);
                    }
                    if (callback) {
                        callback.call(scope || this, this, operation.wasSuccessful(), this.model);
                    }
                },
                scope: this
            });
        }
    },

    onModelLoadSuccess: function(record, operation) {
        this.bindModel(record);
        this.parseResponse(operation);
        this.fireEvent('loadsuccess', this, record, operation);
    },

    onModelLoadFailure: function(record, operation) {
        this.parseResponse(operation);
        this.fireEvent('loadfailure', this, record, operation);
    },

    translateReturnCodes: function(codes) {
        var translated = {};
        for (var k in codes) {
            translated[k] = Lada.getApplication().bundle.getMsg(codes[k]);
        }
        return translated;
    },
    parseResponse: function(operation) {
        this.errors = this.translateReturnCodes(operation.request.scope.reader.jsonData["errors"]);
        this.warnings = this.translateReturnCodes(operation.request.scope.reader.jsonData["warnings"]);
        this.message = Lada.getApplication().bundle.getMsg(operation.request.scope.reader.jsonData["message"]);
    }

});
