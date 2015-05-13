Ext.define('Lada.view.widget.ProbenintervallSlider', {
    extend: 'Ext.slider.Multi',
    alias: 'widget.probenintervallslider',
    useTips: false,
    isFormField: false,
    //editable: this.editable || false,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;

        this.callParent(arguments);
    }
});
