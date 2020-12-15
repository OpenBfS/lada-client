/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Window with information about the used parameters in a query.
 */
Ext.define('Lada.view.window.SqlDisplay', {
    extend: 'Ext.window.Window',
    alias: 'widget.sqldisplay',

    layout: 'fit',
    padding: '10 5 3 10',
    width: 800,
    height: 500,
    constrain: false,
    sql: null,

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var me = this;
        var i18n = Lada.getApplication().bundle;
        me.on({
            show: function() {
                me.initData();
                me.removeCls('x-unselectable');
            }
        });

        me.title = i18n.getMsg('title.sqldisplay');
        me.buttons = [{
            name: 'copysql',
            text: i18n.getMsg('button.copyclipboard')
        }, {
            text: i18n.getMsg('close'),
            scope: me,
            handler: me.close
        }];
        me.items = [{
            border: false,
            overflowY: 'auto',
            items: [{
                border: false,
                name: 'sqlcontainer'
            }]
        }];
        me.callParent(arguments);
    },

    initData: function() {
        if (!this.sql) {
            return;
        }
        this.down('[name=sqlcontainer]').getEl().setStyle('white-space', 'pre-wrap');
        this.down('[name=sqlcontainer]').setHtml(this.sql);
        if (ClipboardJS && ClipboardJS.isSupported()) {
            var copybutton = this.down('[name=copysql]').getEl().dom;
            copybutton.setAttribute('data-clipboard-text', this.sql);
            new ClipboardJS(copybutton);
        } else {
            this.down('[button name=copysql]').setHidden(true);
            Ext.log.warn('Copy to clipboard not available in his browser.');
        }
    },

    close: function() {
        this.callParent(arguments);
    }
});
