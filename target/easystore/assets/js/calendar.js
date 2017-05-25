var fullcalendar=function(){var colorClass;function events(){$(document).on("click touchstart",".event-color > li > a",function(e){e.preventDefault();e.stopPropagation();colorClass=$(this).data("class");$("#event-color-btn").removeClass().addClass("text-"+ colorClass);});$(document).on("click touchstart",".add-event",function(e){if(typeof colorClass==='undefined'){colorClass="color";}
var newEvent=$(".new-event").val(),markup=$("<div class=\"external-event label label-"+ colorClass+"\" data-class=\"bg-"+ colorClass+"\">"+ newEvent+"</div>");if(newEvent!==""){$(".external-events").append(markup);externalEvents(markup);$(".new-event").val("");}
e.preventDefault();e.stopPropagation();});}
function buttons(){$("#calendar-day > span").html($(".fc-agendaDay-button").html());$("#calendar-week > span").html($(".fc-agendaWeek-button").html());$("#calendar-month > span").html($(".fc-month-button").html());$("#calendar-today").html($(".fc-today-button").html());$("#calendar-prev").html($(".fc-prev-button").html());$("#calendar-next").html($(".fc-next-button").html());$(document).on("click touchstart","#calendar-day",function(e){e.preventDefault();$('#calendar').fullCalendar('changeView','agendaDay');});$(document).on("click touchstart","#calendar-week",function(e){e.preventDefault();$('#calendar').fullCalendar('changeView','agendaWeek');});$(document).on("click touchstart","#calendar-month",function(e){e.preventDefault();$('#calendar').fullCalendar('changeView','month');});$(document).on("click touchstart","#calendar-today",function(e){e.preventDefault();$('#calendar').fullCalendar('today');updateDate();});$(document).on("click touchstart","#calendar-prev",function(e){e.preventDefault();$('#calendar').fullCalendar('prev');updateDate();});$(document).on("click touchstart","#calendar-next",function(e){e.preventDefault();$('#calendar').fullCalendar('next');updateDate();});}
function updateDate(){var moment=$('#calendar').fullCalendar('getDate');$(".week-day").html(moment.format("dddd"));$(".current-date").html(moment.format("MMM Do [<b>] YYYY [</b>]"));}
function externalEvents(elm){var eventObject={title:$.trim(elm.text()),className:elm.data("class")};elm.data('eventObject',eventObject);elm.draggable({zIndex:999,revert:true,revertDuration:0});}
function initCalendarEvents(){$('#external-events div.external-event').each(function(){externalEvents($(this));});}
function initCalendar(){$('#calendar').fullCalendar({header:{left:'prev,next',center:'title',right:'today,month,agendaWeek,agendaDay'},buttonIcons:{prev:' ti-arrow-circle-left',next:' ti-arrow-circle-right'},editable:true,droppable:true,drop:function(date){var originalEventObject=$(this).data('eventObject');var copiedEventObject=$.extend({},originalEventObject);copiedEventObject.start=date;$('#calendar').fullCalendar('renderEvent',copiedEventObject,true);if($('#drop-remove').is(':checked')){$(this).remove();}},defaultDate:'2014-06-12',events:[{title:'All Day Event',start:'2014-06-01',className:'bg-danger'},{title:'Long Event',start:'2014-06-07',end:'2014-06-10',className:'bg-primary'},{id:999,title:'Repeating Event',start:'2014-06-09T16:00:00',className:'bg-success'},{id:999,title:'Repeating Event',start:'2014-06-16T16:00:00',className:'bg-info'},{title:'Meeting',start:'2014-06-12T10:30:00',end:'2014-06-12T12:30:00',className:'bg-info'},{title:'Lunch',start:'2014-06-12T12:00:00',className:'bg-warning'},{title:'Birthday Party',start:'2014-06-13T07:00:00',className:'bg-info'},{title:'Click for Google',url:'http://google.com/',start:'2014-06-28',className:'bg-danger'}]});}
return{init:function(){events();initCalendarEvents();initCalendar();buttons();updateDate();}};}();$(function(){"use strict";fullcalendar.init();});