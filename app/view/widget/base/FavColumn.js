/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.view.widget.base.FavColumn', {
    extend: 'Ext.grid.column.CheckColumn',
    alias: 'widget.favcolumn',
    /*
    constructor: function() {
        this.addEvents(
            'checkchange'
        );
        this.callParent(arguments);
    },
*/
    renderer: function(value, metaData, record) {
        var cssPrefix = Ext.baseCSSPrefix;
        var cls = [cssPrefix + 'grid-checkheader'];
        if (value) {
            cls.push(cssPrefix + 'grid-favcolumn-checked');
        } else {
            cls.push(cssPrefix + 'grid-favcolumn-unchecked');
        }
        return '<div class="' + cls.join(' ') + '">&#160;</div>';
    }
});
