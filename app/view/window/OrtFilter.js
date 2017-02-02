/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Panel for universal orte search resultset.
 *
 */
Ext.define('Lada.view.window.OrtFilter', {
    extend: 'Ext.window.Window',
    alias: 'widget.ortfilterwindow',

//    layout: 'vbox',
    layout: {
        type: 'vbox',
        align: 'left'
    },
    width: 400,
    resizable: false,
    shadow: false,
    alwaysOnTop: true,

    initComponent: function() {
        var me = this;
        var i18n = Lada.getApplication().bundle;

        me.items = [{
            name: 'nohits',
            html: 'keine Treffer',
            hidden: true,
            width: '100%',
            minHeight: 30
        }, {
            xtype: 'grid',
            name: 'messpunkte',
            hideHeaders: true,
            title: i18n.getMsg('orte'),
            minHeight: 30,
            maxHeight: 100,
            width: '100%',
            columns: [{
                dataIndex: 'ortId'
            }, {
                dataIndex: 'kurztext',
                flex: 1
            }, {
                dataIndex: 'gemId'
            }]
        }, {
            xtype: 'grid',
            name: 'verwaltungseinheiten',
            hideHeaders: true,
            title: i18n.getMsg('orte.verwaltungseinheit'),
            minHeight: 30,
            maxHeight: 100,
            width: '100%',
            columns: [{
                dataIndex: 'id',
                flex: 1,
                renderer: function(value, meta, record) {
                    return value + ' - ' + record.get('bezeichnung');
                }
            }]
        }, {
            xtype: 'grid',
            name: 'staaten',
            hideHeaders: true,
            title: i18n.getMsg('staaten'),
            minHeight: 30,
            maxHeight: 100,
            width: '100%',
            columns: [{
                dataIndex: 'id',
                flex: 1,
                renderer: function(value, meta, record) {
                    return record.get('staatIso') + ' - ' + record.get('staat');
                }
            }]
        }];

        me.callParent(arguments);
    },

    updateGrids: function(orte, verwaltungseinheiten, staaten) {
        var mp = this.down('grid[name=messpunkte]')
        var ve = this.down('grid[name=verwaltungseinheiten]');
        var st = this.down('grid[name=staaten]');
        var nohits = this.down('panel[name=nohits]');
        if (orte.count() > 0) {
            mp.reconfigure(orte);
            mp.show();
            nohits.hide();
        }
        else {
            mp.hide();
        }
        if(verwaltungseinheiten.count() > 0) {
            ve.reconfigure(verwaltungseinheiten)
            ve.show();
            nohits.hide();
        }
        else {
            ve.hide();
        }
        if (staaten.count() > 0) {
            st.reconfigure(staaten)
            st.show();
            nohits.hide();
        }
        else {
            st.hide();
        }
        if (orte.count() === 0 &&
            verwaltungseinheiten.count() === 0 &&
            staaten.count() === 0
        ) {
            nohits.show();
        }
    },

    reposition: function(x, y) {
        var height = this.getHeight();
        this.setX(x);
        this.setY(y - height);
    }
});
