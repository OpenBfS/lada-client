/**
 *
 */
Ext.define('Lada.view.panel.FilterDetails', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.filterdetails',

    record: null,

    title: 'test',

    /**
     * @private
     * Initialize the view.
     */
    initComponent: function() {
        var me = this;
        var i18n = Lada.getApplication().bundle;
        //me.title = i18n.getMsg('filterdetails.title');

        me.items = [{
            xtype: 'displayfield',
            margin: '5, 5, 5, 5',
            name: 'name',
            fieldLabel: 'Name'
        }, {
            xtype: 'displayfield',
            margin: '0, 5, 5, 5',
            name: 'beschreibung',
            fieldLabel: 'Beschreibung'
        }, {
            xtype: 'displayfield',
            margin: '0, 5, 5, 5',
            name: 'filters',
            fieldLabel: 'Filter'
        }, {
            xtype: 'displayfield',
            margin: '0, 5, 5, 5',
            name: 'columns',
            fieldLabel: 'Spalten'
        }];

        this.callParent(arguments);
    },

    setRecord: function(record) {
        this.record = record;
        this.down('displayfield[name=name]').setValue(record.get('name'));
        this.down('displayfield[name=beschreibung]').setValue(record.get('description'));
        var columnString = [];
        var value = record.get('results');
        for (var i = 0; i < value.length; i++) {
            columnString.push(value[i].header);
        }
        this.down('displayfield[name=columns]').setValue(columnString.join(', '));
        value = record.get('filters');
        var filterString = [];
        for (var i = 0; i < value.length; i++) {
            filterString.push(value[i].label);
        }
        this.down('displayfield[name=filters]').setValue(filterString.join(', '));
    }
});
