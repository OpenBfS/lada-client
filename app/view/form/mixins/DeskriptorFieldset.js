/* Copyright (C) 2022 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Mixin providing special functions for handling Deskriptor fieldset.
 */
Ext.define('Lada.view.form.mixins.DeskriptorFieldset', {

    setMediaDeskImpl: function(scheduler, record) {
        var media = record.get('mediaDesk');
        if (media) {
            var mediaParts = media.split(' ');
            scheduler.enqueue(
                this.setMediaSN, [scheduler, 0, mediaParts], this);
        } else {
            scheduler.enqueue(
                this.setMediaSN, [scheduler, 0, '0'], this);
        }
        scheduler.next();
    },

    setMediaSN: function(scheduler, ndx, media, beschreibung) {
        var mediabeschreibung = this.getForm().findField('media');
        if (ndx >= 12) {
            scheduler.finished();
            mediabeschreibung.setValue(beschreibung);
            return;
        }
        var me = this;
        var current = this.down('deskriptor[layer=' + ndx + ']');
        var cbox = current.down('combobox');
        cbox.store.proxy.extraParams = {
            'layer': ndx
        };
        if (ndx >= 1) {
            var parents = current.getParents(cbox);
            if (parents.length === 0) {
                scheduler.finished();
                return;
            }
            cbox.store.proxy.extraParams.parents = parents;
        }
        cbox.store.load(function(records, op, success) {
            if (!success) {
                scheduler.finished();
                return;
            }
            var mediatext;
            try {
                mediatext = cbox.store.findRecord(
                    'sn', parseInt(media[ndx + 1], 10), 0, false, false, true);
                cbox.select(mediatext);
            } catch (e) {
                Ext.log({msg: 'Selecting media failed: ' + e, level: 'warn'});
                scheduler.finished();
                return;
            }
            if (mediatext !== null) {
                if (mediatext.data.beschreibung !== 'leer'
                    && (ndx <= 3 && media[1] === '01'
                        || ndx <= 1 && media[1] !== '01')
                ) {
                    beschreibung = mediatext.data.beschreibung;
                }
            }
            var nextNdx = ++ndx;
            scheduler.enqueue(
                me.setMediaSN, [scheduler, nextNdx, media, beschreibung], me);
            scheduler.finished();
        });
    },

    buildDescriptors: function() {
        var fields = [];
        for (var i = 0; i < 12; i++) {
            fields[i] = {
                xtype: 'deskriptor',
                fieldLabel: 'S' + i,
                name: 's' + i,
                labelWidth: 25,
                width: 190,
                layer: i,
                margin: '0, 10, 5, 0'
            };
        }
        return fields;
    }
});
