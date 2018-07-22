function trim( val ) {
    'use strict';
    if ( typeof String.prototype.trim === 'function' ) {
        return String(val).trim();
    } else {
        return String(val).replace( /^\s+|\s+$/g, '' );
    }
}

function addEvent( obj, type, fn ) {
    'use strict';
    if (obj.attachEvent) {
        obj['e' + type + fn] = fn;
        obj[type + fn] = function () {
            obj['e' + type + fn](window.event);
        };
        obj.attachEvent( 'on' + type, obj[type + fn] );
    } else {
        obj.addEventListener( type, fn, false );
    }
}

function removeEvent( obj, type, fn ) {
    'use strict';
	if ( obj.detachEvent ) {
		obj.detachEvent( 'on' + type, obj[type + fn] );
		obj[type + fn] = null;
	} else {
		obj.removeEventListener( type, fn, false );
	}
}

function isEmpty( obj ) {
    'use strict';
    var count = 0;
    obj = obj || {};
    for ( var prop in obj ) {
        if ( {}.hasOwnProperty.call(obj, prop) ) {
            count += 1;
        }
    }

    return ( count === 0 ) ? true : false;
}
