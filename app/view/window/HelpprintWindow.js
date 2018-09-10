/* Copyright (c) 2017 Bundesamt fuer Strahlenschutz
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * @class Lada.view.window.ImprintWindow
 */
Ext.define('Lada.view.window.HelpprintWindow', {
    extend: 'Ext.window.Window',
    xtype: 'k-window-imprint',

    requires: [
        'Lada.controller.HelpprintController',
        'Lada.model.HelpprintModel'
    ],

    controller: 'k-window-imprint',
    viewModel: {
        type: 'k-window-imprint'
    },

    bind: {
        title: 'Lada Hilfe'
    },
    constrainHeader: true,
    width: 1500,
    height: 700,
    layout: 'border',
    minWidth: 500,
    minHeight: 300,

    resizable: true,
    maximizable: true,

    items: [{
        xtype: 'panel',
        region: 'west',
        scrollable: 'vertical',
        width: 300,
        split: true,
        layout: {
            type: 'vbox'
        },
        border: false,
        items: [{
            xtype: 'treelist',
            reference: 'treelist',
            expanderOnly: false,
            bind: '{imprintNavItems}'
        }]
    }, {
    //Content
        xtype: 'panel',
        reference: 'helpprintPanel',
        region: 'center',
        scrollable: true,
        bodyPadding: 10,
        bind: {
            html: '{selectionHtml}'
        }
    }],

    //select default node 'helpprint'
    listeners: {
        afterlayout: function() {
            var me = this,
                treelist = me.lookupReference('treelist'),
                store = treelist.getStore(),
                selection = treelist.getSelection();
            if (store && !selection) {
                var winController = me.getController();
                winController.setTopic('intro');
            }
        }
    }
});
