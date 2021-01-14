/**
 * Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */
/**
 * Override fixing an ExtJS 6.0 Bug.
 * The garbage collector may destroy unintended elements which cause internal
 * errors in the ExtJS framework.
 * See https://forum.sencha.com/forum/showthread.php?
 *  308989-Grbage-collector-destroys-cached-elements
 */
Ext.define('Lada.override.UnderlayPool', {
    override: 'Ext.dom.UnderlayPool',

    checkOut: function() {
        var cache = this.cache,
            len = cache.length,
            el;

        // do cleanup because some of the objects might have been destroyed
        while (len--) {
            if (cache[len].destroyed) {
                cache.splice(len, 1);
            }
        }
        // end do cleanup

        el = cache.shift();

        if (!el) {
            el = Ext.Element.create(this.elementConfig);
            el.setVisibilityMode(2);
            //<debug>
            // tell the spec runner to ignore this element when checking if
            // the dom is clean
            el.dom.setAttribute('data-sticky', true);
            //</debug>
        }

        return el;
    }
});
