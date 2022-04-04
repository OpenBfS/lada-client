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
        '<tpl if="typId === `global`">',
        '<div class="italic-text bold-text"> {tag}</div>',
        '<tpl elseif="typId === `netzbetreiber`">',
        '<div class="bold-text"> {tag}</div>',
        '<tpl elseif="typId === `auto`">',
        '<div class="italic-text"> {tag}*</div>',
        '<tpl else>',
        '<div> {tag}</div>',
        '</tpl>',
        '</li>',
        '</tpl></ul>'

    ),
    //Tagfield
    labelTpl: Ext.create('Ext.XTemplate',
        '<tpl if="typId === `global`"class="italic-text bold-text"> {tag}',
        '<tpl elseif="typId === `netzbetreiber`" class="bold-text"> {tag}',
        '<tpl elseif="typId === `auto`" class="italic-text"> {tag}*',
        '<tpl else>{tag}',
        '</tpl>'
    ),

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
        if (!store){
            Ext.create('Lada.store.Tag', {
                storeId: 'tags'
            });
        }
        this.store = Ext.data.StoreManager.get('tags');

        this.reloadMask = Ext.create('Lada.view.window.ReloadMask', {
            reloadButtonHandler: me.reloadButtonClicked,
            reloadButtonHandlerScope: me
        });

        this.store.setLoadingCallback(
            // TODO check if broken. 'me' will now be 'the last tag widget that
            // was initialized'
            function(str, records, successful) {
                //Skip if component is no longer visible
                if (!me.isVisible()) {
                    return;
                }
                if (!successful) {
                    me.setLoading(false);
                    me.reloadMask.renderTo = me.getMaskTarget();
                    me.mask();
                    me.showReloadMask();
                }
            }
        );

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
            '{[this.getAutoStar(values.data)]}',
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
                getItemCls: function(value){
                    var result = 'x-tagfield-item-text';
                    switch (value.typId) {
                        case 'global':
                            return  result + ' bold-text italic-text';
                        case 'netzbetreiber':
                            return result + ' bold-text';
                        case 'auto':
                            return result + ' italic-text';
                        default:
                            return result;
                    }
                },
                getAutoStar: function(value) {
                    return value.typId === 'auto' ? '*' : '';
                },
                strict: true
            }
        );

        this.callParent(arguments);
    },

    /**
     * Sets the current Proben or Messungen and triggers the preselection
     */
    setTagged: function(ids, recordType) {
        this.store.setTagged(ids, recordType);
        this.preselectTags();
    },

    /**
     * Handle clicks on reload button.
     * Calls reload function
     */
    reloadButtonClicked: function() {
        this.reload();
    },

    /**
     *  Reloads the current store.
     *  @param silent If true, no tags are preselected.
     *  @param callback Callback function to call after reload
     */
    reload: function(callback) {
        var me = this;
        me.hideReloadMask();
        me.setLoading(true);
        this.store.load({
            callback: function() {
                me.preselectTags();
                if (callback) {
                    callback.call();
                }
                me.setLoading(false);
            }
        });
    },

    /**
     * Loads and preselects assigned tags, if any.
     */
    preselectTags: function() {
        this.setLoading(true);

        this.store.loadAssignedTags(this, function(records) {
            var ids = [];

            //Set tags, received from the server
            if (records) {
                for (var j = 0; j < records.length; j++) {
                    ids.push(records[j].id);
                }
            }
            this.setValue(ids);
            this.resetOriginalValue();
            this.setLoading(false);
        });
    },

    /**
     * Mask this component using the reload mask
     */
    showReloadMask: function() {
        if (this.reloadMask.isHidden()) {
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
