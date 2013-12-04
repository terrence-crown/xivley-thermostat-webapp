
//
// thermostat2.js
//

xively.setKey( "mxm3GBezE59gdShZhINyUgBw8XjbWonovuWZOSOInuzINOqr" );

var feedID = 1232456447;

var thermostat = new Object();

var temperatureLastUpdate = new Date().getTime();
var uptimeLastUpdate = temperatureLastUpdate;

function publishMode( value )
{
   thermostat.modeUI = value;
   uiSetModeStatus( 1 );
   var data = {"version":"1.0.0","datastreams":[{"id":"mode","current_value": value }]};
   xively.feed.update( feedID, data );
   thermostat.tm1 = setTimeout( function()
   {
     if( thermostat.modeUI != thermostat.mode2 )
     {
       uiSetModeStatus( 2 );
     }
   }, 5000 );
 }

 function publishSetPoint( value )
 {
   var data = {"version":"1.0.0","datastreams":[{"id":"setPoint","current_value": value }]};
   xively.feed.update( feedID, data );
 }

 function startTime()
 {
   var today = new Date();
   var h = today.getHours();
   var m = today.getMinutes();
   var s = today.getSeconds();
   // add a zero in front of numbers<10
   m = checkTime( m );
   s = checkTime( s );
   //thermostat.timeStr = h + ":" + m + ":" + s;
   uiSetTime( h + ":" + m + ":" + s );

   var time = today.getTime();

   var age = Math.round( (time - temperatureLastUpdate)/1000 );
   uiSetTemperatureAge( age );

   age = Math.round( (time - uptimeLastUpdate)/1000 );
   uiSetUptimeAge( age );

   t = setTimeout( function() { startTime() }, 1000 );
 }

 function checkTime(i)
 {
   if( i < 10 )
   {
     i="0" + i;
   }
   return i;
 }

 // Make sure the document is ready to be handled
 $(document).ready( function($)
 {
   xively.datastream.get( feedID, "mode", function ( datastream )
   {
      thermostat.mode = datastream["current_value"];
      uiSetModeWidget( datastream["current_value"] );
      uiSetModeXively( datastream["current_value"] );
      xively.datastream.subscribe( feedID, "mode", function ( event , datastream_updated )
      {
        thermostat.mode = datastream_updated["current_value"];
        uiSetModeWidget( datastream_updated["current_value"] );
        uiSetModeXively( datastream_updated["current_value"] );
      });
   });

   xively.datastream.get( feedID, "mode2", function ( datastream )
   {
      thermostat.mode2 = datastream["current_value"];
      uiSetModeDevice( datastream["current_value"] );
      xively.datastream.subscribe( feedID, "mode2", function ( event , datastream_updated )
      {
        thermostat.mode2 = datastream_updated["current_value"];
        uiSetModeDevice( datastream_updated["current_value"] );
        clearTimeout( thermostat.tm1 );
        if( thermostat.modeUI == thermostat.mode && thermostat.modeUI == thermostat.mode2 )
        {
          uiSetModeStatus( 0 );
        }
        else
        {
          uiSetModeStatus( 2 );
        }
      });
   });

   xively.datastream.get( feedID, "setPoint", function ( datastream )
   {
      uiSetSetPointWidget( datastream["current_value"] );
      uiSetSetPointXively( datastream["current_value"] );
      xively.datastream.subscribe( feedID, "setPoint", function ( event , datastream_updated )
      {
        uiSetSetPointXively( datastream_updated["current_value"] );
      });
   });

   xively.datastream.get( feedID, "setPoint2", function ( datastream )
   {
      uiSetSetPointDevice( datastream["current_value"] );
      xively.datastream.subscribe( feedID, "setPoint2", function ( event , datastream_updated )
      {
        uiSetSetPointDevice( datastream_updated["current_value"] );
      });
   });

   xively.datastream.get( feedID, "temp", function ( datastream )
   {
      uiSetTemperature( datastream["current_value"] );
      xively.datastream.subscribe( feedID, "temp", function ( event , datastream_updated )
      {
        uiSetTemperature( datastream_updated["current_value"] );
        temperatureLastUpdate = new Date().getTime();
      });
   });

   xively.datastream.get( feedID, "heating", function ( datastream )
   {
      uiSetHeating( datastream["current_value"] );
      xively.datastream.subscribe( feedID, "heating", function ( event , datastream_updated )
      {
        uiSetHeating( datastream_updated["current_value"] );
      });
   });

   xively.datastream.get( feedID, "uptime", function ( datastream )
   {
      uiSetUptime( datastream["current_value"] );
      xively.datastream.subscribe( feedID, "uptime", function ( event , datastream_updated )
      {
        uiSetUptime( datastream_updated["current_value"] );
        uptimeLastUpdate = new Date().getTime();
      });
   });


   startTime();

 });

