/* Copyright (C) 2017 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Widget for Status/Stufe display and setting
 */
Ext.define('Lada.view.widget.Statuskombi', {
    extend: 'Lada.view.widget.base.TextField',
    alias: 'widget.statuskombi',
    store: Ext.data.StoreManager.get('statuskombi'),
    editable: false,
    readonly: true,
    changebutton: function() {
        var btn = Ext.create('Ext.Button', {
            text:'Status ändern',
            tooltip: 'neuen Status vergeben',
            action: 'newstatus'
        });
        return btn;
    },

    resetbutton: function() {
        var btn = Ext.create('Ext.Button', {
            text: 'Zurücksetzen',
            tooltip:'letzte Statusänderung zurücknehmen',
            action: 'resetstatus'
        });
        return btn;
    },

    setValue: function(value){
        if(!this.store){
            this.store = Ext.data.StoreManager.get('statuskombi');
        }
        var entry = this.store.getById(value);
        if(!entry){
            return;
        }
        var text = entry.statusstufe.stufe + ' -' + entry.statusWert.wert;
        this.down('combobox').setValue(text);
    },

    setReadOnly: function(readonly){
        var button = this.down('button[action=newstatus]');
        if (!button){
          this.add(this.changebutton());
          button = this.down('button[action=newstatus]');
        }
        if (!readonly){
          button.setDisabled(false);
        }
        else {
          button.setDisabled(true);
        }
    },

    setResetable: function(resetable){
        var button = this.down('button[action=resetstatus]');
        if (!button){
          this.add(this.resetbutton());
          button = this.down('button[action=resetstatus]');
        }
        if (resetable){
            button.setDisabled(false);
        }
        else {
            button.setDisabled(true);
        }
    }
});
