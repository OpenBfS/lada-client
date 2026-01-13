/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Utility class containing convenience methods regarding i18n
 */
Ext.define('Lada.util.I18n', {
    statics: {

        msgNotFound: /\.undefined$/,

        /**
         * Test if the i18n String is defined.
         * @param {String} key i18n Key
         * @return true or false
         */
        isMsgDefined: function(key) {
            var i18n = Lada.getApplication().bundle;
            return i18n.getMsg(key).search(this.msgNotFound) === -1;
        },

        /**
         * Returns the i18n String if defined or else the given key
         * @param {String} key i18n Key
         * @return i18n String or key
         */
        getMsgIfDefined: function(key) {
            var i18n = Lada.getApplication().bundle;
            return i18n.getMsg(key).replace(this.msgNotFound, '');
        },

        /**
         * Translate keys in list-like messages where list items
         * start with something like '- measmId:'
         */
        translateListKeys: function(msg) {
            for (const matchResult of msg.matchAll(/- (\w+):/g)) {
                const match = matchResult[1];
                msg = msg.replace(
                    match,
                    Lada.util.I18n.getMsgIfDefined(match));
            }

            // Convert newlines to HTML
            return Ext.String.htmlEncode(msg).replace(/\n/g, '<br>');
        }
    }
});
