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
 * @class Lada.view.window.ImprintModel
 */
Ext.define('Lada.model.HelpprintModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.k-window-imprint',

    formulas: {
        selectionHtml: function(get) {
            var selection = get('treelist.selection'),
                view = this.getView(),
                imprintController = view.getController(),
                imprintHtmlUrl;

            if (selection) {
                imprintHtmlUrl = (selection.getData()) ?
                    selection.getData().content :
                    null;
                imprintController.setHtmlInPanel(imprintHtmlUrl);
            } else {
                return 'No node selected';
            }
        }
    },

    stores: {
        imprintNavItems: {
            type: 'tree',
            root: {
                children: [{
                    id: 'intro',
                    text: 'Einleitung',
                    content: 'resources/ladaHelp/intro.html',
                    leaf: true
                }, {
                    id: 'quickStart',
                    text: 'Schnellübersicht',
                    content: 'resources/ladaHelp/quickStart.html',
                    leaf: true
                }, {
                    id: 'generalHints',
                    text: 'Allgemeine Hinweise + Einstellungen',
                    content: 'resources/ladaHelp/generalHints.html',
                    leaf: true
                }, {
                    id: 'query',
                    text: 'Selektion, Details zur Selektion und Filter',
                    content: 'resources/ladaHelp/query.html',
                    leaf: true
                }, {
                    id: 'queryList',
                    text: 'Liste der öffentlichen Selektionen',
                    content: 'resources/ladaHelp/queryList.html',
                    leaf: true
                }, {
                    id: 'queryColumns',
                    text: 'Spalten der öffentlichen Selektionen',
                    content: 'resources/ladaHelp/queryColumns.html',
                    leaf: true
                }, {
                    id: 'probe',
                    text: 'Ergebnisliste - Proben',
                    content: 'resources/ladaHelp/probe.html',
                    leaf: true
                }, {
                    id: 'messung',
                    text: 'Ergebnisliste - Messungen',
                    content: 'resources/ladaHelp/messung.html',
                    leaf: true
                }, {
                    id: 'messprogramm',
                    text: 'Ergebnisliste - Messprogramme',
                    content: 'resources/ladaHelp/messprogramm.html',
                    leaf: true
                }, {
                    id: 'datensatzerzeuger',
                    text: 'Ergebnisliste - Datensatzerzeuger',
                    content: 'resources/ladaHelp/datensatzerzeuger.html',
                    leaf: true
                }, {
                    id: 'messprogrammkategorie',
                    text: 'Ergebnisliste - Messprogrammkategorie',
                    content: 'resources/ladaHelp/messprogrammkategorie.html',
                    leaf: true
                }, {
                    id: 'ort',
                    text: 'Ergebnisliste - Orte',
                    content: 'resources/ladaHelp/ort.html',
                    leaf: true
                }, {
                    id: 'probenehmer',
                    text: 'Ergebnisliste - Probenehmer',
                    content: 'resources/ladaHelp/probenehmer.html',
                    leaf: true
                }, {
                    id: 'glossar',
                    text: 'Glossar',
                    content: 'resources/ladaHelp/glossar.html',
                    leaf: true
                }
                ]
            }
        }
    }
});
