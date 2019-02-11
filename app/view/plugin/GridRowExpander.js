Ext.define('Lada.view.plugin.GridRowExpander', {
    extend: 'Ext.grid.plugin.RowExpander',
    alias: 'plugin.gridrowexpander',

    rowBodyTpl: '&nbsp;',
    loadingMessage: '<div class="x-grid-rowbody-loading">Loading...</div>',
    type: null,
    gridConfig: null,
    idRow: null,

    constructor: function(config) {
        var me = this;
        var tpl = config.rowBodyTpl || me.rowBodyTpl;
        var cmps;
        me.type = config.gridType;
        me.gridConfig = config.gridConfig;

        me.callParent(arguments);

        cmps = me.cmps = new Ext.util.MixedCollection(null, function(o) {
            return o.recordId;
        });

        cmps.on('remove', me.onCmpRemove, me);

        me.rowBodyTpl = new Ext.XTemplate(tpl);
    },

    init: function(grid) {
        var me = this;
        var view = grid.getView();
        view.processEvent = me.createProcessUIEvent(view.processEvent);

        me.callParent(arguments);
    },

    destroy: function() {
        var cmps = this.cmps;
        cmps.removeAll();

        this.callParent();
    },

    onCmpRemove: function(cmp) {
        cmp.destroy();
    },

    createProcessUIEvent: function(oldFn) {
        var grid = this.getCmp();
        return function(e) {
            var me = this;
            var item = e.getTarget(me.dataRowSelector || me.itemSelector,
                me.getTargetEl());
            var row;
            var eGrid;

            row = Ext.fly(item);

            if (row) {
                eGrid = row.up('.x-grid'); // grid el of UI event
            }
            if (eGrid && eGrid.id !== grid.el.id) {
                if (e.type !== 'contextmenu' && e.type !== 'keydown') {
                    e.stopEvent();
                }

                return null;
            }

            return oldFn.apply(me, arguments);
        };
    },

    /**
     * expands/collapses all rows
     * @param {boolean} expand true if the action is to expand all
     */
    toggleAllRows: function(expand) {
        var me = this;
        var nodes = this.view.getNodes();
        for (var i=0; i < nodes.length; i++) {
            var node = Ext.fly(nodes[i]);
            if (node.hasCls(me.rowCollapsedCls) === true && expand) {
                me.toggleRow(i);
            } else
            if (node.hasCls(me.rowCollapsedCls) === false && !expand) {
                me.toggleRow(i);
            }
        }
    },

    toggleRow: function(rowIdx) {
        var me = this;
        var rowNode = me.view.getNode(rowIdx);
        var row = Ext.get(rowNode);
        var nextBd = Ext.get(row).down(this.rowBodyTrSelector);
        var expandDiv = nextBd.down('div.x-grid-rowbody');
        var record = me.view.getRecord(rowNode);

        if (row.hasCls(me.rowCollapsedCls)) {
            row.removeCls(me.rowCollapsedCls);
            nextBd.removeCls(me.rowBodyHiddenCls);
            me.recordsExpanded[record.internalId] = true;

            me.showCmp(expandDiv, record);
            me.view.fireEvent('expandbody', rowNode, record, nextBd.dom);
        } else {
            row.addCls(me.rowCollapsedCls);
            nextBd.addCls(me.rowBodyHiddenCls);
            me.recordsExpanded[record.internalId] = false;

            me.collapseCmp(expandDiv, record);
            me.view.fireEvent('collapsebody', rowNode, record, nextBd.dom);
        }
    },

    createCmp: function(record, id, config) {
        var me = this;

        var gridConfig = config.gridConfig;

        Ext.apply(gridConfig, {
            recordId: record.get(me.idRow),
            cls: 'row-expander-grid'
        });
        var grid = Ext.create(me.type, gridConfig);

        return grid;
    },

    showCmp: function(row, record) {
        var me = this;
        var cmps = me.cmps;
        var id = record.getObservableId();
        var idx = cmps.findIndex('recordId', id);
        var cmp = cmps.getAt(idx);
        var gridConfig = me.gridConfig;

        if (!cmp) {
            row.update(me.loadingMessage);

            cmp = me.cmps.add(me.createCmp(record, id, {
                gridConfig: gridConfig
            }));
        }
        row.update('');
        cmp.render(row);
    },

    getInnerCmp: function(record) {
        return this.cmps.getByKey(
            record.getObservableId()
        );
    },

    collapseCmp: function(row, record) {
        var me = this;
        var cmps = me.cmps;
        var id = record.get(me.idRow);
        var idx = cmps.findIndex('recordId', id);
        var cmp = cmps.getAt(idx);

        cmps.remove(cmp);
        cmp.destroy();
    }
});
