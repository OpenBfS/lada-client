/**
 * This is a slider widget to display Probenintervalle
 */
Ext.define('Lada.view.widget.ProbenintervallSlider', {
    extend: 'Ext.slider.Multi',
    alias: 'widget.probenintervallslider',
    useTips: false,
    isFormField: false,
    //editable: this.editable || false,

    initComponent: function() {
        this.callParent(arguments);
    }
});
