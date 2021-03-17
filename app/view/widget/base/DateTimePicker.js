/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This Widget extends a DateTimePicker in order to create a
 * something like a DateTimePicker
 */
Ext.define('Lada.view.widget.base.DateTimePicker', {
    extend: 'Ext.picker.Date',
    alias: 'widget.datetimepicker',
    requires: [
        'Ext.picker.Date',
        'Ext.form.field.Number'
    ],

    renderTpl: [
        /*eslint-disable max-len*/
        '<div id="{id}-innerEl" data-ref="innerEl" role="grid">',
        '<div role="presentation" class="{baseCls}-header">',
        // the href attribute is required for the :hover selector to work in IE6/7/quirks
        '<a id="{id}-prevEl" data-ref="prevEl" class="{baseCls}-prev {baseCls}-arrow" href="#" role="button" title="{prevText}" hidefocus="on" ></a>',
        '<div class="{baseCls}-month" id="{id}-middleBtnEl">{%this.renderMonthBtn(values, out)%}</div>',
        // the href attribute is required for the :hover selector to work in IE6/7/quirks
        '<a id="{id}-nextEl" data-ref="nextEl" class="{baseCls}-next {baseCls}-arrow" href="#" role="button" title="{nextText}" hidefocus="on" ></a>',
        '</div>',
        '<table id="{id}-eventEl" data-ref="eventEl" class="{baseCls}-inner" cellspacing="0" role="grid">',
        '<thead role="presentation"><tr role="row">',
        '<tpl for="dayNames">',
        '<th role="columnheader" class="{parent.baseCls}-column-header" title="{.}">',
        '<div class="{parent.baseCls}-column-header-inner">{.:this.firstInitial}</div>',
        '</th>',
        '</tpl>',
        '</tr></thead>',
        '<tbody role="presentation"><tr role="row">',
        '<tpl for="days">',
        '{#:this.isEndOfWeek}',
        '<td role="gridcell" id="{[Ext.id()]}">',
        // the href attribute is required for the :hover selector to work in IE6/7/quirks
        '<div role="presentation" hidefocus="on" class="{parent.baseCls}-date" href="#"></div>',

        '</td>',
        '</tpl>',
        '</tr></tbody>',
        '</table>',
        '<div id="{id}-timeEl" role="presentation" class="{baseCls}-footer">',
        '<table cellspacing="0">',
        '<colgroup><col width="70"><col width="40"><col width="40"></colgroup>',
        '<tr>',
        '<td style="vertical-align:center;">',
        '<div id="{id}-timeLabelEl" role="presentation">{%this.renderTimeLabel(values, out)%}</div>',
        '</td><td>',
        '<div id="{id}-timeHourEl" role="presentation">{%this.renderTimeHour(values, out)%}</div>',
        '</td><td>',
        '<div id="{id}-timeMinuteEl" role="presentation">{%this.renderTimeMinute(values, out)%}</div>',
        '</td>',
        '</tr>',
        '</table>',
        '<table cellspacing="0" style="margin-top:5px;margin-left:10px;">',
        '<colgroup width="75"></colgroup>',
        '<tr>',
        '<td>',
        '<div id="{id}-footerNowEl" role="presentation">{%this.renderTodayBtn(values, out)%}</div>',
        '</td><td>',
        '<div id="{id}-footerAcceptEl" role="presentation">{%this.renderAcceptBtn(values, out)%}</div>',
        '</td>',
        '</tr>',
        '</table>',
        '</div>',
        '</div>',
        /*eslint-enable max-len*/
        {
            firstInitial: function(value) {
                return Ext.picker.Date.prototype.getDayInitial(value);
            },
            isEndOfWeek: function(value) {
                // convert from 1 based index to 0 based
                // by decrementing value once.
                value--;
                var end = value % 7 === 0 && value !== 0;
                return end ? '</tr><tr role="row">' : '';
            },
            renderTodayBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(
                    values.$comp.todayBtn.getRenderTree(), out);
            },
            renderMonthBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(
                    values.$comp.monthBtn.getRenderTree(), out);
            },
            renderTimeLabel: function(values, out) {
                Ext.DomHelper.generateMarkup(
                    values.$comp.timeLabel.getRenderTree(), out);
            },
            renderTimeHour: function(values, out) {
                Ext.DomHelper.generateMarkup(
                    values.$comp.hourField.getRenderTree(), out);
            },
            renderTimeMinute: function(values, out) {
                Ext.DomHelper.generateMarkup(
                    values.$comp.minuteField.getRenderTree(), out);
            },
            renderAcceptBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(
                    values.$comp.acceptBtn.getRenderTree(), out);
            }
        }
    ],

    beforeRender: function() {
        var i18n = Lada.getApplication().bundle;
        this.todayText= i18n.getMsg('now');
        var me = this;
        me.callParent(arguments);
        me.hourField = new Ext.form.field.Number({
            ownerCt: me,
            ownerLayout: me.getComponentLayout(),
            width: 60,
            value: 0,
            valueToRaw: function(value) {
                return (value < 10 ? '0' : '') + value; // add leading Zero
            },
            maxValue: 23,
            maxLength: 2,
            enforceMaxLength: true,
            onSpinUp: function() {
                var value = parseInt(this.getValue(), 10);
                if (value === 23) {
                    return;
                }
                var newValue = value + 1;
                this.setValue(newValue);
            },
            onSpinDown: function() {
                var value = parseInt(this.getValue(), 10);
                if (value === 0) {
                    return;
                }
                var newValue = value - 1;
                this.setValue(newValue);
            },
            listeners: {
                change: me.changeTimeValue,
                scope: me
            },
            checkChangeEvents: ['change']
        });

        me.minuteField = new Ext.form.field.Number({
            ownerCt: me,
            ownerLayout: me.getComponentLayout(),
            width: 60,
            value: 0,
            maxValue: 59,
            valueToRaw: function(value) {
                return (value < 10 ? '0' : '') + value; // add leading Zero
            },
            maxLength: 2,
            enforceMaxLength: true,
            onSpinUp: function() {
                var value = parseInt(this.getValue(), 10);
                if (value === 59) {
                    return;
                }
                var newValue = value + 1;
                this.setValue(newValue);
            },
            onSpinDown: function() {
                var value = parseInt(this.getValue(), 10);
                if (value === 0) {
                    return;
                }
                var newValue = value - 1;
                this.setValue(newValue);
            },
            listeners: {
                change: me.changeTimeValue,
                scope: me
            },
            checkChangeEvents: ['change']
        });

        me.timeLabel = new Ext.form.Label({
            ownerCt: me,
            ownerLayout: me.getComponentLayout(),
            text: i18n.getMsg('time')
        });
        me.acceptBtn = new Ext.button.Button({
            ownerCt: me,
            ownerLayout: me.getComponentLayout(),
            text: i18n.getMsg('apply'),
            handler: me.acceptDate,
            scope: me
        });
    },
    privates: {
        finishRenderChildren: function() {
            var me = this;
            me.callParent(arguments);
            me.timeLabel.finishRender();
            me.hourField.finishRender();
            me.minuteField.finishRender();
            me.acceptBtn.finishRender();
        }
    },

    showTimePicker: function() {
        var me = this;
        var el = me.el;
        Ext.defer(function() {
            var xPos = el.getX();
            var yPos = el.getY() + el.getHeight();
            me.timePicker.setHeight(30);
            me.timePicker.setWidth(el.getWidth());
            me.timePicker.setPosition(xPos, yPos);
            me.timePicker.show();
        }, 1);
    },

    beforeDestroy: function() {
        var me = this;
        if (me.rendered) {
            Ext.destroy(
                me.minuteField,
                me.hourField
            );
        }
        me.callParent();
    },

    changeTimeValue: function(field, nValue) {
        var value = parseInt(nValue, 10);
        if (value > field.maxValue) {
            field.setValue(field.maxValue);
        }
        if (value === null || value === '' || isNaN(value)) {
            field.setValue('0');
        }
    },

    setValue: function(value) {
        value.setSeconds(0);
        this.value = new Date(value);
        this.hourField.setValue(
            parseInt(
                Lada.util.Date.formatTimestamp(
                    value.valueOf(), 'H', true),
                10));
        this.minuteField.setValue(value.getMinutes());
        return this.update(this.value);
    },

    selectToday: function() {
        var me = this;
        var btn = me.todayBtn;
        var handler = me.handler;
        var auxDate = new Date();

        if (btn && !btn.disabled) {
            me.pickerField.setValue(new Date(auxDate.setSeconds(0)));
            me.setValue(new Date(auxDate.setSeconds(0)));
            if (handler) {
                handler.call(me.scope || me, me, me.value);
            }
            me.onSelect();
        }
        return me;
    },

    acceptDate: function() {
        var me = this;
        var hourSet = me.hourField.getValue();
        var minuteSet = me.minuteField.getValue();
        var currentDate = me.value;
        currentDate.setHours(hourSet);
        currentDate.setMinutes(minuteSet);
        currentDate = Lada.util.Date.shiftDateObject(currentDate);
        me.setValue(currentDate);
        me.fireEvent('select', me, currentDate);
    },

    handleDateClick: function(e, t) {
        var me = this;
        var handler = me.handler;
        var hourSet = me.hourField.getValue();
        var minuteSet = me.minuteField.getValue();
        var auxDate = new Date(t.dateValue);
        e.stopEvent();
        if (!me.disabled &&
            t.dateValue &&
            !Ext.fly(t.parentNode).hasCls(me.disabledCellCls)
        ) {
            me.doCancelFocus = me.focusOnSelect === false;
            auxDate.setHours(hourSet, minuteSet, 0);
            me.setValue(
                Lada.util.Date.shiftDateObject(auxDate));
            delete me.doCancelFocus;
            if (handler) {
                handler.call(me.scope || me, me, me.value);
            }
            // event handling is turned off on hide
            // when we are using the picker in a field
            // therefore onSelect comes AFTER the select
            // event.
            me.onSelect();
        }
    },

    selectedUpdate: function(date) {
        var me = this;
        var dateOnly = Ext.Date.clearTime(date, true);
        var t = dateOnly.getTime();
        var currentDate = (me.pickerField && me.pickerField.getValue()) ||
            new Date();
        var cells = me.cells;
        var cls = me.selectedCls;
        var cellItems = cells.elements;
        var c;
        var cLen = cellItems.length;
        var cell;

        cells.removeCls(cls);

        for (c = 0; c < cLen; c++) {
            cell = Ext.fly(cellItems[c]);

            if (cell.dom.firstChild.dateValue === t) {
                me.fireEvent('highlightitem', me, cell);
                cell.addCls(cls);

                if (me.isVisible() && !me.doCancelFocus) {
                    Ext.fly(cell.dom.firstChild).focus(50);
                }

                break;
            }
        }
        if (currentDate) {
            me.hourField.setValue(
                parseInt(
                    Lada.util.Date.formatTimestamp(
                        currentDate, 'H', true),
                    10));
            me.minuteField.setValue(currentDate.getMinutes());
        }
    }
});
