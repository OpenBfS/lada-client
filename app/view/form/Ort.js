/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Form to create a new Messpunkt
 */
Ext.define('Lada.view.form.Ort', {
    extend: 'Lada.view.form.LadaForm',
    alias: 'widget.ortform',
    requires: [
        'Lada.controller.form.Ort',
        'Lada.view.widget.Verwaltungseinheit',
        'Lada.view.widget.Staat',
        'Lada.view.widget.KoordinatenArt'
    ],
    controller: 'ortform',
    model: null,

    margin: 5,

    scrollable: true,

    border: false,

    record: null,

    trackResetOnLoad: true,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        this.items = [{
            xtype: 'netzbetreiber',
            name: 'networkId',
            border: false,
            fieldLabel: i18n.getMsg('netzbetreiberId'),
            labelWidth: 125,
            filteredStore: true,
            allowBlank: false
        }, {
            xtype: 'tfield',
            name: 'extId',
            maxLength: 20,
            labelWidth: 125,
            fieldLabel: i18n.getMsg('orte.ortId')
        }, {
            xtype: 'ortszusatz',
            labelWidth: 125,
            editable: true,
            name: 'poiId',
            fieldLabel: i18n.getMsg('orte.ozIdS')
        }, {
            xtype: 'orttyp',
            labelWidth: 125,
            maxLength: 100,
            editable: true,
            name: 'siteClassId',
            fieldLabel: i18n.getMsg('orte.ortTyp')
        }, {
            xtype: 'tfield',
            labelWidth: 125,
            maxLength: 20,
            name: 'shortText',
            fieldLabel: i18n.getMsg('orte.kurztext')
        }, {
            xtype: 'tfield',
            labelWidth: 125,
            maxLength: 100,
            fieldLabel: i18n.getMsg('orte.langtext'),
            name: 'longText'
        }, {
            xtype: 'staat',
            labelWidth: 125,
            fieldLabel: i18n.getMsg('staat'),
            name: 'stateId',
            validator: function(val) {
                var hasMinFields = Boolean(
                    me.down('field[name=spatRefSysId]').getValue()
                        || me.down('field[name=adminUnitId]').getValue()
                        || val);
                return hasMinFields || i18n.getMsg('orte.hasNotMinFields');
            },
            forceSelection: true
        }, {
            xtype: 'verwaltungseinheit',
            labelWidth: 125,
            fieldLabel: i18n.getMsg('orte.verwaltungseinheit'),
            validator: function(val) {
                var hasMinFields = Boolean(
                    me.down('field[name=spatRefSysId]').getValue()
                        || val
                        || me.down('field[name=stateId]').getValue());
                return hasMinFields || i18n.getMsg('orte.hasNotMinFields');
            },
            forceSelection: true,
            name: 'adminUnitId'
        }, {
            xtype: 'fset',
            collapsible: true,
            collapsed: true,
            title: i18n.getMsg('orte.prop'),
            name: 'reiProperties',
            items: [{
                xtype: 'tfield',
                labelWidth: 125,
                maxLength: 70,
                fieldLabel: i18n.getMsg('orte.berichtstext'),
                name: 'reiReportText'
            }, {
                xtype: 'reiprogpunktgruppe',
                labelWidth: 125,
                maxLength: 100,
                name: 'reiAgGrId',
                editable: true,
                fieldLabel: i18n.getMsg('reiAgGrId')
            }, {
                xtype: 'ktagruppe',
                labelWidth: 125,
                maxLength: 100,
                name: 'nuclFacilGrId',
                fieldLabel: i18n.getMsg('orte.anlageId')
            }, {
                xtype: 'tfield',
                labelWidth: 125,
                maxLength: 1,
                name: 'reiZone',
                fieldLabel: i18n.getMsg('orte.zone')
            }, {
                xtype: 'tfield',
                labelWidth: 125,
                maxLength: 2,
                name: 'reiSector',
                fieldLabel: i18n.getMsg('orte.sektor')
            }, {
                xtype: 'tfield',
                labelWidth: 125,
                maxLength: 10,
                name: 'reiCompetence',
                fieldLabel: i18n.getMsg('orte.zustaendigkeit')
            }, {
                xtype: 'tfield',
                labelWidth: 125,
                maxLength: 10,
                name: 'reiOprMode',
                fieldLabel: i18n.getMsg('orte.mpArt')
            }, {
                xtype: 'chkbox',
                labelWidth: 125,
                name: 'isReiActive',
                fieldLabel: i18n.getMsg('orte.aktiv')
            }]
        }, {
            xtype: 'fset',
            collapsible: true,
            name: 'coordinates',
            items: [{
                xtype: 'koordinatenart',
                labelWidth: 125,
                fieldLabel: i18n.getMsg('orte.kda'),
                validator: function(val) {
                    var hasMinFields = Boolean(
                        val
                            || me.down('field[name=adminUnitId]').getValue()
                            || me.down('field[name=stateId]').getValue());
                    return hasMinFields || i18n.getMsg('orte.hasNotMinFields');
                },
                name: 'spatRefSysId'
            }, {
                xtype: 'tfield',
                labelWidth: 125,
                fieldLabel: i18n.getMsg('coordXExt'),
                validator: function(val) {
                    var kda = me.down('field[name=spatRefSysId]').getValue();
                    var hasMinFields = Boolean(!kda || kda && val);
                    return hasMinFields || i18n.getMsg('orte.hasNotMinFields');
                },
                regex: /^[noeswNOESW\d\.,-]+$/,
                name: 'coordXExt',
                maxLength: 22
            }, {
                xtype: 'tfield',
                labelWidth: 125,
                fieldLabel: i18n.getMsg('coordYExt'),
                name: 'coordYExt',
                validator: function(val) {
                    var kda = me.down('field[name=spatRefSysId]').getValue();
                    var hasMinFields = Boolean(!kda || kda && val);
                    return hasMinFields || i18n.getMsg('orte.hasNotMinFields');
                },
                regex: /^[noeswNOESW\d\.,-]+$/,
                maxLength: 22
            }]
        }, {
            xtype: 'button',
            action: 'changeKDA',
            disabled: true,
            text: i18n.getMsg('orte.kda.change'),
            flex: 1,
            align: 'end'
        }, {
            xtype: 'chkbox',
            labelWidth: 125,
            fieldLabel: i18n.getMsg('orte.unscharf'),
            name: 'isFuzzy'
        }, {
            xtype: 'numfield',
            labelWidth: 125,
            fieldLabel: i18n.getMsg('orte.hoeheLand'),
            name: 'alt',
            maxLength: 10,
            allowDecimals: true
        }, {
            xtype: 'numfield',
            labelWidth: 125,
            fieldLabel: i18n.getMsg('orte.hoeheUeberNn'),
            name: 'heightAsl',
            maxLength: 10,
            allowDecimals: true
        }, {
            xtype: 'label',
            style: 'font-style: italic',
            border: 10,
            text: i18n.getMsg('orte.references') + ': ' +
                this.record.get('referenceCount') +
                ' /' +
                this.record.get('plausibleReferenceCount') +
                ' /' +
                this.record.get('referenceCountMp') + ' ' +
                i18n.getMsg('orte.references.text')
        }];
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            border: '0, 1, 1, 1',
            style: {
                borderBottom: '1px solid #b5b8c8 !important',
                borderLeft: '1px solid #b5b8c8 !important',
                borderRight: '1px solid #b5b8c8 !important'
            },
            items: [{
                text: i18n.getMsg('copy'),
                action: 'copy',
                qtip: i18n.getMsg('copy.qtip', i18n.getMsg('ort')),
                icon: 'resources/img/dialog-ok-apply.png',
                disabled: true
            },
            '->',
            {
                text: i18n.getMsg('save'),
                action: 'save',
                qtip: i18n.getMsg('save.qtip'),
                icon: 'resources/img/dialog-ok-apply.png',
                disabled: true
            }, {
                text: i18n.getMsg('discard'),
                qtip: i18n.getMsg('discard.qtip'),
                icon: 'resources/img/dialog-cancel.png',
                action: 'revert',
                disabled: true
            }]
        }];
        this.callParent(arguments);
        this.getForm().loadRecord(this.record);

        //If plausible probe instances reference this ort, disable coordinate
        // fields, verwaltungseinheit, staat, koordiantenart, button change kda
        if (this.record.get('plausibleReferenceCount') > 0 ||
                this.record.get('referenceCountMp') > 0) {
            this.down('tfield[name=coordXExt]').setReadOnly(true);
            this.down('tfield[name=coordYExt]').setReadOnly(true);
            this.down('verwaltungseinheit').setReadOnly(true);
            this.down('staat').setReadOnly(true);
            this.down('koordinatenart').setReadOnly(true);
        }

        if (this.record.get('ortTyp') === 3) {
            this.down('fieldset').expand();
            this.down('ortszusatz').setHidden(false);
        }
        if (this.record.get('networkId') &&
            this.record.get('networkId') !== '') {
            this.down('netzbetreiber').down('combobox').setEditable(false);
            this.down('netzbetreiber').down('combobox').setReadOnly(true);
        }
    }
});
