/*
 * Grid to list Proben
 */
Ext.define('Lada.view.proben.List' ,{
    extend: 'Ext.grid.Panel',
    alias: 'widget.probenlist',
    store: 'ProbenList',
    viewConfig: {
        maxHeight: 350,
        emptyText: 'Keine Proben gefunden.',
        // minHeight and deferEmptyText are needed to be able to show the
        // emptyText message.
        minHeight: 35,
        deferEmptyText: false
    },
    initComponent: function() {
        this.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'top',
                items: [
                    {
                        text: 'Hinzufügen',
                        icon: 'gfx/list-add.png',
                        action: 'add'
                    },
                    {
                        text: 'Import',
                        icon: 'gfx/svn-commit.png',
                        action: 'import'
                    },
                    {
                        text: 'Export',
                        icon: 'gfx/svn-update.png',
                        action: 'export'
                    }
                ]
            }
        ];
        this.columns = [];
        this.callParent(arguments);
    },
    /**
     * Setup columns of the Grid dynamically based on a list of given cols.
     * The function is called from the {@link Lada.controller.Sql#selectSql
     * select sql event}
     * @parameter {Array} List of cols to show in the Grid.
     */
    setupColumns: function(cols) {
        var rcols = [];
        var mfields = [];

        rcols.push({header: 'RW', dataIndex: 'readonly', width: 30, renderer: render_readonly});
        mfields.push(new Ext.data.Field({name: 'readonly'}));
        for (var i = cols.length - 1; i >= 0; i--){
            rcols.push(cols[i]);
            mfields.push(new Ext.data.Field({name: cols[i].dataIndex}));
        }
        this.store.model.setFields(mfields);
        this.reconfigure(this.store, rcols);
    }
});

/**
 * Helper function to render a readonly symbol per row in the grid
 * @param {Boolean} flag if the symbol is a readonly symbol.
 */
function render_readonly (value) {
    if (value) {
        return '<img src="gfx/lock_16x16.png"/>';
    } else {
        return '<img src="gfx/unlock_16x16.png"/>';
    }
}
