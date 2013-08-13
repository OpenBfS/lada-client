/*
 * Formular to create a Probe
 */
Ext.define('Lada.view.proben.ImportForm', {
    extend: 'Ext.form.Panel',
    initComponent: function() {
       this.items = [
            {
                xtype: 'fileuploadfield',
                title: 'Importdate'
            }
        ];
        this.callParent();
    }
});
