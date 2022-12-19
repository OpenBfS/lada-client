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
        'Lada.view.widget.Verwaltungseinheit',
        'Lada.view.widget.Staat',
        'Lada.view.widget.KoordinatenArt'
    ],
    model: null,

    margin: 5,

    scrollable: true,

    mode: null,

    border: false,

    record: null,

    original: null,

    trackResetOnLoad: true,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.items = [{
            xtype: 'netzbetreiber',
            name: 'netzbetreiberId',
            submitValue: true,
            border: false,
            fieldLabel: i18n.getMsg('netzbetreiberId'),
            labelWidth: 125,
            filteredStore: true,
            editable: true,
            allowBlank: false,
            value: this.record.get('netzbetreiberId')
        }, {
            xtype: 'tfield',
            name: 'ortId',
            maxLength: 20,
            labelWidth: 125,
            fieldLabel: i18n.getMsg('orte.ortId')
        }, {
            xtype: 'ortszusatz',
            labelWidth: 125,
            editable: true,
            name: 'ozId',
            fieldLabel: i18n.getMsg('orte.ozIdS')
        }, {
            xtype: 'orttyp',
            labelWidth: 125,
            maxLength: 100,
            editable: true,
            name: 'ortTyp',
            fieldLabel: i18n.getMsg('orte.ortTyp')
        }, {
            xtype: 'tfield',
            labelWidth: 125,
            maxLength: 15,
            name: 'kurztext',
            fieldLabel: i18n.getMsg('orte.kurztext')
        }, {
            xtype: 'tfield',
            labelWidth: 125,
            maxLength: 100,
            fieldLabel: i18n.getMsg('orte.langtext'),
            name: 'langtext'
        }, {
            xtype: 'staat',
            labelWidth: 125,
            fieldLabel: i18n.getMsg('staat'),
            name: 'staatId',
            forceSelection: true
        }, {
            xtype: 'verwaltungseinheit',
            labelWidth: 125,
            fieldLabel: i18n.getMsg('orte.verwaltungseinheit'),
            forceSelection: true,
            name: 'gemId'
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
                name: 'berichtstext'
            }, {
                xtype: 'reiprogpunktgruppe',
                labelWidth: 125,
                maxLength: 100,
                name: 'reiProgpunktGrpId',
                editable: true,
                fieldLabel: i18n.getMsg('reiProgpunktGrpId')
            }, {
                xtype: 'ktagruppe',
                labelWidth: 125,
                maxLength: 100,
                name: 'ktaGruppeId',
                fieldLabel: i18n.getMsg('orte.anlageId')
            }, {
                xtype: 'tfield',
                labelWidth: 125,
                maxLength: 1,
                name: 'zone',
                fieldLabel: i18n.getMsg('orte.zone')
            }, {
                xtype: 'tfield',
                labelWidth: 125,
                maxLength: 2,
                name: 'sektor',
                fieldLabel: i18n.getMsg('orte.sektor')
            }, {
                xtype: 'tfield',
                labelWidth: 125,
                maxLength: 10,
                name: 'zustaendigkeit',
                fieldLabel: i18n.getMsg('orte.zustaendigkeit')
            }, {
                xtype: 'tfield',
                labelWidth: 125,
                maxLength: 10,
                name: 'mpArt',
                fieldLabel: i18n.getMsg('orte.mpArt')
            }, {
                xtype: 'chkbox',
                labelWidth: 125,
                name: 'aktiv',
                fieldLabel: i18n.getMsg('orte.aktiv')
            }]
        }, {
            xtype: 'fset',
            collapsible: true,
            name: 'koordinaten',
            items: [{
                xtype: 'koordinatenart',
                labelWidth: 125,
                fieldLabel: i18n.getMsg('orte.kda'),
                name: 'kdaId'
            }, {
                xtype: 'tfield',
                labelWidth: 125,
                fieldLabel: i18n.getMsg('orte.koordx'),
                regex: /^[noeswNOESW\d\.,-]+$/,
                name: 'koordXExtern',
                maxLength: 22
            }, {
                xtype: 'tfield',
                labelWidth: 125,
                fieldLabel: i18n.getMsg('orte.koordy'),
                name: 'koordYExtern',
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
            name: 'unscharf'
        }, {
            xtype: 'numfield',
            labelWidth: 125,
            fieldLabel: i18n.getMsg('orte.hoeheLand'),
            name: 'hoeheLand',
            maxLength: 10,
            allowDecimals: true
        }, {
            xtype: 'numfield',
            labelWidth: 125,
            fieldLabel: i18n.getMsg('orte.hoeheUeberNn'),
            name: 'hoeheUeberNn',
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
                disabled: !this.record.phantom && !this.record.get('readonly') ?
                    false :
                    true
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

        if (this.mode === 'show') {
            this.setReadOnly(true);
        } else {
            this.setReadOnly(false);
        }

        //If plausible probe instances reference this ort, disable coordinate
        // fields, verwaltungseinheit, staat, koordiantenart, button change kda
        if (this.record.get('plausibleReferenceCount') > 0 ||
                this.record.get('referenceCountMp') > 0) {
            this.down('tfield[name=koordXExtern]').setReadOnly(true);
            this.down('tfield[name=koordYExtern]').setReadOnly(true);
            this.down('verwaltungseinheit').setReadOnly(true);
            this.down('staat').setReadOnly(true);
            this.down('koordinatenart').setReadOnly(true);
        }

        if (this.record.get('ortTyp') === 3) {
            this.down('fieldset').expand();
            this.down('ortszusatz').setHidden(false);
        }
        if (this.record.get('netzbetreiberId') &&
            this.record.get('netzbetreiberId') !== '') {
            this.down('netzbetreiber').down('combobox').setEditable(false);
            this.down('netzbetreiber').down('combobox').setReadOnly(true);
        }
    },

    setMessages: function(errors, warnings) {
        var key;
        var element;
        var content;
        var i18n = Lada.getApplication().bundle;
        if (warnings) {
            for (key in warnings) {
                element = this.down('component[name=' + key + ']');
                if (!element) {
                    continue;
                }
                content = warnings[key];
                var warnText = '';
                for (var i = 0; i < content.length; i++) {
                    warnText += i18n.getMsg(content[i].toString()) + '\n';
                }
                element.showWarnings(warnText);
            }
        }
        if (errors) {
            for (key in errors) {
                element = this.down('component[name=' + key + ']');
                if (!element) {
                    continue;
                }
                content = errors[key];
                var errorText = '';
                for (var j = 0; j < content.length; j++) {
                    errorText += i18n.getMsg(content[j].toString()) + '\n';
                }
                element.showErrors(errorText);
            }
        }
    },

    clearMessages: function() {
        // TODO: this is a stub
        this.down('tfield[name=koordXExtern]').clearWarningOrError();
        this.down('tfield[name=koordYExtern]').clearWarningOrError();
        this.down('verwaltungseinheit[name=gemId]').clearWarningOrError();
        this.down('orttyp[name=ortTyp]').clearWarningOrError();
        this.down('staat[name=staatId]').clearWarningOrError();
        this.down('koordinatenart[name=kdaId]').clearWarningOrError();
        this.down('fset[name=koordinaten]').clearMessages();
        this.down('fset[name=reiProperties]').clearMessages();
        this.down('tfield[name=ortId]').clearWarningOrError();
        this.down('ktagruppe[name=ktaGruppeId]').clearWarningOrError();
    }
});
