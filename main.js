function validateForm(e) {
    'use strict';
    var submitForm = false;
    var formItems = {};

    formItems['fullname'] = {
        required: true, name: 'Full Name', min: 3,
        max: 50, expected: 'string', pattern: /^([a-z ]|[^\d.\-])+$/i
    };
    formItems['date_of_birth'] = {
        required: true, name: 'Date of Birth', expected: 'string', date: true
    };
    formItems['age'] = {
        required: true, name: 'Age', min: 1,
        max: 120, expected: 'integer', pattern: /^(-?[0-9]+)$/
    };
    formItems['height'] = {
        required: true, name: 'Height', min: 1,
        max: 12, expected: 'integer', pattern: /^(-?[0-9]+\.[0-9]+)$/
    };
    formItems['email'] = {
        required: true, name: 'Email', email: true
    };
    formItems['password'] = {
        required: true, name: 'Password', min: 8, expected: 'string'
    };
    formItems['rpt_password'] = {
        required: true, name: 'Confirm Password', matches: 'password'
    };
    formItems['message'] = {
        required: true, name: 'Message'
    };
    formItems['photo'] = {
        required: true, name: 'Photo', permitted: [ 'jpg', 'png' ]
    };
    formItems['gender'] = {
        required: true, name: 'Gender', expected: 'string'
    };
    formItems['color[]'] = {
        required: true, name: 'Color(s)', min: 2
    };
    formItems['country'] = {
        required: true, name: 'Country'
    };

    e = e || window.event;
    var targetForm = e.target || e.srcElement;

    var validation = new Validation( formItems );
    validation = validation.check( targetForm );

    if ( document.getElementById('list') ) {
        var list = document.getElementById('list');
        list.parentNode.removeChild( list );
        var formElements = targetForm.getElementsByTagName('*');
        formElements = [].slice.call(formElements);
        formElements.forEach(function(val){
            if ( !(val instanceof RadioNodeList) ) { 
                val.classList.remove('border-warning');
            }
        });
    }

    if ( validation.passed() ) {
        var data = validation.getData();
        console.log( JSON.stringify(data) );
    } else {
        var errors = validation.getErrors();
        if ( !(isEmpty(errors)) ) {
            var ul = document.createElement( 'ul' );
            ul.setAttribute( 'id', 'list' );
            ul.setAttribute( 'class', 'error' );
            var li;
            for ( var error in errors ) {
                if ( {}.hasOwnProperty.call( errors, error ) ) {
                    li = document.createElement('li');
                    li.appendChild( document.createTextNode(errors[error]) );
                    ul.appendChild( li );
                    if ( !(targetForm[error] instanceof RadioNodeList) ) { 
                        targetForm[error].classList.add('border-warning');
                    }
                }
            }
            targetForm.parentNode.insertBefore( ul, targetForm );
        }
    }

    // Prevent the form's submission:
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }

    return submitForm;
}

addEvent( window, 'load', function(){
    'use strict';

    var form = document.getElementById( 'test-form' );
    if ( !(form) ) { return; }

    addEvent( form, 'submit', validateForm );
});
