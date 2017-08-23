/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This is a controller for a grid of Messmethode
 */
Ext.define('Lada.controller.grid.Messmethode', {
    extend: 'Ext.app.Controller',
    record: null,

    /**
     * Inhitialize the controller
     * It has 3 listeners
     */
    init: function() {
        this.control({
            'messmethodengrid': {
                edit: this.gridSave,
                canceledit: this.cancelEdit,
                select: this.selectRow,
                deselect: this.deselectRow
            },
            'messmethodengrid button[action=add]': {
                click: this.add
            },
            'messmethodengrid button[action=delete]': {
                click: this.remove
            },
            //Nuklidegrid
            'nuklidegrid': {
                edit: this.gridSaveNuklid,
                canceledit: this.cancelEdit
            },
            'nuklidegrid button[action=add]': {
                click: this.addNuklid
            },
            'nuklidegrid button[action=remove]': {
                click: this.removeNuklid
            }
        });
    },

    /**
     * This function is called when the grids roweditor saves
     * the record.
     * On success it refreshes the windows which contains the grid
     * On failure it displays a message
     */
     gridSave: function(editor, context) {
         if (context.record.phantom){
             context.record.set('id', null);
         }
         context.record.save({
            success: function() {
                context.grid.initData();
                context.grid.up('window').initData();
            },
            failure: function(request, response) {
                var json = response.request.scope.reader.jsonData;
                if (json) {
                    if (json.message){
                        Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.save.title')
                            +' #'+json.message,
                            Lada.getApplication().bundle.getMsg(json.message));
                    } else {
                         Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.save.title'),
                            Lada.getApplication().bundle.getMsg('err.msg.generic.body'));
                    }
                } else {
                    Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.save.title'),
                        Lada.getApplication().bundle.getMsg('err.msg.response.body'));
                }
            }
        });
    },

    /**
     * This function is called when the Nuklide-grids roweditor saves
     * the record.
     * It adds the nuklid to the messgroessen-array of the messmethode
     * record.
     * On success it refreshes the windows which contains the grid
     * On failure it displays a message
     */
    gridSaveNuklid: function(editor, context) {
        console.log(context);
        var modified = false;
        var id = context.newValues.id;
        var mg = this.record.get('messgroessen');

        //Test if this Nuklid already exists.
        if (Array.isArray(id)){
            for (i in id) {
                //Only insert if value does not exist
                if (! Ext.Array.contains(mg, id[i])) {
                    modified = true;
                }
            }
        }
        else {
            if (! Ext.Array.contains(mg, id)) {
                mg.push(id);
                modified = true;
            }
        }

        if (modified) {
            this.syncArray(context.store);
        }
        else {
            editor.getCmp().store.remove(context.record);
        }
    },

    /**
     * When the edit was canceled,
     * the empty row might have been created by the roweditor is removed
     */
    cancelEdit: function(editor, context) {
        if (context.record.phantom){
            editor.getCmp().store.remove(context.record);
        }
    },

    /**
     * When a row is selected,
     * the nuklid-grid will be updated
     * to display the nuklide which are possible for this
     * Messmethod
     */
    selectRow: function(row, record, index) {
        //save the record to this object. which makes it accessible
        //for nuklideGrid releated functions.
        this.record = record;
        var nuklide = record.get('messgroessen');

        var ngrid = row.view.up('window').down('nuklidegrid');

        var mmtmessgroessenstore = this.buildNuklideStore(nuklide);
        //Set Store
        ngrid.setData(mmtmessgroessenstore);

        //Enable Editing depending on the readonly state of the messprogramm.
        ngrid.setReadOnly(row.view.up('window').record.get('readonly'));
    },

    /**
     * Clear the nuklideGrid when a MMT Row is deselected
     */
    deselectRow: function(row, record, index){
        var ngrid = row.view.up('window').down('nuklidegrid');
        ngrid.initData();
    },

    /**
     * This function syncs the Messmethoden-Messgroessen Array
     * With the Nuklide Store.
     * It simply overwrites the Array
     */
    syncArray: function(store) {
        var mg = new Array();
        console.log('syncarray');
        console.log(store);
        var item;
        for (item in store.data.items){
            mg.push(store.data.items[item].get('id'));
        }

        // Ext.Array.contains(mg, id[i])
        this.record.set('messgroessen', mg);
        var me = this;
        this.record.save({
            success: function() {
                console.log('Success');
                console.log(me.record.get('messgroessen'));
                console.log(mg);
            },
            failure: function(request, response) {
                var json = response.request.scope.reader.jsonData;
                if (json) {
                    if (json.message){
                        Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.save.title')
                            +' #'+json.message,
                            Lada.getApplication().bundle.getMsg(json.message));
                    } else {
                        Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.save.title'),
                            Lada.getApplication().bundle.getMsg('err.msg.generic.body'));
                    }
                } else {
                    Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.save.title'),
                        Lada.getApplication().bundle.getMsg('err.msg.response.body'));
                }
            }
        });

    },

    /**
     * Return a MessgroessenStore created from nuklide array
     */
    buildNuklideStore: function(nuklide) {
        // Create a fully populated Messgroessen Store
        var store = Ext.data.StoreManager.get('messgroessen');
        if (!store) {
            store = Ext.create('Lada.store.Messgroessen');
        }

        //Create an empty Messgroessen Store which will be populated with the
        //Messgroessen defined in the Messmethoden record.
        var mmtmessgroessenstore = Ext.create('Ext.data.Store', {
            model: 'Lada.model.Messgroesse'
        });

        // Copy every Record from Messgroessenstore to the empty Store
        // which was defined in the messmethode record
        for (n in nuklide) {
            mmtmessgroessenstore.add(store.getById(nuklide[n]));
        }
        return mmtmessgroessenstore;
    },

    /**
     * This function adds a new row in the NuklidGrid
     */
    addNuklid: function(button) {
        var record = Ext.create('Lada.model.Messgroesse');
        button.up('nuklidegrid').store.insert(0, record);
        button.up('nuklidegrid').rowEditing.startEdit(0, 0);
    },

    /**
     * A row can be removed from the Nuklidgrid with the remove
     * function. It asks the user for confirmation
     * If the removal was confirmed, it reloads the parent window on success,
     * on failure, an error message is shown.
     */
    removeNuklid: function(button) {
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        grid.getStore().remove(selection);
        var store = grid.getStore();
        this.syncArray(store);
    },

    /**
     * This function adds a new row
     */
    add: function(button) {
        var record = Ext.create('Lada.model.MmtMessprogramm');
        if (!record.get('letzteAenderung')) {
            record.data.letzteAenderung = new Date();
        }
        record.set('messprogrammId', button.up('messmethodengrid').recordId);
        button.up('messmethodengrid').store.insert(0, record);
        button.up('messmethodengrid').rowEditing.startEdit(0, 0);
    },

    /**
     * A row can be removed from the grid with the remove
     * function. It asks the user for confirmation
     * If the removal was confirmed, it reloads the parent window on success,
     * on failure, an error message is shown.
     */
    remove: function(button) {
        var grid = button.up('grid');
        //TODO i18n
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        Ext.MessageBox.confirm('Löschen', 'Sind Sie sicher?', function(btn) {
            if (btn === 'yes') {
                selection.erase({
                    success: function() {
                        button.up('window').initData();
                    },
                    failure: function(request, response) {
                        var json = response.request.scope.reader.jsonData;
                        if (json) {
                            if (json.message){
                                Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.delete.title')
                                    +' #'+json.message,
                                    Lada.getApplication().bundle.getMsg(json.message));
                            } else {
                                Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.delete.title'),
                                    Lada.getApplication().bundle.getMsg('err.msg.generic.body'));
                            }
                        } else {
                            Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.delete.title'),
                                Lada.getApplication().bundle.getMsg('err.msg.response.body'));
                        }
                    }
                });
            }
        });
    }
});
