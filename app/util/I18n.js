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
        }
    }
});
