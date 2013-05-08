Ext.define('Lada.controller.Sql', {
    extend: 'Ext.app.Controller',
    views: [
        'sql.List'
    ],
    stores: [
        'Sql'
    ],
    init: function() {
        console.log('Initialising the Sql controller');
        this.control({
            // CSS like selector to select element in the viewport. See
            // ComponentQuery documentation for more details.
            'sqllist': {
                // Map the "render" event to the given function.
                render: this.onPanelRendered,
                // Map Doubleclick on rows of the probenlist.
                itemclick: this.selectSql
            }
        });
    },
    onPanelRendered: function() {
        console.log('The panel was rendered');
    },
    selectSql: function(grid, record) {
        var selection = record.get('id');
        var variables = Ext.getCmp('variables');
        var result = Ext.getCmp('result');
        console.log('Selected SQL ' + selection);
        //// Set correct form for the current SQL-Selection
        //console.log('Length is ' + variables.items.length);
        //if (variables.items.length > 1) {
        //    console.log('Length is > than 1');
        //    variables.remove(currentVar.id);
        //}
        //if (selection == 1) {
        //    currentVar = variables1;
        //}
        //else {
        //    currentVar = variables2;
        //}
        //variables.add(currentVar);
        //// Show the panel for the variable definiton.
        //variables.show();

        // Show the results.
        result.getStore().load();
        result.show();
    }
});


var currentVar = null;
var variables1 = {
    xtype: 'panel',
    id: 'variable1',
    border: false,
    html: 'Variablen für Abfrage 1'
};

var variables2 = {
    xtype: 'panel',
    id: 'variable2',
    border: false,
    html: 'Variablen für Abfrage 2'
};
