/*
 * Window to edit a Probe
 */
Ext.define('Lada.view.About', {
    extend: 'Ext.window.Window',
    alias: 'widget.about',

    title: 'Lada Information',
    // Make size of the dialog dependend of the available space.
    // TODO: Handle resizing the browser window.
    width: 200,
    height: 200,
    autoShow: true,
    autoScroll: true,
    modal: true,
    layout: "fit",

    initComponent: function() {
        var sver = "tests"
        var cver = "testc"
        this.buttons = [
            {
                text: 'Abbrechen',
                scope: this,
                handler: this.close,
            }
        ];
        this.items = [ 
            { html: "<h1>Lada</h1>Server version: " + sver + "<br>Client version: " + cver }
        ];
        this.callParent();
    },
});

