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
    extend: 'Ext.form.Panel',
    alias: 'widget.ortform',
    requires: [
        'Lada.view.widget.Verwaltungseinheit',
        'Lada.view.widget.Staat'
    ],
    model: null,

    margin: 5,

    mode: null,

    border: false,

    record: null,

    original: null,

    trackResetOnLoad: true,

    readOnly: true,

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
            forceSelection: true,
            value: this.record.get('netzbetreiberId')
        }, {
            xtype: 'tfield',
            name: 'ortId',
            maxLength: 13,
            labelWidth: 125,
            fieldLabel: i18n.getMsg('orte.ortId')
        }, {
            xtype: 'ortszusatz',
            labelWidth: 125,
            editable: true,
            name: 'ozId',
            fieldLabel: i18n.getMsg('orte.ozId')
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
            xtype: 'fieldset',
            collapsible: true,
            collapsed: true,
            title: i18n.getMsg('orte.prop'),
            items: [{
                xtype: 'tfield',
                labelWidth: 125,
                maxLength: 70,
                fieldLabel: i18n.getMsg('orte.berichtstext'),
                name: 'berichtstext'
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
            xtype: 'koordinatenart',
            labelWidth: 125,
            fieldLabel: i18n.getMsg('orte.kda'),
            name: 'kdaId'
        }, {
            xtype: 'numfield',
            labelWidth: 125,
            fieldLabel: i18n.getMsg('orte.koordx'),
            name: 'koordXExtern',
            allowDecimals: true,
            decimalPrecision: 5,
            maxLength: 22
        }, {
            xtype: 'numfield',
            labelWidth: 125,
            fieldLabel: i18n.getMsg('orte.koordy'),
            name: 'koordYExtern',
            allowDecimals: true,
            decimalPrecision: 5,
            maxLength: 22
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
            xtype: 'tfield',
            labelWidth: 125,
            maxLength: 10,
            name: 'nutsCode',
            fieldLabel: i18n.getMsg('orte.nutsCode')
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
                disabled: this.record.phantom ? true: false
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

        this.readOnly = this.record.readOnly;

        if (this.record.get('ortTyp') === 3) {
            this.down('fieldset').expand();
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
                for (var i = 0; i < content.length; i++) {
                    errorText += i18n.getMsg(content[i].toString()) + '\n';
                }
                element.showErrors(errorText);
            }
        }
    },

    clearMessages: function() {
        // TODO: this is a stub
        this.down('numfield[name=koordXExtern]').clearWarningOrError();
        this.down('numfield[name=koordYExtern]').clearWarningOrError();
        this.down('verwaltungseinheit[name=gemId]').clearWarningOrError();
        this.down('orttyp[name=ortTyp]').clearWarningOrError();
        this.down('staat[name=staatId]').clearWarningOrError();
        this.down('koordinatenart[name=kdaId]').clearWarningOrError();
    }
});
