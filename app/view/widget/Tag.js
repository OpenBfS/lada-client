/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Tagfield for tags
 */
Ext.define('Lada.view.widget.Tag', {
    extend: 'Ext.form.field.Tag',
    alias: 'widget.tagwidget',
    requires: [
        'Lada.view.window.ReloadMask',
        'Lada.store.Tag'
    ],
    store: null,
    displayField: 'tag',
    valueField: 'id',
    // Enable filtering of comboboxes
    autoSelect: false,
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    minChars: 0,
    submitValue: false,

    /**
     * @private
     * Mask component to be show if store failed loading
     */
    reloadMask: null,

    /**
     * Window containing this widget.
     */
    parentWindow: null,

    /**
     * Component type to use as render target for the loading mask
     */
    maskTargetComponentType: 'fieldset',
    /**
     * Component name to use as render target for the loading mask
     */
    maskTargetComponentName: 'tagfieldset',

    //Templates to render global tags differently
    //Dropdown
    tpl: Ext.create('Ext.XTemplate',
        '<ul class="x-list-plain"><tpl for=".">',
        '<li role="option" class="x-boundlist-item">',
        '<tpl if="autoTag">',
        '<div class="italic-text"> {tag}*</div>',
        '<tpl elseif="typId === `global`">',
        '<div class="italic-text bold-text"> {tag}</div>',
        '<tpl elseif="typId === `netz`">',
        '<div class="bold-text"> {tag}</div>',
        '<tpl else>',
        '<div> {tag}</div>',
        '</tpl>',
        '</li>',
        '</tpl></ul>'

    ),
    //Tagfield
    labelTpl: Ext.create('Ext.XTemplate', '{tag}<tpl if="autoTag">*</tpl>'),

    /**
     * Get the component to render the loading/reloading mask to.
     */
    getMaskTarget: function() {
        if (!this.parentWindow) {
            return this.getEl();
        }
        var queryString = this.maskTargetComponentType +
            '[name=' +
            this.maskTargetComponentName +
            ']';
        var targetComponent = this.parentWindow.down(queryString);
        if (!targetComponent) {
            Ext.log({
                msg: 'Invalid mask target: ' + queryString,
                level: 'warn'});
        }
        return targetComponent.getEl();
    },

    initComponent: function() {
        var me = this;
        var store = Ext.data.StoreManager.get('tags');
        if (!store) {
            Ext.create('Lada.store.Tag', {
                storeId: 'tags'
            });
        }
        this.store = Ext.data.StoreManager.get('tags');

        this.reloadMask = Ext.create('Lada.view.window.ReloadMask', {
            reloadButtonHandler: me.reloadButtonClicked,
            reloadButtonHandlerScope: me
        });

        // This is a hack to render the close icon at field items conditionally.
        // multiSelectItemTpl is not a documented config, but see
        // https://docs.sencha.com/extjs/6.2.0/classic/src/Tag.js.html
        this.multiSelectItemTpl = Ext.create(
            'Ext.XTemplate',
            '<tpl for=".">',
            '<li data-selectionIndex="{[xindex - 1]}"',
            ' data-recordId="{internalId}"',
            ' role="presentation" class="x-tagfield-item">',
            '<div role="presentation" class="{[this.getItemCls(values.data)]}">',
            '{[this.getItemLabel(values.data)]}',
            '</div>',
            '<tpl if ="!this.isReadOnly()">',
            '<div role="presentation" class="x-tagfield-item-close"></div>',
            '</tpl>',
            '</li>',
            '</tpl>',
            {
                getItemLabel: function(values) {
                    return Ext.String.htmlEncode(me.labelTpl.apply(values));
                },
                isReadOnly: function() {
                    return me.readOnly;
                },
                getItemCls: function(value) {
                    var result = 'x-tagfield-item-text';

                    // Mark tags the user cannot (un)assign
                    if (!me.isTagAssignable(value)) {
                        result += ' disabled';
                    }

                    if (value.autoTag) {
                        return result + ' italic-text';
                    }
                    switch (value.typId) {
                        case 'global':
                            return result + ' bold-text italic-text';
                        case 'netz':
                            return result + ' bold-text';
                        default:
                            return result;
                    }
                },
                strict: true
            }
        );

        // Filter selectable tags in dropdown
        this.on({
            focus: function(tagwidget) {
                var tagStore = tagwidget.getStore();
                tagStore.clearFilter();
                tagStore.filterBy(function(record) {
                    return record.get('typId') === 'global'
                        || record.get('typId') === 'netz'
                        && Ext.Array.contains(
                            Lada.netzbetreiber,
                            record.get('netzbetreiberId'))
                        || record.get('typId') === 'mst'
                        && Ext.Array.contains(
                            Lada.mst,
                            record.get('mstId'));
                });
            },
            focusleave: function(tagwidget) {
                tagwidget.getStore().clearFilter();
            }
        });

        this.callParent(arguments);
    },

    /**
     * Load initial tag selection based on recordType ('probe' or 'messung')
     * and respective IDs. If assignable is true, restrict selection to
     * tags the user might assign.
     */
    setTagged: function(ids, recordType, assignable) {
        this.setLoading(true);

        // Store arguments for potential reload
        this.ids = ids;
        this.recordType = recordType;

        var params = {};
        switch (recordType) {
            case 'messung':
                params.mid = ids;
                break;
            case 'probe':
                params.pid = ids;
                break;
            default:
                Ext.raise('Unkown record type: ' + recordType);
        }

        var me = this;
        Ext.create('Lada.store.Tag', {
            autoLoad: false
        }).load({
            params: params,
            callback: function(records, operation, success) {
                if (!success) {
                    me.showReloadMask();
                }
                if (assignable) {
                    records = Ext.Array.filter(records, function(rec) {
                        return me.isTagAssignable(rec.getData());
                    });
                }
                me.setValue(records);
                me.setLoading(false);
            }
        });
    },

    /**
     * Check whether the user might assign the given tag.
     */
    isTagAssignable: function(tag) {
        switch (tag.typId) {
            case 'netz':
                return Ext.Array.contains(
                    Lada.netzbetreiber, tag.netzbetreiberId);
            case 'mst':
                return Ext.Array.contains(Lada.mst, tag.mstId);
            default:
                return true;
        }
    },

    /**
     * Handle clicks on reload button.
     * Calls reload function
     */
    reloadButtonClicked: function() {
        var me = this;
        me.hideReloadMask();
        me.setLoading(true);
        this.store.load({
            callback: function() {
                me.setTagged(me.ids, me.recordType);
            }
        });
    },

    /**
     * Mask this component using the reload mask
     */
    showReloadMask: function() {
        if (this.reloadMask.isHidden()) {
            this.reloadMask.renderTo = this.getMaskTarget();
            this.mask();
            this.reloadMask.show();
        }
    },

    /**
     * Unmask this component
     */
    hideReloadMask: function() {
        this.unmask();
        if (this.reloadMask && this.reloadMask.isVisible()) {
            this.reloadMask.hide();
        }
    }
});
